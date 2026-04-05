<template>
  <div class="min-h-screen bg-background pb-24 md:pb-10 flex flex-col">
    <div class="w-full max-w-4xl px-4 py-6 mx-auto md:my-auto">
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
              <h1 class="font-headline text-lg font-bold text-primary md:text-xl">个人资料</h1>
              <p class="text-xs text-tertiary md:text-sm">同步你的真实账号资料与统计信息</p>
            </div>
          </div>
          <button
            @click="saveProfile"
            :disabled="isLoading || isSaving"
            class="rounded-lg bg-primary px-4 py-2 text-sm font-bold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-secondary dark:text-black"
          >
            {{ isSaving ? '保存中...' : '保存修改' }}
          </button>
        </header>

        <div class="space-y-6 p-4 md:p-6">
          <section class="flex flex-col gap-5 rounded-2xl border border-black/5 bg-neutral p-5 dark:border-white/5 md:flex-row md:items-center md:justify-between">
            <div class="flex items-center gap-4">
              <div class="relative">
                <div class="h-20 w-20 overflow-hidden rounded-full border-2 border-black/10 shadow-sm md:h-24 md:w-24">
                  <img
                    :src="avatarUrl"
                    alt="Avatar"
                    class="h-full w-full object-cover"
                    referrerpolicy="no-referrer"
                  />
                </div>
                <button
                  @click="triggerAvatarUpload"
                  :disabled="isUploading"
                  class="absolute bottom-0 right-0 flex h-7 w-7 items-center justify-center rounded-full bg-secondary text-white shadow-md transition-transform hover:scale-110 disabled:cursor-not-allowed disabled:opacity-60 md:h-8 md:w-8"
                >
                  <Camera class="h-3 w-3 md:h-4 md:w-4" />
                </button>
              </div>
              <div>
                <h2 class="font-headline text-xl font-bold text-primary md:text-2xl">{{ displayName }}</h2>
                <p class="mt-1 text-sm text-tertiary">UID: {{ displayUid }}</p>
                <p class="mt-2 text-xs text-tertiary">{{ isUploading ? '头像上传中...' : '点击相机可上传新头像' }}</p>
              </div>
            </div>
            <button
              @click="focusNickname"
              class="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-bold text-white transition-opacity hover:opacity-90 dark:bg-secondary dark:text-black"
            >
              <PenLine class="h-4 w-4" />
              编辑昵称
            </button>
          </section>

          <section class="grid gap-6 lg:grid-cols-[minmax(0,1.6fr)_minmax(260px,1fr)]">
            <div class="space-y-4 rounded-2xl border border-black/5 bg-neutral p-5 dark:border-white/5">
              <div class="grid gap-4 md:grid-cols-2">
                <div>
                  <label class="mb-2 block text-sm font-bold text-primary">昵称</label>
                  <input
                    ref="nicknameInput"
                    v-model.trim="form.username"
                    type="text"
                    maxlength="20"
                    class="w-full rounded-lg border border-black/10 bg-black/5 px-3 py-2.5 text-primary placeholder-tertiary focus:outline-none focus:ring-2 focus:ring-primary dark:border-white/10 dark:bg-white/5 dark:focus:ring-secondary"
                    placeholder="请输入昵称"
                  />
                </div>

                <div>
                  <label class="mb-2 block text-sm font-bold text-primary">邮箱</label>
                  <input
                    :value="form.email"
                    type="email"
                    readonly
                    class="w-full cursor-not-allowed rounded-lg border border-black/10 bg-black/5 px-3 py-2.5 text-primary/70 focus:outline-none dark:border-white/10 dark:bg-white/5 dark:text-white/70"
                  />
                  <p class="mt-1 text-xs text-tertiary">当前仅支持展示，暂不支持前端改绑邮箱。</p>
                </div>

                <div>
                  <label class="mb-2 block text-sm font-bold text-primary">性别</label>
                  <select
                    v-model="form.gender"
                    class="w-full rounded-lg border border-black/10 bg-black/5 px-3 py-2.5 text-primary focus:outline-none focus:ring-2 focus:ring-primary dark:border-white/10 dark:bg-white/5 dark:focus:ring-secondary"
                  >
                    <option v-for="option in genderOptions" :key="option" :value="option">{{ option }}</option>
                  </select>
                </div>

                <div>
                  <label class="mb-2 block text-sm font-bold text-primary">生日</label>
                  <input
                    v-model="form.birthday"
                    type="date"
                    class="w-full rounded-lg border border-black/10 bg-black/5 px-3 py-2.5 text-primary focus:outline-none focus:ring-2 focus:ring-primary dark:border-white/10 dark:bg-white/5 dark:focus:ring-secondary"
                  />
                </div>
              </div>

              <div>
                <label class="mb-2 block text-sm font-bold text-primary">所在地</label>
                <select
                  v-model="form.location"
                  class="w-full rounded-lg border border-black/10 bg-black/5 px-3 py-2.5 text-primary focus:outline-none focus:ring-2 focus:ring-primary dark:border-white/10 dark:bg-white/5 dark:focus:ring-secondary"
                >
                  <option value="">请选择地区</option>
                  <optgroup
                    v-for="group in locationGroups"
                    :key="group.label"
                    :label="group.label"
                  >
                    <option v-for="option in group.options" :key="option" :value="option">{{ option }}</option>
                  </optgroup>
                </select>
              </div>
            </div>

            <div class="space-y-4">
              <div class="rounded-2xl border border-black/5 bg-neutral p-5 dark:border-white/5">
                <p class="text-sm font-bold text-primary">账号概览</p>
                <div class="mt-4 space-y-3 text-sm text-primary">
                  <div class="flex items-center justify-between rounded-xl bg-black/5 px-4 py-3 dark:bg-white/5">
                    <span class="text-tertiary">用户 UID</span>
                    <span class="font-bold">{{ displayUid }}</span>
                  </div>
                  <div class="flex items-center justify-between rounded-xl bg-black/5 px-4 py-3 dark:bg-white/5">
                    <span class="text-tertiary">邮分</span>
                    <span class="font-bold">{{ userInfo?.coins ?? 0 }}</span>
                  </div>
                  <div class="flex items-center justify-between rounded-xl bg-black/5 px-4 py-3 dark:bg-white/5">
                    <span class="text-tertiary">VIP</span>
                    <span class="font-bold">{{ userInfo?.vipLevel || '--' }}</span>
                  </div>
                </div>
              </div>

              <div class="rounded-2xl border border-black/5 bg-neutral p-5 dark:border-white/5">
                <p class="text-sm font-bold text-primary">数据统计</p>
                <div class="mt-4 grid grid-cols-3 gap-3">
                  <div class="rounded-xl bg-black/5 p-4 text-center dark:bg-white/5">
                    <p class="text-2xl font-bold text-secondary">{{ stats.sent }}</p>
                    <p class="mt-1 text-xs text-tertiary">发送的明信片</p>
                  </div>
                  <div class="rounded-xl bg-black/5 p-4 text-center dark:bg-white/5">
                    <p class="text-2xl font-bold text-secondary">{{ stats.received }}</p>
                    <p class="mt-1 text-xs text-tertiary">收到的明信片</p>
                  </div>
                  <div class="rounded-xl bg-black/5 p-4 text-center dark:bg-white/5">
                    <p class="text-2xl font-bold text-secondary">{{ stats.likes }}</p>
                    <p class="mt-1 text-xs text-tertiary">获得的点赞</p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>

    <input
      ref="avatarInput"
      type="file"
      accept="image/png,image/jpeg,image/gif,image/webp"
      class="hidden"
      @change="handleAvatarChange"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { ChevronLeft, Camera, PenLine } from 'lucide-vue-next';
import { ElMessage } from 'element-plus';
import { useRouter } from 'vue-router';
import { getProfile, getUserStats, updateProfile, uploadAvatar } from '../api/user.js';
import { assetBaseURL } from '../utils/request.js';
import { useUser } from '../store/user';

const DEFAULT_AVATAR = 'https://lh3.googleusercontent.com/aida-public/AB6AXuBYArdRu7qlNp4cuo06XFR6gjYC0xtUePbpepRVZFPb60NLBx_VR9amuEGGGmcgoSJxZnTSvk-qC-pT40C1BcNky-vgDMQS81oXbUZ1ZhPGx8TyP5kDLnK2UxXs44i4R9b0C6J2F0AegR2bJ6baLYqRUydE5fXGJMLngQf9plW3-BdtpO6Gnq5BWbM5Y8_ZXBxCkBcu_AycBYRNspo0GmyLKNOwz7WDP8qJiBl97glqeE0pFejorxYMHYxFqX9mdXogSMmgx3TMR9IR';

const router = useRouter();
const { userInfo, updateUser } = useUser();

const genderOptions = ['保密', '男', '女'];
const locationGroups = [
  { label: '直辖市', options: ['北京', '天津', '上海', '重庆'] },
  {
    label: '省份',
    options: [
      '河北省', '山西省', '辽宁省', '吉林省', '黑龙江省', '江苏省', '浙江省', '安徽省', '福建省', '江西省',
      '山东省', '河南省', '湖北省', '湖南省', '广东省', '海南省', '四川省', '贵州省', '云南省', '陕西省',
      '甘肃省', '青海省', '台湾省',
    ],
  },
  { label: '自治区', options: ['内蒙古自治区', '广西壮族自治区', '西藏自治区', '宁夏回族自治区', '新疆维吾尔自治区'] },
  { label: '特别行政区', options: ['香港特别行政区', '澳门特别行政区'] },
];

const nicknameInput = ref<HTMLInputElement | null>(null);
const avatarInput = ref<HTMLInputElement | null>(null);
const isLoading = ref(true);
const isSaving = ref(false);
const isUploading = ref(false);
const stats = ref({ sent: 0, received: 0, likes: 0 });
const form = ref({
  username: '',
  email: '',
  gender: '保密',
  birthday: '',
  location: '',
});

const getErrorMessage = (error: unknown, fallback: string) => {
  const responseMessage = (error as { response?: { data?: { message?: string } } })?.response?.data?.message;
  const defaultMessage = error instanceof Error ? error.message : '';
  return responseMessage || defaultMessage || fallback;
};

const normalizeDate = (value?: string | null) => (value ? String(value).slice(0, 10) : '');

const resolveAssetUrl = (url?: string | null) => {
  if (!url) return DEFAULT_AVATAR;
  if (/^(https?:)?\/\//.test(url) || url.startsWith('data:')) return url;
  return `${assetBaseURL}${url.startsWith('/') ? url : `/${url}`}`;
};

const avatarUrl = computed(() => resolveAssetUrl(userInfo.value?.avatar));
const displayName = computed(() => form.value.username || userInfo.value?.username || 'Blank 用户');
const displayUid = computed(() => userInfo.value?.uid || '--');

const applyProfile = (profile: Record<string, any>) => {
  form.value = {
    username: profile.username || '',
    email: profile.email || '',
    gender: profile.gender || '保密',
    birthday: normalizeDate(profile.birthday),
    location: profile.location || '',
  };
  updateUser({
    ...profile,
    birthday: normalizeDate(profile.birthday),
  });
};

const loadData = async () => {
  isLoading.value = true;
  try {
    const [profileResult, statsResult] = await Promise.all([getProfile(), getUserStats()]);
    applyProfile(profileResult.data || {});
    stats.value = {
      sent: statsResult.data?.sent ?? 0,
      received: statsResult.data?.received ?? 0,
      likes: statsResult.data?.likes ?? 0,
    };
  } catch (error) {
    ElMessage.error(getErrorMessage(error, '获取个人资料失败'));
  } finally {
    isLoading.value = false;
  }
};

const focusNickname = () => {
  nicknameInput.value?.focus();
};

const triggerAvatarUpload = () => {
  avatarInput.value?.click();
};

const handleAvatarChange = async (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0];
  if (!file) return;

  isUploading.value = true;
  try {
    const result = await uploadAvatar(file);
    updateUser({ avatar: result.data?.avatar || '' });
    ElMessage.success(result.message || '头像更新成功');
  } catch (error) {
    ElMessage.error(getErrorMessage(error, '头像上传失败'));
  } finally {
    isUploading.value = false;
    if (avatarInput.value) {
      avatarInput.value.value = '';
    }
  }
};

const saveProfile = async () => {
  if (!form.value.username.trim()) {
    ElMessage.warning('请输入昵称');
    return;
  }

  isSaving.value = true;
  try {
    const payload = {
      username: form.value.username.trim(),
      gender: form.value.gender,
      birthday: form.value.birthday || null,
      location: form.value.location,
    };
    const result = await updateProfile(payload);
    updateUser(payload);
    ElMessage.success(result.message || '资料更新成功');
  } catch (error) {
    ElMessage.error(getErrorMessage(error, '资料更新失败'));
  } finally {
    isSaving.value = false;
  }
};

onMounted(() => {
  loadData();
});
</script>
