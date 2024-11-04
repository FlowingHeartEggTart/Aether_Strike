<template>
  <div class="flex flex-col items-center justify-center h-screen bg-gray-800 text-white">
    <div class="text-6xl font-bold mb-4">游戏结束</div>
    <div class="text-4xl mb-2">得分: {{ score }}</div>
    <div class="text-4xl mb-6">最高得分: {{ highScore }}</div>
    <div class="flex space-x-4">
      <a-button type="primary" @click="restartGame">重新开始</a-button>
      <a-button type="default" @click="exitGame">退出游戏</a-button>
    </div>
  </div>
</template>

<script lang="tsx" setup>
import { ref } from 'vue';

const score = ref(120); // Mock data for current score
const highScore = ref(200); // Mock data for high score

const restartGame = () => {
  console.log('Game restarted');
  // Add logic to restart the game
};

const exitGame = () => {
  console.log('Game exited');
  // Add logic to exit the game
};
</script>

<style>
body {
  margin: 0;
  font-family: 'Arial', sans-serif;
}
</style>
