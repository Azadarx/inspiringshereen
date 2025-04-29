// src/contexts/ContentContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { ref, get, set, update } from 'firebase/database';
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

    // Editable content states
    const [eventDetails, setEventDetails] = useState({
        date: 'APRIL 19TH',
        time: '11:30 AM',
        isEditing: false
    });

    const [coaches, setCoaches] = useState([
        {
            name: "Inspiring Shereen",
            title: "Life Coach",
            description: "Shaping Lives With Holistic Success",
            image: null, // Will be populated from Firebase
            bio: "With over 10 years of experience in transformational coaching, Shereen has helped hundreds of professionals reclaim their purpose and passion.",
            expertise: ["Personal Development", "Life Transformation", "Mindfulness Training"]
        },
        {
            name: "Sikander Tuteja",
            title: "Holistic Success Coach",
            description: "Expert in business growth and personal development",
            image: null, // Will be populated from Firebase
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

    // Load content from Firebase on component mount
    useEffect(() => {
        async function loadContent() {
            try {
                // Get content reference from Firebase
                const contentRef = ref(rtdb, 'content');
                const snapshot = await get(contentRef);

                if (snapshot.exists()) {
                    const data = snapshot.val();

                    // Update event details if available
                    if (data.eventDetails) {
                        setEventDetails(prevState => ({
                            ...prevState,
                            date: data.eventDetails.date || prevState.date,
                            time: data.eventDetails.time || prevState.time
                        }));
                    }

                    // Update coaches if available
                    if (data.coaches) {
                        setCoaches(data.coaches);
                    }
                } else if (isAdmin) {
                    // Only admin can initialize the content
                    await initializeContent();
                }

            } catch (err) {
                console.error("Error loading content:", err);
                setError("Failed to load content. Please refresh the page.");
            } finally {
                setLoading(false);
            }
        }

        loadContent();
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
                    time: eventDetails.time
                },
                coaches: coaches
            });
        } catch (err) {
            console.error("Error initializing content:", err);
            setError("Failed to initialize content.");
        }
    };


    // Update event details
    const updateEventDetails = async (newDetails) => {
        if (!isAdmin) {
            setError("You don't have permission to update content.");
            return false;
        }

        try {
            const eventRef = ref(rtdb, 'content/eventDetails');
            await update(eventRef, newDetails);

            setEventDetails(prevState => ({
                ...prevState,
                ...newDetails,
                isEditing: false
            }));

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
        setEventDetails(prev => ({ ...prev, isEditing: !prev.isEditing }));
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

    // Context value
    const value = {
        eventDetails,
        coaches,
        isEditingCoaches,
        error,
        loading,
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
        </ContentContext.Provider>
    );
}

export default ContentContext;