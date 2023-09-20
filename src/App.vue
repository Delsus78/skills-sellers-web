<script setup>
import {RouterView, useRoute} from "vue-router";
import NavBar from "@/components/utilities/NavBar.vue";
import { useAuthStore } from '@/stores';
import {computed} from "vue";
import Background from "@/components/utilities/background.vue";
const authStore = useAuthStore();
const route=useRoute();
const path = computed(() =>route.path.split('/')[1]);


</script>
<template>
    <background/>
    <NavBar v-if="authStore.user" :page-name="path"/>
    <RouterView/>
</template>

<style>
@import 'vue3-toastify/dist/index.css';
</style>
