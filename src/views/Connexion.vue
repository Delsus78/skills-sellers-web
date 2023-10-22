<template>
    <div class="rulesBtn">
        <RouterLink :to="`/rules`"><svg-icon class="shadow-white" :fa-icon="rulesIcon" :size="50"/></RouterLink>
    </div>
    <div class="ConnexionPage">
        <header>
            <HeaderComp />
        </header>
        <div class="ConnexionComp">
            <div class="connexionForm">
                <TextBox placeholder="Nom d'utilisateur" :is-errored="error !== ''" v-model="username"/>
                <TextBox input-type="password" v-model="password" placeholder="Mot de passe" />
            </div>
        </div>
        <div class="playButton">
            <RandomPlanet v-if="username" v-model="username" :key="reRenderKey" :width="950" :height="1000" class="playButton-planet"
                          :onclick="login" :planet-id="100"/>
            <p class="play-text" v-if="username">JOUER</p>
        </div>
    </div>
</template>

<script setup>
import {ref, watch} from 'vue';
import TextBox from "@/components/utilities/TextBox.vue";
import RandomPlanet from "@/components/utilities/RandomPlanet.vue";
import {toast} from "vue3-toastify";
import HeaderComp from "@/components/utilities/HeaderComp.vue";
import {useAuthStore} from "@/stores";
import {faBook as rulesIcon} from "@fortawesome/free-solid-svg-icons";
import {RouterLink} from "vue-router";

const username = ref('');
const password = ref('');
const reRenderKey = ref(0);
const error = ref('');

watch(username, () => {
    error.value = '';
    reRenderKey.value += 1;
});

const login = () => {
    if (username.value === '') {
        error.value = 'Veuillez entrer un nom d\'utilisateur';
        toast.error(error.value, {position: 'bottom-right', delay: 3000});
        return;
    }
    if (password.value === '') {
        error.value = 'Veuillez entrer un mot de passe';
        toast.error(error.value, {position: 'bottom-right', delay: 3000});
        return;
    }

    error.value = '';
    const authStore = useAuthStore();
    authStore.login(username.value, password.value)
        .catch(error => {
            toast("Impossible de se connecter:\n" + error, {type: "error"});

            console.error('Erreur lors de l\'appel API:', error);
        });

}
</script>

<style scoped>
.ConnexionPage {
    max-width: 1280px;
    display: grid;
    grid-gap: 1rem;
    padding: 2rem
}

.connexionForm {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}

header {
    pointer-events: none
}

.ConnexionComp {
    margin-top: 3rem
}

.playButton-planet {
    position: fixed;
    cursor: pointer;
    bottom: -45rem
}

.playButton {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-bottom: 7rem;
}

.play-text {
    font-size: 5rem;
    font-family: "Big John",sans-serif;
    pointer-events: none;
    position: fixed;
    cursor: pointer;
    bottom: 1rem;
    color: var(--vt-c-white-1);
    text-shadow: 0 0 1rem var(--vt-c-white-dark);
    z-index: 100;
}

.playButton-planet:hover,.rulesBtn:hover {
    filter: brightness(.8);
    transition: .5s
}

.playButton-planet:hover+.play-text {
    text-shadow: 0 0 2rem var(--vt-c-white-1);
    transition: 1s
}

.rulesBtn {
    position: fixed;
    cursor: pointer;
    top: 2rem;
    right: 2rem;
    z-index: 100;
    transition: .2s ease-in-out
}

.rulesBtn svg {
    color: var(--vt-c-white-1)
}

.rulesBtn:hover {
    transform: scale(1.4)
}
</style>