import React from 'react';

const UserDetailsModal = ({ user, onClose }) => {
  if (!user) return null;

  const { userInfo, addresses, orders, summary } = user;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header with close button */}
        <div className="border-b sticky top-0 bg-white z-10">
          <div className="flex justify-between items-center p-6">
            <h2 className="text-2xl font-bold text-gray-800">User Details</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 focus:outline-none"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* User Profile Section */}
          <div className="flex flex-col md:flex-row md:items-center mb-8 pb-8 border-b">
            <div className="flex-shrink-0 mb-4 md:mb-0 md:mr-6">
              <img
                src={userInfo?.avatar || 'https://via.placeholder.com/100'}
                alt={userInfo?.name || 'User'}
                className="w-24 h-24 rounded-full object-cover border-4 border-blue-500"
              />
            </div>

            <div className="flex-grow">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-gray-800">{userInfo?.name || 'Unknown User'}</h1>
                  <p className="text-gray-600">{userInfo?.email || 'No email'}</p>
                  <p className="text-gray-600">Phone: {userInfo?.mobile || 'Not provided'}</p>
                </div>

                <div className="mt-4 md:mt-0">
                  <span className={`inline-block px-4 py-2 text-sm font-medium rounded-full ${
                    userInfo?.status === 'Active'
                      ? 'bg-green-100 text-green-800'
                      : userInfo?.status === 'Inactive'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {userInfo?.status || 'Unknown'}
                  </span>
                  <p className="text-gray-600 mt-2">Role: {userInfo?.role || 'USER'}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Email Verified</p>
                  <p className="text-lg font-bold text-blue-800">{userInfo?.emailVerified ? 'Yes' : 'No'}</p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Joined On</p>
                  <p className="text-lg font-bold text-purple-800">
                    {userInfo?.createdAt
                      ? new Date(userInfo.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })
                      : 'Unknown'
                    }
                  </p>
                </div>
                <div className="bg-indigo-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Last Login</p>
                  <p className="text-lg font-bold text-indigo-800">
                    {userInfo?.lastLogin
                      ? new Date(userInfo.lastLogin).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        }) + ' ' + new Date(userInfo.lastLogin).toLocaleTimeString('en-US', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })
                      : 'Never'
                    }
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary Section */}
          <div className="mb-8 pb-8 border-b">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Order Summary</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">Total Orders</p>
                <p className="text-2xl font-bold text-blue-800">{summary?.totalOrders || 0}</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">Total Spent</p>
                <p className="text-2xl font-bold text-green-800">${summary?.totalSpent.toFixed(2) || 0}</p>
              </div>
              <div className="bg-amber-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">Completed Payments</p>
                <p className="text-2xl font-bold text-amber-800">{summary?.paymentStatusBreakdown?.completed || 0}</p>
              </div>
              <div className="bg-orange-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">Pending Payments</p>
                <p className="text-2xl font-bold text-orange-800">{summary?.paymentStatusBreakdown?.pending || 0}</p>
              </div>
            </div>

            {/* Payment Method Breakdown */}
            <div className="mt-6">
              <h4 className="text-lg font-semibold text-gray-700 mb-3">Payment Methods</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-indigo-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Razorpay</p>
                  <p className="text-xl font-bold text-indigo-800">{summary?.paymentMethodBreakdown?.razorpay || 0}</p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Cash On Delivery</p>
                  <p className="text-xl font-bold text-purple-800">{summary?.paymentMethodBreakdown?.cashOnDelivery || 0}</p>
                </div>
                <div className="bg-pink-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Other Methods</p>
                  <p className="text-xl font-bold text-pink-800">{summary?.paymentMethodBreakdown?.other || 0}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Addresses Section */}
          <div className="mb-8 pb-8 border-b">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Saved Addresses</h3>
            {!addresses || addresses.length === 0 ? (
              <div className="bg-gray-50 p-4 rounded-lg text-center">
                <p className="text-gray-600">No addresses saved</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {addresses.map((address) => (
                  <div key={address._id} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-gray-800">{address.address_line}</p>
                        <p className="text-gray-600">{address.city}, {address.state}, {address.pincode}</p>
                        <p className="text-gray-600">{address.country}</p>
                        <p className="text-gray-600 mt-2">Mobile: {address.mobile}</p>
                      </div>
                      <span className={`px-2 py-1 text-xs rounded-full ${address.status ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                        {address.status ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Shopping Cart Section */}
          <div className="mb-8 pb-8 border-b">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Shopping Cart</h3>
            {!user.shoppingCart || user.shoppingCart.length === 0 ? (
              <div className="bg-gray-50 p-4 rounded-lg text-center">
                <p className="text-gray-600">Cart is empty</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-600">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="py-3 px-4">Product</th>
                      <th className="py-3 px-4">Price</th>
                      <th className="py-3 px-4">Quantity</th>
                      <th className="py-3 px-4 text-right">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {user.shoppingCart.map((item, index) => (
                      <tr key={item.productId || index} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4">{item.productDetails?.name || 'Unknown Product'}</td>
                        <td className="py-3 px-4">${item.productDetails?.price || 0}</td>
                        <td className="py-3 px-4">{item.quantity || 1}</td>
                        <td className="py-3 px-4 text-right">${(item.productDetails?.price * (item.quantity || 1)).toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-gray-50 font-medium">
                    <tr>
                      <td colSpan="3" className="py-3 px-4 text-right">Total Items:</td>
                      <td className="py-3 px-4 text-right">
                        {user.shoppingCart.reduce((total, item) => total + (item.quantity || 1), 0)}
                      </td>
                    </tr>
                    <tr>
                      <td colSpan="3" className="py-3 px-4 text-right">Cart Total:</td>
                      <td className="py-3 px-4 text-right">
                        ${user.shoppingCart.reduce((total, item) => {
                          return total + ((item.productDetails?.price || 0) * (item.quantity || 1));
                        }, 0).toFixed(2)}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            )}
          </div>

          {/* Orders Section */}
          <div>
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Order History</h3>
            {!orders || orders.length === 0 ? (
              <div className="bg-gray-50 p-4 rounded-lg text-center">
                <p className="text-gray-600">No orders found</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-600">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="py-3 px-4">Order ID</th>
                      <th className="py-3 px-4">Product</th>
                      <th className="py-3 px-4">Price</th>
                      <th className="py-3 px-4">Date</th>
                      <th className="py-3 px-4">Payment Method</th>
                      <th className="py-3 px-4">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order, index) => (
                      <tr key={order.orderId || index} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4 font-medium">{order.orderId || `Order ${index + 1}`}</td>
                        <td className="py-3 px-4">{order.productDetails?.name || 'Unknown Product'}</td>
                        <td className="py-3 px-4">${order.productDetails?.price || 0}</td>
                        <td className="py-3 px-4">
                          {order.createdAt
                            ? new Date(order.createdAt).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric'
                              })
                            : 'Unknown'
                          }
                        </td>
                        <td className="py-3 px-4">
                          {order.payment?.method === 'CASH ON DELIVERY' ? 'Cash On Delivery' :
                           order.payment?.method || 'Unknown'}
                        </td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            order.payment?.status === 'completed'
                              ? 'bg-green-200 text-green-800'
                              : order.payment?.status === 'pending'
                              ? 'bg-yellow-200 text-yellow-800'
                              : order.payment?.status === 'refunded'
                              ? 'bg-blue-200 text-blue-800'
                              : 'bg-red-200 text-red-800'
                          }`}>
                            {order.payment?.status || 'unknown'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDetailsModal;
