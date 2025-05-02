import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Phone, Mail } from 'lucide-react';

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState({ type: '', text: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error messages when user starts typing again
    if (submitMessage.type === 'error') {
      setSubmitMessage({ type: '', text: '' });
    }
  };

  const validateForm = () => {
    // Basic validation
    if (!formData.name.trim()) {
      setSubmitMessage({ type: 'error', text: 'Please enter your name' });
      return false;
    }
    
    if (!formData.email.trim()) {
      setSubmitMessage({ type: 'error', text: 'Please enter your email address' });
      return false;
    }
    
    // Simple email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setSubmitMessage({ type: 'error', text: 'Please enter a valid email address' });
      return false;
    }
    
    if (!formData.subject.trim()) {
      setSubmitMessage({ type: 'error', text: 'Please enter a subject' });
      return false;
    }
    
    if (!formData.message.trim()) {
      setSubmitMessage({ type: 'error', text: 'Please enter your message' });
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Don't proceed if already submitting
    if (submitting) return;
    
    // Validate form before submission
    if (!validateForm()) return;
    
    setSubmitting(true);
    setSubmitMessage({ type: '', text: '' });

    try {
      // Log the form data being sent
      console.log('Sending form data:', formData);
      
      // Make the API call with proper error handling and timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 60000); // Increase to 60s
      
      const response = await fetch('/api/contact-us', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
        signal: controller.signal
      });
      
      clearTimeout(timeoutId); // Clear timeout if request completes
      
      // Log the response status
      console.log('Response status:', response.status);
      
      // Parse the response data
      let data;
      try {
        data = await response.json();
        console.log('Response data:', data);
      } catch (parseError) {
        console.error('Error parsing response:', parseError);
        throw new Error('Invalid response format from server');
      }

      if (response.ok) {
        setSubmitMessage({ 
          type: 'success', 
          text: 'Message sent successfully! We will get back to you soon.' 
        });
        // Reset form
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        setSubmitMessage({ 
          type: 'error', 
          text: data.error || 'Something went wrong. Please try again.' 
        });
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      
      if (error.name === 'AbortError') {
        setSubmitMessage({ 
          type: 'error', 
          text: 'Request timed out. Please try again later.' 
        });
      } else {
        setSubmitMessage({ 
          type: 'error', 
          text: 'Network error. Please check your connection and try again.' 
        });
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 pt-20 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <motion.h1
            className="text-4xl md:text-5xl font-bold text-white mb-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            Contact Us
          </motion.h1>
          <motion.div
            className="h-1 w-20 bg-yellow-300 mx-auto"
            initial={{ width: 0 }}
            animate={{ width: 80 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          ></motion.div>
          <motion.p
            className="text-white/90 mt-4 max-w-2xl mx-auto text-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            We'd love to hear from you! Reach out using the information below.
          </motion.p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="bg-white rounded-3xl shadow-2xl overflow-hidden relative"
        >
          <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-pink-400 to-purple-600 rounded-bl-full opacity-20"></div>
          <div className="absolute bottom-0 left-0 w-40 h-40 bg-gradient-to-tr from-purple-400 to-indigo-600 rounded-tr-full opacity-20"></div>

          <div className="p-6 sm:p-8 md:p-12 relative z-10">
            <div className="mb-8 flex flex-col items-center">
              <motion.p
                className="text-xl md:text-2xl font-bold text-gray-800 mb-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.9 }}
              >
                You may contact us using the information below:
              </motion.p>
            </div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-gradient-to-r from-purple-50 to-indigo-50 p-6 rounded-xl shadow-md mb-10 max-w-lg mx-auto"
            >
              <h3 className="font-bold text-gray-800 mb-6 flex items-center justify-center text-xl">
                <MapPin className="text-purple-600 mr-2" size={24} />
                Merchant Details
              </h3>
              
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-start bg-white/50 p-3 rounded-lg">
                  <span className="font-medium text-purple-700 min-w-32 mb-1 sm:mb-0">Legal entity name:</span>
                  <span className="text-gray-700 ml-0 sm:ml-2">SHEREEN BEGUM</span>
                </div>
                
                <div className="flex flex-col sm:flex-row sm:items-center justify-start bg-white/50 p-3 rounded-lg">
                  <span className="font-medium text-purple-700 min-w-32 flex items-center mb-1 sm:mb-0">
                    <Mail className="text-purple-600 mr-2" size={18} />
                    Email:
                  </span>
                  <a href="mailto:inspiringshereen@gmail.com" 
                     className="text-purple-600 hover:text-purple-800 transition-colors ml-0 sm:ml-2 break-all">
                    inspiringshereen@gmail.com
                  </a>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2, duration: 0.8 }}
              className="mt-10"
            >
              <h3 className="text-xl font-bold text-gray-800 mb-6 text-center">Send us a message</h3>
              
              {submitMessage.text && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`mb-6 p-4 rounded-lg text-center ${
                    submitMessage.type === 'success' 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-red-100 text-red-700'
                  }`}
                >
                  {submitMessage.text}
                </motion.div>
              )}
              
              <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                <div>
                  <label htmlFor="name" className="block text-gray-700 mb-2 font-medium">Your Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-lg border ${
                      submitMessage.type === 'error' && !formData.name.trim() 
                        ? 'border-red-500 focus:ring-red-500' 
                        : 'border-gray-300 focus:ring-purple-500'
                    } focus:border-transparent outline-none transition`}
                    placeholder="Enter your name"
                    disabled={submitting}
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-gray-700 mb-2 font-medium">Email Address</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-lg border ${
                      submitMessage.type === 'error' && (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
                        ? 'border-red-500 focus:ring-red-500' 
                        : 'border-gray-300 focus:ring-purple-500'
                    } focus:border-transparent outline-none transition`}
                    placeholder="Enter your email"
                    disabled={submitting}
                  />
                </div>
                <div className="md:col-span-2">
                  <label htmlFor="subject" className="block text-gray-700 mb-2 font-medium">Subject</label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-lg border ${
                      submitMessage.type === 'error' && !formData.subject.trim() 
                        ? 'border-red-500 focus:ring-red-500' 
                        : 'border-gray-300 focus:ring-purple-500'
                    } focus:border-transparent outline-none transition`}
                    placeholder="Enter subject"
                    disabled={submitting}
                  />
                </div>
                <div className="md:col-span-2">
                  <label htmlFor="message" className="block text-gray-700 mb-2 font-medium">Message</label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-lg border ${
                      submitMessage.type === 'error' && !formData.message.trim() 
                        ? 'border-red-500 focus:ring-red-500' 
                        : 'border-gray-300 focus:ring-purple-500'
                    } focus:border-transparent outline-none transition h-32`}
                    placeholder="Enter your message"
                    disabled={submitting}
                  ></textarea>
                </div>
                <div className="md:col-span-2 flex justify-center">
                  <motion.button
                    whileHover={{ scale: submitting ? 1 : 1.03 }}
                    whileTap={{ scale: submitting ? 1 : 0.98 }}
                    className={`${
                      submitting 
                        ? 'bg-gray-400 cursor-not-allowed' 
                        : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:shadow-xl'
                    } text-white font-medium px-8 py-3 rounded-lg shadow-lg transition-all w-full sm:w-auto min-w-40 flex items-center justify-center`}
                    type="submit"
                    disabled={submitting}
                    aria-label="Send message"
                  >
                    {submitting ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Sending...
                      </>
                    ) : 'Send Message'}
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ContactUs;