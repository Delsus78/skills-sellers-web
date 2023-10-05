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
            <span :class="['rarity', rarity + '-text']">{{ rarity }}</span>
            <h2>{{ name }}</h2>
            <p>{{ description }}</p>
        </div>
        <footer class="actionText" :class="{actif: action, 'shadow-white': !action}">{{ action ? action.actionName.slice(O, -1) : 'ne fait rien' }}</footer>
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
            <h2 class="title huge-text shadow-white">{{ action ? action.actionName.slice(0, -1) : 'ne fait rien' }}</h2>
            <p class="date">{{ action ? 'termine ' + getFormattedRemainingTime(action.endTime) : '' }}</p>
            <div v-for="(val, actionKey ) in action || {}">
                <p v-if="['cards', 'actionName', 'endTime'].indexOf(actionKey) === -1" class="infos">
                    <span class="little_title">{{ actionKey }} : </span>
                    <span> {{ val }}</span>
                </p>
            </div>
        </div>
    </div>

</template>

<script setup>
import {VanillaTilt} from "./VanillaTilt";
import {onMounted} from "vue";
import { ref } from "vue";
import moment from "moment/moment";

const isActive = ref(false);
const { id, name, imageUrl, description, competences } = defineProps({
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
        required: true,
        default: 'https://i.imgur.com/5yUZC8k.png'
    },
    description: {
        type: String,
        required: true,
        default: 'Skills Sellers super description.\n Allez écouter la série audio sur Spotify !\n(ps : si tu vois ca c\'est que ta une co pourrie ou que le site est down)\nRip hihi'
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

onMounted(() => {
    VanillaTilt.init(document.querySelectorAll("[data-tilt]"),{
        glare: true,
        reverse: true,
        "max-glare": 0.15
    });
});

function getFormattedRemainingTime(endDateStr) {
    moment.locale('fr');
    const now = moment();
    const endDate = moment(endDateStr);
    const remainingTime = moment.duration(endDate.diff(now));
    return remainingTime.locale('fr').humanize(true);
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
    grid-template-rows: 20rem 11rem 3rem 5rem;
    grid-template-areas: "image" "text" "footer" "stats";
    border-radius: 18px;
    background: #1d1d1d;
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
    border: 1px solid white;
    border-radius: 15px;
    color:white;
    box-shadow: 5px 5px 15px rgba(0,0,0,0.9);
    text-align: justify;
    padding:5vw;
    display: grid;
    grid-template-areas: "title" "date" "infos";
    grid-template-rows: 10% 10% 80%;
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
    color: var(--color-text);
    text-shadow: black 0.1em 0.1em 0.2em;
    font-size:14px;
}
.card-text h2 {
    margin-top: 0;
    font-size: 28px;
    font-weight: bolder;
}

.actionText {
    grid-area: footer;
    font-size: 1rem;
    font-weight: bolder;
    display: flex;
    align-items: center;
    justify-content: center;
}

.card-stats {
    grid-area: stats;
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
    grid-template-rows: 1fr;
    border-bottom-left-radius: 15px;
    border-bottom-right-radius: 15px;
    background: rgba(248, 7, 7, 0.4);
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
</style>
