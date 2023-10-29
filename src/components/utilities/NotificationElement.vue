<script setup>
import {getFormattedRemainingTime} from "./DateFormator";
const { title, date, content, id } = defineProps({
    title: {
        type: String,
        required: true
    },
    date: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    id: {
        type: Number,
        required: true
    }
});

const emit = defineEmits(['deleteNotification']);

const deleteNotification = () => {
    emit('deleteNotification', id);
}
</script>

<template>
  <div class="notification" :class="{'legendaire-text special': title.includes('DM') || title.includes('SPECIAL')}">
      <div class="title">
          <strong>{{ title }}</strong>
      </div>
      <div class="date">
          <p>{{ getFormattedRemainingTime(date) }}</p>
      </div>
      <div class="content">
          <p>{{ content }}</p>
      </div>
      <div class="delete">
          <button @click="deleteNotification">X</button>
      </div>
  </div>
</template>
<style scoped>
.notification {
    display: grid;
    grid-template-areas: "title date delete"
      "content content content";
    grid-template-columns: 1fr 1fr 0.1fr;
    border: 1px solid #232222;
    border-radius: 5px;
    margin: 5px;
    padding: 5px;
    grid-gap: 0.5rem;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
    background: rgba(0, 0, 0, 0.5);
    max-width: 40rem;
}

.special {
    border: 1px solid #ff0000;
    box-shadow: 0 0 10px rgba(169, 24, 24, 0.5);
}

.notification .title {
    grid-area: title;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.notification .date {
    grid-area: date;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 0 1rem;
}

.notification .content {
    grid-area: content;
    display: flex;
    justify-content: space-between;
    align-items: center;

}

.notification .delete {
    grid-area: delete;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.notification .delete button {
    background: none;
    border: none;
    color: red;
    font-size: 1.5rem;
    cursor: pointer;
}

.notification .delete button:hover {
    color: darkred;
}
</style>