// ---------- Elements ----------
const operation = document.getElementById("operation");
const difficulty = document.getElementById("difficulty");

const question = document.getElementById("question");
const answer = document.getElementById("answer");

const submitBtn = document.getElementById("submitBtn");
const nextBtn = document.getElementById("nextBtn");

const correctEl = document.getElementById("correct");
const wrongEl = document.getElementById("wrong");
const accuracyEl = document.getElementById("accuracy");
const timerEl = document.getElementById("timer");

const resetBtn = document.getElementById("resetStats");
const themeBtn = document.getElementById("themeBtn");

// ---------- Variables ----------
let num1, num2, operator, correctAnswer;

let correct = Number(localStorage.getItem("correct")) || 0;
let wrong = Number(localStorage.getItem("wrong")) || 0;

let seconds = 0;
let timerStarted = false;

// ---------- Load ----------
updateStats();
generateQuestion();

// ---------- Timer ----------
setInterval(() => {

    if(timerStarted){

        seconds++;

        let m = String(Math.floor(seconds/60)).padStart(2,"0");
        let s = String(seconds%60).padStart(2,"0");

        timerEl.textContent = `${m}:${s}`;

    }

},1000);

// ---------- Random Number ----------
function rand(min,max){
    return Math.floor(Math.random()*(max-min+1))+min;
}

// ---------- Difficulty ----------
function getRange(){

    switch(difficulty.value){

        case "easy":
            return [1,20];

        case "medium":
            return [20,500];

        case "hard":
            return [100,9999];

    }

}

// ---------- Generate Question ----------
function generateQuestion(){

    let [min,max]=getRange();

    let mode = operation.value;

    if(mode==="mixed"){

        const list=[
            "addition",
            "subtraction",
            "multiplication",
            "division"
        ];

        mode=list[rand(0,3)];

    }

    switch(mode){

        case "addition":

            num1=rand(min,max);
            num2=rand(min,max);

            operator="+";
            correctAnswer=num1+num2;

            break;

        case "subtraction":

            num1=rand(min,max);
            num2=rand(min,max);

            if(num2>num1){

                [num1,num2]=[num2,num1];

            }

            operator="-";
            correctAnswer=num1-num2;

            break;

        case "multiplication":

            num1=rand(2,99);
            num2=rand(2,99);

            if(difficulty.value==="hard"){

                num1=rand(100,9999);
                num2=rand(2,999);

            }

            operator="×";
            correctAnswer=num1*num2;

            break;

        case "division":

            num2=rand(2,20);

            correctAnswer=rand(2,30);

            if(difficulty.value==="hard"){

                num2=rand(2,99);
                correctAnswer=rand(10,500);

            }

            num1=num2*correctAnswer;

            operator="÷";

            break;

    }

    question.textContent=`${num1} ${operator} ${num2} = ?`;

    answer.value="";
    answer.focus();

}

// ---------- Submit ----------
function checkAnswer(){

    if(answer.value==="") return;

    timerStarted=true;

    if(Number(answer.value)===correctAnswer){

        correct++;

        alert("✅ Correct!");

    }

    else{

        wrong++;

        alert("❌ Wrong!\nCorrect Answer = "+correctAnswer);

    }

    saveStats();

    updateStats();

    generateQuestion();

}

// ---------- Stats ----------
function updateStats(){

    correctEl.textContent=correct;

    wrongEl.textContent=wrong;

    let total=correct+wrong;

    let acc=0;

    if(total>0){

        acc=Math.round(correct/total*100);

    }

    accuracyEl.textContent=acc+"%";

}

// ---------- Save ----------
function saveStats(){

    localStorage.setItem("correct",correct);

    localStorage.setItem("wrong",wrong);

}

// ---------- Reset ----------
resetBtn.onclick=function(){

    if(confirm("Reset statistics?")){

        correct=0;
        wrong=0;
        seconds=0;

        timerEl.textContent="00:00";

        saveStats();

        updateStats();

    }

}

// ---------- Theme ----------
themeBtn.onclick=function(){

    document.body.classList.toggle("dark");

}

// ---------- Events ----------
submitBtn.onclick=checkAnswer;

nextBtn.onclick=generateQuestion;

answer.addEventListener("keydown",function(e){

    if(e.key==="Enter"){

        checkAnswer();

    }

});