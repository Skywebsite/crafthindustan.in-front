import React from 'react';
import { Helmet } from 'react-helmet-async';
import './Page.css';
import './Services.css';

const Services = () => {
  const services = [
    {
      id: 1,
      title: 'Product Listing & Management',
      description: 'Create and manage your handmade product listings with ease. Upload up to 5 high-quality images per product, add detailed descriptions, set prices, and organize by categories. Track your product performance with views, likes, and engagement metrics.',
      icon: (
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
          <line x1="9" y1="3" x2="9" y2="21" />
          <line x1="3" y1="9" x2="21" y2="9" />
        </svg>
      ),
      color: '#FF6B35',
      features: [
        'Upload up to 5 images per product',
        'Automatic image compression and optimization',
        'Multiple product categories (Painting, Pottery, Textiles, Jewelry, etc.)',
        'Track views, likes, and product statistics',
        'Manage all your products from one place'
      ]
    },
    {
      id: 2,
      title: 'Brand Creation & Management',
      description: 'Build and showcase your craft brand on our platform. Create a professional brand profile with logo, description, and establishment details. Organize all your products under your brand and build a strong online presence.',
      icon: (
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 11c0-1.1.9-2 2-2h4a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-6z" />
          <path d="M13 7h4a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2z" />
          <path d="M3 21h18" />
        </svg>
      ),
      color: '#4ECDC4',
      features: [
        'Create multiple brands for different product lines',
        'Brand profile with logo and bio',
        'Display establishment year and brand details',
        'View all products under your brand',
        'Share your brand with others'
      ]
    },
    {
      id: 3,
      title: 'Direct Chat with Artisans',
      description: 'Communicate directly with artisans and sellers through our built-in chat feature. Ask questions about products, discuss custom orders, negotiate prices, and build relationships with creators. Real-time messaging for seamless communication.',
      icon: (
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          <line x1="9" y1="10" x2="15" y2="10" />
          <line x1="12" y1="7" x2="12" y2="13" />
        </svg>
      ),
      color: '#FF6B9D',
      features: [
        'One-click chat initiation from product pages',
        'Real-time messaging with artisans',
        'Discuss custom orders and requirements',
        'Negotiate prices and delivery terms',
        'Build long-term relationships with creators'
      ]
    },
    {
      id: 4,
      title: 'Wishlist & Product Discovery',
      description: 'Save your favorite handmade products to your wishlist for easy access later. Browse through thousands of products with advanced search, filter by categories, and sort by price, popularity, or newest listings. Discover unique handmade items from artisans across India.',
      icon: (
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
        </svg>
      ),
      color: '#8B4513',
      features: [
        'Save unlimited products to wishlist',
        'Advanced search and category filtering',
        'Sort by best, price, name, or newest',
        'View product statistics (views, likes, ratings)',
        'Quick access to saved items anytime'
      ]
    },
    {
      id: 5,
      title: 'Product Sharing & Social Integration',
      description: 'Share your favorite handmade products and brands with friends and family. Use our integrated sharing tools to post on Facebook, Twitter, WhatsApp, Telegram, or copy links. Help artisans reach a wider audience through social sharing.',
      icon: (
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="18" cy="5" r="3" />
          <circle cx="6" cy="12" r="3" />
          <circle cx="18" cy="19" r="3" />
          <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
          <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
        </svg>
      ),
      color: '#FFD700',
      features: [
        'Share products on social media platforms',
        'Share brands and brand pages',
        'Copy product links for easy sharing',
        'Web Share API support for mobile devices',
        'Help artisans gain visibility through sharing'
      ]
    },
    {
      id: 6,
      title: 'Profile Management & Analytics',
      description: 'Manage your profile, view your posted products, and track your activity. Access your personal dashboard to see all your listings, manage your brands, and monitor your engagement. Keep your profile updated with the latest information.',
      icon: (
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
      ),
      color: '#9B59B6',
      features: [
        'Complete profile management',
        'View all your posted products',
        'Track product performance metrics',
        'Manage multiple brands from one account',
        'Update profile information anytime'
      ]
    },
    {
      id: 7,
      title: 'Multiple Image Display & Carousels',
      description: 'Showcase your products with multiple high-quality images. Our platform automatically creates beautiful image carousels for products with multiple photos, allowing buyers to see your creations from every angle. Thumbnail navigation for easy browsing.',
      icon: (
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
          <circle cx="8.5" cy="8.5" r="1.5" />
          <polyline points="21 15 16 10 5 21" />
        </svg>
      ),
      color: '#E74C3C',
      features: [
        'Display up to 5 images per product',
        'Automatic image carousel creation',
        'Thumbnail navigation on product pages',
        'Smooth image transitions',
        'Mobile-optimized image viewing'
      ]
    },
    {
      id: 8,
      title: 'Mobile-Friendly Platform',
      description: 'Access all platform features from any device. Our fully responsive design ensures a seamless experience on desktop, tablet, and mobile. Create posts, browse products, chat with artisans, and manage your account from anywhere, anytime.',
      icon: (
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
          <line x1="12" y1="18" x2="12.01" y2="18" />
        </svg>
      ),
      color: '#3498DB',
      features: [
        'Fully responsive design',
        'Mobile-optimized navigation',
        'Easy product creation on mobile',
        'Touch-friendly interface',
        'Works seamlessly across all devices'
      ]
    }
  ];

  return (
    <>
      <Helmet>
        <title>Handmade Craft Services in India | Product Listing, Brand Management & More | Craft Hindustan</title>
        <meta 
          name="description" 
          content="Comprehensive services for artisans and buyers: product listing with multiple images, brand creation and management, direct chat with artisans, wishlist, product sharing, and more across India." 
        />
        <meta 
          name="keywords" 
          content="handmade product listing, brand management, artisan chat, wishlist, product sharing, craft marketplace services, sell handmade products, buy handmade crafts, artisan platform services, craft services India, product creation, brand promotion, craft hindustan services" 
        />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://thecrafthindustan.in/services" />
        <meta property="og:title" content="Handmade Craft Services in India | Craft Hindustan" />
        <meta property="og:description" content="Comprehensive services for artisans and buyers: product listing, brand management, direct chat, wishlist, and product sharing across India." />
        <meta property="og:url" content="https://thecrafthindustan.in/services" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content="Handmade Craft Services in India" />
        <meta name="twitter:description" content="Comprehensive services for artisans and buyers: product listing, brand management, direct chat, wishlist, and product sharing." />
      </Helmet>
      
      <div className="services-container">
      <div className="services-header">
        <h1 className="services-title">Our Services</h1>
        <p className="services-subtitle">
          We offer comprehensive services to support both artisans and customers in their handmade journey. 
          From product listing and brand management to direct communication and product discovery, we provide all the tools you need to create, sell, buy, and connect with the handmade community across India.
        </p>
      </div>

      <div className="services-grid">
        {services.map((service) => (
          <div key={service.id} className="service-card">
            <div className="service-icon" style={{ color: service.color }}>
              {service.icon}
            </div>
            <h2 className="service-title">{service.title}</h2>
            <p className="service-description">{service.description}</p>
            <ul className="service-features">
              {service.features.map((feature, index) => (
                <li key={index} className="service-feature">
                  <span className="feature-check">✓</span>
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
    </>
  );
};

export default Services;

