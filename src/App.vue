<script setup>
import {RouterView, useRoute} from "vue-router";
import NavBar from "@/components/utilities/NavBar.vue";
import {useAuthStore, useNotificationStore} from '@/stores';
import {computed, onMounted} from "vue";
import Background from "@/components/utilities/background.vue";
import 'moment/locale/fr';
const authStore = useAuthStore();
const notifStore = useNotificationStore();
const route=useRoute();
const path = computed(() =>route.path.split('/')[1]);

onMounted(() => {
    if (authStore.user) {
        notifStore.initConnection();
    }
})

</script>
<template>
    <background/>
    <NavBar v-if="authStore.user" :page-name="path"/>
    <RouterView/>
</template>

<style>
@import 'vue3-toastify/dist/index.css';
</style>
