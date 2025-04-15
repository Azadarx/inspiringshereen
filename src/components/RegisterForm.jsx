// src/components/RegisterForm.jsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const initCashfree = (paymentSessionId, appId) => {
    if (!window.CashFree) {
      setError('Payment gateway not loaded. Please try again.');
      setLoading(false);
      return;
    }

    const cashfree = new window.CashFree(appId);
    const dropConfig = {
      components: ["order-details", "card", "upi", "netbanking", "app", "paylater"],
      orderToken: paymentSessionId,
      onSuccess: (data) => {
        // On successful payment, navigate to success page
        console.log("Payment success:", data);
        navigate('/success');
      },
      onFailure: (data) => {
        // On payment failure, show error
        console.error("Payment failed:", data);
        setError('Payment failed. Please try again.');
        setLoading(false);
      },
      onClose: () => {
        // When payment modal is closed
        console.log("Payment widget closed");
        setLoading(false);
      },
    };

    cashfree.checkout(dropConfig);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Step 1: Register the user and get reference ID
      const registerResponse = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/register`,
        formData
      );

      if (!registerResponse.data.success) {
        throw new Error('Registration failed');
      }

      const { referenceId } = registerResponse.data;

      // Step 2: Create payment order with Cashfree
      const orderResponse = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/create-payment-order`,
        { referenceId }
      );

      if (!orderResponse.data.success) {
        throw new Error('Failed to create payment order');
      }

      // Save reference ID in session storage for later use
      sessionStorage.setItem('referenceId', referenceId);
      const loadCashfreeSDK = () => {
        return new Promise((resolve, reject) => {
          if (window.CashFree) {
            console.log("Cashfree SDK already loaded");
            resolve();
            return;
          }

          const script = document.createElement("script");
          script.src = "https://sdk.cashfree.com/js/v3/cashfree.js"; // Updated URL
          script.async = true;
          script.crossOrigin = "anonymous"; // Add crossOrigin attribute

          script.onload = () => {
            console.log("Cashfree SDK loaded successfully");
            resolve();
          };

          script.onerror = (error) => {
            console.error("Failed to load Cashfree SDK:", error);
            reject(new Error("Failed to load payment gateway"));
          };

          document.body.appendChild(script);
        });
      };

      // Get payment session ID and app ID from the response
      const { paymentSessionId, appId, orderToken } = orderResponse.data;

      try {
        // Load the Cashfree SDK
        await loadCashfreeSDK();

        // Initialize Cashfree
        const cashfree = new window.CashFree(appId);
        const dropConfig = {
          components: ["order-details", "card", "upi", "netbanking", "app", "paylater"],
          orderToken: orderToken || paymentSessionId, // Use orderToken if available
          onSuccess: (data) => {
            console.log("Payment success:", data);
            navigate('/success');
          },
          onFailure: (data) => {
            console.error("Payment failed:", data);
            setError('Payment failed: ' + (data.message || 'Please try again'));
            setLoading(false);
          },
          onClose: () => {
            console.log("Payment widget closed");
            setLoading(false);
          },
        };

        cashfree.checkout(dropConfig);

      } catch (sdkError) {
        console.error("SDK Error:", sdkError);
        setError('Failed to load payment gateway: ' + sdkError.message);
        setLoading(false);
      }

    } catch (err) {
      console.error('Registration/payment error:', err);
      setError('An error occurred: ' + (err.response?.data?.error || err.message));
      setLoading(false);
    }
  };
  // In your registerForm.jsx, add this before your return statement
  useEffect(() => {
    // Check if we're in development mode
    if (import.meta.env.DEV) {
      console.log("Environment vars:", {
        apiBaseUrl: import.meta.env.VITE_API_BASE_URL,
        hasAppId: !!import.meta.env.VITE_CASHFREE_APP_ID,
      });

      // Check if Cashfree is already available
      console.log("Cashfree SDK available:", !!window.CashFree);
    }
  }, []);

  return (
    <section id="register" className="py-16 bg-gradient-to-br from-purple-50 to-indigo-50">
      <div className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Register Now</h2>
          <div className="w-24 h-1 bg-purple-600 mx-auto mb-6"></div>
          <p className="text-lg text-gray-600 mb-4">
            Join our live masterclass and transform your life
          </p>
          <p className="font-medium text-purple-600">
            Only ₹99 (Limited Time Offer!)
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white rounded-lg shadow-lg p-8"
        >
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label htmlFor="fullName" className="block text-gray-700 font-medium mb-2">Full Name</label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                placeholder="Your full name"
                required
              />
            </div>

            <div className="mb-6">
              <label htmlFor="email" className="block text-gray-700 font-medium mb-2">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                placeholder="Your email address"
                required
              />
            </div>

            <div className="mb-8">
              <label htmlFor="phone" className="block text-gray-700 font-medium mb-2">Phone Number</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                placeholder="Your phone number"
                required
              />
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-lg">
                {error}
              </div>
            )}

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              disabled={loading}
              className="w-full bg-purple-600 text-white py-3 px-6 rounded-full font-medium text-lg shadow-lg hover:bg-purple-700 transition-all duration-300 flex items-center justify-center"
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </>
              ) : (
                'Continue to Payment - ₹99 Only'
              )}
            </motion.button>
          </form>
        </motion.div>
      </div>
    </section>
  );
};

export default RegisterForm;