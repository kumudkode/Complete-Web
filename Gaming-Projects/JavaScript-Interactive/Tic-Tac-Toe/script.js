// Tic Tac Toe Game Logic
class TicTacToe {
    constructor() {
        this.board = ['', '', '', '', '', '', '', '', ''];
        this.currentPlayer = 'X';
        this.gameActive = true;
        this.scores = {
            X: 0,
            O: 0,
            draw: 0
        };
        
        // Winning combinations (indices of board array)
        this.winningCombinations = [
            [0, 1, 2], // Top row
            [3, 4, 5], // Middle row
            [6, 7, 8], // Bottom row
            [0, 3, 6], // Left column
            [1, 4, 7], // Middle column
            [2, 5, 8], // Right column
            [0, 4, 8], // Diagonal top-left to bottom-right
            [2, 4, 6]  // Diagonal top-right to bottom-left
        ];
        
        this.initializeGame();
    }
    
    initializeGame() {
        this.loadScores();
        this.bindEvents();
        this.updateDisplay();
    }
    
    bindEvents() {
        // Bind cell click events
        const cells = document.querySelectorAll('.cell');
        cells.forEach((cell, index) => {
            cell.addEventListener('click', () => this.handleCellClick(index));
        });
        
        // Bind control button events
        document.getElementById('reset-game').addEventListener('click', () => this.resetGame());
        document.getElementById('reset-scores').addEventListener('click', () => this.resetScores());
    }
    
    handleCellClick(index) {
        // Check if cell is already filled or game is not active
        if (this.board[index] !== '' || !this.gameActive) {
            return;
        }
        
        // Make the move
        this.board[index] = this.currentPlayer;
        this.updateCellDisplay(index);
        
        // Check for win or draw
        if (this.checkWin()) {
            this.handleWin();
        } else if (this.checkDraw()) {
            this.handleDraw();
        } else {
            this.switchPlayer();
        }
    }
    
    updateCellDisplay(index) {
        const cell = document.querySelector(`[data-index="${index}"]`);
        cell.textContent = this.currentPlayer;
        cell.classList.add(this.currentPlayer.toLowerCase());
    }
    
    checkWin() {
        return this.winningCombinations.some(combination => {
            const [a, b, c] = combination;
            if (this.board[a] && this.board[a] === this.board[b] && this.board[a] === this.board[c]) {
                // Highlight winning cells
                this.highlightWinningCells(combination);
                return true;
            }
            return false;
        });
    }
    
    highlightWinningCells(combination) {
        combination.forEach(index => {
            const cell = document.querySelector(`[data-index="${index}"]`);
            cell.classList.add('winning');
        });
    }
    
    checkDraw() {
        return this.board.every(cell => cell !== '');
    }
    
    handleWin() {
        this.gameActive = false;
        this.scores[this.currentPlayer]++;
        this.saveScores();
        this.updateDisplay();
        this.showMessage(`Player ${this.currentPlayer} Wins! 🎉`, 'win');
    }
    
    handleDraw() {
        this.gameActive = false;
        this.scores.draw++;
        this.saveScores();
        this.updateDisplay();
        this.showMessage("It's a Draw! 🤝", 'draw');
    }
    
    switchPlayer() {
        this.currentPlayer = this.currentPlayer === 'X' ? 'O' : 'X';
        this.updateCurrentPlayerDisplay();
    }
    
    updateCurrentPlayerDisplay() {
        const display = document.getElementById('current-player-display');
        display.textContent = this.currentPlayer;
        display.className = this.currentPlayer === 'X' ? 'player-x' : 'player-o';
    }
    
    updateDisplay() {
        // Update current player
        this.updateCurrentPlayerDisplay();
        
        // Update scores
        document.getElementById('score-x').textContent = this.scores.X;
        document.getElementById('score-o').textContent = this.scores.O;
        document.getElementById('score-draw').textContent = this.scores.draw;
    }
    
    showMessage(text, type) {
        const messageElement = document.getElementById('game-message');
        messageElement.textContent = text;
        messageElement.className = `game-message show ${type}`;
        
        // Hide message after 3 seconds
        setTimeout(() => {
            messageElement.classList.remove('show');
        }, 3000);
    }
    
    resetGame() {
        // Reset game state
        this.board = ['', '', '', '', '', '', '', '', ''];
        this.currentPlayer = 'X';
        this.gameActive = true;
        
        // Clear board display
        const cells = document.querySelectorAll('.cell');
        cells.forEach(cell => {
            cell.textContent = '';
            cell.className = 'cell';
        });
        
        // Update display
        this.updateDisplay();
        
        // Hide any messages
        document.getElementById('game-message').classList.remove('show');
    }
    
    resetScores() {
        this.scores = { X: 0, O: 0, draw: 0 };
        this.saveScores();
        this.updateDisplay();
        this.showMessage('Scores Reset! 📊', 'win');
    }
    
    saveScores() {
        // Save scores to localStorage for persistence
        localStorage.setItem('ticTacToeScores', JSON.stringify(this.scores));
    }
    
    loadScores() {
        // Load scores from localStorage
        const savedScores = localStorage.getItem('ticTacToeScores');
        if (savedScores) {
            this.scores = JSON.parse(savedScores);
        }
    }
}

// Initialize the game when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new TicTacToe();
});

// Additional utility functions for educational purposes

/**
 * Function to demonstrate array methods used in game logic
 */
function demonstrateArrayMethods() {
    const board = ['X', '', 'O', 'X', '', '', 'O', '', 'X'];
    
    // Check if all cells are filled (draw condition)
    const isDraw = board.every(cell => cell !== '');
    console.log('Is draw:', isDraw);
    
    // Check if any cell is empty
    const hasEmptyCell = board.some(cell => cell === '');
    console.log('Has empty cell:', hasEmptyCell);
    
    // Get all X positions
    const xPositions = board
        .map((cell, index) => cell === 'X' ? index : -1)
        .filter(index => index !== -1);
    console.log('X positions:', xPositions);
    
    // Count occurrences of each player
    const playerCount = board.reduce((count, cell) => {
        if (cell === 'X') count.X++;
        if (cell === 'O') count.O++;
        return count;
    }, { X: 0, O: 0 });
    console.log('Player count:', playerCount);
}

/**
 * Function to demonstrate DOM manipulation techniques
 */
function demonstrateDOMManipulation() {
    // Get elements using different selectors
    const board = document.querySelector('.game-board');
    const cells = document.querySelectorAll('.cell');
    const firstCell = document.getElementById('0'); // If cells had IDs
    
    // Add event listeners programmatically
    cells.forEach((cell, index) => {
        cell.addEventListener('mouseenter', () => {
            if (!cell.textContent) {
                cell.style.backgroundColor = '#f0f0f0';
            }
        });
        
        cell.addEventListener('mouseleave', () => {
            cell.style.backgroundColor = '';
        });
    });
    
    // Dynamically create elements
    const newButton = document.createElement('button');
    newButton.textContent = 'Custom Button';
    newButton.className = 'control-btn';
    // document.querySelector('.game-controls').appendChild(newButton);
}

// Educational comments about key JavaScript concepts used:

/*
1. Classes and Constructor Functions:
   - Modern JavaScript class syntax for organizing code
   - Constructor method for initialization
   - Instance methods for game functionality

2. Array Methods:
   - every(): Check if all elements meet a condition (draw detection)
   - some(): Check if any element meets a condition (win detection)  
   - forEach(): Iterate through arrays (event binding)
   - map(): Transform array elements
   - filter(): Select specific elements

3. DOM Manipulation:
   - querySelector/querySelectorAll: Select elements
   - addEventListener: Handle user interactions
   - classList: Manage CSS classes
   - textContent: Update element text

4. Event Handling:
   - Click events for user interaction
   - Event delegation and binding
   - Preventing invalid moves

5. Local Storage:
   - JSON.stringify/parse for data persistence
   - Saving and loading game scores

6. Conditional Logic:
   - if/else statements for game flow
   - Ternary operators for concise conditions
   - Boolean logic for win/draw detection

7. Object and Array Management:
   - Object properties for game state
   - Array indexing for board positions
   - Nested arrays for winning combinations
*/