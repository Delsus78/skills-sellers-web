<template>
    <div :class="['object-list','bg-dark-blur', containerClass]">
        <div class="Cards_header" v-show="title !== ''">
            <h1 class="DivTitle">{{ title }}</h1>
        </div>
        <div class="filter-controls" v-show="withFilters">
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
            <select v-model="competenceFilter">
                <option value="">Trier par compétence...</option>
                <option value="cuisine">Cuisine</option>
                <option value="charisme">Charisme</option>
                <option value="force">Force</option>
                <option value="exploration">Exploration</option>
                <option value="intelligence">Intelligence</option>
            </select>
        </div>

        <div v-if="isDroppedZone && list.length === 0" class="items-list plus">+</div>
        <draggable :model-value="filteredList" @update:model-value="updateList" class="items-list"
                   :class="{ dropZone: isDroppedZone, error: (maxCardAutorized !== -1 && list.length > maxCardAutorized) }"
                   group="list"
                   item-key="id"
                   :animation="300" >
            <template #item="{ element: carte }">
                <CardListElement :card="carte" />
            </template>
        </draggable>

    </div>
</template>

<script setup>
import draggable from 'vuedraggable';
import {computed, ref, watch} from "vue";
import CardListElement from "@/components/utilities/cards/CardListElement.vue";
import {useSettingsStore} from "@/stores";

const { title, objects, isDroppedZone, maxCardAutorized, withFilters, selectedAction } = defineProps({
    title: {
        type: String,
        required: true,
        default: 'Liste'
    },
    objects: {
        type: Array,
        default: () => []
    },
    isDroppedZone: {
        type: Boolean,
        default: false
    },
    maxCardAutorized: {
        type: Number,
        default: -1
    },
    withFilters: {
        type: Boolean,
        default: false
    },
    selectedAction: {
        type: String,
        required: false,
        default: ""
    }
});

const error = computed(() => {
    return maxCardAutorized !== -1 && list.length > maxCardAutorized;
});

const list = ref(objects);
const filtersStore = useSettingsStore();

// autres propriétés réactives pour les filtres
const searchText = ref(filtersStore.filters?.searchText ?? '');
const collectionFilter = ref(filtersStore.filters?.collectionFilter ?? '');
const rarityFilter = ref(filtersStore.filters?.rarityFilter ?? '');
const actionFilter = ref(filtersStore.filters?.actionFilter ?? '');
const competenceFilter = ref(filtersStore.filters?.competenceFilter ?? '');

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

    // save filters
    filtersStore.setFilters({
        searchText: searchText.value,
        collectionFilter: collectionFilter.value,
        rarityFilter: rarityFilter.value,
        actionFilter: actionFilter.value,
        competenceFilter: competenceFilter.value,
    });

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

const updateList = (newList) => {
    searchText.value = "";
    list.value = newList;
}

// TODO : afficher si la carte à une action ou non, et si oui, afficher son nom, et sa date de fin (tooltip)
const emit = defineEmits(['ResultedList']);

const containerClass = computed(() => {
    if (title === '' && !withFilters) {
        return 'no-title-no-filters';
    }
    return '';
});

watch(list, (newValue) => {
    emit('ResultedList', newValue);
});

watch(objects, (newValue) => {
    list.value = newValue;
});
</script>
<style scoped>
.object-list {
    display: grid;
    grid-template-rows: 4rem 10% 75% 5%;
    grid-template-areas: "title" "filters" "cards" "footer";
    margin: 3rem;
    border-radius: 1rem;
    box-shadow: 0 0 1rem 0.5rem rgba(0, 0, 0, 0.2);
    backdrop-filter: blur(5px);

    @media (max-width: 1023px) {
        margin: 0;
    }
}

.object-list.no-title-no-filters {
    grid-template-rows: 1fr;
    grid-template-areas: "cards";
    padding: 0;
    margin: 0;
}

.object-list.no-title-no-filters .items-list {
    margin: 0;
    grid-template-columns: 1fr;
    grid-template-areas: "cards";
    grid-auto-rows: min-content;
    overflow-y: hidden;
    height: 100%;
}

.Cards_header {
    grid-area: title;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 2rem;
}

.Cards_header .DivTitle {
    font-size: 150%;
    font-weight: bold;
}

.items-list {
    grid-area: cards;
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-auto-rows: min-content;
    column-gap: 1rem;
    row-gap: 1rem;
    margin: 0 2rem;
    overflow-y: auto;
    max-height: 40rem;

    @media (max-width: 1023px) {
        grid-template-columns: 1fr;
    }
}

.plus {
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 3rem;
    color: rgba(199, 175, 175, 0.35);
    cursor: pointer;
    height: 100%;
}

.dropZone {
    border: 1px dashed rgba(199, 175, 175, 0.35);
    border-radius: 0.5rem;
    background: rgba(199, 175, 175, 0.1);
    padding: 0.5rem;
    text-align: center;
    color: rgba(199, 175, 175, 0.35);
    font-size: 1.2rem;
    font-weight: bold;
    cursor: pointer;
}

.error {
    border: 1px dashed rgba(232, 23, 23, 0.35);
    border-radius: 0.5rem;
    background: rgba(217, 24, 24, 0.1);
    padding: 0.5rem;
    text-align: center;
    color: rgba(199, 175, 175, 0.35);
    font-size: 1.2rem;
    font-weight: bold;
    cursor: pointer;
}

.not_draggable {
    cursor: default;
    pointer-events: none;
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

.filter-controls select option {
    color: black;
}

.filter-controls select option:first-child {
    color: rgba(199, 175, 175, 0.35);
}
</style>
