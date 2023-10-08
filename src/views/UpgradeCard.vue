<script setup>

import {storeToRefs} from "pinia";
import {useAuthStore, useCardsStore, useUsersStore} from "@/stores";
import {ref, watch} from "vue";
import {
    faBurger as cuisiIcon,
    faCompass as exploIcon,
    faDumbbell as forceIcon, faGraduationCap as intelIcon,
    faStar as chariIcon
} from "@fortawesome/free-solid-svg-icons";
import {router} from "@/helpers";
import CardListElement from "@/components/utilities/CardListElement.vue";

const authStore = useAuthStore();
const cardsStore = useCardsStore();
const usersStore = useUsersStore();
const { user: authUser } = storeToRefs(authStore);
const { actualUser: user } = storeToRefs(usersStore);
const error = ref('');
const maxPts = ref(0);
const card = ref(null);
const competencesToAdd = ref({
    cuisine: 0,
    charisme: 0,
    force: 0,
    exploration: 0,
    intelligence: 0,
});

usersStore.getUser(authUser.value.id).then(async (userReturned) => {
    if (user.value.cardsDoubledIds.length === 0) {
        error.value = "Vous n'avez pas de carte à doubler";
    }

    card.value = await cardsStore.getUserCard(authUser.value.id, user.value.cardsDoubledIds[0]);
})

watch(card, () => {
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

const validate = async () => {
    // confirm action
    let confirm = window.confirm("Confirmer l'action ?");

    if (confirm) {
        await cardsStore.postUpgradeCard(competencesToAdd.value, card.value.id);

        await router.push('/cards/' + authUser.value.id);
    }
}

const addPts = (competence) => {
    // return if competencesToAdd sum is equal to maxPts or if competencesToAdd[competence] is equal to 10
    if (Object.values(competencesToAdd.value).reduce((a, b) => a + b, 0) === maxPts.value || card.value.competences[competence] + competencesToAdd.value[competence] === 10) {
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
                <h1 class="title">Doublon !</h1>
            </div>
            <p>Votre doublon est une <strong class="colored">{{ card.rarity }}</strong>, vous avez donc <strong class="red">{{maxPts}} Points</strong> à dépenser.</p>
        </div>
        <CardListElement v-if="card" :card="card" class="cardElement not_draggable"/>
        <div class="upgradeForm bg-dark-blur">
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
    </div>
</template>

<style scoped>
.UpgradeCardWrapper {
    width: 100%;
    height: 100%;
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    grid-template-rows: 6rem 6rem 1fr 1fr;
    align-items: center;
    justify-items: center;
    overflow: hidden;
}

.infos {
    grid-column: 1 / 4;
    grid-row: 2;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    font-size: 1.5rem;
}

.cardElement {
    grid-column: 2;
    grid-row: 3;
    justify-self: center;
    align-self: center;
    border-radius: 1rem;
    box-shadow: 0 0 1rem 0.5rem rgba(0, 0, 0, 0.2);
    backdrop-filter: blur(5px);
}

.colored {
    font-weight: bold;
    animation: colorChange 6s linear infinite;
}

.upgradeForm {
    grid-column: 2 / 3;
    grid-row: 4;
    display: grid;
    justify-content: space-evenly;
    align-items: center;
    width: 100%;
    height: 100%;
    border-radius: 1rem;
    margin: 2rem;
    box-shadow: 0 0 1rem 0.5rem rgba(0, 0, 0, 0.2);
    backdrop-filter: blur(5px);
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

.disabled {
    filter: drop-shadow(0 0 4px var(--vt-c-black-soft));
    color: var(--vt-c-black-soft);
    cursor: not-allowed;
    pointer-events: none;
}

.disabled:hover {
    transform: scale(1);
    color: var(--vt-c-black-soft);
    filter: drop-shadow(0 0 4px var(--vt-c-black-soft));
    cursor: not-allowed;
    pointer-events: none;
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