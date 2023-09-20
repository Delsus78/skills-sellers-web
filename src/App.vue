<script setup>
import {RouterView, useRoute} from "vue-router";
import NavBar from "@/components/utilities/NavBar.vue";
import { useAuthStore } from '@/stores';
import {computed} from "vue";
const authStore = useAuthStore();
const route=useRoute();
const path = computed(() =>route.path.split('/')[1]);


</script>
<template>
    <NavBar v-if="authStore.user" :page-name="path"/>
    <RouterView/>
</template>

<style>
@import 'vue3-toastify/dist/index.css';
</style>
