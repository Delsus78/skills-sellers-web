import { defineStore } from 'pinia';

export const useFiltersStore = defineStore({
    id: 'filters',
    state: () => ({
        filters: JSON.parse(localStorage.getItem('filtersCards'))
    }),
    actions: {
        setFilters(filters) {
            this.filters = filters;
            localStorage.setItem('filtersCards', JSON.stringify(filters));
        }
    }
});
