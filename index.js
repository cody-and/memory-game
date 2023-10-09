const tilesContainer = document.querySelector(".tiles");
const colors = ["red", "blue", "yellow", "orange", "palevioletred", "purple", "greenyellow", "white"];
let colorsPicklist = [];
const tileCount = colors.length * 2;

// Game state
let revealedCount = 0;
let activeTile = null;
let awaitingEndOfMove = false;
let gameStarted = false; // Track whether the game has started
let startTime = 0;
let timerInterval;

// Reset button element
const resetButton = document.getElementById("resetButton");
resetButton.addEventListener("click", resetGame);

const startButton = document.getElementById("startButton");
startButton.addEventListener("click", startGame);

// Timer display element
const timerDisplay = document.getElementById("timerDisplay");

function resetGame() {
    tilesContainer.innerHTML = ''; 
    colorsPicklist = [...colors, ...colors]; 
    initializeGame();
    clearInterval(timerInterval); 
    timerDisplay.textContent = "0 "; 
    gameStarted = false;
}

function startGame() {
    if (!gameStarted) {
        gameStarted = true;
        startTime = Date.now();
        timerInterval = setInterval(updateTimer, 1000);
    }
}

function updateTimer() {
    const currentTime = Date.now();
    const elapsedTime = Math.floor((currentTime - startTime) / 1000);
    timerDisplay.textContent = elapsedTime;
}

function buildTile(color) {
    const element = document.createElement("div");

    element.classList.add("tile");
    element.setAttribute("data-color", color);
    element.setAttribute("data-revealed", "false");

    element.addEventListener("click", () => {
        const revealed = element.getAttribute("data-revealed");

        if (
            awaitingEndOfMove
            || revealed === "true"
            || element == activeTile
            || !gameStarted // Check if the game has started
        ) {
            return;
        }

        // Reveal this color
        element.style.backgroundColor = color;

        if (!activeTile) {
            activeTile = element;

            return;
        }

        const colorToMatch = activeTile.getAttribute("data-color");

        if (colorToMatch === color) {
            element.setAttribute("data-revealed", "true");
            activeTile.setAttribute("data-revealed", "true");

            activeTile = null;
            awaitingEndOfMove = false;
            revealedCount += 2;

            if (revealedCount === tileCount) {
                // You can add your custom win logic here
                // For example, show a message or perform some action
            }

            return;
        }

        awaitingEndOfMove = true;

        setTimeout(() => {
            activeTile.style.backgroundColor = null;
            element.style.backgroundColor = null;

            awaitingEndOfMove = false;
            activeTile = null;
        }, 1000);
    });

    return element;
}

function initializeGame() {
    revealedCount = 0;
    activeTile = null;
    awaitingEndOfMove = false;

    for (let i = 0; i < tileCount; i++) {
        const randomIndex = Math.floor(Math.random() * colorsPicklist.length);
        const color = colorsPicklist[randomIndex];
        const tile = buildTile(color);

        colorsPicklist.splice(randomIndex, 1);
        tilesContainer.appendChild(tile);
    }

    tilesContainer.appendChild(resetButton); 
}

