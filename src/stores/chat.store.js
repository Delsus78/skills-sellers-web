import { defineStore } from 'pinia';
import * as signalR from '@microsoft/signalr';
import { useAuthStore } from '@/stores';
import {PlayAudio} from "@/helpers/AudioPlay";

const chatHubUrl = `${import.meta.env.VITE_API_URL}/globalChatHub`;

export const useChatStore = defineStore({
    id: 'chat',
    state: () => ({
        messages: [],
        connection: null,
        connectedUsers: 0,
        isConnected: false,
        error: null
    }),
    actions: {
        // Initialiser la connexion SignalR
        initConnection() {
            if (this.connection) return;

            const { user } = useAuthStore();

            this.connection = new signalR.HubConnectionBuilder()
                .withUrl(chatHubUrl, { accessTokenFactory: () => user.token })
                .build();

            // Gérer le message reçu
            this.connection.on("ReceiveMessage", async (user, message) => {
                this.addMessage({user, message});

                // play sound
                await PlayAudio('msg');
            });

            // Gérer le nombre de connectés
            this.connection.on("UserConnected", async (connectedUsers) => {
                this.connectedUsers = connectedUsers;

                // play sound
                await PlayAudio('connect');
            });

            // Démarrer la connexion
            this.connection.start()
                .then(() => {
                    this.isConnected = true;
                    console.log('Connection started');
                })
                .catch(err => {
                    this.error = "Impossible de se connecter au chat";
                    console.error('Error while starting connection: ' + err);
                });
        },

        // Envoyer un message
        sendMessage(message) {
            if (!this.connection) return;
            const { user } = useAuthStore();
            this.connection.invoke("SendMessage", user.pseudo, message)
                .catch(err => console.error(err));
        },

        // Ajouter un message à la liste (et conserver uniquement les 50 derniers messages)
        addMessage(message) {
            this.messages.push(message);
            if (this.messages.length > 50) {
                this.messages.shift();
            }
        }
    }
});
