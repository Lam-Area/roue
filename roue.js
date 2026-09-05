const wheel = document.getElementById('wheel');
const spinBtn = document.getElementById('spinBtn');
const resetBtn = document.getElementById('resetBtn');

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
    
    const mainContent = document.getElementById('mainContent');
    mainContent.style.padding = '0';
}

let currentRotation = 0;
let isSpinning = false;

const config = {
    relance: { prob: 0.60, indices: [0, 5] },
    lose: { prob: 0.33, indices: [1, 3, 6] },
    win: { prob: 0.07, indices: [2, 4, 7] }
};

spinBtn.addEventListener('click', () => {
    if (isSpinning) return;
    isSpinning = true;

    const rand = Math.random();
    let selectedCategory;

    if (rand <= config.relance.prob) {
        selectedCategory = config.relance.indices;
    } else if (rand <= config.relance.prob + config.lose.prob) {
        selectedCategory = config.lose.indices;
    } else {
        selectedCategory = config.win.indices;
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
        isSpinning = false;
    }, 15000);
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