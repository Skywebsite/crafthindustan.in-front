import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useWishlist } from '../context/WishlistContext';
import HeartIcon from './HeartIcon';
import './Page.css';

const Wishlist = () => {
  const { wishlist, removeFromWishlist } = useWishlist();
  const navigate = useNavigate();

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

  return (
    <div className="page-container">
      <div className="page-content">
        <h1 className="page-title">My Wishlist</h1>
        {wishlist.length === 0 ? (
          <div className="wishlist-empty">
            <p className="wishlist-empty-text">Your wishlist is empty</p>
            <p className="wishlist-empty-subtext">Start adding products to your wishlist!</p>
          </div>
        ) : (
          <>
            <p className="page-description">
              You have {wishlist.length} {wishlist.length === 1 ? 'item' : 'items'} in your wishlist.
            </p>
            <div className="products-list-grid">
              {wishlist.map((product) => (
                <div key={product.id} className="product-item-card" onClick={() => navigate(`/product/${product.id}`)}>
                  <div className="product-item-image">
                    <img src={product.image} alt={product.name} />
                    <div className="product-item-overlay"></div>
                        <button
                          className="wishlist-icon-btn wishlist-icon-btn-active"
                          onClick={async (e) => {
                            e.stopPropagation();
                            const result = await removeFromWishlist(product.id);
                            if (!result.success && result.error) {
                              alert(result.error);
                            }
                          }}
                          title="Remove from wishlist"
                        >
                          <HeartIcon filled={true} />
                        </button>
                  </div>
                  <div className="product-item-content">
                    <span className="product-item-category">{product.category}</span>
                    <h3 className="product-item-name">{product.name}</h3>
                    <div className="product-item-footer">
                      <span className="product-item-price">{getPriceString(product.price)}</span>
                      <span className="product-item-rating">⭐ {product.rating}</span>
                    </div>
                    <button 
                      className="product-item-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/product/${product.id}`);
                      }}
                    >
                      Chat with Artist
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Wishlist;

