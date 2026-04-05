<template>
  <div class="min-h-screen bg-background pb-24">
    <header class="sticky top-0 z-40 flex items-center w-full px-4 h-14 bg-background/90 backdrop-blur-sm border-b border-primary/10">
      <button @click="$router.back()" class="text-primary hover:bg-primary/5 p-2 rounded-full transition-colors mr-2">
        <ChevronLeft class="w-5 h-5" />
      </button>
      <h1 class="font-headline text-lg font-bold text-primary">设置</h1>
    </header>

    <main class="max-w-md mx-auto px-4 py-6 space-y-4">
      <!-- Appearance -->
      <p class="text-xs text-tertiary px-1 font-semibold uppercase tracking-wider">外观</p>
      <div class="bg-neutral rounded-xl overflow-hidden border border-black/5 dark:border-white/5 divide-y divide-black/5 dark:divide-white/5">
        <div class="flex items-center justify-between px-4 py-3.5">
          <div class="flex items-center gap-3">
            <component :is="isDark ? Moon : Sun" class="w-4 h-4 text-tertiary" />
            <span class="text-sm text-primary">深色模式</span>
          </div>
          <button
            @click="toggleDark"
            :class="['relative w-11 h-6 rounded-full transition-colors', isDark ? 'bg-secondary' : 'bg-black/20 dark:bg-white/20']"
          >
            <span :class="['absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform', isDark ? 'translate-x-5' : '']" />
          </button>
        </div>
      </div>

      <!-- Notifications -->
      <p class="text-xs text-tertiary px-1 font-semibold uppercase tracking-wider">通知</p>
      <div class="bg-neutral rounded-xl overflow-hidden border border-black/5 dark:border-white/5 divide-y divide-black/5 dark:divide-white/5">
        <div v-for="item in notifSettings" :key="item.key" class="flex items-center justify-between px-4 py-3.5">
          <span class="text-sm text-primary">{{ item.label }}</span>
          <button
            @click="item.value = !item.value"
            :class="['relative w-11 h-6 rounded-full transition-colors', item.value ? 'bg-secondary' : 'bg-black/20 dark:bg-white/20']"
          >
            <span :class="['absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform', item.value ? 'translate-x-5' : '']" />
          </button>
        </div>
      </div>

      <!-- Privacy -->
      <p class="text-xs text-tertiary px-1 font-semibold uppercase tracking-wider">隐私</p>
      <div class="bg-neutral rounded-xl overflow-hidden border border-black/5 dark:border-white/5 divide-y divide-black/5 dark:divide-white/5">
        <div class="flex items-center justify-between px-4 py-3.5">
          <span class="text-sm text-primary">谁可以给我发信</span>
          <div class="flex items-center gap-1 text-tertiary">
            <span class="text-xs">{{ whoCanWrite }}</span>
            <ChevronRight class="w-4 h-4" />
          </div>
        </div>
        <div class="flex items-center justify-between px-4 py-3.5">
          <span class="text-sm text-primary">展示我的收藏</span>
          <button
            @click="showCollection = !showCollection"
            :class="['relative w-11 h-6 rounded-full transition-colors', showCollection ? 'bg-secondary' : 'bg-black/20 dark:bg-white/20']"
          >
            <span :class="['absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform', showCollection ? 'translate-x-5' : '']" />
          </button>
        </div>
      </div>

      <!-- About -->
      <p class="text-xs text-tertiary px-1 font-semibold uppercase tracking-wider">关于</p>
      <div class="bg-neutral rounded-xl overflow-hidden border border-black/5 dark:border-white/5 divide-y divide-black/5 dark:divide-white/5">
        <div class="flex items-center justify-between px-4 py-3.5">
          <span class="text-sm text-primary">当前版本</span>
          <span class="text-xs text-tertiary">v1.0.0</span>
        </div>
        <button class="w-full flex items-center justify-between px-4 py-3.5 hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
          <span class="text-sm text-primary">清除缓存</span>
          <ChevronRight class="w-4 h-4 text-tertiary" />
        </button>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { ChevronLeft, ChevronRight, Moon, Sun } from 'lucide-vue-next'

const isDark = ref(document.documentElement.classList.contains('dark'))
const whoCanWrite = ref('所有人')
const showCollection = ref(true)

const notifSettings = reactive([
  { key: 'newMail', label: '收到新明信片', value: true },
  { key: 'reply', label: '有人回复我', value: true },
  { key: 'system', label: '系统通知', value: false },
])

const toggleDark = () => {
  isDark.value = !isDark.value
  if (isDark.value) {
    document.documentElement.classList.add('dark')
    localStorage.setItem('theme', 'dark')
  } else {
    document.documentElement.classList.remove('dark')
    localStorage.setItem('theme', 'light')
  }
}
</script>
