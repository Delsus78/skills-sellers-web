<script setup>
import RandomPlanet from "@/components/utilities/RandomPlanet.vue";
import Cosmetic from "@/components/utilities/CosmeticMarket/Comsetic.vue";
import {onMounted, onUnmounted, ref} from "vue";

const centerOfThePlanetInTheScreen = ref({x: 0, y: 0});
const getCenterOfThePlanet = () => {
    const planet = document.querySelector('.cosmeticPlanet');

    let centerX = planet.offsetLeft + planet.offsetWidth / 2;
    let centerY = planet.offsetTop + planet.offsetHeight / 2;

    centerOfThePlanetInTheScreen.value = {
        x: centerX,
        y: centerY
    }
}

onMounted(() => {
    window.addEventListener('resize', getCenterOfThePlanet);
    getCenterOfThePlanet();
});

onUnmounted(() => {
    window.removeEventListener('resize', getCenterOfThePlanet);
});

const { cosmeticsDisplayed, playerPseudo, width, height } = defineProps({
    cosmeticsDisplayed: {
        type: Array,
        required: true
    },
    playerPseudo: {
        type: String,
        required: true
    },
    width: {
        type: Number,
        required: true
    },
    height: {
        type: Number,
        required: true
    }
});
</script>
<template>
  <div class="planetWithCosmetics">
      <RandomPlanet class="cosmeticPlanet" :model-value="playerPseudo" :width="850" :height="850" :planet-id='1'/>
      <Cosmetic v-for="cosmetic in cosmeticsDisplayed"
                :key="cosmetic.id"
                :cosmetic-id="cosmetic.cosmeticId"
                class="cosmeticImage"
                :style="{
                    left: centerOfThePlanetInTheScreen.x + cosmetic.coordinateX + 'px',
                    top: centerOfThePlanetInTheScreen.y + cosmetic.coordinateY + 'px',
                    transform: 'scale('+cosmetic.size+') rotate(' + cosmetic.rotation + 'deg)',
                    zIndex: cosmetic.zIndex}"/>
  </div>
</template>

<style scoped>
.cosmeticImage {
    position: absolute;
    width: 100px;
    height: 100px;
    cursor: pointer;
    user-select: none;
    z-index: 100;
    transform: translate(-50%, -50%);
    pointer-events: none;
}
</style>