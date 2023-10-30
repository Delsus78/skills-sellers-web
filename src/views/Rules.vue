<script setup>

import TitleImage from "@/components/icons/TitleImage.vue";
import {onMounted, ref} from "vue";
import Card from "@/components/utilities/Card.vue";
import RandomPlanet from "@/components/utilities/RandomPlanet.vue";
import {
    faAnglesUp as upgradeIcon,
    faBurger as foodIcon,
    faBurger as cuisiIcon, faChartSimple as statsIcon,
    faCoins as moneyIcon,
    faCompass as exploIcon,
    faCubesStacked as creatiumIcon, faDice as gamesIcon,
    faDumbbell as forceIcon,
    faEarthEurope as planetIcon,
    faGift as giftIcon,
    faGraduationCap as intelIcon,
    faPeopleGroup as cardsIcon,
    faStar as chariIcon
} from "@fortawesome/free-solid-svg-icons";
const inLine = ref(false);
const isHovered = ref(false);
const showResourcesDrops = ref(false);
const onResize = () => inLine.value = window.innerWidth > 1023;

onMounted(() => {
    window.addEventListener('resize', onResize)
    onResize()
})

</script>

<template>
    <div class="rules">
        <div class="rulesTitle">
            <TitleImage :in-line="inLine" />
        </div>
        <div class="rulesContainer">
            <div class="rulesCard large">
                <h2></h2>
                <p class="centered shadow-white">
                    Skills Sellers est un jeu de collection de cartes avec un système de <strong>gacha</strong>. Il se base sur un univers dans l’espace où chaque joueur gère ses propres cartes qu’il obtient en explorant des planètes !
                </p>
                <p class="centered shadow-white">
                    Chaque joueur commence avec une carte commune de sa propre collection avec des stats de base 3/3/3/3/3<br/>
                    Ainsi qu'une carte aléatoire gratuite !
                </p>
                <p class="centered colorEffect little">
                    Tous les participants ont déposé leur propre collection de cartes, de 7 à 8 exemplaires, dont 1 légendaire et 2 épiques !
                </p>
            </div>
            <div class="rulesCard">
                <p class="DivTitle centered">Les cartes</p>
                <p class="justified shadow-white">
                    Chaque carte possède une image, une description et un titre portant sur une réf, un mème ou une private joke en lien avec la personne !
                </p>
                <p class="centered shadow-white">
                    Elles possèdent toutes 5 compétences allant de 0 à 10 :
                </p>
                <div class="rulesCard centered">
                    <ul class="justified shadow-white red big">
                        <li>
                            <strong>CUISI(NE) </strong>
                            <svg-icon  :fa-icon="cuisiIcon" :size="28"/>
                        </li>
                        <li>
                            <strong>CHARI(SME) </strong>
                            <svg-icon  :fa-icon="chariIcon" :size="28"/>
                        </li>
                        <li>
                            <strong>FORCE </strong>
                            <svg-icon  :fa-icon="forceIcon" :size="28"/>
                        </li>
                        <li>
                            <strong>EXPLO(RATION) </strong>
                            <svg-icon  :fa-icon="exploIcon" :size="28"/>
                        </li>
                        <li>
                            <strong>INTEL(LIGENCE) </strong>
                            <svg-icon  :fa-icon="intelIcon" :size="28"/>
                        </li>
                    </ul>
                </div>

            </div>
            <div class="rulesCard pointer" id="exempleCard">
                <card id="0"
                      :competences="{
                            cuisine: 2,
                            charisme: 4,
                            force: 6,
                            exploration: 8,
                            intelligence: 10
                        }"
                      rarity="epic"
                      collection="Anthony 3/8"
                      description="TOUT LE TEMPS IL EST LA IL CASSE LES COUILLES CE SOLEIL DE MERDE VASY C PAS POSSIBLE G MAL AUX YEUX WOOOOW"
                      image-url="https://media.discordapp.net/attachments/1164705273382969454/1164705287291273276/061b5334-4f42-46ea-8681-eb6f443ce05b.png?ex=65442f53&is=6531ba53&hm=d957abac3bf939721fe75f7a01f80ce185eea396f50419c3f7599e57ba25cf44&=&width=547&height=644"
                      name="le SOLEIL DE MERDE"
                      :action="{
                            actionName: 'Explorer',
                            isReturningToHome: false,
                            planetName: 'soleil',
                            endTime: '2077-03-01T00:00:00.000Z'
                      }"/>
            </div>
            <div class="rulesCard separator colorEffect"/>
            <div class="rulesCard player-infos pointer">
                <p class="DivTitle centered">Les Ressources</p>
                <p class="centered shadow-white">
                    Il existe 3 ressources dans Skills Sellers :
                </p>
                <div class="centered">
                    <div class="resources bg-dark-blur"
                         @mouseenter="isHovered = true"
                         @mouseleave="isHovered = false">

                        <span class="text food" :class="{ moved: isHovered }">
                            12
                            <span class="resource-name">{{ isHovered ? 'repas' : ''}}</span>
                            <svg-icon class="shadow-black" :fa-icon="foodIcon" :size="18"/>
                        </span>

                        <span class="text or" :class="{ moved: isHovered }">
                            1045
                            <span class="resource-name">{{ isHovered ? 'or' : ''}}</span>
                            <svg-icon class="shadow-black" :fa-icon="moneyIcon" :size="18"/>
                        </span>

                        <span class="text creatium" :class="{ moved: isHovered }">
                            1762
                            <span class="resource-name">{{ isHovered ? 'creatium' : ''}}</span>
                            <svg-icon class="shadow-black" :fa-icon="creatiumIcon" :size="18"/>
                        </span>
                    </div>
                </div>
                <p class="centered little">
                    Passe moi dessus !
                </p>
                <p class="centered shadow-white">
                    Mais à quoi peuvent-elles servirent ?<br/>
                    Bah continue à lire.
                </p>
            </div>
            <div class="rulesCard">
                <p class="DivTitle centered">Les Actions</p>
                <p class="justified shadow-white">
                    Les compétences de vos cartes servent à effectuer plus ou moins bien des actions. Il existe 4 actions :
                </p>
                <ul class="centered red big">
                    <li><strong>CUISINER</strong></li>
                    <li><strong>SE MUSCLER</strong></li>
                    <li><strong>AMELIORER</strong></li>
                    <li><strong>EXPLORER</strong></li>
                </ul>
                <p class="centered shadow-white">
                    Une carte CUISI(NE) 0 ne réalisera pas des plats aussi bons qu’une carte CUISI(NE) 10 !
                </p>
                <p class="centered shadow-white">
                    En cas d'erreur, cliquer sur une de vos cartes (comme l'exemple ci-dessus) il est possible d'annuler votre Action !
                </p>
                <div class="background centered">
                    <RandomPlanet class="planet" width="1000" height="1000" model-value="KOUZINE" :planet-id="1"/>
                </div>
            </div>
            <div class="rulesCard bordered rotate-left">
                <p class="DivTitle centered">Les batiments</p>
                <div class="column centered">
                    <img src="../assets/images/salle%20de%20sport_wip.png" :width="300" alt="salle de sport"/>
                    <img src="../assets/images/cuisine_wip.png" :width="300" alt="cuisine"/>
                </div>
                <p class="centered shadow-white">
                    Chaque action se réalise dans un bâtiment. Il en existe un pour chaque !
                </p>
            </div>
            <div class="rulesCard rotate-right">
                <p class="justified shadow-white">
                    Les bâtiments sont améliorables. Plus ils sont haut niveau, plus ils peuvent accueillir d'actions !
                </p>
                <p class="justified shadow-white">
                    <strong>Petites précisions :</strong>
                </p>
                <ul class="justified little">
                    <li>- Le laboratoire (pour les actions d'améliorations) ne peut <strong class="red">pas</strong> être amélioré.</li>
                    <li>- Améliorer la cuisine permet d'augmenter le nombre d'utilisation  <strong class="red">par jour</strong>.</li>
                </ul>
            </div>
            <div class="rulesCard separator colorEffect"/>
            <div class="rulesCard large">
                <p class="DivTitle centered">Utiliser les batiments, consommer des ressources, faire des actions... <br/> Comment jouer ??</p>
                <p class="centered">
                    Les <strong>ressources</strong> sont utilisées pour effectuer des actions. <br/>
                    Chaque action a un coût en ressources, en temps et se réalise dans un bâtiment !<br/>
                    Ce sont vos <strong class="colorEffect">cartes</strong> qui vous permettent d'effectuer des actions
                </p>
                <div class="sectionGrid">
                    <section>
                        <strong class="red big shadow-black">CUISINER</strong>
                        <p class="little">
                            Cuisiner ne coûte rien<br/>
                            Mais vous rapporte <strong class="green">X repas <svg-icon :fa-icon="foodIcon" :size="24"/></strong><br/>
                            <span class='italic blue'>(X = stat CUISI(NE) <svg-icon :fa-icon="cuisiIcon" :size="22"/> de la carte utilisée)</span><br/>
                            <strong class="green">20% de chance de UP votre niveau de CUISI(NE) <svg-icon :fa-icon="cuisiIcon" :size="22"/></strong><br/>
                            Pas de repas, pas d'action !<br/>
                            <strong class="colorEffect">Prend toujours 30 minutes !</strong>
                        </p>
                    </section>
                    <section>
                        <strong class="red big shadow-black">SE MUSCLER</strong>
                        <p class="little">
                            Se muscler coûte <strong class="red">1 <svg-icon :fa-icon="foodIcon" :size="24"/></strong><br/>
                            Mais vous permet de gagner <strong class="green">1 de FORCE <svg-icon :fa-icon="forceIcon" :size="22"/></strong><br/>
                            <strong class="colorEffect">Prend X heures !</strong><br/>
                            <span class='italic blue'>(X = <strong>NOUVELLE</strong> stat FORCE <svg-icon :fa-icon="forceIcon" :size="22"/> de la carte, ex : 1h pour passer de 0 à 1)</span>
                        </p>
                    </section>
                    <section>
                        <strong class="red big shadow-black">AMELIORER</strong>
                        <p class="little">
                            Améliorer coûte <strong class="red">1 <svg-icon :fa-icon="foodIcon" :size="24"/> / cartes utilisées</strong><br/>
                            En effet, une amélioration demande beaucoup de force et d'intelligence ! <br/>
                            Cumuler les cartes permet de répondre à ces besoins.<br/>
                            Cela vous permet de gagner <strong class="green">1 niveau sur votre bâtiment !</strong><br/>
                            Et donc d'augmenter le nombre d'actions réalisables sur celui-ci dans le même temps !<br/>
                            Vos cartes gagnent aléatoirement <strong class="green">X niveaux d'INTEL(LIGENCE) <svg-icon :fa-icon="intelIcon" :size="22"/></strong><br/>
                            répartis entre elles, en excluant bien-sûr les cartes niveau max !<br/>
                            <strong class="colorEffect">Prend 12 * X heures !</strong><br/>
                            <span class='italic blue'>(X = niveau <strong>ACTUEL</strong> du bâtiment, ex : 12h pour passer de 1 à 2)</span><br/>
                            <span class='italic blue'>Formule coûts: <strong>X*2 INTEL <svg-icon :fa-icon="intelIcon" :size="22"/>  X*4 FORCE <svg-icon :fa-icon="forceIcon" :size="22"/> 1.3^(X)*400 Créatium <svg-icon :fa-icon="creatiumIcon" :size="22"/></strong></span>
                        </p>
                    </section>
                    <section>
                        <strong class="red big shadow-black">EXPLORER</strong>
                        <p class="little">
                            Explorer coûte <strong class="red">2 <svg-icon :fa-icon="foodIcon" :size="24"/></strong><br/>
                            Explorer est la base du jeu, faites embarquer votre <strong>Jojomobile</strong> dans une fusée libre et attendez son retour !<br/>
                            Pour explorer, il vous faudra au <strong class="red">minimum 1 EXPLO(RATION) <svg-icon :fa-icon="exploIcon" :size="22"/></strong><br/>
                            <strong class="green">20% de chance de UP votre niveau d'EXPLO(RATION) <svg-icon :fa-icon="cuisiIcon" :size="22"/></strong><br/>
                            La <strong class="red">FORCE <svg-icon :fa-icon="forceIcon" :size="22"/></strong> déterminera <strong class="green">les ressources minées</strong><br/>
                            L' <strong class="red">EXPLO(RATION) <svg-icon :fa-icon="forceIcon" :size="22"/></strong> déterminera <strong class="green">le temps</strong> que prendra le voyage<br/>
                            Et enfin le <strong class="red">CHARI(SME) <svg-icon :fa-icon="chariIcon" :size="22"/></strong> déterminera la probabilité d'avoir <strong class="colorEffect">une nouvelle carte !</strong><br/>
                            <strong class="colorEffect">Prend 5h30 -  X * 30 minutes !</strong> (bref plus égal moins)<br/>
                            <span class='italic blue'>(X = stat EXPLO(RATION) de la carte utilisée)</span><br/>
                            <span class='italic blue'>Plus de précision plus bas</span>
                        </p>
                    </section>
                </div>
            </div>
            <div class="rulesCard large pointer">
                <p class="DivTitle centered">DROP lors des explorations</p>
                <p class="centered">
                    Les <strong>explorations</strong> sont la base du jeu, l'endroit où vous pleurez d'avoir un <strong class="commun-text">Miaou :3</strong> commun <br/>
                    ou sautez de joie à la vue d'une <strong class="epic-text">Gala bientôt mannequin</strong> épic !<br/>
                </p>
                <p class="centered">
                    Comme dit plus haut, en fonction de la
                    <strong class="red">FORCE <svg-icon :fa-icon="forceIcon" :size="22"/></strong>,
                    <strong class="red">EXPLO(RATION) <svg-icon :fa-icon="exploIcon" :size="22"/></strong>
                    et <strong class="red">CHARI(SME) <svg-icon :fa-icon="chariIcon" :size="22"/></strong> de votre astronaute,<br/>
                    vous aurez plus ou moins de chance d'avoir une carte ou des ressources.<br/>
                </p>
                <br/>
                <div class="sectionGrid">
                    <section class="bordered rotate-left">
                        <p class="red big centered"><strong>FORCE</strong></p>
                        <p class="centered little">
                            Ne tournons pas autour du pot, voilà les ressources que vous pouvez obtenir en fonction de la force de votre carte :
                        </p>
                        <br/>
                        <div @click="showResourcesDrops = !showResourcesDrops">
                            <p class="centered little">
                                <strong class="red"><svg-icon :fa-icon="forceIcon" :size="22"/> CLICK MOI DESSUS <svg-icon :fa-icon="forceIcon" :size="22"/></strong>
                                <svg-icon :fa-icon="infoIcon" :size="22"/>
                            </p>
                            <div class="centered">
                                <table v-if="showResourcesDrops">
                                    <tr>
                                        <th class="big red"><strong>Niveau</strong></th>
                                        <th class="big green" colspan="3">
                                            <strong>
                                                Ressources
                                                <svg-icon class="creatium shadow-black" :fa-icon="creatiumIcon" :size="30"/> /
                                                <svg-icon class="or shadow-black" :fa-icon="moneyIcon" :size="30"/>
                                            </strong>
                                        </th>
                                    </tr>
                                    <tr>
                                        <td class="red big">1</td>
                                        <td class="creatium big">20 - 50</td>
                                        <td class="or big">10 - 20</td>
                                    </tr>
                                    <tr>
                                        <td class="red big">2</td>
                                        <td class="creatium big">40 - 100</td>
                                        <td class="or big">15 - 25</td>
                                    </tr>
                                    <tr>
                                        <td class="red big">3</td>
                                        <td class="creatium big">50 - 110</td>
                                        <td class="or big">20 - 30</td>
                                    </tr>
                                    <tr>
                                        <td class="red big">4</td>
                                        <td class="creatium big">60 - 135</td>
                                        <td class="or big">25 - 40</td>
                                    </tr>
                                    <tr>
                                        <td class="red big">5</td>
                                        <td class="creatium big">70 - 150</td>
                                        <td class="or big">50 - 70</td>
                                    </tr>
                                    <tr>
                                        <td class="red big">6</td>
                                        <td class="creatium big">80 - 170</td>
                                        <td class="or big">60 - 80</td>
                                    </tr>
                                    <tr>
                                        <td class="red big">7</td>
                                        <td class="creatium big">90 - 185</td>
                                        <td class="or big">70 - 100</td>
                                    </tr>
                                    <tr>
                                        <td class="red big">8</td>
                                        <td class="creatium big">110 - 200</td>
                                        <td class="or big">90 - 150</td>
                                    </tr>
                                    <tr>
                                        <td class="red big">9</td>
                                        <td class="creatium big">140 - 225</td>
                                        <td class="or big">125 - 200</td>
                                    </tr>
                                    <tr>
                                        <td class="red big">10</td>
                                        <td class="creatium big">250 - 350</td>
                                        <td class="or big">150 - 250</td>
                                    </tr>
                                </table>
                            </div>
                        </div>
                    </section>
                    <section class="bordered rotate-right">
                        <p class="red big centered"><strong>ATTRIBUTION COMPETENCES</strong></p>
                        <p class="centered little">
                            Les <strong>compétences</strong> d'une nouvelle carte sont attribuées aléatoirement en fonction de sa rareté.<br/>
                            Les points de compétences sont répartis de la manière suivante :
                        </p>
                        <div @click="showResourcesDrops = !showResourcesDrops">
                            <p class="centered little">
                                <strong class="red"><svg-icon :fa-icon="exploIcon" :size="22"/> CLICK MOI DESSUS <svg-icon :fa-icon="chariIcon" :size="22"/></strong>
                                <svg-icon :fa-icon="infoIcon" :size="22"/>
                            </p>
                            <table v-if="showResourcesDrops">
                                <tr>
                                    <th class="big red"><strong>Rareté</strong></th>
                                    <th class="big green" colspan="2">
                                        <strong>
                                            Points de compétences
                                        </strong>
                                    </th>
                                </tr>
                                <tr>
                                    <td class="commun-text big"><strong>COMMUNE</strong></td>
                                    <td class="creatium big">5</td>
                                </tr>
                                <tr>
                                    <td class="epic-text big"><strong>EPIC</strong></td>
                                    <td class="creatium big">10</td>
                                </tr>
                                <tr>
                                    <td class="legendaire-text big"><strong>LEGENDAIRE</strong></td>
                                    <td class="creatium big">15</td>
                                </tr>
                            </table>
                            <p v-if="showResourcesDrops" class="centered little">
                                La répartition ci-dessus ne comprend pas <strong class="red">l'EXPLO(RATION) <svg-icon :fa-icon="exploIcon" :size="22"/></strong>
                            </p>
                            <table v-if="showResourcesDrops">
                                <tr>
                                    <th class="big red"><strong>% de Chance</strong></th>
                                    <th class="big green" colspan="2">
                                        <strong>
                                            EXPLO(RATION) <svg-icon :fa-icon="exploIcon" :size="22"/>
                                        </strong>
                                    </th>
                                </tr>
                                <tr>
                                    <td class="red big"><strong>40%</strong></td>
                                    <td class="commun-text big">0</td>
                                </tr>
                                <tr>
                                    <td class="red big"><strong>25%</strong></td>
                                    <td class="green big">1</td>
                                </tr>
                                <tr>
                                    <td class="red big"><strong>25%</strong></td>
                                    <td class="green big">2</td>
                                </tr>
                                <tr>
                                    <td class="red big"><strong>9%</strong></td>
                                    <td class="epic-text big">3</td>
                                </tr>
                                <tr class="colorEffect">
                                    <td class="red big"><strong>1% OMG</strong></td>
                                    <td class="legendaire-text big">4</td>
                                </tr>
                            </table>
                        </div>
                    </section>
                    <section class="bordered rotate-left">
                        <p class="red big centered"><strong>CHARISME</strong></p>
                        <p class="centered little">
                            Le charisme est la stat qui vous permet d'augmenter vos chances d'avoir une carte en plus des ressources.<br/>
                        </p>
                        <p class="centered little">
                            <strong class="red">Le calcul est simple, CHARI(SME) x 10 = % de chance d'avoir une carte !</strong>
                        </p>
                    </section>
                    <section class="bordered rotate-right">
                        <p class="red big centered"><strong>DOUBLONS</strong></p>
                        <p class="centered little">
                            Les doublons sont des cartes que vous possédez déjà mais que par malheur vous obtenez de nouveau !<br/>
                            Pas de panique, un doublon vous permet d'<strong class="red">augmenter le niveau <svg-icon :fa-icon="upgradeIcon" :size="20" /></strong> d'une stat de votre carte !<br/>
                            Toujours en fonction de sa rareté, <strong class="commun-text">1</strong>, <strong class="epic-text">2</strong> ou <strong class="legendaire-text">3</strong> points à la compétence de votre choix seront ajoutés !
                        </p>
                    </section>
                </div>
            </div>
            <div class="rulesCard large">
                <p class="DivTitle centered">Perdu dans le menu ?</p>
                <p class="centered shadow-white">
                    <span class="little">Bah cheh, eheh</span><br/>
                    Plus sérieusement, voici un petit récapitulatif des actions que vous pouvez faire sur le jeu ! <br/>
                    Ainsi que leurs icones associées !
                </p>
                <div class="centered">
                    <table class="espace">
                        <tr>
                            <th class="big red"><strong>Action</strong></th>
                            <th class="big or">
                                <strong>Icone</strong>
                            </th>
                            <th class="big green" colspan="2">
                                <strong>Résumé</strong>
                            </th>
                        </tr>
                        <tr>
                            <td class="red big">Pack Opening !</td>
                            <td class="colorEffect"><svg-icon :fa-icon="giftIcon" :size="40" /></td>
                            <td :class="{big: inLine }">Une exploration a trouvée une carte!</td>
                            <td :class="{big: inLine }">Vous pouvez l'ouvrir!</td>
                        </tr>
                        <tr>
                            <td class="red big">Amélioration !</td>
                            <td class="colorEffect"><svg-icon :fa-icon="upgradeIcon" :size="40" /></td>
                            <td :class="{big: inLine }">Une ouverture de pack a fini en doublon!</td>
                            <td :class="{big: inLine }">Vous pouvez améliorer une carte!</td>
                        </tr>
                        <tr>
                            <td class="red big">Voir les cartes</td>
                            <td><svg-icon class="shadow-white" :fa-icon="cardsIcon" :size="36"/></td>
                            <td :class="{big: inLine }">Vous pouvez voir vos cartes</td>
                            <td :class="{big: inLine }">Voilà c'est tout</td>
                        </tr>
                        <tr>
                            <td class="red big">Voir votre planète</td>
                            <td><svg-icon class="shadow-white" :fa-icon="planetIcon" :size="36"/></td>
                            <td :class="{big: inLine }">Vous pouvez voir vos bâtiments</td>
                            <td :class="{big: inLine }">Et donc réaliser une action !</td>
                        </tr>
                        <tr>
                            <td class="red big">Cliquer sur une carte</td>
                            <td>/</td>
                            <td :class="{big: inLine }" colspan="2">N'hesitez pas à cliquer sur une carte pour zoomer et en savoir plus sur l'action en cours !</td>
                        </tr>
                        <tr>
                            <td class="red big">Les évenements !</td>
                            <td><svg-icon class="shadow-white" :fa-icon="gamesIcon" :size="36"/></td>
                            <td :class="{big: inLine }" colspan="2">Ici vous pouvez parier votre or dans des jeux en tout genre !</td>
                        </tr>
                        <tr>
                            <td class="red big">Stats</td>
                            <td><svg-icon class="shadow-white" :fa-icon="statsIcon" :size="36"/></td>
                            <td :class="{big: inLine }">Parfait pour savoir où vous en êtes !</td>
                            <td :class="{big: inLine }">Vous pouvez aussi cliquer sur un pseudo du scoreboard!</td>
                        </tr>
                    </table>
                </div>
            </div>
        </div>
    </div>
    <footer class="footer">
        <p>© 2023 - Skills Sellers - Tous droits réservés</p>
    </footer>
</template>

<style scoped>
.rules {
    display: grid;
    grid-template-columns: 1fr;
    align-items: center;
    margin: 8rem 10px 10px 10px;
    padding: 10px;
    max-width: 1660px;
}

.rulesTitle {
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 10px;
    padding: 10px;
}

.rulesContainer {
    display: grid;
    grid-template-columns: 1fr 1fr;

    @media (max-width: 1023px) {
        grid-template-columns: 1fr;
    }
}

.rulesCard {
    display: flex;
    flex-direction: column;
    margin: 10px auto;
    padding: 10px;
    pointer-events: none;
}

.rulesCard.pointer {
    pointer-events: auto;
}

.rulesCard.large {
    /* always take the full width */
    grid-column: 1 / -1;
}

.rulesCard.separator{
    /* always take the full width */
    grid-column: 1 / -1;
    border-bottom: 10px solid #000000;
    width: 100%;
    margin: 15rem 0;

    @media (max-width: 1023px) {
        margin: 5rem 0;
    }
}

.column {
    flex-direction: row;
}

.rulesCard .background {
    position: absolute;
    display: flex;
    justify-content: center;
    align-items: center;
}

.sectionGrid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-gap: 10px;
    row-gap: 4rem;

    @media (max-width: 1023px) {
        grid-template-columns: 1fr;
    }
}

.bordered {
    border: 1px solid black;
    border-radius: 1rem;
    box-shadow: 0 0 1rem yellowgreen;
    backdrop-filter: blur(0.3rem);
}

.rotate-left {
    /* perspective */
    transform: perspective(1000px) rotateX(0deg) rotateY(12.5deg);

    @media (max-width: 1023px) {
        transform: perspective(1000px) rotateX(12.5deg) rotateY(0deg);
        margin-bottom: 5rem;
    }
}

.rotate-right {
    /* perspective */
    transform: perspective(1000px) rotateX(0deg) rotateY(-12.5deg);

    @media (max-width: 1023px) {
        transform: perspective(1000px) rotateX(-12.5deg) rotateY(0deg);
    }
}

.planet {
    position: absolute;
    box-sizing: unset;
    right: -500px;
    bottom: -700px;
    pointer-events: none;
    transform: scale(0.5);
}

.colorEffect {
    animation: colorChange 6s linear infinite;
}

.rulesCard h2 {
    text-align: center;
    font-size: 2rem;
    margin: 10px;
    padding: 10px;
}

.rulesCard p {
    font-size: 2rem;
    margin: 10px;
    padding: 10px;
    z-index: 10;
    overflow-wrap: break-word;

    @media (max-width: 1023px) {
        font-size: 1.4rem;
    }
}

.italic {
    font-style: italic;
}

.rulesCard .little {
    font-size: 1.4rem;
}

.rulesCard ul {
    list-style-type: none;
    margin: 10px;
    padding: 10px;
    /* add effects */
    filter: drop-shadow(0 0 0.75rem rgba(0, 0, 0, 0.5));
    z-index: 10;
}

.rulesCard .justified {
    text-align: justify;
}

.rulesCard p.centered, ul.centered {
    text-align: center;
}

div.centered {
    display: flex;
    justify-content: center;
    align-items: center;
}

.rulesCard .big {
    font-size: 2rem;
}

.player-infos .resources {
    width: 14rem;
    height: 6rem;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: end;
    padding-right: 10px;
    z-index: 90;
    border-radius: 0 0 0 1rem;
    box-shadow: 0 0 1rem black;

}

.player-infos .text {
    width: 2rem;
    font-size: 20px;
    font-weight: bold;
    text-shadow: 0 0 0.5rem var(--vt-c-white-dark);
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-auto-flow: column;
    grid-gap: 0.5rem;
    align-items: center;
    justify-content: end;
    transition: transform 0.3s ease-in-out, opacity 0.3s ease-in-out;
    z-index: 102;
    pointer-events: none;
}

.or {
    right: 15rem;
    top: 4.8rem;
    color: yellow;
}

.player-infos .food {
    right: 15rem;
    top: 6rem;
    color: yellowgreen;
}

.creatium {
    right: 15rem;
    top: 7.2rem;
    color: #2fc9e2;
}

.player-infos .moved {
    transform: scale(1.2);
}

.player-infos .text .resource-name {
    opacity: 0;
    transition: opacity 0.3s ease-in-out, opacity 0.3s ease-in-out;
}

.player-infos .text.moved .resource-name {
    opacity: 1;
}

table {
    border-collapse: collapse;
    width: 100%;
    margin: 10px;
    padding: 10px;
    text-align: center;

    @media (max-width: 1023px) {
        margin: 0;
        padding: 0;
        font-size: 1rem;
    }
}

.espace tr {
    border-bottom: 1px solid black;
}

.espace tr:last-child {
    border-bottom: none;
}

.espace td {
    padding: 0.5rem;
}

card {
    z-index: 100 !important;
}

#exempleCard {
    z-index: 1000;
}
</style>