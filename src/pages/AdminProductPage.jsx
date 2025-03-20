import { useState, useEffect, useRef } from 'react'
import axios from 'axios'

import * as bootstrap from 'bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'

import Pagination from '../components/Pagination'
import PostProductModal from '../components/PostProductModal'

const API_BASE = import.meta.env.VITE_API_BASE
const API_PATH = import.meta.env.VITE_API_PATH

function AdminProduct() {
  const [pagination, setPagination] = useState({})
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
    is_enabled: false,
    imageUrl: '',
    imagesUrl: [],
  })
  const postProductModalRef = useRef(null)
  const [modalType, setModalType] = useState('')

  useEffect(() => {
    const token = document.cookie.replace(
      /(?:(?:^|.*;\s*)hexToken\s*=\s*([^;]*).*$)|^.*$/,
      '$1'
    )
    axios.defaults.headers.common.Authorization = token

    postProductModalRef.current = new bootstrap.Modal('#postProductModal', {
      keyboard: false,
    })

    document
      .querySelector('#postProductModal')
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
      getProduct()
    } catch (err) {
      console.log(err)
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
      is_enabled: product.is_enabled || false,
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
      } catch (err) {
        console.log(err)
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
      } catch (err) {
        console.log(err)
      }
    }
    closeModal()
    getProduct()
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
                          onClick={() => openModal(product)}
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
      <PostProductModal
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

export default AdminProduct
