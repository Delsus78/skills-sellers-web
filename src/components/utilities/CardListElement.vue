<script setup>
import {
    faBurger as cuisiIcon,
    faDumbbell as forceIcon,
    faGraduationCap as intelIcon,
    faStar as chariIcon,
    faCompass as exploIcon,
} from "@fortawesome/free-solid-svg-icons";
import {getFormattedRemainingTime} from "./DateFormator";

const { card } = defineProps({
    card: {
        type: Object,
        required: true,
        default: () => {}
    }
});

</script>
<template>
  <div class="cardListElement">
      <div class="action" :class="{ occuped: card.action }">
          <span><strong>{{ card.action ? card.action.actionName.slice(0, -1) : 'Libre'}}</strong></span>
          <span>{{ card.action ? 'termine ' + getFormattedRemainingTime(card.action.endTime) : ''}}</span>
      </div>
      <img class="image" :src="card.imageUrl" alt="Card Image" width="100"/>
      <span :class="['name', card.rarity + '-text']">{{ card.name }}</span>
      <div class="competences">
          <div class="stat">
            <div class="value">{{ card.competences.cuisine }}</div>
            <div class="type">
                <svg-icon  :fa-icon="cuisiIcon" :size="28"/>
            </div>
          </div>
          <div class="stat">
              <div class="value">{{ card.competences.charisme }}</div>
              <div class="type">
                  <svg-icon  :fa-icon="chariIcon" :size="28"/>
              </div>
          </div>
          <div class="stat">
              <div class="value">{{ card.competences.force }}</div>
              <div class="type">
                  <svg-icon  :fa-icon="forceIcon" :size="28"/>
              </div>
          </div>
          <div class="stat">
              <div class="value">{{ card.competences.exploration }}</div>
              <div class="type">
                  <svg-icon  :fa-icon="exploIcon" :size="28"/>
              </div>
          </div>
          <div class="stat">
              <div class="value">{{ card.competences.intelligence }}</div>
              <div class="type">
                  <svg-icon  :fa-icon="intelIcon" :size="28"/>
              </div>
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
    grid-template-rows: 5rem 4rem 5.5rem;
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

/*noinspection CssInvalidPropertyValue*/
.image {
    grid-area: image;
    display: flex;
    justify-content: center;
    align-items: center;
    height: -webkit-fill-available;
}

.name {
    grid-area: name;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
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
    padding: 0.5rem;
}

.stat:last-child {
    border-right: none;
}
</style>