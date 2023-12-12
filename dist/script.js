"use strict";
var FallingBall = /** @class */ (function () {
    function FallingBall() {
        var _this = this;
        this.balls = [];
        this.gravity = 0.7;
        this.lastTime = 1;
        this.backgroundImage = new Image();
        this.backgrounds = ['assets/backgroundImage.jpg', 'assets/backgroundImage_1.jpg', 'assets/backgroundImage_2.jpg'];
        this.clickAnimationFrames = 20;
        this.clickAnimationRadius = Math.abs(Math.random() * 25 + 20);
        this.backgroundIndex = 0;
        this.coverImg = function (type) {
            var imgRatio = _this.backgroundImage.height / _this.backgroundImage.width;
            var winRatio = window.innerHeight / window.innerWidth;
            if ((imgRatio < winRatio && type === 'contain') || (imgRatio > winRatio && type === 'cover')) {
                var h = window.innerWidth * imgRatio;
                _this.context.drawImage(_this.backgroundImage, 0, (window.innerHeight - h) / 2, window.innerWidth, h);
            }
            if ((imgRatio > winRatio && type === 'contain') || (imgRatio < winRatio && type === 'cover')) {
                var w = window.innerWidth * winRatio / imgRatio;
                _this.context.drawImage(_this.backgroundImage, (window.innerWidth - w) / 2, 0, w, window.innerHeight);
            }
        };
        this.canvas = document.querySelector('canvas');
        this.context = this.canvas.getContext('2d');
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.getBackgroundSource(this.backgroundIndex);
        this.canvas.addEventListener('click', this.handleCanvasClick.bind(this));
        this.canvas.addEventListener('contextmenu', this.changeBackground.bind(this));
        this.isRandom = true;
        this.colorPicker = document.getElementById('colorPicker');
        this.colorPicker.value = this.getRandomColor();
        this.colorPicker.onclick = function () {
            _this.isRandom = false;
            _this.updateRandomBtnText();
        };
        this.randomColorBtn = document.getElementById('randomColorBtn');
        this.randomColorBtn.onclick = function () { return _this.handleRandomBtnClick(); };
        this.updateRandomBtnText();
        requestAnimationFrame(function (time) { return _this.animate(time); });
    }
    FallingBall.prototype.handleCanvasClick = function (event) {
        var newBall = {
            x: event.clientX,
            y: event.clientY,
            radius: Math.abs(Math.random() * 30) + 1,
            velocity: 0,
            color: this.isRandom ? this.getRandomColor() : this.colorPicker.value,
            clickAnimationFrames: this.clickAnimationFrames,
        };
        this.balls.push(newBall);
        if (this.balls.length > 15) {
            this.animateDestroyClick(this.balls[0]);
        }
        this.animateCreateClick(newBall);
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
    FallingBall.prototype.getRandomColor = function () {
        var letters = '0123456789ABCDEF';
        var color = '#';
        for (var i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    };
    FallingBall.prototype.handleRandomBtnClick = function () {
        this.isRandom = !this.isRandom;
        this.updateRandomBtnText();
    };
    FallingBall.prototype.updateRandomBtnText = function () {
        this.randomColorBtn.innerText = this.isRandom ? 'Random Colors On' : 'Random Colors Off';
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
var fallingBall = new FallingBall();
