<template>
  <div class="min-h-screen bg-background pb-24 md:pb-10 flex flex-col">
    <div class="w-full max-w-3xl px-4 py-6 mx-auto md:my-auto">
      <div class="overflow-hidden rounded-2xl border border-black/5 bg-white shadow-sm dark:border-white/10 dark:bg-neutral md:shadow-2xl">
        <header class="sticky top-0 z-10 flex items-center justify-between border-b border-black/10 bg-white/95 px-4 py-4 backdrop-blur-sm dark:border-white/10 dark:bg-neutral/95 md:px-6">
          <div class="flex items-center gap-3">
            <button
              @click="router.back()"
              class="flex h-9 w-9 items-center justify-center rounded-full text-primary transition-colors hover:bg-primary/5"
            >
              <ChevronLeft class="h-5 w-5" />
            </button>
            <div>
              <h1 class="font-headline text-lg font-bold text-primary md:text-xl">账号管理</h1>
              <p class="text-xs text-tertiary md:text-sm">管理账号安全、隐私与登录状态</p>
            </div>
          </div>
          <button
            @click="handleLogout"
            :disabled="isLoggingOut"
            class="rounded-lg border border-red-200 px-4 py-2 text-sm font-bold text-red-500 transition-colors hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-red-500/30 dark:hover:bg-red-500/10"
          >
            {{ isLoggingOut ? '退出中...' : '退出登录' }}
          </button>
        </header>

        <div class="space-y-6 p-4 md:p-6">
          <section class="rounded-2xl border border-black/5 bg-neutral p-5 dark:border-white/5">
            <div class="flex items-center justify-between gap-3">
              <div>
                <h2 class="text-base font-bold text-primary">绑定账号</h2>
                <p class="mt-1 text-sm text-tertiary">当前绑定邮箱与资料可见性</p>
              </div>
              <Mail class="h-5 w-5 text-primary" />
            </div>

            <div class="mt-4 space-y-4">
              <div class="rounded-xl bg-black/5 px-4 py-3 dark:bg-white/5">
                <p class="text-xs text-tertiary">绑定邮箱</p>
                <p class="mt-1 text-sm font-bold text-primary">{{ boundEmail }}</p>
                <p class="mt-1 text-xs text-tertiary">当前仅支持展示，暂不支持前端改绑邮箱。</p>
              </div>

              <div class="rounded-xl bg-black/5 px-4 py-4 dark:bg-white/5">
                <div class="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p class="text-sm font-bold text-primary">个人资料可见性</p>
                    <p class="mt-1 text-xs text-tertiary">{{ visibilityDescription }}</p>
                  </div>
                  <div class="flex items-center gap-3">
                    <select
                      v-model="profileVisibility"
                      class="rounded-lg border border-black/10 bg-white px-3 py-2 text-sm text-primary focus:outline-none focus:ring-2 focus:ring-primary dark:border-white/10 dark:bg-neutral dark:focus:ring-secondary"
                    >
                      <option v-for="option in visibilityOptions" :key="option" :value="option">{{ option }}</option>
                    </select>
                    <button
                      @click="saveVisibility"
                      :disabled="isSavingVisibility || isLoading"
                      class="rounded-lg bg-primary px-4 py-2 text-sm font-bold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-secondary dark:text-black"
                    >
                      {{ isSavingVisibility ? '保存中...' : '保存' }}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section class="rounded-2xl border border-black/5 bg-neutral p-5 dark:border-white/5">
            <button
              @click="passwordPanelOpen = !passwordPanelOpen"
              class="flex w-full items-center justify-between text-left"
            >
              <div class="flex items-center gap-3" @click="$router.push('/forgot-password')">
                <Lock class="h-5 w-5 text-primary" />
                <div>
                  <h2 class="text-base font-bold text-primary">修改密码</h2>
                  <p class="mt-1 text-sm text-tertiary">定期修改密码可以提升账号安全性</p>
                </div>
              </div>
              <ChevronRight class="h-5 w-5 text-tertiary transition-transform" :class="passwordPanelOpen ? 'rotate-90' : ''" />
            </button>

            <div v-if="passwordPanelOpen" class="mt-4 grid gap-4 md:grid-cols-3">
              <input
                v-model="passwordForm.oldPassword"
                type="password"
                placeholder="当前密码"
                class="rounded-lg border border-black/10 bg-black/5 px-3 py-2.5 text-primary focus:outline-none focus:ring-2 focus:ring-primary dark:border-white/10 dark:bg-white/5 dark:focus:ring-secondary"
              />
              <input
                v-model="passwordForm.newPassword"
                type="password"
                placeholder="新密码（至少 6 位）"
                class="rounded-lg border border-black/10 bg-black/5 px-3 py-2.5 text-primary focus:outline-none focus:ring-2 focus:ring-primary dark:border-white/10 dark:bg-white/5 dark:focus:ring-secondary"
              />
              <input
                v-model="passwordForm.confirmPassword"
                type="password"
                placeholder="确认新密码"
                class="rounded-lg border border-black/10 bg-black/5 px-3 py-2.5 text-primary focus:outline-none focus:ring-2 focus:ring-primary dark:border-white/10 dark:bg-white/5 dark:focus:ring-secondary"
              />
              <div class="md:col-span-3 flex justify-end">
                <button
                  @click="submitPasswordChange"
                  :disabled="isChangingPassword"
                  class="rounded-lg bg-primary px-4 py-2 text-sm font-bold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-secondary dark:text-black"
                >
                  {{ isChangingPassword ? '提交中...' : '确认修改密码' }}
                </button>
              </div>
            </div>
          </section>

          <section class="rounded-2xl border border-red-200 bg-red-50/80 p-5 dark:border-red-500/20 dark:bg-red-500/10">
            <button
              @click="deletePanelOpen = !deletePanelOpen"
              class="flex w-full items-center justify-between text-left"
            >
              <div class="flex items-center gap-3">
                <Trash2 class="h-5 w-5 text-red-500" />
                <div>
                  <h2 class="text-base font-bold text-red-500">删除账号</h2>
                  <p class="mt-1 text-sm text-red-400">该操作不可恢复，请输入密码后谨慎确认</p>
                </div>
              </div>
              <ChevronRight class="h-5 w-5 text-red-400 transition-transform" :class="deletePanelOpen ? 'rotate-90' : ''" />
            </button>

            <div v-if="deletePanelOpen" class="mt-4 flex flex-col gap-3 md:flex-row">
              <input
                v-model="deletePassword"
                type="password"
                placeholder="输入当前密码确认删除"
                class="flex-1 rounded-lg border border-red-200 bg-white px-3 py-2.5 text-primary focus:outline-none focus:ring-2 focus:ring-red-300 dark:border-red-500/20 dark:bg-neutral"
              />
              <button
                @click="submitDeleteAccount"
                :disabled="isDeletingAccount"
                class="rounded-lg bg-red-500 px-4 py-2.5 text-sm font-bold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {{ isDeletingAccount ? '删除中...' : '永久删除账号' }}
              </button>
            </div>
          </section>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { ChevronLeft, ChevronRight, Lock, Trash2, Mail } from 'lucide-vue-next';
import { ElMessage } from 'element-plus';
import { useRouter } from 'vue-router';
import { deleteAccount, getProfile, updatePassword, updateProfile } from '../api/user.js';
import { useUser } from '../store/user';

const router = useRouter();
const { userInfo, logout, updateUser, clearUser } = useUser();

const visibilityOptions = ['所有人', '仅好友', '仅自己'];
const isLoading = ref(true);
const isSavingVisibility = ref(false);
const isChangingPassword = ref(false);
const isDeletingAccount = ref(false);
const isLoggingOut = ref(false);
const passwordPanelOpen = ref(false);
const deletePanelOpen = ref(false);
const profileVisibility = ref('所有人');
const profileEmail = ref('');
const passwordForm = ref({
  oldPassword: '',
  newPassword: '',
  confirmPassword: '',
});
const deletePassword = ref('');

const getErrorMessage = (error: unknown, fallback: string) => {
  const responseMessage = (error as { response?: { data?: { message?: string } } })?.response?.data?.message;
  const defaultMessage = error instanceof Error ? error.message : '';
  return responseMessage || defaultMessage || fallback;
};

const boundEmail = computed(() => userInfo.value?.email || profileEmail.value || '未绑定邮箱');
const visibilityDescription = computed(() => {
  if (profileVisibility.value === '仅好友') return '仅互相关注的好友可以查看你的资料';
  if (profileVisibility.value === '仅自己') return '只有你自己可以查看完整资料';
  return '所有访问者都可以查看你的公开资料';
});

const loadProfileData = async () => {
  isLoading.value = true;
  try {
    const result = await getProfile();
    profileEmail.value = result.data?.email || '';
    profileVisibility.value = result.data?.profileVisibility || '所有人';
    updateUser(result.data || {});
  } catch (error) {
    ElMessage.error(getErrorMessage(error, '获取账号信息失败'));
  } finally {
    isLoading.value = false;
  }
};

const saveVisibility = async () => {
  isSavingVisibility.value = true;
  try {
    const result = await updateProfile({ profileVisibility: profileVisibility.value });
    updateUser({ profileVisibility: profileVisibility.value });
    ElMessage.success(result.message || '隐私设置已保存');
  } catch (error) {
    ElMessage.error(getErrorMessage(error, '保存隐私设置失败'));
  } finally {
    isSavingVisibility.value = false;
  }
};

const submitPasswordChange = async () => {
  if (!passwordForm.value.oldPassword || !passwordForm.value.newPassword || !passwordForm.value.confirmPassword) {
    ElMessage.warning('请填写完整的密码信息');
    return;
  }
  if (passwordForm.value.newPassword.length < 6) {
    ElMessage.warning('新密码长度不能少于 6 位');
    return;
  }
  if (passwordForm.value.newPassword !== passwordForm.value.confirmPassword) {
    ElMessage.warning('两次输入的新密码不一致');
    return;
  }

  isChangingPassword.value = true;
  try {
    const result = await updatePassword(passwordForm.value.oldPassword, passwordForm.value.newPassword);
    passwordForm.value = { oldPassword: '', newPassword: '', confirmPassword: '' };
    passwordPanelOpen.value = false;
    ElMessage.success(result.message || '密码修改成功');
  } catch (error) {
    ElMessage.error(getErrorMessage(error, '修改密码失败'));
  } finally {
    isChangingPassword.value = false;
  }
};

const submitDeleteAccount = async () => {
  if (!deletePassword.value) {
    ElMessage.warning('请输入当前密码以确认删除');
    return;
  }
  if (!window.confirm('账号删除后无法恢复，确定继续吗？')) {
    return;
  }

  isDeletingAccount.value = true;
  try {
    const result = await deleteAccount(deletePassword.value);
    clearUser();
    ElMessage.success(result.message || '账号已删除');
    router.replace('/login');
  } catch (error) {
    ElMessage.error(getErrorMessage(error, '删除账号失败'));
  } finally {
    isDeletingAccount.value = false;
  }
};

const handleLogout = async () => {
  isLoggingOut.value = true;
  try {
    await logout();
    ElMessage.success('已退出登录');
    router.replace('/login');
  } catch (error) {
    ElMessage.error(getErrorMessage(error, '退出登录失败'));
  } finally {
    isLoggingOut.value = false;
  }
};

onMounted(() => {
  loadProfileData();
});
</script>
