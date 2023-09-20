<script setup>
import { useAuthStore } from "@/stores";
import {storeToRefs} from "pinia";
const authStore = useAuthStore();
const { user: authUser } = storeToRefs(authStore);

</script>
<template>

    <a @click="authStore.logout()" class="nav-item nav-link">Logout</a>
<p>home</p>
  <h1>connected as <span class="red">{{ authUser?.pseudo }}</span></h1>
</template>

<style scoped>

</style>