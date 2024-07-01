class ProgressBar{
    constructor(x, y, config){
        // x, y: positions in pixels
        // config is a file of round-level data containing start and target vals
        this.position = createVector(x, y);
        this.start = createVector(x, y);
        this.blocks = [];
        // Box dims
        this.levels = [-10, -9, -8, -7, -6, -5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
        this.width = Math.floor((window.screen.width*0.8)/this.levels.length);
        this.height = this.width*1.5;
        // Placeholders
        this.config = config;
        this.score = config.score
        this.target = config.target
        this.text = "";
        // Transition arrow params
        this.showTransition = false;
        this.transitionArrow = {
            A : undefined,
            B : undefined
        }
        this.transitionArrowOpacity = 1;

        
        this.levels.forEach((val, ix) => {
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

    setText(result){
        if (result == "win"){
            this.text = "Correct! Loading next level..."
        } else if (result == "lose"){
            this.text = "Incorrect - loading next level..."
        } else if (result == "clear"){
            this.text = "";
        } 
        else {
            throw new Error(`Result ${result} not recognised - must be win or lose.`)
        }
    }

    showTransitionArrow(start, target){
        if (start == target) {return}
        this.transitionArrowOpacity = 1;
        let startBlock = this.blocks.filter(pb => pb.value == start)[0]
        let targetBlock = this.blocks.filter(pb => pb.value == target)[0]
        this.transitionArrow = {A: startBlock, B: targetBlock};
        this.setTransitionArrow();
        this.showTransition = true;
    }

    setTransitionArrow(){
        // show a transition arrow between blocks A and B (input params)
        let A = this.transitionArrow.A;
        let B = this.transitionArrow.B;
        const baseY = this.position.y + A.height/4
        const triangleStartX = (B.centreX - A.centreX)
        // const baseY = 1000
        push();
        noStroke();
        fill(`rgba(255, 134, 0, ${this.transitionArrowOpacity})`)
        translate(A.centreX, baseY)
        if (B.centreX > A.centreX){
            rect(0, A.height/8, (B.centreX - A.centreX)-A.width/2, A.height/4)
            triangle(
                triangleStartX - A.width/2, 0, 
                triangleStartX - A.width/2, A.height/2, 
                triangleStartX, A.height/4)
        } else {
            rect(0, A.height/8, (B.centreX - A.centreX)+A.width/2, A.height/4)
            triangle(
                    triangleStartX + A.width/2, 0, 
                    triangleStartX + A.width/2, A.height/2, 
                    triangleStartX, A.height/4)
        }
        
        pop();
    }

    clearArrow(){
        this.transitionArrowOpacity = 0;
        this.showTransition = false;
    }

    draw(){
        this.blocks.forEach(b => b.draw());

        push();
        stroke('black')
        fill('black')
        textSize(32)
        textFont(assets["fonts"]["kalam-regular"]);
        // text(this.text, this.width + Math.floor((this.levels.length-4)/2)*this.width, this.height*4)
        text(this.text, width/2 - (textWidth(this.text))/2, this.height)
        pop();

        if (this.showTransition) {
            this.setTransitionArrow();
        }
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
        this.centreX = this.x + this.width/2;
        this.centreY = this.y + this.height/2;
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

        // Scale char img to fit within boxes
        this.imgScaleFactor = (this.width*0.9)/assets.imgs.char.width;
        this.scaledTextSize = Math.floor((width/1920)*32);
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
        translate(pos.x+this.width/8, pos.y+this.height/4)
        // translate(pos.x, pos.y)
        scale(this.imgScaleFactor)
        tint(this.hidden ? `rgba(255, 255, 255, ${this.alpha.transparent})` : `rgba(255, 255, 255, ${this.alpha.full})`)
        image(this.img, 0, 0)
        pop();
        
        // Draw value labels
        push();
        translate(
            this.value >= 0 && this.value < 10 ? pos.x + this.width/4 + 10 : pos.x + this.width/4, 
            pos.y+1.4*this.height);
        stroke('black')
        fill('black')
        textFont(assets["fonts"]["kalam-regular"]);
        textSize(this.scaledTextSize)
        text(`${this.value}`, 0, 0)

        pop();
    }
}

class Timer{
    constructor(x, y, w, h, timeLength){
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.timeLength = timeLength;
        this.initTime = Date.now();
        this.stop = false;
        this.prop = 0;
    }

    reset(){
        this.initTime = Date.now();
        this.stop = false;
    }

    onTimeUp(){
    }

    pause(){
        this.stop = true;
    }

    draw(){
        if (!this.stop){
            let timeDiff = (Date.now() - this.initTime)/1000; // Difference between start and now in seconds
            this.prop = timeDiff / this.timeLength; // The ratio of time passed (range 0-1)
            if (this.prop >= 1){ // i.e. timePassed / totalTime = 1, i.e. timePassed == totalTime
                this.onTimeUp();
                this.prop = 0;
            }
        }
        push();
        strokeWeight(10)
        stroke("rgb(235, 155, 52)")
        translate(this.x, this.y);
        arc(0, 0, this.w, this.h, 0, (1-this.prop)*2*PI);
        pop();
    }
}