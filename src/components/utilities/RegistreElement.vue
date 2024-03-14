<script setup>
import {format} from "@/components/utilities/DateFormator";
import {ref} from "vue";
import {
    faChevronDown as chevronDownIcon,
    faChevronUp as chevronUpIcon,
    faFire as fireIcon,
    faGun as weaponIcon,
    faBurger as nourritureIcon,
    faCoins as orIcon,
    faCubesStacked as creatiumIcon
} from "@fortawesome/free-solid-svg-icons";
import {router} from "@/helpers";

const showMoreInfo = ref(false);

const {
    registre
} = defineProps({
    registre: {
        type: Object,
        required: true,
        default: () => {}
    }
});

const emit = defineEmits(['cancelTrade']);
</script>

<template>
  <div class="registre">
      <div class="row1" @click="showMoreInfo = !showMoreInfo">
          <div>
              <div class="titre" :class="[{'blue': registre.type === 0}, {'red': registre.type === 1}, {'green': registre.type === 3}]">
                  {{ registre.name.charAt(0).toUpperCase() + registre.name.slice(1) }}
              </div>
              <div class="date">
                  {{ 'Découverte le ' + format(registre.encounterDate, "DD MMMM YYYY HH:mm:ss Z") }}
              </div>
          </div>
        <div class="buttons">
            <button class="moreInfo">
                <svg-icon v-if="showMoreInfo" class="shadow-black" :fa-icon="chevronUpIcon" :size="18"/>
                <svg-icon v-else class="shadow-black" :fa-icon="chevronDownIcon" :size="18"/>
            </button>
        </div>
      </div>
      <div class="moreInfoContent" :class="{ 'show': showMoreInfo }">
          <div class="infosContainer">
              <!-- PLAYER -->
              <div v-if="registre.type === 0">
                  <ul class="infos">
                      <li class="infoCase">
                          <span class="infoValue clickable"
                                @click="router.push('/stats/'+registre.relatedPlayerId);">
                              Joueur : <span class="green">{{ registre.relatedPlayerName ?? 'Wesh' }}</span>
                          </span>
                      </li>
                  </ul>
              </div>
              <!-- HOSTILE -->
              <div v-if="registre.type === 1">
                  <div class="infos">
                      <div class="infoCase meethicColored powerText">
                          <span class="infoValue">{{ registre.cardPower }}</span>
                          <span><svg-icon :fa-icon="fireIcon" :size="35"/></span>
                      </div>
                      <div class="infoCase meethicColored powerText">
                          <span class="infoValue">{{ registre.cardWeaponPower }}</span>
                          <span><svg-icon :fa-icon="weaponIcon" :size="35"/></span>
                      </div>
                  </div>
              </div>
              <!-- NEUTRAL -->
              <div v-if="registre.type === 2">
              </div>
              <!-- FRIENDLY -->
              <div v-if="registre.type === 3">
                  <div class="infos">
                      <div class="infoCase" :class="[
                          {'or': registre.resourceDemand === 'or'},
                          { 'food': registre.resourceDemand === 'nourriture' },
                          { 'creatium': registre.resourceDemand === 'creatium' }]">
                          <span class="infoValue">-{{ registre.resourceDemandAmount ?? 0 }}</span>
                          <span>
                              <svg-icon v-if="registre.resourceDemand === 'creatium'" :fa-icon="creatiumIcon" :size="35"/>
                              <svg-icon v-if="registre.resourceDemand === 'nourriture'" :fa-icon="nourritureIcon" :size="35"/>
                              <svg-icon v-if="registre.resourceDemand === 'or'" :fa-icon="orIcon" :size="35"/>
                          </span>
                      </div>
                      <div class="infoCase">
                          <span class="epic-text" style="font-size: 1.5rem; font-weight: bold;">CONTRE</span>
                      </div>
                      <div class="infoCase" :class="[
                          {'or': registre.resourceOffer === 'or'},
                          { 'food': registre.resourceOffer === 'nourriture' },
                          { 'creatium': registre.resourceOffer === 'creatium' }]">
                          <span class="infoValue">+{{ registre.resourceOfferAmount ?? 0 }}</span>
                          <span>
                              <svg-icon v-if="registre.resourceOffer === 'creatium'" :fa-icon="creatiumIcon" :size="35"/>
                              <svg-icon v-if="registre.resourceOffer === 'nourriture'" :fa-icon="nourritureIcon" :size="35"/>
                              <svg-icon v-if="registre.resourceOffer === 'or'" :fa-icon="orIcon" :size="35"/>
                          </span>
                      </div>
                  </div>
                  <div class="infoCase">
                      <a class="meethicColored" style="font-size: 1rem; font-weight: bold;"
                       @click="emit('cancelTrade', registre.id)">Annuler le trade</a>
                  </div>
              </div>
          </div>
          <div class="description">
              <span class="infoTitle">Description :</span>
              {{ registre.description }}
          </div>
      </div>
  </div>
</template>

<style scoped>


.registre {
    z-index: 100;
    display: flex;
    flex-direction: column;
    width: 100%;
    margin-bottom: 0.4rem;
}

.row1 {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    cursor: pointer;
    align-items: center;
}

.titre {
    font-size: 1.5rem;
    font-weight: bold;
    margin-right: 1rem;
}

.date {
    font-size: 1rem;
    font-weight: 300;
}

.moreInfoContent {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin-top: 1rem;
    transition: all 0.3s ease-in-out;
    opacity: 0;
    visibility: hidden;
    max-height: 0;
    overflow: hidden;
}

.show {
    opacity: 1;
    visibility: visible;
    max-height: 500px;
}

.description {
    font-size: 1rem;
    font-weight: 300;
    margin-bottom: 1rem;
    text-align: center;
}

.buttons {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
}

.moreInfo {
    background-color: transparent;
    border: none;
    outline: none;
    color: var(--vt-c-white-1);
}

.moreInfo:hover {
    transform: scale(1.1);
}

.infosContainer {
    width: 100%;
}

.infos {
    padding: 0 1.5rem;
    display: grid;
    grid-auto-flow: column;

}

.infoCase {
    display: flex;
    justify-content: center;
    align-items: center;
}

.infoValue {
    font-size: 2rem;
    font-weight: bolder;
}

</style>