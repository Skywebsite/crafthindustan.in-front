import React from 'react';
import { Helmet } from 'react-19-helmet-async';
import './Page.css';

const TermsConditions = () => {
    return (
        <>
            <Helmet>
                <title>Terms and Conditions - Craft Hindustan | Handmade Crafts Platform</title>
                <meta name="description" content="Read our terms and conditions to understand the rules and guidelines for using the Craft Hindustan platform." />
            </Helmet>

            <div className="page-container">
                <div className="page-content">
                    <h1 className="page-title">Terms and Conditions</h1>
                    <div className="faq-section">
                        <div className="faq-item">
                            <h3 className="faq-question">1. Acceptance of Terms</h3>
                            <p className="faq-answer">
                                By accessing or using Craft Hindustan, you agree to be bound by these Terms and Conditions and all applicable laws and regulations.
                            </p>
                        </div>

                        <div className="faq-item">
                            <h3 className="faq-question">2. User Accounts</h3>
                            <p className="faq-answer">
                                To use certain features of the platform, you must register for an account. You are responsible for maintaining the confidentiality of your account information.
                            </p>
                        </div>

                        <div className="faq-item">
                            <h3 className="faq-question">3. Listings and Sales</h3>
                            <p className="faq-answer">
                                Artisans are responsible for the accuracy of their product listings. Craft Hindustan is a platform for connection and does not guarantee the quality or delivery of products.
                            </p>
                        </div>

                        <div className="faq-item">
                            <h3 className="faq-question">4. Prohibited Conduct</h3>
                            <p className="faq-answer">
                                You agree not to use the platform for any unlawful purpose or to engage in any conduct that interferes with the operation of the platform.
                            </p>
                        </div>

                        <div className="faq-item">
                            <h3 className="faq-question">5. Intellectual Property</h3>
                            <p className="faq-answer">
                                The content on Craft Hindustan, including text, graphics, and logos, is the property of Craft Hindustan or its content suppliers and is protected by intellectual property laws.
                            </p>
                        </div>

                        <div className="faq-item">
                            <h3 className="faq-question">6. Limitation of Liability</h3>
                            <p className="faq-answer">
                                Craft Hindustan shall not be liable for any damages arising out of or in connection with your use of the platform.
                            </p>
                        </div>

                        <div className="faq-item">
                            <h3 className="faq-question">7. Changes to Terms</h3>
                            <p className="faq-answer">
                                We reserve the right to modify these Terms and Conditions at any time. Your continued use of the platform constitutes acceptance of the modified terms.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default TermsConditions;
