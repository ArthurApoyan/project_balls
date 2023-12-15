export var canvas = document.querySelector('#canvas');
export var context = canvas.getContext('2d');
export var colorPicker = document.getElementById('colorPicker');
export var randomColorBtn = document.getElementById('randomColorBtn');
export var closeBtn = document.getElementById('closeBtn');
export var info = document.getElementById('info');
export var infoMenu = document.getElementById('infoMenu');
export var getRandomColor = function () {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
};
export var getRandomNumber = function (a, b) { return Math.floor(Math.abs(Math.random() * (b - a)) + a); };
