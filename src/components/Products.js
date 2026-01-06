import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-19-helmet-async';
import { useWishlist } from '../context/WishlistContext';
import HeartIcon from './HeartIcon';
import SearchIcon from './SearchIcon';
import { chatAPI, postAPI } from '../services/api';
import potteryImage from '../images/1 copy.png';
import textilesImage from '../images/2 copy.png';
import jewelryImage from '../images/3 copy.png';
import homeDecorImage from '../images/4 copy.png';
import woodenCraftsImage from '../images/5 copy.png';
import './Page.css';

const Products = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('best');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [chatLoadingId, setChatLoadingId] = useState(null);
  const { toggleWishlist, isInWishlist, isLoggedIn, user } = useWishlist();
  const navigate = useNavigate();
  const currentUserId = (user?._id || user?.id || '').toString();

  // Helper function to safely get price as string
  // Helper function to safely get price as string
  const getPriceString = (price) => {
    let priceStr = '';

    if (price === null || price === undefined) {
      priceStr = '0';
    } else if (typeof price === 'object') {
      priceStr = String(price.formatted || price.original || price.amount || '0');
    } else {
      priceStr = String(price);
    }

    // Add Rupee symbol if not present
    if (!priceStr.includes('₹') && !priceStr.toLowerCase().includes('rs') && !priceStr.toLowerCase().includes('inr')) {
      return `₹${priceStr}`;
    }
    return priceStr;
  };

  // Helper function to get price number for sorting
  const getPriceNumber = (price) => {
    const priceStr = getPriceString(price);
    return parseInt(priceStr.replace(/[₹,]/g, '')) || 0;
  };

  const getRatingValue = (product) => {
    // Use views and likes to determine "best" products
    const views = product.views || 0;
    const likes = product.likes || 0;
    // Combine views and likes for a score (views weighted less than likes)
    return (views * 0.1) + (likes * 10);
  };

  const categories = [
    {
      id: 1,
      title: 'Pottery',
      displayTitle: 'Pottery & Ceramics',
      description: 'Handcrafted clay pots, vases, and ceramic items made with traditional techniques.',
      image: potteryImage
    },
    {
      id: 2,
      title: 'Textiles',
      displayTitle: 'Textiles & Fabrics',
      description: 'Beautiful handwoven fabrics, embroidered textiles, and traditional clothing.',
      image: textilesImage
    },
    {
      id: 3,
      title: 'Jewelry',
      displayTitle: 'Jewelry & Accessories',
      description: 'Unique handmade jewelry pieces crafted with traditional Indian designs.',
      image: jewelryImage
    },
    {
      id: 4,
      title: 'Painting',
      displayTitle: 'Paintings & Art',
      description: 'Beautiful paintings and artwork created by talented artists.',
      image: homeDecorImage
    },
    {
      id: 5,
      title: 'Woodwork',
      displayTitle: 'Wooden Crafts',
      description: 'Hand-carved wooden items, furniture, and decorative pieces with intricate designs.',
      image: woodenCraftsImage
    },
    {
      id: 6,
      title: 'Drawing',
      displayTitle: 'Drawings & Sketches',
      description: 'Hand-drawn sketches and illustrations showcasing artistic talent.',
      image: potteryImage
    },
    {
      id: 7,
      title: 'Sculpture',
      displayTitle: 'Sculptures',
      description: 'Three-dimensional art pieces crafted with skill and creativity.',
      image: textilesImage
    },
    {
      id: 8,
      title: 'Paper Crafts',
      displayTitle: 'Paper Crafts',
      description: 'Delicate paper-based crafts and origami creations.',
      image: jewelryImage
    },
    {
      id: 9,
      title: 'Metalwork',
      displayTitle: 'Metalwork',
      description: 'Handcrafted metal items and decorative pieces.',
      image: homeDecorImage
    },
    {
      id: 10,
      title: 'Other',
      displayTitle: 'Other Crafts',
      description: 'Various other handmade crafts and unique creations.',
      image: woodenCraftsImage
    }
  ];

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError('');
        const result = await postAPI.getPosts({ limit: 60 });
        if (result && result.success && Array.isArray(result.posts)) {
          setProducts(result.posts);
        } else {
          setError('Unable to load products right now.');
        }
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('Failed to load products. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const filteredProducts = products.filter((product) => {
    const productName = (product.title || product.name || '').toLowerCase();
    const productDescription = (product.description || '').toLowerCase();
    const productCategory = (product.category || '').toLowerCase();
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch =
      productName.includes(searchLower) ||
      productDescription.includes(searchLower) ||
      productCategory.includes(searchLower);
    const matchesCategory = selectedCategory ? product.category === selectedCategory : true;
    return matchesSearch && matchesCategory;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'best':
        // Sort by views and likes (most popular first)
        return getRatingValue(b) - getRatingValue(a);
      case 'price-low':
        return getPriceNumber(a.price) - getPriceNumber(b.price);
      case 'price-high':
        return getPriceNumber(b.price) - getPriceNumber(a.price);
      case 'name':
        // Use title instead of name
        const titleA = (a.title || a.name || '').toLowerCase();
        const titleB = (b.title || b.name || '').toLowerCase();
        return titleA.localeCompare(titleB);
      case 'newest':
        // Sort by creation date (newest first)
        const dateA = new Date(a.createdAt || 0);
        const dateB = new Date(b.createdAt || 0);
        return dateB - dateA;
      default:
        return 0;
    }
  });

  const handleChatWithArtist = async (product) => {
    const productId = product._id || product.id;
    const artistId = (product.author?._id || product.author?.id || product.author || '').toString();

    if (!isLoggedIn) {
      alert('Please login to chat with the artist.');
      return;
    }

    if (!artistId) {
      alert('Artist information is missing for this craft.');
      return;
    }

    if (artistId === currentUserId) {
      alert('This is your craft. You already know the artist!');
      return;
    }

    try {
      setChatLoadingId(productId);
      const response = await chatAPI.startConversation({
        participantId: artistId,
        postId: productId
      });
      if (response.success && response.conversation) {
        navigate(`/chat/${response.conversation._id}`, {
          state: { conversation: response.conversation }
        });
      } else {
        alert(response.error || 'Unable to start the chat. Please try again.');
      }
    } catch (err) {
      console.error('Chat start error:', err);
      alert(err.message || 'Unable to start the chat right now.');
    } finally {
      setChatLoadingId(null);
    }
  };

  return (
    <>
      <Helmet>
        <title>Handmade Products & Crafts in India | Buy Handmade Online | Traditional Indian Crafts | Craft Hindustan</title>
        <meta
          name="description"
          content="Shop authentic handmade products, traditional crafts, pottery, textiles, jewelry, home decor, and wooden crafts from artisans across India. Buy directly from local craftsmen in Mumbai, Delhi, Bangalore, Hyderabad, Chennai, Kolkata, Pune, Ahmedabad, Jaipur, Surat, Lucknow, Kanpur, Nagpur, Indore, Thane, Bhopal, Visakhapatnam, Patna, Vadodara, Ghaziabad, Ludhiana, Agra, Nashik, Faridabad, Meerut, Rajkot, Varanasi, Srinagar, Amritsar, Allahabad, Ranchi, Howrah, Jabalpur, Gwalior, Coimbatore, Vijayawada, Jodhpur, Madurai, Raipur, Kota, Guwahati, Chandigarh, Solapur, Hubli, Tiruchirappalli, Bareilly, Moradabad, Mysore, Tiruppur, Gurgaon, Aligarh, Jalandhar, Bhubaneswar, Salem, Warangal, Mira-Bhayandar, Thiruvananthapuram, Bhiwandi, Saharanpur, Guntur, Amravati, Bikaner, Noida, Jamshedpur, Bhilai, Cuttack, Firozabad, Kochi, Nellore, Bhavnagar, Dehradun, Durgapur, Asansol, Rourkela, Nanded, Kolhapur, Ajmer, Gulbarga, Jamnagar, Ujjain, Loni, Siliguri, Jhansi, Ulhasnagar, Jammu, Sangli-Miraj, Belgaum, Mangalore, Ambattur, Tirunelveli, Malegaon, Gaya, Jalgaon, Udaipur, Maheshtala, Davanagere, Kozhikode, Akola, Kurnool, Rajpur Sonarpur, Bokaro, South Dumdum, Bellary, Patiala, Gopalpur, Agartala, Bhagalpur, Muzaffarnagar, Bhatpara, Panihati, Latur, Dhule, Rohtak, Korba, Bhilwara, Berhampur, Muzaffarpur, Ahmednagar, Mathura, Kollam, Avadi, Kadapa, Kamarhati, Sambalpur, Bilaspur, Shahjahanpur, Satara, Bijapur, Rampur, Shivamogga, Chandrapur, Junagadh, Thrissur, Alwar, Bardhaman, Kulti, Kakinada, Nizamabad, Parbhani, Tumkur, Khammam, Ozhukarai, Bihar Sharif, Panipat, Darbhanga, Bally, Aizawl, Dewas, Ichalkaranji, Karnal, Bathinda, Jalna, Eluru, Kirari Suleman Nagar, Barasat, Purnia, Satna, Mau, Sonipat, Farrukhabad, Sagar, Rourkela, Durg, Imphal, Ratlam, Hapur, Arrah, Karimnagar, Anantapur, Etawah, Bharatpur, Begusarai, New Delhi, Gandhinagar, Barmer, Tiruvottiyur, Pondicherry, Sikar, Thoothukudi, Rewa, Mirzapur, Raichur, Pali, Rajahmundry, Khandwa, Yavatmal, Katihar, Sangrur, Bulandshahr, Uluberia, Murwara, Sambhal, Singrauli, Nadiad, Secunderabad, Naihati, Yamunanagar, Bidhan Nagar, Pallavaram, Bidar, Munger, Panchkula, Burhanpur, Raurkela Industrial Township, Kharagpur, Dindigul, Gandhidham, Hospet, Nangloi Jat, Malda, Ongole, Deoghar, Chhapra, Haldia, Khandwa, Nandyal, Morena, Amroha, Anand, Bhind, Bhalswa Jahangir Pur, Madhyamgram, Bhiwani, Berhampore, Ambala, Morbi, Fatehpur, Raebareli, Khora, Chittoor, Bhusawal, Orai, Bahraich, Phusro, Vellore, Mehsana, Raiganj, Sirsa, Danapur, Serampore, Sultan Pur Majra, Guna, Jaunpur, Panvel, Shivpuri, Surendranagar Dudhrej, Unnao, Hugli-Chinsurah, Alappuzha, Kottayam, Machilipatnam, Shimla, Adoni, Tenali, Proddatur, Saharsa, Hindupur, Sasaram, Hajipur, Bhimavaram, Dehri, Madanapalle, Siwan, Bettiah, Guntakal, Srikakulam, Motihari, Dharmavaram, Gudivada, Narasaraopet, Bagalkot, Tadepalligudem, Kishanganj, Karaikudi, Suryapet, Jamalpur, Kavali, Tadipatri, Amaravati, Buxar, Jehanabad, Aurangabad, Gangawati, Vinukonda, Adilabad, Yadgir, Achalpur, Lakshmeshwar, Nalgonda, Bidar, and all cities across India. Craft Hindustan - Your trusted marketplace for authentic Indian handicrafts."
        />
        <meta
          name="keywords"
          content="handmade products India, buy handmade online India, traditional crafts India, pottery ceramics India, handmade textiles India, jewelry accessories India, home decor handmade India, wooden crafts India, handmade gifts India, artisan products India, craft products India, buy crafts online India, handmade marketplace India, traditional Indian crafts, craft hindustan products, handmade products Mumbai, handmade products Delhi, handmade products Bangalore, handmade products Hyderabad, handmade products Chennai, handmade products Kolkata, handmade products Pune, handmade products Ahmedabad, handmade products Jaipur, handmade products Surat, handmade products Lucknow, handmade products Kanpur, handmade products Nagpur, handmade products Indore, handmade products Bhopal, handmade products Visakhapatnam, handmade products Patna, handmade products Vadodara, handmade products Ghaziabad, handmade products Ludhiana, handmade products Agra, handmade products Nashik, handmade products Faridabad, handmade products Meerut, handmade products Rajkot, handmade products Varanasi, handmade products Srinagar, handmade products Amritsar, handmade products Allahabad, handmade products Ranchi, handmade products Howrah, handmade products Jabalpur, handmade products Gwalior, handmade products Coimbatore, handmade products Vijayawada, handmade products Jodhpur, handmade products Madurai, handmade products Raipur, handmade products Kota, handmade products Guwahati, handmade products Chandigarh, handmade products Solapur, handmade products Hubli, handmade products Tiruchirappalli, handmade products Bareilly, handmade products Moradabad, handmade products Mysore, handmade products Tiruppur, handmade products Gurgaon, handmade products Aligarh, handmade products Jalandhar, handmade products Bhubaneswar, handmade products Salem, handmade products Warangal, handmade products Thiruvananthapuram, handmade products Guntur, handmade products Amravati, handmade products Bikaner, handmade products Noida, handmade products Jamshedpur, handmade products Bhilai, handmade products Cuttack, handmade products Firozabad, handmade products Kochi, handmade products Nellore, handmade products Bhavnagar, handmade products Dehradun, handmade products Durgapur, handmade products Asansol, handmade products Rourkela, handmade products Nanded, handmade products Kolhapur, handmade products Ajmer, handmade products Gulbarga, handmade products Jamnagar, handmade products Ujjain, handmade products Siliguri, handmade products Jhansi, handmade products Jammu, handmade products Belgaum, handmade products Mangalore, handmade products Ambattur, handmade products Tirunelveli, handmade products Malegaon, handmade products Gaya, handmade products Jalgaon, handmade products Udaipur, handmade products Davanagere, handmade products Kozhikode, handmade products Akola, handmade products Kurnool, handmade products Bokaro, handmade products Bellary, handmade products Patiala, handmade products Agartala, handmade products Bhagalpur, handmade products Muzaffarnagar, handmade products Bhatpara, handmade products Latur, handmade products Dhule, handmade products Rohtak, handmade products Korba, handmade products Bhilwara, handmade products Berhampur, handmade products Muzaffarpur, handmade products Ahmednagar, handmade products Mathura, handmade products Kollam, handmade products Avadi, handmade products Kadapa, handmade products Kamarhati, handmade products Sambalpur, handmade products Bilaspur, handmade products Shahjahanpur, handmade products Satara, handmade products Bijapur, handmade products Rampur, handmade products Shivamogga, handmade products Chandrapur, handmade products Junagadh, handmade products Thrissur, handmade products Alwar, handmade products Bardhaman, handmade products Kulti, handmade products Kakinada, handmade products Nizamabad, handmade products Parbhani, handmade products Tumkur, handmade products Khammam, handmade products Ozhukarai, handmade products Bihar Sharif, handmade products Panipat, handmade products Darbhanga, handmade products Bally, handmade products Aizawl, handmade products Dewas, handmade products Ichalkaranji, handmade products Karnal, handmade products Bathinda, handmade products Jalna, handmade products Eluru, handmade products Barasat, handmade products Purnia, handmade products Satna, handmade products Mau, handmade products Sonipat, handmade products Farrukhabad, handmade products Sagar, handmade products Durg, handmade products Imphal, handmade products Ratlam, handmade products Hapur, handmade products Arrah, handmade products Karimnagar, handmade products Anantapur, handmade products Etawah, handmade products Bharatpur, handmade products Begusarai, handmade products New Delhi, handmade products Gandhinagar, handmade products Barmer, handmade products Tiruvottiyur, handmade products Pondicherry, handmade products Sikar, handmade products Thoothukudi, handmade products Rewa, handmade products Mirzapur, handmade products Raichur, handmade products Pali, handmade products Rajahmundry, handmade products Khandwa, handmade products Yavatmal, handmade products Katihar, handmade products Sangrur, handmade products Bulandshahr, handmade products Uluberia, handmade products Murwara, handmade products Sambhal, handmade products Singrauli, handmade products Nadiad, handmade products Secunderabad, handmade products Naihati, handmade products Yamunanagar, handmade products Bidhan Nagar, handmade products Pallavaram, handmade products Bidar, handmade products Munger, handmade products Panchkula, handmade products Burhanpur, handmade products Kharagpur, handmade products Dindigul, handmade products Gandhidham, handmade products Hospet, handmade products Nangloi Jat, handmade products Malda, handmade products Ongole, handmade products Deoghar, handmade products Chhapra, handmade products Haldia, handmade products Nandyal, handmade products Morena, handmade products Amroha, handmade products Anand, handmade products Bhind, handmade products Madhyamgram, handmade products Bhiwani, handmade products Berhampore, handmade products Ambala, handmade products Morbi, handmade products Fatehpur, handmade products Raebareli, handmade products Chittoor, handmade products Bhusawal, handmade products Orai, handmade products Bahraich, handmade products Phusro, handmade products Vellore, handmade products Mehsana, handmade products Raiganj, handmade products Sirsa, handmade products Danapur, handmade products Serampore, handmade products Sultan Pur Majra, handmade products Guna, handmade products Jaunpur, handmade products Panvel, handmade products Shivpuri, handmade products Surendranagar Dudhrej, handmade products Unnao, handmade products Hugli-Chinsurah, handmade products Alappuzha, handmade products Kottayam, handmade products Machilipatnam, handmade products Shimla, handmade products Adoni, handmade products Tenali, handmade products Proddatur, handmade products Saharsa, handmade products Hindupur, handmade products Sasaram, handmade products Hajipur, handmade products Bhimavaram, handmade products Dehri, handmade products Madanapalle, handmade products Siwan, handmade products Bettiah, handmade products Guntakal, handmade products Srikakulam, handmade products Motihari, handmade products Dharmavaram, handmade products Gudivada, handmade products Narasaraopet, handmade products Bagalkot, handmade products Tadepalligudem, handmade products Kishanganj, handmade products Karaikudi, handmade products Suryapet, handmade products Jamalpur, handmade products Kavali, handmade products Tadipatri, handmade products Amaravati, handmade products Buxar, handmade products Jehanabad, handmade products Aurangabad, handmade products Gangawati, handmade products Vinukonda, handmade products Adilabad, handmade products Yadgir, handmade products Achalpur, handmade products Lakshmeshwar, handmade products Nalgonda, Indian handicrafts, Indian artisans, traditional Indian art, buy Indian crafts, Indian handmade goods, authentic Indian products, Indian craft marketplace"
        />
        <meta name="robots" content="index, follow" />
        <meta name="author" content="Craft Hindustan" />
        <meta name="language" content="English" />
        <meta name="revisit-after" content="7 days" />
        <meta name="geo.region" content="IN" />
        <meta name="geo.placename" content="India" />
        <link rel="canonical" href="https://thecrafthindustan.in/products" />
        <meta property="og:title" content="Handmade Products & Crafts in India | Buy Handmade Online | Craft Hindustan" />
        <meta property="og:description" content="Shop authentic handmade products, traditional crafts, pottery, textiles, jewelry, and home decor from artisans across India. Buy directly from local craftsmen in all major cities." />
        <meta property="og:url" content="https://thecrafthindustan.in/products" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="%PUBLIC_URL%/images/Cream Simple Art and Craft Store Logo (1).png" />
        <meta property="og:locale" content="en_IN" />
        <meta property="og:site_name" content="Craft Hindustan" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Handmade Products & Crafts in India | Craft Hindustan" />
        <meta name="twitter:description" content="Shop authentic handmade products, traditional crafts, pottery, textiles, jewelry, and home decor from artisans across India." />
        <meta name="twitter:image" content="%PUBLIC_URL%/images/Cream Simple Art and Craft Store Logo (1).png" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            "name": "Handmade Products & Crafts in India",
            "description": "Shop authentic handmade products, traditional crafts, pottery, textiles, jewelry, and home decor from artisans across India",
            "url": "https://thecrafthindustan.in/products",
            "image": "https://thecrafthindustan.in/images/Cream Simple Art and Craft Store Logo (1).png",
            "mainEntity": {
              "@type": "ItemList",
              "itemListElement": categories.map((category, index) => ({
                "@type": "ListItem",
                "position": index + 1,
                "name": category.displayTitle || category.title,
                "description": category.description
              }))
            },
            "areaServed": {
              "@type": "Country",
              "name": "India"
            },
            "offers": {
              "@type": "AggregateOffer",
              "priceCurrency": "INR",
              "availability": "https://schema.org/InStock"
            }
          })
        }} />
      </Helmet>

      <div className="page-container">
        <div className="page-content">
          <h1 className="page-title">Products</h1>
          <p className="page-description">
            Explore our wide range of handmade products. From pottery to textiles, jewelry to home decor, find unique pieces crafted with love and tradition.
          </p>

          {/* Search Bar and Sort */}
          <div className="search-section">
            <div className="search-sort-container">
              <div className="search-container">
                <input
                  type="text"
                  className="search-input"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button className="search-btn">
                  <SearchIcon />
                </button>
              </div>
              <div className="sort-container">
                <label htmlFor="sort-select" className="sort-label">Sort by:</label>
                <select
                  id="sort-select"
                  className="sort-select"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="best">Most Popular</option>
                  <option value="newest">Newest First</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="name">Name: A to Z</option>
                </select>
              </div>
              <div className="filter-container">
                <label htmlFor="category-filter" className="filter-label">Filter by Category:</label>
                <select
                  id="category-filter"
                  className="category-filter-select"
                  value={selectedCategory || ''}
                  onChange={(e) => setSelectedCategory(e.target.value || null)}
                >
                  <option value="">All Categories</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.title}>
                      {category.displayTitle || category.title}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Products List */}
          <div className="products-list-section">
            <h2 className="products-section-title">
              {selectedCategory ? `${categories.find(c => c.title === selectedCategory)?.displayTitle || selectedCategory} Products` : 'All Products'}
              {selectedCategory && (
                <button
                  className="clear-filter-btn"
                  onClick={() => setSelectedCategory(null)}
                >
                  Clear Filter
                </button>
              )}
            </h2>
            <div className="products-list-grid">
              {loading ? (
                <div className="page-placeholder">
                  <p>Loading products...</p>
                </div>
              ) : error ? (
                <div className="page-placeholder">
                  <p>{error}</p>
                </div>
              ) : sortedProducts.length === 0 ? (
                <div className="page-placeholder">
                  <p>No products found.</p>
                </div>
              ) : (
                sortedProducts.map((product) => {
                  const productId = product._id || product.id;
                  const productName = product.title || product.name || 'Untitled product';
                  const productCategory = product.category || 'Uncategorized';
                  const productImage = product.images?.[0] || product.image || 'https://via.placeholder.com/400';
                  const productRating = getRatingValue(product);
                  return (
                    <div
                      key={productId}
                      className="product-item-card"
                      onClick={() => navigate(`/post/${productId}`)}
                    >
                      <div className="product-item-image">
                        <img src={productImage} alt={productName} />
                        <div className="product-item-overlay"></div>
                        <button
                          className={`wishlist-icon-btn ${isInWishlist(productId) ? 'wishlist-icon-btn-active' : ''}`}
                          onClick={async (e) => {
                            e.stopPropagation();
                            const result = await toggleWishlist({
                              id: productId,
                              name: productName,
                              price: product.price,
                              image: productImage
                            });
                            if (!result.success && result.error) {
                              alert(result.error);
                            }
                          }}
                          title={isInWishlist(productId) ? 'Remove from wishlist' : 'Add to wishlist'}
                        >
                          <HeartIcon filled={isInWishlist(productId)} />
                        </button>
                      </div>
                      <div className="product-item-content">
                        <span className="product-item-category">{productCategory}</span>
                        <h3 className="product-item-name">{productName}</h3>
                        <div className="product-item-footer">
                          <span className="product-item-price">{getPriceString(product.price)}</span>
                          <span className="product-item-rating">
                            {product.views ? (
                              <span className="product-stat-item">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                  <circle cx="12" cy="12" r="3"></circle>
                                </svg>
                                <span>{product.views}</span>
                              </span>
                            ) : null}
                            {product.likes ? (
                              <span className="product-stat-item">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                                </svg>
                                <span>{product.likes}</span>
                              </span>
                            ) : null}
                            {!product.views && !product.likes ? (
                              <span className="product-stat-item">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                  <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
                                </svg>
                                <span>New Arrival</span>
                              </span>
                            ) : null}
                          </span>
                        </div>
                        <button
                          className="product-item-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleChatWithArtist(product);
                          }}
                          disabled={chatLoadingId === productId}
                        >
                          {chatLoadingId === productId ? 'Opening chat...' : 'Chat with Artist'}
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Products;

