<template>
    <div class="cardsWrapper">
        <div class="filter-controls" v-if="cards?.length">
            <input type="text" v-model="searchText" placeholder="Rechercher par nom..." />
            <input type="text" v-model="collectionFilter" placeholder="Filtrer par collection..." />
            <select v-model="rarityFilter">
                <option value="">Filtrer par rareté...</option>
                <option value="commune">Commune</option>
                <option value="epic">Épique</option>
                <option value="legendaire">Légendaire</option>
            </select>
            <select v-model="actionFilter">
                <option value="">Filtrer par action...</option>
                <option value="explorer">Explorer</option>
                <option value="cuisiner">Cuisiner</option>
                <option value="muscler">Muscler</option>
                <option value="reparer">Réparer</option>
                <option value="ameliorer">Améliorer</option>
                <option value="!">Ne fais rien</option>
            </select>
            <select v-model="endingDateFilter">
                <option value="">Trier par date ...</option>
                <option value="endingsoon">Fin proche</option>
            </select>
            <select v-model="competenceFilter">
                <option value="">Trier par compétence...</option>
                <option value="cuisine">Cuisine</option>
                <option value="charisme">Charisme</option>
                <option value="force">Force</option>
                <option value="exploration">Exploration</option>
                <option value="intelligence">Intelligence</option>
            </select>
            <a @click="resetFilters"><svg-icon :fa-icon="resetIcon" :size="30"/></a>
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
                      :isFavorite="favoritesIds.includes(card.id)"
                      @cancel-action="cancelAction" @switch-favorite="switchFavorite(card.id)"/>
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
import Card from "@/components/utilities/cards/Card.vue";
import {useCardsStore, useActionsStore, useSettingsStore, useMainStore} from "@/stores";
import {storeToRefs} from "pinia";
import {computed, onMounted, ref} from "vue";
import {faArrowRotateBackward as resetIcon} from "@fortawesome/free-solid-svg-icons";

const cardsStore = useCardsStore();
const filtersStore = useSettingsStore();
const actionsStore = useActionsStore();
const mainStore = useMainStore();
const { cards } = storeToRefs(cardsStore);
const { favoritesIds } = storeToRefs(mainStore);

const searchText = ref(filtersStore.filters?.searchText ?? '');
const collectionFilter = ref(filtersStore.filters?.collectionFilter ?? '');
const rarityFilter = ref(filtersStore.filters?.rarityFilter ?? '');
const actionFilter = ref(filtersStore.filters?.actionFilter ?? '');
const endingDateFilter = ref(filtersStore.filters?.endingDateFilter ?? '');
const competenceFilter = ref(filtersStore.filters?.competenceFilter ?? '');

const filteredList = computed(() => {
    let result = cards.value;
    if (searchText.value) {
        result = result.filter(item => item.name.toLowerCase().includes(searchText.value.toLowerCase()));
    }

    // based sort
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

    if (collectionFilter.value) {
        result = result.filter(item => item.collection.toLowerCase().includes(collectionFilter.value.toLowerCase()));
    }

    if (rarityFilter.value) {
        result = result.filter(item => item.rarity.toLowerCase().includes(rarityFilter.value.toLowerCase()));
    }

    if (actionFilter.value) {
        if (actionFilter.value === '!')
            result = result.filter(item => !item.action);
        else
            result = result.filter(item => item.action?.actionName.toLowerCase().includes(actionFilter.value.toLowerCase()));
    }

    if (competenceFilter.value) {
        result = result.sort((a, b) => {
            const aCompetence = a.competences[competenceFilter.value.toLowerCase()];
            const bCompetence = b.competences[competenceFilter.value.toLowerCase()];
            return bCompetence - aCompetence;
        });
    }

    if (endingDateFilter.value) {
        // fin proche
        if (endingDateFilter.value === 'endingsoon') {
            result = result.filter(item => item.action?.endTime);
            result = result.sort((a, b) => {
                const aDate = new Date(a.action?.endTime) - new Date();
                const bDate = new Date(b.action?.endTime) - new Date();
                return aDate - bDate;
            });
        }
    }

    // save filters
    filtersStore.setFilters({
        searchText: searchText.value,
        collectionFilter: collectionFilter.value,
        rarityFilter: rarityFilter.value,
        actionFilter: actionFilter.value,
        endingDateFilter: endingDateFilter.value,
        competenceFilter: competenceFilter.value,
    });

    // sort favorites first
    result.sort((a, b) => {
        if (favoritesIds.value.includes(a.id) && !favoritesIds.value.includes(b.id)) {
            return -1;
        } else if (!favoritesIds.value.includes(a.id) && favoritesIds.value.includes(b.id)) {
            return 1;
        } else {
            return 0;
        }
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

const switchFavorite = async (cardId) => {
    if (favoritesIds.value.includes(cardId)) {
        await mainStore.removeFavoriteId(cardId);
    } else {
        await mainStore.addFavoriteId(cardId);
    }
}

const resetFilters = () => {
    searchText.value = '';
    collectionFilter.value = '';
    rarityFilter.value = '';
    actionFilter.value = '';
    endingDateFilter.value = '';
    competenceFilter.value = '';

    filtersStore.setFilters({
        searchText: '',
        collectionFilter: '',
        rarityFilter: '',
        actionFilter: '',
        endingDateFilter: '',
        competenceFilter: '',
    });
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

.filter-controls select {
    width: 100%;
    height: 2rem;
    padding: 0.1rem;
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

.filter-controls svg:hover {
    cursor: pointer;
    color: rgba(199, 175, 175, 0.35);
    scale: 1.1;
}

.filter-controls select option {
    color: black;
}

.filter-controls select option:first-child {
    color: rgba(199, 175, 175, 0.35);
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