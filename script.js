const cards = document.querySelectorAll(".card");
let firstCard = null;
let secondCard = null;
let lockBoard = false;
let flips = 0;
const timerDisplay = document.querySelector("#time-rem");
let timeLeft = 100;
const start = document.querySelector("#start");
let done = 0;
let timerInterval;

let match_sound=new Audio("sounds/matched.m4a")
let not_match_sound=new Audio("sounds/notmatchsound.m4a")
let game_over_sound=new Audio("sounds/gameover.mp3")
let winning_audio=new Audio("sounds/winning.mp3")

function resetGame() {
    done = 0;
    flips = 0;
    firstCard = null;
    secondCard = null;
    lockBoard = false;
    clearInterval(timerInterval);
    timeLeft=100;
    timerDisplay.style.color="black";
    cards.forEach(card => {
        card.classList.remove("flipped", "matched");
        card.addEventListener("click", flipCard)
    });

}
function shuffleCards() {
    setTimeout(() => {
        let parent = document.querySelector(".container");
        let cardsArray = Array.from(document.querySelectorAll(".card"));
        cardsArray.sort(() => Math.random() - 0.5);
        cardsArray.forEach(card => parent.appendChild(card));
    }, 50)

}

start.addEventListener("click", () => {
    start.style.visibility = "hidden";
    shuffleCards(); // Shuffle before starting game
    setTimeout(startTimer, 1000); // Timer start hoga
    cards.forEach(card=>{
        card.addEventListener("click", flipCard);
    }
    );
});


function startTimer() {
    timerDisplay.innerText = timeLeft; // Set initial time
    timerInterval = setInterval(() => {
        timeLeft--;
        timerDisplay.innerText = timeLeft; // Update time on screen

        if (timeLeft <= 0) {
            timeLeft = 100;
            clearInterval(timerInterval);
            lose();
        }
        else if(timeLeft<=15){
            timerDisplay.style.color="red";
            timerDisplay.classList.add("timer-warning");
        }
    }, 1000);
}

function lose() {
    const over = document.querySelector("#game-over");
    game_over_sound.play();
    cards.forEach(card => card.removeEventListener("click", flipCard)); // Disable clicks
    over.style.visibility = "visible";
    const start1 = document.querySelector("#startme");

    start1.addEventListener("click", () => {
        over.style.visibility = "hidden";
        resetGame();
        shuffleCards(); //Shuffle before starting game
        timeLeft = 100;
        setTimeout(startTimer, 1000); //Timer start hoga
    });
}


function flipCard(){

    if (lockBoard || this===firstCard || this.classList.contains("matched")) return; // Prevent multiple clicks

    this.classList.add("flipped");
    flips++;
    document.getElementById("flips-count").innerText = flips;
    if (!firstCard) {
        firstCard = this; // Set first card
    } else {
        secondCard = this; // Set second card
        checkMatch(); // Check for match
    }

}
function gameend() {
    clearInterval(timerInterval);
    const winner = document.querySelector("#victory");
    match_sound.pause();
    winning_audio.play();
    winner.style.visibility = "visible";
    const start1 = document.querySelector("#startme2");

    start1.addEventListener("click", () => {
        winner.style.visibility = "hidden";
        resetGame();
        shuffleCards(); // Shuffle before starting game
        timeLeft = 100;
        setTimeout(startTimer, 1000); // Timer start hoga
    });
}
function checkMatch() {
    lockBoard = true; // Lock board to prevent more clicks

    let firstImg = firstCard.querySelector("img").src;
    let secondImg = secondCard.querySelector("img").src;

    if (firstImg === secondImg) {
        // Cards match
        
        setTimeout(()=>{
            firstCard.classList.add("matched");
            secondCard.classList.add("matched");
            match_sound.play();
            done += 2;
        
            firstCard = null;
            secondCard = null;
            lockBoard = false;
            if (done == cards.length) {
                gameend();
            }
        },300)
        
    } else {
        // Cards don't match, flip them back after a short delay
        
        setTimeout(() => {
            firstCard.classList.remove("flipped");
            secondCard.classList.remove("flipped");
            not_match_sound.play();
            firstCard = null;
            secondCard = null;
            lockBoard = false;
        }, 1000);
    }


}

