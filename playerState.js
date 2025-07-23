import { WasabiFire } from 'https://cptnmagyar.github.io/SushiRoll//particles.js';

// Coty Reid Kovach - M25W0711
// This class has the related Player States for the Sushi Roll
// These states change depending on the player's input and applies
// certain effects such as moving the sushi roll in a direction
// or changing the Sushi Roll's speed (coordinates change rate)
// The conditional statements makes it so the Player should
// always be in one state and apply the related X & Y coordinate changes
// Additionally, this changes the frameY multiplier as to display the
// appropriate animation image from the sushi roll's sprite sheet
export const states = {
    SITTING: 0,
    ROLLING: 1,
    JUMPING: 2,
    FALLING: 3,
    WASABI_MODE: 4,
    BOUNCING: 5,
    HIT: 6,
}

class State {
    constructor(state, game){
        this.state = state;
        this.game = game;
    }
}

export class Sitting extends State {
    constructor(game){
        super('SITTING', game);
    }

    enter(){
        this.game.player.frameX = 0;
        this.game.player.maxFrame = 9;
        this.game.player.frameY = 5;
    }

    handleInput(input){
        if ((input.includes('a') || input.includes('ArrowLeft')) || (input.includes('d') || input.includes('ArrowRight'))){
            this.game.player.setPlayerState(states.ROLLING, 1);
        } else if (input.includes(' ') || input.includes('Enter') && this.game.wasabi > 0){
            this.game.player.setPlayerState(states.WASABI_MODE, 2);
        }
    }
}

export class Rolling extends State {
    constructor(game){
        super('ROLLING', game);
    }

    enter(){
        this.game.player.frameX = 0;
        this.game.player.maxFrame = 8;
        this.game.player.frameY = 3;
    }

    handleInput(input){
        this.game.player.weight = 1.5;
        if (input.includes('w') || input.includes('ArrowUp')){
            this.game.player.setPlayerState(states.JUMPING, 1);
        } else if ((input.includes(' ') || input.includes('Enter')) && this.game.wasabi > 0){
            this.game.player.setPlayerState(states.WASABI_MODE, 2);
        }
    }
}

export class Jumping extends State {
    constructor(game){
        super('JUMPING', game);
    }

    enter(){
        if (this.game.player.onGround()) this.game.player.vy -= 27;
        this.game.player.frameX = 0;
        this.game.player.maxFrame = 6;
        this.game.player.frameY = 1;
    }

    handleInput(input){
        if (this.game.player.vy > this.game.player.weight) {
            this.game.player.setPlayerState(states.FALLING, 1);
        } else if ((input.includes(' ') || input.includes('Enter')) && this.game.wasabi > 0){
            this.game.player.setPlayerState(states.WASABI_MODE, 2);
        }
    }
}

export class Bouncing extends State {
    constructor(game){
        super('Bouncing', game);
    }

    enter(){
        this.game.player.vy -= 45;
        this.game.player.frameX = 0;
        this.game.player.maxFrame = 6;
        this.game.player.frameY = 1;
    }

    handleInput(input){
        if (this.game.player.vy > this.game.player.weight) {
            this.game.player.setPlayerState(states.FALLING, 1);
        } else if ((input.includes(' ') || input.includes('Enter')) && this.game.wasabi > 0){
            this.game.player.setPlayerState(states.WASABI_MODE, 2);
        }
    }
}

export class Falling extends State {
    constructor(game){
        super('FALLING', game);
    }

    enter(){
        this.game.player.frameX = 0;
        this.game.player.maxFrame = 6;
        this.game.player.frameY = 2;
    }

    handleInput(){
        if (this.game.player.onGround()){
        this.game.player.setPlayerState(states.ROLLING, 1);
        }
    }
}

export class WasabiMode extends State {
    constructor(game){
        super('WASABI_MODE', game);
    }

    enter(){
        this.game.player.frameX = 0;
        this.game.player.maxFrame = 6;
        this.game.player.frameY = 6;
    }

    handleInput(input){
        if (this.game.wasabi > 0) {
            if (this.game.wasabi <= 100) {
                this.game.wasabi -= 0.075;
            } else {this.game.wasabi -= 0.125;}
        }
        else {
            this.game.wasabi = 0;
            this.game.player.setPlayerState(states.FALLING, 1);
        }

        this.game.player.weight = 0.75;
        this.game.particles.unshift(new WasabiFire(this.game, this.game.player.x + this.game.player.width * 0.5, this.game.player.y + this.game.player.height * 0.5));
        if (!(input.includes(' ') || input.includes('Enter')) && this.game.player.onGround()){
        this.game.player.setPlayerState(states.ROLLING, 1);
        } else if (!(input.includes(' ') || input.includes('Enter')) && !this.game.player.onGround()){
            this.game.player.setPlayerState(states.FALLING, 1);
        } else if ((input.includes(' ') || input.includes('Enter')) && (input.includes('w') || input.includes('ArrowUp')) && this.game.player.onGround()){
            this.game.player.vy -= 27;
        }
    }
}

export class Hit extends State {
    constructor(game){
        super('HIT', game);
    }

    enter(){
        this.game.player.frameX = 0;
        this.game.player.maxFrame = 10;
        this.game.player.frameY = 4;
    }

    handleInput(){
        if (this.game.player.frameX >= 10 && this.game.player.onGround()){
            this.game.player.setPlayerState(states.ROLLING, 1);
        } else if (this.game.player.frameX >= 10 && !this.game.player.onGround()){
            this.game.player.setPlayerState(states.FALLING, 1)
        }
    }
}