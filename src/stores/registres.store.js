import {defineStore} from 'pinia';
import {useAuthStore, useUsersStore} from '@/stores';

import {fetchWrapper} from '@/helpers';

const baseUrl = `${import.meta.env.VITE_API_URL}/Registre/`;

export const useRegistreStore = defineStore({
    id: 'registres',
    state: () => ({
        registreInfo: {
            loading: true,
            registres: []
        },
        fightReports: {
            loading: true
        }
    }),
    actions: {
        async getRegistreInfo(playerId) {
            let usedUrl = baseUrl + `${playerId}/registreInfo`;

            let response = await fetchWrapper.get(usedUrl)
                .catch(error => {
                    console.error(error);
                    return this.registreInfo = {error};
                })

            return this.registreInfo = response;
        },
        async deleteFriendlyRegistre(registreId) {
            const { user } = useAuthStore();
            let usedUrl = baseUrl + `${user.id}/friendly/${registreId}`;
            return await fetchWrapper.delete(usedUrl)
                .catch(error => {
                    console.error(error);
                    return {error};
                }).then(response => {
                    // refresh user ressources and cards
                    this.getRegistreInfo(user.id);
                    return response;
                });
        },
        async getFightReports() {
            const { user } = useAuthStore();
            let usedUrl = baseUrl + `${user.id}/fightReports?limit=20`;

            let response = await fetchWrapper.get(usedUrl)
                .catch(error => {
                    console.error(error);
                    return this.fightReports = {error};
                })

            // sort by id
            response.sort((a, b) => (a.id > b.id) ? -1 : 1);

            return this.fightReports = response;
        }
    }
});