import { defineStore } from 'pinia';
export const useMainStore = defineStore({
    id: 'main',
    state: () => ({
        backgroundColor: '#9f9f9f'
    }),
    actions: {
        changeBackgroundColor(color) {
            this.backgroundColor = color;
        },
        resetBackgroundColor() {
            this.backgroundColor = '#9f9f9f';
        }
    }
});
