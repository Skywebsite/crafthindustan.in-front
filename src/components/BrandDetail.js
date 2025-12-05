import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { brandAPI, postAPI } from '../services/api';
import { useWishlist } from '../context/WishlistContext';
import HeartIcon from './HeartIcon';
import ShareButton from './ShareButton';
import './BrandDetail.css';

const BrandDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toggleWishlist, isInWishlist } = useWishlist();
  
  const [brand, setBrand] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [postImageIndices, setPostImageIndices] = useState({});

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

  const brandName = brand.name || 'Artisan Brand';
  const brandBio = brand.bio || 'Handmade craft brand';
  const ownerName = brand.owner?.name || brand.ownerName || 'Artisan';
  const productCount = brand.postCount || posts.length || 0;
  const establishedYear = brand.establishedYear || '';

  return (
    <>
      <Helmet>
        <title>{brandName} - Handmade Craft Brand in Telangana | {productCount} Products | Craft Hindustan</title>
        <meta 
          name="description" 
          content={`${brandBio.substring(0, 155)}... Explore ${productCount} handmade products by ${brandName} in Telangana. ${establishedYear ? `Established ${establishedYear}.` : ''} Authentic traditional crafts.`} 
        />
        <meta 
          name="keywords" 
          content={`${brandName}, handmade brand Telangana, artisan brand Hyderabad, ${ownerName} crafts, craft brand, handmade products ${brandName}, traditional brand, artisan collection, craft hindustan brand, ${brandName.toLowerCase()}`} 
        />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href={`https://crafthindustan.com/brand/${id}`} />
        <meta property="og:title" content={`${brandName} - Handmade Craft Brand | Craft Hindustan`} />
        <meta property="og:description" content={brandBio.substring(0, 200)} />
        <meta property="og:url" content={`https://crafthindustan.com/brand/${id}`} />
        <meta property="og:type" content="website" />
        {brand.picture && <meta property="og:image" content={brand.picture} />}
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={`${brandName} - Handmade Craft Brand`} />
        <meta name="twitter:description" content={brandBio.substring(0, 200)} />
        {brand.picture && <meta name="twitter:image" content={brand.picture} />}
        <script type="application/ld+json" dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Brand",
            "name": brandName,
            "description": brandBio,
            "logo": brand.picture || "",
            "founder": {
              "@type": "Person",
              "name": ownerName
            },
            "foundingDate": establishedYear || undefined,
            "numberOfEmployees": {
              "@type": "QuantitativeValue",
              "value": productCount
            }
          })
        }} />
      </Helmet>
      
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
            <div className="brand-detail-header-row">
              <h1 className="brand-detail-name">{brand.name}</h1>
              <ShareButton
                url={window.location.href}
                title={`${brand.name} - Handmade Craft Brand`}
                description={brand.bio}
                image={brand.picture}
                className="brand-share-btn"
              />
            </div>
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
                <div 
                  key={post._id} 
                  className="brand-post-card"
                  onClick={() => navigate(`/post/${post._id}`)}
                >
                  <div className="brand-post-image">
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
                    <div className="brand-post-overlay"></div>
                    <div className="brand-post-actions">
                      <ShareButton
                        url={`${window.location.origin}/post/${post._id}`}
                        title={post.title}
                        description={post.description}
                        image={post.images?.[0]}
                        className="brand-post-share-btn"
                      />
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
              );
            })}
          </div>
        )}
      </div>
    </div>
    </>
  );
};

export default BrandDetail;

