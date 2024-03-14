<script setup>
import RandomPlanet from "@/components/utilities/RandomPlanet.vue";
import {storeToRefs} from "pinia";
import {useAuthStore, useCardsStore, useUsersStore, useRegistreStore} from "@/stores";
import SatelliteDisplayer from "@/components/utilities/satellites/SatelliteDisplayer.vue";
import {RouterLink} from "vue-router";
import TextCardList from "@/components/utilities/cards/textCardList.vue";
import {computed} from "vue";
import {
    faShield as satelliteIcon,
    faSkull as warIcon,
    faHeart as heartIcon
} from "@fortawesome/free-solid-svg-icons";
const authStore = useAuthStore();
const usersStore = useUsersStore();
const cardsStore = useCardsStore();
const registreStore = useRegistreStore();

const { user: authUser } = storeToRefs(authStore);
const { buildings } = storeToRefs(usersStore);
const { cards } = storeToRefs(cardsStore);
const { registreInfo } = storeToRefs(registreStore);

usersStore.getBuildingsOfUser(authUser.value.id);
registreStore.getRegistreInfo(authUser.value.id);

const cardsInSatellites = computed(() => {
    let result = cards.value;

    result = result.filter(item => item.action && item.action?.actionName.toLowerCase().includes('satellite'));

    // sort by power
    result.sort((a, b) => b.competences.power - a.competences.power );

    return result;
});

const puissanceTotale = computed(() => {
    let result = 0;
    cardsInSatellites.value.forEach(card => {
        result += card.power;
    });
    return result;
});

const contextPolitique = computed(() => {
    if (registreInfo.value.registres.filter(registre => registre.type === 1).length > 0) {
        // menacé
        return 1;
    }

    return 0;
})

</script>
<template>
    <div v-if="buildings.loading">
        <p class="huge-text">Chargement des bâtiments...</p>
    </div>
    <div v-else-if="buildings.error" class="huge-text text-danger">
        Erreur lors du chargement des bâtiments: {{buildings.error}}
    </div>
    <div v-else-if="cards.loading">
        <p class="huge-text">Chargement des cartes...</p>
    </div>
    <div v-else-if="cards.error" class="huge-text text-danger">
        Erreur lors du chargement des cartes: {{cards.error}}
    </div>
    <div v-else class="satellite_container">
        <div class="panel warInfo">
            <div class="DivTitle">Info de Guerre</div>
            <div class="container">
                <div v-if="true">
                    <span>
                        Aucune guerre en cours
                    </span>
                    <div class="discret">
                        Pour lancer une guerre, cliquez sur le joueur/la planète cible dans votre registre
                    </div>
                </div>
                <div v-else>

                </div>
            </div>
        </div>
        <div class="planetInfo">
            <RandomPlanet class="planet" v-model="authUser.pseudo" :width="250" :height="250" :planet-id='1'/>
            <SatelliteDisplayer class="satellite_displayer"
                                :level="buildings.satelliteLevel" 
                                :satellite-used="buildings.actualSatelliteUsed"/>
        </div>
        <div class="panel satelliteCards">
            <div class="DivTitle">Cartes en orbite</div>
            <div class="container">
                <text-card-list :cards="cardsInSatellites" withPower withEndDate/>
                <div class="setCardInSatellite">
                    <RouterLink :to="`/action/satellite/`">
                    <div class="goToText red">Ajouter des cartes</div>
                    </RouterLink>
                </div>
            </div>
        </div>
        <div class="defenseInfos">
            <div class="info">
                <div class="title">Satellites utilisés</div>
                <div class="value">{{buildings.actualSatelliteUsed}} / {{buildings.satelliteLevel}}</div>
            </div>
            <div class="info">
                <div class="title">Puissance totale de la défense</div>
                <div class="value red">
                    {{ puissanceTotale }} <svg-icon :fa-icon="satelliteIcon" :size="30"/>
                </div>
            </div>
            <div class="info">
                <div class="title">Context politique actuel</div>
                <div class="value">
                    <span class="red" v-if="contextPolitique === 2">En Guerre <svg-icon :fa-icon="warIcon" :size="30"/></span>
                    <span class="yellow" v-else-if="contextPolitique === 1">Menacé <svg-icon :fa-icon="satelliteIcon" :size="30"/></span>
                    <span class="green" v-else>Tranquille <svg-icon :fa-icon="heartIcon" :size="30"/></span>
                </div>
            </div>
        </div>
    </div>
</template>
<style scoped>
.satellite_container {
    display: grid;
    width: 100%;
    margin: 10rem auto 0 auto;
    grid-template-columns: 1fr 1fr 1fr;
    grid-template-rows: 20rem 20rem;
    gap: 4rem;

    @media (max-width: 1023px) {
        margin-top: 10rem;
        grid-template-columns: 1fr;
        row-gap: 2rem;
    }
}

.planetInfo {
    grid-column: 2 / 3;
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: 1fr 1fr;

    @media (max-width: 1023px) {
        grid-row: -1;
        margin-top: 15rem;
        scale: 0.7;
    }
}

.planet {
    scale: 1;
    grid-column: 1 / -1;
    grid-row: 1 / -1;
    z-index: 0;
    align-self: center;
    justify-self: center;
}

.satellite_displayer {
    grid-column: 1 / -1;
    grid-row: 1 / -1;
    scale: 2;
    z-index: 1;
    align-self: center;
    justify-self: center;
}

.goToText {
    font-size: 1.5rem;
    font-weight: bold;
    color: var(--color-text);
    text-align: center;
    margin: 0;
}

.panel {
    z-index: 1;
    padding: 1rem;
    margin: 1rem;
    min-width: 30rem;
    border-radius: 1rem;
    backdrop-filter: blur(5px);
    box-shadow: 0 0 1rem rgba(0, 0, 0, 0.5);
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: 0.4fr 1fr;
    row-gap: 1rem;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    color: white;
}

.warInfo {
    grid-column: 1;
}

.warInfo .container {
    width: 100%;
    font-size: 1.5rem;
    font-weight: bold;
    color: var(--color-text);
    text-align: center;
    margin: 0;
}

.satelliteCards {
    grid-column: 3;
}

.satelliteCards .container {
    width: 100%;
}

.defenseInfos {
    grid-column: 1 / -1;
    grid-row: 2;
    z-index: 1;
    padding: 1rem;
    margin: 4rem;
    column-gap: 2rem;
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
}

.defenseInfos .info {
    border-radius: 1rem;
    backdrop-filter: blur(5px);
    box-shadow: 0 0 1rem rgba(0, 0, 0, 0.5);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}

.defenseInfos .title {
    font-size: 1.5rem;
    font-weight: bold;
    color: var(--color-text);
    filter: drop-shadow(0 0 4px var(--color-text));
    text-align: center;
    margin: 0;
}

.defenseInfos .value {
    font-size: 2rem;
    font-weight: bold;
    text-align: center;
    margin: 0;
}

.goToText:hover {
    color: var(--vt-c-red-2);
    filter: drop-shadow(0 0 4px var(--vt-c-red-2));
}
</style>