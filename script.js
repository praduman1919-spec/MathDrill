// =============================
// MathDrill Script (Part 1)
// =============================

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
let num1 = 0;
let num2 = 0;
let operator = "";
let correctAnswer = 0;

let correct = Number(localStorage.getItem("correct")) || 0;
let wrong = Number(localStorage.getItem("wrong")) || 0;

let seconds = 0;
let timerStarted = false;

// ---------- Load ----------
updateStats();
generateQuestion();

// ---------- Timer ----------
setInterval(() => {

    if(!timerStarted) return;

    seconds++;

    let m = String(Math.floor(seconds/60)).padStart(2,"0");
    let s = String(seconds%60).padStart(2,"0");

    timerEl.textContent = `${m}:${s}`;

},1000);

// ---------- Random ----------
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

    let mode = operation.value;

    if(mode==="mixed"){

        const list=[
            "addition",
            "subtraction",
            "multiplication",
            "division"
        ];

        mode=list[rand(0,3)];

    }    // ---------- Addition ----------
    if(mode==="addition"){

        let digits, count;

        switch(difficulty.value){

            case "easy":
                digits = 3;
                count = 5;
                break;

            case "medium":
                digits = 6;
                count = 10;
                break;

            case "hard":
                digits = 9;
                count = 10;
                break;

        }

        let min = Math.pow(10, digits - 1);
        let max = Math.pow(10, digits) - 1;

        let output = "";
        correctAnswer = 0;

        for(let i = 0; i < count; i++){

            let n = rand(min, max);

            correctAnswer += n;

            let line = String(n).padStart(digits, " ");

            if(i === count - 1){
                output += "+ " + line + "\n";
            }else{
                output += "  " + line + "\n";
            }

        }

        output += " " + "-".repeat(digits + 2);

        question.textContent = output;

        answer.value = "";
        answer.focus();

        return;
    }

    // ---------- Other Operations ----------

    let [min,max] = getRange();

    switch(mode){

        case "subtraction":

            num1 = rand(min,max);
            num2 = rand(min,max);

            if(num2 > num1){

                [num1,num2] = [num2,num1];

            }

            operator = "-";
            correctAnswer = num1 - num2;

            break;

        case "multiplication":

            if(difficulty.value==="easy"){

                num1 = rand(2,99);
                num2 = rand(2,9);

            }

            else if(difficulty.value==="medium"){

                num1 = rand(100,9999);
                num2 = rand(10,99);

            }

            else{

                num1 = rand(100000000,999999999);
                num2 = rand(100,999);

            }

            operator = "×";
            correctAnswer = num1 * num2;

            break;        case "division":

            if(difficulty.value==="easy"){

                num2 = rand(2,9);
                correctAnswer = rand(2,99);

            }

            else if(difficulty.value==="medium"){

                num2 = rand(10,99);
                correctAnswer = rand(100,9999);

            }

            else{

                num2 = rand(10,99);
                correctAnswer = rand(1000000,9999999);

            }

            num1 = num2 * correctAnswer;

            operator = "÷";

            break;

    }

    question.textContent = `${num1} ${operator} ${num2} = ?`;

    answer.value = "";
    answer.focus();

}

// ---------- Submit ----------
function checkAnswer(){

    if(answer.value==="") return;

    timerStarted = true;

    if(Number(answer.value) === correctAnswer){

        correct++;
        alert("✅ Correct!");

    }else{

        wrong++;
        alert("❌ Wrong!\nCorrect Answer = " + correctAnswer);

    }

    localStorage.setItem("correct",correct);
    localStorage.setItem("wrong",wrong);

    updateStats();

    generateQuestion();

}

// ---------- Statistics ----------
function updateStats(){

    correctEl.textContent = correct;
    wrongEl.textContent = wrong;

    const total = correct + wrong;

    accuracyEl.textContent =
        total === 0 ? "0%" :
        Math.round(correct * 100 / total) + "%";

}

// ---------- Reset ----------
resetBtn.onclick = function(){

    if(confirm("Reset statistics?")){

        correct = 0;
        wrong = 0;
        seconds = 0;

        timerEl.textContent = "00:00";

        localStorage.setItem("correct",0);
        localStorage.setItem("wrong",0);

        updateStats();

    }

};

// ---------- Theme ----------
themeBtn.onclick = function(){

    document.body.classList.toggle("dark");

};

// ---------- Events ----------
submitBtn.onclick = checkAnswer;

nextBtn.onclick = generateQuestion;

answer.addEventListener("keydown",function(e){

    if(e.key==="Enter"){

        checkAnswer();

    }

});