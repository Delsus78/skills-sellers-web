<template>
    <div v-if="cards.length" class="cards">
         <Card v-for="card in cards"
               :key="card.id"
               :id="card.id"
               :name="card.name"
               :description="card.description"
               :image-url="card.imageUrl"
               :competences="card.competences"
               :rarity="card.rarity"/>
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
import { useRoute } from 'vue-router';
import { useCardsStore } from "@/stores";
import {storeToRefs} from "pinia";

const route = useRoute();
const userId = route.params.id;

const cardsStore = useCardsStore();
const { cards } = storeToRefs(cardsStore);
cardsStore.getAllCardsFromUser(userId);

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
}

</style>