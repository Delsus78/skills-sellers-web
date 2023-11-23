<script setup>
import {useCardsStore, useGamesStore, useMainStore, useAuthStore} from "@/stores";
import ListSelector from "@/components/utilities/cards/CardListSelector.vue";
import {storeToRefs} from "pinia";
import {computed, ref, watch} from "vue";
import SpinWheel from "@/components/utilities/SpinWheel.vue";
import {
    faCoins as moneyIcon
} from "@fortawesome/free-solid-svg-icons";
const mainStore = useMainStore();
const cardsStore = useCardsStore();
const gamesStore = useGamesStore();
const authStore = useAuthStore();

const { gameResponse, gameEstimation } = storeToRefs(gamesStore);
const { cards } = storeToRefs(cardsStore);
const { user } = storeToRefs(authStore);

const selectedCards = ref([]);
const bet = ref(0);
const btnDisabled = ref(false);
const spin = ref(false);
const showWin = ref(false);
const spinWheelKey = ref(0);
const buttonDisabled = computed(() => {
    if (btnDisabled.value) {
        return true;
    }

    if (!bet.value) {
        return true;
    }

    if (selectedCards.value.length === 0) {
        return true;
    }

    return false;
})

mainStore.changeBackgroundColor("#CEAD00FF");

const emit = defineEmits(["estimate", "play"]);

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

const reestimateGame = () => {
    spinWheelKey.value = 0;
    showWin.value = false;
    let actualBet = bet.value;
    let ids = [];

    // bet ok ?
    if (!actualBet) {
        actualBet = 0;
    }

    // cards ok ?
    if (selectedCards.value !== null && selectedCards.value.length > 0) {
        ids = selectedCards.value;
    }

    emit("estimate", 'CASINO', actualBet, ids);
}

const play = () => {
    showWin.value = false;
    emit("play", 'CASINO', bet.value, selectedCards.value);
}

watch(gameResponse, (newVal) => {
    if (!newVal?.results) {
        return;
    }

    if (!newVal?.loading) {

        spinWheelKey.value++;
        btnDisabled.value = true;

        setTimeout(() => {
            spin.value = true;
            setTimeout(async () => {
                spin.value = false;
                showWin.value = true;

                // refresh cards if we won
                if (newVal.win) {
                    await cardsStore.getUserCard(user.value.id, selectedCards.value[0]);
                }
                // reestimate
                setTimeout(() => {
                    btnDisabled.value = false;
                    reestimateGame();
                }, 2000);
            }, 6000);
        }, 500);
    }
})

watch(bet, reestimateGame);
</script>

<template>
    <div class="casino">
        <div v-if="cards.loading">
            <p class="huge-text">Chargement des cartes...</p>
        </div>
        <div v-else class="casino_content">
            <div class="title">
                CHARISMATIC CASINO
            </div>
            <div class="subTitle">The amazing one</div>
            <div class="description bg-dark-blur">
                {{ game.description }}
            </div>
            <ListSelector :cards="cards"
                          :max-card-autorized="1"
                          :removed-stats-at10="[{name:'charisme', value:8}]"
                          withFilters
                          selected-action="casino"
                          @resulted-list="changeSelectedCardId" />

            <div class="form_content">
                <div class="input_gold">
                    <input type="number" placeholder="Mise" v-model="bet"/>
                    <svg-icon :fa-icon="moneyIcon" class="money_icon" :size="40"/>
                </div>
                <div class="wheel">
                    <SpinWheel class="spinWheel"
                               :percentage="gameEstimation?.chances ?? 0"
                               :size="300"
                               :animate="spin"
                               :key="spinWheelKey"
                               :result="gameResponse?.results"/>
                    <span v-if='showWin' class="win">
                        {{ gameResponse?.win ? 'GAGNE' : 'PERDU' }}
                    </span>
                </div>
                <div class="validate">
                    <button class="btn btn-primary" :disabled="buttonDisabled"
                            @click="play">Valider</button>
                    <div v-if="gameEstimation.error">
                        <p class="error shadow-white">{{ gameEstimation.error }}</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<style scoped>
.casino_content {
    margin-top: 5rem;
    min-height: 80rem;
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
    background-image: linear-gradient(45deg, #f3ec78, #af4261);

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
    grid-column: 1 / 3;
    grid-row: 1;
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
    bottom: -5rem;
    right: -10rem;
    z-index: 100;
    height: 40rem;
    width: 60rem;
    gap: 10px;
    border-radius: 1rem;
    background: radial-gradient(ellipse farthest-corner at right bottom, #FEDB37 0%, #FDB931 8%, #9f7928 30%, #8A6E2F 40%, transparent 80%),
    radial-gradient(ellipse farthest-corner at left top, #FFFFFF 0%, #FFFFAC 8%, #D1B464 25%, #5d4a1f 62.5%, #5d4a1f 100%);
    box-shadow: 0 0 1rem 0 rgba(0, 0, 0, 0.9);
    opacity: 0.9;
    scale: 0.6;

    @media (max-width: 1023px) {
        width: 100%;
        bottom: -5rem;
        right: 0;
    }
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

.input_gold {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 2rem;
    margin: 0 20%;
}

.input_gold .money_icon {
    color: gold;
    filter: drop-shadow(0 0 0.3rem rgba(0, 0, 0, 0.9));
}

.input_gold input {
    border-radius: 1rem;
    border: none;
    padding: 1rem;
    width: 80%;
    font-size: 1.2em;
    font-family: 'Ubuntu', sans-serif;
    color: gold;
    background: rgba(0, 0, 0, 0.5);
    box-shadow: 0 0 1rem 0 rgba(0, 0, 0, 0.9);
}

.input_gold input:focus {
    outline-color: gold;
}

.wheel {
    display: flex;
    justify-content: center;
}

.win {
    position: absolute;
    margin-bottom: -10rem;
    font-size: 5em;
    font-family: 'Big John', sans-serif;
    color: gold;
    text-shadow: 0 0 1rem rgba(0, 0, 0, 0.9);
}

.validate {
    display: flex;
    align-items: center;
    flex-direction: column;
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
