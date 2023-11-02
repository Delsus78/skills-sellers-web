<script setup>
import {storeToRefs} from "pinia";
import { useUsersStore, useAuthStore, useNotificationStore } from "@/stores";
import {useRoute} from "vue-router";
import {computed, ref} from "vue";
import Notifications from "@/components/utilities/Notifications.vue";
import RandomPlanet from "@/components/utilities/RandomPlanet.vue";
import {
    faCoins as moneyIcon,
    faRankingStar as rankIcon,
    faPaperPlane as sendIcon,
faArrowTrendUp as statIcon} from "@fortawesome/free-solid-svg-icons";

const route = useRoute();
const userId = route.params.id;

const usersStore = useUsersStore();
const authStore = useAuthStore();
const notifStore = useNotificationStore();
const { stats, users } = storeToRefs(usersStore);
const { user: authUser } = storeToRefs(authStore);
const messageToSend = ref("");


usersStore.getAllUsers();
usersStore.getStatsOfUser(userId);

const user = computed(() => {
    if (users.value.loading || users.value.error) return null;
    return users.value.find(u => u.id.toString() === userId);
});

const handleSend = () => {
    notifStore.sendMessageToUser(userId, messageToSend.value);
    messageToSend.value = "";
}

</script>
<template>
    <div v-if="stats.loading || !user">
      <p class="huge-text">Chargement des statistiques...</p>
    </div>
    <div v-else-if="stats.error" class="huge-text text-danger">
      Erreur lors du chargement des statistiques: {{stats.error}}
    </div>
    <div v-else class="Stats">
        <div class="User_info bg-dark-blur">
            <div class="User_header">
                <h1 class="DivTitle">
                    {{ user?.pseudo ?? "Chargement..." }}
                </h1>
            </div>
        </div>
        <div class="Stats_content bg-dark-blur">
            <div class="Stats_header">
                <h1 class="DivTitle">Statistiques</h1>
                <div class="headers-list">
                    <span>Statistique</span>
                    <div style="display:flex; column-gap: 1rem;">
                        <span><svg-icon class="shadow-white" :fa-icon="statIcon" :size="26"/></span>
                        <span><svg-icon class="shadow-white" :fa-icon="rankIcon" :size="26"/></span>
                    </div>
                </div>
            </div>
            <ul class="stats-list">
                <li class="stat-item" :class="{'legendaire-text': stats.totalCards.rank === 1}">
                    <span>Nombre total de cartes</span>
                    <span class="stat-item-value">
                        <span>{{ stats.totalCards.stat }} / {{ stats.totalCardsInBDD}}</span>
                        <span>{{ stats.totalCards.rank }}</span>
                    </span>
                </li>
                <li class="stat-item" :class="{'legendaire-text': stats.totalCardsByRarity.commune.rank === 1}">
                    <span>Nombre de cartes communes</span>
                    <span class="stat-item-value">
                        <span>{{ stats.totalCardsByRarity.commune.stat ?? "0" }}</span>
                        <span>{{ stats.totalCardsByRarity.commune.rank ?? "?" }}</span>
                    </span>
                </li>
                <li class="stat-item" :class="{'legendaire-text': stats.totalCardsByRarity.epic.rank === 1}">
                    <span>Nombre de cartes épiques</span>
                    <span class="stat-item-value">
                        <span>{{ stats.totalCardsByRarity.epic.stat ?? "0" }}</span>
                        <span>{{ stats.totalCardsByRarity.epic.rank ?? "?" }}</span>
                    </span>
                </li>
                <li class="stat-item" :class="{'legendaire-text': stats.totalCardsByRarity.legendaire.rank === 1}">
                    <span>Nombre de cartes légendaires</span>
                    <span class="stat-item-value">
                        <span>{{ stats.totalCardsByRarity.legendaire.stat ?? "0" }}</span>
                        <span>{{ stats.totalCardsByRarity.legendaire.rank ?? "?" }}</span>
                    </span>
                </li>
                <li class="stat-item" :class="{'legendaire-text': stats.totalCardWithAStatMaxed.rank === 1}">
                    <span>Nombre de cartes avec une compétence maximisée</span>
                    <span class="stat-item-value">
                        <span>{{ stats.totalCardWithAStatMaxed.stat }}</span>
                        <span>{{ stats.totalCardWithAStatMaxed.rank }}</span>
                    </span>
                </li>
                <li class="stat-item" :class="{'legendaire-text': stats.totalFailedCardsCauseOfCharisme.rank === 1}">
                    <span>Nombre d'échecs dus au charisme lors d'explorations</span>
                    <span class="stat-item-value">
                        <span>{{ stats.totalFailedCardsCauseOfCharisme.stat }}</span>
                        <span>{{ stats.totalFailedCardsCauseOfCharisme.rank }}</span>
                    </span>
                </li>
                <li class="stat-item" :class="{'legendaire-text': stats.totalDoublonsEarned.rank === 1}">
                    <span>Nombre de doublons obtenus</span>
                    <span class="stat-item-value">
                        <span>{{ stats.totalDoublonsEarned.stat }}</span>
                        <span>{{ stats.totalDoublonsEarned.rank }}</span>
                    </span>
                </li>
                <li class="stat-item" :class="{'legendaire-text': stats.totalMessagesSent.rank === 1}">
                    <span>Nombre de messages envoyés</span>
                    <span class="stat-item-value">
                        <span>{{ stats.totalMessagesSent.stat }}</span>
                        <span>{{ stats.totalMessagesSent.rank }}</span>
                    </span>
                </li>
                <li class="stat-item" :class="{'legendaire-text': stats.totalResourcesMined.Creatium.rank === 1}">
                    <span>Nombre de créatiums minés</span>
                    <span class="stat-item-value">
                        <span>{{ stats.totalResourcesMined.Creatium.stat ?? "0" }}</span>
                        <span>{{ stats.totalResourcesMined.Creatium.rank ?? "?" }}</span>
                    </span>
                </li>
                <li class="stat-item" :class="{'legendaire-text': stats.totalResourcesMined.Or.rank === 1}">
                    <span>Nombre d'onces d'or minées</span>
                    <span class="stat-item-value">
                        <span>{{ stats.totalResourcesMined.Or.stat ?? "0" }}</span>
                        <span>{{ stats.totalResourcesMined.Or.rank ?? "?" }}</span>
                    </span>
                </li>
                <li class="stat-item" :class="{'legendaire-text': stats.totalBuildingsUpgraded.rank === 1}">
                    <span>Nombre d'améliorations de bâtiments effectuées</span>
                    <span class="stat-item-value">
                        <span>{{ stats.totalBuildingsUpgraded.stat }}</span>
                        <span>{{ stats.totalBuildingsUpgraded.rank }}</span>
                    </span>
                </li>
                <li class="stat-item" :class="{'legendaire-text': stats.totalRocketLaunched.rank === 1}">
                    <span>Nombre de fusées lancées</span>
                    <span class="stat-item-value">
                        <span>{{ stats.totalRocketLaunched.stat }}</span>
                        <span>{{ stats.totalRocketLaunched.rank }}</span>
                    </span>
                </li>
                <li class="stat-item" :class="{'legendaire-text': stats.totalMealCooked.rank === 1}">
                    <span>Nombre de repas préparés</span>
                    <span class="stat-item-value">
                        <span>{{ stats.totalMealCooked.stat }}</span>
                        <span>{{ stats.totalMealCooked.rank }}</span>
                    </span>
                </li>
                <li class="stat-item" :class="{'legendaire-text': stats.totalMachineUsed.rank === 1}">
                    <span>Nombre de machine E. Zeiss utilisées</span>
                    <span class="stat-item-value">
                        <span>{{ stats.totalMachineUsed.stat }}</span>
                        <span>{{ stats.totalMachineUsed.rank }}</span>
                    </span>
                </li>
                <li class="stat-item" :class="{'legendaire-text': stats.totalWinAtCharismeCasino.rank === 1}">
                    <span>Nombre de charisme remporté au casino</span>
                    <span class="stat-item-value">
                        <span>{{ stats.totalWinAtCharismeCasino.stat }}</span>
                        <span>{{ stats.totalWinAtCharismeCasino.rank }}</span>
                    </span>
                </li>
                <li class="stat-item" :class="{'legendaire-text': stats.totalLooseAtCharismeCasino.rank === 1}">
                    <span>Nombre d'or perdu au casino</span>
                    <span class="stat-item-value">
                        <span>{{ stats.totalLooseAtCharismeCasino.stat }}</span>
                        <span>{{ stats.totalLooseAtCharismeCasino.rank }}</span>
                    </span>
                </li>
                <li class="stat-item" :class="{'legendaire-text': stats.totalWordleWon.rank === 1}">
                    <span>Nombre de Worldle gagnés</span>
                    <span class="stat-item-value">
                        <span>{{ stats.totalWordleWon.stat }}</span>
                        <span>{{ stats.totalWordleWon.rank }}</span>
                    </span>
                </li>
            </ul>
        </div>
        <Notifications v-if='userId === authUser.id.toString()' class="Notifications"/>
        <div v-else class="SendNotification bg-dark-blur">
            <div class="SendNotification_header">
                <h1 class="DivTitle">Envoyer un message</h1>
            </div>

            <div class="SendNotification_input">
                <input class="TextBox" v-model="messageToSend" placeholder="Un truc à dire ?"/>
            </div>

            <div class="SendNotification_button">
                <div class="input_gold">
                    10<svg-icon :fa-icon="moneyIcon" class="money_icon" :size="40"/>
                </div>
                <svg-icon class="shadow-white" :fa-icon="sendIcon" :size="36" @click="handleSend"/>
            </div>
        </div>
        <RandomPlanet class="planetBuilding" :model-value="user?.pseudo" :width="850" :height="850" :planet-id='1'/>
    </div>
</template>
<style scoped>
.Stats {
    display: grid;
    width: 100%;
    margin: 0;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: 25% 75%;

    @media (max-width: 1023px) {
        grid-template-columns: 1fr;
        grid-template-rows: 4rem 5rem 50rem 50rem;
        row-gap: 2rem;
    }
}

.planetBuilding {
    grid-column: 1 / -1;
    grid-row: 1 / -1;
    pointer-events: none;
    z-index: 0;
    align-self: center;
    justify-self: center;

    @media (max-width: 1023px) {
        grid-column: 1;
        grid-row: 3;
        position: fixed;
    }
}

.Stats_content {
    grid-column: 2;
    grid-row: 1 / 3;
    display: grid;
    grid-template-rows: 15% 80% 5%;
    grid-template-areas: "title" "stats" "footer";
    padding: 1rem;
    margin: 3rem;
    border-radius: 1rem;
    box-shadow: 0 0 1rem 0.5rem rgba(0, 0, 0, 0.2);
    backdrop-filter: blur(5px);
    z-index: 1;

    @media (max-width: 1023px) {
        grid-column: 1;
        grid-row: 3;
        margin: 0;
    }
}

.Stats_header {
    grid-area: title;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    z-index: 1;
}

.headers-list {
    width: 100%;
    display: flex;
    justify-content: space-between;
    text-align: center;
    color: rgba(255, 255, 255, 0.51); /* Nuance de blanc pour le texte des en-têtes */
    font-weight: bolder;
    font-size: 1.3rem;
    padding: 0 1.5rem;
}

.stats-list {
    grid-area: stats;
    background: rgba(0, 0, 0, 0.48);
    border-radius: 1rem;
    box-shadow: inset 0 0 1rem 0.5rem black;
    padding: 1rem;
    overflow-y: auto;
}

.stat-item {
    display: flex;
    justify-content: space-between;
    font-size: 1.2rem;
    color: #9d9d9d;  /* Nuance de gris foncé pour le texte */
    padding: 0.5rem 0.5rem;
    border-bottom: 1px solid rgba(199, 175, 175, 0.35);  /* Séparateur entre les éléments de la liste */
}

.stat-item:last-child {
    border-bottom: none;
}

.stat-item-value {
    color: #fff;
    display: flex;
    column-gap: 1rem;
}

.stat-item:hover {
    background: whitesmoke;
    color: black;
    box-shadow: 0 0 0.5rem 0 whitesmoke;
}

.stat-item:hover .stat-item-value {
    color: black;
}

.User_info {
    grid-column: 1;
    grid-row: 1 / 2;
    display: grid;
    padding: 1rem;
    margin: 3rem;
    border-radius: 1rem;
    box-shadow: 0 0 1rem 0.5rem rgba(0, 0, 0, 0.2);
    z-index: 1;

    @media (max-width: 1023px) {
        grid-column: 1;
        grid-row: 2;
        margin: 0;
        border-radius: 0;
        padding: 0;
    }
}

.Notifications {
    grid-column: 1;
    grid-row: 2 / 3;
    display: grid;
    padding: 1rem;
    margin: 3rem;
    border-radius: 1rem;
    box-shadow: 0 0 1rem 0.5rem rgba(0, 0, 0, 0.2);
    max-height: 35rem;
    width: 34.5rem;
    z-index: 1;

    @media (max-width: 1023px) {
        grid-column: 1;
        grid-row: 4;
        margin: 0;
        width: 100%;
        border-radius: 0;
    }
}


.SendNotification {
    grid-column: 1;
    grid-row: 2 / 3;
    display: grid;
    grid-template-rows: 15% 45% 40%;
    grid-template-areas: "title" "message" "info";
    padding: 1rem;
    margin: 3rem;
    border-radius: 1rem;
    box-shadow: 0 0 1rem 0.5rem rgba(0, 0, 0, 0.2);
    backdrop-filter: blur(5px);
    z-index: 1;
    max-height: 15rem;

    @media (max-width: 1023px) {
        grid-column: 1;
        grid-row: 4;
        margin: 0;
        width: 100%;
        border-radius: 0;
    }
}

.SendNotification_header {
    grid-area: title;
    display: flex;
    justify-content: space-between;
    align-items: center;
    z-index: 1;
}

.SendNotification_input {
    grid-area: message;
    display: flex;
    justify-content: center;
}

.SendNotification_input .TextBox {
    backdrop-filter: blur(2px);
    background: rgba(0, 0, 0, 0.65);
    border-radius: 10px;
    outline: none;
    transition: border-color 0.3s, box-shadow 0.3s;
    width: 90%;
    padding: 0.5rem 1rem;
    color: var(--color-text);
    border: 0;
    font-size: 2rem;
    margin: 1rem;
}

.SendNotification_input .TextBox:focus {
    border-color: var(--vt-c-green-2);
    box-shadow: 0 0 0 3px rgba(0, 128, 0, 0.3); /* Cette couleur est juste un exemple. */
}
.SendNotification_input .TextBox::placeholder {
    font-size: 2rem;
    color: rgba(100, 96, 96, 0.56); /* Ceci est un exemple de couleur grise semi-transparente. */
}

.SendNotification_button svg {
    margin: 1.5rem 1rem;
}

.SendNotification_button svg:hover {
    filter: drop-shadow(0 0 0.75rem white);
}

.SendNotification_button {
    grid-area: info;
    display: flex;
    justify-content: space-between;
    align-items: center;
    z-index: 1;
    margin: 0 5rem;
}

.User_header {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.input_gold {
    display: flex;
    align-items: center;
    color: gold;
    gap: 1rem;
    border-radius: 1rem;
    font-size: 1.8em;
    font-family: 'Big John', sans-serif;
}
</style>