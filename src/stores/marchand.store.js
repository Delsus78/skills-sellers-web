import { defineStore } from 'pinia';

import { fetchWrapper } from '@/helpers';
import {useAuthStore} from "@/stores/auth.store";
import {useUsersStore} from "@/stores/users.store";

const baseUrl = `${import.meta.env.VITE_API_URL}/Users/`;

export const useMarchandStore = defineStore({
    id: 'marchand',
    state: () => ({
        offer: {
            food: 0,
            price: 0,
            foodName: "",
        },
    }),
    actions: {
        async getMarchandOffer(){
            const { user } = useAuthStore();

            this.offer = { loading: true };
            let usedUrl = baseUrl + `${user.id}/Marchand/offer`;
            let response = await fetchWrapper.get(usedUrl)
                .catch(error => {
                    console.error(error);
                    return this.offer = {error};
                });

            console.log(response);
            this.offer = response;
        },
        async buyMarchandOffer(){
            const { user } = useAuthStore();

            let usedUrl = baseUrl + `${user.id}/Marchand/buy`;
            let response = await fetchWrapper.post(usedUrl)
                .catch(error => {
                    console.error(error);
                    return {error};
                });

            // refresh user ressources and batiments
            await useUsersStore().getUser(user.id);
            await useUsersStore().getBuildingsOfUser(user.id);

        }
    }
});
