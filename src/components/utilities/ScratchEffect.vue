<template>
    <div ref="scratchContainer" class="scratch-container">
        <slot></slot>
        <canvas ref="scratchCanvas" class="scratch-canvas"></canvas>
    </div>
</template>

<script setup>
import {ref, onMounted, onUnmounted, computed} from 'vue';

const scratchContainer = ref(null);
const scratchCanvas = ref(null);
let isDrawing = false;
let lastX, lastY;

const ctx = computed(() => {
    const canvas = scratchCanvas.value;
    return canvas ? canvas.getContext('2d') : null;
});

const resizeCanvas = () => {
    const canvas = scratchCanvas.value;
    canvas.width = scratchContainer.value.offsetWidth;
    canvas.height = scratchContainer.value.offsetHeight;
    ctx.value.fillStyle = '#000000';
    ctx.value.fillRect(0, 0, canvas.width, canvas.height);

    // Ajout du texte
    ctx.value.font = '20px Arial';
    ctx.value.fillStyle = '#FFFFFF';
    ctx.value.textAlign = 'center';
    ctx.value.textBaseline = 'middle';
    ctx.value.fillText('Gratte ici pour découvrir ta carte!', canvas.width / 2, canvas.height / 2);
};

const handleStart = (clientX, clientY) => {
    const canvas = scratchCanvas.value;
    isDrawing = true;
    const rect = canvas.getBoundingClientRect();
    lastX = clientX - rect.left;
    lastY = clientY - rect.top;
};

const handleMove = (clientX, clientY) => {
    if (!isDrawing) return;
    const canvas = scratchCanvas.value;
    const rect = canvas.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    ctx.value.globalCompositeOperation = 'destination-out';
    ctx.value.lineWidth = 100;
    ctx.value.lineCap = 'round';
    ctx.value.beginPath();
    ctx.value.moveTo(lastX, lastY);
    ctx.value.lineTo(x, y);
    ctx.value.stroke();

    lastX = x;
    lastY = y;
};

const stopDrawing = () => {
    isDrawing = false;
    ctx.value.beginPath();
};

onMounted(() => {
    const canvas = scratchCanvas.value;
    if (canvas) {
        resizeCanvas();
        canvas.addEventListener('mousedown', (event) => handleStart(event.clientX, event.clientY));
        canvas.addEventListener('touchstart', (event) => {
            event.preventDefault();
            handleStart(event.touches[0].clientX, event.touches[0].clientY);
        });
        canvas.addEventListener('mousemove', (event) => handleMove(event.clientX, event.clientY));
        canvas.addEventListener('touchmove', (event) => {
            event.preventDefault();
            handleMove(event.touches[0].clientX, event.touches[0].clientY);
        });
        canvas.addEventListener('mouseup', stopDrawing);
        canvas.addEventListener('touchend', stopDrawing);
    }
});

onUnmounted(() => {
    const canvas = scratchCanvas.value;
    if (canvas) {
        canvas.removeEventListener('mousedown', (event) => handleStart(event.clientX, event.clientY));
        canvas.removeEventListener('touchstart', (event) => {
            event.preventDefault();
            handleStart(event.touches[0].clientX, event.touches[0].clientY);
        });
        canvas.removeEventListener('mousemove', (event) => handleMove(event.clientX, event.clientY));
        canvas.removeEventListener('touchmove', (event) => {
            event.preventDefault();
            handleMove(event.touches[0].clientX, event.touches[0].clientY);
        });
        canvas.removeEventListener('mouseup', stopDrawing);
        canvas.removeEventListener('touchend', stopDrawing);
    }
});

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
