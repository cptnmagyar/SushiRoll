import { Player } from 'https://cptnmagyar.github.io/SushiRoll//player.js';
import { InputHandler } from 'https://cptnmagyar.github.io/SushiRoll//input.js';
import { Background } from 'https://cptnmagyar.github.io/SushiRoll//background.js';
import { WasabiEnemy, GroundEnemy, GroundEnemyBig, ClimbingEnemy } from 'https://cptnmagyar.github.io/SushiRoll//enemy.js';
import { UI } from 'https://cptnmagyar.github.io/SushiRoll//UI.js';


window.addEventListener('load', function(){
    const canvas = document.getElementById('canvas1');
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
            this.background = new Background(this);
            this.player = new Player(this);
            this.input = new InputHandler(this);
            this.UI = new UI(this);
            this.enemies = [];
            this.particles = [];
            this.collisions = [];
            this.floatingMessages = [];
            this.maxParticles = 200;
            this.enemyTimer = 0;
            this.enemyInterval = 1500;
            this.debug = false;
            this.score = 0;
            this.winningScore = 40;
            this.fontColor = 'black';
            this.time = 0;
            this.maxTime = 5000;
            this.gameOver = false;
            this.player.currentState = this.player.states[0];
            this.player.currentState.enter();
            this.lives = 6;
            this.wasabi = 5;
            this.wasabiWinCount = 200;
            this.gameStart = false;
        }
        update(deltaTime){
            this.time += deltaTime;
            // if (this.time > this.maxTime) this.gameOver = true;
            this.background.update();
            this.player.update(this.input.keys, deltaTime);
            // handleEnemies
            if (this.enemyTimer > this.enemyInterval){
                this.addEnemy();
                this.enemyTimer = 0;
            } else {
                this.enemyTimer += deltaTime;
            }
            this.enemies.forEach(enemy => {
                enemy.update(deltaTime);
            });
            // handle messages
            this.floatingMessages.forEach(message => {
                message.update();
            });
            // handle particles
            this.particles.forEach((particle, index) => {
                particle.update();
            });
            if (this.particles.length > this.maxParticles) {
                this.particles.length = this.maxParticles;
            }
            // handle collision sprites
            this.collisions.forEach((collision, index) => {
                collision.update(deltaTime);
            });
            // 
            this.enemies = this.enemies.filter(enemy => !enemy.markedForDeletion);
            this.particles = this.particles.filter(particle => !particle.markedForDeletion);
            this.collisions = this.collisions.filter(collision => !collision.markedForDeletion);
            this.floatingMessages = this.floatingMessages.filter(message => !message.markedForDeletion);
        }
        draw(context){
            this.background.draw(context);
            this.floatingMessages.forEach(message => {
                message.draw(context);
            });
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
            this.UI.draw(context);
        }
        addEnemy(){
            if (this.speed > 0 && Math.random() < 0.8) this.enemies.push(new GroundEnemy(this));
            else if (this.speed > 0) this.enemies.push(new GroundEnemyBig(this));

            if (this.speed > 0 && Math.random() < 0.5) this.enemies.push(new ClimbingEnemy(this));

            if (this.speed > 0 && Math.random() < 0.5) this.enemies.push(new WasabiEnemy(this));
        }
    }

    let game = new Game(canvas.width, canvas.height);
    let lastTime = 0;

    function animate(timeStamp){
        applyGameOverConditions()
        let deltaTime = timeStamp - lastTime;
        lastTime = timeStamp;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        game.update(deltaTime);
        game.draw(ctx);
    }

    function applyGameOverConditions() {
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
    window.addEventListener('keydown', (e) => {
            if ((e.key === 'Enter' && (game.gameStart == false || game.gameOver == true))){
                        console.log(game.gameStart)
                        if (game.gameOver) {
                            resetGame();
                        }
                        game.gameStart = true;
                }
            });
});