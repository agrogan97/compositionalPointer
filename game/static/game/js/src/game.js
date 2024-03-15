// Set params
var mapping;
var params;
var roundIndex = 0;
var config;
var curriculum;

// -- p5 globals
var canvas;
var pbar;
var roundData = {};
var assets = {imgs: {}, fonts: {}}
var hasClicked = false;
const revealTimeout = 500; // The time between click and revealing the answer
var dark=false;

// -- Game window settings
var isFullScreen = false;
var kill = false
var begin = false;


function setImgs(){
    const roomIds = generateRoomMappings();
    params = getUrlParams(["id", "ct"]);
    if (params.ct == undefined) {params.ct = 'linear'}
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
            elem.src = `/static/game/imgs/room${room}.png`
        })
    }
}

const nextRound = () => {
    roundIndex += 1;
    if (roundIndex == curriculum.length) {
        console.log("Game complete")
        hasClicked = true;
        window.location.replace(`/debrief${location.search}&ki=false`)
        return
    }
    config = curriculum[roundIndex];
    config.startTime = Date.now()
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
    assets.imgs.char = loadImage(`/static/game/imgs/character.png`);
    assets["fonts"]["kalam-bold"] = loadFont("/static/game/fonts/Kalam-Bold.ttf");
    assets["fonts"]["kalam-light"] = loadFont("/static/game/fonts/Kalam-Light.ttf");
    assets["fonts"]["kalam-regular"] = loadFont("/static/game/fonts/Kalam-Regular.ttf");
}

function handleClick(e){
    if (hasClicked){
        return
    }
    // Here we find the bounding rect of the parent div, and offset the click by its height to find the progress bar
    let clickPos = createVector(e.clientX, e.clientY - canvas.parentElement.getBoundingClientRect().y);
    pbar.blocks.forEach(block => {
        let bPos = block.position;
        if (clickPos.x >= bPos.x && clickPos.x < bPos.x + block.width) {
            if (clickPos.y >= bPos.y && clickPos.y < bPos.y + block.height){
                hasClicked = true;
                // if clicked on target, turn it green
                if (block.value == config.target){
                    setTimeout(() => {
                        block.setColour('green');
                        pbar.setText("win")
                    }, revealTimeout)
                    block.hidden = false;
                } else {
                    setTimeout(() => {
                        block.setColour('red');
                        pbar.blocks.filter(b => b.value==config.target)[0].setColour('green');
                        pbar.setText("lose")
                    }, revealTimeout)
                    block.hidden=false;
                }
                try {
                    pbar.blocks.filter(b => (!b.hidden && block.value != b.value))[0].hidden = true;    
                } catch (error) {
                    {}
                }
                // Move character to clicked block
                config.score = block.value;
                // Show transition arrow
                pbar.showTransitionArrow(config.start, block.value);
                // Add data to savefile
                config.endTime = Date.now();
                config.id = params.id;
                config.roundIndex = roundIndex;
                config.curriculumType = params.ct;
                config.mapping = mapping;
                config.params = params;
                config.functions = config.functions.join()
                console.log(`Saving`, config)
                // from here we can call an async save function and save the config obj (also add ID, currType, timestamp etc.)
                setTimeout(() => {
                    pbar.transitionArrowOpacity = 0;
                    pbar.showTransition = false;
                    pbar.setText("clear")
                    nextRound();
                }, 2500)
            }
        }
    })
}

function setup(){
    setImgs();
    var canvas = createCanvas(window.innerWidth, window.innerHeight - document.getElementById("imgContainer").getBoundingClientRect().bottom);
    canvas.parent("gameCanvas");
    rectMode(CORNER);
    imageMode(CORNER);
    pbar = new ProgressBar(width/2-50, 250, config)
    document.getElementById("roundIndex").innerHTML = `Round ${roundIndex+1}/${curriculum.length}`;
    // add an initial fullscreen load click listener
    document.addEventListener("click", () => {
        if (!begin){
            isFullScreen = true
            requestFullScreen(document.documentElement)
            document.getElementById("fullscreenText").classList.add("hidden");
            setTimeout(() => {
                begin = true;
                // hide fullscreen message and show img container
                document.getElementById("imgContainer").classList.remove("hidden");
                canvas.mouseClicked((e) => handleClick(e))
            }, 250)
        }
    })
}

function draw(){
    clear();

    if (begin){
        if (!isFullScreen) {return}
        // Check still fullscreen:
        if (detectFullscreen() == undefined){
            isFullScreen = false
            setTimeout(() => {
                isFullScreen = false;
                location.search.length == 0 ? window.location.replace(`/debrief?&ki=true`) : window.location.replace(`/debrief${location.search}&ki=true`)
                // window.location.replace(`/debrief${location.search}&ki=true`)
            }, 500)
        } else {
            // if fullscreen, render content
            dark ? background(0, 13, 33) : background("white")
            pbar.draw();
        }
    }
}