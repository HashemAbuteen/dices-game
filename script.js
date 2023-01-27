const startButton = document.getElementById("start-button");
const inputGoal = document.getElementById("goal");
const scene1 = document.getElementById("scene-1");
const scene2 = document.getElementById("scene-2");
const holdButton = document.getElementById("hold-button");
const score1Text = document.getElementById("score-1");
const score2Text = document.getElementById("score-2");
const current1Text = document.getElementById("current-1");
const current2Text = document.getElementById("current-2");
const rollButton = document.getElementById("roll-button");
const player1Section = document.getElementById("player-1-section")
const player2Section = document.getElementById("player-2-section");
const turnOverlay = document.getElementById("turn-overlay");
let maxScore;

startButton.addEventListener("click" , (event)=> {
    if(inputGoal.value === ""){
        inputGoal.classList.add("empty");
    }
    else {
        maxScore = inputGoal.value;
        console.log("max score" , maxScore);
        scene1.style.display = "none";
        scene2.style.display = "flex";
        startGame();
    }
})

let score1 = 0;
let score2 = 0;
let current1 = 0;
let current2 = 0;
let player1Turn;
const startGame = ()=> {
    score1 = score2 = current1 = current2 = 0;
    player1Turn = true;
    holdButton.disabled = true;
    rollButton.disabled = false;
    updateValues();
}

const goHome = ()=> {
    scene1.style.display = "flex";
    scene2.style.display = "none";
}

const resetGame = ()=> {
    startGame();
}

const roll = ()=>{
    const result = rollDices();
    if(player1Turn){
        current1 += result;
        updateValues();
        if(current1 + score1 > maxScore){
            console.log("player 2 won : player 1 passed the limit");
            endGame();
        }
        else if(current1 + score1 == maxScore){
            console.log("player 1 won : player 1 got the exact score");
            endGame();
        }
        else {
            holdButton.disabled = false;
        }
    }
    if(!player1Turn){
        current2 += result;
        updateValues();
        if(current2 + score2 > maxScore){
            console.log("player 1 won : player 2 passed the limit");
            endGame();
        }
        else if(current1 + score1 == maxScore){
            console.log("player 2 won : player 2 got the exact score");
            endGame();
        }
        else {
            holdButton.disabled = false;
        }
    }
}

const hold = ()=>{
    if(player1Turn){
        score1 += current1;
        current1 = 0;
    }
    if(!player1Turn){
        score2 += current2;
        current2 = 0;
    }
    player1Turn = !player1Turn;
    updateValues();
    holdButton.disabled = true;
}

const updateValues = ()=> {
    score1Text.innerText = score1;
    score2Text.innerText = score2;
    current1Text.innerText = current1;
    current2Text.innerText = current2;
    if(player1Turn){
        turnOverlay.classList.replace("player-2" , "player-1");
    }
    else {
        turnOverlay.classList.replace("player-1" , "player-2");
    }
}

const rollDices = ()=> {
    const firstDice = Math.floor((Math.random()*6+1));
    const secondDice = Math.floor((Math.random()*6+1));
    return firstDice+secondDice;
}

const endGame = ()=> {
    rollButton.disabled = true;
    holdButton.disabled = true;
}





