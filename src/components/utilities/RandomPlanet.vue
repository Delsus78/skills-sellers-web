<template>
    <div class="random-planet">
        <svg
            ref="svgWrapper"
            xmlns="http://www.w3.org/2000/svg"
            :width="width"
            :height="height">

            <!-- This element will store our graphics -->
            <g class="svg-planet-graphics">
            </g>
        </svg>
    </div>
</template>
<script setup>
import {onMounted, ref} from "vue";
import randomSeed from "random-seed";
const svgWrapper = ref(null);

const { modelValue, width, height, planetId } = defineProps({
    modelValue: {
        type: String,
        default: "0"
    },
    width: {
        type: Number,
        default: 800
    },
    height: {
        type: Number,
        default: 850
    },
    planetId: {
        type: Number,
        default: 0
    }
});


onMounted(() => {
    draw(modelValue);
});

// Our draw function is where the ✨ magic ✨ happens
function draw(seed) {
    const starSize = width / 2.5;  // Adjusted to take the full width of the div
    const markup = drawPlanet(starSize, seed);

    svgWrapper.value.innerHTML = markup;
}

function drawPlanet(size, seed) {
    let rand = randomSeed.create(seed);

    const cx =  width/2;
    const cy =  height/2;

    // We'll generate some random values for our turbulence
    const sizeDivisor = rand.intBetween(1, 8);
    const turbulenceType = rand.intBetween(0,1) ? 'fractalNoise' : 'turbulence';
    const baseFrequencyX = rand.floatBetween(0.5, 2) / (size/sizeDivisor);
    const baseFrequencyY = rand.floatBetween(2, 4) / (size/sizeDivisor);
    const numOctaves = rand.intBetween(3, 10);
    const hueColor = rand.intBetween(0,360);
    const color = generateColor(rand, hueColor);
    const seedTurbulence = rand.intBetween(0, 1000);

    // And some random values for our lighting
    const elevation = rand.intBetween(30, 70);
    const surfaceScale = rand.intBetween(5, 10);
    const frontGlowColor = generateColor(rand, hueColor, rand.intBetween(70, 100), rand.intBetween(20, 40));
    const backGlowColor = `hsl(${hueColor}, ${rand.floatBetween(80, 90)}%, ${rand.floatBetween(40, 50)}%)`;
    const blurFilterSize = 300;
    // We'll use those random values to create our filter:

    const defs = `
      <clipPath id="${seed}-${planetId}-shadow-clip-path">
      <circle cx="${cx}" cy="${cy}" r="${size + 2}" />
    </clipPath>
    <radialGradient id="${seed}-${planetId}-shadow">
      <stop offset="0%" stop-color="hsla(0, 0%, 0%, 0)"></stop>
      <stop offset="90%" stop-color="hsla(0, 0%, 0%, 1)"></stop>
    </radialGradient>
    <filter id="${seed}-${planetId}-texture">
      <feTurbulence
        type="${turbulenceType}"
        baseFrequency="${baseFrequencyX} ${baseFrequencyY}"
        seed="${seedTurbulence}"
        numOctaves="${numOctaves}"
      />
      <feDiffuseLighting lighting-color="${color}" surfaceScale="${surfaceScale}">
        <feDistantLight elevation="${elevation}" />
      </feDiffuseLighting>
      <feComposite operator="in" in2="SourceGraphic"/>
    </filter>
    <filter
          id="${seed}-${planetId}-star-secondary-glow"
          filterUnits="userSpaceOnUse"
          x="${width/2 - size * blurFilterSize}"
          y="${height/2 - size * blurFilterSize}"
          height="${size * 2 * blurFilterSize}"
          width="${size * 2 * blurFilterSize}"
        >
          <feGaussianBlur stdDeviation="${size / 5}"/>
        </filter>
    <filter
          id="${seed}-${planetId}-star-glow"
          filterUnits="userSpaceOnUse"
          x="0"
          y="0"
          height="${height}"
          width="${width}"
        >
          <feGaussianBlur stdDeviation="${size / 20}"/>
    </filter>
  `;

    // And apply the filter to our planet:

    const planet = `
    <g
      class="planet"
    >
      <circle
        r="${size}"
        cx="${cx - 1}"
        cy="${cy}"
        fill="#fff"
        class="non-transparent"
      />
      <circle
        r="${size}"
        cx="${cx}"
        cy="${cy}"
        filter="url(#${seed}-${planetId}-texture)"
      />
      <circle r="${size}" cx="${cx}" cy="${cy}" filter="url(#${seed}-${planetId}-star-glow)" fill="${backGlowColor}" opacity="0.7"/ class="star-glow"/>
      <circle cx="${cx - size}" cy="${cy}" r="${size * 2 + 2}"
       fill="url(#${seed}-${planetId}-shadow)" clip-path="url(#${seed}-${planetId}-shadow-clip-path)"/>
       <circle r="${size * 0.74}" cx="${cx}" cy="${cy}" filter="url(#${seed}-${planetId}-star-secondary-glow)" fill="${frontGlowColor}" opacity="0.7" class="inner-glow"/>
    </g>
  `;
    return defs + planet;
}

function generateColor(rand,
                       hue = rand.intBetween(0,360),
                       saturation = rand.intBetween(70, 100),
                       lightness = rand.intBetween(50, 70)) {
    return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
}

</script>
<style scoped>

.random-planet svg * {
    pointer-events: visible;
}

</style>