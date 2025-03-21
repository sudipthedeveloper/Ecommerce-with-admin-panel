import { motion } from 'framer-motion';
import { CheckCircle } from 'lucide-react';
import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Success = () => {
  const location = useLocation();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="m-4 w-full max-w-lg bg-gradient-to-br from-green-100 to-green-200 p-6 py-7 rounded-2xl shadow-lg mx-auto flex flex-col justify-center items-center gap-6 border border-green-300"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5, type: "spring", stiffness: 150 }}
        className="text-green-600"
      >
        <CheckCircle size={60} className="animate-pulse" />
      </motion.div>

      <p className="text-green-800 font-extrabold text-2xl text-center">
        {Boolean(location?.state?.text) ? location?.state?.text : "Payment"} Successfully!
      </p>

      <Link
        to="/"
        className="px-5 py-2 text-lg font-semibold rounded-lg border border-green-800 text-green-900 bg-white hover:bg-green-900 hover:text-white transition-all shadow-md"
      >
        Go To Home
      </Link>
    </motion.div>
  );
};

export default Success;
