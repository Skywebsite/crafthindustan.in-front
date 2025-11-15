import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { useWishlist } from '../context/WishlistContext';
import { postAPI, brandAPI } from '../services/api';
import HeartIcon from './HeartIcon';
import './Home.css';

const Home = () => {
  const { toggleWishlist, isInWishlist } = useWishlist();
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingBrands, setLoadingBrands] = useState(true);
  const [error, setError] = useState('');

  // Helper function to safely get price as string
  const getPriceString = (price) => {
    if (typeof price === 'string') {
      return price;
    }
    if (typeof price === 'object' && price !== null) {
      return price.formatted || price.original || price.amount || '₹0';
    }
    return String(price || '₹0');
  };

  const featuredProducts = [
    {
      id: 1,
      name: 'Handmade Terracotta Pot',
      price: '₹899',
      category: 'Pottery & Ceramics',
      image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=300&fit=crop&q=80&auto=format&fit=crop&ixlib=rb-4.0.3&fm=webp',
      rating: 4.5
    },
    {
      id: 2,
      name: 'Traditional Silk Scarf',
      price: '₹1,299',
      category: 'Textiles & Fabrics',
      image: 'https://images.unsplash.com/photo-1586105251261-72a756497a11?w=300&h=300&fit=crop&q=80&auto=format&fit=crop&ixlib=rb-4.0.3&fm=webp',
      rating: 4.8
    },
    {
      id: 3,
      name: 'Silver Filigree Earrings',
      price: '₹2,499',
      category: 'Jewelry & Accessories',
      image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=300&h=300&fit=crop&q=80&auto=format&fit=crop&ixlib=rb-4.0.3&fm=webp',
      rating: 4.7
    },
    {
      id: 4,
      name: 'Macrame Wall Hanging',
      price: '₹1,599',
      category: 'Home Decor',
      image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=300&h=300&fit=crop&q=80&auto=format&fit=crop&ixlib=rb-4.0.3&fm=webp',
      rating: 4.6
    }
  ];

  const translations = [
    { lang: 'English', text: 'Why you choose' },
    { lang: 'Hindi', text: 'क्यों चुनें' },
    { lang: 'Bengali', text: 'কেন বেছে নিন' },
    { lang: 'Telugu', text: 'ఎందుకు ఎంచుకోవాలి' },
    { lang: 'Tamil', text: 'ஏன் தேர்வு' },
    { lang: 'Marathi', text: 'का निवडा' },
    { lang: 'Gujarati', text: 'શા માટે પસંદ કરો' },
    { lang: 'Kannada', text: 'ಏಕೆ ಆಯ್ಕೆ' },
    { lang: 'Malayalam', text: 'എന്തിനാണ്' },
    { lang: 'Punjabi', text: 'ਕਿਉਂ ਚੁਣੋ' }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  // Fetch posts from API
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        setError('');
        console.log('Fetching posts from API...');
        const result = await postAPI.getPosts({ limit: 8 });
        console.log('Posts API result:', result);
        if (result && result.success && result.posts) {
          console.log('Posts received:', result.posts.length);
          setPosts(result.posts);
        } else {
          console.error('Invalid response format:', result);
          setError('Failed to load posts');
        }
      } catch (err) {
        console.error('Error fetching posts:', err);
        setError('Failed to load posts. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  // Fetch brands from API
  useEffect(() => {
    const fetchBrands = async () => {
      try {
        setLoadingBrands(true);
        console.log('Fetching brands from API...');
        const result = await brandAPI.getAllBrands({ limit: 4 });
        console.log('Brands API result:', result);
        if (result && result.success && result.brands) {
          console.log('Brands received:', result.brands.length);
          setBrands(result.brands);
        } else {
          console.error('Invalid brands response format:', result);
        }
      } catch (err) {
        console.error('Error fetching brands:', err);
      } finally {
        setLoadingBrands(false);
      }
    };

    fetchBrands();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % translations.length);
    }, 3000); // Delay - 3 seconds

    return () => clearInterval(interval);
  }, [translations.length]);

  return (
    <div className="home-container">
      <div className="home-content">
        <div className="home-left">
          <div className="home-text-content">
            <h1 className="home-title">
              <span className="rotating-text-wrapper">
                <span className="rotating-text">{translations[currentIndex].text}</span>
              </span>
              <span className="static-text"> craft hindustan</span>
            </h1>
            <p className="home-description">
              We are a lovingly crafted platform built to celebrate the true art of handmade creations. Every product you find here is shaped with care, patience, and soul by talented artisans who believe in the magic of human touch. These are not just items they are stories, emotions, and traditions passed down through hands that create with love.
            </p>
            <p className="home-description">
              Our mission is to uplift creators from every corner, giving them a space where their creativity can shine and reach people who truly appreciate authenticity. We aim to connect hearts  the heart of the maker and the heart of the buyer  through unique, meaningful pieces that bring joy, warmth, and inspiration into everyday life.
            </p>
          </div>
        </div>
        <div className="home-right">
          <DotLottieReact
            src="https://lottie.host/e1fd2431-e92c-4244-8763-edaa30b4fb4a/b8RrjTnuWp.lottie"
            loop
            autoplay
            className="lottie-animation"
          />
        </div>
      </div>

      {/* Featured Products Section */}
      <div className="featured-products-section">
        <div className="featured-products-container">
          <h2 className="featured-products-title">Top Crafts</h2>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px' }}>
              <p>Loading crafts...</p>
            </div>
          ) : error ? (
            <div style={{ textAlign: 'center', padding: '40px', color: 'red' }}>
              <p>{error}</p>
            </div>
          ) : posts.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px' }}>
              <p>No crafts available yet. Be the first to post one!</p>
            </div>
          ) : (
            <div className="featured-products-grid">
              {posts.map((post) => (
                <div key={post._id} className="featured-product-card" onClick={() => navigate(`/post/${post._id}`)}>
                  <div className="featured-product-image">
                    <img 
                      src={post.images && post.images.length > 0 ? post.images[0] : 'https://via.placeholder.com/300'} 
                      alt={post.title} 
                    />
                    <div className="featured-product-overlay"></div>
                    <button
                      className={`featured-wishlist-icon-btn ${isInWishlist(post._id) ? 'wishlist-icon-btn-active' : ''}`}
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
                  <div className="featured-product-content">
                    <span className="featured-product-category">{post.category}</span>
                    <h3 className="featured-product-name">{post.title}</h3>
                    <div className="featured-product-footer">
                      <span className="featured-product-price">₹{post.price}</span>
                      {post.author && (
                        <span className="featured-product-rating">by {post.author.name || post.authorName}</span>
                      )}
                    </div>
                    <button 
                      className="featured-product-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/post/${post._id}`);
                      }}
                    >
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Artists Brands Section */}
      <div className="artists-brands-section">
        <div className="artists-brands-container">
          <h2 className="artists-brands-title">Artists Brands</h2>
          {loadingBrands ? (
            <div style={{ textAlign: 'center', padding: '40px' }}>
              <p>Loading brands...</p>
            </div>
          ) : brands.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px' }}>
              <p>No brands available yet.</p>
            </div>
          ) : (
            <div className="artists-brands-grid">
              {brands.map((brand) => (
                <div 
                  key={brand._id} 
                  className="artist-brand-card"
                  onClick={() => navigate(`/brand/${brand._id}`)}
                >
                  <div className="artist-brand-image">
                    {brand.picture ? (
                      <img src={brand.picture} alt={brand.name} />
                    ) : (
                      <div style={{
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: '#f5f5f5'
                      }}>
                        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M20 7h-4V4c0-1.1-.9-2-2-2h-4c-1.1 0-2 .9-2 2v3H4c-1.1 0-2 .9-2 2v11c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V9c0-1.1-.9-2-2-2z"/>
                        </svg>
                      </div>
                    )}
                    <div className="artist-brand-overlay"></div>
                  </div>
                  <div className="artist-brand-content">
                    <h3 className="artist-brand-name">{brand.name}</h3>
                    <p className="artist-brand-description">
                      {brand.bio && brand.bio.length > 120 
                        ? brand.bio.substring(0, 120) + '...' 
                        : brand.bio || 'No description available'}
                    </p>
                    <div className="artist-brand-footer">
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        {brand.establishedYear && (
                          <span className="artist-brand-products">
                            Est. {brand.establishedYear}
                          </span>
                        )}
                        <span style={{ fontSize: '0.85rem', color: '#999' }}>
                          {brand.postCount || 0} {brand.postCount === 1 ? 'product' : 'products'}
                        </span>
                      </div>
                      <button 
                        className="artist-brand-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/brand/${brand._id}`);
                        }}
                      >
                        View Brand
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;

