<template>
    <div v-if="cards.length" class="cards">
         <Card v-for="card in cards"
               :key="card.id"
               :id="card.id"
               :name="card.name"
               :description="card.description"
               :image-url="card.imageUrl"
               :competences="card.competences"
              rarity="legendaire"/>
        <!--
        <Card id="0"
              name="FlofloPedo"
              description="FlofloPedo est un pédophile qui aime les enfants"
              image-url="https://media.discordapp.net/attachments/624367292536324096/1155175132797607956/Snapchat-1122007594.png?width=337&height=730"
              rarity="legendaire"/>
        <Card id="0"
              name="MoutMout"
              description="MoutMout est un mouton qui fait des moutons"
              image-url="https://cdn.discordapp.com/attachments/768463505900306472/1155175013230583819/received_614908190738377.jpg"
              rarity="epic"/>
        <Card id="0"
              name="Loucie"
              description="Loucie est une meuf trop cool, son chien est trop mignon"
              :image-url="loucie"
              rarity="commun"/>
        <Card id="0"
              name="Floflo Pedo le 2"
              description="FlofloPedo est un pédophile qui aime les enfants, mais il est plus beau que le premier"
              image-url="https://media.discordapp.net/attachments/692851757117734922/1155175607735435294/Snapchat-1443384286.jpg?width=347&height=730"
              rarity="legendaire"/>
        <Card id="0"
              name="Anthony l'alcolique"
              description="Anthony est un alcolique qui aime l'alcool"
              image-url="https://media.discordapp.net/attachments/805417809432674314/1027573017334780014/Snapchat-1478990681.jpg?width=350&height=730"
              rarity="commun"/>
        <Card id="0"
              name="Florian Nutela"
              description="Florian est un mec qui aime le nutela, il est trop cool"
              image-url="https://media.discordapp.net/attachments/805417809432674314/1009547651441754252/unknown.png?width=380&height=730"
              rarity="legendaire"/>
        <Card id="0"
              name="Jojo Kidnapping"
              description="Jojo est un mec qui aime se faire kidnapper"
              image-url="https://media.discordapp.net/attachments/692851757117734922/1155176596123168878/Snapchat-626015406.jpg?width=547&height=730"
              rarity="epic"/>
        <Card id="0"
              name="Floflo Le Pécheur"
              description="Floflo est un mec qui aime la pêche"
              image-url="https://media.discordapp.net/attachments/624367292536324096/1155177466118283295/20220430_163506.jpg?width=547&height=730"
              rarity="epic"/>
        <Card id="0"
              name="Bastos PLS"
              description="Bastos est un mec qui aime faire des PLS"
              image-url="https://cdn.discordapp.com/attachments/805417809432674314/1155178105615437985/image.png"
              rarity="legendaire"/>
        <Card id="0"
              name="Marting sur le vélo"
              description="Martin est un mec qui aime faire du vélo"
              image-url="https://media.discordapp.net/attachments/805417809432674314/1155180672835657839/image.png?width=581&height=730"
              rarity="legendaire"/>
        <Card id="0"
              name="Bébé Matéo"
              description="Matéo est un bébé, il est trop mignon"
              image-url="https://cdn.discordapp.com/attachments/805417809432674314/1155183234737516574/image.png"
              rarity="legendaire"/>
        <Card id="0"
              name="LOUCIE 2"
              description="Loucie LE RETOUR AAAAAAAAAAAAAA !"
              image-url="https://cdn.discordapp.com/attachments/890205621423595561/1155211011989712987/SPOILER_image0.png"
              rarity="legendaire"/>
        <Card id="0"
              name="Bébou Gala"
              description="Gala tout bébé"
              image-url="https://cdn.discordapp.com/attachments/805417809432674314/1155213356672749699/image.png"
              rarity="legendaire"/>
        <Card id="0"
              name="DRANDRAN"
              description="Audran Chokbar de bz"
              image-url="https://cdn.discordapp.com/attachments/805417809432674314/1155238237481226240/image.png"
              rarity="legendaire"/>
        <Card id="0"
              name="ANTHO CHEZ LES GOLOIS"
              description="Anthony est un mec qui aime les gaulois"
              image-url="https://cdn.discordapp.com/attachments/890584705412530226/1155238170200391751/1695500620144.jpg"
              rarity="legendaire"/>

    -->
    </div>
    <div v-if="cards.loading">
        <p class="huge-text">Chargement des cartes...</p>
    </div>
    <div v-if="cards.error">
        <p class="huge-text">Erreur lors du chargement des cartes</p>
    </div>

</template>
<script setup>
import Card from "@/components/utilities/Card.vue";
import { useRoute } from 'vue-router';
import { useCardsStore } from "@/stores";
import {storeToRefs} from "pinia";

const route = useRoute();
const userId = route.params.id;

const cardsStore = useCardsStore();
const { cards } = storeToRefs(cardsStore);
cardsStore.getAllCardsFromUser(userId);

</script>
<style scoped>
.cards {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
}

</style>