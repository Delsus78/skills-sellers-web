<script setup>
import {useRegistreStore} from "@/stores";
import {storeToRefs} from "pinia";
import {useRoute} from "vue-router";
import RegistreElement from "@/components/utilities/RegistreElement.vue";
import {computed} from "vue";

const route = useRoute();
const userId = route.params.id;

const registreStore = useRegistreStore();
const { registreInfo } = storeToRefs(registreStore);
registreStore.getRegistreInfo(userId);

const playerRegistres = computed(() => {
    return registreInfo.value.registres?.filter(registre => registre.type === 0);
});

</script>

<template>
    <div class="registre_container">
        <div v-if="registreInfo.loading">
            <p class="huge-text">Chargement des informations...</p>
        </div>
        <div v-else-if="registreInfo.error">
            <p class="huge-text">Erreur lors du chargement des informations</p>
        </div>
        <div v-else class="content">
            <div class="neutral registres bg-dark-blur">
                <div class="DivTitle">
                    JOUEURS
                </div>
                <div class="registresList">
                    <RegistreElement :registre="registre" v-for="registre in playerRegistres" :key="registre.id" />
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.content {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: row;
    justify-content: space-evenly;
    align-items: center;

    @media (max-width: 768px) {
        margin-top: 5rem;
        flex-direction: column;
    }
}
.registres {
    width: 100%;
    height: 100%;
    border-radius: 10px;
    padding: 10px;
    margin: 10px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    border: 2px solid #fff;
}

.registresList {
    width: 30rem;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    overflow-y: auto;
    overflow-x: hidden;

    @media (max-width: 768px) {
        width: 100%;
    }
}
</style>