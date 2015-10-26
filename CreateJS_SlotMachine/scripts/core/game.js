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
//reel images and gameobjects
var tile1ImageRow;
var tile2ImageRow;
var tile3ImageRow;
//winning set
var winningRow;
//rolling logic
var row1Roll;
var row2Roll;
var row3Roll;
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
function createImageArray() {
    var array;
    array = new Array();
    array.push(new objects.GameObject("blank", 0, 0));
    array.push(new objects.GameObject("snake", 0, 69));
    array.push(new objects.GameObject("parrot", 0, 138));
    array.push(new objects.GameObject("monkey", 0, 207));
    array.push(new objects.GameObject("pig", 0, 276));
    array.push(new objects.GameObject("panda", 0, 345));
    array.push(new objects.GameObject("giraffe", 0, 414));
    array.push(new objects.GameObject("elephant", 0, -69));
    return array;
}
function init() {
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
    for (var i = 0; i < 8; i++) {
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
    var bar = new objects.GameObject("bet_line", globalOffsetX + 61, 225);
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
    winningRow = setPicks();
}
function _checkRange(value, lowerBounds, upperBounds) {
    return (value >= lowerBounds && value <= upperBounds) ? value : -1;
}
function setPicks() {
    var tmp = new Array(3);
    for (var reel = 0; reel < 3; reel++) {
        tmp[reel] = Math.floor((Math.random() * 65) + 1);
        switch (tmp[reel]) {
            case this._checkRange(tmp[reel], 1, 27):
                tmp[reel] = 0; //blank
                break;
            case this._checkRange(tmp[reel], 28, 37):
                tmp[reel] = 1; //snake
                break;
            case this._checkRange(tmp[reel], 38, 46):
                tmp[reel] = 2; //parrot
                break;
            case this._checkRange(tmp[reel], 47, 54):
                tmp[reel] = 3; //monkey
                break;
            case this._checkRange(tmp[reel], 55, 59):
                tmp[reel] = 4; //pig
                break;
            case this._checkRange(tmp[reel], 60, 62):
                tmp[reel] = 5; //panda
                break;
            case this._checkRange(tmp[reel], 63, 64):
                tmp[reel] = 6; //giraffe
                break;
            case this._checkRange(tmp[reel], 65, 65):
                tmp[reel] = 7; //elephant
                break;
        }
    }
    console.log("winning set: " + tmp[0] + ", " + tmp[1] + ", " + tmp[2]);
    return tmp;
}
function guiClicked(event) {
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
function main() {
}
function rollImageRows() {
    for (var i = 0; i < 8; i++) {
        if (row1Roll) {
            tile1ImageRow[i].y += 5;
            if (tile1ImageRow[i].y >= 448.5)
                tile1ImageRow[i].y = -103.5;
            if (tile1ImageRow[winningRow[0]].y < 2 && tile1ImageRow[winningRow[0]].y > -2) {
                row1Roll = false;
                fixImages(tile1ImageRow, winningRow[0]);
            }
        }
        if (row2Roll) {
            tile2ImageRow[i].y += 5;
            if (tile2ImageRow[i].y >= 448.5)
                tile2ImageRow[i].y = -103.5;
            if (tile2ImageRow[winningRow[1]].y < 2 && tile2ImageRow[winningRow[1]].y > -2) {
                row2Roll = false;
                fixImages(tile2ImageRow, winningRow[1]);
            }
        }
        if (row3Roll) {
            tile3ImageRow[i].y += 5;
            if (tile3ImageRow[i].y >= 448.5)
                tile3ImageRow[i].y = -103.5;
            if (tile3ImageRow[winningRow[2]].y < 2 && tile3ImageRow[winningRow[2]].y > -2) {
                row3Roll = false;
                fixImages(tile3ImageRow, winningRow[2]);
            }
        }
    }
}
function fixImages(obj, current) {
    //set current to 0
    obj[current].y = 0;
    var last = current - 1;
    if (last < 0)
        last = 7;
    console.log(last);
    obj[last].y = -69;
    for (var l = 0; l < 6; l++) {
        var num = l + current + 1;
        num %= 8;
        console.log(num);
        obj[num].y = 69 + (l * 69);
    }
}
// Main Game Loop
function gameLoop(event) {
    stats.begin(); // start counting
    rollImageRows();
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