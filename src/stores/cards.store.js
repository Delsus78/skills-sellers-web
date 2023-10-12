import {defineStore} from 'pinia';

import {fetchWrapper, fetchWrapperJpeg} from '@/helpers';
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
            const usedUrl = baseUrl + `Users/${id}/Cards`;

            try {
                const cards = await fetchWrapper.get(usedUrl);
                const imagePromises = cards.map(async card => {
                    try {
                        const response = await fetchWrapperJpeg.get(`${import.meta.env.VITE_API_URL}/Images/${card.id}`);
                        card.imageUrl = URL.createObjectURL(response);
                    } catch (error) {
                        console.error(error);
                    }
                    return card;
                });
                this.cards = await Promise.all(imagePromises);
            } catch (error) {
                console.error(error);
                this.cards = { error };
            }
        },
        getCardById: async function (id) {
            this.card = {loading: true};
            let usedUrl = baseUrl + `Cards/${id}`;
            fetchWrapper.get(usedUrl)
                .then(async card => {
                    const response = await fetchWrapperJpeg.get(`${import.meta.env.VITE_API_URL}/Images/${card.id}`);
                    card.imageUrl = URL.createObjectURL(response);
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
                .then(async card => {
                    const response = await fetchWrapperJpeg.get(`${import.meta.env.VITE_API_URL}/Images/${card.id}`);
                    card.imageUrl = URL.createObjectURL(response);
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
                    // refresh user ressources and cards
                    useUsersStore().getUser(user.id);
                    useCardsStore().getAllCardsFromUser(user.id);

                    return this.card = card;
                })
                .catch(error => {
                    console.error(error);
                    return this.card = {error};
                })
        }
    }
});
