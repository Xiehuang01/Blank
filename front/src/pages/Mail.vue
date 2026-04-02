<template>
  <div class="min-h-screen bg-background pb-24">
    <header
      class="sticky top-0 z-40 flex justify-between items-center w-full px-4 h-16 bg-background/90 backdrop-blur-sm border-b border-primary/10"
    >
      <div class="flex items-center gap-4 flex-1">
        <button class="text-primary hover:bg-primary/5 p-2 rounded-full transition-colors">
          <MailIcon class="w-5 h-5" />
        </button>
        <div class="relative flex-1 max-w-md">
          <Search class="absolute left-3 top-1/2 -translate-y-1/2 text-tertiary w-4 h-4" />
          <input
            type="text"
            v-model="mailSearchQuery"
            placeholder="搜索邮件..."
            class="w-full bg-black/5 border-none rounded-full py-1.5 pl-10 pr-4 text-sm font-body focus:ring-1 focus:ring-primary/20 placeholder:text-tertiary outline-none"
          />
        </div>
      </div>
      <div class="flex items-center gap-1 ml-4">
        <button
          @click="showFriendsList = true"
          class="text-primary hover:bg-primary/5 p-2 rounded-full transition-colors"
        >
          <Users class="w-5 h-5" />
        </button>
        <button class="text-primary hover:bg-primary/5 p-2 rounded-full transition-colors">
          <ListFilter class="w-5 h-5" />
        </button>
      </div>
    </header>

    <main class="max-w-7xl mx-auto px-6 py-8" @click="clearSelectedCard">
      <div v-if="allPostcards.length === 0" class="flex flex-col items-center justify-center py-24 gap-4">
        <div class="w-16 h-16 rounded-full bg-black/5 dark:bg-white/5 flex items-center justify-center">
          <MailIcon class="w-8 h-8 text-black/30 dark:text-white/30" />
        </div>
        <p class="text-black/40 dark:text-white/40 text-sm">还没有明信片，去创作一张吧</p>
      </div>
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 md:gap-8 lg:gap-12">
        <div
          v-for="(card, index) in allPostcards"
          :key="card.id"
          class="relative group cursor-pointer"
          :style="{ 
            aspectRatio: card.aspectRatio || '3/2',
            width: card.aspectRatio === '2/3' ? '70%' : '100%',
            margin: card.aspectRatio === '2/3' ? '0 auto' : '0'
          }"
          @click.stop="toggleFlip(index)"
        >
          <!-- Back (text side) - 未翻转时在后面(z-0)，翻转后在前面(z-10) -->
          <div
            :class="[
              'absolute inset-0 rounded-none bg-white dark:bg-neutral border border-black/10 dark:border-white/10 transition-all duration-500 shadow-inner overflow-hidden',
              flipped[index] ? '-translate-x-4 -translate-y-4 -rotate-1 shadow-2xl z-10 group-hover:rotate-0' : 'translate-x-4 translate-y-4 rotate-2 shadow-lg z-0 group-hover:rotate-1'
            ]"
            :ref="el => { if (el) cardCanvasRefs[index] = el as HTMLElement }"
          >
            <!-- Scale wrapper: 以编辑时的固定尺寸为基准整体缩放 -->
            <div
              class="absolute top-0 left-0 origin-top-left"
              :style="getBackScaleStyle(card, index)"
            >
              <!-- 固定尺寸内容区，与 Create.vue 编辑时一致 -->
              <div
                class="flex p-5 bg-white dark:bg-neutral"
                :style="{ width: (card.canvasWidth || 600) + 'px', height: (card.canvasHeight || 400) + 'px' }"
              >
                <!-- Left Side - Message -->
                <div class="flex-1 flex flex-col pr-5 border-r border-black/20 dark:border-white/20 overflow-hidden relative">
                  <h3 class="font-headline text-xl tracking-widest text-black/60 dark:text-white/60 mb-2">POSTCARD</h3>
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
                <!-- Right Side -->
                <div class="flex-1 flex flex-col pl-5 relative">
                  <div class="flex justify-end relative mb-4">
                    <div v-if="card.stamp" class="absolute -top-1 -right-1 w-32 h-32 flex items-center justify-center">
                      <img :src="card.stamp.image" class="w-full h-full object-cover" />
                    </div>
                    <div v-else class="w-20 h-24 border-[2px] border-dashed border-black/30 dark:border-white/30 flex items-center justify-center bg-black/5">
                      <span class="text-xs font-bold text-black/40">邮票</span>
                    </div>
                  </div>
                  <div class="flex-1 flex flex-col justify-end gap-4 pb-2">
                    <div class="flex items-end gap-3"><span class="text-xs text-black/60 font-body">to:</span><div class="flex-1 h-[1px] bg-black/20"></div></div>
                    <div class="w-full h-[1px] bg-black/20 mt-3"></div>
                    <div class="flex items-end gap-3"><span class="text-xs text-black/60 font-body">from:</span><div class="flex-1 h-[1px] bg-black/20"></div></div>
                    <div class="w-full h-[1px] bg-black/20"></div>
                  </div>
                </div>
                <!-- Interactive elements -->
                <div
                  v-for="(el, ei) in card.elements"
                  :key="ei"
                  class="absolute pointer-events-none"
                  :style="{
                    left: el.x + 'px', top: el.y + 'px',
                    transform: `rotate(${el.rotation}deg) scale(${el.scale || 1})`,
                    transformOrigin: 'top left',
                    width: el.type === 'text' ? 'auto' : el.width + 'px',
                    height: el.type === 'text' ? 'auto' : el.height + 'px',
                    zIndex: String(ei + 10),
                  }"
                >
                  <span v-if="el.type === 'text'" :style="{ fontFamily: el.fontFamily, fontSize: el.fontSize + 'px', color: el.color, fontWeight: el.fontWeight, fontStyle: el.fontStyle, textDecoration: el.textDecoration }">{{ el.content }}</span>
                  <img v-else-if="el.type === 'sticker'" :src="el.content" class="w-full h-full object-contain" />
                </div>
              </div>
            </div>
          </div>
          <!-- Front (image side) - 未翻转时在前面(z-10)，翻转后在后面(z-0) -->
          <div
            :class="[
              'absolute inset-0 rounded-none bg-white dark:bg-neutral p-3 transition-all duration-500',
              flipped[index] ? 'translate-x-4 translate-y-4 rotate-2 shadow-lg z-0 group-hover:rotate-1' : '-translate-x-4 -translate-y-4 -rotate-1 shadow-2xl z-10 group-hover:rotate-0'
            ]"
          >
            <div class="w-full h-full relative border border-black/5 dark:border-white/5 overflow-hidden">
              <img :src="card.image" class="w-full h-full object-cover"
                :style="{ transform: `translate(${(card.imageOffset?.x||0)}px, ${(card.imageOffset?.y||0)}px) scale(${card.imageScale||1}) rotate(${card.imageRotation||0}deg)` }"
              />
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Friends List Sidebar -->
    <Transition
      enter-active-class="transition-opacity duration-300"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-opacity duration-300"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div v-if="showFriendsList" class="fixed inset-0 z-[60] flex justify-end">
        <!-- Backdrop -->
        <div
          class="absolute inset-0 bg-black/20 backdrop-blur-sm"
          @click="closeFriendsList"
        ></div>

        <!-- Panel -->
        <Transition
          appear
          enter-active-class="transition-transform duration-300 ease-out"
          enter-from-class="translate-x-full"
          enter-to-class="translate-x-0"
          leave-active-class="transition-transform duration-300 ease-in"
          leave-from-class="translate-x-0"
          leave-to-class="translate-x-full"
        >
          <div
            v-if="showFriendsList"
            class="relative w-full md:w-1/3 min-w-[320px] bg-white dark:bg-neutral h-full shadow-2xl flex flex-col"
            @click="expandedFriendId = null"
          >
            <!-- Panel Header -->
            <div class="flex items-center justify-between p-4 border-b border-black/5 dark:border-white/5">
              <!-- Title or back button when adding friend -->
              <div class="flex items-center gap-2">
                <button
                  v-if="isAddingFriend"
                  @click.stop="isAddingFriend = false; addFriendQuery = ''"
                  class="p-1.5 hover:bg-black/5 dark:hover:bg-white/5 rounded-full transition-colors text-tertiary"
                >
                  <ArrowLeft class="w-4 h-4" />
                </button>
                <h2 class="font-headline font-bold text-lg">{{ isAddingFriend ? '添加好友' : '好友列表' }}</h2>
              </div>
              <button
                @click.stop="closeFriendsList"
                class="p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-full transition-colors text-tertiary"
              >
                <X class="w-5 h-5" />
              </button>
            </div>

            <!-- Search bar in panel header area - visible when adding friend -->
            <Transition
              enter-active-class="transition-all duration-300 ease-out"
              enter-from-class="opacity-0 -translate-y-2"
              enter-to-class="opacity-100 translate-y-0"
              leave-active-class="transition-all duration-200 ease-in"
              leave-from-class="opacity-100 translate-y-0"
              leave-to-class="opacity-0 -translate-y-2"
            >
              <div v-if="isAddingFriend" class="px-4 pb-3 border-b border-black/5 dark:border-white/5" @click.stop>
                <div class="relative">
                  <UserPlus class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary" />
                  <input
                    ref="addFriendInput"
                    type="text"
                    v-model="addFriendQuery"
                    placeholder="输入好友ID或昵称..."
                    class="w-full bg-primary/5 border border-primary/20 rounded-full py-2 pl-9 pr-4 text-sm focus:ring-1 focus:ring-primary/30 outline-none text-primary placeholder:text-primary/40"
                  />
                </div>
                <!-- Search results -->
                <div v-if="addFriendQuery" class="mt-2 space-y-1">
                  <div
                    v-for="result in searchResults"
                    :key="result.id"
                    class="flex items-center gap-3 p-2 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                  >
                    <img :src="result.avatar" :alt="result.name" class="w-8 h-8 rounded-full object-cover" />
                    <span class="flex-1 text-sm font-medium">{{ result.name }}</span>
                    <button class="px-3 py-1 bg-primary text-white rounded-full text-xs font-semibold hover:bg-primary/90 transition-colors">添加</button>
                  </div>
                  <p v-if="searchResults.length === 0" class="text-xs text-tertiary text-center py-4">未找到相关用户</p>
                </div>
              </div>
            </Transition>

            <!-- Friends list -->
            <div class="flex-1 overflow-y-auto p-4">
              <div v-if="!isAddingFriend" class="space-y-2">
                <div v-for="friend in filteredFriends" :key="friend.id" class="flex flex-col gap-1">
                  <div
                    class="flex items-center gap-3 p-3 hover:bg-black/5 dark:hover:bg-white/5 rounded-xl cursor-pointer transition-colors"
                    @click.stop="expandedFriendId = expandedFriendId === friend.id ? null : friend.id"
                  >
                    <div class="relative">
                      <img :src="friend.avatar" :alt="friend.name" class="w-10 h-10 rounded-full object-cover" />
                      <div class="absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white dark:border-neutral" :class="friend.status === 'online' ? 'bg-green-500' : 'bg-gray-400'"></div>
                    </div>
                    <div class="flex-1">
                      <h3 class="font-medium text-sm">{{ friend.name }}</h3>
                      <p class="text-xs text-tertiary">{{ friend.status === 'online' ? '在线' : '离线' }}</p>
                    </div>
                    <button class="p-2 text-primary hover:bg-primary/10 rounded-full transition-colors" @click.stop>
                      <MailIcon class="w-4 h-4" />
                    </button>
                  </div>
                  <Transition
                    enter-active-class="transition-all duration-200 ease-out"
                    enter-from-class="opacity-0 -translate-y-2"
                    enter-to-class="opacity-100 translate-y-0"
                    leave-active-class="transition-all duration-150 ease-in"
                    leave-from-class="opacity-100 translate-y-0"
                    leave-to-class="opacity-0 -translate-y-2"
                  >
                    <div v-if="expandedFriendId === friend.id" class="flex gap-2 px-3 pb-2" @click.stop>
                      <button class="flex-1 flex items-center justify-center gap-2 py-2 bg-primary/10 text-primary rounded-lg text-sm hover:bg-primary/20 transition-colors">
                        <Send class="w-4 h-4" />发送明信片
                      </button>
                      <button class="flex-1 flex items-center justify-center gap-2 py-2 bg-red-50 text-red-500 rounded-lg text-sm hover:bg-red-100 transition-colors dark:bg-red-900/20 dark:hover:bg-red-900/40">
                        <Trash2 class="w-4 h-4" />删除好友
                      </button>
                    </div>
                  </Transition>
                </div>
              </div>
            </div>

            <!-- Bottom Action Bar -->
            <div class="p-4 border-t border-black/5 dark:border-white/5 bg-white dark:bg-neutral flex items-center gap-3" @click.stop>
              <div class="relative flex-1">
                <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-tertiary" />
                <input
                  type="text"
                  v-model="searchQuery"
                  placeholder="搜索好友..."
                  class="w-full bg-black/5 dark:bg-white/5 border-none rounded-full py-2 pl-9 pr-4 text-sm focus:ring-1 focus:ring-primary/20 outline-none"
                />
              </div>
              <button
                @click.stop="isAddingFriend = true; $nextTick(() => $refs.addFriendInput?.focus())"
                class="w-10 h-10 shrink-0 bg-primary text-white rounded-full flex items-center justify-center shadow-lg hover:bg-primary/90 transition-colors"
              >
                <UserPlus class="w-5 h-5" />
              </button>
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, nextTick, onMounted } from "vue";
import {
  Mail as MailIcon,
  Search,
  Users,
  ListFilter,
  X,
  Send,
  Trash2,
  UserPlus,
  ArrowLeft,
} from "lucide-vue-next";

const flipped = ref<boolean[]>([]);
const allPostcards = ref<any[]>([]);
const cardCanvasRefs = ref<Record<number, HTMLElement>>({});

const getBackScaleStyle = (card: any, index: number) => {
  const el = cardCanvasRefs.value[index];
  const srcW = card.canvasWidth || 600;
  const srcH = card.canvasHeight || 400;
  const dstW = el ? el.offsetWidth : srcW;
  const dstH = el ? el.offsetHeight : srcH;
  const scale = Math.min(dstW / srcW, dstH / srcH);
  return {
    width: srcW + 'px',
    height: srcH + 'px',
    transform: `scale(${scale})`,
    transformOrigin: 'top left',
  };
};

const clearSelectedCard = () => {
  flipped.value = allPostcards.value.map(() => true);
};

const toggleFlip = (index: number) => {
  flipped.value[index] = !flipped.value[index];
};

onMounted(() => {
  const stored = localStorage.getItem('userPostcards');
  allPostcards.value = stored ? JSON.parse(stored) : [];
  flipped.value = allPostcards.value.map(() => true);
});
const mailSearchQuery = ref("");
const showFriendsList = ref(false);
const expandedFriendId = ref<number | null>(null);
const searchQuery = ref("");
const isAddingFriend = ref(false);
const addFriendQuery = ref("");
const addFriendInput = ref<HTMLInputElement | null>(null);

const closeFriendsList = () => {
  showFriendsList.value = false;
  expandedFriendId.value = null;
  isAddingFriend.value = false;
  addFriendQuery.value = "";
};

const mockFriends = ref([
  { id: 1, name: '林深时见鹿', avatar: 'https://i.pravatar.cc/150?u=11', status: 'online' },
  { id: 2, name: '海蓝时见鲸', avatar: 'https://i.pravatar.cc/150?u=12', status: 'offline' },
  { id: 3, name: '梦醒时见你', avatar: 'https://i.pravatar.cc/150?u=13', status: 'online' },
  { id: 4, name: '云中谁寄锦书来', avatar: 'https://i.pravatar.cc/150?u=14', status: 'online' },
  { id: 5, name: '雁字回时', avatar: 'https://i.pravatar.cc/150?u=15', status: 'offline' },
  { id: 6, name: '月满西楼', avatar: 'https://i.pravatar.cc/150?u=16', status: 'online' },
]);

const allUsers = ref([
  { id: 7, name: '落花人独立', avatar: 'https://i.pravatar.cc/150?u=17' },
  { id: 8, name: '微雨燕双飞', avatar: 'https://i.pravatar.cc/150?u=18' },
  { id: 9, name: '记得绿罗裙', avatar: 'https://i.pravatar.cc/150?u=19' },
]);

const filteredFriends = computed(() => {
  if (!searchQuery.value) return mockFriends.value;
  return mockFriends.value.filter(f => f.name.includes(searchQuery.value));
});

const searchResults = computed(() => {
  if (!addFriendQuery.value) return [];
  return allUsers.value.filter(u => u.name.includes(addFriendQuery.value));
});
</script>
