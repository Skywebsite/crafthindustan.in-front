import React from 'react';
import './Page.css';

const Contact = () => {
  return (
    <div className="page-container">
      <div className="page-content">
        <h1 className="page-title">Contact Us</h1>
        <p className="page-description">
          Have questions or need assistance? We'd love to hear from you. Reach out to us through any of the following ways.
        </p>
        <div className="contact-section">
          <div className="contact-info">
            <h3>Get in Touch</h3>
            <p><strong>Email:</strong> skywebdevelopers123@gmail.com</p>
            <p><strong>Phone:</strong> 9121428210</p>
            <p className="contact-company-info">
              This is a product of <a href="https://www.skywebdev.xyz/" target="_blank" rel="noopener noreferrer" className="contact-company-link"><strong>Skyweb IT Solution Private Limited</strong></a>
            </p>
            <div className="contact-address">
              <h4>Address:</h4>
              <p>
                Skyweb IT Solution Private Limited,<br />
                CHCF+394, Sk Laxmi Bike Point,<br />
                Gayathri Hills Rd Number 2,<br />
                Gayathri Hills, Jyothi Nagar Colony,<br />
                Boduppal, Hyderabad, Telangana 500092
              </p>
            </div>
          </div>
          <div className="contact-form">
            <h3>Send us a Message</h3>
            <form>
              <div className="form-group">
                <label htmlFor="name">Name</label>
                <input type="text" id="name" name="name" placeholder="Your name" />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input type="email" id="email" name="email" placeholder="Your email" />
              </div>
              <div className="form-group">
                <label htmlFor="message">Message</label>
                <textarea id="message" name="message" rows="5" placeholder="Your message"></textarea>
              </div>
              <button type="submit" className="submit-btn">Send Message</button>
            </form>
          </div>
        </div>
        
        <div className="contact-map-section">
          <h3 className="map-title">Find Us</h3>
          <div className="contact-map-container">
            <iframe
              src="https://www.google.com/maps?q=Skyweb+IT+Solution+Private+Limited,+CHCF%2B394,+Sk+Laxmi+Bike+Point,+Gayathri+Hills+Rd+Number+2,+Gayathri+Hills,+Jyothi+Nagar+Colony,+Boduppal,+Hyderabad,+Telangana+500092&output=embed"
              width="100%"
              height="500"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Skyweb IT Solution Private Limited Location"
            ></iframe>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;

