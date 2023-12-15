import {Ball} from "./ball";
import {BallType} from "./ball";
import {
    canvas,
    context,
    colorPicker,
    randomColorBtn,
    closeBtn,
    info,
    infoMenu,
    getRandomColor
} from "./tools";

class FallingBall {
    private canvas: HTMLCanvasElement;
    private context: CanvasRenderingContext2D;
    private balls: BallType[] = [];
    private gravity: number = 1;
    private lastTime: number = 1;
    private backgroundImage: HTMLImageElement = new Image();
    private backgrounds: string[] = ['assets/backgroundImage.jpg', 'assets/backgroundImage_1.jpg', 'assets/backgroundImage_2.jpg'];
    private clickAnimationFrames: number = 20;
    private clickAnimationRadius: number = Math.abs(Math.random() * 25 + 20);
    private colorPicker: HTMLInputElement;
    private randomColorBtn: HTMLElement;
    private closeBtn: HTMLElement;
    private info: HTMLElement;
    private infoMenu: HTMLElement;
    private isRandom: boolean;
    private backgroundIndex: number = 0;

    constructor() {
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
        this.colorPicker.onclick = () => {
            this.isRandom = false;
            this.updateRandomBtnText();
        };

        this.randomColorBtn = randomColorBtn;
        this.randomColorBtn.onclick = () => this.handleRandomBtnClick();
        this.updateRandomBtnText();

        this.closeBtn = closeBtn;
        this.closeBtn.onclick = () => this.closeInfoMenu();

        this.info = info;
        this.infoMenu = infoMenu;

        requestAnimationFrame((time) => this.animate(time));
    }

    handleCanvasClick(event: MouseEvent | KeyboardEvent) {
        let newBallObject = new Ball(this.isRandom);
        let newBall = newBallObject.draw(event);
        newBall && this.balls.push(newBall);

        if (this.balls.length > 15) {
            this.animateDestroyClick(this.balls[0]);
        }

        newBall && this.animateCreateClick(newBall);
    }

    animateCreateClick(ball: BallType) {
        let frameCount = 0;
        const animate = () => {
            frameCount++;
            ball.radius += this.clickAnimationRadius / this.clickAnimationFrames;

            if (frameCount < this.clickAnimationFrames) {
                requestAnimationFrame(animate);
            }
        };

        animate();
    }

    animateDestroyClick(ball: BallType) {
        let frameCount = 0;
        const animate = () => {
            frameCount++
            ball.radius -= this.clickAnimationRadius / this.clickAnimationFrames;
            if (frameCount < this.clickAnimationFrames && ball.radius > 0) {
                requestAnimationFrame(animate);
            } else {
                this.balls.shift();
            }
        };

        animate();
    }

    getBackgroundSource(index: number) {
        return this.backgroundImage.src = this.backgrounds[index];
    }

    changeBackground(e: MouseEvent) {
        e.preventDefault();
        if (this.backgroundIndex === 2) {
            this.backgroundIndex = 0;
        } else {
            this.backgroundIndex++
        }
        this.getBackgroundSource(this.backgroundIndex);
    }

    handleRandomBtnClick() {
        this.isRandom = !this.isRandom;
        this.updateRandomBtnText();
    }

    updateRandomBtnText() {
        this.randomColorBtn.innerText = this.isRandom ? 'Random Colors On' : 'Random Colors Off';
    }

    coverImg(type: string) {
        const imgRatio = this.backgroundImage.height / this.backgroundImage.width
        const winRatio = window.innerHeight / window.innerWidth
        if ((imgRatio < winRatio && type === 'contain') || (imgRatio > winRatio && type === 'cover')) {
            const h = window.innerWidth * imgRatio
            this.context.drawImage(this.backgroundImage, 0, (window.innerHeight - h) / 2, window.innerWidth, h)
        }
        if ((imgRatio > winRatio && type === 'contain') || (imgRatio < winRatio && type === 'cover')) {
            const w = window.innerWidth * winRatio / imgRatio
            this.context.drawImage(this.backgroundImage, (window.innerWidth - w) / 2, 0, w, window.innerHeight)
        }
    }

    closeInfoMenu() {
        this.info.style.display = this.info.style.display == 'block' ? 'none' : 'block';
        this.infoMenu.style.width = this.info.style.display == 'block' ? '29%' : '8%';
        this.closeBtn.style.marginLeft = this.info.style.display == 'block' ? '70%' : '0';
        this.closeBtn.style.width = this.info.style.display == 'block' ? '30%' : '100%';
        this.closeBtn.innerText = this.info.style.display == 'block' ? 'Close Menu' : 'Open Menu';
    }

    animate(currentTime: number) {
        const deltaTime = currentTime - this.lastTime;
        this.coverImg('cover');

        this.balls.forEach((ball, index) => {
            this.context.beginPath();
            this.context.arc(ball.x, ball.y, ball.radius, 0, 2 * Math.PI);
            this.context.fillStyle = ball.color;
            this.context.shadowBlur = 10;
            this.context.shadowColor = 'rgb(230,226,226)';
            this.context.fill();
            this.context.closePath();

            ball.velocity += this.gravity;
            ball.y += ball.velocity;

            if (ball.y + ball.radius > this.canvas.height) {
                ball.y = this.canvas.height - ball.radius;
                ball.velocity = -ball.velocity * 0.8;
            }

            if (ball.y - ball.radius > this.canvas.height) {
                this.balls.splice(index, 1);
            }
        });

        this.context.shadowBlur = 0;
        this.context.shadowColor = 'transparent';

        this.lastTime = currentTime;
        requestAnimationFrame((time) => this.animate(time));
    }
}

document.addEventListener('DOMContentLoaded', function () {
    const fallingBall = new FallingBall();
});
