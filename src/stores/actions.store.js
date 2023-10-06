import {defineStore} from 'pinia';
import {useAuthStore, useUsersStore} from '@/stores';

import {fetchWrapper} from '@/helpers';

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
                    console.log(error);
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

            console.log(params);
            return await fetchWrapper.post(usedUrl, {cardsIds, actionName, batimentToUpgrade: params.batimentToUpgrade})
                .catch(error => {
                    console.log(error);
                    return {error: error};
                });
        }
    }
});

// fake backend