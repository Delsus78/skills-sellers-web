<script setup>
import {storeToRefs} from "pinia";
import {useUsersStore, useAuthStore, useNotificationStore, useAchievementsStore, useCosmeticStore} from "@/stores";
import {useRoute} from "vue-router";
import {computed, ref} from "vue";
import {
    faCoins as moneyIcon,
    faRankingStar as rankIcon,
    faPaperPlane as sendIcon,
    faGift as giftIcon,
    faInfinity as infinityIcon,
    faEarth as showPlanetIcon,
    faArrowTrendUp as statIcon,
    faBurger as foodIcon,
    faCubesStacked as creatiumIcon, faShield as satelliteIcon, faRotateRight as homeIcon,
} from "@fortawesome/free-solid-svg-icons";
import PlanetWithCosmetics from "@/components/utilities/CosmeticMarket/PlanetWithCosmetics.vue";
import {format} from "@/components/utilities/DateFormator";

const route = useRoute();
const userId = route.params.id;

const usersStore = useUsersStore();
const authStore = useAuthStore();
const notifStore = useNotificationStore();
const achievementsStore = useAchievementsStore();
const cosmeticStore = useCosmeticStore();
const { stats, users } = storeToRefs(usersStore);
const { user: authUser } = storeToRefs(authStore);
const { achievements } = storeToRefs(achievementsStore);
const { cosmeticsDisplayed } = storeToRefs(cosmeticStore);
const messageToSend = ref("");
// stats or achievements
const openedTab = ref("stats");
const showPlanet = ref(false);

usersStore.getAllUsers();
cosmeticStore.getComseticsOfUser(userId);
usersStore.getStatsOfUser(userId);

const achievementsData = computed(() => {
    return Object.entries(achievements.value).map(([key, value]) => ({
        key,
        title: value.title, // Supposez que chaque réalisation a un titre
        value: value.value,
        max: value.max || 1, // Vous pouvez définir une valeur par défaut
        isClaimable: value.isClaimable,
    }));
});

const transformedStats = computed(() => {
    let transformed = [];
    const data = stats.value;

    for (const key in data) {
        if (data.hasOwnProperty(key)) {
            const value = data[key];
            if (typeof value === 'object' && value.title === undefined) {
                // Si la valeur est un objet avec des sous-clés (comme totalCardsByRarity, totalResourcesMined, etc.)
                for (const subKey in value) {
                    if (value.hasOwnProperty(subKey)) {
                        const subValue = value[subKey];
                        if (typeof subValue === 'object' && subValue !== null && subValue.title) {
                            transformed.push({title: subValue.title, stat: subValue.stat, rank: subValue.rank});
                        }
                    }
                }
            } else if (value.title) {
                // Si la valeur est un objet simple
                transformed.push({ title: value.title, stat: value.stat, rank: value.rank });
            }
        }
    }

    // speciales stats
    transformed.forEach(stat => {
        // totalCardsInBDD
        if (stat.title === "Nombre total de cartes") {
            stat.stat = `${stat.stat} / ${data.totalCardsInBDD}`;
        }
    });

    return transformed;
})

const user = computed(() => {
    if (users.value.loading || users.value.error) return null;
    const userReturned = users.value.find(u => u.id.toString() === userId);
    return userReturned;
});

const handleSend = () => {
    notifStore.sendMessageToUser(userId, messageToSend.value);
    messageToSend.value = "";
}

const isWarTimeoutInDate = computed(() => {
    if (!user.value) return false;
    return new Date(user.value.warTimeout) > new Date();
});

const openAchievements = () => {
    achievementsStore.getAchievementsOfUser(userId);
    openedTab.value = 'achievements';
}

const openStatistics = () => {
    usersStore.getStatsOfUser(userId);
    openedTab.value = 'stats';
}

</script>
<template>
    <div class="Stats">
        <div class="User_info bg-dark-blur">
            <div class="User_header">
                <h1 class="DivTitle">
                    {{ user?.pseudo ?? "Chargement..." }}
                </h1>
            </div>
        </div>
        <div class="Stats_content bg-dark-blur">
            <div class="Stats_header">
                <div class="headersTitlesSelect">
                    <div class="headerStatistique" :style="{opacity: openedTab === 'stats' ? 1 : 0.5}">
                        <h1 class="DivTitle" @click="openStatistics">Statistiques</h1>
                    </div>
                    <div class="headerAchievements" :style="{opacity: openedTab === 'achievements' ? 1 : 0.5}">
                        <h1 class="DivTitle" @click="openAchievements">Achievements</h1>
                    </div>
                </div>

                <div v-if="openedTab === 'achievements'" class="headers-list">
                    <div v-if="achievements.loading">
                        Chargement des Achievements...
                    </div>
                    <div v-else-if="achievements.error" class="huge-text text-danger">
                        Erreur lors du chargement des achievements: {{stats.error}}
                    </div>
                    <span v-else >Achievement</span>

                    <div style="display:flex; column-gap: 1rem;">
                        <span><svg-icon class="shadow-white" :fa-icon="statIcon" :size="26"/></span>
                        <span><svg-icon class="shadow-white" :fa-icon="giftIcon" :size="26"/></span>
                    </div>
                </div>
                <div v-if="openedTab === 'stats'" class="headers-list">
                    <div v-if="stats.loading">
                        Chargement des statistiques...
                    </div>
                    <div v-else-if="stats.error" class="huge-text text-danger">
                        Erreur lors du chargement des statistiques: {{stats.error}}
                    </div>
                    <span v-else>Statistique</span>
                    <div style="display:flex; column-gap: 1rem;">
                        <span><svg-icon class="shadow-white" :fa-icon="statIcon" :size="26"/></span>
                        <span><svg-icon class="shadow-white" :fa-icon="rankIcon" :size="26"/></span>
                    </div>
                </div>
            </div>

            <ul v-if="openedTab === 'stats'" class="stats-list">
                <li v-for="item in transformedStats" :key="item.key" class="stat-item" :class="{'legendaire-text': item.rank === 1}">
                    <span>{{ item.title }}</span>
                    <span class="stat-item-value">
                        <span>{{ item.stat }}</span>
                        <span>{{ item.rank }}</span>
                    </span>
                </li>
            </ul>

            <ul v-if="openedTab === 'achievements'" class="stats-list">
                <li v-for="achievement in achievementsData" :key="achievement.key" class="stat-item" :class="{'legendaire-text': achievement.isClaimable}"
                    @click="achievementsStore.claimAchievement(achievement.key);">
                    <span>{{ achievement.title }}</span>
                    <span class="stat-item-value">
                    <span>{{ achievement.value }} / <svg-icon :fa-icon="infinityIcon" :size="13"/></span>
                        <span>
                            <svg-icon :fa-icon="giftIcon" :class="{colored: achievement.isClaimable}" style="margin: auto;" :size="16"/>
                        </span>
                    </span>
                </li>
            </ul>
        </div>
        <div class="User_More_Info bg-dark-blur">
            <div class="war_time_out_display" v-if="user.warTimeout && isWarTimeoutInDate">
                Termine le {{format(user.warTimeout, "DD MMMM YYYY HH:mm:ss Z")}}
                <svg-icon class="shadow-white" :fa-icon="satelliteIcon" :size="26"/>
            </div>
            <div class="user_resources">
                    <span class="text food">
                        {{ user.nourriture }}<svg-icon class="shadow-black" :fa-icon="foodIcon" :size="18"/>
                    </span>
                <span class="text or">
                        {{ user.or }}<svg-icon class="shadow-black" :fa-icon="moneyIcon" :size="18"/>
                    </span>
                <span class="text creatium">
                        {{ user.creatium }} <svg-icon class="shadow-black" :fa-icon="creatiumIcon" :size="18"/>
                    </span>
            </div>
            <div v-if='userId !== authUser.id.toString()'>
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
        </div>
        <PlanetWithCosmetics class="planetBuilding" v-if="cosmeticsDisplayed != null" :style="{'z-index': showPlanet ? 100 : -1}"
                             :height="850" :width="850" :player-pseudo="user?.pseudo" :cosmetics-displayed="cosmeticsDisplayed"/>
        <div class="arrow-show-planet">
            <svg-icon :fa-icon="showPlanetIcon" :size="36" @click="showPlanet = !showPlanet"/>
        </div>
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
        grid-template-rows: 4rem 5rem 5rem 50rem;
        row-gap: 2rem;
    }
}

.text {
    text-shadow: 0 0 0.5rem var(--vt-c-white-dark);
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
        transform: scale(0.3);
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
        grid-row: 4;
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

.headersTitlesSelect {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    margin: 0 1rem;
}

.headersTitlesSelect > div {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
}

.headersTitlesSelect > div:hover {
    cursor: pointer;
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
    height: 40rem;
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
    align-items: center;
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

.User_More_Info {
    grid-column: 1;
    grid-row: 2 / 3;
    display: grid;
    padding: 1rem;
    margin: 3rem;
    border-radius: 1rem;
    box-shadow: 0 0 1rem 0.5rem rgba(0, 0, 0, 0.2);
    z-index: 1;

    @media (max-width: 1023px) {
        grid-column: 1;
        grid-row: 3;
        margin: 0;
        border-radius: 0;
        max-height: 10rem;
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
    flex-direction: column;
}

.user_resources {
    display: flex;
    gap: 2rem;
    justify-content: center;
    align-items: center;
}

.war_time_out_display {
    position: absolute;
    top: 1rem;
    right: 1rem;
    display: flex;
    align-items: center;
    color: gold;
    gap: 1rem;
    border-radius: 1rem;
    font-family: 'Big John', sans-serif;
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

.arrow-show-planet {
    position: absolute;
    top: 15rem;
    display: flex;
    color: gold;
    font-size: 1.8em;

    @media (max-width: 1023px) {
        top: 1rem;
        right: 1rem;
    }
}

.arrow-show-planet:hover {
    color: white;
    cursor: pointer;
}
</style>