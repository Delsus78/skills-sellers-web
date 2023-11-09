<script setup>

import NotificationElement from "@/components/utilities/NotificationElement.vue";
import {computed} from "vue";
import { useNotificationStore } from "@/stores";
import {storeToRefs} from "pinia";
import {faTrashCan as deleteIcon} from "@fortawesome/free-solid-svg-icons";
const notifStore = useNotificationStore();
const { notifications } = storeToRefs(notifStore);
notifStore.getNotifications();

const notificationsSorted = computed(() => {
    if (notifications.value.loading || notifications.value.error) return [];
    return notifications.value.sort((a, b) => {
        // sort by date (newest first)
        return new Date(b.createdAt) - new Date(a.createdAt);
    });
});

const deleteNotification = (id) => {
    if (id === 'all') return notifStore.deleteNotifications(notifications.value.map(n => n.id));
    notifStore.deleteNotifications([id]);
}

</script>

<template>
    <div v-if="notifications.loading">
        <p class="shadow-white">Chargement des notifications...</p>
    </div>
    <div v-else class="Notifications bg-dark-blur">
        <div class="Notifications_header">
            <p class="DivTitle">Notifications</p>
            <a @click="deleteNotification('all')">
                <svg-icon class="delete shadow-white" :fa-icon="deleteIcon" :size="24"/>
            </a>
        </div>
        <div class="Notifications_content">
            <NotificationElement v-for="notification in notificationsSorted"
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

.Notifications_header .delete {
    position: absolute;
    right: 2rem;
    top: 2.8rem;
    transition: 0.2s ease-in-out;
}

.Notifications_header .delete:hover {
    cursor: pointer;
    transform: scale(1.3);
    color: #ff0000;
    filter: drop-shadow(0 0 4px var(--vt-c-black));
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