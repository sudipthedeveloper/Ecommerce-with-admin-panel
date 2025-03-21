import { AnimatePresence, motion } from 'framer-motion'
import { AlertTriangle, ArrowRight, CheckCircle, CreditCard, ShoppingBag, Tag, Truck, X } from 'lucide-react'
import React, { useEffect } from 'react'
import toast from 'react-hot-toast'
import { useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import imageEmpty from '../assets/empty_cart.webp'
import { useGlobalContext } from '../provider/GlobalProvider'
import { DisplayPriceInRupees } from '../utils/DisplayPriceInRupees'
import { pricewithDiscount } from '../utils/PriceWithDiscount'
import AddToCartButton from './AddToCartButton'

const DisplayCartItem = ({ close }) => {
  const { notDiscountTotalPrice, totalPrice, totalQty } = useGlobalContext()
  const cartItem = useSelector(state => state.cartItem.cart)
  const user = useSelector(state => state.user)
  const navigate = useNavigate()

  const redirectToCheckoutPage = () => {
    if (user?._id) {
      navigate("/checkout")
      if (close) {
        close()
      }
      return
    }
    toast.error("Please login to continue", {
      icon: <AlertTriangle className="h-5 w-5 text-amber-500" />,
      style: {
        borderRadius: '10px',
        background: '#333',
        color: '#fff',
      },
    })
  }

  // Lock body scroll when cart is open
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = 'auto'
    }
  }, [])

  const savingsAmount = notDiscountTotalPrice - totalPrice

  // Animation variants
  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.3 } }
  }

  const cartVariants = {
    hidden: { x: '100%' },
    visible: {
      x: 0,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 30
      }
    },
    exit: {
      x: '100%',
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 30
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: i => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.3
      }
    })
  }

  return (
    <AnimatePresence>
      <motion.section
        className='fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex justify-end'
        initial="hidden"
        animate="visible"
        exit="hidden"
        variants={backdropVariants}
        onClick={(e) => e.target === e.currentTarget && close && close()}
      >
        <motion.div
          className='bg-white w-full max-w-md h-screen shadow-2xl flex flex-col'
          variants={cartVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className='flex items-center p-4 border-b border-gray-100 gap-3 justify-between'>
            <div className="flex items-center gap-2">
              <div className="bg-emerald-100 p-1.5 rounded-full">
                <ShoppingBag size={18} className="text-emerald-600" />
              </div>
              <h2 className='font-bold text-gray-800'>Your Cart</h2>
              {cartItem.length > 0 && (
                <div className="bg-emerald-500 text-white text-xs font-medium rounded-full h-5 min-w-5 flex items-center justify-center px-1.5">
                  {cartItem.length}
                </div>
              )}
            </div>
            <button
              onClick={close}
              className='h-8 w-8 rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors duration-200 text-gray-500 hover:text-gray-700'
              aria-label="Close cart"
            >
              <X size={18} />
            </button>
          </div>

          {/* Cart Contents */}
          <div className='flex-1 overflow-hidden flex flex-col bg-gray-50'>
            {/* Items section */}
            {cartItem.length > 0 ? (
              <div className="flex flex-col h-full">
                {/* Savings banner */}
                {savingsAmount > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className='mx-4 mt-4 mb-2 flex items-center justify-between px-4 py-3 bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-100 text-emerald-700 rounded-lg shadow-sm'
                  >
                    <div className="flex items-center gap-2">
                      <Tag size={16} className="text-emerald-500" />
                      <p className="text-sm font-medium">Your total savings</p>
                    </div>
                    <p className="font-bold">{DisplayPriceInRupees(savingsAmount)}</p>
                  </motion.div>
                )}

                {/* Scrollable items */}
                <div className='flex-1 overflow-y-auto px-4 py-2'>
                  <div className='rounded-xl shadow-sm border border-gray-100 bg-white p-4 grid gap-5 divide-y divide-gray-100'>
                    {cartItem.map((item, index) => (
                      <motion.div
                        key={item?._id + "cartItemDisplay"}
                        className='flex w-full gap-4 pt-4 first:pt-0'
                        custom={index}
                        initial="hidden"
                        animate="visible"
                        variants={itemVariants}
                      >
                        <div className='w-16 h-16 min-h-16 min-w-16 bg-gray-50 border border-gray-100 rounded-lg p-1 overflow-hidden'>
                          <img
                            src={item?.productId?.image[0]}
                            alt={item?.productId?.name}
                            className='w-full h-full object-contain transition-all duration-300 hover:scale-110'
                          />
                        </div>
                        <div className='flex-1 flex flex-col justify-between'>
                          <div>
                            <p className='text-sm font-medium text-gray-800 line-clamp-2'>{item?.productId?.name}</p>
                            <p className='text-xs text-gray-500 mt-0.5'>{item?.productId?.unit}</p>
                          </div>
                          <div className="flex items-end justify-between mt-1">
                            <div>
                              <div className='font-bold text-sm text-gray-900'>{DisplayPriceInRupees(pricewithDiscount(item?.productId?.price, item?.productId?.discount))}</div>
                              {item?.productId?.discount > 0 && (
                                <div className='flex items-center gap-2'>
                                  <span className='text-xs line-through text-gray-400'>{DisplayPriceInRupees(item?.productId?.price)}</span>
                                  <span className='text-xs bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded-full'>{item?.productId?.discount}% off</span>
                                </div>
                              )}
                            </div>
                            <div className="transform transition-transform hover:scale-105">
                              <AddToCartButton data={item?.productId} />
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Bill details */}
                <motion.div
                  className='bg-white border-t border-gray-100 p-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]'
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <h3 className='font-bold text-gray-800 mb-3 flex items-center gap-2'>
                    <CreditCard size={16} className="text-gray-600" />
                    Bill Details
                  </h3>
                  <div className='space-y-2 text-sm'>
                    <div className='flex justify-between items-center'>
                      <p className='text-gray-600'>Items total</p>
                      <div className='flex items-center gap-2'>
                        {notDiscountTotalPrice !== totalPrice && (
                          <span className='line-through text-gray-400 text-xs'>{DisplayPriceInRupees(notDiscountTotalPrice)}</span>
                        )}
                        <span className='font-medium'>{DisplayPriceInRupees(totalPrice)}</span>
                      </div>
                    </div>
                    <div className='flex justify-between items-center'>
                      <p className='text-gray-600'>Quantity total</p>
                      <p className='font-medium'>{totalQty} {totalQty === 1 ? 'item' : 'items'}</p>
                    </div>
                    <div className='flex justify-between items-center'>
                      <p className='text-gray-600'>Delivery Charge</p>
                      <p className='text-emerald-600 font-medium flex items-center gap-1'>
                        <Truck size={14} />
                        Free
                      </p>
                    </div>
                    <div className='border-t border-gray-100 pt-2 mt-2 font-bold flex items-center justify-between'>
                      <p className='text-gray-800'>Grand total</p>
                      <p className='text-emerald-700'>{DisplayPriceInRupees(totalPrice)}</p>
                    </div>
                  </div>
                </motion.div>

                {/* Checkout button */}
                <div className='p-4 pt-2'>
                  <motion.button
                    onClick={redirectToCheckoutPage}
                    className='w-full bg-gradient-to-r from-emerald-600 to-green-500 hover:from-emerald-700 hover:to-green-600 text-white font-bold py-3.5 px-4 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-between gap-2 overflow-hidden group'
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <span className="font-bold text-lg">{DisplayPriceInRupees(totalPrice)}</span>
                    <div className="flex items-center">
                      <span className="mr-1">Proceed to Checkout</span>
                      <ArrowRight size={18} className="transition-transform duration-300 group-hover:translate-x-1" />
                    </div>
                  </motion.button>

                  <p className="text-center text-xs text-gray-500 mt-3 flex items-center justify-center gap-1">
                    <CheckCircle size={12} className="text-emerald-500" />
                    Secure payment & fast delivery
                  </p>
                </div>
              </div>
            ) : (
              <motion.div
                className='flex-1 flex flex-col items-center justify-center p-6 text-center'
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <div className="w-64 h-64 mb-6">
                  <img
                    src={imageEmpty}
                    alt="Empty cart"
                    className='w-full h-full object-contain'
                  />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Your cart is empty</h3>
                <p className="text-gray-500 mb-6">Add items to your cart to see them here</p>
                <Link
                  onClick={close}
                  to="/"
                  className='inline-flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-green-500 hover:from-emerald-700 hover:to-green-600 text-white font-bold py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300'
                >
                  <ShoppingBag size={18} />
                  Shop Now
                </Link>
              </motion.div>
            )}
          </div>
        </motion.div>
      </motion.section>
    </AnimatePresence>
  )
}

export default DisplayCartItem
