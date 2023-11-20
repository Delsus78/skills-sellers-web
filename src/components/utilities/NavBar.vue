<script setup>
import { RouterLink } from 'vue-router';
import { useAuthStore, useUsersStore, useGiftStore } from "@/stores";
import RandomPlanet from "@/components/utilities/RandomPlanet.vue";
import {storeToRefs} from "pinia";
import {ref} from 'vue';
import TitleImage from "@/components/icons/TitleImage.vue";
import {
    faArrowRightToBracket as leaveIcon,
    faHome as homeIcon,
    faPeopleGroup as cardsIcon,
    faChartSimple as statsIcon,
    faBurger as foodIcon,
    faCoins as moneyIcon,
    faCubesStacked as creatiumIcon,
    faEarthEurope as planetIcon,
    faGift as giftIcon,
    faAnglesUp as upgradeIcon,
    faDice as gamesIcon,
    faBook as rulesIcon,
    faGifts as giftCodeIcon,
    faGear as settingsIcon,
    faShield as satelliteIcon,
    faBookAtlas as registreIcon
} from "@fortawesome/free-solid-svg-icons";
import Settings from "@/components/utilities/settings.vue";
const authStore = useAuthStore();
const usersStore = useUsersStore();
const giftStore = useGiftStore();
const { user: authUser } = storeToRefs(authStore);
const { actualUser: user } = storeToRefs(usersStore);

usersStore.getUser(authUser.value.id);

const isHovered = ref(false);
const isSettingsTabOpened = ref(false);

const { pageName } = defineProps({
    pageName: {
        type: String,
        required: true
    }
});

const openGiftCodePrompt = () => {
    const code = prompt('Code du cadeau');
    if (code) {
        giftStore.enterGiftCode(code);
    }
}

const openSettingsTab = () => {
    isSettingsTabOpened.value = !isSettingsTabOpened.value;
}

</script>

<template>
    <nav class="navbar top bg-dark-blur" v-if="pageName !== 'opening'">
        <RouterLink class="nav-title" to="/">
            <TitleImage in-line/>
        </RouterLink>
        <h1>{{ pageName.charAt(0).toUpperCase() + pageName.slice(1) }}</h1>
        <div class="navbar-nav">
            <RouterLink v-if="user.nbCardOpeningAvailable > 0" to="/opening"
                        class="nav-item"
                        v-tooltip:bottom.tooltip="'Pack Opening !'">
                <span class="colored">
                    {{ user.nbCardOpeningAvailable }}<svg-icon :fa-icon="giftIcon" :size="40" />
                </span>
            </RouterLink>
            <RouterLink v-if="user.cardsDoublons?.length > 0" to="/upgrade"
                        v-tooltip:bottom.tooltip="'Amélioration disponible !'"
                        class="nav-item">
                <span class="colored">
                    {{ user.cardsDoublons?.length }}<svg-icon :fa-icon="upgradeIcon" :size="40" />
                </span>
            </RouterLink>
            <RouterLink to="/"
                        class="nav-item"
                        :class="{selected: pageName === ''}"
                        v-tooltip:bottom.tooltip="'Page principale'">
                <svg-icon class="shadow-white" :fa-icon="homeIcon" :size="36"/>
            </RouterLink>
            <RouterLink :to="`/cards`"
                        :class="{selected: pageName === 'cards'}"
                        v-tooltip:bottom.tooltip="'Vos cartes'"
                        class="nav-item">
                <svg-icon class="shadow-white" :fa-icon="cardsIcon" :size="36"/>
            </RouterLink>
            <RouterLink :to="`/stats/${authUser.id}`"
                        v-tooltip:bottom.tooltip="'Statistiques'"
                        :class="{selected: pageName === 'stats'}"
                        class="nav-item">
                <svg-icon class="shadow-white" :fa-icon="statsIcon" :size="36"/>
            </RouterLink>
            <RouterLink :to="`/batiments`"
                        v-tooltip:bottom.tooltip="'Batiments & Actions'"
                        :class="{selected: pageName === 'batiments'}"
                        class="nav-item">
                <svg-icon class="shadow-white" :fa-icon="planetIcon" :size="36"/>
            </RouterLink>
            <RouterLink :to="`/satellites`"
                        v-tooltip:bottom.tooltip="'Guerres et Protection'"
                        :class="{selected: pageName === 'satellites'}"
                        class="nav-item">
                <svg-icon class="shadow-white" :fa-icon="satelliteIcon" :size="36"/>
            </RouterLink>
            <RouterLink :to="`/registre`"
                        v-tooltip:bottom.tooltip="'Registre de planète'"
                        :class="{selected: pageName === 'registre'}"
                        class="nav-item">
                <svg-icon class="shadow-white" :fa-icon="registreIcon" :size="36"/>
            </RouterLink>
            <RouterLink :to="`/games`"
                        :class="{selected: pageName === 'games'}"
                        v-tooltip:bottom.tooltip="'Jeux'"
                        class="nav-item">
                <svg-icon class="shadow-white" :fa-icon="gamesIcon" :size="36"/>
            </RouterLink>
            <a @click="openGiftCodePrompt"
               v-tooltip:bottom.tooltip="'Code cadeau'"
               class="nav-item"><svg-icon class="green" :fa-icon="giftCodeIcon" :size="36"/></a>
        </div>
        <Settings :style="{display: isSettingsTabOpened ? 'block' : 'none'}" class="bg-dark-blur"/>
        <div class="player-infos">
            <span class="pseudoText">{{authUser.pseudo}}</span>
            <a @click="authStore.logout()"><svg-icon class="logout shadow-white" :fa-icon="leaveIcon" :size="26"/></a>
            <RouterLink :to="`/rules`"><svg-icon class="rules" :fa-icon="rulesIcon" :size="26"/></RouterLink>
            <a @click="openSettingsTab"><svg-icon class="settings" :fa-icon="settingsIcon" :size="26"/></a>
            <div class="resources bg-dark-blur"
                 @mouseenter="isHovered = true"
                 @mouseleave="isHovered = false">
            </div>

            <span class="text food" :class="{ moved: isHovered }">
                {{ user.nourriture }}
                <span class="resource-name">{{ isHovered ? 'repas' : ''}}</span>
                <svg-icon class="shadow-black" :fa-icon="foodIcon" :size="18"/>
            </span>

            <span class="text or" :class="{ moved: isHovered }">
                {{ user.or }}
                 <span class="resource-name">{{ isHovered ? 'or' : ''}}</span>
                <svg-icon class="shadow-black" :fa-icon="moneyIcon" :size="18"/>
            </span>

            <span class="text creatium" :class="{ moved: isHovered }">
                {{ user.creatium }}
                <span class="resource-name">{{ isHovered ? 'creatium' : ''}}</span>
                <svg-icon class="shadow-black" :fa-icon="creatiumIcon" :size="18"/>
            </span>

            <RandomPlanet v-model="authUser.pseudo" class="planet" :width="250" :height="250"/>
        </div>
    </nav>
    <div class="version">
        <span class="version-text prevent-select">Version 2.0 - SpaceWar Update</span>
    </div>
</template>
<style scoped>
.navbar {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    z-index: 2000;
    height: 5rem;
    padding: 1rem;
    display: flex;
    background-image: linear-gradient(to right, transparent, rgb(217, 188, 188), transparent);
    background-size: 100% 1px; /* 2px est l'épaisseur de la "bordure". Ajustez selon vos besoins */
    background-repeat: no-repeat;
    background-position: bottom;
}

h1 {
    height: 4rem;
    width: 5rem;
}

.navbar .nav-title {
    width: 20rem;
    margin: 0 10px;
    text-decoration: none;
    display: flex;
    align-items: center;

}

.navbar-nav {
    box-sizing: border-box;
    width: 65%;
    height: 100%;
    display: flex;
    margin-right: 18rem;
    align-items: center;
    justify-content: center;
}

.nav-item {
    color: white;
    font-size: 2rem;
    font-weight: bold;
    margin: 0 10px;
    text-decoration: none;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    transition: transform 0.1s ease-in-out;
}

.nav-item:hover {
    transform: scale(1.3);
}

.nav-item.selected {
    transform: scale(1.3);
}

.navbar .player-infos {
    position: fixed;
    right: 0;
    top: 0;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin: 0 10px;
}

.player-infos .planet {
    position: fixed;
    right: 0;
    top: -100%;
    z-index: 101;

}

.player-infos .pseudoText {
    position: fixed;
    right: 15rem;
    top: 0.5rem;
    color: white;
    font-size: 20px;
    font-weight: bold;
    text-shadow: 0 0 1rem var(--vt-c-white-dark);
}

.player-infos .logout {
    position: fixed;
    right: 15rem;
    top: 2.5rem;
    transition: all 0.2s ease-in-out;
}

.player-infos .rules {
    position: fixed;
    right: 17rem;
    top: 2.5rem;
    transition: all 0.2s ease-in-out;
    text-decoration: none;
    color: lightgrey;
}

.player-infos .settings {
    position: fixed;
    right: 19rem;
    top: 2.5rem;
    transition: all 0.2s ease-in-out;
    text-decoration: none;
    color: lightgrey;
}

.player-infos .settings:hover {
    color: var(--vt-c-blue-1);
    cursor: pointer;
    filter: drop-shadow(0 0 4px var(--vt-c-black));
}

.player-infos .rules:hover {
    color: var(--vt-c-green-1);
    cursor: pointer;
    filter: drop-shadow(0 0 4px var(--vt-c-black));
}

.player-infos .logout:hover  {
    color: var(--vt-c-red-1);
    cursor: pointer;
    filter: drop-shadow(0 0 4px var(--vt-c-black));
}

.player-infos .resources {
    position: fixed;
    right: 9rem;
    top: 5rem;
    width: 18rem;
    height: 80%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    z-index: 90;
    border-radius: 0 0 0 1rem;
    box-shadow: 0 0 1rem black;

}

.player-infos .text {
    position: fixed;
    width: 2rem;
    font-size: 20px;
    font-weight: bold;
    text-shadow: 0 0 0.5rem var(--vt-c-white-dark);
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-auto-flow: column;
    grid-gap: 0.5rem;
    align-items: center;
    justify-content: end;
    transition: transform 0.3s ease-in-out, opacity 0.3s ease-in-out;
    z-index: 102;
    pointer-events: none;
}

.player-infos .or {
    right: 15rem;
    top: 4.8rem;
    color: yellow;
}

.player-infos .food {
    right: 15rem;
    top: 6rem;
    color: yellowgreen;
}

.player-infos .creatium {
    right: 15rem;
    top: 7.2rem;
    color: #2fc9e2;
}

.player-infos .moved {
    transform: scale(1.2);
}

.player-infos .text .resource-name {
    opacity: 0;
    transition: opacity 0.3s ease-in-out, opacity 0.3s ease-in-out;
}

.player-infos .text.moved .resource-name {
    opacity: 1;
}

.version {
    position: fixed;
    bottom: 0;
    right: 0;
    color: gray;
    font-size: 1rem;
    margin: 0 10px;
}
</style>