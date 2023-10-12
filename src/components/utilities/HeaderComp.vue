<script setup>

import TitleImage from "@/components/icons/TitleImage.vue";

const { inLine } = defineProps({
    inLine: {
        type: Boolean,
        required: false,
        default: false
    }
});
</script>

<template>
    <TitleImage :in-line="inLine"/>
</template>

<style scoped>
</style>