import { Snake } from './snake.js';
import { Food } from './food.js';

export class Game {
  constructor(width, height) {
    this.width = width;
    this.height = height;
    this.gridSize = 20;
    this.snake = new Snake(this.gridSize);
    this.food = new Food(this.width, this.height, this.gridSize);
    this.score = 0;
    this.isGameOver = false;
    this.lastUpdateTime = 0;
    this.updateInterval = 150; // Initial speed (milliseconds)
    this.speedIncreasePerFood = 3; // ms to decrease per food eaten
    this.minUpdateInterval = 40; // Fastest possible speed
    this.backgroundColor = '#ecf0f1';
    this.lastBackgroundChangeScore = 0;
    
    // Callbacks
    this.onScoreUpdate = null;
    this.onGameOver = null;
    this.onBackgroundChange = null;
    this.onSpeedChange = null;
    
    // Generate initial food
    this.food.generate(this.snake.body);
  }
  
  update() {
    const now = Date.now();
    
    if (now - this.lastUpdateTime > this.updateInterval) {
      this.lastUpdateTime = now;
      
      // Move snake
      this.snake.move();
      
      // Handle wrapping around edges
      this.handleEdgeWrapping();
      
      // Check self collision - game over if snake touches itself
      if (this.snake.checkSelfCollision()) {
        this.gameOver();
        return;
      }
      
      // Check food collision
      if (this.checkFoodCollision()) {
        this.snake.grow();
        this.food.generate(this.snake.body);
        this.score += 1; // Each food is worth 1 point
        
        // Increase speed each time food is eaten
        this.increaseSpeed();
        
        // Change background color every 10 points
        if (Math.floor(this.score / 10) > Math.floor(this.lastBackgroundChangeScore / 10)) {
          this.changeBackgroundColor();
        }
        
        this.lastBackgroundChangeScore = this.score;
        
        if (this.onScoreUpdate) {
          this.onScoreUpdate(this.score);
        }
      }
    }
  }
  
  increaseSpeed() {
    // Calculate new speed
    const oldSpeed = this.updateInterval;
    this.updateInterval = Math.max(this.minUpdateInterval, this.updateInterval - this.speedIncreasePerFood);
    
    // Notify about speed change if callback exists
    if (this.onSpeedChange && oldSpeed !== this.updateInterval) {
      this.onSpeedChange(this.updateInterval);
    }
  }
  
  handleEdgeWrapping() {
    const head = this.snake.body[0];
    
    // Wrap horizontally
    if (head.x < 0) {
      head.x = this.width - this.gridSize;
    } else if (head.x >= this.width) {
      head.x = 0;
    }
    
    // Wrap vertically
    if (head.y < 0) {
      head.y = this.height - this.gridSize;
    } else if (head.y >= this.height) {
      head.y = 0;
    }
  }
  
  draw(ctx) {
    // Fill background
    ctx.fillStyle = this.backgroundColor;
    ctx.fillRect(0, 0, this.width, this.height);
    
    // Draw grid
    this.drawGrid(ctx);
    
    // Draw portal effects at edges
    this.drawPortalEffects(ctx);
    
    // Draw food
    this.food.draw(ctx);
    
    // Draw snake
    this.snake.draw(ctx);
  }
  
  drawGrid(ctx) {
    ctx.strokeStyle = this.getContrastingGridColor();
    ctx.lineWidth = 0.5;
    
    // Draw vertical lines
    for (let x = 0; x <= this.width; x += this.gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, this.height);
      ctx.stroke();
    }
    
    // Draw horizontal lines
    for (let y = 0; y <= this.height; y += this.gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(this.width, y);
      ctx.stroke();
    }
  }
  
  drawPortalEffects(ctx) {
    // Create a subtle portal effect at the edges
    const gradientSize = 10;
    
    // Top edge
    const topGradient = ctx.createLinearGradient(0, 0, 0, gradientSize);
    topGradient.addColorStop(0, 'rgba(41, 128, 185, 0.5)');
    topGradient.addColorStop(1, 'rgba(41, 128, 185, 0)');
    ctx.fillStyle = topGradient;
    ctx.fillRect(0, 0, this.width, gradientSize);
    
    // Bottom edge
    const bottomGradient = ctx.createLinearGradient(0, this.height - gradientSize, 0, this.height);
    bottomGradient.addColorStop(0, 'rgba(41, 128, 185, 0)');
    bottomGradient.addColorStop(1, 'rgba(41, 128, 185, 0.5)');
    ctx.fillStyle = bottomGradient;
    ctx.fillRect(0, this.height - gradientSize, this.width, gradientSize);
    
    // Left edge
    const leftGradient = ctx.createLinearGradient(0, 0, gradientSize, 0);
    leftGradient.addColorStop(0, 'rgba(41, 128, 185, 0.5)');
    leftGradient.addColorStop(1, 'rgba(41, 128, 185, 0)');
    ctx.fillStyle = leftGradient;
    ctx.fillRect(0, 0, gradientSize, this.height);
    
    // Right edge
    const rightGradient = ctx.createLinearGradient(this.width - gradientSize, 0, this.width, 0);
    rightGradient.addColorStop(0, 'rgba(41, 128, 185, 0)');
    rightGradient.addColorStop(1, 'rgba(41, 128, 185, 0.5)');
    ctx.fillStyle = rightGradient;
    ctx.fillRect(this.width - gradientSize, 0, gradientSize, this.height);
  }
  
  changeDirection(direction) {
    this.snake.changeDirection(direction);
  }
  
  checkFoodCollision() {
    const head = this.snake.body[0];
    return head.x === this.food.x && head.y === this.food.y;
  }
  
  gameOver() {
    this.isGameOver = true;
    if (this.onGameOver) {
      this.onGameOver();
    }
  }
  
  changeBackgroundColor() {
    // Generate a pastel color
    const hue = Math.floor(Math.random() * 360);
    const saturation = 30 + Math.floor(Math.random() * 30); // 30-60%
    const lightness = 80 + Math.floor(Math.random() * 10); // 80-90%
    
    this.backgroundColor = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
    
    if (this.onBackgroundChange) {
      this.onBackgroundChange(this.backgroundColor);
    }
  }
  
  getContrastingGridColor() {
    // Simple way to get a contrasting color for the grid
    // Extract HSL values from the background color
    const hslMatch = this.backgroundColor.match(/hsl\((\d+),\s*(\d+)%,\s*(\d+)%\)/);
    
    if (hslMatch) {
      const lightness = parseInt(hslMatch[3]);
      return lightness > 50 ? 'rgba(0, 0, 0, 0.1)' : 'rgba(255, 255, 255, 0.2)';
    }
    
    // Default grid color if not using HSL
    return '#e6e6e6';
  }
  
  // Get current speed as percentage (0-100)
  getSpeedPercentage() {
    const range = 150 - this.minUpdateInterval; // Total possible speed range
    const current = 150 - this.updateInterval; // Current speed within that range
    return Math.floor((current / range) * 100);
  }
}
