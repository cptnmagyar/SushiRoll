// Coty Reid Kovach - M25W0711
// Creates a green fire particle effect
// These particles are created by the player state "Wasabi Mode"
// Additionally the Wasabi enemy periodically creates these particles
// This is then accessed and managed in the main.js which
// calls the particle's update and draw functions continously
// The particles increase in size and then are marked to be removed
class Particle {
    constructor(game){
        this.game = game;
        this.delete = false;
    }

    update(){
        this.x -= this.speedX + this.game.speed;
        this.y -= this.speedY;
        this.size *= 0.95;
        if (this.size < 0.5) this.delete = true;
    }
}

export class WasabiFire extends Particle {
    constructor(game, x, y) {
        super(game);
        this.image = wasabi_fire;
        this.size = Math.random() * 100 + 100;
        this.x = x;
        this.y = y;
        this.speedX = 1;
        this.speedY = 1;
        this.angle = 0;
        this.va = Math.random() * 0.2 - 0.1;
    }

    update(){
        super.update();
        this.angle += this.va;
        this.x += Math.sin(this.angle * 5);
    }

    draw(context){
        context.save();
        context.translate(this.x, this.y);
        context.rotate(this.angle);
        context.drawImage(this.image, -this.size * 0.5, -this.size * 0.5, this.size, this.size);
        context.restore();
    }
}