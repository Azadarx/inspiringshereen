// src/components/Hero.jsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useContent } from '../contexts/ContentContext';

const Hero = () => {
  const { eventDetails, canEdit, updateEventDetails, toggleEventEditMode } = useContent();
  
  // Create state for all editable fields
  const [editFormData, setEditFormData] = useState({
    date: eventDetails.date,
    time: eventDetails.time,
    price: eventDetails.price,
    originalPrice: eventDetails.originalPrice,
    discountPercentage: eventDetails.discountPercentage
  });

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Save changes to Firebase
  const handleSave = async () => {
    const success = await updateEventDetails({
      ...editFormData,
      isEditing: false // Close edit mode after saving
    });
    
    if (!success) {
      // Reset form data if save failed
      setEditFormData({
        date: eventDetails.date,
        time: eventDetails.time,
        price: eventDetails.price,
        originalPrice: eventDetails.originalPrice,
        discountPercentage: eventDetails.discountPercentage
      });
    }
  };

  // Cancel editing
  const handleCancel = () => {
    // Reset form data
    setEditFormData({
      date: eventDetails.date,
      time: eventDetails.time,
      price: eventDetails.price,
      originalPrice: eventDetails.originalPrice,
      discountPercentage: eventDetails.discountPercentage
    });
    
    // Close edit mode
    toggleEventEditMode();
  };

  // When edit mode is toggled, update form data with current values
  React.useEffect(() => {
    if (eventDetails.isEditing) {
      setEditFormData({
        date: eventDetails.date,
        time: eventDetails.time,
        price: eventDetails.price,
        originalPrice: eventDetails.originalPrice,
        discountPercentage: eventDetails.discountPercentage
      });
    }
  }, [eventDetails.isEditing]);

  return (
    <div className="relative min-h-screen bg-white overflow-hidden">
      {/* Decorative elements - reduced to just 2 static divs */}
      <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-gradient-to-br from-violet-300 to-fuchsia-300 rounded-full blur-3xl opacity-20"></div>
      <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-80 h-80 bg-gradient-to-tr from-cyan-300 to-blue-300 rounded-full blur-3xl opacity-20"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-24 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          {/* Text content - with focused animations only on key elements */}
          <div className="md:col-span-7 text-center md:text-left">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-block relative"
            >
              {!eventDetails.isEditing ? (
                <div className="relative">
                  <span className="bg-gradient-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-transparent text-lg font-medium mb-2 block">
                    LIVE ON {eventDetails.date}, {eventDetails.time}
                  </span>
                  
                  {canEdit && (
                    <button 
                      onClick={toggleEventEditMode}
                      className="absolute -right-8 top-0 text-violet-600 hover:text-fuchsia-600"
                      title="Edit event date and time"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                      </svg>
                    </button>
                  )}
                </div>
              ) : (
                <div className="bg-violet-50 p-4 rounded-lg border border-violet-200 mb-4">
                  <h3 className="text-violet-700 font-bold mb-3">Edit Event Details</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Event Date</label>
                      <input
                        type="text"
                        name="date"
                        value={editFormData.date}
                        onChange={handleInputChange}
                        className="border border-violet-300 rounded px-3 py-2 w-full"
                        placeholder="e.g., APRIL 19TH"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Event Time</label>
                      <input
                        type="text"
                        name="time"
                        value={editFormData.time}
                        onChange={handleInputChange}
                        className="border border-violet-300 rounded px-3 py-2 w-full"
                        placeholder="e.g., 11:30 AM"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Price (₹)</label>
                      <input
                        type="text"
                        name="price"
                        value={editFormData.price}
                        onChange={handleInputChange}
                        className="border border-violet-300 rounded px-3 py-2 w-full"
                        placeholder="e.g., 99"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Original Price (₹)</label>
                      <input
                        type="text"
                        name="originalPrice"
                        value={editFormData.originalPrice}
                        onChange={handleInputChange}
                        className="border border-violet-300 rounded px-3 py-2 w-full"
                        placeholder="e.g., 199"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Discount (%)</label>
                      <input
                        type="text"
                        name="discountPercentage"
                        value={editFormData.discountPercentage}
                        onChange={handleInputChange}
                        className="border border-violet-300 rounded px-3 py-2 w-full"
                        placeholder="e.g., 50%"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={handleCancel}
                      className="bg-gray-200 text-gray-700 px-3 py-2 rounded text-sm hover:bg-gray-300"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSave}
                      className="bg-violet-600 text-white px-3 py-2 rounded text-sm hover:bg-violet-700"
                    >
                      Save Changes
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl md:text-6xl font-bold text-gray-800 leading-tight mb-4"
            >
              Feeling Stuck Or Lost In <span className="relative">
                <span className="relative z-10">Life?</span>
                <span className="absolute bottom-1 left-0 w-full h-3 bg-gradient-to-r from-violet-300 to-fuchsia-300 opacity-60 -rotate-2"></span>
              </span>
            </motion.h1>
            
            <div className="w-24 h-2 bg-gradient-to-r from-violet-600 to-fuchsia-600 mb-6 md:mx-0 mx-auto rounded-full"></div>
            
            <h2 className="text-2xl font-bold text-violet-600 mb-4">
              Battling with Your Health, Relationships, or Career?
            </h2>
            
            <p className="text-xl text-gray-600 mb-8 max-w-2xl">
              Join a Life-Changing 3-Hour Masterclass! Discover How to Break Free from Stress, Confusion & Setbacks and Take Control of Your Life with Clarity and Confidence.
            </p>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-4"
            >
              <motion.button
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: "0 10px 30px -10px rgba(112, 26, 117, 0.5)"
                }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white px-8 py-4 rounded-xl text-lg font-bold shadow-lg hover:translate-y-1 transition-all duration-300 w-full sm:w-auto"
                onClick={() => window.location.href = "/register"}
              >
                <span className="flex items-center justify-center">
                  Enroll Now - Only ₹{eventDetails.price}
                  <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
                  </svg>
                </span>
              </motion.button>
              <span className="text-gray-600 flex items-center">
                <span className="line-through mr-2">Actual Fee: ₹{eventDetails.originalPrice}</span>
                <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-md text-sm font-semibold">{eventDetails.discountPercentage} OFF</span>
              </span>
            </motion.div>
          </div>
          
          {/* Image container - with just one motion element for overall effect */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="md:col-span-5 relative"
          >
            <div className="relative">
              {/* Main image */}
              <div className="relative z-10 rounded-3xl overflow-hidden shadow-2xl transform -rotate-2 border-4 border-white">
                <img 
                  src="https://media.istockphoto.com/id/2047006443/vector/life-coach-vector-illustration-for-consultation-education-motivation-mentoring-perspective.jpg?s=612x612&w=0&k=20&c=3SwW91BO6I5pUErcmcbPLhz5y5eanu1DNcG3td8TUNo=" 
                  alt="Life Coaching Session" 
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* Feature cards - no animation, just static */}
              <div className="absolute -bottom-6 -left-6 bg-white rounded-xl p-4 shadow-lg z-20 transform rotate-6">
                <div className="flex items-center gap-2">
                  <div className="text-2xl bg-gradient-to-r from-violet-500 to-purple-500 text-white w-10 h-10 rounded-full flex items-center justify-center">⭐</div>
                  <div>
                    <div className="font-bold text-violet-700">Live Interactive</div>
                    <div className="text-sm text-gray-600">Zoom Session</div>
                  </div>
                </div>
              </div>
              
              <div className="absolute -top-6 -right-6 bg-white rounded-xl p-4 shadow-lg z-20 transform -rotate-6">
                <div className="flex items-center gap-2">
                  <div className="text-2xl bg-gradient-to-r from-fuchsia-500 to-pink-500 text-white w-10 h-10 rounded-full flex items-center justify-center">🧠</div>
                  <div>
                    <div className="font-bold text-violet-700">Holistic Growth</div>
                    <div className="text-sm text-gray-600">Mind, Body, Career</div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Hero;