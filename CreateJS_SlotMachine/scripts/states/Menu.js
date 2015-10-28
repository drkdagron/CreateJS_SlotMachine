var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var states;
(function (states) {
    var Menu = (function (_super) {
        __extends(Menu, _super);
        function Menu() {
            _super.call(this);
        }
        Menu.prototype.start = function () {
            this._label = new objects.Label("Welcome to slot safari!", "24px Consolas", "#000000", 320, 70, true);
            stage.addChild(this._label);
            this._play = new objects.SpriteButton("genericButton", 320 - 34.5, 140, "play");
            this._play.on("click", this.guiClicked, this);
            stage.addChild(this._play);
            this._playLabel = new objects.Label("Play", "18px Consolas", "#ffffff", 318, 170, true);
            stage.addChild(this._playLabel);
        };
        Menu.prototype.guiClicked = function (event) {
            if (event.currentTarget.name == "play") {
                createjs.Sound.play("click");
                state = config.PLAY_STATE;
                changeState(state);
            }
        };
        Menu.prototype.update = function () {
        };
        return Menu;
    })(objects.Scene);
    states.Menu = Menu;
})(states || (states = {}));
//# sourceMappingURL=Menu.js.map