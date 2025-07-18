let interval = null;
const amplitude = 40;

// Define canvas variables
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const width = ctx.canvas.width;
const height = ctx.canvas.height;

// Create Web Audio API elements
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
const gainNode = audioCtx.createGain();
const oscillator = audioCtx.createOscillator();

oscillator.connect(gainNode);
gainNode.connect(audioCtx.destination);
oscillator.type = "sine";
oscillator.start();
gainNode.gain.value = 0;

const input = document.getElementById("input");

// Define note-to-frequency mapping
const notenames = new Map([
  ["C", 261.6],
  ["D", 293.7],
  ["E", 329.6],
  ["F", 349.2],
  ["G", 392],
  ["A", 440],
  ["B", 493.9],
]);

let freq = 0;
let x = 0;
let y = 0;
let counter = 0;

function frequency(pitch) {
  freq = pitch / 10000;
  gainNode.gain.setValueAtTime(1, audioCtx.currentTime);
  oscillator.frequency.setValueAtTime(pitch, audioCtx.currentTime);
  gainNode.gain.setValueAtTime(0, audioCtx.currentTime + 1);
}

function drawWave() {
  ctx.clearRect(0, 0, width, height);
  x = 0;
  y = height / 2;

  ctx.beginPath();
  ctx.moveTo(x, y);

  counter = 0;
  if (interval) clearInterval(interval);
  interval = setInterval(line, 20);
}

function line() {
  y = height / 2 + amplitude * Math.sin(x * 2 * Math.PI * freq);
  ctx.lineTo(x, y);
  ctx.stroke();
  x += 1;
  counter++;

  if (counter > 50) {
    clearInterval(interval);
  }
}

function handle() {
  audioCtx.resume();
  gainNode.gain.value = 0;

  const note = String(input.value).toUpperCase();
  const pitch = notenames.get(note);

  if (!pitch) {
    alert("Invalid note name. Please enter one of: C, D, E, F, G, A, B.");
    return;
  }

  frequency(pitch);
  drawWave();
}
