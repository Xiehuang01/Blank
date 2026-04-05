import { ref, computed } from 'vue';
import { getToken, removeToken, setToken } from '../utils/request.js';
import { logout as apiLogout } from '../api/auth.js';

const USER_STORAGE_KEY = 'user';

// 用户信息接口
export interface UserInfo {
  id?: number;
  uid?: string;
  username?: string;
  email?: string;
  avatar?: string;
  vipLevel?: string;
  coins?: number;
  gender?: string;
  birthday?: string;
  location?: string;
  profileVisibility?: string;
  createdAt?: string;
  rememberMe?: boolean;
}

// 用户状态
const userInfo = ref<UserInfo | null>(null);
const isLoggedIn = computed(() => !!userInfo.value && !!getToken());

const clearLocalAuthState = () => {
  userInfo.value = null;
  localStorage.removeItem(USER_STORAGE_KEY);
  removeToken();
};

// 初始化用户信息（从localStorage读取）
const initUser = () => {
  const storedUser = localStorage.getItem(USER_STORAGE_KEY);
  const token = getToken();

  if (!storedUser || !token) {
    clearLocalAuthState();
    return;
  }

  try {
    userInfo.value = JSON.parse(storedUser);
  } catch (error) {
    console.error('Failed to parse user info:', error);
    clearLocalAuthState();
  }
};

// 登录（保存 token + 用户信息）
const login = (user: UserInfo, token?: string) => {
  if (token) {
    setToken(token);
  }
  userInfo.value = user;
  localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
};

// 退出登录
const logout = async () => {
  try {
    if (getToken()) {
      await apiLogout();
    }
  } catch (err) {
    console.warn('Logout API error:', err);
  } finally {
    clearLocalAuthState();
  }
};

// 更新用户信息
const updateUser = (updates: Partial<UserInfo>) => {
  userInfo.value = {
    ...(userInfo.value || {}),
    ...updates,
  };
  localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userInfo.value));
};

const clearUser = () => {
  clearLocalAuthState();
};

// 导出用户store
export const useUser = () => {
  if (userInfo.value === null) {
    initUser();
  }

  return {
    userInfo,
    isLoggedIn,
    login,
    logout,
    updateUser,
    clearUser,
  };
};
