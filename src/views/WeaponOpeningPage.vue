<script setup>
import {onBeforeMount, ref} from "vue";
import {useActionsStore} from "@/stores";
import ScratchEffect from "@/components/utilities/ScratchEffect.vue";
import Weapon from "@/components/utilities/cards/weapons/Weapon.vue";

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
  </div>
</template>

<style scoped>

</style>