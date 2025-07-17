import { Dust, Fire, Splash } from "/particles.js";

export const states = {
    SITTING: 0,
    RUNNING: 1,
    JUMPING: 2,
    FALLING: 3,
    ROLLING: 4,
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
            this.game.player.setState(states.RUNNING, 1);
        } else if (input.includes(' ') || input.includes('Enter') && this.game.wasabi > 0){
            this.game.player.setState(states.ROLLING, 2);
        }
    }
}

export class Running extends State {
    constructor(game){
        super('RUNNING', game);
    }
    enter(){
        this.game.player.frameX = 0;
        this.game.player.maxFrame = 8;
        this.game.player.frameY = 3;
    }
    handleInput(input){
        this.game.player.weight = 1.5;
        this.game.particles.unshift(new Dust(this.game, this.game.player.x + this.game.player.width * 0.5, this.game.player.y + this.game.player.height));
        if (input.includes('w') || input.includes('ArrowUp')){
            this.game.player.setState(states.JUMPING, 1);
        } else if ((input.includes(' ') || input.includes('Enter')) && this.game.wasabi > 0){
            this.game.player.setState(states.ROLLING, 2);
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
            this.game.player.setState(states.FALLING, 1);
        } else if ((input.includes(' ') || input.includes('Enter')) && this.game.wasabi > 0){
            this.game.player.setState(states.ROLLING, 2);
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
            this.game.player.setState(states.FALLING, 1);
        } else if ((input.includes(' ') || input.includes('Enter')) && this.game.wasabi > 0){
            this.game.player.setState(states.ROLLING, 2);
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
    handleInput(input){
        if (this.game.player.onGround()){
        this.game.player.setState(states.RUNNING, 1);
        }
    }
}

export class Rolling extends State {
    constructor(game){
        super('ROLLING', game);
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
            this.game.player.setState(states.FALLING, 1);
        }

        this.game.player.weight = 0.75;
        this.game.particles.unshift(new Fire(this.game, this.game.player.x + this.game.player.width * 0.5, this.game.player.y + this.game.player.height * 0.5));
        if (!(input.includes(' ') || input.includes('Enter')) && this.game.player.onGround()){
        this.game.player.setState(states.RUNNING, 1);
        } else if (!(input.includes(' ') || input.includes('Enter')) && !this.game.player.onGround()){
            this.game.player.setState(states.FALLING, 1);
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
    handleInput(input){
        if (this.game.player.frameX >= 10 && this.game.player.onGround()){
            this.game.player.setState(states.RUNNING, 1);
        } else if (this.game.player.frameX >= 10 && !this.game.player.onGround()){
            this.game.player.setState(states.FALLING, 1)
        }
    }
}