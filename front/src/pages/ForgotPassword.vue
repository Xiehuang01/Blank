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

    <div class="w-full max-w-sm md:max-w-2xl relative flex items-center justify-center" style="height: calc(100vh - 260px)">
      <!-- Postcard Container -->
      <div
        class="relative w-full md:aspect-[3/2] aspect-[3/4] group"
        :style="{
          transform: postcardsHidden ? 'scale(0.85)' : 'scale(1)',
          opacity: postcardsHidden ? 0 : 1,
          transition: 'transform 0.4s ease-in, opacity 0.4s ease-in',
          pointerEvents: postcardsHidden ? 'none' : 'auto'
        }"
      >
        <!-- Forgot Password Postcard -->
        <div
          class="absolute inset-0 rounded-none bg-white dark:bg-neutral p-3 md:p-6 flex flex-col md:flex-row border border-black/10 dark:border-white/10 shadow-xl"
        >
          <div class="w-full md:flex-1 flex flex-col pr-3 md:pr-6 md:border-r border-black/20">
            <h3 class="font-headline text-lg md:text-xl tracking-widest text-black/60 mb-3 md:mb-6 uppercase">Reset Password</h3>
            
            <div class="space-y-3 md:space-y-4 flex-1">
              <!-- Email -->
              <div class="space-y-1">
                <label class="text-xs font-semibold text-primary">注册邮箱</label>
                <input
                  v-model="resetForm.email"
                  type="email"
                  placeholder="输入注册时的邮箱"
                  class="w-full px-2 md:px-3 py-2 md:py-2 border border-black/10 dark:border-white/10 rounded text-sm md:text-sm bg-white dark:bg-neutral text-black dark:text-white placeholder:text-tertiary focus:border-secondary focus:outline-none transition-colors"
                />
              </div>

              <!-- New Password -->
              <div class="space-y-1">
                <label class="text-xs font-semibold text-primary">新密码</label>
                <div class="relative">
                  <input
                    v-model="resetForm.newPassword"
                    :type="showPassword ? 'text' : 'password'"
                    placeholder="输入新密码"
                    class="w-full px-2 md:px-3 py-2 md:py-2 border border-black/10 dark:border-white/10 rounded text-sm md:text-sm bg-white dark:bg-neutral text-black dark:text-white placeholder:text-tertiary focus:border-secondary focus:outline-none transition-colors"
                  />
                  <button
                    @click.stop="showPassword = !showPassword"
                    class="absolute right-2 md:right-3 top-1/2 -translate-y-1/2 text-tertiary hover:text-primary transition-colors"
                  >
                    <Eye v-if="!showPassword" class="w-3 md:w-4 h-3 md:h-4" />
                    <EyeOff v-else class="w-3 md:w-4 h-3 md:h-4" />
                  </button>
                </div>
              </div>

              <!-- Confirm Password -->
              <div class="space-y-1">
                <label class="text-xs font-semibold text-primary">确认新密码</label>
                <div class="relative">
                  <input
                    v-model="resetForm.confirmPassword"
                    :type="showConfirm ? 'text' : 'password'"
                    placeholder="再次输入新密码"
                    class="w-full px-2 md:px-3 py-2 md:py-2 border border-black/10 dark:border-white/10 rounded text-sm md:text-sm bg-white dark:bg-neutral text-black dark:text-white placeholder:text-tertiary focus:border-secondary focus:outline-none transition-colors"
                  />
                  <button
                    @click.stop="showConfirm = !showConfirm"
                    class="absolute right-2 md:right-3 top-1/2 -translate-y-1/2 text-tertiary hover:text-primary transition-colors"
                  >
                    <Eye v-if="!showConfirm" class="w-3 md:w-4 h-3 md:h-4" />
                    <EyeOff v-else class="w-3 md:w-4 h-3 md:h-4" />
                  </button>
                </div>
              </div>
            </div>

            <!-- Buttons -->
            <div class="mt-auto pt-4 md:pt-0 md:mt-8 flex flex-col md:flex-row gap-3 md:gap-0 md:items-end">
              <button
                @click.stop="handleSendCode"
                :disabled="isLoading"
                class="w-full md:flex-1 py-2 md:py-2.5 px-3 md:px-4 bg-secondary text-white dark:text-black font-bold text-sm rounded hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <span v-if="!isLoading">下一步</span>
                <span v-else class="flex items-center gap-2">
                  <svg class="w-3 md:w-4 h-3 md:h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  处理中...
                </span>
              </button>
              <!-- Mobile Clickable Text -->
              <router-link
                to="/login"
                class="md:hidden hover:opacity-70 transition-opacity text-right flex-1"
              >
                <p class="text-xs font-headline font-bold text-secondary hover:text-secondary/80 cursor-pointer">返回登录</p>
              </router-link>
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
            <div class="flex-1 flex flex-col justify-between overflow-hidden">
              <div class="text-sm text-tertiary leading-relaxed space-y-2 md:space-y-3">
                <p class="font-handwritten text-sm md:text-base text-primary opacity-80">忘了回来的路？没关系。</p>
                <p class="font-handwritten text-sm md:text-base text-primary opacity-80">寄一封特别的明信片给自己。</p>
                <p class="font-handwritten text-sm md:text-base text-primary opacity-80">里面有开启记忆的钥匙。</p>
                <p class="font-handwritten text-sm md:text-base text-primary opacity-80">拿上它，再次回到这里。</p>
              </div>

              <!-- Bottom Right - Clickable Text -->
              <router-link
                to="/login"
                class="text-right hover:opacity-70 transition-opacity"
              >
                <p class="text-sm font-headline font-bold text-secondary hover:text-secondary/80 cursor-pointer">想起密码？返回登录</p>
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  
  <!-- Envelope Animation Container -->
  <div
    v-if="showEnvelope"
    class="fixed inset-0 z-50 flex items-center justify-center"
    :style="{
      background: 'rgba(0,0,0,0.55)',
      backdropFilter: 'blur(6px)',
      transition: 'background 0.5s'
    }"
  >
    <div class="relative" :style="envelopeWrapperStyle">
      <!-- The Postcard inside -->
      <div
        :style="{
          position: 'absolute',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '290px',
          height: '190px',
          background: 'white',
          boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
          zIndex: 12,
          top: envelopePhase === 'sliding' ? '-160px' : '25px',
          opacity: envelopePhase === 'entering' ? 0 : 1,
          transition: 'top 0.5s ease-in-out, opacity 0.4s'
        }"
      >
        <div style="width:100%;height:100%;border:1px solid rgba(0,0,0,0.1);display:flex;flex-direction:column;padding:10px;box-sizing:border-box;overflow:hidden;">
          <div style="display:flex;justify-content:flex-end;margin-bottom:8px;">
            <div style="width:28px;height:28px;border:1px dashed rgba(0,0,0,0.3);background:rgba(0,0,0,0.05);"></div>
          </div>
          <div style="margin-top:auto;display:flex;flex-direction:column;gap:6px;">
            <div style="height:4px;background:rgba(0,0,0,0.1);width:75%;border-radius:2px;"></div>
            <div style="height:4px;background:rgba(0,0,0,0.1);width:50%;border-radius:2px;"></div>
            <div style="height:4px;background:rgba(0,0,0,0.07);width:60%;border-radius:2px;"></div>
          </div>
        </div>
      </div>

      <!-- Envelope body (z=10) -->
      <div style="position:absolute;inset:0;background:#faf3e8;border:1px solid rgba(0,0,0,0.06);z-index:10;"></div>

      <!-- Envelope side+bottom flaps -->
      <div style="position:absolute;inset:0;z-index:20;overflow:hidden;pointer-events:none;">
        <div style="position:absolute;top:0;left:0;width:0;height:0;border-top:120px solid transparent;border-bottom:120px solid transparent;border-left:170px solid #dfd0bc;"></div>
        <div style="position:absolute;top:0;right:0;width:0;height:0;border-top:120px solid transparent;border-bottom:120px solid transparent;border-right:170px solid #dfd0bc;"></div>
        <div style="position:absolute;bottom:0;left:0;width:0;height:0;border-left:170px solid transparent;border-right:170px solid transparent;border-bottom:120px solid #e8d9c4;"></div>
      </div>

      <!-- Envelope top flap -->
      <div
        :style="{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: 0,
          borderLeft: '170px solid transparent',
          borderRight: '170px solid transparent',
          borderTop: '140px solid #e8d8c4',
          transformOrigin: 'top center',
          transform: (envelopePhase === 'sealing' || envelopePhase === 'verifying' || envelopePhase === 'sending') ? 'perspective(600px) rotateX(0deg)' : 'perspective(600px) rotateX(180deg)',
          transition: 'transform 0.7s ease-in-out',
          zIndex: (envelopePhase === 'sealing' || envelopePhase === 'verifying' || envelopePhase === 'sending' || envelopePhase === 'done') ? 25 : 8
        }"
      ></div>

      <!-- Verification Form (z=40) -->
      <div
        :style="{
          position: 'absolute',
          inset: 0,
          zIndex: 40,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '14px',
          opacity: envelopePhase === 'verifying' ? 1 : 0,
          pointerEvents: envelopePhase === 'verifying' ? 'auto' : 'none',
          transition: 'opacity 0.5s 0.2s'
        }"
      >
        <div style="background:rgba(255,255,255,0.96);backdrop-filter:blur(4px);padding:14px 12px;border-radius:8px;box-shadow:0 4px 20px rgba(0,0,0,0.18);width:100%;text-align:center;">
          <h4 style="font-weight:700;margin-bottom:4px;font-size:13px;color:#3a2a1a;">填写邮编（验证码）</h4>
          <p style="font-size:10px;color:#999;margin-bottom:10px;">已发送至 {{ resetForm.email }}</p>
          <!-- 6 individual boxes -->
          <div style="display:flex;gap:6px;justify-content:center;margin-bottom:10px;">
            <input
              v-for="(_, i) in 6"
              :key="i"
              :ref="el => { if (el) codeInputs[i] = el as HTMLInputElement }"
              type="text"
              inputmode="numeric"
              maxlength="1"
              :value="codeDigits[i]"
              @input="onDigitInput($event, i)"
              @keydown="onDigitKeydown($event, i)"
              @paste="onCodePaste($event)"
              style="width:36px;height:40px;border:1.5px solid rgba(0,0,0,0.2);border-radius:4px;text-align:center;font-size:18px;font-family:monospace;font-weight:700;outline:none;box-sizing:border-box;background:white;"
            />
          </div>
          <button
            @click="verifyAndReset"
            :disabled="codeDigits.join('').length !== 6 || isVerifying"
            style="width:100%;padding:8px;background:#b07d5e;color:white;font-weight:700;border:none;border-radius:4px;cursor:pointer;font-size:13px;transition:opacity 0.2s;"
            :style="{ opacity: (codeDigits.join('').length !== 6 || isVerifying) ? 0.45 : 1 }"
          >
            <span v-if="!isVerifying">盖戳确认</span>
            <span v-else>重置中...</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick, computed } from "vue";
import { useRouter } from "vue-router";
import { Eye, EyeOff } from "lucide-vue-next";
import { ElMessage } from "element-plus";
import { forgotPassword, resetPassword } from "../api/auth.js";

const router = useRouter();

const isLoading = ref(false);
const postcardsHidden = ref(false);

const showPassword = ref(false);
const showConfirm = ref(false);

const resetForm = ref({
  email: "",
  newPassword: "",
  confirmPassword: "",
});

// Envelope animation state
const showEnvelope = ref(false);
const envelopePhase = ref<'entering' | 'sliding' | 'closing' | 'sealing' | 'verifying' | 'sending' | 'done'>('entering');
const isVerifying = ref(false);

// 6-digit code boxes
const codeDigits = ref<string[]>(['', '', '', '', '', '']);
const codeInputs = ref<HTMLInputElement[]>([]);

const getErrorMessage = (error: unknown, fallback: string) => {
  const responseMessage = (error as { response?: { data?: { message?: string } } })
    ?.response?.data?.message;
  const defaultMessage = error instanceof Error ? error.message : "";
  return responseMessage || defaultMessage || fallback;
};

const onDigitInput = (e: Event, i: number) => {
  const target = e.target as HTMLInputElement;
  const val = target.value.replace(/\D/g, '').slice(-1);
  codeDigits.value[i] = val;
  target.value = val;
  if (val && i < 5) {
    nextTick(() => codeInputs.value[i + 1]?.focus());
  }
};

const onDigitKeydown = (e: KeyboardEvent, i: number) => {
  if (e.key === 'Backspace' && !codeDigits.value[i] && i > 0) {
    nextTick(() => codeInputs.value[i - 1]?.focus());
  }
};

const onCodePaste = (e: ClipboardEvent) => {
  const text = e.clipboardData?.getData('text').replace(/\D/g, '').slice(0, 6) ?? '';
  text.split('').forEach((ch, i) => { codeDigits.value[i] = ch; });
  nextTick(() => codeInputs.value[Math.min(text.length, 5)]?.focus());
  e.preventDefault();
};

const envelopeWrapperStyle = computed(() => {
  let transform = 'translateX(0) rotate(0deg)';
  let transition = 'transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)';

  if (envelopePhase.value === 'entering') {
    transform = 'translateX(-120vw) rotate(0deg)';
  } else if (envelopePhase.value === 'sending') {
    transform = 'translateX(-30px) rotate(-8deg)';
    transition = 'transform 0.35s cubic-bezier(0.4, 0, 1, 1)';
  } else if (envelopePhase.value === 'done') {
    transform = 'translateX(130vw) rotate(12deg)';
    transition = 'transform 0.55s cubic-bezier(0.4, 0, 0.6, 1)';
  }

  return {
    width: '340px',
    height: '240px',
    transform,
    transition,
  };
});

const triggerEnvelopeAnimation = async () => {
  postcardsHidden.value = true;

  await new Promise((resolve) => setTimeout(resolve, 400));

  showEnvelope.value = true;
  envelopePhase.value = 'entering';

  await nextTick();
  await new Promise((resolve) => setTimeout(resolve, 60));
  envelopePhase.value = 'sliding';

  await new Promise((resolve) => setTimeout(resolve, 1500));
  envelopePhase.value = 'closing';

  await new Promise((resolve) => setTimeout(resolve, 600));
  envelopePhase.value = 'sealing';

  await new Promise((resolve) => setTimeout(resolve, 850));
  envelopePhase.value = 'verifying';
};

const handleSendCode = async () => {
  if (!resetForm.value.email || !resetForm.value.newPassword || !resetForm.value.confirmPassword) {
    ElMessage.warning("请填写所有字段");
    return;
  }

  if (resetForm.value.newPassword !== resetForm.value.confirmPassword) {
    ElMessage.warning("两次输入的新密码不一致");
    return;
  }

  if (resetForm.value.newPassword.length < 6) {
    ElMessage.warning("密码长度至少为 6 位");
    return;
  }

  isLoading.value = true;
  try {
    await forgotPassword(resetForm.value.email);
    codeDigits.value = ['', '', '', '', '', ''];
    ElMessage.success('验证码已发送，请查收邮箱');
    await triggerEnvelopeAnimation();
  } catch (error) {
    ElMessage.error(getErrorMessage(error, '验证码发送失败，请稍后重试'));
  } finally {
    isLoading.value = false;
  }
};

const verifyAndReset = async () => {
  const verifyCode = codeDigits.value.join('');
  if (verifyCode.length !== 6) {
    return;
  }

  isVerifying.value = true;
  try {
    const result = await resetPassword(
      resetForm.value.email,
      verifyCode,
      resetForm.value.newPassword
    );

    ElMessage.success(result.message || '密码重置成功，请重新登录');
    envelopePhase.value = 'sending';
    await new Promise((resolve) => setTimeout(resolve, 380));
    envelopePhase.value = 'done';
    await new Promise((resolve) => setTimeout(resolve, 600));
    router.push('/login');
  } catch (error) {
    ElMessage.error(getErrorMessage(error, '密码重置失败，请重试'));
    isVerifying.value = false;
  }
};
</script>
