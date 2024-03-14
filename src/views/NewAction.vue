<script setup>

import ListSelector from "@/components/utilities/cards/CardListSelector.vue";
import ActionForm from "@/components/utilities/actions/ActionForm.vue";
import {computed, onBeforeMount, ref, watch} from "vue";
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
const weaponToUpgrade = ref(null);

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
    if (cardsIds.length === 0) {
        estimatedAction.value = {};
        return;
    }
    let params = actionType.value === "ameliorer" ?
        {batimentToUpgrade: batimentToUpgrade.value, weaponToUpgradeId: weaponToUpgrade.value?.id}
      : {batimentToUpgrade: null, weaponToUpgradeId: null};

    estimatedAction.value = await actionsStore.postEstimatedActionForCards(cardsIds, actionType.value, params);
}

const sendAction = async () => {
    let cardsIds = selectedCardsIds.value;

    let params = actionType.value === "ameliorer" ? {batimentToUpgrade: batimentToUpgrade.value, weaponToUpgradeId: weaponToUpgrade.value?.id} : {batimentToUpgrade: null};
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

const setElementToUpgrade = async (type, element) => {
    if (type === "batiment") {
        batimentToUpgrade.value = element;
        weaponToUpgrade.value = null;
    }
    else if (type === "weapon") {
        weaponToUpgrade.value = element;
        batimentToUpgrade.value = null;
    }
    await refreshEstimatedAction();
}

const getElementToDisplayForUpgradeActions = computed(() => {
    if (batimentToUpgrade.value) {
        return {name: batimentToUpgrade.value, id: batimentToUpgrade.value};
    }
    else if (weaponToUpgrade.value) {
        return {name: weaponToUpgrade.value.name, id: weaponToUpgrade.value};
    }
    return null;
});

</script>

<template>
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
                  :estimated-action="estimatedAction" :element-to-upgrade="getElementToDisplayForUpgradeActions"
                  @cancel="cancelAction" @validate="sendAction" :key="estimatedAction"
                  @update-element-to-upgrade="setElementToUpgrade"/>
  </div>
</template>

<style scoped>
.ActionFormDiv {
    min-height: 80rem;
}
</style>