import {defineStore} from 'pinia';
import {useAuthStore, useUsersStore} from '@/stores';

import {fetchWrapper, fetchWrapperJpeg} from '@/helpers';

const baseUrl = `${import.meta.env.VITE_API_URL}/Users/`;

export const useActionsStore = defineStore({
    id: 'actions',
    state: () => ({
    }),
    actions: {
        async postActionForCards(cardsIds, actionName, params) {
            const { user } = useAuthStore();
            let usedUrl = baseUrl + `${user.id}/actions`;
            return await fetchWrapper.post(usedUrl, {cardsIds, actionName, batimentToUpgrade: params.batimentToUpgrade})
                .catch(error => {
                    console.error(error);
                    return {error};
                }).then(response => {
                    // refresh user ressources
                    useUsersStore().getUser(user.id);
                    return response;
                });
        },
        async postEstimatedActionForCards(cardsIds, actionName, params) {
            const { user } = useAuthStore();
            let usedUrl = baseUrl + `${user.id}/estimate/actions`;

            return await fetchWrapper.post(usedUrl, {cardsIds, actionName, batimentToUpgrade: params.batimentToUpgrade})
                .catch(error => {
                    console.error(error);
                    return {error: error};
                });
        },
        async postOpenCard() {
            const { user } = useAuthStore();
            let usedUrl = baseUrl + `${user.id}/actions/opencard`;
            return await fetchWrapper.post(usedUrl)
                .catch(error => {
                    console.error(error);
                    return {error};
                }).then(async response => {
                    // refresh user ressources
                    await useUsersStore().getUser(user.id);

                    // if the response is null
                    if (response === '') {
                        return {doublon: true};
                    } else {
                        const imgRep = await fetchWrapperJpeg.get(`${import.meta.env.VITE_API_URL}/Images/${response.id}`);
                        response.imageUrl = URL.createObjectURL(imgRep);
                    }

                    return response;
                });
        }
    }
});

// fake backend