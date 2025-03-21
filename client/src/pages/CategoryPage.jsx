import { Edit, Grid, List, PlusCircle, RefreshCw, Search, Trash2 } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import SummaryApi from '../common/SummaryApi';
import CofirmBox from '../components/CofirmBox';
import EditCategory from '../components/EditCategory';
import Loading from '../components/Loading';
import NoData from '../components/NoData';
import UploadCategoryModel from '../components/UploadCategoryModel';
import Axios from '../utils/Axios';
import AxiosToastError from '../utils/AxiosToastError';

const CategoryPage = () => {
    const [openUploadCategory, setOpenUploadCategory] = useState(false);
    const [loading, setLoading] = useState(false);
    const [categoryData, setCategoryData] = useState([]);
    const [openEdit, setOpenEdit] = useState(false);
    const [editData, setEditData] = useState({
        name: "",
        image: "",
    });
    const [openConfimBoxDelete, setOpenConfirmBoxDelete] = useState(false);
    const [deleteCategory, setDeleteCategory] = useState({
        _id: ""
    });
    const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
    const [searchTerm, setSearchTerm] = useState('');
    const [refreshing, setRefreshing] = useState(false);

    const fetchCategory = async() => {
        try {
            setLoading(true);
            const response = await Axios({
                ...SummaryApi.getCategory
            });
            const { data: responseData } = response;

            if(responseData.success) {
                setCategoryData(responseData.data);
            }
        } catch (error) {
            toast.error("Failed to load categories");
        } finally {
            setLoading(false);
        }
    };

    const refreshData = async() => {
        setRefreshing(true);
        await fetchCategory();
        setTimeout(() => {
            setRefreshing(false);
        }, 600);
    };

    useEffect(() => {
        fetchCategory();
    }, []);

    const handleDeleteCategory = async() => {
        try {
            const response = await Axios({
                ...SummaryApi.deleteCategory,
                data: deleteCategory
            });

            const { data: responseData } = response;

            if(responseData.success) {
                toast.success(responseData.message);
                fetchCategory();
                setOpenConfirmBoxDelete(false);
            }
        } catch (error) {
            AxiosToastError(error);
        }
    };

    const filteredCategories = categoryData.filter(category =>
        category.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <section className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50">
            {/* Header */}
            <div className="bg-white shadow-md rounded-b-lg sticky top-0 z-10">
                <div className="max-w-7xl mx-auto">
                    <div className="p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-2xl font-bold text-green-800 flex items-center">
                                <span className="bg-gradient-to-r from-green-600 to-emerald-500 h-8 w-1 rounded mr-3"></span>
                                Category Management
                            </h1>
                            <p className="text-gray-500 mt-1">Manage your product categories</p>
                        </div>

                        <button
                            onClick={() => setOpenUploadCategory(true)}
                            className="px-4 py-2.5 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-medium rounded-lg shadow-sm hover:shadow-md transition-all duration-300 transform hover:scale-[1.02] flex items-center self-end"
                        >
                            <PlusCircle className="h-5 w-5 mr-2" />
                            Add Category
                        </button>
                    </div>

                    {/* Toolbox */}
                    <div className="px-4 sm:px-6 pb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        {/* Search */}
                        <div className="relative w-full sm:w-64">
                            <input
                                type="text"
                                placeholder="Search categories..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            />
                            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                        </div>

                        {/* Actions */}
                        <div className="flex items-center space-x-2">
                            <button
                                onClick={refreshData}
                                className={`p-2 text-green-600 bg-green-100 rounded-lg hover:bg-green-200 transition-all duration-300 ${refreshing ? 'animate-spin' : ''}`}
                                disabled={loading || refreshing}
                            >
                                <RefreshCw className="h-5 w-5" />
                            </button>

                            <div className="bg-gray-100 rounded-lg p-1 flex">
                                <button
                                    onClick={() => setViewMode('grid')}
                                    className={`p-1.5 rounded-lg transition-all duration-300 ${viewMode === 'grid' ? 'bg-white shadow-sm text-green-600' : 'text-gray-500 hover:bg-white'}`}
                                >
                                    <Grid className="h-5 w-5" />
                                </button>
                                <button
                                    onClick={() => setViewMode('list')}
                                    className={`p-1.5 rounded-lg transition-all duration-300 ${viewMode === 'list' ? 'bg-white shadow-sm text-green-600' : 'text-gray-500 hover:bg-white'}`}
                                >
                                    <List className="h-5 w-5" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-7xl mx-auto p-4 sm:p-6">
                {!filteredCategories.length && !loading && (
                    <div className="bg-white rounded-xl shadow-sm p-8 text-center">
                        <NoData />
                        <p className="mt-4 text-gray-500">No categories found. Start by adding a new category.</p>
                        <button
                            onClick={() => setOpenUploadCategory(true)}
                            className="mt-4 px-4 py-2 bg-green-100 text-green-600 font-medium rounded-lg hover:bg-green-200 transition-all duration-300"
                        >
                            <PlusCircle className="h-5 w-5 inline mr-2" />
                            Add First Category
                        </button>
                    </div>
                )}

                {loading ? (
                    <div className="w-full flex justify-center py-12">
                        <Loading />
                    </div>
                ) : (
                    <>
                        {viewMode === 'grid' ? (
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
                                {filteredCategories.map((category) => (
                                    <div
                                        key={category._id}
                                        className="bg-white rounded-xl shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md group"
                                    >
                                        <div className="h-40 sm:h-48 bg-gray-50 p-4 flex items-center justify-center">
                                            <img
                                                alt={category.name}
                                                src={category.image}
                                                className="h-full object-contain max-w-full transition-transform duration-300 group-hover:scale-105"
                                            />
                                        </div>
                                        <div className="p-4 border-t border-gray-100">
                                            <h3 className="font-medium text-gray-800 truncate">{category.name}</h3>

                                            <div className="mt-3 flex gap-2">
                                                <button
                                                    onClick={() => {
                                                        setOpenEdit(true);
                                                        setEditData(category);
                                                    }}
                                                    className="flex-1 bg-green-50 hover:bg-green-100 text-green-600 font-medium py-1.5 px-2 rounded-lg transition-colors duration-300 flex items-center justify-center"
                                                >
                                                    <Edit className="h-4 w-4 mr-1" />
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        setOpenConfirmBoxDelete(true);
                                                        setDeleteCategory(category);
                                                    }}
                                                    className="flex-1 bg-red-50 hover:bg-red-100 text-red-600 font-medium py-1.5 px-2 rounded-lg transition-colors duration-300 flex items-center justify-center"
                                                >
                                                    <Trash2 className="h-4 w-4 mr-1" />
                                                    Delete
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Image
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Name
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {filteredCategories.map((category) => (
                                            <tr key={category._id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="h-16 w-16 bg-gray-50 rounded-lg flex items-center justify-center p-2">
                                                        <img
                                                            src={category.image}
                                                            alt={category.name}
                                                            className="h-full object-contain"
                                                        />
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm font-medium text-gray-900">{category.name}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                    <div className="flex justify-end gap-2">
                                                        <button
                                                            onClick={() => {
                                                                setOpenEdit(true);
                                                                setEditData(category);
                                                            }}
                                                            className="bg-green-50 hover:bg-green-100 text-green-600 font-medium py-1.5 px-3 rounded-lg transition-colors duration-300 flex items-center"
                                                        >
                                                            <Edit className="h-4 w-4 mr-1" />
                                                            Edit
                                                        </button>
                                                        <button
                                                            onClick={() => {
                                                                setOpenConfirmBoxDelete(true);
                                                                setDeleteCategory(category);
                                                            }}
                                                            className="bg-red-50 hover:bg-red-100 text-red-600 font-medium py-1.5 px-3 rounded-lg transition-colors duration-300 flex items-center"
                                                        >
                                                            <Trash2 className="h-4 w-4 mr-1" />
                                                            Delete
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* Category count card */}
            {filteredCategories.length > 0 && !loading && (
                <div className="fixed bottom-6 right-6">
                    <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-2 rounded-full shadow-lg flex items-center">
                        <span className="font-medium">{filteredCategories.length} {filteredCategories.length === 1 ? 'Category' : 'Categories'}</span>
                    </div>
                </div>
            )}

            {/* Modals */}
            {openUploadCategory && (
                <UploadCategoryModel fetchData={fetchCategory} close={() => setOpenUploadCategory(false)}/>
            )}

            {openEdit && (
                <EditCategory data={editData} close={() => setOpenEdit(false)} fetchData={fetchCategory}/>
            )}

            {openConfimBoxDelete && (
                <CofirmBox
                    close={() => setOpenConfirmBoxDelete(false)}
                    cancel={() => setOpenConfirmBoxDelete(false)}
                    confirm={handleDeleteCategory}
                    title="Delete Category"
                    message={`Are you sure you want to delete "${deleteCategory.name}"? This action cannot be undone.`}
                />
            )}
        </section>
    );
};

export default CategoryPage;
