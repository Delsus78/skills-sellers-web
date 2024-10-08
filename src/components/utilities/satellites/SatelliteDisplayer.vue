<script setup>
import { computed } from 'vue';
import satelliteImg from '@/assets/images/satellite.png';

const { level, circleRadius, satelliteSize, satelliteUsed } = defineProps({
    level: {
        type: Number,
        required: true
    },
    satelliteUsed: {
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

const satellitesEmpty = computed(() => {
    return level - satelliteUsed;
    });

// Calculez la taille totale nécessaire pour la viewBox
const totalSize = circleRadius * 2 + satelliteSize * 2;
const viewBoxSize = computed(() => `0 0 ${totalSize} ${totalSize}`);

// Calculez la transformation pour centrer le groupe
const groupTransform = computed(() => `translate(${totalSize / 2} ${totalSize / 2})`);

const satelliteStyle = (n) => {
    const angle = (360 / level) * n;
    const distance = circleRadius; // La distance des satellites par rapport au centre
    return {
        transform: `rotate(${angle}deg) translate(${distance}px)`,
        animation: `orbit 10s linear infinite`
    };
};
</script>

<template>
    <div class="satellite_displayer_container">
        <div class="satellite_displayer">
            <svg :viewBox="viewBoxSize" width="100%" height="100%" style="overflow: visible;">
                <defs>
                    <image id="satellite_empty" :xlink:href="satelliteImg"
                           x="-75" y="-75" height="150" width="150" style="filter: grayscale(100%)" />
                    <g id="satellite_used">
                        <image :xlink:href="satelliteImg"
                               x="-75" y="-75" height="150" width="150"/>
                        <image :xlink:href="satelliteImg"
                               x="-90" y="-90" height="180" width="180" style="
                                   filter: blur(10px); opacity: 0.5;"/>
                    </g>
                </defs>
                <g :transform="groupTransform">
                    <circle cx="0" cy="0" :r="circleRadius" fill="none" stroke="currentColor" stroke-width="1"></circle>
                    <g v-for="n in satellitesEmpty" :key="n" :style="satelliteStyle(n)">
                        <use xlink:href="#satellite_empty" />
                    </g>
                    <g v-for="n in satelliteUsed" :key="n" :style="satelliteStyle(n + satellitesEmpty)">
                        <use xlink:href="#satellite_used" />
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
