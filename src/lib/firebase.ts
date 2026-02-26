import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics, isSupported, logEvent } from "firebase/analytics";
import { 
  getFirestore, 
  initializeFirestore, 
  persistentLocalCache,
  persistentMultipleTabManager
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "dummy-key",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "dummy-project",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase only if we have the minimum requirements or if we're in the browser
const canInitialize = typeof window !== "undefined" || !!process.env.NEXT_PUBLIC_FIREBASE_API_KEY;

let app: any;
let auth: any;
let db: any;
let analytics: any = null;

if (canInitialize) {
  app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
  auth = getAuth(app);
  
  // Restore robust Firestore initialization with persistence
  try {
    db = initializeFirestore(app, {
      localCache: persistentLocalCache({
        tabManager: persistentMultipleTabManager(), // Supports multiple tabs
      }),
      experimentalForceLongPolling: true,
    });
    console.log("Firestore initialized with Multi-Tab Persistence.");
  } catch (error) {
    console.warn("Firestore init failed, falling back:", error);
    db = getFirestore(app);
  }

  // Initialize Analytics
  if (typeof window !== "undefined") {
    isSupported().then((supported) => {
      if (supported) {
        analytics = getAnalytics(app);
        console.log("Firebase Analytics initialized.");
      }
    });
  }
} else {
  // Mock implementations for SSR/Build time
  app = {} as any;
  auth = { onAuthStateChanged: () => () => {} } as any;
  db = {} as any;
  analytics = null;
}

// Helper to track events
export const trackEvent = (eventName: string, eventParams?: Record<string, any>) => {
  if (analytics) {
    logEvent(analytics, eventName, eventParams);
  }
};

export { app, auth, db };
