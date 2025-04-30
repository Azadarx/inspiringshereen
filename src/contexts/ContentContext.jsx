// src/contexts/ContentContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { ref, get, set, update, onValue } from 'firebase/database';
import { rtdb } from '../firebase/config';
import { useAuth } from './AuthContext';
import { uploadToCloudinary } from '../utils/uploadToCloudinary';

// Create the content context
const ContentContext = createContext();

// Custom hook to use the content context
export function useContent() {
    return useContext(ContentContext);
}

// Content provider component
export function ContentProvider({ children }) {
    const { currentUser, isAdmin } = useAuth();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');

    // Editable content states
    const [eventDetails, setEventDetails] = useState({
        date: 'APRIL 19TH',
        time: '11:30 AM',
        price: '99',
        originalPrice: '199',
        location: 'Live on Zoom',
        duration: '3-Hour Comprehensive Session',
        discountPercentage: '50%',
        isEditing: false
    });

    const [coaches, setCoaches] = useState([
        {
            name: "Inspiring Shereen",
            title: "Life Coach",
            description: "Shaping Lives With Holistic Success",
            image: null,
            bio: "With over 10 years of experience in transformational coaching, Shereen has helped hundreds of professionals reclaim their purpose and passion.",
            expertise: ["Personal Development", "Life Transformation", "Mindfulness Training"]
        },
        {
            name: "Sikander Tuteja",
            title: "Holistic Success Coach",
            description: "Expert in business growth and personal development",
            image: null,
            bio: "A seasoned entrepreneur and mindset coach, Sikander specializes in helping professionals align their career goals with their core values.",
            expertise: ["Business Strategy", "Wealth Creation", "Leadership Development"]
        }
    ]);
    const [isEditingCoaches, setIsEditingCoaches] = useState(false);

    // Clear error after 5 seconds
    useEffect(() => {
        if (error) {
            const timer = setTimeout(() => setError(''), 5000);
            return () => clearTimeout(timer);
        }
    }, [error]);

    // Show toast and clear it after 3 seconds
    useEffect(() => {
        if (showToast) {
            const timer = setTimeout(() => {
                setShowToast(false);
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [showToast]);

    // Load content from Firebase on component mount and listen for real-time updates
    useEffect(() => {
        // Set up a real-time listener for content changes
        const contentRef = ref(rtdb, 'content');
        
        const unsubscribe = onValue(contentRef, (snapshot) => {
            if (snapshot.exists()) {
                const data = snapshot.val();

                // Update event details if available
                if (data.eventDetails) {
                    setEventDetails(prevState => ({
                        ...prevState,
                        date: data.eventDetails.date || prevState.date,
                        time: data.eventDetails.time || prevState.time,
                        price: data.eventDetails.price || prevState.price,
                        originalPrice: data.eventDetails.originalPrice || prevState.originalPrice,
                        location: data.eventDetails.location || prevState.location,
                        duration: data.eventDetails.duration || prevState.duration,
                        discountPercentage: data.eventDetails.discountPercentage || prevState.discountPercentage,
                        isEditing: false // Always close edit mode when new data arrives
                    }));
                }

                // Update coaches if available
                if (data.coaches) {
                    setCoaches(data.coaches);
                }
                
                setLoading(false);
            } else if (isAdmin) {
                // Initialize content if it doesn't exist (only for admin)
                initializeContent();
            } else {
                setLoading(false);
            }
        }, (error) => {
            console.error("Firebase data fetch error:", error);
            setError("Failed to load content. Please refresh the page.");
            setLoading(false);
        });

        // Clean up subscription on unmount
        return () => unsubscribe();
    }, [isAdmin]);

    // Initialize content in Firebase if it doesn't exist
    const initializeContent = async () => {
        if (!isAdmin) {
            console.warn("Non-admin user tried to initialize content.");
            return;
        }

        try {
            const contentRef = ref(rtdb, 'content');
            await set(contentRef, {
                eventDetails: {
                    date: eventDetails.date,
                    time: eventDetails.time,
                    price: eventDetails.price,
                    originalPrice: eventDetails.originalPrice,
                    location: eventDetails.location,
                    duration: eventDetails.duration,
                    discountPercentage: eventDetails.discountPercentage
                },
                coaches: coaches
            });
            setLoading(false);
        } catch (err) {
            console.error("Error initializing content:", err);
            setError("Failed to initialize content.");
            setLoading(false);
        }
    };

    // Update event details
    const updateEventDetails = async (newDetails) => {
        if (!isAdmin) {
            setError("You don't have permission to update content.");
            return false;
        }

        try {
            // First update the local state
            setEventDetails(prevState => ({
                ...prevState,
                ...newDetails,
                isEditing: newDetails.hasOwnProperty('isEditing') ? newDetails.isEditing : prevState.isEditing
            }));

            // If isEditing is explicitly set to false, persist changes to Firebase
            if (newDetails.hasOwnProperty('isEditing') && newDetails.isEditing === false) {
                const eventRef = ref(rtdb, 'content/eventDetails');
                
                // Create a clean copy without isEditing flag for Firebase
                const updatedDetails = {
                    date: newDetails.date || eventDetails.date,
                    time: newDetails.time || eventDetails.time,
                    price: newDetails.price || eventDetails.price,
                    originalPrice: newDetails.originalPrice || eventDetails.originalPrice,
                    location: newDetails.location || eventDetails.location,
                    duration: newDetails.duration || eventDetails.duration,
                    discountPercentage: newDetails.discountPercentage || eventDetails.discountPercentage
                };
                
                // Save to Firebase
                await update(eventRef, updatedDetails);
                
                // Show success message
                setShowToast(true);
                setToastMessage('Event details saved successfully!');
            }

            return true;
        } catch (err) {
            console.error("Error updating event details:", err);
            setError("Failed to update event details.");
            return false;
        }
    };

    // Toggle event edit mode
    const toggleEventEditMode = () => {
        if (!isAdmin) return;
        
        setEventDetails(prev => ({ 
            ...prev, 
            isEditing: !prev.isEditing 
        }));
    };

    // Update all coaches
    const updateCoaches = async (newCoaches) => {
        if (!isAdmin) {
            setError("You don't have permission to update content.");
            return false;
        }

        try {
            const coachesRef = ref(rtdb, 'content/coaches');
            await set(coachesRef, newCoaches);

            setCoaches(newCoaches);
            setIsEditingCoaches(false);
            setShowToast(true);
            setToastMessage('Coaches updated successfully!');

            return true;
        } catch (err) {
            console.error("Error updating coaches:", err);
            setError("Failed to update coaches.");
            return false;
        }
    };

    // Toggle coaches edit mode
    const toggleCoachesEditMode = () => {
        if (!isAdmin) return;
        setIsEditingCoaches(!isEditingCoaches);
    };

    // Update a single coach
    const updateCoach = async (index, updatedCoach) => {
        if (!isAdmin) {
            setError("You don't have permission to update content.");
            return false;
        }

        try {
            const updatedCoaches = [...coaches];
            updatedCoaches[index] = updatedCoach;

            const coachRef = ref(rtdb, `content/coaches/${index}`);
            await set(coachRef, updatedCoach);

            setCoaches(updatedCoaches);
            setShowToast(true);
            setToastMessage('Coach updated successfully!');
            return true;
        } catch (err) {
            console.error("Error updating coach:", err);
            setError("Failed to update coach.");
            return false;
        }
    };

    // Upload coach image using Cloudinary
    const uploadCoachImage = async (index, file) => {
        if (!isAdmin || !file) {
            return false;
        }

        try {
            // Upload to Cloudinary
            const downloadURL = await uploadToCloudinary(file, 'coaches');

            // Update the coach's image URL in the database
            const updatedCoach = {
                ...coaches[index],
                image: downloadURL
            };

            // Save to Firebase
            await updateCoach(index, updatedCoach);

            return downloadURL;
        } catch (err) {
            console.error("Error uploading image:", err);
            setError("Failed to upload image.");
            return false;
        }
    };

    // Handle toast close
    const hideToast = () => {
        setShowToast(false);
    };

    // Context value
    const value = {
        eventDetails,
        coaches,
        isEditingCoaches,
        error,
        loading,
        showToast,
        toastMessage,
        hideToast,
        canEdit: isAdmin,
        updateEventDetails,
        toggleEventEditMode,
        updateCoaches,
        toggleCoachesEditMode,
        updateCoach,
        uploadCoachImage
    };

    return (
        <ContentContext.Provider value={value}>
            {children}
            
            {/* Toast notification */}
            {showToast && (
                <div className="fixed bottom-6 right-6 bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded shadow-md z-50 animate-fade-in-up">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            <span>{toastMessage}</span>
                        </div>
                        <button onClick={hideToast} className="text-green-700 hover:text-green-900">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                        </button>
                    </div>
                </div>
            )}
        </ContentContext.Provider>
    );
}