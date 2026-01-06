import React from 'react';
import { Helmet } from 'react-19-helmet-async';
import './Page.css';

const PrivacyPolicy = () => {
    return (
        <>
            <Helmet>
                <title>Privacy Policy - Craft Hindustan | Handmade Crafts Platform</title>
                <meta name="description" content="Read our privacy policy to understand how we collect, use, and protect your personal information at Craft Hindustan." />
            </Helmet>

            <div className="page-container">
                <div className="page-content">
                    <h1 className="page-title">Privacy Policy</h1>
                    <div className="faq-section">
                        <div className="faq-item">
                            <h3 className="faq-question">1. Information We Collect</h3>
                            <p className="faq-answer">
                                We collect information you provide directly to us when you create an account, post a product, or communicate with other users. This may include your name, email address, phone number, and location.
                            </p>
                        </div>

                        <div className="faq-item">
                            <h3 className="faq-question">2. How We Use Your Information</h3>
                            <p className="faq-answer">
                                We use the information we collect to provide, maintain, and improve our services, to process transactions, and to communicate with you about your account and our services.
                            </p>
                        </div>

                        <div className="faq-item">
                            <h3 className="faq-question">3. Sharing of Information</h3>
                            <p className="faq-answer">
                                We do not share your personal information with third parties except as described in this policy, such as with your consent or to comply with legal obligations.
                            </p>
                        </div>

                        <div className="faq-item">
                            <h3 className="faq-question">4. Data Security</h3>
                            <p className="faq-answer">
                                We take reasonable measures to help protect information about you from loss, theft, misuse, and unauthorized access, disclosure, alteration, and destruction.
                            </p>
                        </div>

                        <div className="faq-item">
                            <h3 className="faq-question">5. Your Choices</h3>
                            <p className="faq-answer">
                                You may update, correct, or delete your account information at any time by logging into your account or contacting us.
                            </p>
                        </div>

                        <div className="faq-item">
                            <h3 className="faq-question">6. Contact Us</h3>
                            <p className="faq-answer">
                                If you have any questions about this Privacy Policy, please contact us at official@skyweb.xyz.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default PrivacyPolicy;
