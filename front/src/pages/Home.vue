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
          @click="activeTab = '同城'"
          :class="['text-lg transition-colors', activeTab === '同城' ? 'font-headline font-bold text-primary' : 'font-headline font-medium text-tertiary hover:text-secondary']"
        >
          同城
        </button>
      </div>
      <div class="relative w-48">
        <Search
          class="absolute left-3 top-1/2 -translate-y-1/2 text-tertiary w-4 h-4"
        />
        <input
          type="text"
          placeholder="Search..."
          class="w-full bg-black/5 border-none rounded-full py-1.5 pl-9 pr-4 text-sm font-body focus:ring-1 focus:ring-primary/20 placeholder:text-tertiary"
        />
      </div>
    </header>

    <main class="max-w-7xl mx-auto px-4 pt-6">
      <div class="waterfall-container">
        <div v-for="post in postcards" :key="post.id" class="postcard-item">
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
import { ref, computed, onMounted } from "vue";
import { Search, Heart } from "lucide-vue-next";

const activeTab = ref("发现");
const userPublicCards = ref<any[]>([]);

onMounted(() => {
  const stored = localStorage.getItem('userPostcards');
  if (stored) {
    const all = JSON.parse(stored);
    userPublicCards.value = all
      .filter((c: any) => c.isPublic)
      .map((c: any) => ({
        id: c.id,
        title: c.title || '无标题明信片',
        location: new Date(c.createdAt).toLocaleDateString('zh-CN'),
        image: c.image,
        imageOffset: c.imageOffset,
        imageScale: c.imageScale,
        imageRotation: c.imageRotation,
        aspect: c.aspectRatio === '2/3' ? 'aspect-[2/3]' : 'aspect-[3/2]',
        likes: 0,
      }));
  }
});

const postcards = computed(() => [
  ...userPublicCards.value,
  ...sampleCards,
]);

const likedIds = ref<Set<number | string>>(new Set());
const likedCountMap = ref<Map<number | string, number>>(new Map());

onMounted(() => {
  const stored = localStorage.getItem('userPostcards');
  if (stored) {
    const all = JSON.parse(stored);
    userPublicCards.value = all
      .filter((c: any) => c.isPublic)
      .map((c: any) => ({
        id: c.id,
        title: c.title || '无标题明信片',
        location: new Date(c.createdAt).toLocaleDateString('zh-CN'),
        image: c.image,
        imageOffset: c.imageOffset,
        imageScale: c.imageScale,
        imageRotation: c.imageRotation,
        aspect: 'aspect-[3/2]',
        likes: 0,
      }));
  }

  const storedLikes = localStorage.getItem('likedPostcards');
  if (storedLikes) {
    const liked = JSON.parse(storedLikes);
    likedIds.value = new Set(liked.map((p: any) => p.id));
    // 计算每个帖子的点赞数（基础点赞 + 用户点赞数）
    sampleCards.forEach(card => {
      const userLikes = liked.filter((p: any) => p.id === card.id).length;
      likedCountMap.value.set(card.id, card.likes + userLikes);
    });
    userPublicCards.value.forEach(card => {
      const userLikes = liked.filter((p: any) => p.id === card.id).length;
      likedCountMap.value.set(card.id, 0 + userLikes);
    });
  } else {
    sampleCards.forEach(card => {
      likedCountMap.value.set(card.id, card.likes);
    });
  }
});

const isLiked = (id: number | string) => likedIds.value.has(id);

const getLikeCount = (id: number | string): number => {
  return likedCountMap.value.get(id) || 0;
};

const toggleLike = (post: any) => {
  if (likedIds.value.has(post.id)) {
    likedIds.value.delete(post.id);
    const storedLikes = localStorage.getItem('likedPostcards');
    if (storedLikes) {
      const liked = JSON.parse(storedLikes).filter((p: any) => p.id !== post.id);
      localStorage.setItem('likedPostcards', JSON.stringify(liked));
    }
    // 更新计数
    const current = likedCountMap.value.get(post.id) || 0;
    likedCountMap.value.set(post.id, current - 1);
  } else {
    likedIds.value.add(post.id);
    const storedLikes = localStorage.getItem('likedPostcards');
    const liked = storedLikes ? JSON.parse(storedLikes) : [];
    liked.push(post);
    localStorage.setItem('likedPostcards', JSON.stringify(liked));
    // 更新计数
    const current = likedCountMap.value.get(post.id) || 0;
    likedCountMap.value.set(post.id, current + 1);
  }
};

const sampleCards = [
  {
    id: 1,
    title: "Silent Hallway",
    location: "Kyoto, Japan",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBMKuwdrzd0kycg5QbGFmMJMDT8RsE6UNc85oboGn-Tofw_7BqW1Fr1AxqgdIPVAOliVNVYW_xxX0D9w4teG8vu716EueLdlhtDZNMzx4AmtF6xpsxUovOnN9vxwxh4HShX2hixpG3URlodGZn0CCfMvapoqBDQoMNPiYZ7qRUDV_u5MqQexSdA1w6diNCYt21t14DqvZwE3JkN7udert8x6WNdDwaS9gdJzPKoMDZmPcvKSVzXPcgpoOY3CCfVKFU3sqia8imIUDUG",
    aspect: "aspect-[3/4]",
    likes: 342,
  },
  {
    id: 2,
    title: "Horizon Line",
    location: "Expedition 04",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuD8esTrkcudCbjzxuyIIZl0OCZpj1YT0KrcsHLaFrj43bnf3Yyf1EG7V2yrCFBiQJK_VMmMd5xZhxjcmY85_K-f3XyDDmIxud0i4ZezXKMBuMwEqvSQtj3Siz08fk9w-dqNpBzh7L7aQUeOx5qtP7b7xOX0rbyi563zBqiOlcDN2Q9U5FKt-KltCVOYDRP7g3Ed3QL9fU9JY6-I1HARQriDG_92_H4iVMyiV6Lsnf7cEnK1_Dy0rY0plcdR2YAIPfEZgGmPRYvzw_V5",
    aspect: "aspect-[4/3]",
    likes: 128,
  },
  {
    id: 3,
    title: "Misty Peaks",
    location: "Alpine Morning",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuA0i-x6RyD7D2rgu2L8AzwaNHZzBYtWuJj6TtriMJjqVRxLpFGpCq4NIH2Grin9XOy8Pd3vjY8zFfJ35c0h20F0IrFtD7y28Xd9NfXGoploNukwtK3NgoPGEa7VSOEBh4KD4kyXVIRQ0jWYVLO2kJHCx9n8kcXqOQdi-Nd68yzmGnwkZBGhLGX0_S9Cu8AfSXzjBlGzXqf8l2XI-wAwWqxhTz_RASrcIKtt1Bdh6wqEzNFbMHjXcTtyd41-AhHu91wpD4qb4WLcp1F2",
    aspect: "aspect-[4/3]",
    likes: 856,
  },
  {
    id: 4,
    title: "Single Bloom",
    location: "Botanical Series",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBnUhh60TiT7aekmcLcT4l_yIZOLue3dmhExmphjrn1fS3VZTrDAv2lbSz6059VL7VGYbj-rv9_i-a1MIdVEDnRSYMX2KMJHvlExgAM1Ve24Mpbi0OYM-RD0ZeF-iO7SG-b04WRIc1xMmC_aDQStq7yjMkkY2PTeqxfqehT_Lr2H3JDCZ48bzFj4pMkgu653P__1D9wlGCUu7oBr85cnBGBS5U3tk7iQ0IRtow3JTzH79CSEPytQNknDAx3BGxkfY6jR7U3m_ZfqidY",
    aspect: "aspect-[3/4]",
    likes: 42,
  },
  {
    id: 5,
    title: "Quiet Afternoon",
    location: "Interior Study",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuACTQfqd5zXW2cKBxVnuuNO9i9sq9Pk5JxreFwtXeFdwc2pIGVpcU8BSfkdg66pV8mXppMTUSNe2TNBt-8TAoJ_2qqGJdzR_AFhAht55cKNTHZl4J9MiGOF0m0GQeEaxBa0yPxLxlEqKz087elMQkmKsxl-N_MVFnQRLbTNconhVSYMHMKpzscx-mjg_lrzPMKbISEr9Tkei_ZxplmcGlDa-zn-f5Au102bOzwcGfBXkE4OHYlcPjh2knYoakUw-Zw564zPDVLeUzRI",
    aspect: "aspect-[3/4]",
    likes: 215,
  },
  {
    id: 6,
    title: "Golden Solitude",
    location: "Tuscany, Italy",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBpQB1UjhAO6vKRAmMCZ3S-ZXr4gDQlqg5p_W8s3VQpSmvRI8ZFWb77GoNBv1pQSFrp29yzGKO7ToSmCsWu9eNOaU_yX73rDlmxzzYR-EYGqNvFUE9GU6-pML47z4gssxtjKw_D_hu5YoklvsjsZ5dZrTS2IeRIP-gSHZcX3uPab0dieLB1NT001ypZsLjEHGBoDGCLhP1xeR5D_2qEjeG2fSwr4mRFlZdTvCOPQXRPk_odlghJSqkYkSEVqyTj6SUXh89WxKOTVryA",
    aspect: "aspect-[4/3]",
    likes: 567,
  },
  {
    id: 7,
    title: "Still Waters",
    location: "Nordic Summer",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBd6X2WJj88uA-1RVrxPORBU5AZOzg0nPJE0215heBs15OL-FE5V0Emhxn5a0nfklc9t6clO3mSiIjAFO0I0Mu6Y2NWyuafRtrW3L14crLdzu4cKDxHP18lUsiFqiPeocxG9WI6YO4O4sNEKukHmVSUdMlVnvlI-UWmX3fegWKNND6QcgHxDuYmLtaJ0Wtz_zWoy5sgdMRBUu-O97TbNR-8JnQ8bWqrJpMMyC0G6wyiLUlrmBrDU1-IrnmebQHtx7qpfUFYV-XhueBQ",
    aspect: "aspect-[3/4]",
    likes: 89,
  },
  {
    id: 8,
    title: "Exhibition No. 1",
    location: "Parisian Space",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuA4U7Ek60wAah3qefguCpTutfJJZhFfS_ix4T5iFiFXnnNWiveiB71-3Q8Yu3Lr33vGg_jfwu5tDvu9-9FWhic64iKpeBqfAc6O9o9grdYjSsYzDvJhxNa31crJ4cDkITQzVlkp0l7prnAn4ekzapcu1pPpcnTcHH5W6Vo4WSVoOJT1rGVM_RSIw_DstVkzOX3Qnatn3Q2tzxWirXUsJfbfxtwdY7MlnvVaCTaPRo3P2OHDE-6FyIK_FQHwgDrtO2U-Twwx9tP4drm-",
    aspect: "aspect-[3/4]",
    likes: 1024,
  },
];
</script>
