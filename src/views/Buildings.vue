<script setup>
import {useUsersStore, useAuthStore, useCardsStore, useActionsStore} from "@/stores";
import {storeToRefs} from "pinia";
import BatimentElement from "@/components/utilities/BatimentElement.vue";
import RandomPlanet from "@/components/utilities/RandomPlanet.vue";
import {onMounted, ref, watch} from "vue";
import ListSelector from "@/components/utilities/CardListSelector.vue";
import ActionForm from "@/components/utilities/ActionForm.vue";
const usersStore = useUsersStore();
const authStore = useAuthStore();
const cardsStore = useCardsStore();
const actionsStore = useActionsStore();

const { buildings } = storeToRefs(usersStore);
const { user: authUser } = storeToRefs(authStore);
const { cards } = storeToRefs(cardsStore);
const { estimatedAction } = storeToRefs(actionsStore);

usersStore.getBuildingsOfUser(authUser.value.id);
cardsStore.getAllCardsFromUser(authUser.value.id);

const selectedAction = ref("");
const selectedCards = ref([]);

const SelectAction = (action) => {
    selectedAction.value = action;
}

defineExpose({
    SelectAction,
});

const sendAction = () => {
    console.log(selectedCards.value);
}

watch(selectedCards, (newValue) => {
  console.log(newValue);
  let cardsIds = newValue.map(card => card.id);
  actionsStore.postEstimatedActionForCards(cardsIds, selectedAction.value, null);

  console.log(estimatedAction.value);
});

</script>
<template>
    <div class="BuildingsWrapper">
        <div v-if="buildings.loading">
            <p class="huge-text">Chargement des bâtiments...</p>
        </div>
        <div v-else-if="buildings.error" class="huge-text text-danger">
            Erreur lors du chargement des bâtiments: {{buildings.error}}
        </div>
        <div v-else-if="selectedAction === ''" class="Batiments">
            <BatimentElement class="Cantine" :level="buildings.cuisineLevel" nom-batiment="CUISINE"
                             @click="SelectAction('cuisiner');"/>
            <BatimentElement class="SalleDeSport" :level="buildings.salleSportLevel" nom-batiment="SALLE DE SPORT"
                             @click="SelectAction('muscler');"/>
            <BatimentElement class="Labo" :level="buildings.laboLevel" nom-batiment="LABO"
                             @click="SelectAction('ameliorer');"/>
            <BatimentElement class="SpatioPort" :level="buildings.spatioPortLevel" nom-batiment="SPATIOPORT"
                             @click="SelectAction('explorer');"/>
        </div>
        <div v-if="selectedAction !== ''" class="ActionFormDiv">
            <ListSelector class="cardsList" :objects="cards" title="Cartes"/>
            <ListSelector v-if="selectedAction !== ''" class="selectedCardsList" :objects="[]" title="Cartes selectionnees"
                          @resulted-list="selectedCards = $event" is-dropped-zone :max-card-autorized="1"/>
            <ActionForm class="actionForm" :action-name="selectedAction" :selected-cards="selectedCards" :estimated-action="estimatedAction"
                @cancel="selectedAction = ''" @validate="sendAction" :key="estimatedAction"/>
        </div>
        <RandomPlanet class="planetBuilding" :class="{ actionSelectedMode : selectedAction }" v-model="authUser.pseudo" :width="850" :height="850" :planet-id='1'/>
    </div>
</template>

<style scoped>
.BuildingsWrapper {
    width: 100%;
    height: 100%;
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    grid-template-rows: 6rem 1fr;
    align-items: center;
    justify-items: center;
}

.Batiments {
    grid-column: 2;
    grid-row: 2;
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-template-rows: repeat(2, 1fr);
    width: 100%;
    height: 100%;
    z-index: 101;
    justify-items: center;
    align-items: center;
}

.planetBuilding {
    grid-column: 2;
    grid-row: 2;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 1;
    transition: all 0.5s ease-in-out;
}

.actionSelectedMode {
    filter: brightness(0.5);
    transform: translateY(75%) scale(2);
}

.ActionFormDiv {
    grid-column: 1 / 4;
    grid-row: 1 / 3;
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    grid-template-rows: 6rem repeat(3, 1fr);
    grid-gap: 1rem;
    width: 100%;
    height: 100%;
    justify-items: center;
    align-items: center;
    padding: 4rem;
}

.cardsList {
    grid-column: 1 / 3;
    grid-row: 2 / 5;
    z-index: 100;
    height: 100%;
    width: 90%;
}

.selectedCardsList {
    grid-column: 3 / 5;
    grid-row: 2 / 4;
    z-index: 100;
    height: 100%;
    width: 90%;
}

.actionForm {
    grid-column: 3 / 5;
    grid-row: 4;
    z-index: 100;
    height: 100%;
    width: 90%;
}
</style>