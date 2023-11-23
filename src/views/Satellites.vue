<script setup>
import RandomPlanet from "@/components/utilities/RandomPlanet.vue";
import {storeToRefs} from "pinia";
import {useAuthStore} from "@/stores";
import SatelliteDisplayer from "@/components/utilities/satellites/SatelliteDisplayer.vue";
const authStore = useAuthStore();

const { user: authUser } = storeToRefs(authStore);

</script>
<template>
  <div class="satellite_container">
      <RandomPlanet class="planet" v-model="authUser.pseudo" :width="250" :height="250" :planet-id='1'/>
      <SatelliteDisplayer class="satellite_displayer" :level="3"/>
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