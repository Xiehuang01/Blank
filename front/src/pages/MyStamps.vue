<template>
  <div class="min-h-screen bg-background pb-24">
    <header
      class="sticky top-0 z-40 flex items-center gap-4 w-full px-4 h-16 bg-background/90 backdrop-blur-sm border-b border-primary/10"
    >
      <button
        @click="$router.back()"
        class="text-primary hover:text-secondary transition-colors"
      >
        <ChevronLeft class="w-6 h-6" />
      </button>
      <h1 class="font-headline text-xl font-bold text-primary">我的邮票</h1>
    </header>

    <main class="max-w-7xl mx-auto px-4 pt-6">
      <div v-if="stamps.length === 0" class="flex items-center justify-center min-h-[60vh]">
        <div class="text-center">
          <Package class="w-12 h-12 text-tertiary mx-auto mb-4 opacity-50" />
          <p class="text-tertiary font-body">暂无可用邮票，去商店补充吧</p>
        </div>
      </div>
      <div v-else class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-6">
        <div
          v-for="stamp in stamps"
          :key="stamp.id"
          class="bg-neutral rounded-xl overflow-hidden shadow-sm border border-black/5 dark:border-white/5 hover:shadow-md transition-all duration-300 group flex flex-col"
        >
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
            <div class="absolute inset-2 sm:inset-3 border border-dashed border-black/10 dark:border-white/10 pointer-events-none rounded-lg"></div>
          </div>
          
          <div class="p-3 sm:p-4 flex flex-col flex-grow">
            <h3 class="font-headline text-sm sm:text-base font-bold text-primary truncate">
              {{ stamp.title }}
            </h3>
            <p class="text-[10px] sm:text-xs text-tertiary line-clamp-2 mt-1 mb-2 flex-grow leading-relaxed">
              {{ stamp.desc }}
            </p>
            
            <div class="flex items-baseline gap-1 mb-1">
              <span class="font-bold text-secondary text-sm sm:text-base">{{ stamp.price }}</span>
              <span class="text-[10px] text-tertiary">邮分</span>
            </div>
            <div class="flex items-center justify-between text-[11px] text-tertiary mb-3">
              <span>剩余数量</span>
              <span class="font-bold text-primary">{{ stamp.quantity ?? 0 }} 张</span>
            </div>
            
            <button
              class="w-full py-1.5 px-2 text-xs sm:text-sm font-bold rounded-md transition-all duration-300 shadow-sm text-center bg-black/5 dark:bg-white/5 text-tertiary cursor-default"
            >
              {{ (stamp.quantity ?? 0) > 0 ? `可使用 ${stamp.quantity} 张` : '已无剩余' }}
            </button>
          </div>
        </div>
      </div>
    </main>

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
import { ChevronLeft, Package } from "lucide-vue-next";
import { ElMessage } from "element-plus";
import { assetBaseURL } from "../utils/request.js";
import { getMyStamps } from "../api/stamp.js";

const selectedImage = ref<string | null>(null);
const stamps = ref<any[]>([]);

const resolveAssetUrl = (url?: string | null) => {
  if (!url) return "";
  if (/^(https?:)?\/\//.test(url) || url.startsWith("data:")) return url;
  return `${assetBaseURL}${url.startsWith("/") ? url : `/${url}`}`;
};

const loadStamps = async () => {
  try {
    const res = await getMyStamps();
    stamps.value = (res.data || [])
      .filter((s: any) => Number(s.quantity || 0) > 0)
      .map((s: any) => ({
        ...s,
        image: resolveAssetUrl(s.image),
      }));
  } catch (err: any) {
    ElMessage.error(err?.data?.message || err?.message || "加载我的邮票失败");
  }
};

onMounted(() => {
  loadStamps();
});
</script>
