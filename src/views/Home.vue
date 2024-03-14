<script setup>
import {storeToRefs} from "pinia";
import CosmeticMarket from "@/components/utilities/CosmeticMarket/ComseticMarket.vue";
import Scoreboard from "@/components/utilities/Scoreboard.vue";
import { useUsersStore, useMainStore } from "@/stores";
import GlobalChat from "@/components/utilities/GlobalChat.vue";
import {computed, onMounted, ref} from "vue";
import TitleImage from "@/components/icons/TitleImage.vue";
const usersStore = useUsersStore();
const mainStore = useMainStore();
const { users } = storeToRefs(usersStore);
const randomTodayRecipe = ref({});
usersStore.getAllUsers();
mainStore.getActualSeason();

onMounted(async () => {
    randomTodayRecipe.value = await mainStore.getRandomRecipe();
    console.log(randomTodayRecipe.value);
});

const usersSorted = computed(() => {
    if (users.value.loading || users.value.error) return [];
    return users.value.sort((a, b) => {
        return b.score - a.score;
    });
});

const reloadScoreboardPanel = () => {
    usersStore.getAllUsers();
    mainStore.getActualSeason();
};

</script>
<template>
  <div class="Home">
      <GlobalChat class="GlobalChat"/>
      <div class="WelcomeDiv">
          <TitleImage />
          <h2 class="WelcomeTitle" v-if="randomTodayRecipe">Une petite recette ?</h2>
          <a :href="randomTodayRecipe.url" target="_blank">
              <p class="WelcomeText">{{ randomTodayRecipe.recipeName }}</p>
              <img class="FoodImage" :src="randomTodayRecipe.image" alt="Food image"/>
          </a>
      </div>
      <CosmeticMarket class="CosmeticMarket"/>
      <Scoreboard class="Scoreboard" :players="usersSorted" @reload="reloadScoreboardPanel"/>
  </div>
</template>

<style scoped>

.Home {
    display: grid;
    grid-template-rows: 6rem 25rem 25rem;
    grid-template-columns: 1fr 3fr 1fr;

    @media (max-width: 1023px) {
        grid-template-columns: 1fr;
        grid-template-rows: 6rem 50rem 50rem 50rem;
    }
}

.WelcomeDiv {
    grid-row: 2;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}

.WelcomeTitle {
    margin-top: 2rem;
    font-size: 2rem;
    font-weight: bold;
    text-align: center;
}

.WelcomeText {
    font-size: 1.5rem;
    text-align: center;
}

a {
    text-decoration: none;
    color: var(--vt-c-blue-1);
    display: flex;
    flex-direction: column;
    align-items: center;
    scale: 0.8;
}

.FoodImage {
    width: 15rem;
    height: 10rem;
    border-radius: 1rem;
    margin-top: 1rem;
}

.CosmeticMarket {
    grid-row: 3;
    width: auto;

    @media (max-width: 1023px) {
        width: 100%;
        grid-row: 1;
        transform: rotateY(0deg);
    }
}

.Scoreboard {
    transform: perspective(1000px) rotateX(0deg) rotateY(-12.5deg);
    grid-row: 2 / 4;
    width: 30rem;

    @media (max-width: 1023px) {
        width: 100%;
        grid-row: 2;
        transform: rotateY(0deg);
    }
}

.GlobalChat {
    transform: perspective(1000px) rotateX(0deg) rotateY(12.5deg);
    grid-row: 2 / 4;
    width: 30rem;

    @media (max-width: 1023px) {
        width: 100%;
        grid-row: 3;
        transform: rotateY(0deg);
    }
}

</style>