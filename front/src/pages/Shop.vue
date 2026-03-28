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
                class="flex-1 py-1.5 px-2 text-xs sm:text-sm font-bold rounded-md transition-all duration-300 shadow-sm active:scale-95 text-center bg-primary text-white hover:bg-primary/90"
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
import { ref } from "vue";
import { Search, Plus, Minus } from "lucide-vue-next";

const selectedImage = ref<string | null>(null);

const stamps = [
  {
    id: 1,
    title: "故宫大和殿",
    desc: "金砖铺地，朱墙焕彩。方寸之间尽显皇城威仪，岁月流转不减大殿雄风。",
    price: 50,
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBU1OP8SQVdlKIpODIOVZlnUTj7wOaXdkQZucciHoU-YhRr3LdYXfnu_9b2lJ9Y_1zH2XmqDI-G9PiZQ-cAx2ZJNLOgPQPT0ATv8vPHe9hWoxFbcy0t-cAFSWMZOXcLfWOEP3HLioqPm5xs9Jlaf140zxQVzTupbrxklvyms_KVxVKGB_Dgv43ele7rXlVbWV9bYaoO0uhQxwTwYeyFG9h7zG6sOxU9nBCW0BJj1U3Gqr8QZa8nIZWGUd5S7ja5-wBUNbqOEUgzKU2S",
  },
  {
    id: 2,
    title: "西湖十景 · 断桥",
    desc: "晴雨皆宜，湖光潋滟。断桥残雪余韵长，在信笺上留一抹江南的温柔。",
    price: 45,
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuB_pRV3yzYJgmKLrANmpor-F_FMUHLxOaQIg0EupBLMbc2DAnARk9E3bfDkpYCp8ZGMA7TLI1ZV--Q_T8TvmODoxc4UT0aOzfjupFB0H3rvfWSwvf0-wyAoNn_Vhi-UdPDjgKBCnFXOb0dbxvgEaSWpg5yLLs10UO5FLPvZVg5qc87zD8E52KXCd2_OWB6Y5LK5lNeitctuOxuYTmJISsFsHp21Rbge462DY5J_LZUKJrRjFQ0GBc9hUWGq9RELaW3QUhmp1B0p0fCu",
  },
  {
    id: 3,
    title: "世界遗珍 · 泰姬陵",
    desc: "永恒之泪，洁白如镜。超越国界的艺术瑰宝，致远方那些未曾诉说的深情。",
    price: 80,
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuADfXCv5BJRvcBWkkgN_LKRrckuePUIND06wpwie4Y90p2nb2ixhF6hVq9H5X3XZk41bscteNpEGVobb9RXc-j1ikbD7QbTImgNFrrc6ouvElElROC8WTIrmhNWqgc5SGIS1ZP_6DiB3dWg5GkufmC1xMEfWHZ2AAuh5DwX_XUEtE_51h23Qipd3LFFPLI0VbFVuEkYUz7R2TZWM-_Ibdu_4_WTu2B5l-lbUzwPVJvk4-q5A9J0sou-YqPmEA-9lz2-7fj8PSCbpa7A",
    outline: true,
  },
  {
    id: 4,
    title: "浪漫之都 · 巴黎",
    desc: "塞纳河畔，铁塔高耸。将法式的浪漫剪裁成方寸，寄给每一个热爱生活的人。",
    price: 60,
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBJIiCFlINueVZ3ws_NTCciMSNvZWxYQBXJkUoUootQVEX18PwV92Slzz101Z-lnQvQtnNYNOyhZW2rUFfhHMjK1ygAE7ouwXc1dMYeCuvDJ5vBHThNGJaZjtUa34xzZKDYhNrXKSbt078DIqMIDF2ldI5vVpNULjIR0Mn8n7TWcGkK1OLxPIjBrJIO-lzv-AF3b_RUrYrGTNqcSexoF0gFYn2Tl593vBY4_-KCN6BFiAOusFMkqdpdJUtIFhaEH7AzeTQ7xTl9tcSN",
  },
];
</script>
