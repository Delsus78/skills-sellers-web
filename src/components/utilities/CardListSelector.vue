<template>
    <div class="object-list bg-dark-blur">
        <div class="Cards_header">
            <h1 class="DivTitle">{{ title }}</h1>
        </div>
        <div class="filter-controls" v-if="withFilters">
            <input type="text" v-model="searchText" placeholder="Rechercher..." />
        </div>

        <div v-if="isDroppedZone && list.length === 0" class="items-list plus">+</div>
        <draggable :model-value="filteredList"  @update:model-value="updateList" class="items-list"
                   :class="{ dropZone: isDroppedZone, error: (maxCardAutorized !== -1 && list.length > maxCardAutorized) }"
                   group="list"
                   item-key="id"
                   :animation="300" >
            <template #item="{ element: carte }">
                <CardListElement :card="carte" :class="{ not_draggable: carte.action}"/>
            </template>
        </draggable>

    </div>
</template>

<script setup>
import draggable from 'vuedraggable';
import {computed, ref, watch} from "vue";
import CardListElement from "@/components/utilities/CardListElement.vue";

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

const searchText = ref('');
// autres propriétés réactives pour les filtres

const filteredList = computed(() => {
    let result = list.value;
    if (searchText.value) {
        result = result.filter(item => item.name.toLowerCase().includes(searchText.value.toLowerCase()));
    }
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

    return result;
});

// convertir l'action selectionnée en l'équivallent dans la liste des compétences
const selectedActionCompetence = computed(() => {
    switch (selectedAction) {
        case "cuisiner":
            return "cuisine";
        case "ameliorer":
            return "intelligence";
        case "explorer":
            return "exploration";
        case "muscler":
            return "force";
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

watch(list, (newValue) => {
    emit('ResultedList', newValue);
});
</script>
<style scoped>
.object-list {
    display: grid;
    grid-template-rows: 10% 10% 75% 5%;
    grid-template-areas: "title" "filters" "cards" "footer";
    margin: 3rem;
    border-radius: 1rem;
    box-shadow: 0 0 1rem 0.5rem rgba(0, 0, 0, 0.2);
    backdrop-filter: blur(5px);
}

.Cards_header {
    grid-area: title;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.items-list {
    grid-area: cards;
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-auto-rows: min-content;
    column-gap: 1rem;
    margin: 0 2rem;
    overflow-y: auto;
    max-height: 40rem;
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
</style>
