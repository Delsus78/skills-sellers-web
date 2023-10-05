<script setup>
const { level, nomBatiment } = defineProps({
    level: {
        type: Number,
        required: true
    },
    nomBatiment: {
        type: String,
        required: true
    },

});
</script>
<template>
<div class="BatimentElement">
    <p class="BatimentElementName">{{nomBatiment}}</p>
    <img src="../../assets/images/maison.png" alt="maison" class="BatimentElementImage">
    <p class="BatimentElementLevel">Niveau {{level}}</p>
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
    border: 0.2rem dashed #000;
    border-radius: 10px;
    margin: 10px;
    backdrop-filter: blur(3px);
    transition: all 0.2s ease-in-out;
    box-shadow: 0 0 1rem black;
    z-index: 100;
}

.BatimentElementImage {
    grid-area: image;
    transform: scale(0.6);
    width: 100%;
    height: 100%;
    z-index: 100;
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