export function renderGameOver(ctx, width, height, score) {
  // Semi-transparent overlay
  ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
  ctx.fillRect(0, 0, width, height);
  
  // Game over text
  ctx.fillStyle = 'white';
  ctx.font = 'bold 36px Arial';
  ctx.textAlign = 'center';
  ctx.fillText('GAME OVER', width / 2, height / 2 - 40);
  
  // Score text
  ctx.font = '24px Arial';
  ctx.fillText(`Score: ${score}`, width / 2, height / 2 + 10);
  
  // Instruction text
  ctx.font = '18px Arial';
  ctx.fillText('Click Restart to play again', width / 2, height / 2 + 50);
}
