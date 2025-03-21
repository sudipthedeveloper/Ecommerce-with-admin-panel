import { Avatar, Button, Divider, MenuItem, Typography } from '@mui/material'
import React, { useState } from 'react'
import toast from 'react-hot-toast'
import {
  HiOutlineClipboardList,
  HiOutlineCollection,
  HiOutlineExternalLink,
  HiOutlineLocationMarker,
  HiOutlineLogout,
  HiOutlineShoppingBag,
  HiOutlineTag,
  HiOutlineUpload
} from "react-icons/hi"
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import SummaryApi from '../common/SummaryApi'
import { logout } from '../store/userSlice'
import Axios from '../utils/Axios'
import AxiosToastError from '../utils/AxiosToastError'
import isAdmin from '../utils/isAdmin'

const UserMenu = ({ close }) => {
  const user = useSelector((state) => state.user)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true)
      const response = await Axios({
        ...SummaryApi.logout
      })
      if (response.data.success) {
        if (close) close()
        dispatch(logout())
        localStorage.clear()
        toast.success(response.data.message, {
          icon: '👋',
          style: {
            borderRadius: '10px',
            background: '#333',
            color: '#fff',
          },
        })
        navigate("/")
      }
    } catch (error) {
      AxiosToastError(error)
    } finally {
      setIsLoggingOut(false)
    }
  }

  const handleClose = () => {
    if (close) close()
  }

  // Generate a background color based on the first letter of the name
  const getAvatarColor = () => {
    const colors = ['#FF6B35', '#f3722c', '#f8961e', '#f9c74f', '#90be6d', '#43aa8b', '#4d908e', '#577590', '#277da1'];
    const letter = (user.name?.charAt(0) || user.mobile?.charAt(0) || 'U').toLowerCase();
    const index = letter.charCodeAt(0) % colors.length;
    return colors[index];
  }

  return (
    <div className="w-72 bg-white rounded-2xl shadow-xl p-5 animate-in slide-in-from-top duration-300 border border-gray-100">
      {/* Header with gradient background */}
      <div className="relative -mx-5 -mt-5 rounded-t-2xl bg-gradient-to-r from-green-500 to-cyan-200 p-5 mb-4">
        <div className="flex items-center gap-4">
          <Avatar
            sx={{
              bgcolor: getAvatarColor(),
              width: 48,
              height: 48,
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
            }}
            className="ring-2 ring-white"
          >
            {user.name?.charAt(0) || user.mobile?.charAt(0) || 'U'}
          </Avatar>
          <div className="text-gray-700">
            <Typography
              variant="subtitle1"
              className="font-bold"
            >
              {user.name || user.mobile}
            </Typography>
            <div className="flex items-center gap-2 mt-1">
              {user.role === "ADMIN" && (
                <span className="text-xs bg-white/20 backdrop-blur-sm text-white px-2 py-0.5 rounded-full font-medium">
                  Admin
                </span>
              )}
              <Link
                to="/dashboard/profile"
                onClick={handleClose}
                className="text-gray-600 hover:text-gray-800 transition-colors flex items-center gap-1 text-sm"
              >
                <span>View Profile</span>
                <HiOutlineExternalLink size={14} />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Subtitle */}


      {/* Menu Items with hover effects and icons */}
      <div className="grid gap-1.5 -mx-1.5">
        {isAdmin(user.role) && (
          <>
            <div className="px-2 py-1">
              <Typography variant="caption" className="text-gray-500 font-medium">
                Admin Controls
              </Typography>
            </div>
            <MenuItem
              component={Link}
              to="/dashboard/category"
              onClick={handleClose}
              className="rounded-xl hover:bg-orange-50 text-gray-700 hover:text-orange-600 transition-all duration-200 flex items-center gap-3 pl-3 group"
            >
              <HiOutlineTag size={18} className="text-gray-500 group-hover:text-orange-500 transition-colors" />
              <span>Category</span>
            </MenuItem>
            <MenuItem
              component={Link}
              to="/dashboard/subcategory"
              onClick={handleClose}
              className="rounded-xl hover:bg-orange-50 text-gray-700 hover:text-orange-600 transition-all duration-200 flex items-center gap-3 pl-3 group"
            >
              <HiOutlineCollection size={18} className="text-gray-500 group-hover:text-orange-500 transition-colors" />
              <span>Sub Category</span>
            </MenuItem>
            <MenuItem
              component={Link}
              to="/dashboard/upload-product"
              onClick={handleClose}
              className="rounded-xl hover:bg-orange-50 text-gray-700 hover:text-orange-600 transition-all duration-200 flex items-center gap-3 pl-3 group"
            >
              <HiOutlineUpload size={18} className="text-gray-500 group-hover:text-orange-500 transition-colors" />
              <span>Upload Product</span>
            </MenuItem>
            <MenuItem
              component={Link}
              to="/dashboard/getAllUsers"
              onClick={handleClose}
              className="rounded-xl hover:bg-orange-50 text-gray-700 hover:text-orange-600 transition-all duration-200 flex items-center gap-3 pl-3 group"
            >
              <HiOutlineTag size={18} className="text-gray-500 group-hover:text-orange-500 transition-colors" />
              <span>Clients</span>
            </MenuItem>
            <MenuItem
              component={Link}
              to="/dashboard/product"
              onClick={handleClose}
              className="rounded-xl hover:bg-orange-50 text-gray-700 hover:text-orange-600 transition-all duration-200 flex items-center gap-3 pl-3 group"
            >
              <HiOutlineClipboardList size={18} className="text-gray-500 group-hover:text-orange-500 transition-colors" />
              <span>Product</span>
            </MenuItem>

            <Divider className="my-2" />
          </>
        )}

        <div className="px-2 py-1">
          <Typography variant="caption" className="text-gray-500 font-medium">
            User Account
          </Typography>
        </div>

        <MenuItem
          component={Link}
          to="/dashboard/myorders"
          onClick={handleClose}
          className="rounded-xl hover:bg-orange-50 text-gray-700 hover:text-orange-600 transition-all duration-200 flex items-center gap-3 pl-3 group"
        >
          <HiOutlineShoppingBag size={18} className="text-gray-500 group-hover:text-orange-500 transition-colors" />
          <span>My Orders</span>
        </MenuItem>
        <MenuItem
          component={Link}
          to="/dashboard/address"
          onClick={handleClose}
          className="rounded-xl hover:bg-orange-50 text-gray-700 hover:text-orange-600 transition-all duration-200 flex items-center gap-3 pl-3 group"
        >
          <HiOutlineLocationMarker size={18} className="text-gray-500 group-hover:text-orange-500 transition-colors" />
          <span>Saved Addresses</span>
        </MenuItem>

        <Divider className="my-3" />

        <Button
          onClick={handleLogout}
          variant="outlined"
          disabled={isLoggingOut}
          fullWidth
          className="mt-1 normal-case text-gray-700 border border-gray-200 hover:bg-orange-50 hover:border-orange-500 hover:text-orange-600 transition-all duration-300 rounded-xl py-2.5 flex items-center justify-center gap-2 shadow-sm hover:shadow"
        >
          <HiOutlineLogout size={18} className={`${isLoggingOut ? 'animate-spin' : ''}`} />
          <span>{isLoggingOut ? 'Logging out...' : 'Log Out'}</span>
        </Button>
      </div>
    </div>
  )
}

export default UserMenu
