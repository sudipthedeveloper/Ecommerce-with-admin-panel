import React, { useEffect, useState } from "react";
import { FaBoxOpen } from "react-icons/fa";
import { IoSearchOutline } from "react-icons/io5";
import { MdNavigateBefore, MdNavigateNext } from "react-icons/md";
import SummaryApi from "../common/SummaryApi";
import Loading from "../components/Loading";
import ProductCardAdmin from "../components/ProductCardAdmin";
import Axios from "../utils/Axios";
import AxiosToastError from "../utils/AxiosToastError";

const ProductAdmin = () => {
  const [productData, setProductData] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [totalPageCount, setTotalPageCount] = useState(1);
  const [search, setSearch] = useState("");

  const fetchProductData = async () => {
    try {
      setLoading(true);
      const response = await Axios({
        ...SummaryApi.getProduct,
        data: {
          page: page,
          limit: 12,
          search: search,
        },
      });

      const { data: responseData } = response;

      if (responseData.success) {
        setTotalPageCount(responseData.totalNoPage);
        setProductData(responseData.data);
      }
    } catch (error) {
      AxiosToastError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductData();
  }, [page]);

  const handleNext = () => {
    if (page !== totalPageCount) {
      setPage((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (page > 1) {
      setPage((prev) => prev - 1);
    }
  };

  const handleOnChange = (e) => {
    const { value } = e.target;
    setSearch(value);
    setPage(1);
  };

  useEffect(() => {
    let flag = true;

    const interval = setTimeout(() => {
      if (flag) {
        fetchProductData();
        flag = false;
      }
    }, 300);

    return () => {
      clearTimeout(interval);
    };
  }, [search]);

  return (
    <section className="min-h-screen bg-green-50 py-6 px-4 md:px-8">
      {/* Header */}
      <div className="bg-white shadow-lg rounded-lg p-4 flex items-center justify-between border border-green-200">
        <h2 className="text-2xl font-bold text-green-700 flex items-center gap-2">
          <FaBoxOpen /> Products
        </h2>
        <div className="relative w-full max-w-sm">
          <input
            type="text"
            placeholder="Search products..."
            className="w-full py-2 pl-10 pr-4 rounded-lg border border-green-300 focus:ring-2 focus:ring-green-400 focus:outline-none"
            value={search}
            onChange={handleOnChange}
          />
          <IoSearchOutline className="absolute left-3 top-1/2 transform -translate-y-1/2 text-green-600 text-xl" />
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center py-10">
          <Loading />
        </div>
      )}

      {/* Product List */}
      <div className="mt-6 bg-white p-6 rounded-lg shadow-md border border-green-200">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {productData.map((p, index) => (
            <ProductCardAdmin key={index} data={p} fetchProductData={fetchProductData} />
          ))}
        </div>

        {/* Pagination Controls */}
        <div className="flex justify-between items-center mt-8">
          <button
            onClick={handlePrevious}
            className="flex items-center gap-2 px-4 py-2 border border-green-400 text-green-700 rounded-lg hover:bg-green-100 disabled:opacity-50"
            disabled={page <= 1}
          >
            <MdNavigateBefore /> Previous
          </button>
          <span className="text-green-800 font-semibold">
            Page {page} of {totalPageCount}
          </span>
          <button
            onClick={handleNext}
            className="flex items-center gap-2 px-4 py-2 border border-green-400 text-green-700 rounded-lg hover:bg-green-100 disabled:opacity-50"
            disabled={page >= totalPageCount}
          >
            Next <MdNavigateNext />
          </button>
        </div>
      </div>
    </section>
  );
};

export default ProductAdmin;
