<template>
  <div class="min-h-screen bg-background flex flex-col items-center justify-center px-4 py-4 md:py-8">
    <!-- Header -->
    <div class="text-center mb-8 md:mb-12">
      <h1 class="font-headline text-3xl md:text-5xl font-bold text-primary mb-2 md:mb-4">Blank</h1>
      <p class="text-tertiary text-xs md:text-sm leading-relaxed">
        明信片之所以动人，恰恰因为它留有余地<br/>
        有限的篇幅，不说尽所有<br/>
        一笔空白，留给收信人想象
      </p>
    </div>

    <div class="w-full max-w-sm md:max-w-4xl relative flex items-center justify-center" style="height: calc(100vh - 260px)">
      <!-- Stacked Postcards Container -->
      <div class="relative w-full md:aspect-[3/2] aspect-[3/4] group">
        <!-- Postcard 1 (Login - Back) -->
        <div
          :class="[
            'absolute inset-0 rounded-none bg-white dark:bg-neutral p-3 md:p-6 flex flex-col md:flex-row border border-black/10 dark:border-white/10 transition-all duration-500 shadow-inner',
            flipped ? 'postcard-login-flipped shadow-lg z-0 group-hover:rotate-1' : 'postcard-login-normal shadow-2xl z-10 group-hover:rotate-0'
          ]"
        >
          <div class="w-full md:flex-1 flex flex-col pr-3 md:pr-6 md:border-r border-black/20">
            <h3 class="font-headline text-lg md:text-xl tracking-widest text-black/60 mb-3 md:mb-6">LOGIN</h3>
            
            <div class="space-y-2 md:space-y-4 flex-1">
              <!-- Email -->
              <div class="space-y-1">
                <label class="text-xs font-semibold text-primary">邮箱</label>
                <input
                  v-model="loginForm.email"
                  type="email"
                  placeholder="输入邮箱"
                  class="w-full px-2 md:px-3 py-2 md:py-2 border border-black/10 dark:border-white/10 rounded text-sm md:text-sm bg-white dark:bg-neutral text-black dark:text-white placeholder:text-tertiary focus:border-secondary focus:outline-none transition-colors"
                />
              </div>

              <!-- Password -->
              <div class="space-y-1">
                <label class="text-xs font-semibold text-primary">密码</label>
                <div class="relative">
                  <input
                    v-model="loginForm.password"
                    :type="showLoginPassword ? 'text' : 'password'"
                    placeholder="输入密码"
                    class="w-full px-2 md:px-3 py-2 md:py-2 border border-black/10 dark:border-white/10 rounded text-sm md:text-sm bg-white dark:bg-neutral text-black dark:text-white placeholder:text-tertiary focus:border-secondary focus:outline-none transition-colors"
                  />
                  <button
                    @click.stop="showLoginPassword = !showLoginPassword"
                    class="absolute right-2 md:right-3 top-1/2 -translate-y-1/2 text-tertiary hover:text-primary transition-colors"
                  >
                    <Eye v-if="!showLoginPassword" class="w-3 md:w-4 h-3 md:h-4" />
                    <EyeOff v-else class="w-3 md:w-4 h-3 md:h-4" />
                  </button>
                </div>
              </div>

              <!-- Remember Me & Forgot Password -->
              <div class="flex items-center justify-between text-xs pt-1 md:pt-2">
                <label class="flex items-center gap-1 md:gap-2 cursor-pointer">
                  <input
                    v-model="loginForm.rememberMe"
                    type="checkbox"
                    class="w-3 md:w-4 h-3 md:h-4 rounded-full border border-secondary accent-secondary cursor-pointer"
                  />
                  <span class="text-tertiary">记住我</span>
                </label>
                <a href="#" class="text-secondary hover:text-secondary/80 transition-colors font-semibold">
                  忘记密码？
                </a>
              </div>
            </div>

            <!-- Login Button -->
            <div class="mt-auto pt-4 md:pt-0 md:mt-8 flex flex-col md:flex-row gap-3 md:gap-0 md:items-end">
              <button
                @click.stop="handleLogin"
                :disabled="isLoading"
                class="w-full md:flex-1 py-2 md:py-3 px-3 md:px-4 bg-secondary text-white dark:text-black font-bold text-sm md:text-base rounded hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-40"
              >
                <span v-if="!isLoading">登录</span>
                <span v-else class="flex items-center gap-2">
                  <svg class="w-3 md:w-4 h-3 md:h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  处理中...
                </span>
              </button>
              <!-- Mobile Clickable Text -->
              <button
                @click="flipped = !flipped"
                class="md:hidden hover:opacity-70 transition-opacity text-right flex-1"
              >
                <p class="text-xs font-headline font-bold text-secondary hover:text-secondary/80 cursor-pointer">前往注册</p>
              </button>
            </div>
          </div>

          <!-- Right Side - Stamp & Info -->
          <div class="hidden md:flex flex-1 flex-col pl-8">
            <div class="flex justify-end relative mb-6">
              <!-- Stamp -->
              <div class="w-14 h-14 rounded-full border-[1.5px] border-black/30 flex items-center justify-center relative bg-black/5" style="border-style: dashed;">
                <div class="absolute -left-10 top-1/2 -translate-y-1/2 flex flex-col gap-1.5 opacity-40">
                  <svg width="32" height="4" viewBox="0 0 40 4" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M0 2C5 2 5 0 10 0C15 0 15 4 20 4C25 4 25 0 30 0C35 0 35 4 40 4" stroke="black" stroke-width="1"/></svg>
                  <svg width="32" height="4" viewBox="0 0 40 4" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M0 2C5 2 5 0 10 0C15 0 15 4 20 4C25 4 25 0 30 0C35 0 35 4 40 4" stroke="black" stroke-width="1"/></svg>
                  <svg width="32" height="4" viewBox="0 0 40 4" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M0 2C5 2 5 0 10 0C15 0 15 4 20 4C25 4 25 0 30 0C35 0 35 4 40 4" stroke="black" stroke-width="1"/></svg>
                  <svg width="32" height="4" viewBox="0 0 40 4" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M0 2C5 2 5 0 10 0C15 0 15 4 20 4C25 4 25 0 30 0C35 0 35 4 40 4" stroke="black" stroke-width="1"/></svg>
                </div>
              </div>
            </div>

            <!-- Right Side Text Content -->
            <div class="flex-1 flex flex-col justify-between">
              <div class="text-sm text-tertiary leading-relaxed space-y-4">
                <p class="font-handwritten text-lg text-primary opacity-80">回到这里，未完成的话语可以继续书写。</p>
                <p class="font-handwritten text-lg text-primary opacity-80">你寄出的心情，正等待被再次看见。</p>
                <p class="font-handwritten text-lg text-primary opacity-80">别来无恙，你的空白处还留着余温。</p>
                <p class="font-handwritten text-lg text-primary opacity-80">那些未诉尽的言语，还在原地等你。</p>
              </div>

              <!-- Bottom Right - Clickable Text -->
              <button
                @click="flipped = !flipped"
                class="text-right hover:opacity-70 transition-opacity"
              >
                <p class="text-sm font-headline font-bold text-secondary hover:text-secondary/80 cursor-pointer">前往注册</p>
              </button>
            </div>
          </div>
        </div>

        <!-- Postcard 2 (Register - Front) -->
        <div
          :class="[
            'absolute inset-0 rounded-none bg-white dark:bg-neutral p-3 md:p-6 flex flex-col md:flex-row border border-black/10 dark:border-white/10 transition-all duration-500 shadow-inner',
            flipped ? 'postcard-register-flipped shadow-2xl z-10 group-hover:rotate-0' : 'postcard-register-normal shadow-lg z-0 group-hover:rotate-1'
          ]"
        >
          <div class="w-full md:flex-1 flex flex-col pr-3 md:pr-6 md:border-r border-black/20">
            <h3 class="font-headline text-lg md:text-xl tracking-widest text-black/60 mb-3 md:mb-6">REGISTER</h3>
            
            <div class="space-y-2 md:space-y-4 flex-1">
              <!-- Username -->
              <div class="space-y-1">
                <label class="text-xs font-semibold text-primary">用户名</label>
                <input
                  v-model="registerForm.username"
                  type="text"
                  placeholder="选择用户名"
                  class="w-full px-2 md:px-3 py-2 md:py-2 border border-black/10 dark:border-white/10 rounded text-sm md:text-sm bg-white dark:bg-neutral text-black dark:text-white placeholder:text-tertiary focus:border-secondary focus:outline-none transition-colors"
                />
              </div>

              <!-- Email -->
              <div class="space-y-1">
                <label class="text-xs font-semibold text-primary">邮箱</label>
                <input
                  v-model="registerForm.email"
                  type="email"
                  placeholder="输入邮箱"
                  class="w-full px-2 md:px-3 py-2 md:py-2 border border-black/10 dark:border-white/10 rounded text-sm md:text-sm bg-white dark:bg-neutral text-black dark:text-white placeholder:text-tertiary focus:border-secondary focus:outline-none transition-colors"
                />
              </div>

              <!-- Password -->
              <div class="space-y-1">
                <label class="text-xs font-semibold text-primary">密码</label>
                <div class="relative">
                  <input
                    v-model="registerForm.password"
                    :type="showRegisterPassword ? 'text' : 'password'"
                    placeholder="设置密码"
                    class="w-full px-2 md:px-3 py-2 md:py-2 border border-black/10 dark:border-white/10 rounded text-sm md:text-sm bg-white dark:bg-neutral text-black dark:text-white placeholder:text-tertiary focus:border-secondary focus:outline-none transition-colors"
                  />
                  <button
                    @click.stop="showRegisterPassword = !showRegisterPassword"
                    class="absolute right-2 md:right-3 top-1/2 -translate-y-1/2 text-tertiary hover:text-primary transition-colors"
                  >
                    <Eye v-if="!showRegisterPassword" class="w-3 md:w-4 h-3 md:h-4" />
                    <EyeOff v-else class="w-3 md:w-4 h-3 md:h-4" />
                  </button>
                </div>
              </div>

              <!-- Confirm Password -->
              <div class="space-y-1">
                <label class="text-xs font-semibold text-primary">确认密码</label>
                <div class="relative">
                  <input
                    v-model="registerForm.confirmPassword"
                    :type="showRegisterConfirm ? 'text' : 'password'"
                    placeholder="再次输入"
                    class="w-full px-2 md:px-3 py-2 md:py-2 border border-black/10 dark:border-white/10 rounded text-sm md:text-sm bg-white dark:bg-neutral text-black dark:text-white placeholder:text-tertiary focus:border-secondary focus:outline-none transition-colors"
                  />
                  <button
                    @click.stop="showRegisterConfirm = !showRegisterConfirm"
                    class="absolute right-2 md:right-3 top-1/2 -translate-y-1/2 text-tertiary hover:text-primary transition-colors"
                  >
                    <Eye v-if="!showRegisterConfirm" class="w-3 md:w-4 h-3 md:h-4" />
                    <EyeOff v-else class="w-3 md:w-4 h-3 md:h-4" />
                  </button>
                </div>
              </div>

              <!-- Terms -->
              <label class="flex items-center gap-1 md:gap-2 cursor-pointer pt-1 md:pt-2">
                <input
                  v-model="registerForm.agreeTerms"
                  type="checkbox"
                  class="w-3 md:w-4 h-3 md:h-4 rounded-full border border-secondary accent-secondary cursor-pointer flex-shrink-0"
                />
                <span class="text-xs leading-tight">
                  我已阅读并同意
                  <a href="#" class="text-secondary hover:text-secondary/80 transition-colors font-semibold">用户协议</a>
                  和
                  <a href="#" class="text-secondary hover:text-secondary/80 transition-colors font-semibold">隐私政策</a>
                </span>
              </label>
            </div>

            <!-- Register Button -->
            <div class="mt-auto pt-4 md:pt-0 md:mt-8 flex flex-col md:flex-row gap-3 md:gap-0 md:items-end">
              <button
                @click.stop="handleRegister"
                :disabled="isLoading || !registerForm.agreeTerms"
                class="w-full md:flex-1 py-2 md:py-3 px-3 md:px-4 bg-secondary text-white dark:text-black font-bold text-sm md:text-base rounded hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-7"
              >
                <span v-if="!isLoading">注册</span>
                <span v-else class="flex items-center gap-2">
                  <svg class="w-3 md:w-4 h-3 md:h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  处理中...
                </span>
              </button>
              <!-- Mobile Clickable Text -->
              <button
                @click="flipped = !flipped"
                class="md:hidden hover:opacity-70 transition-opacity text-right flex-1"
              >
                <p class="text-xs font-headline font-bold text-secondary hover:text-secondary/80 cursor-pointer">前往登录</p>
              </button>
            </div>
          </div>

          <!-- Right Side - Stamp & Info -->
          <div class="hidden md:flex flex-1 flex-col pl-8">
            <div class="flex justify-end relative mb-6">
              <!-- Stamp -->
              <div class="w-14 h-14 rounded-full border-[1.5px] border-black/30 flex items-center justify-center relative bg-black/5" style="border-style: dashed;">
                <div class="absolute -left-10 top-1/2 -translate-y-1/2 flex flex-col gap-1.5 opacity-40">
                  <svg width="32" height="4" viewBox="0 0 40 4" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M0 2C5 2 5 0 10 0C15 0 15 4 20 4C25 4 25 0 30 0C35 0 35 4 40 4" stroke="black" stroke-width="1"/></svg>
                  <svg width="32" height="4" viewBox="0 0 40 4" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M0 2C5 2 5 0 10 0C15 0 15 4 20 4C25 4 25 0 30 0C35 0 35 4 40 4" stroke="black" stroke-width="1"/></svg>
                  <svg width="32" height="4" viewBox="0 0 40 4" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M0 2C5 2 5 0 10 0C15 0 15 4 20 4C25 4 25 0 30 0C35 0 35 4 40 4" stroke="black" stroke-width="1"/></svg>
                  <svg width="32" height="4" viewBox="0 0 40 4" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M0 2C5 2 5 0 10 0C15 0 15 4 20 4C25 4 25 0 30 0C35 0 35 4 40 4" stroke="black" stroke-width="1"/></svg>
                </div>
              </div>
            </div>

            <!-- Right Side Text Content -->
            <div class="flex-1 flex flex-col justify-between">
              <div class="text-sm text-tertiary leading-relaxed space-y-4">
                <p class="font-handwritten text-lg text-primary opacity-80">从这里开始，为想说的话寻一个安放之地。</p>
                <p class="font-handwritten text-lg text-primary opacity-80">新的一页，从空白处写下第一行字。</p>
                <p class="font-handwritten text-lg text-primary opacity-80">你来了，明信片就有了第一抹颜色。</p>
                <p class="font-handwritten text-lg text-primary opacity-80">给自己一个机会，把心里的话轻轻放下。</p>
              </div>

              <!-- Bottom Right - Clickable Text -->
              <button
                @click="flipped = !flipped"
                class="text-right hover:opacity-70 transition-opacity"
              >
                <p class="text-sm font-headline font-bold text-secondary hover:text-secondary/80 cursor-pointer">前往登录</p>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { Eye, EyeOff } from "lucide-vue-next";

const router = useRouter();

const flipped = ref(false);
const isLoading = ref(false);

// Login Form
const loginForm = ref({
  email: "",
  password: "",
  rememberMe: false,
});
const showLoginPassword = ref(false);

// Register Form
const registerForm = ref({
  username: "",
  email: "",
  password: "",
  confirmPassword: "",
  agreeTerms: false,
});
const showRegisterPassword = ref(false);
const showRegisterConfirm = ref(false);

const handleLogin = async () => {
  if (!loginForm.value.email || !loginForm.value.password) {
    alert("请输入邮箱和密码");
    return;
  }

  isLoading.value = true;

  try {
    await new Promise(resolve => setTimeout(resolve, 1500));

    localStorage.setItem("user", JSON.stringify({
      email: loginForm.value.email,
      rememberMe: loginForm.value.rememberMe,
    }));

    alert("登录成功！");
    router.push("/");
  } catch (error) {
    alert("登录失败，请重试");
  } finally {
    isLoading.value = false;
  }
};

const handleRegister = async () => {
  if (!registerForm.value.username || !registerForm.value.email || !registerForm.value.password || !registerForm.value.confirmPassword) {
    alert("请填写所有字段");
    return;
  }

  if (registerForm.value.password !== registerForm.value.confirmPassword) {
    alert("两次输入的密码不一致");
    return;
  }

  if (registerForm.value.password.length < 6) {
    alert("密码长度至少为 6 位");
    return;
  }

  isLoading.value = true;

  try {
    await new Promise(resolve => setTimeout(resolve, 1500));

    localStorage.setItem("user", JSON.stringify({
      username: registerForm.value.username,
      email: registerForm.value.email,
    }));

    alert("注册成功！");
    router.push("/");
  } catch (error) {
    alert("注册失败，请重试");
  } finally {
    isLoading.value = false;
  }
};
</script>
