class ProgressBar{
    constructor(x, y, config){
        // x, y: positions in pixels
        // config is a file of round-level data containing start and target vals
        this.position = createVector(x, y);
        this.start = createVector(x, y);
        this.blocks = [];
        // Box dims
        this.width = 80;
        this.height = 125;
        // Placeholders
        this.config = config;
        this.score = config.score
        this.target = config.target

        const levels = [-10, -9, -8, -7, -6, -5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
        levels.forEach((val, ix) => {
            this.blocks.push(
                new Block(
                    this.start.x + (this.width*val),
                    this.start.y,
                    this.width,
                    this.height,
                    val,
                    this.config
                )
            )
        })
    }

    draw(){
        this.blocks.forEach(b => b.draw());
    }
}

class Block{
    // x, y are position in pixels
    // w and h are width and height
    // value is the value associated with this block in range [-10, 10)
    // config is the player data score
    constructor(x, y, w, h, value, config){
        this.p5 = p5;
        this.position = createVector(x, y);
        this.x = x;
        this.y = y;
        this.width=w;
        this.height=h;
        this.value = value;
        this.config = config;
        this.img = assets.imgs.char;
        this.hidden = (this.value != this.config.start);
        this.colours = {
            white: `rgba(255, 255, 255, 1.0)`,
            red: `rgba(255, 0, 0, 0.8)`,
            green: `rgba(14, 194, 0, 1)`
        }
        this.colour = this.colours.white;
        this.alpha = {
            "full" : 1.0,
            "transparent" : 0.0,
            "part" : 0.4
        }
        this.hasChar = (this.config.start == this.value)
    }

    setColour(col){
        this.colour = this.colours[col];
    }

    refreshChar(score){
        // Check if the score ties to this block value and refresh the character img
        this.hidden = (this.value == score);
    }

    updateConfig(config){
        // update the config file with new target, start, and score
        // also refresh the char img
        this.config = config;
        this.hidden = (this.value != config.start);
        this.setColour('white')
    }

    draw(){
        let pos = this.position;

        // Draw boxes
        push();
        translate(pos.x, pos.y);
        fill(this.colour)
        rect(0, 0, this.width, this.height);
        pop();

        // Draw character img
        push();
        translate(pos.x-this.width/8, pos.y+this.height/4)
        scale(0.275)
        tint(this.hidden ? `rgba(255, 255, 255, ${this.alpha.transparent})` : `rgba(255, 255, 255, ${this.alpha.full})`)
        image(this.img, 0, 0)
        pop();
        
        // Draw value labels
        push();
        translate(
            this.value >= 0 && this.value < 10 ? pos.x + this.width/4 + 10 : pos.x + this.width/4, 
            pos.y+1.4*this.height);
        textSize(32)
        text(`${this.value}`, 0, 0)

        pop();
    }
}