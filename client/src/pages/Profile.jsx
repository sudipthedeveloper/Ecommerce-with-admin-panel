import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { FaCamera, FaEdit, FaEnvelope, FaMobile, FaRegUserCircle, FaUser } from "react-icons/fa";
import { useDispatch, useSelector } from 'react-redux';
import SummaryApi from '../common/SummaryApi';
import UserProfileAvatarEdit from '../components/UserProfileAvatarEdit';
import { setUserDetails } from '../store/userSlice';
import Axios from '../utils/Axios';
import AxiosToastError from '../utils/AxiosToastError';
import fetchUserDetails from '../utils/fetchUserDetails';

const Profile = () => {
    const user = useSelector(state => state.user)
    const [openProfileAvatarEdit, setOpenProfileAvatarEdit] = useState(false)
    const [userData, setUserData] = useState({
        name: user.name,
        email: user.email,
        mobile: user.mobile,
    })
    const [loading, setLoading] = useState(false)
    const dispatch = useDispatch()

    useEffect(() => {
        setUserData({
            name: user.name,
            email: user.email,
            mobile: user.mobile,
        })
    }, [user])

    const handleOnChange = (e) => {
        const { name, value } = e.target

        setUserData((prev) => {
            return {
                ...prev,
                [name]: value
            }
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        try {
            setLoading(true)
            const response = await Axios({
                ...SummaryApi.updateUserDetails,
                data: userData
            })

            const { data: responseData } = response

            if (responseData.success) {
                toast.success(responseData.message)
                const userData = await fetchUserDetails()
                dispatch(setUserDetails(userData.data))
            }

        } catch (error) {
            AxiosToastError(error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className='min-h-screen bg-gradient-to-b from-green-50 to-white p-6'>
            <div className='max-w-4xl mx-auto bg-white rounded-2xl shadow-md overflow-hidden'>
                {/* Header Banner */}
                <div className='h-32 bg-gradient-to-r from-green-400 to-emerald-500 relative'></div>

                {/* Profile Section */}
                <div className='px-6 pb-6'>
                    {/* Avatar Section */}
                    <div className='relative -mt-16 mb-6 flex flex-col items-center sm:items-start sm:flex-row sm:mb-10'>
                        <div className='relative group'>
                            <div className='w-32 h-32 rounded-full overflow-hidden border-4 border-white bg-white shadow-lg'>
                                {user.avatar ? (
                                    <img
                                        alt={user.name || "User"}
                                        src={user.avatar}
                                        className='w-full h-full object-cover'
                                    />
                                ) : (
                                    <div className='w-full h-full flex items-center justify-center bg-green-100'>
                                        <FaRegUserCircle size={80} className="text-green-300" />
                                    </div>
                                )}
                            </div>

                            {/* Edit Button overlay */}
                            <button
                                onClick={() => setOpenProfileAvatarEdit(true)}
                                className='absolute bottom-0 right-0 bg-green-500 hover:bg-green-600 text-white p-2 rounded-full shadow-md transition-all duration-300 transform hover:scale-110'
                            >
                                <FaCamera size={18} />
                            </button>
                        </div>

                        {/* User Name Display */}
                        <div className='sm:ml-6 mt-4 sm:mt-0 text-center sm:text-left sm:self-end mb-2'>
                            <h1 className='text-2xl font-bold text-gray-800'>{user.name || "User Profile"}</h1>
                            <p className='text-gray-500'>{user.email}</p>
                        </div>
                    </div>

                    {/* Profile Form */}
                    <div className='mt-6'>
                        <h2 className='text-xl font-semibold text-gray-800 mb-4 border-b border-gray-100 pb-2'>Personal Information</h2>

                        <form className='space-y-5 max-w-2xl' onSubmit={handleSubmit}>
                            <div className=''>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                <div className='relative'>
                                    <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                                        <FaUser className='text-green-500' />
                                    </div>
                                    <input
                                        type='text'
                                        placeholder='Enter your name'
                                        className='pl-10 w-full p-3 bg-gray-50 focus:bg-white border border-gray-200 focus:border-green-500 rounded-lg outline-none transition-all duration-300'
                                        value={userData.name}
                                        name='name'
                                        onChange={handleOnChange}
                                        required
                                    />
                                </div>
                            </div>

                            <div className=''>
                                <label htmlFor='email' className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                                <div className='relative'>
                                    <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                                        <FaEnvelope className='text-green-500' />
                                    </div>
                                    <input
                                        type='email'
                                        id='email'
                                        placeholder='Enter your email'
                                        className='pl-10 w-full p-3 bg-gray-50 focus:bg-white border border-gray-200 focus:border-green-500 rounded-lg outline-none transition-all duration-300'
                                        value={userData.email}
                                        name='email'
                                        onChange={handleOnChange}
                                        required
                                    />
                                </div>
                            </div>

                            <div className=''>
                                <label htmlFor='mobile' className="block text-sm font-medium text-gray-700 mb-1">Mobile Number</label>
                                <div className='relative'>
                                    <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                                        <FaMobile className='text-green-500' />
                                    </div>
                                    <input
                                        type='text'
                                        id='mobile'
                                        placeholder='Enter your mobile'
                                        className='pl-10 w-full p-3 bg-gray-50 focus:bg-white border border-gray-200 focus:border-green-500 rounded-lg outline-none transition-all duration-300'
                                        value={userData.mobile}
                                        name='mobile'
                                        onChange={handleOnChange}
                                        required
                                    />
                                </div>
                            </div>

                            <div className='pt-4'>
                                <button
                                    type="submit"
                                    className={`w-full sm:w-auto px-6 py-3 rounded-lg font-medium text-white shadow-md transition-all duration-300 flex items-center justify-center ${
                                        loading
                                            ? 'bg-gray-400 cursor-not-allowed'
                                            : 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 hover:shadow-lg'
                                    }`}
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <>
                                            <svg className="animate-spin h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Saving Changes...
                                        </>
                                    ) : (
                                        <>
                                            <FaEdit className="mr-2" />
                                            Save Changes
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            {/* Avatar Edit Modal */}
            {openProfileAvatarEdit && (
                <UserProfileAvatarEdit close={() => setOpenProfileAvatarEdit(false)} />
            )}
        </div>
    )
}

export default Profile
