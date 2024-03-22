import { toast } from "vue3-toastify";
import { defineStore } from 'pinia';
import * as signalR from '@microsoft/signalr';
import {useAuthStore, useBattleStore, useCardsStore, useUsersStore} from '@/stores';
import {fetchWrapper} from "@/helpers";
import {PlayAudio} from "@/helpers/AudioPlay";

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
                            return Math.random() * 10000;
                        } else {
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

                // play sound
                await PlayAudio('oof');

                // refresh data
                await useUsersStore().getUser(user.id);

                console.log(notification);
                if (notification.type.includes("cards"))
                    await useCardsStore().getAllCardsFromUser(user.id);
                if (notification.type.includes("onecard"))
                    await useCardsStore().getUserCard(user.id, notification.relatedId);
                if (notification.type.includes("buildings"))
                    await useUsersStore().getBuildingsOfUser(user.id);
                if (notification.type.includes("weapons"))
                    await useCardsStore().getWeapons();
                if (notification.type.includes("oneweapon"))
                    await useCardsStore().getWeaponById(notification.relatedId);
            });

            this.connection.on("WarNotification", async (notification) => {
                this.addNotification(notification);

                // vue toast
                toast.info(`<strong style="color: #d0de21;">${notification.title}</strong> : <br/> ${notification.message}`,
                    {
                        dangerouslyHTMLString: true,
                        icon: "⚔",
                        progressStyle: {
                            background: "#FF0000FF",
                        }
                    });

                // play sound
                await PlayAudio('oof');

                // refresh data
                await useUsersStore().getUser(user.id);
                await useBattleStore().GetInvitedInAWar();

                if (notification.type.includes("cards"))
                    await useCardsStore().getAllCardsFromUser(user.id);
                if (notification.type.includes("onecard"))
                    await useCardsStore().getUserCard(user.id, notification.relatedId);
                if (notification.type.includes("buildings"))
                    await useUsersStore().getBuildingsOfUser(user.id);
                if (notification.type.includes("weapons"))
                    await useCardsStore().getWeapons();
                if (notification.type.includes("oneweapon"))
                    await useCardsStore().getWeaponById(notification.relatedId);
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
            await fetchWrapper.post(usedUrl, {title:'', message, type:""})
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
