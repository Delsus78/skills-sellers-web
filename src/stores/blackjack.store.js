import { toast } from "vue3-toastify";
import { defineStore } from 'pinia';
import * as signalR from '@microsoft/signalr';
import {useAuthStore, useUsersStore} from '@/stores';
import {PlayAudio} from "@/helpers/AudioPlay";
import {fetchWrapper} from "@/helpers";

const baseUrl = `${import.meta.env.VITE_API_URL}/`;

export const useBlackJackStore = defineStore({
    id: 'blackjack',
    state: () => ({
        game: null,
        updatedTime: null
    }),
    actions: {
        // Initialiser la connexion SignalR
        initConnection() {
            if (this.connection) return;

            const { user } = useAuthStore();

            this.connection = new signalR.HubConnectionBuilder()
                .withUrl(baseUrl + "blackJackHub", { accessTokenFactory: () => user.token })
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
            this.connection.on("Game", async (game) => {

                // play sound
                await PlayAudio('oof');

                this.game = game;
                this.updatedTime = new Date();
            });

            // Player Added
            this.connection.on("PlayerAdded", async (game) => {
                // play sound
                await PlayAudio('oof');

                toast.info("Un joueur a rejoint la partie !", {
                    dangerouslyHTMLString: true,
                    progressStyle: {
                        background: "#2189de",
                    }
                });

                this.game = game;
                this.updatedTime = new Date();
            });

            // player lost
            this.connection.on("PlayerLost", async (game) => {
                // play sound
                await PlayAudio('oof');

                this.game = game;
                this.updatedTime = new Date();
            });

            // player stand
            this.connection.on("PlayerStand", async (game) => {
                // play sound
                await PlayAudio('oof');

                if (game.currentPlayerTurn === user.id)
                    toast.info("Vous avez terminé votre tour !", {
                        dangerouslyHTMLString: true,
                        progressStyle: {
                            background: "#2189de",
                        }
                    });

                this.game = game;
                this.updatedTime = new Date();
            });

            // player draw
            this.connection.on("PlayerDraw", async (game) => {
                // play sound
                await PlayAudio('oof');

                if (game.currentPlayerTurn === user.id)
                    toast.info("Vous piochez une carte !", {
                        dangerouslyHTMLString: true,
                        progressStyle: {
                            background: "#2189de",
                        }
                    });

                this.game = game;
                this.updatedTime = new Date();
            });

            // player black jack
            this.connection.on("PlayerBlackJack", async (game) => {
                // play sound
                await PlayAudio('oof');

                if (game.currentPlayerTurn === user.id)
                    toast.info("Black Jack !", {
                    dangerouslyHTMLString: true,
                    progressStyle: {
                        background: "#2189de",
                    }
                });

                this.game = game;
                this.updatedTime = new Date();
            });

            // player turn
            this.connection.on("PlayerTurn", async (game) => {
                // play sound
                await PlayAudio('oof');

                if (game.currentPlayerTurn === user.id)
                    toast.info("C'est à vous de jouer !", {
                        dangerouslyHTMLString: true,
                        progressStyle: {
                            background: "#2189de",
                        }
                    });

                this.game = game;
                this.updatedTime = new Date();
            });

            // bank turn
            this.connection.on("BankTurn", async (game) => {
                // play sound
                await PlayAudio('oof');
                console.log(game)
                console.log(this.game)

                this.game = game;
                this.updatedTime = new Date();
            });

            // winners
            this.connection.on("Winners", async (winnersId, game) => {
                // play sound
                await PlayAudio('oof');

                if (winnersId.includes(user.id))
                    toast.info("Vous avez gagné !", {
                        dangerouslyHTMLString: true,
                        progressStyle: {
                            background: "#2189de",
                        }
                    });
                else
                    toast.info("Vous avez perdu !", {
                        dangerouslyHTMLString: true,
                        progressStyle: {
                            background: "#2189de",
                        }
                    });

                this.game = game;
                this.game.WinnersId = winnersId;
                this.updatedTime = new Date();
            });

            // game ended
            this.connection.on("EndGame", async () => {
                // play sound
                await PlayAudio('oof');

                this.game = null;
                this.updatedTime = new Date();
            });

            // Démarrer la connexion
            this.connection.start()
                .then(() => {
                    this.isConnected = true;

                    toast.info("Connexion au serveur du Black Jack <strong>réussie</strong> !", {
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
        setGame(game) {
            this.initConnection();
            this.game = game;
        },
        async play(actionId) {
            const { user } = useAuthStore();
            let usedUrl = baseUrl + `games/${user.id}/blackjack?action=${actionId}`;
            let response = await fetchWrapper.post(usedUrl)
                .catch(error => {
                    console.error(error);
                });
        }
    }
});