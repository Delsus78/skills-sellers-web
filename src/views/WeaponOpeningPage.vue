<script setup>
import {onBeforeMount, ref} from "vue";
import {useActionsStore} from "@/stores";
import ScratchEffect from "@/components/utilities/ScratchEffect.vue";
import Weapon from "@/components/utilities/cards/weapons/Weapon.vue";
import {router} from "@/helpers";

const actionsStore = useActionsStore();
const openedWeapon = ref(null);

onBeforeMount(async () => {
    openedWeapon.value = await actionsStore.postOpenWeapon();
});

</script>
<template>
  <div v-if="!openedWeapon" class="huge-text">
      Chargement de l'arme...
  </div>
  <div v-else-if="openedWeapon?.error" class="huge-text red">
      ERREUR
  <p class="huge-text red">{{ openedWeapon.error }}</p>
  </div>
  <div v-else class="container">
      <ScratchEffect class="scratchEffect">
          <div class="content">
              <Weapon :weapon="openedWeapon" />
          </div>
      </ScratchEffect>
      <button class="validateOpening swipe-overlay-out" @click="router.push('/cards/');">Passer</button>
  </div>
</template>

<style scoped>
.container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
    user-select: none;
}

.scratchEffect {
    width: 100%;
    height: 100%;
    position: relative;
    border-radius: 1rem;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    z-index: 2;
}

.validateOpening {
    transition: all 0.2s ease-in-out;
    z-index: 10;
    margin: 1rem;
}

.validateOpening:hover {
    transform: scale(1.2);
    color: var(--vt-c-green-1);
    filter: drop-shadow(0 0 4px var(--vt-c-green-1));
}
</style>