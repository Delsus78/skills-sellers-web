import { defineStore } from 'pinia';

import { fetchWrapper } from '@/helpers';

const baseUrl = `${import.meta.env.VITE_API_URL}/`;

export const useUsersStore = defineStore({
    id: 'users',
    state: () => ({
        users: {},
        stats: {
            "totalCards": 0,
            "totalCardsByRarity": {
                "legendaire": 0,
                "epic": 0,
                "commune": 0
            },
            "totalFailedCardsCauseOfCharisme": 0,
            "totalMessagesSent": 0,
            "totalResourcesMined": {
                "Creatium": 0,
                "Or": 0
            },
            "totalPlanetDiscovered": 0,
            "totalCardWithAStatMaxed": 0,
            "totalBuildingsUpgraded": 0,
            "totalRocketLaunched": 0,
            "totalMealCooked": 0
        },
        actualUser: {
            pseudo: '',
            nbCards: 0,
            creatium: 0,
            or: 0,
            nourriture: 0
        },
        buildings: {
            cuisineLevel: 1,
            nbCuisineUsedToday: 0,
            salleSportLevel: 1,
            laboLevel: 1,
            spatioPortLevel: 1
        }
    }),
    actions: {
        async getAllUsers() {
            this.users = { loading: true };
            let usedUrl = baseUrl + `Users`;
            fetchWrapper.get(usedUrl)
                .then(users => {
                    return this.users = users;
                })
                .catch(error => {
                    console.error(error);
                    return this.users = {error};
                })
        },
        async getStatsOfUser(id) {
            this.stats = { loading: true };
            let usedUrl = baseUrl + `Users/${id}/stats`;
            fetchWrapper.get(usedUrl)
                .then(stats => {
                    return this.stats = stats;
                })
                .catch(error => {
                    console.error(error);
                    return this.stats = {error};
                })
        },
        async getUser(id) {
            this.actualUser = { loading: true };
            let usedUrl = baseUrl + `Users/${id}`;
            return fetchWrapper.get(usedUrl)
                .then(user => {
                    return this.actualUser = user;
                })
                .catch(error => {
                    console.error(error);
                    return this.actualUser = {error};
                })
        },
        async getBuildingsOfUser(id) {
            this.buildings = { loading: true };
            let usedUrl = baseUrl + `Users/${id}/batiments`;
            fetchWrapper.get(usedUrl)
                .then(buildings => {
                    return this.buildings = buildings;
                })
                .catch(error => {
                    console.error(error);
                    return this.buildings = {error};
                })
        }
    }
});
