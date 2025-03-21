import React, { useEffect, useState } from 'react';
import SummaryApi from '../common/SummaryApi';
import Loading from '../components/Loading';
import UserDetailsModal from '../components/UserDetailedModal';
import Axios from '../utils/Axios';
import AxiosToastError from '../utils/AxiosToastError';

const AllUsersDashboard = () => {
  const [usersData, setUsersData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);

  // Fetch data from the API using SummaryApi
  const fetchUsersData = async () => {
    try {
      setLoading(true);
      const response = await Axios({
        ...SummaryApi.getAllUser, // Use the getAllUsers endpoint from SummaryApi
      });

      const { data: responseData } = response;

      if (responseData.success) {
        setUsersData(responseData.data);
      } else {
        // Handle unsuccessful response
        setError(responseData.message || 'Failed to fetch users data');
      }
    } catch (error) {
      AxiosToastError(error);
      setError('Failed to fetch users data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsersData();
  }, []);

  // Function to open the user details modal
  const openUserDetails = (user) => {
    setSelectedUser(user);
  };

  // Function to close the user details modal
  const closeUserDetails = () => {
    setSelectedUser(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <Loading />
      </div>
    );
  }

  if (error || !usersData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-lg shadow-lg">
          <p>{error || "No user data available"}</p>
        </div>
      </div>
    );
  }

  // Ensure we have the expected data structure before rendering
  const totalUsers = usersData.totalUsers || 0;
  const users = usersData.users || [];

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Admin Users Dashboard</h1>
        <p className="text-gray-600 mt-2">Total Users: {totalUsers}</p>
      </div>

      {/* Users Grid */}
      {users.length === 0 ? (
        <div className="bg-white rounded-xl shadow-lg p-6 text-center">
          <p className="text-gray-600">No users found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {users.map((user, index) => (
            <div
              key={user.userInfo?._id || index}
              className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300"
            >
              {/* User Info */}
              <div className="flex items-center space-x-4">
                <img
                  src={user.userInfo?.avatar || 'https://via.placeholder.com/50'}
                  alt={user.userInfo?.name || 'User'}
                  className="w-12 h-12 rounded-full object-cover border-2 border-blue-500"
                />
                <div>
                  <h2 className="text-xl font-semibold text-gray-800">{user.userInfo?.name || 'Unknown User'}</h2>
                  <p className="text-sm text-gray-500">{user.userInfo?.email || 'No email'}</p>
                </div>
              </div>

              {/* User Status */}
              <div className="mt-4">
                <span
                  className={`inline-block px-3 py-1 text-sm font-medium rounded-full ${
                    user.userInfo?.status === 'Active'
                      ? 'bg-green-100 text-green-800'
                      : user.userInfo?.status === 'Inactive'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {user.userInfo?.status || 'Unknown'}
                </span>
                <span className="ml-2 px-3 py-1 text-sm font-medium rounded-full bg-gray-100 text-gray-800">
                  {user.userInfo?.role || 'USER'}
                </span>
              </div>

              {/* Summary Stats */}
              <div className="mt-6 grid grid-cols-2 gap-4">
                <div className="bg-blue-50 p-3 rounded-lg">
                  <p className="text-sm text-gray-600">Total Orders</p>
                  <p className="text-lg font-bold text-blue-800">{user.summary?.totalOrders || 0}</p>
                </div>
                <div className="bg-green-50 p-3 rounded-lg">
                  <p className="text-sm text-gray-600">Total Spent</p>
                  <p className="text-lg font-bold text-green-800">${user.summary?.totalSpent.toFixed(2) || 0}</p>
                </div>
              </div>

              {/* Payment Stats */}
              <div className="mt-4">
                <h3 className="text-lg font-semibold text-gray-700 mb-2">Payment Stats</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-indigo-50 p-2 rounded">
                    <p className="text-xs text-gray-600">Completed</p>
                    <p className="font-bold text-indigo-700">
                      {user.summary?.paymentStatusBreakdown?.completed || 0}
                    </p>
                  </div>
                  <div className="bg-amber-50 p-2 rounded">
                    <p className="text-xs text-gray-600">Pending</p>
                    <p className="font-bold text-amber-700">
                      {user.summary?.paymentStatusBreakdown?.pending || 0}
                    </p>
                  </div>
                </div>
              </div>

              {/* Orders Table */}
              <div className="mt-6">
                <h3 className="text-lg font-semibold text-gray-700 mb-2">Recent Orders</h3>
                {!user.orders || user.orders.length === 0 ? (
                  <p className="text-gray-500 text-sm">No recent orders</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-600">
                      <thead className="bg-gray-100">
                        <tr>
                          <th className="py-2 px-3">Order ID</th>
                          <th className="py-2 px-3">Payment Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {user.orders.slice(0, 3).map((order, orderIndex) => (
                          <tr key={order.orderId || orderIndex} className="border-b hover:bg-gray-50">
                            <td className="py-2 px-3">{order.orderId || `Order ${orderIndex + 1}`}</td>
                             <td className="py-2 px-3">
                              <span
                                className={`px-2 py-1 rounded-full text-xs ${
                                  order.payment?.status === 'completed'
                                    ? 'bg-green-200 text-green-800'
                                    : order.payment?.status === 'pending'
                                    ? 'bg-yellow-200 text-yellow-800'
                                    : order.payment?.status === 'refunded'
                                    ? 'bg-blue-200 text-blue-800'
                                    : 'bg-red-200 text-red-800'
                                }`}
                              >
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

              {/* User Details */}
              <div className="mt-4 text-sm text-gray-600">
                <p>Mobile: {user.userInfo?.mobile || 'Not provided'}</p>
                <p>Email Verified: {user.userInfo?.emailVerified ? 'Yes' : 'No'}</p>
                <p>Joined: {user.userInfo?.createdAt ? new Date(user.userInfo.createdAt).toLocaleDateString() : 'Unknown'}</p>
                <p>Last Login: {user.userInfo?.lastLogin ? new Date(user.userInfo.lastLogin).toLocaleDateString() : 'Never'}</p>
              </div>

              {/* View Details Button */}
              <button
                className="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors duration-300"
                onClick={() => openUserDetails(user)}
              >
                View Full Details
              </button>
            </div>
          ))}
        </div>
      )}

      {/* User Details Modal */}
      {selectedUser && (
        <UserDetailsModal user={selectedUser} onClose={closeUserDetails} />
      )}
    </div>
  );
};

export default AllUsersDashboard;
