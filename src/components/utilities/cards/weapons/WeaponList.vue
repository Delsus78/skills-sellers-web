<script setup>

import Weapon from "@/components/utilities/cards/weapons/Weapon.vue";

import {storeToRefs} from "pinia";
import {useCardsStore, useMainStore} from "@/stores";
import {onMounted} from "vue";
import {
    faX as leaveIcon,
    faRotateRight as homeIcon
} from "@fortawesome/free-solid-svg-icons";

const cardsStore = useCardsStore();
const mainStore = useMainStore();
const { weapons } = storeToRefs(cardsStore);
const { cardIdToChange } = storeToRefs(mainStore);

onMounted(() => {
    cardsStore.getWeapons();
});

const reload = () => {
    cardsStore.getWeapons();
}

const leave = () => {
    mainStore.toggleWeaponList();
}

const click = (weapon) => {
    cardsStore.postChangeWeapon(weapon.id, cardIdToChange.value);
    mainStore.toggleWeaponList();
}

const removeWeapon = () => {
    cardsStore.postChangeWeapon(null, cardIdToChange.value);
    mainStore.toggleWeaponList();
}

</script>

<template>
    <div class="container bg-dark-blur">
      <div class="header-weapons">
          <svg-icon class="shadow-white leave" @click="leave" :fa-icon="leaveIcon" :size="24"/>
          <h2 class="DivTitle">VOS ARMES</h2>
          <svg-icon class="shadow-white" @click="reload" :fa-icon="homeIcon" :size="24"/>
      </div>
      <ul class="WeaponList">
        <Weapon v-for="weapon in weapons"
                class="weapon-item"
                :key="weapon.id"
                :weapon="weapon"
                :desactivated="weapon.userCardId !== null"
                @click="click"/>
      </ul>
        <button class="validate red swipe-overlay-out" @click="removeWeapon">Enlever l'arme</button>
    </div>
</template>

<style scoped>
.container {
    display: grid;
    grid-template-areas:
        "title"
        "list";
    grid-template-rows: 1fr 5fr;
    border-radius: 1rem;
    padding: 1rem;
    z-index: 10000;
    box-shadow: 0 0 1rem 0.5rem rgba(0, 0, 0, 0.2);
    border: 1px solid #ffffff;
}

.header-weapons {
    grid-area: title;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.header-weapons svg {
    position: absolute;
    top: 3.2rem;
    right: 2rem;
}

.header-weapons .leave {
    left: 2rem;
    color: #ff0000;
}

.header-weapons svg:hover {
    cursor: pointer;
    scale: 1.3;
}

.WeaponList {
    grid-area: list;
    list-style-type: none;
    padding: 0;
    margin: 0 2rem;
    overflow-y: auto;
}


.validate.red {
    transition: all 0.2s ease-in-out;
    z-index: 100;
    color: var(--vt-c-red-1) !important;
    border-color: var(--vt-c-red-1) !important;
    pointer-events: all;
    @media (max-width: 1023px) {
        width: 50%;
    }
}

.validate:hover {
    transform: scale(1.1);
}

.validate.red:hover {
    color: var(--vt-c-red-1) !important;
    filter: drop-shadow(0 0 4px var(--vt-c-red-1));
}

.validate.red::after {
    background: var(--vt-c-red-1);
}
</style>