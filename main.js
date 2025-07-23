import { Player } from 'https://cptnmagyar.github.io/SushiRoll//player.js';
import { InputHandler } from 'https://cptnmagyar.github.io/SushiRoll//inputHandler.js';
import { Background } from 'https://cptnmagyar.github.io/SushiRoll//background.js';
import { WasabiEnemy, GroundEnemy, GroundEnemyBig, ChopsticksEnemy } from 'https://cptnmagyar.github.io/SushiRoll//enemy.js';
import { UserInterface } from 'https://cptnmagyar.github.io/SushiRoll//userInterface.js';

// Coty Reid Kovach - M25W0711
// Creates a Window containing the Game class
// Game class stores variables related to the various mechanisms
// such as the player state, enemies, particles, collisions, win conditions etc.
// This continously loops through the animate function to update the game accordingly
// Accessing various other javascript files such as the enemies, background, and player
// in order to call their related functions for updating and drawing on the canvas
window.addEventListener('load', function(){
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    canvas.width = 1200;
    canvas.height = 600;

    class Game {
        constructor(width, height){
            this.width = width;
            this.height = height;
            this.groundMargin = 62;

            this.speed = 0;
            this.maxSpeed = 2.5;
            
            this.lives = 6;
            this.wasabi = 5;
            this.wasabiWinCount = 200;

            this.enemies = [];
            this.particles = [];
            this.collisions = [];

            this.background = new Background(this);
            this.player = new Player(this);
            this.input = new InputHandler(this);
            this.userInterface = new UserInterface(this);
            
            this.maxParticles = 200;

            this.enemyTimer = 0;
            this.enemyInterval = 1500;

            this.player.currentState = this.player.states[0];
            this.player.currentState.enter();
            this.gameStart = false;
            this.gameOver = false;
        }

        update(deltaTime){
            this.background.update();
            this.player.update(this.input.keys, deltaTime);

            if (this.enemyTimer > this.enemyInterval){
                this.addEnemy();
                this.enemyTimer = 0;
            } else {
                this.enemyTimer += deltaTime;
            }

            this.enemies.forEach(enemy => {
                enemy.update(deltaTime);
            });

            this.particles.forEach((particle, index) => {
                particle.update();
            });

            if (this.particles.length > this.maxParticles) {
                this.particles.length = this.maxParticles;
            }

            this.collisions.forEach((collision, index) => {
                collision.update(deltaTime);
            });

            this.enemies = this.enemies.filter(enemy => !enemy.delete);
            this.particles = this.particles.filter(particle => !particle.delete);
            this.collisions = this.collisions.filter(collision => !collision.delete);
        }

        draw(context){
            this.background.draw(context);

            this.particles.forEach(particle => {
                particle.draw(context);
            });
            this.collisions.forEach(collision => {
                collision.draw(context);
            });
            this.player.draw(context);
            this.enemies.forEach(enemy => {
                enemy.draw(context);
            });
            this.userInterface.draw(context);
        }

        addEnemy(){
            if (this.speed > 0 && Math.random() < 0.8) this.enemies.push(new GroundEnemy(this));
            else if (this.speed > 0) this.enemies.push(new GroundEnemyBig(this));

            if (this.speed > 0 && Math.random() < 0.5) this.enemies.push(new ChopsticksEnemy(this));

            if (this.speed > 0 && Math.random() < 0.5) this.enemies.push(new WasabiEnemy(this));
        }
    }

    let game = new Game(canvas.width, canvas.height);
    let lastTime = 0;

    function animate(timeStamp){
        applyCurrentGameState()
        let deltaTime = timeStamp - lastTime;
        lastTime = timeStamp;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        game.update(deltaTime);
        game.draw(ctx);
    }

    function applyCurrentGameState() {
        if (game.wasabi >= game.wasabiWinCount) game.gameOver = true;
        if (!game.gameOver) requestAnimationFrame(animate);
    }

    function resetGame(){
            game.gameOver = false;
            game = new Game(canvas.width, canvas.height);
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            game.update(0);
            animate(0);
            game.draw(ctx);
    }

    animate(0);
    
    window.addEventListener('click', (e) => {
            if (game.gameStart == false || game.gameOver == true){
                        if (game.gameOver) {
                            resetGame();
                        }
                        game.gameStart = true;
                }
            });
});