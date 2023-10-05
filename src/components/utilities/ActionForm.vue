<script setup>
import {computed, ref, watch} from "vue";
import {
  faSquareXmark as leaveIcon,
} from "@fortawesome/free-solid-svg-icons";
import moment from "moment";
const emit = defineEmits(['validate', 'cancel']);

const { actionName, selectedCards, estimatedAction } = defineProps({
    actionName: {
        type: String,
        required: true,
        default: 'Action'
    },
    selectedCards: {
        type: Array,
        required: false,
        default: () => []
    },
    estimatedAction: {
        type: Object,
        required: false,
        default: () => {}
    }
});

const error = ref(estimatedAction.error);



const validate = () => {
    if (selectedCards.length === 0) {
        error.value = 'Vous devez sélectionner au moins une carte';
        return;
    }
    emit('validate', selectedCards);
}

function getFormattedRemainingTime(endDateStr) {
  moment.locale('fr');
  const now = moment();
  const endDate = moment(endDateStr);
  const remainingTime = moment.duration(endDate.diff(now));
  return remainingTime.locale('fr').humanize(true);
}

</script>
<template>
  <div class="actionForm bg-dark-blur">
      <div class="title">
          <h1>{{ actionName.toLocaleUpperCase() }}</h1>
      </div>
      <div class="estimations">
        <div class="info">
          <span class="little_title">Temps éstimé</span>
          <div>{{ estimatedAction.endTime ? getFormattedRemainingTime(estimatedAction.endTime) : "" }}</div>
        </div>
        <div class="info">
          <span class="little_title">Gains éstimés</span>
          <div class="resources">
            <div class="resource">
              <span>0</span>
              <span> Or</span>
            </div>
            <div class="resource">
              <span>0</span>
              <span> Repas</span>
            </div>
            <div class="resource">
              <span>0</span>
              <span> Creatium</span>
            </div>
          </div>
        </div>
        <div class="info">
          <span class="little_title">Coût éstimé</span>
        </div>
      </div>
      <div class="buttons">
          <button class="validate swipe-overlay-out" @click="">Valider</button>
          <div class="leave leave red" @click="emit('cancel')"><svg-icon :fa-icon="leaveIcon" :size="45"/></div>
      </div>
      <div class="errorInfo">
          <span class="red">{{ error }}</span>
      </div>
  </div>
</template>
<style scoped>
.actionForm {
    display: grid;
    grid-template-rows: 22% 50% 20%;
    grid-template-areas: "title" "estimations" "buttons";
    grid-template-columns: 2fr 1fr;
    margin: 3rem;
    border-radius: 1rem;
    box-shadow: 0 0 1rem 0.5rem rgba(0, 0, 0, 0.2);
    backdrop-filter: blur(5px);
    overflow: hidden;
}

.title {
    grid-area: title;
    margin: 0.5rem 0 0.5rem 1rem;
}

.little_title {
  font-size: 1.2rem;
  font-weight: bold;
}

.buttons {
    grid-area: buttons;
    grid-column: 2;
    display: flex;
    justify-content: space-evenly;
    cursor: pointer;
}

.leave {
  transition: all 0.2s ease-in-out;
}

.leave:hover {
  transform: scale(1.2);
  color: var(--vt-c-red-2);
  filter: drop-shadow(0 0 4px var(--vt-c-red-2));
}

.validate:hover {
  transform: scale(1.2);
  color: var(--vt-c-green-1);
  filter: drop-shadow(0 0 4px var(--vt-c-green-1));
}

.estimations {
    grid-area: estimations;
    grid-column: 1;
    grid-row: 2 / 4;
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
     grid-template-rows: 1rem 4rem;
    margin-left: 1rem;
    justify-content: space-evenly;
}

.errorInfo {
    display: flex;
    justify-content: space-evenly;
    align-items: center;
}
</style>