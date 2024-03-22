<template>
    <div class="cardsWrapper">
        <div class="Cards_header" v-if="title !== ''">
            <h1 class="DivTitle">{{ title }}</h1>
        </div>
        <div class="filter-controls" v-show="withFilters">
            <a @click="resetFilters"><svg-icon :fa-icon="resetIcon" :size="30"/></a>
            <input type="text" v-model="searchText" placeholder="Rechercher par nom..." />
            <input type="text" v-model="collectionFilter" placeholder="Filtrer par collection..." />
            <select v-model="rarityFilter">
                <option value="">Filtrer par rareté...</option>
                <option value="commune">Commune</option>
                <option value="epic">Épique</option>
                <option value="legendaire">Légendaire</option>
                <option value="legendaire">Meethic</option>
            </select>
            <select v-model="actionFilter">
                <option value="">Filtrer par action...</option>
                <option value="explorer">Explorer</option>
                <option value="cuisiner">Cuisiner</option>
                <option value="muscler">Muscler</option>
                <option value="guerre">Guerre</option>
                <option value="reparer">Réparer</option>
                <option value="ameliorer">Améliorer</option>
                <option value="!">Ne fais rien</option>
            </select>
            <select v-model="otherFilter">
                <option value="">Autres filtre ...</option>
                <option value="endingsoon">Fin proche</option>
                <option value="hasweapon">Possède une arme</option>
            </select>
            <select v-model="competenceFilter">
                <option value="">Trier par compétence...</option>
                <option value="cuisine">Cuisine</option>
                <option value="charisme">Charisme</option>
                <option value="force">Force</option>
                <option value="exploration">Exploration</option>
                <option value="intelligence">Intelligence</option>
            </select>
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
                      :weapon="card.weapon"
                      :power="card.power"
                      :isFavorite="favoritesIds.includes(card.id)"
                      :isSelected="selectedCardsIds.includes(card.id)"
                      show-selection
                      @onClick="selectCard(card.id)"/>
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
import {computed, onMounted, ref, watch} from "vue";
import {faArrowRotateBackward as resetIcon} from "@fortawesome/free-solid-svg-icons";
import Card from "@/components/utilities/cards/Card.vue";
import {storeToRefs} from "pinia";
import {useMainStore} from "@/stores";
import {toast} from "vue3-toastify";
const mainStore = useMainStore();
const { favoritesIds } = storeToRefs(mainStore);

const { title, cards, initSelectedCardsIds, withFilters, selectedAction, maxCardAutorized, removedStatsAt10 } = defineProps({
    title: {
        type: String,
        required: false,
        default: ""
    },
    cards: {
        type: Array,
        default: () => []
    },
    maxCardAutorized: {
        type: Number,
        required: false,
        default: -1
    },
    initSelectedCardsIds: {
        type: Array,
        required: false,
        default: () => []
    },
    withFilters: {
        type: Boolean,
        default: false
    },
    selectedAction: {
        type: String,
        required: false,
        default: ""
    },
    removedStatsAt10: {
        type: Array,
        required: false,
        default: () => []
    }
});

// autres propriétés réactives pour les filtres
const searchText = ref('');
const collectionFilter = ref('');
const rarityFilter = ref('');
const actionFilter = ref('!');
const otherFilter = ref(selectedAction === "guerre" ? 'hasweapon' : '');
const competenceFilter = ref('');

const selectedCardsIds = ref(initSelectedCardsIds ?? []);
const list = ref(cards);
const filteredList = computed(() => {
    let result = list.value;
    if (searchText.value) {
        result = result.filter(item => item.name.toLowerCase().includes(searchText.value.toLowerCase()));
    }

    // based sort
    // sort by competences sum
    if (selectedAction) {

        // appliquer d'autres filtres ici
        // trier la liste ici par la competence la plus haute selon l'action selectionnée
        if (selectedActionCompetence.value !== "") {
            result = result.sort((a, b) => {
                if (a.competences[selectedActionCompetence.value] > b.competences[selectedActionCompetence.value]) {
                    return -1;
                }
                if (a.competences[selectedActionCompetence.value] < b.competences[selectedActionCompetence.value]) {
                    return 1;
                }
                return 0;
            });
        }
    }

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

    if (otherFilter.value) {
        // fin proche
        if (otherFilter.value === 'endingsoon') {
            result = result.filter(item => item.action?.endTime);
            result = result.sort((a, b) => {
                const aDate = new Date(a.action?.endTime) - new Date();
                const bDate = new Date(b.action?.endTime) - new Date();
                return aDate - bDate;
            });
        }

        if (otherFilter.value === 'hasweapon') {
            result = result.filter(item => item.weapon);
        }
    }

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

    // sort selected cards first
    result.sort((a, b) => {
        if (selectedCardsIds.value.includes(a.id) && !selectedCardsIds.value.includes(b.id)) {
            return -1;
        } else if (!selectedCardsIds.value.includes(a.id) && selectedCardsIds.value.includes(b.id)) {
            return 1;
        } else {
            return 0;
        }
    });

    // removedStatsAt10
    if (removedStatsAt10.length > 0) {
        result = result.filter(item => {
            let isOk = true;
            removedStatsAt10.forEach(pairStatVal => {
                if (item.competences[pairStatVal.name] >= pairStatVal.value) {
                    isOk = false;
                }
            });
            return isOk;
        });
    }

    return result;
});

// convertir l'action selectionnée en l'équivallent dans la liste des compétences
const selectedActionCompetence = computed(() => {
    switch (selectedAction) {
        case "cuisiner":
            return "cuisine";
        case "ameliorer":
        case "reparer":
            return "intelligence";
        case "explorer":
            return "exploration";
        case "muscler":
            return "force";
        case "casino":
            return "charisme";
        case "charisme":
            return "charisme";
        case "intelligence":
            return "intelligence";
        case "exploration":
            return "exploration";
        case "force":
            return "force";
        case "cuisine":
            return "cuisine";
        default:
            return "";
    }
});

const resetFilters = () => {
    searchText.value = '';
    collectionFilter.value = '';
    rarityFilter.value = '';
    actionFilter.value = '';
    competenceFilter.value = '';
}

// TODO : afficher si la carte à une action ou non, et si oui, afficher son nom, et sa date de fin (tooltip)
const emit = defineEmits(['ResultedList']);

watch(cards, (newValue) => {
    list.value = newValue;
});

function selectCard(cardId) {


    if (selectedCardsIds.value.includes(cardId)) {
        selectedCardsIds.value = selectedCardsIds.value.filter(id => id !== cardId);
    }
    else if (maxCardAutorized > 0 && selectedCardsIds.value.length >= maxCardAutorized) {
            // afficher un message d'erreur
            toast.error("Vous ne pouvez selectionner que <strong>" + maxCardAutorized + "</strong> cartes", {
                dangerouslyHTMLString: true,
            });

            return;
        } else selectedCardsIds.value.push(cardId);

    emit('ResultedList', selectedCardsIds.value);
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
    width: 80%;
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
    margin-top: 2rem;

    @media (max-width: 1910px) {
        grid-template-columns: repeat(3, 1fr);
    }

    @media (max-width: 1023px) {
        grid-template-columns: repeat(3, 0.4fr);
        gap: 0;
        grid-auto-rows: 30rem;
    }

    @media (max-width: 740px) {
        grid-template-columns: repeat(2, 13rem);
        gap: 0;
        grid-auto-rows: 30rem;
    }
}

.cards .card {
    display: flex;
    justify-content: center;

    @media (max-width: 1023px) {
        scale: 0.8;
    }

    @media (max-width: 740px) {
        scale: 0.6;
    }
}


</style>
