var interval = null;
var amplitude = 40;

//defome canvas variables
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

var width = ctx.canvas.width;
var height = ctx.canvas.height;

// create web audio api elements
const audioCtx = new AudioContext();
const gainNode = audioCtx.createGain();

// create Oscillator mode
const oscillator = audioCtx.createOscillator();
oscillator.connect(gainNode);
gainNode.connect(audioCtx.destination);
oscillator.type = "sine";

oscillator.start();
gainNode.gain.value = 0;

const input = document.getElementById('input');

notenames = new Map();
notenames.set("C", 261.6);
notenames.set("D", 293.7);
notenames.set("E", 329.6);
notenames.set("F", 349.2);
notenames.set("G", 392);
notenames.set("A", 440);
notenames.set("B", 493.9);
notenames.set("c", 261.6);
notenames.set("d", 293.7);
notenames.set("e", 329.6);
notenames.set("f", 349.2);
notenames.set("g", 392);
notenames.set("a", 440);
notenames.set("b", 493.9);

function frequency(pitch){
    freq = pitch / 10000;
    gainNode.gain.setValueAtTime(100, audioCtx.currentTime);
    oscillator.frequency.setValueAtTime(pitch, audioCtx.currentTime);
    gainNode.gain.setValueAtTime(0, audioCtx.currentTime + 1);
}

var counter = 0;

function drawWave(){
    ctx.clearRect(0,0, width, height);
    x = 0;
    y = height/2;
    
    ctx.beginPath();
    ctx.moveTo(x, y);

    counter = 0;
    interval = setInterval(line, 20);
}

function line(){
    y = height/2 + (amplitude * Math.sin(x * 2 * Math.PI * freq));
    ctx.lineTo(x,y);
    x = x + 1;
    counter++;
    if(counter > 50){
        clearInterval(interval);
    }
}

function handle(){
    audioCtx.resume();
    gainNode.gain.value = 0;

    frequency(notenames.get(String(input.value)));
    drawWave();
}
