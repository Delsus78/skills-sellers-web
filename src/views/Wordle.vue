<script setup>
import {useGamesStore, useMainStore} from "@/stores";
import {storeToRefs} from "pinia";
import {onMounted, onUnmounted, ref, watch} from "vue";
import {faShareFromSquare as clipboardIcon} from "@fortawesome/free-solid-svg-icons";
import InfoBulle from "@/components/utilities/InfoBulle.vue";

const mainStore = useMainStore();
const gamesStore = useGamesStore();

const { wordleResponse, wordle } = storeToRefs(gamesStore);
gamesStore.getWordle();

const word = ref("");
const keys =  ['A', 'Z', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P',
               'Q', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'M',
               'W', 'X', 'C', 'V', 'B', 'N', '.', '-', '+', ',',
               '0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
const showKeyboard = true;

const handleKeydown = (event) => {
    if (wordle.value.words.length === 5 || wordle.value.isWin) return;

    // setting up allowed keys
    const allowedKeys = [...keys, 'Enter', 'Backspace'];
    for (let i = 97; i <= 122; i++) {
        allowedKeys.push(String.fromCharCode(i)); // Ajouter les lettres a-z
    }

    // action on keys
    if (allowedKeys.includes(event.key)) {

        switch (event.key) {
            case "Enter":
                validateWord();
                break;
            case "Backspace":
                word.value = word.value.slice(0, -1);
                break;
            default:
                // si le mot est déjà complet, ne pas ajouter de lettre
                if (word.value.length === wordle.value.nbLetters) {
                    return;
                }

                // si la touche est une lettre minuscule, la mettre en majuscule
                if (event.key.charCodeAt(0) >= 97 && event.key.charCodeAt(0) <= 122) {
                    word.value += event.key.toUpperCase();
                } else {
                    word.value += event.key;
                }
                break;
        }
    }
};

const onKeyPress = (key) => {
    handleKeydown({key: key});
};

const validateWord = () => {
    gamesStore.validateWordForWordleGame("WORDLE",word.value);
}

const exportWordle = () => {
    let result = "";
    // export the wordle color of each case as emoji to clipboard
    for (let i = 0; i < wordle.value.words.length; i++) {
        const word = wordle.value.words[i];
        for (let j = 0; j < word.length; j++) {
            const letterStatus = word[j];
            let emoji = "";
            switch (letterStatus.status) {
                case -1:
                    emoji = "🟥";
                    break;
                case 0:
                    emoji = "🟨";
                    break;
                case 1:
                    emoji = "🟩";
                    break;
            }
            result += emoji;
        }
        result += "\n";
    }
    navigator.clipboard.writeText(result);
}

onMounted(() => {
    window.addEventListener('keydown', handleKeydown);
});

onUnmounted(() => {
    window.removeEventListener('keydown', handleKeydown);
});

mainStore.changeBackgroundColor("#d30550");

watch(wordleResponse, () => {
    word.value = "";
});
</script>
<template>
    <div v-if="wordle.loading">
        <p class="huge-text">Chargement du Wordle du jour...</p>
    </div>
    <div v-else-if="wordle.error">
        <p class="huge-text red">{{ wordle.error }}</p>
    </div>
    <div v-else class="wordle">

        <div class="wordle_content">
            <div class="titleDiv">
                <div class="title">Desmond O. - What the ?</div>
                <div class="subTitle">bah un Wordle quoi</div>
            </div>
            <div class="form_content">
                <info-bulle>
                    <p v-for="(r1, r2) in wordle.regles">
                        {{ r1 }}  {{ r2 }}
                    </p>
                </info-bulle>
                <!--Display letters of the word in a grid with the number of letters-->
                <div class="wordle_form_letters">
                    <div class="wordle_form_letters_grid">
                        <div v-for="wordDone in wordle.words" :key="wordDone" class="wordleRow"
                             :style="`grid-template-columns: repeat(${wordle.nbLetters}, 4rem);`">
                            <div v-for="letterStatus in wordDone" :key="letterStatus" class="letter-box"
                                 :class="{
                                  'correct': letterStatus.status === 1,
                                  'present': letterStatus.status === 0,
                                  'absent': letterStatus.status === -1}">
                                <div class="letter">
                                    {{ letterStatus.letter }}
                                </div>
                            </div>
                        </div>
                        <div class="wordleRow" :style="`grid-template-columns: repeat(${wordle.nbLetters}, 4rem);`"
                             v-if="!wordle?.isWin  && !(wordle?.words?.length === 5)">
                            <div v-for="letter in wordle.nbLetters" :key="letter" class="letter-box">
                                <div class="letter">
                                    {{ word[letter-1] }}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="error shadow-white">
                    {{ wordleResponse.error}}
                </div>
                <div v-if="wordle?.words?.length === 5 || wordle.isWin" class="shadow-white">
                    <div v-if="wordle.isWin" class="win">
                        GAGNE
                    </div>
                    <div v-else class="loose">
                        PERDU
                    </div>
                </div>
                <div class="virtual-keyboard" v-if="showKeyboard">
                    <button v-for="key in keys" :key="key" @click="onKeyPress(key)">
                        {{ key }}
                    </button>
                    <button @click="onKeyPress('Backspace')">
                        {{ '⌫' }}
                    </button>
                </div>
                <div class="wordle_form_input">
                    <button @click="validateWord" class="validate swipe-overlay-out">Valider</button>
                    <button @click="exportWordle" class="clipboard_button shadow-white"><svg-icon :fa-icon="clipboardIcon" :size="40" /></button>
                </div>
            </div>
        </div>
    </div>
</template>
<style scoped>
.wordle_content {
    margin-top: 5rem;
}
.title {
    display: flex;
    justify-content: center;
    align-items: center;
    font-weight: normal;
    font-size: 4.5em;
    text-align: center;
    font-family: "Big John", sans-serif;

    /* Fallback: Set a background color. */
    background-color: red;

    /* Create the gradient. */
    background-image: linear-gradient(45deg, #fc1b5c, #960019);

    /* Set the background size and repeat properties. */
    background-size: 100%;
    background-repeat: repeat;

    /* Use the text as a mask for the background. */
    /* This will show the gradient as a text color rather than element bg. */
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    -moz-background-clip: text;
    -moz-text-fill-color: transparent;
}

.subTitle {
    display: flex;
    justify-content: center;
    align-items: flex-end;
    font-weight: normal;
    font-size: 1.5em;
    text-align: center;
    font-family: "Big John", sans-serif;
    margin-bottom: 1rem;
}

.form_content {
    z-index: 100;
    border-radius: 1rem;
    padding: 1rem;
    background:
            radial-gradient(
                    ellipse farthest-corner at right bottom,
                    rgba(215, 130, 130, 0.5) 0%, /* #d78282 avec 80% d'opacité */
                    rgba(199, 65, 65, 0.5) 8%, /* #c74141 avec 80% d'opacité */
                    rgba(253, 50, 50, 0.5) 30%, /* #fd3232 avec 80% d'opacité */
                    rgba(241, 25, 25, 0.5) 40% /* #f11919 avec 80% d'opacité */
            ),
            radial-gradient(
                    ellipse farthest-corner at left top,
                    rgba(250, 214, 214, 0.5) 0%, /* #fad6d6 avec 80% d'opacité */
                    rgba(248, 96, 96, 0.5) 8%, /* #f86060 avec 80% d'opacité */
                    rgba(250, 30, 30, 0.5) 25%, /* #fa1e1e avec 80% d'opacité */
                    rgba(114, 23, 23, 0.5) 62.5%, /* #721717 avec 80% d'opacité */
                    rgba(93, 74, 31, 0.5) 100% /* #5d4a1f avec 80% d'opacité */
            );
    box-shadow: 0 0 1rem 0 rgba(0, 0, 0, 0.9);
    backdrop-filter: blur(5px);
}
.wordle_form_input {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 1rem;
}

.validate {
    transition: all 0.2s ease-in-out;
    z-index: 100;
    color: var(--vt-c-black) !important;
    border-color: var(--vt-c-black) !important;
    pointer-events: all;
    @media (max-width: 1023px) {
        width: 50%;
    }
}

.validate:hover {
    transform: scale(1.2);
    color: var(--vt-c-black) !important;
    filter: drop-shadow(0 0 4px var(--vt-c-black));
}

.clipboard_button {
    background-color: transparent;
    border: transparent;
    cursor: pointer;
    transition: all 0.2s ease-in-out;
    pointer-events: all;
}

.clipboard_button:hover {
    transform: scale(1.1);
    color: whitesmoke;
}

.clipboard_button:focus {
    animation: click-animation 0.4s ease;
}

@keyframes click-animation {
    0% {
        transform: scale(1);
    }
    50% {
        transform: scale(0.8);
    }
    100% {
        transform: scale(1);
    }
}

.wordle_form_letters_grid {
    display: grid;
    grid-template-rows: repeat(5, 4rem);
    grid-gap: 1rem;
}

.wordle_form_letters {
    display: flex;
    justify-content: center;
}

.wordleRow {
    display: grid;
    grid-gap: 1rem;
}

.letter-box {
    display: grid;
    align-items: center;
    border-radius: 0.5rem;
    font-size: 2em;
    justify-items: center;
    background-color: #ffffff;
    border: 2px solid #3d3d3d;
}

.correct {
    background-color: #00ff00;
}

.present {
    background-color: #ffff00;
}

.absent {
    background-color: #ff0000;
}

.letter {
    font-weight: normal;
    font-family: "Big John", sans-serif;
    color: black;
    text-transform: capitalize;
}

.error {
    font-size: 1.4em;
    text-align: center;
    font-family: 'Ubuntu', sans-serif;
    margin-bottom: 1rem;
    color: #000000;
}

.win {
    font-size: 4em;
    text-align: center;
    font-family: 'Big John', sans-serif;
    margin-bottom: 1rem;
    color: #edff00;
}

.loose {
    font-size: 4em;
    text-align: center;
    font-family: 'Big John', sans-serif;
    margin-bottom: 1rem;
    color: #000000;
}

.virtual-keyboard {
    display: grid;
    grid-template-columns: repeat(10, 1fr);
    gap: 10px;
    padding: 10px;

}

.virtual-keyboard button {
    padding: 5px;
    font-size: 1.4rem;
}
</style>