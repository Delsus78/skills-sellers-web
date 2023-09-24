<template>
    <div class="ConnexionPage">
        <header>
            <HeaderComp />
        </header>
        <div class="ConnexionComp">
            <TextBox placeholder="Nom d'utilisateur" :is-errored="error !== ''" v-model="username"/>
            <TextBox input-type="password" v-model="password" placeholder="Mot de passe" />

            <RandomPlanet v-if="username" v-model="username" :key="reRenderKey" width="950" height="1000" class="playButton-planet"
                :onclick="login"/>

            <p class="play-text" v-if="username">JOUER</p>

        </div>
    </div>
</template>

<script setup>
import {ref, watch} from 'vue';
import background from "@/components/utilities/background.vue";
import TextBox from "@/components/utilities/TextBox.vue";
import RandomPlanet from "@/components/utilities/RandomPlanet.vue";
import {toast} from "vue3-toastify";
import HeaderComp from "@/components/utilities/HeaderComp.vue";
import {useAuthStore} from "@/stores";

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
    grid-template-columns: 1fr 4fr 1fr;
    grid-template-rows: 1fr 1fr;
    padding: 2rem;
}

header {
    grid-column: 1 / 4;
    grid-row: 1;
    pointer-events: none;
}

.ConnexionComp {
    grid-column: 2;
    grid-row: 2;
    padding: 7rem;
    margin: 3rem;
}

.playButton-planet {
    position: fixed;
    /* Décaler la div de la moitié de sa largeur pour la centrer parfaitement */
    transform: translateX(-25%);

}

.play-text {
    position: fixed;
    bottom: 2rem;
    transform: translateX(30%);
    /* Décaler la div de la moitié de sa largeur pour la centrer parfaitement */
    font-size: 5rem;
    font-family: "Big John", sans-serif;
    pointer-events: none;
    color: var(--vt-c-white-1);
    text-shadow: 0 0 1rem var(--vt-c-white-dark);
}

/* hover qui fonce le playButton avec une transition */
.playButton-planet:hover {
    filter: brightness(0.8);
    transition: 0.5s;
}

.playButton-planet:hover + .play-text {
    text-shadow: 0 0 2rem var(--vt-c-white-1);
    transition: 1s;
}

</style>