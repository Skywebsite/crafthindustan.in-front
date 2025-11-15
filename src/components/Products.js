import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWishlist } from '../context/WishlistContext';
import HeartIcon from './HeartIcon';
import SearchIcon from './SearchIcon';
import { chatAPI, postAPI } from '../services/api';
import potteryImage from '../images/1 copy.png';
import textilesImage from '../images/2 copy.png';
import jewelryImage from '../images/3 copy.png';
import homeDecorImage from '../images/4 copy.png';
import woodenCraftsImage from '../images/5 copy.png';
import './Page.css';

const Products = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('best');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [chatLoadingId, setChatLoadingId] = useState(null);
  const { toggleWishlist, isInWishlist, isLoggedIn, user } = useWishlist();
  const navigate = useNavigate();
  const currentUserId = (user?._id || user?.id || '').toString();

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

  // Helper function to get price number for sorting
  const getPriceNumber = (price) => {
    const priceStr = getPriceString(price);
    return parseInt(priceStr.replace(/[₹,]/g, '')) || 0;
  };

  const getRatingValue = (product) => product.rating || product.averageRating || 0;

  const categories = [
    {
      id: 1,
      title: 'Pottery & Ceramics',
      description: 'Handcrafted clay pots, vases, and ceramic items made with traditional techniques.',
      image: potteryImage
    },
    {
      id: 2,
      title: 'Textiles & Fabrics',
      description: 'Beautiful handwoven fabrics, embroidered textiles, and traditional clothing.',
      image: textilesImage
    },
    {
      id: 3,
      title: 'Jewelry & Accessories',
      description: 'Unique handmade jewelry pieces crafted with traditional Indian designs.',
      image: jewelryImage
    },
    {
      id: 4,
      title: 'Home Decor',
      description: 'Decorative items, wall hangings, and home accessories made by skilled artisans.',
      image: homeDecorImage
    },
    {
      id: 5,
      title: 'Wooden Crafts',
      description: 'Hand-carved wooden items, furniture, and decorative pieces with intricate designs.',
      image: woodenCraftsImage
    }
  ];

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError('');
        const result = await postAPI.getPosts({ limit: 60 });
        if (result && result.success && Array.isArray(result.posts)) {
          setProducts(result.posts);
        } else {
          setError('Unable to load products right now.');
        }
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('Failed to load products. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const filteredProducts = products.filter((product) => {
    const productName = (product.title || product.name || '').toLowerCase();
    const productCategory = (product.category || '').toLowerCase();
    const matchesSearch =
      productName.includes(searchQuery.toLowerCase()) ||
      productCategory.includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory ? product.category === selectedCategory : true;
    return matchesSearch && matchesCategory;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'best':
        return getRatingValue(b) - getRatingValue(a);
      case 'price-low':
        return getPriceNumber(a.price) - getPriceNumber(b.price);
      case 'price-high':
        return getPriceNumber(b.price) - getPriceNumber(a.price);
      case 'name':
        return a.name.localeCompare(b.name);
      default:
        return 0;
    }
  });

  const handleChatWithArtist = async (product) => {
    const productId = product._id || product.id;
    const artistId = (product.author?._id || product.author?.id || product.author || '').toString();

    if (!isLoggedIn) {
      alert('Please login to chat with the artist.');
      return;
    }

    if (!artistId) {
      alert('Artist information is missing for this craft.');
      return;
    }

    if (artistId === currentUserId) {
      alert('This is your craft. You already know the artist!');
      return;
    }

    try {
      setChatLoadingId(productId);
      const response = await chatAPI.startConversation({
        participantId: artistId,
        postId: productId
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
      setChatLoadingId(null);
    }
  };

  return (
    <div className="page-container">
      <div className="page-content">
        <h1 className="page-title">Categories</h1>
        <p className="page-description">
          Explore our wide range of handmade products. From pottery to textiles, jewelry to home decor, find unique pieces crafted with love and tradition.
        </p>
        <div className="products-grid">
          {categories.map((category) => (
            <div 
              key={category.id} 
              className={`product-card ${selectedCategory === category.title ? 'category-selected' : ''}`}
              onClick={() => {
                setSelectedCategory(selectedCategory === category.title ? null : category.title);
                setSearchQuery('');
              }}
            >
              <div className="product-card-image">
                <img src={category.image} alt={category.title} />
                <div className="product-card-overlay"></div>
              </div>
              <div className="product-card-content">
                <h3 className="product-card-title">{category.title}</h3>
                <p className="product-card-description">{category.description}</p>
                <button 
                  className="product-card-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedCategory(selectedCategory === category.title ? null : category.title);
                    setSearchQuery('');
                  }}
                >
                  {selectedCategory === category.title ? 'Show All' : 'Explore'}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Search Bar and Sort */}
        <div className="search-section">
          <div className="search-sort-container">
            <div className="search-container">
              <input
                type="text"
                className="search-input"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button className="search-btn">
                <SearchIcon />
              </button>
            </div>
            <div className="sort-container">
              <label htmlFor="sort-select" className="sort-label">Sort by:</label>
              <select
                id="sort-select"
                className="sort-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="best">Best Rated</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="name">Name: A to Z</option>
              </select>
            </div>
          </div>
        </div>

        {/* Products List */}
        <div className="products-list-section">
          <h2 className="products-section-title">
            {selectedCategory ? `${selectedCategory} Products` : 'All Products'}
          </h2>
          {selectedCategory && (
            <button 
              className="clear-filter-btn"
              onClick={() => setSelectedCategory(null)}
            >
              Clear Filter
            </button>
          )}
          <div className="products-list-grid">
            {loading ? (
              <div className="page-placeholder">
                <p>Loading products...</p>
              </div>
            ) : error ? (
              <div className="page-placeholder">
                <p>{error}</p>
              </div>
            ) : sortedProducts.length === 0 ? (
              <div className="page-placeholder">
                <p>No products found.</p>
              </div>
            ) : (
              sortedProducts.map((product) => {
                const productId = product._id || product.id;
                const productName = product.title || product.name || 'Untitled product';
                const productCategory = product.category || 'Uncategorized';
                const productImage = product.images?.[0] || product.image || 'https://via.placeholder.com/400';
                const productRating = getRatingValue(product);
                return (
                  <div
                    key={productId}
                    className="product-item-card"
                    onClick={() => navigate(`/post/${productId}`)}
                  >
                <div className="product-item-image">
                  <img src={productImage} alt={productName} />
                  <div className="product-item-overlay"></div>
                      <button
                        className={`wishlist-icon-btn ${isInWishlist(productId) ? 'wishlist-icon-btn-active' : ''}`}
                        onClick={async (e) => {
                          e.stopPropagation();
                          const result = await toggleWishlist({
                            id: productId,
                            name: productName,
                            price: product.price,
                            image: productImage
                          });
                          if (!result.success && result.error) {
                            alert(result.error);
                          }
                        }}
                        title={isInWishlist(productId) ? 'Remove from wishlist' : 'Add to wishlist'}
                      >
                        <HeartIcon filled={isInWishlist(productId)} />
                      </button>
                </div>
                <div className="product-item-content">
                  <span className="product-item-category">{productCategory}</span>
                  <h3 className="product-item-name">{productName}</h3>
                  <div className="product-item-footer">
                    <span className="product-item-price">{getPriceString(product.price)}</span>
                    {productRating ? (
                      <span className="product-item-rating">⭐ {productRating}</span>
                    ) : (
                      <span className="product-item-rating">New Arrival</span>
                    )}
                  </div>
                  <button 
                    className="product-item-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleChatWithArtist(product);
                    }}
                    disabled={chatLoadingId === productId}
                  >
                    {chatLoadingId === productId ? 'Opening chat...' : 'Chat with Artist'}
                  </button>
                </div>
              </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;

