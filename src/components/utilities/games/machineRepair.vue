<script setup>

import {useCardsStore, useGamesStore, useMainStore, useUsersStore} from "@/stores";
import {storeToRefs} from "pinia";
import {
    faCoins as moneyIcon,
    faCubesStacked as creatiumIcon
} from "@fortawesome/free-solid-svg-icons";
import {ref, watch} from "vue";
import ListSelector from "@/components/utilities/cards/CardListSelector.vue";
import GearsBackground from "@/components/utilities/GearsBackground.vue";

const mainStore = useMainStore();
const cardsStore = useCardsStore();
const gamesStore = useGamesStore();
const usersStore = useUsersStore();

const { gameResponse, gameEstimation, game } = storeToRefs(gamesStore);
const { cards } = storeToRefs(cardsStore);
const { actualUser } = storeToRefs(usersStore);

const selectedCards = ref([]);

mainStore.changeBackgroundColor("#000000");
const emit = defineEmits(["estimate", "play"]);

const changeSelectedCardsIds = (newSelectedCards) => {
    selectedCards.value = newSelectedCards;

    let ids = [];
    if (selectedCards.value !== null && selectedCards.value.length > 0) {
        ids = selectedCards.value;
    }

    emit("estimate", 'MACHINE', 0, ids);
}

const start = () => {
    if (!game?.isRepairing) {
        let ids = [];
        if (selectedCards.value !== null && selectedCards.value.length > 0) {
            ids = selectedCards.value;
        }
        emit("play", 'MACHINE', 0, ids);

        setTimeout(() => {
            cardsStore.getAllCardsFromUser(actualUser.value.id);
        }, 1000);

        gameResponse.value = {};
    }
}

const selectAllCardsWithIntelligenceAndNoAction = () => {
    cards.value.forEach(card => {
        if (card.competences.intelligence > 0 && card.action === null) {
            selectedCards.value.push(card.id);
        }
    })
    emit("estimate", 'MACHINE', 0, selectedCards.value);
}

watch(gameResponse, () => {
    if (gameResponse.value.error || gameResponse.value.loading) return;
    // reset game
    gamesStore.getGameDay();
})

watch(cards, () => {
    gamesStore.getGameDay();
})

</script>

<template>
    <div class="machineRepair">
        <div v-if="cards.loading">
            <p class="huge-text">Chargement des cartes...</p>
        </div>
        <div v-else-if="gameResponse?.loading">
            <p class="huge-text">Chargement du jeu...</p>
        </div>
        <div v-else-if="game?.isRepairing" class="machineIsRepairing">
            <p class="huge-text">La machine est en train d'être réparée...</p>
        </div>
        <div v-else class="machineRepair_content">
            <div class="titleDiv">
                <div class="title">E. Zeiss - The Scientist</div>
                <div class="subTitle">Machine broken edition</div>
                <div class="description bg-dark-blur">
                    {{ game.description }}
                </div>
            </div>
            <ListSelector :cards="cards" v-if="!game?.isRepairing"
                          withFilters
                          selected-action="reparer"
                          :init-selected-cards-ids="selectedCards"
                          @resulted-list="changeSelectedCardsIds" />
            <div class="form_content">
                <div class="validate">
                    <div class="buttons" v-if="!game?.isRepairing">
                        <button class="btn btn-primary" @click="start">Construire</button>
                        <button class="btn btn-primary" @click="selectAllCardsWithIntelligenceAndNoAction"
                                v-tooltip:bottom.tooltip="'Sélectionne les cartes sans action et avec au moins 1 d\'intel'">
                            Selection rapide
                        </button>
                    </div>
                    <div v-if="!game?.isRepairing">
                        <p class="description shadow-white">Chances : {{ gameEstimation?.gains?.chances }}</p>
                    </div>
                    <div class="prices">
                        <div class="or">
                            {{ game.orPrice }}
                            <svg-icon :fa-icon="moneyIcon" class="money_icon" :size="40"/>
                        </div>
                        <div class="creatium">
                            {{ game.creatiumPrice }}
                            <svg-icon :fa-icon="creatiumIcon" class="creatium_icon" :size="40"/>
                        </div>
                    </div>
                    <div v-if="gameEstimation.error || gameResponse.error">
                        <p class="error shadow-white">{{ gameEstimation.error }} {{ gameResponse.error }}</p>
                    </div>
                </div>
                <GearsBackground class="gearsBG"/>
            </div>
        </div>
    </div>
</template>

<style scoped>
.machineRepair_content {
    margin-top: 5rem;
    min-height: 80rem;
}

.titleDiv {
    grid-column: 1/ -1;
}

.title {
    display: flex;
    justify-content: center;
    align-items: center;
    font-weight: normal;
    font-size: 4.5em;
    text-align: center;
    font-family: "Big John", sans-serif;

    /* Fallback: Set a background color. */
    background-color: red;

    /* Create the gradient. */
    background-image: linear-gradient(45deg, #859bc5, #58d07a);

    /* Set the background size and repeat properties. */
    background-size: 100%;
    background-repeat: repeat;

    /* Use the text as a mask for the background. */
    /* This will show the gradient as a text color rather than element bg. */
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    -moz-background-clip: text;
    -moz-text-fill-color: transparent;
}

.subTitle {
    display: flex;
    justify-content: center;
    align-items: flex-end;
    font-weight: normal;
    font-size: 1.5em;
    text-align: center;
    font-family: "Big John", sans-serif;
    margin-bottom: 1rem;
}

.form_content {
    position: fixed;
    padding: 2rem;
    bottom: 5rem;
    right: 0;
    z-index: 100;
    height: 20rem;
    width: 40rem;
    gap: 10px;
    border-radius: 1rem;
    background: radial-gradient(ellipse farthest-corner at right bottom, #d9d8d2 0%, #6f7696 8%, #918e8d 30%, #9b8c88 40%, transparent 80%),
    radial-gradient(ellipse farthest-corner at left top, #FFFFFF 0%, #7e7e7e 8%, #60705e 25%, #696364 62.5%, #5d4a1f 100%);
    box-shadow: 0 0 1rem 0 rgba(0, 0, 0, 0.9);
    opacity: 0.9;

    @media (max-width: 1023px) {
        right: 0;
        scale: 0.8;
        bottom: 0;
        opacity: 1;
    }
}

.buttons {
    display: flex;
    justify-content: space-between;
    gap: 2rem;
    align-items: center;
}

.btn {
    padding: 0.5rem 1rem;
}

.large {
    height: 30rem;
    width: 100%;
    bottom: 0;
    right: 0;
    padding: 3rem;
    gap: 20px;
    scale: 0.8;
    opacity: 1;
}

.gearsBG {
    position: absolute;
    top: 0;
    opacity: 0.5;
    filter: drop-shadow(0 0 0.3rem rgba(0, 0, 0, 0.9));
    z-index: -1;
    height: 100%;
    width: 100%;
    pointer-events: none;
}

.description {
    border-radius: 1rem;
    padding: 1rem;
    font-size: 1.2em;
    font-family: 'Ubuntu', sans-serif;
    color: white;
    text-align: center;
    font-weight: bold;
    text-shadow: 0 0 1rem rgba(0, 0, 0, 0.9);
}

.prices {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.prices .or,.creatium {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 1rem;
    filter: drop-shadow(0 0 0.3rem rgba(0, 0, 0, 0.9));
    border-radius: 1rem;
    margin: 2rem;
    padding: 1rem;
    font-size: 1.8em;
    font-family: 'Big John', sans-serif;
    box-shadow: 0 0 1rem 0 rgba(0, 0, 0, 0.9);
}

.prices .or {
    color: gold;
}

.prices .creatium {
    color: #9ab0ff;
}

::v-deep(.selected_cardList .items-list) {
    height: 20rem;
}

.validate {
    justify-content: center;
    align-items: center;
    flex-direction: column;
    gap: 1rem;
    margin-top: 2rem;
}

.validate button {
    border-radius: 1rem;
    border: none;
    padding: 1rem;
    width: 80%;
    margin: 0 auto;

    font-size: 1.2em;
    font-family: 'Big John', sans-serif;
    color: gold;
    background: rgba(0, 0, 0, 0.5);
    box-shadow: 0 0 1rem 0 rgba(0, 0, 0, 0.9);
}

.validate button:hover {
    background: rgba(0, 0, 0, 0.7);
}

.validate button:disabled {
    background: rgba(0, 0, 0, 0.5);
    color: rgba(255, 255, 255, 0.5);
    cursor: not-allowed !important;
}

.error {
    font-size: 1em;
    text-align: center;
    color: darkred;

    @media (max-width: 1023px) {
        font-size: 0.8em;
    }
}
</style>