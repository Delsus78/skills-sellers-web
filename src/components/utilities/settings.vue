<script setup>

import {useSettingsStore} from "@/stores";

const settingsStore = useSettingsStore();

</script>

<template>
    <div class="navbar-settings">
        <div class="navbar-settings-item">
            <label class="checkbox">Activer les étoiles en BG
                <input type="checkbox" @click="settingsStore.switchBGStarActive()" :checked="settingsStore.isStarsActive ?? true">
                <span class="checkmark"></span>
            </label>
        </div>
        <div class="navbar-settings-item">
            <label class="checkbox">Activer le son des notifs
                <input type="checkbox" @click="settingsStore.switchNotifSoundActive()" :checked="settingsStore.isNotifSoundActive ?? true">
                <span class="checkmark"></span>
            </label>
        </div>
        <div class="navbar-settings-item">
            <label class="checkbox">Activer le son du chat global
                <input type="checkbox" @click="settingsStore.switchGlobalChatSoundActive()" :checked="settingsStore.isGlobalChatSoundActive ?? true">
                <span class="checkmark"></span>
            </label>
        </div>
    </div>
</template>

<style scoped>
.navbar-settings {
    /* centered div on top of everything, take take 33% of the page, spaced by a top margin of 6rem */
    position: fixed;
    top: 6rem;
    left: 33%;
    width: 33%;
    padding: 1rem;

    /* grid for the settings */
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;

    /* background */
    background-color: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(100px);
    border-radius: 1rem;
    border: 1px solid rgba(255, 255, 255, 0.5);
    box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.5);
    color: white;
    z-index: 2000;

    /* animation for the display */
    transition: all 0.5s ease-in-out;

    @media (max-width: 768px) {
        left: 0;
        width: 100%;
    }
}

.navbar-settings-item {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    margin: 0.5rem 0;
}

</style>