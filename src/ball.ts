import {colorPicker, getRandomColor, getRandomNumber} from "./tools";

export interface BallType {
    x: number;
    y: number;
    radius: number;
    clickAnimationFrames: number;
    velocity: number;
    color: string;
};

export class Ball{
    public isRandom: boolean;
    public colorPicker: HTMLInputElement;
    public clickAnimationFrames: number = 20;

    constructor(isRandom:boolean) {
        this.isRandom = isRandom;
        this.colorPicker = colorPicker;
    }
    draw(event: MouseEvent | KeyboardEvent){
        let newBall;
        if(event instanceof MouseEvent){
            newBall = {
                x: event.clientX,
                y: event.clientY,
                radius: getRandomNumber(10, 30),
                velocity: 0,
                color: this.isRandom ? getRandomColor() : this.colorPicker.value,
                clickAnimationFrames: this.clickAnimationFrames,
            };
        }else if(event instanceof KeyboardEvent && event.key == ' '){
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
}