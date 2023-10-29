<script setup>
import {faCircleInfo as infoIcon} from "@fortawesome/free-solid-svg-icons";
import {ref} from "vue";

const isShown = ref(false);

const { isRight } = defineProps({
    isRight: {
        type: Boolean,
        default: false
    }
});
</script>
<template>
    <div class="info-bulle" :class="{'right': isRight}"
         @mouseenter="isShown = true" @mouseleave="isShown = false">
        <svg-icon class="info-bulle-icon" :fa-icon="infoIcon" :size="25"/>
        <div class="info-bulle-text" v-if="isShown">
            <slot></slot>
        </div>
    </div>

</template>

<style scoped>
.info-bulle {
    position: absolute;
    top: 10px;
    left: 10px;
    cursor: pointer;
    pointer-events: all;
}
.info-bulle-icon {
    position: absolute;
    top: 0;
    left: 0;
}
.info-bulle-text {
    padding: 1rem;
    background-color: rgba(0, 0, 0, 0.72);
    color: whitesmoke;
    top: 3rem;
    left: 1rem;
    max-width: 25rem;
    border-radius: 0.5rem;
    border: 1px solid black;
    transition: opacity 0.3s ease-in-out;
    z-index: 100000;
    box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.5);
}

.right {
    left: unset;
    right: 1rem;
}
</style>