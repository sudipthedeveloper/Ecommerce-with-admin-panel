import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { FaCity, FaRegBuilding } from "react-icons/fa";
import { IoCallOutline, IoCheckmarkCircleOutline, IoClose, IoEarthOutline, IoHomeOutline, IoLocationOutline, IoMapOutline } from "react-icons/io5";
import SummaryApi from '../common/SummaryApi';
import { useGlobalContext } from '../provider/GlobalProvider';
import Axios from '../utils/Axios';
import AxiosToastError from '../utils/AxiosToastError';

const AddAddress = ({ close }) => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const { fetchAddress } = useGlobalContext();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (data) => {
    try {
      setIsSubmitting(true);
      const response = await Axios({
        ...SummaryApi.createAddress,
        data: {
          address_line: data.addressline,
          city: data.city,
          state: data.state,
          country: data.country,
          pincode: data.pincode,
          mobile: data.mobile,
        },
      });
      const { data: responseData } = response;
      if (responseData.success) {
        toast.success(responseData.message, {
          icon: '✅',
          style: {
            borderRadius: '12px',
            background: '#10B981',
            color: '#fff',
            fontWeight: 500,
          },
          duration: 4000,
        });
        if (close) {
          close();
          reset();
          fetchAddress();
        }
      }
    } catch (error) {
      AxiosToastError(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className='fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/60 backdrop-blur-sm overflow-auto'>
      <div className='w-full max-w-lg bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl shadow-xl transform transition-all duration-300'>
        {/* Header with gradient */}
        <div className='bg-gradient-to-r from-emerald-500 to-green-500 p-6 rounded-t-2xl'>
          <div className='flex justify-between items-center'>
            <div className='flex items-center gap-3'>
              <IoHomeOutline size={28} className='text-white animate-pulse' />
              <h2 className='text-2xl font-bold text-white'>Add New Address</h2>
            </div>
            <button
              onClick={close}
              className='p-2 text-white hover:bg-white/20 rounded-full transition-colors duration-200'
              aria-label="Close"
            >
              <IoClose size={24}/>
            </button>
          </div>
        </div>

        {/* Form */}
        <form className='p-6 space-y-5' onSubmit={handleSubmit(onSubmit)}>
          <div className='space-y-2'>
            <label htmlFor='addressline' className='block text-sm font-medium text-emerald-700'>
              Address Line
            </label>
            <div className='relative'>
              <div className='absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-emerald-600'>
                <IoLocationOutline size={20} />
              </div>
              <input
                type='text'
                id='addressline'
                className={`w-full pl-10 pr-3 py-3 border ${errors.addressline ? 'border-red-300 focus:ring-red-400 focus:border-red-400' : 'border-green-200 focus:ring-emerald-400 focus:border-emerald-400'} rounded-lg focus:ring-2 bg-white/80 text-emerald-900 placeholder-emerald-300 shadow-sm transition-all duration-200`}
                placeholder='Enter your street address'
                {...register("addressline", {required: "Address is required"})}
              />
              {errors.addressline && (
                <p className="mt-1 text-sm text-red-500">{errors.addressline.message}</p>
              )}
            </div>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div className='space-y-2'>
              <label htmlFor='city' className='block text-sm font-medium text-emerald-700'>
                City
              </label>
              <div className='relative'>
                <div className='absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-emerald-600'>
                  <FaCity size={18} />
                </div>
                <input
                  type='text'
                  id='city'
                  className={`w-full pl-10 pr-3 py-3 border ${errors.city ? 'border-red-300 focus:ring-red-400 focus:border-red-400' : 'border-green-200 focus:ring-emerald-400 focus:border-emerald-400'} rounded-lg focus:ring-2 bg-white/80 text-emerald-900 placeholder-emerald-300 shadow-sm transition-all duration-200`}
                  placeholder='City'
                  {...register("city", {required: "City is required"})}
                />
                {errors.city && (
                  <p className="mt-1 text-sm text-red-500">{errors.city.message}</p>
                )}
              </div>
            </div>

            <div className='space-y-2'>
              <label htmlFor='state' className='block text-sm font-medium text-emerald-700'>
                State
              </label>
              <div className='relative'>
                <div className='absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-emerald-600'>
                  <FaRegBuilding size={18} />
                </div>
                <input
                  type='text'
                  id='state'
                  className={`w-full pl-10 pr-3 py-3 border ${errors.state ? 'border-red-300 focus:ring-red-400 focus:border-red-400' : 'border-green-200 focus:ring-emerald-400 focus:border-emerald-400'} rounded-lg focus:ring-2 bg-white/80 text-emerald-900 placeholder-emerald-300 shadow-sm transition-all duration-200`}
                  placeholder='State'
                  {...register("state", {required: "State is required"})}
                />
                {errors.state && (
                  <p className="mt-1 text-sm text-red-500">{errors.state.message}</p>
                )}
              </div>
            </div>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div className='space-y-2'>
              <label htmlFor='pincode' className='block text-sm font-medium text-emerald-700'>
                Pincode
              </label>
              <div className='relative'>
                <div className='absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-emerald-600'>
                  <IoMapOutline size={20} />
                </div>
                <input
                  type='text'
                  id='pincode'
                  className={`w-full pl-10 pr-3 py-3 border ${errors.pincode ? 'border-red-300 focus:ring-red-400 focus:border-red-400' : 'border-green-200 focus:ring-emerald-400 focus:border-emerald-400'} rounded-lg focus:ring-2 bg-white/80 text-emerald-900 placeholder-emerald-300 shadow-sm transition-all duration-200`}
                  placeholder='Postal/Zip code'
                  {...register("pincode", {
                    required: "Pincode is required",
                    pattern: {
                      value: /^[0-9]{6}$/,
                      message: 'Enter a valid 6-digit pincode'
                    }
                  })}
                />
                {errors.pincode && (
                  <p className="mt-1 text-sm text-red-500">{errors.pincode.message}</p>
                )}
              </div>
            </div>

            <div className='space-y-2'>
              <label htmlFor='country' className='block text-sm font-medium text-emerald-700'>
                Country
              </label>
              <div className='relative'>
                <div className='absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-emerald-600'>
                  <IoEarthOutline size={20} />
                </div>
                <input
                  type='text'
                  id='country'
                  className={`w-full pl-10 pr-3 py-3 border ${errors.country ? 'border-red-300 focus:ring-red-400 focus:border-red-400' : 'border-green-200 focus:ring-emerald-400 focus:border-emerald-400'} rounded-lg focus:ring-2 bg-white/80 text-emerald-900 placeholder-emerald-300 shadow-sm transition-all duration-200`}
                  placeholder='Country'
                  {...register("country", {required: "Country is required"})}
                />
                {errors.country && (
                  <p className="mt-1 text-sm text-red-500">{errors.country.message}</p>
                )}
              </div>
            </div>
          </div>

          <div className='space-y-2'>
            <label htmlFor='mobile' className='block text-sm font-medium text-emerald-700'>
              Mobile Number
            </label>
            <div className='relative'>
              <div className='absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-emerald-600'>
                <IoCallOutline size={20} />
              </div>
              <input
                type='text'
                id='mobile'
                className={`w-full pl-10 pr-3 py-3 border ${errors.mobile ? 'border-red-300 focus:ring-red-400 focus:border-red-400' : 'border-green-200 focus:ring-emerald-400 focus:border-emerald-400'} rounded-lg focus:ring-2 bg-white/80 text-emerald-900 placeholder-emerald-300 shadow-sm transition-all duration-200`}
                placeholder='Your mobile number'
                {...register("mobile", {
                  required: "Mobile number is required",
                  pattern: {
                    value: /^[0-9]{10}$/,
                    message: 'Enter a valid 10-digit mobile number'
                  }
                })}
              />
              {errors.mobile && (
                <p className="mt-1 text-sm text-red-500">{errors.mobile.message}</p>
              )}
            </div>
          </div>

          <button
            type='submit'
            disabled={isSubmitting}
            className='w-full py-4 mt-6 bg-gradient-to-r from-emerald-500 to-green-500 text-white font-bold rounded-lg shadow-lg hover:from-emerald-600 hover:to-green-600 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-2 transition-all duration-300 transform hover:scale-105 flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed'
          >
            {isSubmitting ? (
              <div className='flex items-center gap-2'>
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Saving Address...</span>
              </div>
            ) : (
              <div className='flex items-center gap-2'>
                <IoCheckmarkCircleOutline size={20} />
                <span>Save Address</span>
              </div>
            )}
          </button>
        </form>
      </div>
    </section>
  );
};

export default AddAddress;
