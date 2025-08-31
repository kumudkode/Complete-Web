// Number Guessing Game Implementation
class NumberGuessingGame {
    constructor() {
        this.difficulties = {
            easy: { min: 1, max: 50, hints: -1 }, // unlimited hints
            medium: { min: 1, max: 100, hints: 3 },
            hard: { min: 1, max: 100, hints: 1 },
            expert: { min: 1, max: 200, hints: 0 }
        };
        
        this.gameState = {
            targetNumber: null,
            attempts: 0,
            hintsUsed: 0,
            gameActive: false,
            currentDifficulty: 'hard',
            rangeMin: 1,
            rangeMax: 100
        };
        
        this.stats = {
            totalGames: 0,
            gamesWon: 0,
            bestScore: null,
            totalAttempts: 0,
            currentStreak: 0
        };
        
        this.initializeGame();
    }
    
    initializeGame() {
        this.loadStats();
        this.bindEvents();
        this.updateDisplay();
        this.startNewGame();
    }
    
    bindEvents() {
        // Input and guess button
        const guessInput = document.getElementById('guess-input');
        const submitBtn = document.getElementById('submit-guess');
        
        submitBtn.addEventListener('click', () => this.makeGuess());
        guessInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.makeGuess();
        });
        
        // Control buttons
        document.getElementById('new-game-btn').addEventListener('click', () => this.startNewGame());
        document.getElementById('difficulty-btn').addEventListener('click', () => this.showDifficultyModal());
        document.getElementById('stats-btn').addEventListener('click', () => this.showStatsModal());
        document.getElementById('hint-btn').addEventListener('click', () => this.giveHint());
        
        // Difficulty modal
        document.querySelectorAll('.difficulty-option').forEach(option => {
            option.addEventListener('click', (e) => this.selectDifficulty(e.target.closest('.difficulty-option').dataset.difficulty));
        });
        
        // Stats modal
        document.getElementById('reset-stats').addEventListener('click', () => this.resetStats());
        
        // Modal close events
        document.querySelectorAll('.close').forEach(closeBtn => {
            closeBtn.addEventListener('click', (e) => this.closeModal(e.target.closest('.modal')));
        });
        
        window.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                this.closeModal(e.target);
            }
        });
    }
    
    startNewGame() {
        const difficulty = this.difficulties[this.gameState.currentDifficulty];
        
        this.gameState.targetNumber = this.generateRandomNumber(difficulty.min, difficulty.max);
        this.gameState.attempts = 0;
        this.gameState.hintsUsed = 0;
        this.gameState.gameActive = true;
        this.gameState.rangeMin = difficulty.min;
        this.gameState.rangeMax = difficulty.max;
        
        // Reset UI
        document.getElementById('guess-input').value = '';
        document.getElementById('guess-input').disabled = false;
        document.getElementById('submit-guess').disabled = false;
        document.getElementById('mystery-display').textContent = '?';
        document.querySelector('.mystery-number').classList.remove('revealed');
        document.getElementById('hint-display').textContent = '';
        
        this.clearFeedback();
        this.updateDisplay();
        
        console.log('New game started. Target number:', this.gameState.targetNumber); // For debugging
    }
    
    generateRandomNumber(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    
    makeGuess() {
        if (!this.gameState.gameActive) return;
        
        const guessInput = document.getElementById('guess-input');
        const guess = parseInt(guessInput.value);
        
        if (!this.validateGuess(guess)) return;
        
        this.gameState.attempts++;
        
        if (guess === this.gameState.targetNumber) {
            this.handleCorrectGuess();
        } else {
            this.handleIncorrectGuess(guess);
        }
        
        guessInput.value = '';
        this.updateDisplay();
    }
    
    validateGuess(guess) {
        const difficulty = this.difficulties[this.gameState.currentDifficulty];
        
        if (isNaN(guess)) {
            this.showFeedback('Please enter a valid number!', 'invalid');
            return false;
        }
        
        if (guess < difficulty.min || guess > difficulty.max) {
            this.showFeedback(`Please enter a number between ${difficulty.min} and ${difficulty.max}!`, 'invalid');
            return false;
        }
        
        return true;
    }
    
    handleCorrectGuess() {
        this.gameState.gameActive = false;
        this.stats.totalGames++;
        this.stats.gamesWon++;
        this.stats.totalAttempts += this.gameState.attempts;
        this.stats.currentStreak++;
        
        // Update best score
        if (!this.stats.bestScore || this.gameState.attempts < this.stats.bestScore) {
            this.stats.bestScore = this.gameState.attempts;
        }
        
        this.saveStats();
        
        // Update UI
        document.getElementById('mystery-display').textContent = this.gameState.targetNumber;
        document.querySelector('.mystery-number').classList.add('revealed');
        document.getElementById('guess-input').disabled = true;
        document.getElementById('submit-guess').disabled = true;
        
        const message = this.getWinMessage();
        this.showFeedback(message, 'correct');
    }
    
    handleIncorrectGuess(guess) {
        if (guess > this.gameState.targetNumber) {
            this.showFeedback(`Too high! Try a smaller number.`, 'too-high');
        } else {
            this.showFeedback(`Too low! Try a larger number.`, 'too-low');
        }
        
        // Update range for better user experience
        if (guess > this.gameState.targetNumber && guess < this.gameState.rangeMax) {
            this.gameState.rangeMax = guess - 1;
        } else if (guess < this.gameState.targetNumber && guess > this.gameState.rangeMin) {
            this.gameState.rangeMin = guess + 1;
        }
    }
    
    getWinMessage() {
        const attempts = this.gameState.attempts;
        
        if (attempts === 1) {
            return '🎯 INCREDIBLE! You got it in one try! Are you psychic?';
        } else if (attempts <= 3) {
            return '🌟 AMAZING! Excellent guessing skills!';
        } else if (attempts <= 6) {
            return '🎉 GREAT JOB! You found it quickly!';
        } else if (attempts <= 10) {
            return '👍 WELL DONE! Good persistence!';
        } else {
            return '🎊 CONGRATULATIONS! You never gave up!';
        }
    }
    
    giveHint() {
        if (!this.gameState.gameActive) return;
        
        const difficulty = this.difficulties[this.gameState.currentDifficulty];
        
        if (difficulty.hints === 0) {
            this.showHint('No hints available in Expert mode! 💪');
            return;
        }
        
        if (difficulty.hints > 0 && this.gameState.hintsUsed >= difficulty.hints) {
            this.showHint(`You've used all ${difficulty.hints} hint(s) for this difficulty!`);
            return;
        }
        
        this.gameState.hintsUsed++;
        const hint = this.generateHint();
        this.showHint(hint);
    }
    
    generateHint() {
        const target = this.gameState.targetNumber;
        const hints = [
            `💡 The number is ${target % 2 === 0 ? 'even' : 'odd'}.`,
            `💡 The sum of its digits is ${this.getSumOfDigits(target)}.`,
            `💡 It's ${target < 50 ? 'less than' : 'greater than or equal to'} 50.`,
            `💡 It's ${this.isPrime(target) ? '' : 'not '}a prime number.`,
            `💡 It's ${target % 5 === 0 ? '' : 'not '}divisible by 5.`,
            `💡 It's in the ${this.getRange(target)} range.`,
            `💡 The number is ${target < (this.gameState.rangeMin + this.gameState.rangeMax) / 2 ? 'in the lower half' : 'in the upper half'} of the current range.`
        ];
        
        return hints[this.gameState.hintsUsed - 1] || hints[Math.floor(Math.random() * hints.length)];
    }
    
    getSumOfDigits(num) {
        return num.toString().split('').reduce((sum, digit) => sum + parseInt(digit), 0);
    }
    
    isPrime(num) {
        if (num < 2) return false;
        for (let i = 2; i <= Math.sqrt(num); i++) {
            if (num % i === 0) return false;
        }
        return true;
    }
    
    getRange(num) {
        if (num <= 25) return '1-25';
        if (num <= 50) return '26-50';
        if (num <= 75) return '51-75';
        if (num <= 100) return '76-100';
        if (num <= 150) return '101-150';
        return '151-200';
    }
    
    showFeedback(message, type) {
        const feedback = document.getElementById('feedback');
        feedback.textContent = message;
        feedback.className = `feedback show ${type}`;
        
        setTimeout(() => {
            if (type !== 'correct') {
                feedback.classList.remove('show');
            }
        }, 3000);
    }
    
    clearFeedback() {
        const feedback = document.getElementById('feedback');
        feedback.classList.remove('show');
        feedback.textContent = '';
    }
    
    showHint(hint) {
        document.getElementById('hint-display').textContent = hint;
    }
    
    selectDifficulty(difficulty) {
        this.gameState.currentDifficulty = difficulty;
        
        // Update UI
        document.querySelectorAll('.difficulty-option').forEach(option => {
            option.classList.remove('active');
        });
        document.querySelector(`[data-difficulty="${difficulty}"]`).classList.add('active');
        
        this.closeModal(document.getElementById('difficulty-modal'));
        this.startNewGame();
    }
    
    showDifficultyModal() {
        document.getElementById('difficulty-modal').style.display = 'block';
    }
    
    showStatsModal() {
        this.updateStatsDisplay();
        document.getElementById('stats-modal').style.display = 'block';
    }
    
    closeModal(modal) {
        modal.style.display = 'none';
    }
    
    updateDisplay() {
        document.getElementById('attempts').textContent = this.gameState.attempts;
        document.getElementById('best-score').textContent = this.stats.bestScore || '--';
        document.getElementById('games-played').textContent = this.stats.totalGames;
        document.getElementById('range-min').textContent = this.gameState.rangeMin;
        document.getElementById('range-max').textContent = this.gameState.rangeMax;
        
        // Update hint button
        const difficulty = this.difficulties[this.gameState.currentDifficulty];
        const hintBtn = document.getElementById('hint-btn');
        
        if (difficulty.hints === 0) {
            hintBtn.textContent = '💡 No Hints (Expert)';
            hintBtn.disabled = true;
        } else if (difficulty.hints > 0 && this.gameState.hintsUsed >= difficulty.hints) {
            hintBtn.textContent = '💡 No Hints Left';
            hintBtn.disabled = true;
        } else {
            const remaining = difficulty.hints === -1 ? '∞' : difficulty.hints - this.gameState.hintsUsed;
            hintBtn.textContent = `💡 Get Hint (${remaining})`;
            hintBtn.disabled = false;
        }
    }
    
    updateStatsDisplay() {
        document.getElementById('total-games').textContent = this.stats.totalGames;
        document.getElementById('games-won').textContent = this.stats.gamesWon;
        
        const winRate = this.stats.totalGames > 0 ? 
            Math.round((this.stats.gamesWon / this.stats.totalGames) * 100) : 0;
        document.getElementById('win-rate').textContent = `${winRate}%`;
        
        const avgAttempts = this.stats.gamesWon > 0 ?
            Math.round(this.stats.totalAttempts / this.stats.gamesWon * 10) / 10 : 0;
        document.getElementById('avg-attempts').textContent = avgAttempts;
        
        document.getElementById('best-score-stats').textContent = this.stats.bestScore || '--';
        document.getElementById('current-streak').textContent = this.stats.currentStreak;
    }
    
    resetStats() {
        if (confirm('Are you sure you want to reset all statistics? This cannot be undone.')) {
            this.stats = {
                totalGames: 0,
                gamesWon: 0,
                bestScore: null,
                totalAttempts: 0,
                currentStreak: 0
            };
            
            this.saveStats();
            this.updateDisplay();
            this.updateStatsDisplay();
            this.closeModal(document.getElementById('stats-modal'));
        }
    }
    
    saveStats() {
        localStorage.setItem('numberGuessingGameStats', JSON.stringify(this.stats));
    }
    
    loadStats() {
        const savedStats = localStorage.getItem('numberGuessingGameStats');
        if (savedStats) {
            this.stats = { ...this.stats, ...JSON.parse(savedStats) };
        }
    }
}

// Utility functions for educational purposes

/**
 * Demonstrates different random number generation techniques
 */
function demonstrateRandomGeneration() {
    // Basic random number between min and max (inclusive)
    function randomBetween(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    
    // Weighted random selection
    function weightedRandom(items, weights) {
        const totalWeight = weights.reduce((sum, weight) => sum + weight, 0);
        let random = Math.random() * totalWeight;
        
        for (let i = 0; i < items.length; i++) {
            random -= weights[i];
            if (random <= 0) {
                return items[i];
            }
        }
        
        return items[items.length - 1];
    }
    
    // Gaussian (normal) distribution random
    function gaussianRandom(mean = 0, standardDeviation = 1) {
        let u = 0, v = 0;
        while (u === 0) u = Math.random(); // Converting [0,1) to (0,1)
        while (v === 0) v = Math.random();
        
        const z = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
        return z * standardDeviation + mean;
    }
    
    console.log('Random number examples:');
    console.log('Random 1-100:', randomBetween(1, 100));
    console.log('Weighted random:', weightedRandom(['easy', 'medium', 'hard'], [0.5, 0.3, 0.2]));
    console.log('Gaussian random:', Math.round(gaussianRandom(50, 15)));
}

/**
 * Demonstrates input validation patterns
 */
function demonstrateInputValidation() {
    // Number validation
    function validateNumber(input, min, max) {
        const num = Number(input);
        
        if (isNaN(num)) {
            return { valid: false, error: 'Input is not a number' };
        }
        
        if (!Number.isInteger(num)) {
            return { valid: false, error: 'Number must be an integer' };
        }
        
        if (num < min || num > max) {
            return { valid: false, error: `Number must be between ${min} and ${max}` };
        }
        
        return { valid: true, value: num };
    }
    
    // Sanitize input
    function sanitizeInput(input) {
        return input.toString().trim().replace(/[^0-9-]/g, '');
    }
    
    console.log('Validation examples:');
    console.log('Valid input:', validateNumber('42', 1, 100));
    console.log('Invalid input:', validateNumber('abc', 1, 100));
    console.log('Sanitized input:', sanitizeInput('  123abc456  '));
}

/**
 * Demonstrates algorithm optimization techniques
 */
function demonstrateOptimization() {
    // Binary search for optimal guessing strategy
    function optimalGuess(min, max, previousGuesses = []) {
        // In a guessing game, the optimal strategy is to eliminate
        // half the remaining possibilities with each guess
        const remaining = [];
        for (let i = min; i <= max; i++) {
            if (!previousGuesses.includes(i)) {
                remaining.push(i);
            }
        }
        
        return remaining[Math.floor(remaining.length / 2)];
    }
    
    // Calculate theoretical minimum guesses needed
    function minimumGuessesNeeded(range) {
        return Math.ceil(Math.log2(range));
    }
    
    console.log('Optimization examples:');
    console.log('Optimal first guess (1-100):', optimalGuess(1, 100));
    console.log('Minimum guesses for 1-100:', minimumGuessesNeeded(100));
    console.log('Minimum guesses for 1-1000:', minimumGuessesNeeded(1000));
}

// Initialize the game when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new NumberGuessingGame();
});

/*
Educational Comments - JavaScript Concepts Demonstrated:

1. Math Object and Random Numbers:
   - Math.random() for generating random numbers
   - Math.floor() for rounding down to integers
   - Random number generation within specific ranges
   - Understanding probability and randomness

2. Input Validation and Sanitization:
   - parseInt() and Number() for type conversion
   - isNaN() for checking valid numbers
   - Range validation with conditional logic
   - User input sanitization and error handling

3. Object-Oriented Programming:
   - Class-based structure for game management
   - Method organization and encapsulation
   - State management with object properties
   - Separation of concerns between UI and logic

4. Local Storage and Data Persistence:
   - JSON.stringify() and JSON.parse() for data serialization
   - localStorage API for persistent data storage
   - Statistics tracking across game sessions
   - Data validation and error recovery

5. DOM Manipulation and Event Handling:
   - Element selection with getElementById and querySelector
   - Event listeners for user interactions
   - Dynamic content updates and style changes
   - Modal dialogs and user interface management

6. Advanced JavaScript Techniques:
   - Array methods like reduce(), includes(), forEach()
   - Template literals for string formatting
   - Conditional (ternary) operators for concise logic
   - setTimeout() for delayed UI updates

7. Algorithm Design:
   - Hint generation algorithms
   - Statistical calculations (averages, percentages)
   - Range optimization for user feedback
   - Mathematical operations for game logic

8. User Experience Design:
   - Progressive difficulty levels
   - Visual feedback for user actions
   - Accessibility considerations (keyboard support)
   - Responsive design patterns
*/