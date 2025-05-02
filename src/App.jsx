import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Features from './components/Features';
import Coaches from './components/Coaches';
import Testimonials from './components/Testimonials';
import Pricing from './components/Pricing';
import Footer from './components/Footer';
import Success from './components/Success';
import RegisterForm from './components/RegisterForm';
import ContactUs from './components/ContactUs';
import TermsAndConditions from './components/TermsAndConditions';
import RefundAndCancellation from './components/RefundAndCancellation';
import RazorpayPrivacyPolicy from './components/RazorpayPrivacyPolicy';
import Profile from './components/Profile';
import AuthFlowHandler from './components/auth/AuthFlowHandler';
import Loader from './components/Loader';
import ScrollToTop from './components/ScrollToTop';

// Loading state context
export const LoadingContext = React.createContext({
  isLoading: false,
  setLoading: () => {}
});

// Route change detector and loader manager
const RouteChangeLoader = ({ children }) => {
  const [isLoading, setLoading] = useState(true);
  const location = useLocation();

  // Show loader on initial load and route changes
  useEffect(() => {
    setLoading(true);
    
    // Set a timeout to hide loader after a minimum display time
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000); // 1 second minimum loading display
    
    return () => clearTimeout(timer);
  }, [location.pathname]);

  return (
    <LoadingContext.Provider value={{ isLoading, setLoading }}>
      {isLoading && <Loader />}
      {children}
    </LoadingContext.Provider>
  );
};

// Main Routes Component
const AppRoutes = () => {
  return (
    <RouteChangeLoader>
      <ScrollToTop /> {/* Add ScrollToTop component here */}
      <Routes>
        <Route path="/" element={
          <div className="font-poppins">
            <Navbar />
            <Hero />
            <About />
            <Coaches />
            <Pricing />
            <RegisterForm />
            <Features />
            <Testimonials />
            <ContactUs />
            <Footer />
          </div>
        } />
        <Route path="/register" element={
          <>
            <Navbar />
            <AuthFlowHandler />
            <Footer />
          </>
        } />
        <Route path="/profile" element={<Profile />} />
        <Route path="/ContactUs" element={<ContactUs />} />
        <Route path="/TermsandConditions" element={<TermsAndConditions />} />
        <Route path="/RefundandCancellation" element={<RefundAndCancellation />} />
        <Route path="/privacypolicy" element={<RazorpayPrivacyPolicy />} />
        <Route path="/success" element={<Success />} />
        <Route path="/*" element={<Navigate to="/" />} />
      </Routes>
    </RouteChangeLoader>
  );
};

// Custom hook to use the loading context
export const useLoading = () => {
  const context = React.useContext(LoadingContext);
  if (!context) {
    throw new Error('useLoading must be used within a LoadingProvider');
  }
  
  const { isLoading, setLoading } = context;
  
  // Helper function to wrap async operations with loading state
  const showLoading = (callback) => {
    setLoading(true);
    
    const hideLoader = () => {
      setTimeout(() => {
        setLoading(false);
      }, 500); // Minimum display time
    };
    
    try {
      const result = callback();
      
      // Handle promises
      if (result instanceof Promise) {
        return result.finally(hideLoader);
      } else {
        hideLoader();
        return result;
      }
    } catch (error) {
      hideLoader();
      throw error;
    }
  };
  
  return { isLoading, showLoading };
};

function App() {
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
}

export default App;