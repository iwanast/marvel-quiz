// Import firebase functions
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.1.3/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  doc,
  deleteDoc,
  getDocs,
  setDoc,
} from "https://www.gstatic.com/firebasejs/9.1.3/firebase-firestore.js";

// Import Firebase configuration settings
const firebaseConfig = {
  apiKey: "AIzaSyBAjhZsNJ7urNqtWrUTam_f8_qiVdO3lhc",
  authDomain: "marvel-quiz-616.firebaseapp.com",
  projectId: "marvel-quiz-616",
  storageBucket: "marvel-quiz-616.appspot.com",
  messagingSenderId: "987419001414",
  appId: "1:987419001414:web:e2c1132f189ba86b040047",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);


//Create an instance of the Facebook provider object
import { FacebookAuthProvider } from "firebase/auth";

const provider = new FacebookAuthProvider();


//To sign in with a pop-up window
import { getAuth, signInWithPopup, FacebookAuthProvider } from "firebase/auth";

const auth = getAuth();
signInWithPopup(auth, provider)
  .then((result) => {
    // The signed-in user info.
    const user = result.user;

    // This gives you a Facebook Access Token. You can use it to access the Facebook API.
    const credential = FacebookAuthProvider.credentialFromResult(result);
    const accessToken = credential.accessToken;

    // ...
  })
  .catch((error) => {
    // Handle Errors here.
    const errorCode = error.code;
    const errorMessage = error.message;
    // The email of the user's account used.
    const email = error.email;
    // The AuthCredential type that was used.
    const credential = FacebookAuthProvider.credentialFromError(error);

    // ...
  });
