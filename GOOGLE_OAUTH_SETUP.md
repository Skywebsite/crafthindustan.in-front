# Google OAuth Setup Guide

## Step 1: Create Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the **Google+ API**:
   - Go to "APIs & Services" > "Library"
   - Search for "Google+ API"
   - Click "Enable"

## Step 2: Create OAuth 2.0 Client ID

1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "OAuth client ID"
3. If prompted, configure the OAuth consent screen:
   - User Type: External (for testing) or Internal (for organization)
   - Fill in the required information
   - Add your email to test users if using External type
4. Create OAuth Client ID:
   - Application type: **Web application**
   - Name: Craft Hindustan (or any name)
   - **Authorized JavaScript origins:**
     - `http://localhost:3000` (for development)
     - Add your production URL when deploying
   - **Authorized redirect URIs:**
     - `http://localhost:3000` (for development)
     - Add your production URL when deploying
5. Click "Create"
6. **Copy the Client ID** (it looks like: `123456789-abcdefghijklmnop.apps.googleusercontent.com`)

## Step 3: Configure Environment Variables

### Frontend (client/.env)
Add your Google Client ID:
```env
REACT_APP_GOOGLE_CLIENT_ID=your-client-id-here
REACT_APP_API_URL=http://localhost:5000/api
```

### Backend (backend-server/.env)
Add the same Google Client ID:
```env
GOOGLE_CLIENT_ID=your-client-id-here
```

## Step 4: Restart Your Servers

After updating the `.env` files:
1. Stop your frontend server (Ctrl+C)
2. Stop your backend server (Ctrl+C)
3. Restart both servers:
   ```bash
   # Frontend
   cd client
   npm start
   
   # Backend
   cd backend-server
   npm start
   ```

## Troubleshooting

- **Error: Missing required parameter: client_id**
  - Make sure `REACT_APP_GOOGLE_CLIENT_ID` is set in `client/.env`
  - Restart the frontend server after adding the variable
  - Make sure the variable name starts with `REACT_APP_`

- **Error: redirect_uri_mismatch**
  - Make sure `http://localhost:3000` is added to Authorized redirect URIs in Google Cloud Console
  - Check that your frontend is running on port 3000

- **Error: invalid_client**
  - Verify the Client ID is correct
  - Make sure you copied the entire Client ID without extra spaces

## Quick Test

Once configured, the Google login button should work without errors. Click "Sign in with Google" and you should see the Google sign-in popup.

