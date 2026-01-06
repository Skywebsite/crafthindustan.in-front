import React from 'react';
import { Helmet } from 'react-19-helmet-async';
import './Page.css';

const FAQ = () => {
  return (
    <>
      <Helmet>
        <title>FAQ - Handmade Crafts in India | Craft Hindustan Help Center</title>
        <meta
          name="description"
          content="Frequently asked questions about buying and selling handmade crafts in India. Get answers about creating posts, uploading products, brands, wishlist, chat with artisans, and more."
        />
        <meta
          name="keywords"
          content="craft hindustan FAQ, handmade crafts FAQ, artisan platform FAQ, buy handmade FAQ, sell handmade FAQ, craft marketplace FAQ, handmade products help, artisan services FAQ, craft orders FAQ, India crafts FAQ, create post FAQ, brand FAQ, wishlist FAQ"
        />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://thecrafthindustan.in/faq" />
        <meta property="og:title" content="FAQ - Handmade Crafts in India | Craft Hindustan" />
        <meta property="og:description" content="Frequently asked questions about buying and selling handmade crafts in India." />
        <meta property="og:url" content="https://thecrafthindustan.in/faq" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content="FAQ - Handmade Crafts in India" />
        <meta name="twitter:description" content="Frequently asked questions about buying and selling handmade crafts in India." />
      </Helmet>

      <div className="page-container">
        <div className="page-content">
          <h1 className="page-title">Frequently Asked Questions</h1>
          <div className="faq-section">
            <div className="faq-item">
              <h3 className="faq-question">How do I create a post to sell my handmade products?</h3>
              <p className="faq-answer">
                To create a post, you need to be logged in. Click on "Create Post" in the navigation menu (or use the mobile-friendly button). Fill in the product details including title, description, category, price, tags, brand, quantity, and location. You can upload up to 5 images per product. Once submitted, your product will be listed on the platform.
              </p>
            </div>
            <div className="faq-item">
              <h3 className="faq-question">What categories of products can I list?</h3>
              <p className="faq-answer">
                We accept handmade products in the following categories: Painting, Drawing, Sculpture, Pottery, Textiles, Jewelry, Woodwork, Paper Crafts, Metalwork, and Other. All products must be genuinely handmade or handcrafted.
              </p>
            </div>
            <div className="faq-item">
              <h3 className="faq-question">How many images can I upload per product?</h3>
              <p className="faq-answer">
                You can upload up to 5 images per product. The images are automatically compressed to optimize loading times and ensure smooth browsing. Each image should be under 20MB before compression, and the total size will be optimized automatically.
              </p>
            </div>
            <div className="faq-item">
              <h3 className="faq-question">Do I need to create a brand to sell products?</h3>
              <p className="faq-answer">
                Yes, you need to create a brand before posting products. When creating a post, you'll need to select or create a brand. This helps organize your products and build your brand presence on the platform. You can create multiple brands if needed.
              </p>
            </div>
            <div className="faq-item">
              <h3 className="faq-question">How do I search and filter products?</h3>
              <p className="faq-answer">
                On the Products page, you can use the search bar to find products by name, description, or category. You can also filter by category using the dropdown menu and sort products by: Best (most popular), Price (low to high or high to low), Name (alphabetical), or Newest First.
              </p>
            </div>
            <div className="faq-item">
              <h3 className="faq-question">How do I contact an artisan or seller?</h3>
              <p className="faq-answer">
                You can use our built-in chat feature to communicate directly with artisans. Click on the "Chat with Artist" button on any product page to start a conversation. You must be logged in to use the chat feature. This allows you to ask questions, discuss custom orders, or negotiate prices.
              </p>
            </div>
            <div className="faq-item">
              <h3 className="faq-question">How do I add products to my wishlist?</h3>
              <p className="faq-answer">
                Simply click the heart icon on any product card to add it to your wishlist. You must be logged in to save items. You can view all your saved items by clicking on "Wishlist" in the navigation menu. Click the heart icon again to remove items from your wishlist.
              </p>
            </div>
            <div className="faq-item">
              <h3 className="faq-question">Can I share products with others?</h3>
              <p className="faq-answer">
                Yes! Each product card and product detail page has a share button. You can share products via Facebook, Twitter, WhatsApp, Telegram, or copy the link to share anywhere. You can also share brands from the Brands page.
              </p>
            </div>
            <div className="faq-item">
              <h3 className="faq-question">How do I view my own posts?</h3>
              <p className="faq-answer">
                After logging in, go to your Profile page and click on "My Posts" or navigate to the "My Posts" section. Here you can see all the products you've created, view their performance (views, likes), and manage them.
              </p>
            </div>
            <div className="faq-item">
              <h3 className="faq-question">What information should I include in my product description?</h3>
              <p className="faq-answer">
                Include detailed information about your product: materials used, dimensions, colors, care instructions, and any unique features. A good description helps buyers understand your product better and can improve your sales. You can also add tags to make your product more discoverable.
              </p>
            </div>
            <div className="faq-item">
              <h3 className="faq-question">How do I browse brands?</h3>
              <p className="faq-answer">
                Visit the "Brands" page from the navigation menu to see all registered brands on the platform. Click on any brand to view their profile and all products associated with that brand. You can also share brands with others.
              </p>
            </div>
            <div className="faq-item">
              <h3 className="faq-question">What if my product has multiple images?</h3>
              <p className="faq-answer">
                Products with multiple images will display as a carousel on the homepage, products page, and product detail pages. Users can navigate through images using arrow buttons or dots. On the product detail page, thumbnails allow quick image switching.
              </p>
            </div>
            <div className="faq-item">
              <h3 className="faq-question">How do I update my profile?</h3>
              <p className="faq-answer">
                Go to your Profile page (click on your profile icon in the navigation). You can update your personal information, profile picture, and other details. Changes are saved automatically when you update them.
              </p>
            </div>
            <div className="faq-item">
              <h3 className="faq-question">Is the platform available on mobile devices?</h3>
              <p className="faq-answer">
                Yes! Craft Hindustan is fully responsive and mobile-friendly. You can browse products, create posts, chat with artisans, and manage your account from any device. The mobile navigation includes a convenient "Create Post" button for easy access.
              </p>
            </div>
            <div className="faq-item">
              <h3 className="faq-question">What should I do if I encounter an error while uploading images?</h3>
              <p className="faq-answer">
                If you encounter errors, ensure each image is under 20MB. The system automatically compresses images, but very large files may cause issues. Try using images with reasonable dimensions (recommended: under 2000x2000 pixels). If problems persist, try uploading one image at a time.
              </p>
            </div>
            <div className="faq-item">
              <h3 className="faq-question">How are products sorted on the homepage?</h3>
              <p className="faq-answer">
                The homepage displays featured products and recent posts. Products are typically shown based on popularity (views and likes) and recency. You can use the Products page to apply specific sorting and filtering options.
              </p>
            </div>
            <div className="faq-item">
              <h3 className="faq-question">Can I see product statistics like views and likes?</h3>
              <p className="faq-answer">
                Yes! Each product displays view counts (👁️), likes (❤️), and ratings (⭐) on the product cards. These statistics help you understand which products are most popular and engaging with buyers.
              </p>
            </div>
            <div className="faq-item">
              <h3 className="faq-question">What happens if I'm not logged in?</h3>
              <p className="faq-answer">
                You can browse products, view brands, and read product details without logging in. However, to create posts, add items to wishlist, chat with artisans, or access your profile, you need to create an account and log in.
              </p>
            </div>
            <div className="faq-item">
              <h3 className="faq-question">How do I find products in specific categories?</h3>
              <p className="faq-answer">
                On the Products page, use the category filter dropdown to select a specific category like Pottery, Textiles, Jewelry, Painting, Drawing, Sculpture, Woodwork, Paper Crafts, Metalwork, or Other. You can combine this with search and sorting options for better results.
              </p>
            </div>
            <div className="faq-item">
              <h3 className="faq-question">Are there any fees to use the platform?</h3>
              <p className="faq-answer">
                Creating an account, browsing products, and creating posts are free. Any transaction fees or commissions would be communicated during the checkout process. Contact support for detailed information about selling fees.
              </p>
            </div>
            <div className="faq-item">
              <h3 className="faq-question">How can I get help or contact support?</h3>
              <p className="faq-answer">
                Visit the Contact page to reach out to our support team. You can also email us at offical@thecrafthindustan.in or call us at 9121428210. We're here to help with any questions or issues you may have.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default FAQ;

