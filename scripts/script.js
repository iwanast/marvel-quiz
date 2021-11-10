// Imports firebase functions
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.1.3/firebase-app.js";
import {
  getFirestore,
  collection,
  doc,
  getDocs,
  setDoc,
} from "https://www.gstatic.com/firebasejs/9.1.3/firebase-firestore.js";

// Imports Firebase configuration settings
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

// Declare global variables
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
let correctAnswerString = ""; // in here we store the correct answer for the momentarily question
let randomizedAnswersArray = []; // in here we store the randomized answers for the momentarily question
let userAnswerIndex; // index of the answer the user selected from 0 till 3
let videoPlayed = false;
let video = document.querySelector(".video");

////////////////////////////////////GLOBAL FUNCTIONS///////////////////////////////////////

// function to put a function after onclick
function putInOnclick(idHtml, theFunction) {
  return (document.getElementById(idHtml).onclick = theFunction);
}

// Toggle a class for an id in html
function toggleClass(theId, theClass){
  document.getElementById(theId).classList.toggle(theClass);
}

// Randomize array in-place using Durstenfeld shuffle algorithm
function shuffleArray(array) {
  for (var i = array.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
  return array;
}

// Inserts value inte the innerHTML on the DOM by id
function insertHTML(htmlId, htmlValue) {
  document.getElementById(`${htmlId}`).innerHTML = htmlValue;
}

////////////////////////////////////LANDING PAGE//////////////////////////////////////////

//Pause landing page video as static image on last frame
video.addEventListener("ended", function() {
    pauseVideo();
    videoPlayed = true;
  });

setTimeout(function() {
  document.querySelector(".landing-btn-div").style.pointerEvents = "auto";
  document.querySelector(".landing-btn-div--alternate").style.pointerEvents = "auto";
}, 0);

//Hide the landing page overlay and start the game when the easy or hard button is clicked
document.getElementById("easy-btn").addEventListener("click", function() {
  currentDifficulty = "easy";
  shuffleArray(easyQuestionsArray);
  startGame();
});

document.getElementById("hard-btn").addEventListener("click", function() {
  currentDifficulty = "hard";
  shuffleArray(hardQuestionsArray);
  startGame();
});

function pauseVideo() {
  //Pause the video
  video.pause();
  //Set play time to the last frame
  video.currentTime = video.duration - 1;
  //Set variable to tell page video has been played
  videoPlayed = true;
}

//Onclick event for skip intro button
document.getElementById("skip-intro-btn").addEventListener("click", function () {
  skipIntro();
});

function skipIntro() {
  pauseVideo();
  //Make buttons clickable
  document.querySelector(".landing-btn-div").style.pointerEvents = "auto";
  document.querySelector(".landing-btn-div--alternate").style.pointerEvents = "auto";
  //Show buttons
  document.querySelectorAll('.fade-in')[0].style.opacity = "1";
  document.querySelectorAll('.fade-in')[1].style.opacity = "1";
  //Remove skip video button
  document.getElementById("skip-intro-btn").style.display = "none";
}

//Called onclick difficulty
function startGame() {
  questionCounter = 0;
  correctAnswers = 0;
  retrieveAvgDataFromFirebase();
  toggleClass("landing-page", "hidden-overlay");
  //Checks if video has been played and prevents it from playing again if it has
  if (videoPlayed == true) {
    pauseVideo();
  }
  document.getElementById("next-button").innerHTML = "next";
  goToNextQuestion();
}

////////////////////////////////////GAME PAGE//////////////////////////////////////////

// Set onclick on the next-button to trigger the next question or the finishGame-function
document.getElementById("button-next").onclick = function() {
  goToNextQuestion();
}

function goToNextQuestion() {
  toggleClass("button-next", "hidden-class-button"); // hide the next-button until an answer is clicked
  
  //SET the answerbuttons onclick to a function again
  for (let j = 1; j <= 4; j++) {
    let funcBe = function() {
      userAnswerIndex = j - 1;
      hightlightAndCountingAnswer();
    };
    putInOnclick(`answer${j}`, funcBe);
  }

  // Set the background-color of the buttons to none again
  for (let i = 1; i <= 4; i++) {
    document.getElementById(`answer${i}`).style.background = "";
  }

  randomizedAnswersArray = []; //Clear the array with the four answers

  // Decide if there should be a new question or not and call the different functions
  if (questionCounter < 10) {
    if (questionCounter == 9) {
      document.getElementById("next-button").innerHTML = "submit";
    }
    showNewQuestion();
  } else if (questionCounter == 10) {
    finishGame();
    return;
  }
  questionCounter++;
}

function showNewQuestion(){
  if (currentDifficulty == "easy") {
    correctAnswerString = easyQuestionsArray[questionCounter].answers[0];
    insertHTML("question", easyQuestionsArray[questionCounter].question);
    document.getElementById("game-picture").src = `${easyQuestionsArray[questionCounter].image}.jpg`;
    randomizeAnswers(easyQuestionsArray[questionCounter].answers);
  } else {
    correctAnswerString = hardQuestionsArray[questionCounter].answers[0];
    insertHTML("question", hardQuestionsArray[questionCounter].question);
    document.getElementById("game-picture").src = `${hardQuestionsArray[questionCounter].image}.jpg`;
    randomizeAnswers(hardQuestionsArray[questionCounter].answers);
  }
  //Inserts created random array of answers into the four answer divs
  for (let i = 0; i < randomizedAnswersArray.length; i++) {
    insertHTML(`answer${i + 1}`, randomizedAnswersArray[i]);
  }
}  

// shuffles the array of answers and putting it in the randomizedAnswersArray
function randomizeAnswers(array) {
  for (var a of array){
    randomizedAnswersArray.push(a);;
  }
  shuffleArray(randomizedAnswersArray);
}

function answerButtonNotClickable() {
  for (let i = 1; i <= 4; i++) {
    putInOnclick(`answer${i}`, "");
  }
}

// Button for the answer 1
document.getElementById("answer1").onclick = function() {
  userAnswerIndex = 0; // index of the answer
  hightlightAndCountingAnswer();
};

// Button for the answer 2
document.getElementById("answer2").onclick = function() {
  userAnswerIndex = 1; // index of the answer
  hightlightAndCountingAnswer();
};

// Button for the answer 3
document.getElementById("answer3").onclick = function () {
  userAnswerIndex = 2; // index of the answer
  hightlightAndCountingAnswer();
};

// Button for the answer 4
document.getElementById("answer4").onclick = function () {
  userAnswerIndex = 3; // index of the answer
  hightlightAndCountingAnswer();
};

// this function is hightlighting the correct answer green and
// if the user clicked wrong, the wrong one red
// this function adds the correctAnswers variable (for calculating the user score)
function hightlightAndCountingAnswer() {
  answerButtonNotClickable(); //Disable the answers to be clickable
  toggleClass("button-next", "hidden-class-button"); // Enable the next-button to work again

  // hightlight the correct answer green and the rest white (so no hover anymore) and adds 1 to correctAnswer
  for (let i = 0; i < 4; i++) {
    let backgrSize = `12px, 100%`;
    if (correctAnswerString == randomizedAnswersArray[i]) {
      let backgrGreen = `url('data:image/svg+xml;utf8,<svg width="100" height="100" transform="rotate(25)" opacity="0.1" version="1.1" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><g  fill="%23250E17"><circle cx="25" cy="25" r="12.5"/><circle cx="75" cy="75" r="12.5"/><circle cx="75" cy="25" r="12.5"/><circle cx="25" cy="75" r="12.5"/></g></svg>'),
      #35db35`;
      document.getElementById(`answer${i + 1}`).style.background = backgrGreen;
      document.getElementById(`answer${i + 1}`).style.backgroundSize = backgrSize;   
      correctAnswers++;
    } else {
        let backgrWhite = `url('data:image/svg+xml;utf8,<svg width="100" height="100" transform="rotate(25)" opacity="0.1" version="1.1" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><g  fill="%23250E17"><circle cx="25" cy="25" r="12.5"/><circle cx="75" cy="75" r="12.5"/><circle cx="75" cy="25" r="12.5"/><circle cx="25" cy="75" r="12.5"/></g></svg>'),
        #ffffff`;
        document.getElementById(`answer${i + 1}`).style.background = backgrWhite;
        document.getElementById(`answer${i + 1}`).style.backgroundSize = backgrSize;
    }
  }
  // if the user clicked the wrong answer, it will become red and the variable correctAnswer will get -1
  if (correctAnswerString != randomizedAnswersArray[userAnswerIndex]) {
    let backgrRed = `url('data:image/svg+xml;utf8,<svg width="100" height="100" transform="rotate(25)" opacity="0.1" version="1.1" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><g  fill="123250E17"><circle cx="25" cy="25" r="12.5"/><circle cx="75" cy="75" r="12.5"/><circle cx="75" cy="25" r="12.5"/><circle cx="25" cy="75" r="12.5"/></g></svg>'),
    #ed1d23`;
    let backgrSize = `12px, 100%`;
    document.getElementById(`answer${userAnswerIndex + 1}`).style.background = backgrRed;
    document.getElementById(`answer${userAnswerIndex + 1}`).style.backgroundSize = backgrSize;   
    correctAnswers--;
  }
}

////////////////////////////////////SCORE PAGE//////////////////////////////////////////

//PULLED BY SCORE PAGE//
function calculateAvg() {
  let avg = 0;
  if (currentDifficulty == "easy") {
    easyAvg.scores = easyAvg.scores + correctAnswers;
    easyAvg.users++;
    avg = (easyAvg.scores / easyAvg.users).toFixed(1);
  } else if (currentDifficulty == "hard") {
      hardAvg.scores = hardAvg.scores + correctAnswers;
      hardAvg.users++;
      avg = (hardAvg.scores / hardAvg.users).toFixed(1);
  } else {
      console.log("No difficulty set");
  }
  displayScores(avg);
  saveAvgDataToFirebase();
}

function displayScores(avg) {
  document.getElementById("display-Score").innerHTML = correctAnswers + "/10";
  document.getElementById("display-AvgScore").innerHTML = avg + " /10";
}

function finishGame() {
  toggleClass("score-page", "hidden-overlay");
  displayScoreExtras(currentDifficulty, correctAnswers);
  calculateAvg();
}

let displayEasyGif = [
  "../gifs/0Easy.gif",
  "../gifs/1Easy.gif",
  "../gifs/2Easy.gif",
  "../gifs/3Easy.gif",
  "../gifs/4Easy.gif",
  "../gifs/5Easy.gif",
  "../gifs/6Easy.gif",
  "../gifs/7Easy.gif",
  "../gifs/8Easy.gif",
  "../gifs/9Easy.gif",
  "../gifs/10Easy.gif",
];

let displayHardGif = [
  "../gifs/0Hard.gif",
  "../gifs/1Hard.gif",
  "../gifs/2Hard.gif",
  "../gifs/3Hard.gif",
  "../gifs/4Hard.gif",
  "../gifs/5Hard.gif",
  "../gifs/6Hard.gif",
  "../gifs/7Hard.gif",
  "../gifs/8Hard.gif",
  "../gifs/9Hard.gif",
  "../gifs/10Hard.gif",
];

let displayEasyGifText = [
  "Puny god...",
  "You just peed in the suit...",
  "What a bunch of A-holes.",
  "I think it's gratuitous, but whatever.",
  "Reality is often disappointing.",
  "Boom. You looking for this?",
  "You know, they told me you people were conceited douchebags, but that isn't true at all!",
  "I got something kind of big, but I can't hold it for long!",
  "You don't get to make that choice for me.",
  "You guys know I can move things with my mind, right?",
  "Higher, further, faster baby."
];

let displayHardGifText = [
  "Whose kitty litter did I just shit in?",
  "You're unworthy of your title. I cast you out!",
  "If you throw one more moon at me, I'm gonna lose it!",
  "Do you guys put the word quantum in front of everything?",
  "Forget everything you think you know.",
  "Just because something works, doesn't mean it can't be improved.",
  "Kill mode, activate!",
  "I can do this all day!",
  "Do I look to be in a gaming mood?!",
  "I love you 3000.",
  "This does put a smile on my face."
];

function displayScoreExtras(currentDifficulty, correctAnswers) {
  //DISPLAY scoreGif and scoreText in innerHTML depending on number of correctAnswers
  let gifLink = "";
  let gifText = "";
  if (currentDifficulty == "easy" && correctAnswers == 10) {
    gifLink = displayEasyGif[10]; 
    gifText = displayEasyGifText[10]
  } else if (currentDifficulty == "easy" && correctAnswers == 9) {
      gifLink = displayEasyGif[9]; 
      gifText = displayEasyGifText[9]
  } else if (currentDifficulty == "easy" && correctAnswers == 8) {
      gifLink = displayEasyGif[8]; 
      gifText = displayEasyGifText[8]
  } else if (currentDifficulty == "easy" && correctAnswers == 7) {
      gifLink = displayEasyGif[7]; 
      gifText = displayEasyGifText[7]
  } else if (currentDifficulty == "easy" && correctAnswers == 6) {
      gifLink = displayEasyGif[6]; 
      gifText = displayEasyGifText[6]
  } else if (currentDifficulty == "easy" && correctAnswers == 5) {
      gifLink = displayEasyGif[5]; 
      gifText = displayEasyGifText[5]
  } else if (currentDifficulty == "easy" && correctAnswers == 4) {
      gifLink = displayEasyGif[4]; 
      gifText = displayEasyGifText[4]
  } else if (currentDifficulty == "easy" && correctAnswers == 3) {
      gifLink = displayEasyGif[3]; 
      gifText = displayEasyGifText[3]
  } else if (currentDifficulty == "easy" && correctAnswers == 2) {
      gifLink = displayEasyGif[2]; 
      gifText = displayEasyGifText[2]
  } else if (currentDifficulty == "easy" && correctAnswers == 1) {
      gifLink = displayEasyGif[1]; 
      gifText = displayEasyGifText[1]
  } else if (currentDifficulty == "easy" && correctAnswers == 0) {
      gifLink = displayEasyGif[0]; 
      gifText = displayEasyGifText[0]
  } 
  if (currentDifficulty == "hard" && correctAnswers == 10) {
    gifLink = displayHardGif[10]; 
    gifText = displayHardGifText[10]
  } else if (currentDifficulty == "hard" && correctAnswers == 9) {
      gifLink = displayHardGif[9]; 
      gifText = displayHardGifText[9]
  } else if (currentDifficulty == "hard" && correctAnswers == 8) {
      gifLink = displayHardGif[8]; 
      gifText = displayHardGifText[8]
  } else if (currentDifficulty == "hard" && correctAnswers == 7) {
      gifLink = displayHardGif[7]; 
      gifText = displayHardGifText[7]
  } else if (currentDifficulty == "hard" && correctAnswers == 6) {
      gifLink = displayHardGif[6]; 
      gifText = displayHardGifText[6]
  } else if (currentDifficulty == "hard" && correctAnswers == 5) {
      gifLink = displayHardGif[5]; 
      gifText = displayHardGifText[5]
  } else if (currentDifficulty == "hard" && correctAnswers == 4) {
      gifLink = displayHardGif[4]; 
      gifText = displayHardGifText[4]
  } else if (currentDifficulty == "hard" && correctAnswers == 3) {
      gifLink = displayHardGif[3]; 
      gifText = displayHardGifText[3]
  } else if (currentDifficulty == "hard" && correctAnswers == 2) {
      gifLink = displayHardGif[2]; 
      gifText = displayHardGifText[2]
  } else if (currentDifficulty == "hard" && correctAnswers == 1) {
      gifLink = displayHardGif[1]; 
      gifText = displayHardGifText[1]
  } else if (currentDifficulty == "hard" && correctAnswers == 0) {
      gifLink = displayHardGif[0]; 
      gifText = displayHardGifText[0]
  }
  document.getElementById("gif-source").src = gifLink;
  document.getElementById("gif-txt").innerHTML = gifText;                                      
}

//toggle landing page in after user wants to play again
document.getElementById("play-again-button").onclick = function(){
  toggleClass("score-page", "hidden-overlay");
  toggleClass("landing-page", "hidden-overlay");
}


///////////////////////////////FIREBASE FUNCTIONS////////////////////////////////////

document.getElementById("bodyId").onload = retrieveQuestionDataFromFirebase();

//Retrieve the questions/answers/imagesrc from Firebase
async function retrieveQuestionDataFromFirebase() {
  let easyQuestionsData = await retrieveQuestionDocs("easy");
  let hardQuestionsData = await retrieveQuestionDocs("hard");
  populateEasyQuestionsArray(easyQuestionsData);
  populateHardQuestionsArray(hardQuestionsData);
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

function saveAvgDataToFirebase() {
  if (currentDifficulty == "easy") {
    setDoc(doc(db, "easy-avg", "eavg"), {
      scores: easyAvg.scores,
      users: easyAvg.users,
    });
  } else if (currentDifficulty == "hard") {
    setDoc(doc(db, "hard-avg", "havg"), {
      scores: hardAvg.scores,
      users: hardAvg.users,
    });
  }
}
