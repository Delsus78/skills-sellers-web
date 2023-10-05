import {defineStore} from 'pinia';
import {useAuthStore} from '@/stores';

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

            return await fetchWrapper.post(usedUrl, {cardsIds, actionName, params});
        }
    }
});

// fake backend