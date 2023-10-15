<script setup>
import {
    faClose as closeIcon,
    faBurger as foodIcon,
    faCoins as moneyIcon
} from "@fortawesome/free-solid-svg-icons";



const emit = defineEmits(["close",'buy']);

const { offer } = defineProps({
    offer: {
        type: Object,
        required: true
    }
});

</script>

<template>
    <div class="overlay"></div>
    <div class="bonnBouff">
        <h2 class="DivTitle">M. BONNBOUFF</h2>
        <img class="villageois"
                src="https://static.wikia.nocookie.net/minecraft_fr_gamepedia/images/3/3b/B%C3%A9b%C3%A9_villageois_Plaines_BE.png" alt="villageois"/>
        <div class="content bg-dark-blur">
            <div class="close">
                <svg-icon :fa-icon="closeIcon" :size="70" @click="emit('close');"/>
            </div>
            <div class="offer_content">
                <div class="offer_title">
                    <h1>
                        Offre du jour :
                        <strong class="red shadow-black">{{ offer.foodName }}</strong>
                    </h1>
                </div>
                <div class="col col-1">
                    <h2>Pour</h2>
                    <div class="row-2 or">
                        <strong class="value">{{ offer.price }}</strong>
                        <svg-icon class="shadow-black" :fa-icon="moneyIcon" :size="50"/>
                    </div>
                </div>
                <div class="col col-2">
                    <h2>Vous obtenez</h2>
                    <div class="row-2 food">
                        <strong class="value">{{ offer.food }}</strong>
                        <svg-icon class="shadow-black" :fa-icon="foodIcon" :size="50"/>
                    </div>
                </div>
            </div>
            <div class="trade-btn">
                <button @click="emit('buy');">ECHANGER</button>
            </div>
        </div>
    </div>
</template>
<style scoped>
.overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    transition: background 0.5s;
    z-index: 150;
    background: rgba(0, 0, 0, 0.2);
    backdrop-filter: blur(5px);
    pointer-events: unset;
}

.bonnBouff {
    position: fixed;
    display: grid;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 200;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: 3rem 20rem;
    grid-gap: 1rem;
    justify-items: center;
    align-items: center;
    padding: 4rem;
    pointer-events: unset;
}

.bonnBouff .DivTitle {
    text-shadow: black 0 0 1rem;
    animation: colorChange 6s linear infinite;
}

.villageois {
    z-index: 200;
    pointer-events: none;
    grid-row: 1;
    grid-column: 2;
    filter: drop-shadow(0 0 1rem rgba(210, 188, 188, 0.5));
}

.content {
    position: relative;
    z-index: 200;
    grid-row: 2;
    grid-column: 1 / 3;
    width: 100%;
    height: 100%;
    max-height: 65rem;
    pointer-events: unset;
    padding: 2rem;
    margin: 1rem;
    border-radius: 1rem;
    box-shadow: 0 0 1rem 0.5rem rgba(0, 0, 0, 0.5);
    border: 1px solid yellow;
    overflow: hidden;
}

.offer_content {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-row-gap: 3rem;
}

.offer_content .offer_title {
    grid-column: 1 / 3;
}

.offer_content h2 {
    font-size:1.3rem;
    color: aliceblue;
    font-family: "Big John", sans-serif;
}

.offer_content .value {
    font-size: 2rem;
    font-family: "Big John", sans-serif;
    margin-right: 1rem;
    text-shadow: black 0 0 0.5rem;
}

.or {
    color: yellow;
}

.food {
    color: yellowgreen;
}

.col {
    display: grid;
    grid-template-rows: 1fr 1fr;
    grid-template-columns: 1fr;
    grid-gap: 1rem;
    justify-items: center;
    align-items: center;
}

.col-1 {
    grid-row: 2;
    grid-column: 1;
}

.col-2 {
    grid-row: 2;
    grid-column: 2;
}

.row-2 {
    grid-row: 2;
    display: flex;
    align-items: center;
    justify-content: center;
}

.trade-btn {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 2rem;
    z-index: 201;
}

.trade-btn button {
    font-size: 1rem;
    font-family: "Big John", sans-serif;
    border-radius: 1rem 1rem 0 0;
    background-color: transparent;
    color: aliceblue;
    border: 1px solid yellow;
    box-shadow: 0 0 1rem 0.5rem rgba(0, 0, 0, 0.5);
    transition: all 0.2s ease-in-out;
}

.trade-btn button:hover {
    transform: scale(1.1);
    background-color: rgba(0, 0, 0, 0.5);
    color: yellow;
    box-shadow: 0 0 1rem 0.5rem rgba(0, 0, 0, 0.5);
}

.close {
    position: absolute;
    top: 1rem;
    right: 1rem;
    cursor: pointer;
    z-index: 201;
    color: red;
    transition: all 0.2s ease-in-out;
}

.close:hover {
    transform: scale(1.2);
    color: var(--vt-c-red-2);
    filter: drop-shadow(0 0 4px var(--vt-c-red-2));
}
</style>