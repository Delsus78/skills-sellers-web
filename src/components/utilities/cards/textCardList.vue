<script setup>
import {faShield as satelliteIcon} from "@fortawesome/free-solid-svg-icons";
import ProgressBar from "@/components/utilities/progressBar.vue";
import {getClearRemainingTime, getPourcentageRemainingTime} from "@/components/utilities/DateFormator";
import {onBeforeMount, onUnmounted, ref} from "vue";

const { cards, highlightFirstCard, withPower, withEndDate } = defineProps({
    cards: {
        type: Array,
        required: true,
        default: () => []
    },
    highlightFirstCard: {
        type: Boolean,
        required: false,
        default: false
    },
    withPower: {
        type: Boolean,
        required: false,
        default: false
    },
    withEndDate: {
        type: Boolean,
        required: false,
        default: false
    }
});

let intervalId;
const clearRemainingTimeForCards = ref({});
const pourcentageRemainingTimeForCards = ref({});

onBeforeMount(() => {
    intervalId = setInterval(updateDates, 1000);
});
onUnmounted(() => {
    if (intervalId) clearInterval(intervalId);
});

function updateDates() {
    cards.forEach(card => {
        if (!card.action) return;
        clearRemainingTimeForCards.value[card.id] = getClearRemainingTime(card.action?.endTime);
        pourcentageRemainingTimeForCards.value[card.id] = getPourcentageRemainingTime(card.action?.endTime, card.action?.createdAt);
    });
}

</script>

<template>
    <ul class="cards_list">
        <li v-for="(card, index) in cards" :key="card.id" class="cardsListItem" :class="{'firstCard': index === 0 && highlightFirstCard}">
            <span class="cardRow">
                <span>
                    <span :class="card.rarity + '-text'">{{ card.name }}</span>
                    <span v-if="withPower" class="meethicColored powerText">{{ card.competences.power }} <svg-icon :fa-icon="satelliteIcon" :size="14"/></span>
                </span>
                <progress-bar v-if="withEndDate && card.action" class="progressBar"
                    :pourcentage="pourcentageRemainingTimeForCards[card.id]"
                    :text="clearRemainingTimeForCards[card.id]"/>
            </span>
        </li>
    </ul>
</template>

<style scoped>
.cards_list {
    grid-area: stats;
    overflow-y: auto;
    max-height: 30rem;
    width: 100%;
    padding: 0;
    margin: 0;
    list-style: none;
}
.cardRow {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
}

.powerText {
    font-size: 1.2rem;
    font-weight: 800;
    margin-left: 1rem;
}

.progressBar {
    max-width: 14rem;
}

.cardsListItem {
    display: grid;
    border-bottom: 1px solid rgba(199, 175, 175, 0.35);
    width: 100%;
    align-items: center;
    font-size: 1.5rem;
}

.firstCard {
    font-size: 1.8rem;
    background-color: var(--vt-c-green-1);
    border-radius: 1rem;
    padding-left: 0.5rem;
}

</style>