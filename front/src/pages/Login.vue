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
      <!-- Stacked Postcards Container -->
      <div
        class="relative w-full md:aspect-[3/2] aspect-[3/4] group"
        :style="{
          transform: postcardsHidden ? 'scale(0.85)' : 'scale(1)',
          opacity: postcardsHidden ? 0 : 1,
          transition: 'transform 0.4s ease-in, opacity 0.4s ease-in',
          pointerEvents: postcardsHidden ? 'none' : 'auto'
        }"
      >
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
                class="w-full md:flex-1 py-2 md:py-2.5 px-3 md:px-4 bg-secondary text-white dark:text-black font-bold text-sm rounded hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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
            <div class="flex-1 flex flex-col justify-between overflow-hidden">
              <div class="text-sm text-tertiary leading-relaxed space-y-2 md:space-y-3">
                <p class="font-handwritten text-sm md:text-base text-primary opacity-80">回到这里，未完成的话语可以继续书写。</p>
                <p class="font-handwritten text-sm md:text-base text-primary opacity-80">你寄出的心情，正等待被再次看见。</p>
                <p class="font-handwritten text-sm md:text-base text-primary opacity-80">别来无恙，你的空白处还留着余温。</p>
                <p class="font-handwritten text-sm md:text-base text-primary opacity-80">那些未诉尽的言语，还在原地等你。</p>
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
          <div class="w-full md:flex-1 flex flex-col pr-3 md:pr-6 md:border-r border-black/20 overflow-hidden">
            <h3 class="font-headline text-lg md:text-xl tracking-widest text-black/60 mb-2 md:mb-3 shrink-0">REGISTER</h3>
            
            <div class="space-y-1.5 flex-1 min-h-0 overflow-hidden">
              <!-- Username -->
              <div class="space-y-1">
                <label class="text-xs font-semibold text-primary">用户名</label>
                <input
                  v-model="registerForm.username"
                  type="text"
                  placeholder="选择用户名"
                  class="w-full px-2 md:px-3 py-1 md:py-1.5 border border-black/10 dark:border-white/10 rounded text-sm bg-white dark:bg-neutral text-black dark:text-white placeholder:text-tertiary focus:border-secondary focus:outline-none transition-colors"
                />
              </div>

              <!-- Email -->
              <div class="space-y-1">
                <label class="text-xs font-semibold text-primary">邮箱</label>
                <input
                  v-model="registerForm.email"
                  type="email"
                  placeholder="输入邮箱"
                  class="w-full px-2 md:px-3 py-1 md:py-1.5 border border-black/10 dark:border-white/10 rounded text-sm bg-white dark:bg-neutral text-black dark:text-white placeholder:text-tertiary focus:border-secondary focus:outline-none transition-colors"
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
                    class="w-full px-2 md:px-3 py-1 md:py-1.5 border border-black/10 dark:border-white/10 rounded text-sm bg-white dark:bg-neutral text-black dark:text-white placeholder:text-tertiary focus:border-secondary focus:outline-none transition-colors"
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
                    class="w-full px-2 md:px-3 py-1 md:py-1.5 border border-black/10 dark:border-white/10 rounded text-sm bg-white dark:bg-neutral text-black dark:text-white placeholder:text-tertiary focus:border-secondary focus:outline-none transition-colors"
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
            <div class="pt-2 shrink-0 flex flex-col md:flex-row gap-2 md:gap-0 md:items-end">
              <button
                @click.stop="handleRegister"
                :disabled="isLoading || !registerForm.agreeTerms"
                class="w-full md:flex-1 py-2 md:py-2.5 px-3 md:px-4 bg-secondary text-white dark:text-black font-bold text-sm rounded hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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

            <div class="flex-1 flex flex-col justify-between overflow-hidden">
              <div class="text-sm text-tertiary leading-relaxed space-y-2 md:space-y-3">
                <p class="font-handwritten text-sm md:text-base text-primary opacity-80">从这里开始，为想说的话寻一个安放之地。</p>
                <p class="font-handwritten text-sm md:text-base text-primary opacity-80">新的一页，从空白处写下第一行字。</p>
                <p class="font-handwritten text-sm md:text-base text-primary opacity-80">你来了，明信片就有了第一抹颜色。</p>
                <p class="font-handwritten text-sm md:text-base text-primary opacity-80">给自己一个机会，把心里的话轻轻放下。</p>
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
    <!-- Postcards shrink out -->

    <!-- Envelope wrapper -->
    <div
      class="relative"
      :style="envelopeWrapperStyle"
    >
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

      <!-- Envelope side+bottom flaps (z=20, above body, below flap) -->
      <div style="position:absolute;inset:0;z-index:20;overflow:hidden;pointer-events:none;">
        <!-- left -->
        <div style="position:absolute;top:0;left:0;width:0;height:0;border-top:120px solid transparent;border-bottom:120px solid transparent;border-left:170px solid #dfd0bc;"></div>
        <!-- right -->
        <div style="position:absolute;top:0;right:0;width:0;height:0;border-top:120px solid transparent;border-bottom:120px solid transparent;border-right:170px solid #dfd0bc;"></div>
        <!-- bottom: must cover full width, height=120px same as sides -->
        <div style="position:absolute;bottom:0;left:0;width:0;height:0;border-left:170px solid transparent;border-right:170px solid transparent;border-bottom:120px solid #e8d9c4;"></div>
      </div>

      <!-- Envelope top flap: z-index LOW when open (below postcard), HIGH when closing -->
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
          <p style="font-size:10px;color:#999;margin-bottom:10px;">已发送至 {{ registerForm.email }}</p>
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
            @click="verifyAndComplete"
            :disabled="codeDigits.join('').length !== 6 || isVerifying"
            style="width:100%;padding:8px;background:#b07d5e;color:white;font-weight:700;border:none;border-radius:4px;cursor:pointer;font-size:13px;transition:opacity 0.2s;"
            :style="{ opacity: (codeDigits.join('').length !== 6 || isVerifying) ? 0.45 : 1 }"
          >
            <span v-if="!isVerifying">盖戳寄出</span>
            <span v-else>验证中...</span>
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
import { useUser } from "../store/user";

const router = useRouter();
const { login: loginUser } = useUser();

const flipped = ref(false);
const isLoading = ref(false);

// Postcards shrink state
const postcardsHidden = ref(false);

// Envelope animation state
const showEnvelope = ref(false);
const envelopePhase = ref<'entering' | 'sliding' | 'closing' | 'sealing' | 'verifying' | 'sending' | 'done'>('entering');
const isVerifying = ref(false);

// 6-digit code boxes
const codeDigits = ref<string[]>(['', '', '', '', '', '']);
const codeInputs = ref<HTMLInputElement[]>([]);

const onDigitInput = (e: Event, i: number) => {
  const val = (e.target as HTMLInputElement).value.replace(/\D/g, '').slice(-1);
  codeDigits.value[i] = val;
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

// Computed envelope wrapper style
const envelopeWrapperStyle = computed(() => {
  let transform = 'translateX(0) rotate(0deg)';
  let transition = 'transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)';

  if (envelopePhase.value === 'entering') {
    transform = 'translateX(-120vw) rotate(0deg)';
  } else if (envelopePhase.value === 'sending') {
    // wind-up: tilt left first
    transform = 'translateX(-30px) rotate(-8deg)';
    transition = 'transform 0.35s cubic-bezier(0.4, 0, 1, 1)';
  } else if (envelopePhase.value === 'done') {
    // shoot right
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
  // Shrink postcards out
  postcardsHidden.value = true;

  await new Promise(resolve => setTimeout(resolve, 400));

  showEnvelope.value = true;
  envelopePhase.value = 'entering';

  await nextTick();
  await new Promise(resolve => setTimeout(resolve, 60));
  envelopePhase.value = 'sliding';   // 信封滑入，明信片弹出

  await new Promise(resolve => setTimeout(resolve, 1500));
  envelopePhase.value = 'closing';   // 明信片开始收回信封（翻盖仍开着）

  await new Promise(resolve => setTimeout(resolve, 600));  // 等明信片完全滑入
  envelopePhase.value = 'sealing';   // 翻盖合上

  await new Promise(resolve => setTimeout(resolve, 850));  // 等翻盖动画完成
  envelopePhase.value = 'verifying'; // 显示验证码
};

const verifyAndComplete = async () => {
  if (codeDigits.value.join('').length !== 6) return;
  isVerifying.value = true;
  try {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // 使用user store保存用户信息
    loginUser({
      uid: Math.floor(Math.random() * 9000000 + 1000000).toString(), // 生成随机UID
      username: registerForm.value.username,
      email: registerForm.value.email,
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBYArdRu7qlNp4cuo06XFR6gjYC0xtUePbpepRVZFPb60NLBx_VR9amuEGGGmcgoSJxZnTSvk-qC-pT40C1BcNky-vgDMQS81oXbUZ1ZhPGx8TyP5kDLnK2UxXs44i4R9b0C6J2F0AegR2bJ6baLYqRUydE5fXGJMLngQf9plW3-BdtpO6Gnq5BWbM5Y8_ZXBxCkBcu_AycBYRNspo0GmyLKNOwz7WDP8qJiBl97glqeE0pFejorxYMHYxFqX9mdXogSMmgx3TMR9IR',
      vipLevel: 'FREE',
      coins: 100, // 新用户赠送100邮分
      rememberMe: false,
    });
    
    // Wind-up lean left
    envelopePhase.value = 'sending';
    await new Promise(resolve => setTimeout(resolve, 380));
    // Shoot right
    envelopePhase.value = 'done';
    await new Promise(resolve => setTimeout(resolve, 600));
    router.push('/');
  } catch (error) {
    ElMessage.error('验证失败，请重试');
    isVerifying.value = false;
  }
};

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
    ElMessage.warning("请输入邮箱和密码");
    return;
  }

  isLoading.value = true;

  try {
    await new Promise(resolve => setTimeout(resolve, 1500));

    // 使用user store保存用户信息
    loginUser({
      uid: '1024520', // 模拟用户ID
      username: '苏木', // 模拟用户名
      email: loginForm.value.email,
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBYArdRu7qlNp4cuo06XFR6gjYC0xtUePbpepRVZFPb60NLBx_VR9amuEGGGmcgoSJxZnTSvk-qC-pT40C1BcNky-vgDMQS81oXbUZ1ZhPGx8TyP5kDLnK2UxXs44i4R9b0C6J2F0AegR2bJ6baLYqRUydE5fXGJMLngQf9plW3-BdtpO6Gnq5BWbM5Y8_ZXBxCkBcu_AycBYRNspo0GmyLKNOwz7WDP8qJiBl97glqeE0pFejorxYMHYxFqX9mdXogSMmgx3TMR9IR',
      vipLevel: 'VIP',
      coins: 850,
      rememberMe: loginForm.value.rememberMe,
    });

    ElMessage.success("登录成功！");
    router.push("/");
  } catch (error) {
    ElMessage.error("登录失败，请重试");
  } finally {
    isLoading.value = false;
  }
};

const handleRegister = async () => {
  if (!registerForm.value.username || !registerForm.value.email || !registerForm.value.password || !registerForm.value.confirmPassword) {
    ElMessage.warning("请填写所有字段");
    return;
  }

  if (registerForm.value.password !== registerForm.value.confirmPassword) {
    ElMessage.warning("两次输入的密码不一致");
    return;
  }

  if (registerForm.value.password.length < 6) {
    ElMessage.warning("密码长度至少为 6 位");
    return;
  }

  triggerEnvelopeAnimation();
};
</script>
