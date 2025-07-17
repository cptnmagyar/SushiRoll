import { EnemyFire } from "https://cptnmagyar.github.io/SushiRoll//particles.js";

class Enemy {
    constructor(){
        this.frameX = 0;
        this.frameY = 0;
        this.fps = 20;
        this.frameInterval = 1000/this.fps;
        this.frameTimer = 0;
        this.markedForDeletion = false;
        this.hit = false;
    }
    update(deltaTime){
        // movement
        this.x -= this.speedX + this.game.speed;
        this.y += this.speedY;
        if (this.frameTimer > this.frameInterval){
            this.frameTimer = 0;
            if (this.frameX < this.maxFrame) this.frameX++;
            else this.frameX = 0;
        } else {
            this.frameTimer += deltaTime;
        }
        // check if off screen
        if (this.x + this.width < 0) this.markedForDeletion = true;
    }
    draw(context){
        if (this.game.debug) context.strokeRect(this.x, this.y, this.width, this.height);
        context.drawImage(this.image, this.frameX * this.width, this.frameY * this.height, this.width, this.height, this.x, this.y, this.width, this.height)
    }
}

export class WasabiEnemy extends Enemy {
    constructor(game){
        super();
        this.game = game;
        this.type = "Wasabi";
        this.width = 70;
        this.height = 60;
        this.hit = false;
        this.x = this.game.width + Math.random() * this.game.width * 0.5;
        this.y = Math.random() * this.game.height * 0.5;
        this.deltaMultiplier = Math.floor(Math.random() * (4 - 2 + 1)) + 2;
        this.speedX = Math.random() + 1;
        this.speedY = 0;
        this.maxFrame = 5;
        this.image = enemy_wasabi;
        this.angle = 0;
        this.velocityOfAngle = Math.random() * 0.1 + 0.1;
    }
    update(deltaTime){
        if (deltaTime % this.deltaMultiplier === 1){
            this.game.particles.unshift(new EnemyFire(this.game, this.x + this.width * 0.5, this.y + this.height));
        }
        
        super.update(deltaTime);
        this.angle += this.velocityOfAngle;
        this.y += Math.sin(this.angle);
    }
}

export class GroundEnemy extends Enemy {
    constructor(game){
        super();
        this.game = game;
        this.type = "Miso";
        this.width = 89;
        this.height = 87;
        this.hit = false;
        this.x = this.game.width;
        this.y = this.game.height - this.height - this.game.groundMargin;
        this.image = enemy_soup;
        this.speedX = 0;
        this.speedY = 0;
        this.maxFrame = 5;
    }
}

export class GroundEnemyBig extends Enemy {
    constructor(game){
        super();
        this.game = game;
        this.type = "BigMiso";
        this.hit = false;
        this.width = 156;
        this.height = 160;
        this.hit = false;
        this.x = this.game.width;
        this.y = this.game.height - this.height - this.game.groundMargin;
        this.image = enemy_soup_big;
        this.speedX = 0;
        this.speedY = 0;
        this.maxFrame = 5;
    }
    update(deltaTime){
        // movement
        this.x -= this.speedX + this.game.speed;
        this.y += this.speedY;
        if (this.hit == true){
            this.frameY = 1;
        }
        if (this.frameTimer > this.frameInterval){
            this.frameTimer = 0;
            if (this.frameX < this.maxFrame) this.frameX++;
            else this.frameX = 0;
        } else {
            this.frameTimer += deltaTime;
        }
        // check if off screen
        if (this.x + this.width < 0) this.markedForDeletion = true;
    }
}

export class ClimbingEnemy extends Enemy {
    constructor(game){
        super();
        this.game = game;
        this.type = "Chopsticks";
        this.width = 100;
        this.height = 535;
        this.hit = false;
        this.x = this.game.width + (Math.random() * 100);
        this.speedX = 0;
        this.speedY = Math.random() * 1.5 + 1;
        this.y = (Math.random() * (this.game.height - 700)) - 300;

        if (Math.random() < 0.5) {
            this.x = ((Math.random() * this.game.width) + 200);
            this.y = (Math.random() * (this.game.height - 700)) - 350;
            this.speedY = Math.random() * 1.5 + 0.75;
        }
        
        this.image = enemy_chopsticks;
        this.maxFrame = 5;
    }
    update(deltaTime){
        super.update(deltaTime);
        if ((this.y + 18 > this.game.height - (this.height) - this.game.groundMargin) || this.hit == true) this.speedY = -3.5;
        if (this.y < -this.height) this.markedForDeletion = true;
        if (this.hit == true){
            this.frameY= 1;
        }
    }
    draw(context){
        super.draw(context);
        context.beginPath();
        context.moveTo(this.x + this.width * 0.5, 0);
        context.stroke();
    }
}