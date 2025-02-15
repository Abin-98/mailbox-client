import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBI9g18LwCfyjAleWIYwQgyRtd9K7XVgkc",
  authDomain: "mailbox-client-a6c40.firebaseapp.com",
  projectId: "mailbox-client-a6c40",
  storageBucket: "mailbox-client-a6c40.firebasestorage.app",
  messagingSenderId: "680338305760",
  appId: "1:680338305760:web:4cc695bc34b200d78c5685"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth(app)
const provider = new GoogleAuthProvider()
export {auth, provider}