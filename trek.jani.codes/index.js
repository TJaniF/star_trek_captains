// declaring variables
let playerGuesses = 0;
let playerWins = 0;
let playerLosses = 0;
let modelWins = 0;
let maxRounds = 20;

let isGameStart = true
let isGameEnd = false

let playerAnswer = ""
let correctAnswer = ""

let listIndicesLinesPlayed = []
let indexFirstLine = 0
let indexLastLine = 7173  // this is the size of the test-set
let isGotUniqueLine = false
let indexNextLine = 0

let res = null
let urlAPI = "https://trek.jani.codes:8000/items/"
//let urlAPI = "http://127.0.0.1:8000/items/"


// scoring functions
function assignAnswer(givenAnswer) {
  answer = givenAnswer;
}

function checkIfCorrect() {
  if (answer == correctAnswer) {
    addWin();
  } else {
    addLoss();
  }
}

function checkIfModelCorrect() {
  if (res["model_guess"] == correctAnswer) {
    modelWins += 1
  }
}

function addGuess() {
  playerGuesses += 1;
}

function addWin() {
  playerWins += 1;
}

function addLoss() {
  playerLosses += 1;
}


// random number generator between range of input
function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max+1 - min) + min);
}

// makes sure the random number generated does not belong to a line already seen
function getIndexOfUnseenLine() {
  number = getRandomNumber(indexFirstLine, indexLastLine);

  while (isGotUniqueLine == false) {
    if (listIndicesLinesPlayed.includes(number)) {    //if a line was already played -> gets a new line
      isGotUniqueLine = false;
      number = getRandomNumber(indexFirstLine, indexLastLine);
    } else {
      isGotUniqueLine = true;
    }
  }
  isGotUniqueLine = false;
  return number
}

function addLineToAlreadyPlayed(indexLine) {
  listIndicesLinesPlayed.push(indexLine)
}

// API Fun
async function requestFromAPI(indexLine) {
  res = await fetch(`${urlAPI}${indexLine}`)
  res = await res.json()
}

function checkData() {
  setTimeout(function () {
    if (res != null) {
      displayNextLine(res);
      correctAnswer = res["correct_char"]
      addLineToAlreadyPlayed(indexNextLine);
    } else {
      checkData();
    }
  }, 500);
}

// displaying funtions
function displayNextLine(res) {
  document.getElementById("line").innerHTML = res["line"];
}

function displayLastLine() {
  document.getElementById("previous_line").innerHTML = `Previous line: ${res["line"]} (said by: ${correctAnswer[0].toUpperCase()}${correctAnswer.slice(1,)})`;
}

function displayLastModelGuess() {
  document.getElementById("model_guess").innerHTML = `For the last line the model guessed: ${res["model_guess"][0].toUpperCase()}${res["model_guess"].slice(1,)}`;
}

function getNextCorrectAnswer() {
  document.getElementById("line").innerHTML = indexNextLine;
}


// display correct stats
function updateStats() {
  document.getElementById("guesses_num").innerHTML = `Rounds played: ${playerGuesses}/20`;
  document.getElementById("wins_num").innerHTML = `Wins: ${playerWins} (${(100*playerWins/playerGuesses).toFixed(2)}%)`;
  document.getElementById("losses_num").innerHTML = `Losses: ${playerLosses} (${(100*playerLosses/playerGuesses).toFixed(2)}%)`;
  document.getElementById("model_correct").innerHTML = `Model Wins: ${modelWins}`;
}

// end of game event
function checkEndOfGame() {
  if (playerGuesses >= maxRounds) {   // checks whether the last round was reached
    document.getElementById("line").innerHTML = "You have reached the end of the game!";
    document.getElementById("kirk").disabled = true;
    document.getElementById("picard").disabled = true;
    document.getElementById("sisko").disabled = true;
    document.getElementById("janeway").disabled = true;
    document.getElementById("archer").disabled = true;
    return true;
  } else {
    return false;
  }
}


// collection function that happens upon the click of a button
function clickedButton() {
  if (isGameStart == true) {  // the click to start the game
    isGameStart = false;
  } else {
    displayLastLine();
    displayLastModelGuess();
    checkIfCorrect();
    checkIfModelCorrect()
    addGuess();
    updateStats();
    isGameEnd = checkEndOfGame();
  }

  if (isGameEnd == false) {
    indexNextLine = getIndexOfUnseenLine();
    requestFromAPI(indexNextLine);
    checkData();
  } else {
    console.log("game ended")
  }
}



// actions upon button clicks
document.getElementById("kirk").addEventListener("click", function() {
  assignAnswer("kirk");
  clickedButton();
});

document.getElementById("picard").addEventListener("click", function() {
  assignAnswer("picard");
  clickedButton();
});

document.getElementById("sisko").addEventListener("click", function() {
  assignAnswer("sisko");
  clickedButton();
});

document.getElementById("janeway").addEventListener("click", function() {
  assignAnswer("janeway");
  clickedButton();
});

document.getElementById("archer").addEventListener("click", function() {
  assignAnswer("archer");
  clickedButton();
});
