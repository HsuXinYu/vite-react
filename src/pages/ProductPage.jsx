import { useState, useEffect, useRef } from 'react'
import axios from 'axios'

import * as bootstrap from 'bootstrap'
import ReactLoading from 'react-loading'

const API_BASE = import.meta.env.VITE_API_BASE
const API_PATH = import.meta.env.VITE_API_PATH

function Product() {
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
  const [isLoading, setIsLoading] = useState(0)

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
    } catch (err) {
      console.log(err)
      alert('加入購物車失敗')
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
        </div>
      </div>
    </>
  )
}

export default Product
