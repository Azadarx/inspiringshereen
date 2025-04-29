// src/components/shared/ImageUpload.jsx
import React, { useState } from 'react';
import { uploadToCloudinary } from '../../utils/uploadToCloudinary';

const ImageUpload = ({ onImageUploaded, folder = 'coaches', buttonLabel = 'Upload Image' }) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [progress, setProgress] = useState(0);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      setError('Image size should be less than 2MB');
      return;
    }

    setUploading(true);
    setError('');
    setProgress(10); // Start progress indication

    try {
      // Simulate progress as we can't track actual progress with direct uploads
      const progressInterval = setInterval(() => {
        setProgress(prev => Math.min(prev + 10, 90));
      }, 300);

      // Upload to Cloudinary
      const imageUrl = await uploadToCloudinary(file, folder);
      
      clearInterval(progressInterval);
      setProgress(100);
      
      // Call the callback with the URL
      onImageUploaded(imageUrl);
      
      setTimeout(() => {
        setUploading(false);
      }, 500);
    } catch (err) {
      console.error('Error uploading image:', err);
      setError('Failed to upload image. Please try again.');
      setUploading(false);
      setProgress(0);
    }
  };

  return (
    <div className="my-3">
      <div className="flex items-center justify-between">
        <label className="inline-block px-4 py-2 bg-violet-600 text-white rounded-lg cursor-pointer hover:bg-violet-700 transition-colors">
          <span>{buttonLabel}</span>
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
            disabled={uploading}
          />
        </label>
        {uploading && (
          <div className="ml-3 text-sm text-violet-700">Uploading...</div>
        )}
      </div>

      {/* Progress bar */}
      {uploading && (
        <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
          <div
            className="bg-violet-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      )}

      {/* Error message */}
      {error && (
        <div className="text-red-500 text-sm mt-2">{error}</div>
      )}
    </div>
  );
};

export default ImageUpload;