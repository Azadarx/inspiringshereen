// src/utils/uploadToCloudinary.js

/**
 * Uploads a file directly to Cloudinary using unsigned upload
 * 
 * @param {File} file - The file object to upload
 * @param {string} folder - The folder path in Cloudinary (e.g. 'coaches')
 * @param {string} uploadPreset - The unsigned upload preset name
 * @returns {Promise<string>} The secure URL of the uploaded image
 */
export const uploadToCloudinary = async (
    file, 
    folder = 'coaches', 
    uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || 'unsigned_lms_uploads'
  ) => {
    try {
      // Create form data for the upload
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', uploadPreset);
      formData.append('folder', folder);
      
      // Get cloud name from environment variables
      const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
      
      if (!cloudName) {
        throw new Error('Cloudinary cloud name is not configured in environment variables');
      }
      
      // Upload to Cloudinary
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        {
          method: 'POST',
          body: formData
        }
      );
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Cloudinary upload failed: ${errorData.error?.message || 'Unknown error'}`);
      }
      
      const data = await response.json();
      
      // Return the secure URL
      return data.secure_url;
    } catch (error) {
      console.error('Error uploading to Cloudinary:', error);
      throw error;
    }
  };
  
  export default uploadToCloudinary;