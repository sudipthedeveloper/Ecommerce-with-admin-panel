import React from 'react'
import { useForm } from "react-hook-form"
import toast from 'react-hot-toast'
import { FaCity, FaRegBuilding } from "react-icons/fa"
import { IoCallOutline, IoClose, IoEarthOutline, IoHomeOutline, IoLocationOutline, IoMailOutline, IoMapOutline } from "react-icons/io5"
import SummaryApi from '../common/SummaryApi'
import { useGlobalContext } from '../provider/GlobalProvider'
import Axios from '../utils/Axios'
import AxiosToastError from '../utils/AxiosToastError'

const EditAddressDetails = ({close, data}) => {
    const { register, handleSubmit, reset } = useForm({
        defaultValues : {
            _id : data._id,
            userId : data.userId,
            address_line : data.address_line,
            city : data.city,
            state : data.state,
            country : data.country,
            pincode : data.pincode,
            mobile : data.mobile
        }
    })
    const { fetchAddress } = useGlobalContext()

    const onSubmit = async(data) => {
        try {
            const response = await Axios({
                ...SummaryApi.updateAddress,
                data : {
                    ...data,
                    address_line : data.address_line,
                    city : data.city,
                    state : data.state,
                    country : data.country,
                    pincode : data.pincode,
                    mobile : data.mobile
                }
            })

            const { data : responseData } = response

            if(responseData.success){
                toast.success(responseData.message)
                if(close){
                    close()
                    reset()
                    fetchAddress()
                }
            }
        } catch (error) {
            AxiosToastError(error)
        }
    }

    return (
        <section className='fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/60 backdrop-blur-sm overflow-auto'>
            <div className='w-full max-w-lg bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl shadow-xl transform transition-all duration-300'>
                <div className='flex justify-between items-center p-6 border-b border-green-100'>
                    <h2 className='text-2xl font-bold text-emerald-800 flex items-center'>
                        <IoHomeOutline className="mr-3 text-emerald-600" />
                        Edit Address
                    </h2>
                    <button
                        onClick={close}
                        className='p-2 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors duration-200'
                        aria-label="Close"
                    >
                        <IoClose size={24}/>
                    </button>
                </div>

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
                                className='w-full pl-10 pr-3 py-3 border border-green-200 rounded-lg focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 bg-white/80 text-emerald-900 placeholder-emerald-300 shadow-sm transition-all duration-200'
                                placeholder='Enter your street address'
                                {...register("address_line", {required: true})}
                            />
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
                                    className='w-full pl-10 pr-3 py-3 border border-green-200 rounded-lg focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 bg-white/80 text-emerald-900 placeholder-emerald-300 shadow-sm transition-all duration-200'
                                    placeholder='City'
                                    {...register("city", {required: true})}
                                />
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
                                    className='w-full pl-10 pr-3 py-3 border border-green-200 rounded-lg focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 bg-white/80 text-emerald-900 placeholder-emerald-300 shadow-sm transition-all duration-200'
                                    placeholder='State'
                                    {...register("state", {required: true})}
                                />
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
                                    className='w-full pl-10 pr-3 py-3 border border-green-200 rounded-lg focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 bg-white/80 text-emerald-900 placeholder-emerald-300 shadow-sm transition-all duration-200'
                                    placeholder='Postal/Zip code'
                                    {...register("pincode", {required: true})}
                                />
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
                                    className='w-full pl-10 pr-3 py-3 border border-green-200 rounded-lg focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 bg-white/80 text-emerald-900 placeholder-emerald-300 shadow-sm transition-all duration-200'
                                    placeholder='Country'
                                    {...register("country", {required: true})}
                                />
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
                                className='w-full pl-10 pr-3 py-3 border border-green-200 rounded-lg focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 bg-white/80 text-emerald-900 placeholder-emerald-300 shadow-sm transition-all duration-200'
                                placeholder='Your mobile number'
                                {...register("mobile", {required: true})}
                            />
                        </div>
                    </div>

                    <button
                        type='submit'
                        className='w-full py-4 mt-6 bg-gradient-to-r from-emerald-500 to-green-500 text-white font-bold rounded-lg shadow-lg hover:from-emerald-600 hover:to-green-600 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-2 transition-all duration-300 transform hover:scale-105 flex items-center justify-center'
                    >
                        <IoMailOutline className="mr-2" size={20} />
                        Update Address
                    </button>
                </form>
            </div>
        </section>
    )
}

export default EditAddressDetails
