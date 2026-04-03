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
      <h1 class="font-headline text-xl font-bold text-primary">发件箱</h1>
    </header>

    <main class="max-w-5xl mx-auto px-4 pt-6 space-y-4">
      <div v-if="outboxList.length === 0" class="rounded-2xl border border-black/10 dark:border-white/10 p-8 text-center bg-white dark:bg-neutral">
        <p class="text-sm text-black/50 dark:text-white/50">还没有已发送的邮件</p>
      </div>

      <div
        v-for="mail in outboxList"
        :key="mail.id"
        class="rounded-2xl border border-black/10 dark:border-white/10 bg-white dark:bg-neutral p-4 space-y-4"
      >
        <div class="flex items-start justify-between gap-3">
          <div class="space-y-1 min-w-0">
            <h3 class="text-base font-bold text-primary truncate">{{ mail.title || '无标题明信片' }}</h3>
            <p class="text-xs text-black/50 dark:text-white/50">收件人：{{ mail.recipient || '未填写' }}</p>
            <p class="text-xs text-black/40 dark:text-white/40">发送时间：{{ formatTime(mail.createdAt) }}</p>
          </div>
          <button
            @click="removeMail(mail.id)"
            class="shrink-0 px-3 py-1.5 text-xs font-bold rounded-lg border border-red-300 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
          >
            删除
          </button>
        </div>

        <div class="space-y-3">
          <div class="flex items-center justify-between text-xs">
            <span class="text-black/60 dark:text-white/60">审核进度</span>
            <span class="font-semibold text-primary">{{ reviewPercent(mail) }}%</span>
          </div>
          <div class="w-full h-2 rounded-full bg-black/10 dark:bg-white/10 overflow-hidden">
            <div
              class="h-full bg-secondary transition-all duration-300"
              :style="{ width: reviewPercent(mail) + '%' }"
            ></div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div class="flex items-center justify-between px-3 py-2 rounded-lg bg-black/5 dark:bg-white/5">
              <span class="text-xs text-black/60 dark:text-white/60">AI审核</span>
              <span class="text-xs font-bold text-green-600 dark:text-green-400">{{ mail.aiReviewStatus || '通过' }}</span>
            </div>
            <div class="flex items-center justify-between px-3 py-2 rounded-lg bg-black/5 dark:bg-white/5">
              <span class="text-xs text-black/60 dark:text-white/60">人工审核</span>
              <span
                class="text-xs font-bold"
                :class="mail.manualReviewStatus === '通过' ? 'text-green-600 dark:text-green-400' : 'text-amber-600 dark:text-amber-400'"
              >
                {{ mail.manualReviewStatus || '待审核' }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { ChevronLeft } from "lucide-vue-next";

type OutboxItem = {
  id: number;
  title?: string;
  recipient?: string;
  createdAt?: string;
  aiReviewStatus?: string;
  manualReviewStatus?: string;
};

const outboxList = ref<OutboxItem[]>([]);

const loadOutbox = () => {
  const stored = localStorage.getItem("userPostcards");
  const list = stored ? JSON.parse(stored) : [];
  outboxList.value = list.map((item: OutboxItem) => ({
    ...item,
    aiReviewStatus: item.aiReviewStatus || "通过",
    manualReviewStatus: item.manualReviewStatus || "待审核",
  }));
};

const removeMail = (id: number) => {
  outboxList.value = outboxList.value.filter((item) => item.id !== id);
  localStorage.setItem("userPostcards", JSON.stringify(outboxList.value));
};

const reviewPercent = (mail: OutboxItem) => {
  const aiPassed = (mail.aiReviewStatus || "通过") === "通过";
  const manualPassed = (mail.manualReviewStatus || "待审核") === "通过";
  if (aiPassed && manualPassed) return 100;
  if (aiPassed) return 50;
  return 0;
};

const formatTime = (dateStr?: string) => {
  if (!dateStr) return "--";
  const date = new Date(dateStr);
  if (Number.isNaN(date.getTime())) return "--";
  return date.toLocaleString();
};

onMounted(() => {
  loadOutbox();
});
</script>


