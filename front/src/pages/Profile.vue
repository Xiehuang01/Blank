<template>
  <div class="min-h-screen bg-background pb-32 md:pb-0">
    <!-- Header - 共用 -->
    <header
      class="flex justify-between items-center w-full px-6 py-4 sticky top-0 z-50 bg-background md:bg-background/90 md:backdrop-blur-sm md:border-b md:border-primary/10"
    >
      <button @click="$router.push('/checkin')" class="relative text-primary hover:opacity-80 transition-opacity">
        <CalendarCheck class="w-6 h-6" />
        <span
          v-if="!isCheckedInToday"
          class="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-background"
        ></span>
      </button>
      <button @click="toggleDarkMode" class="text-primary hover:opacity-80 transition-opacity">
        <component :is="isDarkMode ? Sun : Moon" class="w-6 h-6" />
      </button>
    </header>

    <!-- 手机端布局 -->
    <main class="md:hidden max-w-md mx-auto pt-6 px-6 space-y-10">
      <!-- 用户信息 -->
      <section class="flex items-center justify-between gap-6">
        <div class="flex items-center gap-6">
          <div class="relative group shrink-0">
            <div
              class="w-20 h-20 rounded-full overflow-hidden border-2 border-black/10 shadow-sm"
            >
              <img
                :src="displayUserInfo.avatar"
                alt="Avatar"
                class="w-full h-full object-cover"
                referrerpolicy="no-referrer"
              />
            </div>
            <div
              class="absolute -bottom-1 -right-1 bg-secondary text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider shadow-sm"
            >
              {{ displayUserInfo.vipLevel }}
            </div>
          </div>
          <div class="flex flex-col">
            <div class="flex items-center gap-3">
              <h2 class="font-headline text-2xl text-primary font-bold">{{ displayUserInfo.username }}</h2>
              <button class="text-tertiary hover:text-primary transition-colors">
                <PenLine class="w-4 h-4" @click="$router.push('/personal-info')"/>
              </button>
            </div>
            <div class="flex flex-col mt-1 space-y-2">
              <span class="text-sm text-tertiary font-medium tracking-tight"
                >UID: {{ displayUserInfo.uid }}</span
              >
              <div
                class="inline-flex items-center gap-1.5 px-3 py-1 bg-black/5 dark:bg-white/5 rounded-full w-fit"
              >
                <Coins class="w-4 h-4 text-tertiary" />
                <span class="text-xs font-semibold text-primary"
                  >虚拟货币: {{ displayUserInfo.coins }} 邮分</span
                >
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- 我的喜欢 -->
      <section v-if="favorites.length > 0" class="space-y-4">
        <div class="flex justify-between items-end">
          <h3
            class="font-headline text-lg font-bold text-primary border-l-4 border-secondary pl-3"
          >
            我的喜欢
          </h3>
          <button
            @click="$router.push('/favorites')"
            class="text-xs font-semibold text-secondary hover:underline flex items-center"
          >
            查看全部 <ChevronRight class="w-3 h-3 ml-0.5" />
          </button>
        </div>
        <div class="grid grid-cols-4 gap-3">
          <div
            v-for="fav in favorites"
            :key="fav.id"
            class="rounded-sm bg-black/5 dark:bg-white/5 overflow-hidden shadow-inner border border-black/10 dark:border-white/10 flex items-center justify-center p-1 aspect-square"
          >
            <img
              :src="fav.src"
              alt="Like"
              class="w-full h-full object-cover grayscale-[30%] opacity-90"
              referrerpolicy="no-referrer"
            />
          </div>
          <button
            @click="$router.push('/')"
            class="rounded-sm bg-black/5 dark:bg-white/5 overflow-hidden shadow-inner border border-black/10 dark:border-white/10 flex items-center justify-center p-1 aspect-square hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
          >
            <div
              class="w-full h-full bg-black/5 dark:bg-white/5 flex items-center justify-center border-2 border-dashed border-black/20 dark:border-white/20 rounded-sm"
            >
              <Plus class="text-tertiary w-6 h-6" />
            </div>
          </button>
        </div>
      </section>

      <!-- 我的邮票 -->
      <section v-if="stamps.length > 0" class="space-y-4">
        <div class="flex justify-between items-end">
          <h3
            class="font-headline text-lg font-bold text-primary border-l-4 border-secondary pl-3"
          >
            我的邮票
          </h3>
          <button
            @click="$router.push('/my-stamps')"
            class="text-xs font-semibold text-secondary hover:underline flex items-center"
          >
            查看全部 <ChevronRight class="w-3 h-3 ml-0.5" />
          </button>
        </div>
        <div class="grid grid-cols-4 gap-3">
          <div
            v-for="stamp in stamps"
            :key="stamp.id"
            class="rounded-sm bg-black/5 dark:bg-white/5 overflow-hidden shadow-inner border border-black/10 dark:border-white/10 flex items-center justify-center p-1 aspect-square"
          >
            <img
              :src="stamp.src"
              alt="Stamp"
              class="w-full h-full object-cover grayscale-[30%] opacity-90"
              referrerpolicy="no-referrer"
            />
          </div>
          <button
            @click="$router.push('/shop')"
            class="rounded-sm bg-black/5 dark:bg-white/5 overflow-hidden shadow-inner border border-black/10 dark:border-white/10 flex items-center justify-center p-1 aspect-square hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
          >
            <div
              class="w-full h-full bg-black/5 dark:bg-white/5 flex items-center justify-center border-2 border-dashed border-black/20 dark:border-white/20 rounded-sm"
            >
              <Plus class="text-tertiary w-6 h-6" />
            </div>
          </button>
        </div>
      </section>

      <!-- 菜单列表 -->
      <section
        class="bg-neutral rounded-xl overflow-hidden shadow-sm border border-black/5 dark:border-white/5"
      >
        <div class="divide-y divide-black/5 dark:divide-white/5">
          <button
            @click="$router.push('/outbox')"
            class="w-full flex items-center justify-between p-4 hover:bg-black/5 dark:hover:bg-white/5 transition-colors group"
          >
            <div class="flex items-center gap-4">
              <div
                class="w-10 h-10 flex items-center justify-center text-primary"
              >
                <Inbox class="w-5 h-5" />
              </div>
              <span class="font-medium text-primary">发信箱</span>
            </div>
            <ChevronRight
              class="w-5 h-5 text-tertiary group-hover:translate-x-1 transition-transform"
            />
          </button>
          <button
            @click="$router.push('/personal-info')"
            class="w-full flex items-center justify-between p-4 hover:bg-black/5 dark:hover:bg-white/5 transition-colors group"
          >
            <div class="flex items-center gap-4">
              <div
                class="w-10 h-10 flex items-center justify-center text-primary"
              >
                <BadgeInfo class="w-5 h-5" />
              </div>
              <span class="font-medium text-primary">个人资料</span>
            </div>
            <ChevronRight
              class="w-5 h-5 text-tertiary group-hover:translate-x-1 transition-transform"
            />
          </button>
          <button
            @click="$router.push('/account-management')"
            class="w-full flex items-center justify-between p-4 hover:bg-black/5 dark:hover:bg-white/5 transition-colors group"
          >
            <div class="flex items-center gap-4">
              <div
                class="w-10 h-10 flex items-center justify-center text-primary"
              >
                <UsersRound class="w-5 h-5" />
              </div>
              <span class="font-medium text-primary">账号管理</span>
            </div>
            <ChevronRight
              class="w-5 h-5 text-tertiary group-hover:translate-x-1 transition-transform"
            />
          </button>
          <button
            @click="router.push('/settings')"
            class="w-full flex items-center justify-between p-4 hover:bg-black/5 dark:hover:bg-white/5 transition-colors group"
          >
            <div class="flex items-center gap-4">
              <div
                class="w-10 h-10 flex items-center justify-center text-primary"
              >
                <Settings class="w-5 h-5" />
              </div>
              <span class="font-medium text-primary">设置</span>
            </div>
            <ChevronRight
              class="w-5 h-5 text-tertiary group-hover:translate-x-1 transition-transform"
            />
          </button>
          <button
            class="w-full flex items-center justify-between p-4 hover:bg-black/5 dark:hover:bg-white/5 transition-colors group"
          >
            <div class="flex items-center gap-4">
              <div
                class="w-10 h-10 flex items-center justify-center text-primary"
              >
                <HelpCircle class="w-5 h-5" />
              </div>
              <span class="font-medium text-primary">联系我们</span>
            </div>
            <ChevronRight
              class="w-5 h-5 text-tertiary group-hover:translate-x-1 transition-transform"
            />
          </button>
        </div>
      </section>

      <!-- 退出登录 -->
      <section class="pt-2">
        <button
          @click="handleLogout"
          class="w-full py-3.5 bg-neutral rounded-xl text-red-500 font-bold shadow-sm border border-black/5 dark:border-white/5 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors flex items-center justify-center gap-2"
        >
          <LogOut class="w-5 h-5" />
          退出登录
        </button>
      </section>
    </main>

    <!-- 电脑端布局 -->
    <main class="hidden md:block max-w-7xl mx-auto pt-8 px-8 pb-12">
      <div class="grid grid-cols-12 gap-8">
        <!-- 左侧边栏 -->
        <aside class="col-span-3 space-y-6">
          <!-- 用户信息卡片 -->
          <div class="bg-neutral rounded-2xl p-6 shadow-sm border border-black/5 dark:border-white/5">
            <div class="flex flex-col items-center text-center">
              <div class="relative group mb-4">
                <div class="w-28 h-28 rounded-full overflow-hidden border-2 border-black/10 shadow-sm">
                  <img
                    :src="displayUserInfo.avatar"
                    alt="Avatar"
                    class="w-full h-full object-cover"
                    referrerpolicy="no-referrer"
                  />
                </div>
                <div class="absolute -bottom-1 -right-1 bg-secondary text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
                  {{ displayUserInfo.vipLevel }}
                </div>
              </div>
              <div class="flex items-center gap-2 mb-1">
                <h2 class="font-headline text-2xl text-primary font-bold">{{ displayUserInfo.username }}</h2>
                <button class="text-tertiary hover:text-primary transition-colors">
                  <PenLine class="w-4 h-4" @click="$router.push('/personal-info')"/>
                </button>
              </div>
              <p class="text-sm text-tertiary font-medium mb-4">UID: {{ displayUserInfo.uid }}</p>
              <div class="inline-flex items-center gap-2 px-4 py-2 bg-black/5 dark:bg-white/5 rounded-full">
                <Coins class="w-5 h-5 text-tertiary" />
                <span class="text-sm font-semibold text-primary">{{ displayUserInfo.coins }} 邮分</span>
              </div>
            </div>
          </div>

          <!-- 导航菜单 -->
          <nav class="bg-neutral rounded-2xl overflow-hidden shadow-sm border border-black/5 dark:border-white/5">
            <div class="divide-y divide-black/5 dark:divide-white/5">
              <button
                @click="$router.push('/outbox')"
                class="w-full flex items-center gap-4 p-4 hover:bg-black/5 dark:hover:bg-white/5 transition-colors group text-left"
              >
                <div class="w-10 h-10 flex items-center justify-center text-primary bg-black/5 dark:bg-white/5 rounded-lg">
                  <Inbox class="w-5 h-5" />
                </div>
                <span class="font-medium text-primary flex-1">发信箱</span>
                <ChevronRight class="w-5 h-5 text-tertiary group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                @click="$router.push('/personal-info')"
                class="w-full flex items-center gap-4 p-4 hover:bg-black/5 dark:hover:bg-white/5 transition-colors group text-left"
              >
                <div class="w-10 h-10 flex items-center justify-center text-primary bg-black/5 dark:bg-white/5 rounded-lg">
                  <BadgeInfo class="w-5 h-5" />
                </div>
                <span class="font-medium text-primary flex-1">个人资料</span>
                <ChevronRight class="w-5 h-5 text-tertiary group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                @click="$router.push('/account-management')"
                class="w-full flex items-center gap-4 p-4 hover:bg-black/5 dark:hover:bg-white/5 transition-colors group text-left"
              >
                <div class="w-10 h-10 flex items-center justify-center text-primary bg-black/5 dark:bg-white/5 rounded-lg">
                  <UsersRound class="w-5 h-5" />
                </div>
                <span class="font-medium text-primary flex-1">账号管理</span>
                <ChevronRight class="w-5 h-5 text-tertiary group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                @click="router.push('/settings')"
                class="w-full flex items-center gap-4 p-4 hover:bg-black/5 dark:hover:bg-white/5 transition-colors group text-left"
              >
                <div class="w-10 h-10 flex items-center justify-center text-primary bg-black/5 dark:bg-white/5 rounded-lg">
                  <Settings class="w-5 h-5" />
                </div>
                <span class="font-medium text-primary flex-1">设置</span>
                <ChevronRight class="w-5 h-5 text-tertiary group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                class="w-full flex items-center gap-4 p-4 hover:bg-black/5 dark:hover:bg-white/5 transition-colors group text-left"
              >
                <div class="w-10 h-10 flex items-center justify-center text-primary bg-black/5 dark:bg-white/5 rounded-lg">
                  <HelpCircle class="w-5 h-5" />
                </div>
                <span class="font-medium text-primary flex-1">联系我们</span>
                <ChevronRight class="w-5 h-5 text-tertiary group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </nav>

          <!-- 退出登录 -->
          <button
            @click="handleLogout"
            class="w-full py-3.5 bg-neutral rounded-xl text-red-500 font-bold shadow-sm border border-black/5 dark:border-white/5 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors flex items-center justify-center gap-2"
          >
            <LogOut class="w-5 h-5" />
            退出登录
          </button>
        </aside>

        <!-- 右侧内容区 -->
        <div class="col-span-9 space-y-8">
          <!-- 我的喜欢 -->
          <section v-if="favorites.length > 0" class="bg-neutral rounded-2xl p-6 shadow-sm border border-black/5 dark:border-white/5">
            <div class="flex justify-between items-center mb-6">
              <h3 class="font-headline text-xl font-bold text-primary">我的喜欢</h3>
              <button @click="$router.push('/favorites')" class="text-sm font-semibold text-secondary hover:underline flex items-center">
                查看全部 <ChevronRight class="w-4 h-4 ml-1" />
              </button>
            </div>
            <div class="grid grid-cols-6 gap-4">
              <div v-for="fav in favorites" :key="fav.id" class="rounded-lg bg-black/5 dark:bg-white/5 overflow-hidden shadow-inner border border-black/10 dark:border-white/10 flex items-center justify-center p-2 aspect-square hover:shadow-md transition-shadow cursor-pointer">
                <img
                  :src="fav.src"
                  alt="Like"
                  class="w-full h-full object-cover grayscale-[30%] opacity-90"
                  referrerpolicy="no-referrer"
                />
              </div>
              <button @click="$router.push('/')" class="rounded-lg bg-black/5 dark:bg-white/5 overflow-hidden shadow-inner border border-black/10 dark:border-white/10 flex items-center justify-center p-2 aspect-square hover:shadow-md transition-shadow cursor-pointer">
                <div class="w-full h-full bg-black/5 dark:bg-white/5 flex items-center justify-center border-2 border-dashed border-black/20 dark:border-white/20 rounded-lg">
                  <Plus class="text-tertiary w-8 h-8" />
                </div>
              </button>
            </div>
          </section>

          <!-- 我的邮票 -->
          <section v-if="stamps.length > 0" class="bg-neutral rounded-2xl p-6 shadow-sm border border-black/5 dark:border-white/5">
            <div class="flex justify-between items-center mb-6">
              <h3 class="font-headline text-xl font-bold text-primary">我的邮票</h3>
              <button
                @click="$router.push('/my-stamps')"
                class="text-sm font-semibold text-secondary hover:underline flex items-center"
              >
                查看全部 <ChevronRight class="w-4 h-4 ml-1" />
              </button>
            </div>
            <div class="grid grid-cols-6 gap-4">
              <div v-for="stamp in stamps" :key="stamp.id" class="rounded-lg bg-[#F9F6F0] dark:bg-black/20 overflow-hidden shadow-sm border border-black/5 dark:border-white/5 p-4 flex items-center justify-center aspect-square hover:shadow-md transition-shadow cursor-pointer">
                <img
                  :src="stamp.src"
                  alt="Stamp"
                  class="w-full h-full object-cover filter sepia-[0.2] contrast-[0.9]"
                  referrerpolicy="no-referrer"
                />
              </div>
              <button @click="$router.push('/shop')" class="rounded-lg bg-black/5 dark:bg-white/5 overflow-hidden shadow-inner border border-black/10 dark:border-white/10 flex items-center justify-center p-4 aspect-square hover:shadow-md transition-shadow cursor-pointer">
                <div class="w-full h-full bg-black/5 dark:bg-white/5 flex items-center justify-center border-2 border-dashed border-black/20 dark:border-white/20 rounded-lg">
                  <Plus class="text-tertiary w-8 h-8" />
                </div>
              </button>
            </div>
          </section>
        </div>
      </div>
    </main>
    <!-- 退出登录确认弹窗 -->
    <Teleport to="body">
      <Transition name="logout-dialog">
        <div
          v-if="showLogoutDialog"
          class="fixed inset-0 z-[9999] flex items-center justify-center"
          @click.self="showLogoutDialog = false"
        >
          <!-- 遮罩 -->
          <div class="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>
          <!-- 弹窗 -->
          <div class="relative bg-neutral rounded-2xl shadow-xl border border-black/5 dark:border-white/10 w-[340px] max-w-[90vw] overflow-hidden">
            <!-- 顶部图标区域 -->
            <div class="flex justify-center pt-8 pb-4">
              <div class="w-16 h-16 rounded-full bg-red-50 dark:bg-red-500/10 flex items-center justify-center">
                <LogOut class="w-8 h-8 text-red-500" />
              </div>
            </div>
            <!-- 文字区域 -->
            <div class="text-center px-6 pb-6">
              <h3 class="text-lg font-bold text-primary mb-2">退出登录</h3>
              <p class="text-sm text-tertiary leading-relaxed">确定要退出当前账号吗？退出后需要重新登录才能使用全部功能。</p>
            </div>
            <!-- 按钮区域 -->
            <div class="flex border-t border-black/5 dark:border-white/10">
              <button
                @click="showLogoutDialog = false"
                class="flex-1 py-3.5 text-sm font-semibold text-tertiary hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
              >
                取消
              </button>
              <div class="w-px bg-black/5 dark:bg-white/10"></div>
              <button
                @click="confirmLogout"
                class="flex-1 py-3.5 text-sm font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
              >
                退出登录
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import {
  Moon,
  Sun,
  Coins,
  ChevronRight,
  Inbox,
  BadgeInfo,
  Settings,
  HelpCircle,
  Plus,
  UsersRound,
  PenLine,
  LogOut,
  CalendarCheck,
} from "lucide-vue-next";
import { ElMessage } from "element-plus";
import { useCheckIn } from "../store/checkin";
import { useUser } from "../store/user";

const router = useRouter();
const { isCheckedInToday } = useCheckIn();
const { userInfo, isLoggedIn, logout } = useUser();

// 检查登录状态
onMounted(() => {
  if (!isLoggedIn.value) {
    router.push('/login');
  }
});

// 用户信息（从store获取或使用默认值）
const displayUserInfo = computed(() => ({
  uid: userInfo.value?.uid || '1024520',
  username: userInfo.value?.username || '苏木',
  email: userInfo.value?.email || '',
  avatar: userInfo.value?.avatar || 'https://lh3.googleusercontent.com/aida-public/AB6AXuBYArdRu7qlNp4cuo06XFR6gjYC0xtUePbpepRVZFPb60NLBx_VR9amuEGGGmcgoSJxZnTSvk-qC-pT40C1BcNky-vgDMQS81oXbUZ1ZhPGx8TyP5kDLnK2UxXs44i4R9b0C6J2F0AegR2bJ6baLYqRUydE5fXGJMLngQf9plW3-BdtpO6Gnq5BWbM5Y8_ZXBxCkBcu_AycBYRNspo0GmyLKNOwz7WDP8qJiBl97glqeE0pFejorxYMHYxFqX9mdXogSMmgx3TMR9IR',
  vipLevel: userInfo.value?.vipLevel || 'VIP',
  coins: userInfo.value?.coins || 850,
}));

// 退出登录
const showLogoutDialog = ref(false);

const handleLogout = () => {
  showLogoutDialog.value = true;
};

const confirmLogout = () => {
  showLogoutDialog.value = false;
  logout();
  ElMessage.success('已退出登录');
  router.push('/login');
};

const isDarkMode = ref(document.documentElement.classList.contains("dark"));

// 我的喜欢数据
const favorites = ref([
  { id: 1, src: "https://lh3.googleusercontent.com/aida-public/AB6AXuBMKuwdrzd0kycg5QbGFmMJMDT8RsE6UNc85oboGn-Tofw_7BqW1Fr1AxqgdIPVAOliVNVYW_xxX0D9w4teG8vu716EueLdlhtDZNMzx4AmtF6xpsxUovOnN9vxwxh4HShX2hixpG3URlodGZn0CCfMvapoqBDQoMNPiYZ7qRUDV_u5MqQexSdA1w6diNCYt21t14DqvZwE3JkN7udert8x6WNdDwaS9gdJzPKoMDZmPcvKSVzXPcgpoOY3CCfVKFU3sqia8imIUDUG" },
  { id: 2, src: "https://lh3.googleusercontent.com/aida-public/AB6AXuD8esTrkcudCbjzxuyIIZl0OCZpj1YT0KrcsHLaFrj43bnf3Yyf1EG7V2yrCFBiQJK_VMmMd5xZhxjcmY85_K-f3XyDDmIxud0i4ZezXKMBuMwEqvSQtj3Siz08fk9w-dqNpBzh7L7aQUeOx5qtP7b7xOX0rbyi563zBqiOlcDN2Q9U5FKt-KltCVOYDRP7g3Ed3QL9fU9JY6-I1HARQriDG_92_H4iVMyiV6Lsnf7cEnK1_Dy0rY0plcdR2YAIPfEZgGmPRYvzw_V5" },
  { id: 3, src: "https://lh3.googleusercontent.com/aida-public/AB6AXuA0i-x6RyD7D2rgu2L8AzwaNHZzBYtWuJj6TtriMJjqVRxLpFGpCq4NIH2Grin9XOy8Pd3vjY8zFfJ35c0h20F0IrFtD7y28Xd9NfXGoploNukwtK3NgoPGEa7VSOEBh4KD4kyXVIRQ0jWYVLO2kJHCx9n8kcXqOQdi-Nd68yzmGnwkZBGhLGX0_S9Cu8AfSXzjBlGzXqf8l2XI-wAwWqxhTz_RASrcIKtt1Bdh6wqEzNFbMHjXcTtyd41-AhHu91wpD4qb4WLcp1F2" },
  { id: 4, src: "https://lh3.googleusercontent.com/aida-public/AB6AXuBnUhh60TiT7aekmcLcT4l_yIZOLue3dmhExmphjrn1fS3VZTrDAv2lbSz6059VL7VGYbj-rv9_i-a1MIdVEDnRSYMX2KMJHvlExgAM1Ve24Mpbi0OYM-RD0ZeF-iO7SG-b04WRIc1xMmC_aDQStq7yjMkkY2PTeqxfqehT_Lr2H3JDCZ48bzFj4pMkgu653P__1D9wlGCUu7oBr85cnBGBS5U3tk7iQ0IRtow3JTzH79CSEPytQNknDAx3BGxkfY6jR7U3m_ZfqidY" },
  { id: 5, src: "https://lh3.googleusercontent.com/aida-public/AB6AXuACTQfqd5zXW2cKBxVnuuNO9i9sq9Pk5JxreFwtXeFdwc2pIGVpcU8BSfkdg66pV8mXppMTUSNe2TNBt-8TAoJ_2qqGJdzR_AFhAht55cKNTHZl4J9MiGOF0m0GQeEaxBa0yPxLxlEqKz087elMQkmKsxl-N_MVFnQRLbTNconhVSYMHMKpzscx-mjg_lrzPMKbISEr9Tkei_ZxplmcGlDa-zn-f5Au102bOzwcGfBXkE4OHYlcPjh2knYoakUw-Zw564zPDVLeUzRI" },
]);

// 我的邮票数据
const stamps = ref([
  { id: 1, src: "https://lh3.googleusercontent.com/aida-public/AB6AXuCCuA3ITyTjAAZHjpQdzaxoz_Fj7kS8s9bOqSMfo-b5rvYDRkx_lu9zS2SxSNHmBa21d22iOl1aI2XH0Wrh5eAYkrdMxSzPP-wxXFxoncAURrZUo0mhvigfEtR2T3YlGUj3dyvyRED-j2jrpg1X1Ua9HyJr8qCcJlehFYuuxoCubfWAImXJg3acTqnNozdo7U7MJ9DVEXr0Pb15BXDW8B9S1JPVIIIQbXZoW3A39xaIQyBXE3ZRs6yMdwpiVAFVgJfJSL-JlRnV4hjr" },
  { id: 2, src: "https://lh3.googleusercontent.com/aida-public/AB6AXuAlKz4qb-d4igGDqny56-uA1vK6Ei_rPNv55pAdpWlJHIBu58t-qTJHmA3XeKv_eS9R_PuvsaV9HG5HeBsXPNRguMmGXQBHpvt9vzxvOzVGO5HIOmO2YFGjxR6IIjVLHLg6XtG8M6RyQWhjqd9TWs2_TDs4xSonm0vL4z6LkSlAE_OIVML9aeSKopbclE9UH1WB7_Lr5Olg_DqF_FUQV6VrKGXD0PGn-hudoUmxm0za9aPSZ-h-YLoRDGAdJqjA6Sg7P_mGf6DhbXWY" },
  { id: 3, src: "https://lh3.googleusercontent.com/aida-public/AB6AXuA6-BNJlQ55PxdvY1UXD45Wie8kBG7J6JTVCn5qNwnfa6qOvYBt5nspqTv9Y2hLywxu9ukuz_JoJ7nGk5W1-1rDRNw8YlRnbehXubse9vZL6xRx7-DYugHhfAsOp6dW_MSzOo1dbooulIiKTED90ioKBf9Wp-pX1Zuf38IWZvJ5KxQuMj7BzvOzO_3_zQmmzbDOacECcpIb8DMfzWI9kmthoBMwnlH6oWk0zXJoXi5797Su8JUsS4_ENRqenDU_UI8Ke-IPS-p1tae5" },
  { id: 4, src: "https://lh3.googleusercontent.com/aida-public/AB6AXuBpQB1UjhAO6vKRAmMCZ3S-ZXr4gDQlqg5p_W8s3VQpSmvRI8ZFWb77GoNBv1pQSFrp29yzGKO7ToSmCsWu9eNOaU_yX73rDlmxzzYR-EYGqNvFUE9GU6-pML47z4gssxtjKw_D_hu5YoklvsjsZ5dZrTS2IeRIP-gSHZcX3uPab0dieLB1NT001ypZsLjEHGBoDGCLhP1xeR5D_2qEjeG2fSwr4mRFlZdTvCOPQXRPk_odlghJSqkYkSEVqyTj6SUXh89WxKOTVryA" },
  { id: 5, src: "https://lh3.googleusercontent.com/aida-public/AB6AXuBd6X2WJj88uA-1RVrxPORBU5AZOzg0nPJE0215heBs15OL-FE5V0Emhxn5a0nfklc9t6clO3mSiIjAFO0I0Mu6Y2NWyuafRtrW3L14crLdzu4cKDxHP18lUsiFqiPeocxG9WI6YO4O4sNEKukHmVSUdMlVnvlI-UWmX3fegWKNND6QcgHxDuYmLtaJ0Wtz_zWoy5sgdMRBUu-O97TbNR-8JnQ8bWqrJpMMyC0G6wyiLUlrmBrDU1-IrnmebQHtx7qpfUFYV-XhueBQ" },
]);

const toggleDarkMode = () => {
  isDarkMode.value = !isDarkMode.value;
  if (isDarkMode.value) {
    document.documentElement.classList.add("dark");
    localStorage.setItem("theme", "dark");
  } else {
    document.documentElement.classList.remove("dark");
    localStorage.setItem("theme", "light");
  }
};
</script>

<style scoped>
.logout-dialog-enter-active,
.logout-dialog-leave-active {
  transition: opacity 0.2s ease;
}
.logout-dialog-enter-active .relative,
.logout-dialog-leave-active .relative {
  transition: transform 0.2s ease, opacity 0.2s ease;
}
.logout-dialog-enter-from,
.logout-dialog-leave-to {
  opacity: 0;
}
.logout-dialog-enter-from .relative {
  transform: scale(0.95);
  opacity: 0;
}
.logout-dialog-leave-to .relative {
  transform: scale(0.95);
  opacity: 0;
}
</style>
