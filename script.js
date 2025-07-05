// Variables globales
let isSpinning = false;
let prizes = [
    "🎁 Premio 1",
    "🍰 Premio 2", 
    "🎈 Premio 3",
    "🎊 Premio 4",
    "🎪 Premio 5"
];

// Elementos del DOM
const wheel = document.getElementById('wheel');
const spinBtn = document.getElementById('spinBtn');
const result = document.getElementById('result');
const updateBtn = document.getElementById('updateBtn');

// Event listeners
spinBtn.addEventListener('click', spinWheel);
updateBtn.addEventListener('click', updatePrizes);

// Función principal para girar la ruleta
function spinWheel() {
    if (isSpinning) return;
    
    isSpinning = true;
    spinBtn.disabled = true;
    spinBtn.textContent = '🔄 Girando...';
    
    // Limpiar resultado anterior
    result.innerHTML = '<p>🎯 La ruleta está girando...</p>';
    result.className = 'result';
    
    // Calcular rotación aleatoria
    const minSpins = 3; // Mínimo 3 vueltas completas
    const maxSpins = 6; // Máximo 6 vueltas completas
    const spins = minSpins + Math.random() * (maxSpins - minSpins);
    const finalAngle = Math.random() * 360;
    const totalRotation = spins * 360 + finalAngle;
    
    // Aplicar rotación
    wheel.style.setProperty('--spin-amount', `${totalRotation}deg`);
    wheel.classList.add('spinning');
    
    // Después de la animación, mostrar resultado
    setTimeout(() => {
        const winnerIndex = getWinnerIndex(finalAngle);
        showResult(winnerIndex);
        
        // Resetear estado
        wheel.classList.remove('spinning');
        isSpinning = false;
        spinBtn.disabled = false;
        spinBtn.textContent = '🎯 GIRAR RULETA';
    }, 3000);
}

// Determinar qué sección ganó basado en el ángulo final
function getWinnerIndex(angle) {
    // Normalizar ángulo entre 0 y 360
    const normalizedAngle = ((360 - angle) + 90) % 360;
    
    // Cada sección ocupa 72 grados (360/5)
    const sectionAngle = 360 / 5;
    
    // Determinar índice ganador
    const winnerIndex = Math.floor(normalizedAngle / sectionAngle);
    return winnerIndex % 5;
}

// Mostrar resultado ganador
function showResult(winnerIndex) {
    const winnerText = prizes[winnerIndex];
    
    result.innerHTML = `
        <p>🎉 ¡Felicidades! 🎉</p>
        <p style="font-size: 1.4em; margin-top: 10px;">Has ganado:</p>
        <p style="font-size: 1.6em; color: #4caf50; margin-top: 5px;">${winnerText}</p>
    `;
    
    result.className = 'result winner';
    
    // Efecto de celebración
    createConfetti();
}

// Actualizar premios desde los inputs
function updatePrizes() {
    const inputs = [
        document.getElementById('prize1'),
        document.getElementById('prize2'),
        document.getElementById('prize3'),
        document.getElementById('prize4'),
        document.getElementById('prize5')
    ];
    
    // Actualizar array de premios
    prizes = inputs.map(input => input.value.trim() || input.placeholder);
    
    // Actualizar texto en las secciones de la ruleta
    const sections = document.querySelectorAll('.section span');
    sections.forEach((section, index) => {
        section.textContent = prizes[index];
    });
    
    // Mostrar confirmación
    result.innerHTML = '<p>✅ ¡Premios actualizados correctamente!</p>';
    result.className = 'result';
    
    // Limpiar mensaje después de 2 segundos
    setTimeout(() => {
        result.innerHTML = '<p>¡Gira la ruleta para ver tu premio!</p>';
    }, 2000);
}

// Efecto de confetti simple
function createConfetti() {
    const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#f9ca24', '#6c5ce7'];
    
    for (let i = 0; i < 50; i++) {
        setTimeout(() => {
            const confetti = document.createElement('div');
            confetti.style.cssText = `
                position: fixed;
                width: 10px;
                height: 10px;
                background: ${colors[Math.floor(Math.random() * colors.length)]};
                left: ${Math.random() * 100}vw;
                top: -10px;
                border-radius: 50%;
                pointer-events: none;
                z-index: 1000;
                animation: fall 3s linear forwards;
            `;
            
            document.body.appendChild(confetti);
            
            // Remover confetti después de la animación
            setTimeout(() => {
                confetti.remove();
            }, 3000);
        }, i * 50);
    }
}

// CSS para animación de confetti
const style = document.createElement('style');
style.textContent = `
    @keyframes fall {
        0% {
            transform: translateY(-10px) rotate(0deg);
            opacity: 1;
        }
        100% {
            transform: translateY(100vh) rotate(360deg);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Inicializar la aplicación
document.addEventListener('DOMContentLoaded', () => {
    // Cargar premios guardados del localStorage si existen
    const savedPrizes = localStorage.getItem('roulettePrizes');
    if (savedPrizes) {
        prizes = JSON.parse(savedPrizes);
        
        // Actualizar inputs con premios guardados
        prizes.forEach((prize, index) => {
            const input = document.getElementById(`prize${index + 1}`);
            if (input) input.value = prize;
        });
        
        // Actualizar secciones de la ruleta
        const sections = document.querySelectorAll('.section span');
        sections.forEach((section, index) => {
            section.textContent = prizes[index];
        });
    }
});

// Guardar premios en localStorage cuando se actualicen
const originalUpdatePrizes = updatePrizes;
updatePrizes = function() {
    originalUpdatePrizes();
    localStorage.setItem('roulettePrizes', JSON.stringify(prizes));
};

// Prevenir zoom en dispositivos móviles
document.addEventListener('touchstart', function(e) {
    if (e.touches.length > 1) {
        e.preventDefault();
    }
}, { passive: false });

let lastTouchEnd = 0;
document.addEventListener('touchend', function(e) {
    const now = (new Date()).getTime();
    if (now - lastTouchEnd <= 300) {
        e.preventDefault();
    }
    lastTouchEnd = now;
}, false);
