import React, { createContext, useState, useContext, useEffect } from 'react';
import { authAPI, userAPI } from '../services/api';

const WishlistContext = createContext();

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check authentication state and load user data
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');
        
        if (token && storedUser) {
          // Verify token is still valid
          const result = await authAPI.getCurrentUser();
          if (result.success && result.user) {
            setUser(result.user);
            setIsLoggedIn(true);
            // Load wishlist from backend
            const userWishlist = await userAPI.getWishlist();
            setWishlist(userWishlist);
          } else {
            // Token invalid, clear storage
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            setUser(null);
            setIsLoggedIn(false);
            setWishlist([]);
          }
        } else {
          setUser(null);
          setIsLoggedIn(false);
          setWishlist([]);
        }
      } catch (error) {
        console.error('Auth check error:', error);
        setUser(null);
        setIsLoggedIn(false);
        setWishlist([]);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const addToWishlist = async (product) => {
    if (!isLoggedIn || !user) {
      return { success: false, error: 'Please login to add items to wishlist' };
    }

    if (wishlist.find((item) => item.id === product.id)) {
      return { success: false, error: 'Product already in wishlist' };
    }

    try {
      const result = await userAPI.addToWishlist(product);
      if (result.success) {
        setWishlist(result.wishlist || [...wishlist, product]);
        return { success: true };
      }
      return result;
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const removeFromWishlist = async (productId) => {
    if (!isLoggedIn || !user) {
      return { success: false, error: 'User not logged in' };
    }

    try {
      const result = await userAPI.removeFromWishlist(productId);
      if (result.success) {
        setWishlist(result.wishlist || wishlist.filter((item) => item.id !== productId));
        return { success: true };
      }
      return result;
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const isInWishlist = (productId) => {
    return wishlist.some((item) => item.id === productId);
  };

  const toggleWishlist = async (product) => {
    if (!isLoggedIn || !user) {
      return { success: false, error: 'Please login to add items to wishlist' };
    }

    if (isInWishlist(product.id)) {
      return await removeFromWishlist(product.id);
    } else {
      return await addToWishlist(product);
    }
  };

  const login = (userData) => {
    console.log('WishlistContext login called with:', userData);
    setUser(userData);
    setIsLoggedIn(true);
    // Load wishlist after login
    userAPI.getWishlist().then(wishlistData => {
      setWishlist(wishlistData);
    }).catch(error => {
      console.error('Error loading wishlist:', error);
    });
  };

  const logout = async () => {
    authAPI.logout();
    setUser(null);
    setIsLoggedIn(false);
    setWishlist([]);
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        toggleWishlist,
        isLoggedIn,
        user,
        login,
        logout,
        loading,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

