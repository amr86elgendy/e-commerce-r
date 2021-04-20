import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCPoYQ7Mrik26GorV8nTDuowFBQAGctEUk",
  authDomain: "e-commerce-a748f.firebaseapp.com",
  projectId: "e-commerce-a748f",
  storageBucket: "e-commerce-a748f.appspot.com",
  messagingSenderId: "841559051027",
  appId: "1:841559051027:web:66eab206016ee7698de8e6"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Export
export const auth = firebase.auth();
export const googleAuthProvider = new firebase.auth.GoogleAuthProvider();
