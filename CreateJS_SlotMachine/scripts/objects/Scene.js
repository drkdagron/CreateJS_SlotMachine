var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var objects;
(function (objects) {
    var Scene = (function (_super) {
        __extends(Scene, _super);
        function Scene() {
            _super.call(this);
        }
        Scene.prototype.start = function () { };
        Scene.prototype.update = function () { };
        return Scene;
    })(createjs.Container);
    objects.Scene = Scene;
})(objects || (objects = {}));
//# sourceMappingURL=Scene.js.map