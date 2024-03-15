// Set params
var mapping;
var params;
var roundIndex = 0;
var config;
var STATIC_IP = `http://127.0.0.1:8000/static/game/imgs/`;
var curriculum;

// -- p5 globals
var canvas;
var pbar;
var roundData = {};
var assets = {imgs: {}}
var hasClicked = false;
const revealTimeout = 500; // The time between click and revealing the answer


function setImgs(){
    const roomIds = generateRoomMappings();
    params = getUrlParams(["id", "ct"]);
    mapping = {'A' : roomIds[0], 'B' : roomIds[1], 'C' : roomIds[2], 'D' : roomIds[3]};

    curriculum = defineCurriculum(params.ct);
    config = curriculum[roundIndex];

    parseNewRound(config, true);
}

const generateRoomMappings = () => {
    let bucket = [];

    for (let i=1; i<=12; i++){
        bucket.push(i);
    }

    const getRandomFromBucket = () => {
        let randomIndex = Math.floor(Math.random()*bucket.length);
        return bucket.splice(randomIndex, 1)[0]
    }

    let rooms = []
    for (let i=0; i<4; i++){
        rooms.push(getRandomFromBucket())
    }

    return rooms;
}

const parseNewRound = (config, set=true) => {
    // Convert list of functions to list of imgs according to the mapping
    let roomList = config.functions.map(i => (mapping[i]))
    if (set){
        let imgContainer = document.getElementById("imgContainer");
        roomList.forEach(room => {
            let elem = document.createElement("img");
            imgContainer.appendChild(elem);
            elem.src = `${STATIC_IP}room${room}.png`;
        })
    }
}

const nextRound = () => {
    roundIndex += 1;
    if (roundIndex == curriculum.length) {
        console.log("Game complete")
        hasClicked = true;
        return
    }
    config = curriculum[roundIndex];
    // Clear current images
    let imgContainer = document.getElementById("imgContainer");
    let child = imgContainer.lastElementChild;
        while (child) {
            imgContainer.removeChild(child);
            child = imgContainer.lastElementChild;
        }
    parseNewRound(config)
    pbar.blocks.forEach(block => block.updateConfig(config))
    hasClicked = false;
    document.getElementById("roundIndex").innerHTML = `Round ${roundIndex+1}/${curriculum.length}`
}

// -- P5 Functions --

function preload(){
    assets.imgs.char = loadImage(`${STATIC_IP}character.png`)

}

function handleClick(e){
    if (hasClicked){
        return
    }
    let clickPos = createVector(e.clientX, e.clientY - window.innerHeight/2 + 1.25*pbar.height );
    pbar.blocks.forEach(block => {
        let bPos = block.position;
        if (clickPos.x >= bPos.x && clickPos.x < bPos.x + block.width) {
            if (clickPos.y >= bPos.y && clickPos.y < bPos.y + block.height){
                hasClicked = true;
                // if clicked on target, turn it green
                if (block.value == config.target){
                    setTimeout(() => {block.setColour('green')}, revealTimeout)
                    // block.setColour('green')
                    block.hidden = false;
                } else {
                    setTimeout(() => {
                        block.setColour('red');
                        pbar.blocks.filter(b => b.value==config.target)[0].setColour('green')
                    }, revealTimeout)
                    // block.setColour('red')
                    
                    block.hidden=false
                }
                pbar.blocks.filter(b => (!b.hidden && block.value != b.value))[0].hidden = true;
                // Move character to clicked block
                // pbar.blocks.forEach(block => block.refreshChar(block.value))
                // if clicked on wrong block, turn it red and turn correct green
                config.score = block.value;
                config.endTime = Date.now();
                config.id = params.id;
                config.roundIndex = roundIndex;
                config.curriculumType = params.ct;
                console.log(`Saving`, config)
                // from here we can call an async save function and save the config obj (also add ID, currType, timestamp etc.)
                setTimeout(() => {
                    nextRound();
                }, 2500)
            }
        }
    })
}

function setup(){
    setImgs();
    var canvas = createCanvas(window.innerWidth, window.innerHeight/2);
    canvas.parent("gameCanvas");
    rectMode(CORNER);
    imageMode(CORNER);
    pbar = new ProgressBar(window.innerWidth/2-50, 250, config)
    canvas.mouseClicked((e) => handleClick(e))
    document.getElementById("roundIndex").innerHTML = `Round ${roundIndex+1}/${curriculum.length}`
}

function draw(){

    clear();
    pbar.draw();

}