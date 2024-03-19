<script setup>
import { useRegistreStore } from "@/stores";
import { storeToRefs } from "pinia";
import {getFormattedRemainingTime} from "@/components/utilities/DateFormator";
import {
    faRotateRight as homeIcon,
    faTrashCan as deleteIcon
} from "@fortawesome/free-solid-svg-icons";
import {ref} from "vue";

const registreStore = useRegistreStore();
const { fightReports } = storeToRefs(registreStore);

registreStore.getFightReports();
const lastUpdate = ref(new Date().toLocaleString());

function refresh() {
    lastUpdate.value = new Date().toLocaleString();
    registreStore.getFightReports();
}

function formatFightDescription(description) {
    // change *! to <span class="red"> and !* to </span>
    return description.replaceAll("*!", "<strong class='green'>").replaceAll("!*", "</strong>");
}

</script>

<template>
  <div v-if="fightReports.loading">
      <p class="shadow-white">Chargement des rapports de combats...</p>
  </div>
  <div v-else-if="fightReports.error" class="huge-text text-danger">
      Error loading fight reports: {{fightReports.error}}
  </div>
  <div v-else class="fightreports bg-dark-blur">
    <div class="fight-reports_header">
        <p class="DivTitle">rapports de combats</p>
        <svg-icon class="shadow-white" @click="refresh" :fa-icon="homeIcon" :size="24"/>
    </div>
    <ul class="fight-reports-list">
        <li v-for="fightReport in fightReports" :key="fightReport.id" class="fight-report-element">
            <div class="fight-report-date">
                <p>{{ getFormattedRemainingTime(fightReport.fightDate) }}</p>
            </div>
            <div class="fight-report-description">
                <p v-for="description in fightReport.description" :key="description" v-html="formatFightDescription(description)"/>
            </div>
        </li>
    </ul>
    <div class="reports-footer">
        <p>Dernière mise à jour : {{ lastUpdate }}</p>
    </div>
  </div>
</template>

<style scoped>
.fightreports {
    display: grid;
    grid-template-rows: 2fr 10fr 2fr;
    grid-template-areas: "title" "list" "footer";
    padding: 1rem;
    margin-top: 5rem;
    border-radius: 1rem;
    box-shadow: 0 0 1rem 0.5rem rgba(0, 0, 0, 0.2);
    backdrop-filter: blur(5px);  /* Effet de flou sur l'arrière-plan */

    @media (max-width: 1023px) {
        border-radius: 0;
        box-shadow: none;
    }
}

.fight-reports_header {
    grid-area: title;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.fight-reports_header svg {
    position: absolute;
    top: 3.2rem;
    right: 2rem;
}

.fight-reports_header svg:hover {
    cursor: pointer;
}

.fight-reports-list {
    grid-area: list;
    color: #ffffff;
    overflow-y: auto;
    list-style-type: none;
    height: 30rem;
    width: 50rem;
    padding: 0;

    @media (max-width: 1023px) {
        width: 100%;
        height: 100%;
    }
}

.fight-report-element {
    border-radius: 0.5rem;
    box-shadow: 0 0 0.5rem 0.25rem rgba(0, 0, 0, 0.2);
    margin: 1.3rem;
    padding: 0.4rem;
    backdrop-filter: blur(5px);  /* Effet de flou sur l'arrière-plan */

    &:hover {
        transform: scale(1.05);
        box-shadow: 0 0 0.5rem 0.25rem rgba(0, 0, 0, 0.4);
    }
}

.fight-report-date {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    font-size: 1rem;
    font-weight: bold;
    border-top: 2px solid whitesmoke;
    border-bottom: 1px dashed rgba(126, 120, 120, 0.35);
}

.fight-report-description {
    display: flex;
    flex-direction: column;
    justify-content: left;
    height: 100%;
    font-size: 1rem;
    font-weight: bold;
}

.reports-footer {
    grid-area: footer;
    margin: 1rem auto;
    font-size: 1rem;
    color: #737272;  /* Nuance de gris foncé pour le texte */
    text-shadow: 0 0 0.5rem #000000;  /* Ombre portée du texte */
}
</style>