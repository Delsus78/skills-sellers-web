<script setup>
import RandomPlanet from "@/components/utilities/RandomPlanet.vue";
import {storeToRefs} from "pinia";
import {useAuthStore, useUsersStore} from "@/stores";
import SatelliteDisplayer from "@/components/utilities/satellites/SatelliteDisplayer.vue";
const authStore = useAuthStore();
const usersStore = useUsersStore();

const { user: authUser } = storeToRefs(authStore);
const { buildings } = storeToRefs(usersStore);

usersStore.getBuildingsOfUser(authUser.value.id);

</script>
<template>
    <div v-if="buildings.loading">
        <p class="huge-text">Chargement des bâtiments...</p>
    </div>
    <div v-else-if="buildings.error" class="huge-text text-danger">
        Erreur lors du chargement des bâtiments: {{buildings.error}}
    </div>
    <div v-else class="satellite_container">
        <RandomPlanet class="planet" v-model="authUser.pseudo" :width="250" :height="250" :planet-id='1'/>
        <SatelliteDisplayer class="satellite_displayer" :level="buildings.satelliteLevel" :satellite-used="buildings.actualSatelliteUsed"/>
    </div>
</template>
<style scoped>
.satellite_container {
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

.planet {
    scale: 1;
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

.satellite_displayer {
    grid-column: 1 / -1;
    grid-row: 1 / -1;
    scale: 2;
    pointer-events: none;
    z-index: 1;
    align-self: center;
    justify-self: center;

    @media (max-width: 1023px) {
        grid-column: 1;
        grid-row: 4;
        position: fixed;
    }
}

</style>