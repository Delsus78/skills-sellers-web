<script setup>

import ListSelector from "@/components/utilities/cards/CardListSelector.vue";
import ActionForm from "@/components/utilities/actions/ActionForm.vue";
import {onBeforeMount, onMounted, ref, watch} from "vue";
import {useRoute} from "vue-router";
import {storeToRefs} from "pinia";
import {useActionsStore, useAuthStore, useCardsStore, useUsersStore} from "@/stores";
import {router} from "@/helpers";


const route = useRoute();
const cardsStore = useCardsStore();
const actionsStore = useActionsStore();
const authStore = useAuthStore();
const usersStore = useUsersStore();


const { user: authUser } = storeToRefs(authStore);
const { cards } = storeToRefs(cardsStore);
const actionType = ref(route.params.actionType.toLowerCase());
const routeCardsIds = route.params.cardsIds;
const estimatedAction = ref({});
const selectedCardsIds = ref([]);
const batimentToUpgrade = ref("cuisine");

onBeforeMount(async () => {
    if (routeCardsIds) {
        selectedCardsIds.value = routeCardsIds.split(',').map(id => parseInt(id));

        await refreshEstimatedAction();
    }
});

watch(() => cards.value, async () => {
    await refreshEstimatedAction();
});

const refreshEstimatedAction = async () => {
    let cardsIds = selectedCardsIds.value;
    console.log(cardsIds);
    if (cardsIds.length === 0) {
        estimatedAction.value = {};
        return;
    }
    let params = actionType.value === "ameliorer" ? {batimentToUpgrade: batimentToUpgrade.value} : {batimentToUpgrade: null};
    estimatedAction.value = await actionsStore.postEstimatedActionForCards(cardsIds, actionType.value, params);
}

const sendAction = async () => {
    let cardsIds = selectedCardsIds.value;

    console.log(cardsIds);
    let params = actionType.value === "ameliorer" ? {batimentToUpgrade: batimentToUpgrade.value} : {batimentToUpgrade: null};
    await actionsStore.postActionForCards(cardsIds, actionType.value, params);

    await usersStore.getBuildingsOfUser(authUser.value.id);
    await cardsStore.getAllCardsFromUser(authUser.value.id);

    await router.push('/batiments');
}

const cancelAction = async () => {
    await router.push('/batiments');
}

const onSelectedCardsChanged = async (cards) => {
    selectedCardsIds.value = cards;
    await refreshEstimatedAction();
}

const setBatimentToUpgrade = async (batiment) => {
    batimentToUpgrade.value = batiment;
    await refreshEstimatedAction();
}
</script>

<template>
  <div class="ActionWrapper">
      <div v-if="cards.loading">
          <p class="huge-text">Chargement des cartes...</p>
      </div>
      <div v-else-if="cards.error" class="huge-text text-danger">
          Erreur lors du chargement des cartes: {{cards.error}}
      </div>
      <div v-else class="ActionFormDiv">
          <ListSelector class="cardsList" :cards="cards" :title="actionType" withFilters
                        :selected-action="actionType" :init-selected-cards-ids="selectedCardsIds"
                        :removed-stats-at10="actionType === 'muscler' ? [{name:'force', value:10}] : []"
                        @resulted-list="onSelectedCardsChanged"/>
          <ActionForm class="actionForm" :action-name="actionType" :selected-cards="selectedCardsIds"
                      :estimated-action="estimatedAction" :batiment-to-upgrade="{name: batimentToUpgrade}"
                      @cancel="cancelAction" @validate="sendAction" :key="estimatedAction"
                      @updateBatiment-to-upgrade="setBatimentToUpgrade"/>
      </div>
  </div>
</template>

<style scoped>
.ActionFormDiv {
    min-height: 80rem;
}
.actionForm {
    position: fixed;
    bottom: 6rem;
    right: 0;
    padding: 2rem;
    height: 20rem;
    width: 50rem;
    z-index: 100;

    @media (max-width: 1023px) {
        width: 100%;
        height: 20rem;
        bottom: 1rem;
    }
}
</style>