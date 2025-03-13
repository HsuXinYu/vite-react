import { useState, useEffect } from 'react'
import axios from 'axios'
import { useForm } from 'react-hook-form'

const API_BASE = import.meta.env.VITE_API_BASE
const API_PATH = import.meta.env.VITE_API_PATH

function Cart() {
  const [carts, setCarts] = useState([])
  const [total, setTotal] = useState(0)
  const [finalTotal, setFinalTotal] = useState(0)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ mode: 'onBlur' })

  useEffect(() => {
    getCart()
  }, [])

  // 取得購物車資訊
  async function getCart() {
    try {
      const res = await axios.get(`${API_BASE}/api/${API_PATH}/cart`)
      setCarts(res.data.data.carts)
      setTotal(res.data.data.total)
      setFinalTotal(res.data.data.final_total)
    } catch (err) {
      console.log(err)
    }
  }

  // 刪除購物車單一品項
  async function deleteCartItem(cartId) {
    try {
      const res = await axios.delete(
        `${API_BASE}/api/${API_PATH}/cart/${cartId}`
      )
      // console.log(res)
      alert(res.data.message)
      getCart()
    } catch (err) {
      console.log(err)
      alert('刪除購物車失敗')
    }
  }

  // 刪除購物車所有品項
  async function deleteAllCartItem() {
    try {
      const res = await axios.delete(`${API_BASE}/api/${API_PATH}/carts`)
      // console.log(res)
      alert(res.data.message)
      getCart()
    } catch (err) {
      console.log(err)
      alert('刪除購物車失敗')
    }
  }

  // 調整購物車數量
  async function updateCartItemQty(cartId, productId, qty) {
    // console.log(cartId, productId, qty)
    try {
      const res = await axios.put(
        `${API_BASE}/api/${API_PATH}/cart/${cartId}`,
        {
          data: { product_id: productId, qty },
        }
      )
      // console.log(res)
      alert(res.data.message)
      getCart()
    } catch (err) {
      console.log(err)
      alert('更新購物車失敗')
    }
  }

  // 提交結帳表單
  async function onSubmit(formData) {
    console.log(formData)
    try {
      const res = await axios.post(`${API_BASE}/api/${API_PATH}/order`, {
        data: {
          user: {
            name: formData.name,
            email: formData.email,
            tel: formData.tel,
            address: formData.address,
          },
          message: formData.message,
        },
      })
      alert(res.data.message)
      getCart()
      reset()
    } catch {
      // console.log(err)
      alert('結帳失敗')
    }
  }

  return (
    <>
      <div className='container'>
        <div className='mt-4'>
          {/* 購物車列表 */}
          {carts.length > 0 ? (
            <>
              <div className='text-end'>
                <button
                  className='btn btn-outline-danger'
                  type='button'
                  onClick={deleteAllCartItem}
                >
                  清空購物車
                </button>
              </div>
              <table className='table align-middle'>
                <thead>
                  <tr>
                    <th></th>
                    <th>品名</th>
                    <th style={{ width: '150px' }}>數量/單位</th>
                    <th>單價</th>
                  </tr>
                </thead>
                <tbody>
                  {carts.map((cart) => {
                    return (
                      <tr key={cart.product.id}>
                        <td>
                          <button
                            type='button'
                            className='btn btn-outline-danger btn-sm'
                            onClick={() => deleteCartItem(cart.id)}
                          >
                            <i className='fas fa-trash-alt'> X </i>
                          </button>
                        </td>
                        <td>{cart.product.title}</td>
                        <td>
                          <button
                            type='button'
                            className='btn btn-outline-dark btn-sm'
                            onClick={() =>
                              updateCartItemQty(
                                cart.id,
                                cart.product.id,
                                cart.qty - 1
                              )
                            }
                            {...(cart.qty === 1 ? { disabled: true } : {})}
                          >
                            <i className='fas fa-trash-alt'> - </i>
                          </button>
                          <span style={{ margin: '10px' }}>{cart.qty}</span>
                          <button
                            type='button'
                            className='btn btn-outline-dark btn-sm'
                            onClick={() =>
                              updateCartItemQty(
                                cart.id,
                                cart.product.id,
                                cart.qty + 1
                              )
                            }
                          >
                            <i className='fas fa-trash-alt'> + </i>
                          </button>
                          <span className='btn'> {cart.product.unit} </span>
                        </td>
                        <td>{cart.product.price}</td>
                      </tr>
                    )
                  })}
                </tbody>
                <tfoot>
                  <tr>
                    <td colSpan='3' className='text-end'>
                      總計
                    </td>
                    <td className='text-end'>{total}</td>
                  </tr>
                  <tr>
                    <td colSpan='3' className='text-end text-success'>
                      折扣價
                    </td>
                    <td className='text-end text-success'>{finalTotal}</td>
                  </tr>
                </tfoot>
              </table>
            </>
          ) : (
            <h3>購物車是空的</h3>
          )}
          {/* 購物車列表 */}
          {/* 結帳表單 */}
          <div className='my-5 row justify-content-center'>
            <form
              className='col-md-6'
              action=''
              onSubmit={handleSubmit(onSubmit)}
            >
              <div className='mb-3'>
                <label htmlFor='email' className='form-label'>
                  Email
                </label>
                <input
                  id='email'
                  name='Email'
                  type='email'
                  className={`form-control ${errors.email && 'is-invalid'}`}
                  placeholder='請輸入 Email'
                  {...register('email', {
                    required: { value: true, message: 'Email 欄位為必填' },
                    pattern: {
                      value: /^\S+@\S+$/i,
                      message: 'Email 格式不正確',
                    },
                  })}
                />
                {errors.email && (
                  <div className='invalid-feedback'>
                    {errors?.email?.message}
                  </div>
                )}
              </div>
              <div className='mb-3'>
                <label htmlFor='name' className='form-label'>
                  收件人姓名
                </label>
                <input
                  id='name'
                  name='姓名'
                  type='text'
                  className={`form-control ${errors.name && 'is-invalid'}`}
                  placeholder='請輸入姓名'
                  {...register('name', {
                    required: { value: true, message: '姓名 欄位為必填' },
                  })}
                />
                {errors.name && (
                  <div className='invalid-feedback'>
                    {errors?.name?.message}
                  </div>
                )}
              </div>
              <div className='mb-3'>
                <label htmlFor='tel' className='form-label'>
                  收件人電話
                </label>
                <input
                  id='tel'
                  name='電話'
                  type='tel'
                  className={`form-control ${errors.tel && 'is-invalid'}`}
                  placeholder='請輸入電話'
                  {...register('tel', {
                    required: { value: true, message: '電話 欄位為必填' },
                    pattern: {
                      value: /^(0[2-8]\d{7,8}|09\d{8})$/,
                      message: '電話 格式不正確',
                    },
                  })}
                />
                {errors.tel && (
                  <div className='invalid-feedback'>{errors?.tel?.message}</div>
                )}
              </div>
              <div className='mb-3'>
                <label htmlFor='address' className='form-label'>
                  收件人地址
                </label>
                <input
                  id='address'
                  name='地址'
                  type='text'
                  className={`form-control ${errors.address && 'is-invalid'}`}
                  placeholder='請輸入地址'
                  {...register('address', {
                    required: { value: true, message: '地址 欄位為必填' },
                  })}
                />
                {errors.address && (
                  <div className='invalid-feedback'>
                    {errors?.address?.message}
                  </div>
                )}
              </div>
              <div className='mb-3'>
                <label htmlFor='message' className='form-label'>
                  留言
                </label>
                <textarea
                  id='message'
                  className='form-control'
                  cols='30'
                  rows='10'
                  {...register('message')}
                ></textarea>
              </div>
              <div className='text-end'>
                <button
                  type='submit'
                  className='btn btn-danger'
                  {...(carts.length === 0 ? { disabled: true } : {})}
                >
                  送出訂單
                </button>
              </div>
            </form>
          </div>
          {/* 結帳表單 */}
        </div>
      </div>
    </>
  )
}

export default Cart
