<script setup>
import {defineProps, onMounted, ref} from 'vue';

const { cosmeticId } = defineProps({
    cosmeticId: {
        type: Number,
        required: true
    }
});

const imagePath = ref('');

onMounted(() => {
    // Vite spécifique pour le chargement dynamique des images
    import(`../../../assets/images/cosmetics/${cosmeticId}.png`)
        .then((module) => {
            imagePath.value = module.default;
        })
        .catch((error) => {
            console.error("Failed to load image", error);
        });
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