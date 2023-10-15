<script setup>
import { RouterLink } from 'vue-router';
import { useAuthStore, useUsersStore } from "@/stores";
import RandomPlanet from "@/components/utilities/RandomPlanet.vue";
import {storeToRefs} from "pinia";
import {onMounted, ref} from 'vue';
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
} from "@fortawesome/free-solid-svg-icons";
const authStore = useAuthStore();
const usersStore = useUsersStore();
const { user: authUser } = storeToRefs(authStore);
const { actualUser: user } = storeToRefs(usersStore);

usersStore.getUser(authUser.value.id);

const isHovered = ref(false);

const { pageName } = defineProps({
    pageName: {
        type: String,
        required: true
    }
});

</script>

<template>
    <nav class="navbar top bg-dark-blur" v-if="pageName !== 'opening'">
        <RouterLink class="nav-title" to="/">
            <TitleImage in-line/>
        </RouterLink>
        <h1>{{ pageName }}</h1>
        <div class="navbar-nav">
            <RouterLink v-if="user.nbCardOpeningAvailable > 0" to="/opening" class="nav-item">
                <span class="colored">
                    {{ user.nbCardOpeningAvailable }}<svg-icon :fa-icon="giftIcon" :size="40" />
                </span>
            </RouterLink>
            <RouterLink v-if="user.cardsDoubledIds?.length > 0" to="/upgrade" class="nav-item">
                <span class="colored">
                    {{ user.cardsDoubledIds?.length }}<svg-icon :fa-icon="upgradeIcon" :size="40" />
                </span>
            </RouterLink>
            <RouterLink to="/" class="nav-item"><svg-icon class="shadow-white" :fa-icon="homeIcon" :size="36"/></RouterLink>
            <RouterLink :to="`/cards`" class="nav-item"><svg-icon class="shadow-white" :fa-icon="cardsIcon" :size="36"/></RouterLink>
            <RouterLink :to="`/stats/${authUser.id}`" class="nav-item"><svg-icon class="shadow-white" :fa-icon="statsIcon" :size="36"/></RouterLink>
            <RouterLink :to="`/batiments`" class="nav-item"><svg-icon class="shadow-white" :fa-icon="planetIcon" :size="36"/></RouterLink>
            <RouterLink :to="`/games`" class="nav-item"><svg-icon class="shadow-white" :fa-icon="gamesIcon" :size="36"/></RouterLink>
        </div>

        <div class="player-infos">
            <span class="pseudoText">{{authUser.pseudo}}</span>
            <a @click="authStore.logout()"><svg-icon class="logout shadow-white" :fa-icon="leaveIcon" :size="26"/></a>
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
</template>
<style scoped>
.navbar {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    z-index: 100;
    height: 5rem;
    padding: 1rem;
    display: flex;
    background-image: linear-gradient(to right, transparent, rgb(217, 188, 188), transparent); /* Remplacez #000 par la couleur de votre choix */
    background-size: 100% 1px; /* 2px est l'épaisseur de la "bordure". Ajustez selon vos besoins */
    background-repeat: no-repeat;
    background-position: bottom;
}

h1 {
    height: 4rem;
    width: 5rem;
}

.navbar .nav-title {
    width: 40rem;
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

.colored {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 2rem;
    font-weight: bold;
    margin:  2rem;
    animation: colorChange 6s linear infinite;
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
</style>