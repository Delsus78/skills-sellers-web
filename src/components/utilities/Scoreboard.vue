<template>
    <div class="Scoreboard bg-dark-blur">
        <div class="header-scoreboard">
            <h2 class="DivTitle">SCOREBOARD</h2>
            <svg-icon class="shadow-white" @click="reload" :fa-icon="homeIcon" :size="24"/>
        </div>
        <div class="header-information">
            <div v-if="players.loading">
                <p class="text-loading">Chargement du scoreboard...</p>
            </div>
            <div v-if="players.error" class="text-danger">Error loading players: {{players.error}}</div>
            <div v-if="players.length">
                <p class="subtitle">{{ players.length }} Joueurs !</p>
            </div>
        </div>
        <div class="headers-list">
            <span>Joueur</span>
            <span>Cartes</span>
            <span>Score</span>
        </div>

        <ul class="player-list">
            <li v-for="player in players" :key="player.id" class="player-item">
                <span>{{ player.pseudo }}</span>
                <span>1999</span>
                <span>{{ player.id }}</span>
            </li>
        </ul>
        <div class="footer-scoreboard">
            <p>Dernière mise à jour : {{ lastUpdate }}</p>
        </div>
    </div>
</template>
<script setup>
import {defineProps, ref} from 'vue';
import {faRotateRight as homeIcon} from "@fortawesome/free-solid-svg-icons";

    const emit = defineEmits(['reload']);

    const { players } = defineProps({
        players: {
        type: Object,
        default: () => []
        }
    });

    const lastUpdate = ref(new Date().toLocaleString());

    const reload = () => {
        lastUpdate.value = new Date().toLocaleString();
        emit('reload');
    };

</script>
<style scoped>
.Scoreboard {
    display: grid;
    grid-template-rows: 2fr 2fr 2fr 18fr 2fr;
    grid-template-areas: "title" "information" "headers" "stats" "footer";
    padding: 1rem;
    margin: 3rem;
    border-radius: 1rem;
    box-shadow: 0 0 1rem 0.5rem rgba(0, 0, 0, 0.2);
    backdrop-filter: blur(5px);  /* Effet de flou sur l'arrière-plan */
}

.header-scoreboard {
    grid-area: title;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.header-scoreboard svg {
    position: absolute;
    top: 3.2rem;
    right: 2rem;
}

.header-scoreboard svg:hover {
    cursor: pointer;
}

.header-information {
    margin: 1rem auto;
    grid-area: information;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.headers-list {
    grid-area: headers;
    display: flex;
    justify-content: space-between;
    padding: 0.5rem 2rem; /* Padding pour espacer les en-têtes de la bordure */
    color: #ffffff; /* Nuance de blanc pour le texte des en-têtes */
    font-weight: bold;
    border-bottom: 2px solid rgba(199, 175, 175, 0.35); /* Une bordure plus épaisse pour séparer les en-têtes de la liste */
    margin: 0 2rem; /* Marge pour aligner avec la liste des joueurs */
}

.player-list {
    grid-area: stats;
    list-style-type: none;  /* Supprimer les puces de la liste */
    padding: 0;
    margin: 0 2rem;
}

.player-item {
    display: flex;
    justify-content: space-between;
    font-size: 1.2rem;
    color: #9d9d9d;  /* Nuance de gris foncé pour le texte */
    padding: 0.5rem 0;
    border-bottom: 1px solid rgba(199, 175, 175, 0.35);  /* Séparateur entre les éléments de la liste */
}

.headers span, .player-item span {
    flex: 1; /* Prend tout l'espace disponible, divisé également entre les spans */
    text-align: center; /* Centre le contenu de chaque span */
    padding: 0 0.5rem; /* Espacement à l'intérieur de chaque span */
}

.headers span:nth-child(1), .player-item span:nth-child(1) {
    flex: 1; /* Prend deux fois l'espace par rapport aux autres spans */
}

.headers span:nth-child(2), .player-item span:nth-child(2) {
    flex: 3;
}

.headers span:nth-child(3), .player-item span:nth-child(3) {
    flex: 1;
}


.player-item:last-child {
    border-bottom: none;  /* Supprimer le séparateur pour le dernier élément */
}

.footer-scoreboard {
    grid-area: footer;
    margin: 1rem auto;
    font-size: 1rem;
    color: #737272;  /* Nuance de gris foncé pour le texte */
    text-shadow: 0 0 0.5rem #000000;  /* Ombre portée du texte */
}
</style>
