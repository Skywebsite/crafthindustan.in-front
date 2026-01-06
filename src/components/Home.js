import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-19-helmet-async';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { useWishlist } from '../context/WishlistContext';
import { postAPI, brandAPI } from '../services/api';
import HeartIcon from './HeartIcon';
import ShareButton from './ShareButton';
import './Home.css';

const Home = () => {
  const { toggleWishlist, isInWishlist } = useWishlist();
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingBrands, setLoadingBrands] = useState(true);
  const [error, setError] = useState('');
  const [stats, setStats] = useState({
    totalBrands: 0,
    totalProducts: 0,
    totalArtisans: 0
  });
  const [postImageIndices, setPostImageIndices] = useState({});
  const [hoveredPostId, setHoveredPostId] = useState(null);

  // Helper function to safely get price as string
  const getPriceString = (price) => {
    if (typeof price === 'string') {
      return price;
    }
    if (typeof price === 'object' && price !== null) {
      return price.formatted || price.original || price.amount || '₹0';
    }
    return String(price || '₹0');
  };

  const featuredProducts = [
    {
      id: 1,
      name: 'Handmade Terracotta Pot',
      price: '₹899',
      category: 'Pottery & Ceramics',
      image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=300&fit=crop&q=80&auto=format&fit=crop&ixlib=rb-4.0.3&fm=webp',
      rating: 4.5
    },
    {
      id: 2,
      name: 'Traditional Silk Scarf',
      price: '₹1,299',
      category: 'Textiles & Fabrics',
      image: 'https://images.unsplash.com/photo-1586105251261-72a756497a11?w=300&h=300&fit=crop&q=80&auto=format&fit=crop&ixlib=rb-4.0.3&fm=webp',
      rating: 4.8
    },
    {
      id: 3,
      name: 'Silver Filigree Earrings',
      price: '₹2,499',
      category: 'Jewelry & Accessories',
      image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=300&h=300&fit=crop&q=80&auto=format&fit=crop&ixlib=rb-4.0.3&fm=webp',
      rating: 4.7
    },
    {
      id: 4,
      name: 'Macrame Wall Hanging',
      price: '₹1,599',
      category: 'Home Decor',
      image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=300&h=300&fit=crop&q=80&auto=format&fit=crop&ixlib=rb-4.0.3&fm=webp',
      rating: 4.6
    }
  ];

  const translations = [
    { lang: 'English', text: 'Why you choose' },
    { lang: 'Hindi', text: 'क्यों चुनें' },
    { lang: 'Bengali', text: 'কেন বেছে নিন' },
    { lang: 'Telugu', text: 'ఎందుకు ఎంచుకోవాలి' },
    { lang: 'Tamil', text: 'ஏன் தேர்வு' },
    { lang: 'Marathi', text: 'का निवडा' },
    { lang: 'Gujarati', text: 'શા માટે પસંદ કરો' },
    { lang: 'Kannada', text: 'ಏಕೆ ಆಯ್ಕೆ' },
    { lang: 'Malayalam', text: 'എന്തിനാണ്' },
    { lang: 'Punjabi', text: 'ਕਿਉਂ ਚੁਣੋ' },
    { lang: 'French', text: 'Pourquoi choisir' },
    { lang: 'Spanish', text: 'Por qué elegir' },
    { lang: 'German', text: 'Warum wählen' },
    { lang: 'Japanese', text: 'なぜ選ぶのか' },
    { lang: 'Arabic', text: 'لماذا تختار' },
    { lang: 'Russian', text: 'Почему выбирают' },
    { lang: 'Portuguese', text: 'Por que escolher' },
    { lang: 'Italian', text: 'Perché scegliere' },
    { lang: 'Korean', text: '왜 선택 하는가' },
    { lang: 'Chinese', text: '为什么选择' }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  // Fetch posts from API
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        setError('');
        console.log('Fetching posts from API...');
        const result = await postAPI.getPosts({ limit: 8 });
        console.log('Posts API result:', result);
        if (result && result.success && result.posts) {
          console.log('Posts received:', result.posts.length);
          setPosts(result.posts);
        } else {
          console.error('Invalid response format:', result);
          setError('Failed to load posts');
        }
      } catch (err) {
        console.error('Error fetching posts:', err);
        setError('Failed to load posts. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  // Fetch brands from API
  useEffect(() => {
    const fetchBrands = async () => {
      try {
        setLoadingBrands(true);
        console.log('Fetching brands from API...');
        const result = await brandAPI.getAllBrands({ limit: 4 });
        console.log('Brands API result:', result);
        if (result && result.success && result.brands) {
          console.log('Brands received:', result.brands.length);
          setBrands(result.brands);
        } else {
          console.error('Invalid brands response format:', result);
        }
      } catch (err) {
        console.error('Error fetching brands:', err);
      } finally {
        setLoadingBrands(false);
      }
    };

    fetchBrands();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % translations.length);
    }, 3000); // Delay - 3 seconds

    return () => clearInterval(interval);
  }, [translations.length]);

  // Fetch statistics for ribbon
  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch all brands to get count
        const brandsResult = await brandAPI.getAllBrands();
        const totalBrands = brandsResult?.success && brandsResult?.brands ? brandsResult.brands.length : 0;

        // Fetch all posts to get count
        const postsResult = await postAPI.getPosts();
        const totalProducts = postsResult?.success && postsResult?.posts ? postsResult.posts.length : 0;

        // Total artisans is same as brands for now
        const totalArtisans = totalBrands;

        setStats({
          totalBrands,
          totalProducts,
          totalArtisans
        });
      } catch (err) {
        console.error('Error fetching stats:', err);
      }
    };

    fetchStats();
  }, []);

  // Auto-slide effect for hovered product
  useEffect(() => {
    let interval;
    if (hoveredPostId) {
      const post = posts.find(p => p._id === hoveredPostId);
      if (post && post.images && post.images.length > 1) {
        interval = setInterval(() => {
          setPostImageIndices(prev => ({
            ...prev,
            [hoveredPostId]: ((prev[hoveredPostId] || 0) + 1) % post.images.length
          }));
        }, 1500); // Change image every 1.5 seconds on hover
      }
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [hoveredPostId, posts]);

  const AnimatedCounter = ({ end, duration = 3000, label }) => { // Increased duration for better "reading"
    const [count, setCount] = useState(0);

    useEffect(() => {
      if (!end) {
        setCount(0);
        return;
      }

      // Reset to 0 whenever end value arrives (e.g. after fetch)
      setCount(0);

      let startTime = null;
      let frameId;
      const delay = 300; // Small delay so user sees it start from 0

      const animate = (currentTime) => {
        if (!startTime) startTime = currentTime;

        const elapsedTime = currentTime - startTime;
        if (elapsedTime < delay) {
          frameId = requestAnimationFrame(animate);
          return;
        }

        const progress = Math.min((elapsedTime - delay) / duration, 1);

        // Use a smoother easeOut for a nice "reading" feel that slows down at the end
        const easeOutQuint = 1 - Math.pow(1 - progress, 5);
        const currentCount = Math.floor(easeOutQuint * end);

        setCount(currentCount);

        if (progress < 1) {
          frameId = requestAnimationFrame(animate);
        } else {
          setCount(end);
        }
      };

      frameId = requestAnimationFrame(animate);
      return () => cancelAnimationFrame(frameId);
    }, [end, duration]);

    return (
      <div className="stats-ribbon-item" id={`counter-${label}`}>
        <div className="stats-ribbon-icon">
          {label === 'brands' && (
            <svg width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 7h-4V4c0-1.1-.9-2-2-2h-4c-1.1 0-2 .9-2 2v3H4c-1.1 0-2 .9-2 2v11c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V9c0-1.1-.9-2-2-2z" />
            </svg>
          )}
          {label === 'products' && (
            <svg width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 2L3 6v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6l-3-4H6z" />
              <path d="M3 6h18" />
              <path d="M16 10a4 4 0 01-8 0" />
            </svg>
          )}
          {label === 'artisans' && (
            <svg width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
            </svg>
          )}
        </div>
        <div className="stats-ribbon-content">
          <div className="stats-ribbon-number">{count.toLocaleString()}+</div>
          <div className="stats-ribbon-label">
            {label === 'brands' && 'Brands'}
            {label === 'products' && 'Products'}
            {label === 'artisans' && 'Artisans'}
          </div>
        </div>
      </div>
    );
  };

  // Structured data for SEO
  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "Craft Hindustan",
    "description": "Platform for handmade crafts, traditional art, and artisan products from artisans across India",
    "url": "https://thecrafthindustan.in",
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "IN"
    },
    "areaServed": {
      "@type": "Country",
      "name": "India"
    },
    "priceRange": "₹",
    "currenciesAccepted": "INR"
  };

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Craft Hindustan",
    "url": "https://thecrafthindustan.in",
    "logo": "https://thecrafthindustan.in/images/Cream Simple Art and Craft Store Logo (1).png",
    "description": "A platform celebrating handmade crafts, traditional art, and artisan products from artisans across India",
    "sameAs": [
      "https://www.facebook.com/crafthindustan",
      "https://www.instagram.com/crafthindustan",
      "https://twitter.com/crafthindustan"
    ],
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+91-9876543210",
      "contactType": "customer service",
      "areaServed": "IN",
      "availableLanguage": ["en", "hi"]
    }
  };

  const webSiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Craft Hindustan",
    "url": "https://thecrafthindustan.in",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://thecrafthindustan.in/products?search={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [{
      "@type": "ListItem",
      "position": 1,
      "name": "Home",
      "item": "https://thecrafthindustan.in"
    }]
  };

  return (
    <>
      <Helmet>
        <title>Handmade Crafts in India | Buy Handmade Online | Traditional Indian Crafts | Craft Hindustan</title>
        <meta
          name="description"
          content="Discover authentic handmade crafts, traditional art, and artisan products from artisans across India. Buy directly from local craftsmen in Mumbai, Delhi, Bangalore, Hyderabad, Chennai, Kolkata, Pune, Ahmedabad, Jaipur, Surat, Lucknow, Kanpur, Nagpur, Indore, Bhopal, Visakhapatnam, Patna, Vadodara, Ghaziabad, Ludhiana, Agra, Nashik, Faridabad, Meerut, Rajkot, Varanasi, Srinagar, Amritsar, Allahabad, Ranchi, Howrah, Jabalpur, Gwalior, Coimbatore, Vijayawada, Jodhpur, Madurai, Raipur, Kota, Guwahati, Chandigarh, Solapur, Hubli, Tiruchirappalli, Bareilly, Moradabad, Mysore, Tiruppur, Gurgaon, Aligarh, Jalandhar, Bhubaneswar, Salem, Warangal, Thiruvananthapuram, Guntur, Amravati, Bikaner, Noida, Jamshedpur, Bhilai, Cuttack, Firozabad, Kochi, Nellore, Bhavnagar, Dehradun, Durgapur, Asansol, Rourkela, Nanded, Kolhapur, Ajmer, Gulbarga, Jamnagar, Ujjain, Siliguri, Jhansi, Jammu, Belgaum, Mangalore, Ambattur, Tirunelveli, Malegaon, Gaya, Jalgaon, Udaipur, Davanagere, Kozhikode, Akola, Kurnool, Bokaro, Bellary, Patiala, Agartala, Bhagalpur, Muzaffarnagar, Bhatpara, Latur, Dhule, Rohtak, Korba, Bhilwara, Berhampur, Muzaffarpur, Ahmednagar, Mathura, Kollam, Avadi, Kadapa, Sambalpur, Bilaspur, Shahjahanpur, Satara, Bijapur, Rampur, Shivamogga, Chandrapur, Junagadh, Thrissur, Alwar, Bardhaman, Kulti, Kakinada, Nizamabad, Parbhani, Tumkur, Khammam, Bihar Sharif, Panipat, Darbhanga, Aizawl, Dewas, Ichalkaranji, Karnal, Bathinda, Jalna, Eluru, Barasat, Purnia, Satna, Mau, Sonipat, Farrukhabad, Sagar, Durg, Imphal, Ratlam, Hapur, Arrah, Karimnagar, Anantapur, Etawah, Bharatpur, Begusarai, New Delhi, Gandhinagar, Barmer, Pondicherry, Sikar, Thoothukudi, Rewa, Mirzapur, Raichur, Pali, Rajahmundry, Khandwa, Yavatmal, Katihar, Sangrur, Bulandshahr, Murwara, Sambhal, Singrauli, Nadiad, Secunderabad, Naihati, Yamunanagar, Bidhan Nagar, Pallavaram, Bidar, Munger, Panchkula, Burhanpur, Kharagpur, Dindigul, Gandhidham, Hospet, Nangloi Jat, Malda, Ongole, Deoghar, Chhapra, Haldia, Nandyal, Morena, Amroha, Anand, Bhind, Madhyamgram, Bhiwani, Berhampore, Ambala, Morbi, Fatehpur, Raebareli, Chittoor, Bhusawal, Orai, Bahraich, Phusro, Vellore, Mehsana, Raiganj, Sirsa, Danapur, Serampore, Sultan Pur Majra, Guna, Jaunpur, Panvel, Shivpuri, Surendranagar Dudhrej, Unnao, Hugli-Chinsurah, Alappuzha, Kottayam, Machilipatnam, Shimla, Adoni, Tenali, Proddatur, Saharsa, Hindupur, Sasaram, Hajipur, Bhimavaram, Dehri, Madanapalle, Siwan, Bettiah, Guntakal, Srikakulam, Motihari, Dharmavaram, Gudivada, Narasaraopet, Bagalkot, Tadepalligudem, Kishanganj, Karaikudi, Suryapet, Jamalpur, Kavali, Tadipatri, Amaravati, Buxar, Jehanabad, Aurangabad, Gangawati, Vinukonda, Adilabad, Yadgir, Achalpur, Lakshmeshwar, Nalgonda, and all cities across India. Support traditional Indian craftsmanship and buy authentic handmade products online."
        />
        <meta
          name="keywords"
          content="handmade crafts India, buy handmade online India, traditional crafts India, handmade products India, Indian artisans, traditional Indian art, buy Indian crafts, Indian handmade goods, authentic Indian products, Indian craft marketplace, handmade crafts Mumbai, handmade crafts Delhi, handmade crafts Bangalore, handmade crafts Hyderabad, handmade crafts Chennai, handmade crafts Kolkata, handmade crafts Pune, handmade crafts Ahmedabad, handmade crafts Jaipur, handmade crafts Surat, handmade crafts Lucknow, handmade crafts Kanpur, handmade crafts Nagpur, handmade crafts Indore, handmade crafts Bhopal, handmade crafts Visakhapatnam, handmade crafts Patna, handmade crafts Vadodara, handmade crafts Ghaziabad, handmade crafts Ludhiana, handmade crafts Agra, handmade crafts Nashik, handmade crafts Faridabad, handmade crafts Meerut, handmade crafts Rajkot, handmade crafts Varanasi, handmade crafts Srinagar, handmade crafts Amritsar, handmade crafts Allahabad, handmade crafts Ranchi, handmade crafts Howrah, handmade crafts Jabalpur, handmade crafts Gwalior, handmade crafts Coimbatore, handmade crafts Vijayawada, handmade crafts Jodhpur, handmade crafts Madurai, handmade crafts Raipur, handmade crafts Kota, handmade crafts Guwahati, handmade crafts Chandigarh, handmade crafts Solapur, handmade crafts Hubli, handmade crafts Tiruchirappalli, handmade crafts Bareilly, handmade crafts Moradabad, handmade crafts Mysore, handmade crafts Tiruppur, handmade crafts Gurgaon, handmade crafts Aligarh, handmade crafts Jalandhar, handmade crafts Bhubaneswar, handmade crafts Salem, handmade crafts Warangal, handmade crafts Thiruvananthapuram, handmade crafts Guntur, handmade crafts Amravati, handmade crafts Bikaner, handmade crafts Noida, handmade crafts Jamshedpur, handmade crafts Bhilai, handmade crafts Cuttack, handmade crafts Firozabad, handmade crafts Kochi, handmade crafts Nellore, handmade crafts Bhavnagar, handmade crafts Dehradun, handmade crafts Durgapur, handmade crafts Asansol, handmade crafts Rourkela, handmade crafts Nanded, handmade crafts Kolhapur, handmade crafts Ajmer, handmade crafts Gulbarga, handmade crafts Jamnagar, handmade crafts Ujjain, handmade crafts Siliguri, handmade crafts Jhansi, handmade crafts Jammu, handmade crafts Belgaum, handmade crafts Mangalore, handmade crafts Ambattur, handmade crafts Tirunelveli, handmade crafts Malegaon, handmade crafts Gaya, handmade crafts Jalgaon, handmade crafts Udaipur, handmade crafts Davanagere, handmade crafts Kozhikode, handmade crafts Akola, handmade crafts Kurnool, handmade crafts Bokaro, handmade crafts Bellary, handmade crafts Patiala, handmade crafts Agartala, handmade crafts Bhagalpur, handmade crafts Muzaffarnagar, handmade crafts Bhatpara, handmade crafts Latur, handmade crafts Dhule, handmade crafts Rohtak, handmade crafts Korba, handmade crafts Bhilwara, handmade crafts Berhampur, handmade crafts Muzaffarpur, handmade crafts Ahmednagar, handmade crafts Mathura, handmade crafts Kollam, handmade crafts Avadi, handmade crafts Kadapa, handmade crafts Sambalpur, handmade crafts Bilaspur, handmade crafts Shahjahanpur, handmade crafts Satara, handmade crafts Bijapur, handmade crafts Rampur, handmade crafts Shivamogga, handmade crafts Chandrapur, handmade crafts Junagadh, handmade crafts Thrissur, handmade crafts Alwar, handmade crafts Bardhaman, handmade crafts Kulti, handmade crafts Kakinada, handmade crafts Nizamabad, handmade crafts Parbhani, handmade crafts Tumkur, handmade crafts Khammam, handmade crafts Bihar Sharif, handmade crafts Panipat, handmade crafts Darbhanga, handmade crafts Aizawl, handmade crafts Dewas, handmade crafts Ichalkaranji, handmade crafts Karnal, handmade crafts Bathinda, handmade crafts Jalna, handmade crafts Eluru, handmade crafts Barasat, handmade crafts Purnia, handmade crafts Satna, handmade crafts Mau, handmade crafts Sonipat, handmade crafts Farrukhabad, handmade crafts Sagar, handmade crafts Durg, handmade crafts Imphal, handmade crafts Ratlam, handmade crafts Hapur, handmade crafts Arrah, handmade crafts Karimnagar, handmade crafts Anantapur, handmade crafts Etawah, handmade crafts Bharatpur, handmade crafts Begusarai, handmade crafts New Delhi, handmade crafts Gandhinagar, handmade crafts Barmer, handmade crafts Pondicherry, handmade crafts Sikar, handmade crafts Thoothukudi, handmade crafts Rewa, handmade crafts Mirzapur, handmade crafts Raichur, handmade crafts Pali, handmade crafts Rajahmundry, handmade crafts Khandwa, handmade crafts Yavatmal, handmade crafts Katihar, handmade crafts Sangrur, handmade crafts Bulandshahr, handmade crafts Murwara, handmade crafts Sambhal, handmade crafts Singrauli, handmade crafts Nadiad, handmade crafts Secunderabad, handmade crafts Naihati, handmade crafts Yamunanagar, handmade crafts Bidhan Nagar, handmade crafts Pallavaram, handmade crafts Bidar, handmade crafts Munger, handmade crafts Panchkula, handmade crafts Burhanpur, handmade crafts Kharagpur, handmade crafts Dindigul, handmade crafts Gandhidham, handmade crafts Hospet, handmade crafts Nangloi Jat, handmade crafts Malda, handmade crafts Ongole, handmade crafts Deoghar, handmade crafts Chhapra, handmade crafts Haldia, handmade crafts Nandyal, handmade crafts Morena, handmade crafts Amroha, handmade crafts Anand, handmade crafts Bhind, handmade crafts Madhyamgram, handmade crafts Bhiwani, handmade crafts Berhampore, handmade crafts Ambala, handmade crafts Morbi, handmade crafts Fatehpur, handmade crafts Raebareli, handmade crafts Chittoor, handmade crafts Bhusawal, handmade crafts Orai, handmade crafts Bahraich, handmade crafts Phusro, handmade crafts Vellore, handmade crafts Mehsana, handmade crafts Raiganj, handmade crafts Sirsa, handmade crafts Danapur, handmade crafts Serampore, handmade crafts Sultan Pur Majra, handmade crafts Guna, handmade crafts Jaunpur, handmade crafts Panvel, handmade crafts Shivpuri, handmade crafts Surendranagar Dudhrej, handmade crafts Unnao, handmade crafts Hugli-Chinsurah, handmade crafts Alappuzha, handmade crafts Kottayam, handmade crafts Machilipatnam, handmade crafts Shimla, handmade crafts Adoni, handmade crafts Tenali, handmade crafts Proddatur, handmade crafts Saharsa, handmade crafts Hindupur, handmade crafts Sasaram, handmade crafts Hajipur, handmade crafts Bhimavaram, handmade crafts Dehri, handmade crafts Madanapalle, handmade crafts Siwan, handmade crafts Bettiah, handmade crafts Guntakal, handmade crafts Srikakulam, handmade crafts Motihari, handmade crafts Dharmavaram, handmade crafts Gudivada, handmade crafts Narasaraopet, handmade crafts Bagalkot, handmade crafts Tadepalligudem, handmade crafts Kishanganj, handmade crafts Karaikudi, handmade crafts Suryapet, handmade crafts Jamalpur, handmade crafts Kavali, handmade crafts Tadipatri, handmade crafts Amaravati, handmade crafts Buxar, handmade crafts Jehanabad, handmade crafts Aurangabad, handmade crafts Gangawati, handmade crafts Vinukonda, handmade crafts Adilabad, handmade crafts Yadgir, handmade crafts Achalpur, handmade crafts Lakshmeshwar, handmade crafts Nalgonda, craft hindustan, buy handmade online, support local artisans, traditional Indian crafts"
        />
        <meta name="author" content="Craft Hindustan" />
        <meta name="robots" content="index, follow" />
        <meta name="language" content="English" />
        <meta name="revisit-after" content="7 days" />
        <meta name="geo.region" content="IN" />
        <meta name="geo.placename" content="India" />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://thecrafthindustan.in/" />
        <meta property="og:title" content="Handmade Crafts in India | Buy Handmade Online | Craft Hindustan" />
        <meta
          property="og:description"
          content="Discover authentic handmade crafts, traditional art, and artisan products from artisans across India. Buy directly from local craftsmen in all major cities."
        />
        <meta property="og:image" content="%PUBLIC_URL%/images/Cream Simple Art and Craft Store Logo (1).png" />
        <meta property="og:locale" content="en_IN" />
        <meta property="og:site_name" content="Craft Hindustan" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content="https://thecrafthindustan.in/" />
        <meta name="twitter:title" content="Handmade Crafts in India | Craft Hindustan" />
        <meta
          name="twitter:description"
          content="Discover authentic handmade crafts, traditional art, and artisan products from artisans across India. Buy directly from local craftsmen in all major cities."
        />
        <meta name="twitter:image" content="%PUBLIC_URL%/images/Cream Simple Art and Craft Store Logo (1).png" />

        {/* Canonical URL */}
        <link rel="canonical" href="https://thecrafthindustan.in/" />

        {/* Additional SEO Tags */}
        <meta name="theme-color" content="#8B4513" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Craft Hindustan" />

        {/* Structured Data for Local Business */}
        <script type="application/ld+json">
          {JSON.stringify(localBusinessSchema)}
        </script>

        {/* Structured Data for Organization */}
        <script type="application/ld+json">
          {JSON.stringify(organizationSchema)}
        </script>

        {/* Structured Data for WebSite */}
        <script type="application/ld+json">
          {JSON.stringify(webSiteSchema)}
        </script>

        {/* Structured Data for Breadcrumb */}
        <script type="application/ld+json">
          {JSON.stringify(breadcrumbSchema)}
        </script>
      </Helmet>

      <div className="home-container">
        <div className="home-content">
          <div className="home-left">
            <div className="home-text-content">
              <h1 className="home-title">
                <span className="rotating-text-wrapper">
                  <span className="rotating-text">{translations[currentIndex].text}</span>
                </span>
                <span className="static-text"> craft hindustan</span>
              </h1>
              <p className="home-description">
                We are a lovingly crafted platform built to celebrate the true art of handmade creations. Every product you find here is shaped with care, patience, and soul by talented artisans who believe in the magic of human touch. These are not just items they are stories, emotions, and traditions passed down through hands that create with love.
              </p>
              <p className="home-description">
                Our mission is to uplift creators from every corner, giving them a space where their creativity can shine and reach people who truly appreciate authenticity. We aim to connect hearts  the heart of the maker and the heart of the buyer  through unique, meaningful pieces that bring joy, warmth, and inspiration into everyday life.
              </p>
            </div>
          </div>
          <div className="home-right">
            <DotLottieReact
              src="https://lottie.host/4f407e17-ba92-4737-b191-91f0e2b72f02/2OMd3PASUs.lottie"
              loop
              autoplay
              className="lottie-animation-hero"
            />
          </div>
        </div>

        {/* Statistics Ribbon Section */}
        <div className="stats-ribbon-section">
          <div className="stats-ribbon-container">
            <div className="stats-banner-intro">
              <h2 className="stats-banner-title">Our Growing Community</h2>
              <p className="stats-banner-subtitle">Celebrating the spirit of handmade art across India</p>
            </div>
            <div className="stats-grid">
              <AnimatedCounter end={stats.totalBrands} label="brands" />
              <AnimatedCounter end={stats.totalProducts} label="products" />
              <AnimatedCounter end={stats.totalArtisans} label="artisans" />
            </div>
          </div>
        </div>

        {/* Featured Products Section */}
        <div className="featured-products-section">
          <div className="featured-products-container">
            <h2 className="featured-products-title">Top Crafts</h2>
            {loading ? (
              <div style={{ textAlign: 'center', padding: '40px' }}>
                <p>Loading crafts...</p>
              </div>
            ) : error ? (
              <div style={{ textAlign: 'center', padding: '40px', color: 'red' }}>
                <p>{error}</p>
              </div>
            ) : posts.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px' }}>
                <p>No crafts available yet. Be the first to post one!</p>
              </div>
            ) : (
              <div className="featured-products-grid">
                {posts.map((post) => {
                  const currentIndex = postImageIndices[post._id] || 0;
                  const images = post.images || [];
                  const hasMultipleImages = images.length > 1;

                  const nextImage = (e) => {
                    e.stopPropagation();
                    setPostImageIndices(prev => ({
                      ...prev,
                      [post._id]: (currentIndex + 1) % images.length
                    }));
                  };

                  const prevImage = (e) => {
                    e.stopPropagation();
                    setPostImageIndices(prev => ({
                      ...prev,
                      [post._id]: (currentIndex - 1 + images.length) % images.length
                    }));
                  };

                  const goToImage = (e, idx) => {
                    e.stopPropagation();
                    setPostImageIndices(prev => ({
                      ...prev,
                      [post._id]: idx
                    }));
                  };

                  return (
                    <div
                      key={post._id}
                      className="featured-product-card"
                      onClick={() => navigate(`/post/${post._id}`)}
                      onMouseEnter={() => setHoveredPostId(post._id)}
                      onMouseLeave={() => setHoveredPostId(null)}
                    >
                      <div className="featured-product-image">
                        <img
                          src={images.length > 0 ? images[currentIndex] : 'https://via.placeholder.com/300'}
                          alt={post.title}
                        />
                        {hasMultipleImages && (
                          <>
                            <button
                              className="image-carousel-btn image-carousel-prev"
                              onClick={prevImage}
                              aria-label="Previous image"
                            >
                              ‹
                            </button>
                            <button
                              className="image-carousel-btn image-carousel-next"
                              onClick={nextImage}
                              aria-label="Next image"
                            >
                              ›
                            </button>
                            <div className="image-carousel-dots">
                              {images.map((_, idx) => (
                                <span
                                  key={idx}
                                  className={`carousel-dot ${currentIndex === idx ? 'active' : ''}`}
                                  onClick={(e) => goToImage(e, idx)}
                                />
                              ))}
                            </div>
                          </>
                        )}
                      </div>
                      <div className="featured-product-overlay"></div>
                      <div className="featured-product-actions">
                        <ShareButton
                          url={`${window.location.origin}/post/${post._id}`}
                          title={post.title}
                          description={post.description}
                          image={post.images?.[0]}
                          className="featured-share-btn"
                        />
                        <button
                          className={`featured-wishlist-icon-btn ${isInWishlist(post._id) ? 'wishlist-icon-btn-active' : ''}`}
                          onClick={async (e) => {
                            e.stopPropagation();
                            const result = await toggleWishlist({
                              id: post._id,
                              name: post.title,
                              price: post.price,
                              image: post.images?.[0]
                            });
                            if (!result.success && result.error) {
                              alert(result.error);
                            }
                          }}
                          title={isInWishlist(post._id) ? 'Remove from wishlist' : 'Add to wishlist'}
                        >
                          <HeartIcon filled={isInWishlist(post._id)} />
                        </button>
                      </div>
                      <div className="featured-product-content">
                        <span className="featured-product-category">{post.category}</span>
                        <h3 className="featured-product-name">{post.title}</h3>
                        <div className="featured-product-footer">
                          <span className="featured-product-price">₹{post.price}</span>
                          {post.author && (
                            <span className="featured-product-rating">by {post.author.name || post.authorName}</span>
                          )}
                        </div>
                        <button
                          className="featured-product-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/post/${post._id}`);
                          }}
                        >
                          View Details
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Artists Brands Section */}
        <div className="artists-brands-section">
          <div className="artists-brands-container">
            <h2 className="artists-brands-title">Artists Brands</h2>
            {loadingBrands ? (
              <div style={{ textAlign: 'center', padding: '40px' }}>
                <p>Loading brands...</p>
              </div>
            ) : brands.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px' }}>
                <p>No brands available yet.</p>
              </div>
            ) : (
              <div className="artists-brands-grid">
                {brands.map((brand) => (
                  <div
                    key={brand._id}
                    className="artist-brand-card"
                    onClick={() => navigate(`/brand/${brand._id}`)}
                  >
                    <div className="artist-brand-image">
                      {brand.picture ? (
                        <img src={brand.picture} alt={brand.name} />
                      ) : (
                        <div style={{
                          width: '100%',
                          height: '100%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          backgroundColor: '#f5f5f5'
                        }}>
                          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M20 7h-4V4c0-1.1-.9-2-2-2h-4c-1.1 0-2 .9-2 2v3H4c-1.1 0-2 .9-2 2v11c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V9c0-1.1-.9-2-2-2z" />
                          </svg>
                        </div>
                      )}
                      <div className="artist-brand-overlay"></div>
                      <ShareButton
                        url={`${window.location.origin}/brand/${brand._id}`}
                        title={`${brand.name} - Handmade Craft Brand`}
                        description={brand.bio}
                        image={brand.picture}
                        className="artist-brand-share-btn"
                      />
                    </div>
                    <div className="artist-brand-content">
                      <h3 className="artist-brand-name">{brand.name}</h3>
                      <p className="artist-brand-description">
                        {brand.bio && brand.bio.length > 120
                          ? brand.bio.substring(0, 120) + '...'
                          : brand.bio || 'No description available'}
                      </p>
                      <div className="artist-brand-footer">
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                          {brand.establishedYear && (
                            <span className="artist-brand-products">
                              Est. {brand.establishedYear}
                            </span>
                          )}
                          <span style={{ fontSize: '0.85rem', color: '#999' }}>
                            {brand.postCount || 0} {brand.postCount === 1 ? 'product' : 'products'}
                          </span>
                        </div>
                        <button
                          className="artist-brand-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/brand/${brand._id}`);
                          }}
                        >
                          View Brand
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Why Choose Us Section */}
        <div className="why-choose-us-section" id="why-choose-us">
          <div className="why-choose-us-container">
            <h2 className="why-choose-us-title">Why Choose Craft Hindustan?</h2>
            <div className="features-grid">
              <div className="feature-card">
                <div className="feature-icon">
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                  </svg>
                </div>
                <h3>Authentic Craftsmanship</h3>
                <p>Every piece is handcrafted with traditional techniques passed down through generations.</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                  </svg>
                </div>
                <h3>Direct Connection</h3>
                <p>Chat directly with artisans to customize your orders and understand the story behind each creation.</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="2" y1="12" x2="22" y2="12" />
                    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                  </svg>
                </div>
                <h3>International Reach</h3>
                <p>We deliver unique Indian heritage to enthusiasts across the globe with reliable international shipping.</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
                    <line x1="4" y1="22" x2="4" y2="15" />
                  </svg>
                </div>
                <h3>International Languages</h3>
                <p>Experience our platform in multiple international languages, making Indian art accessible to everyone.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;

