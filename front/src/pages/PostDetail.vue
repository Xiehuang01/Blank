<template>
  <div class="min-h-screen bg-background">
    <!-- Mobile Header -->
    <header
      class="md:hidden fixed top-0 left-0 right-0 z-50 flex items-center justify-between w-full px-4 h-16 bg-background/90 backdrop-blur-sm border-b border-primary/10"
    >
      <button
        @click="$router.back()"
        class="text-primary hover:text-secondary transition-colors"
      >
        <ChevronLeft class="w-6 h-6" />
      </button>
      <h1 class="font-headline text-lg font-bold text-primary truncate">{{ post?.title }}</h1>

    </header>

    <!-- Desktop Header -->
    <header
      class="hidden md:flex sticky top-0 z-40 items-center justify-between w-full px-4 h-16 bg-background/90 backdrop-blur-sm border-b border-primary/10"
    >
      <button
        @click="$router.back()"
        class="text-primary hover:text-secondary transition-colors"
      >
        <ChevronLeft class="w-6 h-6" />
      </button>
      <div></div>
    </header>

    <!-- Mobile Layout -->
    <main class="md:hidden px-4 pt-20 pb-24">
      <div v-if="post" class="space-y-6">
        <!-- Postcard Front (Image) -->
        <div class="relative w-full" :style="{ aspectRatio: imageAspectRatio }">
          <div class="absolute inset-0 rounded-none bg-white dark:bg-neutral p-3 border border-black/10 dark:border-white/10 shadow-lg overflow-hidden">
            <div class="w-full h-full relative bg-black/5 flex items-center justify-center rounded-sm">
              <img
                :src="post.image"
                :alt="post.title"
                class="w-full h-full object-cover"
                referrerpolicy="no-referrer"
              />
            </div>
          </div>
        </div>

        <!-- Postcard Back (Text side) -->
        <div class="relative w-full" :style="{ aspectRatio: imageAspectRatio }">
          <div class="absolute inset-0 rounded-none bg-white dark:bg-neutral p-5 flex border border-black/10 dark:border-white/10 shadow-lg">
            <!-- Left Side - Message -->
            <div class="flex-1 flex flex-col pr-5 border-r border-black/20 dark:border-white/20 relative overflow-hidden">
              <h4 class="font-headline text-xl tracking-widest text-black/60 dark:text-white/60 mb-2">POSTCARD</h4>
              <div class="relative flex-1">
                <div class="flex flex-col gap-8 h-full pt-6 pb-2">
                  <div class="w-full h-[1px] bg-black/10 dark:bg-white/10"></div>
                  <div class="w-full h-[1px] bg-black/10 dark:bg-white/10"></div>
                  <div class="w-full h-[1px] bg-black/10 dark:bg-white/10"></div>
                  <div class="w-full h-[1px] bg-black/10 dark:bg-white/10"></div>
                  <div class="w-full h-[1px] bg-black/10 dark:bg-white/10"></div>
                  <div class="w-full h-[1px] bg-black/10 dark:bg-white/10"></div>
                  <div class="w-full h-[1px] bg-black/10 dark:bg-white/10"></div>
                  <div class="w-full h-[1px] bg-black/10 dark:bg-white/10"></div>
                  <div class="w-full h-[1px] bg-black/10 dark:bg-white/10"></div>
                  <div class="w-full h-[1px] bg-black/10 dark:bg-white/10"></div>
                </div>
              </div>
            </div>

            <!-- Right Side - Address & Stamp -->
            <div class="flex-1 flex flex-col pl-5 relative">
              <div class="flex justify-end relative mb-4">
                <!-- Stamp placeholder -->
                <div class="w-20 h-24 border-[2px] border-black/30 dark:border-white/30 flex items-center justify-center relative bg-black/5 dark:bg-white/5 flex-shrink-0" style="border-style: dashed;">
                  <span class="text-xs font-bold text-black/40 dark:text-white/40">邮票</span>
                </div>
              </div>
              <div class="flex-1 flex flex-col justify-end gap-4 pb-2">
                <div class="flex items-end gap-3">
                  <span class="text-xs text-black/60 dark:text-white/60 font-body">to:</span>
                  <div class="flex-1 h-[1px] bg-black/20 dark:bg-white/20"></div>
                </div>
                <div class="w-full h-[1px] bg-black/20 dark:bg-white/20 mt-3"></div>
                <div class="flex items-end gap-3">
                  <span class="text-xs text-black/60 dark:text-white/60 font-body">from:</span>
                  <div class="flex-1 h-[1px] bg-black/20 dark:bg-white/20"></div>
                </div>
                <div class="w-full h-[1px] bg-black/20 dark:bg-white/20"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Mobile Stats -->
        <div class="flex gap-6">
          <button
            @click="toggleLike"
            class="flex items-center gap-2 transition-all duration-300"
            :class="isLiked ? 'text-red-500' : 'text-tertiary hover:text-primary'"
          >
            <Heart
              class="w-5 h-5"
              :fill="isLiked ? 'currentColor' : 'none'"
            />
            <span class="font-bold text-sm">{{ likeCount }}</span>
          </button>

          <div class="flex items-center gap-2 text-tertiary">
            <MessageCircle class="w-5 h-5" />
            <span class="font-bold text-sm">{{ post.comments || 0 }}</span>
          </div>
        </div>

        <!-- Comment Section -->
        <div class="space-y-4 pt-4">
          <h3 class="font-headline text-lg font-bold text-primary">评论</h3>
          
          <!-- Comments List -->
          <div class="space-y-3">
            <div
              v-for="(comment, index) in comments"
              :key="index"
              class="p-3 bg-black/5 dark:bg-white/5 rounded-lg"
            >
              <div class="flex items-center gap-2 mb-2">
                <div class="w-8 h-8 rounded-full bg-secondary/20 flex items-center justify-center">
                  <span class="text-xs font-bold text-secondary">{{ comment.author[0] }}</span>
                </div>
                <div>
                  <p class="text-sm font-bold text-primary">{{ comment.author }}</p>
                  <p class="text-xs text-tertiary">{{ comment.time }}</p>
                </div>
              </div>
              <p class="text-sm text-primary">{{ comment.text }}</p>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Mobile Footer Comment Input -->
    <footer class="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-background/90 backdrop-blur-sm border-t border-primary/10 px-4 py-3">
      <div class="flex gap-2 items-center">
        <button
          @click="toggleLike"
          class="flex-shrink-0 transition-all duration-300"
          :class="isLiked ? 'text-red-500' : 'text-tertiary hover:text-primary'"
        >
          <Heart
            class="w-5 h-5"
            :fill="isLiked ? 'currentColor' : 'none'"
          />
        </button>
        <input
          v-model="newComment"
          type="text"
          placeholder="写下你的评论..."
          class="flex-1 bg-black/5 dark:bg-white/5 border-none rounded-full py-2 px-4 text-sm font-body focus:ring-1 focus:ring-primary/20 placeholder:text-tertiary"
        />
        <button
          @click="addComment"
          class="px-4 py-2 bg-primary dark:bg-secondary text-white dark:text-black font-bold rounded-full hover:opacity-90 transition-opacity flex items-center justify-center flex-shrink-0"
        >
          <Send class="w-5 h-5" />
        </button>
      </div>
    </footer>

    <!-- Desktop Layout -->
    <main class="hidden md:block max-w-7xl mx-auto px-4 pt-6 pb-12">
      <div v-if="post" class="grid grid-cols-3 gap-8">
        <!-- Left Column - Postcards -->
        <div class="col-span-1 space-y-6">
          <!-- Postcard Front (Image) -->
          <div class="relative w-full" :style="{ aspectRatio: imageAspectRatio }">
            <div class="absolute inset-0 rounded-none bg-white dark:bg-neutral p-6 border border-black/10 dark:border-white/10 shadow-lg overflow-hidden">
              <div class="w-full h-full relative bg-black/5 flex items-center justify-center rounded-sm">
                <img
                  :src="post.image"
                  :alt="post.title"
                  class="w-full h-full object-cover"
                  referrerpolicy="no-referrer"
                />
              </div>
            </div>
          </div>

          <!-- Postcard Back (Text side) -->
          <div class="relative w-full" :style="{ aspectRatio: imageAspectRatio }">
            <div class="absolute inset-0 rounded-none bg-white dark:bg-neutral p-5 flex border border-black/10 dark:border-white/10 shadow-lg">
              <!-- Left Side - Message -->
              <div class="flex-1 flex flex-col pr-5 border-r border-black/20 dark:border-white/20 relative overflow-hidden">
                <h4 class="font-headline text-xl tracking-widest text-black/60 dark:text-white/60 mb-2">POSTCARD</h4>
                <div class="relative flex-1">
                  <div class="flex flex-col gap-8 h-full pt-6 pb-2">
                    <div class="w-full h-[1px] bg-black/10 dark:bg-white/10"></div>
                    <div class="w-full h-[1px] bg-black/10 dark:bg-white/10"></div>
                    <div class="w-full h-[1px] bg-black/10 dark:bg-white/10"></div>
                    <div class="w-full h-[1px] bg-black/10 dark:bg-white/10"></div>
                    <div class="w-full h-[1px] bg-black/10 dark:bg-white/10"></div>
                    <div class="w-full h-[1px] bg-black/10 dark:bg-white/10"></div>
                    <div class="w-full h-[1px] bg-black/10 dark:bg-white/10"></div>
                    <div class="w-full h-[1px] bg-black/10 dark:bg-white/10"></div>
                    <div class="w-full h-[1px] bg-black/10 dark:bg-white/10"></div>
                    <div class="w-full h-[1px] bg-black/10 dark:bg-white/10"></div>
                  </div>
                </div>
              </div>

              <!-- Right Side - Address & Stamp -->
              <div class="flex-1 flex flex-col pl-5 relative">
                <div class="flex justify-end relative mb-4">
                  <!-- Stamp placeholder -->
                  <div class="w-20 h-24 border-[2px] border-black/30 dark:border-white/30 flex items-center justify-center relative bg-black/5 dark:bg-white/5 flex-shrink-0" style="border-style: dashed;">
                    <span class="text-xs font-bold text-black/40 dark:text-white/40">邮票</span>
                  </div>
                </div>
                <div class="flex-1 flex flex-col justify-end gap-4 pb-2">
                  <div class="flex items-end gap-3">
                    <span class="text-xs text-black/60 dark:text-white/60 font-body">to:</span>
                    <div class="flex-1 h-[1px] bg-black/20 dark:bg-white/20"></div>
                  </div>
                  <div class="w-full h-[1px] bg-black/20 dark:bg-white/20 mt-3"></div>
                  <div class="flex items-end gap-3">
                    <span class="text-xs text-black/60 dark:text-white/60 font-body">from:</span>
                    <div class="flex-1 h-[1px] bg-black/20 dark:bg-white/20"></div>
                  </div>
                  <div class="w-full h-[1px] bg-black/20 dark:bg-white/20"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Right Column - Info & Comments -->
        <div class="col-span-2 space-y-6">
          <!-- Post Title -->
          <div>
            <h2 class="font-headline text-2xl font-bold text-primary mb-2">
              {{ post.title }}
            </h2>
          </div>

          <!-- Post Info -->
          <div class="space-y-4">
            <div>
              <p class="text-sm text-tertiary font-medium mb-2">
                {{ post.location }}
              </p>
            </div>

            <!-- Stats -->
            <div class="flex gap-6">
              <button
                @click="toggleLike"
                class="flex items-center gap-2 transition-all duration-300"
                :class="isLiked ? 'text-red-500' : 'text-tertiary hover:text-primary'"
              >
                <Heart
                  class="w-5 h-5"
                  :fill="isLiked ? 'currentColor' : 'none'"
                />
                <span class="font-bold text-sm">{{ likeCount }}</span>
              </button>

              <div class="flex items-center gap-2 text-tertiary">
                <MessageCircle class="w-5 h-5" />
                <span class="font-bold text-sm">{{ post.comments || 0 }}</span>
              </div>
            </div>
          </div>

          <!-- Comment Section -->
          <div class="space-y-4 pt-4 border-t border-black/10 dark:border-white/10">
            <h3 class="font-headline text-lg font-bold text-primary">评论</h3>
            
            <!-- Comments List -->
            <div class="space-y-3 max-h-96 overflow-y-auto">
              <div
                v-for="(comment, index) in comments"
                :key="index"
                class="p-3 bg-black/5 dark:bg-white/5 rounded-lg"
              >
                <div class="flex items-center gap-2 mb-2">
                  <div class="w-8 h-8 rounded-full bg-secondary/20 flex items-center justify-center">
                    <span class="text-xs font-bold text-secondary">{{ comment.author[0] }}</span>
                  </div>
                  <div>
                    <p class="text-sm font-bold text-primary">{{ comment.author }}</p>
                    <p class="text-xs text-tertiary">{{ comment.time }}</p>
                  </div>
                </div>
                <p class="text-sm text-primary">{{ comment.text }}</p>
              </div>
            </div>

            <!-- Comment Input -->
            <div class="flex gap-2 pt-4">
              <input
                v-model="newComment"
                type="text"
                placeholder="写下你的评论..."
                class="flex-1 bg-black/5 dark:bg-white/5 border-none rounded-full py-2 px-4 text-sm font-body focus:ring-1 focus:ring-primary/20 placeholder:text-tertiary"
              />
              <button
                @click="addComment"
                class="px-4 py-2 bg-primary dark:bg-secondary text-white dark:text-black font-bold rounded-full hover:opacity-90 transition-opacity"
              >
                发送
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import { ChevronLeft, Heart, MessageCircle, X, Send } from "lucide-vue-next";

const route = useRoute();
const post = ref<any>(null);
const isLiked = ref(false);
const likeCount = ref(0);
const newComment = ref("");
const imageAspectRatio = ref("3/2");
const comments = ref<any[]>([
  {
    author: "张三",
    time: "2小时前",
    text: "这张明信片真的太美了！",
  },
  {
    author: "李四",
    time: "1小时前",
    text: "收藏价值很高，推荐！",
  },
]);

onMounted(() => {
  window.scrollTo(0, 0);
  const postId = route.params.id;
  loadPost(postId);
});

const loadPost = (id: any) => {
  const posts = [
    {
      id: 1,
      title: "Silent Hallway",
      location: "Kyoto, Japan",
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuBMKuwdrzd0kycg5QbGFmMJMDT8RsE6UNc85oboGn-Tofw_7BqW1Fr1AxqgdIPVAOliVNVYW_xxX0D9w4teG8vu716EueLdlhtDZNMzx4AmtF6xpsxUovOnN9vxwxh4HShX2hixpG3URlodGZn0CCfMvapoqBDQoMNPiYZ7qRUDV_u5MqQexSdA1w6diNCYt21t14DqvZwE3JkN7udert8x6WNdDwaS9gdJzPKoMDZmPcvKSVzXPcgpoOY3CCfVKFU3sqia8imIUDUG",
      likes: 342,
      comments: 28,
    },
    {
      id: 2,
      title: "Horizon Line",
      location: "Expedition 04",
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuD8esTrkcudCbjzxuyIIZl0OCZpj1YT0KrcsHLaFrj43bnf3Yyf1EG7V2yrCFBiQJK_VMmMd5xZhxjcmY85_K-f3XyDDmIxud0i4ZezXKMBuMwEqvSQtj3Siz08fk9w-dqNpBzh7L7aQUeOx5qtP7b7xOX0rbyi563zBqiOlcDN2Q9U5FKt-KltCVOYDRP7g3Ed3QL9fU9JY6-I1HARQriDG_92_H4iVMyiV6Lsnf7cEnK1_Dy0rY0plcdR2YAIPfEZgGmPRYvzw_V5",
      likes: 128,
      comments: 15,
    },
    {
      id: 3,
      title: "Misty Peaks",
      location: "Alpine Morning",
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuA0i-x6RyD7D2rgu2L8AzwaNHZzBYtWuJj6TtriMJjqVRxLpFGpCq4NIH2Grin9XOy8Pd3vjY8zFfJ35c0h20F0IrFtD7y28Xd9NfXGoploNukwtK3NgoPGEa7VSOEBh4KD4kyXVIRQ0jWYVLO2kJHCx9n8kcXqOQdi-Nd68yzmGnwkZBGhLGX0_S9Cu8AfSXzjBlGzXqf8l2XI-wAwWqxhTz_RASrcIKtt1Bdh6wqEzNFbMHjXcTtyd41-AhHu91wpD4qb4WLcp1F2",
      likes: 856,
      comments: 42,
    },
    {
      id: 4,
      title: "Single Bloom",
      location: "Botanical Series",
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuBnUhh60TiT7aekmcLcT4l_yIZOLue3dmhExmphjrn1fS3VZTrDAv2lbSz6059VL7VGYbj-rv9_i-a1MIdVEDnRSYMX2KMJHvlExgAM1Ve24Mpbi0OYM-RD0ZeF-iO7SG-b04WRIc1xMmC_aDQStq7yjMkkY2PTeqxfqehT_Lr2H3JDCZ48bzFj4pMkgu653P__1D9wlGCUu7oBr85cnBGBS5U3tk7iQ0IRtow3JTzH79CSEPytQNknDAx3BGxkfY6jR7U3m_ZfqidY",
      likes: 42,
      comments: 8,
    },
    {
      id: 5,
      title: "Quiet Afternoon",
      location: "Interior Study",
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuACTQfqd5zXW2cKBxVnuuNO9i9sq9Pk5JxreFwtXeFdwc2pIGVpcU8BSfkdg66pV8mXppMTUSNe2TNBt-8TAoJ_2qqGJdzR_AFhAht55cKNTHZl4J9MiGOF0m0GQeEaxBa0yPxLxlEqKz087elMQkmKsxl-N_MVFnQRLbTNconhVSYMHMKpzscx-mjg_lrzPMKbISEr9Tkei_ZxplmcGlDa-zn-f5Au102bOzwcGfBXkE4OHYlcPjh2knYoakUw-Zw564zPDVLeUzRI",
      likes: 215,
      comments: 18,
    },
    {
      id: 6,
      title: "Golden Solitude",
      location: "Tuscany, Italy",
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuBpQB1UjhAO6vKRAmMCZ3S-ZXr4gDQlqg5p_W8s3VQpSmvRI8ZFWb77GoNBv1pQSFrp29yzGKO7ToSmCsWu9eNOaU_yX73rDlmxzzYR-EYGqNvFUE9GU6-pML47z4gssxtjKw_D_hu5YoklvsjsZ5dZrTS2IeRIP-gSHZcX3uPab0dieLB1NT001ypZsLjEHGBoDGCLhP1xeR5D_2qEjeG2fSwr4mRFlZdTvCOPQXRPk_odlghJSqkYkSEVqyTj6SUXh89WxKOTVryA",
      likes: 567,
      comments: 35,
    },
    {
      id: 7,
      title: "Still Waters",
      location: "Nordic Summer",
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuBd6X2WJj88uA-1RVrxPORBU5AZOzg0nPJE0215heBs15OL-FE5V0Emhxn5a0nfklc9t6clO3mSiIjAFO0I0Mu6Y2NWyuafRtrW3L14crLdzu4cKDxHP18lUsiFqiPeocxG9WI6YO4O4sNEKukHmVSUdMlVnvlI-UWmX3fegWKNND6QcgHxDuYmLtaJ0Wtz_zWoy5sgdMRBUu-O97TbNR-8JnQ8bWqrJpMMyC0G6wyiLUlrmBrDU1-IrnmebQHtx7qpfUFYV-XhueBQ",
      likes: 89,
      comments: 12,
    },
    {
      id: 8,
      title: "Exhibition No. 1",
      location: "Parisian Space",
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuA4U7Ek60wAah3qefguCpTutfJJZhFfS_ix4T5iFiFXnnNWiveiB71-3Q8Yu3Lr33vGg_jfwu5tDvu9-9FWhic64iKpeBqfAc6O9o9grdYjSsYzDvJhxNa31crJ4cDkITQzVlkp0l7prnAn4ekzapcu1pPpcnTcHH5W6Vo4WSVoOJT1rGVM_RSIw_DstVkzOX3Qnatn3Q2tzxWirXUsJfbfxtwdY7MlnvVaCTaPRo3P2OHDE-6FyIK_FQHwgDrtO2U-Twwx9tP4drm-",
      likes: 1024,
      comments: 89,
    },
  ];

  const found = posts.find((p) => p.id === parseInt(id as string));
  if (found) {
    post.value = found;
    likeCount.value = found.likes;
    
    // 检测图片宽高比
    const img = new Image();
    img.onload = () => {
      const ratio = img.width / img.height;
      // 如果宽高比小于 1，说明是竖图
      if (ratio < 1) {
        imageAspectRatio.value = `${img.width}/${img.height}`;
      } else {
        imageAspectRatio.value = `${img.width}/${img.height}`;
      }
    };
    img.onerror = () => {
      // 如果图片加载失败，使用默认比例
      imageAspectRatio.value = "3/2";
    };
    img.src = found.image;
  }
};

const toggleLike = () => {
  isLiked.value = !isLiked.value;
  likeCount.value += isLiked.value ? 1 : -1;
};

const addComment = () => {
  if (newComment.value.trim()) {
    comments.value.push({
      author: "我",
      time: "刚刚",
      text: newComment.value,
    });
    newComment.value = "";
  }
};
</script>
