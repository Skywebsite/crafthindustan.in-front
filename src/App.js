import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-19-helmet-async';
import { WishlistProvider } from './context/WishlistContext';
import { SocketProvider } from './context/SocketContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Loader from './components/Loader';
import Home from './components/Home';
import Brands from './components/Brands';
import Products from './components/Products';
import Events from './components/Events';
import Services from './components/Services';
import FAQ from './components/FAQ';
import Contact from './components/Contact';
import Wishlist from './components/Wishlist';
import ProductPreview from './components/ProductPreview';
import Chat from './components/Chat';
import Profile from './components/Profile';
import Post from './components/Post';
import Brand from './components/Brand';
import BrandDetail from './components/BrandDetail';
import MyPosts from './components/MyPosts';
import ScrollToTop from './components/ScrollToTop';
import './App.css';

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Function to hide loader
    const hideLoader = () => {
      setLoading(false);
    };

    // Check if page is already loaded
    if (document.readyState === 'complete') {
      // Page already loaded, wait a bit for smooth transition
      setTimeout(hideLoader, 800);
    } else {
      // Wait for page to load
      window.addEventListener('load', () => {
        setTimeout(hideLoader, 800);
      });
    }

    // Fallback: hide loader after maximum 3 seconds
    const maxTimer = setTimeout(hideLoader, 3000);

    return () => {
      clearTimeout(maxTimer);
      window.removeEventListener('load', hideLoader);
    };
  }, []);

  return (
    <HelmetProvider>
      <WishlistProvider>
        <SocketProvider>
          <Router>
            <ScrollToTop />
            {loading && <Loader />}
            <div className="App">
              <Navbar />
              <main>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/home" element={<Home />} />
                  <Route path="/brands" element={<Brands />} />
                  <Route path="/products" element={<Products />} />
                  <Route path="/events" element={<Events />} />
                  <Route path="/services" element={<Services />} />
                  <Route path="/faq" element={<FAQ />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/wishlist" element={<Wishlist />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/profile/all" element={<MyPosts />} />
                  <Route path="/brand" element={<Brand />} />
                  <Route path="/brand/:id" element={<BrandDetail />} />
                  <Route path="/post" element={<Post />} />
                  <Route path="/post/:id" element={<ProductPreview />} />
                  <Route path="/product/:id" element={<ProductPreview />} />
                  <Route path="/chat" element={<Chat />} />
                  <Route path="/chat/:conversationId" element={<Chat />} />
                </Routes>
              </main>
              <Footer />
            </div>
          </Router>
        </SocketProvider>
      </WishlistProvider>
    </HelmetProvider>
  );
}

export default App;
