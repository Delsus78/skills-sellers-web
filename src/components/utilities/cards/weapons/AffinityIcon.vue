<script setup>
import {
    faHandBackFist as rockIcon,
    faHandScissors as scissorsIcon,
    faHand as paperIcon,
} from "@fortawesome/free-solid-svg-icons";
const { affinityId } = defineProps({
    affinityId: {
        type: Number,
        default: 0
    }
});
</script>
<template>
    <div class="icon">
        <svg-icon v-if="affinityId === 0" :fa-icon="rockIcon" :size="40"/>
        <svg-icon v-if="affinityId === 1" :fa-icon="paperIcon" :size="40"/>
        <svg-icon v-if="affinityId === 2" :fa-icon="scissorsIcon" :size="40"/>
    </div>
</template>
<style scoped>
.icon {
    display: flex;
    justify-content: center;
    align-items: center;
}
</style>