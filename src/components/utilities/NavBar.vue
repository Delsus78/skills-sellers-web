<script setup>
import { RouterLink } from 'vue-router';
import { useAuthStore } from "@/stores";
import RandomPlanet from "@/components/utilities/RandomPlanet.vue";
import {storeToRefs} from "pinia";
import TitleImage from "@/components/icons/TitleImage.vue";
import {
    faArrowRightToBracket as leaveIcon,
    faHome as homeIcon,
    faPeopleGroup as cardsIcon,
    faChartSimple as statsIcon
} from "@fortawesome/free-solid-svg-icons";
const authStore = useAuthStore();
const { user: authUser } = storeToRefs(authStore);

const { pageName } = defineProps({
    pageName: {
        type: String,
        required: true
    }
});
</script>

<template>
    <nav class="navbar top bg-dark-blur">
        <RouterLink class="nav-title" to="/">
            <TitleImage in-line/>
        </RouterLink>
        <h1>{{ pageName }}</h1>
        <div class="navbar-nav">
            <RouterLink to="/" class="nav-item"><svg-icon class="shadow-white" :fa-icon="homeIcon" :size="36"/></RouterLink>
            <a @click="authStore.logout()" class="nav-item"><svg-icon class="shadow-white" :fa-icon="leaveIcon" :size="36"/></a>
            <RouterLink :to="`/cards/${authUser.id}`" class="nav-item"><svg-icon class="shadow-white" :fa-icon="cardsIcon" :size="36"/></RouterLink>
            <RouterLink :to="`/stats/${authUser.id}`" class="nav-item"><svg-icon class="shadow-white" :fa-icon="statsIcon" :size="36"/></RouterLink>
        </div>

        <span class="PseudoText">{{authUser.pseudo}}</span>
        <RandomPlanet v-model="authUser.pseudo" class="planet" :width="250" :height="250"/>
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
}

.navbar-nav {
    box-sizing: border-box;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
}

.navbar .planet {
    position: fixed;
    right: 0;
    top: -100%;
    z-index: 101;
}

.nav-item {
    color: white;
    font-size: 20px;
    margin: 0 10px;
    text-decoration: none;
}

.nav-item:hover {
    color: #3574f0;
}

.PseudoText {
    position: fixed;
    right: 15rem;
    top: 1rem;
    color: white;
    font-size: 20px;
    text-shadow: 0 0 1rem var(--vt-c-white-dark);
}
</style>