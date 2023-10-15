<script setup>

import {computed} from "vue";
const imagesImports = import.meta.glob('../../assets/images/*.png', {eager: true});

const { level, nomBatiment, infoSupp, direction, borderColor } = defineProps({
    level: {
        type: Number,
        required: true
    },
    nomBatiment: {
        type: String,
        required: true
    },
    infoSupp: {
        type: Object,
        required: false,
        default: {}
    },
    direction: {
        type: String,
        required: false,
        default: 'left'
    },
    borderColor: {
        type: String,
        required: false,
        default: 'black'
    }
});

const imageUrl = computed(() => {
    const imageName = nomBatiment.toLowerCase();
    const matchedPath = Object.keys(imagesImports).find(path =>
        path.includes(`${imageName}.png`)
    );
    return matchedPath ? imagesImports[matchedPath].default : '';
});

</script>
<template>
<div class="BatimentElement" :style="'border: 0.2rem dashed '+ borderColor +';'">
    <p class="BatimentElementName">{{nomBatiment}}</p>
    <div class="BatimentElementImage">
        <img :src="imageUrl" class="shadow-black"
             :alt="nomBatiment.toLowerCase()">
        <div v-for="(key, info) in infoSupp" :class="['BatimentElementInfo', direction]">
            <p>{{info}} : <strong>{{key}}</strong></p>
        </div>
    </div>

    <p v-if="nomBatiment !== 'LABO'" class="BatimentElementLevel">Niveau {{level}}</p>
</div>
</template>
<style scoped>
.BatimentElement {
    display: grid;
    grid-template-columns: 23rem;
    grid-template-rows: 2rem 18rem 2rem;
    grid-template-areas: "nomBatiment" "image" "stats";
    justify-items: center;
    width: 23rem;
    height: 23rem;
    border-radius: 10px;
    margin: 10px;
    backdrop-filter: blur(3px);
    transition: all 0.2s ease-in-out;
    box-shadow: 0 0 1rem black;
    z-index: 100;
}

.BatimentElementImage {
    grid-area: image;
    z-index: 101;
}

.BatimentElementImage img {
    transform: scale(0.6);
    width: 100%;
    height: 100%;
    z-index: 100;
}

.BatimentElementInfo {
    position: absolute;
    border-radius: 10px;
    padding: 0.8rem;
    margin: 5px;
    z-index: 100;
    background-color: rgba(0, 0, 0, 0.5);
}

strong {
    color: var(--vt-c-white);
}

.BatimentElementInfo.right {
    right: 0;
    transform: translate(120%, -400%);
}

.BatimentElementInfo.left {
    left: 0;
    transform: translate(-120%, -400%);
}

.BatimentElement:hover {
    cursor: pointer;
    transform: scale(1.1);
    box-shadow: 0 0 1rem var(--vt-c-white-dark);
}

.BatimentElementName {
    grid-area: nomBatiment;
    font-size: 1.5rem;
    font-weight: bold;
    text-shadow: 0 0 1rem var(--vt-c-white-dark);
}

.BatimentElementLevel {
    grid-area: stats;
    font-size: 1rem;
    font-weight: bold;
    text-shadow: 0 0 1rem var(--vt-c-white-dark);
}

</style>