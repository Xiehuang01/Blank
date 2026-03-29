<template>
  <div class="min-h-screen bg-background flex items-center justify-center px-4 py-8">
    <div class="w-full max-w-2xl relative h-[600px]">
      <!-- Header -->
      <div class="absolute -top-32 left-0 right-0 text-center">
        <h1 class="font-headline text-5xl font-bold text-primary mb-4">Blank</h1>
        <p class="text-tertiary text-sm leading-relaxed">
          明信片之所以动人，恰恰因为它留有余地<br/>
          有限的篇幅，不说尽所有<br/>
          一笔空白，留给收信人想象
        </p>
      </div>

      <!-- Stacked Postcards Container -->
      <div class="relative w-full h-full">
        <!-- Postcard 3 (Bottom) -->
        <div
          @click="bringToFront(3)"
          :class="[
            'absolute inset-0 rounded-none bg-white dark:bg-neutral border border-black/10 dark:border-white/10 transition-all duration-300 cursor-pointer',
            activeCard === 3 ? 'translate-x-0 translate-y-0 z-30 shadow-2xl' : 'translate-x-6 translate-y-6 z-10 shadow-lg hover:shadow-xl'
          ]"
        >
          <div class="w-full h-full p-3 flex">
            <div class="flex-1 relative border border-black/5 dark:border-white/5 overflow-hidden">
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDoU6jxytN-E1yvFakP8kf9aadwyrBXvuDRAnZIUBuxmdU2J0_bp7xJoUHW1SJ4ZkEc-5lIQOnEZ0lULtT8DFyJxXgiOAkNeHEoaoG80f65AnlMqfp-qtegndx_eAxny7FWviV4jKtCCDGBAPBoTNpROcHSKsxWOZANpBQUjAZjtGPKPRBW4NZRQ5QdrQtBgSnPBGo4qi5Ajb-YK_9JPfxiPa5vYw5S1oBU4ga48rk8f6XHSgZx9Ph12siER3sW40-5XrujhslnC4TT"
                alt="Postcard 3"
                class="w-full h-full object-cover"
                referrerpolicy="no-referrer"
              />
            </div>
          </div>
        </div>

        <!-- Postcard 2 (Middle) -->
        <div
          @click="bringToFront(2)"
          :class="[
            'absolute inset-0 rounded-none bg-white dark:bg-neutral border border-black/10 dark:border-white/10 transition-all duration-300 cursor-pointer',
            activeCard === 2 ? 'translate-x-0 translate-y-0 z-20 shadow-2xl' : 'translate-x-3 translate-y-3 z-10 shadow-lg hover:shadow-xl'
          ]"
        >
          <div class="w-full h-full p-3 flex">
            <div class="flex-1 relative border border-black/5 dark:border-white/5 overflow-hidden">
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAe9As0mluQ9OO5ncU_chfnC43lWBWxRhRp9IDcPkujfJ_XseRVNkQIjMANTDVymWhy6BT5CvfPxBMs4fRzHYBUBBGSz_eiR02OairOv4I4f2goaLWF6OsEwLLKY39A0fKaaOaNt19FrXnar1juZ2fSLv3voTNPBxUceKbS6wGqmym04bmG1D44xVbrgNLf5frkclvOuBqRp7ttq3paxacGPKg4IyzdWEgYziCMqbs5Z1ZwPDEZd7ALjuRCW5Oku_el2IyANQK05txq"
                alt="Postcard 2"
                class="w-full h-full object-cover"
                referrerpolicy="no-referrer"
              />
            </div>
          </div>
        </div>

        <!-- Postcard 1 (Top - Form) -->
        <div
          :class="[
            'absolute inset-0 rounded-none bg-white dark:bg-neutral border border-black/10 dark:border-white/10 transition-all duration-300 z-40 shadow-2xl',
            activeCard === 1 ? 'translate-x-0 translate-y-0' : 'translate-x-0 translate-y-0'
          ]"
        >
          <div class="w-full h-full p-6 flex">
            <!-- Left Side - Form -->
            <div class="flex-1 flex flex-col pr-6 border-r border-black/20 overflow-y-auto">
              <h3 class="font-headline text-xl tracking-widest text-black/60 mb-6">REGISTER</h3>
              
              <div class="space-y-4 flex-1">
                <!-- Username -->
                <div class="space-y-1.5">
                  <label class="text-xs font-semibold text-primary">用户名</label>
                  <input
                    v-model="username"
                    type="text"
                    placeholder="选择用户名"
                    class="w-full px-3 py-2 border border-black/10 dark:border-white/10 rounded text-sm bg-white dark:bg-neutral text-black dark:text-white placeholder:text-tertiary focus:border-secondary focus:outline-none transition-colors"
                  />
                </div>

                <!-- Email -->
                <div class="space-y-1.5">
                  <label class="text-xs font-semibold text-primary">邮箱</label>
                  <input
                    v-model="email"
                    type="email"
                    placeholder="输入邮箱"
                    class="w-full px-3 py-2 border border-black/10 dark:border-white/10 rounded text-sm bg-white dark:bg-neutral text-black dark:text-white placeholder:text-tertiary focus:border-secondary focus:outline-none transition-colors"
                  />
                </div>

                <!-- Password -->
                <div class="space-y-1.5">
                  <label class="text-xs font-semibold text-primary">密码</label>
                  <div class="relative">
                    <input
                      v-model="password"
                      :type="showPassword ? 'text' : 'password'"
                      placeholder="设置密码"
                      class="w-full px-3 py-2 border border-black/10 dark:border-white/10 rounded text-sm bg-white dark:bg-neutral text-black dark:text-white placeholder:text-tertiary focus:border-secondary focus:outline-none transition-colors"
                    />
                    <button
                      @click="showPassword = !showPassword"
                      class="absolute right-3 top-1/2 -translate-y-1/2 text-tertiary hover:text-primary transition-colors"
                    >
                      <Eye v-if="!showPassword" class="w-4 h-4" />
                      <EyeOff v-else class="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <!-- Confirm Password -->
                <div class="space-y-1.5">
                  <label class="text-xs font-semibold text-primary">确认密码</label>
                  <div class="relative">
                    <input
                      v-model="confirmPassword"
                      :type="showConfirmPassword ? 'text' : 'password'"
                      placeholder="再次输入"
                      class="w-full px-3 py-2 border border-black/10 dark:border-white/10 rounded text-sm bg-white dark:bg-neutral text-black dark:text-white placeholder:text-tertiary focus:border-secondary focus:outline-none transition-colors"
                    />
                    <button
                      @click="showConfirmPassword = !showConfirmPassword"
                      class="absolute right-3 top-1/2 -translate-y-1/2 text-tertiary hover:text-primary transition-colors"
                    >
                      <Eye v-if="!showConfirmPassword" class="w-4 h-4" />
                      <EyeOff v-else class="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <!-- Terms -->
                <label class="flex items-start gap-2 cursor-pointer pt-2">
                  <input
                    v-model="agreeTerms"
                    type="checkbox"
                    class="w-4 h-4 rounded border border-secondary accent-secondary cursor-pointer mt-0.5 flex-shrink-0"
                  />
                  <span class="text-xs text-tertiary leading-tight">
                    我已阅读并同意
                    <a href="#" class="text-secondary hover:text-secondary/80 transition-colors font-semibold">用户协议</a>
                    和
                    <a href="#" class="text-secondary hover:text-secondary/80 transition-colors font-semibold">隐私政策</a>
                  </span>
                </label>
              </div>
            </div>

            <!-- Right Side - Stamp & Button -->
            <div class="flex-1 flex flex-col pl-6">
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

              <!-- Progress Indicator -->
              <div class="flex-1 flex flex-col justify-center gap-4 pb-4">
                <div class="text-center">
                  <p class="text-xs text-tertiary mb-3">第 1 / 3 张</p>
                  <div class="flex gap-1.5 justify-center">
                    <div class="h-1.5 rounded-full bg-secondary w-5"></div>
                    <div class="h-1.5 rounded-full bg-black/10 w-3"></div>
                    <div class="h-1.5 rounded-full bg-black/10 w-3"></div>
                  </div>
                </div>
              </div>

              <!-- Register Button -->
              <button
                @click="handleRegister"
                :disabled="isLoading || !agreeTerms"
                class="w-full py-3 px-4 bg-secondary text-white dark:text-black font-bold rounded hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <span v-if="!isLoading">下一张</span>
                <span v-else class="flex items-center gap-2">
                  <svg class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  处理中...
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Hint Text -->
      <div class="absolute -bottom-16 left-0 right-0 text-center text-xs text-tertiary">
        点击下面的明信片翻转
      </div>

      <!-- Login Link -->
      <div class="absolute -bottom-32 left-0 right-0 text-center">
        <p class="text-sm text-tertiary">
          已有账户？
          <router-link to="/login" class="text-secondary hover:text-secondary/80 font-semibold transition-colors">
            立即登录
          </router-link>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { Eye, EyeOff } from "lucide-vue-next";

const router = useRouter();

const activeCard = ref(1);

const username = ref("");
const email = ref("");
const password = ref("");
const confirmPassword = ref("");
const showPassword = ref(false);
const showConfirmPassword = ref(false);
const agreeTerms = ref(false);
const isLoading = ref(false);

const bringToFront = (cardNum: number) => {
  activeCard.value = cardNum;
};

const handleRegister = async () => {
  if (!username.value || !email.value || !password.value || !confirmPassword.value) {
    alert("请填写所有字段");
    return;
  }

  if (password.value !== confirmPassword.value) {
    alert("两次输入的密码不一致");
    return;
  }

  if (password.value.length < 6) {
    alert("密码长度至少为 6 位");
    return;
  }

  isLoading.value = true;

  try {
    await new Promise(resolve => setTimeout(resolve, 1500));

    localStorage.setItem("user", JSON.stringify({
      username: username.value,
      email: email.value,
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
