// API base URL
export const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://crafthindustan-in-backend-jscr.vercel.app/api';

// Helper function to make API requests
const apiRequest = async (endpoint, options = {}) => {
  const token = localStorage.getItem('token');
  
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  if (config.body && typeof config.body === 'object') {
    config.body = JSON.stringify(config.body);
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || data.message || 'Request failed');
    }

    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

// Auth API
export const authAPI = {
  register: async (name, email, password) => {
    const response = await apiRequest('/auth/register', {
      method: 'POST',
      body: { name, email, password },
    });
    
    if (response.success && response.token) {
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
    }
    
    return response;
  },

  login: async (email, password) => {
    const response = await apiRequest('/auth/login', {
      method: 'POST',
      body: { email, password },
    });
    
    if (response.success && response.token) {
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
    }
    
    return response;
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    return { success: true };
  },

  getCurrentUser: async () => {
    try {
      const response = await apiRequest('/auth/me');
      if (response.success) {
        localStorage.setItem('user', JSON.stringify(response.user));
      }
      return response;
    } catch (error) {
      // If token is invalid, clear storage
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      return { success: false, user: null };
    }
  },

  resetPassword: async (email) => {
    return await apiRequest('/auth/reset-password', {
      method: 'POST',
      body: { email },
    });
  },

  googleLogin: async (idToken, userInfo) => {
    if (!idToken || !userInfo) {
      throw new Error('ID token and user info are required');
    }
    
    const response = await apiRequest('/auth/google', {
      method: 'POST',
      body: { 
        idToken: idToken,
        userInfo: userInfo
      },
    });
    
    if (response.success && response.token) {
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
    }
    
    return response;
  },
};

// User API
export const userAPI = {
  getProfile: async () => {
    return await apiRequest('/users/profile');
  },

  updateProfile: async (updates, photoFile) => {
    const token = localStorage.getItem('token');
    
    const formData = new FormData();
    if (updates.name) {
      formData.append('name', updates.name);
    }
    if (updates.email) {
      formData.append('email', updates.email);
    }
    if (photoFile) {
      formData.append('photo', photoFile);
    }

    try {
    const response = await fetch(`${API_BASE_URL}/users/profile`, {
        method: 'PUT',
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 401 || response.status === 404) {
          if (data.error && (data.error.includes('User not found') || data.error.includes('Invalid token'))) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
          }
        }
        const errorMsg = data.error || data.errors?.[0]?.msg || data.message || 'Request failed';
        throw new Error(errorMsg);
      }

      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },

  getWishlist: async () => {
    const response = await apiRequest('/users/wishlist');
    return response.wishlist || [];
  },

  addToWishlist: async (product) => {
    return await apiRequest('/users/wishlist', {
      method: 'POST',
      body: { product },
    });
  },

  removeFromWishlist: async (productId) => {
    return await apiRequest(`/users/wishlist/${productId}`, {
      method: 'DELETE',
    });
  },
};

// Posts API
export const postAPI = {
  createPost: async (formData, imageFiles, tags) => {
    const token = localStorage.getItem('token');
    
    // Create FormData for multipart/form-data
    const formDataToSend = new FormData();
          formDataToSend.append('title', formData.title.trim());
          formDataToSend.append('description', formData.description.trim());
          formDataToSend.append('category', formData.category);
          formDataToSend.append('price', formData.price);
          formDataToSend.append('brand', formData.brand); // Brand is required
          formDataToSend.append('quantity', formData.quantity || 1);
          if (formData.location) {
            formDataToSend.append('location', formData.location.trim());
          }
          if (tags && tags.length > 0) {
            formDataToSend.append('tags', tags.join(','));
          }
    
    // Append all image files
    imageFiles.forEach((file) => {
      formDataToSend.append('images', file);
    });

    try {
      console.log('Sending post request with:', {
        title: formData.title,
        category: formData.category,
        brand: formData.brand,
        imageCount: imageFiles.length,
        hasToken: !!token
      });

      const response = await fetch(`${API_BASE_URL}/posts`, {
        method: 'POST',
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
          // Don't set Content-Type, let browser set it with boundary for FormData
        },
        body: formDataToSend,
      });

      const data = await response.json();

      console.log('Post API response:', {
        status: response.status,
        success: data.success,
        error: data.error
      });

      if (!response.ok) {
        // Handle authentication errors
        if (response.status === 401 || response.status === 404) {
          if (data.error && (data.error.includes('User not found') || data.error.includes('Invalid token'))) {
            // Clear invalid token
            localStorage.removeItem('token');
            localStorage.removeItem('user');
          }
        }
        const errorMsg = data.error || data.errors?.[0]?.msg || data.message || 'Request failed';
        throw new Error(errorMsg);
      }

      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },

  getPosts: async (filters = {}) => {
    const queryParams = new URLSearchParams(filters).toString();
    return await apiRequest(`/posts${queryParams ? `?${queryParams}` : ''}`);
  },

  getPost: async (postId) => {
    return await apiRequest(`/posts/${postId}`);
  },

  getMyPosts: async () => {
    return await apiRequest('/posts/user/my-posts');
  },

  updatePost: async (postId, updates) => {
    return await apiRequest(`/posts/${postId}`, {
      method: 'PUT',
      body: updates,
    });
  },

  deletePost: async (postId) => {
    return await apiRequest(`/posts/${postId}`, {
      method: 'DELETE',
    });
  },
};

// Brands API
export const brandAPI = {
  createBrand: async (formData, pictureFile) => {
    const token = localStorage.getItem('token');
    
    const formDataToSend = new FormData();
    formDataToSend.append('name', formData.name.trim());
    formDataToSend.append('bio', formData.bio.trim());
    formDataToSend.append('establishedYear', formData.establishedYear);
    
    if (pictureFile) {
      formDataToSend.append('picture', pictureFile);
    }

    try {
      const response = await fetch(`${API_BASE_URL}/brands`, {
        method: 'POST',
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: formDataToSend,
      });

      const data = await response.json();

      if (!response.ok) {
        const errorMsg = data.error || data.errors?.[0]?.msg || data.message || 'Request failed';
        throw new Error(errorMsg);
      }

      return data;
    } catch (error) {
      console.error('Brand API Error:', error);
      throw error;
    }
  },

  getAllBrands: async (filters = {}) => {
    const queryParams = new URLSearchParams(filters).toString();
    return await apiRequest(`/brands${queryParams ? `?${queryParams}` : ''}`);
  },

  getMyBrands: async () => {
    return await apiRequest('/brands/my-brands');
  },

  getBrand: async (brandId) => {
    return await apiRequest(`/brands/${brandId}`);
  },

  updateBrand: async (brandId, formData, pictureFile) => {
    const token = localStorage.getItem('token');
    
    const formDataToSend = new FormData();
    if (formData.name) formDataToSend.append('name', formData.name.trim());
    if (formData.bio) formDataToSend.append('bio', formData.bio.trim());
    if (formData.establishedYear) formDataToSend.append('establishedYear', formData.establishedYear);
    
    if (pictureFile) {
      formDataToSend.append('picture', pictureFile);
    }

    try {
      const response = await fetch(`${API_BASE_URL}/brands/${brandId}`, {
        method: 'PUT',
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: formDataToSend,
      });

      const data = await response.json();

      if (!response.ok) {
        const errorMsg = data.error || data.errors?.[0]?.msg || data.message || 'Request failed';
        throw new Error(errorMsg);
      }

      return data;
    } catch (error) {
      console.error('Brand API Error:', error);
      throw error;
    }
  },
};

// Chat API
export const chatAPI = {
  startConversation: async ({ participantId, postId }) => {
    return await apiRequest('/chat/conversations', {
      method: 'POST',
      body: { participantId, postId }
    });
  },
  getConversations: async () => {
    return await apiRequest('/chat/conversations');
  },
  getMessages: async (conversationId) => {
    return await apiRequest(`/chat/conversations/${conversationId}/messages`);
  },
  sendMessage: async (conversationId, content) => {
    return await apiRequest(`/chat/conversations/${conversationId}/messages`, {
      method: 'POST',
      body: { content }
    });
  }
};

export default apiRequest;

