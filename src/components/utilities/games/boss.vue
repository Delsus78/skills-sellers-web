<script setup>
import {useCardsStore, useGamesStore, useMainStore, useAuthStore} from "@/stores";
import ListSelector from "@/components/utilities/cards/CardListSelector.vue";
import {storeToRefs} from "pinia";
import {computed, ref} from "vue";
import {
    faChevronDown as faChevronDown,
} from "@fortawesome/free-solid-svg-icons";
import Card from "@/components/utilities/cards/Card.vue";
import ProgressBar from "@/components/utilities/progressBar.vue";
const mainStore = useMainStore();
const cardsStore = useCardsStore();
const gamesStore = useGamesStore();
const authStore = useAuthStore();

const { gameEstimation } = storeToRefs(gamesStore);
const { cards } = storeToRefs(cardsStore);

const selectedCards = ref([]);
const btnDisabled = ref(false);
const buttonDisabled = computed(() => {
    if (btnDisabled.value) {
        return true;
    }

    if (selectedCards.value.length === 0) {
        return true;
    }

    return false;
})

mainStore.changeBackgroundColor("#CEAD00FF");

const emit = defineEmits(["estimate", "play", "cancel"]);

const { game } = defineProps({
    game: {
        type: Object,
        required: true
    }
});

const changeSelectedCardId = (newSelectedCards) => {
    selectedCards.value = newSelectedCards;

    reestimateGame();
}

const selectAllCardsWithNoAction = () => {
    cards.value.forEach(card => {
        if ((card.action === null) && !selectedCards.value.includes(card.id)) {
            selectedCards.value.push(card.id);
        }
    })
    reestimateGame();
}

const selectAllCardsWithActionBoss = () => {
    cards.value.forEach(card => {
        if (card.action !== null && card.action.actionName.includes('boss') && !selectedCards.value.includes(card.id)) {
            selectedCards.value.push(card.id);
        }
    })
    reestimateGame();
}

const deselection = () => {
    selectedCards.value = [];
    reestimateGame();
}

const reestimateGame = () => {
    // cards ok ?
    if (selectedCards.value !== null && selectedCards.value.length > 0) {
        let ids = selectedCards.value;

        emit("estimate", 'BOSS', 0, ids);
    }
}

const play = () => {
    emit("play", 'BOSS', 0, selectedCards.value);
}

const remove = () => {
    emit("cancel", 'BOSS', selectedCards.value);
}

const pourcentageToWin = computed(() => {
    // pourcentage from game.bossCard.power and boss
    const bossPower = game.bossCard?.power ?? 9999;
    let totalPlayerPower = 0;
    for (const pair in game.playersPower) {
        totalPlayerPower += game.playersPower[pair];
    }

    // adding power of selectedcards
    for (const card of selectedCards.value) {
        cardsStore.cards.forEach((c) => {
            if (c.id === card && !c.action?.actionName.includes('boss')) {
                totalPlayerPower += c.power;
            } else if (c.id === card && c.action?.actionName.includes('boss')) {
                totalPlayerPower -= c.power;
            }
        });
    }

    return Math.round((totalPlayerPower / bossPower) * 100);
})

const pourcentageToWinText = computed(() => {
    // pourcentage from game.bossCard.power and boss
    const bossPower = game.bossCard?.power ?? 9999;
    let totalPlayerPower = 0;
    for (const pair in game.playersPower) {
        totalPlayerPower += game.playersPower[pair];
    }

    // adding power of selectedcards
    for (const card of selectedCards.value) {
        cardsStore.cards.forEach((c) => {
            if (c.id === card && !c.action?.actionName.includes('boss')) {
                totalPlayerPower += c.power;
            } else if (c.id === card && c.action?.actionName.includes('boss')) {
                totalPlayerPower -= c.power;
            }
        });
    }

    return `${totalPlayerPower} / ${bossPower}`;
})

</script>

<template>
    <div class="boss">
        <div v-if="cards.loading">
            <p class="huge-text">Chargement des cartes...</p>
        </div>
        <div v-else-if="game" class="boss_content">
            <div class="title">
                BOSSFIGHT - {{ game.bossCard.name }}
            </div>
            <div class="description bg-dark-blur">
                {{ game.description }}
            </div>
            <p class="huge-text DivTitle" style="position: absolute; top: 50%; z-index:1000; scale: 3;" v-if="game.name.includes('Terminé')">
                TERMINE
            </p>
            <div class="card">
                <Card
                    :key="game.bossCard.id"
                    :id="game.bossCard.id"
                    :name="game.bossCard.name"
                    :description="game.bossCard.description"
                    :image-url="game.bossCard.imageUrl"
                    :competences="game.bossCard.competences"
                    :rarity="game.bossCard.rarity"
                    :collection="game.bossCard.collection"
                    :action="{ actionName: 'Attaque dans*', endTime: game.endDate, createdAt: game.startDate }"
                    :weapon="game.bossCard.weapon"
                    :power="game.bossCard.power"
                    noInspection hide-favorite  />
            </div>
            <div class="powerList">
                <p >Puissance infligée</p>
                <p v-for="(key, val) in game.playersPower" :key="key" class="meethic" style="grid-column: 1;">
                    {{ key }} : {{ val }}
                </p>
            </div>
            <div class="card-bg">
                <img :src="game.bossCard.imageUrl" alt=""/>
            </div>
            <div class="addCards" v-if="!game.name.includes('Terminé')">
                <div class="DivTitle little_title">
                    <svg-icon class="shadow-white" :fa-icon="faChevronDown" :size="30"/> AJOUTER DES CARTES <svg-icon class="shadow-white" :fa-icon="faChevronDown" :size="30"/>
                </div>
                <ListSelector :cards="cards"
                          withFilters
                          selected-action="boss"
                          :init-selected-cards-ids="selectedCards"
                          @resulted-list="changeSelectedCardId" />
            </div>
            <div class="form_content" v-if="!game.name.includes('Terminé')">
                <p class="discret" style="grid-column: 1;">
                    Pour enlever une carte du combat, sélectionnez-la à nouveau.
                </p>
                <div class="validate">
                    <div style="display: flex;">
                        <button class="btn btn-primary" @click="selectAllCardsWithNoAction">Selection rapide</button>
                        <button class="btn btn-primary" @click="selectAllCardsWithActionBoss">Selection rapide des cartes contre le Boss</button>
                        <button class="btn btn-primary" @click="deselection">Deselection</button>
                    </div>
                    <button class="btn btn-primary" :disabled="buttonDisabled" @click="play">Valider</button>
                    <button class="btn btn-primary meethicColored" :disabled="buttonDisabled" @click="remove">Retirer de la bataille</button>
                    <div v-if="gameEstimation.error">
                        <p class="error shadow-white">{{ gameEstimation.error }}</p>
                    </div>
                </div>
                <div class="progress_div">
                    <progress-bar :pourcentage="pourcentageToWin" :text="pourcentageToWinText" ended-text="PLEINE PUISSANCE"/>
                </div>
            </div>
        </div>
    </div>
</template>
<style scoped>
.boss_content {
    margin-top: 6rem;
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;

    justify-items: center;
    width: 100%;

    @media (max-width: 1023px) {
        margin-top: 7rem;
        grid-template-columns: 1fr;
        grid-gap: 2rem;
    }
}

.title {
    grid-column: 1 / -1;
    grid-row: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    font-weight: normal;
    font-size: 4.5em;
    text-align: center;
    font-family: "Big John", sans-serif;

    /* Fallback: Set a background color. */
    background-color: #ffffff;

    /* Create the gradient. */
    background-image: linear-gradient(45deg, #fff000, #0022f8);

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

.card {
    grid-column: 1 / -1;
    grid-row: 3;
    display: flex;
    justify-content: center;
    scale: 1;
}
.card-bg {
    position: absolute;
    display: flex;
    justify-content: center;
    scale: 1;
    z-index: -10000;
    opacity: 0.2;
    filter: blur(10px);
}

.powerList {
    position: absolute;
    left: 10%;
    top: 30rem;
    display: grid;
    grid-template-columns: 1fr;
    gap: 1rem;
    justify-items: center;
    font-size: 1.5em;
    font-family: 'Ubuntu', sans-serif;
    color: white;
    text-align: center;
    font-weight: bold;
    text-shadow: 0 0 1rem rgba(0, 0, 0, 0.9);

    @media (max-width: 1023px) {
        top: 40rem;
    }

}

.form_content {
    position: fixed;
    padding: 2rem;
    bottom: -5rem;
    right: -10rem;
    z-index: 100;
    height: 30rem;
    width: 60rem;
    gap: 10px;
    border-radius: 1rem;
    background: radial-gradient(ellipse farthest-corner at right bottom, #ece37c 0%, #63d2b4 8%, #3f7cdc 30%, #335be1 40%, transparent 80%),
    radial-gradient(ellipse farthest-corner at left top, #FFFFFF 0%, #83efe2 8%, #64cdd1 25%, #4d67c9 62.5%, #5d4a1f 100%);
    box-shadow: 0 0 1rem 0 rgba(0, 0, 0, 0.9);
    opacity: 0.9;
    scale: 0.6;

    display: grid;

    @media (max-width: 1023px) {
        width: 100%;
        bottom: -5rem;
        right: 0;
    }
}

.description {
    grid-column: 1 / -1;
    grid-row: 2;
    border-radius: 1rem;
    padding: 1rem;
    font-size: 1.2em;
    font-family: 'Ubuntu', sans-serif;
    color: white;
    text-align: center;
    font-weight: bold;
    text-shadow: 0 0 1rem rgba(0, 0, 0, 0.9);
}

.addCards {
    grid-column: 1 / -1;
    grid-row: 4;
    display: grid;
    grid-template-rows: 6% 94%;

    height: 100rem;
    z-index: 1;

    @media (max-width: 1023px) {
        grid-column: 1;
        grid-row: 5;
        margin: 0;
        width: 100%;
        border-radius: 0;
    }
}

.progress_div {
    grid-area: footer;
    font-size: 1rem;
    font-weight: bolder;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    margin: 1rem 15rem;
    scale: 2;
    filter: drop-shadow(0 0 1rem var(--vt-c-black));
    grid-column: 1;
}

.validate {
    display: flex;
    align-items: center;
    flex-direction: column;
    grid-column: 1;
}

.validate button {
    border-radius: 1rem;
    border: none;
    padding: 1rem;
    width: 80%;
    margin: 1rem;

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
    font-size: 1.4em;
    color: darkred;
}
</style>
