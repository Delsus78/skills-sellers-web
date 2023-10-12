<script setup>

import NotificationElement from "@/components/utilities/NotificationElement.vue";
import {onMounted, ref} from "vue";
import { useNotificationStore } from "@/stores";
import {storeToRefs} from "pinia";
const notifStore = useNotificationStore();
const { notifications } = storeToRefs(notifStore);
notifStore.getNotifications();

const deleteNotification = (id) => {
    notifStore.deleteNotification(id);
}

</script>

<template>
    <div v-if="notifications.loading">
        <p class="huge-text">Chargement des notifications...</p>
    </div>
    <div v-else class="Notifications bg-dark-blur">
        <div class="Notifications_header">
            <p class="DivTitle">Notifications</p>
        </div>
        <div class="Notifications_content">
            <NotificationElement v-for="notification in notifications"
                                 :key="notification.id"
                                 :id="notification.id"
                                 :title="notification.title"
                                 :content="notification.message"
                                 :date="notification.createdAt"
            @delete-notification="deleteNotification"/>
        </div>
    </div>
</template>

<style scoped>
.Notifications {
    display: grid;
    grid-template-rows: 15% 80% 5%;
    grid-template-areas: "title" "stats" "footer";
    padding: 1rem;
    margin: 3rem;
    border-radius: 1rem;
    box-shadow: 0 0 1rem 0.5rem rgba(0, 0, 0, 0.2);
    backdrop-filter: blur(5px);
}

.Notifications_header {
    grid-area: title;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.Notifications_content {
    grid-area: stats;
    background: rgba(0, 0, 0, 0.48);
    border-radius: 1rem;
    box-shadow: inset 0 0 1rem 0.5rem black;
    padding: 1rem;
    overflow-y: auto;
}

.Notifications_content NotificationElement {
    display: flex;
    justify-content: space-between;
    font-size: 1.2rem;
    color: #9d9d9d;  /* Nuance de gris foncé pour le texte */
    padding: 0.5rem 0.5rem;
    border-bottom: 1px solid rgba(199, 175, 175, 0.35);  /* Séparateur entre les éléments de la liste */
}

.Notifications_content NotificationElement:last-child {
    border-bottom: none;
}
</style>