<script setup>
import { useAuthStore } from "@/stores";
import {storeToRefs} from "pinia";
import Background from "@/components/utilities/background.vue";
const authStore = useAuthStore();
const { user: authUser } = storeToRefs(authStore);

</script>
<template>
    <background/>
  <h1>connected as <span class="red">{{ authUser?.pseudo }}</span></h1>
</template>

<style scoped>

</style>