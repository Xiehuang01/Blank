<template>
  <div class="min-h-screen bg-background pb-24">
    <header
      class="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-6 h-16 bg-background border-b border-primary/10 gap-4"
    >
      <button @click="router.push('/my-stamps')" class="text-tertiary hover:text-primary transition-colors flex items-center justify-center">
        <Archive class="w-5 h-5" />
      </button>
      <div class="relative flex-1">
        <Search
          class="absolute left-3 top-1/2 -translate-y-1/2 text-tertiary w-4 h-4"
        />
        <input
          v-model.trim="searchKeyword"
          type="text"
          placeholder="搜索邮票名称、描述..."
          class="w-full bg-black/5 dark:bg-white/5 border-none rounded-full py-1.5 pl-9 pr-4 text-sm font-body focus:ring-1 focus:ring-primary/20 focus:outline-none placeholder:text-tertiary"
        />
        </div>
      <div
        class="flex items-center bg-black/5 dark:bg-white/5 px-4 py-1.5 rounded-full border border-black/10 dark:border-white/10 shrink-0"
      >
        <span class="text-xs font-semibold text-secondary mr-2">邮分</span>
        <span class="text-sm font-bold text-primary tracking-tight">{{ userInfo?.coins ?? 0 }}</span>
      </div>
    </header>

    <!-- Tabs -->
    <div class="fixed top-16 left-0 w-full z-40 bg-background border-b border-primary/10 px-4 py-3">
      <div class="max-w-7xl mx-auto flex justify-center">
        <div 
          class="relative flex w-fit flex-col items-center rounded-full py-2 select-none"
          :style="{ backgroundColor: 'rgb(250, 246, 240)', borderColor: 'rgb(237, 236, 234)', borderWidth: '1px' }"
          @mousedown="onTabMouseDown"
          @touchstart="onTabTouchStart"
        >
          <!-- Active Layer (Clipped) -->
          <div
            ref="tabContainerRef"
            class="absolute inset-0 z-10 w-full overflow-hidden pointer-events-none"
            :style="{ clipPath: tabClipPath, transition: isDraggingTab ? 'none' : 'clip-path 0.25s ease', backgroundColor: 'rgb(193, 122, 103)', borderRadius: '9999px' }"
          >
            <div class="relative flex w-full justify-center px-4 py-2">
              <button
                v-for="(tab, index) in tabs"
                :key="index"
                class="flex h-8 items-center rounded-full px-3 text-sm font-medium whitespace-nowrap"
                :style="{ color: 'rgb(237, 236, 234)' }"
                tabindex="-1"
              >
                {{ tab }}
              </button>
            </div>
          </div>

          <!-- Background Layer -->
          <div class="relative flex w-full justify-center px-4">
            <button
              v-for="(tab, index) in tabs"
              :key="index"
              :ref="el => { 
                if (el) tabRefs[index] = el as HTMLButtonElement;
                if (activeTab === tab) activeTabRef = el as HTMLButtonElement;
              }"
              @click="setActiveTab(tab)"
              class="flex h-8 items-center cursor-pointer rounded-full px-3 text-sm font-medium whitespace-nowrap transition-colors"
              :style="{ color: '#3b4d61' }"
            >
              {{ tab }}
            </button>
          </div>
        </div>
      </div>
      </div>

    <main class="pt-40 pb-24 px-4 max-w-7xl mx-auto">
      <div v-if="isLoading" class="w-full h-[60vh] flex items-center justify-center">
        <Loading class="!h-full !bg-transparent" />
      </div>
      <div v-else>
        <div v-if="filteredStamps.length > 0" class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-6">
          <div
            v-for="stamp in filteredStamps"
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
                <span>持有 {{ stamp.ownedQuantity ?? 0 }} 张</span>
                <span>每日限购 1 张</span>
              </div>

              <div class="mt-auto">
                <button
                  @click="purchaseStamp(stamp)"
                  :disabled="stamp.purchasedToday"
                  class="w-full py-1.5 px-2 text-xs sm:text-sm font-bold rounded-md transition-all duration-300 shadow-sm text-center"
                  :class="stamp.purchasedToday
                    ? 'bg-black/5 dark:bg-white/5 text-tertiary cursor-not-allowed'
                    : 'bg-primary dark:bg-secondary hover:bg-primary/90 dark:hover:bg-secondary/90 active:scale-95'"
                  :style="!stamp.purchasedToday ? (isDark ? { color: '#000' } : { color: '#fff' }) : undefined"
                >
                  {{ stamp.purchasedToday ? '今日已购' : '购入' }}
                </button>
              </div>
            </div>
          </div>
        </div>
        <div v-else class="flex min-h-[50vh] items-center justify-center">
          <p class="text-sm text-tertiary">
            {{ searchKeyword ? '没有找到相关邮票' : '当前分类暂无邮票' }}
          </p>
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
import { ref, onMounted, watch, nextTick, onUnmounted } from "vue";
import { Search, Archive } from "lucide-vue-next";
import { ElMessage } from "element-plus";
import { useRouter } from 'vue-router';
import { getStamps, purchaseStamp as purchaseStampApi } from '../api/stamp.js';
import { assetBaseURL } from '../utils/request.js';
import { useUser } from '../store/user';
import Loading from '../components/Loading.vue';

const router = useRouter();
const { userInfo, updateUser } = useUser();

const selectedImage = ref<string | null>(null);
const isDark = ref(false);
const allStamps = ref<any[]>([]);
const filteredStamps = ref<any[]>([]);
const searchKeyword = ref('');
const isLoading = ref(true);


// Tab state
const tabs = ref(['全部', '四季', '猫狗', '天气', '心情']);
const activeTab = ref('全部');
const tabContainerRef = ref<HTMLDivElement | null>(null);
const activeTabRef = ref<HTMLButtonElement | null>(null);
const tabRefs = ref<HTMLButtonElement[]>([]);
const tabClipPath = ref('inset(0 75% 0 0 round 9999px)');

// Tab drag state
const isDraggingTab = ref(false);
const tabStartX = ref(0);
const tabCurrentX = ref(0);
const tabDragOffset = ref(0);

const updateTabClipPath = (customOffset = 0) => {
  const container = tabContainerRef.value;
  const activeTabElement = activeTabRef.value;

  if (container && activeTabElement) {
    const { offsetLeft, offsetWidth } = activeTabElement;
    const clipLeft = offsetLeft + customOffset;
    const clipRight = offsetLeft + offsetWidth + customOffset;

    tabClipPath.value = `inset(0 ${Number(
      100 - (clipRight / container.offsetWidth) * 100,
    ).toFixed(2)}% 0 ${Number(
      (clipLeft / container.offsetWidth) * 100,
    ).toFixed(2)}% round 9999px)`;
  }
};

watch(() => activeTab.value, async () => {
  await nextTick();
  updateTabClipPath();
  updateFilteredStamps();
});

watch(() => searchKeyword.value, () => {
  updateFilteredStamps();
});

onMounted(async () => {
  await nextTick();
  if (tabContainerRef.value) {
    tabContainerRef.value.style.transition = 'none';
  }
  updateTabClipPath();
  try {
    await loadStamps();
  } catch (err: any) {
    ElMessage.error(err?.data?.message || err?.message || '加载邮票失败');
  }
  if (tabContainerRef.value) {
    tabContainerRef.value.style.transition = isDraggingTab.value ? 'none' : 'clip-path 0.25s ease';
  }

  const checkDark = () => {
    isDark.value = document.documentElement.classList.contains('dark');
  };
  checkDark();

  const observer = new MutationObserver(checkDark);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

  window.addEventListener('mousemove', handleTabMouseMove);
  window.addEventListener('mouseup', handleTabMouseUp);
  window.addEventListener('touchmove', handleTabTouchMove, { passive: false });
  window.addEventListener('touchend', handleTabTouchEnd);
});

onUnmounted(() => {
  window.removeEventListener('mousemove', handleTabMouseMove);
  window.removeEventListener('mouseup', handleTabMouseUp);
  window.removeEventListener('touchmove', handleTabTouchMove);
  window.removeEventListener('touchend', handleTabTouchEnd);
});

const categoryMap: Record<string, string[]> = {
  '四季': ['春', '夏', '秋', '冬'],
  '猫狗': ['狗狗', '咪咪'],
  '天气': ['晴天', '雨天'],
  '心情': ['开心', '伤心'],
};

const resolveAssetUrl = (url?: string | null) => {
  if (!url) return '';
  if (/^(https?:)?\/\//.test(url) || url.startsWith('data:')) return url;
  return `${assetBaseURL}${url.startsWith('/') ? url : `/${url}`}`;
};

const updateFilteredStamps = () => {
  let nextStamps = [...allStamps.value];

  if (activeTab.value !== '全部') {
    const keywords = categoryMap[activeTab.value] || [];
    nextStamps = nextStamps.filter((stamp) => {
      const content = [stamp.title, stamp.desc, stamp.seriesId]
        .filter(Boolean)
        .join(' ');

      return stamp.seriesId === activeTab.value || keywords.some((keyword) => content.includes(keyword));
    });
  }

  const keyword = searchKeyword.value.trim().toLowerCase();
  if (keyword) {
    nextStamps = nextStamps.filter((stamp) => {
      const content = [stamp.title, stamp.desc, stamp.seriesId]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

      return content.includes(keyword);
    });
  }

  filteredStamps.value = nextStamps;
};

const loadStamps = async () => {
  isLoading.value = true;
  try {
    const res = await getStamps();
    allStamps.value = (res.data || []).map((stamp: any) => ({
      ...stamp,
      image: resolveAssetUrl(stamp.image),
    }));
    updateFilteredStamps();
  } finally {
    isLoading.value = false;
  }
};


const setActiveTab = (tab: string) => {
  activeTab.value = tab;
};

const handleTabStart = (clientX: number) => {
  isDraggingTab.value = true;
  tabStartX.value = clientX;
  tabCurrentX.value = clientX;
  tabDragOffset.value = 0;
};

const handleTabMove = (clientX: number) => {
  if (!isDraggingTab.value) return;
  
  tabCurrentX.value = clientX;
  tabDragOffset.value = tabCurrentX.value - tabStartX.value;
  updateTabClipPath(tabDragOffset.value);
};

const handleTabEnd = () => {
  if (!isDraggingTab.value) return;
  
  isDraggingTab.value = false;

  if (activeTabRef.value && tabContainerRef.value) {
    const currentVisualLeft = activeTabRef.value.offsetLeft + tabDragOffset.value;
    const currentVisualCenter = currentVisualLeft + activeTabRef.value.offsetWidth / 2;

    let closestTab = tabs.value[0];
    let minDistance = Infinity;

    tabRefs.value.forEach((tabEl, index) => {
      if (tabEl) {
        const tabCenter = tabEl.offsetLeft + tabEl.offsetWidth / 2;
        const distance = Math.abs(currentVisualCenter - tabCenter);
        if (distance < minDistance) {
          minDistance = distance;
          closestTab = tabs.value[index];
        }
      }
    });

    if (closestTab === activeTab.value) {
      updateTabClipPath();
    } else {
      setActiveTab(closestTab);
    }
  } else {
    updateTabClipPath();
  }
  
  tabDragOffset.value = 0;
};

const onTabMouseDown = (e: MouseEvent) => handleTabStart(e.clientX);
const handleTabMouseMove = (e: MouseEvent) => handleTabMove(e.clientX);
const handleTabMouseUp = () => handleTabEnd();

const onTabTouchStart = (e: TouchEvent) => handleTabStart(e.touches[0].clientX);
const handleTabTouchMove = (e: TouchEvent) => {
  if (isDraggingTab.value) {
    e.preventDefault();
    handleTabMove(e.touches[0].clientX);
  }
};
const handleTabTouchEnd = () => handleTabEnd();

const purchaseStamp = async (stamp: any) => {
  if (stamp.purchasedToday) {
    ElMessage.warning('这张邮票今天已经购买过了');
    return;
  }

  try {
    const res = await purchaseStampApi(stamp.id, 1);
    if (typeof res.data?.coins === 'number') {
      updateUser({ coins: res.data.coins });
    }
    await loadStamps();
    ElMessage.success(res.message || '购入成功');
  } catch (err: any) {
    ElMessage.error(err?.data?.message || err?.message || '购买失败');
  }
};
</script>
