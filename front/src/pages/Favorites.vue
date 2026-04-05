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
      <h1 class="font-headline text-xl font-bold text-primary">我的喜欢</h1>
    </header>

    <main class="max-w-7xl mx-auto px-4 pt-6">
      <div v-if="favorites.length === 0" class="flex items-center justify-center min-h-[60vh]">
        <div class="text-center">
          <Heart class="w-12 h-12 text-tertiary mx-auto mb-4 opacity-50" />
          <p class="text-tertiary font-body">还没有喜欢任何明信片</p>
        </div>
      </div>
      <div v-else class="waterfall-container">
        <div v-for="post in favorites" :key="post.id" class="postcard-item">
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
                @click.stop="removeFavorite(post.id)"
                class="flex items-center gap-1 text-red-500 transition-colors"
              >
                <Heart class="w-3.5 h-3.5" fill="currentColor" />
                <span class="text-[10px] font-medium">{{ getLikeCount(post) }}</span>
              </button>
            </div>
          </button>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { ChevronLeft, Heart } from "lucide-vue-next";
import { ElMessage } from "element-plus";
import { assetBaseURL } from "../utils/request.js";
import { getFavoritePostcards, togglePostcardLike } from "../api/postcard.js";

const favorites = ref<any[]>([]);

const resolveAssetUrl = (url?: string | null) => {
  if (!url) return "";
  if (/^(https?:)?\/\//.test(url) || url.startsWith("data:")) return url;
  return `${assetBaseURL}${url.startsWith("/") ? url : `/${url}`}`;
};

const loadFavorites = async () => {
  try {
    const res = await getFavoritePostcards({ page: 1, pageSize: 100 });
    favorites.value = (res.data?.list || []).map((item: any) => ({
      ...item,
      image: resolveAssetUrl(item.image),
      location: item.createdAt ? new Date(item.createdAt).toLocaleDateString("zh-CN") : "",
      aspect: item.aspectRatio === "2/3" ? "aspect-[2/3]" : "aspect-[3/2]",
    }));
  } catch (err: any) {
    ElMessage.error(err?.data?.message || err?.message || "加载收藏失败");
  }
};

const removeFavorite = async (id: number | string) => {
  try {
    await togglePostcardLike(id);
    favorites.value = favorites.value.filter((p) => String(p.id) !== String(id));
  } catch (err: any) {
    ElMessage.error(err?.data?.message || err?.message || "取消收藏失败");
  }
};

const getLikeCount = (post: any): number => post.likeCount || 0;

onMounted(() => {
  loadFavorites();
});
</script>