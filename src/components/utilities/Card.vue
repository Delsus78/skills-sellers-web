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
            <footer>#{{ id }}</footer>
        </div>
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

</template>

<script setup>
import {VanillaTilt} from "./VanillaTilt";
import {onMounted} from "vue";
import { ref } from "vue";

const isActive = ref(false);
const { id, name, imageUrl, description, Competences } = defineProps({
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
    }

});

onMounted(() => {
    VanillaTilt.init(document.querySelectorAll("[data-tilt]"),{
        glare: true,
        reverse: true,
        "max-glare": 0.15
    });
});

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
    grid-template-rows: 20rem 13rem 1rem 5rem;
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

.legendaire::after {
    content:"";
    background: linear-gradient(45deg,
    #ff0000 0%,
    #ff9a00 10%,
    #d0de21 20%,
    #4fdc4a 30%,
    #3fdad8 40%,
    #2fc9e2 50%,
    #1c7fee 60%,
    #5f15f2 70%,
    #ba0cf8 80%,
    #fb07d9 90%,
    #ff0000 100%  )
    repeat 0% 0% / 300% 100%;
    position: absolute;
    inset: -3px;
    border-radius: 16px;
    filter: blur(8px);
    transform: translateZ(-1px);
    animation: rgb 6s linear infinite;
}

.commun::after {
    content:"";
    background: linear-gradient(45deg,
    #c5c5c5 0%,
    #ffffff 20%,
    #fffbdc 40%,
    #838383 60%,
    #b4b4b4 80%
    )
    repeat 0% 0% / 300% 100%;
    position: absolute;
    inset: -3px;
    border-radius: 16px;
    filter: blur(8px);
    transform: translateZ(-1px);
    animation: rgb 6s linear infinite;
}

.epic::after {
    content:"";
    background: linear-gradient(45deg,
    #94009d 0%,
    #ff33fb 20%,
    #7a0070 40%,
    #ff3ded 60%,
    #590064 80%
    )
    repeat 0% 0% / 300% 100%;
    position: absolute;
    inset: -3px;
    border-radius: 16px;
    filter: blur(8px);
    transform: translateZ(-1px);
    animation: rgb 6s linear infinite;
}
@keyframes rgb {
    0% {background-position: 0% 50%;}
    50% {background-position: 100% 50%;}
    100% {background-position: 0% 50%;}
}

@keyframes legendaire-color-change {
    0% { color: #ff0000; }
    10% { color: #ff9a00; }
    20% { color: #d0de21; }
    30% { color: #4fdc4a; }
    40% { color: #3fdad8; }
    50% { color: #2fc9e2; }
    60% { color: #1c7fee; }
    70% { color: #5f15f2; }
    80% { color: #ba0cf8; }
    90% { color: #fb07d9; }
    100% { color: #ff0000; }
}

@keyframes epic-color-change {
    0% { color: #94009d; }
    20% { color: #ff33fb; }
    40% { color: #7a0070; }
    60% { color: #ff3ded; }
    80% { color: #590064; }
    100% { color: #94009d; }
}

@keyframes commun-color-change {
    0% { color: #c5c5c5; }
    20% { color: #ffffff; }
    40% { color: #fffbdc; }
    60% { color: #838383; }
    80% { color: #b4b4b4; }
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

.epic-text {
    animation: epic-color-change 6s linear infinite;
}

.legendaire-text {
    animation: legendaire-color-change 6s linear infinite;
}

.commun-text {
    animation: commun-color-change 6s linear infinite;
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

.card-text .footerText {
    grid-area: footer;
    font-size: 1rem;
    color: var(--vt-c-red-1);
    margin: 10px;
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
