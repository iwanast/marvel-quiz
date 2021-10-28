
//DECLARE global array easy variable
//DECLARE global array hard variable
//DECLARE global variable for difficulty
//DECLARE global variable question counter


//on page load, onclick difficulty and onclick try again from end page
function toggleLandingPage() {
//TOGGLE div class to animate show or not show
}

//onclick difficulty (event listener)
function startGame(difficulty) {
//ASSIGN difficulty to global variable
//RESET question counter variable
//RUN toggleLandingPage()
//RUN nextQuestion()
}

//run onload
async function retrieveQuestionsFromFirebase() {
//FETCH data from Firebase from both easy and hard arrays
//AWAIT FETCH THEN RUN assignQuestionArrays()
}

async function assignQuestionArrays() {
//ASSIGN the data in the easy array from firebase into the easy global variable
//ASSIGN the data in the hard array from firebase into the hard global variable
}

function shuffleArray(difficulty) {
//SHUFFLE question array matching difficulty
}

//called by startGame() and onclick next question button
function nextQuestion() {

//ADD +1 to question counter
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

//To insert into the database
let easyScores = (total sum of all easy scores)
let easyUsers = (total count of all easy players)

let hardScores = (total sum of all hard scores)
let hardUsers = (total count of all hard players)