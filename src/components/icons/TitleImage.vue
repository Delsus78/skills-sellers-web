<template>
    <div class="titleImg">
        <img :src="imageSrc" alt="Titre" />
    </div>
</template>

<script setup>
import { computed } from 'vue';
import img from '@/assets/images/SkillsSellers.png';
import imgInLined from '@/assets/images/SkillsSellersInLined.png';

const props = defineProps({
    inLine: {
        type: Boolean,
        default: false
    }
});

const imageSrc = computed(() => {
    return props.inLine ? imgInLined : img ;
});
</script>

<style scoped>
/* Vous pouvez ajouter des styles ici si nécessaire */
.titleImg {
    display: flex;
    justify-content: center;
    align-items: center;
    justify-self: center;
}

img {
    width: 100%;
    -webkit-filter: drop-shadow(0 0 20px #666666);
    filter: drop-shadow(0 0 20px #666666);
}
</style>
