import { defineStore } from 'pinia';

import { fetchWrapper } from '@/helpers';

const baseUrl = `${import.meta.env.VITE_API_URL}/`;

export const useUsersStore = defineStore({
    id: 'users',
    state: () => ({
        users: {},
        stats: {
            "totalCards": {
                "stat": 39,
                "rank": 2
            },
            "totalCardsByRarity": {
                "commune": {
                    "stat": 24,
                    "rank": 2
                },
                "epic": {
                    "stat": 10,
                    "rank": 2
                },
                "legendaire": {
                    "stat": 5,
                    "rank": 2
                }
            },
            "totalFailedCardsCauseOfCharisme": {
                "stat": 20,
                "rank": 3
            },
            "totalMessagesSent": {
                "stat": 28,
                "rank": 3
            },
            "totalResourcesMined": {
                "Creatium": {
                    "stat": 2511,
                    "rank": 5
                },
                "Or": {
                    "stat": 1287,
                    "rank": 4
                }
            },
            "totalMachineUsed": {
                "Creatium": {
                    "stat": 2511,
                    "rank": 5
                },
                "Or": {
                    "stat": 1287,
                    "rank": 4
                }
            },
            "totalCardWithAStatMaxed": {
                "stat": 2,
                "rank": 2
            },
            "totalBuildingsUpgraded": {
                "stat": 4,
                "rank": 4
            },
            "totalRocketLaunched": {
                "stat": 23,
                "rank": 4
            },
            "totalMealCooked": {
                "stat": 10,
                "rank": 5
            },
            "totalDoublonsEarned": {
                "stat": 624,
                "rank": 1
            },
            "totalCardsInBDD": 39
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
            spatioPortLevel: 1,
            nbBuyMarchandToday: 0,
            nbBuyMarchandMaxPerDay: 1
        },
    }),
    actions: {
        async getAllUsers() {
            this.users = { loading: true };
            let usedUrl = baseUrl + `Users`;
            await fetchWrapper.get(usedUrl)
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
            this.buildings = {loading: true};
            let usedUrl = baseUrl + `Users/${id}/batiments`;
            fetchWrapper.get(usedUrl)
                .then(buildings => {
                    return this.buildings = buildings;
                })
                .catch(error => {
                    console.error(error);
                    return this.buildings = {error};
                })
        },
    }
});
