
  // Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/9.1.3/firebase-app.js";
  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  const firebaseConfig = {
    apiKey: "AIzaSyBAjhZsNJ7urNqtWrUTam_f8_qiVdO3lhc",
    authDomain: "marvel-quiz-616.firebaseapp.com",
    projectId: "marvel-quiz-616",
    storageBucket: "marvel-quiz-616.appspot.com",
    messagingSenderId: "987419001414",
    appId: "1:987419001414:web:e2c1132f189ba86b040047"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);




//DECLARE global array easy variable
//DECLARE global array hard variable
//DECLARE global variable for difficulty
//DECLARE global variable questionCounter
//DECLARE global variable correctAnswers
//DECLARE global variable easyAVG
//DECLARE global variable hardAVG 
//DECLARE two arrays for scoreGif and scoreText 


//on page load, onclick difficulty and onclick try again from end page
function toggleLandingPage() {
//TOGGLE div class to animate show or not show
}

//onclick difficulty (event listener)
function startGame(difficulty) {
//ASSIGN difficulty to global variable
//RESET var questionCunter to 0
//RESET var correctAnswers to 0
//RUN toggleLandingPage()
//RUN nextQuestion()
}

//run onload
async function retrieveDataFromFirebase() {
//FETCH data from Firebase from both easy and hard arrays
//FETCH the variables for the avg result, both easy and hard, from firebase
//AWAIT FETCH THEN RUN assignGlobalVariablesFromFirebase()
}

async function assignGlobalVariablesFromFirebase() {
//ASSIGN the data in the easy array from firebase into the easy global variable
//ASSIGN the data in the hard array from firebase into the hard global variable
//ASSIGN the data in the global variables easyAVG and hardAVG 
}

function shuffleArray(difficulty) {
//SHUFFLE question array matching difficulty
}

//called by startGame() and onclick next question button
function gotoNextQuestion() {
// if statement, compare question counter to array index
// if (counter = 10)
// RUN calculateAVG()
// RUN toggleScorePage()
// return/break 
// else if (counter < 10)
// take array (difficulty) index counter and insert in innerHTML 
//ADD +1 to question counter
}

// onclick on answer, RUN hightlightAnswer() 
function hightlightAnswer() {
    // highlight green when clicked answer = true
    // hightlight red when clicked answer = false
    // if (clicked answer = true)
    // add +1 to correctAnswers
}

function calculateAVG(difficulty) {
    //ADD user score to easyScores or hardScores 
    // ADD ++ to easyUsers or hardUsers 
    //calculate average score 
    //display average score on innerHTML 
    //RUN saveAVGscoreToFirebase() 
}


function toggleScorePage() {
// show user score, average score, and play again button in innerHTML 
// RUN showScoreInfo()
// toggle scorepage
}

// eventlistener
// if play again button is clicked
// RUN toggleScorePage() and toggleLandingPage()

function saveAVGscoreToFirebase() {
// save the global variables easyAVG and hardAVG 
}

function showScoreInfo() {
// display scoreGif and scoreText depending on correctAnswers
}
















































//data structure - duplicate for hard
let easy = [
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
// easyAVG {
// let easyScores = (total sum of all easy scores)
// let easyUsers = (total count of all easy players)}

// hardAVG {
// let hardScores = (total sum of all hard scores)
// let hardUsers = (total count of all hard players)}