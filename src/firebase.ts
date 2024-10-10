// src/firebase.ts
import { initializeApp } from "firebase/app";
import { getAnalytics, Analytics } from "firebase/analytics";

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA6TZchHNGn7Y3fy_LNANRnkNu0Col7g6A",
  authDomain: "spacex-launch-explorer.firebaseapp.com",
  projectId: "spacex-launch-explorer",
  storageBucket: "spacex-launch-explorer.appspot.com",
  messagingSenderId: "838056036385",
  appId: "1:838056036385:web:2b70a66a5fcc42436c7b60",
  measurementId: "G-T3KWV67SRF"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Analytics and get a reference to the service
const analytics: Analytics = getAnalytics(app);

export { analytics };
