import React from 'react';
import './Page.css';
import './Services.css';

const Services = () => {
  const services = [
    {
      id: 1,
      title: 'Custom Handmade Orders',
      description: 'Get personalized, handcrafted items made just for you. Work directly with skilled artisans to create unique pieces that match your vision and style.',
      icon: (
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="13.5" cy="6.5" r=".5" fill="currentColor" />
          <circle cx="17.5" cy="10.5" r=".5" fill="currentColor" />
          <circle cx="8.5" cy="7.5" r=".5" fill="currentColor" />
          <circle cx="6.5" cy="12.5" r=".5" fill="currentColor" />
          <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.926 1.648-1.648 0-.72-.722-1.648-1.648-1.648a7.5 7.5 0 1 1 0-15c-.926 0-1.648.926-1.648 1.648 0 .72.722 1.648 1.648 1.648z" />
        </svg>
      ),
      color: '#FF6B35',
      features: [
        'Personalized design consultation',
        'Direct communication with artisans',
        'Quality craftsmanship guarantee',
        'Flexible customization options'
      ]
    },
    {
      id: 2,
      title: 'Artisan Workshops',
      description: 'Learn traditional crafting techniques from master artisans. Join our workshops to discover the art of handmade creation and develop your own skills.',
      icon: (
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
        </svg>
      ),
      color: '#4ECDC4',
      features: [
        'Hands-on learning experience',
        'Expert guidance from artisans',
        'Take home your creations',
        'Various craft techniques covered'
      ]
    },
    {
      id: 3,
      title: 'Brand Promotion',
      description: 'Showcase your craft brand and reach a wider audience. We provide marketing support and platform visibility to help your handmade business grow.',
      icon: (
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 11c0-1.1.9-2 2-2h4a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-6z" />
          <path d="M13 7h4a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2z" />
          <path d="M3 21h18" />
        </svg>
      ),
      color: '#FF6B9D',
      features: [
        'Brand profile creation',
        'Product listing and promotion',
        'Marketing support',
        'Community engagement tools'
      ]
    },
    {
      id: 4,
      title: 'Bulk Orders',
      description: 'Order handmade products in bulk for events, gifts, or business needs. Get special pricing and dedicated support for large quantity orders.',
      icon: (
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
          <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
          <line x1="12" y1="22.08" x2="12" y2="12" />
        </svg>
      ),
      color: '#8B4513',
      features: [
        'Special bulk pricing',
        'Dedicated order management',
        'Quality assurance',
        'Flexible delivery options'
      ]
    },
    {
      id: 5,
      title: 'Craft Consultation',
      description: 'Get expert advice on crafting techniques, material selection, and design. Our experienced artisans are here to guide you through your creative journey.',
      icon: (
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="9" y1="18" x2="5" y2="22" />
          <line x1="15" y1="18" x2="19" y2="22" />
          <line x1="12" y1="2" x2="12" y2="22" />
          <path d="M2 12h20" />
          <circle cx="12" cy="12" r="10" />
        </svg>
      ),
      color: '#FFD700',
      features: [
        'One-on-one consultations',
        'Material and tool recommendations',
        'Design and technique guidance',
        'Problem-solving support'
      ]
    },
    {
      id: 6,
      title: 'Community Events',
      description: 'Join our community events, craft fairs, and exhibitions. Connect with fellow craft enthusiasts and showcase your work to a wider audience.',
      icon: (
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      ),
      color: '#9B59B6',
      features: [
        'Regular craft fairs',
        'Community meetups',
        'Exhibition opportunities',
        'Networking with artisans'
      ]
    }
  ];

  return (
    <div className="services-container">
      <div className="services-header">
        <h1 className="services-title">Our Services</h1>
        <p className="services-subtitle">
          We offer comprehensive services to support both artisans and customers in their handmade journey. 
          From custom orders to workshops, we're here to help you create, learn, and grow.
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
  );
};

export default Services;

