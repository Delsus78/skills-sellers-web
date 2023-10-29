import { toast } from "vue3-toastify";
import { defineStore } from 'pinia';
import * as signalR from '@microsoft/signalr';
import { useAuthStore, useCardsStore, useUsersStore } from '@/stores';
import {fetchWrapper} from "@/helpers";

const baseUrl = `${import.meta.env.VITE_API_URL}/`;

export const useNotificationStore = defineStore({
    id: 'notification',
    state: () => ({
        notifications: [],
        connection: null,
        isConnected: false,
        error: null
    }),
    actions: {
        // Initialiser la connexion SignalR
        initConnection() {
            if (this.connection) return;

            const { user } = useAuthStore();

            this.connection = new signalR.HubConnectionBuilder()
                .withUrl(baseUrl + "notificationHub", { accessTokenFactory: () => user.token })
                .withAutomaticReconnect({
                    nextRetryDelayInMilliseconds: retryContext => {
                        if (retryContext.elapsedMilliseconds < 60000) {
                            // If we've been reconnecting for less than 60 seconds so far,
                            // wait between 0 and 10 seconds before the next reconnect attempt.
                            return Math.random() * 10000;
                        } else {
                            // If we've been reconnecting for more than 60 seconds so far, stop reconnecting.
                            return null;
                        }
                    }
                })
                .build();

            // Gérer le message reçu
            this.connection.on("ReceiveNotification", async (notification) => {
                this.addNotification(notification);

                // vue toast
                toast.info(`<strong style="color: #d0de21;">${notification.title}</strong> : <br/> ${notification.message}`,
                    {
                        dangerouslyHTMLString: true,
                        icon: "🔔",
                        progressStyle: {
                            background: "#d0de21",
                        }
                    });

                // refresh data
                await useUsersStore().getUser(user.id);
                await useCardsStore().getAllCardsFromUser(user.id);
            });

            // Démarrer la connexion
            this.connection.start()
                .then(() => {
                    this.isConnected = true;

                    toast.info("Connexion au serveur de notification <strong>réussie</strong> !", {
                        dangerouslyHTMLString: true,
                        progressStyle: {
                            background: "#2189de",
                        }
                    });

                    console.log('Connection started');
                })
                .catch(err => {
                    toast.error("Connexion au serveur de notification <strong>échouée</strong> !", {
                        dangerouslyHTMLString: true,
                    });
                    console.error('Error while starting connection: ' + err);
                });
        },
        // Ajouter un message à la liste (et conserver uniquement les 50 derniers messages)
        addNotification(notification) {
            this.notifications.push(notification);
        },
        getNotifications() {
            const { user} = useAuthStore();
            this.notifications = { loading: true };
            let usedUrl = baseUrl + `Users/${user.id}/notifications`;
            fetchWrapper.get(usedUrl)
                .then(notifications => {
                    return this.notifications = notifications;
                })
                .catch(error => {
                    console.error(error);
                    return this.error = {error};
                })
        },
        async sendMessageToUser(id, message) {
            const { user} = useAuthStore();
            let usedUrl = baseUrl + `Users/${user.id}/notification/${id}`;
            await fetchWrapper.post(usedUrl, {title:'', message})
                .catch(error => {
                    console.error(error);
                    return error;
                });

            // refresh data
            await useUsersStore().getUser(user.id);
        },
        async deleteNotifications(ids) {
            const { user} = useAuthStore();
            let usedUrl = baseUrl + `Users/${user.id}/notifications`;
            this.notifications = this.notifications.filter(x => !ids.includes(x.id));
            fetchWrapper.delete(usedUrl, ids)
                .then(_ => {
                })
                .catch(error => {
                    console.error(error);
                    this.notifications = {error};
                })
        }
    }
});
