import React from 'react';
import { Helmet } from 'react-19-helmet-async';
import './Page.css';

const RefundPolicy = () => {
    return (
        <>
            <Helmet>
                <title>Refund Policy - Craft Hindustan | Handmade Crafts Platform</title>
                <meta name="description" content="Read our refund and return policy to understand our guidelines for product returns and refunds on Craft Hindustan." />
            </Helmet>

            <div className="page-container">
                <div className="page-content">
                    <h1 className="page-title">Refund & Return Policy</h1>
                    <div className="faq-section">
                        <div className="faq-item">
                            <h3 className="faq-question">1. Artisan Policies</h3>
                            <p className="faq-answer">
                                Each artisan on Craft Hindustan may have their own return and refund policies. We encourage buyers to review individual artisan policies before making a purchase.
                            </p>
                        </div>

                        <div className="faq-item">
                            <h3 className="faq-question">2. Damaged or Defective Items</h3>
                            <p className="faq-answer">
                                If you receive an item that is damaged or defective, please contact the artisan immediately through the platform's chat feature to discuss a replacement or refund.
                            </p>
                        </div>

                        <div className="faq-item">
                            <h3 className="faq-question">3. Change of Mind</h3>
                            <p className="faq-answer">
                                Return requests for change of mind are generally at the discretion of the individual artisan, especially for customized or made-to-order items.
                            </p>
                        </div>

                        <div className="faq-item">
                            <h3 className="faq-question">4. Dispute Resolution</h3>
                            <p className="faq-answer">
                                If you are unable to resolve a refund or return issue with an artisan, you may contact Craft Hindustan support for assistance in mediating the dispute.
                            </p>
                        </div>

                        <div className="faq-item">
                            <h3 className="faq-question">5. Shipping Costs</h3>
                            <p className="faq-answer">
                                Shipping costs for returns are typically the responsibility of the buyer unless the item was damaged, defective, or incorrectly described.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default RefundPolicy;
