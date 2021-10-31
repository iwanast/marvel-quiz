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

//DECLARE easyQuestionsArray global array easy variable
//DECLARE hardQuestionsArray global array hard variable
//DECLARE currentDifficulty global variable for difficulty
//DECLARE questionCounter global variable
//DECLARE correctAnswers global variable
//DECLARE easyAvg global object
//DECLARE hardAvg global object
//DECLARE scoreGif global array
//DECLARE scoreText global array
//DECLARE answersClickable global variable to true

//on page load, onclick difficulty and onclick try again from end page
function toggleLandingPage() {
  //TOGGLE div class to show or hide the landing page
}

//Hide the landing page overlay and start the game when the easy or hard button is clicked
document.getElementById("easy-btn").addEventListener("click", function() {
  document.getElementById("landing-page").classList.toggle("hidden-overlay");
  startGame(easy);
});

document.getElementById("hard-btn").addEventListener("click", function() {
  document.getElementById("landing-page").classList.toggle("hidden-overlay");
  startGame(hard);
});

//onclick difficulty (event listener)
function startGame(difficulty) {
  //ASSIGN difficulty to global variable
  //RESET var questionCunter to 0
  //RESET var correctAnswers to 0
  //RESET answersClickable to true
  //RUN toggleLandingPage()
  //RUN nextQuestion()
}

retrieveDataFromFirebase();
//run onload
async function retrieveDataFromFirebase() {
  let namesInDb = await getNames();
  //   clearContentOfElement(id);
  namesInDb.forEach((doc) => {
    console.log({ id: doc.id, name: doc.data().name });
  });
  //Get all from firebase
  async function getNames() {
    const names = await getDocs(collection(db, "names"));
    return names;
  }
  //FETCH data from Firebase from both easy and hard arrays
  //FETCH the variables for the avg result, both easy and hard, from firebase
  //AWAIT FETCH THEN RUN assignGlobalVariablesFromFirebase()
}

async function assignVariablesFromFirebase() {
  //ASSIGN the data in the easy questions array from firebase into the easyQuestionsArray
  //ASSIGN the data in the hard questions array from firebase into the hardQuestionsArray
  //ASSIGN the data in the easy average array into the easyAvg global object
  //ASSIGN the data in the easy average array into the hardAvg global object

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
