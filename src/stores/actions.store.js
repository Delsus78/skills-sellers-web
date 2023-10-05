import {defineStore} from 'pinia';
import {useAuthStore} from '@/stores';

import {fetchWrapper} from '@/helpers';

const baseUrl = `${import.meta.env.VITE_API_URL}/Users/`;

export const useActionsStore = defineStore({
    id: 'actions',
    state: () => ({
        cardActions: {},
        estimatedAction: {}
    }),
    actions: {
        async postActionForCards(cardsIds, actionName, params) {
            const { user } = useAuthStore();
            let usedUrl = baseUrl + `${user.id}/actions`;

            await fetchWrapper.post(usedUrl, {cardsIds, actionName, params})
                .then(cardActions => {
                    this.cardActions = cardActions;
                })
                .catch(error => {
                    console.log(error);
                    this.cardActions = {error};
                });
        },
        async postEstimatedActionForCards(cardsIds, actionName, params) {
            const { user } = useAuthStore();
            let usedUrl = baseUrl + `${user.id}/estimate/actions`;

            await fetchWrapper.post(usedUrl, {cardsIds, actionName, params})
                .then(estimatedAction => {
                    console.log(estimatedAction);
                    this.estimatedAction = estimatedAction;
                })
                .catch(error => {
                    console.log(error);
                    this.estimatedAction = {error: error};
                });
        }
    }
});

// fake backend