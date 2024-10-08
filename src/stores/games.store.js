import {defineStore} from 'pinia';

import {fetchWrapper} from '@/helpers';
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
            regles: "Règles du jeu : \n",
            isRepairing: false,
            orPrice: 0,
            creatiumPrice: 0
        },
        wordle: {
            id: 0,
            name: "WORDLE",
            description: "Jouez au wordle et gagnez des ressources !",
            regles: "Règles du jeu : \n",
            isRepairing: false
        },
        wordleResponse: {
            "name": "string",

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
            "error": "",
            "win": true
        },
        christmas: {
            "daysOpened": [
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0
            ]
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
            if (response.bossCard) response.bossCard.imageUrl = await useCardsStore().getImage(response.bossCard.id);
            this.game = response;
        },
        async postGameDay(gameName, bet, cardsIds, params){
            const { user } = useAuthStore();

            this.gameResponse = { loading: true };
            let usedUrl = baseUrl + `/${user.id}/gameOfTheDay/play`;
            let response = await fetchWrapper.post(usedUrl, {Name:gameName, bet, cardsIds, ...params})
                .catch(error => {
                    console.error(error);
                    return this.gameResponse = {error};
                });

            // refresh user ressources and cards
            if (!response.error) {
                await useUsersStore().getUser(user.id);
            }

            this.gameResponse = response;
        },
        async EstimateGameDay(gameName, bet, cardsIds){
            const { user } = useAuthStore();

            this.gameEstimation = { loading: true };
            let usedUrl = baseUrl + `/${user.id}/gameOfTheDay/estimate`;
            this.gameEstimation = await fetchWrapper.post(usedUrl, {Name: gameName, bet, cardsIds})
                .catch(error => {
                    console.error(error);
                    return this.gameEstimation = {error};
                });
        },
        async CancelGamePlay(gameName, cardsIds) {
            const { user } = useAuthStore();

            this.gameResponse = { loading: true };
            let usedUrl = baseUrl + `/${user.id}/gameOfTheDay/cancel`;
            let response = await fetchWrapper.post(usedUrl, {Name:gameName, CardsIds:cardsIds})
                .catch(error => {
                    console.error(error);
                    return this.gameResponse = {error};
                });

            // refresh user ressources and cards
            if (!response.error) {
                await useUsersStore().getUser(user.id);
                await useCardsStore().getAllCardsFromUser(user.id);
                await this.getGameDay();
            }

            this.gameResponse = response;
        },
        async validateWordForWordleGame(gameName, word){
            const { user } = useAuthStore();

            this.wordleResponse = { loading: true };
            let usedUrl = baseUrl + `/${user.id}/wordle`;
            let response = await fetchWrapper.post(usedUrl, {Name:gameName, Bet:0, CardsIds:[], Word:word})
                .catch(error => {
                    console.error(error);
                    return this.wordleResponse = {error};
                });

            // refresh user ressources and cards
            if (!response.error) {
                await useUsersStore().getUser(user.id);
                await useGamesStore().getWordle();
            }

            this.wordleResponse = response;
        },
        async getWordle(){
            const { user } = useAuthStore();

            this.wordleResponse = { loading: true };
            let usedUrl = baseUrl + `/${user.id}/wordle`;
            this.wordle = await fetchWrapper.get(usedUrl)
                .catch(error => {
                    console.error(error);
                    return this.wordle = {error};
                });
        },
        async getChristmasList(){
            const { user } = useAuthStore();

            this.christmas = { loading: true };
            let usedUrl = baseUrl + `/${user.id}/christmas`;
            this.christmas = await fetchWrapper.get(usedUrl)
                .catch(error => {
                    console.error(error);
                    return this.christmas = {error};
                });
        },
        async openChristmasGift() {
            const { user } = useAuthStore();

            this.christmas = { loading: true };
            let usedUrl = baseUrl + `/${user.id}/christmas`;
            let response = await fetchWrapper.post(usedUrl)
                .catch(error => {
                    console.error(error);
                    return this.christmas = {error};
                });

            // refresh user ressources and cards
            if (!response.error) {
                await useUsersStore().getUser(user.id);
                await useCardsStore().getAllCardsFromUser(user.id);
                await useGamesStore().getChristmasList();
            }

            this.christmas = response;
        }
    }
});
