import React from 'react';
import './Page.css';

const Events = () => {
  return (
    <div className="page-container">
      <div className="page-content">
        <h1 className="page-title">Events</h1>
        <p className="page-description">
          Join us for exciting craft workshops, artisan meetups, and cultural events. Celebrate the art of handmade creations with our community.
        </p>
        <div className="page-placeholder">
          <p>Upcoming events will be displayed here.</p>
        </div>
      </div>
    </div>
  );
};

export default Events;

