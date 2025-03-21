import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import SummaryApi from '../common/SummaryApi';
import { setUserDetails } from '../store/userSlice';
import Axios from '../utils/Axios';
import AxiosToastError from '../utils/AxiosToastError';
import fetchUserDetails from '../utils/fetchUserDetails';

const Login = () => {
    const [data, setData] = useState({
        email: "",
        password: "",
    });
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const validValues = Object.values(data).every(el => el.trim() !== "");

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await Axios({
                ...SummaryApi.login,
                data: data
            });

            if (response.data.error) {
                toast.error(response.data.message);
            }

            if (response.data.success) {
                toast.success(response.data.message);
                localStorage.setItem('accesstoken', response.data.data.accesstoken);
                localStorage.setItem('refreshToken', response.data.data.refreshToken);

                const userDetails = await fetchUserDetails();
                dispatch(setUserDetails(userDetails.data));

                setData({
                    email: "",
                    password: "",
                });
                navigate("/");
            }
        } catch (error) {
            AxiosToastError(error);
        }
    };

    return (
        <section className="pt-11 flex items-center justify-center min-h-screen bg-green-100 p-4">
            <div className="flex flex-col lg:flex-row w-full max-w-4xl bg-white rounded-lg shadow-2xl overflow-hidden">
                {/* Left Side - Branding */}
                <div className="w-full lg:w-1/2 bg-gradient-to-br from-green-100 to-green-200 p-8 flex flex-col justify-center items-center lg:items-start rounded-t-lg lg:rounded-l-lg lg:rounded-t-none">
                    <div className="flex items-center mb-4">
                        <span className="text-2xl mr-2">🛒</span>
                        <h1 className="text-3xl font-bold text-green-800">Feelustration</h1>
                    </div>
                    <h2 className="text-2xl lg:text-4xl font-bold text-gray-800 mb-4 text-center lg:text-left">
                        Discover a New Shopping Experience
                    </h2>
                    <p className="text-gray-800 mb-6 text-center lg:text-left">
                        Join our exclusive community to access personalized recommendations and premium deals tailored just for you.
                    </p>
                    <p className="text-gray-700 mb-6 text-center lg:text-left">Join over 10,000+ happy shoppers</p>
                    <div className="space-y-2 text-gray-800 text-center lg:text-left">
                        <p className="flex items-center justify-center lg:justify-start">
                            <span className="mr-2 text-green-800">🛡️</span> Secure Shopping - Protected by industry-leading encryption
                        </p>
                        <p className="flex items-center justify-center lg:justify-start">
                            <span className="mr-2 text-green-800">🚚</span> Fast Delivery - 90% of orders delivered next day
                        </p>
                        <p className="flex items-center justify-center lg:justify-start">
                            <span className="mr-2 text-green-800">👥</span> 24/7 Support - Our team is always here to help you
                        </p>
                    </div>
                </div>

                {/* Right Side - Login Form */}
                <div className="w-full lg:w-1/2 p-8 flex flex-col justify-center">
                    <div className="mb-6">
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">Login</h2>
                        <p className="text-gray-500 text-sm">Join our shopping community today</p>
                    </div>
                    <form className="space-y-4" onSubmit={handleSubmit}>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
                            <input
                                type="email"
                                id="email"
                                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                                name="email"
                                value={data.email}
                                onChange={handleChange}
                                placeholder="you@example.com"
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                            <div className="mt-1 relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    id="password"
                                    className="block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                                    name="password"
                                    value={data.password}
                                    onChange={handleChange}
                                    placeholder="Enter your password"
                                />
                                <div
                                    onClick={() => setShowPassword(prev => !prev)}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer text-gray-500 hover:text-green-600 transition-colors"
                                >
                                    {showPassword ? <FaRegEye /> : <FaRegEyeSlash />}
                                </div>
                            </div>
                            <p className="text-xs text-gray-500 mt-1">Password must be at least 8 characters</p>
                        </div>
                        <button
                            disabled={!validValues}
                            className={`w-full py-2 px-4 rounded-lg font-semibold text-white transition-all ${
                                validValues ? "bg-green-600 hover:bg-green-700" : "bg-gray-400 cursor-not-allowed"
                            }`}
                        >
                            Login
                        </button>

                        <p className="text-center text-gray-600 text-sm mt-4">
                            Don’t have an account?{" "}
                            <Link to="/register" className="text-green-600 hover:text-green-700 font-semibold transition-colors">
                                Sign Up
                            </Link>
                        </p>
                    </form>
                </div>
            </div>
        </section>
    );
};

export default Login;
