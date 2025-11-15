import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { brandAPI, postAPI } from '../services/api';
import { useWishlist } from '../context/WishlistContext';
import HeartIcon from './HeartIcon';
import './BrandDetail.css';

const BrandDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toggleWishlist, isInWishlist } = useWishlist();
  
  const [brand, setBrand] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBrandAndPosts = async () => {
      try {
        setLoading(true);
        setError('');

        // Fetch brand details
        const brandResult = await brandAPI.getBrand(id);
        if (brandResult.success && brandResult.brand) {
          setBrand(brandResult.brand);
        } else {
          setError('Brand not found');
          setLoading(false);
          return;
        }

        // Fetch posts for this brand
        const postsResult = await postAPI.getPosts({ brand: id, limit: 50 });
        if (postsResult.success && postsResult.posts) {
          setPosts(postsResult.posts);
        }
      } catch (err) {
        console.error('Error fetching brand details:', err);
        setError('Failed to load brand details. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchBrandAndPosts();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="brand-detail-container">
        <div className="brand-detail-loading">
          <p>Loading brand details...</p>
        </div>
      </div>
    );
  }

  if (error || !brand) {
    return (
      <div className="brand-detail-container">
        <div className="brand-detail-error">
          <p>{error || 'Brand not found'}</p>
          <button onClick={() => navigate('/brands')} className="back-btn">
            Back to Brands
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="brand-detail-container">
      {/* Brand Header */}
      <div className="brand-detail-header">
        <button onClick={() => navigate('/brands')} className="back-btn">
          ← Back to Brands
        </button>
        
        <div className="brand-detail-info">
          <div className="brand-detail-image">
            {brand.picture ? (
              <img src={brand.picture} alt={brand.name} />
            ) : (
              <div className="brand-detail-placeholder">
                <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 7h-4V4c0-1.1-.9-2-2-2h-4c-1.1 0-2 .9-2 2v3H4c-1.1 0-2 .9-2 2v11c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V9c0-1.1-.9-2-2-2z"/>
                </svg>
              </div>
            )}
          </div>
          
          <div className="brand-detail-content">
            <h1 className="brand-detail-name">{brand.name}</h1>
            <p className="brand-detail-owner">
              by {brand.owner?.name || brand.ownerName || 'Unknown'}
            </p>
            <p className="brand-detail-bio">{brand.bio}</p>
            <div className="brand-detail-stats">
              <span>Est. {brand.establishedYear || 'N/A'}</span>
              <span>{brand.postCount || posts.length || 0} {(brand.postCount || posts.length || 0) === 1 ? 'Product' : 'Products'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Brand Posts */}
      <div className="brand-detail-posts">
        <h2 className="brand-posts-title">Products by {brand.name}</h2>
        
        {posts.length === 0 ? (
          <div className="no-posts-message">
            <p>No products posted yet by this brand.</p>
          </div>
        ) : (
          <div className="brand-posts-grid">
            {posts.map((post) => (
              <div 
                key={post._id} 
                className="brand-post-card"
                onClick={() => navigate(`/post/${post._id}`)}
              >
                <div className="brand-post-image">
                  <img 
                    src={post.images && post.images.length > 0 ? post.images[0] : 'https://via.placeholder.com/300'} 
                    alt={post.title} 
                  />
                  <div className="brand-post-overlay"></div>
                  <button
                    className={`brand-post-wishlist-btn ${isInWishlist(post._id) ? 'active' : ''}`}
                    onClick={async (e) => {
                      e.stopPropagation();
                      const result = await toggleWishlist({
                        id: post._id,
                        name: post.title,
                        price: post.price,
                        image: post.images?.[0]
                      });
                      if (!result.success && result.error) {
                        alert(result.error);
                      }
                    }}
                    title={isInWishlist(post._id) ? 'Remove from wishlist' : 'Add to wishlist'}
                  >
                    <HeartIcon filled={isInWishlist(post._id)} />
                  </button>
                </div>
                <div className="brand-post-content">
                  <span className="brand-post-category">{post.category}</span>
                  <h3 className="brand-post-title">{post.title}</h3>
                  <p className="brand-post-description">
                    {post.description.length > 80 
                      ? post.description.substring(0, 80) + '...' 
                      : post.description}
                  </p>
                  <div className="brand-post-footer">
                    <span className="brand-post-price">₹{post.price}</span>
                    <button 
                      className="brand-post-view-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/post/${post._id}`);
                      }}
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BrandDetail;

