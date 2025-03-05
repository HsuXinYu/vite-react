import { useState, useEffect, useRef } from 'react'
import axios from 'axios'

import * as bootstrap from 'bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'

import Pagination from './components/Pagination'
import Modal from './components/Modal'

const API_BASE = 'https://ec-course-api.hexschool.io/v2'
const API_PATH = 'galactic_whispers'

function App() {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  })
  const [isAuth, setIsAuth] = useState(false)
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
  const [pagination, setPagination] = useState({})
  const [modalType, setModalType] = useState('')
  const productModalRef = useRef(null)

  useEffect(() => {
    const token = document.cookie.replace(
      /(?:(?:^|.*;\s*)hexToken\s*=\s*([^;]*).*$)|^.*$/,
      '$1'
    )
    axios.defaults.headers.common.Authorization = token

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

    checkAdmin()
  }, [])

  // 檢查是否已登入
  async function checkAdmin() {
    try {
      await axios.post(`${API_BASE}/api/user/check`)
      setIsAuth(true)
      getProduct()
    } catch (err) {
      console.log(err)
    }
  }

  // 登入頁面輸入框處理
  function handleInput(e) {
    const { id, value } = e.target

    setFormData({
      ...formData,
      [id]: value,
    })
  }

  // 驗證登入帳密
  async function handleSubmit(e) {
    e.preventDefault()

    try {
      const res = await axios.post(`${API_BASE}/admin/signin`, formData)
      const { token, expired } = res.data

      document.cookie = `hexToken=${token};expires=${new Date(expired)};`
      axios.defaults.headers.common.Authorization = `${token}`

      setIsAuth(true)
      getProduct()
    } catch (err) {
      console.error(err)
      alert('使用者信箱或密碼有誤!')
    }
  }

  // 打開modal
  function openModal(product, type) {
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

    setModalType(type)
    productModalRef.current.show()
  }
  // 關閉modal
  function closeModal() {
    productModalRef.current.hide()
  }

  // modal頁面輸入框處理
  function handleModalInput(e) {
    const { id, value, type, checked } = e.target
    setTemplateData((prevData) => {
      return {
        ...prevData,
        [id]: type === 'checkbox' ? checked : value,
      }
    })
  }

  function handleImageChange(index, value) {
    setTemplateData((prevData) => {
      const newImages = [...prevData.imagesUrl]
      newImages[index] = value

      if (
        value !== '' &&
        index === newImages.length - 1 &&
        newImages.length < 5
      ) {
        newImages.push('')
      }

      if (newImages.length > 1 && newImages[newImages.length - 1] === '') {
        newImages.pop()
      }

      return { ...prevData, imagesUrl: newImages }
    })
  }

  function handleAddImage() {
    setTemplateData((prevData) => ({
      ...prevData,
      imagesUrl: [...prevData.imagesUrl, ''],
    }))
  }

  function handleRemoveImage() {
    setTemplateData((prevData) => {
      const newImages = [...prevData.imagesUrl]
      newImages.pop()
      return { ...prevData, imagesUrl: newImages }
    })
  }

  // 取得產品資訊
  async function getProduct(page = 1) {
    try {
      const res = await axios.get(
        `${API_BASE}/api/${API_PATH}/admin/products?page=${page}`
      )
      setProducts(res.data.products)
      setPagination(res.data.pagination)
      // console.log(res.data.pagination);
    } catch (err) {
      console.log(err)
    }
  }

  // 新增、修改產品資訊
  async function updateProduct() {
    if (modalType === 'add') {
      try {
        const productData = {
          data: {
            ...templateData,
            origin_price: Number(templateData.origin_price),
            price: Number(templateData.price),
            is_enabled: templateData.is_enabled ? 1 : 0,
          },
        }
        // console.log(productData);

        const res = await axios.post(
          `${API_BASE}/api/${API_PATH}/admin/product`,
          productData
        )
        alert(res.data.message)
        closeModal()
        getProduct()
      } catch (err) {
        alert(err.response.data.message)
      }
    } else if (modalType === 'edit') {
      try {
        const productData = {
          data: {
            ...templateData,
            origin_price: Number(templateData.origin_price),
            price: Number(templateData.price),
            is_enabled: templateData.is_enabled ? 1 : 0,
          },
        }
        // console.log(productData);

        const res = await axios.put(
          `${API_BASE}/api/${API_PATH}/admin/product/${templateData.id}`,
          productData
        )
        alert(res.data.message)
        closeModal()
        getProduct()
      } catch (err) {
        alert(err.response.data.message)
      }
    }
  }

  // 刪除產品資訊
  async function deleteProduct(productId) {
    try {
      console.log(productId)

      const res = await axios.delete(
        `${API_BASE}/api/${API_PATH}/admin/product/${productId}`
      )
      alert(res.data.message)
    } catch (err) {
      console.log(err)
    }
    closeModal()
    getProduct()
  }

  return (
    <>
      {isAuth ? (
        <div>
          <div className='container'>
            <div className='text-end mt-4'>
              <button
                className='btn btn-primary'
                onClick={() => openModal({}, 'add')}
              >
                建立新的產品
              </button>
            </div>
            <table className='table mt-4'>
              <thead>
                <tr>
                  <th width='120'>分類</th>
                  <th>產品名稱</th>
                  <th width='120'>原價</th>
                  <th width='120'>售價</th>
                  <th width='100'>是否啟用</th>
                  <th width='120'>編輯</th>
                </tr>
              </thead>
              <tbody>
                {products && products.length > 0 ? (
                  products.map((product) => (
                    <tr key={product.id}>
                      <td>{product.category}</td>
                      <td>{product.title}</td>
                      <td className='text-end'>{product.origin_price}</td>
                      <td className='text-end'>{product.price}</td>
                      <td>
                        {product.is_enabled ? (
                          <span className='text-success'>啟用</span>
                        ) : (
                          <span>未啟用</span>
                        )}
                      </td>
                      <td>
                        <div className='btn-group'>
                          <button
                            type='button'
                            className='btn btn-outline-primary btn-sm'
                            onClick={() => openModal(product, 'edit')}
                          >
                            編輯
                          </button>
                          <button
                            type='button'
                            className='btn btn-outline-danger btn-sm'
                            onClick={() => deleteProduct(product.id)}
                          >
                            刪除
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan='5'>尚無產品資料</td>
                  </tr>
                )}
              </tbody>
            </table>
            <Pagination pagination={pagination} changePage={getProduct} />
          </div>
        </div>
      ) : (
        <div className='container login'>
          <div className='row justify-content-center'>
            <h1 className='h3 mb-3 font-weight-normal'>請先登入</h1>
            <div className='col-8'>
              <form id='form' className='form-signin' onSubmit={handleSubmit}>
                <div className='form-floating mb-3'>
                  <input
                    type='email'
                    className='form-control'
                    id='username'
                    placeholder='name@example.com'
                    value={formData.username}
                    onChange={handleInput}
                    required
                    autoFocus
                  />
                  <label htmlFor='username'>Email address</label>
                </div>
                <div className='form-floating'>
                  <input
                    type='password'
                    className='form-control'
                    id='password'
                    placeholder='Password'
                    value={formData.password}
                    onChange={handleInput}
                    required
                  />
                  <label htmlFor='password'>Password</label>
                </div>
                <button
                  className='btn btn-lg btn-primary w-100 mt-3'
                  type='submit'
                >
                  登入
                </button>
              </form>
            </div>
          </div>
          <p className='mt-5 mb-3 text-muted'>&copy; 2024~∞ - 六角學院</p>
        </div>
      )}
      <Modal
        templateData={templateData}
        handleModalInput={handleModalInput}
        handleImageChange={handleImageChange}
        handleAddImage={handleAddImage}
        handleRemoveImage={handleRemoveImage}
        updateProduct={updateProduct}
        closeModal={closeModal}
      />
    </>
  )
}

export default App
