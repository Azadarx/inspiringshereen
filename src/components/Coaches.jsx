// src/components/Coaches.jsx
import React, { useRef, useState } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { useContent } from '../contexts/ContentContext';
import ImageUpload from './shared/ImageUpload';
import defaultMamImg from '../assets/mam.jpg';
import defaultSirImg from '../assets/sir.jpg';

const Coaches = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  const [activeCoach, setActiveCoach] = useState(null);
  const { coaches, canEdit, updateCoach, isEditingCoaches, toggleCoachesEditMode } = useContent();
  
  // State for editing individual coaches
  const [editingCoachIndex, setEditingCoachIndex] = useState(null);
  const [editData, setEditData] = useState({
    name: '',
    title: '',
    description: '',
    bio: '',
    expertise: [],
    image: ''
  });

  // Default images to use as fallbacks
  const defaultImages = [defaultMamImg, defaultSirImg];

  const startEditing = (index) => {
    setEditingCoachIndex(index);
    setEditData({
      ...coaches[index],
      // Convert expertise array to string for easier editing
      expertise: coaches[index].expertise.join(', ')
    });
  };

  const cancelEditing = () => {
    setEditingCoachIndex(null);
    setEditData({
      name: '',
      title: '',
      description: '',
      bio: '',
      expertise: [],
      image: ''
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditData({
      ...editData,
      [name]: value
    });
  };

  const handleImageUploaded = (imageUrl) => {
    setEditData({
      ...editData,
      image: imageUrl
    });
  };

  const saveChanges = async () => {
    if (editingCoachIndex === null) return;
    
    try {
      // Convert expertise string back to array
      const expertiseArray = editData.expertise.split(',').map(item => item.trim());
      
      const updatedCoach = {
        ...editData,
        expertise: expertiseArray,
        // Keep the existing image if none provided
        image: editData.image || coaches[editingCoachIndex].image || defaultImages[editingCoachIndex]
      };
      
      const success = await updateCoach(editingCoachIndex, updatedCoach);
      if (success) {
        cancelEditing();
      }
    } catch (error) {
      console.error("Error saving coach data:", error);
    }
  };

  return (
    <section id="coaches" ref={ref} className="py-24 bg-white relative overflow-hidden">
      {/* Colorful background elements - reduced to just 2 static elements */}
      <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-r from-violet-600 via-fuchsia-600 to-pink-600 transform -skew-y-2"></div>
      <div className="absolute top-20 left-0 w-full h-20 bg-gradient-to-r from-pink-500 via-fuchsia-500 to-violet-500 transform -skew-y-3 opacity-70"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 pt-24">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1 rounded-full bg-gradient-to-r from-violet-100 to-fuchsia-100 text-fuchsia-700 font-medium mb-4">
            MEET YOUR MENTORS
          </span>
          <h2 className="text-4xl font-bold text-gray-800 mb-4">Your Coaches for Transformation</h2>
          <div className="w-24 h-1 bg-gradient-to-r from-violet-600 to-fuchsia-600 mx-auto mb-8"></div>
          <p className="max-w-3xl mx-auto text-xl text-gray-600">
            Learn from experienced coaches who have helped hundreds transform their lives
          </p>
          
          {canEdit && (
            <div className="mt-4">
              <button 
                onClick={toggleCoachesEditMode}
                className="bg-violet-600 text-white px-4 py-2 rounded-lg hover:bg-violet-700 transition-colors inline-flex items-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                </svg>
                {isEditingCoaches ? "Exit Edit Mode" : "Edit Coaches"}
              </button>
            </div>
          )}
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
          {coaches.map((coach, index) => (
            <div
              key={index}
              className="relative"
              onMouseEnter={() => setActiveCoach(index)}
              onMouseLeave={() => setActiveCoach(null)}
            >
              {isEditingCoaches && editingCoachIndex === index ? (
                // Editing form for coach
                <div className="bg-white p-6 rounded-xl shadow-lg border-2 border-violet-200">
                  <h3 className="text-lg font-semibold text-violet-700 mb-4">Edit Coach Information</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                      <input
                        type="text"
                        name="name"
                        value={editData.name}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 rounded-md px-3 py-2"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                      <input
                        type="text"
                        name="title"
                        value={editData.title}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 rounded-md px-3 py-2"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                      <input
                        type="text"
                        name="description"
                        value={editData.description}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 rounded-md px-3 py-2"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                      <textarea
                        name="bio"
                        value={editData.bio}
                        onChange={handleInputChange}
                        rows="4"
                        className="w-full border border-gray-300 rounded-md px-3 py-2"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Expertise (comma separated)
                      </label>
                      <input
                        type="text"
                        name="expertise"
                        value={editData.expertise}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 rounded-md px-3 py-2"
                        placeholder="e.g. Personal Development, Life Transformation"
                      />
                    </div>

                    {/* Image Upload Component - Using our new Cloudinary component */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Profile Image</label>
                      
                      {/* Show current image if exists */}
                      {(editData.image || coaches[editingCoachIndex].image) && (
                        <div className="mb-3">
                          <div className="w-24 h-24 rounded-full overflow-hidden border border-gray-200">
                            <img 
                              src={editData.image || coaches[editingCoachIndex].image} 
                              alt="Current profile" 
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <p className="text-xs text-gray-500 mt-1">Current profile image</p>
                        </div>
                      )}
                      
                      <ImageUpload 
                        onImageUploaded={handleImageUploaded}
                        folder="coaches"
                        buttonLabel="Upload New Image"
                      />
                    </div>
                    
                    <div className="flex justify-end space-x-3 pt-4">
                      <button
                        onClick={cancelEditing}
                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={saveChanges}
                        className="px-4 py-2 bg-violet-600 text-white rounded-md hover:bg-violet-700"
                      >
                        Save Changes
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                // Normal display for coach
                <div className="flex flex-col items-center">
                  <div className="relative mb-8 group">
                    {/* Single decorative ring with animation */}
                    <motion.div 
                      animate={{ 
                        rotate: [0, 360],
                        scale: activeCoach === index ? 1.1 : 1
                      }}
                      transition={{ 
                        rotate: { repeat: Infinity, duration: 20, ease: "linear" },
                        scale: { duration: 0.3 }
                      }}
                      className="absolute inset-0 -m-6 rounded-full border-2 border-dashed border-violet-300 z-0"
                    ></motion.div>
                    
                    {/* Coach image */}
                    <div className="relative z-10">
                      <div className="w-64 h-64 rounded-full overflow-hidden border-4 border-white shadow-xl">
                        <img 
                          src={coach.image || defaultImages[index]} 
                          alt={coach.name} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      
                      {/* Edit button overlay */}
                      {isEditingCoaches && canEdit && (
                        <button
                          onClick={() => startEditing(index)}
                          className="absolute bottom-0 right-0 bg-violet-600 text-white p-2 rounded-full shadow-lg hover:bg-violet-700 transition-colors"
                          title="Edit this coach"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                          </svg>
                        </button>
                      )}
                    </div>
                  </div>
                  
                  <div className="text-center">
                    <h3 className="text-2xl font-bold text-gray-800 mb-1">{coach.name}</h3>
                    <p className="text-fuchsia-600 font-medium mb-3">{coach.title}</p>
                    <p className="text-gray-600 italic mb-6">{coach.description}</p>
                    
                    <AnimatePresence>
                      {activeCoach === index && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          <p className="text-gray-700 mb-4">{coach.bio}</p>
                          <div className="mb-6">
                            <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Expertise</h4>
                            <div className="flex flex-wrap justify-center gap-2">
                              {coach.expertise.map((skill, i) => (
                                <span 
                                  key={i}
                                  className="bg-violet-100 text-violet-700 px-3 py-1 rounded-full text-sm"
                                >
                                  {skill}
                                </span>
                              ))}
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                    
                    <motion.button
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.5 }}
                      className="text-violet-600 font-medium hover:text-fuchsia-600 transition-colors focus:outline-none"
                      onClick={() => setActiveCoach(activeCoach === index ? null : index)}
                    >
                      {activeCoach === index ? "Show Less" : "Learn More"}
                    </motion.button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Coaches;