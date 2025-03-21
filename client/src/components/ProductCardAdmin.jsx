import React, { useState } from 'react'
import toast from 'react-hot-toast'
import { IoClose, IoPencil, IoTrash } from 'react-icons/io5'
import SummaryApi from '../common/SummaryApi'
import Axios from '../utils/Axios'
import AxiosToastError from '../utils/AxiosToastError'
import EditProductAdmin from './EditProductAdmin'

const ProductCardAdmin = ({ data, fetchProductData }) => {
  const [editOpen, setEditOpen] = useState(false)
  const [openDelete, setOpenDelete] = useState(false)

  const handleDeleteCancel = () => {
    setOpenDelete(false)
  }

  const handleDelete = async () => {
    try {
      const response = await Axios({
        ...SummaryApi.deleteProduct,
        data: {
          _id: data._id
        }
      })

      const { data: responseData } = response

      if (responseData.success) {
        toast.success(responseData.message)
        fetchProductData && fetchProductData()
        setOpenDelete(false)
      }
    } catch (error) {
      AxiosToastError(error)
    }
  }

  return (
    <div className='w-44 p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300'>
      <div className='w-full h-36 flex items-center justify-center bg-gray-100 rounded-md overflow-hidden'>
        <img
          src={data?.image[0]}
          alt={data?.name}
          className='w-full h-full object-contain'
        />
      </div>
      <p className='text-md font-semibold mt-2 text-gray-800 line-clamp-2'>{data?.name}</p>
      <p className='text-sm text-gray-500'>{data?.unit}</p>
      <div className='flex justify-between gap-2 mt-3'>
        <button
          onClick={() => setEditOpen(true)}
          className='flex items-center gap-1 px-3 py-1 text-sm border border-green-600 bg-green-100 text-green-800 hover:bg-green-200 rounded-md transition-all duration-300'
        >
          <IoPencil /> Edit
        </button>
        <button
          onClick={() => setOpenDelete(true)}
          className='flex items-center gap-1 px-3 py-1 text-sm border border-red-600 bg-red-100 text-red-600 hover:bg-red-200 rounded-md transition-all duration-300'
        >
          <IoTrash /> Delete
        </button>
      </div>

      {editOpen && <EditProductAdmin fetchProductData={fetchProductData} data={data} close={() => setEditOpen(false)} />}

      {openDelete && (
        <section className='fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50'>
          <div className='bg-white p-5 w-full max-w-md rounded-lg shadow-lg'>
            <div className='flex items-center justify-between'>
              <h3 className='font-semibold text-lg text-gray-800'>Confirm Deletion</h3>
              <button onClick={() => setOpenDelete(false)} className='text-gray-600 hover:text-gray-900'>
                <IoClose size={24} />
              </button>
            </div>
            <p className='text-sm text-gray-600 mt-2'>Are you sure you want to permanently delete this product?</p>
            <div className='flex justify-end gap-4 mt-4'>
              <button
                onClick={handleDeleteCancel}
                className='px-4 py-2 text-sm border border-gray-300 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-md transition-all duration-300'
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className='px-4 py-2 text-sm border border-red-500 text-red-600 bg-red-100 hover:bg-red-200 rounded-md transition-all duration-300'
              >
                Delete
              </button>
            </div>
          </div>
        </section>
      )}
    </div>
  )
}

export default ProductCardAdmin
