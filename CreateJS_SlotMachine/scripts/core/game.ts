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

var currentMoney: number = 1000;
var lblMoney: objects.Label;

var currentBet: number = 0;
var lblBet: objects.Label;

var lastWinning: number;
var lblWinnings: objects.Label;

var currentJackpot: number = 5000;
var lblJackpot: objects.Label;

var resetButton: objects.SpriteButton;
var resetLabel: objects.Label;

var globalOffsetX = 132.5;

//reel images and gameobjects
var tile1ImageRow: objects.GameObject[];
var tile2ImageRow: objects.GameObject[];
var tile3ImageRow: objects.GameObject[];

//winning set
var winningRow: number[];

//rolling logic
var row1Roll: boolean;
var row2Roll: boolean;
var row3Roll: boolean;
var checkWinning: boolean = false;

//audio
var manifest = [
    { id: "winner", src: "../../assets/sounds/winner.wav" },
    { id: "click", src: "../../assets/sounds/click3.ogg" },
];

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
    array.push(new objects.GameObject("snake", 0, 69));
    array.push(new objects.GameObject("parrot", 0, 138));
    array.push(new objects.GameObject("monkey", 0, 207));
    array.push(new objects.GameObject("pig", 0, 276));
    array.push(new objects.GameObject("panda", 0, 345));
    array.push(new objects.GameObject("giraffe", 0, 414));
    array.push(new objects.GameObject("elephant", 0, -69));

    return array;
}

function resetRows(): void {

    tile1ImageRow[0].y = 0;
    tile1ImageRow[1].y = 69;
    tile1ImageRow[2].y = 138;
    tile1ImageRow[3].y = 207;
    tile1ImageRow[4].y = 276;
    tile1ImageRow[5].y = 345;
    tile1ImageRow[6].y = 414;
    tile1ImageRow[7].y = -69;

    tile2ImageRow[0].y = 0;
    tile2ImageRow[1].y = 69;
    tile2ImageRow[2].y = 138;
    tile2ImageRow[3].y = 207;
    tile2ImageRow[4].y = 276;
    tile2ImageRow[5].y = 345;
    tile2ImageRow[6].y = 414;
    tile2ImageRow[7].y = -69;

    tile3ImageRow[0].y = 0;
    tile3ImageRow[1].y = 69;
    tile3ImageRow[2].y = 138;
    tile3ImageRow[3].y = 207;
    tile3ImageRow[4].y = 276;
    tile3ImageRow[5].y = 345;
    tile3ImageRow[6].y = 414;
    tile3ImageRow[7].y = -69;
}

function preload(): void {
    assets = new createjs.LoadQueue();
    assets.installPlugin(createjs.Sound);
    assets.on("complete", init, this);
    assets.loadManifest(manifest);
    atlas = new createjs.SpriteSheet(data);
}

function init(): void {
    canvas = document.getElementById("canvas"); // reference to canvas element
    stage = new createjs.Stage(canvas); // passing canvas to stage
    stage.enableMouseOver(20); // enable mouse events
    createjs.Ticker.setFPS(60); // set frame rate to 60 fps
    createjs.Ticker.on("tick", gameLoop); // update gameLoop every frame
    setupStats(); // sets up our stats counting

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

    resetButton = new objects.SpriteButton("genericButton", 10, 10, "reset");
    resetButton.addEventListener("click", guiClicked, false);
    stage.addChild(resetButton);
    resetLabel = new objects.Label("Reset", "18px Consolas", "#FFF", 40, 40, true);
    stage.addChild(resetLabel);

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

    currentMoney = 1000;
    lblMoney = new objects.Label(currentMoney.toString(), "24px Consolas", "#00ff00", globalOffsetX + 46, 335, false);
    stage.addChild(lblMoney);

    currentBet = 0;
    lblBet = new objects.Label(currentBet.toString(), "24px Consolas", "#00ff00", globalOffsetX + 162, 335, false);
    stage.addChild(lblBet);


    lblWinnings = new objects.Label("", "24px Consolas", "#00ff00", globalOffsetX + 235, 335, false);
    stage.addChild(lblWinnings);

    currentJackpot = 5000;
    lblJackpot = new objects.Label(currentJackpot.toString(), "24px Consolas", "#00ff00", globalOffsetX + 142, 53, false);
    stage.addChild(lblJackpot);
}

function roll() {
    row1Roll = true;
    row2Roll = true;
    row3Roll = true;
    checkWinning = true;
    winningRow = setPicks();
    lblWinnings.text = "";
}

function _checkRange(value: number, lowerBounds: number, upperBounds: number): number {
    return (value >= lowerBounds && value <= upperBounds) ? value : -1;
}

function setPicks(): number[]   //this function will return the winning set which will appear in the middle
{
    var tmp: number[] = new Array<number>(3);
    for (var reel = 0; reel < 3; reel++) {
        tmp[reel] = Math.floor((Math.random() * 65) + 1);
        switch (tmp[reel]) {
            case this._checkRange(tmp[reel], 1, 27):  // 41.5% probability
                tmp[reel] = 0; //blank
                break;
            case this._checkRange(tmp[reel], 28, 37): // 15.4% probability
                tmp[reel] = 1; //snake
                break;
            case this._checkRange(tmp[reel], 38, 46): // 13.8% probability
                tmp[reel] = 2; //parrot
                break;
            case this._checkRange(tmp[reel], 47, 54): // 12.3% probability
                tmp[reel] = 3; //monkey
                break;
            case this._checkRange(tmp[reel], 55, 59): //  7.7% probability
                tmp[reel] = 4; //pig
                break;
            case this._checkRange(tmp[reel], 60, 62): //  4.6% probability
                tmp[reel] = 5; //panda
                break;
            case this._checkRange(tmp[reel], 63, 64): //  3.1% probability
                tmp[reel] = 6; //giraffe
                break;
            case this._checkRange(tmp[reel], 65, 65): //  1.5% probability
                tmp[reel] = 7; //elephant
                break;
        }
    }    
    console.log("winning set: " + tmp[0] + ", " + tmp[1] + ", " + tmp[2]);
    return tmp;
}

function guiClicked(event: createjs.MouseEvent) {

    if (event.currentTarget.name == "reset") {

        currentMoney = 1000;
        currentBet = 0;
        lastWinning = 0;
        currentJackpot = 5000;
        lblBet.text = currentBet.toString();
        lblJackpot.text = currentJackpot.toString();
        lblMoney.text = currentMoney.toString();
        lblWinnings.text = lastWinning.toString();
        row1Roll = false;
        row2Roll = false;
        row3Roll = false;
        resetRows();
        return;
    }

    if (checkWinning == false) {
        switch (event.currentTarget.name) {
            case "bet1":
                {
                    if (moneyCheck(1)) {
                        currentMoney -= 1;
                        currentBet += 1;
                    }
                    break;
                }
            case "bet10":
                {
                    if (moneyCheck(10)) {
                        currentMoney -= 10;
                        currentBet += 10;
                    }
                    break;
                }
            case "bet100":
                {
                    if (moneyCheck(100)) {
                        currentMoney -= 100;
                        currentBet += 100;
                    }
                    break;
                }
            case "betmax":
                {
                    currentBet += currentMoney;
                    currentMoney = 0;
                    break;
                }
            case "spin":
                {
                    if (currentBet > 0) {
                        roll();
                        rollImageRows();
                    }
                    break;
                }
        }
    }
    lblMoney.text = currentMoney.toString();
    lblBet.text = currentBet.toString();
    createjs.Sound.play("click");
}

function moneyCheck(n: number): boolean {
    var tmp: number = currentMoney;
    if (tmp - n < 0)
        return false;
  
    return true;
}

function checkWinnings(winner: number): number {
    var count: number = 0;
    for (var win = 0; win < winningRow.length; win++) {
        if (winningRow[win] == winner)
            count++;
    }

    console.log("Counted: " + count.toString() + ", for id: " + winner.toString());
    return count;
}

function determineWinnings() {
    if (checkWinnings(0) == 0) {
        if (checkWinnings(1) == 3) {
            lastWinning = currentBet * 10;
        }
        else if (checkWinnings(2) == 3) {
            lastWinning = currentBet * 20;
        }
        else if (checkWinnings(3) == 3) {
            lastWinning = currentBet * 30;
        }
        else if (checkWinnings(4) == 3) {
            lastWinning = currentBet * 40;
        }
        else if (checkWinnings(5) == 3) {
            lastWinning = currentBet * 50;
        }
        else if (checkWinnings(6) == 3) {
            lastWinning = currentBet * 75;
        }
        else if (checkWinnings(7) == 3) {
            lastWinning = currentBet * 100;
        }
        else if (checkWinnings(1) == 2) {
            lastWinning = currentBet * 2;
        }
        else if (checkWinnings(2) == 2) {
            lastWinning = currentBet * 2;
        }
        else if (checkWinnings(3) == 2) {
            lastWinning = currentBet * 3;
        }
        else if (checkWinnings(4) == 2) {
            lastWinning = currentBet * 4;
        }
        else if (checkWinnings(5) == 2) {
            lastWinning = currentBet * 5;
        }
        else if (checkWinnings(6) == 2) {
            lastWinning = currentBet * 10;
        }
        else if (checkWinnings(7) == 2) {
            lastWinning = currentBet * 20;
        }
        else if (checkWinnings(7) == 1) {
            lastWinning = currentBet * 5;
        }
        else {
            lastWinning = currentBet * 1;
        }
        lblWinnings.text = lastWinning.toString();
        currentMoney += lastWinning;
        lblMoney.text = currentMoney.toString();
        createjs.Sound.play("winner");
    }
    else {
        lblWinnings.text = "0";
    }

    if (currentMoney == 0) {
        lblMoney.text = "Game!";
        lblWinnings.text = "Over!";
    }

}

function rollImageRows() {
    for (var i = 0; i < 8; i++) {
        if (row1Roll) {
            tile1ImageRow[i].y += 5;
            if (tile1ImageRow[i].y >= 448.5)
                tile1ImageRow[i].y = -103.5;
            if (tile1ImageRow[winningRow[0]].y < 2 && tile1ImageRow[winningRow[0]].y > -2)
            {
                row1Roll = false;
                fixImages(tile1ImageRow, winningRow[0]);
            }
        }
        if (row2Roll) {
            tile2ImageRow[i].y += 5;
            if (tile2ImageRow[i].y >= 448.5)
                tile2ImageRow[i].y = -103.5;
            if (tile2ImageRow[winningRow[1]].y < 2 && tile2ImageRow[winningRow[1]].y > -2)
            {
                row2Roll = false;
                fixImages(tile2ImageRow, winningRow[1]);
            }
        }
        if (row3Roll) {
            tile3ImageRow[i].y += 5;
            if (tile3ImageRow[i].y >= 448.5)
                tile3ImageRow[i].y = -103.5;
            if (tile3ImageRow[winningRow[2]].y < 2 && tile3ImageRow[winningRow[2]].y > -2)
            {
                row3Roll = false;
                fixImages(tile3ImageRow, winningRow[2]);
            }
        }
    }
    if (checkWinning && row1Roll == false && row2Roll == false && row3Roll == false) {
        determineWinnings();
        checkWinning = false;
        currentBet = 0;
        lblBet.text = currentBet.toString();
    }
    
}

function fixImages(obj: objects.GameObject[], current: number) {
    //set current to 0
    obj[current].y = 0;
    var last: number = current - 1;
    if (last < 0)
        last = 7;
    obj[last].y = -69;
    for (var l = 0; l < 6; l++)
    {
        var num: number = l + current + 1;
        num %= 8;
        obj[num].y = 69 + (l * 69);
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