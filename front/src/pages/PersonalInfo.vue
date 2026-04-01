<template>
  <div class="min-h-screen bg-background pb-24 md:pb-0">
    <!-- 手机端 - 全屏覆盖 -->
    <div class="md:hidden">
      <!-- Header -->
      <header class="sticky top-0 z-40 flex items-center w-full px-4 h-14 bg-background/90 backdrop-blur-sm border-b border-primary/10">
        <button @click="$router.back()" class="text-primary hover:bg-primary/5 p-2 rounded-full transition-colors mr-2">
          <ChevronLeft class="w-5 h-5" />
        </button>
        <h1 class="font-headline text-lg font-bold text-primary">个人资料</h1>
      </header>

      <!-- Content -->
      <main class="max-w-md mx-auto px-4 py-6 space-y-6">
        <!-- 头像和基本信息 -->
        <div class="bg-neutral rounded-2xl p-6 shadow-sm border border-black/5 dark:border-white/5">
          <div class="flex items-center gap-4 mb-6">
            <div class="relative group">
              <div class="w-20 h-20 rounded-full overflow-hidden border-2 border-black/10 shadow-sm">
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBYArdRu7qlNp4cuo06XFR6gjYC0xtUePbpepRVZFPb60NLBx_VR9amuEGGGmcgoSJxZnTSvk-qC-pT40C1BcNky-vgDMQS81oXbUZ1ZhPGx8TyP5kDLnK2UxXs44i4R9b0C6J2F0AegR2bJ6baLYqRUydE5fXGJMLngQf9plW3-BdtpO6Gnq5BWbM5Y8_ZXBxCkBcu_AycBYRNspo0GmyLKNOwz7WDP8qJiBl97glqeE0pFejorxYMHYxFqX9mdXogSMmgx3TMR9IR"
                  alt="Avatar"
                  class="w-full h-full object-cover"
                  referrerpolicy="no-referrer"
                />
              </div>
              <button class="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-secondary text-white flex items-center justify-center shadow-md hover:scale-110 transition-transform">
                <Camera class="w-3 h-3" />
              </button>
            </div>
            <div class="flex-1">
              <h2 class="font-headline text-xl font-bold text-primary mb-1">苏木</h2>
              <p class="text-sm text-tertiary">UID: 1024520</p>
            </div>
          </div>

          <!-- 编辑按钮 -->
          <button @click="focusNickname" class="w-full py-2.5 bg-primary dark:bg-secondary text-white dark:text-black font-bold rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2">
            <PenLine class="w-4 h-4" />
            编辑资料
          </button>
        </div>

        <!-- 个人信息表单 -->
        <div class="bg-neutral rounded-2xl p-6 shadow-sm border border-black/5 dark:border-white/5 space-y-4">
          <div>
            <label class="text-sm font-bold text-primary mb-2 block">昵称</label>
            <input
              ref="nicknameInput"
              type="text"
              value="苏木"
              class="w-full px-3 py-2.5 bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-lg text-primary placeholder-tertiary focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-secondary"
            />
          </div>

          <div>
            <label class="text-sm font-bold text-primary mb-2 block">邮箱</label>
            <input
              type="email"
              value="sumuwood@example.com"
              class="w-full px-3 py-2.5 bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-lg text-primary placeholder-tertiary focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-secondary"
            />
          </div>

          <div>
            <label class="text-sm font-bold text-primary mb-2 block">性别</label>
            <select class="w-full px-3 py-2.5 bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-lg text-primary focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-secondary">
              <option>男</option>
              <option>女</option>
            </select>
          </div>

          <div>
            <label class="text-sm font-bold text-primary mb-2 block">生日</label>
            <input
              type="date"
              class="w-full px-3 py-2.5 bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-lg text-primary focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-secondary"
            />
          </div>

          <div>
            <label class="text-sm font-bold text-primary mb-2 block">所在地</label>
            <select class="w-full px-3 py-2.5 bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-lg text-primary focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-secondary">
              <option value="">请选择地区</option>
              <optgroup label="直辖市">
                <option>北京</option>
                <option>天津</option>
                <option>上海</option>
                <option>重庆</option>
              </optgroup>
              <optgroup label="省份">
                <option>河北省</option>
                <option>山西省</option>
                <option>辽宁省</option>
                <option>吉林省</option>
                <option>黑龙江省</option>
                <option>江苏省</option>
                <option>浙江省</option>
                <option>安徽省</option>
                <option>福建省</option>
                <option>江西省</option>
                <option>山东省</option>
                <option>河南省</option>
                <option>湖北省</option>
                <option>湖南省</option>
                <option>广东省</option>
                <option>海南省</option>
                <option>四川省</option>
                <option>贵州省</option>
                <option>云南省</option>
                <option>陕西省</option>
                <option>甘肃省</option>
                <option>青海省</option>
                <option>台湾省</option>
              </optgroup>
              <optgroup label="自治区">
                <option>内蒙古自治区</option>
                <option>广西壮族自治区</option>
                <option>西藏自治区</option>
                <option>宁夏回族自治区</option>
                <option>新疆维吾尔自治区</option>
              </optgroup>
              <optgroup label="特别行政区">
                <option>香港特别行政区</option>
                <option>澳门特别行政区</option>
              </optgroup>
            </select>
          </div>
        </div>

        <!-- 统计信息 -->
        <div class="grid grid-cols-3 gap-3">
          <div class="bg-neutral rounded-xl p-4 text-center shadow-sm border border-black/5 dark:border-white/5">
            <p class="text-2xl font-bold text-secondary mb-1">42</p>
            <p class="text-xs text-tertiary">发送的明信片</p>
          </div>
          <div class="bg-neutral rounded-xl p-4 text-center shadow-sm border border-black/5 dark:border-white/5">
            <p class="text-2xl font-bold text-secondary mb-1">128</p>
            <p class="text-xs text-tertiary">收到的明信片</p>
          </div>
          <div class="bg-neutral rounded-xl p-4 text-center shadow-sm border border-black/5 dark:border-white/5">
            <p class="text-2xl font-bold text-secondary mb-1">856</p>
            <p class="text-xs text-tertiary">获得的点赞</p>
          </div>
        </div>

        <!-- 保存按钮 -->
        <button class="w-full py-3 bg-primary dark:bg-secondary text-white dark:text-black font-bold rounded-xl hover:opacity-90 transition-opacity">
          保存修改
        </button>
      </main>
    </div>

    <!-- 电脑端 - 窗口模式 -->
    <div class="hidden md:flex items-center justify-center min-h-screen p-4">
      <div class="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100]"></div>
      <div class="relative bg-white dark:bg-neutral rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto z-[101]">
        <!-- Header -->
        <div class="sticky top-0 z-10 flex items-center justify-between px-6 py-4 bg-white dark:bg-neutral border-b border-black/10 dark:border-white/10">
          <h1 class="font-headline text-xl font-bold text-primary">个人资料</h1>
          <button @click="$router.back()" class="w-8 h-8 rounded-full flex items-center justify-center text-black/30 dark:text-white/30 hover:bg-black/10 dark:hover:bg-white/10 transition-colors">
            <X class="w-5 h-5" />
          </button>
        </div>

        <!-- Content -->
        <div class="p-6 space-y-6">
          <!-- 头像和基本信息 -->
          <div class="flex items-center gap-6">
            <div class="relative group">
              <div class="w-24 h-24 rounded-full overflow-hidden border-2 border-black/10 shadow-sm">
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBYArdRu7qlNp4cuo06XFR6gjYC0xtUePbpepRVZFPb60NLBx_VR9amuEGGGmcgoSJxZnTSvk-qC-pT40C1BcNky-vgDMQS81oXbUZ1ZhPGx8TyP5kDLnK2UxXs44i4R9b0C6J2F0AegR2bJ6baLYqRUydE5fXGJMLngQf9plW3-BdtpO6Gnq5BWbM5Y8_ZXBxCkBcu_AycBYRNspo0GmyLKNOwz7WDP8qJiBl97glqeE0pFejorxYMHYxFqX9mdXogSMmgx3TMR9IR"
                  alt="Avatar"
                  class="w-full h-full object-cover"
                  referrerpolicy="no-referrer"
                />
              </div>
              <button class="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-secondary text-white flex items-center justify-center shadow-md hover:scale-110 transition-transform">
                <Camera class="w-4 h-4" />
              </button>
            </div>
            <div>
              <h2 class="font-headline text-2xl font-bold text-primary mb-2">苏木</h2>
              <p class="text-sm text-tertiary mb-4">UID: 1024520</p>
              <button @click="focusNickname" class="px-4 py-2 bg-primary dark:bg-secondary text-white dark:text-black font-bold rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2">
                <PenLine class="w-4 h-4" />
                编辑资料
              </button>
            </div>
          </div>

          <!-- 个人信息表单 -->
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="text-sm font-bold text-primary mb-2 block">昵称</label>
              <input
                ref="nicknameInput"
                type="text"
                value="苏木"
                class="w-full px-3 py-2 bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-lg text-primary placeholder-tertiary focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-secondary"
              />
            </div>

            <div>
              <label class="text-sm font-bold text-primary mb-2 block">邮箱</label>
              <input
                type="email"
                value="sumuwood@example.com"
                class="w-full px-3 py-2 bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-lg text-primary placeholder-tertiary focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-secondary"
              />
            </div>

            <div>
              <label class="text-sm font-bold text-primary mb-2 block">性别</label>
              <select class="w-full px-3 py-2 bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-lg text-primary focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-secondary">
                <option>保密</option>
                <option>男</option>
                <option>女</option>
              </select>
            </div>

            <div>
              <label class="text-sm font-bold text-primary mb-2 block">生日</label>
              <input
                type="date"
                class="w-full px-3 py-2 bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-lg text-primary focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-secondary"
              />
            </div>

            <div class="col-span-2">
              <label class="text-sm font-bold text-primary mb-2 block">所在地</label>
              <select class="w-full px-3 py-2 bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-lg text-primary focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-secondary">
                <option value="">请选择地区</option>
                <optgroup label="直辖市">
                  <option>北京</option>
                  <option>天津</option>
                  <option>上海</option>
                  <option>重庆</option>
                </optgroup>
                <optgroup label="省份">
                  <option>河北省</option>
                  <option>山西省</option>
                  <option>辽宁省</option>
                  <option>吉林省</option>
                  <option>黑龙江省</option>
                  <option>江苏省</option>
                  <option>浙江省</option>
                  <option>安徽省</option>
                  <option>福建省</option>
                  <option>江西省</option>
                  <option>山东省</option>
                  <option>河南省</option>
                  <option>湖北省</option>
                  <option>湖南省</option>
                  <option>广东省</option>
                  <option>海南省</option>
                  <option>四川省</option>
                  <option>贵州省</option>
                  <option>云南省</option>
                  <option>陕西省</option>
                  <option>甘肃省</option>
                  <option>青海省</option>
                  <option>台湾省</option>
                </optgroup>
                <optgroup label="自治区">
                  <option>内蒙古自治区</option>
                  <option>广西壮族自治区</option>
                  <option>西藏自治区</option>
                  <option>宁夏回族自治区</option>
                  <option>新疆维吾尔自治区</option>
                </optgroup>
                <optgroup label="特别行政区">
                  <option>香港特别行政区</option>
                  <option>澳门特别行政区</option>
                </optgroup>
              </select>
            </div>
          </div>

          <!-- 统计信息 -->
          <div class="grid grid-cols-3 gap-4 p-4 bg-black/5 dark:bg-white/5 rounded-xl">
            <div class="text-center">
              <p class="text-2xl font-bold text-secondary mb-1">42</p>
              <p class="text-xs text-tertiary">发送的明信片</p>
            </div>
            <div class="text-center">
              <p class="text-2xl font-bold text-secondary mb-1">128</p>
              <p class="text-xs text-tertiary">收到的明信片</p>
            </div>
            <div class="text-center">
              <p class="text-2xl font-bold text-secondary mb-1">856</p>
              <p class="text-xs text-tertiary">获得的点赞</p>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="sticky bottom-0 flex gap-3 px-6 py-4 bg-white dark:bg-neutral border-t border-black/10 dark:border-white/10">
          <button @click="$router.back()" class="flex-1 py-2.5 rounded-lg border-2 border-black/10 dark:border-white/10 text-primary font-bold hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
            取消
          </button>
          <button class="flex-1 py-2.5 rounded-lg bg-primary dark:bg-secondary text-white dark:text-black font-bold hover:opacity-90 transition-opacity">
            保存修改
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { ChevronLeft, Camera, PenLine, X } from "lucide-vue-next";

const nicknameInput = ref<HTMLInputElement | null>(null);

const focusNickname = () => {
  nicknameInput.value?.focus();
};
</script>

