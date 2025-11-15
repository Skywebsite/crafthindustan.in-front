import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWishlist } from '../context/WishlistContext';
import { brandAPI } from '../services/api';
import './Brand.css';

const Brand = () => {
  const { isLoggedIn } = useWishlist();
  const navigate = useNavigate();
  
  const [existingBrand, setExistingBrand] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    bio: '',
    establishedYear: new Date().getFullYear()
  });
  
  const [pictureFile, setPictureFile] = useState(null);
  const [picturePreview, setPicturePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingBrand, setLoadingBrand] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/');
      return;
    }

    // Check if user already has a brand
    const fetchBrand = async () => {
      try {
        setLoadingBrand(true);
        const result = await brandAPI.getMyBrands();
        if (result.success && result.brand) {
          setExistingBrand(result.brand);
          setFormData({
            name: result.brand.name || '',
            bio: result.brand.bio || '',
            establishedYear: result.brand.establishedYear || new Date().getFullYear()
          });
          if (result.brand.picture) {
            setPicturePreview(result.brand.picture);
          }
        }
      } catch (err) {
        console.error('Error fetching brand:', err);
      } finally {
        setLoadingBrand(false);
      }
    };

    fetchBrand();
  }, [isLoggedIn, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePictureChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('Image size must be less than 5MB');
        return;
      }
      setPictureFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPicturePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (!formData.name.trim()) {
        setError('Brand name is required');
        setLoading(false);
        return;
      }

      if (!formData.bio.trim()) {
        setError('Brand bio is required');
        setLoading(false);
        return;
      }

      if (formData.bio.trim().length < 10) {
        setError('Bio must be at least 10 characters long');
        setLoading(false);
        return;
      }

      if (!formData.establishedYear || formData.establishedYear < 1900 || formData.establishedYear > new Date().getFullYear()) {
        setError('Please enter a valid established year');
        setLoading(false);
        return;
      }

      let result;
      if (existingBrand) {
        // Update existing brand
        result = await brandAPI.updateBrand(existingBrand._id, formData, pictureFile);
        if (result.success) {
          alert('Brand updated successfully!');
          navigate('/profile');
        } else {
          setError(result.error || 'Failed to update brand');
        }
      } else {
        // Create new brand
        result = await brandAPI.createBrand(formData, pictureFile);
        if (result.success) {
          alert('Brand created successfully!');
          navigate('/profile');
        } else {
          setError(result.error || 'Failed to create brand');
        }
      }
    } catch (err) {
      console.error('Brand creation error:', err);
      setError(err.message || 'Failed to create brand. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isLoggedIn) {
    return null;
  }

  if (loadingBrand) {
    return (
      <div className="brand-container">
        <div className="brand-form-wrapper">
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="brand-container">
      <div className="brand-form-wrapper">
        <h1>{existingBrand ? 'Edit Your Brand' : 'Create Your Brand'}</h1>
        <p className="brand-subtitle">
          {existingBrand 
            ? 'Update your brand information (You can only have one brand)' 
            : 'Create a brand/store to start posting your crafts (You can only have one brand)'}
        </p>

        {error && <div className="brand-error">{error}</div>}

        <form onSubmit={handleSubmit} className="brand-form">
          <div className="form-group">
            <label htmlFor="name">Brand Name *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Enter your brand name"
              maxLength={100}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="bio">Brand Bio *</label>
            <textarea
              id="bio"
              name="bio"
              value={formData.bio}
              onChange={handleInputChange}
              placeholder="Tell us about your brand (min 10 characters)"
              rows={5}
              maxLength={500}
              required
            />
            <span className="char-count">{formData.bio.length}/500</span>
          </div>

          <div className="form-group">
            <label htmlFor="establishedYear">Established Year *</label>
            <input
              type="number"
              id="establishedYear"
              name="establishedYear"
              value={formData.establishedYear}
              onChange={handleInputChange}
              placeholder="e.g., 2020"
              min="1900"
              max={new Date().getFullYear()}
              required
            />
            <small>Year when your brand was established</small>
          </div>

          <div className="form-group">
            <label htmlFor="picture">Brand Picture (Optional)</label>
            <input
              type="file"
              id="picture"
              accept="image/*"
              onChange={handlePictureChange}
            />
            {picturePreview && (
              <div className="picture-preview">
                <img src={picturePreview} alt="Brand preview" />
                <button
                  type="button"
                  onClick={() => {
                    setPictureFile(null);
                    setPicturePreview(null);
                  }}
                  className="remove-picture-btn"
                >
                  Remove
                </button>
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
              {loading 
                ? (existingBrand ? 'Updating...' : 'Creating...') 
                : (existingBrand ? 'Update Brand' : 'Create Brand')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Brand;

