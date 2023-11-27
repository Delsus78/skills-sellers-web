<script setup>
import {useGamesStore} from "@/stores";
import {storeToRefs} from "pinia";

const gamesStore = useGamesStore();

const { christmas } = storeToRefs(gamesStore);
gamesStore.getChristmasList();

const openChristmasGift = () => {
    gamesStore.openChristmasGift();
}

</script>
<template>
    <div v-if="christmas.loading">
        <p class="huge-text">Chargement du calendrier de Noël...</p>
    </div>
    <div v-else-if="christmas.error">
        <p class="huge-text red">{{ christmas.error }}</p>
    </div>
    <div v-else class="christmas">
        <div class="christmas_content">
            <div class="titleDiv">
                <div class="title">
                    Calendrier de l'avent
                </div>
                <div class="subTitle">Youpi</div>
            </div>
            <div class="content">
                <div v-for="(dayInt, index) in christmas.daysOpened" :key="index">
                    <div v-if="dayInt === 0" class="dayCase_content notClaimable">
                        <div class="dayCase_content_title">Jour {{ index + 1 }}</div>
                        <div class="dayCase_content_subTitle">Indisponible</div>
                    </div>
                    <div v-else-if="dayInt === 1" class="dayCase_content claimable legendaire"
                         @click="openChristmasGift()">
                        <div class="dayCase_content_title">Jour {{ index + 1 }}</div>
                        <div class="dayCase_content_subTitle">Cliquez pour ouvrir</div>
                    </div>
                    <div v-else-if="dayInt === 2" class="dayCase_content claimed">
                        <div class="dayCase_content_title">Jour {{ index + 1 }}</div>
                        <div class="dayCase_content_subTitle">Cadeau déjà ouvert</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.christmas_content {
    margin-top: 5rem;
}
.title {
    display: flex;
    justify-content: center;
    align-items: center;
    font-weight: normal;
    font-size: 4.5em;
    text-align: center;
    font-family: "Big John", sans-serif;

    /* Fallback: Set a background color. */
    background-color: red;

    /* Create the gradient. */
    background-image: linear-gradient(45deg, #fc1b5c, #960019);

    /* Set the background size and repeat properties. */
    background-size: 100%;
    background-repeat: repeat;

    /* Use the text as a mask for the background. */
    /* This will show the gradient as a text color rather than element bg. */
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    -moz-background-clip: text;
    -moz-text-fill-color: transparent;
}

.subTitle {
    display: flex;
    justify-content: center;
    align-items: flex-end;
    font-weight: normal;
    font-size: 1.5em;
    text-align: center;
    font-family: "Big John", sans-serif;
    margin-bottom: 1rem;
}

.content {
    z-index: 100;
    border-radius: 1rem;
    padding: 1rem;
    background:
            radial-gradient(
                    ellipse farthest-corner at right bottom,
                    rgba(215, 130, 130, 0.5) 0%, /* #d78282 avec 80% d'opacité */
                    rgba(199, 65, 65, 0.5) 8%, /* #c74141 avec 80% d'opacité */
                    rgba(253, 50, 50, 0.5) 30%, /* #fd3232 avec 80% d'opacité */
                    rgba(241, 25, 25, 0.5) 40% /* #f11919 avec 80% d'opacité */
            ),
            radial-gradient(
                    ellipse farthest-corner at left top,
                    rgba(250, 214, 214, 0.5) 0%, /* #fad6d6 avec 80% d'opacité */
                    rgba(248, 96, 96, 0.5) 8%, /* #f86060 avec 80% d'opacité */
                    rgba(250, 30, 30, 0.5) 25%, /* #fa1e1e avec 80% d'opacité */
                    rgba(114, 23, 23, 0.5) 62.5%, /* #721717 avec 80% d'opacité */
                    rgba(93, 74, 31, 0.5) 100% /* #5d4a1f avec 80% d'opacité */
            );
    box-shadow: 0 0 1rem 0 rgba(0, 0, 0, 0.9);
    backdrop-filter: blur(5px);
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    grid-template-rows: repeat(4, 1fr);
    grid-gap: 1rem;
    padding: 1rem;

    @media (max-width: 1023px) {
        grid-template-columns: repeat(3, 1fr);
        grid-template-rows: repeat(8, 1fr);
        font-size: 0.8rem;
    }
}

.dayCase_content {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    border-radius: 1rem;
    padding: 1rem;
    box-shadow: 0 0 1rem 0 rgba(0, 0, 0, 0.9);
}

.notClaimable {
    background: #9a2323;
}

.claimable {
    backdrop-filter: blur(5px);
    background: #5ce75c;
    color: black;
    font-weight: bold;
    cursor: pointer;
}

.claimed {
    background: #a7b4ff;
    color: black;
    font-weight: bold;
}
</style>