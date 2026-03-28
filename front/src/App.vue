<template>
  <div class="min-h-screen bg-background text-primary font-body">
    <router-view></router-view>
    <BottomNav />
  </div>
</template>

<script setup lang="ts">
import BottomNav from "./components/BottomNav.vue";
</script>
