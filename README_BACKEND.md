# Firebase Backend Setup

This project uses Firebase for authentication and data storage.

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```
REACT_APP_FIREBASE_API_KEY=AIzaSyD0ax-_TFuFsoDXS70EOUYl__JvtdPJVQY
REACT_APP_FIREBASE_AUTH_DOMAIN=craft-hindustan.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=craft-hindustan
REACT_APP_FIREBASE_STORAGE_BUCKET=craft-hindustan.firebasestorage.app
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=744919678192
REACT_APP_FIREBASE_APP_ID=1:744919678192:web:e2603dfccfc9c7534e5635
REACT_APP_FIREBASE_MEASUREMENT_ID=G-JS32BQ02K4
```

## Firebase Setup

1. Make sure Firebase Authentication is enabled in your Firebase Console
2. Enable Email/Password authentication method
3. Set up Firestore Database with the following structure:
   - Collection: `users`
     - Document ID: User UID
     - Fields:
       - `email` (string)
       - `displayName` (string)
       - `createdAt` (string)
       - `wishlist` (array)

## Backend Structure

```
src/backend/
├── firebase.js      # Firebase initialization and configuration
├── auth.js          # Authentication functions (login, register, logout)
└── wishlist.js      # Wishlist operations (add, remove, get)
```

## Features

- **Email/Password Authentication**: Users can register and login with email and password
- **Password Reset**: Users can reset their password via email
- **Wishlist Sync**: User wishlists are stored in Firestore and synced across devices
- **User Profiles**: User information is stored in Firestore

## Usage

### Authentication

```javascript
import { registerUser, loginUser, logoutUser } from './backend/auth';

// Register a new user
const result = await registerUser(email, password, displayName);

// Login
const result = await loginUser(email, password);

// Logout
await logoutUser();
```

### Wishlist

```javascript
import { addToWishlist, removeFromWishlist, getUserWishlist } from './backend/wishlist';

// Add to wishlist
await addToWishlist(userId, product);

// Remove from wishlist
await removeFromWishlist(userId, productId);

// Get user wishlist
const wishlist = await getUserWishlist(userId);
```

## Security Rules

Make sure to set up Firestore security rules in Firebase Console:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

