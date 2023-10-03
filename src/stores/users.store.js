import { defineStore } from 'pinia';

import { fetchWrapper } from '@/helpers';

const baseUrl = `${import.meta.env.VITE_API_URL}/`;

export const useUsersStore = defineStore({
    id: 'users',
    state: () => ({
        users: {},
        stats: {},
        actualUser: {
            pseudo: '',
            nbCards: 0,
            creatium: 0,
            or: 0,
            nourriture: 0
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
                    console.log(error);
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
                    console.log(error);
                    return this.stats = {error};
                })
        },
        async getUser(id) {
            this.actualUser = { loading: true };
            let usedUrl = baseUrl + `Users/${id}`;
            fetchWrapper.get(usedUrl)
                .then(user => {
                    return this.actualUser = user;
                })
                .catch(error => {
                    console.log(error);
                    return this.actualUser = {error};
                })
        }
    }
});
