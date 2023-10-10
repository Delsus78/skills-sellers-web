import { defineStore } from 'pinia';

import { fetchWrapper } from '@/helpers';
import {useAuthStore} from "@/stores/auth.store";
import {useUsersStore} from "@/stores/users.store";

const baseUrl = `${import.meta.env.VITE_API_URL}/`;

export const useCardsStore = defineStore({
    id: 'cards',
    state: () => ({
        cards: {},
        card: {}
    }),
    actions: {
        async getAllCardsFromUser(id) {
            this.cards = { loading: true };
            let usedUrl = baseUrl + `Users/${id}/Cards`;
            fetchWrapper.get(usedUrl)
                .then(cards => {
                    return this.cards = cards;
                })
                .catch(error => {
                    console.error(error);
                    return this.cards = {error};
                })
        },
        async getCardById(id) {
            this.card = { loading: true };
            let usedUrl = baseUrl + `Cards/${id}`;
            fetchWrapper.get(usedUrl)
                .then(card => {
                    return this.card = card;
                })
                .catch(error => {
                    console.error(error);
                    return this.card = {error};
                })
        },
        async getUserCard(id, cardId) {
            let usedUrl = baseUrl + `Users/${id}/Cards/${cardId}`;
            return fetchWrapper.get(usedUrl)
                .then(card => {
                    return card;
                })
                .catch(error => {
                    console.error(error);
                    return {error};
                })
        },
        async postUpgradeCard(competences, cardId) {
            const { user } = useAuthStore();

            let usedUrl = baseUrl + `Users/${user.id}/cards/${cardId}/ameliorer`;

            return await fetchWrapper.post(usedUrl, competences)
                .then(card => {
                    // refresh user ressources
                    useUsersStore().getUser(user.id);

                    return this.card = card;
                })
                .catch(error => {
                    console.error(error);
                    return this.card = {error};
                })
        }
    }
});
