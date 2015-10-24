module objects {
    export class Label extends createjs.Text {
        constructor(text:string, font:string, color:string, x:number, y:number, centered:boolean) {
            super(text, font, color);
            this.x = x;
            this.y = y;
            if (centered) {
                this.regX = this.getBounds().width * 0.5;
                this.regY = this.getBounds().height * 0.5;
            }
        }
    }
}