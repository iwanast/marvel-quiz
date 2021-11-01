// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.1.3/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  doc,
  deleteDoc,
  getDocs,
} from "https://www.gstatic.com/firebasejs/9.1.3/firebase-firestore.js";

// https://firebase.google.com/docs/web/setup#available-libraries

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

let easyQuestionsArray = [];
let hardQuestionsArray = [];
let easyAvg = {};
let hardAvg = {};
let currentDifficulty = "";
let questionCounter = 0;
let correctAnswers = 0;
let scoreGif = [];
let scoreText = [];
let answersClickable = true;

//Onclick difficulty and onclick try again from end page
function toggleLandingPage() {
  document.getElementById("landing-page").classList.toggle("hidden-overlay");
}

setTimeout(function(){ 
  document.querySelector(".landing-btn").style.pointerEvents = 'auto';
  document.querySelector(".landing-btn--alternate").style.pointerEvents = 'auto';
 }, 35000);

//Hide the landing page overlay and start the game when the easy or hard button is clicked
document.getElementById("easy-btn").addEventListener("click", function() {
  toggleLandingPage();
  startGame(easy);
});

document.getElementById("hard-btn").addEventListener("click", function() {
  toggleLandingPage();
  startGame(hard);
});

//onclick difficulty (event listener)
function startGame() {
  questionCounter = 0;
  correctAnswers = 0;
  answersClickable = true;
  toggleLandingPage()
   nextQuestion()
}

retrieveDataFromFirebase();
//run onload
async function retrieveDataFromFirebase() {
  let easyQuestionsDb = await retrieveQuestionDocs("easy");
  let hardQuestionsDb = await retrieveQuestionDocs("hard");
  let easyAvgDb = await retrieveAvgDocs("easy");
  let hardAvgDb = await retrieveAvgDocs("hard");

  populateEasyArray(easyQuestionsDb);
  populateHardArray(hardQuestionsDb);
  populateAvgVariables(easyAvgDb, hardAvgDb);

  consoleLogs();
}

//Retrieve each of the difficulty databases
async function retrieveQuestionDocs(diff) {
  let coll = diff + "-questions";
  const questions = await getDocs(collection(db, coll));
  return questions;
}

//Retrieve each of the difficulty databases
async function retrieveAvgDocs(diff) {
  let coll = diff + "-avg";
  const avg = await getDocs(collection(db, coll));
  return avg;
}

function populateEasyArray(db) {
  let i = 0;
  db.forEach((doc) => {
    let question = {
      question: doc.data().question,
      image: doc.data().image,
      answers: doc.data().answers
    }
    easyQuestionsArray[i] = question;
    i++;
  });
}

function populateHardArray(db) {
  let i = 0;
  db.forEach((doc) => {
    let question = {
      question: doc.data().question,
      image: doc.data().image,
      answers: doc.data().answers
    }
    hardQuestionsArray[i] = question;
    i++;
  });
}

//Populate the avg global variables with data from firebase
function populateAvgVariables(easyDb, hardDb) {
  //forEach is unnecessary - replace with single run syntax
  easyDb.forEach((doc) => {
    easyAvg = {
      scores: doc.data().scores,
      users: doc.data().users
    }
  });
  
  hardDb.forEach((doc) => {
    hardAvg = {
      scores: doc.data().scores,
      users: doc.data().users
    }
  }); 
}

//To check the arrays and objects are being populated properly - remove later
function consoleLogs() {
  console.log(easyQuestionsArray);
  console.log(hardQuestionsArray);

  console.log(easyAvg);
  console.log(hardAvg);
}

function shuffleArray(difficulty) {
  //SHUFFLE question array matching difficulty
}

//called by startGame() and onclick next question button
function goToNextQuestion() {

  //COMPARE question counter to array index
  //if (counter = 10)
    //RUN calculateAvg()
    //RUN toggleScorePage()
    //BREAK
  //else if (counter < 10)
    //INSERT question from easy/hard array at same index as counter into the HTML
    //RUN randomizeAnswers(i) (creates answer array)
    //INSERT created array of answers into the four answer divs
    //SET answersClickable to true

  //ADD +1 to question counter
}

function randomizeAnswers(i) {
  //CREATE an array randomizedQuestions
  //INSERT answers for the question matching i into the array
  //SHUFFLE the array
  //RETURN the array
}

// onclick on answer
function hightlightAnswer() {
  // CHECK if answersClickable = true
  // if answersClickable = true
  //--alternatively, check if HTML forms have a function for this built in

    // SET answersClickable to false
    // highlight the answer where correctAnswer = true to green (apply a .correct class?)
    // CHECK if the clicked answer has correctAnswer = false
      // if it does, highlight the clicked answer red (apply a .incorrect class?)
      // else if it doesn't, add +1 ro correctAnswers

  // else if answersClickable = false
    //BREAK
}

function calculateAvg(difficulty) {
  //ADD user score to easyScores or hardScores, depending on difficulty
  //ADD ++ to easyUsers or hardUsers, depending on difficulty setting
  //CALCULATE average score (scores / users)
  //DISPLAY average score by changing innerHTML
  //RUN saveAvgscoreToFirebase()
}

function toggleScorePage() {
  //DISPLAY user score, average score, and play again button in innerHTML
  //RUN showScoreInfo()
  //TOGGLE scorepage display class
}

//eventlistener
//if play again button is clicked
//RUN toggleScorePage() and toggleLandingPage()

function saveAvgScoreToFirebase() {
  //INSERT save the updated variable easyAvg/hardAvg into firebase
}

function showScoreInfo() {
  //DISPLAY scoreGif and scoreText in innerHTML depending on correctAnswers
}

//Pause landing page video as static image on last frame
// select the video element
let video = document.querySelector('.video');

//Listen for the event that fires when your video has finished playing
video.addEventListener('ended', function() {
    //Pause the video
    this.pause();
    //Set play time to the last frame
    this.currentTime = this.duration;
}, false);

//data structure
/*let easy = [
    {
        picture =
        questionText =
        relatedCharacter =
        answers = [
            {
                answerText =
                answerCorrect = true/false
            },
            {
                answerText =
                answerCorrect = true/false
            },
            {
                answerText =
                answerCorrect = true/false
            },
            {
                answerText =
                answerCorrect = true/false
            }
        ]
    }
]

let hard = [
    {
        picture =
        questionText =
        relatedCharacter =
        answers = [
            {
                answerText =
                answerCorrect = true/false
            },
            {
                answerText =
                answerCorrect = true/false
            },
            {
                answerText =
                answerCorrect = true/false
            },
            {
                answerText =
                answerCorrect = true/false
            }
        ]
    }
]

//To insert into the database
// easyAvg {
// let easyScores = (total sum of all easy scores)
// let easyUsers = (total count of all easy players)}

// hardAvg {
// let hardScores = (total sum of all hard scores)
// let hardUsers = (total count of all hard players)}
*/
