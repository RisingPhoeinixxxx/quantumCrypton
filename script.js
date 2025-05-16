const BIT_COUNT = 30;

const aliceBitsDiv = document.getElementById('aliceBits');
const aliceBasesDiv = document.getElementById('aliceBases');
const bobBasesDiv = document.getElementById('bobBases');
const bobResultsDiv = document.getElementById('bobResults');
const messagesDiv = document.getElementById('messages');
const finalKeyArea = document.getElementById('finalKey');
const startBtn = document.getElementById('startBtn');
const resetBtn = document.getElementById('resetBtn');
const eavesdropperCheck = document.getElementById('eavesdropperCheck');

let aliceBits = [];
let aliceBases = [];
let bobBases = [];
let bobResults = [];
let finalKey = [];
let running = false;

function getRandomBit() {
  return Math.random() < 0.5 ? 0 : 1;
}

function getRandomBasis() {
  return Math.random() < 0.5 ? '+' : 'x';
}

function renderRow(container, arr) {
  container.innerHTML = '';
  arr.forEach(val => {
    const box = document.createElement('div');
    box.className = 'bit-box';
    box.textContent = val;
    container.appendChild(box);
  });
}

function simulateTransmission(eavesdropper = false) {
  bobBases = [];
  bobResults = [];

  for (let i = 0; i < BIT_COUNT; i++) {
    bobBases.push(getRandomBasis());
  }

  for (let i = 0; i < BIT_COUNT; i++) {
    if (eavesdropper) {
      const eveBasis = getRandomBasis();
      let eveResult;
      if (eveBasis === aliceBases[i]) {
        eveResult = aliceBits[i];
      } else {
        eveResult = getRandomBit();
      }

      if (bobBases[i] === eveBasis) {
        bobResults.push(eveResult);
      } else {
        bobResults.push(getRandomBit());
      }
    } else {
      if (bobBases[i] === aliceBases[i]) {
        bobResults.push(aliceBits[i]);
      } else {
        bobResults.push(getRandomBit());
      }
    }
  }
}

function generateKey() {
  finalKey = [];
  for (let i = 0; i < BIT_COUNT; i++) {
    if (aliceBases[i] === bobBases[i]) {
      if (aliceBits[i] === bobResults[i]) {
        finalKey.push(aliceBits[i]);
      } else {
        finalKey.push('?');
      }
    } else {
      finalKey.push('-');
    }
  }
}

function renderAll() {
  renderRow(aliceBitsDiv, aliceBits);
  renderRow(aliceBasesDiv, aliceBases);
  renderRow(bobBasesDiv, bobBases);
  renderRow(bobResultsDiv, bobResults);

  const bobResultBoxes = bobResultsDiv.querySelectorAll('.bit-box');
  for (let i = 0; i < BIT_COUNT; i++) {
    if (aliceBases[i] === bobBases[i]) {
      if (aliceBits[i] === bobResults[i]) {
        bobResultBoxes[i].classList.add('match');
      } else {
        bobResultBoxes[i].classList.add('mismatch');
      }
    }
  }
}

function showMessage(msg, isError = false) {
  messagesDiv.textContent = msg;
  messagesDiv.style.color = isError ? '#ff3300' : '#0f0';
}

function displayFinalKey() {
  let keyStr = finalKey
    .map(v => (v === '-' ? '' : v === '?' ? '✗' : v))
    .filter(v => v !== '')
    .join('');
  finalKeyArea.textContent = keyStr.length
    ? `Shared Secret Key: ${keyStr}`
    : 'No valid shared key generated.';
}

function glitchEffect() {
  const intensity = Math.random() * 0.3 + 0.7;
  document.body.style.filter = `brightness(${intensity})`;
}

let glitchInterval;

function startSimulation() {
  if (running) return;
  running = true;

  aliceBits = [];
  aliceBases = [];

  for (let i = 0; i < BIT_COUNT; i++) {
    aliceBits.push(getRandomBit());
    aliceBases.push(getRandomBasis());
  }

  showMessage('Transmitting quantum bits...');
  renderAll();
  finalKeyArea.textContent = '';

  simulateTransmission(eavesdropperCheck.checked);

  renderAll();

  generateKey();

  displayFinalKey();

  if (finalKey.includes('?')) {
    showMessage('Warning: Eavesdropper detected or noise! Key mismatch present.', true);
  } else {
    showMessage('Key generated successfully with no detected interference.');
  }

  resetBtn.disabled = false;
  startBtn.disabled = true;

  glitchInterval = setInterval(glitchEffect, 300);
}

function resetSimulation() {
  running = false;
  aliceBits = [];
  aliceBases = [];
  bobBases = [];
  bobResults = [];
  finalKey = [];
  aliceBitsDiv.innerHTML = '';
  aliceBasesDiv.innerHTML = '';
  bobBasesDiv.innerHTML = '';
  bobResultsDiv.innerHTML = '';
  messagesDiv.textContent = '';
  finalKeyArea.textContent = '';
  resetBtn.disabled = true;
  startBtn.disabled = false;
  clearInterval(glitchInterval);
  document.body.style.filter = 'brightness(1)';
}

startBtn.addEventListener('click', startSimulation);
resetBtn.addEventListener('click', resetSimulation);
