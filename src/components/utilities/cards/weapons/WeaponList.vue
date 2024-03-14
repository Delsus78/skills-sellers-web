<script setup>

import Weapon from "@/components/utilities/cards/weapons/Weapon.vue";

import {storeToRefs} from "pinia";
import {useCardsStore, useMainStore, useSettingsStore} from "@/stores";
import {computed, onMounted, ref} from "vue";
import {
    faX as leaveIcon,
    faRotateRight as homeIcon,
    faArrowUpWideShort as sortUpIcon,
    faArrowDownWideShort as sortDownIcon,
    faEye as eyeIcon,
    faEyeSlash as eyeSlashIcon,
    faA as AllIcon
} from "@fortawesome/free-solid-svg-icons";
import AffinityIcon from "@/components/utilities/cards/weapons/AffinityIcon.vue";

const cardsStore = useCardsStore();
const mainStore = useMainStore();
const filtersStore = useSettingsStore();
const { weapons } = storeToRefs(cardsStore);
const { cardIdToChange } = storeToRefs(mainStore);

const selectedWeaponId = ref(null);

cardsStore.getWeapons();

const emit = defineEmits(['clickOnWeapon','clickRemoveWeapon', 'leave']);

const { withCustomClick, noFilters, noRemoveBtn, noDesact, noLeaveBtn } = defineProps({
    withCustomClick: {
        type: Boolean,
        default: false
    },
    noFilters: {
        type: Boolean,
        default: false
    },
    noRemoveBtn: {
        type: Boolean,
        default: false
    },
    noDesact: {
        type: Boolean,
        default: false
    },
    noLeaveBtn: {
        type: Boolean,
        default: false
    }
});

// filters
const sortUpFilter = ref(filtersStore.weaponsFilters?.sortUp ?? true);
const InUseFilter = ref(filtersStore.weaponsFilters?.InUse ?? false);
const SkillFilter = ref(filtersStore.weaponsFilters?.Skill ?? 3);

const filteredList = computed(() => {
    let result = weapons.value;

    if (result?.length === 0 || result.loading ) {
        return [];
    }

    if(noFilters) {
        result = result.sort((a, b) => b.power - a.power);
        return result;
    }

    if (!InUseFilter.value) {
        result = result.filter((weapon) => weapon.userCardId === null);
    }

    if (sortUpFilter.value) {
        result = result.sort((a, b) => b.power - a.power);
    } else {
        result = result.sort((a, b) => a.power - b.power);
    }

    if (SkillFilter.value !== 3) {
        result = result.filter((weapon) => weapon.affinity === SkillFilter.value);
    }

    // save filters
    filtersStore.weaponsFilters = {
        sortUp: sortUpFilter.value,
        InUse: InUseFilter.value,
        Skill: SkillFilter.value
    };

    return result;
});

const reload = () => {
    cardsStore.getWeapons();
}

const leave = () => {
    if (withCustomClick) {
        emit('leave');
        return;
    }
    mainStore.toggleWeaponList();
}

const click = (weapon) => {
    selectedWeaponId.value = weapon.id;
    // si un event onClick est défini dans le parent (WeaponList), on l'appelle
    if (withCustomClick) {
        emit('clickOnWeapon', weapon);
        return;
    }

    cardsStore.postChangeWeapon(weapon.id, cardIdToChange.value);
    mainStore.toggleWeaponList();
}

const removeWeapon = () => {
    // si un event onClick est défini dans le parent (WeaponList), on l'appelle
    if (withCustomClick) {
        emit('clickRemoveWeapon');
        return;
    }

    cardsStore.postChangeWeapon(null, cardIdToChange.value);
    mainStore.toggleWeaponList();
}

</script>

<template>
    <div class="container bg-dark-blur">
      <div class="header-weapons">
          <svg-icon v-if="!noLeaveBtn" class="shadow-white leave" @click="leave" :fa-icon="leaveIcon" :size="24"/>
          <h2 class="DivTitle">VOS ARMES</h2>
          <span class="filters" v-if="!noFilters">
              <svg-icon v-if='sortUpFilter' class="shadow-white sortFilter" @click="sortUpFilter = !sortUpFilter" :fa-icon="sortUpIcon" :size="24"/>
              <svg-icon v-else class="shadow-white sortFilter" @click="sortUpFilter = !sortUpFilter" :fa-icon="sortDownIcon" :size="24"/>

              <svg-icon v-if='InUseFilter' class="shadow-white inUseFilter" @click="InUseFilter = !InUseFilter" :fa-icon="eyeIcon" :size="24"/>
              <svg-icon v-else class="shadow-white inUseFilter" @click="InUseFilter = !InUseFilter" :fa-icon="eyeSlashIcon" :size="24"/>

              <AffinityIcon v-if="SkillFilter !== 3" class="shadow-white skillFilter" :affinity-id="SkillFilter" @click="SkillFilter = (SkillFilter + 1) % 4" :size="24"/>
              <svg-icon v-else class="shadow-white skillFilter" @click="SkillFilter = (SkillFilter + 1) % 4" :fa-icon="AllIcon" :size="24"/>

              <svg-icon class="shadow-white" @click="reload" :fa-icon="homeIcon" :size="24"/>
          </span>
      </div>
      <ul class="WeaponList">
          <Weapon v-for="weapon in filteredList" :class="{'selected': selectedWeaponId === weapon.id}"
                  :key="weapon.id"
                  :weapon="weapon"
                  :desactivated="weapon.userCardId !== null && !noDesact"
                  @click="click"/>
      </ul>
        <button v-if="!noRemoveBtn" class="validate red swipe-overlay-out" @click="removeWeapon">Enlever l'arme</button>
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
    min-width: 45rem;
}


.selected {
    box-shadow: 0 0 1rem 0.5rem white;
}

.header-weapons {
    grid-area: title;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 0 2rem;
}

.header-weapons .filters {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: auto;
    gap: 1rem;
}

.header-weapons .leave {
    left: 2rem;
    color: #ff0000;
    filter: drop-shadow(0 0 0.5rem #ff0000);
}

.header-weapons .leave:hover {
    cursor: pointer !important;
    scale: 1.4 !important;
}

.header-weapons .sortFilter {
    right: 6rem;
    color: #ffffff;
}

.header-weapons .inUseFilter {
    right: 10rem;
    color: #ffffff;
}

.header-weapons .skillFilter {
    right: 10rem;
    color: #ffffff;
}

.header-weapons .filters *:hover {
    cursor: pointer !important;
    scale: 1.3 !important;
}

.WeaponList {
    grid-area: list;
    list-style-type: none;
    padding: 0;
    margin: 0 2rem;
    overflow-y: auto;
    overflow-x: hidden;
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