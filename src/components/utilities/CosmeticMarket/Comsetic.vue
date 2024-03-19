<script setup>
import {computed, defineProps, onBeforeMount, ref} from 'vue';
const imagesImports = import.meta.glob('../../../assets/images/cosmetics/*.png', {eager: true});

const { cosmeticId } = defineProps({
    cosmeticId: {
        type: Number,
        required: true
    }
});

const imagePath = computed(() => {
    const matchedPath = Object.keys(imagesImports).find(path =>
        path.includes(`${cosmeticId}.png`)
    );
    return matchedPath ? imagesImports[matchedPath].default : '';
});

</script>
<template>
<div class="cosmetic">
    <img :src="imagePath" alt="" class="cosmetic-image"/>
</div>
</template>
<style scoped>
.cosmetic-image {
    height: 100%;
}
</style>