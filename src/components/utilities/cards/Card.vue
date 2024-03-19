<!-- GameCard.vue -->
<template>
    <div class="overlay" :class="{ active: isActive }"></div>
    <a class="favoriteToggle" @click="switchFavorite" v-if="!hideFavorite">
        <svg-icon v-if="isFavorite" class="colorEffect shadow-white" :fa-icon="heartIcon" :size="36"/>
        <svg-icon v-else class="shadow-white" :fa-icon="heartEmptyIcon" :size="36"/>
    </a>
    <a class="selectedToggle" @click="onClick" v-if="showSelection">
        <svg-icon v-if="isSelected" class="colorEffect shadow-white" :fa-icon="selectedIcon" :size="36"/>
        <svg-icon v-else class="shadow-white" :fa-icon="notSelectedIcon" :size="36"/>
    </a>
    <div :class="['card', rarity, { active: isActive }]"
         @click="onClick"
         ref="tiltCard"
         data-tilt
         data-tilt-glare
         data-tilt-max-glare="0.2"
         data-tilt-scale="1">
        <img rel="preload" :src="imageUrl" class="card-image" alt="Game Card" />
        <div class="card-text card2">
            <div class="top-text">
                <span :class="['rarity', rarity + '-text']">{{ rarity }}</span>
                <span class="collection-text">{{ collection }}</span>
            </div>
            <h2 class="shadow-black">{{ name }}</h2>
            <p>{{ description }}</p>
        </div>
        <div class="card-id">
            <span class="collection-text">{{ id }}</span>
        </div>
        <div class="card-power">
            <div class="top-text">
                <p v-if="power" class="meethicColored powerText">{{ power }} <svg-icon :fa-icon="fireIcon" :size="24"/></p>
            </div>
        </div>
        <div class="card-weapon">
            <div class="top-text">
                <p v-if="weapon" class="weaponText">{{ weapon.power }} <svg-icon :fa-icon="weaponIcon" :size="25"/></p>
            </div>
        </div>
        <footer class="actionText" :class="{actif: action, 'shadow-black': action,'shadow-white': !action}">
            {{ action ? action.actionName === 'satellite' ? 'Satellite' : action.actionName === 'reparer' ? 'Construit une arme' : action.actionName.slice(0, -1) : 'NE FAIT RIEN' }}
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
            <h2 class="title huge-text shadow-white">{{ action ? action.actionName === 'satellite' ? 'Satellite' : action.actionName === 'reparer' ? 'Construit une arme' : action.actionName.slice(0, -1).charAt(0).toUpperCase() + action.actionName.slice(0, -1).slice(1) : 'Ne fait rien' }}</h2>
            <p class="date">{{ action ? 'Termine ' + getFormattedRemainingTime(action.endTime) : '' }}</p>
            <p>{{ action ? format(action.endTime, "DD MMMM YYYY HH:mm:ss Z") : ''}}</p>
            <div v-for="(val, actionKey ) in action || {}">
                <!-- Particular cases-->
                <p v-if="actionKey === 'batimentToUpgrade' && val !== null">
                    <span class="little_title">Bâtiment : </span>
                    <span class="value" v-if="val === 'salledesport'">Salle de Sport</span>
                    <span class="value" v-else-if="val === 'cuisine'">Cuisine</span>
                    <span class="value" v-else-if="val === 'spatioport'">Spatioport</span>
                </p>
                <p v-if="actionKey === 'weaponToUpgradeId' && val !== null">
                    <span class="little_title">Arme : </span>
                    <a class="value" v-if="upgradedWeapon === null" @click="onWeaponUpgradedClicked">voir</a>
                    <span class="value" v-else>{{ upgradedWeapon.name }} {{ upgradedWeapon.power }} -> {{ upgradedWeapon.power +1 }}</span>
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
            <div v-if="action" class="cancelAction red" @click="cancelAction();">Annuler l'action</div>
            <div v-else class="startAction">
                <RouterLink :to="`/action/explorer/` + id">
                    <div class="startActionText red">Partir en exploration</div>
                </RouterLink>
                <RouterLink :to="`/action/cuisiner/` + id">
                    <div class="startActionText red">Partir en cuisine</div>
                </RouterLink>
                <RouterLink :to="`/action/muscler/` + id">
                    <div class="startActionText red">Partir à la salle</div>
                </RouterLink>
            </div>
        </div>
    </div>
    <ExplorationInfo class="explorationInfo"
                     v-if="isActive && action && action.actionName === 'explorer'"
                     :action="action" @decision="setDecisionForExploration"/>
    <Weapon class="weaponInfo"
            v-if="isActive && weapon"
            :weapon="weapon" @click="onWeaponClicked"/>
    <div class="weaponInfo emptyWeapon"
         v-if="isActive && !weapon"
          @click="onWeaponClicked">
        <svg-icon :fa-icon="weaponIcon" :size="25"/>
    </div>
</template>

<script setup>
import Weapon from "@/components/utilities/cards/weapons/Weapon.vue";
import {VanillaTilt} from "../VanillaTilt";
import {onMounted, onUnmounted} from "vue";
import { ref } from "vue";
import {getFormattedRemainingTime, format, getClearRemainingTime, getPourcentageRemainingTime} from "../DateFormator";
import {
    faHome as homeIcon,
    faArrowLeft as rightArrowIcon,
    faArrowRight as leftArrowIcon,
    faEarthEurope as planetIcon,
    faHeartCircleCheck as heartIcon,
    faHeart as heartEmptyIcon,
    faCircleCheck as selectedIcon,
    faCirclePlus as notSelectedIcon,
    faFire as fireIcon,
    faGun as weaponIcon,
} from "@fortawesome/free-solid-svg-icons";
import ProgressBar from "@/components/utilities/progressBar.vue";
import {RouterLink} from "vue-router";
import ExplorationInfo from "@/components/utilities/cards/ExplorationInfo.vue";

// show upgraded weapon
import {useBattleStore, useCardsStore} from "@/stores";
const cardsStore = useCardsStore();

const onWeaponUpgradedClicked = async () => {
    upgradedWeapon.value = await cardsStore.getWeaponById(action.weaponToUpgradeId);
}
const upgradedWeapon = ref(null);

const isActive = ref(false);
const {
    id,
    name,
    imageUrl,
    description,
    collection,
    rarity,
    competences,
    action,
    isFavorite,
    isSelected,
    hideFavorite,
    showSelection,
    weapon,
    power} = defineProps({
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
    },
    weapon: {
        type: Object,
        required: false,
        default: () => {}
    },
    power: {
        type: Number,
        required: true,
        default: 0
    },
    isFavorite: {
        type: Boolean,
        required: false,
        default: false
    },
    isSelected: {
        type: Boolean,
        required: false,
        default: null
    },
    hideFavorite: {
        type: Boolean,
        required: false,
        default: false
    },
    showSelection: {
        type: Boolean,
        required: false,
        default: false
    }

});
const emit = defineEmits(['cancelAction', 'switchFavorite', 'onClick', 'decision', 'onWeaponClicked']);
const clearRemainingTime = ref(getClearRemainingTime(action?.endTime));
const pourcentageRemainingTime = ref(getPourcentageRemainingTime(action?.endTime));
const tiltCard = ref(null);
const battleStore = useBattleStore();
let intervalId;
let tiltInstance;

onMounted(() => {
    if (tiltCard.value) {
        tiltInstance = new VanillaTilt(tiltCard.value, {
            glare: true,
            reverse: true,
            "max-glare": 0.15
        });
    }

    intervalId = setInterval(updateDates, 1000);
});

onUnmounted(() => {
    if (tiltInstance) {
        tiltInstance.destroy();
    }

    // Arrêter le setInterval
    if (intervalId) {
        clearInterval(intervalId);
    }
});

function updateDates() {
    // Votre logique pour mettre à jour les dates
    if (!action) return;
    clearRemainingTime.value = getClearRemainingTime(action?.endTime);
    pourcentageRemainingTime.value = getPourcentageRemainingTime(action?.endTime, action?.createdAt);
}

function onClick() {

    if (showSelection) {
        // Si l'événement onClick est défini par le parent, émettez-le
        emit('onClick', id);
    } else {
        // Sinon, exécutez la logique par défaut
        isActive.value = !isActive.value;
    }
}

function onWeaponClicked() {
    emit('onWeaponClicked', id);
}

function switchFavorite() {
    emit('switchFavorite');
}

function setDecisionForExploration(decision) {
    emit('decision', decision, action.id);
}

function cancelAction() {

    if (action.actionName === 'guerre*')
        battleStore.cancelBattle(action.warId);
    else
        emit('cancelAction', action.id);
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

.favoriteToggle {
    position: absolute;
    transform: translate(300%, 0);
    cursor: pointer;
    z-index: 2;
}

.favoriteToggle svg {
    color: white;
    font-size: 2rem;
}

.selectedToggle {
    position: absolute;
    transform: translate(150%, 0);
    cursor: pointer;
    z-index: 2;
}

.selectedToggle svg {
    color: white;
    font-size: 2rem;
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


.weaponInfo {
    z-index: 10;
    position: fixed;
    left: 2rem;
    bottom: 4rem;
    border: 1px solid white;
    border-radius: 15px;
    color:white;
    box-shadow: 5px 5px 15px rgba(0,0,0,0.9);
}

.emptyWeapon {
    width: 10rem;
    height: 10rem;
    border-radius: 1rem;
    margin: 1rem;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 2rem;
    font-weight: bold;
}

.emptyWeapon:hover {
    background: rgba(255, 255, 255, 0.2);
    cursor: pointer;
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

.card-id {
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: center;
    transform: translateX(1rem) translateY(0.5rem);
    filter: drop-shadow(0 0 0.1rem black);
}

.card-power {
    position: absolute;
    display: flex;
    align-items: end;
    justify-content: center;
    flex-direction: column;
    font-size: 1.5rem;
    font-weight: bold;
    font-family: "Big John", sans-serif;
    filter: drop-shadow(0 0 0.1rem black);
    transform: translateZ(30px) translateX(15.5rem) translateY(1.2rem);
}

.powerText {
    filter: drop-shadow(0 0 0.1rem #ff0000) !important;
}

.card-weapon {
    position: absolute;
    display: flex;
    align-items: end;
    justify-content: center;
    flex-direction: column;
    font-size: 2rem;
    font-weight: bold;
    font-family: "Big John", sans-serif;
    filter: drop-shadow(0 0 0.1rem black);
    transform: translateZ(30px) translateX(1.5rem) translateY(1rem);
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

.startActionText {
    font-size: 1.5rem;
    font-weight: bold;
    color: var(--color-text);
    text-align: center;
    margin: 0;
}

.startActionText:hover {
    color: var(--vt-c-red-2);
    filter: drop-shadow(0 0 4px var(--vt-c-red-2));
}

.weaponText {
    color: black;
    filter: drop-shadow(0 0 4px var(--vt-c-red-2));
}
</style>
