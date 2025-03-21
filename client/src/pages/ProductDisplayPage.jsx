import React, { useEffect, useRef, useState } from 'react';
import { FaAngleLeft, FaAngleRight } from "react-icons/fa6";
import { useParams } from 'react-router-dom';
import image2 from '../assets/Best_Prices_Offers.png';
import image1 from '../assets/minute_delivery.png';
import image3 from '../assets/Wide_Assortment.png';
import SummaryApi from '../common/SummaryApi';
import AddToCartButton from '../components/AddToCartButton';
import Axios from '../utils/Axios';
import AxiosToastError from '../utils/AxiosToastError';
import { DisplayPriceInRupees } from '../utils/DisplayPriceInRupees';
import { pricewithDiscount } from '../utils/PriceWithDiscount';

const ProductDisplayPage = () => {
  const params = useParams();
  const productId = params?.product?.split("-")?.slice(-1)[0];
  const [data, setData] = useState({ name: "", image: [], description: "", unit: "", price: 0, discount: 0, stock: 0 });
  const [image, setImage] = useState(0);
  const imageContainer = useRef();

  const fetchProductDetails = async () => {
    try {
      const response = await Axios({ ...SummaryApi.getProductDetails, data: { productId } });
      if (response.data.success) setData(response.data.data);
    } catch (error) {
      AxiosToastError(error);
    }
  };

  useEffect(() => {
    fetchProductDetails();
  }, [productId]);

  const handleScroll = (direction) => {
    const scrollAmount = direction === 'left' ? -100 : 100;
    if (imageContainer.current) {
      imageContainer.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <section className="container mx-auto p-4 lg:flex gap-6 animate-fade-in">
      {/* Left: Image Section */}
      <div className="lg:w-1/2 space-y-4">
        <div className="relative bg-white rounded-lg shadow-lg overflow-hidden h-64 lg:h-96 transition-transform duration-300 hover:scale-105">
          <img src={data.image && data.image[image]} alt={data.name} className="w-full h-full object-contain" />
        </div>

        {/* Image Thumbnails */}
        <div className="relative flex justify-center items-center">
          <button
            type="button"
            onClick={() => handleScroll('left')}
            className="absolute left-0 p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition-all"
          >
            <FaAngleLeft />
          </button>
          <div ref={imageContainer} className="flex gap-2 overflow-x-auto scrollbar-none py-2 w-3/4">
            {data.image && data.image.length > 0 && data.image.map((img, index) => (
              <img
                key={`${img}-${index}`}
                src={img}
                alt={`thumbnail-${index}`}
                onClick={() => setImage(index)}
                className={`w-16 h-16 object-contain rounded-md cursor-pointer transition-all duration-300 ${image === index ? 'ring-2 ring-green-500 scale-110' : 'hover:scale-105'}`}
              />
            ))}
          </div>
          <button
            type="button"
            onClick={() => handleScroll('right')}
            className="absolute right-0 p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition-all"
          >
            <FaAngleRight />
          </button>
        </div>
      </div>

      {/* Right: Product Details */}
      <div className="lg:w-1/2 space-y-4 animate-slide-up">
        <h2 className="text-2xl lg:text-3xl font-bold text-gray-800">{data.name}</h2>
        <p className="text-gray-600">{data.unit}</p>

        {/* Price Section */}
        <div className="flex items-center gap-3">
          <span className="text-xl lg:text-2xl font-semibold text-green-600 bg-green-50 px-3 py-1 rounded-md">
            {DisplayPriceInRupees(pricewithDiscount(data.price, data.discount))}
          </span>
          {data.discount > 0 && (
            <>
              <span className="text-gray-500 line-through">{DisplayPriceInRupees(data.price)}</span>
              <span className="text-green-600 font-bold">{data.discount}% OFF</span>
            </>
          )}
        </div>

        {/* Stock & Add to Cart */}
        {data.stock === 0 ? (
          <p className="text-red-500 font-semibold animate-pulse">Out of Stock</p>
        ) : (
          <div className="flex items-center">
            <AddToCartButton data={data} />
          </div>
        )}

        {/* Description */}
        <div className="space-y-2">
          <p className="font-semibold text-gray-700">Description</p>
          <p className="text-gray-600 text-sm">{data.description}</p>
        </div>

        {/* Why Shop Section */}
        <div className="space-y-4">
          <h3 className="font-semibold text-gray-700">Why Shop with Us?</h3>
          {[image1, image2, image3].map((img, idx) => (
            <div key={idx} className="flex items-center gap-3 hover:bg-gray-50 p-2 rounded-md transition-all">
              <img src={img} alt={`feature-${idx}`} className="w-12 h-12" />
              <div className="text-sm">
                <p className="font-semibold">{["Superfast Delivery", "Best Prices & Offers", "Wide Assortment"][idx]}</p>
                <p className="text-gray-600">{["Fast delivery from nearby stores.", "Best prices directly from manufacturers.", "Choose from 5000+ products."][idx]}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Additional Details */}
        {data?.more_details && (
          <div className="space-y-2 text-sm">
            {Object.entries(data.more_details).map(([key, value]) => (
              <div key={key}>
                <p className="font-semibold text-gray-700 capitalize">{key}</p>
                <p className="text-gray-600">{value}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default ProductDisplayPage;
