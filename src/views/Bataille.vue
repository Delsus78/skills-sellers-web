<script setup>

import {useAuthStore, useBattleStore, useCardsStore, useRegistreStore} from "@/stores";
import {faChevronDown} from "@fortawesome/free-solid-svg-icons";
import {storeToRefs} from "pinia";
import {computed, onBeforeMount, ref} from "vue";
import RegistreElement from "@/components/utilities/RegistreElement.vue";
import {useRoute} from "vue-router";
import ListSelector from "@/components/utilities/cards/CardListSelector.vue";
import {getFormattedRemainingTime} from "@/components/utilities/DateFormator";
import TextCardList from "@/components/utilities/cards/textCardList.vue";
import {router} from "@/helpers";

const authStore = useAuthStore();
const cardsStore = useCardsStore();
const { user } = storeToRefs(authStore);

const registreStore = useRegistreStore();
const battleStore = useBattleStore();
const { registreInfo } = storeToRefs(registreStore);
const { cards } = storeToRefs(cardsStore);
const { invitedWar } = storeToRefs(battleStore);

const route = useRoute();
const registreCibleId = parseInt(route.query.registreCibleId);
const isInvited = computed(() => route.query.invitation === 'true');

const registreCible = ref(null);
const selectedCards = ref([]);
const selectedAllies = ref([]);
const estimatedWar = ref(null);
const filteredCards = computed(() => {
    return cards.value.filter(card => selectedCards.value.includes(card.id));
});

onBeforeMount(async () => {
    await registreStore.getRegistreInfo(user.value.id);
    if (registreCibleId) {
        let registreC = registreInfo.value.registres.find(registre => registre.id === registreCibleId);
        if (registreC.type === 1) {
            registreC.cardPower *= 5;
            registreC.cardWeaponPower *= 5;
        }

        registreCible.value = registreC;
    }

});

const playerRegistres = computed(() => {
    return registreInfo.value.registres.filter(registre => registre.type === 0 && registre.id !== registreCibleId);
});

const changeSelectedCardsIds = (newSelectedCards) => {
    selectedCards.value = newSelectedCards;
    refreshEstimatedAction();
}

const changeSelectedAllies = (registreSelectedId) => {
    if (selectedAllies.value.includes(registreSelectedId))
        selectedAllies.value.splice(selectedAllies.value.indexOf(registreSelectedId), 1)
    else
        selectedAllies.value.push(registreSelectedId);
    refreshEstimatedAction();
}

const refreshEstimatedAction = async () => {
    estimatedWar.value = await battleStore.postEstimateBattle(
        isInvited.value ? 0 : registreCible.value.id,
        selectedCards.value,
        isInvited.value ? [] : selectedAllies.value,
        isInvited.value ?? false,
        isInvited.value ? invitedWar.value.id : null);

    console.log(estimatedWar.value);
}

const startWar = () => {
    battleStore.startBattle(registreCible.value.id, selectedCards.value, selectedAllies.value)
        .then(() => {
            router.push({path: '/'});
        });
}

const acceptInvite = () => {
    battleStore.acceptBattle(selectedCards.value, invitedWar.value.id)
        .then(() => {
            router.push({path: '/'});
        });
}

const declineInvite = () => {
    battleStore.declineBattle(invitedWar.value.id)
        .then(() => {
            router.push({path: '/'});
        });
}

</script>

<template>
  <div class="bataille_container">
      <div class="title shadow-red">
          BATAILLE
      </div>
      <div v-if="!isInvited" class="allys_list registreList">
          <div class="DivTitle">
              INVITER DES ALLIES
          </div>
          <p class="discret" style="text-align: center;font-size: 1rem; margin-bottom: 1rem;">
              Une fois vos cartes et vos alliés sélectionnés, le combat commencera 30 minutes après afin de laisser à la cible le temps de se préparer et à vos alliés d'accepter.
              Pensez bien à prévenir ces derniers à l'avance afin de connaître leurs disponibilités !
          </p>
          <RegistreElement :class="{selected: selectedAllies.includes(registre.id)}"
              :registre="registre" v-for="registre in playerRegistres" :key="registre.id"
              isShowMoreInfo :interact-btn-text="selectedAllies.includes(registre.id) ? 'Retirer' : 'Inviter'"
                           @interact="changeSelectedAllies(registre.id)"/>
      </div>
      <div v-if="!isInvited" class="war_panel_control">
          <div v-if="estimatedWar != null" class="container">
              <div v-if="!estimatedWar.isWarPossible" class="estimationError">
                  {{estimatedWar.message}}
              </div>
              <div v-else class="estimation">
                  <div class="title shadow-black">
                      Estimation du combat
                  </div>
                  <div>
                      <span class="little_title">Partir avec {{selectedCards.length}} carte(s) :</span>
                      <TextCardList class="cardsDisplayedList" :cards="filteredCards" withPower withAffinity/>
                  </div>
                  <div>
                      <span class="little_title">Retour des cartes</span>
                      <span class="infoText">{{getFormattedRemainingTime(estimatedWar.estimatedDuration)}}</span>
                  </div>
                  <div>
                      <span class="little_title">Couts estimés</span>
                      <div v-if="Object.keys(estimatedWar.couts || {}).length === 0">
                          <span class="infoText"><strong>RIEN</strong></span>
                      </div>
                      <div v-else v-for="(key, val) in estimatedWar.couts">
                          <span class="infoText"><strong>{{ key }}</strong> {{ val }}</span>
                      </div>
                  </div>
                  <button class="validate red swipe-overlay-out" @click="startWar">QUE LA GUERRE COMMENCE AAAAAH</button>
              </div>
          </div>
          <div v-else class="container">
              <div class="discret">
                  Sélectionnez vos cartes et vos alliés pour obtenir une estimation du combat
              </div>
          </div>
      </div>
      <div v-if="!isInvited" class="ennemy registreList">
          <div class="DivTitle">
              CIBLE
          </div>
          <RegistreElement v-if="registreCible != null" :registre="registreCible" isShowMoreInfo interact-btn-text=""/>
      </div>

      <!-- Invited war -->
      <div v-else class="war_panel_control">
          <div v-if="estimatedWar != null" class="container">
              <div v-if="!estimatedWar.isWarPossible" class="estimationError">
                  {{estimatedWar.message}}
              </div>
              <div v-else class="estimation">
                  <div class="title shadow-black">
                      Estimation du combat
                  </div>
                  <div>
                      <span class="little_title">Partir avec {{selectedCards.length}} carte(s) :</span>
                      <TextCardList class="cardsDisplayedList" :cards="filteredCards" withPower withAffinity/>
                  </div>
                  <div>
                      <span class="little_title">Retour des cartes</span>
                      <span class="infoText">{{getFormattedRemainingTime(estimatedWar.estimatedDuration)}}</span>
                  </div>
                  <div>
                      <span class="little_title">Couts estimés</span>
                      <div v-if="Object.keys(estimatedWar.couts || {}).length === 0">
                          <span class="infoText"><strong>RIEN</strong></span>
                      </div>
                      <div v-else v-for="(key, val) in estimatedWar.couts">
                          <span class="infoText"><strong>{{ key }}</strong> {{ val }}</span>
                      </div>
                  </div>
              </div>

          </div>
          <div v-else class="container">
              <div class="discret">
                  Sélectionnez vos cartes et vos alliés pour obtenir une estimation du combat
              </div>
          </div>

          <div class="invited_buttons">
              <button v-if="estimatedWar != null && estimatedWar.isWarPossible" class="validate swipe-overlay-out" @click="acceptInvite">ACCEPTER</button>
              <button class="validate red swipe-overlay-out" @click="declineInvite">REFUSER</button>
          </div>
      </div>

      <div class="addCards">
          <div class="DivTitle little_title">
              <svg-icon class="shadow-white" :fa-icon="faChevronDown" :size="30"/> AJOUTER DES CARTES <svg-icon class="shadow-white" :fa-icon="faChevronDown" :size="30"/>
          </div>
          <ListSelector :cards="cards" v-if="cards?.length"
                        withFilters
                        selected-action="guerre"
                        :init-selected-cards-ids="selectedCards"
                        @resulted-list="changeSelectedCardsIds" />
      </div>
  </div>
  <div class="custom_background"/>
</template>

<style scoped>
.bataille_container {
    margin-top: 6rem;
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;

    justify-items: center;
    width: 100%;

    @media (max-width: 1023px) {
        margin-top: 7rem;
        grid-template-columns: 1fr;
        grid-gap: 2rem;
    }
}

.title {
    grid-column: 1 / -1;
    grid-row: 1;
    z-index: 2;
    display: flex;
    justify-content: center;
    align-items: center;
    font-weight: normal;
    font-size: 4.5em;
    text-align: center;
    font-family: "Big John", sans-serif;

    /* Fallback: Set a background color. */
    background-color: #881313;

    /* Create the gradient. */
    background-image: linear-gradient(45deg, #ff7f7f, #a10000);

    /* Set the background size and repeat properties. */
    background-size: 100%;
    background-repeat: repeat;

    /* Use the text as a mask for the background. */
    /* This will show the gradient as a text color rather than element bg. */
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    -moz-background-clip: text;
    -moz-text-fill-color: transparent;
}

.title::after {
    content: '';
    position: absolute;
    width: 100%;
    height: 100%;
    z-index: -10;
    background-image: linear-gradient(to right, transparent, rgb(87, 11, 11), transparent);
    background-size: 100% 2px;
    background-repeat: no-repeat;
    background-position: bottom;
}

.custom_background {
    background-image: url('../assets/images/galaxy_background.gif');
    background-size: cover;
    background-repeat: no-repeat;
    background-attachment: fixed;
    background-position: center;
    height: 100vh;
    width: 100%;
    position: fixed;
    z-index: -1;
    opacity: 0.01;
    top: 0;
    left: 0;
    right: 0;
    overflow: hidden;
    filter: blur(2px);
}

.invited_buttons {
    display: flex;
    column-gap: 2rem;
    justify-content: space-around;
}

.allys_list {
    grid-column: 1;
    grid-row: 2;
    width: 100%;


    @media (max-width: 1023px) {
        grid-row: 4;
    }
}

.selected {
    border: 2px solid var(--vt-c-red-2);
    border-radius: 1rem;
}

.war_panel_control {
    grid-column: 2;
    grid-row: 2;
    border-radius: 1rem;
    box-shadow: 0 0 1rem 0.5rem rgba(0, 0, 0, 0.2);
    margin: 3rem;
    width: 100%;
    align-items: center;

    @media (max-width: 1023px) {
        grid-column: 1;
        grid-row: 3;
        margin: 0;
        width: 100%;
        border-radius: 0;

    }
}

.estimationError {
    padding: 1rem;
    border-radius: 1rem;
    border: 2px solid var(--vt-c-red-2);
    font-size: 1.5rem;
    text-align: center;
}

.container {
    padding: 1rem;
    align-items: center;
    justify-content: center;
}

.ennemy {
    grid-column: 3;
    grid-row: 2;
    width: 100%;

    @media (max-width: 1023px) {
        grid-column: 1;
        grid-row: 2;
        margin: 0;
        width: 100%;
        border-radius: 0;
    }
}

.registreList {
    display: grid;
    padding: 1rem;
    margin: 3rem;
    border-radius: 1rem;
    box-shadow: 0 0 1rem 0.5rem rgba(0, 0, 0, 0.2);
    max-height: 35rem;
    overflow: auto;
    width: auto;
    z-index: 1;

    @media (max-width: 1023px) {
        grid-column: 1;
        margin: 0;
        width: 100%;
        border-radius: 0;
    }
}

.addCards {
    grid-column: 1 / -1;
    grid-row: 3;
    display: grid;
    grid-template-rows: 6% 94%;

    height: 100rem;
    z-index: 1;

    @media (max-width: 1023px) {
        grid-column: 1;
        grid-row: 5;
        margin: 0;
        width: 100%;
        border-radius: 0;
    }
}

.DivTitle {
    grid-column: 1 / -1;
    grid-row: 1;
}

.little_title {
    background-image: linear-gradient(to right, transparent, rgb(255, 255, 255), transparent);
    background-size: 100% 1px;
    background-repeat: no-repeat;
    background-position: bottom;
}

.infoText {
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 1rem;
    gap: 0.5rem;
}

.estimation {
    max-height: 35rem;
    width: auto;
    z-index: 1;
    display: grid;
    grid-template-rows: 1fr 1fr 1fr 1fr 1fr;
    gap: 1rem;
    align-items: center;
    justify-items: center;
    text-align: center;

    @media (max-width: 1023px) {
        margin: 0;
        width: 100%;
        border-radius: 0;
    }

}

.cardsDisplayedList {
    max-height: 10rem;
    overflow-y: auto;
    align-items: center;
}

.estimation .title {
    font-size: 2rem;
    text-align: center;
    margin-bottom: 1rem;
    font-weight: bold;

}

.estimation .title::after {
    content: '';
    display: none;
}

.estimation .little_title {
    font-size: 1.5rem;
    font-weight: bold;
    text-align: center;
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
.validate.red:hover {
    color: var(--vt-c-red-1) !important;
    filter: drop-shadow(0 0 4px var(--vt-c-red-1));
}
.validate.red::after {
    background: var(--vt-c-red-1);
}
</style>