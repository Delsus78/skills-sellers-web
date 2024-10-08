import { defineStore } from 'pinia';

export const useSettingsStore = defineStore({
    id: 'settings',
    state: () => ({
        filters: JSON.parse(localStorage.getItem('filtersCards')),
        weaponsFilters: JSON.parse(localStorage.getItem('filtersWeapons')),
        isStarsActive: JSON.parse(localStorage.getItem('Settings_isStarsActive') ?? 'true'),
        isNotifSoundActive: JSON.parse(localStorage.getItem('Settings_isNotifSoundActive') ?? 'true'),
        isGlobalChatSoundActive: JSON.parse(localStorage.getItem('Settings_isGlobalChatSoundActive') ?? 'true'),
    }),
    actions: {
        setFilters(filters) {
            this.filters = filters;
            localStorage.setItem('filtersCards', JSON.stringify(filters));
        },
        setWeaponsFilters(filters) {
            this.weaponsFilters = filters;
            localStorage.setItem('filtersWeapons', JSON.stringify(filters));
        },
        switchBGStarActive() {
            this.isStarsActive = !this.isStarsActive;
            localStorage.setItem('Settings_isStarsActive', JSON.stringify(this.isStarsActive));
        },
        switchNotifSoundActive() {
            this.isNotifSoundActive = !this.isNotifSoundActive;
            localStorage.setItem('Settings_isNotifSoundActive', JSON.stringify(this.isNotifSoundActive));
        },
        switchGlobalChatSoundActive() {
            this.isGlobalChatSoundActive = !this.isGlobalChatSoundActive;
            localStorage.setItem('Settings_isGlobalChatSoundActive', JSON.stringify(this.isGlobalChatSoundActive));
        }
    }
});
