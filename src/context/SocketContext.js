import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { io } from 'socket.io-client';
import { API_BASE_URL } from '../services/api';
import { useWishlist } from './WishlistContext';

const SocketContext = createContext({
  socket: null,
  isConnected: false
});

export const SocketProvider = ({ children }) => {
  const { isLoggedIn } = useWishlist();
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!isLoggedIn || !token) {
      setSocket((existingSocket) => {
        if (existingSocket) {
          existingSocket.disconnect();
        }
        return null;
      });
      setIsConnected(false);
      return;
    }

    const socketUrl = API_BASE_URL.replace(/\/api$/, '');
    const newSocket = io(socketUrl, {
      transports: ['websocket', 'polling'],
      auth: { token },
      autoConnect: true,
      reconnectionAttempts: 5
    });

    setSocket(newSocket);

    const handleConnect = () => setIsConnected(true);
    const handleDisconnect = () => setIsConnected(false);

    newSocket.on('connect', handleConnect);
    newSocket.on('disconnect', handleDisconnect);

    return () => {
      newSocket.off('connect', handleConnect);
      newSocket.off('disconnect', handleDisconnect);
      newSocket.disconnect();
    };
  }, [isLoggedIn]);

  const value = useMemo(
    () => ({
      socket,
      isConnected
    }),
    [socket, isConnected]
  );

  return <SocketContext.Provider value={value}>{children}</SocketContext.Provider>;
};

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};


