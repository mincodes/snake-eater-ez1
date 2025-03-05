export class Snake {
  constructor(gridSize) {
    this.gridSize = gridSize;
    this.body = [
      { x: 5 * gridSize, y: 5 * gridSize }
    ];
    this.direction = 'right';
    this.nextDirection = 'right';
    this.growing = false;
    this.lastMoveTime = 0; // Track last move time to prevent rapid direction changes
  }
  
  draw(ctx) {
    // Draw snake body
    ctx.fillStyle = '#3498db';
    for (let i = 1; i < this.body.length; i++) {
      ctx.fillRect(
        this.body[i].x,
        this.body[i].y,
        this.gridSize,
        this.gridSize
      );
    }
    
    // Draw snake head
    ctx.fillStyle = '#2980b9';
    ctx.fillRect(
      this.body[0].x,
      this.body[0].y,
      this.gridSize,
      this.gridSize
    );
    
    // Draw eyes
    ctx.fillStyle = 'white';
    const eyeSize = this.gridSize / 5;
    const eyeOffset = this.gridSize / 3;
    
    let leftEyeX, leftEyeY, rightEyeX, rightEyeY;
    
    switch (this.direction) {
      case 'up':
        leftEyeX = this.body[0].x + eyeOffset;
        leftEyeY = this.body[0].y + eyeOffset;
        rightEyeX = this.body[0].x + this.gridSize - eyeOffset - eyeSize;
        rightEyeY = this.body[0].y + eyeOffset;
        break;
      case 'down':
        leftEyeX = this.body[0].x + eyeOffset;
        leftEyeY = this.body[0].y + this.gridSize - eyeOffset - eyeSize;
        rightEyeX = this.body[0].x + this.gridSize - eyeOffset - eyeSize;
        rightEyeY = this.body[0].y + this.gridSize - eyeOffset - eyeSize;
        break;
      case 'left':
        leftEyeX = this.body[0].x + eyeOffset;
        leftEyeY = this.body[0].y + eyeOffset;
        rightEyeX = this.body[0].x + eyeOffset;
        rightEyeY = this.body[0].y + this.gridSize - eyeOffset - eyeSize;
        break;
      case 'right':
        leftEyeX = this.body[0].x + this.gridSize - eyeOffset - eyeSize;
        leftEyeY = this.body[0].y + eyeOffset;
        rightEyeX = this.body[0].x + this.gridSize - eyeOffset - eyeSize;
        rightEyeY = this.body[0].y + this.gridSize - eyeOffset - eyeSize;
        break;
    }
    
    ctx.fillRect(leftEyeX, leftEyeY, eyeSize, eyeSize);
    ctx.fillRect(rightEyeX, rightEyeY, eyeSize, eyeSize);
  }
  
  move() {
    // Update direction
    this.direction = this.nextDirection;
    
    // Create new head position
    const head = { ...this.body[0] };
    
    // Move head based on direction
    switch (this.direction) {
      case 'up':
        head.y -= this.gridSize;
        break;
      case 'down':
        head.y += this.gridSize;
        break;
      case 'left':
        head.x -= this.gridSize;
        break;
      case 'right':
        head.x += this.gridSize;
        break;
    }
    
    // Add new head to the beginning of the body
    this.body.unshift(head);
    
    // Remove tail if not growing
    if (!this.growing) {
      this.body.pop();
    } else {
      this.growing = false;
    }
    
    // Update last move time
    this.lastMoveTime = Date.now();
  }
  
  changeDirection(newDirection) {
    // Prevent 180-degree turns
    if (
      (this.direction === 'up' && newDirection === 'down') ||
      (this.direction === 'down' && newDirection === 'up') ||
      (this.direction === 'left' && newDirection === 'right') ||
      (this.direction === 'right' && newDirection === 'left')
    ) {
      return;
    }
    
    // Prevent multiple direction changes between moves
    // This fixes the bug where pressing two arrow keys quickly could cause self-collision
    const now = Date.now();
    if (now - this.lastMoveTime < 50) {
      return;
    }
    
    this.nextDirection = newDirection;
  }
  
  grow() {
    this.growing = true;
  }
  
  checkSelfCollision() {
    const head = this.body[0];
    
    // Check if head collides with any part of the body
    for (let i = 1; i < this.body.length; i++) {
      if (head.x === this.body[i].x && head.y === this.body[i].y) {
        return true;
      }
    }
    
    return false;
  }
}
