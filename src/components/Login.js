import React, { useState } from 'react';
import { signInWithPopup } from 'firebase/auth';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { auth, googleProvider } from '../config/firebase';
import { authAPI } from '../services/api';
import './Login.css';

const Login = ({ onClose, onSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      let result;
      if (isLogin) {
        result = await authAPI.login(email, password);
      } else {
        if (!displayName.trim()) {
          setError('Please enter your name');
          setLoading(false);
          return;
        }
        result = await authAPI.register(displayName, email, password);
      }

      if (result.success) {
        if (onSuccess) {
          onSuccess(result.user);
        }
        if (onClose) {
          onClose();
        }
      } else {
        setError(result.error || 'An error occurred');
      }
    } catch (err) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await authAPI.resetPassword(resetEmail);
      if (result.success) {
        setError('');
        alert(result.message || 'Password reset email sent! Please check your inbox.');
        setShowResetPassword(false);
        setResetEmail('');
      } else {
        setError(result.error || 'Failed to send reset email');
      }
    } catch (err) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Sign in with Google using Firebase
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      
      console.log('Firebase user:', {
        email: user.email,
        displayName: user.displayName,
        uid: user.uid
      });
      
      // Get the ID token from Firebase
      const idToken = await user.getIdToken();
      
      if (!idToken) {
        throw new Error('Failed to get ID token from Firebase');
      }
      
      const userInfo = {
        name: user.displayName || user.email?.split('@')[0] || 'User',
        email: user.email,
        photoURL: user.photoURL
      };
      
      console.log('Sending to backend:', {
        hasIdToken: !!idToken,
        userInfo: userInfo
      });
      
      // Send to backend to create/update user in MongoDB
      const backendResult = await authAPI.googleLogin(idToken, userInfo);
      
      console.log('Backend response:', backendResult);
      
      if (backendResult.success) {
        console.log('Google login successful, user:', backendResult.user);
        if (onSuccess) {
          onSuccess(backendResult.user);
        }
        if (onClose) {
          onClose();
        }
      } else {
        setError(backendResult.error || 'Google login failed');
      }
    } catch (err) {
      console.error('Google login error:', err);
      setError(err.message || 'Google login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-overlay" onClick={onClose}>
      <div className="login-modal" onClick={(e) => e.stopPropagation()}>
        <button className="login-close-btn" onClick={onClose}>×</button>
        
        {!showResetPassword ? (
          <>
            <div className="login-animation">
              <DotLottieReact
                src="https://lottie.host/3ce718dc-cc48-4a39-8e9b-f26cb0fa380a/vggDa6NPFL.lottie"
                loop
                autoplay
              />
            </div>
            <h2 className="login-title">{isLogin ? 'Login' : 'Sign Up'}</h2>
            
            <form onSubmit={handleSubmit} className="login-form">
              {!isLogin && (
                <div className="form-group">
                  <label htmlFor="displayName">Name</label>
                  <input
                    type="text"
                    id="displayName"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="Enter your name"
                    required={!isLogin}
                  />
                </div>
              )}

              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  minLength={6}
                />
              </div>

              {error && <div className="login-error">{error}</div>}

              <button type="submit" className="login-submit-btn" disabled={loading}>
                {loading ? 'Loading...' : (isLogin ? 'Login' : 'Sign Up')}
              </button>

              <div className="login-or-divider">OR</div>
              <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={loading}
                className="login-google-btn"
              >
                <svg width="18" height="18" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Continue with Google
              </button>
            </form>

            <div className="login-footer">
              {isLogin ? (
                <>
                  <p>
                    Don't have an account?{' '}
                    <button className="login-toggle-btn" onClick={() => setIsLogin(false)}>
                      Sign Up
                    </button>
                  </p>
                  <p>
                    <button className="login-toggle-btn" onClick={() => setShowResetPassword(true)}>
                      Forgot Password?
                    </button>
                  </p>
                </>
              ) : (
                <p>
                  Already have an account?{' '}
                  <button className="login-toggle-btn" onClick={() => setIsLogin(true)}>
                    Login
                  </button>
                </p>
              )}
            </div>
          </>
        ) : (
          <>
            <h2 className="login-title">Reset Password</h2>
            <form onSubmit={handleResetPassword} className="login-form">
              <div className="form-group">
                <label htmlFor="resetEmail">Email</label>
                <input
                  type="email"
                  id="resetEmail"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                />
              </div>

              {error && <div className="login-error">{error}</div>}

              <button type="submit" className="login-submit-btn" disabled={loading}>
                {loading ? 'Sending...' : 'Send Reset Email'}
              </button>
            </form>

            <div className="login-footer">
              <button className="login-toggle-btn" onClick={() => {
                setShowResetPassword(false);
                setError('');
                setResetEmail('');
              }}>
                Back to Login
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Login;

