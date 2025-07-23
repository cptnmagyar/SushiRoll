// Coty Reid Kovach - M25W0711
// Handles the user input in order to change the Player State
// W or Arrow Up Key to Jump
// A or Arrow Left Key for Backward
// D or Arrow Right Key for Forward
// Space or Enter for Wasabi Mode
// This is accessed in Main.js
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
            }
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