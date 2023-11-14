import { defineStore } from 'pinia';
export const useMainStore = defineStore({
    id: 'main',
    state: () => ({
        backgroundColor: '#9f9f9f',
        isMobileSize: false,
        favoritesIds: JSON.parse(localStorage.getItem('favoritesIds') ?? '[]'),
    }),
    actions: {
        changeBackgroundColor(color) {
            this.backgroundColor = color;
        },
        resetBackgroundColor() {
            this.backgroundColor = '#9f9f9f';
        },
        setIsMobileSize(isMobileSize) {
            this.isMobileSize = isMobileSize;
        },
        addFavoriteId(id) {
            this.favoritesIds.push(id);
            localStorage.setItem('favoritesIds', JSON.stringify(this.favoritesIds));
        },
        removeFavoriteId(id) {
            this.favoritesIds = this.favoritesIds.filter(x => x !== id);
            localStorage.setItem('favoritesIds', JSON.stringify(this.favoritesIds));
        }
    }
});
