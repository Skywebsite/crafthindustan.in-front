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
  const [imageSlots, setImageSlots] = useState([
    { file: null, preview: null },
    { file: null, preview: null },
    { file: null, preview: null },
    { file: null, preview: null },
    { file: null, preview: null }
  ]);
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
          // Auto-select if only one brand
          if (brandsList.length === 1) {
            setFormData(prev => ({ ...prev, brand: brandsList[0]._id }));
          } else if (brandsList.length > 1) {
            // If multiple brands, don't auto-select, let user choose
            setFormData(prev => ({ ...prev, brand: '' }));
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

  // Compress image function - aggressive compression to stay under Vercel's 4.5MB limit
  const compressImage = (file, maxWidth = 1000, maxHeight = 1000, quality = 0.65) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (e) => {
        const img = new Image();
        img.src = e.target.result;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;

          // Calculate new dimensions
          if (width > height) {
            if (width > maxWidth) {
              height = (height * maxWidth) / width;
              width = maxWidth;
            }
          } else {
            if (height > maxHeight) {
              width = (width * maxHeight) / height;
              height = maxHeight;
            }
          }

          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);

          // Try to compress to under 600KB per image (5 images = ~3MB total, leaving room for form data)
          const targetSize = 600 * 1024; // 600KB per image
          let currentQuality = quality;

          const compress = (q) => {
            canvas.toBlob(
              (blob) => {
                if (blob && blob.size > targetSize && q > 0.2) {
                  // If still too large and quality can be reduced, compress more
                  compress(Math.max(0.2, q - 0.1));
                } else {
                  console.log(`Image compressed: ${(blob?.size || 0) / 1024}KB (quality: ${q.toFixed(2)})`);
                  resolve(blob || file);
                }
              },
              'image/jpeg',
              q
            );
          };

          compress(currentQuality);
        };
        img.onerror = () => {
          resolve(file); // Fallback to original if image load fails
        };
      };
      reader.onerror = () => {
        resolve(file); // Fallback to original if read fails
      };
    });
  };

  const handleImageChange = async (index, e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      e.target.value = ''; // Reset input
      return;
    }

    // Validate file size (original)
    if (file.size > 20 * 1024 * 1024) { // 20MB limit for original (will be compressed)
      setError('Image size should be less than 20MB. Large images will be automatically compressed.');
      e.target.value = ''; // Reset input
      return;
    }

    setError('');
    setLoading(true);

    try {
      // Compress image
      const compressedBlob = await compressImage(file);

      // Convert blob to File with proper name
      const compressedFile = new File([compressedBlob], file.name, {
        type: 'image/jpeg',
        lastModified: Date.now()
      });

      console.log(`Image ${index + 1} compressed: ${file.name} - ${(file.size / 1024 / 1024).toFixed(2)}MB → ${(compressedFile.size / 1024 / 1024).toFixed(2)}MB`);

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageSlots(prev => {
          const newSlots = [...prev];
          newSlots[index] = {
            file: compressedFile,
            preview: reader.result
          };
          return newSlots;
        });
        setLoading(false);
      };
      reader.readAsDataURL(compressedFile);
    } catch (err) {
      console.error('Image compression error:', err);
      setError('Failed to process image. Please try again.');
      setLoading(false);
      e.target.value = ''; // Reset input
    }
  };

  const removeImage = (index) => {
    setImageSlots(prev => {
      const newSlots = [...prev];
      newSlots[index] = { file: null, preview: null };
      return newSlots;
    });
    // Reset the file input
    const input = document.getElementById(`image-input-${index}`);
    if (input) {
      input.value = '';
    }
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

      // Get all uploaded image files
      const uploadedImages = imageSlots.filter(slot => slot.file !== null);
      if (uploadedImages.length === 0) {
        setError('Please upload at least one image');
        setLoading(false);
        return;
      }

      const imageFiles = uploadedImages.map(slot => slot.file);

      // Log file sizes for debugging
      const totalSize = imageFiles.reduce((sum, file) => sum + (file?.size || 0), 0);
      console.log('Image files to upload:', {
        count: imageFiles.length,
        totalSize: `${(totalSize / 1024 / 1024).toFixed(2)}MB`,
        sizes: imageFiles.map((f, i) => `Image ${i + 1}: ${((f?.size || 0) / 1024).toFixed(2)}KB`)
      });

      // Warn if total size is too large
      if (totalSize > 4 * 1024 * 1024) { // 4MB
        setError(`Total image size (${(totalSize / 1024 / 1024).toFixed(2)}MB) is too large. Please reduce the number of images or use smaller files.`);
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
        imageCount: imageFiles.length,
        totalImageSize: `${(totalSize / 1024 / 1024).toFixed(2)}MB`
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
        setImageSlots([
          { file: null, preview: null },
          { file: null, preview: null },
          { file: null, preview: null },
          { file: null, preview: null },
          { file: null, preview: null }
        ]);
        // Navigate to dashboard
        navigate('/dashboard');
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
              {brands.length === 1 ? (
                <>
                  <input
                    type="text"
                    value={brands[0].name}
                    readOnly
                    className="readonly-input"
                  />
                  <input
                    type="hidden"
                    name="brand"
                    value={brands[0]._id}
                  />
                  <small>
                    <button
                      type="button"
                      onClick={() => navigate('/brand')}
                      className="link-btn"
                    >
                      Edit your brand
                    </button>
                  </small>
                </>
              ) : (
                <>
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
                </>
              )}
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
            <label>Images * (Max 5 images, images will be automatically compressed)</label>
            <div className="image-upload-boxes">
              {imageSlots.map((slot, index) => (
                <div key={index} className="image-upload-box">
                  {slot.preview ? (
                    <div className="image-box-preview">
                      <img src={slot.preview} alt={`Preview ${index + 1}`} />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="remove-image-btn"
                        aria-label="Remove image"
                      >
                        ×
                      </button>
                    </div>
                  ) : (
                    <div className="image-box-upload">
                      <input
                        type="file"
                        id={`image-input-${index}`}
                        accept="image/*"
                        onChange={(e) => handleImageChange(index, e)}
                        className="image-input"
                      />
                      <label htmlFor={`image-input-${index}`} className="image-box-label">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                          <polyline points="17 8 12 3 7 8" />
                          <line x1="12" y1="3" x2="12" y2="15" />
                        </svg>
                        <span>Image {index + 1}</span>
                      </label>
                    </div>
                  )}
                </div>
              ))}
            </div>
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

