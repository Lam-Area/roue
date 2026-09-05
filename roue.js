const wheel = document.getElementById('wheel');
const spinBtn = document.getElementById('spinBtn');
const resetBtn = document.getElementById('resetBtn');
const wheelContainer = document.getElementById('wheelContainer');

const urlParams = new URLSearchParams(window.location.search);
if (urlParams.get('widget') === 'true') {
    document.documentElement.style.backgroundColor = 'transparent';
    document.body.style.backgroundColor = 'transparent';
    
    const dashboard = document.getElementById('mainDashboard');
    dashboard.style.backgroundColor = 'transparent';
    dashboard.style.border = 'none';
    dashboard.style.boxShadow = 'none';
    dashboard.style.width = 'auto';
    
    document.getElementById('dashHeader').style.display = 'none';
    document.getElementById('configSection').style.display = 'none';
    document.getElementById('spinBtn').style.display = 'none';
    
    const mainContent = document.getElementById('mainContent');
    mainContent.style.padding = '0';
    
    wheel.style.cursor = 'pointer';
}

let currentRotation = 0;
let isSpinning = false;

const config = {
    relance: { prob: 0.28, indices: [0, 4] },
    lose: { prob: 0.695, indices: [1, 3, 5, 7] },
    win: { prob: 0.025, indices: [2, 6] }
};

function triggerSpin() {
    if (isSpinning) return;
    isSpinning = true;

    const rand = Math.random();
    let selectedCategory;
    let soundFile;

    if (rand <= config.relance.prob) {
        selectedCategory = config.relance.indices;
        soundFile = 'haha.mp3';
    } else if (rand <= config.relance.prob + config.lose.prob) {
        selectedCategory = config.lose.indices;
        soundFile = 'rip.mp3';
    } else {
        selectedCategory = config.win.indices;
        soundFile = 'money.mp3';
    }

    const targetIndex = selectedCategory[Math.floor(Math.random() * selectedCategory.length)];
    
    const baseAngle = 45;
    const offset = 22.5;
    const targetAngle = targetIndex * baseAngle;
    
    const currentMod = currentRotation % 360;
    const desiredMod = 360 - (targetAngle + offset);
    
    let rotationDiff = desiredMod - currentMod;
    if (rotationDiff <= 0) {
        rotationDiff += 360;
    }
    
    const spins = 15 * 360;
    currentRotation += spins + rotationDiff;
    
    wheel.style.transform = `rotate(${currentRotation}deg)`;

    setTimeout(() => {
        const finalAudio = new Audio(soundFile);
        finalAudio.volume = 1;
        finalAudio.play().catch(() => {});
    }, 14500);

    setTimeout(() => {
        isSpinning = false;
    }, 15000);
}

spinBtn.addEventListener('click', triggerSpin);
wheelContainer.addEventListener('click', () => {
    if (urlParams.get('widget') === 'true') {
        triggerSpin();
    }
});

resetBtn.addEventListener('click', () => {
    if (isSpinning) return;
    currentRotation = 0;
    wheel.style.transition = 'none';
    wheel.style.transform = `rotate(0deg)`;
    setTimeout(() => {
        wheel.style.transition = 'transform 15s cubic-bezier(0.1, 0.85, 0.1, 1)';
    }, 50);
});