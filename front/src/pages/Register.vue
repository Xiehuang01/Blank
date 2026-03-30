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
                注册
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

  <!-- Envelope Animation Container -->
  <Transition name="overlay">
    <div
      v-if="showEnvelope"
      class="fixed inset-0 z-50 flex items-center justify-center"
      :style="{
        background: envelopePhase === 'done' ? 'transparent' : 'rgba(0,0,0,0.5)',
        backdropFilter: envelopePhase === 'done' ? 'none' : 'blur(4px)',
        transition: 'background 0.5s, backdrop-filter 0.5s'
      }"
    >
      <!-- Envelope wrapper: slides in from left -->
      <div
        class="relative"
        :style="{
          width: '340px',
          height: '240px',
          transform: envelopePhase === 'entering' ? 'translateX(-120vw)' : 'translateX(0)',
          transition: 'transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
        }"
      >
        <!-- The Postcard: slides up from inside envelope then back in -->
        <div
          :style="{
            position: 'absolute',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '290px',
            height: '190px',
            background: 'white',
            boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
            zIndex: 15,
            top: envelopePhase === 'sliding' ? '-150px' : '25px',
            opacity: envelopePhase === 'entering' ? 0 : 1,
            transition: 'top 0.9s ease-in-out, opacity 0.4s'
          }"
        >
          <div style="width:100%;height:100%;border:1px solid rgba(0,0,0,0.1);display:flex;flex-direction:column;padding:10px;box-sizing:border-box;">
            <div style="display:flex;justify-content:flex-end;margin-bottom:8px;">
              <div style="width:32px;height:32px;border:1px dashed rgba(0,0,0,0.3);background:rgba(0,0,0,0.05);"></div>
            </div>
            <div style="margin-top:auto;display:flex;flex-direction:column;gap:6px;">
              <div style="height:4px;background:rgba(0,0,0,0.1);width:75%;border-radius:2px;"></div>
              <div style="height:4px;background:rgba(0,0,0,0.1);width:50%;border-radius:2px;"></div>
              <div style="height:4px;background:rgba(0,0,0,0.07);width:60%;border-radius:2px;"></div>
            </div>
          </div>
        </div>

        <!-- Envelope body -->
        <div
          style="position:absolute;inset:0;background:#f4eadd;border:1px solid rgba(0,0,0,0.05);z-index:10;"
        ></div>

        <!-- Envelope left/right/bottom flaps (z-index 20, above body) -->
        <div style="position:absolute;inset:0;z-index:20;overflow:hidden;pointer-events:none;">
          <!-- left -->
          <div style="position:absolute;top:0;left:0;width:0;height:0;border-top:120px solid transparent;border-bottom:120px solid transparent;border-left:170px solid #e8dbc8;"></div>
          <!-- right -->
          <div style="position:absolute;top:0;right:0;width:0;height:0;border-top:120px solid transparent;border-bottom:120px solid transparent;border-right:170px solid #e8dbc8;"></div>
          <!-- bottom -->
          <div style="position:absolute;bottom:0;left:0;width:0;height:0;border-left:170px solid transparent;border-right:170px solid transparent;border-bottom:100px solid #ddc9b0;"></div>
        </div>

        <!-- Envelope flap (top, folds down to close) -->
        <div
          :style="{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: 0,
            borderLeft: '170px solid transparent',
            borderRight: '170px solid transparent',
            borderTop: '120px solid #e0d0bb',
            transformOrigin: 'top center',
            transform: (envelopePhase === 'closing' || envelopePhase === 'verifying') ? 'rotateX(0deg)' : 'rotateX(180deg)',
            transition: 'transform 0.7s ease-in-out',
            zIndex: 30,
            perspective: '600px'
          }"
        ></div>

        <!-- Verification Form -->
        <div
          :style="{
            position: 'absolute',
            inset: 0,
            zIndex: 40,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px',
            opacity: envelopePhase === 'verifying' ? 1 : 0,
            pointerEvents: envelopePhase === 'verifying' ? 'auto' : 'none',
            transition: 'opacity 0.5s 0.3s'
          }"
        >
          <div style="background:rgba(255,255,255,0.95);backdrop-filter:blur(4px);padding:16px;border-radius:8px;box-shadow:0 4px 20px rgba(0,0,0,0.15);width:100%;text-align:center;">
            <h4 style="font-weight:700;margin-bottom:6px;font-size:14px;">填写邮编（验证码）</h4>
            <p style="font-size:11px;color:#888;margin-bottom:12px;">验证邮件已发送至 {{ email }}</p>
            <input
              v-model="verificationCode"
              type="text"
              placeholder="输入 6 位验证码"
              maxlength="6"
              style="width:100%;padding:8px 12px;border:1px solid rgba(0,0,0,0.15);border-radius:4px;text-align:center;letter-spacing:0.2em;font-family:monospace;margin-bottom:10px;outline:none;box-sizing:border-box;font-size:16px;"
            />
            <button
              @click="verifyAndComplete"
              :disabled="verificationCode.length !== 6 || isVerifying"
              style="width:100%;padding:8px;background:#b07d5e;color:white;font-weight:700;border:none;border-radius:4px;cursor:pointer;font-size:13px;"
              :style="{ opacity: (verificationCode.length !== 6 || isVerifying) ? 0.5 : 1 }"
            >
              <span v-if="!isVerifying">盖戳寄出</span>
              <span v-else>验证中...</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, nextTick } from "vue";
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

// Envelope animation state
const showEnvelope = ref(false);
const envelopePhase = ref<'entering' | 'sliding' | 'closing' | 'verifying' | 'done'>('entering');
const verificationCode = ref('');
const isVerifying = ref(false);

const bringToFront = (cardNum: number) => {
  activeCard.value = cardNum;
};

const triggerEnvelopeAnimation = async () => {
  showEnvelope.value = true;
  envelopePhase.value = 'entering';  // 信封在左侧屏幕外

  // 等 DOM 挂载完成后再触发过渡
  await nextTick();
  await new Promise(resolve => setTimeout(resolve, 50));
  envelopePhase.value = 'sliding';   // 信封滑入中心，明信片从信封弹出

  // 等信封滑入 + 明信片弹出动画完成
  await new Promise(resolve => setTimeout(resolve, 1500));
  envelopePhase.value = 'closing';   // 明信片收回信封，封口合上

  // 等合口动画完成
  await new Promise(resolve => setTimeout(resolve, 900));
  envelopePhase.value = 'verifying'; // 显示验证码表单
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

  if (!agreeTerms.value) return;

  triggerEnvelopeAnimation();
};

const verifyAndComplete = async () => {
  if (verificationCode.value.length !== 6) return;

  isVerifying.value = true;

  try {
    await new Promise(resolve => setTimeout(resolve, 1500));

    localStorage.setItem("user", JSON.stringify({
      username: username.value,
      email: email.value,
    }));

    envelopePhase.value = 'done';
    await new Promise(resolve => setTimeout(resolve, 600));
    showEnvelope.value = false;
    router.push("/");
  } catch (error) {
    alert("验证失败，请重试");
  } finally {
    isVerifying.value = false;
  }
};
</script>
