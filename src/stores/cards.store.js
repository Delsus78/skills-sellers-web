import {defineStore} from 'pinia';

import {fetchWrapper, fetchWrapperJpeg} from '@/helpers';
import {useAuthStore} from "@/stores/auth.store";
import {useUsersStore} from "@/stores/users.store";

const baseUrl = `${import.meta.env.VITE_API_URL}/`;

export const useCardsStore = defineStore({
    id: 'cards',
    state: () => ({
        cards: {},
        card: {},
        imageCache: {}
    }),
    actions: {
        async getImage(cardId) {
            if (this.imageCache[cardId]) {
                return this.imageCache[cardId];  // Retourner l'image du cache si elle est présente
            }

            try {
                const response =
                    await fetchWrapperJpeg
                        .get(`${import.meta.env.VITE_API_URL}/Images/${cardId}`,
                            null,
                            'max-age=3600');

                const imageUrl = URL.createObjectURL(response);
                this.imageCache = { ...this.imageCache, [cardId]: imageUrl };  // Mettre en cache l'image
                return imageUrl;
            } catch (error) {
                console.error(error);
                return null;
            }
        },
        async getAllCardsFromUser(id) {
            this.cards = { loading: true };
            const usedUrl = baseUrl + `Users/${id}/Cards`;

            try {
                const cards = await fetchWrapper.get(usedUrl);
                const imagePromises = cards.map(async card => {
                    card.imageUrl = await this.getImage(card.id);
                    return card;
                });
                this.cards = await Promise.all(imagePromises);
            } catch (error) {
                console.error(error);
                this.cards = { error };
            }
        },
        async getCardById(id) {
            this.card = { loading: true };
            const usedUrl = baseUrl + `Cards/${id}`;

            try {
                const card = await fetchWrapper.get(usedUrl);
                card.imageUrl = await this.getImage(card.id);  // Utiliser la nouvelle méthode getImage
                this.card = card;
            } catch (error) {
                console.error(error);
                this.card = { error };
            }
        },
        async getUserCard(id, cardId) {
            let usedUrl = baseUrl + `Users/${id}/Cards/${cardId}`;
            return fetchWrapper.get(usedUrl)
                .then(async card => {
                    const response =
                        await fetchWrapperJpeg
                            .get(`${import.meta.env.VITE_API_URL}/Images/${card.id}`,
                                null,
                                'max-age=3600');

                    card.imageUrl = URL.createObjectURL(response);

                    // refresh the card in cards list
                    let index = this.cards.findIndex(cardInList => cardInList.id === cardId);
                    if (index !== -1) {
                        this.cards[index] = card;
                    }


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
