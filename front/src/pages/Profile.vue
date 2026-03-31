<template>
  <div class="min-h-screen bg-background pb-32">
    <header
      class="flex justify-end items-center w-full px-6 py-4 sticky top-0 z-50 bg-background"
    >
      <button @click="toggleDarkMode" class="text-primary hover:opacity-80 transition-opacity">
        <component :is="isDarkMode ? Sun : Moon" class="w-6 h-6" />
      </button>
    </header>

    <main class="max-w-md mx-auto pt-6 px-6 space-y-10">
      <section class="flex items-center justify-between gap-6">
        <div class="flex items-center gap-6">
          <div class="relative group shrink-0">
            <div
              class="w-20 h-20 rounded-full overflow-hidden border-2 border-black/10 shadow-sm"
            >
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBYArdRu7qlNp4cuo06XFR6gjYC0xtUePbpepRVZFPb60NLBx_VR9amuEGGGmcgoSJxZnTSvk-qC-pT40C1BcNky-vgDMQS81oXbUZ1ZhPGx8TyP5kDLnK2UxXs44i4R9b0C6J2F0AegR2bJ6baLYqRUydE5fXGJMLngQf9plW3-BdtpO6Gnq5BWbM5Y8_ZXBxCkBcu_AycBYRNspo0GmyLKNOwz7WDP8qJiBl97glqeE0pFejorxYMHYxFqX9mdXogSMmgx3TMR9IR"
                alt="Avatar"
                class="w-full h-full object-cover"
                referrerpolicy="no-referrer"
              />
            </div>
            <div
              class="absolute -bottom-1 -right-1 bg-secondary text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider shadow-sm"
            >
              VIP
            </div>
          </div>
          <div class="flex flex-col">
            <div class="flex items-center gap-3">
              <h2 class="font-headline text-2xl text-primary font-bold">苏木</h2>
              <button class="text-tertiary hover:text-primary transition-colors">
                <PenLine class="w-4 h-4" />
              </button>
            </div>
            <div class="flex flex-col mt-1 space-y-2">
              <span class="text-sm text-tertiary font-medium tracking-tight"
                >UID: 1024520</span
              >
              <div
                class="inline-flex items-center gap-1.5 px-3 py-1 bg-black/5 dark:bg-white/5 rounded-full w-fit"
              >
                <Coins class="w-4 h-4 text-tertiary" />
                <span class="text-xs font-semibold text-primary"
                  >虚拟货币: 850 邮分</span
                >
              </div>
            </div>
          </div>
        </div>
      </section>

      <section class="space-y-4">
        <div class="flex justify-between items-end">
          <h3
            class="font-headline text-lg font-bold text-primary border-l-4 border-secondary pl-3"
          >
            我的喜欢
          </h3>
          <button
            class="text-xs font-semibold text-secondary hover:underline flex items-center"
          >
            查看全部 <ChevronRight class="w-3 h-3 ml-0.5" />
          </button>
        </div>
        <div class="grid grid-cols-4 gap-3">
          <div
            class="rounded-sm bg-black/5 dark:bg-white/5 overflow-hidden shadow-inner border border-black/10 dark:border-white/10 flex items-center justify-center p-1 aspect-square"
          >
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBMKuwdrzd0kycg5QbGFmMJMDT8RsE6UNc85oboGn-Tofw_7BqW1Fr1AxqgdIPVAOliVNVYW_xxX0D9w4teG8vu716EueLdlhtDZNMzx4AmtF6xpsxUovOnN9vxwxh4HShX2hixpG3URlodGZn0CCfMvapoqBDQoMNPiYZ7qRUDV_u5MqQexSdA1w6diNCYt21t14DqvZwE3JkN7udert8x6WNdDwaS9gdJzPKoMDZmPcvKSVzXPcgpoOY3CCfVKFU3sqia8imIUDUG"
              alt="Like 1"
              class="w-full h-full object-cover grayscale-[30%] opacity-90"
              referrerpolicy="no-referrer"
            />
          </div>
          <div
            class="rounded-sm bg-black/5 dark:bg-white/5 overflow-hidden shadow-inner border border-black/10 dark:border-white/10 flex items-center justify-center p-1 aspect-square"
          >
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuD8esTrkcudCbjzxuyIIZl0OCZpj1YT0KrcsHLaFrj43bnf3Yyf1EG7V2yrCFBiQJK_VMmMd5xZhxjcmY85_K-f3XyDDmIxud0i4ZezXKMBuMwEqvSQtj3Siz08fk9w-dqNpBzh7L7aQUeOx5qtP7b7xOX0rbyi563zBqiOlcDN2Q9U5FKt-KltCVOYDRP7g3Ed3QL9fU9JY6-I1HARQriDG_92_H4iVMyiV6Lsnf7cEnK1_Dy0rY0plcdR2YAIPfEZgGmPRYvzw_V5"
              alt="Like 2"
              class="w-full h-full object-cover grayscale-[30%] opacity-90"
              referrerpolicy="no-referrer"
            />
          </div>
          <div
            class="rounded-sm bg-black/5 dark:bg-white/5 overflow-hidden shadow-inner border border-black/10 dark:border-white/10 flex items-center justify-center p-1 aspect-square"
          >
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuA0i-x6RyD7D2rgu2L8AzwaNHZzBYtWuJj6TtriMJjqVRxLpFGpCq4NIH2Grin9XOy8Pd3vjY8zFfJ35c0h20F0IrFtD7y28Xd9NfXGoploNukwtK3NgoPGEa7VSOEBh4KD4kyXVIRQ0jWYVLO2kJHCx9n8kcXqOQdi-Nd68yzmGnwkZBGhLGX0_S9Cu8AfSXzjBlGzXqf8l2XI-wAwWqxhTz_RASrcIKtt1Bdh6wqEzNFbMHjXcTtyd41-AhHu91wpD4qb4WLcp1F2"
              alt="Like 3"
              class="w-full h-full object-cover grayscale-[30%] opacity-90"
              referrerpolicy="no-referrer"
            />
          </div>
          <div
            class="rounded-sm bg-black/5 dark:bg-white/5 overflow-hidden shadow-inner border border-black/10 dark:border-white/10 flex items-center justify-center p-1 aspect-square"
          >
            <div
              class="w-full h-full bg-black/5 dark:bg-white/5 flex items-center justify-center border-2 border-dashed border-black/20 dark:border-white/20 rounded-sm"
            >
              <Plus class="text-tertiary w-6 h-6" />
            </div>
          </div>
        </div>
      </section>

      <section class="space-y-4">
        <div class="flex justify-between items-end">
          <h3
            class="font-headline text-lg font-bold text-primary border-l-4 border-secondary pl-3"
          >
            我的邮票
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
            class="rounded-sm bg-black/5 dark:bg-white/5 overflow-hidden shadow-inner border border-black/10 dark:border-white/10 flex items-center justify-center p-1 aspect-square"
          >
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCCuA3ITyTjAAZHjpQdzaxoz_Fj7kS8s9bOqSMfo-b5rvYDRkx_lu9zS2SxSNHmBa21d22iOl1aI2XH0Wrh5eAYkrdMxSzPP-wxXFxoncAURrZUo0mhvigfEtR2T3YlGUj3dyvyRED-j2jrpg1X1Ua9HyJr8qCcJlehFYuuxoCubfWAImXJg3acTqnNozdo7U7MJ9DVEXr0Pb15BXDW8B9S1JPVIIIQbXZoW3A39xaIQyBXE3ZRs6yMdwpiVAFVgJfJSL-JlRnV4hjr"
              alt="Collection 1"
              class="w-full h-full object-cover grayscale-[30%] opacity-90"
              referrerpolicy="no-referrer"
            />
          </div>
          <div
            class="rounded-sm bg-black/5 dark:bg-white/5 overflow-hidden shadow-inner border border-black/10 dark:border-white/10 flex items-center justify-center p-1 aspect-square"
          >
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAlKz4qb-d4igGDqny56-uA1vK6Ei_rPNv55pAdpWlJHIBu58t-qTJHmA3XeKv_eS9R_PuvsaV9HG5HeBsXPNRguMmGXQBHpvt9vzxvOzVGO5HIOmO2YFGjxR6IIjVLHLg6XtG8M6RyQWhjqd9TWs2_TDs4xSonm0vL4z6LkSlAE_OIVML9aeSKopbclE9UH1WB7_Lr5Olg_DqF_FUQV6VrKGXD0PGn-hudoUmxm0za9aPSZ-h-YLoRDGAdJqjA6Sg7P_mGf6DhbXWY"
              alt="Collection 2"
              class="w-full h-full object-cover grayscale-[30%] opacity-90"
              referrerpolicy="no-referrer"
            />
          </div>
          <div
            class="rounded-sm bg-black/5 dark:bg-white/5 overflow-hidden shadow-inner border border-black/10 dark:border-white/10 flex items-center justify-center p-1 aspect-square"
          >
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuA6-BNJlQ55PxdvY1UXD45Wie8kBG7J6JTVCn5qNwnfa6qOvYBt5nspqTv9Y2hLywxu9ukuz_JoJ7nGk5W1-1rDRNw8YlRnbehXubse9vZL6xRx7-DYugHhfAsOp6dW_MSzOo1dbooulIiKTED90ioKBf9Wp-pX1Zuf38IWZvJ5KxQuMj7BzvOzO_3_zQmmzbDOacECcpIb8DMfzWI9kmthoBMwnlH6oWk0zXJoXi5797Su8JUsS4_ENRqenDU_UI8Ke-IPS-p1tae5"
              alt="Collection 3"
              class="w-full h-full object-cover grayscale-[30%] opacity-90"
              referrerpolicy="no-referrer"
            />
          </div>
          <div
            class="rounded-sm bg-black/5 dark:bg-white/5 overflow-hidden shadow-inner border border-black/10 dark:border-white/10 flex items-center justify-center p-1 aspect-square"
          >
            <div
              class="w-full h-full bg-black/5 dark:bg-white/5 flex items-center justify-center border-2 border-dashed border-black/20 dark:border-white/20 rounded-sm"
            >
              <Plus class="text-tertiary w-6 h-6" />
            </div>
          </div>
        </div>
      </section>

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

      <section class="pt-2">
        <button
          class="w-full py-3.5 bg-neutral rounded-xl text-red-500 font-bold shadow-sm border border-black/5 dark:border-white/5 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors flex items-center justify-center gap-2"
        >
          <LogOut class="w-5 h-5" />
          退出登录
        </button>
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
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
} from "lucide-vue-next";

const isDarkMode = ref(document.documentElement.classList.contains("dark"));

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
