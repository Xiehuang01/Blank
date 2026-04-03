<template>
  <nav
    class="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-2 py-2 bg-neutral/70 backdrop-blur-xl border-t border-tertiary/10 shadow-[0_-1px_3px_0_rgba(0,0,0,0.05)]"
  >
    <router-link
      v-for="item in navItems"
      :key="item.path"
      :to="item.path"
      class="flex flex-col items-center justify-center transition-all duration-300 ease-in-out px-4 py-1.5"
      :class="[
        path === item.path
          ? 'text-primary bg-primary/5 rounded-xl'
          : 'text-tertiary hover:text-primary'
      ]"
    >
      <div class="relative">
        <component
          :is="item.icon"
          class="w-6 h-6"
          :stroke-width="path === item.path ? 2 : 1.5"
        />
        <!-- 签到红点提示 -->
        <span
          v-if="item.path === '/profile' && !isCheckedInToday"
          class="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-background"
        ></span>
      </div>
    </router-link>
  </nav>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRoute } from "vue-router";
import {
  Compass,
  Inbox,
  Upload,
  ShoppingBag,
  UserRound,
} from "lucide-vue-next";
import { useCheckIn } from "../store/checkin";

const route = useRoute();
const path = computed(() => route.path);
const { isCheckedInToday } = useCheckIn();

const navItems = [
  { icon: Compass, path: "/" },
  { icon: Inbox, path: "/mail" },
  { icon: Upload, path: "/create" },
  { icon: ShoppingBag, path: "/shop" },
  { icon: UserRound, path: "/profile" },
];
</script>
