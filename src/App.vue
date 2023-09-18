<script setup>
import Connexion from "@/components/Connexion.vue";
import HeaderComp from "@/components/utilities/HeaderComp.vue";
import background from "@/components/utilities/Background.vue";
import RandomPlanet from "@/components/utilities/RandomPlanet.vue";
</script>
<template>
  <background />
  <header>
    <HeaderComp />
  </header>
  <main>
      <Connexion />
  </main>
</template>

<style scoped>
header {
    grid-column: 1 / 4;
    grid-row: 1;
    pointer-events: none;
}

main {
    grid-column: 2;
    grid-row: 2;
}
</style>
