# Travel Itinerary App - Frontend

### Dependencies

To get started with the frontend, make sure you have the following dependencies installed:

- **React**: `npx create-react-app`
- **TailwindCSS**: CSS framework for styling
- **Firebase**: For authentication
- **Axios**: For API calls
- **React Router**: For routing
- **Google Maps JavaScript API**: For Places Autocomplete

### Installation

1. **Clone the repository**:

   ```bash
   git clone https://github.com/API-Avengers/frontend.git
   cd frontend

2. **Install dependencies:**:
   ```npm install```

3. **Create .env file:**:
   - In the root of your frontend folder, create a .env file and add your API keys:
   ```bash
   REACT_APP_GOOGLE_MAPS_API_KEY=your-google-maps-api-key
   REACT_APP_FIREBASE_API_KEY=your-firebase-api-key
   REACT_APP_FIREBASE_AUTH_DOMAIN=your-firebase-auth-domain
   REACT_APP_FIREBASE_PROJECT_ID=your-firebase-project-id
   REACT_APP_FIREBASE_STORAGE_BUCKET=your-firebase-storage-bucket
   REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your-firebase-messaging-sender-id
   REACT_APP_FIREBASE_APP_ID=your-firebase-app-id
   REACT_APP_FIREBASE_MEASUREMENT_ID=your-firebase-measurement-id

4. **Run the App**:
     ```npm start```
5. **TailwindCSS Setup**:
   - Ensure TailwindCSS works by setting up the config:
     ```npx tailwindcss init```

   - Then add Tailwind directives to src/index.css:
     ```bash
     @tailwind base;
     @tailwind components;
     @tailwind utilities;

