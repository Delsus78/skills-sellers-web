import { defineStore } from 'pinia';

import { fetchWrapper } from '@/helpers';
import {useAuthStore} from "@/stores/auth.store";
import {useUsersStore} from "@/stores/users.store";
import {toast} from "vue3-toastify";

const baseUrl = `${import.meta.env.VITE_API_URL}/Users/`;

export const useGiftStore = defineStore({
    id: 'gift',
    state: () => ({}),
    actions: {
        async enterGiftCode(giftCode){
            const { user } = useAuthStore();

            let usedUrl = baseUrl + `${user.id}/gift`;
            await fetchWrapper.post(usedUrl, {code: giftCode})
                .catch(error => {
                    console.error(error);
                    toast.error(error);
                    return {error};
                });

            // refresh user ressources
            await useUsersStore().getUser(user.id);
        }
    }
});
