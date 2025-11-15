import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { brandAPI } from '../services/api';
import './Page.css';
import './Brands.css';
import './Home.css';

const Brands = () => {
  const navigate = useNavigate();
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        setLoading(true);
        setError('');
        const result = await brandAPI.getAllBrands({ limit: 50 });
        if (result.success && result.brands) {
          setBrands(result.brands);
        } else {
          setError('Failed to load brands');
        }
      } catch (err) {
        console.error('Error fetching brands:', err);
        setError('Failed to load brands. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchBrands();
  }, []);

  return (
    <div className="page-container">
      <div className="page-content">
        <div className="brands-animation-container">
          <DotLottieReact
            src="https://lottie.host/44c3c51b-efef-4ed8-8a7d-7eb89488955b/vDGQg8fJtu.lottie"
            loop
            autoplay
            className="brands-lottie-animation"
          />
        </div>
        <h1 className="page-title">Brands</h1>
        <p className="page-description">
          Discover our curated collection of authentic handmade brands. Each brand represents the passion and dedication of skilled artisans from across India.
        </p>

        {loading ? (
          <div className="brands-loading">
            <p>Loading brands...</p>
          </div>
        ) : error ? (
          <div className="brands-error">
            <p>{error}</p>
          </div>
        ) : brands.length === 0 ? (
          <div className="page-placeholder">
            <p>No brands available yet.</p>
          </div>
        ) : (
          <div className="brands-grid">
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
                    {brand.bio.length > 120 
                      ? brand.bio.substring(0, 120) + '...' 
                      : brand.bio}
                  </p>
                  <div className="artist-brand-footer">
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      <span className="artist-brand-products">
                        Est. {brand.establishedYear || 'N/A'}
                      </span>
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
  );
};

export default Brands;

