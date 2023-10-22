<script setup>
import {RouterView, useRoute} from "vue-router";
import NavBar from "@/components/utilities/NavBar.vue";
import {useAuthStore, useCardsStore, useNotificationStore, useMainStore} from '@/stores';
import {computed, onMounted, watch} from "vue";
import Background from "@/components/utilities/background.vue";
import 'moment/locale/fr';
import {storeToRefs} from "pinia";
import NavBarMobile from "@/components/utilities/NavBarMobile.vue";
const authStore = useAuthStore();
const notifStore = useNotificationStore();
const cardsStore = useCardsStore();
const mainStore = useMainStore();
const route=useRoute();
const path = computed(() =>route.path.split('/')[1]);
const { user } = storeToRefs(authStore);
const { backgroundColor, isMobileSize } = storeToRefs(mainStore);

const onResize = () => {
    mainStore.setIsMobileSize(window.innerWidth < 1023);
}

onMounted(() => {
    if (user.value) {
        notifStore.initConnection();
        cardsStore.getAllCardsFromUser(user.value.id);
    }

    window.addEventListener('resize', onResize);
    onResize();
})

// reset background color when user change page (route)
watch(path, () => {
    mainStore.resetBackgroundColor();
})

</script>
<template>
    <background v-if="!isMobileSize || !authStore.user" :color="backgroundColor" :key="backgroundColor"/>
    <NavBar v-if="authStore.user && !isMobileSize" :page-name="path"/>
    <NavBarMobile v-if="authStore.user && isMobileSize" :page-name="path"/>
    <RouterView/>
</template>

<style>
@import 'vue3-toastify/dist/index.css';
</style>
