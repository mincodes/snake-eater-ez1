export class Food {
  constructor(canvasWidth, canvasHeight, gridSize) {
    this.canvasWidth = canvasWidth;
    this.canvasHeight = canvasHeight;
    this.gridSize = gridSize;
    this.x = 0;
    this.y = 0;
    this.color = '#e74c3c';
    this.maxAttempts = 100; // Prevent infinite loop
  }
  
  generate(snakeBody) {
    let validPosition = false;
    let attempts = 0;
    
    while (!validPosition && attempts < this.maxAttempts) {
      attempts++;
      
      // Generate random position aligned to grid
      this.x = Math.floor(Math.random() * (this.canvasWidth / this.gridSize)) * this.gridSize;
      this.y = Math.floor(Math.random() * (this.canvasHeight / this.gridSize)) * this.gridSize;
      
      // Check if position overlaps with snake
      validPosition = true;
      for (const segment of snakeBody) {
        if (this.x === segment.x && this.y === segment.y) {
          validPosition = false;
          break;
        }
      }
    }
    
    // If we couldn't find a valid position after max attempts,
    // find any position that's not the snake's head
    if (!validPosition) {
      const head = snakeBody[0];
      
      // Try a few fixed positions until we find one that's not the head
      const positions = [
        { x: 0, y: 0 },
        { x: this.canvasWidth - this.gridSize, y: 0 },
        { x: 0, y: this.canvasHeight - this.gridSize },
        { x: this.canvasWidth - this.gridSize, y: this.canvasHeight - this.gridSize },
        { x: Math.floor(this.canvasWidth / 2 / this.gridSize) * this.gridSize, 
          y: Math.floor(this.canvasHeight / 2 / this.gridSize) * this.gridSize }
      ];
      
      for (const pos of positions) {
        if (pos.x !== head.x || pos.y !== head.y) {
          this.x = pos.x;
          this.y = pos.y;
          break;
        }
      }
    }
  }
  
  draw(ctx) {
    ctx.fillStyle = this.color;
    
    // Draw apple-like food
    ctx.beginPath();
    ctx.arc(
      this.x + this.gridSize / 2,
      this.y + this.gridSize / 2,
      this.gridSize / 2,
      0,
      Math.PI * 2
    );
    ctx.fill();
    
    // Draw stem
    ctx.fillStyle = '#27ae60';
    ctx.fillRect(
      this.x + this.gridSize / 2 - 1,
      this.y,
      2,
      this.gridSize / 4
    );
  }
}
