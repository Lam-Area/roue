const dashHeader = document.getElementById('dashHeader');
const slotContainer = document.getElementById('slotContainer');
const spinBtn = document.getElementById('spinBtn');
const resetBtn = document.getElementById('resetBtn');

const strips = [
    document.getElementById('strip1'),
    document.getElementById('strip2'),
    document.getElementById('strip3')
];

const urlParams = new URLSearchParams(window.location.search);
if (urlParams.get('widget') === 'true') {
    document.documentElement.style.backgroundColor = 'transparent';
    document.body.style.backgroundColor = 'transparent';
    
    const dashboard = document.getElementById('mainDashboard');
    dashboard.style.backgroundColor = 'transparent';
    
    if(dashHeader) dashHeader.style.display = 'none';
    
    slotContainer.style.cursor = 'pointer';
}

let isSpinning = false;
let currentIndices = [0, 0, 0];

const baseSequence = ['perdu', 'relance', 'perdu', 'aion', 'relance', 'perdu'];

function createSymbolElement(type) {
    const wrapper = document.createElement('div');
    wrapper.className = 'symbol';
    const img = document.createElement('img');
    img.className = 'symbol-img';
    
    if (type === 'aion') img.src = 'win.gif';
    else if (type === 'relance') img.src = 'relaunch.gif';
    else img.src = 'lose.gif';
    
    wrapper.appendChild(img);
    return wrapper;
}

strips.forEach(strip => {
    for(let i = 0; i < 100; i++) {
        baseSequence.forEach(sym => {
            strip.appendChild(createSymbolElement(sym));
        });
    }
});

function getRandomLoser() {
    const symbols = ['perdu', 'relance', 'aion'];
    let combo = [
        symbols[Math.floor(Math.random() * 3)],
        symbols[Math.floor(Math.random() * 3)],
        symbols[Math.floor(Math.random() * 3)]
    ];
    
    if (combo[0] === combo[1] && combo[1] === combo[2]) {
        combo[2] = combo[2] === 'perdu' ? 'relance' : 'perdu';
    }
    
    return combo;
}

function triggerSpin() {
    if (isSpinning) return;
    isSpinning = true;

    const rand = Math.random();
    let resultType = '';
    let soundFile = '';

    if (rand <= 0.017) {
        resultType = 'win';
        soundFile = 'money.mp3';
    } else if (rand <= 0.217) {
        resultType = 'relance';
        soundFile = 'haha.mp3';
    } else {
        resultType = 'lose';
        soundFile = 'rip.mp3';
    }

    let finalSymbols = [];
    if (resultType === 'win') {
        finalSymbols = ['aion', 'aion', 'aion'];
    } else if (resultType === 'relance') {
        finalSymbols = ['relance', 'relance', 'relance'];
    } else {
        finalSymbols = getRandomLoser();
    }

    strips.forEach((strip, index) => {
        const targetSym = finalSymbols[index];
        const symOffset = baseSequence.indexOf(targetSym);
        
        let targetIndex = currentIndices[index] + 30 + (index * 15);
        
        while (targetIndex % 6 !== symOffset) {
            targetIndex++;
        }
        
        currentIndices[index] = targetIndex;
        const translateValue = targetIndex * 180;
        
        const duration = 5 + (index * 1.5);
        
        strip.style.transition = `transform ${duration}s cubic-bezier(0.1, 0.8, 0.1, 1)`;
        strip.style.transform = `translateY(-${translateValue}px)`;
    });

    setTimeout(() => {
        const finalAudio = new Audio(soundFile);
        finalAudio.volume = 1;
        finalAudio.play().catch(() => {});
        
        if (resultType === 'relance' && typeof spawnParticles === 'function') {
            spawnParticles(slotContainer);
        }
        
    }, 8500);

    setTimeout(() => {
        isSpinning = false;
    }, 9000);
}

spinBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    triggerSpin();
});

slotContainer.addEventListener('click', () => {
    if (urlParams.get('widget') === 'true') {
        triggerSpin();
    }
});

resetBtn.addEventListener('click', () => {
    if (isSpinning) return;
    currentIndices = [0, 0, 0];
    strips.forEach(strip => {
        strip.style.transition = 'none';
        strip.style.transform = `translateY(0px)`;
    });
});