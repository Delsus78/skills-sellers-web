<script setup>
import { faPaperPlane as sendIcon } from "@fortawesome/free-solid-svg-icons";
import {onMounted, ref, onBeforeUpdate, nextTick} from "vue";
import { useChatStore } from "@/stores";
import {storeToRefs} from "pinia";

const chatStore = useChatStore();
const { messages, isConnected, error } = storeToRefs(chatStore);

const messageToSend = ref("");

// Initialiser la connexion SignalR lorsque le composant est monté
onMounted(() => {
    chatStore.initConnection();
});

const messageContainer = ref(null);

onBeforeUpdate(() => {
    if (messageContainer.value) {
        const shouldScroll = messageContainer.value.scrollTop + messageContainer.value.clientHeight === messageContainer.value.scrollHeight;
        if (shouldScroll) {
            nextTick(() => {
                messageContainer.value.scrollTop = messageContainer.value.scrollHeight;
            });
        }
    }
});

const handleSend = () => {
    const msgToSend = messageToSend.value.trim();
    if (msgToSend) {
        chatStore.sendMessage(msgToSend); // Remplacez "YourUsername" par le nom d'utilisateur actuel ou une autre logique appropriée
        messageToSend.value = "";
    }
};

</script>

<template>
    <div class="GlobalChat bg-dark-blur">
        <div class="header">
            <h2 class="DivTitle">GLOBAL CHAT</h2>
        </div>
        <div class="messages" ref="messageContainer">
            <div v-for="msg in messages" :key="msg.message" class="message">
                <strong class="message-user">{{ msg.user }}</strong>
                <span class="message-text">{{ msg.message }}</span>
            </div>
        </div>

        <div v-if="!isConnected && !error" class="ConnectingToChat">
            <span>Connexion au chat...</span>
        </div>
        <div v-else-if="error" class="ConnectingToChat text-danger">
            <span>{{ error }}</span>
        </div>
        <div v-else class="TextBoxDiv">
            <input class="TextBox" v-model="messageToSend" placeholder="Un truc à dire ?"/>
            <svg-icon class="shadow-white" :fa-icon="sendIcon" :size="36" @click="handleSend"/>
        </div>
    </div>
</template>

<style scoped>
.GlobalChat {
    display: grid;
    grid-template-rows: 2fr 1fr 20fr 3fr;
    grid-template-areas: "title" "information" "messages" "textbox";
    padding: 1rem;
    margin: 3rem;
    border-radius: 1rem;
    box-shadow: 0 0 1rem 0.5rem rgba(0, 0, 0, 0.2);
    backdrop-filter: blur(5px);  /* Effet de flou sur l'arrière-plan */
}

.GlobalChat .header {
    grid-area: title;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.GlobalChat .messages {
    grid-area: messages;
    background: rgba(0, 0, 0, 0.48);
    border-radius: 1rem;
    box-shadow: inset 0 0 1rem 0.5rem black;
    padding: 1rem;
    overflow-y: auto; /* Permet le défilement vertical */
}


.GlobalChat .TextBoxDiv {
    grid-area: textbox;
    display: flex;
    justify-content: space-between;
}

.GlobalChat .TextBoxDiv .TextBox {
    backdrop-filter: blur(2px);
    background: rgba(0, 0, 0, 0.65);
    border-radius: 10px;
    outline: none;
    transition: border-color 0.3s, box-shadow 0.3s;
    width: 90%;
    padding: 0.5rem 1rem;
    color: var(--color-text);
    border: 0;
    font-size: 2rem;
    margin: 1rem;
}

.GlobalChat .TextBoxDiv .TextBox:focus {
    border-color: var(--vt-c-green-2);
    box-shadow: 0 0 0 3px rgba(0, 128, 0, 0.3); /* Cette couleur est juste un exemple. */
}
.GlobalChat .TextBoxDiv .TextBox::placeholder {
    font-size: 2rem;
    color: rgba(100, 96, 96, 0.56); /* Ceci est un exemple de couleur grise semi-transparente. */
}

.GlobalChat .TextBoxDiv svg {
    margin: 1.5rem 1rem;
}

.GlobalChat .TextBoxDiv svg:hover {
    filter: drop-shadow(0 0 0.75rem white);
}

.GlobalChat .ConnectingToChat {
    grid-area: textbox;
    display: flex;
    justify-content: center;
    align-items: center;
}

.message {
    display: flex;
    align-items: center;
    padding: 0.5rem 0;
}

.message-user {
    font-weight: bold;
    margin-right: 1rem;
}

.message-text {
    flex: 1;
}
</style>