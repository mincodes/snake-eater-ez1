export class Leaderboard {
  constructor() {
    this.scores = this.loadScores();
    this.leaderboardElement = document.getElementById('leaderboard-entries');
    this.lastAddedId = null;
  }
  
  loadScores() {
    try {
      const savedScores = localStorage.getItem('snakeEaterScores');
      return savedScores ? JSON.parse(savedScores) : [];
    } catch (error) {
      console.error('Error loading scores from localStorage:', error);
      return [];
    }
  }
  
  saveScores() {
    try {
      localStorage.setItem('snakeEaterScores', JSON.stringify(this.scores));
    } catch (error) {
      console.error('Error saving scores to localStorage:', error);
    }
  }
  
  addScore(playerName, score) {
    // Sanitize input
    const sanitizedName = playerName.substring(0, 15).trim() || 'Player';
    
    // Create a new score entry
    const newScore = {
      name: sanitizedName,
      score: score,
      date: new Date().toISOString(),
      id: Date.now() // Unique identifier
    };
    
    // Add to scores array
    this.scores.push(newScore);
    
    // Sort scores (highest first)
    this.scores.sort((a, b) => b.score - a.score);
    
    // Keep only top 10 scores
    if (this.scores.length > 10) {
      this.scores = this.scores.slice(0, 10);
    }
    
    // Save to localStorage
    this.saveScores();
    
    // Remember the ID of the last added score
    this.lastAddedId = newScore.id;
    
    return newScore.id;
  }
  
  renderLeaderboard() {
    // Clear current leaderboard
    this.leaderboardElement.innerHTML = '';
    
    if (this.scores.length === 0) {
      const noScoresElement = document.createElement('p');
      noScoresElement.className = 'no-scores';
      noScoresElement.textContent = 'No scores yet';
      this.leaderboardElement.appendChild(noScoresElement);
      return;
    }
    
    // Add each score to the leaderboard
    this.scores.forEach((score, index) => {
      const scoreElement = document.createElement('div');
      scoreElement.className = 'leaderboard-entry';
      
      // Highlight if it's the most recently added score
      if (score.id === this.lastAddedId) {
        scoreElement.classList.add('highlight');
      }
      
      const rankElement = document.createElement('span');
      rankElement.className = 'rank';
      rankElement.textContent = `${index + 1}.`;
      
      const nameElement = document.createElement('span');
      nameElement.className = 'name';
      nameElement.textContent = score.name;
      
      const scoreValueElement = document.createElement('span');
      scoreValueElement.className = 'score-value';
      scoreValueElement.textContent = score.score;
      
      scoreElement.appendChild(rankElement);
      scoreElement.appendChild(nameElement);
      scoreElement.appendChild(scoreValueElement);
      
      this.leaderboardElement.appendChild(scoreElement);
    });
  }
  
  clearScores() {
    this.scores = [];
    this.saveScores();
    this.renderLeaderboard();
  }
}
