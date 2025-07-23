import { Sitting, Rolling, Jumping, Falling, WasabiMode, Hit, Bouncing } from 'https://cptnmagyar.github.io/SushiRoll//playerState.js';
import { CollisionAnimation } from 'https://cptnmagyar.github.io/SushiRoll//collisionAnimation.js';

// Coty Reid Kovach - M25W0711
// Stores values related to the player / sushi roll
// main.js continously calls the player class's functions to update their coordinates
// as well as update the displayed portion of the sprite sheet in order to animate
// The player's update method takes in the keyboard input (passed from main.js)
// This input is used to change the player's state (playerState.js)
// Additionally this class handles the Player's different collisions with various
// Objects in the game and applies the necessary game changes or changes to the player's state
export class Player {
    constructor(game){
        this.game = game;
        this.image = document.getElementById('player');

        this.width = 100;
        this.height = 91.3;
        this.x = 0;
        this.y = this.game.height - this.height - this.game.groundMargin;
        this.vy = 0;

        this.frameX = 0;
        this.frameY = 0;
        this.maxFrame;

        this.fps = 20;
        this.frameInterval = 1000/this.fps;
        this.frameTimer = 0;

        this.weight = 1.5;
        this.speed = 0;
        this.maxSpeed = 3.75;

        this.states = [new Sitting(this.game), new Rolling(this.game), new Jumping(this.game), new Falling(this.game), new WasabiMode(this.game), new Bouncing(this.game), new Hit(this.game)];
        this.currentState = null;
    }

    update(input, deltaTime){
        this.checkCollision();
        this.currentState.handleInput(input);

        this.x += this.speed;
        if ((input.includes('d') || input.includes('ArrowRight')) && this.currentState !== this.states[6]) this.speed = this.maxSpeed;
        else if ((input.includes('a') || input.includes('ArrowLeft')) && this.currentState !== this.states[6]) this.speed = -this.maxSpeed + -0.25;
        else if (this.game.gameStart && this.currentState !== this.states[0]) this.speed = 0.5;
        else this.speed = 0

        if (this.x < 0) this.x = 0;
        if (this.x > this.game.width - this.width) this.x = this.game.width - this.width;

        this.y += this.vy;
        if (!this.onGround()) this.vy += this.weight;
        else this.vy = 0; 

        if (this.y > this.game.height - this.height - this.game.groundMargin) this.y = this.game.height - this.height - this.game.groundMargin;

        if (this.frameTimer > this.frameInterval){
            this.frameTimer = 0;
            if (this.frameX < this.maxFrame) this.frameX++;
            else this.frameX = 0;
        } else {
            this.frameTimer += deltaTime;
        }
    }

    draw(context){
        context.drawImage(this.image, this.frameX * this.width, this.frameY * this.height, this.width, this.height, this.x, this.y, this.width, this.height);
    }

    onGround(){
        return this.y >= this.game.height - this.height - this.game.groundMargin;
    }

    setPlayerState(state, speed){
        this.currentState = this.states[state];
        this.game.speed = this.game.maxSpeed * speed;
        this.currentState.enter();
    }

    checkCollision(){
        this.game.enemies.forEach(enemy => {
            if (
                enemy.x < this.x + this.width - 30 &&
                enemy.x + enemy.width > this.x &&
                enemy.y < this.y + this.height &&
                enemy.y + enemy.height > this.y
            ){
                this.game.collisions.push(new CollisionAnimation(this.game, enemy))

                if (enemy.type !== "Chopsticks" && enemy.type !== "BigMiso"){
                    enemy.delete = true;
                }

                if (this.currentState === this.states[4]) {
                    this.game.score++;
                    if (enemy.type !== "Chopsticks"){
                    enemy.delete = true;
                    }
                } else {
                    if (enemy.type == "Chopsticks" && enemy.hit == false)
                    {
                    if(this.currentState !== this.states[6]) this.game.lives--;
                    this.setPlayerState(6, 0);
                    }
                    else if (enemy.type == "Miso" && (this.currentState !== this.states[3])){
                    if(this.currentState !== this.states[6]) this.game.lives--;
                    this.setPlayerState(6, 0);
                    }
                    else if (enemy.type == "BigMiso" && (this.currentState !== this.states[3])){
                    if(this.currentState !== this.states[6]) this.game.lives--;
                    this.setPlayerState(6, 0);
                    enemy.delete = true;
                    }
                    if (this.game.lives <= 0) this.game.gameOver = true;
                }
                
                if (enemy.type == "Wasabi" && this.game.wasabi <= this.game.wasabiWinCount) {
                        this.game.wasabi += 25;
                        if (this.game.wasabi >= this.game.wasabiWinCount){
                            this.game.wasabi = this.game.wasabiWinCount;
                        }
                }

                if (enemy.type == "BigMiso"){
                    if (this.currentState === this.states[3]){
                        if (enemy.hit == true){
                            enemy.delete = true;
                        } else {
                            this.setPlayerState(5,0)
                        }
                    }
                }

                enemy.hit = true;
            }
        });
    }
}