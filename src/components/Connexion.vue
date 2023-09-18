<template>
    <div class="ConnexionComp">
        <TextBox placeholder="Nom d'utilisateur" :is-errored="error !== ''" v-model="username"/>
        <!--<input type="password" v-model="password" placeholder="Mot de passe" />-->


        <RandomPlanet v-if="username" v-model="username" :key="reRenderKey" width="950" height="1000" class="playButton-planet"
            :onclick="login"/>

        <p class="play-text" v-if="username">JOUER</p>

    </div>
</template>

<script setup>
import {ref, watch} from 'vue';
import ValidationButton from "@/components/utilities/ValidationButton.vue";
import TextBox from "@/components/utilities/TextBox.vue";
import RandomPlanet from "@/components/utilities/RandomPlanet.vue";

const username = ref('');
const reRenderKey = ref(0);
const error = ref('');

watch(username, (newValue) => {
    if (newValue !== '') {
        error.value = '';
    }

    reRenderKey.value += 1;
});

const login = () => {
    if (username.value === '') {
        error.value = 'Veuillez entrer un nom d\'utilisateur';
    } else {
        error.value = '';
        localStorage.setItem('username', username.value);
        window.location.reload();
    }
}
</script>

<style scoped>
.error-msg {
    color: var(--vt-c-red-1);
}

.ConnexionComp {
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