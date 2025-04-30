// src/components/About.jsx
import React, { useEffect, useRef } from 'react';
import { motion, useInView, useAnimation } from 'framer-motion';
import { useContent } from '../contexts/ContentContext';
import SuccessToast from './SuccessToast'; // Import the toast component

const About = () => {
  const controls = useAnimation();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });
  const { 
    eventDetails, 
    canEdit, 
    toggleEventEditMode, 
    updateEventDetails, 
    saveSuccess,
    showToast,
    toastMessage,
    hideToast
  } = useContent();

  useEffect(() => {
    if (isInView) {
      controls.start("visible");
    }
  }, [controls, isInView]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.6 }
    }
  };

  // Function to handle save changes
  const handleSaveChanges = async () => {
    const success = await updateEventDetails({
      date: eventDetails.tempDate || eventDetails.date,
      time: eventDetails.tempTime || eventDetails.time,
      price: eventDetails.tempPrice || eventDetails.price || 99,
      originalPrice: eventDetails.tempOriginalPrice || eventDetails.originalPrice || 199,
      location: eventDetails.tempLocation || eventDetails.location || "Live on Zoom",
      duration: eventDetails.tempDuration || eventDetails.duration || "3-Hour Comprehensive Session",
      discountPercentage: eventDetails.tempDiscountPercentage || eventDetails.discountPercentage || "50%",
      tempDate: null,
      tempTime: null,
      tempPrice: null,
      tempOriginalPrice: null,
      tempLocation: null,
      tempDuration: null,
      tempDiscountPercentage: null,
      isEditing: false // Explicitly set to false to close the modal
    });
  };

  return (
    <section id="about" ref={ref} className="py-24 bg-white relative overflow-hidden">
      {/* Toast notification */}
      <SuccessToast 
        message={toastMessage}
        isVisible={showToast}
        onClose={hideToast}
      />
      
      {/* Decorative element */}
      <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-gradient-to-br from-violet-300 to-fuchsia-300 rounded-full blur-3xl opacity-20"></div>
      <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-80 h-80 bg-gradient-to-tr from-cyan-300 to-blue-300 rounded-full blur-3xl opacity-20"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={controls}
          className="text-center mb-16"
        >
          <motion.div variants={itemVariants} className="inline-block">
            <span className="bg-gradient-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-transparent text-lg font-medium mb-2 block">
              TRANSCEND LIMITS
            </span>
          </motion.div>

          <motion.h2 variants={itemVariants} className="text-4xl font-bold text-gray-800 mb-4">
            About The Masterclass
          </motion.h2>

          <motion.div variants={itemVariants} className="w-24 h-2 bg-gradient-to-r from-violet-600 to-fuchsia-600 mx-auto mb-8 rounded-full"></motion.div>

          <motion.p variants={itemVariants} className="max-w-3xl mx-auto text-xl text-gray-600">
            This is not just motivation, It's real coaching, real breakthroughs, and real transformation.
          </motion.p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              icon: "🧠",
              color: "from-violet-500 to-purple-500",
              title: "Real Transformation",
              description: "This webinar will cover ultimate knowledge on Health, Life and Business Mastery for Holistic Success."
            },
            {
              icon: "🔑",
              color: "from-fuchsia-500 to-pink-500",
              title: "Actionable Knowledge",
              description: "You'll get to know WHAT to do, HOW to do, WHY to do - To Earn Money in your life."
            },
            {
              icon: "📍",
              color: "from-pink-500 to-rose-500",
              title: "Interactive Session",
              description: `Live on Zoom (Interactive + Reflective Exercises) on ${eventDetails.date} at ${eventDetails.time}.`,
              isDateField: true
            }
          ].map((item, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="relative group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-2xl transform transition-all duration-300 group-hover:-translate-y-2 group-hover:translate-x-2 group-hover:scale-105"></div>
              <div className="relative p-8 bg-white rounded-2xl shadow-xl border border-gray-100 transform transition-all duration-300 h-full overflow-hidden">
                <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-gradient-to-r from-violet-50 to-fuchsia-50 rounded-full"></div>
                <div className="relative z-10">
                  <div className={`inline-flex items-center justify-center w-16 h-16 mb-6 rounded-2xl bg-gradient-to-r ${item.color} text-white text-3xl shadow-lg`}>
                    <span className="transform transition-transform group-hover:scale-110 duration-300">{item.icon}</span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-4">{item.title}</h3>
                  <p className="text-gray-600 leading-relaxed">
                    {item.description}
                    {item.isDateField && canEdit && (
                      <button
                        onClick={toggleEventEditMode}
                        className="ml-2 text-violet-600 hover:text-fuchsia-600 inline-flex items-center"
                        title="Edit event date and time"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                        </svg>
                      </button>
                    )}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div variants={itemVariants} className="text-center mt-16">
          <motion.button
            whileHover={{
              scale: 1.05,
              boxShadow: "0 10px 30px -10px rgba(112, 26, 117, 0.5)"
            }}
            whileTap={{ scale: 0.95 }}
            className="bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white px-10 py-4 rounded-xl text-lg font-medium shadow-lg hover:translate-y-1 transition-all duration-300"
            onClick={() => window.location.href = "/register"}
          >
            <span className="flex items-center justify-center">
              Enroll Now - Only ₹{eventDetails.price || 99}
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
              </svg>
            </span>
          </motion.button>
        </motion.div>
      </div>

      {/* Edit Modal - Shows when editing event details */}
      {eventDetails.isEditing && canEdit && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md relative">
            <h3 className="text-xl font-bold mb-4">Edit Event Details</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <input
                  type="text"
                  value={eventDetails.tempDate || eventDetails.date}
                  onChange={(e) => updateEventDetails({ tempDate: e.target.value })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  placeholder="e.g., APRIL 19TH"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                <input
                  type="text"
                  value={eventDetails.tempTime || eventDetails.time}
                  onChange={(e) => updateEventDetails({ tempTime: e.target.value })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  placeholder="e.g., 11:30 AM"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Price (₹)</label>
                <input
                  type="text"
                  value={eventDetails.tempPrice || eventDetails.price || 99}
                  onChange={(e) => updateEventDetails({ tempPrice: e.target.value })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  placeholder="e.g., 99"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Original Price (₹)</label>
                <input
                  type="text"
                  value={eventDetails.tempOriginalPrice || eventDetails.originalPrice || 199}
                  onChange={(e) => updateEventDetails({ tempOriginalPrice: e.target.value })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  placeholder="e.g., 199"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                <input
                  type="text"
                  value={eventDetails.tempLocation || eventDetails.location || "Live on Zoom"}
                  onChange={(e) => updateEventDetails({ tempLocation: e.target.value })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  placeholder="e.g., Live on Zoom"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
                <input
                  type="text"
                  value={eventDetails.tempDuration || eventDetails.duration || "3-Hour Comprehensive Session"}
                  onChange={(e) => updateEventDetails({ tempDuration: e.target.value })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  placeholder="e.g., 3-Hour Comprehensive Session"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Discount Percentage</label>
                <input
                  type="text"
                  value={eventDetails.tempDiscountPercentage || eventDetails.discountPercentage || "50%"}
                  onChange={(e) => updateEventDetails({ tempDiscountPercentage: e.target.value })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  placeholder="e.g., 50%"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={toggleEventEditMode}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveChanges}
                className="px-4 py-2 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white rounded-md"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default About;