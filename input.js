export class InputHandler {
    constructor(game){
        this.game = game;
        this.keys = [];
        window.addEventListener('keydown', (e) => {
            if ((   e.key === 'w' ||
                    e.key === 'ArrowUp' ||
                    e.key === 'a' ||
                    e.key === 'ArrowLeft' ||
                    e.key === 'd' ||
                    e.key === 'ArrowRight' ||
                    e.key === ' ' ||
                    e.key === 'Enter'
                ) && this.keys.indexOf(e.key) === -1 && this.game.gameStart){
                this.keys.push(e.key);
            } else if (e.key === 'b') this.game.debug = !this.game.debug;
        });
        window.addEventListener('keyup', (e) => {
            if ((   e.key === 'w' ||
                    e.key === 'ArrowUp' ||
                    e.key === 'a' ||
                    e.key === 'ArrowLeft' ||
                    e.key === 'd' ||
                    e.key === 'ArrowRight' ||
                    e.key === ' ' ||
                    e.key === 'Enter') && this.game.gameStart){
                this.keys.splice(this.keys.indexOf(e.key), 1);
            }
        });
    }
}