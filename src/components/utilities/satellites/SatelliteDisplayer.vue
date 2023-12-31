<script setup>
import { computed } from 'vue';

const props = defineProps({
    level: {
        type: Number,
        required: true
    },
    circleRadius: {
        type: Number,
        default: 500 // Un grand rayon pour le cercle principal
    },
    satelliteSize: {
        type: Number,
        default: 50 // Une grande taille pour les satellites
    }
});

const satellites = computed(() => Array.from({ length: props.level }, (_, i) => i + 1));

// Calculez la taille totale nécessaire pour la viewBox
const totalSize = props.circleRadius * 2 + props.satelliteSize * 2;
const viewBoxSize = computed(() => `0 0 ${totalSize} ${totalSize}`);

// Calculez la transformation pour centrer le groupe
const groupTransform = computed(() => `translate(${totalSize / 2} ${totalSize / 2})`);

const satelliteStyle = (n) => {
    const angle = (360 / props.level) * n;
    const distance = props.circleRadius; // La distance des satellites par rapport au centre
    return {
        transform: `rotate(${angle}deg) translate(${distance}px)`,
        animation: `orbit 10s linear infinite`
    };
};
</script>

<template>
    <div class="satellite_displayer_container">
        <div class="satellite_displayer">
            <svg :viewBox="viewBoxSize" width="100%" height="100%">
                <defs>
                    <circle id="satellite" cx="0" cy="0" :r="satelliteSize" fill="white"></circle>
                </defs>
                <g :transform="groupTransform">
                    <circle cx="0" cy="0" :r="props.circleRadius" fill="none" stroke="currentColor" stroke-width="1"></circle>
                    <!-- Vous pouvez ajuster stroke-width ci-dessus pour rendre l'anneau plus visible -->
                    <g v-for="n in satellites" :key="n" :style="satelliteStyle(n)">
                        <use xlink:href="#satellite" />
                    </g>
                </g>
            </svg>
        </div>
    </div>
</template>

<style scoped>
/* Assurez-vous que les animations restent à l'intérieur du container */
@keyframes orbit {
    0% { transform: rotate(0deg) translateX(20000px); }
    100% { transform: rotate(360deg) translateX(20000px); }
}

.satellite_displayer_container {
    /* Vos styles existants */
}

.satellite_displayer {
    /* Vos styles existants */
    overflow: visible; /* Cela permet de s'assurer que rien n'est coupé */
}
</style>
