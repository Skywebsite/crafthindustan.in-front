import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useWishlist } from '../context/WishlistContext';
import { chatAPI, postAPI } from '../services/api';
import HeartIcon from './HeartIcon';
import './ProductPreview.css';

const ProductPreview = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toggleWishlist, isInWishlist, isLoggedIn, user } = useWishlist();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const currentUserId = (user?._id || user?.id || '').toString();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError('');
        const result = await postAPI.getPost(id);
        if (result.success && result.post) {
          setProduct(result.post);
        } else {
          setError(result.error || 'Product not found');
        }
      } catch (err) {
        console.error('Error fetching product:', err);
        setError('Failed to load product. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="product-preview-container">
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <p>Loading product...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="product-preview-container">
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <p>{error || 'Product not found'}</p>
          <button onClick={() => navigate(-1)} className="back-button">
            ← Back
          </button>
        </div>
      </div>
    );
  }


  const getPriceString = (price) => {
    if (typeof price === 'string') {
      return price;
    }
    if (typeof price === 'object' && price !== null) {
      return price.formatted || price.original || price.amount || '₹0';
    }
    if (typeof price === 'number') {
      return `₹${price.toLocaleString('en-IN')}`;
    }
    return String(price || '₹0');
  };

  const handleContactArtist = async () => {
    if (!isLoggedIn) {
      alert('Please login to chat with the artist.');
      return;
    }

    const artistId = (product.author?._id || product.author?.id || product.author || '').toString();
    if (!artistId) {
      alert('Artist information is missing for this craft.');
      return;
    }

    if (artistId === currentUserId) {
      alert('This craft belongs to you.');
      return;
    }

    try {
      setChatLoading(true);
      const response = await chatAPI.startConversation({
        participantId: artistId,
        postId: product._id
      });
      if (response.success && response.conversation) {
        navigate(`/chat/${response.conversation._id}`, {
          state: { conversation: response.conversation }
        });
      } else {
        alert(response.error || 'Unable to start the chat. Please try again.');
      }
    } catch (err) {
      console.error('Chat start error:', err);
      alert(err.message || 'Unable to start the chat right now.');
    } finally {
      setChatLoading(false);
    }
  };

  return (
    <div className="product-preview-container">
      <div className="product-preview-content">
        <button className="back-button" onClick={() => navigate(-1)}>
          ← Back
        </button>

        <div className="product-preview-main">
          <div className="product-preview-image-section">
            <div className="product-main-image">
              <img src={product.images && product.images.length > 0 ? product.images[0] : 'https://via.placeholder.com/600'} alt={product.title} />
              <button
                className={`preview-wishlist-btn ${isInWishlist(product._id) ? 'wishlist-active' : ''}`}
                onClick={async (e) => {
                  e.stopPropagation();
                  const result = await toggleWishlist({
                    id: product._id,
                    name: product.title,
                    price: product.price,
                    image: product.images?.[0]
                  });
                  if (!result.success && result.error) {
                    alert(result.error);
                  }
                }}
                title={isInWishlist(product._id) ? 'Remove from wishlist' : 'Add to wishlist'}
              >
                <HeartIcon filled={isInWishlist(product._id)} />
              </button>
            </div>
            {product.images && product.images.length > 1 && (
              <div className="product-thumbnails">
                {product.images.slice(1, 5).map((img, idx) => (
                  <img key={idx} src={img} alt={`${product.title} ${idx + 2}`} />
                ))}
              </div>
            )}
          </div>

          <div className="product-preview-details">
            <div className="product-category-badge">{product.category}</div>
            <h1 className="product-preview-name">{product.title}</h1>

            <div className="product-price-section">
              <span className="product-preview-price">{getPriceString(product.price)}</span>
            </div>

            <div className="product-info-grid">
              <div className="info-item">
                <span className="info-label">📦 Available Quantity</span>
                <span className="info-value">{product.quantity || 1} {product.quantity === 1 ? 'item' : 'items'}</span>
              </div>
              <div className="info-item">
                <span className="info-label">📍 Artist Location</span>
                <span className="info-value">{product.location || product.author?.location || 'Not specified'}</span>
              </div>
            </div>

            {product.tags && product.tags.length > 0 && (
              <div className="materials-section">
                <h3 className="section-title">Tags</h3>
                <div className="materials-list">
                  {product.tags.map((tag, index) => (
                    <span key={index} className="material-tag">{tag}</span>
                  ))}
                </div>
              </div>
            )}

            <div className="description-section">
              <h3 className="section-title">Description</h3>
              <p className="product-description">{product.description}</p>
            </div>

            <div className="artist-section">
              <h3 className="section-title">About the Artist</h3>
              <div className="artist-card">
                <div className="artist-info">
                  <h4 className="artist-name">{product.authorName || product.author?.name || 'Unknown Artist'}</h4>
                  <p className="artist-location">📍 {product.location || product.author?.location || 'Location not specified'}</p>
                  {product.brandName && (
                    <p className="artist-brand">🏪 Brand: {product.brandName}</p>
                  )}
                </div>
                <button
                  className="chat-artist-btn"
                  onClick={handleContactArtist}
                  disabled={chatLoading}
                >
                  {chatLoading ? 'Opening chat...' : 'Contact Artist'}
                </button>
              </div>
            </div>

            <div className="contact-note-section">
              <div className="contact-note-box">
                <h4>📝 Note for Buyers</h4>
                <p>To purchase this craft, please contact the artist directly. The artist will arrange courier delivery from their location ({product.location || 'their location'}).</p>
                <p><strong>Available Quantity:</strong> {product.quantity || 1} {product.quantity === 1 ? 'item' : 'items'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPreview;

