<template>
  <div class="min-h-screen bg-background text-primary font-body">
    <router-view></router-view>
    <BottomNav v-if="route.path !== '/login' && !route.path.startsWith('/post/')" />
  </div>
</template>

<script setup lang="ts">
import { useRoute } from "vue-router";
import BottomNav from "./components/BottomNav.vue";

const route = useRoute();
</script>
