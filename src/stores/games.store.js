import { defineStore } from 'pinia';

import { fetchWrapper } from '@/helpers';
import {useAuthStore} from "@/stores/auth.store";
import {useUsersStore} from "@/stores/users.store";

const baseUrl = `${import.meta.env.VITE_API_URL}/Games`;

export const useGamesStore = defineStore({
    id: 'games',
    state: () => ({
        game: {
            id: 0,
            name: "CASINO"
        },
    }),
    actions: {
        async getGameDay(){
            const { user } = useAuthStore();

            this.game = { loading: true };
            let usedUrl = baseUrl + `/Day`;
            let response = await fetchWrapper.get(usedUrl)
                .catch(error => {
                    console.error(error);
                    return this.game = {error};
                });

            this.game = response;
        }
    }
});
