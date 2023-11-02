<!-- GameCard.vue -->
<template>
    <div class="overlay" :class="{ active: isActive }"></div>
    <div :class="['card', rarity, { active: isActive }]"
         @click="toggleActive"
         data-tilt
         data-tilt-glare
         data-tilt-max-glare="0.2"
         data-tilt-scale="1">
        <img :src="imageUrl" class="card-image" alt="Game Card" />
        <div class="card-text card2">
            <div class="top-text">
                <span :class="['rarity', rarity + '-text']">{{ rarity }}</span>
                <span class="collection-text">{{ collection }}</span>
            </div>
            <h2 class="shadow-black">{{ name }}</h2>
            <p>{{ description }}</p>
        </div>
        <footer class="actionText" :class="{actif: action, 'shadow-black': action,'shadow-white': !action}">
            {{ action ? action.actionName.slice(0, -1) : 'NE FAIT RIEN' }}
            <progress-bar v-if="action" :pourcentage="pourcentageRemainingTime" :text="clearRemainingTime"/>
        </footer>
        <div class="card-stats">
            <div class="stat">
                <div class="value">{{ competences.cuisine }}</div>
                <div class="type">CUISI</div>
            </div>
            <div class="stat border">
                <div class="value">{{ competences.charisme }}</div>
                <div class="type">CHARI</div>
            </div>
            <div class="stat">
                <div class="value">{{ competences.force }}</div>
                <div class="type">FORCE</div>
            </div>
            <div class="stat border">
                <div class="value">{{ competences.exploration }}</div>
                <div class="type">EXPLO</div>
            </div>
            <div class="stat">
                <div class="value">{{ competences.intelligence }}</div>
                <div class="type">INTEL</div>
            </div>
        </div>
    </div>
    <div class="actionInfo bg-dark-blur" v-if="isActive">
        <div class="actionInfoText">
            <h2 class="title huge-text shadow-white">{{ action ? action.actionName.slice(0, -1).charAt(0).toUpperCase() + action.actionName.slice(0, -1).slice(1) : 'Ne fait rien' }}</h2>
            <p class="date">{{ action ? 'Termine ' + getFormattedRemainingTime(action.endTime) : '' }}</p>
            <p>{{ action ? format(action.endTime, "DD MMMM YYYY HH:mm:ss Z") : ''}}</p>
            <div v-for="(val, actionKey ) in action || {}">
                <!-- Particular cases-->
                <p v-if="actionKey === 'planetName'">
                    <span class="little_title">Planète : </span>
                    <span class="value">{{ val.charAt(0).toUpperCase() + val.slice(1) }}</span>
                    <RandomPlanet class="planetArrival"
                                  :model-value="val.charAt(0).toUpperCase() + val.slice(1)" :height="200" :width="200" :planet-id="3"/>
                </p>
                <p v-if="actionKey === 'batimentToUpgrade'">
                    <span class="little_title">Bâtiment : </span>
                    <span class="value" v-if="val === 'salledesport'">Salle de Sport</span>
                    <span class="value" v-else-if="val === 'cuisine'">Cuisine</span>
                    <span class="value" v-else-if="val === 'spatioport'">Spatioport</span>
                </p>
                <p v-if="actionKey === 'isReturningToHome'">
                    <span class="little_title">Trajet : </span>
                    <span class="value">
                        <svg-icon class="shadow-white icon" :fa-icon="homeIcon" :size="36"/>
                        <svg-icon v-if="val" class="shadow-white icon" :fa-icon="rightArrowIcon" :size="36"/>
                        <svg-icon v-else class="shadow-white icon" :fa-icon="leftArrowIcon" :size="36"/>
                        <svg-icon class="shadow-white" :fa-icon="planetIcon" :size="36"/>
                    </span>
                </p>
                <p v-if="actionKey === 'muscle'">
                    <span class="little_title">Muscle : </span>
                    <span class="value">{{ val.charAt(0).toUpperCase() + val.slice(1) }}</span>
                </p>
                <p v-if="actionKey === 'plat'">
                    <span class="little_title">Plat : </span>
                    <span class="value">{{ val.charAt(0).toUpperCase() + val.slice(1) }}</span>
                </p>
                <p v-if="actionKey === 'repairChances'">
                    <span class="little_title">Chance de réussir : </span>
                    <span class="value">{{ val.toFixed(2) }}% </span>
                </p>
            </div>
            <div v-if="action" class="cancelAction red" @click="emit('cancelAction', action.id)">Annuler l'action</div>
        </div>
    </div>

</template>

<script setup>
import {VanillaTilt} from "./VanillaTilt";
import {onMounted, onUnmounted} from "vue";
import { ref } from "vue";
import {getFormattedRemainingTime, format, getClearRemainingTime, getPourcentageRemainingTime} from "./DateFormator";
import {
    faHome as homeIcon,
    faArrowLeft as rightArrowIcon,
    faArrowRight as leftArrowIcon,
    faEarthEurope as planetIcon
} from "@fortawesome/free-solid-svg-icons";
import RandomPlanet from "@/components/utilities/RandomPlanet.vue";
import ProgressBar from "@/components/utilities/progressBar.vue";

const isActive = ref(false);
const { id, name, imageUrl, description, collection, rarity, competences, action } = defineProps({
    id: {
        type: Number,
        required: true,
        default: 0
    },
    name: {
        type: String,
        required: true,
        default: 'Skills Sellers'
    },
    imageUrl: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true,
        default: 'Skills Sellers super description.\n Allez écouter la série audio sur Spotify !\n(ps : si tu vois ca c\'est que ta une co pourrie ou que le site est down)\nRip hihi'
    },
    collection: {
        type: String,
        required: true,
        default: 'skills-sellers'
    },
    rarity: {
        type: String,
        required: true,
        default: 'commun'
    },
    competences: {
        type: Object,
        required: true,
        default: () => ({
            cuisine: 0,
            charisme: 0,
            force: 0,
            exploration: 0,
            intelligence: 0
        })
    },
    action: {
        type: Object,
        required: false,
        default: () => {}
    }

});
const emit = defineEmits(['cancelAction']);
const clearRemainingTime = ref(getClearRemainingTime(action?.endTime));
const pourcentageRemainingTime = ref(getPourcentageRemainingTime(action?.endTime));
let intervalId;

onMounted(() => {
    VanillaTilt.init(document.querySelectorAll("[data-tilt]"),{
        glare: true,
        reverse: true,
        "max-glare": 0.15
    });

    intervalId = setInterval(updateDates, 1000);
});

onUnmounted(() => {
    clearInterval(intervalId);  // Arrête l'intervalle lorsqu'on quitte le composant
});

function updateDates() {
    // Votre logique pour mettre à jour les dates
    if (!action) return;
    clearRemainingTime.value = getClearRemainingTime(action?.endTime);
    pourcentageRemainingTime.value = getPourcentageRemainingTime(action?.endTime, action?.createdAt);
}

function toggleActive() {
    isActive.value = !isActive.value;
}

</script>
<style scoped>

.overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0);
    transition: background 0.5s;
    z-index: 5;
    pointer-events: none ;
}

.overlay.active {
    background: rgba(0, 0, 0, 0.7);
    backdrop-filter: blur(5px);
    pointer-events: unset;
}

.card {
    display: grid;
    grid-template-columns: 20rem;
    grid-template-rows: 19rem 12rem 3rem 5rem;
    grid-template-areas: "image" "text" "footer" "stats";
    border-radius: 18px;
    color:white;
    box-shadow: 5px 5px 15px rgba(0,0,0,0.9);
    text-align: justify;
    cursor: pointer;
    margin:30px;
    transform-style: preserve-3d;
    transform: perspective(1000px);
    z-index: 1;
}

.card.active {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    scale: 1.4;
    width: 20rem;
    height: 39rem;
    margin: auto;
    z-index: 10;
}

.little_title {
    font-size: 2rem;
    font-weight: bold;
}

.actionInfo {
    z-index: 10;
    position: fixed;
    left: 2rem;
    top: 10rem;
    border: 1px solid white;
    border-radius: 15px;
    color:white;
    box-shadow: 5px 5px 15px rgba(0,0,0,0.9);
    text-align: justify;
    padding:3vw;
    display: grid;
    grid-template-areas: "title" "date" "infos";
    grid-template-rows: 10% 10% 80%;
}

.actionInfo .value {
    font-size: 1.5rem;
    font-weight: bold;
    color: #ffcc00;
}

.actionInfo .title {
    grid-area: title;
    font-size: 3rem;
    font-weight: bold;
}

.actionInfo .date {
    grid-area: date;
    font-size: 2rem;
    font-weight: bold;
}

.actionInfo .infos {
    grid-area: infos;
    font-size: 1.5rem;
    font-weight: bold;
}

.actionInfo .value .icon {
    margin-right: 10px;
}

.planetArrival {
    position: fixed;
    top: 100%;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 102;
}

.card-image {
    grid-area: image;
    width: 100%;
    border-top-left-radius: 15px;
    border-top-right-radius: 15px;
    background-size: cover;
}

.card-text {
    grid-area: text;
    margin: 25px;
    transform: translateZ(30px);
}
.card-text .rarity {
    font-size:13px;
    font-weight: bold;
    font-family: "Big John", sans-serif;
}

.actif {
    font-size:13px;
    font-weight: bold;
    font-family: "Big John", sans-serif;
    color: #b60000;
}

.card-text p {
    font-weight: bold;
    color: yellow;
    opacity: 0.6;
    text-shadow: black 0.1em 0.1em 0.2em;
    font-size:14px;
    line-height: 15px;
}
.card-text h2 {
    margin-top: 0;
    font-weight: bolder;
    text-align: center;
}

.actionText {
    grid-area: footer;
    font-size: 1rem;
    font-weight: bolder;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
}

.card-stats {
    grid-area: stats;
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
    grid-template-rows: 1fr;
    border-bottom-left-radius: 15px;
    border-bottom-right-radius: 15px;
    background: rgba(40, 34, 34, 0.4);
    backdrop-filter: blur(2px);
}
.card-stats .stat {
    padding:10px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    color: white;
}
.card-stats .border {
    border-left: 1px solid rgb(172, 26, 87);
    border-right: 1px solid rgb(172, 26, 87);
}
.card-stats .value{
    font-size:22px;
    font-weight: 500;
}
.card-stats .value sup{
    font-size:12px;
}
.card-stats .type{
    font-size:11px;
    font-weight: 300;
    text-transform: uppercase;
}

.top-text {
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.collection-text {
    font-size: 0.7rem;
    font-weight: bold;
    color: var(--color-text);
}


.cancelAction {
    position: absolute;
    transition: all 0.2s ease-in-out;
}

.cancelAction:hover {
    transform: scale(1.2);
    color: var(--vt-c-red-2);
    filter: drop-shadow(0 0 4px var(--vt-c-red-2));
}
</style>
