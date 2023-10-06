<script setup>
import {onMounted, ref} from "vue";
import {
  faSquareXmark as leaveIcon,
} from "@fortawesome/free-solid-svg-icons";
import dropdown from 'vue-dropdowns';
import {getFormattedRemainingTime} from './DateFormator';
const emit = defineEmits(['validate', 'cancel', 'updateBatimentToUpgrade']);

const { actionName, selectedCards, estimatedAction, batimentToUpgrade } = defineProps({
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
    },
    batimentToUpgrade: {
        type: Object,
        required: false,
        default: () => {}
    }
});

const error = ref(estimatedAction.error);
const batToUpDisplay = ref(batimentToUpgrade);

const validate = () => {
    if (selectedCards.length === 0) {
        error.value = 'Vous devez sélectionner au moins une carte';
        return;
    }
    emit('validate', selectedCards);
}

onMounted(() => {
    console.log(batToUpDisplay.value);
});

const handleUpdateOption = (option) => {
    batToUpDisplay.value = option;
    emit('updateBatimentToUpgrade', batToUpDisplay.value.name);
}



</script>
<template>
  <div class="actionForm bg-dark-blur">
      <div class="title">
          <h1>{{ actionName.toLocaleUpperCase() }}</h1>
      </div>
      <div class="estimations">
        <div class="info">
          <span class="little_title">Temps estimé</span>
          <div>{{ estimatedAction.endTime ? getFormattedRemainingTime(estimatedAction.endTime) : "" }}</div>
        </div>
        <div class="info">
          <span class="little_title">Gains estimés</span>
            <div v-if="Object.keys(estimatedAction.gains || {}).length === 0">
                <span>
                    <strong>RIEN</strong>
                </span>
            </div>
            <div v-else v-for="(key, val) in estimatedAction.gains" class="resource">
                <span>
                    <strong>{{ key }}</strong> {{ val }}
                </span>
            </div>
        </div>
        <div class="info">
          <span class="little_title">Coût estimé</span>
            <div v-if="Object.keys(estimatedAction.couts || {}).length === 0">
                <span>
                    <strong>RIEN</strong>
                </span>
            </div>
            <div v-else v-for="(key, val) in estimatedAction.couts" class="resource">
                <span>
                    <strong>{{ key }}</strong> {{ val }}
                </span>
            </div>
        </div>
      </div>
      <dropdown v-if='actionName === "ameliorer"' class="dropdown-batiments"
                :options="[{name: 'cuisine'},{name: 'spatioport'},{name: 'salledesport'}]"
                placeholder="Choisissez un batiment à améliorer"
                :selected="batimentToUpgrade"
                v-on:updateOption="handleUpdateOption"></dropdown>
      <div class="buttons">
          <button class="validate swipe-overlay-out" @click="validate()">Valider</button>
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

.validate {
  transition: all 0.2s ease-in-out;
    z-index: 100;
}

.validate:hover {
  transform: scale(1.2);
  color: var(--vt-c-green-1);
  filter: drop-shadow(0 0 4px var(--vt-c-green-1));
}

.dropdown-batiments {
    grid-area: estimations;
    grid-column: 2;
    grid-row: 2 / 4;
    margin: 1rem auto;
}

:deep(.btn-group) {
    width: 80%;
}

:deep(.dropdown-toggle) {
    filter: drop-shadow(0 0 4px var(--vt-c-green-1));
    border-radius: 6px;
    border-width: 2px;
    border-style: solid;
    color: var(--vt-c-green-1);
    transition: all 0.2s ease-in-out;
    font-size: 1.2rem;
    font-weight: 800;
    z-index: 300;
}

:deep(.dropdown-toggle:hover) {
    text-shadow: 0 0 10px var(--vt-c-black-soft);
    background: transparent;
    transform: scale(1.2);
}

:deep(.dropdown-toggle-placeholder) {
    color: #c4c4c4;
}

:deep(.dropdown-menu) {
    border: 1px solid var(--vt-c-white-1);
    border-radius: 0.5rem;
    box-shadow: 0 0 1rem 0.5rem rgba(0, 0, 0, 0.2);
    background: transparent;
    backdrop-filter: blur(5px);
}

:deep(.dropdown-menu li a) {
    color: var(--vt-c-white-1);
    font-size: 0.8rem;
    font-weight: 800;
    z-index: 300;
}

:deep(.dropdown-menu li a:hover) {
    transform: scale(1.2);
    background: transparent;
    color: var(--vt-c-green-1);
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