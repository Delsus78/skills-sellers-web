<script setup>

import RandomPlanet from "@/components/utilities/RandomPlanet.vue";

const { action } = defineProps({
    action: {
        type: Object,
        required: true,
        default: () => {}
    }
});

const emit = defineEmits(['decision']);

</script>

<template>
    <div class="exploration_info">
        <div class="DivTitle title">
            {{ action.planetName.charAt(0).toUpperCase() + action.planetName.slice(1) }}
        </div>
        <div class="description">
            <span class="">Exploration en cours</span>
        </div>
        <div class="content">
            <div v-if="action.needDecision && action.decision === null">
                <span>Décision à prendre</span>
                <div class="decisionBtns">
                    <button class="validate red swipe-overlay-out" @click="$emit('decision', 0)">Piller</button>
                    <button class="validate green swipe-overlay-out" @click="$emit('decision', 1)">Alliance</button>
                </div>
            </div>
            <div v-else-if="action.needDecision && action.decision != null">
                <span>Vous avez décidé de</span> <span>{{ action.decision === 0 ? 'piller' : 's\'allier' }}</span>
            </div>
        </div>
        <RandomPlanet class="planetArrival"
                      :model-value="action.planetName.charAt(0).toUpperCase() + action.planetName.slice(1)" :height="400" :width="400" :planet-id="3"/>
    </div>

</template>

<style scoped>
.exploration_info {
    position: fixed;
    right: 2rem;
    top: 10rem;
    border: 1px solid white;
    border-radius: 15px;
    color:white;
    box-shadow: 5px 5px 15px rgba(0,0,0,0.9);
    text-align: justify;
    padding:3vw;
    z-index: 100;
    display: grid;
    grid-template-areas: "title" "description" "infos" "planetArrival";
    grid-template-rows: 30% 20% 50%;
}

.title {
    grid-area: title;
    font-size: 3rem;
    color: #ffffff;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 1rem;
    text-align: center;
    text-shadow: 0 0 1rem rgba(204, 49, 49, 0.9);
    letter-spacing: 0.2rem;
}

.content {
    grid-area: infos;
    display: grid;
    grid-template-areas: "text";
    grid-template-rows: 100%;
    grid-template-columns: 100%;
    align-items: center;
    justify-items: center;
    margin-bottom: 1rem;
    text-align: center;
    letter-spacing: 0.2rem;
    font-size: 1.5rem;
    color: #ffffff;
}


.planetArrival {
    grid-area: planetArrival;
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translate(-50%, 10%);

}

.decisionBtns {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 1rem;
}

.validate.red {
    transition: all 0.2s ease-in-out;
    z-index: 100;
    color: var(--vt-c-red-1) !important;
    border-color: var(--vt-c-red-1) !important;
    pointer-events: all;
    @media (max-width: 1023px) {
        width: 50%;
    }
}

.validate:hover {
    transform: scale(1.2);
}

.validate.red:hover {
    color: var(--vt-c-red-1) !important;
    filter: drop-shadow(0 0 4px var(--vt-c-red-1));
}

.validate.green:hover {
    color: var(--vt-c-green-1) !important;
    filter: drop-shadow(0 0 4px var(--vt-c-green-1));
}

.validate.red::after {
    background: var(--vt-c-red-1);
}

</style>