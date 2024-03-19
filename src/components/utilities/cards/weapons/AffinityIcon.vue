<script setup>
import {
    faHandBackFist as rockIcon,
    faHandScissors as scissorsIcon,
    faHand as paperIcon,
} from "@fortawesome/free-solid-svg-icons";
const { affinityId, size } = defineProps({
    affinityId: {
        type: Number,
        default: 0
    },
    size: {
        type: Number,
        default: 40
    }
});
</script>
<template>
    <div class="icon">
        <svg-icon v-if="affinityId === 0" :fa-icon="rockIcon" :size="size"/>
        <svg-icon v-if="affinityId === 1" :fa-icon="paperIcon" :size="size"/>
        <svg-icon v-if="affinityId === 2" :fa-icon="scissorsIcon" :size="size"/>
    </div>
</template>
<style scoped>
.icon {
    display: flex;
    justify-content: center;
    align-items: center;
}
</style>