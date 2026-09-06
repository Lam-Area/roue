function spawnParticles(container) {
    // Nombre de coeurs massivement augmenté
    const particleCount = 150; 
    
    for (let i = 0; i < particleCount; i++) {
        setTimeout(() => {
            const p = document.createElement('img');
            p.src = 'pixhearth.gif';
            p.className = 'particle';
            
            // Les coeurs poppent de chaque côté du bouton SPIN (au centre)
            const isLeft = Math.random() > 0.5;
            const startX = isLeft ? 100 + Math.random() * 80 : 300 + Math.random() * 80;
            
            p.style.left = `${startX}px`;
            container.appendChild(p);
            
            // Éparpillement aléatoire vers le haut, la gauche et la droite
            const driftX = (Math.random() * 250) - 125;
            const endY = - (300 + Math.random() * 350);
            
            p.animate([
                { transform: `translate(0, 0) scale(${0.4 + Math.random() * 0.4})`, opacity: 0 },
                { opacity: 1, offset: 0.1 },
                { opacity: 1, offset: 0.8 },
                { transform: `translate(${driftX}px, ${endY}px) scale(${1 + Math.random()})`, opacity: 0 }
            ], {
                duration: 1500 + Math.random() * 2000,
                easing: 'cubic-bezier(0.25, 1, 0.5, 1)',
                fill: 'forwards'
            }).onfinish = () => p.remove();
            
        }, i * 20); // Intervalle très court pour un effet d'explosion en chaîne
    }
}