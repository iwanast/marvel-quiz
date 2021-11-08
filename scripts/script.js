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
let videoPlayed = false;

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
    //Set variable that indicated video has been played
    videoPlayed = true;
  },
  false
);

setTimeout(function () {
  document.querySelector(".landing-btn-div").style.pointerEvents = "auto";
  document.querySelector(".landing-btn-div--alternate").style.pointerEvents =
    "auto";
}, 0);

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
  toggleClass("landing-page", "hidden-overlay");
  if (videoPlayed == true) {
    //Pause the video
    video.pause();
    //Set play time to the last frame
    video.currentTime = video.duration;
  }
  document.getElementById("next-button").innerHTML = "next";
  goToNextQuestion();
}

document.getElementById("play-again-button").onclick = function(){
  playAgain();
}

function playAgain() {
  toggleClass("score-page", "hidden-overlay");
  toggleClass("landing-page", "hidden-overlay");
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

function toggleClass(theId, theClass){
  document.getElementById(theId).classList.toggle(theClass);
}

// Set onclick on the next-button to trigger the next question or the finishGame-function
document.getElementById("button-next").onclick = function() {
  goToNextQuestion();
}

//called by startGame() and onclick next question button
function goToNextQuestion() {
  // hide the next-button until an answer is clicked
  toggleClass("button-next", "hidden-class-button");
  //SET the answerbuttons onclick to a function again
  for (let j = 1; j <= 4; j++) {
    let funcBe = function () {
      userAnswerIndex = j - 1;
      hightlightAndCountingAnswer();
    };
    putInOnclick(`answer${j}`, funcBe);
  }
  // Set the background-color of the buttons to none again
  for (let i = 1; i <= 4; i++) {
    document.getElementById(`answer${i}`).style.background = "";
  }

  //Clear the array with the four answers
  randomizedAnswersArray = [];

  // Decide if there should be a new question or not and call the different functions
  if (questionCounter < 10) {
    if (questionCounter == 9) {
      document.getElementById("next-button").innerHTML = "submit";
    }
    if (currentDifficulty == "easy") {
      correctAnswerString = easyQuestionsArray[questionCounter].answers[0];
      insertHTML("question", easyQuestionsArray[questionCounter].question);
      randomizeAnswers(easyQuestionsArray[questionCounter].answers);
    } else {
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
  else if (questionCounter == 10) {
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

// function to put a function after onclick
function putInOnclick(idHtml, theFunction) {
  return (document.getElementById(idHtml).onclick = theFunction);
}

// this function is hightlighting the correct answer green and
// if the user clicked wrong, the wrong one red
// this function adds the correctAnswers variable (for calculating the user score)
function hightlightAndCountingAnswer() {
  //Disable the answers to be clickable
  answerButtonNotClickable();
  // Enable the next-button to work again
  toggleClass("button-next", "hidden-class-button");
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
    correctAnswers--; //Do we want to reduce their score if they choose incorrectly?
  }
  console.log(correctAnswers);
}
//PULLED BY SCORE PAGE//
function calculateAvg() {
  retrieveAvgDataFromFirebase();
  let avg = 0;
  if (currentDifficulty == "easy") {
    easyAvg.scores = easyAvg.scores + correctAnswers;
    easyAvg.users++;
    avg = easyAvg.scores / easyAvg.users;
  } else if (currentDifficulty == "hard") {
    hardAvg.scores = hardAvg.scores + correctAnswers;
    hardAvg.users++;
    avg = hardAvg.scores / hardAvg.users;
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
  toggleClass("score-page", "hidden-overlay")
  displayScoreExtras(currentDifficulty, correctAnswers)
}

//toggle landing page after Play Again button is clicked
document.getElementById("play-again-button").onclick = function () {
  toggleClass("score-page", "hidden-overlay");
  startGame();
};

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

let displayEasyGif = [
  "../gifs/10Easy.gif",
  "../gifs/9Easy.gif",
  "../gifs/8Easy.gif",
  "../gifs/7Easy.gif",
  "../gifs/6Easy.gif",
  "../gifs/5Easy.gif",
  "../gifs/4Easy.gif",
  "../gifs/3Easy.gif",
  "../gifs/2Easy.gif",
  "../gifs/1Easy.gif",
  "../gifs/0Easy.gif",
];

let displayHardGif = [
  "../gifs/10Hard.gif",
  "../gifs/9Hard.gif",
  "../gifs/8Hard.gif",
  "../gifs/7Hard.gif",
  "../gifs/6Hard.gif",
  "../gifs/5Hard.gif",
  "../gifs/4Hard.gif",
  "../gifs/3Hard.gif",
  "../gifs/2Hard.gif",
  "../gifs/1Hard.gif",
  "../gifs/0Hard.gif",
];

let displayEasyGifText = [
  "easy 10 score",
  "easy 9 score",
  "easy 8 score",
  "easy 7 score",
  "easy 6 score",
  "easy 5 score",
  "easy 4 score",
  "easy 3 score",
  "easy 2 score",
  "easy 1 score",
  "easy 0 score",
];

let displayHardGifText = [
  "hard 10 score",
  "hard 9 score",
  "hard 8 score",
  "hard 7 score",
  "hard 6 score",
  "hard 5 score",
  "hard 4 score",
  "hard 3 score",
  "hard 2 score",
  "hard 1 score",
  "hard 0 score",
];

function displayScoreExtras(currentDifficulty, correctAnswers) {
   //DISPLAY scoreGif and scoreText in innerHTML depending on number of correctAnswers
   let gifLink = "";
   let gifText = "";
if (currentDifficulty == "easy" && correctAnswers == 10) {
  gifLink = displayEasyGif[0]; 
  gifText = displayEasyGifText[0]
  } else if (currentDifficulty == "easy" && correctAnswers == 9) {
    gifLink = displayEasyGif[1]; 
    gifText = displayEasyGifText[1]
    } else if (currentDifficulty == "easy" && correctAnswers == 8) {
      gifLink = displayEasyGif[2]; 
      gifText = displayEasyGifText[2]
      } else if (currentDifficulty == "easy" && correctAnswers == 7) {
        gifLink = displayEasyGif[3]; 
        gifText = displayEasyGifText[3]
        } else if (currentDifficulty == "easy" && correctAnswers == 6) {
          gifLink = displayEasyGif[4]; 
          gifText = displayEasyGifText[4]
          }
          else if (currentDifficulty == "easy" && correctAnswers == 5) {
            gifLink = displayEasyGif[5]; 
            gifText = displayEasyGifText[5]
            }
            else if (currentDifficulty == "easy" && correctAnswers == 4) {
              gifLink = displayEasyGif[6]; 
              gifText = displayEasyGifText[6]
              }
              else if (currentDifficulty == "easy" && correctAnswers == 3) {
                gifLink = displayEasyGif[7]; 
                gifText = displayEasyGifText[7]
                }
                else if (currentDifficulty == "easy" && correctAnswers == 2) {
                  gifLink = displayEasyGif[8]; 
                  gifText = displayEasyGifText[8]
                  }
                  else if (currentDifficulty == "easy" && correctAnswers == 1) {
                    gifLink = displayEasyGif[9]; 
                    gifText = displayEasyGifText[9]
                    }
                    else if (currentDifficulty == "easy" && correctAnswers == 0) {
                      gifLink = displayEasyGif[10]; 
                      gifText = displayEasyGifText[10]
                      } if (currentDifficulty == "hard" && correctAnswers == 10) {
                        gifLink = displayHardGif[0]; 
                        gifText = displayHardGifText[0]
                        } else if (currentDifficulty == "hard" && correctAnswers == 9) {
                          gifLink = displayHardGif[1]; 
                          gifText = displayHardGifText[1]
                          } else if (currentDifficulty == "hard" && correctAnswers == 8) {
                            gifLink = displayHardGif[2]; 
                            gifText = displayHardGifText[2]
                            } else if (currentDifficulty == "hard" && correctAnswers == 7) {
                              gifLink = displayHardGif[3]; 
                              gifText = displayHardGifText[3]
                              } else if (currentDifficulty == "hard" && correctAnswers == 6) {
                                gifLink = displayHardGif[4]; 
                                gifText = displayHardGifText[4]
                                }
                                else if (currentDifficulty == "hard" && correctAnswers == 5) {
                                  gifLink = displayHardGif[5]; 
                                  gifText = displayHardGifText[5]
                                  }
                                  else if (currentDifficulty == "hard" && correctAnswers == 4) {
                                    gifLink = displayHardGif[6]; 
                                    gifText = displayHardGifText[6]
                                    }
                                    else if (currentDifficulty == "hard" && correctAnswers == 3) {
                                      gifLink = displayHardGif[7]; 
                                      gifText = displayHardGifText[7]
                                      }
                                      else if (currentDifficulty == "hard" && correctAnswers == 2) {
                                        gifLink = displayHardGif[8]; 
                                        gifText = displayHardGifText[8]
                                        }
                                        else if (currentDifficulty == "hard" && correctAnswers == 1) {
                                          gifLink = displayHardGif[9]; 
                                          gifText = displayHardGifText[9]
                                          }
                                          else if (currentDifficulty == "hard" && correctAnswers == 0) {
                                            gifLink = displayHardGif[10]; 
                                            gifText = displayHardGifText[10]
                                            }

document.getElementById("gif-source").src = gifLink;
document.getElementById("gif-txt").innerHTML = gifText;                                      

}

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
