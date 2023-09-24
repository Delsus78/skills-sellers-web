<script setup>
import {storeToRefs} from "pinia";
import Scoreboard from "@/components/utilities/Scoreboard.vue";
import { useUsersStore } from "@/stores";
import GlobalChat from "@/components/utilities/GlobalChat.vue";
const usersStore = useUsersStore();
const { users } = storeToRefs(usersStore);
usersStore.getAllUsers();

</script>
<template>
  <div class="Home">
      <Scoreboard class="Scoreboard" :players="users" @reload="usersStore.getAllUsers()"/>
      <GlobalChat class="GlobalChat"/>
  </div>
</template>

<style scoped>

.Home {
    width: 100%;
    height: 100vh;
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr 1fr;
    grid-template-rows: 5rem 1fr 1fr 1fr 1fr 1fr 1fr;
    overflow: hidden;
}

.Scoreboard {
    transform: perspective(1000px) rotateX(0deg) rotateY(-12.5deg);
    grid-column: 6 / 8;
    grid-row: 2 / 7;
    width: 40rem;
}

.GlobalChat {
    grid-column: 1 / 5;
    grid-row: 2 / 7;
    width: 40rem;
    z-index: 10000;
}

</style>