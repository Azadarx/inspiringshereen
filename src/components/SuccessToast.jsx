import React, { useEffect, useState } from 'react';

const SuccessToast = ({ message, isVisible, onClose }) => {
  const [animationClass, setAnimationClass] = useState('translate-y-10 opacity-0');
  
  useEffect(() => {
    if (isVisible) {
      // Animate in
      setAnimationClass('translate-y-0 opacity-100');
      
      // Auto dismiss after 3 seconds
      const timer = setTimeout(() => {
        setAnimationClass('translate-y-10 opacity-0');
        setTimeout(onClose, 300);
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div 
        className={`bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-3 rounded-lg shadow-lg flex items-center transition-all duration-300 ${animationClass}`}
      >
        <div className="mr-3 bg-white bg-opacity-20 rounded-full p-1">
          <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        </div>
        <div className="font-medium">{message}</div>
      </div>
    </div>
  );
};

export default SuccessToast;