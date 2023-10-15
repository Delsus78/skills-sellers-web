<script setup>
import { useGamesStore } from "@/stores";
import { storeToRefs } from "pinia";
import Casino from "@/components/utilities/games/casino.vue";

const gamesStore = useGamesStore();
const { game } = storeToRefs(gamesStore);


</script>

<template>
    <div class="games">
        <casino v-if="game.name.toLowerCase() === 'casino'" />
    </div>
    <footer class="footer">
        <span></span>
    </footer>
</template>

<style scoped>
.games {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
}
</style>