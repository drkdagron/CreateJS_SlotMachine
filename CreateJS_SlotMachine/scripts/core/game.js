/// <reference path="../typings/stats/stats.d.ts" />
/// <reference path="../typings/createjs-lib/createjs-lib.d.ts" />
/// <reference path="../typings/easeljs/easeljs.d.ts" />
/// <reference path="../typings/tweenjs/tweenjs.d.ts" />
/// <reference path="../typings/soundjs/soundjs.d.ts" />
/// <reference path="../typings/preloadjs/preloadjs.d.ts" />
/// <reference path="../objects/label.ts" />
/// <reference path="../objects/gameobject.ts" />
/// <reference path="../objects/spritebutton.ts" />
var assets;
var canvas;
var stage;
var stats;
var atlas;
var background;
var currentMoney = 1000;
var lblMoney;
var currentBet = 100;
var lblBet;
var lastWinning;
var lblWinnings;
var currentJackpot = 5000;
var lblJackpot;
var globalOffsetX = 132.5;
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
function init() {
    canvas = document.getElementById("canvas"); // reference to canvas element
    stage = new createjs.Stage(canvas); // passing canvas to stage
    stage.enableMouseOver(20); // enable mouse events
    createjs.Ticker.setFPS(60); // set frame rate to 60 fps
    createjs.Ticker.on("tick", gameLoop); // update gameLoop every frame
    setupStats(); // sets up our stats counting
    atlas = new createjs.SpriteSheet(data);
    background = new createjs.Bitmap("../../assets/graphics/background.png");
    background.setBounds(0, 0, 375, 480);
    background.x = globalOffsetX;
    stage.addChild(background);
    var bet1 = new objects.SpriteButton("bet1Button", globalOffsetX + 23, 386, "bet1");
    bet1.addEventListener("click", guiClicked, false);
    stage.addChild(bet1);
    var bet10 = new objects.SpriteButton("bet10Button", globalOffsetX + 88, 386, "bet10");
    bet10.addEventListener("click", guiClicked, false);
    stage.addChild(bet10);
    var bet100 = new objects.SpriteButton("bet100Button", globalOffsetX + 153, 386, "bet100");
    bet100.addEventListener("click", guiClicked, false);
    stage.addChild(bet100);
    var betall = new objects.SpriteButton("betMaxButton", globalOffsetX + 218, 386, "betmax");
    betall.addEventListener("click", guiClicked, false);
    stage.addChild(betall);
    var spin = new objects.SpriteButton("spinButton", globalOffsetX + 289, 386, "spin");
    spin.addEventListener("click", guiClicked, false);
    stage.addChild(spin);
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
function guiClicked(event) {
    console.log(event.currentTarget.name);
}
function main() {
}
// Main Game Loop
function gameLoop(event) {
    stats.begin(); // start counting
    stage.update(); // redraw/refresh stage every frame
    stats.end(); // stop counting
}
// Setup Game Stats
function setupStats() {
    stats = new Stats();
    stats.setMode(0); // shows fps
    stats.domElement.style.position = "absolute";
    stats.domElement.style.left = "0px";
    stats.domElement.style.top = "0px";
    document.body.appendChild(stats.domElement);
}
//# sourceMappingURL=game.js.map