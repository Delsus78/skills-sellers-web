<script setup>
const { pourcentage, text, endedText } = defineProps({
    pourcentage: {
        type: Number,
        required: true,
        default: 50
    },
    text: {
        type: String,
        required: true,
        default: '99h 99m 99s'
    },
    endedText: {
        type: String,
        required: false,
        default: 'BLOQUEE'
    }
});

</script>
<template>
    <div class="progress">
        <div v-if='pourcentage <= 100' class="progress-bar" :style="{width: pourcentage + '%',
          'background-color': 'rgba('+(246-1.12 * pourcentage)+','
                                     +(58+1.66 * pourcentage)+','
                                     +(15+0.15 * pourcentage)+', 0.6)' }"></div>
        <div v-else class="progress-bar" :style="{width: '100%',
          'background-color': 'rgba(144, 0, 0, 0.6)' }"></div>
        <div v-if='pourcentage <= 100' class="progress-bar-text">{{ text }}</div>
        <div v-else class="progress-bar-text">{{endedText}}</div>
    </div>
</template>
<style scoped>
.progress {
    display: grid;
    width: 100%;
    padding: 4px;
    align-items: center;
    background: rgba(0, 0, 0, 0.25);
    border-radius: 6px;
    -webkit-box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.25), 0 1px rgba(255, 255, 255, 0.08);
    box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.25), 0 1px rgba(255, 255, 255, 0.08);
}

.progress-bar {
    grid-row: 1;
    grid-column: 1;
    height: 16px;
    border-radius: 4px;
    background-image: -webkit-linear-gradient(top, rgba(255, 255, 255, 0.3), rgba(255, 255, 255, 0.05));
    background-image: -moz-linear-gradient(top, rgba(255, 255, 255, 0.3), rgba(255, 255, 255, 0.05));
    background-image: -o-linear-gradient(top, rgba(255, 255, 255, 0.3), rgba(255, 255, 255, 0.05));
    background-image: linear-gradient(to bottom, rgba(255, 255, 255, 0.3), rgba(255, 255, 255, 0.05));
    -webkit-transition: 0.4s linear;
    -moz-transition: 0.4s linear;
    -o-transition: 0.4s linear;
    transition: 0.4s linear;
    -webkit-transition-property: width, background-color;
    -moz-transition-property: width, background-color;
    -o-transition-property: width, background-color;
    transition-property: width, background-color;
    -webkit-box-shadow: 0 0 1px 1px rgba(0, 0, 0, 0.25), inset 0 1px rgba(255, 255, 255, 0.1);
    box-shadow: 0 0 1px 1px rgba(0, 0, 0, 0.25), inset 0 1px rgba(255, 255, 255, 0.1);
}

.progress-bar-text {
    grid-row: 1;
    grid-column: 1;
    width: 100%;
    text-align: center;
    font-size: 0.7rem;
    font-weight: bold;
    color: #ffffff;
    mix-blend-mode: overlay;
}
</style>