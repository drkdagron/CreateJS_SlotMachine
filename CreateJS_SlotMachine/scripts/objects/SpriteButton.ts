module objects {
    export class SpriteButton extends objects.GameObject {
        constructor(image: string, x: number, y: number, name: string)
        {
            super(image, x, y);
            this.x = x;
            this.y = y;
            this.name = name;

            this.on("mouseover", this.overButton, this);
            this.on("mouseout", this.outButton, this);
        }

        overButton(event: createjs.MouseEvent): void {
            event.currentTarget.alpha = 0.7;
        }
        outButton(event: createjs.MouseEvent): void {
            event.currentTarget.alpha = 1.0;
        }
    }
}