<script setup>

const imagesImports = import.meta.glob('../../../assets/images/cards/*.png', {eager: true});
import {computed, defineProps} from "vue";

const { name, color, isVisible } = defineProps({
    name: {
        type: String
    },
    color: {
        type: Number
    },
    isVisible: {
        type: Boolean,
        default: true
    }
});

const imagePath = computed(() => {
    if (!isVisible || !name)
        return imagesImports['../../../assets/images/cards/card_back.png'].default;

    const matchedPath = Object.keys(imagesImports).find(path =>
        path.endsWith(`/${name.toLowerCase() + '_' + color}.png`)
    );

    // if no image found, return 'card_back'
    return matchedPath ? imagesImports[matchedPath].default : imagesImports['../../../assets/images/cards/card_back.png'].default;
});


</script>
<template>
    <div class="bjCard">
        <img :src="imagePath" alt="" class="bjCard-image"/>
    </div>
</template>
<style scoped>
.bjCard-image {
    height: 100%;
}

.bjCard {
    height: 8rem;
    width: 5rem;
}

.bjCard:hover {
    transform: scale(1.1);
    transition: all 0.1s;
}
</style>