<template>
  <div class="min-h-screen bg-background pb-24 md:pb-0">
    <!-- 手机端 - 全屏覆盖 -->
    <div class="md:hidden">
      <!-- Header -->
      <header class="sticky top-0 z-40 flex items-center w-full px-4 h-14 bg-background/90 backdrop-blur-sm border-b border-primary/10">
        <button @click="$router.back()" class="text-primary hover:bg-primary/5 p-2 rounded-full transition-colors mr-2">
          <ChevronLeft class="w-5 h-5" />
        </button>
        <h1 class="font-headline text-lg font-bold text-primary">账号管理</h1>
      </header>

      <!-- Content -->
      <main class="max-w-md mx-auto px-4 py-6 space-y-6">
        <!-- 账号安全 -->
        <div class="space-y-3">
          <h3 class="font-headline text-base font-bold text-primary px-1">账号安全</h3>
          <div class="bg-neutral rounded-xl overflow-hidden shadow-sm border border-black/5 dark:border-white/5 divide-y divide-black/5 dark:divide-white/5">
            <button class="w-full flex items-center justify-between p-4 hover:bg-black/5 dark:hover:bg-white/5 transition-colors group">
              <div class="flex items-center gap-3">
                <Lock class="w-5 h-5 text-primary" />
                <div class="text-left">
                  <p class="text-sm font-bold text-primary">修改密码</p>
                  <p class="text-xs text-tertiary">定期修改密码保护账号安全</p>
                </div>
              </div>
              <ChevronRight class="w-5 h-5 text-tertiary group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

        <!-- 隐私设置 -->
        <div class="space-y-3">
          <h3 class="font-headline text-base font-bold text-primary px-1">隐私设置</h3>
          <div class="bg-neutral rounded-xl overflow-hidden shadow-sm border border-black/5 dark:border-white/5 divide-y divide-black/5 dark:divide-white/5">
            <div class="flex items-center justify-between p-4">
              <div class="flex items-center gap-3">
                <Eye class="w-5 h-5 text-primary" />
                <div class="text-left">
                  <p class="text-sm font-bold text-primary">个人资料可见性</p>
                  <p class="text-xs text-tertiary">所有人可见</p>
                </div>
              </div>
              <select class="bg-transparent text-xs font-bold text-secondary focus:outline-none">
                <option>所有人</option>
                <option>仅好友</option>
                <option>仅自己</option>
              </select>
            </div>
          </div>
        </div>

        <!-- 数据管理 -->
        <div class="space-y-3">
          <h3 class="font-headline text-base font-bold text-primary px-1">数据管理</h3>
          <div class="bg-neutral rounded-xl overflow-hidden shadow-sm border border-black/5 dark:border-white/5 divide-y divide-black/5 dark:divide-white/5">
            <button class="w-full flex items-center justify-between p-4 hover:bg-black/5 dark:hover:bg-white/5 transition-colors group">
              <div class="flex items-center gap-3">
                <Trash2 class="w-5 h-5 text-red-500" />
                <div class="text-left">
                  <p class="text-sm font-bold text-red-500">删除账号</p>
                  <p class="text-xs text-tertiary">永久删除账号和所有数据</p>
                </div>
              </div>
              <ChevronRight class="w-5 h-5 text-tertiary group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

        <!-- 绑定账号 -->
        <div class="space-y-3">
          <h3 class="font-headline text-base font-bold text-primary px-1">绑定账号</h3>
          <div class="bg-neutral rounded-xl overflow-hidden shadow-sm border border-black/5 dark:border-white/5 divide-y divide-black/5 dark:divide-white/5">
            <button class="w-full flex items-center justify-between p-4 hover:bg-black/5 dark:hover:bg-white/5 transition-colors group">
              <div class="flex items-center gap-3">
                <Mail class="w-5 h-5 text-primary" />
                <div class="text-left">
                  <p class="text-sm font-bold text-primary">邮箱</p>
                  <p class="text-xs text-tertiary">sumuwood@example.com</p>
                </div>
              </div>
              <ChevronRight class="w-5 h-5 text-tertiary group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

        <!-- 登出 -->
        <button class="w-full py-3 bg-neutral rounded-xl text-red-500 font-bold shadow-sm border border-black/5 dark:border-white/5 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors flex items-center justify-center gap-2">
          <LogOut class="w-5 h-5" />
          登出账号
        </button>
      </main>
    </div>

    <!-- 电脑端 - 窗口模式 -->
    <div class="hidden md:flex items-center justify-center min-h-screen p-4">
      <div class="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100]"></div>
      <div class="relative bg-white dark:bg-neutral rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto z-[101]">
        <!-- Header -->
        <div class="sticky top-0 z-10 flex items-center justify-between px-6 py-4 bg-white dark:bg-neutral border-b border-black/10 dark:border-white/10">
          <h1 class="font-headline text-xl font-bold text-primary">账号管理</h1>
          <button @click="$router.back()" class="w-8 h-8 rounded-full flex items-center justify-center text-black/30 dark:text-white/30 hover:bg-black/10 dark:hover:bg-white/10 transition-colors">
            <X class="w-5 h-5" />
          </button>
        </div>

        <!-- Content -->
        <div class="p-6 space-y-6">
          <!-- 账号安全 -->
          <div>
            <h3 class="font-headline text-base font-bold text-primary mb-3">账号安全</h3>
            <div class="space-y-2">
              <button class="w-full flex items-center justify-between p-3 bg-black/5 dark:bg-white/5 rounded-lg hover:bg-black/10 dark:hover:bg-white/10 transition-colors group">
                <div class="flex items-center gap-3">
                  <Lock class="w-5 h-5 text-primary" />
                  <div class="text-left">
                    <p class="text-sm font-bold text-primary">修改密码</p>
                    <p class="text-xs text-tertiary">定期修改密码保护账号安全</p>
                  </div>
                </div>
                <ChevronRight class="w-5 h-5 text-tertiary group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

          <!-- 隐私设置 -->
          <div>
            <h3 class="font-headline text-base font-bold text-primary mb-3">隐私设置</h3>
            <div class="space-y-2">
              <div class="flex items-center justify-between p-3 bg-black/5 dark:bg-white/5 rounded-lg">
                <div class="flex items-center gap-3">
                  <Eye class="w-5 h-5 text-primary" />
                  <div class="text-left">
                    <p class="text-sm font-bold text-primary">个人资料可见性</p>
                  </div>
                </div>
                <select class="bg-transparent text-xs font-bold text-secondary focus:outline-none">
                  <option>所有人</option>
                  <option>仅好友</option>
                  <option>仅自己</option>
                </select>
              </div>
            </div>
          </div>

          <!-- 数据管理 -->
          <div>
            <h3 class="font-headline text-base font-bold text-primary mb-3">数据管理</h3>
            <div class="space-y-2">
              <button class="w-full flex items-center justify-between p-3 bg-red-50 dark:bg-red-500/10 rounded-lg hover:bg-red-100 dark:hover:bg-red-500/20 transition-colors group">
                <div class="flex items-center gap-3">
                  <Trash2 class="w-5 h-5 text-red-500" />
                  <div class="text-left">
                    <p class="text-sm font-bold text-red-500">删除账号</p>
                    <p class="text-xs text-red-400">永久删除账号和所有数据</p>
                  </div>
                </div>
                <ChevronRight class="w-5 h-5 text-red-500 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

          <!-- 绑定账号 -->
          <div>
            <h3 class="font-headline text-base font-bold text-primary mb-3">绑定账号</h3>
            <div class="space-y-2">
              <div class="flex items-center justify-between p-3 bg-black/5 dark:bg-white/5 rounded-lg">
                <div class="flex items-center gap-3">
                  <Mail class="w-5 h-5 text-primary" />
                  <div class="text-left">
                    <p class="text-sm font-bold text-primary">邮箱</p>
                    <p class="text-xs text-tertiary">sumuwood@example.com</p>
                  </div>
                </div>
                <span class="text-xs font-bold text-secondary">已绑定</span>
              </div>
            </div>
          </div>
        </div>


      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  ChevronLeft,
  Lock,
  Smartphone,
  Shield,
  Eye,
  MessageSquare,
  Heart,
  Download,
  Trash2,
  Mail,
  Globe,
  LogOut,
  X,
} from "lucide-vue-next";
</script>

