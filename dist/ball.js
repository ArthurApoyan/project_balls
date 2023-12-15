import { colorPicker, getRandomColor, getRandomNumber } from "./tools.js";
;
var Ball = /** @class */ (function () {
    function Ball(isRandom) {
        this.clickAnimationFrames = 20;
        this.isRandom = isRandom;
        this.colorPicker = colorPicker;
    }
    Ball.prototype.draw = function (event) {
        var newBall;
        if (event instanceof MouseEvent) {
            newBall = {
                x: event.clientX,
                y: event.clientY,
                radius: getRandomNumber(10, 30),
                velocity: 0,
                color: this.isRandom ? getRandomColor() : this.colorPicker.value,
                clickAnimationFrames: this.clickAnimationFrames,
            };
        }
        else if (event instanceof KeyboardEvent && event.key == ' ') {
            newBall = {
                x: getRandomNumber(200, (window.innerWidth - 200)),
                y: getRandomNumber(0, (window.innerHeight - 400)),
                radius: getRandomNumber(10, 30),
                velocity: 0,
                color: this.isRandom ? getRandomColor() : this.colorPicker.value,
                clickAnimationFrames: this.clickAnimationFrames,
            };
        }
        return newBall;
    };
    ;
    return Ball;
}());
export { Ball };
