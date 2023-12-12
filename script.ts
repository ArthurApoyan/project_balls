interface Ball {
    x: number;
    y: number;
    radius: number;
    clickAnimationFrames: number;
    velocity: number;
    color: string;
}

class FallingBall {
    private canvas: HTMLCanvasElement;
    private context: CanvasRenderingContext2D;
    private balls: Ball[] = [];
    private gravity: number = 0.7;
    private lastTime: number = 1;
    private backgroundImage: HTMLImageElement = new Image();
    private backgrounds: string[] = ['assets/backgroundImage.jpg', 'assets/backgroundImage_1.jpg', 'assets/backgroundImage_2.jpg'];
    private clickAnimationFrames: number = 20;
    private clickAnimationRadius: number = Math.abs(Math.random() * 25 + 20);
    private colorPicker: HTMLInputElement;
    private randomColorBtn: HTMLElement;
    private closeBtn: HTMLElement;
    private infoMenu: HTMLElement;
    private isRandom: boolean;
    private backgroundIndex: number = 0;

    constructor() {
        this.canvas = document.querySelector('canvas')!;
        this.context = this.canvas.getContext('2d')!;
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.getBackgroundSource(this.backgroundIndex);

        this.canvas.addEventListener('click', this.handleCanvasClick.bind(this));
        this.canvas.addEventListener('contextmenu', this.changeBackground.bind(this));

        this.isRandom = true;

        this.colorPicker = <HTMLInputElement>document.getElementById('colorPicker')!;
        this.colorPicker.value = this.getRandomColor();
        this.colorPicker.onclick = () => {
            this.isRandom = false;
            this.updateRandomBtnText();
        };

        this.randomColorBtn = document.getElementById('randomColorBtn')!;
        this.randomColorBtn.onclick = () => this.handleRandomBtnClick();
        this.updateRandomBtnText();

        this.closeBtn = document.getElementById('closeBtn')!;
        this.closeBtn.onclick = () => this.closeInfoMenu();
        this.infoMenu = document.getElementById('infoMenu')!;

        requestAnimationFrame((time) => this.animate(time));
    }

    handleCanvasClick(event: MouseEvent) {
        const newBall = {
            x: event.clientX,
            y: event.clientY,
            radius: Math.abs(Math.random() * 30) + 1,
            velocity: 0,
            color: this.isRandom ? this.getRandomColor() : this.colorPicker.value,
            clickAnimationFrames: this.clickAnimationFrames,
        };

        this.balls.push(newBall);
        if (this.balls.length > 15){
            this.animateDestroyClick(this.balls[0]);
        }

        this.animateCreateClick(newBall);
    }

    animateCreateClick(ball: Ball) {
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

    animateDestroyClick(ball: Ball) {
        let frameCount = 0;
        const animate = () => {
            frameCount++
            ball.radius -= this.clickAnimationRadius / this.clickAnimationFrames;
            if (frameCount < this.clickAnimationFrames && ball.radius > 0) {
                requestAnimationFrame(animate);
            }else{
                this.balls.shift();
            }
        };

        animate();
    }

    getBackgroundSource(index:number){
        return this.backgroundImage.src = this.backgrounds[index];
    }

    changeBackground(e:MouseEvent){
        e.preventDefault();
        if(this.backgroundIndex === 2){
            this.backgroundIndex = 0;
        }else{
            this.backgroundIndex++
        }
        this.getBackgroundSource(this.backgroundIndex);
    }

    getRandomColor() {
        const letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }

    handleRandomBtnClick() {
        this.isRandom = !this.isRandom;
        this.updateRandomBtnText();
    }

    updateRandomBtnText() {
        this.randomColorBtn.innerText = this.isRandom ? 'Random Colors On' : 'Random Colors Off';
    }

    coverImg(type:string){
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

    closeInfoMenu(){
        this.infoMenu.style.display = 'none';
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

const fallingBall = new FallingBall();
