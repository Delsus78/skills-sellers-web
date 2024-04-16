<script setup>

import BJCard from "@/components/utilities/games/BJCard.vue";

import { ref, defineProps } from "vue";

const { playerData } = defineProps({
    playerData: {
        type: Object,
        required: true
    },

});

</script>
<template>
    <div class="bjPlayer">
        <div class="bjPlayer-name title-text">
            <p>{{ playerData.name }}</p>
        </div>
        <div class="bjPlayer-cards">
            <b-j-card v-for="(card, index) in playerData.hand" class="bjCard"
                      :style="{zIndex: index, left: index * -2 + 'rem'}"
                      :key="card.id"
                      :name="card.name" :color="card.color" :isVisible="card.isVisible"/>
        </div>
        <div class="bjPlayer-points shadow-black epic-text">
            <strong v-if="playerData.name !== 'BANK'">MISE {{playerData.mise}}</strong>
        </div>
        <div v-if="playerData.state" class="playerState legendaire-text">
            {{ playerData.state }}
        </div>
    </div>
</template>
<style scoped>
.bjPlayer {
    display: flex;
    flex-direction: column;
    gap: 1rem;

    border: 1px solid black;
    padding: 1rem;
    border-radius: 1rem;
    margin: 1rem;
    backdrop-filter: blur(10px);
}

.bjCard {
    transition: all 0.5s;
}

.bjPlayer-cards {
    display: flex;
    gap: 1rem;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
    margin: 1rem;
}

.bjPlayer-name {
    display: flex;
    justify-content: center;

    font-size: 1.5em;
    font-weight: bold;
    color: gold;
    border-bottom: 1px solid gold;
}

.playerState {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 2em;
    font-weight: bold;
    color: gold;
    background: rgba(0, 0, 0, 0.5);
    border-radius: 1rem;
    box-shadow: 0 0 1rem 0 rgba(0, 0, 0, 0.9);
    padding: 1rem;
    z-index: 100;
}

.bjPlayer-points {
    display: flex;
    justify-content: center;
    align-items: center;

    font-size: 1.5em;
    font-weight: bold;
    color: gold;
    background: rgba(0, 0, 0, 0.5);
    border-radius: 1rem;
    box-shadow: 0 0 1rem 0 rgba(0, 0, 0, 0.9);

}
</style>