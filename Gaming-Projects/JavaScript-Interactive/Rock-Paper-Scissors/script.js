// Rock Paper Scissors Game Logic
class RockPaperScissors {
    constructor() {
        this.choices = {
            rock: { emoji: '🪨', name: 'Rock' },
            paper: { emoji: '📄', name: 'Paper' },
            scissors: { emoji: '✂️', name: 'Scissors' }
        };
        
        this.gameState = {
            playerScore: 0,
            computerScore: 0,
            round: 1,
            gameActive: true,
            maxScore: 5
        };
        
        this.initializeGame();
    }
    
    initializeGame() {
        this.bindEvents();
        this.updateDisplay();
    }
    
    bindEvents() {
        // Choice button events
        const choiceButtons = document.querySelectorAll('.choice-btn');
        choiceButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const choice = e.currentTarget.dataset.choice;
                this.playRound(choice);
            });
        });
        
        // Control button events
        document.getElementById('reset-game').addEventListener('click', () => this.resetGame());
        document.getElementById('show-rules').addEventListener('click', () => this.showRules());
        
        // Modal events
        const modal = document.getElementById('rules-modal');
        const closeBtn = document.querySelector('.close');
        
        closeBtn.addEventListener('click', () => this.hideRules());
        window.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.hideRules();
            }
        });
        
        // Keyboard support
        document.addEventListener('keydown', (e) => {
            if (!this.gameState.gameActive) return;
            
            switch(e.key.toLowerCase()) {
                case 'r':
                    this.playRound('rock');
                    break;
                case 'p':
                    this.playRound('paper');
                    break;
                case 's':
                    this.playRound('scissors');
                    break;
            }
        });
    }
    
    playRound(playerChoice) {
        if (!this.gameState.gameActive) return;
        
        // Add visual feedback for player choice
        this.highlightChoice(playerChoice);
        
        // Generate computer choice
        const computerChoice = this.generateComputerChoice();
        
        // Update display with choices
        this.updateChoiceDisplay(playerChoice, computerChoice);
        
        // Determine round result
        const result = this.determineWinner(playerChoice, computerChoice);
        
        // Update scores and display
        this.updateScores(result);
        this.showRoundResult(result, playerChoice, computerChoice);
        
        // Check for game end
        if (this.checkGameEnd()) {
            this.endGame();
        } else {
            this.gameState.round++;
            this.updateDisplay();
        }
    }
    
    generateComputerChoice() {
        const choices = Object.keys(this.choices);
        const randomIndex = Math.floor(Math.random() * choices.length);
        return choices[randomIndex];
    }
    
    determineWinner(playerChoice, computerChoice) {
        if (playerChoice === computerChoice) {
            return 'draw';
        }
        
        const winConditions = {
            rock: 'scissors',
            paper: 'rock',
            scissors: 'paper'
        };
        
        return winConditions[playerChoice] === computerChoice ? 'win' : 'lose';
    }
    
    updateScores(result) {
        switch(result) {
            case 'win':
                this.gameState.playerScore++;
                break;
            case 'lose':
                this.gameState.computerScore++;
                break;
            // Draw doesn't change scores
        }
    }
    
    updateChoiceDisplay(playerChoice, computerChoice) {
        // Update player choice display
        const playerChoiceDisplay = document.getElementById('player-choice');
        const playerEmoji = playerChoiceDisplay.querySelector('.choice-emoji');
        const playerText = playerChoiceDisplay.querySelector('.choice-text');
        
        playerEmoji.textContent = this.choices[playerChoice].emoji;
        playerText.textContent = this.choices[playerChoice].name;
        playerChoiceDisplay.classList.add('animate-bounce');
        
        // Update computer choice display with delay for suspense
        const computerChoiceDisplay = document.getElementById('computer-choice');
        const computerEmoji = computerChoiceDisplay.querySelector('.choice-emoji');
        const computerText = computerChoiceDisplay.querySelector('.choice-text');
        
        // Show thinking animation
        computerEmoji.textContent = '🤔';
        computerText.textContent = 'Thinking...';
        computerChoiceDisplay.classList.add('animate-pulse');
        
        setTimeout(() => {
            computerEmoji.textContent = this.choices[computerChoice].emoji;
            computerText.textContent = this.choices[computerChoice].name;
            computerChoiceDisplay.classList.remove('animate-pulse');
            computerChoiceDisplay.classList.add('animate-bounce');
        }, 1000);
        
        // Remove animation classes after animation completes
        setTimeout(() => {
            playerChoiceDisplay.classList.remove('animate-bounce');
            computerChoiceDisplay.classList.remove('animate-bounce');
        }, 1000);
    }
    
    showRoundResult(result, playerChoice, computerChoice) {
        const battleResult = document.getElementById('battle-result');
        let message = '';
        
        // Clear previous classes
        battleResult.className = 'battle-result';
        
        setTimeout(() => {
            switch(result) {
                case 'win':
                    message = '🎉 You Win!';
                    battleResult.classList.add('win');
                    break;
                case 'lose':
                    message = '😔 You Lose!';
                    battleResult.classList.add('lose');
                    break;
                case 'draw':
                    message = '🤝 It\\'s a Draw!';
                    battleResult.classList.add('draw');
                    break;
            }
            
            battleResult.textContent = message;
        }, 1000);
    }
    
    highlightChoice(choice) {
        // Remove previous selections
        document.querySelectorAll('.choice-btn').forEach(btn => {
            btn.classList.remove('selected');
        });
        
        // Highlight selected choice
        const selectedBtn = document.querySelector(`[data-choice="${choice}"]`);
        selectedBtn.classList.add('selected');
        
        // Remove highlight after a short delay
        setTimeout(() => {
            selectedBtn.classList.remove('selected');
        }, 1500);
    }
    
    updateDisplay() {
        document.getElementById('player-score').textContent = this.gameState.playerScore;
        document.getElementById('computer-score').textContent = this.gameState.computerScore;
        document.getElementById('round-counter').textContent = this.gameState.round;
    }
    
    checkGameEnd() {
        return this.gameState.playerScore >= this.gameState.maxScore || 
               this.gameState.computerScore >= this.gameState.maxScore;
    }
    
    endGame() {
        this.gameState.gameActive = false;
        
        const isPlayerWinner = this.gameState.playerScore >= this.gameState.maxScore;
        const message = isPlayerWinner ? 
            '🏆 Congratulations! You won the game!' : 
            '💻 Computer wins! Better luck next time!';
        
        this.showGameMessage(message, isPlayerWinner ? 'game-won' : 'game-lost');
        
        // Disable choice buttons
        document.querySelectorAll('.choice-btn').forEach(btn => {
            btn.style.opacity = '0.5';
            btn.style.pointerEvents = 'none';
        });
    }
    
    showGameMessage(message, type) {
        const messageElement = document.getElementById('game-message');
        messageElement.textContent = message;
        messageElement.className = `game-message show ${type}`;
    }
    
    resetGame() {
        // Reset game state
        this.gameState = {
            playerScore: 0,
            computerScore: 0,
            round: 1,
            gameActive: true,
            maxScore: 5
        };
        
        // Reset display
        this.updateDisplay();
        
        // Reset choice displays
        const playerChoiceDisplay = document.getElementById('player-choice');
        const computerChoiceDisplay = document.getElementById('computer-choice');
        
        playerChoiceDisplay.querySelector('.choice-emoji').textContent = '❓';
        playerChoiceDisplay.querySelector('.choice-text').textContent = 'Choose Your Weapon!';
        
        computerChoiceDisplay.querySelector('.choice-emoji').textContent = '🤖';
        computerChoiceDisplay.querySelector('.choice-text').textContent = 'Thinking...';
        
        // Clear battle result
        const battleResult = document.getElementById('battle-result');
        battleResult.textContent = '';
        battleResult.className = 'battle-result';
        
        // Hide game message
        document.getElementById('game-message').classList.remove('show');
        
        // Re-enable choice buttons
        document.querySelectorAll('.choice-btn').forEach(btn => {
            btn.style.opacity = '1';
            btn.style.pointerEvents = 'auto';
            btn.classList.remove('selected');
        });
    }
    
    showRules() {
        document.getElementById('rules-modal').style.display = 'block';
    }
    
    hideRules() {
        document.getElementById('rules-modal').style.display = 'none';
    }
}

// Utility functions for educational purposes

/**
 * Function to demonstrate different ways to generate random choices
 */
function demonstrateRandomGeneration() {
    const choices = ['rock', 'paper', 'scissors'];
    
    // Method 1: Simple random index
    const randomChoice1 = choices[Math.floor(Math.random() * choices.length)];
    
    // Method 2: Using a switch statement
    const randomNum = Math.random();
    let randomChoice2;
    if (randomNum < 0.33) {
        randomChoice2 = 'rock';
    } else if (randomNum < 0.66) {
        randomChoice2 = 'paper';
    } else {
        randomChoice2 = 'scissors';
    }
    
    // Method 3: Weighted random (for advanced difficulty)
    const weights = { rock: 0.4, paper: 0.3, scissors: 0.3 };
    const rand = Math.random();
    let cumulative = 0;
    let randomChoice3;
    
    for (const choice in weights) {
        cumulative += weights[choice];
        if (rand <= cumulative) {
            randomChoice3 = choice;
            break;
        }
    }
    
    console.log('Random choices:', { randomChoice1, randomChoice2, randomChoice3 });
}

/**
 * Function to demonstrate game logic patterns
 */
function demonstrateGameLogic() {
    // Win condition lookup table
    const winConditions = {
        rock: 'scissors',
        paper: 'rock',
        scissors: 'paper'
    };
    
    // Alternative win detection using nested conditions
    function determineWinnerVerbose(player, computer) {
        if (player === computer) return 'draw';
        
        if (
            (player === 'rock' && computer === 'scissors') ||
            (player === 'paper' && computer === 'rock') ||
            (player === 'scissors' && computer === 'paper')
        ) {
            return 'win';
        } else {
            return 'lose';
        }
    }
    
    // Test the logic
    console.log('Rock vs Scissors:', determineWinnerVerbose('rock', 'scissors')); // 'win'
    console.log('Paper vs Rock:', determineWinnerVerbose('paper', 'rock')); // 'win'
    console.log('Rock vs Paper:', determineWinnerVerbose('rock', 'paper')); // 'lose'
}

/**
 * Function to demonstrate event handling patterns
 */
function demonstrateEventHandling() {
    // Event delegation example
    document.addEventListener('click', (event) => {
        if (event.target.classList.contains('choice-btn')) {
            console.log('Choice button clicked:', event.target.dataset.choice);
        }
    });
    
    // Custom event example
    const gameEvent = new CustomEvent('gameUpdate', {
        detail: {
            round: 1,
            score: { player: 0, computer: 0 }
        }
    });
    
    document.addEventListener('gameUpdate', (event) => {
        console.log('Game updated:', event.detail);
    });
    
    // Dispatch the custom event
    // document.dispatchEvent(gameEvent);
}

// Initialize the game when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new RockPaperScissors();
});

// Educational comments about key concepts:

/*
1. Object-Oriented Programming:
   - Class-based structure for organized code
   - Constructor for initialization
   - Methods for specific functionality
   - Private state management

2. Random Number Generation:
   - Math.random() for computer choices
   - Array indexing with random numbers
   - Weighted random selection for AI difficulty

3. Event Handling:
   - addEventListener for user interactions
   - Event delegation for efficient handling
   - Keyboard event support
   - Custom events for game communication

4. DOM Manipulation:
   - Dynamic content updates
   - CSS class manipulation for styling
   - Element selection and modification
   - Animation triggering

5. Game State Management:
   - Object-based state tracking
   - Score persistence
   - Game flow control
   - End game conditions

6. Conditional Logic:
   - Complex win/lose determination
   - Switch statements for multiple conditions
   - Ternary operators for concise logic
   - Boolean flag management

7. Timing and Animation:
   - setTimeout for delayed actions
   - CSS class-based animations
   - User feedback with visual cues
   - Suspense building with delays

8. User Experience:
   - Visual feedback for actions
   - Clear game state communication
   - Accessible keyboard controls
   - Responsive design considerations
*/