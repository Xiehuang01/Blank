<template>
  <div class="app-container">
    <Header @toggle-backpack="showBackpack = true" />
    <main class="main-content">
      <Shop />
    </main>
    
    <transition name="fade">
      <Backpack v-if="showBackpack" @close="showBackpack = false" />
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import Header from './components/Header.vue';
import Shop from './views/Shop.vue';
import Backpack from './views/Backpack.vue';

const showBackpack = ref(false);
</script>

<style lang="less">
:root {
  --bg-color: #f9f7f2;
  --primary-color: #c0846d;
  --text-color: #5a5a5a;
  --text-light: #8c8c8c;
  --card-bg: #ffffff;
  --border-color: #e5e5e5;
}

body {
  margin: 0;
  padding: 0;
  background-color: var(--bg-color);
  font-family: 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', 'Helvetica Neue', Helvetica, Arial, sans-serif;
  color: var(--text-color);
}

.app-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.main-content {
  flex: 1;
  padding-top: 64px; /* Height of fixed header */
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
