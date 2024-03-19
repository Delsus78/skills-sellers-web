import {defineStore} from 'pinia';
import {fetchWrapper} from "@/helpers";

const baseUrl = `${import.meta.env.VITE_API_URL}/`;

export const useMainStore = defineStore({
    id: 'main',
    state: () => ({
        backgroundColor: '#9f9f9f',
        isMobileSize: false,
        favoritesIds: JSON.parse(localStorage.getItem('favoritesIds') ?? '[]'),
        showWeaponList: false,
        actualSeason: null,

        // card to change weapon
        cardIdToChange: null
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
        },
        toggleWeaponList(cardId) {
            if (cardId) {
                this.showWeaponList = !this.showWeaponList;
            }
            else this.showWeaponList = false;

            if (this.showWeaponList)
                this.cardIdToChange = cardId;
            else
                this.cardIdToChange = null;
        },
        async getRandomRecipe() {

            // check if we have a quote in local storage and if it's not too old
            const dataStored = JSON.parse(localStorage.getItem('randomRecipe'));
            if (dataStored && dataStored.date && dataStored.date > Date.now() - 1000 * 60 * 60 * 24) {
                return dataStored;
            }

            const url = 'https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/random?number=1';

            const requestOptions = {
                method: 'GET',
                headers: {
                    'X-RapidAPI-Key': '2ad478609cmshd557e10023ca93dp13c2a5jsnd80a5178b80e',
                    'X-RapidAPI-Host': 'spoonacular-recipe-food-nutrition-v1.p.rapidapi.com'
                }
            }
            const res = await (await fetch(url, requestOptions)).json();

            if ( res.recipes.length === 0 ) return;

            const recipe = {
                recipeName: res.recipes[0].title,
                url: res.recipes[0].sourceUrl,
                image: res.recipes[0].image,
                date: Date.now()
            }
            localStorage.setItem('randomRecipe', JSON.stringify(recipe));
            return res;
        },
        async getActualSeason() {
            this.actualSeason = { loading: true };

            this.actualSeason = await fetchWrapper.get(baseUrl + 'season')
                .catch(error => {
                    console.error(error);
                    return {error};
                });
        }
    }
});
