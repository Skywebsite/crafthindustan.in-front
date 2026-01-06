import React, { useState, useEffect, useRef } from 'react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import './Chatbot.css';

const Chatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { text: "Namaste! 🙏 Welcome to Craft Hindustan. How can I help you today?", isUser: false }
    ]);
    const [inputValue, setInputValue] = useState('');
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = (e) => {
        e.preventDefault();
        if (!inputValue.trim()) return;

        const userMsg = inputValue.trim();
        setMessages(prev => [...prev, { text: userMsg, isUser: true }]);
        setInputValue('');

        // Simple Keyword Based Logic
        setTimeout(() => {
            const response = getBotResponse(userMsg.toLowerCase());
            setMessages(prev => [...prev, { text: response, isUser: false }]);
        }, 600);
    };

    const getBotResponse = (input) => {
        if (input.includes('hi') || input.includes('hello') || input.includes('hey')) {
            return "Hello there! Looking for some beautiful handmade crafts today?";
        }
        if (input.includes('product') || input.includes('item') || input.includes('browse')) {
            return "You can explore our curated collection of handmade items in the 'Products' section. We have everything from pottery to textiles!";
        }
        if (input.includes('brand') || input.includes('artisan') || input.includes('seller')) {
            return "Our 'Brands' page features talented artisans from all over India. You can see their stories and all their creations there.";
        }
        if (input.includes('sell') || input.includes('post') || input.includes('account')) {
            return "To start selling, simply Login/Register, then go to your dashboard to create your Brand and start Posting products!";
        }
        if (input.includes('contact') || input.includes('email') || input.includes('help') || input.includes('support')) {
            return "You can reach our support team at offical@thecrafthindustan.in. We're always happy to help!";
        }
        if (input.includes('price') || input.includes('cost')) {
            return "Prices vary by product as they are uniquely handcrafted. Check individual product pages for details!";
        }
        if (input.includes('event')) {
            return "We showcase many craft workshops and cultural events. Visit our 'Events' page to stay updated!";
        }
        if (input.includes('location') || input.includes('where')) {
            return "We are based in Hyderabad, Telangana, but we promote artisans from every corner of India!";
        }

        return "I'm still learning! You can ask me about 'products', 'brands', 'selling', or how to 'contact' us.";
    };

    return (
        <div className={`chatbot-wrapper ${isOpen ? 'active' : ''}`}>
            {/* Chat Window */}
            {isOpen && (
                <div className="chat-window">
                    <div className="chat-header">
                        <div className="header-info">
                            <div className="bot-avatar-small">
                                <DotLottieReact
                                    src="https://lottie.host/66820d8d-1f3c-4a45-a1fa-4bd93e53a3e6/sjq97NlXkQ.lottie"
                                    loop
                                    autoplay
                                />
                            </div>
                            <div>
                                <h3>Craft Assistant</h3>
                                <p>Online</p>
                            </div>
                        </div>
                        <button className="close-chat" onClick={() => setIsOpen(false)}>×</button>
                    </div>

                    <div className="chat-messages">
                        {messages.map((msg, idx) => (
                            <div key={idx} className={`message-bubble ${msg.isUser ? 'user' : 'bot'}`}>
                                {msg.text}
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </div>

                    <form className="chat-input" onSubmit={handleSend}>
                        <input
                            type="text"
                            placeholder="Type keywords like 'products'..."
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                        />
                        <button type="submit" aria-label="Send">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <line x1="22" y1="2" x2="11" y2="13"></line>
                                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                            </svg>
                        </button>
                    </form>
                </div>
            )}

            {/* Floating Toggle Button */}
            <button
                className={`chat-toggle-btn ${isOpen ? 'hidden' : ''}`}
                onClick={() => setIsOpen(!isOpen)}
                aria-label="Open Chat"
            >
                <DotLottieReact
                    src="https://lottie.host/66820d8d-1f3c-4a45-a1fa-4bd93e53a3e6/sjq97NlXkQ.lottie"
                    loop
                    autoplay
                />
            </button>
        </div>
    );
};

export default Chatbot;
