<script setup>
import {storeToRefs} from "pinia";
import Scoreboard from "@/components/utilities/Scoreboard.vue";
import { useUsersStore } from "@/stores";
import GlobalChat from "@/components/utilities/GlobalChat.vue";
import {computed} from "vue";
const usersStore = useUsersStore();
const { users } = storeToRefs(usersStore);
usersStore.getAllUsers();

const usersSorted = computed(() => {
    if (users.value.loading || users.value.error) return [];
    return users.value.sort((a, b) => {
        return b.nbCards - a.nbCards;
    });
});

</script>
<template>
  <div class="Home">
      <GlobalChat class="GlobalChat"/>
      <Scoreboard class="Scoreboard" :players="usersSorted" @reload="usersStore.getAllUsers()"/>
  </div>
</template>

<style scoped>

.Home {
    display: grid;
    grid-template-rows: 6rem 50rem;
    grid-template-columns: 1fr 1fr;

    @media (max-width: 1023px) {
        grid-template-columns: 1fr;
        grid-template-rows: 6rem 50rem 50rem;
    }
}

.Scoreboard {
    transform: perspective(1000px) rotateX(0deg) rotateY(-12.5deg);
    grid-row: 2;
    width: 40rem;

    @media (max-width: 1023px) {
        width: 100%;
        grid-row: 2;
        transform: rotateY(0deg);
    }
}

.GlobalChat {
    transform: perspective(1000px) rotateX(0deg) rotateY(12.5deg);
    grid-row: 2;
    width: 40rem;

    @media (max-width: 1023px) {
        width: 100%;
        grid-row: 3;
        transform: rotateY(0deg);
    }
}

</style>