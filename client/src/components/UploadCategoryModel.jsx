import { AnimatePresence, motion } from 'framer-motion';
import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { FaImage, FaUpload } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import SummaryApi from '../common/SummaryApi';
import Axios from '../utils/Axios';
import AxiosToastError from '../utils/AxiosToastError';
import uploadImage from '../utils/UploadImage';

const UploadCategoryModel = ({ close, fetchData }) => {
    const [data, setData] = useState({
        name: "",
        image: ""
    });
    const [loading, setLoading] = useState(false);

    const handleOnChange = (e) => {
        const { name, value } = e.target;

        setData((preve) => ({
            ...preve,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setLoading(true);
            const response = await Axios({
                ...SummaryApi.addCategory,
                data: data
            });
            const { data: responseData } = response;

            if (responseData.success) {
                toast.success(responseData.message);
                close();
                fetchData();
            }
        } catch (error) {
            AxiosToastError(error);
        } finally {
            setLoading(false);
        }
    };

    const handleUploadCategoryImage = async (e) => {
        const file = e.target.files[0];

        if (!file) {
            return;
        }

        try {
            const response = await uploadImage(file);
            console.log("Upload Response:", response);

            if (!response || !response.data || !response.data.data || !response.data.data.url) {
                throw new Error("Invalid response structure from uploadImage");
            }

            const { data: ImageResponse } = response;

            setData((prev) => ({
                ...prev,
                image: ImageResponse.data.url
            }));
        } catch (error) {
            console.error("Image upload error:", error);
            toast.error("Image upload failed. Please try again.");
        }
    };

    return (
        <AnimatePresence>
            <motion.section
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className='fixed top-0 bottom-0 left-0 right-0 p-4 bg-neutral-800 bg-opacity-60 flex items-center justify-center z-50'
            >
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className='bg-white max-w-4xl w-full p-6 rounded-xl shadow-2xl border border-green-100'
                >
                    <div className='flex items-center justify-between mb-4'>
                        <h1 className='text-2xl font-bold text-green-800'>Add New Category</h1>
                        <button
                            onClick={close}
                            className='p-2 rounded-full hover:bg-green-100 transition-colors'
                        >
                            <IoClose size={25} className='text-green-800' />
                        </button>
                    </div>

                    <form className='my-4 grid gap-4' onSubmit={handleSubmit}>
                        <div className='grid gap-2'>
                            <label htmlFor='categoryName' className='text-sm font-medium text-green-700'>
                                Category Name
                            </label>
                            <input
                                type='text'
                                id='categoryName'
                                placeholder='Enter category name'
                                value={data.name}
                                name='name'
                                onChange={handleOnChange}
                                className='w-full p-3 border border-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-green-50 transition-all'
                            />
                        </div>

                        <div className='grid gap-2'>
                            <p className='text-sm font-medium text-green-700'>Category Image</p>
                            <div className='flex gap-4 flex-col lg:flex-row items-center'>
                                <div className='border-2 border-dashed border-green-200 bg-green-50 h-36 w-full lg:w-36 flex items-center justify-center rounded-lg overflow-hidden'>
                                    {data.image ? (
                                        <img
                                            alt='category'
                                            src={data.image}
                                            className='w-full h-full object-cover'
                                        />
                                    ) : (
                                        <div className='flex flex-col items-center gap-2 text-green-500'>
                                            <FaImage size={24} />
                                            <p className='text-sm text-neutral-500'>No Image</p>
                                        </div>
                                    )}
                                </div>

                                <label htmlFor='uploadCategoryImage' className='cursor-pointer'>
                                    <div
                                        className={`
                                            ${!data.name ? "bg-gray-300 cursor-not-allowed" : "bg-green-500 hover:bg-green-600"}
                                            px-6 py-3 rounded-lg text-white font-semibold flex items-center gap-2 transition-all
                                        `}
                                    >
                                        <FaUpload size={18} />
                                        <span>Upload Image</span>
                                    </div>
                                    <input
                                        disabled={!data.name}
                                        onChange={handleUploadCategoryImage}
                                        type='file'
                                        id='uploadCategoryImage'
                                        className='hidden'
                                    />
                                </label>
                            </div>
                        </div>

                        <button
                            type='submit'
                            disabled={!data.name || !data.image}
                            className={`
                                ${data.name && data.image ? "bg-green-600 hover:bg-green-700" : "bg-gray-300 cursor-not-allowed"}
                                w-full py-3 rounded-lg text-white font-semibold flex items-center justify-center gap-2 transition-all
                            `}
                        >
                            {loading ? (
                                <div className='animate-spin rounded-full h-6 w-6 border-b-2 border-white'></div>
                            ) : (
                                "Add Category"
                            )}
                        </button>
                    </form>
                </motion.div>
            </motion.section>
        </AnimatePresence>
    );
};

export default UploadCategoryModel;
