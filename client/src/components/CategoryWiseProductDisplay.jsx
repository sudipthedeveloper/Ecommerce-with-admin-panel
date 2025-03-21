import { ChevronLeft, ChevronRight, Leaf, RefreshCw, ShoppingBag } from 'lucide-react'
import React, { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import SummaryApi from '../common/SummaryApi'
import Axios from '../utils/Axios'
import AxiosToastError from '../utils/AxiosToastError'
import { valideURLConvert } from '../utils/valideURLConvert'
import CardLoading from './CardLoading'
import CardProduct from './CardProduct'

const CategoryWiseProductDisplay = ({ id, name }) => {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  const [isScrollable, setIsScrollable] = useState(false)
  const containerRef = useRef()
  const subCategoryData = useSelector(state => state.product.allSubCategory)
  const loadingCardNumber = new Array(6).fill(null)

  const fetchCategoryWiseProduct = async () => {
    try {
      setLoading(true)
      const response = await Axios({
        ...SummaryApi.getProductByCategory,
        data: {
          id: id
        }
      })
      const { data: responseData } = response
      if (responseData.success) {
        setData(responseData.data)
      }
    } catch (error) {
      AxiosToastError(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCategoryWiseProduct()
  }, [])

  useEffect(() => {
    const checkScrollable = () => {
      if (containerRef.current) {
        setIsScrollable(containerRef.current.scrollWidth > containerRef.current.clientWidth)
      }
    }

    checkScrollable()
    window.addEventListener('resize', checkScrollable)

    return () => {
      window.removeEventListener('resize', checkScrollable)
    }
  }, [data])

  const handleScrollRight = () => {
    containerRef.current.scrollLeft += 300
  }

  const handleScrollLeft = () => {
    containerRef.current.scrollLeft -= 300
  }

  const handleRedirectProductListpage = () => {
    const subcategory = subCategoryData.find(sub => {
      const filterData = sub.category.some(c => {
        return c._id == id
      })
      return filterData ? true : null
    })
    const url = `/${valideURLConvert(name)}-${id}/${valideURLConvert(subcategory?.name)}-${subcategory?._id}`
    return url
  }

  const redirectURL = handleRedirectProductListpage()

  const refreshData = () => {
    fetchCategoryWiseProduct()
  }

  return (
    <div className="relative py-6 bg-gradient-to-r from-green-50 to-emerald-50 shadow-sm rounded-lg mb-8">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-400 to-emerald-500 rounded-t-lg"></div>

      {/* Category Header */}
      <div className='container mx-auto px-4 sm:px-6 flex items-center justify-between gap-4 mb-4'>
        <div className="flex items-center gap-2">
          <div className="bg-emerald-100 p-2 rounded-lg">
            <Leaf className="text-emerald-600 h-5 w-5" />
          </div>
          <h3 className='font-bold text-lg md:text-xl text-gray-800 group-hover:text-emerald-700 transition-colors'>
            {name}
          </h3>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={refreshData}
            className="p-2 text-emerald-600 hover:text-emerald-700 transition-colors"
            title="Refresh"
          >
            <RefreshCw className="h-4 w-4" />
          </button>

          <Link
            to={redirectURL}
            className='flex items-center gap-1 px-4 py-2 bg-white text-emerald-600 hover:text-emerald-800 font-medium text-sm rounded-full border border-emerald-200 hover:border-emerald-300 transition-all shadow-sm hover:shadow'
          >
            <span>See All</span>
            <ShoppingBag className="h-4 w-4" />
          </Link>
        </div>
      </div>

      {/* Products Carousel */}
      <div className='relative'>
        {/* Left Arrow */}
        {isScrollable && (
          <button
            onClick={handleScrollLeft}
            className='absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-white hover:bg-emerald-50 text-emerald-700 shadow-lg p-3 rounded-full border border-emerald-100 transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:ring-opacity-50 hidden md:flex items-center justify-center'
            aria-label="Scroll left"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
        )}

        {/* Products Container */}
        <div
          className='flex gap-4 md:gap-6 lg:gap-6 container mx-auto px-4 sm:px-6 overflow-x-auto scrollbar-none scroll-smooth py-2'
          ref={containerRef}
          style={{ scrollBehavior: 'smooth', WebkitOverflowScrolling: 'touch', msOverflowStyle: 'none' }}
        >
          {loading && loadingCardNumber.map((_, index) => (
            <div className="min-w-[220px] transform transition-transform" key={"CategorywiseProductDisplay123" + index}>
              <CardLoading />
            </div>
          ))}

          {data.map((p, index) => (
            <div
              className={`min-w-[220px] transform transition-transform duration-300 ${
                index === 0 ? 'origin-left hover:scale-102' :
                index === data.length - 1 ? 'origin-right hover:scale-102' : 'hover:scale-102'
              }`}
              key={p._id + "CategorywiseProductDisplay" + index}
            >
              <CardProduct data={p} />
            </div>
          ))}

          {data.length === 0 && !loading && (
            <div className="flex flex-col items-center justify-center w-full py-12 px-4">
              <div className="bg-emerald-50 p-6 rounded-full mb-4">
                <ShoppingBag className="h-10 w-10 text-emerald-300" />
              </div>
              <p className="text-gray-500 text-center">No products available in this category</p>
            </div>
          )}
        </div>

        {/* Right Arrow */}
        {isScrollable && (
          <button
            onClick={handleScrollRight}
            className='absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-white hover:bg-emerald-50 text-emerald-700 shadow-lg p-3 rounded-full border border-emerald-100 transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:ring-opacity-50 hidden md:flex items-center justify-center'
            aria-label="Scroll right"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Bottom Decorative Element */}
      <div className="flex justify-center mt-4">
        <div className="flex space-x-1">
          {[1, 2, 3, 4, 5].map((dot) => (
            <div key={dot} className={`h-1.5 w-1.5 rounded-full ${dot === 1 ? 'bg-emerald-500' : 'bg-emerald-200'}`}></div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default CategoryWiseProductDisplay
