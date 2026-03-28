<template>
  <div class="min-h-screen bg-background pb-24">
    <header
      class="sticky top-0 z-40 flex justify-between items-center w-full px-4 h-16 bg-background/90 backdrop-blur-sm border-b border-primary/10"
    >
      <div class="flex items-center gap-4 flex-1">
        <button
          class="text-primary hover:bg-primary/5 p-2 rounded-full transition-colors"
        >
          <Mail class="w-5 h-5" />
        </button>
        <div class="relative flex-1 max-w-md">
          <Search
            class="absolute left-3 top-1/2 -translate-y-1/2 text-tertiary w-4 h-4"
          />
          <input
            type="text"
            placeholder="搜索邮件..."
            class="w-full bg-black/5 border-none rounded-full py-1.5 pl-10 pr-4 text-sm font-body focus:ring-1 focus:ring-primary/20 placeholder:text-tertiary"
          />
        </div>
      </div>
      <div class="flex items-center gap-1 ml-4">
        <button
          class="text-primary hover:bg-primary/5 p-2 rounded-full transition-colors"
        >
          <Users class="w-5 h-5" />
        </button>
        <button
          class="text-primary hover:bg-primary/5 p-2 rounded-full transition-colors"
        >
          <ListFilter class="w-5 h-5" />
        </button>
      </div>
    </header>

    <main class="max-w-7xl mx-auto px-6 py-8">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 md:gap-8 lg:gap-12">
        <!-- Postcard 1 -->
        <div class="relative w-full aspect-[3/2] group cursor-pointer" @click="flipped[0] = !flipped[0]">
          <div
            :class="[
              'absolute inset-0 rounded-none bg-white dark:bg-neutral p-5 flex border border-black/10 dark:border-white/10 transition-all duration-500 shadow-inner',
              flipped[0] ? 'translate-x-4 translate-y-4 rotate-2 shadow-lg z-0 group-hover:rotate-1' : '-translate-x-4 -translate-y-4 -rotate-1 shadow-2xl z-10 group-hover:rotate-0'
            ]"
          >
            <!-- Left Side -->
            <div class="flex-1 flex flex-col pr-5 border-r border-black/20">
              <h3 class="font-headline text-xl tracking-widest text-black/60 mb-2">POSTCARD</h3>
              <div class="relative flex-1">
                 <p class="absolute inset-0 font-handwritten text-xl text-primary leading-loose opacity-60 pt-2">
                   山间的云雾绕过窗棂...
                 </p>
                 <div class="flex flex-col justify-between h-full pt-6 pb-2">
                   <div class="w-full h-[1px] bg-black/10"></div>
                   <div class="w-full h-[1px] bg-black/10"></div>
                   <div class="w-full h-[1px] bg-black/10"></div>
                   <div class="w-full h-[1px] bg-black/10"></div>
                   <div class="w-full h-[1px] bg-black/10"></div>
                 </div>
              </div>
            </div>
            <!-- Right Side -->
            <div class="flex-1 flex flex-col pl-5">
              <div class="flex justify-end relative">
                <!-- Stamp -->
                <div class="w-14 h-14 rounded-full border-[1.5px] border-black/30 flex items-center justify-center relative bg-black/5" style="border-style: dashed;">
                   <!-- Wavy lines -->
                   <div class="absolute -left-10 top-1/2 -translate-y-1/2 flex flex-col gap-1.5 opacity-40">
                     <svg width="32" height="4" viewBox="0 0 40 4" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M0 2C5 2 5 0 10 0C15 0 15 4 20 4C25 4 25 0 30 0C35 0 35 4 40 4" stroke="black" stroke-width="1"/></svg>
                     <svg width="32" height="4" viewBox="0 0 40 4" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M0 2C5 2 5 0 10 0C15 0 15 4 20 4C25 4 25 0 30 0C35 0 35 4 40 4" stroke="black" stroke-width="1"/></svg>
                     <svg width="32" height="4" viewBox="0 0 40 4" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M0 2C5 2 5 0 10 0C15 0 15 4 20 4C25 4 25 0 30 0C35 0 35 4 40 4" stroke="black" stroke-width="1"/></svg>
                     <svg width="32" height="4" viewBox="0 0 40 4" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M0 2C5 2 5 0 10 0C15 0 15 4 20 4C25 4 25 0 30 0C35 0 35 4 40 4" stroke="black" stroke-width="1"/></svg>
                   </div>
                </div>
              </div>
              <div class="flex-1 flex flex-col justify-end gap-3 pb-2">
                <div class="flex items-end gap-2">
                  <span class="text-xs text-black/60 font-body">to:</span>
                  <div class="flex-1 h-[1px] bg-black/20"></div>
                </div>
                <div class="w-full h-[1px] bg-black/20"></div>
                <div class="flex items-end gap-2">
                  <span class="text-xs text-black/60 font-body">from:</span>
                  <div class="flex-1 h-[1px] bg-black/20"></div>
                </div>
                <div class="w-full h-[1px] bg-black/20"></div>
              </div>
            </div>
          </div>
          <div
            :class="[
              'absolute inset-0 rounded-none bg-white dark:bg-neutral p-3 transition-all duration-500',
              flipped[0] ? '-translate-x-4 -translate-y-4 -rotate-1 shadow-2xl z-10 group-hover:rotate-0' : 'translate-x-4 translate-y-4 rotate-2 shadow-lg z-0 group-hover:rotate-1'
            ]"
          >
            <div class="w-full h-full relative border border-black/5 dark:border-white/5 overflow-hidden">
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuEv-yDSqopqu9Q_KHcz9MFqv8SywAJ1DM0io55zjsL_PRMVgJe7Lgxpw_v3v-7ji9sPW5IwEIc2BEzED9LfdTk9yjY1QCGFL0_WcNKqxYziyjdMsArGFgCS8nuN9GjMFJYzOSyMp-xh0znk8OdZIjv8h_k4WDRr1VwuC0dBy5-x8kWCTrxuneHRIoctaf5t_ck28DnD6MrZRZlgNi2RW96VrjmoJsaausNishEQDZeN-BpZuKe-vbM8roCO1qX01Icvb_0NKwAjl7c"
                alt="Misty Mountains"
                class="w-full h-full object-cover"
                referrerpolicy="no-referrer"
              />
            </div>
          </div>
        </div>

        <!-- Postcard 2 -->
        <div class="relative w-full aspect-[3/2] group cursor-pointer" @click="flipped[1] = !flipped[1]">
          <!-- Back (Text side) -->
          <div
            :class="[
              'absolute inset-0 rounded-none bg-white p-5 flex border border-black/10 transition-all duration-500 shadow-inner',
              flipped[1] ? 'translate-x-4 translate-y-4 rotate-2 shadow-lg z-0 group-hover:rotate-1' : '-translate-x-4 -translate-y-4 -rotate-1 shadow-2xl z-10 group-hover:rotate-0'
            ]"
          >
            <!-- Left Side -->
            <div class="flex-1 flex flex-col pr-5 border-r border-black/20">
              <h3 class="font-headline text-xl tracking-widest text-black/60 mb-2">POSTCARD</h3>
              <div class="relative flex-1">
                 <p class="absolute inset-0 font-handwritten text-xl text-primary leading-loose opacity-60 pt-2">
                   东京的午后静得出奇，<br />咖啡的余温里藏着信。
                 </p>
                 <div class="flex flex-col justify-between h-full pt-6 pb-2">
                   <div class="w-full h-[1px] bg-black/10"></div>
                   <div class="w-full h-[1px] bg-black/10"></div>
                   <div class="w-full h-[1px] bg-black/10"></div>
                   <div class="w-full h-[1px] bg-black/10"></div>
                   <div class="w-full h-[1px] bg-black/10"></div>
                 </div>
              </div>
            </div>
            <!-- Right Side -->
            <div class="flex-1 flex flex-col pl-5">
              <div class="flex justify-end relative">
                <!-- Stamp -->
                <div class="w-14 h-14 rounded-full border-[1.5px] border-black/30 flex items-center justify-center relative bg-black/5" style="border-style: dashed;">
                   <!-- Wavy lines -->
                   <div class="absolute -left-10 top-1/2 -translate-y-1/2 flex flex-col gap-1.5 opacity-40">
                     <svg width="32" height="4" viewBox="0 0 40 4" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M0 2C5 2 5 0 10 0C15 0 15 4 20 4C25 4 25 0 30 0C35 0 35 4 40 4" stroke="black" stroke-width="1"/></svg>
                     <svg width="32" height="4" viewBox="0 0 40 4" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M0 2C5 2 5 0 10 0C15 0 15 4 20 4C25 4 25 0 30 0C35 0 35 4 40 4" stroke="black" stroke-width="1"/></svg>
                     <svg width="32" height="4" viewBox="0 0 40 4" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M0 2C5 2 5 0 10 0C15 0 15 4 20 4C25 4 25 0 30 0C35 0 35 4 40 4" stroke="black" stroke-width="1"/></svg>
                     <svg width="32" height="4" viewBox="0 0 40 4" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M0 2C5 2 5 0 10 0C15 0 15 4 20 4C25 4 25 0 30 0C35 0 35 4 40 4" stroke="black" stroke-width="1"/></svg>
                   </div>
                </div>
              </div>
              <div class="flex-1 flex flex-col justify-end gap-3 pb-2">
                <div class="flex items-end gap-2">
                  <span class="text-xs text-black/60 font-body">to:</span>
                  <div class="flex-1 h-[1px] bg-black/20"></div>
                </div>
                <div class="w-full h-[1px] bg-black/20"></div>
                <div class="flex items-end gap-2">
                  <span class="text-xs text-black/60 font-body">from:</span>
                  <div class="flex-1 h-[1px] bg-black/20"></div>
                </div>
                <div class="w-full h-[1px] bg-black/20"></div>
              </div>
            </div>
          </div>
          <!-- Front (Image side) -->
          <div
            :class="[
              'absolute inset-0 rounded-none bg-white p-3 transition-all duration-500',
              flipped[1] ? '-translate-x-4 -translate-y-4 -rotate-1 shadow-2xl z-10 group-hover:rotate-0' : 'translate-x-4 translate-y-4 rotate-2 shadow-lg z-0 group-hover:rotate-1'
            ]"
          >
            <div class="w-full h-full relative border border-black/5 overflow-hidden">
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAe9As0mluQ9OO5ncU_chfnC43lWBWxRhRp9IDcPkujfJ_XseRVNkQIjMANTDVymWhy6BT5CvfPxBMs4fRzHYBUBBGSz_eiR02OairOv4I4f2goaLWF6OsEwLLKY39A0fKaaOaNt19FrXnar1juZ2fSLv3voTNPBxUceKbS6wGqmym04bmG1D44xVbrgNLf5frkclvOuBqRp7ttq3paxacGPKg4IyzdWEgYziCMqbs5Z1ZwPDEZd7ALjuRCW5Oku_el2IyANQK05txq"
                alt="Quiet Cafe"
                class="w-full h-full object-cover"
                referrerpolicy="no-referrer"
              />
            </div>
          </div>
        </div>

        <!-- Postcard 3 -->
        <div class="relative w-full aspect-[3/2] group cursor-pointer" @click="flipped[2] = !flipped[2]">
          <!-- Back (Text side) -->
          <div
            :class="[
              'absolute inset-0 rounded-none bg-white p-5 flex border border-black/10 transition-all duration-500 shadow-inner',
              flipped[2] ? 'translate-x-4 translate-y-4 rotate-2 shadow-lg z-0 group-hover:rotate-1' : '-translate-x-4 -translate-y-4 -rotate-1 shadow-2xl z-10 group-hover:rotate-0'
            ]"
          >
            <!-- Left Side -->
            <div class="flex-1 flex flex-col pr-5 border-r border-black/20">
              <h3 class="font-headline text-xl tracking-widest text-black/60 mb-2">POSTCARD</h3>
              <div class="relative flex-1">
                 <p class="absolute inset-0 font-handwritten text-xl text-primary leading-loose opacity-60 pt-2">
                   愿海浪带去我的思念...
                 </p>
                 <div class="flex flex-col justify-between h-full pt-6 pb-2">
                   <div class="w-full h-[1px] bg-black/10"></div>
                   <div class="w-full h-[1px] bg-black/10"></div>
                   <div class="w-full h-[1px] bg-black/10"></div>
                   <div class="w-full h-[1px] bg-black/10"></div>
                   <div class="w-full h-[1px] bg-black/10"></div>
                 </div>
              </div>
            </div>
            <!-- Right Side -->
            <div class="flex-1 flex flex-col pl-5">
              <div class="flex justify-end relative">
                <!-- Stamp -->
                <div class="w-14 h-14 rounded-full border-[1.5px] border-black/30 flex items-center justify-center relative bg-black/5" style="border-style: dashed;">
                   <!-- Wavy lines -->
                   <div class="absolute -left-10 top-1/2 -translate-y-1/2 flex flex-col gap-1.5 opacity-40">
                     <svg width="32" height="4" viewBox="0 0 40 4" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M0 2C5 2 5 0 10 0C15 0 15 4 20 4C25 4 25 0 30 0C35 0 35 4 40 4" stroke="black" stroke-width="1"/></svg>
                     <svg width="32" height="4" viewBox="0 0 40 4" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M0 2C5 2 5 0 10 0C15 0 15 4 20 4C25 4 25 0 30 0C35 0 35 4 40 4" stroke="black" stroke-width="1"/></svg>
                     <svg width="32" height="4" viewBox="0 0 40 4" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M0 2C5 2 5 0 10 0C15 0 15 4 20 4C25 4 25 0 30 0C35 0 35 4 40 4" stroke="black" stroke-width="1"/></svg>
                     <svg width="32" height="4" viewBox="0 0 40 4" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M0 2C5 2 5 0 10 0C15 0 15 4 20 4C25 4 25 0 30 0C35 0 35 4 40 4" stroke="black" stroke-width="1"/></svg>
                   </div>
                </div>
              </div>
              <div class="flex-1 flex flex-col justify-end gap-3 pb-2">
                <div class="flex items-end gap-2">
                  <span class="text-xs text-black/60 font-body">to:</span>
                  <div class="flex-1 h-[1px] bg-black/20"></div>
                </div>
                <div class="w-full h-[1px] bg-black/20"></div>
                <div class="flex items-end gap-2">
                  <span class="text-xs text-black/60 font-body">from:</span>
                  <div class="flex-1 h-[1px] bg-black/20"></div>
                </div>
                <div class="w-full h-[1px] bg-black/20"></div>
              </div>
            </div>
          </div>
          <!-- Front (Image side) -->
          <div
            :class="[
              'absolute inset-0 rounded-none bg-white p-3 transition-all duration-500',
              flipped[2] ? '-translate-x-4 -translate-y-4 -rotate-1 shadow-2xl z-10 group-hover:rotate-0' : 'translate-x-4 translate-y-4 rotate-2 shadow-lg z-0 group-hover:rotate-1'
            ]"
          >
            <div class="w-full h-full relative border border-black/5 overflow-hidden">
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDoU6jxytN-E1yvFakP8kf9aadwyrBXvuDRAnZIUBuxmdU2J0_bp7xJoUHW1SJ4ZkEc-5lIQOnEZ0lULtT8DFyJxXgiOAkNeHEoaoG80f65AnlMqfp-qtegndx_eAxny7FWviV4jKtCCDGBAPBoTNpROcHSKsxWOZANpBQUjAZjtGPKPRBW4NZRQ5QdrQtBgSnPBGo4qi5Ajb-YK_9JPfxiPa5vYw5S1oBU4ga48rk8f6XHSgZx9Ph12siER3sW40-5XrujhslnC4TT"
                alt="Coastal Bliss"
                class="w-full h-full object-cover"
                referrerpolicy="no-referrer"
              />
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import {
  Mail,
  Search,
  Users,
  ListFilter,
  Heart,
  Reply,
} from "lucide-vue-next";

const flipped = ref([false, false, false]);
</script>
