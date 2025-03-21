import {
  CheckCircle,
  CreditCard,
  DollarSign,
  Home,
  MapPin,
  Package,
  Phone,
  Plus,
  Tag,
  Truck,
  User
} from 'lucide-react';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import SummaryApi from '../common/SummaryApi';
import AddAddress from '../components/AddAddress';
import { useGlobalContext } from '../provider/GlobalProvider';
import Axios from '../utils/Axios';
import AxiosToastError from '../utils/AxiosToastError';
import { DisplayPriceInRupees } from '../utils/DisplayPriceInRupees';

const CheckoutPage = () => {
  const { notDiscountTotalPrice, totalPrice, totalQty, fetchCartItem, fetchOrder } = useGlobalContext();
  const [openAddress, setOpenAddress] = useState(false);
  const addressList = useSelector(state => state.addresses.addressList);
  const [selectAddress, setSelectAddress] = useState(0);
  const cartItemsList = useSelector(state => state.cartItem.cart);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  // Load Razorpay script
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handleCashOnDelivery = async() => {
    try {
      setIsLoading(true);
      toast.loading("Processing your order...");

      const response = await Axios({
        ...SummaryApi.CashOnDeliveryOrder,
        data: {
          list_items: cartItemsList,
          addressId: addressList[selectAddress]?._id,
          subTotalAmt: totalPrice,
          totalAmt: totalPrice,
        }
      });

      const { data: responseData } = response;

      if(responseData.success){
        toast.dismiss();
        toast.success(responseData.message);
        if(fetchCartItem){
          fetchCartItem();
        }
        if(fetchOrder){
          fetchOrder();
        }
        navigate('/success', {
          state: {
            text: "Order"
          }
        });
      }
    } catch (error) {
      toast.dismiss();
      AxiosToastError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRazorpayPayment = async() => {
    try {
      setIsLoading(true);
      toast.loading("Connecting to payment gateway...");

      // Create Razorpay order
      const response = await Axios({
        ...SummaryApi.payment_url,
        data: {
          list_items: cartItemsList,
          addressId: addressList[selectAddress]?._id,
          subTotalAmt: totalPrice,
          totalAmt: totalPrice,
        }
      });

      const { data: responseData } = response;
      toast.dismiss();

      if (!responseData.success) {
        throw new Error(responseData.message || "Failed to create payment order");
      }

      // Configure Razorpay options
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: responseData.order.amount,
        currency: responseData.order.currency,
        name: "Feelustration",
        description: "Purchase Payment",
        order_id: responseData.order.id,
        handler: async function (response) {
          try {
            toast.loading("Verifying payment...");
            // Verify payment on the backend
            const verifyResponse = await Axios({
              url: "/api/order/verify-payment",
              method: "POST",
              data: {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                addressId: addressList[selectAddress]?._id,
              }
            });

            if (verifyResponse.data.success) {
              toast.dismiss();
              toast.success("Payment successful!");

              if(fetchCartItem) {
                fetchCartItem();
              }
              if(fetchOrder) {
                fetchOrder();
              }

              navigate('/success', {
                state: {
                  text: "Order"
                }
              });
            } else {
              throw new Error("Payment verification failed");
            }
          } catch (error) {
            toast.dismiss();
            toast.error("Payment verification failed. Please contact support.");
            console.error("Payment verification failed:", error);
          }
        },
        prefill: {
          name: addressList[selectAddress]?.name || "",
          contact: addressList[selectAddress]?.mobile || "",
        },
        theme: {
          color: "#10b981"
        }
      };

      // Open Razorpay payment form
      const razorpay = new window.Razorpay(options);
      razorpay.open();

    } catch (error) {
      toast.dismiss();
      AxiosToastError(error);
    } finally {
      setIsLoading(false);
    }
  };

  // Calculate savings
  const savings = notDiscountTotalPrice - totalPrice;
  const savingsPercentage = Math.round((savings / notDiscountTotalPrice) * 100);

  return (
    <section className="bg-gradient-to-br from-green-50 to-emerald-50 min-h-screen py-10">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-green-800 mb-6 flex items-center">
            <Package className="mr-2" /> Complete Your Purchase
          </h1>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Left Side - Address Selection */}
            <div className="w-full lg:w-3/5">
              <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-6">
                <div className="bg-gradient-to-r from-green-600 to-emerald-500 px-6 py-4">
                  <h2 className="text-white text-xl font-semibold flex items-center">
                    <MapPin className="mr-2" /> Delivery Address
                  </h2>
                </div>

                <div className="p-6">
                  <div className="space-y-4">
                    {addressList.length > 0 ? (
                      addressList
                        .filter(address => address.status)
                        .map((address, index) => (
                          <label
                            key={index}
                            htmlFor={"address" + index}
                            className="block cursor-pointer transition-all duration-300"
                          >
                            <div className={`border-2 rounded-lg p-4 flex gap-4 transition-all duration-300 hover:bg-green-50 ${parseInt(selectAddress) === index ? 'border-green-500 bg-green-50' : 'border-gray-200'}`}>
                              <div className="pt-1">
                                <input
                                  id={"address" + index}
                                  type="radio"
                                  value={index}
                                  checked={parseInt(selectAddress) === index}
                                  onChange={(e) => setSelectAddress(e.target.value)}
                                  name="address"
                                  className="h-5 w-5 text-green-600 focus:ring-green-500 cursor-pointer"
                                />
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center mb-2">
                                  <User className="w-4 h-4 text-green-600 mr-2" />
                                  <p className="font-semibold text-gray-800">
                                    {address.name || "Address " + (index + 1)}
                                  </p>
                                </div>
                                <div className="grid gap-1 text-gray-600">
                                  <div className="flex items-start">
                                    <Home className="w-4 h-4 text-green-600 mr-2 mt-1 flex-shrink-0" />
                                    <p>{address.address_line}</p>
                                  </div>
                                  <div className="flex items-center">
                                    <MapPin className="w-4 h-4 text-green-600 mr-2 flex-shrink-0" />
                                    <p>
                                      {address.city}, {address.state}, {address.country} - {address.pincode}
                                    </p>
                                  </div>
                                  <div className="flex items-center">
                                    <Phone className="w-4 h-4 text-green-600 mr-2 flex-shrink-0" />
                                    <p>{address.mobile}</p>
                                  </div>
                                </div>
                                {parseInt(selectAddress) === index && (
                                  <div className="mt-2 text-green-600 font-medium flex items-center">
                                    <CheckCircle className="w-4 h-4 mr-2" />
                                    Delivering to this address
                                  </div>
                                )}
                              </div>
                            </div>
                          </label>
                        ))
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        <MapPin className="mx-auto h-12 w-12 text-gray-400 mb-3" />
                        <p>No addresses found. Please add a delivery address.</p>
                      </div>
                    )}

                    <div
                      onClick={() => setOpenAddress(true)}
                      className="h-16 border-2 border-dashed border-green-400 rounded-lg flex justify-center items-center cursor-pointer transition-all duration-300 hover:bg-green-50 group"
                    >
                      <Plus className="h-5 w-5 text-green-600 mr-2 group-hover:scale-110 transition-transform duration-300" />
                      <span className="font-medium text-green-700">Add New Address</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Delivery Info */}
              <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="bg-gradient-to-r from-green-600 to-emerald-500 px-6 py-4">
                  <h2 className="text-white text-xl font-semibold flex items-center">
                    <Truck className="mr-2" /> Delivery Information
                  </h2>
                </div>
                <div className="p-6">
                  <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                    <div className="flex items-start">
                      <div className="bg-green-100 rounded-full p-2 mr-4">
                        <Truck className="h-6 w-6 text-green-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-green-800">Free Delivery</h3>
                        <p className="text-gray-600">Your order qualifies for free delivery</p>
                        <p className="text-sm text-gray-500 mt-1">Estimated delivery: 3-5 business days</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Order Summary */}
            <div className="w-full lg:w-2/5">
              <div className="bg-white rounded-xl shadow-lg overflow-hidden sticky top-8">
                <div className="bg-gradient-to-r from-green-600 to-emerald-500 px-6 py-4">
                  <h2 className="text-white text-xl font-semibold flex items-center">
                    <Tag className="mr-2" /> Order Summary
                  </h2>
                </div>

                <div className="p-6">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center pb-4 border-b border-gray-100">
                      <p className="text-gray-600 flex items-center">
                        <Package className="w-4 h-4 mr-2 text-green-600" />
                        Items ({totalQty})
                      </p>
                      <div className="flex items-center gap-2">
                        <span className="line-through text-gray-400 text-sm">
                          {DisplayPriceInRupees(notDiscountTotalPrice)}
                        </span>
                        <span className="font-medium text-gray-800">
                          {DisplayPriceInRupees(totalPrice)}
                        </span>
                      </div>
                    </div>

                    {savings > 0 && (
                      <div className="flex justify-between items-center pb-4 border-b border-gray-100">
                        <p className="text-green-600 flex items-center font-medium">
                          <Tag className="w-4 h-4 mr-2" />
                          Savings
                        </p>
                        <div className="flex items-center">
                          <span className="font-medium text-green-600">
                            {DisplayPriceInRupees(savings)} ({savingsPercentage}% off)
                          </span>
                        </div>
                      </div>
                    )}

                    <div className="flex justify-between items-center pb-4 border-b border-gray-100">
                      <p className="text-gray-600 flex items-center">
                        <Truck className="w-4 h-4 mr-2 text-green-600" />
                        Delivery Charge
                      </p>
                      <p className="text-green-600 font-medium">Free</p>
                    </div>

                    <div className="flex justify-between items-center pt-2">
                      <p className="text-gray-800 font-semibold flex items-center">
                        <DollarSign className="w-4 h-4 mr-2 text-green-600" />
                        Grand Total
                      </p>
                      <p className="text-xl font-bold text-green-700">
                        {DisplayPriceInRupees(totalPrice)}
                      </p>
                    </div>
                  </div>

                  {/* Payment Buttons */}
                  <div className="mt-8 space-y-4">
                    <button
                      className={`w-full py-3 px-6 rounded-lg bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold flex items-center justify-center transform transition-all duration-300 hover:shadow-lg hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 ${isLoading ? 'opacity-75 cursor-not-allowed' : ''}`}
                      onClick={handleRazorpayPayment}
                      disabled={isLoading || !addressList[selectAddress]}
                    >
                      <CreditCard className="mr-2 h-5 w-5" />
                      Pay Online Now
                    </button>

                    <button
                      className={`w-full py-3 px-6 rounded-lg border-2 border-green-500 text-green-600 font-semibold flex items-center justify-center bg-white transition-all duration-300 hover:bg-green-50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 ${isLoading ? 'opacity-75 cursor-not-allowed' : ''}`}
                      onClick={handleCashOnDelivery}
                      disabled={isLoading || !addressList[selectAddress]}
                    >
                      <DollarSign className="mr-2 h-5 w-5" />
                      Cash on Delivery
                    </button>
                  </div>

                  {/* Secure Checkout Notice */}
                  <div className="mt-6 flex items-center justify-center text-sm text-gray-500">
                    <svg className="w-4 h-4 mr-1 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                    </svg>
                    Secure checkout powered by Razorpay
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {openAddress && (
        <AddAddress close={() => setOpenAddress(false)} />
      )}
    </section>
  );
};

export default CheckoutPage;
