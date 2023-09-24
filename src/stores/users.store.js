import { defineStore } from 'pinia';

import { fetchWrapper } from '@/helpers';

const baseUrl = `${import.meta.env.VITE_API_URL}/`;

export const useUsersStore = defineStore({
    id: 'users',
    state: () => ({
        users: {}
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

        }
    }
});
