<template>
    <div class="object-list bg-dark-blur">
        <div class="Cards_header">
            <h1 class="DivTitle">{{ title }}</h1>
        </div>
        <div v-if="isDroppedZone && list.length === 0" class="items-list plus">+</div>
        <draggable v-model="list" class="items-list"
                   :class="{ dropZone: isDroppedZone, error: (maxCardAutorized !== -1 && list.length > maxCardAutorized) }" group="list" item-key="id"
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

const { title, objects, isDroppedZone, maxCardAutorized } = defineProps({
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
    }
});

const error = computed(() => {
    return maxCardAutorized !== -1 && list.length > maxCardAutorized;
});

const list = ref(objects);
// TODO : ajouter des filtres pour trier les cartes
// TODO : ajouter un système de recherche



// TODO : afficher si la carte à une action ou non, et si oui, afficher son nom, et sa date de fin (tooltip)
const emit = defineEmits(['ResultedList']);

watch(list, (newValue) => {
    emit('ResultedList', newValue);
});
</script>
<style scoped>
.object-list {
    display: grid;
    grid-template-rows: 15% 80% 5%;
    grid-template-areas: "title" "cards" "footer";
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
</style>
