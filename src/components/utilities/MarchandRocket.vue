<script setup>
import {onBeforeMount, ref} from "vue";
import randomSeed from "random-seed";
const color = ref(null);
const secondColor = ref(null);
const thirdColor = ref(null);

const { seed } = defineProps({
    seed: {
        type: String,
        required: true,
    }
});

onBeforeMount(() => {
    let rand = randomSeed.create(seed);
    function generateColor(rand,
                           hue = rand.intBetween(0,360),
                           saturation = rand.intBetween(70, 100),
                           lightness = rand.intBetween(50, 70)) {
        return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
    }
    color.value = generateColor(rand);
    secondColor.value = generateColor(rand);
    thirdColor.value = generateColor(rand);

})
</script>

<template>
    <svg :style="'filter: drop-shadow(0 0 20px ' + color + ');'"
     id="Layer_1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 381.019 381.019" xml:space="preserve">
      <g>
	      <polygon :fill="color" points="162.25,287.362 145.55,318.202 62.11,234.762 92.95,218.062 	"/>
        <path style="fill:#76CDCE;" d="M250.693,172.74c-1.796,0.269-3.642,0.403-5.523,0.403c-20.987,0-38-17.013-38-38s17.013-38,38-38
          c1.881,0,3.726,0.134,5.523,0.403c18.371,2.673,32.477,18.491,32.477,37.597S269.063,170.067,250.693,172.74z"/>
        <polygon :fill="color" points="163.22,109.612 73.86,198.972 18.98,188.802 88.54,119.242 	"/>
        <polygon :fill="color" points="270.71,217.092 261.07,291.772 191.51,361.342 181.34,306.452 	"/>
        <path :fill="thirdColor" d="M320.56,59.752c14.27,14.26,32.44,22.19,51.08,23.81c-9.34,30.47-26.03,58.62-49.14,81.73
          l-51.79,51.8l-89.37,89.36l-19.09-19.09l-69.3-69.3l-19.09-19.09l89.36-89.36h0.01l51.79-51.8c23.12-23.12,51.27-39.81,81.74-49.14
          C298.37,27.312,306.3,45.482,320.56,59.752z M272.04,162.012c14.84-14.84,14.84-38.9,0-53.74s-38.9-14.84-53.74,0
          s-14.84,38.9,0,53.74C233.14,176.852,257.2,176.852,272.04,162.012z"/>
        <path :fill="color" d="M378.82,1.492c3.45,27.92,0.86,55.86-7.18,82.07c-18.64-1.62-36.81-9.55-51.08-23.81
		      c-14.26-14.27-22.19-32.44-23.8-51.08C322.98,0.632,350.91-1.958,378.82,1.492z"/>
        <rect x="45.065" y="276.162" transform="matrix(-0.7071 -0.7071 0.7071 -0.7071 -143.0177 599.0829)" :fill="secondColor" width="15" height="105.999"/>
        <rect x="71.285" y="299.035" transform="matrix(-0.7071 -0.7071 0.7071 -0.7071 -108.7171 642.8744)" :fill="secondColor" width="15" height="89.837"/>
        <rect x="30.272" y="258.023" transform="matrix(-0.7071 -0.7071 0.7071 -0.7071 -149.7311 543.8623)" :fill="secondColor" width="15" height="89.837"/>
        <g>
          <path style="fill:#96E0DE;" d="M250.693,172.74V97.546c18.371,2.673,32.477,18.491,32.477,37.597S269.063,170.067,250.693,172.74z"/>
        </g>
      </g>
    </svg>
</template>

<style scoped>
</style>