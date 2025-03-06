import { useState, useEffect, useRef } from 'react'
import axios from 'axios'

import * as bootstrap from 'bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'

// import Pagination from './components/Pagination'

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
  const [carts, setCarts] = useState([])
  const [total, setTotal] = useState(0)
  const [finalTotal, setFinalTotal] = useState(0)

  const productModalRef = useRef(null)

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
      console.log(res)
      setCarts(res.data.data.carts)
      setTotal(res.data.data.total)
      setFinalTotal(res.data.data.final_total)
    } catch (err) {
      console.log(err)
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

  // 加入購物車
  async function addToCart(id, qty) {
    try {
      const res = await axios.post(`${API_BASE}/api/${API_PATH}/cart`, {
        data: { product_id: id, qty },
      })
      console.log(res)
    } catch (err) {
      console.log(err)
    }
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
              tabindex='-1'
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
                            <input
                              type='number'
                              className='form-control'
                              min='1'
                              v-model='qty'
                            />
                            <button
                              type='button'
                              className='btn btn-primary'

                              // onClick.prevent="addToCart(templateData.id, qty)"
                            >
                              加入購物車
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
                            加到購物車
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
            <div className='text-end'>
              <button className='btn btn-outline-danger' type='button'>
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
                        <button className='btn btn-outline-danger btn-sm'>
                          <i className='fas fa-trash-alt'> X </i>
                        </button>
                      </td>
                      <td>{cart.product.title}</td>
                      <td>
                        {cart.qty} {cart.product.unit}
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
            {/* 購物車列表 */}
          </div>
          {/* 結帳表單 */}
          <div className='my-5 row justify-content-center'>
            <form className='col-md-6'>
              <div className='mb-3'>
                <label htmlFor='email' className='form-label'>
                  Email
                </label>
                <input
                  id='email'
                  name='email'
                  type='email'
                  className='form-control'
                  placeholder='請輸入 Email'
                />
              </div>

              <div className='mb-3'>
                <label htmlFor='name' className='form-label'>
                  收件人姓名
                </label>
                <input
                  id='name'
                  name='姓名'
                  type='text'
                  className='form-control'
                  placeholder='請輸入姓名'
                />
              </div>

              <div className='mb-3'>
                <label htmlFor='tel' className='form-label'>
                  收件人電話
                </label>
                <input
                  id='tel'
                  name='電話'
                  type='text'
                  className='form-control'
                  placeholder='請輸入電話'
                />
              </div>

              <div className='mb-3'>
                <label htmlFor='address' className='form-label'>
                  收件人地址
                </label>
                <input
                  id='address'
                  name='地址'
                  type='text'
                  className='form-control'
                  placeholder='請輸入地址'
                />
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
                ></textarea>
              </div>
              <div className='text-end'>
                <button type='submit' className='btn btn-danger'>
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
