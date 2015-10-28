var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var states;
(function (states) {
    var Game = (function (_super) {
        __extends(Game, _super);
        function Game() {
            _super.call(this);
            this.globalOffsetX = 132.5;
            this.currentMoney = 1000;
            this.currentBet = 0;
            this.currentJackpot = 5000;
            this.checkWinning = false;
        }
        Game.prototype.start = function () {
            this.tile1ImageRow = this.createImageArray();
            this.tile2ImageRow = this.createImageArray();
            this.tile3ImageRow = this.createImageArray();
            var tile1Container = new createjs.Container();
            tile1Container.x = this.globalOffsetX + 74;
            tile1Container.y = 192;
            var tile2Container = new createjs.Container();
            tile2Container.x = this.globalOffsetX + 152;
            tile2Container.y = 192;
            var tile3Container = new createjs.Container();
            tile3Container.x = this.globalOffsetX + 230;
            tile3Container.y = 192;
            for (var i = 0; i < 8; i++) {
                tile1Container.addChild(this.tile1ImageRow[i]);
                tile2Container.addChild(this.tile2ImageRow[i]);
                tile3Container.addChild(this.tile3ImageRow[i]);
            }
            stage.addChild(tile1Container);
            stage.addChild(tile2Container);
            stage.addChild(tile3Container);
            this.background = new createjs.Bitmap("../../assets/graphics/background.png");
            this.background.setBounds(0, 0, 375, 480);
            this.background.x = this.globalOffsetX;
            stage.addChild(this.background);
            this.currentMoney = 1000;
            this.lblMoney = new objects.Label(this.currentMoney.toString(), "24px Consolas", "#00ff00", this.globalOffsetX + 46, 335, false);
            stage.addChild(this.lblMoney);
            this.currentBet = 0;
            this.lblBet = new objects.Label(this.currentBet.toString(), "24px Consolas", "#00ff00", this.globalOffsetX + 162, 335, false);
            stage.addChild(this.lblBet);
            this.lblWinnings = new objects.Label("", "24px Consolas", "#00ff00", this.globalOffsetX + 235, 335, false);
            stage.addChild(this.lblWinnings);
            this.resetButton = new objects.SpriteButton("genericButton", 10, 10, "reset");
            this.resetButton.addEventListener("click", this.guiClicked, false);
            stage.addChild(this.resetButton);
            this.resetLabel = new objects.Label("Reset", "18px Consolas", "#FFF", 40, 40, true);
            stage.addChild(this.resetLabel);
            var bet1 = new objects.SpriteButton("bet1Button", this.globalOffsetX + 23, 386, "bet1");
            bet1.addEventListener("click", this.guiClicked, false);
            stage.addChild(bet1);
            var bet10 = new objects.SpriteButton("bet10Button", this.globalOffsetX + 88, 386, "bet10");
            bet10.addEventListener("click", this.guiClicked, false);
            stage.addChild(bet10);
            var bet100 = new objects.SpriteButton("bet100Button", this.globalOffsetX + 153, 386, "bet100");
            bet100.addEventListener("click", this.guiClicked, false);
            stage.addChild(bet100);
            var betall = new objects.SpriteButton("betMaxButton", this.globalOffsetX + 218, 386, "betmax");
            betall.addEventListener("click", this.guiClicked, false);
            stage.addChild(betall);
            var spin = new objects.SpriteButton("spinButton", this.globalOffsetX + 289, 386, "spin");
            spin.addEventListener("click", this.guiClicked, false);
            stage.addChild(spin);
            var bar = new objects.GameObject("bet_line", this.globalOffsetX + 61, 225);
            stage.addChild(bar);
            this.currentJackpot = 5000;
            this.lblJackpot = new objects.Label(this.currentJackpot.toString(), "24px Consolas", "#00ff00", this.globalOffsetX + 142, 53, false);
            stage.addChild(this.lblJackpot);
        };
        Game.prototype.update = function () {
        };
        Game.prototype.moneyCheck = function (n) {
            var tmp = this.currentMoney;
            if (tmp - n < 0)
                return false;
            return true;
        };
        Game.prototype.determineWinnings = function () {
            if (this.checkWinnings(0) == 0) {
                if (this.checkWinnings(1) == 3) {
                    this.lastWinning = this.currentBet * 10;
                }
                else if (this.checkWinnings(2) == 3) {
                    this.lastWinning = this.currentBet * 20;
                }
                else if (this.checkWinnings(3) == 3) {
                    this.lastWinning = this.currentBet * 30;
                }
                else if (this.checkWinnings(4) == 3) {
                    this.lastWinning = this.currentBet * 40;
                }
                else if (this.checkWinnings(5) == 3) {
                    this.lastWinning = this.currentBet * 50;
                }
                else if (this.checkWinnings(6) == 3) {
                    this.lastWinning = this.currentBet * 75;
                }
                else if (this.checkWinnings(7) == 3) {
                    this.lastWinning = this.currentBet * 100;
                }
                else if (this.checkWinnings(1) == 2) {
                    this.lastWinning = this.currentBet * 2;
                }
                else if (this.checkWinnings(2) == 2) {
                    this.lastWinning = this.currentBet * 2;
                }
                else if (this.checkWinnings(3) == 2) {
                    this.lastWinning = this.currentBet * 3;
                }
                else if (this.checkWinnings(4) == 2) {
                    this.lastWinning = this.currentBet * 4;
                }
                else if (this.checkWinnings(5) == 2) {
                    this.lastWinning = this.currentBet * 5;
                }
                else if (this.checkWinnings(6) == 2) {
                    this.lastWinning = this.currentBet * 10;
                }
                else if (this.checkWinnings(7) == 2) {
                    this.lastWinning = this.currentBet * 20;
                }
                else if (this.checkWinnings(7) == 1) {
                    this.lastWinning = this.currentBet * 5;
                }
                else {
                    this.lastWinning = this.currentBet * 1;
                }
                this.lblWinnings.text = this.lastWinning.toString();
                this.currentMoney += this.lastWinning;
                this.lblMoney.text = this.currentMoney.toString();
                createjs.Sound.play("winner");
            }
            else {
                this.lblWinnings.text = "0";
            }
            if (this.currentMoney == 0) {
                this.lblMoney.text = "Game!";
                this.lblWinnings.text = "Over!";
            }
        };
        Game.prototype.rollImageRows = function () {
            for (var i = 0; i < 8; i++) {
                if (this.row1Roll) {
                    this.tile1ImageRow[i].y += 5;
                    if (this.tile1ImageRow[i].y >= 448.5)
                        this.tile1ImageRow[i].y = -103.5;
                    if (this.tile1ImageRow[this.winningRow[0]].y < 2 && this.tile1ImageRow[this.winningRow[0]].y > -2) {
                        this.row1Roll = false;
                        this.fixImages(this.tile1ImageRow, this.winningRow[0]);
                    }
                }
                if (this.row2Roll) {
                    this.tile2ImageRow[i].y += 5;
                    if (this.tile2ImageRow[i].y >= 448.5)
                        this.tile2ImageRow[i].y = -103.5;
                    if (this.tile2ImageRow[this.winningRow[1]].y < 2 && this.tile2ImageRow[this.winningRow[1]].y > -2) {
                        this.row2Roll = false;
                        this.fixImages(this.tile2ImageRow, this.winningRow[1]);
                    }
                }
                if (this.row3Roll) {
                    this.tile3ImageRow[i].y += 5;
                    if (this.tile3ImageRow[i].y >= 448.5)
                        this.tile3ImageRow[i].y = -103.5;
                    if (this.tile3ImageRow[this.winningRow[2]].y < 2 && this.tile3ImageRow[this.winningRow[2]].y > -2) {
                        this.row3Roll = false;
                        this.fixImages(this.tile3ImageRow, this.winningRow[2]);
                    }
                }
            }
            if (this.checkWinning && this.row1Roll == false && this.row2Roll == false && this.row3Roll == false) {
                this.determineWinnings();
                this.checkWinning = false;
                this.currentBet = 0;
                this.lblBet.text = this.currentBet.toString();
            }
        };
        Game.prototype.fixImages = function (obj, current) {
            //set current to 0
            obj[current].y = 0;
            var last = current - 1;
            if (last < 0)
                last = 7;
            obj[last].y = -69;
            for (var l = 0; l < 6; l++) {
                var num = l + current + 1;
                num %= 8;
                obj[num].y = 69 + (l * 69);
            }
        };
        Game.prototype.checkWinnings = function (winner) {
            var count = 0;
            for (var win = 0; win < this.winningRow.length; win++) {
                if (this.winningRow[win] == winner)
                    count++;
            }
            console.log("Counted: " + count.toString() + ", for id: " + winner.toString());
            return count;
        };
        Game.prototype.createImageArray = function () {
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
        };
        Game.prototype.resetRows = function () {
            this.tile1ImageRow[0].y = 0;
            this.tile1ImageRow[1].y = 69;
            this.tile1ImageRow[2].y = 138;
            this.tile1ImageRow[3].y = 207;
            this.tile1ImageRow[4].y = 276;
            this.tile1ImageRow[5].y = 345;
            this.tile1ImageRow[6].y = 414;
            this.tile1ImageRow[7].y = -69;
            this.tile2ImageRow[0].y = 0;
            this.tile2ImageRow[1].y = 69;
            this.tile2ImageRow[2].y = 138;
            this.tile2ImageRow[3].y = 207;
            this.tile2ImageRow[4].y = 276;
            this.tile2ImageRow[5].y = 345;
            this.tile2ImageRow[6].y = 414;
            this.tile2ImageRow[7].y = -69;
            this.tile3ImageRow[0].y = 0;
            this.tile3ImageRow[1].y = 69;
            this.tile3ImageRow[2].y = 138;
            this.tile3ImageRow[3].y = 207;
            this.tile3ImageRow[4].y = 276;
            this.tile3ImageRow[5].y = 345;
            this.tile3ImageRow[6].y = 414;
            this.tile3ImageRow[7].y = -69;
        };
        Game.prototype.guiClicked = function (event) {
            console.log(event.currentTarget.name);
            if (event.currentTarget.name == "reset") {
                this.currentMoney = 1000;
                this.currentBet = 0;
                this.lastWinning = 0;
                this.currentJackpot = 5000;
                this.lblBet.text = this.currentBet.toString();
                this.lblJackpot.text = this.currentJackpot.toString();
                this.lblMoney.text = this.currentMoney.toString();
                this.lblWinnings.text = this.lastWinning.toString();
                this.row1Roll = false;
                this.row2Roll = false;
                this.row3Roll = false;
                this.resetRows();
                return;
            }
            if (this.checkWinning == false) {
                switch (event.currentTarget.name) {
                    case "bet1":
                        {
                            if (this.moneyCheck(1)) {
                                this.currentMoney -= 1;
                                this.currentBet += 1;
                            }
                            break;
                        }
                    case "bet10":
                        {
                            if (this.moneyCheck(10)) {
                                this.currentMoney -= 10;
                                this.currentBet += 10;
                            }
                            break;
                        }
                    case "bet100":
                        {
                            if (this.moneyCheck(100)) {
                                this.currentMoney -= 100;
                                this.currentBet += 100;
                            }
                            break;
                        }
                    case "betmax":
                        {
                            this.currentBet += this.currentMoney;
                            this.currentMoney = 0;
                            break;
                        }
                    case "spin":
                        {
                            if (this.currentBet > 0) {
                                this.roll();
                                this.rollImageRows();
                            }
                            break;
                        }
                }
            }
            this.lblMoney.text = this.currentMoney.toString();
            this.lblBet.text = this.currentBet.toString();
            createjs.Sound.play("click");
        };
        Game.prototype.setPicks = function () {
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
        };
        Game.prototype._checkRange = function (value, lowerBounds, upperBounds) {
            return (value >= lowerBounds && value <= upperBounds) ? value : -1;
        };
        Game.prototype.roll = function () {
            this.row1Roll = true;
            this.row2Roll = true;
            this.row3Roll = true;
            this.checkWinning = true;
            this.winningRow = this.setPicks();
            this.lblWinnings.text = "";
        };
        return Game;
    })(objects.Scene);
    states.Game = Game;
})(states || (states = {}));
//# sourceMappingURL=game.js.map