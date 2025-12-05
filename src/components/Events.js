import React from 'react';
import { Helmet } from 'react-19-helmet-async';
import './Page.css';

const Events = () => {
  return (
    <>
      <Helmet>
        <title>Craft Workshops & Events in Hyderabad & Telangana | Artisan Events | Craft Hindustan</title>
        <meta 
          name="description" 
          content="Join craft workshops, artisan meetups, and cultural events in Hyderabad, Warangal, Karimnagar, and all areas of Telangana. Learn traditional crafting techniques from master artisans." 
        />
        <meta 
          name="keywords" 
          content="craft workshops Hyderabad, artisan events Telangana, craft classes Hyderabad, handmade workshops, artisan meetups, craft fairs Telangana, traditional craft events, craft exhibitions Hyderabad, learn crafting, artisan workshops, craft events Warangal, Karimnagar events, craft hindustan events" 
        />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://crafthindustan.com/events" />
        <meta property="og:title" content="Craft Workshops & Events in Hyderabad & Telangana | Craft Hindustan" />
        <meta property="og:description" content="Join craft workshops, artisan meetups, and cultural events in Hyderabad and all areas of Telangana." />
        <meta property="og:url" content="https://crafthindustan.com/events" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content="Craft Workshops & Events in Hyderabad & Telangana" />
        <meta name="twitter:description" content="Join craft workshops, artisan meetups, and cultural events in Hyderabad and all areas of Telangana." />
      </Helmet>
      
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
    </>
  );
};

export default Events;

