import {defineStore} from 'pinia';
import {useAuthStore, useUsersStore, useCardsStore} from '@/stores';

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
            return await fetchWrapper.post(usedUrl, {
                cardsIds,
                actionName,
                batimentToUpgrade: params.batimentToUpgrade,
                weaponToUpgradeId: params.weaponToUpgradeId})
                .catch(error => {
                    console.error(error);
                    return {error};
                }).then(response => {
                    // refresh user ressources and cards
                    useUsersStore().getUser(user.id);
                    useCardsStore().getAllCardsFromUser(user.id);
                    return response;
                });
        },
        async postEstimatedActionForCards(cardsIds, actionName, params) {
            const { user } = useAuthStore();
            let usedUrl = baseUrl + `${user.id}/estimate/actions`;

            console.log('params', params);
            return await fetchWrapper.post(usedUrl, {
                cardsIds,
                actionName,
                batimentToUpgrade: params.batimentToUpgrade,
                weaponToUpgradeId: params.weaponToUpgradeId})
                .catch(error => {
                    console.error(error);
                    return {error: error};
                });
        },
        async deleteAction(actionId) {
            const { user } = useAuthStore();
            let usedUrl = baseUrl + `${user.id}/actions/${actionId}`;
            return await fetchWrapper.delete(usedUrl)
                .catch(error => {
                    console.error(error);
                    return {error};
                }).then(response => {
                    // refresh user ressources and cards
                    useUsersStore().getUser(user.id);
                    useCardsStore().getAllCardsFromUser(user.id);
                    return response;
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

                    // refresh user ressources and cards
                    await useUsersStore().getUser(user.id);

                    // if the response is null
                    if (response === '') {
                        return {doublon: true};
                    } else {
                        await useCardsStore().getAllCardsFromUser(user.id);
                        const imgRep = await fetchWrapperJpeg.get(`${import.meta.env.VITE_API_URL}/Images/${response.id}`);
                        response.imageUrl = URL.createObjectURL(imgRep);
                    }

                    return response;
                });
        },
        async postActionDecision(actionId, decision) {
            const { user } = useAuthStore();
            let usedUrl = baseUrl + `${user.id}/actions/decision`;
            return await fetchWrapper.post(usedUrl, {actionId, decision})
                .catch(error => {
                    console.error(error);
                    return {error};
                });
        },
        async postOpenWeapon() {
            const { user } = useAuthStore();

            let usedUrl = baseUrl + `${user.id}/actions/openweapon`;
            return await fetchWrapper.post(usedUrl)
                .catch(error => {
                    console.error(error);
                    return {error};
                }).then(async response => {
                    if (response.error) return response;

                    // refresh user ressources and cards
                    await useUsersStore().getUser(user.id);

                    // get image
                    response.imageUrl = await useCardsStore().getWeaponImage(response.weaponId);

                    return response;
                });
        },
    }
});

// fake backend