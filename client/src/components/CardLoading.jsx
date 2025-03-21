import React from 'react'

const CardLoading = () => {
  return (
    <div className="border border-gray-200 py-3 lg:py-5 px-4 lg:px-6 grid gap-3 lg:gap-4 min-w-40 lg:min-w-60 rounded-xl cursor-pointer bg-white shadow-sm animate-pulse">
      {/* Image placeholder */}
      <div className="min-h-32 lg:min-h-40 bg-gradient-to-r from-gray-100 to-gray-200 rounded-lg"></div>

      {/* Title placeholder */}
      <div className="h-6 lg:h-7 bg-gradient-to-r from-gray-100 to-gray-200 rounded-md w-3/4"></div>

      {/* Description placeholder */}
      <div className="h-4 lg:h-5 bg-gradient-to-r from-gray-100 to-gray-200 rounded-md w-full"></div>

      {/* Tag placeholder */}
      <div className="h-5 lg:h-6 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full w-1/3"></div>

      {/* Footer with two elements */}
      <div className="flex items-center justify-between gap-4 pt-2">
        <div className="h-6 lg:h-7 bg-gradient-to-r from-gray-100 to-gray-200 rounded-md w-1/4"></div>
        <div className="h-8 lg:h-9 bg-gradient-to-r from-blue-100 to-blue-200 rounded-lg w-1/3"></div>
      </div>
    </div>
  )
}

export default CardLoading
