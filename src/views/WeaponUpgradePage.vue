<script setup>
import WeaponList from "@/components/utilities/cards/weapons/WeaponList.vue";
import {ref} from "vue";
import {useCardsStore} from "@/stores";

const cardsStore = useCardsStore();

const selectedWeapon = ref(null);
const error = ref('');

function clickOnWeapon(weapon) {
    selectedWeapon.value = weapon;
}

async function validate() {
    if (selectedWeapon.value) {
        const rep = await cardsStore.postUpgradeWeapon(selectedWeapon.value.id);

        if (rep.error) {
            error.value = rep.error;
        }
    }
}

</script>
<template>
  <div class="container">
      <div class="header-weapons">
          <h1 class="DivTitle">Choisissez une arme a ameliorer</h1>
          <h3 class="red discret">{{ error === "" ? ' ' : error }}</h3>
      </div>
      <div class="weaponlist">
          <WeaponList class="list"
                      withCustomClick noFilters noRemoveBtn noDesact noLeaveBtn
                      @clickOnWeapon="clickOnWeapon" />
      </div>
      <div class="footer-weapons">
          <button class="validateOpening swipe-overlay-out" @click="validate">Valider</button>
      </div>
  </div>
</template>

<style scoped>
.container {
    display: grid;
    justify-items: center;
}

.header-weapons {
    display: flex;
    justify-content: space-between;
    flex-direction: column;
    align-items: center;
    width: 100%;
    margin: 1rem;
}

.list {
    width: 100%;
    height: 100%;
    max-width: 50rem;
    max-height: 40rem;
    box-shadow: 0 0 1rem var(--vt-c-green-1);
    background-color: var(--vt-c-green-1);
}

.footer-weapons {
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 1rem;
}
</style>