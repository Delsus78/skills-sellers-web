<script setup>
import {computed, onMounted, ref, watch} from 'vue';
import TextBox from "@/components/utilities/TextBox.vue";
import RandomPlanet from "@/components/utilities/RandomPlanet.vue";
import {toast} from "vue3-toastify";
import HeaderComp from "@/components/utilities/HeaderComp.vue";
import {useAuthStore} from "@/stores";
import {useRoute} from "vue-router";

const password = ref('');
const confirmPassword = ref('');
const error = ref('');
const route = useRoute();
const link = computed(() => route.query.link);

onMounted(() => {
    if (!link.value) {
        toast.error('Aucun lien d\'invitation n\'a été trouvé', {position: 'bottom-right'});
    }
});

const resetpassword = () => {
    if (password.value === '' && password.value.length < 6) {
        error.value = 'Veuillez entrer un mot de passe d\'au moins 6 caractères';
        toast.error(error.value, {position: 'bottom-right', delay: 3000});
        return;
    }

    const authStore = useAuthStore();
    authStore.resetpassword(password.value, confirmPassword.value, link.value)
        .catch(error => {
            toast("Impossible de créer le compte :\n" + error, {type: "error"});

            console.error('Erreur lors de l\'appel API:', error);
        });

}
</script>
<template>
    <div class="RegisterPage">
        <header>
            <HeaderComp in-line/>
        </header>
        <div class="registrationComp">
            <div class="registrationForm">
                <TextBox input-type="password" v-model="password" placeholder="Mot de passe" />
                <TextBox input-type="password" v-model="confirmPassword" placeholder="Confirmation mot de passe" />
            </div>

            <div class="resetPassButton" @click="resetpassword">
                    <p class="play-text">JOUER</p>
            </div>
        </div>
    </div>
</template>
<style scoped>
.RegisterPage {
    display: grid;
    max-width: 1280px;
    grid-template-columns: 1fr 4fr 1fr;
    grid-template-rows: 20rem 1fr;
    grid-gap: 2rem;
    padding: 2rem;
    overflow: hidden;
    height: 100vh;
}

header {
    grid-column: 2;
    grid-row: 1;
    height: 100%;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
}

.registrationComp {
    grid-column: 2;
    grid-row: 2;
    display: grid;
    grid-template-areas: "form" "button";
    grid-gap: 2rem;
    align-items: center;
    justify-items: center;
    width: 100%;
    height: 100%;
}

.registrationForm {
    grid-area: form;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin-bottom: 2rem;
}

.play-text {
    position: fixed;
    bottom: 5vh;
    left: 50%;
    transform: translateX(-50%);
    display: flow;
    font-size: 5rem;
    font-family: "Big John", sans-serif;
    color: var(--vt-c-white-1);
    text-shadow: 0 0 1rem var(--vt-c-white-dark);
    z-index: 1000;
}

.play-text:hover {
    text-shadow: 0 0 1rem var(--vt-c-white-1);
    cursor: pointer;
}

</style>