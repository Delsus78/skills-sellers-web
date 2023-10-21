<template>
    <div ref="scratchContainer" class="scratch-container">
        <slot></slot>
        <canvas ref="scratchCanvas" class="scratch-canvas"></canvas>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const scratchContainer = ref(null);
const scratchCanvas = ref(null);

const initializeScratchEffect = () => {
    const canvas = scratchCanvas.value;
    const ctx = canvas.getContext('2d');
    let isDrawing = false;
    let lastX, lastY;

    const resizeCanvas = () => {
        canvas.width = scratchContainer.value.offsetWidth;
        canvas.height = scratchContainer.value.offsetHeight;
        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Ajout du texte
        ctx.font = '20px Arial'; // Vous pouvez ajuster la taille et le style de la police ici
        ctx.fillStyle = '#FFFFFF';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('Gratte ici pour découvrir ta carte!', canvas.width / 2, canvas.height / 2);

    };
    resizeCanvas();

    document.addEventListener('mousedown', (event) => {
        isDrawing = true;
        const rect = canvas.getBoundingClientRect();
        lastX = event.clientX - rect.left;
        lastY = event.clientY - rect.top;
    });

    document.addEventListener('mouseup', () => {
        isDrawing = false;
        ctx.beginPath();
    });

    document.addEventListener('touchstart', (event) => {
        isDrawing = true;
        const rect = canvas.getBoundingClientRect();
        lastX = event.touches[0].clientX - rect.left;
        lastY = event.touches[0].clientY - rect.top;
    });

    document.addEventListener('touchend', () => {
        isDrawing = false;
        ctx.beginPath();
    });

    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('touchmove', draw);

    function draw(event) {
        if (!isDrawing) return;
        const rect = canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        ctx.globalCompositeOperation = 'destination-out';
        ctx.lineWidth = 100;
        ctx.lineCap = 'round';

        ctx.beginPath();
        ctx.moveTo(lastX, lastY);
        ctx.lineTo(x, y);
        ctx.stroke();

        // Mise à jour des coordonnées pour le prochain segment de grattage
        lastX = x;
        lastY = y;
    }

};

onMounted(initializeScratchEffect);

</script>
<style scoped>
.scratch-container {
    position: relative;
    z-index: 10;
}

.scratch-canvas {
    position: absolute;
    top: 0;
    left: 0;
    cursor: crosshair;

    filter:
        drop-shadow(0.5rem 0 0.5rem black)
        drop-shadow(-0.5rem 0 0.5rem black)
        drop-shadow(0 0.5rem 0.5rem black)
        drop-shadow(0 -0.5rem 0.5rem black)
        drop-shadow(0 0 10rem black)
}
</style>
