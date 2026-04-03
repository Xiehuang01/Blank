<template>
  <div class="min-h-screen bg-background pb-24 md:pb-0">
    <!-- Header -->
    <header class="sticky top-0 z-40 flex items-center px-4 h-16 bg-background/90 backdrop-blur-sm border-b border-primary/10">
      <button @click="$router.back()" class="text-primary hover:text-secondary transition-colors mr-4">
        <ChevronLeft class="w-6 h-6" />
      </button>
      <h1 class="font-headline text-xl font-bold text-primary">每日签到</h1>
    </header>

    <main class="max-w-5xl mx-auto p-4 md:p-8">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
        
        <!-- 左侧日历 -->
        <div class="bg-neutral rounded-3xl p-6 border border-black/5 dark:border-white/5 shadow-sm flex flex-col items-center">
          <div class="w-full flex items-center justify-between mb-6">
            <h2 class="text-lg font-bold text-primary">{{ currentMonth }} {{ currentYear }}</h2>
            <div class="text-sm font-semibold text-secondary bg-secondary/10 px-3 py-1 rounded-full">
              已连续签到 {{ consecutiveDays }} 天
            </div>
          </div>
          
          <div class="w-full max-w-sm">
            <div class="grid grid-cols-7 gap-2 mb-4">
              <div v-for="day in dayNames" :key="day" class="text-center text-xs font-semibold text-tertiary">
                {{ day }}
              </div>
            </div>
            
            <div class="grid grid-cols-7 gap-2">
              <div v-for="(empty, i) in firstDayOfWeek" :key="'empty-'+i" class="aspect-square"></div>
              
              <div 
                v-for="day in daysInMonth" 
                :key="'day-'+day"
                class="aspect-square flex items-center justify-center rounded-xl text-sm font-medium transition-all"
                :class="[
                  isToday(day) && !hasCheckedIn(day) ? 'bg-primary text-white shadow-md ring-2 ring-primary/20 ring-offset-2 ring-offset-background' : '',
                  hasCheckedIn(day) ? 'bg-secondary text-white shadow-sm' : '',
                  !isToday(day) && !hasCheckedIn(day) ? 'text-primary/60 hover:bg-black/5 dark:hover:bg-white/5' : ''
                ]"
              >
                {{ day }}
              </div>
            </div>
          </div>

          <button 
            @click="doCheckIn" 
            :disabled="hasCheckedIn(currentDate.getDate())"
            class="mt-8 w-full max-w-sm py-3.5 rounded-2xl font-bold transition-all"
            :class="hasCheckedIn(currentDate.getDate()) ? 'bg-black/10 dark:bg-white/10 text-tertiary cursor-not-allowed' : 'bg-secondary text-white hover:opacity-90 shadow-lg hover:shadow-xl hover:-translate-y-0.5'"
          >
            {{ hasCheckedIn(currentDate.getDate()) ? '今日已签到' : '立即签到领 10 邮分' }}
          </button>
        </div>

        <!-- 右侧任务面板 -->
        <div class="flex flex-col gap-4">
          <h2 class="text-xl font-bold text-primary mb-2">每日任务</h2>
          
          <!-- 签到任务 -->
          <div class="bg-neutral rounded-2xl p-5 border border-black/5 dark:border-white/5 shadow-sm flex items-center gap-4 transition-all hover:border-secondary/30">
            <div class="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center shrink-0">
              <CalendarCheck class="w-6 h-6 text-secondary" />
            </div>
            <div class="flex-1">
              <h3 class="font-bold text-primary text-sm mb-1">每日签到</h3>
              <p class="text-xs text-tertiary">签到即可获得邮分奖励</p>
            </div>
            <div class="flex flex-col items-end gap-2 shrink-0">
              <div class="flex items-center gap-1 text-secondary font-bold text-sm">
                <Coins class="w-4 h-4" />
                +10
              </div>
              <button 
                @click="doCheckIn"
                :disabled="hasCheckedIn(currentDate.getDate())"
                class="px-4 py-1.5 rounded-full text-xs font-bold transition-colors"
                :class="hasCheckedIn(currentDate.getDate()) ? 'bg-black/5 dark:bg-white/5 text-tertiary' : 'bg-primary text-white hover:bg-primary/90'"
              >
                {{ hasCheckedIn(currentDate.getDate()) ? '已完成' : '去完成' }}
              </button>
            </div>
          </div>

          <!-- 发送明信片任务 -->
          <div class="bg-neutral rounded-2xl p-5 border border-black/5 dark:border-white/5 shadow-sm flex items-center gap-4 transition-all hover:border-primary/30">
            <div class="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
              <Send class="w-6 h-6 text-primary" />
            </div>
            <div class="flex-1">
              <h3 class="font-bold text-primary text-sm mb-1">发送明信片</h3>
              <p class="text-xs text-tertiary">向好友或广场发送一张明信片</p>
            </div>
            <div class="flex flex-col items-end gap-2 shrink-0">
              <div class="flex items-center gap-1 text-primary font-bold text-sm">
                <Coins class="w-4 h-4" />
                +20
              </div>
              <button 
                @click="$router.push('/create')"
                class="px-4 py-1.5 rounded-full text-xs font-bold bg-primary text-white hover:bg-primary/90 transition-colors"
              >
                去完成
              </button>
            </div>
          </div>

        </div>

      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { ChevronLeft, CalendarCheck, Send, Coins } from 'lucide-vue-next';
import { ElMessage } from 'element-plus';
import { useRouter } from 'vue-router';
import { useCheckIn } from '../store/checkin';

const router = useRouter();
const { isCheckedInToday, doCheckIn: storeCheckIn } = useCheckIn();

const dayNames = ["日", "一", "二", "三", "四", "五", "六"];
const currentDate = new Date();
const currentYear = currentDate.getFullYear();
const currentMonth = currentDate.toLocaleString("zh-CN", { month: "long" });

const firstDayOfMonth = new Date(currentYear, currentDate.getMonth(), 1);
const firstDayOfWeek = firstDayOfMonth.getDay();
const daysInMonth = new Date(currentYear, currentDate.getMonth() + 1, 0).getDate();

// 模拟签到数据
const checkedInDays = ref<number[]>([]);
const consecutiveDays = ref(0);

const isToday = (day: number) => {
  return day === currentDate.getDate();
};

const hasCheckedIn = (day: number) => {
  if (isToday(day) && isCheckedInToday.value) return true;
  return checkedInDays.value.includes(day);
};

const doCheckIn = () => {
  const today = currentDate.getDate();
  if (hasCheckedIn(today)) return;

  checkedInDays.value.push(today);
  consecutiveDays.value += 1;
  storeCheckIn();
  ElMessage.success('签到成功！获得 10 邮分');
};

onMounted(() => {
  if (isCheckedInToday.value) {
    checkedInDays.value.push(currentDate.getDate());
    consecutiveDays.value = 1;
  }
});
</script>
