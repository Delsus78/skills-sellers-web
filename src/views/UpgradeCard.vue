<script setup>

import {storeToRefs} from "pinia";
import {useAuthStore, useCardsStore, useUsersStore} from "@/stores";
import {computed, ref, watch} from "vue";
import {
    faBurger as cuisiIcon, faCoins as moneyIcon,
    faCompass as exploIcon,
    faDumbbell as forceIcon, faGraduationCap as intelIcon,
    faStar as chariIcon
} from "@fortawesome/free-solid-svg-icons";
import {router} from "@/helpers";
import Card from "@/components/utilities/cards/Card.vue";
import TextCardList from "@/components/utilities/cards/textCardList.vue";

const authStore = useAuthStore();
const cardsStore = useCardsStore();
const usersStore = useUsersStore();
const { user: authUser } = storeToRefs(authStore);
const { actualUser: user } = storeToRefs(usersStore);
const { cards } = storeToRefs(cardsStore);
const error = ref('');
const doublons = ref([]);
const maxPts = ref(0);
const isMaxed = computed(() => {
    return Object.values(card.value.competences).reduce((a, b) => a + b, 0) >= 50;
});
const card = ref(null);

const competencesToAdd = ref({
    cuisine: 0,
    charisme: 0,
    force: 0,
    exploration: 0,
    intelligence: 0,
});

watch(card, () => {

    if (card.value.competences) {
        competencesToAdd.value.cuisine = 0;
    }

    if (card.value.rarity === "commune") {
        maxPts.value = 1;
    }
    if (card.value.rarity === "epic") {
        maxPts.value = 2;
    }
    if (card.value.rarity === "legendaire") {
        maxPts.value = 3;
    }
})

usersStore.getUser(authUser.value.id).then(async (_) => {
    if (user.value.cardsDoublons.length === 0) {
        error.value = "Vous n'avez pas de carte à doubler";
    }

    // sort cards by last id
    user.value.cardsDoublons.sort((a, b) => {
        return b.doublonId - a.doublonId;
    });

    card.value = await cardsStore.getUserCard(authUser.value.id, user.value.cardsDoublons[0].cardId);

    // doublons list
    if (!cards.value || cards.value.loading) {
        return;
    }

    doublons.value = user.value.cardsDoublons
        .sort((a, b) => {
            return b.doublonId - a.doublonId;
        })
        .map((doublon) => {
            const card = cards.value.find((card) => card.id === doublon.cardId);
            return {
                ...doublon,
                name: card.name,
                rarity: card.rarity,
            };
        });
})

const validate = async () => {
    await cardsStore.postUpgradeCard(competencesToAdd.value, card.value.id);


    if (confirm) {
        const noDoublonLeft = user.value.cardsDoublons?.length === 1;
        await cardsStore.postUpgradeCard(competencesToAdd.value, card.value.id);

        await router.push('/cards');

        if (!noDoublonLeft) {
            await router.push('/upgrade');
        }
    }
}

const addPts = (competence) => {
    // return if competencesToAdd sum is equal to maxPts or if competencesToAdd[competence] is equal to 10
    if (Object.values(competencesToAdd.value).reduce((a, b) => a + b, 0) >= maxPts.value || card.value.competences[competence] + competencesToAdd.value[competence] === 10) {
        return;
    }
    competencesToAdd.value[competence] += 1;
}

const removePts = (competence) => {
    if (competencesToAdd.value[competence] === 0) {
        return;
    }
    competencesToAdd.value[competence] -= 1;
}

</script>

<template>
    <div v-if="!card || card.loading">
        <p class="huge-text">Chargement des cartes...</p>
    </div>
    <div v-else class="UpgradeCardWrapper">
        <div class="infos">
            <div class="DivTitle">
                <h1 class="title" :class="card.rarity + '-text'">Doublon !</h1>
            </div>
            <p>Votre doublon est une <strong class="colorChange">{{ card.rarity }}</strong>, vous avez donc <strong class="red">{{maxPts}} Points</strong> à dépenser.</p>
        </div>

        <div v-if="!isMaxed" class="upgradeForm bg-dark-blur">
            <div class="competences">
                <div class="stat">
                    <div class="value">{{ card.competences.cuisine + competencesToAdd.cuisine}}</div>
                    <button class="remove" @click='removePts("cuisine")'>{{ competencesToAdd.cuisine}}</button>
                    <button class="add" @click='addPts("cuisine")'>
                        <svg-icon  :fa-icon="cuisiIcon" :size="28"/>
                    </button>
                </div>
                <div class="stat">
                    <div class="value">{{ card.competences.charisme + competencesToAdd.charisme}}</div>
                    <button class="remove" @click='removePts("charisme")'>{{ competencesToAdd.charisme}}</button>
                    <button class="add" @click='addPts("charisme")'>
                        <svg-icon  :fa-icon="chariIcon" :size="28"/>
                    </button>
                </div>
                <div class="stat">
                    <div class="value">{{ card.competences.force + competencesToAdd.force}}</div>
                    <button class="remove" @click='removePts("force")'>{{ competencesToAdd.force}}</button>
                    <button class="add" @click='addPts("force")'>
                        <svg-icon  :fa-icon="forceIcon" :size="28"/>
                    </button>
                </div>
                <div class="stat">
                    <div class="value">{{ card.competences.exploration + competencesToAdd.exploration }}</div>
                    <button class="remove" @click='removePts("exploration")'>{{ competencesToAdd.exploration}}</button>
                    <button class="add" @click='addPts("exploration")'>
                        <svg-icon  :fa-icon="exploIcon" :size="28"/>
                    </button>
                </div>
                <div class="stat">
                    <div class="value">{{ card.competences.intelligence + competencesToAdd.intelligence}}</div>
                    <button class="remove" @click='removePts("intelligence")'>{{ competencesToAdd.intelligence}}</button>
                    <button class="add" @click='addPts("intelligence")'>
                        <svg-icon  :fa-icon="intelIcon" :size="28"/>
                    </button>
                </div>
            </div>
            <button class="validateBtn swipe-overlay-out" @click="validate()">Améliorer</button>
        </div>
        <div v-else class="upgradeForm bg-dark-blur">
            <p>Vous avez atteint le maximum de points à dépenser !</p>
            <p>Vous pouvez alors obtenir de l'or en échange !</p>
            <button class="validateBtn swipe-overlay-out" @click="validate()">Echanger <svg-icon class="shadow-black" :fa-icon="moneyIcon" :size="17"/></button>
        </div>
        <div class="cardElement">
            <Card :key="card.id"
                  :id="card.id"
                  :name="card.name"
                  :description="card.description"
                  :image-url="card.imageUrl"
                  :competences="card.competences"
                  :rarity="card.rarity"
                  :collection="card.collection"
                  :action="card.action"
                  :weapon="card.weapon"
                  :power="card.power"
                  hide-favorite/>
        </div>
        <div class="radiance">
            <div v-for="i in 6" :key="i" :class="[card.rarity, 'ray']" :style="{ transform: 'rotate(' + (i * 30) + 'deg)' }"></div>
        </div>
        <div class="doublons" v-if="doublons">
            <text-card-list :cards="doublons" highlight-first-card/>
        </div>
    </div>
</template>

<style scoped>
.UpgradeCardWrapper {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;

    @media (max-width: 1450px) {
        grid-template-columns: repeat(2, 1fr);
    }

    @media (max-width: 1200px) {
        grid-template-columns: 1fr;
    }

    @media (max-width: 1023px) {
        grid-template-columns: 1fr;
        margin-top: 6rem;
        grid-template-rows: 20rem 30rem;
    }
}

.infos {
    position: relative;
    z-index: 1;
    padding: 1rem;
    margin: 1rem;
    border-radius: 1rem;
    background-color: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(5px);
    box-shadow: 0 0 1rem rgba(0, 0, 0, 0.5);
}

.radiance {
    position: fixed;
    width: 230%;
    height: 230%;
    top: 50%;
    left: 51%;
    transform: translateX(-75%) rotate(0deg); /* rotation initiale ajoutée ici */
    pointer-events: none;
    z-index: 0;

    @media (max-width: 768px) {
        width: 500%;
    }
}

.ray {
    position: absolute;
    width: 50%;
    height: 2rem;
    background-color: rgba(255, 255, 255, 0.5);
    left: 50%;
    transform-origin: 50% 0;
    animation: pulse 1.5s ease-in-out infinite;
}

@keyframes pulse {
    0%, 100% { opacity: 0.3; }
    50% { opacity: 1; }
}

.cardElement {
    grid-column: 2;
    grid-row: 1 / 3;
    border-radius: 1rem;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    z-index: 2;

    @media (max-width: 1450px) {
        grid-column: auto;
    }

    @media (max-width: 1200px) {
        grid-column: auto;
        grid-row: auto;
    }

    @media (max-width: 1023px) {
        grid-column: auto;
    }
}

.colorChange {
    font-weight: bold;
    animation: colorChange 6s linear infinite;
}

.upgradeForm {
    position: relative;
    grid-column: 1;
    z-index: 1;
    padding: 1rem;
    margin: 1rem 1rem 10rem;
    border-radius: 1rem;
    background-color: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(5px);
    box-shadow: 0 0 1rem rgba(0, 0, 0, 0.5);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    color: white;

    @media (max-width: 1450px) {
        grid-column: auto;
    }

    @media (max-width: 1200px) {
        grid-column: auto;
        grid-row: auto;
    }

    @media (max-width: 1023px) {
        grid-column: auto;
    }
}

.doublons {
    position: relative;
    grid-column: 3;
    grid-row: 1 / 3;
    z-index: 1;
    padding: 1rem;
    margin: 1rem;
    border-radius: 1rem;
    backdrop-filter: blur(5px);
    box-shadow: 0 0 1rem rgba(0, 0, 0, 0.5);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    color: white;

    @media (max-width: 1450px) {
        grid-column: auto;
    }

    @media (max-width: 1200px) {
        grid-column: auto;
        grid-row: auto;
    }

    @media (max-width: 1023px) {
        grid-column: auto;
    }
}

.validateBtn {
    z-index: 100;
    transition: all 0.2s ease-in-out;
    width: 40%;
    margin: 0 auto;
}

.validateBtn:hover {
    transform: scale(1.2);
    color: var(--vt-c-green-1);
    filter: drop-shadow(0 0 4px var(--vt-c-green-1));
}

.competences {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    grid-template-rows: 1fr;
    grid-gap: 1rem;
    width: 100%;
    height: 100%;
    align-items: center;
    justify-items: center;
}

.stat {
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: 1fr 1fr;
    grid-gap: 0.5rem;
    width: 100%;
    height: 100%;
    align-items: center;
    justify-items: center;
}

.value {
    font-size: 2rem;
    font-weight: bold;
    color: var(--vt-c-black-soft);
}

.remove {
    width: 100%;
    height: 100%;
    border-radius: 1rem;
    background-color: var(--vt-c-red-1);
    color: var(--vt-c-white);
    font-size: 1.5rem;
    font-weight: bold;
    transition: all 0.2s ease-in-out;
}

.remove:hover {
    transform: scale(1.2);
    filter: drop-shadow(0 0 4px var(--vt-c-red-1));
}

.add {
    width: 100%;
    height: 100%;
    border-radius: 1rem;
    background-color: var(--vt-c-green-1);
    color: var(--vt-c-white);
    font-size: 1.5rem;
    font-weight: bold;
    transition: all 0.2s ease-in-out;
}

.add:hover {
    transform: scale(1.2);
    filter: drop-shadow(0 0 4px var(--vt-c-green-1));
}
</style>