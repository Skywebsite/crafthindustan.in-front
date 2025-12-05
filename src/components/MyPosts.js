import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWishlist } from '../context/WishlistContext';
import { postAPI } from '../services/api';
import './MyPosts.css';

const MyPosts = () => {
  const { user, isLoggedIn } = useWishlist();
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [postImageIndices, setPostImageIndices] = useState({});

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/');
      return;
    }

    const fetchMyPosts = async () => {
      try {
        setLoading(true);
        const result = await postAPI.getMyPosts();
        if (result.success && result.posts) {
          setPosts(result.posts);
        } else {
          setError('Failed to load your posts');
        }
      } catch (err) {
        console.error('Error fetching posts:', err);
        setError('Failed to load your posts. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchMyPosts();
  }, [isLoggedIn, navigate]);

  const handleDeletePost = async (postId) => {
    if (!window.confirm('Are you sure you want to delete this post?')) {
      return;
    }

    try {
      const result = await postAPI.deletePost(postId);
      if (result.success) {
        setPosts(posts.filter(post => post._id !== postId));
        alert('Post deleted successfully');
      } else {
        alert('Failed to delete post');
      }
    } catch (err) {
      console.error('Error deleting post:', err);
      alert('Failed to delete post. Please try again.');
    }
  };

  if (!isLoggedIn) {
    return null;
  }

  return (
    <div className="my-posts-container">
      <div className="my-posts-header">
        <h1>My Posts</h1>
        <button 
          className="create-post-btn"
          onClick={() => navigate('/post')}
        >
          + Create New Post
        </button>
      </div>

      {loading ? (
        <div className="loading-message">
          <p>Loading your posts...</p>
        </div>
      ) : error ? (
        <div className="error-message">
          <p>{error}</p>
        </div>
      ) : posts.length === 0 ? (
        <div className="no-posts-message">
          <p>You haven't posted any crafts yet.</p>
          <button 
            className="create-post-btn"
            onClick={() => navigate('/post')}
          >
            Create Your First Post
          </button>
        </div>
      ) : (
        <div className="my-posts-grid">
          {posts.map((post) => {
            const currentIndex = postImageIndices[post._id] || 0;
            const images = post.images || [];
            const hasMultipleImages = images.length > 1;
            
            const nextImage = (e) => {
              e.stopPropagation();
              setPostImageIndices(prev => ({
                ...prev,
                [post._id]: (currentIndex + 1) % images.length
              }));
            };
            
            const prevImage = (e) => {
              e.stopPropagation();
              setPostImageIndices(prev => ({
                ...prev,
                [post._id]: (currentIndex - 1 + images.length) % images.length
              }));
            };
            
            const goToImage = (e, idx) => {
              e.stopPropagation();
              setPostImageIndices(prev => ({
                ...prev,
                [post._id]: idx
              }));
            };
            
            return (
              <div key={post._id} className="my-post-card">
                <div className="my-post-image">
                  <img 
                    src={images.length > 0 ? images[currentIndex] : 'https://via.placeholder.com/300'} 
                    alt={post.title} 
                  />
                  {hasMultipleImages && (
                    <>
                      <button 
                        className="image-carousel-btn image-carousel-prev"
                        onClick={prevImage}
                        aria-label="Previous image"
                      >
                        ‹
                      </button>
                      <button 
                        className="image-carousel-btn image-carousel-next"
                        onClick={nextImage}
                        aria-label="Next image"
                      >
                        ›
                      </button>
                      <div className="image-carousel-dots">
                        {images.map((_, idx) => (
                          <span
                            key={idx}
                            className={`carousel-dot ${currentIndex === idx ? 'active' : ''}`}
                            onClick={(e) => goToImage(e, idx)}
                          />
                        ))}
                      </div>
                    </>
                  )}
                  <div className="my-post-overlay">
                    <button
                      className="view-post-btn"
                      onClick={() => navigate(`/post/${post._id}`)}
                    >
                      View
                    </button>
                    <button
                      className="delete-post-btn"
                      onClick={() => handleDeletePost(post._id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              <div className="my-post-content">
                <span className="my-post-category">{post.category}</span>
                <h3 className="my-post-title">{post.title}</h3>
                <p className="my-post-description">
                  {post.description.length > 100 
                    ? post.description.substring(0, 100) + '...' 
                    : post.description}
                </p>
                <div className="my-post-footer">
                  <span className="my-post-price">₹{post.price}</span>
                  <span className="my-post-status">{post.status}</span>
                </div>
                <div className="my-post-meta">
                  <span>Views: {post.views || 0}</span>
                  <span>Created: {new Date(post.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyPosts;

