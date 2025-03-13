import { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import { useForm } from 'react-hook-form'

import * as bootstrap from 'bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'
import ReactLoading from 'react-loading'

const API_BASE = 'https://ec-course-api.hexschool.io/v2'
const API_PATH = 'galactic_whispers'

function App() {
  const [products, setProducts] = useState([])
  const [templateData, setTemplateData] = useState({
    id: '',
    title: '',
    category: '',
    origin_price: '',
    price: '',
    unit: '',
    description: '',
    content: '',
    is_enabled: 0,
    imageUrl: '',
    imagesUrl: [],
  })
  const [qty, setQty] = useState(1)
  const [carts, setCarts] = useState([])
  const [total, setTotal] = useState(0)
  const [finalTotal, setFinalTotal] = useState(0)
  const [isLoading, setIsLoading] = useState(0)

  const productModalRef = useRef(null)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ mode: 'onBlur' })

  useEffect(() => {
    productModalRef.current = new bootstrap.Modal('#productModal', {
      keyboard: false,
    })

    document
      .querySelector('#productModal')
      .addEventListener('hide.bs.modal', () => {
        if (document.activeElement instanceof HTMLElement) {
          document.activeElement.blur()
        }
      })

    getProduct()
    getCart()
  }, [])

  // 取得產品資訊
  async function getProduct() {
    try {
      const res = await axios.get(`${API_BASE}/api/${API_PATH}/products`)
      // console.log(res)
      setProducts(res.data.products)
    } catch (err) {
      console.log(err)
    }
  }

  // 取得購物車資訊
  async function getCart() {
    try {
      const res = await axios.get(`${API_BASE}/api/${API_PATH}/cart`)
      // console.log(res)
      setCarts(res.data.data.carts)
      setTotal(res.data.data.total)
      setFinalTotal(res.data.data.final_total)
    } catch (err) {
      console.log(err)
    }
  }

  // 加入購物車
  async function addToCart(productId, qty) {
    // console.log(typeof qty, qty)
    setIsLoading(1)
    try {
      const res = await axios.post(`${API_BASE}/api/${API_PATH}/cart`, {
        data: { product_id: productId, qty },
      })
      // console.log(res)
      alert(res.data.message)
      setQty(1)
      closeModal()
      setIsLoading(0)
      getCart()
    } catch (err) {
      console.log(err)
      alert('加入購物車失敗')
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

  // 打開modal
  function openModal(product) {
    setTemplateData({
      id: product.id || '',
      imageUrl: product.imageUrl || '',
      title: product.title || '',
      category: product.category || '',
      unit: product.unit || '',
      origin_price: product.origin_price || '',
      price: product.price || '',
      description: product.description || '',
      content: product.content || '',
      is_enabled: product.is_enabled || 0,
      imagesUrl: product.imagesUrl || [],
    })

    productModalRef.current.show()
  }

  // 關閉modal
  function closeModal() {
    productModalRef.current.hide()
  }

  return (
    <>
      <div id='app'>
        <div className='container'>
          <div className='mt-4'>
            {/* 產品Modal */}
            <div
              id='productModal'
              className='modal fade'
              tabIndex='-1'
              role='dialog'
              aria-labelledby='exampleModalLabel'
              aria-hidden='true'
              ref={productModalRef}
            >
              <div className='modal-dialog modal-xl' role='document'>
                <div className='modal-content border-0'>
                  <div className='modal-header bg-dark text-white'>
                    <h5 className='modal-title' id='exampleModalLabel'>
                      <span>{templateData.title}</span>
                    </h5>
                    <button
                      type='button'
                      className='btn-close'
                      data-bs-dismiss='modal'
                      aria-label='Close'
                      onClick={closeModal}
                    ></button>
                  </div>
                  <div className='modal-body'>
                    <div className='row'>
                      <div className='col-sm-6'>
                        <img
                          className='img-fluid'
                          src={templateData.imageUrl}
                          alt='主圖'
                        />
                      </div>
                      <div className='col-sm-6'>
                        <span className='badge bg-primary rounded-pill'>
                          {templateData.category}
                        </span>
                        <p>商品描述：{templateData.description}</p>
                        <p>商品內容：{templateData.content}</p>
                        <del className='h6'>
                          原價：{templateData.origin_price} 元
                        </del>
                        <div className='h5'>特價：{templateData.price} 元</div>
                        <div>
                          <div className='input-group'>
                            <select
                              className='form-control'
                              name='qty'
                              id='qty'
                              value={qty}
                              onChange={(e) => {
                                setQty(Number(e.target.value))
                              }}
                            >
                              {[...Array(10).keys()].map((item) => {
                                return (
                                  <option key={item} value={item + 1}>
                                    {item + 1}
                                  </option>
                                )
                              })}
                            </select>
                            <button
                              type='button'
                              className='btn btn-primary'
                              onClick={() => {
                                addToCart(templateData.id, qty)
                              }}
                            >
                              {isLoading === 1 ? (
                                <ReactLoading
                                  type='spin'
                                  color='blue'
                                  height={20}
                                  width={20}
                                />
                              ) : (
                                '加入購物車'
                              )}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* 產品Modal */}
            {/* 產品列表 */}
            <table className='table align-middle'>
              <thead>
                <tr>
                  <th>圖片</th>
                  <th>商品名稱</th>
                  <th>價格</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => {
                  return (
                    <tr key={product.id}>
                      <td style={{ width: '200px' }}>
                        <div
                          style={{
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                          }}
                        >
                          <img
                            src={product.imageUrl}
                            alt='主圖'
                            className='img-fluid'
                          />
                        </div>
                      </td>
                      <td>{product.title}</td>
                      <td>
                        <del className='h6'>原價：{product.origin_price}</del>
                        <div className='h5'>特價：{product.price}</div>
                      </td>
                      <td>
                        <div className='btn-group btn-group-sm'>
                          <button
                            type='button'
                            className='btn btn-outline-secondary'
                            onClick={() => openModal(product)}
                          >
                            <i className='fas fa-spinner fa-pulse'></i>
                            查看更多
                          </button>
                          <button
                            type='button'
                            className='btn btn-outline-danger'
                            onClick={() => {
                              addToCart(product.id, 1)
                            }}
                          >
                            <i className='fas fa-spinner fa-pulse'></i>
                            <span>
                              {isLoading === 1 ? (
                                <ReactLoading
                                  type='spin'
                                  color='red'
                                  height={20}
                                  width={20}
                                />
                              ) : (
                                '加入購物車'
                              )}
                            </span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
            {/* 產品列表 */}
            {/* 購物車列表 */}
            {carts.length > 0 && (
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
            )}
            {/* 購物車列表 */}
          </div>
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

export default App
