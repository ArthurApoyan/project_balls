export const canvas:HTMLCanvasElement = document.querySelector('#canvas')!;
export const context = canvas.getContext('2d')!;
export const colorPicker = <HTMLInputElement>document.getElementById('colorPicker')!;
export const randomColorBtn = document.getElementById('randomColorBtn')!;
export const closeBtn = document.getElementById('closeBtn')!;
export const info = document.getElementById('info')!;
export const infoMenu = document.getElementById('infoMenu')!;
export const getRandomColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
};

export const getRandomNumber = (a:number, b:number) => Math.floor(Math.abs(Math.random() * (b - a)) + a);