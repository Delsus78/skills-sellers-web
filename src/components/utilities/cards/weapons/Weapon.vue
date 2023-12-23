<script setup>
import {VanillaTilt} from "../../VanillaTilt";
import {onMounted, onUnmounted, ref} from "vue";
import {faGun as weaponIcon} from "@fortawesome/free-solid-svg-icons";
import AffinityIcon from "@/components/utilities/cards/weapons/AffinityIcon.vue";

const emit = defineEmits(['click']);
const tiltCard = ref(null);
let tiltInstance;

const { weapon, desactivated } = defineProps({
    weapon: {
        type: Object,
        default: () => {}
    },
    desactivated: {
        type: Boolean,
        default: false
    }
});

onMounted(() => {
    if (tiltCard.value) {
        tiltInstance = new VanillaTilt(tiltCard.value, {
            glare: true,
            reverse: true,
            "max-glare": 0.15
        });
    }
});

onUnmounted(() => {
    if (tiltInstance) {
        tiltInstance.destroy();
    }
});

const onClick = () => {
    if (desactivated) {
        return;
    }
    emit('click', weapon);
};

</script>

<template>
<div class="weapon" :class="{ 'redbordered': desactivated }"
     @click="onClick"
     ref="tiltCard"
     data-tilt
     data-tilt-glare
     data-tilt-max-glare="0.2"
     data-tilt-scale="1">
    <img rel="preload" :src="weapon.imageUrl" class="weapon-image" alt="Game Card" />
    <AffinityIcon class="weapon-affinity" :affinity-id="weapon.affinity"/>
    <div class="weapon-text">
        <h2>{{ weapon.name }}</h2>
        <p class="weaponPower">{{ weapon.power }}<svg-icon :fa-icon="weaponIcon" :size="25"/></p>
        <p class="description">{{ weapon.description }}</p>
    </div>
</div>
</template>
<style scoped>
.weapon {
    display: grid;
    grid-template-rows: 12rem;
    grid-template-columns: 20rem 15rem;
    grid-template-areas: "image text";
    border-radius: 18px;
    color:white;
    box-shadow: 5px 5px 15px rgba(0,0,0,0.9);
    text-align: justify;
    cursor: pointer;
    margin:30px;
    transform-style: preserve-3d;
    transform: perspective(1000px);
    z-index: 1;
}

.weapon-image {
    grid-area: image;
    height: 100%;
    background-size: cover;
    background-position: center;
    border-radius: 18px 0 0 18px;
    transform-style: preserve-3d;
    transform: perspective(1000px) translateZ(-30px);
}

.weapon-text {
    grid-area: text;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    background-color: rgba(0,0,0,0.5);
    padding: 1rem;
    scale: 0.9;
    border-radius: 18px;
    backdrop-filter: blur(5px);
    transform-style: preserve-3d;
    transform: perspective(1000px) translateZ(30px);
    z-index: 2;
    margin-top: 0;
    font-weight: bolder;
    text-align: center;
}

.description {
    font-weight: bold;
    color: yellow;
    opacity: 0.6;
    text-shadow: black 0.1em 0.1em 0.2em;
    font-size:14px;
    line-height: 15px;
}

.weaponPower {
    font-size: 2rem;
    font-weight: bold;
    font-family: "Big John", sans-serif;
    color: black;
    filter: drop-shadow(0 0 4px var(--vt-c-red-2));
}

.weapon-affinity {
    position: absolute;
    top: -1rem;
    left: -1rem;
    z-index: 3;
    color: greenyellow;
    filter: drop-shadow(0 0 4px var(--vt-c-white-dark));
}

.redbordered {
    border: 2px solid red;
}

.redbordered:hover {
    cursor: not-allowed !important;
}

.redbordered img {
    filter: grayscale(100%);
    cursor: not-allowed !important;
}
</style>