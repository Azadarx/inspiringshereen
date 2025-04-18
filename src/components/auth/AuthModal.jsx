import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SignIn from './SignIn';
import SignUp from './SignUp';

const AuthModal = ({ isOpen, onClose }) => {
  const [showSignIn, setShowSignIn] = useState(true);
  
  const modalVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  };
  
  const contentVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { delay: 0.2 } }
  };
  
  if (!isOpen) return null;
  
  return (
    <AnimatePresence>
      <motion.div
        variants={modalVariants}
        initial="hidden"
        animate="visible"
        exit="hidden"
        className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"
      >
        <motion.div
          variants={contentVariants}
          className="relative w-full max-w-md"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={onClose}
            className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 z-10"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          
          {showSignIn ? (
            <SignIn onClose={onClose} switchToSignUp={() => setShowSignIn(false)} />
          ) : (
            <SignUp onClose={onClose} switchToSignIn={() => setShowSignIn(true)} />
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
export default AuthModal;