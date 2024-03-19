import {defineStore} from 'pinia';
import {useAuthStore, useUsersStore} from '@/stores';

import {fetchWrapper} from '@/helpers';

const baseUrl = `${import.meta.env.VITE_API_URL}/war/`;

export const useBattleStore = defineStore({
    id: 'battle',
    state: () => ({
        invitedWar: null
    }),
    actions: {
        async startBattle(registreCibleId, cardsIds, registreAlliesIds) {
            let usedUrl = baseUrl + `start`;
            return await fetchWrapper.post(usedUrl, {
                registreTargetId:registreCibleId,
                userCardsIds:cardsIds,
                registreAllysId:registreAlliesIds
            })
                .catch(error => {
                    console.error(error);
                    return {error: error};
                });
        },
        async GetInvitedInAWar() {
            const { user } = useAuthStore();
            let usedUrl = baseUrl + `invitedWar`;

            this.invitedWar = await fetchWrapper.get(usedUrl)
                .catch(error => {
                    return {error: error};
                });
        },
        async acceptBattle(cardsIds, warId) {
            let usedUrl = baseUrl + `accept/${warId}`;
            await fetchWrapper.post(usedUrl, {
                userCardIds : cardsIds
            })
                .catch(error => {
                    console.error(error);
                    return {error: error};
                });

            return await this.GetInvitedInAWar();
        },
        async cancelBattle(warId) {
            let usedUrl = baseUrl + `cancel/${warId}`;
            return await fetchWrapper.post(usedUrl)
                .catch(error => {
                    console.error(error);
                    return {error: error};
                });
        },
        async declineBattle(warId) {
            let usedUrl = baseUrl + `decline/${warId}`;
            return await fetchWrapper.post(usedUrl)
                .catch(error => {
                    console.error(error);
                    return {error: error};
                });
        },
        async postEstimateBattle(registreCibleId, cardsIds, registreAlliesIds, isInvited, invitedWarId = null) {
            let usedUrl = baseUrl + `estimate`;
            return await fetchWrapper.post(usedUrl, {
                registreTargetId: registreCibleId,
                userCardsIds: cardsIds,
                registreAllysId: registreAlliesIds,
                isInvited: isInvited,
                InvitedWarId: invitedWarId
            })
            .catch(error => {
                console.error(error);
                return {error: error};
            });
        }
    }
});