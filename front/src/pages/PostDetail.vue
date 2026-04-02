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
            <div class="w-full h-full relative bg-black/5 flex items-center justify-center rounded-sm overflow-hidden">
              <img
                :src="post.image"
                :alt="post.title"
                class="w-full h-full object-cover"
                :style="post.imageOffset ? { transform: `translate(${post.imageOffset.x}px, ${post.imageOffset.y}px) scale(${post.imageScale || 1}) rotate(${post.imageRotation || 0}deg)` } : {}"
                referrerpolicy="no-referrer"
              />
            </div>
          </div>
        </div>

        <!-- Postcard Back (Text side) -->
        <div class="relative w-full" :style="{ aspectRatio: imageAspectRatio }">
          <div class="absolute inset-0 rounded-none bg-white dark:bg-neutral p-5 flex border border-black/10 dark:border-white/10 shadow-lg overflow-hidden">
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
                <div class="w-20 h-24 border-[2px] border-black/30 dark:border-white/30 flex items-center justify-center relative bg-black/5 dark:bg-white/5 flex-shrink-0" style="border-style: dashed;">
                  <span v-if="!post.stamp" class="text-xs font-bold text-black/40 dark:text-white/40">邮票</span>
                </div>
                <div v-if="post.stamp" class="absolute -top-4 -right-4 w-32 h-32 flex items-center justify-center pointer-events-none">
                  <img :src="post.stamp.image" :alt="post.stamp.title" class="w-full h-full object-cover" />
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

            <!-- Interactive Elements -->
            <div
              v-for="(el, idx) in (post.elements || [])"
              :key="idx"
              class="absolute pointer-events-none"
              :style="{
                left: el.x + 'px', top: el.y + 'px',
                transform: `rotate(${el.rotation}deg) scale(${el.scale || 1})`,
                transformOrigin: 'top left',
                width: el.type === 'text' ? 'auto' : el.width + 'px',
                height: el.type === 'text' ? 'auto' : el.height + 'px',
                zIndex: (idx as number) + 10
              }"
            >
              <span
                v-if="el.type === 'text'"
                :style="{ fontFamily: el.fontFamily, fontSize: el.fontSize + 'px', color: el.color, fontWeight: el.fontWeight, fontStyle: el.fontStyle, textDecoration: el.textDecoration, whiteSpace: 'pre-wrap' }"
              >{{ el.content }}</span>
              <img v-else-if="el.type === 'sticker'" :src="el.content" class="w-full h-full object-contain" />
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
            <span class="font-bold text-sm">{{ comments.length }}</span>
          </div>
        </div>

        <!-- Comment Section -->
        <div class="space-y-4 pt-4">
          <h3 class="font-headline text-lg font-bold text-primary">评论</h3>

          <!-- Comments List -->
          <TransitionGroup tag="div" class="space-y-3" name="comment">
            <div
              v-for="comment in sortedComments"
              :key="comment.id"
              class="p-3 rounded-lg transition-all duration-300"
              :class="comment.pinned && isOwner ? 'bg-primary/10 dark:bg-primary/20' : 'bg-black/5 dark:bg-white/5'"
            >
              <div class="flex items-start justify-between">
                <div class="flex items-center gap-2 mb-2 flex-1">
                  <div class="w-8 h-8 rounded-full bg-secondary/20 flex items-center justify-center">
                    <span class="text-xs font-bold text-secondary">{{ comment.author[0] }}</span>
                  </div>
                  <div>
                    <div class="flex items-center gap-2">
                      <p class="text-sm font-bold text-primary">{{ comment.author }}</p>
                      <Transition name="pin">
                        <span v-if="comment.pinned" class="text-[10px] px-1.5 py-0.5 bg-primary text-white rounded-full">置顶</span>
                      </Transition>
                    </div>
                    <p class="text-xs text-tertiary">{{ comment.time }}</p>
                  </div>
                </div>
                <!-- Owner Actions -->
                <div v-if="isOwner" class="flex items-center gap-1 ml-2">
                  <button
                    @click="togglePin(comment)"
                    class="p-1 text-tertiary hover:text-primary transition-all duration-300"
                    title="置顶"
                  >
                    <Pin class="w-4 h-4 transition-all duration-300" :class="{ 'fill-current text-primary': comment.pinned }" />
                  </button>
                  <button
                    @click="deleteComment(comment.id)"
                    class="p-1 text-tertiary hover:text-red-500 transition-all duration-300"
                    title="删除"
                  >
                    <Trash2 class="w-4 h-4 transition-all duration-300" />
                  </button>
                </div>
              </div>
              <p class="text-sm text-primary">{{ comment.text }}</p>
              <!-- Like Button for Comment -->
              <div class="flex items-center gap-1 mt-2">
                <button
                  @click="likeComment(comment.id)"
                  class="flex items-center gap-1 text-xs text-tertiary hover:text-primary transition-all duration-300"
                >
                  <ThumbsUp class="w-3.5 h-3.5 transition-all duration-300" :class="[comment.liked ? 'text-red-500 fill-current' : 'text-tertiary']" />
                  <span>{{ comment.likes || 0 }}</span>
                </button>
              </div>
            </div>
          </TransitionGroup>
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
      <div v-if="post" class="grid grid-cols-2 gap-12">
        <!-- Left Column - Postcards -->
        <div class="col-span-1 space-y-6">
          <!-- Postcard Front (Image) -->
          <div class="relative w-full" :style="{ aspectRatio: imageAspectRatio }">
            <div class="absolute inset-0 rounded-none bg-white dark:bg-neutral p-3 border border-black/10 dark:border-white/10 shadow-lg overflow-hidden">
              <div class="w-full h-full relative bg-black/5 flex items-center justify-center rounded-sm overflow-hidden">
                <img
                  :src="post.image"
                  :alt="post.title"
                  class="w-full h-full object-cover"
                  :style="post.imageOffset ? { transform: `translate(${post.imageOffset.x}px, ${post.imageOffset.y}px) scale(${post.imageScale || 1}) rotate(${post.imageRotation || 0}deg)` } : {}"
                  referrerpolicy="no-referrer"
                />
              </div>
            </div>
          </div>

          <!-- Postcard Back (Text side) -->
          <div class="relative w-full" :style="{ aspectRatio: imageAspectRatio }">
            <div class="absolute inset-0 rounded-none bg-white dark:bg-neutral p-3 flex border border-black/10 dark:border-white/10 shadow-lg overflow-hidden">
              <!-- Left Side - Message -->
              <div class="flex-1 flex flex-col pr-3 border-r border-black/20 dark:border-white/20 relative overflow-hidden">
                <h4 class="font-headline text-sm tracking-widest text-black/60 dark:text-white/60 mb-1">POSTCARD</h4>
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
              <div class="flex-1 flex flex-col pl-3 relative">
                <div class="flex justify-end relative mb-2">
                  <div class="w-16 h-20 border-[2px] border-black/30 dark:border-white/30 flex items-center justify-center relative bg-black/5 dark:bg-white/5 flex-shrink-0" style="border-style: dashed;">
                    <span v-if="!post.stamp" class="text-xs font-bold text-black/40 dark:text-white/40">邮票</span>
                  </div>
                  <div v-if="post.stamp" class="absolute -top-1 -right-1 w-32 h-32 flex items-center justify-center pointer-events-none">
                    <img :src="post.stamp.image" :alt="post.stamp.title" class="w-full h-full object-cover" />
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

              <!-- Interactive Elements -->
              <div
                v-for="(el, idx) in (post.elements || [])"
                :key="idx"
                class="absolute pointer-events-none"
                :style="{
                  left: el.x + 'px', top: el.y + 'px',
                  transform: `rotate(${el.rotation}deg) scale(${el.scale || 1})`,
                  transformOrigin: 'top left',
                  width: el.type === 'text' ? 'auto' : el.width + 'px',
                  height: el.type === 'text' ? 'auto' : el.height + 'px',
                  zIndex: (idx as number) + 10
                }"
              >
                <span
                  v-if="el.type === 'text'"
                  :style="{ fontFamily: el.fontFamily, fontSize: el.fontSize + 'px', color: el.color, fontWeight: el.fontWeight, fontStyle: el.fontStyle, textDecoration: el.textDecoration, whiteSpace: 'pre-wrap' }"
                >{{ el.content }}</span>
                <img v-else-if="el.type === 'sticker'" :src="el.content" class="w-full h-full object-contain" />
              </div>
            </div>
          </div>
        </div>

        <!-- Right Column - Info & Comments -->
        <div class="col-span-1 space-y-6">
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
                <span class="font-bold text-sm">{{ comments.length }}</span>
              </div>
            </div>
          </div>

          <!-- Comment Section -->
          <div class="space-y-4 pt-4 border-t border-black/10 dark:border-white/10">
            <h3 class="font-headline text-lg font-bold text-primary">评论</h3>

            <!-- Comments List -->
            <TransitionGroup tag="div" class="space-y-3 max-h-96 overflow-y-auto" name="comment">
              <div
                v-for="comment in sortedComments"
                :key="comment.id"
                class="p-3 rounded-lg transition-all duration-300"
                :class="comment.pinned && isOwner ? 'bg-primary/10 dark:bg-primary/20' : 'bg-black/5 dark:bg-white/5'"
              >
                <div class="flex items-start justify-between">
                  <div class="flex items-center gap-2 mb-2 flex-1">
                    <div class="w-8 h-8 rounded-full bg-secondary/20 flex items-center justify-center">
                      <span class="text-xs font-bold text-secondary">{{ comment.author[0] }}</span>
                    </div>
                    <div>
                      <div class="flex items-center gap-2">
                        <p class="text-sm font-bold text-primary">{{ comment.author }}</p>
                        <Transition name="pin">
                          <span v-if="comment.pinned" class="text-[10px] px-1.5 py-0.5 bg-primary text-white rounded-full">置顶</span>
                        </Transition>
                      </div>
                      <p class="text-xs text-tertiary">{{ comment.time }}</p>
                    </div>
                  </div>
                  <!-- Owner Actions -->
                  <div v-if="isOwner" class="flex items-center gap-1 ml-2">
                    <button
                      @click="togglePin(comment)"
                      class="p-1 text-tertiary hover:text-primary transition-all duration-300"
                      title="置顶"
                    >
                      <Pin class="w-4 h-4 transition-all duration-300" :class="{ 'fill-current text-primary': comment.pinned }" />
                    </button>
                    <button
                      @click="deleteComment(comment.id)"
                      class="p-1 text-tertiary hover:text-red-500 transition-all duration-300"
                      title="删除"
                    >
                      <Trash2 class="w-4 h-4 transition-all duration-300" />
                    </button>
                  </div>
                </div>
                <p class="text-sm text-primary">{{ comment.text }}</p>
                <!-- Like Button for Comment -->
                <div class="flex items-center gap-1 mt-2">
                  <button
                    @click="likeComment(comment.id)"
                    class="flex items-center gap-1 text-xs text-tertiary hover:text-primary transition-all duration-300"
                  >
                    <ThumbsUp class="w-3.5 h-3.5 transition-all duration-300" :class="[comment.liked ? 'text-red-500 fill-current' : 'text-tertiary']" />
                    <span>{{ comment.likes || 0 }}</span>
                  </button>
                </div>
              </div>
            </TransitionGroup>

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
import { ref, computed, onMounted } from "vue";
import { useRoute } from "vue-router";
import { ChevronLeft, MessageCircle, Send, Pin, Trash2, Heart, ThumbsUp } from "lucide-vue-next";

const route = useRoute();
const post = ref<any>(null);
const isLiked = ref(false);
const likeCount = ref(0);
const newComment = ref("");
const imageAspectRatio = ref("3/2");
const isOwner = ref(false);
const comments = ref<any[]>([]);

let commentIdCounter = 0;

onMounted(() => {
  window.scrollTo(0, 0);
  const postId = route.params.id;
  loadPost(postId);
});

const sortedComments = computed(() => {
  return [...comments.value].sort((a, b) => {
    if (a.pinned && !b.pinned) return -1;
    if (!a.pinned && b.pinned) return 1;
    return 0;
  });
});

const loadPost = (id: any) => {
  // 先查 localStorage 用户明信片
  const stored = localStorage.getItem('userPostcards');
  if (stored) {
    const userCards = JSON.parse(stored);
    const userCard = userCards.find((c: any) => String(c.id) === String(id));
    if (userCard) {
      post.value = {
        ...userCard,
        location: new Date(userCard.createdAt).toLocaleDateString('zh-CN'),
        likes: 0,
        comments: 0,
      };
      isOwner.value = true;
      imageAspectRatio.value = '3/2';

      // 检查是否已点赞并计算点赞数
      const likedStored = localStorage.getItem('likedPostcards');
      if (likedStored) {
        const liked = JSON.parse(likedStored);
        isLiked.value = liked.some((p: any) => String(p.id) === String(userCard.id));
        likeCount.value = liked.filter((p: any) => String(p.id) === String(userCard.id)).length;
      } else {
        likeCount.value = 0;
      }

      // 加载该明信片的评论
      const commentStored = localStorage.getItem(`comments_${userCard.id}`);
      if (commentStored) {
        comments.value = JSON.parse(commentStored);
        commentIdCounter = Math.max(...comments.value.map((c: any) => c.id || 0)) + 1;
      }
      return;
    }
  }

  // 示例明信片
  const posts = [
    { id: 1, title: "Silent Hallway", location: "Kyoto, Japan", likes: 342 },
    { id: 2, title: "Horizon Line", location: "Expedition 04", likes: 128 },
    { id: 3, title: "Misty Peaks", location: "Alpine Morning", likes: 856 },
    { id: 4, title: "Single Bloom", location: "Botanical Series", likes: 42 },
    { id: 5, title: "Quiet Afternoon", location: "Interior Study", likes: 215 },
    { id: 6, title: "Golden Solitude", location: "Tuscany, Italy", likes: 567 },
    { id: 7, title: "Still Waters", location: "Nordic Summer", likes: 89 },
    { id: 8, title: "Exhibition No. 1", location: "Parisian Space", likes: 1024 },
  ];

  const found = posts.find((p) => p.id === parseInt(id as string));
  if (found) {
    post.value = found;
    isOwner.value = false;

    // 检查是否已点赞并计算点赞数
    const likedStored = localStorage.getItem('likedPostcards');
    if (likedStored) {
      const liked = JSON.parse(likedStored);
      isLiked.value = liked.some((p: any) => String(p.id) === String(found.id));
      likeCount.value = found.likes + liked.filter((p: any) => String(p.id) === String(found.id)).length;
    } else {
      likeCount.value = found.likes;
    }

    // 加载评论
    const commentStored = localStorage.getItem(`comments_${id}`);
    if (commentStored) {
      comments.value = JSON.parse(commentStored);
      commentIdCounter = Math.max(...comments.value.map((c: any) => c.id || 0)) + 1;
    }
  }
};

const toggleLike = () => {
  const stored = localStorage.getItem('likedPostcards');
  let liked: any[] = stored ? JSON.parse(stored) : [];

  if (liked.some((p: any) => String(p.id) === String(post.value.id))) {
    liked = liked.filter((p: any) => String(p.id) !== String(post.value.id));
    isLiked.value = false;
  } else {
    liked.push({
      id: post.value.id,
      title: post.value.title,
      image: post.value.image,
      imageOffset: post.value.imageOffset,
      imageScale: post.value.imageScale,
      imageRotation: post.value.imageRotation,
      location: post.value.location,
      aspect: 'aspect-[3/2]',
    });
    isLiked.value = true;
  }

  localStorage.setItem('likedPostcards', JSON.stringify(liked));
  likeCount.value = post.value.likes + liked.filter((p: any) => String(p.id) === String(post.value.id)).length;
};

const addComment = () => {
  if (newComment.value.trim()) {
    const newCommentObj = {
      id: ++commentIdCounter,
      author: "我",
      time: "刚刚",
      text: newComment.value,
      liked: false,
      likes: 0,
      pinned: false,
    };
    comments.value.push(newCommentObj);
    saveComments();
    newComment.value = "";
  }
};

const likeComment = (id: number) => {
  const comment = comments.value.find((c) => c.id === id);
  if (comment) {
    comment.liked = !comment.liked;
    comment.likes = (comment.likes || 0) + (comment.liked ? 1 : -1);
    saveComments();
  }
};

const deleteComment = (id: number) => {
  if (confirm('确定要删除这条评论吗？')) {
    comments.value = comments.value.filter((c) => c.id !== id);
    saveComments();
  }
};

const togglePin = (comment: any) => {
  // 如果已经是置顶，取消置顶
  if (comment.pinned) {
    comment.pinned = false;
  } else {
    // 先取消所有其他评论的置顶
    comments.value.forEach((c) => {
      c.pinned = false;
    });
    // 然后置顶当前评论
    comment.pinned = true;
  }
  saveComments();
};

const saveComments = () => {
  if (post.value && post.value.id) {
    localStorage.setItem(`comments_${post.value.id}`, JSON.stringify(comments.value));
  }
};
</script>

<style scoped>
.comment-move,
.comment-enter-active,
.comment-leave-active {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.comment-enter-from {
  opacity: 0;
  transform: translateY(-20px) scale(0.95);
}

.comment-leave-to {
  opacity: 0;
  transform: translateX(-100%) scale(0.95);
}

.comment-move {
  transform-origin: center;
}

/* 置顶标签动画 */
.pin-enter-active,
.pin-leave-active {
  transition: all 0.3s ease;
}

.pin-enter-from {
  opacity: 0;
  transform: scale(0.8) translateY(-10px);
}

.pin-leave-to {
  opacity: 0;
  transform: scale(0.8);
}
</style>
