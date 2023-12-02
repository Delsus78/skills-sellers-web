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
            <span></span>
            <span>Joueur</span>
            <span>Cartes</span>
        </div>

        <ul class="player-list">
            <li v-for="(player, index) in players"
                :key="player.id"
                class="player-item" :class="
                {
                    'legendaire-text': player.nbCards === maxCardNumber,
                    'epic-text': player.nbCards >= secondQuartile && player.nbCards < maxCardNumber,
                    'commun-text': player.nbCards >= firstQuartile && player.nbCards < secondQuartile
                }"
                @click="router.push('/stats/'+player.id);">
                <span>{{ index + 1}}</span>
                <span>{{ player.pseudo }}</span>
                <span>{{ player.nbCards }}</span>
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
import {router} from "@/helpers";

const emit = defineEmits(['reload']);

const maxCardNumber = 150;
const secondQuartile = 100;
const firstQuartile = 50;

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

    @media (max-width: 1023px) {
        margin: 0;
        border-radius: 0;
        box-shadow: none;
    }
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
    display: grid;
    grid-template-columns: 0.2fr 1fr 1fr;
    text-align: center;
    color: #ffffff; /* Nuance de blanc pour le texte des en-têtes */
    font-weight: bolder;
    font-size: 1.3rem;
    border-bottom: 2px solid rgba(199, 175, 175, 0.35); /* Une bordure plus épaisse pour séparer les en-têtes de la liste */
    margin: 0 2rem; /* Marge pour aligner avec la liste des joueurs */
}

.player-list {
    grid-area: stats;
    list-style-type: none;
    padding: 0;
    margin: 0 2rem;
    overflow-y: auto; /* Ajout d'une barre de défilement si la liste est trop longue */
}

.player-item {
    display: grid;
    grid-template-columns: 0.2fr 1fr 1fr;
    font-size: 1.2rem;
    color: #9d9d9d;  /* Nuance de gris foncé pour le texte */
    padding: 0.5rem 0;
    border-bottom: 1px solid rgba(199, 175, 175, 0.35);  /* Séparateur entre les éléments de la liste */
}

.player-item span:first-child {
    border-right: 1px solid rgba(199, 175, 175, 0.35);  /* Séparateur pour le premier élément */
}

.headers span, .player-item span {
    flex: 1; /* Prend tout l'espace disponible, divisé également entre les spans */
    text-align: center; /* Centre le contenu de chaque span */
    padding: 0 0.5rem; /* Espacement à l'intérieur de chaque span */
}

.player-item:last-child {
    border-bottom: none;  /* Supprimer le séparateur pour le dernier élément */
}

.player-item:hover {
    background-color: rgba(70, 69, 69, 0.35);  /* Couleur de fond au survol */
    box-shadow: inset 0 0 0.5rem #000000;  /* Ombre portée au survol */
    border-radius: 0.5rem;
    cursor: pointer;
}

.footer-scoreboard {
    grid-area: footer;
    margin: 1rem auto;
    font-size: 1rem;
    color: #737272;  /* Nuance de gris foncé pour le texte */
    text-shadow: 0 0 0.5rem #000000;  /* Ombre portée du texte */
}
</style>
