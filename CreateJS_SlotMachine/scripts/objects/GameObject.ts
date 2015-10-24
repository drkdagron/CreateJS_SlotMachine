module objects {
    export class GameObject extends createjs.Sprite {
        constructor(image: string, x: number, y: number) {
            super(atlas, image);
            this.x = x;
            this.y = y;
        }
    }
}