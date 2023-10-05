<script setup>
import {ref} from "vue";

const emit = defineEmits(['validate', 'cancel']);

const { actionName, selectedCards } = defineProps({
    // TODO
    actionName: {
        type: String,
        required: true,
        default: 'Action'
    },
    selectedCards: {
        type: Array,
        required: false,
        default: () => []
    }
});

const error = ref('');

</script>
<template>
  <div class="actionForm bg-dark-blur">
      <div class="title">
          <h1>{{ actionName.toLocaleUpperCase() }}</h1>
      </div>
      <div class="buttons">
          <div class="button" @click="error = 'Pas encore implémenté'">Valider</div>
          <div class="button" @click="emit('cancel')">Annuler</div>
      </div>
      <div class="footer">
          <span class="red">{{ error }}</span>
      </div>
  </div>
</template>
<style scoped>
.actionForm {
    display: grid;
    grid-template-rows: 30% 55% 15%;
    grid-template-areas: "title" "buttons" "footer";
    margin: 3rem;
    border-radius: 1rem;
    box-shadow: 0 0 1rem 0.5rem rgba(0, 0, 0, 0.2);
    backdrop-filter: blur(5px);
}

.title {
    grid-area: title;
    margin: 0.5rem 0 0 1rem;
}

.buttons {
    grid-area: buttons;
    display: flex;
    justify-content: space-evenly;
    align-items: center;
}

.footer {
    grid-area: footer;
    display: flex;
    justify-content: space-evenly;
    align-items: center;
}
</style>