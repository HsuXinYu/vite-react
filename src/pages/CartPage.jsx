import { useState, useEffect } from 'react'
import axios from 'axios'

const API_BASE = import.meta.env.VITE_API_BASE
const API_PATH = import.meta.env.VITE_API_PATH

function Cart() {
  const [carts, setCarts] = useState([])
  const [total, setTotal] = useState(0)
  const [finalTotal, setFinalTotal] = useState(0)

  useEffect(() => {
    console.log('Cart')
    getCart()
  }, [])

  // 取得購物車資訊
  async function getCart() {
    try {
      const res = await axios.get(`${API_BASE}/api/${API_PATH}/cart`)
      console.log(res)
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
        </div>
      </div>
    </>
  )
}

export default Cart
