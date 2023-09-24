import { defineStore } from 'pinia';

import { fetchWrapper } from '@/helpers';

const baseUrl = `${import.meta.env.VITE_API_URL}/`;

export const useCardsStore = defineStore({
    id: 'cards',
    state: () => ({
        cards: {}
    }),
    actions: {
        async getAllCardsFromUser(id) {
            this.cards = { loading: true };
            let usedUrl = baseUrl + `Users/${id}/Cards`;
            fetchWrapper.get(usedUrl)
                .then(cards => {
                    console.log(cards);
                    return this.cards = cards;
                })
                .catch(error => {
                    console.log(error);
                    return this.cards = {error};
                })

        }
    }
});
