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
let easyAvg = {
  scores: 0,
  users: 0,
};
let hardAvg = {
  scores: 0,
  users: 0,
};
let currentDifficulty = "";
let questionCounter = 0;
let correctAnswers = 0;
let correctAnswerString = ""; 
let scoreGif = [];
let scoreText = [];
let randomizedAnswersArray = [];
let userAnswerIndex; // index of the answer the user selected


//Onclick difficulty and onclick try again from end page
function togglePage(page) {
  document.getElementById(page).classList.toggle("hidden-overlay");
}

setTimeout(function () {
  document.querySelector(".landing-btn-div").style.pointerEvents = "auto";
  document.querySelector(".landing-btn-div--alternate").style.pointerEvents =
    "auto";
}, 35000);

//Hide the landing page overlay and start the game when the easy or hard button is clicked
document.getElementById("easy-btn").addEventListener("click", function () {
  currentDifficulty = "easy";
  shuffleArray(easyQuestionsArray);
  startGame();
});

document.getElementById("hard-btn").addEventListener("click", function () {
  currentDifficulty = "hard";
  shuffleArray(hardQuestionsArray);
  startGame();
});

//onclick difficulty (event listener)
function startGame() {
  questionCounter = 0;
  correctAnswers = 0;
  togglePage("landing-page");
  document.getElementById("next-button").innerHTML = "next";
  goToNextQuestion();
}

function playAgain() {
  togglePage("score-page");
  togglePage("landing-page");
}
///////////////////////////////FIREBASE FUNCTIONS////////////////////////////////////
retrieveQuestionDataFromFirebase();
//run onload
async function retrieveQuestionDataFromFirebase() {
  let easyQuestionsData = await retrieveQuestionDocs("easy");
  let hardQuestionsData = await retrieveQuestionDocs("hard");

  populateEasyQuestionsArray(easyQuestionsData);
  populateHardQuestionsArray(hardQuestionsData);

  console.log("the first answer: " + easyQuestionsArray[0].answers);
  consoleLogs();
}

async function retrieveAvgDataFromFirebase() {
  let easyAvgData = await retrieveAvgDocs("easy");
  let hardAvgData = await retrieveAvgDocs("hard");

  populateAvgVariables(easyAvgData, hardAvgData);
}

//Retrieve each of the difficulty databases
async function retrieveQuestionDocs(diff) {
  let coll = diff + "-questions";
  const questions = await getDocs(collection(db, coll));
  return questions;
}

//Retrieve each of the avg databases
async function retrieveAvgDocs(diff) {
  let coll = diff + "-avg";
  const avg = await getDocs(collection(db, coll));
  return avg;
}

//Insert each of the docs into the easyQuestionsArray
function populateEasyQuestionsArray(db) {
  let i = 0;
  db.forEach((doc) => {
    let question = {
      question: doc.data().question,
      image: doc.data().image,
      answers: doc.data().answers,
    };
    easyQuestionsArray[i] = question;
    i++;
  });
}

//Insert each of the docs into the hardQuestionsArray
function populateHardQuestionsArray(db) {
  let i = 0;
  db.forEach((doc) => {
    let question = {
      question: doc.data().question,
      image: doc.data().image,
      answers: doc.data().answers,
    };
    hardQuestionsArray[i] = question;
    i++;
  });
}

//Populate the avg global variables with data from firebase
function populateAvgVariables(easyDb, hardDb) {
  easyDb.forEach((doc) => {
    easyAvg = {
      scores: doc.data().scores,
      users: doc.data().users,
    };
  });

  hardDb.forEach((doc) => {
    hardAvg = {
      scores: doc.data().scores,
      users: doc.data().users,
    };
  });
}

//To check the arrays and objects are being populated properly - remove later
function consoleLogs() {
  // console.log(easyQuestionsArray);
  // console.log(hardQuestionsArray);
  // console.log(easyAvg);
  // console.log(hardAvg);
}
////////////////////////////////QUIZ FUNCTIONS///////////////////////////////////////
function shuffleArray(array) {
  //SHUFFLE question array matching difficulty
  /* Randomize array in-place using Durstenfeld shuffle algorithm */
  for (var i = array.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
  return array;
}

// When user clicks next its calling the goToNextQuestion function
document.getElementById("button-next").onclick = function () {
  goToNextQuestion();
};

//called by startGame() and onclick next question button
function goToNextQuestion() {
 //SET the answerbuttons onclick to a function again
 for(let j = 1; j<= 4; j++){
   let funcBe = function (){ 
    userAnswerIndex = (j - 1); // index of the answer
    hightlightAndCountingAnswer();
    for(let i = 1; i <= 4; i++){
      putInOnclick(`answer${i}`, "");
      }  
  }
    putInOnclick(`answer${j}`, funcBe); 
  }
  // Set the background-color of the buttons to none again
  for(let i = 1; i <= 4; i++){
      document.getElementById(`answer${i}`).style.background = "#ffffff";
    }

  //Clear the array with the four answers 
  randomizedAnswersArray = [];

  // Decide if there should be a new question or not and call the different functions
  if (questionCounter < 10){
    if(questionCounter == 9){
      document.getElementById("next-button").innerHTML = "submit";
    }
    if(currentDifficulty == "easy") {
      correctAnswerString = easyQuestionsArray[questionCounter].answers[0];
      insertHTML("question", easyQuestionsArray[questionCounter].question);
      randomizeAnswers(easyQuestionsArray[questionCounter].answers);
    }
    else {
      correctAnswerString = hardQuestionsArray[questionCounter].answers[0];
      insertHTML("question", hardQuestionsArray[questionCounter].question);
      randomizeAnswers(hardQuestionsArray[questionCounter].answers);
    }
    //Inserts created random array of answers into the four answer divs
    for (let i = 0; i < randomizedAnswersArray.length; i++) {
      insertHTML(`answer${i + 1}`, randomizedAnswersArray[i]);
    }
  }
  // call the finishGame function when 10 questions have been displayed
  else if (questionCounter == 10){
    finishGame();
    return;
  }
  questionCounter++;
}

// a function to insert value inte the innerHTML on the DOM by id
function insertHTML(htmlId, htmlValue) {
  document.getElementById(`${htmlId}`).innerHTML = htmlValue;
}

// shuffles the array of answers and putting it in the randomizedAnssersArray
function randomizeAnswers(array) {
  array = shuffleArray(array);
  for (var i of array) {
    randomizedAnswersArray.push(i);
  }
}

// Button for the answer 1
document.getElementById("answer1").onclick = function (){ 
  userAnswerIndex = 0; // index of the answer
  hightlightAndCountingAnswer();
  for(let i = 1; i <= 4; i++){
  putInOnclick(`answer${i}`, "");
  } 
}

// Button for the answer 2
document.getElementById("answer2").onclick = function (){ 
  userAnswerIndex = 1; // index of the answer
  hightlightAndCountingAnswer();
  for(let i = 1; i <= 4; i++){
    putInOnclick(`answer${i}`, "");
    } 
}

// Button for the answer 3
document.getElementById("answer3").onclick = function (){ 
  userAnswerIndex = 2; // index of the answer
  hightlightAndCountingAnswer();
  for(let i = 1; i <= 4; i++){
    putInOnclick(`answer${i}`, "");
    }  
}

// Button for the answer 4
document.getElementById("answer4").onclick = function (){ 
  userAnswerIndex = 3; // index of the answer
  hightlightAndCountingAnswer();
  for(let i = 1; i <= 4; i++){
    putInOnclick(`answer${i}`, "");
    } 
}

// function to put a function after onclick 
function putInOnclick(idHtml, theFunction){
  return document.getElementById(idHtml).onclick = theFunction; 
}

// this function is hightlighting the correct answer green and
// if the user clicked wrong, the wrong one red
// this function adds the correctAnswers variable (for calculating the user score)
function hightlightAndCountingAnswer() {
  // hightlight the correct answer green and adds 1 to correctAnswer
  for(let i = 0; i < 4; i++){
    if(correctAnswerString == randomizedAnswersArray[i]){
      document.getElementById(`answer${i + 1}`).style.background = "#35db35";
      correctAnswers++;
    }
  }
  // if the user clicked the wrong answer, it will become red and the variable correctAnswer will get -1
  if (correctAnswerString != randomizedAnswersArray[userAnswerIndex]){
    document.getElementById(`answer${userAnswerIndex + 1}`).style.background = "#ed1d23";
    correctAnswers--;
  }
  console.log(correctAnswers);
}
//PULLED BY SCORE PAGE//
function calculateAvg() {
  retrieveAvgDataFromFirebase();
  if (currentDifficulty == "easy") {
    easyAvg.scores = easyAvg.scores + correctAnswers;
    easyAvg.users++;
    let avg = easyAvg.scores / easyAvg.users;
  } else if (currentDifficulty == "hard") {
    hardAvg.scores = hardAvg.scores + correctAnswers;
    hardAvg.users++;
    let avg = hardAvg.scores / hardAvg.users;
  } else {
    console.log("No difficulty set");
  }
  saveAvgDataToFirebase();
  document.getElementById(INSERTID).innerHTML = avg;
}

function finishGame() {
  //DISPLAY user score and play again button in innerHTML
  //RUN calculateAverage()
  //RUN showScorePageObjectsBasedOnScore()
  //togglePage("score-page")
}

//eventlistener
//if play again button is clicked
//RUN toggleScorePage() and togglePage("landing-page")

function saveAvgDataToFirebase() {
  if (currentDifficulty == "easy") {
    setDoc(doc(db, "easy-avg", eavg), {
      scores: easyAvg.scores,
      users: easyAvg.users,
    });
  } else if (currentDifficulty == "hard") {
    setDoc(doc(db, "hard-avg", havg), {
      scores: hardAvg.scores,
      users: hardAvg.users,
    });
  }
}

function showScorePageObjectsBasedOnScore() {
  //DISPLAY scoreGif and scoreText in innerHTML depending on number of correctAnswers
}

//Pause landing page video as static image on last frame
// select the video element
let video = document.querySelector(".video");

//Listen for the event that fires when your video has finished playing
video.addEventListener(
  "ended",
  function () {
    //Pause the video
    this.pause();
    //Set play time to the last frame
    this.currentTime = this.duration;
  },
  false
);

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

function populateAnswers(i) {
  //LET answerArray = [];
  //GET the answers for question matching counter index and assign to answerArray
  //let trueAnswer = answerArray[0];
  //SHUFFLE answers
  //INSERT answers into answer divs
  //ONCLICK answer - check if innerHtml == trueAnswer
}
