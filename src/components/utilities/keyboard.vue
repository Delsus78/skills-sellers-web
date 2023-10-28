<script setup>
</script>
<template>
  <div class="keyboard">
    <div class="keyboard__row">
      <div class="keyboard__key" @click="handleClick('1')">1</div>
      <div class="keyboard__key" @click="handleClick('2')">2</div>
      <div class="keyboard__key" @click="handleClick('3')">3</div>
      <div class="keyboard__key" @click="handleClick('4')">4</div>
      <div class="keyboard__key" @click="handleClick('5')">5</div>
      <div class="keyboard__key" @click="handleClick('6')">6</div>
      <div class="keyboard__key" @click="handleClick('7')">7</div>
      <div class="keyboard__key" @click="handleClick('8')">8</div>
      <div class="keyboard__key" @click="handleClick('9')">9</div>
      <div class="keyboard__key" @click="handleClick('0')">0</div>
    </div>
    <div class="keyboard__row">
      <div class="keyboard__key" @click="handleClick('A')">A</div>
      <div class="keyboard__key" @click="handleClick('Z')">Z</div>
      <div class="keyboard__key" @click="handleClick('E')">E</div>
      <div class="keyboard__key" @click="handleClick('R')">R</div>
      <div class="keyboard__key" @click="handleClick('T')">T</div>
      <div class="keyboard__key" @click="handleClick('Y')">Y</div>
      <div class="keyboard__key" @click="handleClick('U')">U</div>
      <div class="keyboard__key" @click="handleClick('I')">I</div>
      <div class="keyboard__key" @click="handleClick('O')">O</div>
      <div class="keyboard__key" @click="handleClick('P')">P</div>
    </div>
    <div class="keyboard__row">
      <div class="keyboard__key" @click="handleClick('Q')">Q</div>
      <div class="keyboard__key" @click="handleClick('S')">S</div>
      <div class="keyboard__key" @click="handleClick('D')">D</div>
      <div class="keyboard__key" @click="handleClick('F')">F</div>
      <div class="keyboard__key" @click="handleClick('G')">G</div>
      <div class="keyboard__key" @click="handleClick('H')">H</div>
      <div class="keyboard__key" @click="handleClick('J')">J</div>
      <div class="keyboard__key" @click="handleClick('K')">K</div>
      <div class="keyboard__key" @click="handleClick('L')">L</div>
      <div class="keyboard__key" @click="handleClick('M')">M</div>
    </div>
    <div class="keyboard__row">
      <div class="keyboard__key" @click="handleClick('W')">W</div>
      <div class="keyboard__key" @click="handleClick('X')">X</div>
      <div class="keyboard__key" @click="handleClick('C')">C</div>
      <div class="keyboard__key" @click="handleClick('V')">V</div>
      <div class="keyboard__key" @click="handleClick('B')">B</div>
      <div class="keyboard__key" @click="handleClick('N')">N</div>
    </div>
  </div>
</template>
<style scoped>
.keyboard {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
}
</style>