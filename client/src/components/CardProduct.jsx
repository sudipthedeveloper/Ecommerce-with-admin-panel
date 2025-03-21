import { Clock, Tag } from 'lucide-react'
import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { DisplayPriceInRupees } from '../utils/DisplayPriceInRupees'
import { pricewithDiscount } from '../utils/PriceWithDiscount'
import { valideURLConvert } from '../utils/valideURLConvert'
import AddToCartButton from './AddToCartButton'

const CardProduct = ({ data }) => {
  const url = `/product/${valideURLConvert(data.name)}-${data._id}`
  const [isHovered, setIsHovered] = useState(false)

  return (
    <Link
      to={url}
      className='relative group overflow-hidden border border-gray-200 hover:border-emerald-400 transition-all duration-300 py-3 lg:p-4 grid gap-2 lg:gap-3 min-w-36 lg:min-w-52 rounded-lg cursor-pointer bg-white shadow-sm hover:shadow-md'
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Discount Badge - Absolute positioned */}
      {Boolean(data.discount) && (
        <div className='absolute top-2 right-2 z-10 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-medium rounded-full py-1 px-2 text-xs shadow-sm'>
          <div className='flex items-center gap-1'>
            <Tag size={12} />
            <span>{data.discount}% OFF</span>
          </div>
        </div>
      )}

      {/* Image Container */}
      <div className='relative min-h-28 w-full h-36 lg:h-44 rounded-lg overflow-hidden group-hover:scale-105 transition-transform duration-300 bg-gray-50 flex items-center justify-center p-2'>
        <img
          src={data.image[0]}
          alt={data.name}
          className='w-full h-full object-contain transition-all duration-500 group-hover:scale-110'
        />

        {/* Overlay effect on hover */}
        <div className={`absolute inset-0 bg-black bg-opacity-5 transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}></div>
      </div>

      {/* Delivery Time Badge */}
      <div className='flex items-center gap-2 px-2 lg:px-0 mt-1'>
        <div className='rounded-full text-xs w-fit py-1 px-3 text-emerald-700 bg-emerald-50 flex items-center gap-1 border border-emerald-100'>
          <Clock size={12} className="text-emerald-600" />
          <span className="font-medium">10 min</span>
        </div>

        {/* Rating */}

      </div>

      {/* Product Name */}
      <div className='px-2 lg:px-1 font-semibold text-ellipsis text-sm lg:text-base line-clamp-2 text-gray-800 group-hover:text-emerald-700 transition-colors duration-300'>
        {data.name}
      </div>

      {/* Unit */}
      <div className='w-fit px-2 lg:px-1 text-xs lg:text-sm text-gray-500 bg-gray-50 rounded-full py-1 px-3 border border-gray-100'>
        {data.unit}
      </div>

      {/* Price and Add to Cart */}
      <div className='px-2 lg:px-1 flex items-center justify-between gap-2 lg:gap-3 mt-1'>
        <div className='flex flex-col'>
          <div className='text-emerald-800 font-bold text-base lg:text-lg'>
            {DisplayPriceInRupees(pricewithDiscount(data.price, data.discount))}
          </div>

          {Boolean(data.discount) && (
            <div className='text-xs text-gray-500 line-through'>
              {DisplayPriceInRupees(data.price)}
            </div>
          )}
        </div>

        <div className=''>
          {data.stock === 0 ? (
            <p className='text-red-500 text-xs lg:text-sm px-3 py-1 bg-red-50 rounded-full border border-red-100 font-medium'>Out of stock</p>
          ) : (
            <div className="transform transition-transform duration-300 hover:scale-105">
              <AddToCartButton data={data} />
            </div>
          )}
        </div>
      </div>

      {/* Stock indicator */}
      {data.stock > 0 && data.stock < 10 && (
        <div className='px-2 lg:px-1 text-xs text-orange-700'>
          Only {data.stock} left
        </div>
      )}
    </Link>
  )
}

export default CardProduct
