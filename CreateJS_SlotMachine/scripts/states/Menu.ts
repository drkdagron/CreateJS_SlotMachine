module states {
    export class Menu extends objects.Scene {
        private _label: objects.Label;

        private _play: objects.SpriteButton;
        private _playLabel: objects.Label;

        constructor() {
            super();
        }

        public start(): void {
            this._label = new objects.Label("Welcome to slot safari!", "24px Consolas", "#000000", 320, 70, true);
            stage.addChild(this._label);

            this._play = new objects.SpriteButton("genericButton", 320 - 34.5, 140, "play");
            this._play.on("click", this.guiClicked, this);
            stage.addChild(this._play);

            this._playLabel = new objects.Label("Play", "18px Consolas", "#ffffff", 318, 170, true);
            stage.addChild(this._playLabel);
        }

        private guiClicked(event: createjs.Event): void {
            if (event.currentTarget.name == "play") {
                createjs.Sound.play("click");
                state = config.PLAY_STATE;
                changeState(state);
            }
        }

        public update(): void {

        }
    }
}