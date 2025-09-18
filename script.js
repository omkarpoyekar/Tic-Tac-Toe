const gameBoard = document.getElementById('gameBoard');
const currentPlayerDisplay = document.getElementById('currentPlayer');
const statusDisplay = document.getElementById('status');
const resetBtn = document.getElementById('resetBtn');
const cells = document.querySelectorAll('[data-cell]');
const scoreDisplays = {
    X: document.getElementById('scoreX'),
    O: document.getElementById('scoreO'),
    draws: document.getElementById('scoreDraws')
};
const scoreCards = {
    X: document.querySelector('[data-score-card="X"]'),
    O: document.querySelector('[data-score-card="O"]'),
    draws: document.querySelector('[data-score-card="draws"]')
};

let currentPlayer = 'X';
let gameActive = true;
let gameState = ['', '', '', '', '', '', '', '', ''];
const scores = {
    X: 0,
    O: 0,
    draws: 0
};

const winningConditions = [
    [0, 1, 2], // Top row
    [3, 4, 5], // Middle row
    [6, 7, 8], // Bottom row
    [0, 3, 6], // Left column
    [1, 4, 7], // Middle column
    [2, 5, 8], // Right column
    [0, 4, 8], // Diagonal top-left to bottom-right
    [2, 4, 6]  // Diagonal top-right to bottom-left
];

function startGame() {
    gameActive = true;
    gameState = ['', '', '', '', '', '', '', '', ''];
    currentPlayer = 'X';
    currentPlayerDisplay.textContent = currentPlayer;
    setStatus('Player X, it\'s your turn!');
    updateScoreboard();
    cells.forEach(cell => {
        cell.textContent = '';
        cell.classList.remove('x', 'o', 'winner');
        cell.removeEventListener('click', handleCellClick);
        cell.addEventListener('click', handleCellClick, { once: true });
    });
}

function handleCellClick(e) {
    const cell = e.target;
    const cellIndex = Array.from(cells).indexOf(cell);

    if (gameState[cellIndex] !== '' || !gameActive) {
        return;
    }

    gameState[cellIndex] = currentPlayer;
    cell.classList.add(currentPlayer.toLowerCase());

    if (checkWin()) {
        endGame(currentPlayer);
        return;
    }

    if (checkDraw()) {
        endGame('draw');
        return;
    }

    switchPlayer();
}

function switchPlayer() {
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    currentPlayerDisplay.textContent = currentPlayer;
    updateTurnMessage();
}

function checkWin() {
    return winningConditions.some(condition => {
        return condition.every(index => {
            return gameState[index] === currentPlayer;
        });
    });
}

function checkDraw() {
    return gameState.every(cell => cell !== '');
}

function highlightWinningCells(winner) {
    winningConditions.forEach(condition => {
        if (condition.every(index => gameState[index] === winner)) {
            condition.forEach(index => {
                cells[index].classList.add('winner');
            });
        }
    });
}

function resetGame() {
    startGame();
}

function setStatus(message, stateClass = '') {
    statusDisplay.textContent = message;
    statusDisplay.classList.remove('status-win', 'status-draw');
    if (stateClass) {
        statusDisplay.classList.add(stateClass);
    }
}

function updateTurnMessage() {
    if (!gameActive) {
        return;
    }
    setStatus(`Player ${currentPlayer}, it's your turn!`);
}

function endGame(result) {
    gameActive = false;
    if (result === 'draw') {
        setStatus("It's a draw!", 'status-draw');
        scores.draws += 1;
    } else {
        setStatus(`Player ${result} wins!`, 'status-win');
        highlightWinningCells(result);
        scores[result] += 1;
    }
    updateScoreboard();
}

function updateScoreboard() {
    scoreDisplays.X.textContent = scores.X;
    scoreDisplays.O.textContent = scores.O;
    scoreDisplays.draws.textContent = scores.draws;

    Object.values(scoreCards).forEach(card => card.classList.remove('leader'));
    const highestScore = Math.max(...Object.values(scores));
    if (highestScore > 0) {
        Object.entries(scores).forEach(([player, value]) => {
            if (value === highestScore) {
                scoreCards[player].classList.add('leader');
            }
        });
    }
}

// Event listeners
resetBtn.addEventListener('click', resetGame);

// Start the game when the page loads
document.addEventListener('DOMContentLoaded', startGame);
