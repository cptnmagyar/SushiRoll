import { Sitting, Running, Jumping, Falling, Rolling, Hit, Bouncing } from "https://cptnmagyar.github.io/SushiRoll//playerState.js";
import { CollisionAnimation } from "https://cptnmagyar.github.io/SushiRoll//collisionAnimation.js";
import { FloatingMessage } from "https://cptnmagyar.github.io/SushiRoll//floatingMessage.js";

export class Player {
    constructor(game){
        this.game = game;
        this.width = 100;
        this.height = 91.3;
        this.x = 0;
        this.y = this.game.height - this.height - this.game.groundMargin;
        this.vy = 0;
        this.weight = 1.5;
        this.image = document.getElementById('player');
        this.frameX = 0;
        this.frameY = 0;
        this.maxFrame;
        this.fps = 20;
        this.frameInterval = 1000/this.fps;
        this.frameTimer = 0;
        this.speed = 0;
        this.maxSpeed = 3.75;
        this.states = [new Sitting(this.game), new Running(this.game), new Jumping(this.game), new Falling(this.game), new Rolling(this.game), new Bouncing(this.game), new Hit(this.game)];
        this.currentState = null;
    }
    update(input, deltaTime){
        this.checkCollision();
        this.currentState.handleInput(input);
        // horizontal movement
        this.x += this.speed;
        if ((input.includes('d') || input.includes('ArrowRight')) && this.currentState !== this.states[6]) this.speed = this.maxSpeed;
        else if ((input.includes('a') || input.includes('ArrowLeft')) && this.currentState !== this.states[6]) this.speed = -this.maxSpeed + -0.25;
        else if (this.game.gameStart && this.currentState !== this.states[0]) this.speed = 0.5;
        else this.speed = 0
        // horizontal boundaries
        if (this.x < 0) this.x = 0;
        if (this.x > this.game.width - this.width) this.x = this.game.width - this.width;
        // vertical movement;
        this.y += this.vy;
        if (!this.onGround()) this.vy += this.weight;
        else this.vy = 0; 
        // vertical boundaries
        if (this.y > this.game.height - this.height - this.game.groundMargin) this.y = this.game.height - this.height - this.game.groundMargin;
        // sprite animation
        if (this.frameTimer > this.frameInterval){
            this.frameTimer = 0;
            if (this.frameX < this.maxFrame) this.frameX++;
            else this.frameX = 0;
        } else {
            this.frameTimer += deltaTime;
        }
    }
    draw(context){
        if (this.game.debug) context.strokeRect(this.x, this.y, this.width, this.height);
        context.drawImage(this.image, this.frameX * this.width, this.frameY * this.height, this.width, this.height, this.x, this.y, this.width, this.height);
    }
    onGround(){
        return this.y >= this.game.height - this.height - this.game.groundMargin;
    }
    setState(state, speed){
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
                // collision detected
                this.game.collisions.push(new CollisionAnimation(this.game, enemy))

                if (enemy.type !== "Chopsticks" && enemy.type !== "BigMiso"){
                    enemy.markedForDeletion = true;
                }

                if (this.currentState === this.states[4]) {
                    this.game.score++;
                    this.game.floatingMessages.push(new FloatingMessage('+1', enemy.x, enemy.y, 115, 45));
                    if (enemy.type !== "Chopsticks"){
                    enemy.markedForDeletion = true;
                    }
                } else {
                    if (enemy.type == "Chopsticks" && enemy.hit == false)
                    {
                    if(this.currentState !== this.states[6]) this.game.lives--;
                    this.setState(6, 0);
                    }
                    else if (enemy.type == "Miso" && (this.currentState !== this.states[3])){
                    if(this.currentState !== this.states[6]) this.game.lives--;
                    this.setState(6, 0);
                    }
                    else if (enemy.type == "BigMiso" && (this.currentState !== this.states[3])){
                    if(this.currentState !== this.states[6]) this.game.lives--;
                    this.setState(6, 0);
                    enemy.markedForDeletion = true;
                    }
                    if (this.game.lives <= 0) this.game.gameOver = true;
                }
                
                if (enemy.type == "Wasabi" && this.game.wasabi <= this.game.wasabiWinCount) {
                        this.game.wasabi += 5;
                }

                if (enemy.type == "BigMiso"){
                    if (this.currentState === this.states[3]){
                        if (enemy.hit == true){
                            enemy.markedForDeletion = true;
                        } else {
                            this.setState(5,0)
                        }
                    }
                }

                enemy.hit = true;
            }
        });
    }
}