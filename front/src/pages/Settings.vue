<template>
  <div class="min-h-screen bg-background">
    <!-- Mobile Header -->
    <header class="lg:hidden sticky top-0 z-40 flex items-center w-full px-4 h-14 bg-background/90 backdrop-blur-sm border-b border-primary/10">
      <button @click="$router.back()" class="text-primary hover:bg-primary/5 p-2 rounded-full transition-colors mr-2">
        <ChevronLeft class="w-5 h-5" />
      </button>
      <h1 class="font-headline text-lg font-bold text-primary">设置</h1>
    </header>

    <!-- PC Header -->
    <header class="hidden lg:flex items-center w-full px-8 h-16 bg-background border-b border-primary/10">
      <div class="max-w-6xl mx-auto w-full flex items-center">
        <button @click="$router.back()" class="text-primary hover:bg-primary/5 p-2 rounded-full transition-colors mr-4">
          <ChevronLeft class="w-5 h-5" />
        </button>
        <h1 class="font-headline text-xl font-bold text-primary">设置</h1>
      </div>
    </header>

    <!-- Mobile Layout -->
    <main class="lg:hidden max-w-md mx-auto px-4 py-6 space-y-4 pb-24">
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
      <div class="bg-neutral rounded-xl overflow-hidden border border-black/5 dark:border-white/5">
        <div class="flex items-center justify-between px-4 py-3.5">
          <span class="text-sm text-primary">当前版本</span>
          <span class="text-xs text-tertiary">v1.0.0</span>
        </div>
      </div>
    </main>

    <!-- PC Layout -->
    <main class="hidden lg:block max-w-6xl mx-auto px-8 py-8">
      <div class="flex gap-8">
        <!-- Sidebar Navigation -->
        <aside class="w-64 flex-shrink-0">
          <nav class="space-y-1">
            <button
              v-for="section in sections"
              :key="section.id"
              @click="scrollToSection(section.id)"
              :class="[
                'w-full text-left px-4 py-3 rounded-lg transition-colors text-sm font-medium',
                activeSection === section.id
                  ? 'bg-secondary/10 text-secondary'
                  : 'text-tertiary hover:bg-neutral hover:text-primary'
              ]"
            >
              <div class="flex items-center gap-3">
                <component :is="section.icon" class="w-4 h-4" />
                {{ section.name }}
              </div>
            </button>
          </nav>
        </aside>

        <!-- Settings Content -->
        <div class="flex-1 space-y-8">
          <!-- Appearance Section -->
          <section id="appearance" class="bg-neutral rounded-2xl border border-black/5 dark:border-white/5 overflow-hidden">
            <div class="px-6 py-4 border-b border-black/5 dark:border-white/5">
              <h2 class="text-lg font-semibold text-primary flex items-center gap-2">
                <Palette class="w-5 h-5 text-secondary" />
                外观
              </h2>
            </div>
            <div class="p-6">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-4">
                  <div class="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center">
                    <component :is="isDark ? Moon : Sun" class="w-5 h-5 text-secondary" />
                  </div>
                  <div>
                    <p class="text-sm font-medium text-primary">深色模式</p>
                    <p class="text-xs text-tertiary">切换应用的明暗主题</p>
                  </div>
                </div>
                <button
                  @click="toggleDark"
                  :class="['relative w-12 h-7 rounded-full transition-colors', isDark ? 'bg-secondary' : 'bg-black/20 dark:bg-white/20']"
                >
                  <span :class="['absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full shadow transition-transform', isDark ? 'translate-x-5' : '']" />
                </button>
              </div>
            </div>
          </section>

          <!-- Notifications Section -->
          <section id="notifications" class="bg-neutral rounded-2xl border border-black/5 dark:border-white/5 overflow-hidden">
            <div class="px-6 py-4 border-b border-black/5 dark:border-white/5">
              <h2 class="text-lg font-semibold text-primary flex items-center gap-2">
                <Bell class="w-5 h-5 text-secondary" />
                通知
              </h2>
            </div>
            <div class="divide-y divide-black/5 dark:divide-white/5">
              <div v-for="item in notifSettings" :key="item.key" class="flex items-center justify-between px-6 py-4">
                <div>
                  <p class="text-sm font-medium text-primary">{{ item.label }}</p>
                  <p class="text-xs text-tertiary mt-0.5">{{ item.desc }}</p>
                </div>
                <button
                  @click="item.value = !item.value"
                  :class="['relative w-12 h-7 rounded-full transition-colors', item.value ? 'bg-secondary' : 'bg-black/20 dark:bg-white/20']"
                >
                  <span :class="['absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full shadow transition-transform', item.value ? 'translate-x-5' : '']" />
                </button>
              </div>
            </div>
          </section>

          <!-- Privacy Section -->
          <section id="privacy" class="bg-neutral rounded-2xl border border-black/5 dark:border-white/5 overflow-hidden">
            <div class="px-6 py-4 border-b border-black/5 dark:border-white/5">
              <h2 class="text-lg font-semibold text-primary flex items-center gap-2">
                <Shield class="w-5 h-5 text-secondary" />
                隐私
              </h2>
            </div>
            <div class="divide-y divide-black/5 dark:divide-white/5">
              <div class="flex items-center justify-between px-6 py-4">
                <div class="flex items-center gap-4">
                  <div class="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center">
                    <Mail class="w-5 h-5 text-secondary" />
                  </div>
                  <div>
                    <p class="text-sm font-medium text-primary">谁可以给我发信</p>
                    <p class="text-xs text-tertiary mt-0.5">控制谁能够向你发送明信片</p>
                  </div>
                </div>
                <button class="flex items-center gap-2 px-4 py-2 rounded-lg bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 transition-colors">
                  <span class="text-sm text-primary">{{ whoCanWrite }}</span>
                  <ChevronRight class="w-4 h-4 text-tertiary" />
                </button>
              </div>
              <div class="flex items-center justify-between px-6 py-4">
                <div class="flex items-center gap-4">
                  <div class="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center">
                    <Heart class="w-5 h-5 text-secondary" />
                  </div>
                  <div>
                    <p class="text-sm font-medium text-primary">展示我的收藏</p>
                    <p class="text-xs text-tertiary mt-0.5">允许其他用户查看你的收藏列表</p>
                  </div>
                </div>
                <button
                  @click="showCollection = !showCollection"
                  :class="['relative w-12 h-7 rounded-full transition-colors', showCollection ? 'bg-secondary' : 'bg-black/20 dark:bg-white/20']"
                >
                  <span :class="['absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full shadow transition-transform', showCollection ? 'translate-x-5' : '']" />
                </button>
              </div>
            </div>
          </section>

          <!-- About Section -->
          <section id="about" class="bg-neutral rounded-2xl border border-black/5 dark:border-white/5 overflow-hidden">
            <div class="px-6 py-4 border-b border-black/5 dark:border-white/5">
              <h2 class="text-lg font-semibold text-primary flex items-center gap-2">
                <Info class="w-5 h-5 text-secondary" />
                关于
              </h2>
            </div>
            <div class="px-6 py-4">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm font-medium text-primary">当前版本</p>
                  <p class="text-xs text-tertiary mt-0.5">应用的版本信息</p>
                </div>
                <span class="px-3 py-1 rounded-full bg-secondary/10 text-secondary text-sm font-medium">v1.0.0</span>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { 
  ChevronLeft, 
  ChevronRight, 
  Moon, 
  Sun, 
  Palette, 
  Bell, 
  Shield, 
  Info,
  Mail,
  Heart
} from 'lucide-vue-next'

const isDark = ref(document.documentElement.classList.contains('dark'))
const whoCanWrite = ref('所有人')
const showCollection = ref(true)
const activeSection = ref('appearance')

const sections = [
  { id: 'appearance', name: '外观', icon: Palette },
  { id: 'notifications', name: '通知', icon: Bell },
  { id: 'privacy', name: '隐私', icon: Shield },
  { id: 'about', name: '关于', icon: Info },
]

const notifSettings = reactive([
  { key: 'newMail', label: '收到新明信片', desc: '当有人给你寄送明信片时通知你', value: true },
  { key: 'reply', label: '有人回复我', desc: '当你的评论被回复时通知你', value: true },
  { key: 'system', label: '系统通知', desc: '接收系统更新和重要公告', value: false },
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

const scrollToSection = (sectionId: string) => {
  activeSection.value = sectionId
  const element = document.getElementById(sectionId)
  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}

onMounted(() => {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          activeSection.value = entry.target.id
        }
      })
    },
    { threshold: 0.5 }
  )

  sections.forEach((section) => {
    const element = document.getElementById(section.id)
    if (element) observer.observe(element)
  })
})
</script>
