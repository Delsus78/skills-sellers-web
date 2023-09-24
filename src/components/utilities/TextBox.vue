<template>
    <div>
        <p :class="{ 'title': true, 'errored': isErrored }">{{ title }}</p>
        <div :class="{ 'text-box': true, 'errored': isErrored }">
            <input :type="inputType" v-model="value" :placeholder="placeholder" @input="handleInput" />
        </div>
    </div>
</template>

<script setup>
import {ref, watch} from 'vue';

const { placeholder, title, isErrored, modelValue, isNumberOnly } = defineProps({
    placeholder: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: false,
        default: ''
    },
    isErrored: {
        type: Boolean,
        required: false,
        default: false
    },
    modelValue: {
        type: [String, Number],
        required: false,
        default: ''
    },
    inputType: {
        type: String,
        required: false,
        default: 'text'
    },
    isNumberOnly: {
        type: Boolean,
        required: false,
        default: false
    }
});

const emit = defineEmits(["update:modelValue"]);
const value = ref(modelValue);

watch(value, (newValue) => {
    emit('update:modelValue', newValue);
});

const handleInput = (event) => {
    if (isNumberOnly && /[^0-9]/.test(event.target.value)) {
        event.target.value = event.target.value.replace(/[^0-9]/g, '');
        value.value = event.target.value;
    }
};
</script>

<style scoped>
.text-box {
    position: relative;
    margin-bottom: 1rem;
    cursor: pointer;
}

.text-box.errored {
    border-color: var(--vt-c-red-2);
}

.title {
    margin-bottom: 0.5rem;
    font-size: 1.5rem;
    font-weight: bold;
}

input {
    padding: 0.5rem 1rem;
    backdrop-filter: blur(2px);
    background: rgba(0, 0, 0, 0.65);
    border-radius: 10px;
    color: var(--color-text);
    font-size: 2rem;
    width: 100%;
    appearance: none;
    cursor: pointer;
    outline: none;
    transition: border-color 0.3s, box-shadow 0.3s;
}


input {
    padding: 0.5rem 1rem;
    color: var(--color-text);
    border: 0;
    font-size: 2rem;
    width: 100%;
}

input:focus {
    border-color: var(--vt-c-green-2);
    box-shadow: 0 0 0 3px rgba(0, 128, 0, 0.3); /* Cette couleur est juste un exemple. */
}
input::placeholder {
    font-size: 2rem;
    color: rgba(100, 96, 96, 0.56); /* Ceci est un exemple de couleur grise semi-transparente. */
}
</style>
