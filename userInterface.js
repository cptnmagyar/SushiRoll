export class UI {
    constructor(game){
        this.game = game;
        this.fontSize = 30;
        this.fontFamily = 'Creepster';
        this.livesImage = lives;
        this.wasabiMeterImage = wasabi_meter;
        this.startMenu = start_menu;
        this.victoryMenu = victory_menu;
        this.lossMenu = loss_menu;
        this.wasabiMeterBackgroundImage = wasabi_meter_background;
        this.wasabiMeterSizeScaling = 5;
        this.wasabiMeterOffsetScaling = -0.075;
    }
    draw(context){
        context.save();
        context.font = this.fontSize + 'px ' + this.fontFamily;
        context.textAlign = 'left';
        // score
        context.shadowOffsetX = 4;
        context.shadowOffsetY = 4;
        context.shadowBlur = 0;
        context.fillStyle = '#d7ed89'
        context.shadowColor = 'black';
        context.font = this.fontSize * 1.15 + 'px ' + this.fontFamily;
        context.fillText('Wasabi Meter', 20, 30);

        
        context.shadowOffsetX = 4;
        context.shadowOffsetY = 4;
        context.shadowBlur = 0;
        context.fillStyle = 'white'
        context.shadowColor = 'black';
        context.font = this.fontSize * 1.15 + 'px ' + this.fontFamily;

        if (this.game.lives > 0) {
            context.fillText('LIVES', 20, 68);
        }
        else {
            context.fillText('YOU HAVE BEEN EATEN!', 20, 68);
        }
        
        context.shadowOffsetX = 2;
        context.shadowOffsetY = 2;
        context.shadowColor = 'white';
        context.shadowBlur = 0;
        context.fillStyle = this.game.fontColor;

        for (let i = 0; i < this.game.lives; i++) {
            context.drawImage(this.livesImage, 25 * i + 92, 39, 35, 35);
        }
        context.drawImage(this.wasabiMeterBackgroundImage, 200, -7, 1000, 50)

        context.shadowOffsetX = 0;
        context.shadowOffsetY = 0;

        if (this.game.wasabiWinCount == 300){
            this.wasabiMeterSizeScaling = 3.35
            this.wasabiMeterOffsetScaling = -0.055
        }

        context.drawImage(this.wasabiMeterImage, 215 + (this.game.wasabi * this.wasabiMeterOffsetScaling), -7, this.game.wasabi * this.wasabiMeterSizeScaling, 50)

        if (this.game.gameStart == false) {
            context.drawImage(this.startMenu, 0, 0, 1200, 575)
        }

        if (this.game.gameOver == true){
            if (this.game.wasabi >= this.game.wasabiWinCount) {
                context.drawImage(this.victoryMenu, 0, 0, 1200, 575)
            }
            else {
                context.drawImage(this.lossMenu, 0, 0, 1200, 575)
            }
        }

        context.restore();
    }
}