import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWishlist } from '../context/WishlistContext';
import { postAPI, chatAPI } from '../services/api';
import './Dashboard.css';

const Dashboard = () => {
    const { isLoggedIn, user } = useWishlist();
    const navigate = useNavigate();

    const [posts, setPosts] = useState([]);
    const [conversations, setConversations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [stats, setStats] = useState({
        totalViews: 0,
        totalSales: 0,
        activeChats: 0,
        totalItems: 0
    });

    useEffect(() => {
        if (!isLoggedIn) {
            navigate('/');
            return;
        }

        const fetchDashboardData = async () => {
            try {
                setLoading(true);
                const [postsResult, chatResult] = await Promise.all([
                    postAPI.getMyPosts(),
                    chatAPI.getConversations()
                ]);

                if (postsResult.success && postsResult.posts) {
                    const myPosts = postsResult.posts;
                    setPosts(myPosts);

                    // Calculate stats
                    const views = myPosts.reduce((acc, post) => acc + (post.views || 0), 0);
                    const quantity = myPosts.reduce((acc, post) => acc + (post.quantity || 0), 0);

                    setStats(prev => ({
                        ...prev,
                        totalViews: views,
                        totalItems: quantity,
                        totalSales: myPosts.reduce((acc, post) => acc + (post.sales || 0), 0) // Assuming sales exists or fallback
                    }));
                }

                if (chatResult.success && chatResult.conversations) {
                    setConversations(chatResult.conversations);
                    setStats(prev => ({
                        ...prev,
                        activeChats: chatResult.conversations.length
                    }));
                }

            } catch (err) {
                console.error('Error fetching dashboard data:', err);
                setError('Failed to load dashboard data. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, [isLoggedIn, navigate]);

    const handleUpdateQuantity = async (postId, newQuantity) => {
        if (newQuantity < 0) return;

        try {
            const result = await postAPI.updatePost(postId, { quantity: newQuantity });
            if (result.success) {
                setPosts(posts.map(post =>
                    post._id === postId ? { ...post, quantity: newQuantity } : post
                ));

                // Update total items stat
                const newTotalItems = posts.reduce((acc, post) => {
                    if (post._id === postId) return acc + newQuantity;
                    return acc + (post.quantity || 0);
                }, 0);

                setStats(prev => ({ ...prev, totalItems: newTotalItems }));
            }
        } catch (err) {
            console.error('Error updating quantity:', err);
            alert('Failed to update quantity');
        }
    };

    if (!isLoggedIn) return null;

    return (
        <div className="dashboard-container">
            <div className="dashboard-content">
                <header className="dashboard-header">
                    <div className="header-info">
                        <h1>Artisan Dashboard</h1>
                        <p>Welcome back, {user?.name || 'Artist'}. Here's how your crafts are doing.</p>
                    </div>
                    <button className="create-btn" onClick={() => navigate('/post')}>
                        + Post New Craft
                    </button>
                </header>

                {loading ? (
                    <div className="dashboard-loader">
                        <div className="spinner"></div>
                        <p>Gathering your insights...</p>
                    </div>
                ) : error ? (
                    <div className="dashboard-error">
                        <p>{error}</p>
                    </div>
                ) : (
                    <>
                        <div className="stats-grid">
                            <div className="stat-card">
                                <div className="stat-icon views">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                        <circle cx="12" cy="12" r="3" />
                                    </svg>
                                </div>
                                <div className="stat-data">
                                    <h3>{stats.totalViews.toLocaleString()}</h3>
                                    <p>Total Views</p>
                                </div>
                            </div>

                            <div className="stat-card">
                                <div className="stat-icon sales">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
                                        <line x1="3" y1="6" x2="21" y2="6" />
                                        <path d="M16 10a4 4 0 0 1-8 0" />
                                    </svg>
                                </div>
                                <div className="stat-data">
                                    <h3>{stats.totalSales.toLocaleString()}</h3>
                                    <p>Total Sales</p>
                                </div>
                            </div>

                            <div className="stat-card">
                                <div className="stat-icon chats">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                                    </svg>
                                </div>
                                <div className="stat-data">
                                    <h3>{stats.activeChats.toLocaleString()}</h3>
                                    <p>Active Chats</p>
                                </div>
                            </div>

                            <div className="stat-card">
                                <div className="stat-icon items">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M21 8l-9-4-9 4v8l9 4 9-4V8z" />
                                        <path d="M3 8l9 4 9-4" />
                                        <path d="M12 12v8" />
                                    </svg>
                                </div>
                                <div className="stat-data">
                                    <h3>{stats.totalItems.toLocaleString()}</h3>
                                    <p>Items in Stock</p>
                                </div>
                            </div>
                        </div>

                        <div className="dashboard-main-grid">
                            <section className="inventory-section">
                                <div className="section-header">
                                    <h2>Inventory Management</h2>
                                    <p>Update stock levels for your active listings</p>
                                </div>
                                {posts.length === 0 ? (
                                    <div className="empty-state">
                                        <p>No crafts posted yet. Start by sharing your first creation!</p>
                                    </div>
                                ) : (
                                    <div className="inventory-list">
                                        {posts.map(post => (
                                            <div key={post._id} className="inventory-item">
                                                <div className="item-info">
                                                    <img src={post.images?.[0] || 'https://via.placeholder.com/80'} alt={post.title} />
                                                    <div>
                                                        <h4>{post.title}</h4>
                                                        <p className="item-category">{post.category}</p>
                                                        <p className="item-price">₹{post.price}</p>
                                                    </div>
                                                </div>
                                                <div className="item-quantity-control">
                                                    <label>In Stock:</label>
                                                    <div className="quantity-input">
                                                        <button onClick={() => handleUpdateQuantity(post._id, (post.quantity || 0) - 1)}>−</button>
                                                        <input
                                                            type="number"
                                                            value={post.quantity || 0}
                                                            onChange={(e) => handleUpdateQuantity(post._id, parseInt(e.target.value) || 0)}
                                                        />
                                                        <button onClick={() => handleUpdateQuantity(post._id, (post.quantity || 0) + 1)}>+</button>
                                                    </div>
                                                </div>
                                                <div className="item-stats">
                                                    <div className="mini-stat">
                                                        <span>{post.views || 0}</span>
                                                        <small>Views</small>
                                                    </div>
                                                    <button className="manage-btn" onClick={() => navigate(`/post/${post._id}`)}>Edit</button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </section>

                            <aside className="recent-chats-sidebar">
                                <div className="section-header">
                                    <h2>Recent Inquiries</h2>
                                    <button className="view-all-link" onClick={() => navigate('/chat')}>View All</button>
                                </div>
                                {conversations.length === 0 ? (
                                    <div className="empty-state mini">
                                        <p>No messages yet.</p>
                                    </div>
                                ) : (
                                    <div className="recent-chats-list">
                                        {conversations.slice(0, 5).map(conv => {
                                            const partner = conv.participants.find(p => (p._id || p.id || p).toString() !== user?._id?.toString());
                                            return (
                                                <div key={conv._id} className="mini-chat-card" onClick={() => navigate(`/chat/${conv._id}`)}>
                                                    <div className="partner-avatar">
                                                        {partner?.name?.[0].toUpperCase() || 'U'}
                                                    </div>
                                                    <div className="chat-preview">
                                                        <span className="partner-name">{partner?.name || 'Interested Buyer'}</span>
                                                        <p className="last-msg">{conv.lastMessage?.content || 'Started a conversation'}</p>
                                                    </div>
                                                    <span className="chat-time">
                                                        {new Date(conv.updatedAt || conv.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                                                    </span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </aside>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
