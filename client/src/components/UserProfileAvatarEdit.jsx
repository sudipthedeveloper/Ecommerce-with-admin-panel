import React, { useEffect, useState } from 'react'
import { FaCheck, FaCloudUploadAlt, FaRegUserCircle } from 'react-icons/fa'
import { IoClose } from "react-icons/io5"
import { useDispatch, useSelector } from 'react-redux'
import SummaryApi from '../common/SummaryApi'
import { updatedAvatar } from '../store/userSlice'
import Axios from '../utils/Axios'
import AxiosToastError from '../utils/AxiosToastError'

const UserProfileAvatarEdit = ({close}) => {
  const user = useSelector(state => state.user)
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(false)
  const [previewUrl, setPreviewUrl] = useState(user.avatar || '')
  const [selectedFile, setSelectedFile] = useState(null)

  const handleSubmit = (e) => {
    e.preventDefault()
  }

  useEffect(() => {
    // Clean up preview URL when component unmounts
    return () => {
      if (previewUrl && previewUrl !== user.avatar) {
        URL.revokeObjectURL(previewUrl)
      }
    }
  }, [previewUrl, user.avatar])

  const handleUploadAvatarImage = async(e) => {
    const file = e.target.files[0]
    if(!file) {
      return
    }

    // Create preview URL
    const fileUrl = URL.createObjectURL(file)
    setPreviewUrl(fileUrl)
    setSelectedFile(file)

    const formData = new FormData()
    formData.append('avatar', file)

    try {
      setLoading(true)
      const response = await Axios({
        ...SummaryApi.uploadAvatar,
        data: formData
      })
      const { data: responseData} = response
      dispatch(updatedAvatar(responseData.data.avatar))

      // Show success state briefly before closing
      setTimeout(() => {
        close()
      }, 1000)

    } catch (error) {
      AxiosToastError(error)
    } finally {
      setLoading(false)
    }
  }

  const handleDragOver = (e) => {
    e.preventDefault()
  }

  const handleDrop = (e) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file) {
      // Trigger the file input change handler
      const input = document.getElementById('uploadProfile')
      const dataTransfer = new DataTransfer()
      dataTransfer.items.add(file)
      input.files = dataTransfer.files

      // Trigger change event manually
      const event = new Event('change', { bubbles: true })
      input.dispatchEvent(event)
    }
  }

  return (
    <section className='fixed inset-0 z-50 bg-black/60 backdrop-blur-sm p-4 flex items-center justify-center'>
      <div className='bg-white max-w-md w-full rounded-2xl p-6 flex flex-col shadow-2xl transform transition-all duration-300 ease-in-out'>
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-2xl font-bold text-gray-800">Profile Picture</h2>
          <button
            onClick={close}
            className='h-8 w-8 rounded-full flex items-center justify-center text-gray-500 hover:text-gray-800 hover:bg-gray-100 transition-all'
          >
            <IoClose size={24}/>
          </button>
        </div>

        {/* Avatar Preview */}
        <div className="flex flex-col items-center mb-6">
          <div className='w-32 h-32 rounded-full overflow-hidden shadow-lg border-4 border-green-100 bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center'>
            {previewUrl ? (
              <img
                alt={user.name || 'User'}
                src={previewUrl}
                className='w-full h-full object-cover'
              />
            ) : (
              <FaRegUserCircle size={80} className="text-green-300"/>
            )}
          </div>

          <p className="mt-3 text-gray-600 text-center">
            {selectedFile ? selectedFile.name : 'Upload a new profile picture'}
          </p>
        </div>

        {/* Upload Section */}
        <form onSubmit={handleSubmit} className="w-full">
          <div
            className="border-2 border-dashed border-green-300 rounded-xl p-8 mb-5 flex flex-col items-center justify-center cursor-pointer hover:bg-green-50 transition-colors"
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            <FaCloudUploadAlt size={40} className="text-green-500 mb-3" />
            <p className="text-center text-gray-600 mb-2">
              Drag and drop your image here
            </p>
            <p className="text-center text-gray-400 text-sm">
              or click to select a file
            </p>

            <label htmlFor='uploadProfile' className="w-full mt-4">
              <div className='bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-medium py-2 px-6 rounded-full shadow-md hover:shadow-lg transition-all duration-300 text-center'>
                {loading ? (
                  <div className="flex items-center justify-center">
                    <svg className="animate-spin h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Uploading...
                  </div>
                ) : selectedFile ? (
                  <div className="flex items-center justify-center">
                    <FaCheck className="mr-2" />
                    Image Selected
                  </div>
                ) : (
                  "Choose Image"
                )}
              </div>
              <input
                onChange={handleUploadAvatarImage}
                type='file'
                accept="image/*"
                id='uploadProfile'
                className='hidden'
              />
            </label>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3">
            <button
              type="button"
              onClick={close}
              className="flex-1 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading || !selectedFile}
              className={`flex-1 py-2 rounded-lg transition-colors ${
                loading || !selectedFile
                  ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:from-green-600 hover:to-emerald-600'
              }`}
            >
              {loading ? "Processing..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </section>
  )
}

export default UserProfileAvatarEdit
