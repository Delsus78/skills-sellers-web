<script setup>
import { useAuthStore } from "@/stores";
import {storeToRefs} from "pinia";
import Scoreboard from "@/components/utilities/Scoreboard.vue";
const authStore = useAuthStore();
const { user: authUser } = storeToRefs(authStore);

</script>
<template>
  <div class="Home">
      <Scoreboard class="Scoreboard"/>
  </div>
</template>

<style scoped>

.Home {
    width: 100%;
    height: 100vh;
    display: grid;
    grid-template-columns: 0.5fr 1fr 1fr 1fr 1fr 1fr 0.5fr;
    grid-template-rows: 5rem 1fr 1fr 1fr 1fr 1fr 1fr;
    overflow: hidden;
}

.Scoreboard {
    grid-column: 4 / 5;
    grid-row: 3 / 6;
    pointer-events: none;
}

</style>