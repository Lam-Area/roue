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

// OPTIMISATION : On génère seulement 20 séquences (120 images) au lieu de 100.
// C'est largement suffisant grâce au Silent Reset, et OBS respirera mieux.
strips.forEach(strip => {
    for(let i = 0; i < 20; i++) {
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
    
    // Sécurité pour s'assurer que ça ne fasse jamais 3 symboles identiques
    if (combo[0] === combo[1] && combo[1] === combo[2]) {
        combo[2] = combo[2] === 'perdu' ? 'relance' : 'perdu';
    }
    
    return combo;
}

function triggerSpin() {
    if (isSpinning) return;
    isSpinning = true;

    // LES MATHS : Exactement 1.7%, 20.0%, 78.3%
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
        
        let targetIndex = currentIndices[index] + 40 + (index * 15);
        
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

    // SILENT RESET (Rembobinage secret à la fin du Spin pour rendre la machine infinie)
    setTimeout(() => {
        isSpinning = false;
        strips.forEach((strip, index) => {
            const symOffset = currentIndices[index] % 6;
            // On remonte le rouleau en haut (avec une marge de 6 pour cacher le bord)
            currentIndices[index] = symOffset + 6; 
            strip.style.transition = 'none'; // Désactive l'animation pour le rembobinage
            strip.style.transform = `translateY(-${currentIndices[index] * 180}px)`; // Remonte instantanément
        });
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
    currentIndices = [6, 6, 6];
    strips.forEach(strip => {
        strip.style.transition = 'none';
        strip.style.transform = `translateY(-${6 * 180}px)`;
    });
});