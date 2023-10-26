<script setup>
import { useGamesStore } from "@/stores";
import { storeToRefs } from "pinia";
import Casino from "@/components/utilities/games/casino.vue";
import MachineRepair from "@/components/utilities/games/machineRepair.vue";

const gamesStore = useGamesStore();
const { game } = storeToRefs(gamesStore);
gamesStore.getGameDay();

const play = (GameName, bet, cardIds) => {
    gamesStore.postGameDay(GameName, bet, cardIds);
}

const estimate = (GameName, bet, cardIds) => {
    gamesStore.EstimateGameDay(GameName, bet, cardIds);
}

</script>
<template>
    <div v-if="game.loading">
        <p class="huge-text">Chargement du jeu du jour...</p>
    </div>
    <div v-else-if="game.error">
        <p class="huge-text red">{{ game.error }}</p>
    </div>
    <div v-else class="games">
        <casino v-if="game?.name.toLowerCase() === 'casino'" :game="game"
                @play="play" @estimate="estimate"/>
        <machine-repair v-if="game?.name.toLowerCase() === 'machine'" :game="game"
                @play="play" @estimate="estimate"/>
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
    height: 100vh;
    min-width: 1920px;
}
</style>