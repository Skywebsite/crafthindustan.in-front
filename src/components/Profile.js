import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-19-helmet-async';
import { useWishlist } from '../context/WishlistContext';
import { userAPI } from '../services/api';
import './Profile.css';

const Profile = () => {
  const { user, logout, isLoggedIn, login } = useWishlist();
  const navigate = useNavigate();
  const [showEditName, setShowEditName] = useState(false);
  const [editedName, setEditedName] = useState(user?.name || '');
  const [showEditPhoto, setShowEditPhoto] = useState(false);
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  useEffect(() => {
    if (user?.name) {
      setEditedName(user.name);
    }
  }, [user]);

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

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const handleEditName = () => {
    setShowEditName(true);
    setEditedName(user?.name || '');
  };

  const handleSaveName = async () => {
    if (!editedName.trim()) {
      alert('Please enter a valid name');
      return;
    }

    try {
      const result = await userAPI.updateProfile({ name: editedName.trim() });
      if (result.success && result.user) {
        // Update the user in context
        login(result.user);
        setShowEditName(false);
      } else {
        alert(result.error || 'Failed to update name');
      }
    } catch (error) {
      console.error('Error updating name:', error);
      alert('Failed to update name. Please try again.');
    }
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size must be less than 5MB');
        return;
      }
      setPhotoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSavePhoto = async () => {
    if (!photoFile) {
      alert('Please select an image');
      return;
    }

    try {
      setUploadingPhoto(true);
      const result = await userAPI.updateProfile({}, photoFile);
      if (result.success && result.user) {
        // Update the user in context
        login(result.user);
        setShowEditPhoto(false);
        setPhotoFile(null);
        setPhotoPreview(null);
        alert('Profile picture updated successfully!');
      } else {
        alert(result.error || 'Failed to update profile picture');
      }
    } catch (error) {
      console.error('Error updating profile picture:', error);
      alert('Failed to update profile picture. Please try again.');
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleCancelPhoto = () => {
    setShowEditPhoto(false);
    setPhotoFile(null);
    setPhotoPreview(null);
  };

  if (!isLoggedIn) {
    return (
      <>
        <Helmet>
          <title>Profile - Craft Hindustan | Handmade Crafts Platform</title>
          <meta name="description" content="Login to view and manage your profile on Craft Hindustan. Access your account, manage your handmade products, and connect with artisans." />
          <meta name="robots" content="noindex, nofollow" />
        </Helmet>
        <div className="profile-container">
        <div className="profile-not-logged-in">
          <h2>Please log in to view your profile</h2>
          <Link to="/" className="login-link-btn">Go to Login</Link>
      </div>
    </div>
    </>
    );
  }

  const userName = user?.name || user?.displayName || 'User';

  return (
    <>
      <Helmet>
        <title>{userName}'s Profile - Craft Hindustan | Handmade Crafts Platform</title>
        <meta name="description" content={`View and manage ${userName}'s profile on Craft Hindustan. Manage your handmade products, connect with artisans, and grow your craft business.`} />
        <meta name="robots" content="noindex, nofollow" />
        <link rel="canonical" href="https://crafthindustan.com/profile" />
      </Helmet>
      
      <div className="profile-container">
      <div className="profile-content">
        {/* Profile Header */}
        <div className="profile-header">
          <div className="profile-avatar-container">
            <div className="profile-avatar-large">
              {getProfileImage() ? (
                <img 
                  src={getProfileImage()} 
                  alt="Profile" 
                  className="profile-image-large"
                />
              ) : (
                <span className="profile-initials-large">
                  {getInitials(user?.name || user?.displayName || 'User')}
                </span>
              )}
            </div>
            {!showEditPhoto ? (
              <button 
                onClick={() => setShowEditPhoto(true)}
                className="edit-photo-btn"
                title="Edit profile picture"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                </svg>
              </button>
            ) : (
              <div className="edit-photo-form">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  id="photo-input"
                  style={{ display: 'none' }}
                />
                <label htmlFor="photo-input" className="photo-input-label">
                  {photoPreview ? 'Change Image' : 'Choose Image'}
                </label>
                {photoPreview && (
                  <div className="photo-preview-container">
                    <img src={photoPreview} alt="Preview" className="photo-preview" />
                  </div>
                )}
                <div className="photo-actions">
                  <button 
                    onClick={handleSavePhoto}
                    className="save-photo-btn"
                    disabled={!photoFile || uploadingPhoto}
                  >
                    {uploadingPhoto ? 'Uploading...' : 'Save'}
                  </button>
                  <button 
                    onClick={handleCancelPhoto}
                    className="cancel-photo-btn"
                    disabled={uploadingPhoto}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
          <div className="profile-header-info">
            <div className="profile-name-section">
              {showEditName ? (
                <div className="edit-name-form">
                  <input
                    type="text"
                    value={editedName}
                    onChange={(e) => setEditedName(e.target.value)}
                    className="edit-name-input"
                    placeholder="Enter your name"
                  />
                  <div className="edit-name-actions">
                    <button 
                      onClick={handleSaveName}
                      className="save-name-btn"
                    >
                      Save
                    </button>
                    <button 
                      onClick={() => setShowEditName(false)}
                      className="cancel-name-btn"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <h1 className="profile-name-large">
                    {user?.name || user?.displayName || 'User'}
                  </h1>
                  <button 
                    onClick={handleEditName}
                    className="edit-name-btn"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                    </svg>
                    Edit Name
                  </button>
                </>
              )}
            </div>
            <p className="profile-email-large">{user?.email || ''}</p>
          </div>
        </div>

        {/* Profile Menu Cards */}
        <div className="profile-menu-grid">
          <Link to="/post" className="profile-menu-card">
            <div className="profile-menu-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
                <line x1="12" y1="18" x2="12" y2="12"/>
                <line x1="9" y1="15" x2="15" y2="15"/>
              </svg>
            </div>
            <h3>Post Craft</h3>
            <p>Share your craft with the community</p>
          </Link>

          <Link to="/brand" className="profile-menu-card">
            <div className="profile-menu-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 7h-4V4c0-1.1-.9-2-2-2h-4c-1.1 0-2 .9-2 2v3H4c-1.1 0-2 .9-2 2v11c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V9c0-1.1-.9-2-2-2z"/>
              </svg>
            </div>
            <h3>My Brand</h3>
            <p>Create or manage your brand</p>
          </Link>

          <Link to="/profile/all" className="profile-menu-card">
            <div className="profile-menu-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
            </div>
            <h3>My Craft</h3>
            <p>View all your account details</p>
          </Link>

          <Link to="/wishlist" className="profile-menu-card">
            <div className="profile-menu-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
              </svg>
            </div>
            <h3>Wishlist</h3>
            <p>View your saved items</p>
          </Link>
        </div>

        {/* Logout Button */}
        <div className="profile-actions">
          <button 
            onClick={handleLogout}
            className="logout-btn-large"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
              <polyline points="16 17 21 12 16 7"/>
              <line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
            Logout
          </button>
        </div>
      </div>
    </div>
    </>
  );
};

export default Profile;

