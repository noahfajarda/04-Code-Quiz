// utility functionsighScores
var qs = function(tag) {
    return document.querySelector(tag);
}

var questionList = [
    {
        title: "Who is the player on the Golden State Warriors that averaged the most points?",
        choices: ["Draymond Green", "Stephen Curry", "Jordan Poole", "Klay Thompson"],
        answer: "Stephen Curry"
    },
    {
        title: "What operating system did Apple release for iPhones in 2022?",
        choices: ["ios 14", "ios 15", "ios 16", "ios 17"],
        answer: "ios 16"
    },
    {
        title: "25 * 5 = ??",
        choices: ["225", "100", "125", "135"],
        answer: "125"
    },
    {
        title: "What day is Thanksgiving?",
        choices: ["Sunday", "Tuesday", "Thursday", "Saturday"],
        answer: "Thursday"
    },
    {
        title: "Who were the two teams that made the Super Bowl in 2020?",
        choices: ["San Francisco 49ers/Kansas City Chiefs", "Philadelphia Eagles/New England Patriots", "Los Angeles Rams/New England Patriots", "Los Angeles Rams/Cincinnati Bengals"],
        answer: "San Francisco 49ers/Kansas City Chiefs"
    },
    {
        title: "In general, in order to add logic to a web application, you should use",
        choices: ["Python", "C++", "Java", "JavaScript"],
        answer: "JavaScript"
    },
    {
        title: "How many albums has Frank Ocean officially released?",
        choices: ["1", "2", "3", "4"],
        answer: "2"
    },
    {
        title: "Which of the following is a song by Anderson .Paak?",
        choices: ["Too Fast", "Slow Jamz", "Come Down", "Supermodel"],
        answer: "Come Down"
    },
    {
        title: "What was the famous line Stephen Curry said in his post-game interview after losing the 2021 play-in tournament?",
        choices: ["I'm getting my 4th next year.", "Broncos Country, Let's Ride.", "You don't want to see us next year.", "I thought we were up."],
        answer: "You don't want to see us next year."
    },
    {
        title: "Which of the following is a TV show created by Donald Glover?",
        choices: ["Snowfall", "Atlanta", "New York New York", "Black Mirror"],
        answer: "Atlanta"
    }
];
var correctAnswers = 0;
var incorrectAnswers = 0;


// Select elements
var highScoresEl = qs("#highScores");
var wholeTimerEl = qs("#wholeTimer");
var timeEl = qs("#timer");
var mainBacktrackEl = qs("#mainBacktrack");
var mainEl = qs("main");
var startBtn = qs("#startQuizButton");
var questionEl = qs("#question");
var choicesEl = qs("#choices");
var descriptionEl = qs("#description");
var headerEl = qs("header");
var userInputEl = qs("#userName");
var userInputContainer = qs("#userNameContainer");
var submitUser = qs("#submitUser");



// question iterator
var questionCount;
// initial timer count
var timeLeft;
var answer;
var timeInterval;
// quiz running?
var quizRun = false;
// local storage
var highScores = [];
// final score
var finalScore;

// functions
// header functions
var viewHighScores = function() {
    headerEl.style = "justify-content: start";
    questionEl.textContent = "High Scores";
    mainBacktrackEl.style = "display: inline-block";
    highScoresEl.style = "display: none";
    wholeTimerEl.style = "display: none";
    startBtn.style = "display: none";
    highScores = retrieveHighScores();
    descriptionEl.textContent = "";

    // put highScores in descriptionEl
    console.log(highScores);

    if (highScores) {
        // parse string to turn intoarray of objects
        highScores = JSON.parse(highScores);
        
        // display highScores
        for (var i = 0; i < highScores.length; i++) {
            var element = document.createElement("p");
            element.textContent = highScores[i]["name"] + ": " + highScores[i]["score"];
            descriptionEl.appendChild(element);
        }

    }
    // clear highScores button
    var clearButton = document.createElement("button");
    clearButton.textContent = "Clear Scores";
    descriptionEl.appendChild(clearButton);
    clearButton.addEventListener("click", clearScores);
    
};

var clearScores = function() {
    localStorage.setItem("High Scores", "");
    viewHighScores();
};


var backToMain = function() {
    headerEl.style = "justify-content: space-between";
    questionEl.textContent = "The Ultimate Quiz";
    mainBacktrackEl.style = "display: none";
    highScoresEl.style = "display: inline-block";
    wholeTimerEl.style = "display: inline-block";
    startBtn.style = "display: inline-block";
    descriptionEl.textContent = "Try to answer these questions as best you can. You have a certain amount of seconds.";
};

// display each question
var displayQuestion = function() {
    if (questionCount < questionList.length) {
        // display title of question
        questionEl.textContent = questionList[questionCount]["title"];
        descriptionEl.style = "display: none";
    
        choicesEl.textContent = "";
        // display answers for question
        for (var i = 0; i < questionList[questionCount]["choices"].length; i++) {
            answer = document.createElement('button');
            answer.innerText = questionList[questionCount]["choices"][i];
    
            // if choice is answer, give correct id
            if (questionList[questionCount]["choices"][i] === questionList[questionCount]["answer"]) {
                answer.id = "correct";
            } else {
                answer.id = "incorrect";
            }
            choicesEl.appendChild(answer);
        }
    // after last question
    } else if (questionCount === questionList.length) {
        displayEnd();
    }
};

// check if user clicked the right answer for a question
var checkChoice = function(event) {
    // console.log(event.target);
    if (event.target.id === "correct") {
        correctAnswers++;
        questionCount++;
        displayQuestion();
    } else if (event.target.id === "incorrect") {
        incorrectAnswers++;
        questionCount++;
        // subtract time
        timeLeft = timeLeft - 10;
        timeEl.textContent = timeLeft;
        displayQuestion();
        if (timeLeft <= -1) {
            displayEnd();
            timeEl.textContent = "OUT OF TIME!";
            questionEl.textContent = "GAME OVER";
            clearInterval(timeInterval);
        }
    }
};

var displayEnd = function() {
    highScoresEl.style = "";
    finalScore = timeLeft.toString();

    // show final score
    questionEl.textContent = "Your Score is: " + finalScore;
    choicesEl.textContent = "";
    clearInterval(timeInterval);
    if (timeLeft < 0) {
        timeEl.textContent = "0";
    };
    console.log("Correct Answers:", correctAnswers);
    console.log("Incorrect Answers:", incorrectAnswers);

    // option to store in local storage
    userInputContainer.style = "display: inline-block";
    submitUser.addEventListener("click", saveGame);
    
    // play again
    startBtn.style = "display: inline-block";
    startBtn.textContent = "Play Again";
};

var saveGame = function() {
    // add score to highScores and user to local storage
    var userScore = {};
    userScore["name"] = userInputEl.value;
    userScore["score"] = finalScore;
    highScores.push(userScore);

    // sort highscores
    highScores = highScores.sort(function(a,b) {
        return b.score - a.score;
    });

    // check/show highScores array
    console.log(highScores);
    
    questionEl.textContent = "You have entered your score. Play Again?";
    userInputContainer.style = "display: none";

    syncLocalStorage();

}

// local storage functions
// set/sync wins & losses in localStorage
var syncLocalStorage = function() {
    localStorage.setItem("High Scores", JSON.stringify(highScores));
};

var retrieveHighScores = function() {
    return localStorage.getItem("High Scores");
}


// start quiz
var startQuiz = function() {
    startBtn.style = "display: none";
    highScoresEl.style = "display: none";
    userInputContainer.style = "display: none";

    // initialize count, correct/incorrect, timer again
    questionCount = 0;
    timeLeft = 150;
    correctAnswers = 0;
    incorrectAnswers = 0;

    quizRun = true;
    displayQuestion();

    // initiate timer
    timeEl.textContent = timeLeft;
    timeInterval = setInterval(function () {
        timeLeft--;
        if (timeLeft <= -1) {
            timeEl.textContent = "OUT OF TIME!";
            mainEl.textContent = "GAME OVER";
            clearInterval(timeInterval);
            // displayMessage();
        } else {
            timeEl.textContent = timeLeft;
        }
    }, 1000);
};


// add event listener for high Scores
highScoresEl.addEventListener("click", viewHighScores);
mainBacktrackEl.addEventListener("click", backToMain);
// add event listener for start quiz
startBtn.addEventListener("click", startQuiz);
// ad event listener for checking choices
document.addEventListener("click", checkChoice);
