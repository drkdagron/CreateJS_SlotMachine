/// <reference path="../typings/stats/stats.d.ts" />
/// <reference path="../typings/createjs-lib/createjs-lib.d.ts" />
/// <reference path="../typings/easeljs/easeljs.d.ts" />
/// <reference path="../typings/tweenjs/tweenjs.d.ts" />
/// <reference path="../typings/soundjs/soundjs.d.ts" />
/// <reference path="../typings/preloadjs/preloadjs.d.ts" />
/// <reference path="../objects/label.ts" />
/// <reference path="../objects/gameobject.ts" />
/// <reference path="../objects/spritebutton.ts" />

var assets: createjs.LoadQueue;
var canvas: HTMLElement;
var stage: createjs.Stage;
var stats: Stats;
var atlas: createjs.SpriteSheet;

var background: createjs.Bitmap;

var currentMoney = 1000;
var lblMoney;

var currentBet = 100;
var lblBet;

var lastWinning;
var lblWinnings;

var currentJackpot = 5000;
var lblJackpot;

var globalOffsetX = 132.5;

var tile1ImageRow: objects.GameObject[];
var tile1Current: number;
var row1Roll: boolean;

var tile2ImageRow: objects.GameObject[];
var tile2Current: number;
var row2Roll: boolean;

var tile3ImageRow: objects.GameObject[];
var tile3Current: number;
var row3Roll: boolean;

//spritesheet info
var data = {

    "images": [
        "../../assets/graphics/atlas.png"
    ],

    "frames": [
        [2, 2, 253, 4, 0, 0, 0],
        [2, 8, 69, 69, 0, 0, 0],
        [2, 79, 69, 69, 0, 0, 0],
        [2, 150, 69, 69, 0, 0, 0],
        [73, 8, 69, 69, 0, 0, 0],
        [144, 8, 69, 69, 0, 0, 0],
        [215, 8, 60, 60, 0, 0, 0],
        [215, 70, 60, 60, 0, 0, 0],
        [73, 79, 69, 69, 0, 0, 0],
        [144, 79, 69, 69, 0, 0, 0],
        [215, 132, 60, 60, 0, 0, 0],
        [73, 194, 69, 69, 0, 0, 0],
        [144, 150, 60, 60, 0, 0, 0],
        [144, 212, 60, 60, 0, 0, 0],
        [206, 194, 60, 60, 0, 0, 0]
    ],

    "animations": {
        "bet_line": [0],
        "snake": [1],
        "monkey": [2],
        "giraffe": [3],
        "blank": [4],
        "pig": [5],
        "bet100Button": [6],
        "bet10Button": [7],
        "elephant": [8],
        "parrot": [9],
        "bet1Button": [10],
        "panda": [11],
        "betMaxButton": [12],
        "genericButton": [13],
        "spinButton": [14]
    },
};

function createImageArray(): objects.GameObject[] {
    var array: objects.GameObject[];
    array = new Array<objects.GameObject>();
    array.push(new objects.GameObject("blank", 0, 0));
    array.push(new objects.GameObject("giraffe", 0, -69));
    array.push(new objects.GameObject("elephant", 0, 69));
    array.push(new objects.GameObject("monkey", 0, 138));
    array.push(new objects.GameObject("snake", 0, -138));
    array.push(new objects.GameObject("panda", 0, 207));
    array.push(new objects.GameObject("parrot", 0, -207));

    return array;
}

function init(): void {
    canvas = document.getElementById("canvas"); // reference to canvas element
    stage = new createjs.Stage(canvas); // passing canvas to stage
    stage.enableMouseOver(20); // enable mouse events
    createjs.Ticker.setFPS(60); // set frame rate to 60 fps
    createjs.Ticker.on("tick", gameLoop); // update gameLoop every frame
    setupStats(); // sets up our stats counting

    atlas = new createjs.SpriteSheet(data);

    tile1ImageRow = createImageArray();
    tile2ImageRow = createImageArray();
    tile3ImageRow = createImageArray();

    var tile1Container = new createjs.Container();
    tile1Container.x = globalOffsetX + 74;
    tile1Container.y = 192;
    
    var tile2Container = new createjs.Container();
    tile2Container.x = globalOffsetX + 152;
    tile2Container.y = 192;

    var tile3Container = new createjs.Container();
    tile3Container.x = globalOffsetX + 230;
    tile3Container.y = 192;

    for (var i = 0; i < 7; i++) {
        tile1Container.addChild(tile1ImageRow[i]);
        tile2Container.addChild(tile2ImageRow[i]);
        tile3Container.addChild(tile3ImageRow[i]);
    }
    stage.addChild(tile1Container);
    stage.addChild(tile2Container);
    stage.addChild(tile3Container);

    background = new createjs.Bitmap("../../assets/graphics/background.png");
    background.setBounds(0, 0, 375, 480);
    background.x = globalOffsetX;
    stage.addChild(background);


    var bet1: objects.SpriteButton = new objects.SpriteButton("bet1Button", globalOffsetX + 23, 386, "bet1");
    bet1.addEventListener("click", guiClicked, false);
    stage.addChild(bet1);
    var bet10: objects.SpriteButton = new objects.SpriteButton("bet10Button", globalOffsetX + 88, 386, "bet10");
    bet10.addEventListener("click", guiClicked, false);
    stage.addChild(bet10);
    var bet100: objects.SpriteButton = new objects.SpriteButton("bet100Button", globalOffsetX + 153, 386, "bet100");
    bet100.addEventListener("click", guiClicked, false);
    stage.addChild(bet100);
    var betall: objects.SpriteButton = new objects.SpriteButton("betMaxButton", globalOffsetX + 218, 386, "betmax");
    betall.addEventListener("click", guiClicked, false);
    stage.addChild(betall);
    var spin: objects.SpriteButton = new objects.SpriteButton("spinButton", globalOffsetX + 289, 386, "spin");
    spin.addEventListener("click", guiClicked, false);
    stage.addChild(spin);

    var bar: objects.GameObject = new objects.GameObject("bet_line", globalOffsetX + 61, 225);
    stage.addChild(bar);

    lblMoney = new objects.Label(currentMoney.toString(), "24px Consolas", "#00ff00", globalOffsetX + 46, 335, false);
    stage.addChild(lblMoney);

    lblBet = new objects.Label(currentBet.toString(), "24px Consolas", "#00ff00", globalOffsetX + 162, 335, false);
    stage.addChild(lblBet);

    lblWinnings = new objects.Label("", "24px Consolas", "#00ff00", globalOffsetX + 258, 335, false);
    stage.addChild(lblWinnings);

    lblJackpot = new objects.Label(currentJackpot.toString(), "24px Consolas", "#00ff00", globalOffsetX + 142, 53, false);
    stage.addChild(lblJackpot);

    main();
}

function roll() {
    row1Roll = true;
    row2Roll = true;
    row3Roll = true;
}

function guiClicked(event: createjs.MouseEvent) {

    switch (event.currentTarget.name) {
        case "spin":
            {
                roll();
                rollImageRows();
                break;
            }
    }
    console.log(event.currentTarget.name);
}

function main(): void {

    
}

function rollImageRows() {
    for (var i = 0; i < 7; i++) {
        if (row1Roll) {
            tile1ImageRow[i].y += 5;
            if (tile1ImageRow[i].y > 241)
                tile1ImageRow[i].y = -241;
        }
        if (row2Roll) {
            tile2ImageRow[i].y += 5;
            if (tile2ImageRow[i].y > 241)
                tile2ImageRow[i].y = -241;
        }
        if (row3Roll) {
            tile3ImageRow[i].y += 5;
            if (tile3ImageRow[i].y > 241)
                tile3ImageRow[i].y = -241;
        }
    }
}

// Main Game Loop
function gameLoop(event: createjs.Event): void {
    stats.begin(); // start counting
    
    rollImageRows();

    stage.update(); // redraw/refresh stage every frame

    stats.end(); // stop counting
}

// Setup Game Stats
function setupStats(): void {
    stats = new Stats();
    stats.setMode(0); // shows fps
    stats.domElement.style.position = "absolute";
    stats.domElement.style.left = "0px";
    stats.domElement.style.top = "0px";
    document.body.appendChild(stats.domElement);
}