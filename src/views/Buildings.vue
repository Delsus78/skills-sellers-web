<script setup>
import {useUsersStore, useAuthStore, useMarchandStore} from "@/stores";
import {storeToRefs} from "pinia";
import BatimentElement from "@/components/utilities/BatimentElement.vue";
import RandomPlanet from "@/components/utilities/RandomPlanet.vue";
import {ref} from "vue";
import MarchandRocket from "@/components/utilities/MarchandRocket.vue";
import BonnBouff from "@/components/utilities/BonnBouff.vue";
import {router} from "@/helpers";
const usersStore = useUsersStore();
const authStore = useAuthStore();
const marchandStore = useMarchandStore();

const { buildings } = storeToRefs(usersStore);
const { user: authUser } = storeToRefs(authStore);
const { offer } = storeToRefs(marchandStore);

marchandStore.getMarchandOffer();
usersStore.getBuildingsOfUser(authUser.value.id);

const bonnBouffopen = ref(false);

const SelectAction = (action) => {
    router.push('action/'+action);
}

defineExpose({
    SelectAction,
});

const switchOpenBonnBouff = () => {
    bonnBouffopen.value = !bonnBouffopen.value;
}

const tradeWithBonnBouff = () => {
    marchandStore.buyMarchandOffer();
    switchOpenBonnBouff();
}

</script>
<template>
    <div class="BuildingsWrapper">
        <div v-if="buildings.loading">
            <p class="huge-text">Chargement des bâtiments...</p>
        </div>
        <div v-else-if="buildings.error" class="huge-text text-danger">
            Erreur lors du chargement des bâtiments: {{buildings.error}}
        </div>
        <div v-else class="Batiments">
            <BatimentElement class="Cantine" :level="buildings.cuisineLevel" nom-batiment="CUISINE"
                             :border-color="buildings.cuisineLevel === buildings.nbCuisineUsedToday ? 'red' : 'black'"
                             @click="SelectAction('cuisiner');" direction="left"
                             :info-supp="{ 'Cuisine utilisée(s) aujourd\'hui': buildings.nbCuisineUsedToday}"/>

            <BatimentElement class="SalleDeSport" :level="buildings.salleSportLevel" nom-batiment="SALLE DE SPORT"
                              :border-color="buildings.salleSportLevel === buildings.actualSalleSportUsed ? 'red' : 'black'"
                             @click="SelectAction('muscler');" direction="right"
                             :info-supp="{ 'Salle de sport utilisée(s)': buildings.actualSalleSportUsed}"/>

            <BatimentElement class="Labo" :level="buildings.laboLevel" nom-batiment="LABO"
                              :border-color="buildings.laboLevel === buildings.actualLaboUsed ? 'red' : 'black'"
                             @click="SelectAction('ameliorer');" direction="left"
                             :info-supp="{ 'Labo utilisé(s)': buildings.actualLaboUsed}"/>

            <BatimentElement class="SpatioPort" :level="buildings.spatioPortLevel" nom-batiment="SPATIOPORT"
                              :border-color="buildings.spatioPortLevel === buildings.actualSpatioPortUsed ? 'red' : 'black'"
                             @click="SelectAction('explorer');" direction="right"
                             :info-supp="{ 'SpatioPort utilisé(s)': buildings.actualSpatioPortUsed}"/>

        </div>
        <RandomPlanet class="planetBuilding" v-model="authUser.pseudo" :width="850" :height="850" :planet-id='1'/>

        <div v-if="(!buildings.loading || !buildings.error || offer.loading)
                        && buildings.nbBuyMarchandToday < buildings.nbBuyMarchandMaxPerDay"
             class="marchandRocket"
             @click="switchOpenBonnBouff">
            <MarchandRocket :seed="offer.foodName" class="svgRocket"/>
            <h2 class="shadow-black DivTitle" >M. BonnBouff</h2>
        </div>
        <div v-if="bonnBouffopen">
            <BonnBouff @close="switchOpenBonnBouff" @buy="tradeWithBonnBouff" :offer="offer"/>
        </div>
    </div>
</template>

<style scoped>
.BuildingsWrapper {
    width: 100%;
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    grid-template-rows: 6rem 1fr;
    align-items: center;
    justify-items: center;
    height: 100vh;
    overflow-y: hidden;

    @media (max-width: 1023px) {
        grid-template-columns: 1fr;
        grid-template-rows: 6rem 5rem 1fr;
        overflow-y: visible;
    }
}

.Batiments {
    grid-column: 2;
    grid-row: 2;
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-template-rows: repeat(3, 1fr);
    width: 100%;
    height: 100%;
    z-index: 101;
    justify-items: center;
    align-items: center;

    @media (max-width: 1023px) {
        grid-template-columns: 1fr;
        grid-column: 1;
        grid-row: 3;
    }
}

.planetBuilding {
    grid-column: 2;
    grid-row: 2;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 1;
    transition: all 0.5s ease-in-out;

    @media (max-width: 1023px) {
        grid-column: 1;
        display: none;

    }
}

.actionSelectedMode {
    filter: brightness(0.5);
    transform: translateY(75%) scale(2);
}

.huge-text {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 100;
}

.marchandRocket {
    position: fixed;
    bottom: 7rem;
    right: 2rem;
    width: 10rem;
    height: 10rem;
    z-index: 100;
    cursor: pointer;
    transition: all 0.1s ease-in-out;

    @media (max-width: 1023px) {
        position: initial;
        height: 3rem;
        width: 70%;
        grid-column: 1;
        grid-row: 2;
        display: grid;
        grid-template-columns: 1fr 1fr;
    }
}

@media (max-width: 1023px) {
    .marchandRocket h2 {
        grid-column: 2;
        grid-row: 1;
        font-size: 1rem !important;
    }
}

.marchandRocket:hover {
    transform: scale(1.1);
}

.marchandRocket h2 {
    font-size: 1.2rem;
}

.marchandRocket .svgRocket {
    transform: rotate(100deg);

    @media (max-width: 1023px) {
        grid-column: 1;
        grid-row: 1;
        max-height: 100%;
    }
}

</style>