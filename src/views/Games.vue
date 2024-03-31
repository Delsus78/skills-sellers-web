<script setup>
import {useActionsStore, useGamesStore} from "@/stores";
import { storeToRefs } from "pinia";
import Casino from "@/components/utilities/games/casino.vue";
import MachineRepair from "@/components/utilities/games/machineRepair.vue";
import Boss from "@/components/utilities/games/boss.vue";

const gamesStore = useGamesStore();
const actionsStore = useActionsStore();
const { game } = storeToRefs(gamesStore);
gamesStore.getGameDay();

const play = (GameName, bet, cardIds, params) => {
    gamesStore.postGameDay(GameName, bet, cardIds, params);
}

const cancel = async (GameName, cardIds) => {
    await gamesStore.CancelGamePlay(GameName, cardIds);
}

const estimate = async (GameName, bet, cardIds) => {
    if (GameName.toLowerCase() === "machine")
        gamesStore.gameEstimation = await actionsStore.postEstimatedActionForCards(cardIds, "reparer", {});
    else {
        await gamesStore.EstimateGameDay(GameName, bet, cardIds);
    }
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
        <machine-repair v-if="game?.name.toLowerCase() === 'machine'"
                @play="play" @estimate="estimate"/>
        <boss v-if="game?.name.toLowerCase().includes('boss')" :game="game"
                @play="play" @estimate="estimate" @cancel="cancel"/>
    </div>
    <footer class="footer">
        <span></span>
    </footer>
</template>

<style scoped>
</style>