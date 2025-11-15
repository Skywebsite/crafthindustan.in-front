import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useWishlist } from '../context/WishlistContext';
import HeartIcon from './HeartIcon';
import Login from './Login';
import './Navbar.css';

const Navbar = () => {
  const location = useLocation();
  const { isLoggedIn, logout, wishlist, user, login } = useWishlist();
  const [showLogin, setShowLogin] = useState(false);

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

  return (
    <>
      <nav className="navbar">
        {/* Logo on the left */}
        <Link to="/" className="navbar-logo">
          <img src="/images/Cream Simple Art and Craft Store Logo (3).png" alt="Craft Hindustan Logo" className="logo-img" />
        </Link>

        <div className="navbar-container">
          {/* Navigation links */}
          <ul className="navbar-menu">
            <li className="navbar-item">
              <Link to="/home" className={`navbar-link ${location.pathname === '/' || location.pathname === '/home' ? 'active' : ''}`}>Home</Link>
            </li>
            <li className="navbar-item">
              <Link to="/brands" className={`navbar-link ${location.pathname === '/brands' ? 'active' : ''}`}>Brands</Link>
            </li>
            <li className="navbar-item">
              <Link to="/products" className={`navbar-link ${location.pathname === '/products' ? 'active' : ''}`}>Products</Link>
            </li>
            <li className="navbar-item">
              <Link to="/events" className={`navbar-link ${location.pathname === '/events' ? 'active' : ''}`}>Events</Link>
            </li>
            <li className="navbar-item">
              <Link to="/services" className={`navbar-link ${location.pathname === '/services' ? 'active' : ''}`}>Services</Link>
            </li>
            <li className="navbar-item">
              <Link to="/faq" className={`navbar-link ${location.pathname === '/faq' ? 'active' : ''}`}>FAQ</Link>
            </li>
            <li className="navbar-item">
              <Link to="/contact" className={`navbar-link ${location.pathname === '/contact' ? 'active' : ''}`}>Contact us</Link>
            </li>
          </ul>

          {/* Wishlist and Profile on the right */}
          <div className="navbar-login">
            {isLoggedIn && (
              <>
                <Link 
                  to="/wishlist" 
                  className={`wishlist-link ${location.pathname === '/wishlist' ? 'active' : ''}`}
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
              <button className="login-btn" onClick={() => setShowLogin(true)}>
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

