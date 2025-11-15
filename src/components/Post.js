import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWishlist } from '../context/WishlistContext';
import { postAPI, brandAPI } from '../services/api';
import './Post.css';

const Post = () => {
  const { isLoggedIn, user } = useWishlist();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    price: '',
    tags: '',
    brand: '',
    quantity: 1,
    location: ''
  });
  
  const [brands, setBrands] = useState([]);
  const [loadingBrands, setLoadingBrands] = useState(true);
  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/');
      return;
    }

    const fetchBrands = async () => {
      try {
        setLoadingBrands(true);
        const result = await brandAPI.getMyBrands();
        if (result.success) {
          // Handle both old format (brands array) and new format (brand object)
          const brandsList = result.brands || (result.brand ? [result.brand] : []);
          setBrands(brandsList);
          if (brandsList.length > 0) {
            setFormData(prev => ({ ...prev, brand: brandsList[0]._id }));
          }
        }
      } catch (err) {
        console.error('Error fetching brands:', err);
      } finally {
        setLoadingBrands(false);
      }
    };

    fetchBrands();
  }, [isLoggedIn, navigate]);

  const categories = [
    'Painting',
    'Drawing',
    'Sculpture',
    'Pottery',
    'Textiles',
    'Jewelry',
    'Woodwork',
    'Paper Crafts',
    'Metalwork',
    'Other'
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    
    if (files.length + imagePreviews.length > 5) {
      setError('You can upload maximum 5 images');
      return;
    }

    const validFiles = [];
    files.forEach(file => {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setError('Image size should be less than 5MB');
        return;
      }

      validFiles.push(file);

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviews(prev => [...prev, reader.result]);
      };
      reader.readAsDataURL(file);
    });

    setImageFiles(prev => [...prev, ...validFiles]);
  };

  const removeImage = (index) => {
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
    setImageFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Validate form
      if (!formData.title.trim()) {
        setError('Title is required');
        setLoading(false);
        return;
      }

      if (!formData.description.trim()) {
        setError('Description is required');
        setLoading(false);
        return;
      }

      if (!formData.category) {
        setError('Please select a category');
        setLoading(false);
        return;
      }

      if (!formData.price || parseFloat(formData.price) < 0) {
        setError('Please enter a valid price');
        setLoading(false);
        return;
      }

      if (!formData.brand) {
        setError('Please select a brand. Create a brand first if you don\'t have one.');
        setLoading(false);
        return;
      }

      if (imageFiles.length === 0) {
        setError('Please upload at least one image');
        setLoading(false);
        return;
      }

      // Process tags
      const tags = formData.tags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0);

      console.log('Submitting post:', {
        title: formData.title,
        category: formData.category,
        brand: formData.brand,
        imageCount: imageFiles.length
      });

      const result = await postAPI.createPost(formData, imageFiles, tags);

      console.log('Post result:', result);

      if (result.success) {
        alert('Craft posted successfully!');
        // Reset form
        setFormData({
          title: '',
          description: '',
          category: '',
          price: '',
          tags: '',
          brand: brands.length > 0 ? brands[0]._id : '',
          quantity: 1,
          location: ''
        });
        setImageFiles([]);
        setImagePreviews([]);
        // Navigate to posts or profile
        navigate('/profile');
      } else {
        const errorMsg = result.error || result.errors?.[0]?.msg || 'Failed to post craft';
        setError(errorMsg);
      }
    } catch (err) {
      console.error('Post error:', err);
      const errorMsg = err.message || 'Failed to post craft. Please try again.';
      setError(errorMsg);
      
      // If user not found or token invalid, prompt to login again
      if (errorMsg.includes('User not found') || errorMsg.includes('Invalid token') || errorMsg.includes('No token')) {
        if (window.confirm('Your session has expired. Please log in again to continue.')) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          navigate('/');
          window.location.reload();
        }
      }
    } finally {
      setLoading(false);
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="post-container">
        <div className="post-not-logged-in">
          <h2>Please log in to post your craft</h2>
          <p>You need to be logged in to create a post.</p>
          <button onClick={() => navigate('/')} className="login-redirect-btn">
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="post-container">
      <div className="post-content">
        <div className="post-header">
          <h1>Post Your Craft</h1>
          <p>Share your beautiful craft with the community</p>
        </div>

        <form onSubmit={handleSubmit} className="post-form">
          {error && <div className="post-error">{error}</div>}

          <div className="form-group">
            <label htmlFor="title">Title *</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter craft title"
              required
              maxLength={200}
            />
          </div>

          {loadingBrands ? (
            <div className="form-group">
              <label>Loading brands...</label>
            </div>
          ) : brands.length === 0 ? (
            <div className="form-group">
              <div className="no-brands-message">
                <p>You need to create a brand before posting crafts.</p>
                <button
                  type="button"
                  onClick={() => navigate('/brand')}
                  className="create-brand-btn"
                >
                  Create Your Brand
                </button>
              </div>
            </div>
          ) : (
            <div className="form-group">
              <label htmlFor="brand">Brand *</label>
              <select
                id="brand"
                name="brand"
                value={formData.brand}
                onChange={handleChange}
                required
              >
                <option value="">Select a brand</option>
                {brands.map(brand => (
                  <option key={brand._id} value={brand._id}>{brand.name}</option>
                ))}
              </select>
              <small>
                <button
                  type="button"
                  onClick={() => navigate('/brand')}
                  className="link-btn"
                >
                  {brands.length > 0 ? 'Edit your brand' : 'Create your brand'}
                </button>
              </small>
            </div>
          )}

          <div className="form-group">
            <label htmlFor="category">Category *</label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
            >
              <option value="">Select a category</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="description">Description *</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe your craft in detail..."
              required
              rows={6}
              minLength={10}
            />
          </div>

          <div className="form-group">
            <label htmlFor="price">Price (₹) *</label>
            <input
              type="number"
              id="price"
              name="price"
              value={formData.price}
              onChange={handleChange}
              placeholder="0.00"
              required
              min="0"
              step="0.01"
            />
          </div>

          <div className="form-group">
            <label htmlFor="tags">Tags (comma separated)</label>
            <input
              type="text"
              id="tags"
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              placeholder="e.g., handmade, unique, gift"
            />
            <small>Separate tags with commas</small>
          </div>

          <div className="form-group">
            <label htmlFor="quantity">Available Quantity *</label>
            <input
              type="number"
              id="quantity"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              min="1"
              placeholder="How many items are available?"
              required
            />
            <small>Number of items available for this craft</small>
          </div>

          <div className="form-group">
            <label htmlFor="location">Your Location *</label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="e.g., Mumbai, Maharashtra"
              maxLength={200}
              required
            />
            <small>Buyers will contact you at this location to arrange courier</small>
          </div>

          <div className="form-group">
            <label htmlFor="images">Images * (Max 5 images, 5MB each)</label>
            <div className="image-upload-area">
              <input
                type="file"
                id="images"
                name="images"
                accept="image/*"
                multiple
                onChange={handleImageChange}
                className="image-input"
              />
              <label htmlFor="images" className="image-upload-label">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                  <polyline points="17 8 12 3 7 8"/>
                  <line x1="12" y1="3" x2="12" y2="15"/>
                </svg>
                <span>Click to upload images</span>
              </label>
            </div>

            {imagePreviews.length > 0 && (
              <div className="image-previews">
                {imagePreviews.map((preview, index) => (
                  <div key={index} className="image-preview-item">
                    <img src={preview} alt={`Preview ${index + 1}`} />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="remove-image-btn"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="form-actions">
            <button
              type="button"
              onClick={() => navigate('/profile')}
              className="cancel-btn"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="submit-btn"
              disabled={loading}
            >
              {loading ? 'Posting...' : 'Post Craft'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Post;

