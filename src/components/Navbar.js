import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useWishlist } from '../context/WishlistContext';
import HeartIcon from './HeartIcon';
import Login from './Login';
import './Navbar.css';

const Navbar = () => {
  const location = useLocation();
  const { isLoggedIn, logout, wishlist, user, login } = useWishlist();
  const [showLogin, setShowLogin] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  // Close mobile menu when window is resized to desktop size
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleLoginSuccess = (userData) => {
    // Update the context with the logged-in user
    console.log('Login success, user data:', userData);
    if (userData) {
      login(userData);
    }
    setShowLogin(false);
  };


  const getInitials = (name) => {
    if (!name) return 'U';
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const getProfileImage = () => {
    if (user?.photoURL) {
      return user.photoURL;
    }
    return null;
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      {/* Mobile menu backdrop */}
      {isMobileMenuOpen && (
        <div 
          className="mobile-menu-backdrop" 
          onClick={closeMobileMenu}
          aria-hidden="true"
        />
      )}

      <nav className="navbar">
        {/* Logo on the left */}
        <Link to="/" className="navbar-logo" onClick={closeMobileMenu}>
          <img src="/images/Cream Simple Art and Craft Store Logo (3).png" alt="Craft Hindustan Logo" className="logo-img" />
        </Link>

        {/* Hamburger menu button */}
        <button 
          className={`hamburger-menu ${isMobileMenuOpen ? 'active' : ''}`}
          onClick={toggleMobileMenu}
          aria-label="Toggle menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <div className={`navbar-container ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
          {/* Navigation links */}
          <ul className="navbar-menu">
            <li className="navbar-item">
              <Link to="/home" className={`navbar-link ${location.pathname === '/' || location.pathname === '/home' ? 'active' : ''}`} onClick={closeMobileMenu}>
                <span className="navbar-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                    <polyline points="9 22 9 12 15 12 15 22"></polyline>
                  </svg>
                </span>
                <span className="navbar-text">Home</span>
              </Link>
            </li>
            <li className="navbar-item">
              <Link to="/brands" className={`navbar-link ${location.pathname === '/brands' ? 'active' : ''}`} onClick={closeMobileMenu}>
                <span className="navbar-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 11c0-1.1.9-2 2-2h4a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-6z"></path>
                    <path d="M13 7h4a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2z"></path>
                    <path d="M3 21h18"></path>
                  </svg>
                </span>
                <span className="navbar-text">Brands</span>
              </Link>
            </li>
            <li className="navbar-item">
              <Link to="/products" className={`navbar-link ${location.pathname === '/products' ? 'active' : ''}`} onClick={closeMobileMenu}>
                <span className="navbar-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                    <line x1="3" y1="6" x2="21" y2="6"></line>
                    <path d="M16 10a4 4 0 0 1-8 0"></path>
                  </svg>
                </span>
                <span className="navbar-text">Products</span>
              </Link>
            </li>
            <li className="navbar-item">
              <Link to="/events" className={`navbar-link ${location.pathname === '/events' ? 'active' : ''}`} onClick={closeMobileMenu}>
                <span className="navbar-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                    <line x1="16" y1="2" x2="16" y2="6"></line>
                    <line x1="8" y1="2" x2="8" y2="6"></line>
                    <line x1="3" y1="10" x2="21" y2="10"></line>
                  </svg>
                </span>
                <span className="navbar-text">Events</span>
              </Link>
            </li>
            <li className="navbar-item">
              <Link to="/services" className={`navbar-link ${location.pathname === '/services' ? 'active' : ''}`} onClick={closeMobileMenu}>
                <span className="navbar-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path>
                  </svg>
                </span>
                <span className="navbar-text">Services</span>
              </Link>
            </li>
            <li className="navbar-item">
              <Link to="/faq" className={`navbar-link ${location.pathname === '/faq' ? 'active' : ''}`} onClick={closeMobileMenu}>
                <span className="navbar-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                    <line x1="12" y1="17" x2="12.01" y2="17"></line>
                  </svg>
                </span>
                <span className="navbar-text">FAQ</span>
              </Link>
            </li>
          </ul>

          {/* Wishlist and Profile on the right */}
          <div className="navbar-login">
            {isLoggedIn && (
              <>
                {/* Create Post Button - Mobile Friendly */}
                <Link 
                  to="/post" 
                  className={`create-post-btn-nav ${location.pathname === '/post' ? 'active' : ''}`}
                  onClick={closeMobileMenu}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="12" y1="5" x2="12" y2="19"></line>
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                  </svg>
                  <span>Create Post</span>
                </Link>

                <Link 
                  to="/wishlist" 
                  className={`wishlist-link ${location.pathname === '/wishlist' ? 'active' : ''}`}
                  onClick={closeMobileMenu}
                >
                  <span className="wishlist-icon">
                    <HeartIcon filled={true} />
                  </span>
                  {wishlist.length > 0 && <span className="wishlist-count">{wishlist.length}</span>}
                </Link>

                <Link 
                  to="/chat"
                  aria-label="Open chat"
                  className={`chat-icon-link ${location.pathname.startsWith('/chat') ? 'active' : ''}`}
                  onClick={closeMobileMenu}
                >
                  <span className="chat-icon">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                    </svg>
                  </span>
                </Link>
                
                {/* Profile Link */}
                <Link 
                  to="/profile" 
                  className="profile-btn-link"
                  onClick={closeMobileMenu}
                >
                  <div className="profile-avatar">
                    {getProfileImage() ? (
                      <img 
                        src={getProfileImage()} 
                        alt="Profile" 
                        className="profile-image"
                      />
                    ) : (
                      <span className="profile-initials">
                        {getInitials(user?.name || user?.displayName || 'User')}
                      </span>
                    )}
                  </div>
                  <div className="profile-info">
                    <span className="profile-name">
                      {user?.name || user?.displayName || 'User'}
                    </span>
                    <span className="profile-email">
                      {user?.email || ''}
                    </span>
                  </div>
                </Link>
              </>
            )}
            {!isLoggedIn && (
              <button className="login-btn" onClick={() => {
                setShowLogin(true);
                closeMobileMenu();
              }}>
                Login
              </button>
            )}
          </div>
        </div>
      </nav>
      {showLogin && (
        <Login 
          onClose={() => setShowLogin(false)} 
          onSuccess={handleLoginSuccess}
        />
      )}
    </>
  );
};

export default Navbar;

