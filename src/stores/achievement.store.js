import { defineStore } from 'pinia';

import { fetchWrapper } from '@/helpers';
import {useAuthStore} from "@/stores/auth.store";
import {useUsersStore} from "@/stores/users.store";
import {toast} from "vue3-toastify";

const baseUrl = `${import.meta.env.VITE_API_URL}/Users/`;

export const useAchievementsStore = defineStore({
    id: 'achievements',
    state: () => ({
        achievements: {
            "cardAtStat10": {
                "value": 0,
                "isClaimable": true
            },
            "doublon": {
                "value": 0,
                "isClaimable": true
            },
            "each5Cuisine": {
                "value": 0,
                "isClaimable": true
            },
            "each5SalleDeSport": {
                "value": 0,
                "isClaimable": true
            },
            "each5Spatioport": {
                "value": 0,
                "isClaimable": true
            },
            "cardAtFull10": {
                "value": 0,
                "isClaimable": true
            },
            "charismCasinoWin": {
                "value": 0,
                "isClaimable": true
            },
            "got100RocketLaunched": {
                "value": 0,
                "isClaimable": true
            }
        },
    }),
    actions: {
        async getAchievementsOfUser(id) {
            this.achievements = { loading: true };
            let usedUrl = baseUrl + `${id}/achievements`;
            fetchWrapper.get(usedUrl)
                .then(achievements => {
                    return this.achievements = achievements;
                })
                .catch(error => {
                    console.error(error);
                    return this.achievements = {error};
                })
        },
        async claimAchievement(achievementName) {
            const { user } = useAuthStore();

            let usedUrl = baseUrl + `${user.id}/achievements`;
            await fetchWrapper.post(usedUrl, {achievementName: achievementName})
                .catch(error => {
                    console.error(error);
                    toast.error(error);
                    return {error};
                });

            // refresh user ressources and achievements
            await useUsersStore().getUser(user.id);
            await this.getAchievementsOfUser(user.id);
        }
    }
});
