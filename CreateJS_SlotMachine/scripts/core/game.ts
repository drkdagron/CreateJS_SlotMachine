/// <reference path="../typings/stats/stats.d.ts" />
/// <reference path="../typings/createjs-lib/createjs-lib.d.ts" />
/// <reference path="../typings/easeljs/easeljs.d.ts" />
/// <reference path="../typings/tweenjs/tweenjs.d.ts" />
/// <reference path="../typings/soundjs/soundjs.d.ts" />
/// <reference path="../typings/preloadjs/preloadjs.d.ts" />
/// <reference path="../objects/label.ts" />

var assets: createjs.LoadQueue;
var canvas: HTMLElement;
var stage: createjs.Stage;
var stats: Stats;

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

/*
var manifest = [
    { id: "BackButton", src: "../../Assets/images/BackButton.png" },
    { id: "NextButton", src: "../../Assets/images/NextButton.png" },
    { id: "StartButton", src: "../../Assets/images/StartButton.png" },
    { id: "background", src: "../../Assets/images/background.png" },
    { id: "yay", src: "../../Assets/audio/yay.ogg" }
];
*/

function preload(): void {
    console.log("Preload");
    assets = new createjs.LoadQueue();
    assets.installPlugin(createjs.Sound);
    assets.on("complete", init, this);
    //assets.loadManifest(manifest);
}

function init(): void {
    console.log("init");
    canvas = document.getElementById("canvas"); // reference to canvas element
    stage = new createjs.Stage(canvas); // passing canvas to stage
    stage.enableMouseOver(20); // enable mouse events
    createjs.Ticker.setFPS(60); // set frame rate to 60 fps
    createjs.Ticker.on("tick", gameLoop); // update gameLoop every frame
    setupStats(); // sets up our stats counting

    background = new createjs.Bitmap("../../assets/graphics/background.png");
    background.setBounds(0, 0, 375, 480);
    background.x = globalOffsetX;
    stage.addChild(background);

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

function main(): void {

    console.log("main");
    
}

// Main Game Loop
function gameLoop(event: createjs.Event): void {
    console.log("update");
    stats.begin(); // start counting
    
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