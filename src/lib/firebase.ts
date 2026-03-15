import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// Analytics is optional; it sometimes causes issues with SSR in Next.js, 
// so we usually check if we are in the browser first.
import { getAnalytics, isSupported } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyC6NuvMOx2XsqbbBwrXj_vSMbS7NolqJA0",
  authDomain: "hc-workout-planner.firebaseapp.com",
  projectId: "hc-workout-planner",
  storageBucket: "hc-workout-planner.firebasestorage.app",
  messagingSenderId: "297599421316",
  appId: "1:297599421316:web:e595cc248129b8f325ebd1",
  measurementId: "G-VSBQDQ95ZE"
};

// Initialize Firebase (singleton pattern for Next.js)
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Initialize Auth and Export it
export const auth = getAuth(app);

// Initialize Analytics only in the browser
if (typeof window !== "undefined") {
  isSupported().then((supported) => {
    if (supported) getAnalytics(app);
  });
}