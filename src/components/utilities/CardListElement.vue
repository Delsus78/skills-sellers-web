<script setup>
import moment from "moment/moment";

const { card } = defineProps({
    card: {
        type: Object,
        required: true,
        default: () => {}
    }
});
function getFormattedRemainingTime(endDateStr) {
    moment.locale('fr');
    const now = moment();
    const endDate = moment(endDateStr);
    const remainingTime = moment.duration(endDate.diff(now));
    return remainingTime.locale('fr').humanize(true);
}
</script>
<template>
  <div class="cardListElement">
      <div class="action" :class="{ occuped: card.action }">
          <span><strong>{{ card.action ? card.action.actionName.slice(0, -1) : 'Libre'}}</strong></span>
          <span>{{ card.action ? 'termine(e) ' + getFormattedRemainingTime(card.action.endTime) : ''}}</span>
      </div>
      <img class="image" :src="card.imageUrl" alt="Card Image" width="100"/>
      <span :class="['name', card.rarity + '-text']">{{ card.name }}</span>
      <div class="competences">
          <div class="stat">
            <div class="value">{{ card.competences.cuisine }}</div>
            <div class="type">CUISI</div>
          </div>
          <div class="stat">
              <div class="value">{{ card.competences.charisme }}</div>
              <div class="type">CHARI</div>
          </div>
          <div class="stat">
              <div class="value">{{ card.competences.force }}</div>
              <div class="type">FORCE</div>
          </div>
          <div class="stat">
              <div class="value">{{ card.competences.exploration }}</div>
              <div class="type">EXPLO</div>
          </div>
          <div class="stat">
              <div class="value">{{ card.competences.intelligence }}</div>
              <div class="type">INTEL</div>
          </div>
      </div>

  </div>
</template>
<style scoped>
.cardListElement {
    display: grid;
    grid-template-areas:
            "action action action"
            "image image name"
            "image image competences";
    border-radius: 1rem;
    box-shadow: 0 0 1rem 0.5rem rgba(0, 0, 0, 0.2);
    backdrop-filter: blur(5px);

    cursor: pointer;
    z-index: 100;
}

.action {
    grid-area: action;
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
    font-size: 1.5rem;
    font-weight: bold;
    color: white;
    text-shadow: 0 0 0.5rem black;
    border-radius: 1rem 1rem 0 0;
    height: 5rem;
    background-color: var(--vt-c-green-2);
}

.occuped {
    background-color: #d04c4c;
}

.image {
    grid-area: image;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 0 0 0 1rem;
}

.name {
    grid-area: name;
    display: flex;
    font-size: 1rem;
    margin-left: 0.4rem;
    font-weight: bold;
    color: white;
    text-shadow: 0 0 0.5rem black;
}

.competences {
    grid-area: competences;
    display: flex;
    justify-content: space-evenly;
    color: var(--vt-c-white-dark);
    text-shadow: 0 0 0.5rem black;
}

.stat {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    font-weight: bold;
    font-size: 1rem;
    border-right: 1px solid var(--vt-c-green-2);
}

.stat:last-child {
    border-right: none;
}
</style>