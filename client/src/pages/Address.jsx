import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { FiMapPin, FiPlus } from "react-icons/fi";
import { HiGlobe, HiLocationMarker, HiMap, HiOfficeBuilding, HiOutlineHome, HiPhone } from "react-icons/hi";
import { MdAddCircleOutline, MdDelete, MdEdit, MdLocationOn } from "react-icons/md";
import { useSelector } from 'react-redux';
import SummaryApi from '../common/SummaryApi';
import AddAddress from '../components/AddAddress';
import EditAddressDetails from '../components/EditAddressDetails';
import { useGlobalContext } from '../provider/GlobalProvider';
import Axios from '../utils/Axios';
import AxiosToastError from '../utils/AxiosToastError';

const Address = () => {
  const addressList = useSelector(state => state.addresses.addressList)
  const [openAddress, setOpenAddress] = useState(false)
  const [OpenEdit, setOpenEdit] = useState(false)
  const [editData, setEditData] = useState({})
  const { fetchAddress } = useGlobalContext()
  const [isDeleting, setIsDeleting] = useState(null)

  const handleDisableAddress = async(id) => {
    try {
      setIsDeleting(id)
      const response = await Axios({
        ...SummaryApi.disableAddress,
        data: {
          _id: id
        }
      })
      if(response.data.success){
        toast.success("Address Removed", {
          icon: '✅',
          style: {
            borderRadius: '10px',
            background: '#10B981',
            color: '#fff',
          },
        })
        if(fetchAddress){
          fetchAddress()
        }
      }
    } catch (error) {
      AxiosToastError(error)
    } finally {
      setIsDeleting(null)
    }
  }

  const getAddressIcon = (address) => {
    if (address.address_type === 'office') {
      return <HiOfficeBuilding size={20} className="text-green-600" />
    }
    return <HiOutlineHome size={20} className="text-green-600" />
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-green-50 to-teal-50 p-4 md:p-6'>
      {/* Header */}
      <div className='bg-white rounded-2xl shadow-lg px-6 py-4 flex justify-between items-center mb-6 border-l-4 border-green-500'>
        <div className="flex items-center gap-3">
          <HiLocationMarker size={24} className="text-green-600" />
          <h2 className='font-bold text-xl text-gray-800'>My Addresses</h2>
        </div>
        <button
          onClick={() => setOpenAddress(true)}
          className='bg-green-500 hover:bg-green-600 text-white px-5 py-2.5 rounded-xl font-medium flex items-center gap-2 transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg'
        >
          <FiPlus size={18} />
          <span>Add Address</span>
        </button>
      </div>

      {/* Address List */}
      <div className='grid gap-5 mb-6'>
        {addressList.length === 0 ? (
          <div className='bg-white rounded-2xl shadow-md p-8 text-center'>
            <div className="flex justify-center mb-4">
              <HiMap size={64} className="text-green-300" />
            </div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No Addresses Found</h3>
            <p className="text-gray-500 mb-6">Add your first delivery address to get started.</p>
            <button
              onClick={() => setOpenAddress(true)}
              className="bg-green-100 text-green-600 px-5 py-3 rounded-xl font-medium inline-flex items-center gap-2 hover:bg-green-200 transition-all duration-200"
            >
              <FiPlus size={18} />
              <span>Add Your First Address</span>
            </button>
          </div>
        ) : (
          addressList.filter(addr => addr.status).map((address, index) => (
            <div
              key={address._id || index}
              className={`bg-white rounded-2xl p-5 shadow-md hover:shadow-lg transition-all duration-300 border border-green-100 ${!address.status && 'hidden'}`}
            >
              <div className='flex flex-col md:flex-row gap-4 relative overflow-hidden'>
                <div className='absolute top-0 right-0 w-24 h-24 bg-green-50 rounded-bl-full -z-0 opacity-50'></div>

                {/* Address Details */}
                <div className='w-full z-10'>
                  <div className='flex items-center gap-2 mb-3'>
                    {getAddressIcon(address)}
                    <h3 className='font-bold text-gray-800'>
                      {address.address_type === 'office' ? 'Office Address' : 'Home Address'}
                    </h3>
                    {index === 0 && (
                      <span className='bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full font-medium'>Default</span>
                    )}
                  </div>

                  <div className='grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2'>
                    <div className='flex items-start gap-2'>
                      <MdLocationOn size={18} className="text-green-500 mt-1 flex-shrink-0" />
                      <p className='text-gray-700'>{address.address_line}</p>
                    </div>

                    <div className='flex items-center gap-2'>
                      <HiGlobe size={18} className="text-green-500 flex-shrink-0" />
                      <p className='text-gray-700'>{address.city}, {address.state}</p>
                    </div>

                    <div className='flex items-center gap-2'>
                      <FiMapPin size={18} className="text-green-500 flex-shrink-0" />
                      <p className='text-gray-700'>{address.country} - {address.pincode}</p>
                    </div>

                    <div className='flex items-center gap-2'>
                      <HiPhone size={18} className="text-green-500 flex-shrink-0" />
                      <p className='text-gray-700'>{address.mobile}</p>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className='flex md:flex-col justify-end gap-3 z-10'>
                  <button
                    onClick={() => {
                      setOpenEdit(true)
                      setEditData(address)
                    }}
                    className='bg-green-100 p-2 rounded-xl hover:text-white hover:bg-green-600 transition-colors duration-200'
                    aria-label="Edit address"
                  >
                    <MdEdit size={20} />
                  </button>
                  <button
                    onClick={() => handleDisableAddress(address._id)}
                    disabled={isDeleting === address._id}
                    className={`p-2 rounded-xl transition-colors duration-200 ${
                      isDeleting === address._id
                        ? 'bg-red-100 text-red-300'
                        : 'bg-red-100 hover:bg-red-600 hover:text-white text-red-500'
                    }`}
                    aria-label="Delete address"
                  >
                    {isDeleting === address._id ? (
                      <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    ) : (
                      <MdDelete size={20} />
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add Address Button */}
      <div
        onClick={() => setOpenAddress(true)}
        className='bg-white border-2 border-dashed border-green-300 rounded-2xl p-6 flex flex-col justify-center items-center cursor-pointer hover:bg-green-50 transition-all duration-300 group'
      >
        <div className='bg-green-100 p-3 rounded-full mb-3 group-hover:bg-green-200 transition-colors'>
          <MdAddCircleOutline size={32} className="text-green-600" />
        </div>
        <p className='font-medium text-gray-700 group-hover:text-green-700 transition-colors'>Add New Address</p>
        <p className='text-sm text-gray-500 mt-1 max-w-md text-center'>Save your shipping addresses for faster checkout</p>
      </div>

      {/* Modals */}
      {openAddress && (
        <AddAddress close={() => setOpenAddress(false)} />
      )}

      {OpenEdit && (
        <EditAddressDetails data={editData} close={() => setOpenEdit(false)} />
      )}
    </div>
  )
}

export default Address
