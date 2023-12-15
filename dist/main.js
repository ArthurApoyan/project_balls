import { Ball } from "./ball.js";
import { canvas, context, colorPicker, randomColorBtn, closeBtn, info, infoMenu, getRandomColor } from "./tools.js";
var FallingBall = /** @class */ (function () {
    function FallingBall() {
        var _this = this;
        this.balls = [];
        this.gravity = 1;
        this.lastTime = 1;
        this.backgroundImage = new Image();
        this.backgrounds = ['assets/backgroundImage.jpg', 'assets/backgroundImage_1.jpg', 'assets/backgroundImage_2.jpg'];
        this.clickAnimationFrames = 20;
        this.clickAnimationRadius = Math.abs(Math.random() * 25 + 20);
        this.backgroundIndex = 0;
        this.canvas = canvas;
        this.context = context;
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.getBackgroundSource(this.backgroundIndex);
        this.canvas.addEventListener('click', this.handleCanvasClick.bind(this));
        this.canvas.addEventListener('contextmenu', this.changeBackground.bind(this));
        window.addEventListener('keydown', this.handleCanvasClick.bind(this));
        this.isRandom = true;
        this.colorPicker = colorPicker;
        this.colorPicker.value = getRandomColor();
        this.colorPicker.onclick = function () {
            _this.isRandom = false;
            _this.updateRandomBtnText();
        };
        this.randomColorBtn = randomColorBtn;
        this.randomColorBtn.onclick = function () { return _this.handleRandomBtnClick(); };
        this.updateRandomBtnText();
        this.closeBtn = closeBtn;
        this.closeBtn.onclick = function () { return _this.closeInfoMenu(); };
        this.info = info;
        this.infoMenu = infoMenu;
        requestAnimationFrame(function (time) { return _this.animate(time); });
    }
    FallingBall.prototype.handleCanvasClick = function (event) {
        var newBallObject = new Ball(this.isRandom);
        var newBall = newBallObject.draw(event);
        newBall && this.balls.push(newBall);
        if (this.balls.length > 15) {
            this.animateDestroyClick(this.balls[0]);
        }
        newBall && this.animateCreateClick(newBall);
    };
    FallingBall.prototype.animateCreateClick = function (ball) {
        var _this = this;
        var frameCount = 0;
        var animate = function () {
            frameCount++;
            ball.radius += _this.clickAnimationRadius / _this.clickAnimationFrames;
            if (frameCount < _this.clickAnimationFrames) {
                requestAnimationFrame(animate);
            }
        };
        animate();
    };
    FallingBall.prototype.animateDestroyClick = function (ball) {
        var _this = this;
        var frameCount = 0;
        var animate = function () {
            frameCount++;
            ball.radius -= _this.clickAnimationRadius / _this.clickAnimationFrames;
            if (frameCount < _this.clickAnimationFrames && ball.radius > 0) {
                requestAnimationFrame(animate);
            }
            else {
                _this.balls.shift();
            }
        };
        animate();
    };
    FallingBall.prototype.getBackgroundSource = function (index) {
        return this.backgroundImage.src = this.backgrounds[index];
    };
    FallingBall.prototype.changeBackground = function (e) {
        e.preventDefault();
        if (this.backgroundIndex === 2) {
            this.backgroundIndex = 0;
        }
        else {
            this.backgroundIndex++;
        }
        this.getBackgroundSource(this.backgroundIndex);
    };
    FallingBall.prototype.handleRandomBtnClick = function () {
        this.isRandom = !this.isRandom;
        this.updateRandomBtnText();
    };
    FallingBall.prototype.updateRandomBtnText = function () {
        this.randomColorBtn.innerText = this.isRandom ? 'Random Colors On' : 'Random Colors Off';
    };
    FallingBall.prototype.coverImg = function (type) {
        var imgRatio = this.backgroundImage.height / this.backgroundImage.width;
        var winRatio = window.innerHeight / window.innerWidth;
        if ((imgRatio < winRatio && type === 'contain') || (imgRatio > winRatio && type === 'cover')) {
            var h = window.innerWidth * imgRatio;
            this.context.drawImage(this.backgroundImage, 0, (window.innerHeight - h) / 2, window.innerWidth, h);
        }
        if ((imgRatio > winRatio && type === 'contain') || (imgRatio < winRatio && type === 'cover')) {
            var w = window.innerWidth * winRatio / imgRatio;
            this.context.drawImage(this.backgroundImage, (window.innerWidth - w) / 2, 0, w, window.innerHeight);
        }
    };
    FallingBall.prototype.closeInfoMenu = function () {
        this.info.style.display = this.info.style.display == 'block' ? 'none' : 'block';
        this.infoMenu.style.width = this.info.style.display == 'block' ? '29%' : '8%';
        this.closeBtn.style.marginLeft = this.info.style.display == 'block' ? '70%' : '0';
        this.closeBtn.style.width = this.info.style.display == 'block' ? '30%' : '100%';
        this.closeBtn.innerText = this.info.style.display == 'block' ? 'Close Menu' : 'Open Menu';
    };
    FallingBall.prototype.animate = function (currentTime) {
        var _this = this;
        var deltaTime = currentTime - this.lastTime;
        this.coverImg('cover');
        this.balls.forEach(function (ball, index) {
            _this.context.beginPath();
            _this.context.arc(ball.x, ball.y, ball.radius, 0, 2 * Math.PI);
            _this.context.fillStyle = ball.color;
            _this.context.shadowBlur = 10;
            _this.context.shadowColor = 'rgb(230,226,226)';
            _this.context.fill();
            _this.context.closePath();
            ball.velocity += _this.gravity;
            ball.y += ball.velocity;
            if (ball.y + ball.radius > _this.canvas.height) {
                ball.y = _this.canvas.height - ball.radius;
                ball.velocity = -ball.velocity * 0.8;
            }
            if (ball.y - ball.radius > _this.canvas.height) {
                _this.balls.splice(index, 1);
            }
        });
        this.context.shadowBlur = 0;
        this.context.shadowColor = 'transparent';
        this.lastTime = currentTime;
        requestAnimationFrame(function (time) { return _this.animate(time); });
    };
    return FallingBall;
}());
document.addEventListener('DOMContentLoaded', function () {
    var fallingBall = new FallingBall();
});
