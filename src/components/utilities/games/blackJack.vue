<script setup>
import {faBurger as foodIcon, faCubesStacked as creatiumIcon} from "@fortawesome/free-solid-svg-icons";
import {computed, onBeforeMount, onMounted, onUnmounted, ref, watch} from "vue";
import {useBlackJackStore, useGamesStore, useUsersStore} from "@/stores";
import BJPlayer from "@/components/utilities/games/BJPlayer.vue";
import {storeToRefs} from "pinia";
import '../../../assets/images/bjtable.jpg';
import {
    getSecondsBetweenNowAnd
} from "@/components/utilities/DateFormator";
import InfoBulle from "@/components/utilities/InfoBulle.vue";

const gamesStore = useGamesStore();
const blackJackStore = useBlackJackStore();
const usersStore = useUsersStore();

const emit = defineEmits(["estimate", "play"]);
const { users, actualUser } = storeToRefs(usersStore);
const { game: blackJackGame, updatedTime } = storeToRefs(blackJackStore);

const { game } = defineProps({
    game: {
        type: Object,
        required: true
    }
});

const { gameEstimation } = storeToRefs(gamesStore);
const bet = ref(0);

const buttonDisabled = computed(() => !bet.value)

onBeforeMount(() => {
    blackJackStore.setGame(game.game);

    usersStore.getAllUsers();
});

const estimatedGame = () => {
    emit("estimate", 'blackjack', bet.value === '' ? 0 : bet.value, [])
}

const enterGame = () => {
    emit("play", 'blackjack', bet.value === '' ? 0 : bet.value, [])
}

watch(bet, estimatedGame);

watch(updatedTime, () => {
    updateDates();
});

const getPseudo = computed(() => (id) => {
    if (users.value.loading || users.value.error) return null;
    const user = users.value.find(user => user.id === id);
    return user ? user.pseudo : 'Inconnu';
});

const play = (action) => {
    blackJackStore.play(action);
}


const remainingSeconds = ref(getSecondsBetweenNowAnd(blackJackGame.value?.nextStepDate))
let intervalId;
onMounted(() => {
    intervalId = setInterval(updateDates, 1000);
});
onUnmounted(() => {
    if (intervalId) {
        clearInterval(intervalId);
    }
});
function updateDates() {
    if (!blackJackGame.value) return;
    remainingSeconds.value = getSecondsBetweenNowAnd(blackJackGame.value.nextStepDate);
}
</script>
<template>
<div class="blackjack">
    <img src="../../../assets/images/bjtable.jpg" alt="blackjack table" class="bjtable"/>
    <div class="blackjack_content">
        <div class="title">
            BLACK JACK
        </div>
        <div class="description bg-dark-blur">
            {{ game.description }}
            <info-bulle>
                <span v-for="(r1, r2) in game.regles">
                    <p>{{ r1 }}</p>
                    <p>{{ r2 }}</p>
                </span>
            </info-bulle>
        </div>
        <div class="discret bg-dark-blur" v-if="blackJackGame">
            Seed : {{ blackJackGame.seed }}
        </div>


        <div v-if="blackJackGame" :key="updatedTime">
            <div class="bank">
                <b-j-player :playerData="{name:'BANK',hand:blackJackGame.bankHand, state: blackJackGame.state}"
                            :class="{active: blackJackGame.currentPlayerTurn === 0}"/>
                <img src="../../../assets/images/cards/deck.png" alt="deck of card" class="deck"/>
            </div>

            <div class="Timer" :key="updatedTime">
                {{ remainingSeconds }}
            </div>

            <div class="players">
                <b-j-player v-for='player in blackJackGame.players'
                            :playerData="{
                                name: getPseudo(player.id),
                                ...player}" :class="{
                    active: player.id === blackJackGame.currentPlayerTurn,
                    actualPlayer: player.id === actualUser.id}"/>
            </div>
        </div>
        <div v-if="blackJackGame && blackJackGame.status !== 0" class="form_content">
            <div class="validate" v-if="blackJackGame.currentPlayerTurn == actualUser.id">
                <button class="btn btn-primary"
                        @click="play(0)">piocher</button>
                <button class="btn btn-primary"
                        @click="play(1)">Garder (Stand)</button>
                <div v-if="gameEstimation.error">
                    <p class="error shadow-white">{{ gameEstimation.error }}</p>
                </div>
            </div>
        </div>
        <div v-else class="form_content">
            <div class="input_creatium creatium">
                <input type="number" placeholder="Mise" v-model="bet" class="creatium"/>
                <svg-icon :fa-icon="creatiumIcon" class="money_icon" :size="40"/>
            </div>
            <span class="food_requested">
                <span class="title-text">+ 1</span>
                <svg-icon class="shadow-black food" :fa-icon="foodIcon" :size="40"/>
            </span>
            <div class="validate">
                <button class="btn btn-primary" :disabled="buttonDisabled"
                        @click="enterGame">Valider</button>
                <div v-if="gameEstimation.error">
                    <p class="error shadow-white">{{ gameEstimation.error }}</p>
                </div>
            </div>
        </div>
    </div>
</div>
</template>
<style scoped>
.blackjack_content {
    margin-top: 5rem;
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
    background-color: #000000;

    /* Create the gradient. */
    background-image: linear-gradient(45deg, #232323, #af4261);

    /* Set the background size and repeat properties. */
    background-size: 100%;
    background-repeat: repeat;

    /* Use the text as a mask for the background. */
    /* This will show the gradient as a text color rather than element bg. */
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    -moz-background-clip: text;
    -moz-text-fill-color: transparent;

    /* shadow light behind */
    filter: drop-shadow(0 0 0.75rem #930000);
}

.bjtable {
    position: fixed;
    z-index: -1;
    width: 100%;
    height: 100%;
    top:0;
    left:0;
    bottom:0;
    opacity: 0.3;

}

.active {
    border: 1px solid gold;
}

.actualPlayer {
    filter: drop-shadow(0 0 0.3rem rgba(229, 188, 188, 0.9));
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

.players {
    display: flex;
    justify-content: space-around;
    gap: 2rem;
    margin-top: 2rem;
}

.bank {
    display: flex;
    justify-content: center;
    gap: 2rem;
    margin-top: 2rem;
}

.deck {
    height: 8rem;
    filter: drop-shadow(0 0 0.3rem rgba(0, 0, 0, 0.9));
}

.Timer {
    position: absolute;
    top: 50%;
    font-size: 2em;
    font-weight: bold;
    color: gold;
    background: rgba(0, 0, 0, 0.5);
    border-radius: 1rem;
    box-shadow: 0 0 1rem 0 rgba(0, 0, 0, 0.9);
    padding: 1rem;
    z-index: 100;
}

.form_content {
    position: fixed;
    padding: 2rem;
    bottom: 0;
    right: -5rem;
    z-index: 100;
    height: 25rem;
    width: 50rem;
    gap: 10px;
    border-radius: 1rem;
    background: radial-gradient(ellipse farthest-corner at right bottom, #37e0fe 0%, #31fdfd 8%, #289f9f 30%, #2f8a8a 40%, transparent 80%),
    radial-gradient(ellipse farthest-corner at left top, #FFFFFF 0%, #acf5ff 8%, #64c4d1 25%, #1f525d 62.5%, #5d4a1f 100%);
    box-shadow: 0 0 1rem 0 rgba(0, 0, 0, 0.9);
    opacity: 0.9;
    scale: 0.6;

    @media (max-width: 1023px) {
        width: 100%;
        bottom: -5rem;
        right: 0;
    }
}

.input_creatium {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 2rem;
    margin: 0 20%;
}

.input_creatium .money_icon {
    filter: drop-shadow(0 0 0.3rem rgba(0, 0, 0, 0.9));
}

.input_creatium input {
    border-radius: 1rem;
    border: none;
    padding: 1rem;
    width: 80%;
    font-size: 2em;
    font-family: 'Big John', sans-serif;
    background: rgba(0, 0, 0, 0.5);
    box-shadow: 0 0 1rem 0 rgba(0, 0, 0, 0.9);
}

.food_requested {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 1rem;
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
    color: #dabf10;
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