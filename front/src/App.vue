<template>
  <div class="min-h-screen bg-background text-primary font-body">
    <Loading v-if="globalLoading" class="fixed inset-0 z-[9999]" />
    <router-view v-slot="{ Component, route: currentRoute }">
      <KeepAlive v-if="currentRoute.meta.keepAlive">
        <component
          :is="Component"
          :key="String(currentRoute.name || currentRoute.path)"
        />
      </KeepAlive>
      <component
        :is="Component"
        v-else
        :key="currentRoute.fullPath"
      />
    </router-view>
    <BottomNav v-if="!['/login', '/register', '/forgot-password'].includes(route.path) && !route.path.startsWith('/post/')" />
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRoute } from "vue-router";
import BottomNav from "./components/BottomNav.vue";
import Loading from "./components/Loading.vue";
import { pendingRequestCount } from "./utils/request.js";

const route = useRoute();
const globalLoading = computed(() => pendingRequestCount.value > 0);
</script>
