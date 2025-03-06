import { useRef } from 'react'
import PropTypes from 'prop-types'

import * as bootstrap from 'bootstrap'

function PostProductModal({
  templateData,
  handleModalInput,
  handleImageChange,
  handleAddImage,
  handleRemoveImage,
  updateProduct,
  closeModal,
}) {
  const postProductModalRef = useRef(null)

  return (
    <>
      <div
        id='postProductModal'
        className='modal fade'
        tabIndex='-1'
        aria-labelledby='productModalLabel'
        aria-hidden='true'
        ref={postProductModalRef}
      >
        <div className='modal-dialog modal-xl'>
          <div className='modal-content border-0'>
            <div className='modal-header bg-dark text-white'>
              <h5 id='productModalLabel' className='modal-title'>
                <span>新增產品</span>
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
                <div className='col-sm-4'>
                  <div className='mb-2'>
                    <div className='mb-3'>
                      <label htmlFor='imageUrl' className='form-label'>
                        輸入圖片網址
                      </label>
                      <input
                        id='imageUrl'
                        type='url'
                        className='form-control'
                        placeholder='請輸入圖片連結'
                        value={templateData.imageUrl}
                        onChange={handleModalInput}
                      />
                    </div>
                    {templateData.imageUrl !== '' ? (
                      <img
                        className='img-fluid'
                        src={templateData.imageUrl}
                        alt='主圖'
                      />
                    ) : null}
                  </div>
                  {templateData.imagesUrl.map((image, index) => (
                    <div key={index} className='mb-2'>
                      <input
                        type='text'
                        value={image}
                        onChange={(e) =>
                          handleImageChange(index, e.target.value)
                        }
                        placeholder={`圖片網址 ${index + 1}`}
                        className='form-control mb-2'
                      />
                      {image && (
                        <img
                          src={image}
                          alt={`副圖 ${index + 1}`}
                          className='img-fluid'
                        />
                      )}
                    </div>
                  ))}

                  <div className='d-flex justify-content-between'>
                    {templateData.imagesUrl.length < 5 &&
                      templateData.imagesUrl[
                        templateData.imagesUrl.length - 1
                      ] !== '' && (
                        <button
                          className='btn btn-outline-primary btn-sm w-100'
                          onClick={handleAddImage}
                        >
                          新增圖片
                        </button>
                      )}

                    {templateData.imagesUrl.length >= 1 && (
                      <button
                        className='btn btn-outline-danger btn-sm w-100'
                        onClick={handleRemoveImage}
                      >
                        取消圖片
                      </button>
                    )}
                  </div>
                </div>
                <div className='col-sm-8'>
                  <div className='mb-3'>
                    <label htmlFor='title' className='form-label'>
                      標題
                    </label>
                    <input
                      id='title'
                      type='text'
                      className='form-control'
                      placeholder='請輸入標題'
                      value={templateData.title}
                      onChange={handleModalInput}
                    />
                  </div>

                  <div className='row'>
                    <div className='mb-3 col-md-6'>
                      <label htmlFor='category' className='form-label'>
                        分類
                      </label>
                      <input
                        id='category'
                        type='text'
                        className='form-control'
                        placeholder='請輸入分類'
                        value={templateData.category}
                        onChange={handleModalInput}
                      />
                    </div>
                    <div className='mb-3 col-md-6'>
                      <label htmlFor='unit' className='form-label'>
                        單位
                      </label>
                      <input
                        id='unit'
                        type='text'
                        className='form-control'
                        placeholder='請輸入單位'
                        value={templateData.unit}
                        onChange={handleModalInput}
                      />
                    </div>
                  </div>

                  <div className='row'>
                    <div className='mb-3 col-md-6'>
                      <label htmlFor='origin_price' className='form-label'>
                        原價
                      </label>
                      <input
                        id='origin_price'
                        type='number'
                        min='0'
                        className='form-control'
                        placeholder='請輸入原價'
                        value={templateData.origin_price}
                        onChange={handleModalInput}
                      />
                    </div>
                    <div className='mb-3 col-md-6'>
                      <label htmlFor='price' className='form-label'>
                        售價
                      </label>
                      <input
                        id='price'
                        type='number'
                        min='0'
                        className='form-control'
                        placeholder='請輸入售價'
                        value={templateData.price}
                        onChange={handleModalInput}
                      />
                    </div>
                  </div>
                  <hr />

                  <div className='mb-3'>
                    <label htmlFor='description' className='form-label'>
                      產品描述
                    </label>
                    <textarea
                      id='description'
                      className='form-control'
                      placeholder='請輸入產品描述'
                      value={templateData.description}
                      onChange={handleModalInput}
                    ></textarea>
                  </div>
                  <div className='mb-3'>
                    <label htmlFor='content' className='form-label'>
                      說明內容
                    </label>
                    <textarea
                      id='content'
                      className='form-control'
                      placeholder='請輸入說明內容'
                      value={templateData.content}
                      onChange={handleModalInput}
                    ></textarea>
                  </div>
                  <div className='mb-3'>
                    <div className='form-check'>
                      <input
                        id='is_enabled'
                        className='form-check-input'
                        type='checkbox'
                        checked={templateData.is_enabled}
                        onChange={handleModalInput}
                      />
                      <label className='form-check-label' htmlFor='is_enabled'>
                        是否啟用
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className='modal-footer'>
              <button
                type='button'
                className='btn btn-outline-secondary'
                data-bs-dismiss='modal'
                onClick={closeModal}
              >
                取消
              </button>
              <button
                type='button'
                className='btn btn-primary'
                onClick={updateProduct}
              >
                確認
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

PostProductModal.propTypes = {
  templateData: PropTypes.shape({
    id: PropTypes.string,
    imageUrl: PropTypes.string,
    title: PropTypes.string,
    category: PropTypes.string,
    unit: PropTypes.string,
    originPrice: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    price: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    description: PropTypes.string,
    content: PropTypes.string,
    isEnabled: PropTypes.bool,
    imagesUrl: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
  handleModalInput: PropTypes.func.isRequired,
  handleImageChange: PropTypes.func.isRequired,
  handleAddImage: PropTypes.func.isRequired,
  handleRemoveImage: PropTypes.func.isRequired,
  updateProduct: PropTypes.func.isRequired,
  closeModal: PropTypes.func.isRequired,
}

export default PostProductModal
