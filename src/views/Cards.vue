<template>
    <div v-if="cards.length" class="cards">
         <Card v-for="card in cards"
               :key="card.id"
               :id="card.id"
               :name="card.name"
               :description="card.description"
               :image-url="card.imageUrl"
               :competences="card.competences"
               :rarity="card.rarity"
               :collection="card.collection"
               :action="card.action"
               @cancel-action="cancelAction"/>
    </div>
    <div v-if="cards.loading">
        <p class="huge-text">Chargement des cartes...</p>
    </div>
    <div v-if="cards.error">
        <p class="huge-text">Erreur lors du chargement des cartes</p>
    </div>

</template>
<script setup>
import Card from "@/components/utilities/Card.vue";
import { useCardsStore, useActionsStore } from "@/stores";
import {storeToRefs} from "pinia";
import {onMounted} from "vue";

const cardsStore = useCardsStore();
const actionsStore = useActionsStore();
const { cards } = storeToRefs(cardsStore);

onMounted(() => {
    // sort cards by id
    if (cards.value && !cards.value.loading && !cards.value.error) {
        cards.value.sort((a, b) => a.id - b.id);
    }
});

const cancelAction = async (cardId) => {
    await actionsStore.deleteAction(cardId);
}

</script>
<style scoped>
.cards {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    margin-top: 8rem;
}

</style>