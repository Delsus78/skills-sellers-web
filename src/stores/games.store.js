import { defineStore } from 'pinia';

import { fetchWrapper } from '@/helpers';
import {useAuthStore} from "@/stores/auth.store";
import {useUsersStore} from "@/stores/users.store";
import {useCardsStore} from "@/stores/cards.store";

const baseUrl = `${import.meta.env.VITE_API_URL}/Games`;

export const useGamesStore = defineStore({
    id: 'games',
    state: () => ({
        game: {
            id: 0,
            name: "CASINO",
            description: "Jouez à la roulette et gagnez des ressources !",
            Regles: "Règles du jeu : \n",
            isRepairing: false,
            nbLetters: 0
        },
        gameResponse: {
            "name": "string",
            "chances": 0,
            "results": 0,
            "win": true
        },
        gameEstimation: {
            "name": "string",
            "chances": 0,
            "results": 0,
            "win": true
        }
    }),
    actions: {
        async getGameDay(){
            const { user } = useAuthStore();

            this.game = { loading: true };
            let usedUrl = baseUrl + `/${user.id}/gameOfTheDay`;
            let response = await fetchWrapper.get(usedUrl)
                .catch(error => {
                    console.error(error);
                    return this.game = {error};
                });

            console.log(response)
            this.game = response;
        },
        async postGameDay(gameName, bet, cardsIds){
            const { user } = useAuthStore();

            this.gameResponse = { loading: true };
            let usedUrl = baseUrl + `/${user.id}/gameOfTheDay/play`;
            let response = await fetchWrapper.post(usedUrl, {Name:gameName, bet, cardsIds})
                .catch(error => {
                    console.error(error);
                    return this.gameResponse = {error};
                });

            // refresh user ressources and cards
            if (!response.error) {
                await useUsersStore().getUser(user.id);
                await useCardsStore().getAllCardsFromUser(user.id);
            }

            this.gameResponse = response;
        },
        async EstimateGameDay(gameName, bet, cardsIds){
            const { user } = useAuthStore();

            this.gameEstimation = { loading: true };
            let usedUrl = baseUrl + `/${user.id}/gameOfTheDay/estimate`;
            let response = await fetchWrapper.post(usedUrl, {Name:gameName, bet, cardsIds})
                .catch(error => {
                    console.error(error);
                    return this.gameEstimation = {error};
                });

            this.gameEstimation = response;
        },
        async validateWordForWordleGame(gameName, word){
            const { user } = useAuthStore();

            this.gameResponse = { loading: true };
            let usedUrl = baseUrl + `/${user.id}/gameOfTheDay/play`;
            let response = await fetchWrapper.post(usedUrl, {Name:gameName, Bet:0, CardsIds:[], Word:word})
                .catch(error => {
                    console.error(error);
                    return this.gameResponse = {error};
                });

            // refresh user ressources and cards
            if (!response.error) {
                await useUsersStore().getUser(user.id);
                await useCardsStore().getAllCardsFromUser(user.id);
                await useGamesStore().getGameDay();
            }

            this.gameResponse = response;
        }
    }
});
