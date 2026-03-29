<template>
  <div class="min-h-screen bg-background pb-24">
    <header
      class="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-6 h-16 bg-background border-b border-primary/10 gap-4"
    >
      <div class="relative flex-1">
        <Search
          class="absolute left-3 top-1/2 -translate-y-1/2 text-tertiary w-4 h-4"
        />
        <input
          type="text"
          placeholder="搜索邮票..."
          class="w-full bg-black/5 dark:bg-white/5 border-none rounded-full py-1.5 pl-9 pr-4 text-sm font-body focus:ring-1 focus:ring-primary/20 placeholder:text-tertiary"
        />
      </div>
      <div
        class="flex items-center bg-black/5 dark:bg-white/5 px-4 py-1.5 rounded-full border border-black/10 dark:border-white/10 shrink-0"
      >
        <span class="text-xs font-semibold text-secondary mr-2">邮分</span>
        <span class="text-sm font-bold text-primary tracking-tight"
          >1,250</span
        >
      </div>
    </header>

    <main class="pt-20 pb-24 px-4 max-w-7xl mx-auto">
      <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-6">
        <div
          v-for="stamp in stamps"
          :key="stamp.id"
          class="bg-neutral rounded-xl overflow-hidden shadow-sm border border-black/5 dark:border-white/5 hover:shadow-md transition-all duration-300 group flex flex-col"
        >
          <!-- Image Section -->
          <div 
            class="relative aspect-square bg-[#F9F6F0] dark:bg-black/20 p-4 sm:p-6 flex items-center justify-center overflow-hidden cursor-zoom-in"
            @click="selectedImage = stamp.image"
          >
            <img
              :src="stamp.image"
              :alt="stamp.title"
              class="w-full h-full object-cover filter sepia-[0.2] contrast-[0.9] drop-shadow-sm group-hover:scale-105 transition-transform duration-500"
              referrerpolicy="no-referrer"
            />
            <!-- Stamp border effect -->
            <div class="absolute inset-2 sm:inset-3 border border-dashed border-black/10 dark:border-white/10 pointer-events-none rounded-lg"></div>
          </div>
          
          <!-- Content Section -->
          <div class="p-3 sm:p-4 flex flex-col flex-grow">
            <h3 class="font-headline text-sm sm:text-base font-bold text-primary truncate">
              {{ stamp.title }}
            </h3>
            <p class="text-[10px] sm:text-xs text-tertiary line-clamp-2 mt-1 mb-2 flex-grow leading-relaxed">
              {{ stamp.desc }}
            </p>
            
            <div class="flex items-baseline gap-1 mb-3">
              <span class="font-bold text-secondary text-sm sm:text-base">{{ stamp.price }}</span>
              <span class="text-[10px] text-tertiary">邮分</span>
            </div>
            
            <!-- Actions -->
            <div class="flex items-center gap-2 mt-auto">
              <div class="flex items-center justify-between bg-black/5 dark:bg-white/5 px-1.5 py-1.5 rounded-md w-16 sm:w-20 shrink-0">
                <button class="text-tertiary hover:text-primary transition-colors">
                  <Minus class="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                </button>
                <span class="text-xs font-bold text-primary">1</span>
                <button class="text-tertiary hover:text-primary transition-colors">
                  <Plus class="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                </button>
              </div>
              <button
                @click="purchaseStamp(stamp)"
                class="flex-1 py-1.5 px-2 text-xs sm:text-sm font-bold rounded-md transition-all duration-300 shadow-sm active:scale-95 text-center bg-primary dark:bg-secondary hover:bg-primary/90 dark:hover:bg-secondary/90"
                :style="isDark ? { color: '#000' } : { color: '#fff' }"
              >
                购入
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Image Viewer Lightbox -->
    <div
      v-if="selectedImage"
      class="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm cursor-zoom-out transition-opacity"
      @click="selectedImage = null"
    >
      <img
        :src="selectedImage"
        class="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
        referrerpolicy="no-referrer"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { Search, Plus, Minus } from "lucide-vue-next";
import { stamps } from "../data/stamps";

const selectedImage = ref<string | null>(null);
const isDark = ref(false);

onMounted(() => {
  const checkDark = () => {
    isDark.value = document.documentElement.classList.contains('dark');
  };
  checkDark();
  
  const observer = new MutationObserver(checkDark);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
});

const purchaseStamp = (stamp: any) => {
  const stored = localStorage.getItem('favorites') || '[]';
  let favorites = JSON.parse(stored);
  
  // 检查是否已经购买过
  const exists = favorites.some((s: any) => s.id === stamp.id);
  if (!exists) {
    favorites.push(stamp);
    localStorage.setItem('favorites', JSON.stringify(favorites));
    alert('购入成功！已添加到我的邮票');
  } else {
    alert('你已经拥有这张邮票了');
  }
};
</script>
