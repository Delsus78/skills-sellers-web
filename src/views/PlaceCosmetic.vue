<script setup>
import {storeToRefs} from "pinia";
import {useAuthStore, useCosmeticStore} from "@/stores";
import Cosmetic from "@/components/utilities/CosmeticMarket/Comsetic.vue";
import {useRoute} from "vue-router";
import { onMounted, onUnmounted, ref } from "vue";
import PlanetWithCosmetics from "@/components/utilities/CosmeticMarket/PlanetWithCosmetics.vue";
import {
    faChevronLeft as leaveIcon,
    faArrowUpWideShort as upIcon,
    faArrowDownWideShort as downIcon,
    faRotateRight as rotateIcon,
    faUpRightAndDownLeftFromCenter as sizeIcon,
    faClockRotateLeft as resetRotationIcon
} from "@fortawesome/free-solid-svg-icons";
import {router} from "@/helpers";
const authStore = useAuthStore();
const cosmeticStore = useCosmeticStore();
const { user: authUser } = storeToRefs(authStore);
const route = useRoute();
const cosmeticsDisplayed = ref([]);
const cosmeticsAvailable = ref([]);
const cosmeticIdToPlace = parseInt(route.query.cosmeticId);
const cosmeticEntityIdToPlace = parseInt(route.query.entityId || -1);
const isBuyingPlacement = ref(route.query.isbuyingPlacement === 'true' || false);

onMounted(async () => {
    if (cosmeticIdToPlace) {
        window.addEventListener('resize', getCenterOfThePlanet);
        window.addEventListener('mousemove', onMouseMove);
        window.addEventListener('mousedown', () => isMousePress.value = true);
        window.addEventListener('mouseup', () => isMousePress.value = false);
        window.addEventListener("wheel", onMouseWheel);
    }

    await refreshCosmetics();

    getCenterOfThePlanet();
});

onUnmounted(() => {
    if (cosmeticIdToPlace) {
        window.removeEventListener('resize', getCenterOfThePlanet);
        window.removeEventListener('mousemove', onMouseMove);
        window.removeEventListener('mousedown', () => isMousePress.value = true);
        window.removeEventListener('mouseup', () => isMousePress.value = false);
        window.removeEventListener("wheel", onMouseWheel);
    }
});


const centerOfThePlanetInTheScreen = ref({x: 0, y: 0});
const isMousePress = ref(false);
const isRotateMode = ref(false);
const cosmeticData = ref({
    "coordinateX": 0,
    "coordinateY": 0,
    "size": 1,
    "zIndex": 5,
    "rotation": 0
});

const refreshCosmetics = async () => {
    await cosmeticStore.getComseticsOfUser(authUser.value.id);
    const { cosmeticsDisplayed: userCosmetics } = storeToRefs(cosmeticStore);

    console.log("refreshing" + cosmeticEntityIdToPlace);
    cosmeticsDisplayed.value = userCosmetics.value.filter((cosm) => cosm.id !== cosmeticEntityIdToPlace);
    cosmeticsAvailable.value = userCosmetics.value;
}

const moveCosmetic = (e) => {

    // mouse position relative to the center of the planet
    const cosmetic = document.querySelector('.cosmeticImageToPlace');

    const x = e.clientX;
    const y = e.clientY;

    const actualX = x - centerOfThePlanetInTheScreen.value.x;
    const actualY = y - centerOfThePlanetInTheScreen.value.y;

    // move cosmetic
    cosmeticData.value.coordinateX = (actualX > 500 ? 500 : (actualX < -500 ? -500 : actualX));
    cosmeticData.value.coordinateY = (actualY > 325 ? 325 : (actualY < -500 ? -500 : actualY));

    // max x : 500, -500 / max y : 325, -500

    // refresh cosmetic position
    cosmetic.style.left = centerOfThePlanetInTheScreen.value.x + cosmeticData.value.coordinateX + 'px';
    cosmetic.style.top = centerOfThePlanetInTheScreen.value.y + cosmeticData.value.coordinateY + 'px';
}
const onMouseMove = function (event) {
    // if mouse is on the button, return
    if (event.target.classList.contains('validate')) {
        return;
    }

    if (isMousePress.value) {
        moveCosmetic(event);
    }
};
const onMouseWheel = function (event) {
    if (isRotateMode.value) {
        rotateCosmetic(event);
    } else {
        resizeCosmetic(event);
    }
};

const rotateCosmetic = (event) => {
    const delta = Math.sign(event.deltaY);
    cosmeticData.value.rotation += delta * 5;
}

const resizeCosmetic = (event) => {
    const delta = Math.sign(event.deltaY);
    if (cosmeticData.value.size + delta * -1 < -5) {
        return;
    } else if (cosmeticData.value.size + delta * -1 > 5) {
        return;
    }
    // transform into integer to avoid float precision
    cosmeticData.value.size += delta * -1;
}

const getCenterOfThePlanet = () => {
    const planet = document.querySelector('.cosmeticPlanet');

    let centerX = planet.offsetLeft + planet.offsetWidth / 2;
    let centerY = planet.offsetTop + planet.offsetHeight / 2;

    centerOfThePlanetInTheScreen.value = {
        x: centerX,
        y: centerY
    }
}

const actionOnValidatationPosition = async (event) => {
    event.preventDefault();
    if (isBuyingPlacement.value) {
        await cosmeticStore.buyCosmetic(cosmeticIdToPlace, cosmeticData.value);
    } else {
        await cosmeticStore.placeCosmetic(cosmeticEntityIdToPlace, cosmeticData.value);
    }
    await router.push('/cosmetic');
}

const handleCosmeticReplacementClick = (cosmeticId, entityId) => {
    router.push({path:'/cosmetic', query: {cosmeticId: cosmeticId, entityId: entityId}});
}

const moveZIndex = (number) => {
    cosmeticData.value.zIndex += number;
}

</script>
<template>
    <div class="placeCosmetic" v-if="cosmeticsDisplayed != null">
        <div class="availableCosmetics" v-if="!isBuyingPlacement">
            <div class="DivTitle">Cosmetiques disponibles</div>
            <div class="availableCosmeticsList">
                <Cosmetic v-for="cosmetic in cosmeticsAvailable"
                          :key="cosmetic.id"
                          :cosmetic-id="cosmetic.cosmeticId"
                          :class="[cosmetic.id === cosmeticEntityIdToPlace ? 'cosmeticSelectedInList' : 'cosmeticAvailableListItem']"
                          @click="handleCosmeticReplacementClick(cosmetic.cosmeticId, cosmetic.id)"/>
            </div>
        </div>
        <div class="tools_btn or validate">
            <svg-icon class="clickable" @click="moveZIndex(1)" :fa-icon="upIcon" :size="45"/>
            <svg-icon class="clickable" @click="moveZIndex(-1)" :fa-icon="downIcon" :size="45"/>
            <svg-icon class="clickable" @click="isRotateMode = !isRotateMode" v-if="isRotateMode" :fa-icon="rotateIcon" :size="45"/>
            <svg-icon class="clickable red" @click="cosmeticData.rotation = 0" v-if="isRotateMode" :fa-icon="resetRotationIcon" :size="25"/>
            <svg-icon class="clickable" @click="isRotateMode = !isRotateMode" v-if="!isRotateMode" :fa-icon="sizeIcon" :size="45"/>
        </div>
        <Cosmetic :cosmetic-id="cosmeticIdToPlace"
                  class="cosmeticImage cosmeticImageToPlace"
                  v-if="cosmeticIdToPlace"
                  :style="{
          left: centerOfThePlanetInTheScreen.x + cosmeticData.coordinateX + 'px',
          top: centerOfThePlanetInTheScreen.y + cosmeticData.coordinateY + 'px',
          transform: 'scale('+cosmeticData.size+') rotate(' + cosmeticData.rotation + 'deg)',
          zIndex: cosmeticData.zIndex}"/>
        <PlanetWithCosmetics id="planetWithCosmeticPlacement_001"
                             :height="850"
                             :width="850"
                             :player-pseudo="authUser.pseudo"
                             :cosmetics-displayed="cosmeticsDisplayed"/>
        <div class="buttons">
            <div class="leave red" @click="router.push('/')"><svg-icon :fa-icon="leaveIcon" :size="45"/></div>
            <button class="validate swipe-overlay-out"
                    :style="{display: cosmeticEntityIdToPlace === -1 && !isBuyingPlacement ? 'none' : ''}"
                    @click="actionOnValidatationPosition($event)">{{isBuyingPlacement ? 'Placer et payer' : 'Placer'}}</button>
        </div>
    </div>
</template>
<style scoped>
.placeCosmetic {
    user-select: none;
    overflow: hidden;
    height: 100%;
}

.cosmeticImage {
    position: absolute;
    width: 100px;
    height: 100px;
    user-select: none;
    z-index: 101;
    transform: translate(-50%, -50%);
    pointer-events: none;
}

.buttons {
    position: absolute;
    bottom: 4rem;
    left: 50%;
    z-index: 102;
    transform: translateX(-50%);
    cursor: pointer;
    transition: 0.3s;
    display: flex;
    align-items: flex-start;
    gap: 1rem;
}

.tools_btn {
    position: absolute;
    bottom: 4rem;
    right: 25%;
    z-index: 102;
    cursor: pointer;
    transition: 0.3s;
    display: flex;
    align-items: flex-start;
    gap: 1rem;

}

.leave {
    transition: all 0.2s ease-in-out;
    @media (max-width: 1023px) {
        width: 10%;
    }
}

.leave:hover {
    transform: scale(1.2);
    color: var(--vt-c-red-2);
    filter: drop-shadow(0 0 4px var(--vt-c-red-2));
}

.availableCosmetics {
    position: fixed;
    bottom: 3rem;
    top: 10rem;
    left: 3rem;
    padding: 2rem;
    width: 25rem;
    z-index: 102;
    display: grid;
    border-radius: 1rem;
    box-shadow: 0 0 1rem 0.5rem rgba(0, 0, 0, 0.2);
    backdrop-filter: blur(10px);
    overflow: hidden;
}

.availableCosmetics > .DivTitle {
    font-size: 2rem;
    text-align: center;
    margin-bottom: 1rem;
}

.availableCosmeticsList {
    display: flex;
    flex-wrap: nowrap;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
    overflow-y: auto;
    height: 100%;
    border-radius: 1rem;
    background-color: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    box-shadow: 0 0 1rem 0.5rem rgba(0, 0, 0, 0.2);
}

.availableCosmeticsList > * {
    cursor: pointer;
    height: 100px;
}

.availableCosmeticsList > .cosmeticAvailableListItem:hover {
    transform: scale(1.1);
}

.availableCosmeticsList > .cosmeticSelectedInList {
    transform: scale(1.1);
    filter: drop-shadow(0 0 4px #ffffff);
}
</style>