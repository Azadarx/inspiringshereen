// src/components/Loader.jsx
import React from 'react';
import { motion } from 'framer-motion';

const Loader = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-95 z-50">
      <div className="relative w-24 h-24">
        {/* Decorative background elements */}
        <div className="absolute top-1/2 left-1/2 -ml-32 -mt-32 w-64 h-64 bg-gradient-to-br from-violet-300 to-fuchsia-300 rounded-full blur-3xl opacity-20"></div>
        <div className="absolute top-1/2 left-1/2 -ml-40 -mt-40 w-80 h-80 bg-gradient-to-tr from-cyan-300 to-blue-300 rounded-full blur-3xl opacity-20"></div>
        
        {/* Main loader animation */}
        <div className="relative">
          {/* Outer spinning circle */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ 
              duration: 2, 
              repeat: Infinity, 
              ease: "linear" 
            }}
            className="absolute top-0 left-0 w-24 h-24 border-4 border-t-violet-600 border-r-fuchsia-600 border-b-violet-400 border-l-fuchsia-400 rounded-full"
          />
          
          {/* Inner pulsing circle */}
          <motion.div
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.7, 1, 0.7]
            }}
            transition={{ 
              duration: 1.5, 
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute top-1/2 left-1/2 -ml-6 -mt-6 w-12 h-12 bg-gradient-to-br from-violet-600 to-fuchsia-600 rounded-full shadow-lg"
          />
          
          {/* Smallest inner circle */}
          <motion.div
            animate={{ 
              scale: [0.8, 1, 0.8],
              opacity: [0.8, 1, 0.8]
            }}
            transition={{ 
              duration: 1, 
              repeat: Infinity,
              ease: "easeInOut", 
              delay: 0.5
            }}
            className="absolute top-1/2 left-1/2 -ml-3 -mt-3 w-6 h-6 bg-white rounded-full shadow-inner"
          />
        </div>
      </div>
      
      {/* Text animation */}
      <motion.div 
        className="absolute mt-32 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-lg font-bold bg-gradient-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-transparent">
          Loading...
        </div>
        <div className="text-sm text-gray-600 mt-1">
          Preparing your experience
        </div>
      </motion.div>
    </div>
  );
};

export default Loader;