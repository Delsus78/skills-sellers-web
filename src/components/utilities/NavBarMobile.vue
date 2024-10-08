<script setup>
import { RouterLink } from 'vue-router';
import {useAuthStore, useUsersStore, useGiftStore, useMainStore, useBattleStore} from "@/stores";
import RandomPlanet from "@/components/utilities/RandomPlanet.vue";
import {storeToRefs} from "pinia";
import {computed, ref} from 'vue';
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
    faBars as menuIcon,
    faW as wordleIcon,
    faTree as noelIcon,
    faShield as satelliteIcon,
    faBookAtlas as registreIcon,
    faBookDead as fightIcon,
    faPeopleArrows as playersRegistreIcon,
    faGun as weaponIcon,
    faSkullCrossbones as warInviteIcon
} from "@fortawesome/free-solid-svg-icons";
const authStore = useAuthStore();
const usersStore = useUsersStore();
const giftStore = useGiftStore();
const mainStore = useMainStore();
const battleStore = useBattleStore();
const { user: authUser } = storeToRefs(authStore);
const { actualUser: user } = storeToRefs(usersStore);
const { isMobileSize } = storeToRefs(mainStore);
const { invitedWar } = storeToRefs(battleStore);

usersStore.getUser(authUser.value.id);

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

const isUnrolled = ref(false);
const unrollNavBar = () => {
    isUnrolled.value = !isUnrolled.value;
}

const isChristmas = computed(() => {
    const date = new Date();
    return date.getMonth() === 11 && date.getDate() <= 25;
});

</script>
<template>
    <div v-if="isMobileSize" class="navbar-mobile top">
        <div class="openNavBar" @click="unrollNavBar">
            <random-planet v-model="authUser.pseudo" class="planet" :width="250" :height="250"/>
            <svg-icon :class="{menuIcon: !isUnrolled, menuIconActive: isUnrolled}"
                      :fa-icon="menuIcon" :size="70" />
        </div>

        <div class="mobile-nav-items" :class="{hidden: !isUnrolled}">
            <RouterLink v-if="invitedWar?.isInvitationPending"
                        to="/bataille?invitation=true" class="nav-item" v-tooltip:bottom.tooltip="'INVITATION A UNE GUERRE'">
                <span class="meethicColored">
                    <svg-icon :fa-icon="warInviteIcon" :size="40" />
                </span>
            </RouterLink>
            <RouterLink v-if="isChristmas"
                        to="/special" class="nav-item" v-tooltip:bottom.tooltip="'NOEL'">
                <span class="epicColored">
                    <svg-icon :fa-icon="noelIcon" :size="40" />
                </span>
            </RouterLink>
            <RouterLink class="nav-item" v-if="user.nbCardOpeningAvailable > 0" to="/opening"
                        v-tooltip:bottom.tooltip="'Pack Opening !'">
                <span class="colored">
                    {{ user.nbCardOpeningAvailable }}<svg-icon :fa-icon="giftIcon" :size="30" />
                </span>
            </RouterLink>
            <RouterLink class="nav-item" v-if="user.cardsDoublons?.length > 0" to="/upgrade/card"
                        v-tooltip:bottom.tooltip="'Amélioration disponible !'">
                <span class="colored">
                    {{ user.cardsDoublons?.length }}<svg-icon :fa-icon="upgradeIcon" :size="30" />
                </span>
            </RouterLink>
            <RouterLink v-if="user.nbWeaponOpeningAvailable > 0" to="/opening/weapon"
                        v-tooltip:bottom.tooltip="'Nouvelle arme disponible !'"
                        class="nav-item">
                <span class="colored">
                    {{ user.nbWeaponOpeningAvailable }}<svg-icon :fa-icon="weaponIcon" :size="40" />
                </span>
            </RouterLink>
            <RouterLink class="nav-item" to="/"
                        :class="{selected: pageName === ''}"
                        v-tooltip:bottom.tooltip="'Page principale'">
                <svg-icon class="shadow-white" :fa-icon="homeIcon" :size="30"/>
            </RouterLink>
            <RouterLink class="nav-item" :to="`/cards`"
                        :class="{selected: pageName === 'cards'}"
                        v-tooltip:bottom.tooltip="'Vos cartes'">
                <svg-icon class="shadow-white" :fa-icon="cardsIcon" :size="30"/>
            </RouterLink>
            <RouterLink class="nav-item" :to="`/stats/${authUser.id}`"
                        v-tooltip:bottom.tooltip="'Statistiques'"
                        :class="{selected: pageName === 'stats'}">
                <svg-icon class="shadow-white" :fa-icon="statsIcon" :size="30"/>
            </RouterLink>
            <RouterLink class="nav-item" :to="`/batiments`"
                        v-tooltip:bottom.tooltip="'Batiments & Actions'"
                        :class="{selected: pageName === 'batiments'}">
                <svg-icon class="shadow-white" :fa-icon="planetIcon" :size="30"/>
            </RouterLink>
            <RouterLink class="nav-item" :to="`/satellites`"
                        v-tooltip:bottom.tooltip="'Guerres et Protection'"
                        :class="{selected: pageName === 'satellites'}">
                <svg-icon class="shadow-white" :fa-icon="satelliteIcon" :size="30"/>
            </RouterLink>
            <RouterLink class="nav-item" :to="`/registre/${authUser.id}`"
                        v-tooltip:bottom.tooltip="'Registre de planète'"
                        :class="{selected: pageName === 'registre'}">
                <svg-icon class="shadow-white" :fa-icon="registreIcon" :size="30"/>
            </RouterLink>

            <RouterLink :to="`/registre/fightreports`"
                        v-tooltip:bottom.tooltip="'Registre des combats'"
                        :class="{selected: pageName === 'registre'}"
                        class="nav-item registre">
                <svg-icon class="shadow-white" :fa-icon="fightIcon" :size="36"/>
            </RouterLink>
            <RouterLink :to="`/registre/${authUser.id}/playersregistre`"
                        v-tooltip:bottom.tooltip="'Registre des joueurs'"
                        :class="{selected: pageName === 'registre'}"
                        class="nav-item registre second">
                <svg-icon class="shadow-white" :fa-icon="playersRegistreIcon" :size="36"/>
            </RouterLink>

            <RouterLink class="nav-item" :to="`/games`"
                        :class="{selected: pageName === 'games'}"
                        v-tooltip:bottom.tooltip="'Jeux'">
                <svg-icon class="shadow-white" :fa-icon="gamesIcon" :size="30"/>
            </RouterLink>
            <RouterLink :to="`/wordle`"
                        :class="{selected: pageName === 'wordle'}"
                        v-tooltip:bottom.tooltip="'Wordle'"
                        class="nav-item">
                <svg-icon class="shadow-white" :fa-icon="wordleIcon" :size="36"/>
            </RouterLink>
            <a @click="openGiftCodePrompt" class="nav-item"
               v-tooltip:bottom.tooltip="'Code cadeau'">
                <svg-icon class="green" :fa-icon="giftCodeIcon" :size="30"/>
            </a>

            <div class="player-infos">
                <span class="pseudoText">{{authUser.pseudo}}</span>
                <a @click="authStore.logout()"><svg-icon class="logout shadow-white" :fa-icon="leaveIcon" :size="26"/></a>
                <RouterLink :to="`/rules`"><svg-icon class="rules" :fa-icon="rulesIcon" :size="26"/></RouterLink>

                <span class="text food">
                    {{ user.nourriture }}
                    <svg-icon class="shadow-black" :fa-icon="foodIcon" :size="18"/>
                </span>

                <span class="text or">
                    {{ user.or }}
                    <svg-icon class="shadow-black" :fa-icon="moneyIcon" :size="18"/>
                </span>

                <span class="text creatium">
                    {{ user.creatium }}
                    <svg-icon class="shadow-black" :fa-icon="creatiumIcon" :size="18"/>
                </span>
            </div>
        </div>
    </div>

    <div class="version">
        <span class="version-text prevent-select">Version 2.6</span>
    </div>
</template>

<style scoped>
.navbar-mobile {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.5rem 1rem;
    user-select: none;
}

.navbar-mobile .openNavBar {
    display: flex;
    width: 100%;
    justify-content: center;
}

.navbar-mobile .openNavBar .menuIcon {
    position: absolute;
    left: 0;
    right: 0;
    margin: auto;
    cursor: pointer;
    opacity: 0.5;
}

.navbar-mobile .openNavBar .menuIconActive {
    position: absolute;
    left: 0;
    right: 0;
    top: 3rem;
    margin: auto;
    cursor: pointer;
    opacity: 0.5;
}

.navbar-mobile .openNavBar .planet {
    position: fixed;
    left: auto;
    right: auto;
    transform: scale(2.4);
    cursor: pointer;
    top: -15rem;
}

.navbar-mobile .mobile-nav-items {
    position: absolute;
    top: 5rem;
    z-index: 10002;
    transition: all 0.3s ease;
}

.navbar-mobile .mobile-nav-items.hidden {
    opacity: 0;
    pointer-events: none;
}

.navbar-mobile .mobile-nav-items .nav-item {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 5rem;
    height: 5rem;
    border-radius: 50%;
    background: rgb(0, 0, 0, 0.2);
    backdrop-filter: blur(10px);
    margin: 0.5rem;
    transition: all 0.3s ease;
    transform: translateY(1rem);
}

.navbar-mobile .mobile-nav-items a,
.navbar-mobile .mobile-nav-items RouterLink {
    color: #FFF;
}

.navbar-mobile .mobile-nav-items a:hover,
.navbar-mobile .mobile-nav-items RouterLink:hover {
    background: rgba(255, 255, 255, 0.1);
}

.player-infos {
    display: flex;
    place-content: space-between;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 10003;
    background: rgb(0, 0, 0, 0.2);
    backdrop-filter: blur(10px);
    padding: 0.5rem 1rem;
    border-bottom-left-radius: 1rem;
    border-bottom-right-radius: 1rem;
    flex-direction: row;
    flex-wrap: nowrap;
    align-items: flex-end;
}

.player-infos .pseudoText {
    font-size: 1.5rem;
    font-weight: bold;
}

.player-infos .resources {
    display: flex;
    justify-content: center;
    align-items: center;
    place-content: space-between;
    margin-right: 1rem;
}

.player-infos .resources .text svg-icon {
    margin-left: 0.5rem;
}

.player-infos .or {
    color: yellow;
}

.player-infos .food {
    color: yellowgreen;
}

.player-infos .creatium {
    color: #2fc9e2;
}

.player-infos .logout {
    transition: all 0.2s ease-in-out;
    color: var(--vt-c-red-1);
    filter: drop-shadow(0 0 4px var(--vt-c-black));
}

.player-infos .rules {
    transition: all 0.2s ease-in-out;
    text-decoration: none;
    color: var(--vt-c-green-1);
    filter: drop-shadow(0 0 4px var(--vt-c-black));
}

.version {
    position: fixed;
    bottom: 0;
    right: 0;
    color: gray;
    font-size: 1rem;
    margin: 0 10px;
    z-index: 10003;
}
</style>
