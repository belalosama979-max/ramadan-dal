export const triggerConfetti = () => {
    const colors = ['#D4AF37', '#14532D', '#22C55E', '#FCD34D', '#FFFFFF'];
    const confettiCount = 100;
    
    for (let i = 0; i < confettiCount; i++) {
        const confetti = document.createElement('div');
        confetti.classList.add('confetti');
        
        // Random properties
        const bg = colors[Math.floor(Math.random() * colors.length)];
        const left = Math.random() * 100 + 'vw';
        const animDuration = Math.random() * 2 + 2 + 's'; // 2-4s
        const animDelay = Math.random() * 0.5 + 's';
        
        confetti.style.backgroundColor = bg;
        confetti.style.left = left;
        confetti.style.animationDuration = animDuration;
        confetti.style.animationDelay = animDelay;
        
        document.body.appendChild(confetti);
        
        // Cleanup
        setTimeout(() => {
            confetti.remove();
        }, 4000);
    }
};
