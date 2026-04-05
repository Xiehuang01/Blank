import axios from 'axios';
import { ref } from 'vue';

const TOKEN_KEY = 'blank_token';
const USER_KEY = 'user';

export const baseURL = import.meta.env.MODE === 'production'
  ? '/api'
  : 'http://localhost:3001/api';
export const assetBaseURL = baseURL.endsWith('/api') ? baseURL.slice(0, -4) : baseURL;


export const getToken = () => localStorage.getItem(TOKEN_KEY);

export const setToken = (token) => {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
  }
};

export const removeToken = () => {
  localStorage.removeItem(TOKEN_KEY);
};

export const clearAuthState = () => {
  removeToken();
  localStorage.removeItem(USER_KEY);
};

const request = axios.create({
  baseURL,
  timeout: 10000,
});

export const pendingRequestCount = ref(0);

const shouldTrackLoading = (config) => !(config?.skipGlobalLoading || config?.headers?.['x-skip-global-loading']);

const increasePending = () => {
  pendingRequestCount.value += 1;
};

const decreasePending = () => {
  pendingRequestCount.value = Math.max(0, pendingRequestCount.value - 1);
};

request.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }

    if (shouldTrackLoading(config)) {
      config.__trackGlobalLoading = true;
      increasePending();
    }

    return config;
  },
  (error) => Promise.reject(error)
);

request.interceptors.response.use(
  (response) => {
    if (response.config?.__trackGlobalLoading) {
      decreasePending();
    }

    const responseData = response.data;

    if (responseData?.code === 0) {
      return responseData;
    }

    const businessError = new Error(responseData?.message || '请求失败');
    businessError.response = response;
    businessError.data = responseData;
    return Promise.reject(businessError);
  },
  (error) => {
    if (error.config?.__trackGlobalLoading) {
      decreasePending();
    }

    if (error.response?.status === 401) {
      clearAuthState();
      if (!window.location.pathname.startsWith('/login')) {
        const redirect = `${window.location.pathname}${window.location.search}${window.location.hash}`;
        window.location.href = `/login?redirect=${encodeURIComponent(redirect)}`;
      }
    }
    return Promise.reject(error);
  }
);

export default request;
