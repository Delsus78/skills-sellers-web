<script setup>
import {faShield as satelliteIcon} from "@fortawesome/free-solid-svg-icons";
import ProgressBar from "@/components/utilities/progressBar.vue";
import {getClearRemainingTime, getPourcentageRemainingTime} from "@/components/utilities/DateFormator";
import {onBeforeMount, onUnmounted, ref} from "vue";
import AffinityIcon from "@/components/utilities/cards/weapons/AffinityIcon.vue";

const { cards, highlightFirstCard, withPower, withAffinity, withEndDate } = defineProps({
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
    withAffinity: {
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
                    <span :class="card.rarity + '-text'">{{ card.name }}</span>
                    <span v-if="withPower" class="meethicColored powerText">{{ card.power }} <svg-icon :fa-icon="satelliteIcon" :size="14"/></span>
                    <span v-if="withAffinity && card.weapon" class="affinityIcon"><AffinityIcon class="weapon-affinity" :affinity-id="card.weapon.affinity" :size="25"/></span>
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
    margin: 0 1rem;
}

.affinityIcon {
    margin: 0 0.5rem;
    z-index: 3;
    color: greenyellow;
    filter: drop-shadow(0 0 4px var(--vt-c-white-dark));
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