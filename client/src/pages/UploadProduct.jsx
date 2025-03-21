import React, { useState } from 'react';
import { BiCategoryAlt } from "react-icons/bi";
import { BsFillInfoCircleFill } from "react-icons/bs";
import { FaBoxOpen, FaCloudUploadAlt, FaMoneyBillWave, FaPercent, FaTag } from "react-icons/fa";
import { HiOutlinePhotograph } from "react-icons/hi";
import { IoAddCircle, IoClose } from "react-icons/io5";
import { MdCategory, MdDelete, MdDescription } from "react-icons/md";
import { useSelector } from 'react-redux';
import SummaryApi from '../common/SummaryApi';
import AddFieldComponent from '../components/AddFieldComponent';
import Loading from '../components/Loading';
import ViewImage from '../components/ViewImage';
import Axios from '../utils/Axios';
import AxiosToastError from '../utils/AxiosToastError';
import successAlert from '../utils/SuccessAlert';
import uploadImage from '../utils/UploadImage';

const UploadProduct = () => {
  const [data, setData] = useState({
    name: "",
    image: [],
    category: [],
    subCategory: [],
    unit: "",
    stock: "",
    price: "",
    discount: "",
    description: "",
    more_details: {},
  });

  const [imageLoading, setImageLoading] = useState(false);
  const [ViewImageURL, setViewImageURL] = useState("");
  const [selectCategory, setSelectCategory] = useState("");
  const [selectSubCategory, setSelectSubCategory] = useState("");
  const [openAddField, setOpenAddField] = useState(false);
  const [fieldName, setFieldName] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const allCategory = useSelector(state => state.product.allCategory);
  const allSubCategory = useSelector(state => state.product.allSubCategory);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleUploadImage = async(e) => {
    const file = e.target.files[0];
    if(!file) return;

    setImageLoading(true);
    try {
      const response = await uploadImage(file);
      const { data: ImageResponse } = response;
      const imageUrl = ImageResponse.data.url;

      setData((prev) => ({
        ...prev,
        image: [...prev.image, imageUrl]
      }));
    } catch (error) {
      AxiosToastError(error);
    } finally {
      setImageLoading(false);
    }
  };

  const handleDeleteImage = (index) => {
    const newImages = [...data.image];
    newImages.splice(index, 1);
    setData((prev) => ({
      ...prev,
      image: newImages
    }));
  };

  const handleRemoveCategory = (index) => {
    const newCategories = [...data.category];
    newCategories.splice(index, 1);
    setData((prev) => ({
      ...prev,
      category: newCategories
    }));
  };

  const handleRemoveSubCategory = (index) => {
    const newSubCategories = [...data.subCategory];
    newSubCategories.splice(index, 1);
    setData((prev) => ({
      ...prev,
      subCategory: newSubCategories
    }));
  };

  const handleAddField = () => {
    if (!fieldName.trim()) return;

    setData((prev) => ({
      ...prev,
      more_details: {
        ...prev.more_details,
        [fieldName]: ""
      }
    }));
    setFieldName("");
    setOpenAddField(false);
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const response = await Axios({
        ...SummaryApi.createProduct,
        data: data
      });

      const { data: responseData } = response;
      if(responseData.success) {
        successAlert(responseData.message);
        setData({
          name: "",
          image: [],
          category: [],
          subCategory: [],
          unit: "",
          stock: "",
          price: "",
          discount: "",
          description: "",
          more_details: {},
        });
      }
    } catch (error) {
      AxiosToastError(error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="min-h-screen bg-gradient-to-br from-green-50 to-teal-50">
      <div className="p-4 bg-white shadow-md flex items-center justify-between border-l-4 border-green-500">
        <h2 className="text-xl font-semibold text-gray-800 flex items-center">
          <FaBoxOpen className="mr-2 text-green-600" />
          Upload Product
        </h2>
        <div className="text-sm text-gray-500">Fill all details for better product visibility</div>
      </div>

      <div className="container mx-auto py-6 px-4">
        <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-100">
          <form className="grid gap-6" onSubmit={handleSubmit}>
            <div className="grid md:grid-cols-2 gap-6">
              {/* Name Field */}
              <div className="space-y-2">
                <label htmlFor="name" className="font-medium text-gray-700 flex items-center">
                  <FaTag className="mr-2 text-green-600" />
                  Product Name
                </label>
                <input
                  id="name"
                  type="text"
                  placeholder="Enter product name"
                  name="name"
                  value={data.name}
                  onChange={handleChange}
                  required
                  className="w-full p-3 outline-none border border-gray-300 focus:border-green-500 rounded-lg bg-white transition duration-200 shadow-sm"
                />
              </div>

              {/* Unit Field */}
              <div className="space-y-2">
                <label htmlFor="unit" className="font-medium text-gray-700 flex items-center">
                  <BsFillInfoCircleFill className="mr-2 text-green-600" />
                  Unit Type
                </label>
                <input
                  id="unit"
                  type="text"
                  placeholder="e.g. kg, piece, liter"
                  name="unit"
                  value={data.unit}
                  onChange={handleChange}
                  required
                  className="w-full p-3 outline-none border border-gray-300 focus:border-green-500 rounded-lg bg-white transition duration-200 shadow-sm"
                />
              </div>
            </div>

            {/* Description Field */}
            <div className="space-y-2">
              <label htmlFor="description" className="font-medium text-gray-700 flex items-center">
                <MdDescription className="mr-2 text-green-600" />
                Product Description
              </label>
              <textarea
                id="description"
                placeholder="Enter detailed product description"
                name="description"
                value={data.description}
                onChange={handleChange}
                required
                rows={4}
                className="w-full p-3 outline-none border border-gray-300 focus:border-green-500 rounded-lg bg-white transition duration-200 shadow-sm resize-none"
              />
            </div>

            {/* Image Upload Section */}
            <div className="space-y-3">
              <p className="font-medium text-gray-700 flex items-center">
                <HiOutlinePhotograph className="mr-2 text-green-600" />
                Product Images
              </p>

              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <label htmlFor="productImage" className="col-span-1 bg-green-50 border-2 border-dashed border-green-300 rounded-lg flex justify-center items-center cursor-pointer h-40 hover:bg-green-100 transition duration-200">
                  <div className="text-center flex justify-center items-center flex-col p-4">
                    {imageLoading ?
                      <Loading /> :
                      <>
                        <FaCloudUploadAlt size={35} className="text-green-600 mb-2" />
                        <p className="text-green-800 font-medium">Upload Image</p>
                        <p className="text-xs text-gray-500 mt-1">Click or drag images here</p>
                      </>
                    }
                  </div>
                  <input
                    type="file"
                    id="productImage"
                    className="hidden"
                    accept="image/*"
                    onChange={handleUploadImage}
                  />
                </label>

                {/* Display Uploaded Images */}
                <div className="col-span-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {data.image.map((img, index) => (
                    <div key={img+index} className="relative group rounded-lg overflow-hidden shadow-sm border border-gray-200 bg-white h-40">
                      <img
                        src={img}
                        alt={`Product image ${index+1}`}
                        className="w-full h-full object-contain cursor-pointer p-2"
                        onClick={() => setViewImageURL(img)}
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300"></div>
                      <button
                        type="button"
                        onClick={() => handleDeleteImage(index)}
                        className="absolute bottom-2 right-2 p-2 bg-red-500 text-white rounded-full shadow-lg transform translate-y-10 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300"
                      >
                        <MdDelete />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Category Selection */}
              <div className="space-y-2">
                <label className="font-medium text-gray-700 flex items-center">
                  <MdCategory className="mr-2 text-green-600" />
                  Categories
                </label>
                <select
                  className="w-full p-3 outline-none border border-gray-300 focus:border-green-500 rounded-lg bg-white transition duration-200 shadow-sm"
                  value={selectCategory}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (!value) return;

                    const category = allCategory.find(el => el._id === value);
                    if (category && !data.category.some(c => c._id === category._id)) {
                      setData((prev) => ({
                        ...prev,
                        category: [...prev.category, category],
                      }));
                    }
                    setSelectCategory("");
                  }}
                >
                  <option value="">Select Category</option>
                  {allCategory.map((c) => (
                    <option key={c._id} value={c._id}>{c.name}</option>
                  ))}
                </select>

                <div className="flex flex-wrap gap-2 mt-3">
                  {data.category.map((c, index) => (
                    <div
                      key={c._id+index}
                      className="flex items-center gap-1 bg-green-100 text-green-800 py-1 px-3 rounded-full text-sm"
                    >
                      <span>{c.name}</span>
                      <button
                        type="button"
                        className="hover:text-red-500 transition-colors focus:outline-none"
                        onClick={() => handleRemoveCategory(index)}
                      >
                        <IoClose size={18} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Sub Category Selection */}
              <div className="space-y-2">
                <label className="font-medium text-gray-700 flex items-center">
                  <BiCategoryAlt className="mr-2 text-green-600" />
                  Sub Categories
                </label>
                <select
                  className="w-full p-3 outline-none border border-gray-300 focus:border-green-500 rounded-lg bg-white transition duration-200 shadow-sm"
                  value={selectSubCategory}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (!value) return;

                    const subCategory = allSubCategory.find(el => el._id === value);
                    if (subCategory && !data.subCategory.some(c => c._id === subCategory._id)) {
                      setData((prev) => ({
                        ...prev,
                        subCategory: [...prev.subCategory, subCategory]
                      }));
                    }
                    setSelectSubCategory("");
                  }}
                >
                  <option value="">Select Sub Category</option>
                  {allSubCategory.map((c) => (
                    <option key={c._id} value={c._id}>{c.name}</option>
                  ))}
                </select>

                <div className="flex flex-wrap gap-2 mt-3">
                  {data.subCategory.map((c, index) => (
                    <div
                      key={c._id+index}
                      className="flex items-center gap-1 bg-teal-100 text-teal-800 py-1 px-3 rounded-full text-sm"
                    >
                      <span>{c.name}</span>
                      <button
                        type="button"
                        className="hover:text-red-500 transition-colors focus:outline-none"
                        onClick={() => handleRemoveSubCategory(index)}
                      >
                        <IoClose size={18} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {/* Stock Field */}
              <div className="space-y-2">
                <label htmlFor="stock" className="font-medium text-gray-700 flex items-center">
                  <FaBoxOpen className="mr-2 text-green-600" />
                  Stock Quantity
                </label>
                <input
                  id="stock"
                  type="number"
                  placeholder="Available quantity"
                  name="stock"
                  value={data.stock}
                  onChange={handleChange}
                  required
                  min="0"
                  className="w-full p-3 outline-none border border-gray-300 focus:border-green-500 rounded-lg bg-white transition duration-200 shadow-sm"
                />
              </div>

              {/* Price Field */}
              <div className="space-y-2">
                <label htmlFor="price" className="font-medium text-gray-700 flex items-center">
                  <FaMoneyBillWave className="mr-2 text-green-600" />
                  Price
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                  <input
                    id="price"
                    type="number"
                    placeholder="Enter product price"
                    name="price"
                    value={data.price}
                    onChange={handleChange}
                    required
                    min="0"
                    step="0.01"
                    className="w-full p-3 pl-8 outline-none border border-gray-300 focus:border-green-500 rounded-lg bg-white transition duration-200 shadow-sm"
                  />
                </div>
              </div>

              {/* Discount Field */}
              <div className="space-y-2">
                <label htmlFor="discount" className="font-medium text-gray-700 flex items-center">
                  <FaPercent className="mr-2 text-green-600" />
                  Discount (%)
                </label>
                <div className="relative">
                  <input
                    id="discount"
                    type="number"
                    placeholder="Enter discount percentage"
                    name="discount"
                    value={data.discount}
                    onChange={handleChange}
                    required
                    min="0"
                    max="100"
                    className="w-full p-3 pr-8 outline-none border border-gray-300 focus:border-green-500 rounded-lg bg-white transition duration-200 shadow-sm"
                  />
                  <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">%</span>
                </div>
              </div>
            </div>

            {/* Dynamic Additional Fields */}
            {Object.keys(data.more_details).length > 0 && (
              <div className="border-t border-gray-200 pt-4 mt-2">
                <h3 className="font-medium text-gray-700 mb-4 flex items-center">
                  <BsFillInfoCircleFill className="mr-2 text-green-600" />
                  Additional Details
                </h3>
                <div className="grid md:grid-cols-2 gap-6">
                  {Object.keys(data.more_details).map((k, index) => (
                    <div key={k + index} className="space-y-2">
                      <label htmlFor={k} className="font-medium text-gray-700 capitalize">{k}</label>
                      <input
                        id={k}
                        type="text"
                        value={data.more_details[k]}
                        onChange={(e) => {
                          const value = e.target.value;
                          setData((prev) => ({
                            ...prev,
                            more_details: {
                              ...prev.more_details,
                              [k]: value
                            }
                          }));
                        }}
                        className="w-full p-3 outline-none border border-gray-300 focus:border-green-500 rounded-lg bg-white transition duration-200 shadow-sm"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Add Field Button */}
            <div className="flex justify-start">
              <button
                type="button"
                onClick={() => setOpenAddField(true)}
                className="flex items-center gap-2 bg-green-50 text-green-700 hover:bg-green-100 py-2 px-4 rounded-full font-medium border border-green-200 transition duration-200"
              >
                <IoAddCircle size={20} />
                Add Custom Field
              </button>
            </div>

            {/* Submit Button */}
            <div className="mt-6">
              <button
                type="submit"
                disabled={submitting}
                className={`w-full bg-green-600 hover:bg-green-700 text-white py-3 px-6 rounded-lg font-semibold shadow-md transition duration-300 flex justify-center items-center ${submitting ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {submitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </>
                ) : (
                  'Add Product'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Image Viewer Modal */}
      {ViewImageURL && (
        <ViewImage url={ViewImageURL} close={() => setViewImageURL("")} />
      )}

      {/* Add Field Modal */}
      {openAddField && (
        <AddFieldComponent
          value={fieldName}
          onChange={(e) => setFieldName(e.target.value)}
          submit={handleAddField}
          close={() => setOpenAddField(false)}
        />
      )}
    </section>
  );
};

export default UploadProduct;
