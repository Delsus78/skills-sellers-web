<script setup>
import {useRegistreStore, useBattleStore} from "@/stores";
import {storeToRefs} from "pinia";
import {useRoute} from "vue-router";
import RegistreElement from "@/components/utilities/RegistreElement.vue";
import {computed, onBeforeMount} from "vue";
import {router} from "@/helpers";

const route = useRoute();
const userId = route.params.id;

const registreStore = useRegistreStore();
const { registreInfo } = storeToRefs(registreStore);

onBeforeMount(() => {
    registreStore.getRegistreInfo(userId);
});

const hostileRegistres = computed(() => {
    return registreInfo.value.registres.filter(registre => registre.type === 1);
});

const neutralRegistres = computed(() => {
    return registreInfo.value.registres.filter(registre => registre.type === 2);
});

const friendlyRegistres = computed(() => {
    return registreInfo.value.registres.filter(registre => registre.type === 3);
});

function cancelTrade(registreId) {
    registreStore.deleteFriendlyRegistre(registreId);
}

function attackRegistre(registreId) {
    router.push({path: '/bataille', query: {registreCibleId: registreId}});
}

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
                  NEUTRES
              </div>
              <div class="registresList">
                  <RegistreElement :registre="registre" v-for="registre in neutralRegistres" :key="registre.id" />
              </div>
          </div>
          <div class="friendly registres bg-dark-blur">
              <div class="DivTitle">
                  AMICALES
              </div>
              <div class="registresList">
                  <RegistreElement :registre="registre" v-for="registre in friendlyRegistres" :key="registre.id"
                    interact-btn-text="Annuler le trade" @interact="cancelTrade"/>
              </div>
          </div>
          <div class="hostile registres bg-dark-blur">
              <div class="DivTitle">
                  HOSTILES
              </div>
              <p class="discret">
                  Défense des registres hostiles : 5 fois les valeurs ici.
              </p>
              <div class="registresList">
                  <RegistreElement :registre="registre" v-for="registre in hostileRegistres" :key="registre.id"
                                   interact-btn-text="Attaquer" @interact="attackRegistre"/>
              </div>
          </div>
      </div>
  </div>
</template>

<style scoped>
.content {
    margin-top: 10rem;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: row;
    justify-content: space-evenly;

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