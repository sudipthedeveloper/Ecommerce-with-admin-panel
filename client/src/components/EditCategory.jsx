import { AlertCircle, ImagePlus, Save, Upload, X } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import SummaryApi from '../common/SummaryApi';
import Axios from '../utils/Axios';
import AxiosToastError from '../utils/AxiosToastError';
import uploadImage from '../utils/UploadImage';

const EditCategory = ({ close, fetchData, data: CategoryData }) => {
    const [data, setData] = useState({
        _id: CategoryData?._id || '',
        name: CategoryData?.name || '',
        image: CategoryData?.image || ''
    });
    const [loading, setLoading] = useState(false);
    const [uploadLoading, setUploadLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        // Animation for modal entrance
        setTimeout(() => setShowModal(true), 50);

        // Add event listener for escape key
        const handleEscape = (e) => {
            if (e.key === 'Escape') close();
        };
        window.addEventListener('keydown', handleEscape);

        return () => window.removeEventListener('keydown', handleEscape);
    }, [close]);

    const handleOnChange = (e) => {
        const { name, value } = e.target;
        setData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!data.name.trim()) {
            toast.error('Category name is required');
            return;
        }

        if (!data.image) {
            toast.error('Please upload an image');
            return;
        }

        try {
            setLoading(true);
            const response = await Axios({
                ...SummaryApi.updateCategory,
                data: data
            });
            const { data: responseData } = response;

            if (responseData.success) {
                toast.success(responseData.message);
                setShowModal(false);
                setTimeout(() => {
                    close();
                    fetchData();
                }, 300);
            }
        } catch (error) {
            AxiosToastError(error);
        } finally {
            setLoading(false);
        }
    };

    const handleUploadCategoryImage = async (e) => {
        const file = e.target.files[0];

        if (!file) return;

        // Validate file type
        const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml'];
        if (!allowedTypes.includes(file.type)) {
            toast.error('Please upload a valid image (JPEG, PNG, WEBP, SVG)');
            return;
        }

        try {
            setUploadLoading(true);
            const response = await uploadImage(file);

            // Safely access the URL property
            if (response?.data?.data?.url) {
                setData((prev) => ({
                    ...prev,
                    image: response.data.data.url
                }));
                toast.success('Image uploaded successfully');
            } else {
                throw new Error('Invalid response format');
            }
        } catch (error) {
            console.error('Upload error:', error);
            toast.error('Failed to upload image');
        } finally {
            setUploadLoading(false);
        }
    };

    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget) {
            setShowModal(false);
            setTimeout(close, 300);
        }
    };

    return (
        <section
            className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 transition-all duration-300"
            onClick={handleBackdropClick}
        >
            <div className={`bg-white max-w-2xl w-full rounded-2xl shadow-2xl overflow-hidden transform transition-all duration-300 ${showModal ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
                {/* Header */}
                <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-4 flex items-center justify-between">
                    <h1 className="font-bold text-white text-xl flex items-center">
                        <Save className="mr-2 h-5 w-5" />
                        Update Category
                    </h1>
                    <button
                        onClick={() => {
                            setShowModal(false);
                            setTimeout(close, 300);
                        }}
                        className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-1 transition-all duration-200 transform hover:rotate-90"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6">
                    <form className="space-y-5" onSubmit={handleSubmit}>
                        {/* Name Input */}
                        <div className="space-y-2">
                            <label htmlFor="categoryName" className="block text-sm font-medium text-gray-700 flex items-center">
                                Category Name <span className="text-red-500 ml-1">*</span>
                            </label>
                            <div className="relative rounded-md shadow-sm">
                                <input
                                    type="text"
                                    id="categoryName"
                                    placeholder="Enter category name"
                                    value={data.name}
                                    name="name"
                                    onChange={handleOnChange}
                                    className="block w-full pl-4 pr-10 py-3 border border-gray-200 rounded-lg focus:ring-green-500 focus:border-green-500 transition-all duration-200 outline-none"
                                    required
                                />
                                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                    <span className="text-green-500">
                                        <AlertCircle className={`h-5 w-5 ${!data.name ? 'text-red-400' : 'text-green-500'}`} />
                                    </span>
                                </div>
                            </div>
                            {!data.name && <p className="text-red-500 text-xs mt-1">Category name is required</p>}
                        </div>

                        {/* Image Upload */}
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700 flex items-center">
                                Category Image <span className="text-red-500 ml-1">*</span>
                            </label>
                            <div className="flex flex-col md:flex-row gap-5 items-center">
                                <div className={`border-2 rounded-lg p-1 h-48 w-full md:w-48 flex items-center justify-center overflow-hidden group transition-all duration-300 ${data.image ? 'border-green-200 bg-green-50' : 'border-gray-200 bg-gray-50'}`}>
                                    {data.image ? (
                                        <div className="relative w-full h-full">
                                            <img
                                                alt="category"
                                                src={data.image}
                                                className="w-full h-full object-contain rounded group-hover:scale-105 transition-transform duration-300"
                                            />
                                            <div className="absolute inset-0 bg-black bg-opacity-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                                <button
                                                    type="button"
                                                    onClick={() => setData(prev => ({ ...prev, image: '' }))}
                                                    className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors duration-200"
                                                >
                                                    <X size={16} />
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="text-center p-4">
                                            <ImagePlus className="h-12 w-12 mx-auto text-gray-400" />
                                            <p className="text-sm text-gray-500 mt-2">No image selected</p>
                                        </div>
                                    )}
                                </div>

                                <div className="space-y-3 flex-1">
                                    <label htmlFor="uploadCategoryImage" className="w-full">
                                        <div className={`
                                            flex items-center justify-center px-4 py-3 rounded-lg cursor-pointer border-2 transition-all duration-200
                                            ${!data.name
                                                ? "bg-gray-100 border-gray-200 cursor-not-allowed"
                                                : uploadLoading
                                                    ? "bg-green-50 border-green-200"
                                                    : "border-green-500 text-green-600 hover:bg-green-50"
                                            }
                                        `}>
                                            {uploadLoading ? (
                                                <div className="flex items-center">
                                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                    </svg>
                                                    <span>Uploading...</span>
                                                </div>
                                            ) : (
                                                <div className="flex items-center">
                                                    <Upload className="h-5 w-5 mr-2" />
                                                    <span>Upload Image</span>
                                                </div>
                                            )}
                                        </div>
                                        <input
                                            disabled={!data.name || uploadLoading}
                                            onChange={handleUploadCategoryImage}
                                            type="file"
                                            id="uploadCategoryImage"
                                            className="hidden"
                                            accept=".jpg,.jpeg,.png,.webp,.svg"
                                        />
                                    </label>

                                    <div className="text-xs text-gray-500">
                                        <p>Accepted formats: JPEG, PNG, WEBP, SVG</p>
                                        <p>Max size: 5MB</p>
                                    </div>

                                    {!data.image && <p className="text-red-500 text-xs">Category image is required</p>}
                                </div>
                            </div>
                        </div>

                        {/* Buttons */}
                        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-100">
                            <button
                                type="button"
                                onClick={() => {
                                    setShowModal(false);
                                    setTimeout(close, 300);
                                }}
                                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                            >
                                Cancel
                            </button>

                            <button
                                type="submit"
                                disabled={!data.name || !data.image || loading}
                                className={`
                                    px-6 py-2 rounded-lg font-medium transition-all duration-200 flex items-center
                                    ${(!data.name || !data.image || loading)
                                        ? "bg-gray-300 cursor-not-allowed text-gray-500"
                                        : "bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-md hover:shadow-lg transform hover:-translate-y-1"
                                    }
                                `}
                            >
                                {loading ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Updating...
                                    </>
                                ) : (
                                    <>
                                        <Save className="h-5 w-5 mr-2" />
                                        Update Category
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </section>
    );
};

export default EditCategory;
