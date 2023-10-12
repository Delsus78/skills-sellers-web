<template>
    <p v-if="Object.keys(cardInfo).length === 0" class="huge-text">Chargement de la carte...</p>
    <div v-else-if="cardInfo?.error">
        <p class="huge-text">ERREUR</p>
        <p class="huge-text">{{ cardInfo.error }}</p>
    </div>
    <div v-else-if="cardInfo.id" class="openingPage">
      <div class="radiance">
          <div v-for="i in 6" :key="i" :class="[cardInfo.rarity, 'ray']" :style="{ transform: 'rotate(' + (i * 30) + 'deg)' }"></div>
      </div>
      <ScratchEffect class="scratchEffect">
          <div class="content">
            <Card :key="cardInfo.id"
               :id="cardInfo.id"
               :name="cardInfo.name"
               :description="cardInfo.description"
               :image-url="cardInfo.imageUrl"
               :competences="cardInfo.competences"
               :rarity="cardInfo.rarity"
               :collection="cardInfo.collection"
               :action="cardInfo.action"/>
          </div>
      </ScratchEffect>
      <button class="validateOpening swipe-overlay-out" @click="router.push('/cards/');">Passer</button>
    </div>
</template>

<script setup>
import ScratchEffect from '@/components/utilities/ScratchEffect.vue';
import {onMounted, ref} from "vue";
import Card from "@/components/utilities/Card.vue";
import {router} from "@/helpers";

import {useActionsStore} from "@/stores";
const actionsStore = useActionsStore();
const cardInfo = ref({});

onMounted(async () => {
    cardInfo.value = await actionsStore.postOpenCard();
    if (cardInfo.value?.doublon) {
        await router.push('/upgrade');
    }
});

</script>

<style scoped>
.openingPage {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
    user-select: none;
}

.huge-text {
    font-size: 3rem;
    font-weight: bold;
    color: var(--vt-c-green-1);
    text-shadow: 0 0 1rem var(--vt-c-green-1);
    margin: 1rem;
    text-align: center;
    user-select: none;
}

.radiance {
    position: absolute;
    width: 230%;
    height: 230%;
    top: 50%;
    left: 51%;
    transform: translateX(-75%) rotate(0deg); /* rotation initiale ajoutée ici */
    pointer-events: none;
    z-index: 0;
}

@keyframes rotate {
    0% { transform: translateX(-75%) rotate(0deg); }
    100% { transform: translateX(-75%) rotate(360deg); }
}

.ray {
    position: absolute;
    width: 50%;
    height: 2rem;
    background-color: rgba(255, 255, 255, 0.5);
    left: 50%;
    transform-origin: 50% 0;
    animation: pulse 1.5s ease-in-out infinite;
}

@keyframes pulse {
    0%, 100% { opacity: 0.3; }
    50% { opacity: 1; }
}

.scratchEffect {
    width: 100%;
    height: 100%;
    position: relative;
    border-radius: 1rem;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    z-index: 2;
    box-shadow: black 0 0 3rem 3rem;
}


Card {
    width: 100%;
    height: 100%;
}

.validateOpening {
    transition: all 0.2s ease-in-out;
    z-index: 10;
    margin: 1rem;
}

.validateOpening:hover {
    transform: scale(1.2);
    color: var(--vt-c-green-1);
    filter: drop-shadow(0 0 4px var(--vt-c-green-1));
}

</style>
