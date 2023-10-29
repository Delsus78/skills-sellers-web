<script setup>

import {useCardsStore, useGamesStore, useMainStore, useUsersStore} from "@/stores";
import {storeToRefs} from "pinia";
import {faCoins as moneyIcon} from "@fortawesome/free-solid-svg-icons";
import {ref, watch} from "vue";
import ListSelector from "@/components/utilities/CardListSelector.vue";
import GearsBackground from "@/components/utilities/GearsBackground.vue";
import InfoBulle from "@/components/utilities/InfoBulle.vue";

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
        ids = selectedCards.value.map((card) => card.id);
    }

    emit("estimate", 'MACHINE', 0, ids);
}

const playOrRepair = () => {
    if (actualUser.value.statRepairedObjectMachine === -1) {
        let ids = [];
        if (selectedCards.value !== null && selectedCards.value.length > 0) {
            ids = selectedCards.value.map((card) => card.id);
        }
        emit("play", 'MACHINE', 0, ids);
    } else if (actualUser.value.statRepairedObjectMachine === 0) {
        emit("play", 'MACHINE', 500, []);
    } else if (actualUser.value.statRepairedObjectMachine > 0){
        emit("play", 'MACHINE', 1000, []);
    }
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
        <div v-else-if="game?.isRepairing" class="machineIsRepairing">
            <p class="huge-text">La machine est en train d'être réparée...</p>
        </div>
        <div v-else class="machineRepair_content">
            <div class="titleDiv">
                <div class="title">E. Zeiss - The Scientist</div>
                <div class="subTitle">Machine broken edition</div>
            </div>
            <ListSelector v-if="actualUser.statRepairedObjectMachine === -1"
                          class="cardsList" :objects="cards" title="Cartes"
                          withFilters selected-action="reparer"/>
            <div class="form_content" :class="{'large': actualUser.statRepairedObjectMachine > -1}">

                <div class="description bg-dark-blur">
                    <info-bulle>
                        <p v-for="(r1, r2) in game.regles">
                            {{ r2 }}  {{ r1 }}
                        </p>
                    </info-bulle>
                    {{ game.description }}
                </div>
                <div class="validate">
                    <button class="btn btn-primary" @click="playOrRepair">Valider</button>
                    <div class="input_gold" v-if="actualUser.statRepairedObjectMachine > -1">
                        {{ actualUser.statRepairedObjectMachine === 0 ? '500' : '1000'}}
                        <svg-icon :fa-icon="moneyIcon" class="money_icon" :size="40"/>
                    </div>
                    <div v-if="gameEstimation.error || gameResponse.error">
                        <p class="error shadow-white">{{ gameEstimation.error }} {{ gameResponse.error }}</p>
                    </div>
                    <div v-if="actualUser.statRepairedObjectMachine === -1">
                        <p class="description shadow-white">Chances : {{  gameEstimation?.chances?.toFixed(2) }} %</p>
                    </div>
                    <div v-else>
                        <p class="description shadow-white">Pour gagner un pack !</p>
                    </div>
                </div>
                <div class="selected_cards" v-if="actualUser.statRepairedObjectMachine === -1">
                    <ListSelector class="selected_cardList" :objects="selectedCards" title="Cartes selectionnees"
                                  @resulted-list="changeSelectedCardsIds" is-dropped-zone/>
                </div>
                <GearsBackground class="gearsBG" v-if="actualUser.statRepairedObjectMachine > -1"/>
            </div>
        </div>
    </div>
</template>

<style scoped>
.machineRepair_content {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-template-rows: 9rem 44rem;
    grid-gap: 1rem;
    padding: 4rem;
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

.cardsList {
    z-index: 100;
    margin: 0 !important;
}

.form_content {
    z-index: 100;
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: 0.6fr 1fr;
    gap: 10px;
    border-radius: 1rem;
    padding: 1rem;
    background: radial-gradient(ellipse farthest-corner at right bottom, #d9d8d2 0%, #6f7696 8%, #918e8d 30%, #9b8c88 40%, transparent 80%),
    radial-gradient(ellipse farthest-corner at left top, #FFFFFF 0%, #7e7e7e 8%, #60705e 25%, #696364 62.5%, #5d4a1f 100%);
    box-shadow: 0 0 1rem 0 rgba(0, 0, 0, 0.9);
    overflow-y: hidden;
}

.large {
    grid-column: 1/ -1;
}

.gearsBG {
    grid-column: 1/ -1;
    grid-row: 2;
    z-index: -10;
    opacity: 0.5;
    filter: drop-shadow(0 0 0.3rem rgba(0, 0, 0, 0.9));
}

.description {
    border-radius: 1rem;
    padding: 1rem;
    font-size: 1.2em;
    font-family: 'Ubuntu', sans-serif;
    color: white;
    overflow: auto;
    display: flex;
    align-items: center;
    text-align: center;
    font-weight: bold;
    overflow-y: auto;
    text-shadow: 0 0 1rem rgba(0, 0, 0, 0.9);
}

.input_gold {
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: gold;
    gap: 1rem;
    filter: drop-shadow(0 0 0.3rem rgba(0, 0, 0, 0.9));
    border-radius: 1rem;
    margin: 2rem;
    padding: 1rem;
    font-size: 1.8em;
    font-family: 'Big John', sans-serif;
    box-shadow: 0 0 1rem 0 rgba(0, 0, 0, 0.9);
}

.selected_cards {
    grid-column: 1 / -1;
}

.selected_cardList {
    height: 100%;
    margin: 0 !important;
    grid-template-rows: 4rem 75%;
    grid-template-areas:
        "title" "cards";
}

::v-deep(.selected_cardList .items-list) {
    height: 20rem;
}

.validate {
    grid-column: 2 / 3;
    display: flex;
    align-items: center;
    flex-direction: column;
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

.form_content.large .validate {

}

.error {
    font-size: 1.4em;
    text-align: center;
    font-family: 'Ubuntu', sans-serif;
    margin-bottom: 1rem;
    color: red;
}
</style>