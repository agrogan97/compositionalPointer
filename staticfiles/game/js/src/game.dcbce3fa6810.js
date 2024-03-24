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
// var assets = {imgs: {}, fonts: {}}
var hasClicked = false;
const revealTimeout = 500; // The time between click and revealing the answer
var dark=false;

// -- Game window settings
var isFullScreen = false;
var kill = false
var begin = false;


function setImgs(){
    const roomIds = generateRoomMappings();
    // edit the list below to add expected values from the URL - kinda weird? Should change this
    params = getUrlParams(["playerId", "ct", "source"]);
    if (params.ct == undefined) {params.ct = 'BEstudy'}
    mapping = {'A' : roomIds[0], 'B' : roomIds[1], 'C' : roomIds[2], 'D' : roomIds[3]};
    
    curriculum = defineCurriculum(params.ct);
    config = curriculum[roundIndex];
    config.starttime = Date.now().toString()

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
            console.log("room" + room.toString())
            elem.src = assets.imgs["room" + room.toString()]
            // elem.src = `/static/game/imgs/room${room}.png`
        })
    }
}

const nextRound = () => {
    roundIndex += 1;
    if (roundIndex == curriculum.length) {
        console.log("Game complete")
        hasClicked = true;
        // window.location.replace(`/debrief${location.search}&ki=false`)
        handleEndgameRedirect(false)
        return
    }
    config = curriculum[roundIndex];
    config.starttime = Date.now().toString()
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
    // Not the most efficient way of adding statics, but it works when I'm working to this many deadlines
    assets.imgs.char = loadImage(assets.imgs.char);
    // assets.imgs.room1 = loadImage(assets.imgs.room1);
    // assets.imgs.room2 = loadImage(assets.imgs.room2);
    // assets.imgs.room3 = loadImage(assets.imgs.room3);
    // assets.imgs.room4 = loadImage(assets.imgs.room4);
    // assets.imgs.room5 = loadImage(assets.imgs.room5);
    // assets.imgs.room6 = loadImage(assets.imgs.room6);
    // assets.imgs.room7 = loadImage(assets.imgs.room7);
    // assets.imgs.room8 = loadImage(assets.imgs.room8);
    // assets.imgs.room9 = loadImage(assets.imgs.room9);
    // assets.imgs.room10 = loadImage(assets.imgs.room10);
    // assets.imgs.room11 = loadImage(assets.imgs.room11);
    // assets.imgs.room12 = loadImage(assets.imgs.room12);
    assets["fonts"]["kalam-bold"] = loadFont(assets.fonts["kalam-bold"]);
    assets["fonts"]["kalam-light"] = loadFont(assets.fonts["kalam-light"]);
    assets["fonts"]["kalam-regular"] = loadFont(assets.fonts["kalam-regular"]);
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
                config.endtime = Date.now().toString()
                config.playerId = params.playerId;
                config.roundIndex = roundIndex;
                config.curriculumType = params.ct;
                config.mapping = JSON.stringify(mapping);
                // config.params = params;
                config.source = params.source;
                config.functions = config.functions.join()
                console.log(`Saving`, config)
                // from here we can call an async save function and save the config obj (also add ID, currType, timestamp etc.)
                saveData(config).then((res) => console.log(res.status))
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

async function saveData(config){
    config
    const URL = `api/`
    const response = await fetch(URL, {
        method : 'POST',
        headers: {
            // 'X-CSRFToken': Cookies.get('csrftoken'),
            'Accept': 'application/json',
            'Content-Type': 'application/json' 
        },
        body: JSON.stringify(config)
    })

    return response
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
                handleEndgameRedirect(true)
            }, 500)
        } else {
            // if fullscreen, render content
            dark ? background(0, 13, 33) : background("white")
            pbar.draw();
        }
    }
}

function handleEndgameRedirect(earlyExit){
    /*Handles several endgame redirect cases
        1) No URL params provided, so includes the playerID and early exit status
        2) Provides all URL params EXCEPT playerId, so attaches the generated ID to the params, with early exit status
        3) All URL params provided, so attaches those plus early exit status to redirect link
    */
    if (location.search.length == 0){
        window.location.replace(`/debrief?&ki=true&playerId=${params.playerId}&ki=${earlyExit}`)
    } else if (location.search.length != 0 && !location.search.includes('playerId')){
        window.location.replace(`/debrief?${location.search}&playerId=${params.playerId}&ki=${earlyExit}`)
    } else {
        window.location.replace(`/debrief?${location.search}&ki=${earlyExit}`)
    }
}