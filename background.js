class Layer {
    constructor(game, width, height, speedModifier, image){
        this.game = game;
        this.width = width;
        this.height = height;
        this.speedModifier = speedModifier;
        this.image = image;
        this.x = 0;
        this.y = 0;
    }
    update(){
        if (this.x < -this.width) this.x = 0;
        else this.x -= this.game.speed * this.speedModifier;
    }
    draw(context){
        context.drawImage(this.image, this.x, this.y, this.width, this.height);
        context.drawImage(this.image, this.x + this.width, this.y, this.width, this.height);
    }
}

export class Background {
    constructor(game){
        this.game = game;
        this.width = 1667;
        this.height = 600;
        
        this.background0Image = background0;
        this.background1Image = background1;
        this.background2Image = background2;
        this.background3Image = background3;
        
        this.background_Shop = new Layer(this.game, this.width, this.height, 0, this.background3Image);
        this.background_Customers = new Layer(this.game, this.width, this.height, 0.2, this.background2Image);
        this.background_Sushi = new Layer(this.game, this.width, this.height, 0.8, this.background1Image);
        this.background_Belt = new Layer(this.game, this.width, this.height, 1, this.background0Image);

        this.backgroundLayers = [this.background_Shop, this.background_Customers,this.background_Sushi,  this.background_Belt];
    }
    update(){
            this.backgroundLayers.forEach(layer => {
                layer.update();
            });
    }
    draw(context){
        
            this.backgroundLayers.forEach(layer => {
                layer.draw(context);
            });
    }
}