import { defineStore } from 'pinia';

import { fetchWrapper, router } from '@/helpers';
import { useNotificationStore, useCardsStore } from '@/stores';
import {toast} from "vue3-toastify";

const baseUrl = `${import.meta.env.VITE_API_URL}/users`;

export const useAuthStore = defineStore({
    id: 'auth',
    state: () => ({
        // initialize state from local storage to enable user to stay logged in
        user: JSON.parse(localStorage.getItem('user')),
        returnUrl: null
    }),
    actions: {
        async login(pseudo, password) {
            const user = await fetchWrapper.post(`${baseUrl}/authenticate`, { pseudo, password });
            const notifStore = useNotificationStore();

            // update pinia state
            this.user = user;

            // store user details and jwt in local storage to keep user logged in between page refreshes
            localStorage.setItem('user', JSON.stringify(user));

            // reload cards
            await useCardsStore().getAllCardsFromUser(user.id);

            notifStore.initConnection();

            // redirect to previous url or default to home page
            await router.push(this.returnUrl || '/');
        },
        async register(pseudo, password, confirmPassword, link) {
            await fetchWrapper.post(`${baseUrl}/register`, { pseudo, password, confirmPassword, link })
                .then(async response => {
                    console.log(response)

                    // update pinia state
                    await this.login(pseudo, password);

                    // redirect to previous url or default to home page
                    router.push('/');
                })
                .catch(error => {
                    console.log(error);
                    // pars regex error.errors.ConfirmPassword[0]
                    const regex = /"ConfirmPassword":\["(.*?)"/;
                    const match = error.match(regex);

                    if (!match)
                        toast.error(error);
                    else
                        toast.error(match[1]);

                    return { error };
                });
        },
        logout() {
            this.user = null;
            localStorage.removeItem('user');
            router.push('/login');
        }
    }
});
