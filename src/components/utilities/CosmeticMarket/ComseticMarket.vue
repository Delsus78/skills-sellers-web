<script setup>

import {faRotateRight as homeIcon} from "@fortawesome/free-solid-svg-icons";
import Cosmetic from "@/components/utilities/CosmeticMarket/Comsetic.vue";
import {useCosmeticStore} from "@/stores";
import {onBeforeMount, onMounted} from "vue";
import {
    faCoins as orIcon,
} from "@fortawesome/free-solid-svg-icons";
import {storeToRefs} from "pinia";
import {router} from "@/helpers";
const cosmeticStore = useCosmeticStore();
const { shop } = storeToRefs(cosmeticStore);

onBeforeMount(() => {
    loadCosmeticShop();
});

const reload = () => {
    loadCosmeticShop();
};

const loadCosmeticShop = () => {
    cosmeticStore.getShopCosmetics();
};

</script>

<template>
    <div class="CosmeticMarket bg-dark-blur">
        <div class="header-market">
            <h2 class="DivTitle">THE COSMITIC MARKET</h2>
            <svg-icon class="shadow-white" @click="reload" :fa-icon="homeIcon" :size="24"/>
        </div>
        <div class="content" v-if="shop.length">
            <div v-for="cosmetic in shop" :key="cosmetic.id" class="cosmeticItem"
                @click="router.push({
                path: '/cosmetic',
                query: {cosmeticId: cosmetic.id, isbuyingPlacement: true}
                })">
                <Cosmetic :cosmetic-id="cosmetic.id" class="cosmeticImage"/>
                <strong>{{cosmetic.name}}</strong>
                <strong class="or">{{cosmetic.price}} <svg-icon :fa-icon="orIcon" class="or" :size="14"/></strong>
                <span :class="{'bg-colored': true,
                    'legendaire': cosmetic.rarity === 3,
                    'epic': cosmetic.rarity === 2,
                    'commun': cosmetic.rarity === 1
                }"></span>
            </div>
        </div>
    </div>
</template>
<style scoped>
.CosmeticMarket {
    display: grid;
    grid-template-rows: 2fr 8fr;
    grid-template-areas: "title" "content";
    padding: 1rem;
    margin: 3rem;
    border-radius: 1rem;
    box-shadow: 0 0 1rem 0.5rem rgba(0, 0, 0, 0.2);
    backdrop-filter: blur(5px);
}

.header-market {
    grid-area: title;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.header-market svg {
    position: absolute;
    top: 3.2rem;
    right: 3rem;
}

.header-scoreboard svg:hover {
    cursor: pointer;
}

.content {
    grid-area: content;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
    border-radius: 1rem;
    backdrop-filter: blur(5px);
}

.cosmeticItem {
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
    margin: 0.2rem;
    border-radius: 1rem;
    padding: 1rem;
    box-shadow: 0 0 1rem 0.5rem rgba(0, 0, 0, 0.2);
    backdrop-filter: blur(5px);
    transition: all 0.2s ease-in-out;
}

.cosmeticItem:hover {
    transform: scale(1.1);
    cursor: pointer;
}

.cosmeticImage {
    width: 5rem;
    height: 5rem;
    margin: 1rem;
    filter: drop-shadow(0 0 0.45rem black);
}

.bg-colored {
    z-index: -100;
}
</style>