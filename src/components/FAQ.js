import React from 'react';
import './Page.css';

const FAQ = () => {
  return (
    <div className="page-container">
      <div className="page-content">
        <h1 className="page-title">Frequently Asked Questions</h1>
        <div className="faq-section">
          <div className="faq-item">
            <h3 className="faq-question">How do I sell my handmade products?</h3>
            <p className="faq-answer">
              You can register as an artisan on our platform and create your seller profile. Once approved, you can start listing your handmade products.
            </p>
          </div>
          <div className="faq-item">
            <h3 className="faq-question">What types of products are accepted?</h3>
            <p className="faq-answer">
              We accept all types of handmade, handcrafted products including pottery, textiles, jewelry, home decor, and traditional crafts.
            </p>
          </div>
          <div className="faq-item">
            <h3 className="faq-question">How do I place an order?</h3>
            <p className="faq-answer">
              Simply browse our products, add items to your cart, and proceed to checkout. We support various payment methods for your convenience.
            </p>
          </div>
          <div className="faq-item">
            <h3 className="faq-question">What is the return policy?</h3>
            <p className="faq-answer">
              We offer a 7-day return policy for most products. Please check individual product listings for specific return terms.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQ;

