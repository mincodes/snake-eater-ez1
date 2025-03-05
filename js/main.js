import { Game } from './game.js';
import { renderGameOver } from './ui.js';
import { Leaderboard } from './leaderboard.js';

const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');
const startButton = document.getElementById('start-button');
const restartButton = document.getElementById('restart-button');
const nameModal = document.getElementById('name-modal');
const finalScoreElement = document.getElementById('final-score');
const playerNameInput = document.getElementById('player-name');
const saveScoreButton = document.getElementById('save-score');
const speedIndicator = document.getElementById('speed-indicator');
const speedBar = document.getElementById('speed-bar');

// Touch controls
const upBtn = document.getElementById('up-btn');
const leftBtn = document.getElementById('left-btn');
const rightBtn = document.getElementById('right-btn');
const downBtn = document.getElementById('down-btn');

let game = null;
let gameRunning = false;
const leaderboard = new Leaderboard();

function updateScore(score) {
  scoreElement.textContent = score;
  
  // Add milestone indicator when reaching multiples of 10
  if (score > 0 && score % 10 === 0) {
    const milestoneIndicator = document.createElement('div');
    milestoneIndicator.className = 'milestone-indicator';
    milestoneIndicator.textContent = `${score} points!`;
    document.querySelector('.game-container').appendChild(milestoneIndicator);
    
    // Remove the indicator after animation completes
    setTimeout(() => {
      milestoneIndicator.remove();
    }, 2000);
  }
}

function updateSpeed(interval) {
  // Update speed percentage in the speed bar
  const speedPercentage = game.getSpeedPercentage();
  speedBar.style.width = `${speedPercentage}%`;
  
  // Change color based on speed
  if (speedPercentage < 33) {
    speedBar.style.backgroundColor = '#2ecc71'; // Green
  } else if (speedPercentage < 66) {
    speedBar.style.backgroundColor = '#f39c12'; // Orange
  } else {
    speedBar.style.backgroundColor = '#e74c3c'; // Red
  }
  
  // Flash effect on speed increase
  speedIndicator.classList.add('speed-flash');
  setTimeout(() => {
    speedIndicator.classList.remove('speed-flash');
  }, 300);
}

function updateBackground(color) {
  // Apply a transition effect to the canvas background
  canvas.style.transition = 'background-color 0.5s ease';
  canvas.style.backgroundColor = color;
  
  // Create a visual flash effect
  const gameContainer = document.querySelector('.game-container');
  gameContainer.classList.add('background-flash');
  setTimeout(() => {
    gameContainer.classList.remove('background-flash');
  }, 300);
}

function startGame() {
  // Prevent multiple game instances
  if (gameRunning) return;
  
  game = new Game(canvas.width, canvas.height);
  game.onScoreUpdate = updateScore;
  game.onGameOver = handleGameOver;
  game.onBackgroundChange = updateBackground;
  game.onSpeedChange = updateSpeed;
  
  gameRunning = true;
  
  // Reset canvas background
  canvas.style.backgroundColor = '#ecf0f1';
  
  // Reset speed bar
  speedBar.style.width = '0%';
  speedBar.style.backgroundColor = '#2ecc71';
  
  startButton.style.display = 'none';
  restartButton.style.display = 'none';
  
  // Update game instructions
  const instructionsElement = document.querySelector('.game-controls p');
  instructionsElement.textContent = 'Use arrow keys or touch controls to move the snake. The snake gets faster with each food eaten!';
  
  // Reset score display
  scoreElement.textContent = '0';
  
  // Start game loop
  requestAnimationFrame(gameLoop);
}

function handleGameOver() {
  gameRunning = false;
  renderGameOver(ctx, canvas.width, canvas.height, game.score);
  restartButton.style.display = 'block';
  
  // Show name input modal
  finalScoreElement.textContent = game.score;
  nameModal.style.display = 'flex';
  
  // Focus on input after a short delay (for mobile devices)
  setTimeout(() => {
    playerNameInput.focus();
  }, 300);
}

function saveScore() {
  const playerName = playerNameInput.value.trim() || 'Player';
  leaderboard.addScore(playerName, game.score);
  leaderboard.renderLeaderboard();
  nameModal.style.display = 'none';
  
  // Clear input for next time
  playerNameInput.value = '';
}

function gameLoop(timestamp) {
  if (!game || game.isGameOver) return;
  
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  game.update();
  game.draw(ctx);
  
  requestAnimationFrame(gameLoop);
}

function changeDirection(direction) {
  if (!game || !gameRunning) return;
  game.changeDirection(direction);
}

// Event listeners
startButton.addEventListener('click', startGame);
restartButton.addEventListener('click', startGame);
saveScoreButton.addEventListener('click', saveScore);

// Allow pressing Enter to save score
playerNameInput.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    saveScore();
  }
});

// Prevent arrow keys from scrolling the page
window.addEventListener('keydown', (event) => {
  if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(event.key)) {
    event.preventDefault();
  }
});

document.addEventListener('keydown', (event) => {
  switch (event.key) {
    case 'ArrowUp':
      changeDirection('up');
      break;
    case 'ArrowDown':
      changeDirection('down');
      break;
    case 'ArrowLeft':
      changeDirection('left');
      break;
    case 'ArrowRight':
      changeDirection('right');
      break;
    case ' ': // Space bar to start/restart
      if (!gameRunning) {
        startGame();
      }
      break;
  }
});

// Touch controls
upBtn.addEventListener('touchstart', (e) => {
  e.preventDefault();
  changeDirection('up');
});

downBtn.addEventListener('touchstart', (e) => {
  e.preventDefault();
  changeDirection('down');
});

leftBtn.addEventListener('touchstart', (e) => {
  e.preventDefault();
  changeDirection('left');
});

rightBtn.addEventListener('touchstart', (e) => {
  e.preventDefault();
  changeDirection('right');
});

// Also support clicks for testing on desktop
upBtn.addEventListener('click', () => changeDirection('up'));
downBtn.addEventListener('click', () => changeDirection('down'));
leftBtn.addEventListener('click', () => changeDirection('left'));
rightBtn.addEventListener('click', () => changeDirection('right'));

// Initialize leaderboard
leaderboard.renderLeaderboard();
