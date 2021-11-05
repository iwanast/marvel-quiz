// Import the functions you need from the SDKs you need 
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.1.3/firebase-app.js";
import {
  getFirestore,
  doc,
  setDoc,
} from "https://www.gstatic.com/firebasejs/9.1.3/firebase-firestore.js";

// Imported Firebase configuration settings
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


// Insert this button into html to run the loop function
// <button id="loop-button">Run Loop Function</button>

//Run a loop to insert multiple documents into Firebase at once
// document.getElementById("loop-button").addEventListener("click", firebaseLoop);

async function firebaseLoop() {
  for (let i = 1; i <= 45; i++){

    let id = "";
    let image = "";
    let question = "Placeholder question text";
    let related = "Placeholder";
    let answers = [
      "Answer 1",
      "Answer 2",
      "Answer 3",
      "Answer 4"
    ];

    if (i.toString().length == 1) {
      id = "hq00" + i;
      image = "./images/hq00" + i; 
    } else if (i.toString().length == 2) {
      id = "hq0" + i;
      image = "./images/hq0" + i; 
    } else if (i.toString().length == 3) {
      id = "hq" + i;
      image = "./images/hq" + i; 
    }

    await setDoc(doc(db, "INSERTDB", id), {
      question: question,
      image: image,
      related: related,
      answers: answers
    });
  }
}