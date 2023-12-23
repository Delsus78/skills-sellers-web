<script setup>
import {RouterView, useRoute} from "vue-router";
import NavBar from "@/components/utilities/NavBar.vue";
import {useAuthStore, useCardsStore, useNotificationStore, useMainStore, useSettingsStore} from '@/stores';
import {computed, onMounted, watch} from "vue";
import Background from "@/components/utilities/background.vue";
import 'moment/locale/fr';
import {storeToRefs} from "pinia";
import NavBarMobile from "@/components/utilities/NavBarMobile.vue";
import WeaponList from "@/components/utilities/cards/weapons/WeaponList.vue";
const authStore = useAuthStore();
const notifStore = useNotificationStore();
const cardsStore = useCardsStore();
const mainStore = useMainStore();
const settingsStore = useSettingsStore();
const route=useRoute();
const path = computed(() =>route.path.split('/')[1]);
const { user } = storeToRefs(authStore);
const { backgroundColor, isMobileSize, showWeaponList } = storeToRefs(mainStore);
const { isStarsActive } = storeToRefs(settingsStore);

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
    <WeaponList v-if="showWeaponList" class="weapon-list"/>
    <background v-if="(!isMobileSize || !authStore.user) && (isStarsActive ?? true)" :color="backgroundColor" :key="backgroundColor"/>
    <NavBar v-if="authStore.user && !isMobileSize" :page-name="path"/>
    <NavBarMobile v-if="authStore.user && isMobileSize" :page-name="path"/>
    <RouterView/>
</template>

<style>
@import 'vue3-toastify/dist/index.css';

.weapon-list {
    position: fixed;
    height: 80%;
    z-index: 100;
    top: 10%;
    right: 10%;
}
</style>
