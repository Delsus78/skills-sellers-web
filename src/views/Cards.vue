<template>
    <div class="cardsWrapper">
        <div class="filter-controls" v-if="cards?.length">
            <input type="text" v-model="searchText" placeholder="Rechercher..." />
        </div>
        <div v-if="cards.length" class="cards">
            <div class="card" v-for="card in filteredList">
                <Card :key="card.id"
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

        </div>
        <div v-if="cards.loading">
            <p class="huge-text">Chargement des cartes...</p>
        </div>
        <div v-if="cards.error">
            <p class="huge-text">Erreur lors du chargement des cartes</p>
        </div>

    </div>
</template>
<script setup>
import Card from "@/components/utilities/Card.vue";
import { useCardsStore, useActionsStore } from "@/stores";
import {storeToRefs} from "pinia";
import {computed, onMounted, ref} from "vue";

const cardsStore = useCardsStore();
const actionsStore = useActionsStore();
const { cards } = storeToRefs(cardsStore);

const searchText = ref('');
const filteredList = computed(() => {
    let result = cards.value;
    if (searchText.value) {
        result = result.filter(item => item.name.toLowerCase().includes(searchText.value.toLowerCase()));
    }

    // sort by competences sum
    result.sort((a, b) => {
        const aSum =
            a.competences.intelligence +
            a.competences.force +
            a.competences.charisme +
            a.competences.cuisine +
            a.competences.exploration;
        const bSum =
            b.competences.intelligence +
            b.competences.force +
            b.competences.charisme +
            b.competences.cuisine +
            b.competences.exploration;
        return bSum - aSum;
    });
    return result;
});

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
.cardsWrapper {
    margin: 8rem auto 0 auto;
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    height: 100%;
}
.filter-controls {
    grid-area: filters;
    display: flex;
    justify-content: space-between;
    margin-bottom: 1rem;
    margin-left: 2rem;
    margin-right: 2rem;
}

.filter-controls input {
    width: 100%;
    height: 2rem;
    padding: 0.5rem;
    border-radius: 0.5rem;
    border: none;
    outline: none;
    font-size: 1.2rem;
    font-weight: bold;
    color: rgba(199, 175, 175, 0.35);
    background: rgba(199, 175, 175, 0.1);
    box-shadow: 0 0 1rem 0.5rem rgba(0, 0, 0, 0.2);
    backdrop-filter: blur(5px);
}

.cards {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 16px;
    justify-content: center;
    align-items: center;

    @media (max-width: 1910px) {
        grid-template-columns: repeat(3, 1fr);
    }

    @media (max-width: 1023px) {
        grid-template-columns: repeat(2, 1fr);
    }

    @media (max-width: 740px) {
        grid-template-columns: 1fr;
    }
}

.cards .card {
    display: flex;
    justify-content: center;
}

</style>