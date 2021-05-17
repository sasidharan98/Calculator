const question = document.getElementById('question');
const choices = Array.from(document.getElementsByClassName('choice-text'));
const questionsCounter = document.getElementById('questionsCounter');
const scores = document.getElementById('scores');
const progressBar = document.getElementById('progressBar');
const progressLevel = document.getElementById('progressLevel');
console.log(choices);

let questionCounter = 0;
let currentQuestion = [];
let acceptingAnswers = false;
let Score = 0;
let availableQuestion = [];
let questions = [];

fetch(
  'https://opentdb.com/api.php?amount=10&category=29&difficulty=easy&type=multiple'
)
  .then(res => {
    return res.json();
  })
  .then(loadedQuestions => {
    questions = loadedQuestions.results.map(loadedQuestion => {
      const formattedQuestion = {
        question: loadedQuestion.question.replace(/(&quot\;)/g, '"')
      };

      const answerChoices = [...loadedQuestion.incorrect_answers];
      formattedQuestion.answer = Math.floor(Math.random() * 4) + 1;
      answerChoices.splice(
        formattedQuestion.answer - 1,
        0,
        loadedQuestion.correct_answer
      );

      answerChoices.forEach((choice, index) => {
        formattedQuestion['choice' + (index + 1)] = choice;
      });
      return formattedQuestion;
    });
    startGame();
  })
  .catch(err => {
    console.error(err);
  });

//   {
//     question: 'Inside which HTML element do we put the JavaScript??',
//     choice1: '<script>',
//     choice2: '<javascript>',
//     choice3: '<js>',
//     choice4: '<scripting>',
//     answer: 1
//   },
//   {
//     question:
//       "What is the correct syntax for referring to an external script called 'xxx.js'?",
//     choice1: "<script href='xxx.js'>",
//     choice2: "<script name='xxx.js'>",
//     choice3: "<script src='xxx.js'>",
//     choice4: "<script file='xxx.js'>",
//     answer: 3
//   },
//   {
//     question: " How do you write 'Hello World' in an alert box?",
//     choice1: "msgBox('Hello World');",
//     choice2: "alertBox('Hello World');",
//     choice3: "msg('Hello World');",
//     choice4: "alert('Hello World');",
//     answer: 4
//   }
// ];

const maximumQuestions = 5;
const bonusValue = 10;

startGame = () => {
  questionCounter = 0;
  score = 0;
  availableQuestion = [...questions];
  console.log(availableQuestion);
  getNewQuestion();
};

getNewQuestion = () => {
  if (availableQuestion.length === 0 || questionCounter >= maximumQuestions) {
    localStorage.setItem('mostRecentScore', score);
    return window.location.assign('/end.html');
  }
  questionCounter++;
  questionsCounter.innerText =
    'Questions:' + questionCounter + '/' + maximumQuestions;
  const questionIndex = Math.floor(Math.random() * availableQuestion.length);
  currentQuestion = availableQuestion[questionIndex];
  question.innerText = currentQuestion.question;
  choices.forEach(choice => {
    const number = choice.dataset['number'];
    choice.innerText = currentQuestion['choice' + number];
  });
  progressLevel.style.width = (questionCounter / maximumQuestions) * 100 + '%';
  availableQuestion.splice(questionIndex, 1);
  acceptingAnswers = true;
};
choices.forEach(choice => {
  choice.addEventListener('click', e => {
    if (!acceptingAnswers) return;
    acceptingAnswers = false;
    const selectedChoice = e.target;
    const selectedAnswer = selectedChoice.dataset['number'];
    const classToApply =
      selectedAnswer == currentQuestion.answer ? 'correct' : 'incorrect';
    if (classToApply === 'correct') {
      incrementScore(bonusValue);
    }
    selectedChoice.parentElement.classList.add(classToApply);
    setTimeout(() => {
      selectedChoice.parentElement.classList.remove(classToApply);
      getNewQuestion();
    }, 1000);
  });
});

incrementScore = num => {
  score += num;
  scores.innerText = score;
};
