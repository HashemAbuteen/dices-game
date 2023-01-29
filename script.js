const startButton = document.getElementById("start-button");
const inputGoal = document.getElementById("goal");
const scene1 = document.getElementById("scene-1");
const scene2 = document.getElementById("scene-2");
const holdButton = document.getElementById("hold-button");
const stopButton = document.getElementById("stop-button");
const score1Text = document.getElementById("score-1");
const score2Text = document.getElementById("score-2");
const current1Text = document.getElementById("current-1");
const current2Text = document.getElementById("current-2");
const rollButton = document.getElementById("roll-button");
const player1Section = document.getElementById("player-1-section")
const player2Section = document.getElementById("player-2-section");
const turnOverlay = document.getElementById("turn-overlay");
const firstDice = document.getElementById("first-dice");
const secondDice = document.getElementById("second-dice");
const winnerAnnouncment = document.getElementById("winner-announcment");
const tragetLabel = document.getElementById("target-label");
const player1AllWins = document.getElementsByClassName("all-time-wins")[0];
const player2AllWins = document.getElementsByClassName("all-time-wins")[1];
const playersList = document.getElementById("players-names");
const player1Name = document.getElementById("player-1-name");
const player2Name = document.getElementById("player-2-name");
const player1NameLabel = document.getElementsByClassName("player-name")[0];
const player2NameLabel = document.getElementsByClassName("player-name")[1];

let maxScore;
let score1 = 0;
let score2 = 0;
let current1 = 0;
let current2 = 0;
let player1Turn;
let player1Wins = localStorage.getItem("player1-total-score") || 0;
let player2Wins = localStorage.getItem("player2-total-score") || 0;
let playersStoredList;

const updatePlayerList = ()=>{
    playersStoredList =  JSON.parse(localStorage.getItem("players-list")) || [];
    playersList.innerText = "";
    playersStoredList.forEach(player => {
        const element = document.createElement("option");
        element.value = player;
        playersList.appendChild(element);
    });
};

updatePlayerList();


startButton.addEventListener("click" , (event)=> {
    if(inputGoal.value === "" || inputGoal.value>100){
        inputGoal.classList.add("empty");
    }
    else {
        maxScore = inputGoal.value;
        scene1.style.display = "none";
        scene2.style.display = "flex";
        tragetLabel.innerText = "Target: " + maxScore;
        if(!playersStoredList.includes(player1Name.value)){
            playersStoredList.push(player1Name.value);
        }
        if(!playersStoredList.includes( player2Name.value)){
            playersStoredList.push(player2Name.value);
        }
        localStorage.setItem("players-list" , JSON.stringify(playersStoredList) );
        updatePlayerList();
        startGame();
    }
});

const resetNames = ()=> {
    localStorage.setItem("players-list" , JSON.stringify([]));
    updatePlayerList();
}

const resetScores = ()=> {
    localStorage.setItem("scores" , JSON.stringify({}));
    localStorage.setItem("player1-total-score" , 0);
    localStorage.setItem("player2-total-score" , 0);
}


const startGame = ()=> {
    score1 = score2 = current1 = current2 = 0;
    player1Turn = true;
    holdButton.disabled = true;
    rollButton.disabled = false;
    stopButton.disabled = true;
    winnerAnnouncment.innerText = "";
    player1Section.classList.remove("winner" , "loser");
    player2Section.classList.remove("winner" , "loser");
    turnOverlay.classList.add("starting");
    turnOverlay.classList.remove("end");
    setTimeout(()=>turnOverlay.classList.remove("starting") , 200);
    player1NameLabel.innerText = player1Name.value || "Player 1";
    player2NameLabel.innerText = player2Name.value || "Player 2";
    updateValues();
}

const goHome = ()=> {
    scene1.style.display = "flex";
    scene2.style.display = "none";
}

const resetGame = ()=> {
    startGame();
}

let rolling = true;
const roll = ()=>{
    rolling = true;
    startRoll();
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
    player1AllWins.innerText = player1Wins;
    player2AllWins.innerText = player2Wins;
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

const endGame = (winner , message)=> {
    turnOverlay.classList.add("end");
    if(winner === 1){
        player1Section.classList.add("winner");
        player2Section.classList.add("loser");
        winnerAnnouncment.innerText = message;
        player1Wins ++;
        localStorage.setItem("player1-total-score" , player1Wins);
    }
    if(winner === 2){
        player2Section.classList.add("winner");
        player1Section.classList.add("loser");
        winnerAnnouncment.innerText = message;
        player2Wins ++;
        localStorage.setItem("player2-total-score" , player2Wins);
    }
    rollButton.disabled = true;
    holdButton.disabled = true;
    updateValues();
}

const startRoll = ()=> {
    if(rolling){
        rollButton.disabled = true;
        stopButton.disabled = false;
        holdButton.disabled = true;
        const first =  Math.floor((Math.random()*6+1));
        const second = Math.floor((Math.random()*6+1));
        firstDice.src = "./imgs/dice" + first + ".png";
        secondDice.src = "./imgs/dice" + second + ".png";
        setTimeout(startRoll , 100);
    }
}

const stopRolling = ()=> {
    rolling = false;
    const result = getResult();
    rollButton.disabled = false;
    if(result === 12){
        current1 = 0;
        current2 = 0;
        hold();
    }
    stopButton.disabled = true;
    if(player1Turn){
        current1 += result;
        updateValues();
        if(current1 + score1 > maxScore){
            endGame(2 , "player 2 won : player 1 passed the limit");
        }
        else if(current1 + score1 == maxScore){
            endGame(1 , "player 1 won : player 1 got the exact score");
        }
        else {
            holdButton.disabled = false;
        }
    }
    if(!player1Turn){
        current2 += result;
        updateValues();
        if(current2 + score2 > maxScore){
            endGame(1 , "player 1 won : player 2 passed the limit");
        }
        else if(current1 + score1 == maxScore){
            endGame(2 , "player 2 won : player 2 got the exact score");
        }
        else {
            holdButton.disabled = false;
        }
    }
}

const getResult = ()=>{
    const firstResult = Number(firstDice.src.charAt(firstDice.src.indexOf(".png")-1));
    const secondResult = Number(secondDice.src.charAt(secondDice.src.indexOf(".png")-1));
    return firstResult + secondResult;
}




