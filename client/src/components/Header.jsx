import { AnimatePresence, motion } from 'framer-motion';
import React, { useState } from 'react';
import { BsCart4 } from "react-icons/bs";
import { FaRegCircleUser } from "react-icons/fa6";
import { GoTriangleDown, GoTriangleUp } from "react-icons/go";
import { useSelector } from 'react-redux';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import useMobile from '../hooks/useMobile';
import { useGlobalContext } from '../provider/GlobalProvider';
import { DisplayPriceInRupees } from '../utils/DisplayPriceInRupees';
import DisplayCartItem from './DisplayCartItem';
import Search from './Search';
import UserMenu from './UserMenu';

const Header = () => {
    const [isMobile] = useMobile();
    const location = useLocation();
    const isSearchPage = location.pathname === "/search";
    const navigate = useNavigate();
    const user = useSelector((state) => state?.user);
    const [openUserMenu, setOpenUserMenu] = useState(false);
    const cartItem = useSelector(state => state.cartItem.cart);
    const { totalPrice, totalQty } = useGlobalContext();
    const [openCartSection, setOpenCartSection] = useState(false);

    const redirectToLoginPage = () => {
        navigate("/login");
    };

    const handleCloseUserMenu = () => {
        setOpenUserMenu(false);
    };

    const handleMobileUser = () => {
        if (!user._id) {
            navigate("/login");
            return;
        }
        navigate("/user");
    };

    return (
        <motion.header
            className='h-24 lg:h-20 sticky top-0 z-40 flex flex-col justify-center gap-1 bg-gradient-to-r from-green-600 to-green-500 shadow-lg'
            initial={{ opacity: 1, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            {!(isSearchPage && isMobile) && (
                <div className='container mx-auto flex items-center px-4 lg:px-8 justify-between'>
                    {/**logo */}
                    <div className='h-full'>
                        <Link to={"/"} className='h-full flex justify-center items-center'>
                            <motion.div
                                className='hidden lg:block text-3xl font-bold text-white'
                                whileHover={{ scale: 1.1 }}
                                transition={{ type: "spring", stiffness: 300 }}
                            >
                                Feelustration
                            </motion.div>
                            <motion.div
                                className='lg:hidden text-2xl font-bold text-white'
                                whileHover={{ scale: 1.1 }}
                                transition={{ type: "spring", stiffness: 300 }}
                            >
                                Feelustration
                            </motion.div>
                        </Link>
                    </div>

                    {/**Search */}
                    <div className='hidden lg:block flex-grow mx-8'>
                        <Search />
                    </div>

                    {/**login and my cart */}
                    <div className='flex items-center gap-4'>
                        {/**user icons display in only mobile version**/}
                        <button className='text-white lg:hidden' onClick={handleMobileUser}>
                            <FaRegCircleUser size={26} />
                        </button>

                        {/**Desktop**/}
                        <div className='hidden lg:flex items-center gap-6'>
                            {user?._id ? (
                                <div className='relative'>
                                    <div onClick={() => setOpenUserMenu(preve => !preve)} className='flex select-none items-center gap-1 cursor-pointer text-white hover:text-green-200 transition-colors'>
                                        <p>Account</p>
                                        {openUserMenu ? (
                                            <GoTriangleUp size={20} />
                                        ) : (
                                            <GoTriangleDown size={20} />
                                        )}
                                    </div>
                                    <AnimatePresence>
                                        {openUserMenu && (
                                            <motion.div
                                                className='absolute right-0 top-12'
                                                initial={{ opacity: 0, y: -20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -20 }}
                                                transition={{ duration: 0.2 }}
                                            >
                                                <div className='bg-white rounded-lg p-4 min-w-52 shadow-xl'>
                                                    <UserMenu close={handleCloseUserMenu} />
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            ) : (
                                <motion.button
                                    onClick={redirectToLoginPage}
                                    className='text-lg px-4 py-2 text-white bg-green-700 hover:bg-green-600 rounded-lg transition-colors'
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    Login
                                </motion.button>
                            )}
                            <motion.button
                                onClick={() => setOpenCartSection(true)}
                                className='flex items-center gap-2 bg-green-800 hover:bg-green-700 px-4 py-2 rounded-lg text-white transition-colors'
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                {/**add to card icons */}
                                <div className='animate-bounce'>
                                    <BsCart4 size={24} />
                                </div>
                                <div className='font-semibold text-sm'>
                                    {cartItem[0] ? (
                                        <div>
                                            <p>{totalQty} Items</p>
                                            <p>{DisplayPriceInRupees(totalPrice)}</p>
                                        </div>
                                    ) : (
                                        <p>My Cart</p>
                                    )}
                                </div>
                            </motion.button>
                        </div>
                    </div>
                </div>
            )}

            <div className='container mx-auto px-4 lg:hidden'>
                <Search />
            </div>

            <AnimatePresence>
                {openCartSection && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.2 }}
                    >
                        <DisplayCartItem close={() => setOpenCartSection(false)} />
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.header>
    );
};

export default Header;
