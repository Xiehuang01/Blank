import { ref, computed } from 'vue';

// 用户信息接口
export interface UserInfo {
  uid?: string;
  username?: string;
  email?: string;
  avatar?: string;
  vipLevel?: string;
  coins?: number;
  rememberMe?: boolean;
}

// 用户状态
const userInfo = ref<UserInfo | null>(null);
const isLoggedIn = computed(() => userInfo.value !== null);

// 初始化用户信息（从localStorage读取）
const initUser = () => {
  const storedUser = localStorage.getItem('user');
  if (storedUser) {
    try {
      userInfo.value = JSON.parse(storedUser);
    } catch (error) {
      console.error('Failed to parse user info:', error);
      localStorage.removeItem('user');
    }
  }
};

// 登录
const login = (user: UserInfo) => {
  userInfo.value = user;
  localStorage.setItem('user', JSON.stringify(user));
};

// 退出登录
const logout = () => {
  userInfo.value = null;
  localStorage.removeItem('user');
};

// 更新用户信息
const updateUser = (updates: Partial<UserInfo>) => {
  if (userInfo.value) {
    userInfo.value = { ...userInfo.value, ...updates };
    localStorage.setItem('user', JSON.stringify(userInfo.value));
  }
};

// 导出用户store
export const useUser = () => {
  // 首次调用时初始化
  if (userInfo.value === null) {
    initUser();
  }

  return {
    userInfo,
    isLoggedIn,
    login,
    logout,
    updateUser,
  };
};
