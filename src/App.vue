<script setup>
import {RouterView, useRoute} from "vue-router";
import NavBar from "@/components/utilities/NavBar.vue";
import {useAuthStore, useCardsStore, useNotificationStore, useMainStore} from '@/stores';
import {computed, onMounted, watch} from "vue";
import Background from "@/components/utilities/background.vue";
import 'moment/locale/fr';
import {storeToRefs} from "pinia";
const authStore = useAuthStore();
const notifStore = useNotificationStore();
const cardsStore = useCardsStore();
const mainStore = useMainStore();
const route=useRoute();
const path = computed(() =>route.path.split('/')[1]);
const { user } = storeToRefs(authStore);
const { backgroundColor } = storeToRefs(mainStore);

onMounted(() => {
    if (user.value) {
        notifStore.initConnection();
        cardsStore.getAllCardsFromUser(user.value.id);
    }
})

// reset background color when user change page (route)
watch(path, () => {
    mainStore.resetBackgroundColor();
})

</script>
<template>
    <background :color="backgroundColor" :key="backgroundColor"/>
    <NavBar v-if="authStore.user" :page-name="path"/>
    <RouterView/>
</template>

<style>
@import 'vue3-toastify/dist/index.css';

/*
.warningSize {
    width: 100vw;
    height: 100vh;
    background: black;
    position: relative;
    z-index: 1000;
    display: flex;
    justify-content: center;
    align-items: center;

    @media (min-width: 1080px) {
        display: none;
    }
}*/
</style>
