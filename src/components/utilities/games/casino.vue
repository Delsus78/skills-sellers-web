<script setup>
import { useMainStore } from "@/stores";
const mainStore = useMainStore();

mainStore.changeBackgroundColor("#CEAD00FF");

</script>

<template>
    <div class="casino">
        <h1 class="DivTitle">Casino</h1>
        <div class="content">

        </div>
    </div>
</template>

<style scoped>
.casino {
    display: grid;
    background: radial-gradient(ellipse farthest-corner at right bottom, #FEDB37 0%, #FDB931 8%, #9f7928 30%, #8A6E2F 40%, transparent 80%),
    radial-gradient(ellipse farthest-corner at left top, #FFFFFF 0%, #FFFFAC 8%, #D1B464 25%, #5d4a1f 62.5%, #5d4a1f 100%);
    grid-template-columns: 1fr;
    grid-template-rows: 6rem 1fr;
    align-items: center;
    justify-items: center;
}
</style>