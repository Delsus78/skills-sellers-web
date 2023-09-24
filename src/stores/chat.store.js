import { defineStore } from 'pinia';
import * as signalR from '@microsoft/signalr';
import { useAuthStore } from '@/stores';

const chatHubUrl = `${import.meta.env.VITE_API_URL}/globalChatHub`;

export const useChatStore = defineStore({
    id: 'chat',
    state: () => ({
        messages: [],
        connection: null,
        isConnected: false,
        error: null
    }),
    actions: {
        // Initialiser la connexion SignalR
        initConnection() {
            if (this.connection) return;

            const { user, logout } = useAuthStore();
            if (!user?.token)
            {
                logout();
                return;
            }

            this.connection = new signalR.HubConnectionBuilder()
                .withUrl(chatHubUrl, { accessTokenFactory: () => user.token })
                .build();

            // Gérer le message reçu
            this.connection.on("ReceiveMessage", (user, message) => {
                this.addMessage({ user, message });
            });

            // Démarrer la connexion
            this.connection.start()
                .then(() => {
                    this.isConnected = true;
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
