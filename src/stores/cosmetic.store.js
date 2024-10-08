import { defineStore } from 'pinia';

import {useAuthStore} from "@/stores/auth.store";
import {fetchWrapper} from "@/helpers";
import {useUsersStore} from "@/stores/users.store";

const baseUrl = `${import.meta.env.VITE_API_URL}/Cosmetic/`;

export const useCosmeticStore = defineStore({
    id: 'cosmetic',
    state: () => ({
        shop: [],
        cosmeticsDisplayed: []
    }),
    actions: {
        async getComseticsOfUser(id) {
            let usedUrl = baseUrl + `user/${id}`;
            await fetchWrapper.get(usedUrl)
                .then(cosmetics => {
                    this.cosmeticsDisplayed = cosmetics;
                    return this.cosmeticsDisplayed;
                })
                .catch(error => {
                    console.error(error);
                    return this.cosmeticsDisplayed = {error};
                });
        },
        async getShopCosmetics() {
            this.shop = { loading: true };
            const { user } = useAuthStore();

            let usedUrl = baseUrl + `shop/${user.id}`;
            fetchWrapper.get(usedUrl)
                .then(cosmetics => {
                    return this.shop = cosmetics;
                })
                .catch(error => {
                    console.error(error);
                    return this.shop = {error};
                });
        },
        async buyCosmetic(cosmeticId, cosmeticData) {
            const { user } = useAuthStore();

            let usedUrl = baseUrl + `buy/${user.id}/${cosmeticId}`;

            await fetchWrapper.post(usedUrl, {
                coordinateX: Math.round(cosmeticData.coordinateX),
                coordinateY: Math.round(cosmeticData.coordinateY),
                size: cosmeticData.size,
                rotation: cosmeticData.rotation,
                zIndex: cosmeticData.zIndex})
                .catch(error => {
                    console.error(error);
                    return {error};
                });

            // refresh user ressources and cosmetics
            await useUsersStore().getUser(user.id);
            await this.getComseticsOfUser(user.id);
        },
        async placeCosmetic(entityId, cosmeticData) {
            const { user } = useAuthStore();

            let usedUrl = baseUrl + `place/${user.id}/${entityId}`;
            console.log(cosmeticData);
            await fetchWrapper.post(usedUrl, {
                coordinateX: Math.round(cosmeticData.coordinateX),
                coordinateY: Math.round(cosmeticData.coordinateY),
                size: cosmeticData.size,
                rotation: cosmeticData.rotation,
                zIndex: cosmeticData.zIndex})
                .catch(error => {
                    console.error(error);
                    return {error};
                });

            // refresh user ressources and cosmetics
            await useUsersStore().getUser(user.id);
            await this.getComseticsOfUser(user.id);
        }
    }
});
