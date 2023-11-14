<template>
    <div :style="{ width: `${size}px`, height: `${size}px` }" class="spinwheel-container shadow-black">
        <svg :width="size" :height="size" class="circle-svg" style="overflow: visible;">
            <!-- Cercle complet en arrière-plan -->
            <circle :cx="center" :cy="center" :r="radius" stroke="hsla(0, 0%, 0%, 0.5)" stroke-width="24" fill="none"/>
            <!-- Arc de cercle pour le pourcentage -->
            <path v-if="percentage > 0" :d="arcPath" fill="none" stroke="darkred" stroke-width="20" stroke-linecap="round"
                  :style="{ transform: `rotate(${rotationAngle}deg)` }" class="inner_circle"/>
            <!-- Flèche/Indicateur -->
            <polygon :points="`${center},10 ${center + 10},30 ${center - 10},30`" fill="white" class="shadow-white"/>
        </svg>
        <div class="percentage">
            <span class="result shadow-white">{{ percentage.toFixed(2) }}%</span>
            <span>d'etre + charismatique</span>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        percentage: {
            type: Number,
            default: 0
        },
        animate: {
            type: Boolean,
            default: false
        },
        result: {
            type: Number,
            default: 0
        },
        size: {
            type: Number,
            default: 200
        }
    },
    data() {
        return {
            rotationAngle: 0
        };
    },
    computed: {
        center() {
            return this.size / 2;
        },
        radius() {
            return this.center - 10; // On enlève la moitié de la largeur du trait pour le positionnement
        },
        arcPath() {
            const endAngle = ((this.percentage === 100 ? 99 : this.percentage) / 100) * 360;
            const largeArcFlag = this.percentage > 50 ? 1 : 0;
            const endX = this.center + this.radius * Math.sin(endAngle * Math.PI / 180);
            const endY = this.center - this.radius * Math.cos(endAngle * Math.PI / 180);

            return `M ${this.center} 10 A ${this.radius} ${this.radius} 0 ${largeArcFlag} 1 ${endX} ${endY}`;
        }
    },
    watch: {
        animate(newVal) {
            if (newVal) {
                this.startAnimation();
            }
        }
    },
    methods: {
        startAnimation() {
            let endRotation = 360 * 5; // 5 tours complets

            // le dernier tour est défini sur le resultats
            if (this.result > 0)
                endRotation += 360 * (1 - this.result / 100);

            this.rotationAngle = endRotation;
        }
    }
};
</script>

<style scoped>
.spinwheel-container {
    position: relative;
    font-size: 20px;
}
.percentage {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 0.8em;
    font-weight: bold;
    font-family: "Big John", sans-serif;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
}

.percentage .result {
    font-size: 2.4em;
    margin-bottom: 10px;
}

.inner_circle {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    border: 5px solid #ccc;
    position: relative;
    transition: transform 5s;
    transform-origin: 50% 50%;
}
</style>
