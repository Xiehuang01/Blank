<template>
  <div class="min-h-screen bg-background pb-24">
    <header
      class="sticky top-0 z-40 flex justify-between items-center w-full px-4 h-16 bg-background/90 backdrop-blur-sm border-b border-primary/10"
    >
      <div class="flex items-center gap-4">
        <button
          @click="activeTab = '发现'"
          :class="['text-lg transition-colors', activeTab === '发现' ? 'font-headline font-bold text-primary' : 'font-headline font-medium text-tertiary hover:text-secondary']"
        >
          发现
        </button>
        <button
          @click="activeTab = '漂流传递'"
          :class="['text-lg transition-colors', activeTab === '漂流传递' ? 'font-headline font-bold text-primary' : 'font-headline font-medium text-tertiary hover:text-secondary']"
        >
          漂流传递
        </button>
      </div>
      <div class="relative w-48">
        <Search
          class="absolute left-3 top-1/2 -translate-y-1/2 text-tertiary w-4 h-4"
        />
        <input
          v-model.trim="searchQuery"
          type="text"
          placeholder="搜索明信片..."
          class="w-full bg-black/5 border-none rounded-full py-1.5 pl-9 pr-4 text-sm font-body focus:ring-1 focus:ring-primary/20 placeholder:text-tertiary"
        />
      </div>
    </header>

    <main class="max-w-7xl mx-auto px-4 pt-6">
      <div v-if="isLoading" class="fixed inset-0 z-50 flex items-center justify-center bg-background">
        <Loading class="!h-full !bg-transparent" />
      </div>
      <div v-else-if="postcards.length === 0" class="flex flex-col items-center justify-center py-32 text-tertiary">
        <Inbox class="w-16 h-16 mb-4 opacity-50" />
        <p class="text-sm font-medium">暂无{{ activeTab === '发现' ? '明信片' : '漂流传递' }}</p>
        <p class="text-xs mt-1 opacity-70" v-if="activeTab === '发现'">快去创建第一张明信片吧</p>
      </div>
      <div v-else-if="filteredPostcards.length === 0" class="flex flex-col items-center justify-center py-32 text-tertiary">
        <Search class="w-12 h-12 mb-4 opacity-40" />
        <p class="text-sm font-medium">未找到相关明信片</p>
      </div>
      <div v-else class="waterfall-container">
        <div v-for="post in filteredPostcards" :key="post.id" class="postcard-item">
          <button
            @click="$router.push(`/post/${post.id}`)"
            class="bg-white p-2 shadow-sm rounded-sm hover:shadow-md transition-shadow duration-300 border border-black/5 w-full text-left"
          >
            <div :class="[post.aspect, 'overflow-hidden bg-black/5']">
              <img
                :src="post.image"
                :alt="post.title"
                class="w-full h-full object-cover"
                :style="post.imageOffset ? { transform: `translate(${post.imageOffset.x}px, ${post.imageOffset.y}px) scale(${post.imageScale || 1}) rotate(${post.imageRotation || 0}deg)` } : {}"
                referrerpolicy="no-referrer"
              />
            </div>
            <div class="pt-3 pb-1 px-1 flex justify-between items-end">
              <div>
                <p class="font-headline text-xs text-primary font-medium">
                  {{ post.title }}
                </p>
                <p class="font-body text-[10px] text-tertiary mt-0.5">
                  {{ post.location }}
                </p>
              </div>
              <button
                @click.stop="toggleLike(post)"
                class="flex items-center gap-1 transition-colors"
                :class="isLiked(post.id) ? 'text-red-500' : 'text-tertiary hover:text-secondary'"
              >
                <Heart class="w-3.5 h-3.5" :fill="isLiked(post.id) ? 'currentColor' : 'none'" />
                <span class="text-[10px] font-medium">{{ getLikeCount(post.id) }}</span>
              </button>
            </div>
          </button>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch, onMounted, onActivated } from "vue";
import { Search, Heart, Inbox } from "lucide-vue-next";
import { ElMessage } from "element-plus";
import Loading from "../components/Loading.vue";
import { assetBaseURL } from "../utils/request.js";
import { getDiscoverPostcards, getDriftingPostcards, togglePostcardLike } from "../api/postcard.js";

const activeTab = ref("发现");
const postcards = ref<any[]>([]);
const searchQuery = ref("");
const isLoading = ref(true);
let hasHomeActivated = false;


const resolveAssetUrl = (url?: string | null) => {
  if (!url) return "";
  if (/^(https?:)?\/\//.test(url) || url.startsWith("data:")) return url;
  return `${assetBaseURL}${url.startsWith("/") ? url : `/${url}`}`;
};

const mapPost = (item: any) => ({
  ...item,
  image: resolveAssetUrl(item.image),
  location: item.createdAt ? new Date(item.createdAt).toLocaleDateString("zh-CN") : "",
  aspect: item.aspectRatio === "2/3" ? "aspect-[2/3]" : "aspect-[3/2]",
});

const filteredPostcards = computed(() => {
  const keyword = searchQuery.value.trim().toLowerCase();
  if (!keyword) return postcards.value;

  return postcards.value.filter((post) => {
    const content = [post.title, post.location, post.id]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    return content.includes(keyword);
  });
});

const loadPostcards = async () => {
  isLoading.value = true;
  try {
    const fn = activeTab.value === "发现" ? getDiscoverPostcards : getDriftingPostcards;
    const res = await fn({ page: 1, pageSize: 100 });
    postcards.value = (res.data?.list || []).map(mapPost);
  } catch (err: any) {
    ElMessage.error(err?.data?.message || err?.message || "加载明信片失败");
  } finally {
    isLoading.value = false;
  }
};

const isLiked = (id: number | string) => postcards.value.find((p) => String(p.id) === String(id))?.isLiked;

const getLikeCount = (id: number | string): number => {
  return postcards.value.find((p) => String(p.id) === String(id))?.likeCount || 0;
};

const toggleLike = async (post: any) => {
  try {
    const res = await togglePostcardLike(post.id);
    post.isLiked = !!res.data?.isLiked;
    post.likeCount = res.data?.likeCount ?? post.likeCount;
  } catch (err: any) {
    ElMessage.error(err?.data?.message || err?.message || "操作失败");
  }
};

watch(activeTab, () => {
  loadPostcards();
});

onMounted(() => {
  loadPostcards();
});

onActivated(() => {
  if (!hasHomeActivated) {
    hasHomeActivated = true;
    return;
  }
  loadPostcards();
});
</script>
