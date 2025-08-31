// Snake Game Implementation using HTML5 Canvas and Modern JavaScript

class Vector2 {
    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }
    
    equals(other) {
        return this.x === other.x && this.y === other.y;
    }
    
    add(other) {
        return new Vector2(this.x + other.x, this.y + other.y);
    }
    
    copy() {
        return new Vector2(this.x, this.y);
    }
}

class Snake {
    constructor(startPosition, gridSize) {
        this.body = [startPosition.copy()];
        this.direction = new Vector2(1, 0); // Start moving right
        this.nextDirection = new Vector2(1, 0);
        this.gridSize = gridSize;
        this.growing = false;
    }
    
    update() {
        // Update direction (prevents immediate reverse)
        if (!this.isOppositeDirection(this.nextDirection)) {
            this.direction = this.nextDirection.copy();
        }
        
        // Calculate new head position
        const head = this.body[0].copy();
        const newHead = head.add(this.direction);
        
        // Add new head
        this.body.unshift(newHead);
        
        // Remove tail unless growing
        if (!this.growing) {
            this.body.pop();
        } else {
            this.growing = false;
        }
    }
    
    setDirection(newDirection) {
        this.nextDirection = newDirection.copy();
    }
    
    isOppositeDirection(direction) {
        return (this.direction.x === -direction.x && this.direction.x !== 0) ||
               (this.direction.y === -direction.y && this.direction.y !== 0);
    }
    
    grow() {
        this.growing = true;
    }
    
    checkSelfCollision() {
        const head = this.body[0];
        for (let i = 1; i < this.body.length; i++) {
            if (head.equals(this.body[i])) {
                return true;
            }
        }
        return false;
    }
    
    checkWallCollision(canvasWidth, canvasHeight) {
        const head = this.body[0];
        return head.x < 0 || head.x >= canvasWidth / this.gridSize ||
               head.y < 0 || head.y >= canvasHeight / this.gridSize;
    }
    
    wrapAroundWalls(canvasWidth, canvasHeight) {
        const head = this.body[0];
        const gridWidth = canvasWidth / this.gridSize;
        const gridHeight = canvasHeight / this.gridSize;
        
        if (head.x < 0) head.x = gridWidth - 1;
        if (head.x >= gridWidth) head.x = 0;
        if (head.y < 0) head.y = gridHeight - 1;
        if (head.y >= gridHeight) head.y = 0;
    }
    
    getHead() {
        return this.body[0];
    }
    
    getLength() {
        return this.body.length;
    }
}

class Food {
    constructor(gridSize) {
        this.position = new Vector2();
        this.gridSize = gridSize;
        this.value = 10;
    }
    
    spawn(canvasWidth, canvasHeight, snake) {
        const gridWidth = Math.floor(canvasWidth / this.gridSize);
        const gridHeight = Math.floor(canvasHeight / this.gridSize);
        
        let validPosition = false;
        let attempts = 0;
        const maxAttempts = 100;
        
        while (!validPosition && attempts < maxAttempts) {
            this.position.x = Math.floor(Math.random() * gridWidth);
            this.position.y = Math.floor(Math.random() * gridHeight);
            
            // Check if position conflicts with snake
            validPosition = !snake.body.some(segment => segment.equals(this.position));
            attempts++;
        }
        
        // If we can't find a valid position (very rare), just place it randomly
        if (!validPosition) {
            this.position.x = Math.floor(Math.random() * gridWidth);
            this.position.y = Math.floor(Math.random() * gridHeight);
        }
    }
    
    isEaten(snakeHead) {
        return this.position.equals(snakeHead);
    }
}

class SnakeGame {
    constructor() {
        this.canvas = document.getElementById('game-canvas');
        this.ctx = this.canvas.getContext('2d');
        
        // Game settings (will be loaded from localStorage or defaults)
        this.settings = {
            difficulty: 'medium',
            gridSize: 20,
            wallMode: 'death'
        };
        
        // Game state
        this.gameState = 'waiting'; // waiting, playing, paused, gameOver
        this.score = 0;
        this.highScore = 0;
        this.speed = 1;
        this.gameSpeed = 150; // milliseconds between updates
        
        // Game objects
        this.snake = null;
        this.food = null;
        
        // Timing
        this.lastUpdateTime = 0;
        this.gameLoop = null;
        
        this.initializeGame();
    }
    
    initializeGame() {
        this.loadSettings();
        this.loadHighScore();
        this.createGameObjects();
        this.bindEvents();
        this.updateDisplay();
        this.render();
    }
    
    loadSettings() {
        const savedSettings = localStorage.getItem('snakeGameSettings');
        if (savedSettings) {
            this.settings = { ...this.settings, ...JSON.parse(savedSettings) };
        }
        this.applySettings();
    }
    
    applySettings() {
        // Apply difficulty
        const speeds = {
            easy: 200,
            medium: 150,
            hard: 100,
            insane: 50
        };
        this.gameSpeed = speeds[this.settings.difficulty];
        
        // Apply grid size
        this.settings.gridSize = parseInt(this.settings.gridSize);
        
        // Update UI elements
        document.getElementById('difficulty').value = this.settings.difficulty;
        document.getElementById('grid-size').value = this.settings.gridSize;
        document.getElementById('wall-mode').value = this.settings.wallMode;
    }
    
    saveSettings() {
        localStorage.setItem('snakeGameSettings', JSON.stringify(this.settings));
    }
    
    loadHighScore() {
        const savedHighScore = localStorage.getItem('snakeHighScore');
        this.highScore = savedHighScore ? parseInt(savedHighScore) : 0;
    }
    
    saveHighScore() {
        localStorage.setItem('snakeHighScore', this.highScore.toString());
    }
    
    createGameObjects() {
        const startX = Math.floor((this.canvas.width / this.settings.gridSize) / 2);
        const startY = Math.floor((this.canvas.height / this.settings.gridSize) / 2);
        
        this.snake = new Snake(new Vector2(startX, startY), this.settings.gridSize);
        this.food = new Food(this.settings.gridSize);
        this.spawnFood();
    }
    
    spawnFood() {
        this.food.spawn(this.canvas.width, this.canvas.height, this.snake);
    }
    
    bindEvents() {
        // Keyboard controls
        document.addEventListener('keydown', (e) => this.handleKeyPress(e));
        
        // Button controls
        document.getElementById('start-pause-btn').addEventListener('click', () => this.togglePlayPause());
        document.getElementById('reset-btn').addEventListener('click', () => this.resetGame());
        document.getElementById('restart-btn').addEventListener('click', () => this.resetGame());
        document.getElementById('settings-btn').addEventListener('click', () => this.showSettings());
        
        // Settings modal
        const modal = document.getElementById('settings-modal');
        const closeBtn = document.querySelector('.close');
        
        closeBtn.addEventListener('click', () => this.hideSettings());
        window.addEventListener('click', (e) => {
            if (e.target === modal) this.hideSettings();
        });
        
        document.getElementById('apply-settings').addEventListener('click', () => this.applyNewSettings());
    }
    
    handleKeyPress(e) {
        switch(e.code) {
            case 'ArrowUp':
            case 'KeyW':
                e.preventDefault();
                if (this.gameState === 'playing') {
                    this.snake.setDirection(new Vector2(0, -1));
                }
                break;
            case 'ArrowDown':
            case 'KeyS':
                e.preventDefault();
                if (this.gameState === 'playing') {
                    this.snake.setDirection(new Vector2(0, 1));
                }
                break;
            case 'ArrowLeft':
            case 'KeyA':
                e.preventDefault();
                if (this.gameState === 'playing') {
                    this.snake.setDirection(new Vector2(-1, 0));
                }
                break;
            case 'ArrowRight':
            case 'KeyD':
                e.preventDefault();
                if (this.gameState === 'playing') {
                    this.snake.setDirection(new Vector2(1, 0));
                }
                break;
            case 'Space':
                e.preventDefault();
                this.togglePlayPause();
                break;
        }
    }
    
    togglePlayPause() {
        switch(this.gameState) {
            case 'waiting':
                this.startGame();
                break;
            case 'playing':
                this.pauseGame();
                break;
            case 'paused':
                this.resumeGame();
                break;
            case 'gameOver':
                this.resetGame();
                break;
        }
    }
    
    startGame() {
        this.gameState = 'playing';
        this.gameLoop = this.runGameLoop();
        this.updateDisplay();
    }
    
    pauseGame() {
        this.gameState = 'paused';
        if (this.gameLoop) {
            cancelAnimationFrame(this.gameLoop);
        }
        this.updateDisplay();
    }
    
    resumeGame() {
        this.gameState = 'playing';
        this.gameLoop = this.runGameLoop();
        this.updateDisplay();
    }
    
    resetGame() {
        this.gameState = 'waiting';
        this.score = 0;
        this.speed = 1;
        
        if (this.gameLoop) {
            cancelAnimationFrame(this.gameLoop);
        }
        
        this.createGameObjects();
        this.updateDisplay();
        this.hideGameOver();
        this.render();
    }
    
    runGameLoop() {
        return requestAnimationFrame((timestamp) => {
            if (timestamp - this.lastUpdateTime >= this.gameSpeed) {
                this.update();
                this.render();
                this.lastUpdateTime = timestamp;
            }
            
            if (this.gameState === 'playing') {
                this.gameLoop = this.runGameLoop();
            }
        });
    }
    
    update() {
        if (this.gameState !== 'playing') return;
        
        this.snake.update();
        
        // Handle wall collision
        if (this.settings.wallMode === 'death' && this.snake.checkWallCollision(this.canvas.width, this.canvas.height)) {
            this.gameOver();
            return;
        } else if (this.settings.wallMode === 'wrap') {
            this.snake.wrapAroundWalls(this.canvas.width, this.canvas.height);
        }
        
        // Check self collision
        if (this.snake.checkSelfCollision()) {
            this.gameOver();
            return;
        }
        
        // Check food collision
        if (this.food.isEaten(this.snake.getHead())) {
            this.snake.grow();
            this.score += this.food.value;
            this.speed = Math.floor(this.snake.getLength() / 5) + 1;
            this.spawnFood();
            this.updateDisplay();
        }
    }
    
    gameOver() {
        this.gameState = 'gameOver';
        
        // Update high score
        if (this.score > this.highScore) {
            this.highScore = this.score;
            this.saveHighScore();
        }
        
        this.showGameOver();
        this.updateDisplay();
    }
    
    showGameOver() {
        const gameOverScreen = document.getElementById('game-over-screen');
        const finalScore = document.getElementById('final-score');
        const highScoreMessage = document.getElementById('high-score-message');
        
        finalScore.textContent = this.score;
        
        if (this.score === this.highScore && this.score > 0) {
            highScoreMessage.textContent = '🎉 New High Score!';
            highScoreMessage.style.display = 'block';
        } else {
            highScoreMessage.style.display = 'none';
        }
        
        gameOverScreen.classList.add('show');
    }
    
    hideGameOver() {
        document.getElementById('game-over-screen').classList.remove('show');
    }
    
    showSettings() {
        document.getElementById('settings-modal').style.display = 'block';
    }
    
    hideSettings() {
        document.getElementById('settings-modal').style.display = 'none';
    }
    
    applyNewSettings() {
        this.settings.difficulty = document.getElementById('difficulty').value;
        this.settings.gridSize = parseInt(document.getElementById('grid-size').value);
        this.settings.wallMode = document.getElementById('wall-mode').value;
        
        this.saveSettings();
        this.applySettings();
        this.resetGame();
        this.hideSettings();
    }
    
    updateDisplay() {
        document.getElementById('current-score').textContent = this.score;
        document.getElementById('high-score').textContent = this.highScore;
        document.getElementById('speed-level').textContent = this.speed;
        
        const gameStateElement = document.getElementById('game-state');
        const startPauseBtn = document.getElementById('start-pause-btn');
        
        switch(this.gameState) {
            case 'waiting':
                gameStateElement.textContent = 'Press Space to Start';
                gameStateElement.className = 'game-state';
                startPauseBtn.textContent = '▶️ Start';
                break;
            case 'playing':
                gameStateElement.textContent = 'Playing';
                gameStateElement.className = 'game-state playing';
                startPauseBtn.textContent = '⏸️ Pause';
                break;
            case 'paused':
                gameStateElement.textContent = 'Paused';
                gameStateElement.className = 'game-state paused';
                startPauseBtn.textContent = '▶️ Resume';
                break;
            case 'gameOver':
                gameStateElement.textContent = 'Game Over';
                gameStateElement.className = 'game-state';
                startPauseBtn.textContent = '🔄 New Game';
                break;
        }
    }
    
    render() {
        // Clear canvas
        this.ctx.fillStyle = '#1a252f';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw grid (optional, for visual appeal)
        this.drawGrid();
        
        // Draw snake
        this.drawSnake();
        
        // Draw food
        this.drawFood();
    }
    
    drawGrid() {
        this.ctx.strokeStyle = 'rgba(52, 152, 219, 0.1)';
        this.ctx.lineWidth = 1;
        
        // Vertical lines
        for (let x = 0; x <= this.canvas.width; x += this.settings.gridSize) {
            this.ctx.beginPath();
            this.ctx.moveTo(x, 0);
            this.ctx.lineTo(x, this.canvas.height);
            this.ctx.stroke();
        }
        
        // Horizontal lines
        for (let y = 0; y <= this.canvas.height; y += this.settings.gridSize) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, y);
            this.ctx.lineTo(this.canvas.width, y);
            this.ctx.stroke();
        }
    }
    
    drawSnake() {
        this.snake.body.forEach((segment, index) => {
            const x = segment.x * this.settings.gridSize;
            const y = segment.y * this.settings.gridSize;
            
            if (index === 0) {
                // Snake head
                this.ctx.fillStyle = '#e74c3c';
                this.ctx.fillRect(x + 1, y + 1, this.settings.gridSize - 2, this.settings.gridSize - 2);
                
                // Add eyes
                this.ctx.fillStyle = '#fff';
                const eyeSize = Math.max(2, this.settings.gridSize / 8);
                const eyeOffset = this.settings.gridSize / 4;
                
                this.ctx.fillRect(x + eyeOffset, y + eyeOffset, eyeSize, eyeSize);
                this.ctx.fillRect(x + this.settings.gridSize - eyeOffset - eyeSize, y + eyeOffset, eyeSize, eyeSize);
            } else {
                // Snake body
                const intensity = 1 - (index / this.snake.body.length) * 0.3;
                this.ctx.fillStyle = `rgba(46, 204, 113, ${intensity})`;
                this.ctx.fillRect(x + 1, y + 1, this.settings.gridSize - 2, this.settings.gridSize - 2);
            }
        });
    }
    
    drawFood() {
        const x = this.food.position.x * this.settings.gridSize;
        const y = this.food.position.y * this.settings.gridSize;
        
        // Animated food
        const pulse = Math.sin(Date.now() * 0.01) * 0.1 + 0.9;
        const size = this.settings.gridSize * pulse;
        const offset = (this.settings.gridSize - size) / 2;
        
        this.ctx.fillStyle = '#f1c40f';
        this.ctx.beginPath();
        this.ctx.arc(
            x + this.settings.gridSize / 2,
            y + this.settings.gridSize / 2,
            size / 2 - 1,
            0,
            Math.PI * 2
        );
        this.ctx.fill();
        
        // Add sparkle effect
        this.ctx.fillStyle = '#fff';
        this.ctx.fillRect(
            x + this.settings.gridSize * 0.3,
            y + this.settings.gridSize * 0.3,
            2, 2
        );
    }
}

// Educational utility functions

/**
 * Demonstrates vector mathematics used in game development
 */
function demonstrateVectorMath() {
    const position = new Vector2(5, 3);
    const velocity = new Vector2(1, -1);
    
    // Vector addition for movement
    const newPosition = position.add(velocity);
    console.log('New position:', newPosition); // Vector2 { x: 6, y: 2 }
    
    // Direction vectors for snake movement
    const directions = {
        up: new Vector2(0, -1),
        down: new Vector2(0, 1),
        left: new Vector2(-1, 0),
        right: new Vector2(1, 0)
    };
    
    console.log('Movement directions:', directions);
}

/**
 * Demonstrates collision detection algorithms
 */
function demonstrateCollisionDetection() {
    // Point-to-point collision (used for food eating)
    function pointCollision(point1, point2) {
        return point1.x === point2.x && point1.y === point2.y;
    }
    
    // Boundary collision detection
    function boundaryCollision(position, minX, minY, maxX, maxY) {
        return position.x < minX || position.x >= maxX ||
               position.y < minY || position.y >= maxY;
    }
    
    // Array-based collision (self-collision)
    function arrayCollision(target, array) {
        return array.some(item => item.equals(target));
    }
    
    console.log('Collision detection functions defined');
}

/**
 * Demonstrates game loop patterns
 */
function demonstrateGameLoop() {
    // Fixed time step game loop
    function fixedTimeStepLoop() {
        const FPS = 60;
        const FRAME_TIME = 1000 / FPS;
        let lastTime = 0;
        
        function loop(currentTime) {
            if (currentTime - lastTime >= FRAME_TIME) {
                // Update game logic
                // Render graphics
                lastTime = currentTime;
            }
            requestAnimationFrame(loop);
        }
        
        requestAnimationFrame(loop);
    }
    
    // Variable time step with delta time
    function variableTimeStepLoop() {
        let lastTime = 0;
        
        function loop(currentTime) {
            const deltaTime = currentTime - lastTime;
            lastTime = currentTime;
            
            // Update game logic with deltaTime
            // Render graphics
            
            requestAnimationFrame(loop);
        }
        
        requestAnimationFrame(loop);
    }
    
    console.log('Game loop patterns demonstrated');
}

// Initialize the game when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new SnakeGame();
});

/*
Educational Comments - Advanced JavaScript Concepts:

1. ES6 Classes and Object-Oriented Design:
   - Multiple classes with specific responsibilities
   - Constructor methods for initialization
   - Method inheritance and composition
   - Encapsulation of game logic

2. HTML5 Canvas API:
   - 2D rendering context manipulation
   - Drawing primitives (rectangles, circles, lines)
   - Animation through continuous rendering
   - Coordinate system understanding

3. Game Development Patterns:
   - Game loop using requestAnimationFrame
   - State management (waiting, playing, paused, gameOver)
   - Entity-component system (Snake, Food, Game classes)
   - Collision detection algorithms

4. Advanced Data Structures:
   - Vector mathematics for position and movement
   - Array manipulation for snake body
   - Grid-based coordinate systems
   - Spatial partitioning concepts

5. Event Handling:
   - Keyboard input processing
   - Event delegation and propagation
   - Custom event creation and handling
   - User interface interaction

6. Local Storage and Persistence:
   - Settings persistence across sessions
   - High score tracking
   - JSON serialization/deserialization
   - Data validation and error handling

7. Animation and Timing:
   - RequestAnimationFrame for smooth animation
   - Time-based movement calculations
   - Variable speed game mechanics
   - Visual effects and transitions

8. Code Organization:
   - Modular design with separation of concerns
   - Utility functions for common operations
   - Configuration management
   - Scalable architecture patterns
*/