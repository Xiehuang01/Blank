import { computed, ref } from 'vue';
import { getPendingRequests } from '../api/friend.js';
import { getUnreadCount } from '../api/notification.js';
import { getInboxPostcards } from '../api/postcard.js';
import { useUser } from './user';

const hasUnreadInbox = ref(false);
const unreadNotifCount = ref(0);
const pendingRequestCount = ref(0);
let refreshMailAlertRequestId = 0;

const getLastInboxCheckAt = () => Number(localStorage.getItem('mail_last_inbox_check_at') || 0);

const syncMailAlertState = (payload: {
  hasUnreadInbox?: boolean;
  unreadNotifCount?: number;
  pendingRequestCount?: number;
}) => {
  if (typeof payload.hasUnreadInbox === 'boolean') {
    hasUnreadInbox.value = payload.hasUnreadInbox;
  }
  if (typeof payload.unreadNotifCount === 'number') {
    unreadNotifCount.value = Math.max(0, payload.unreadNotifCount);
  }
  if (typeof payload.pendingRequestCount === 'number') {
    pendingRequestCount.value = Math.max(0, payload.pendingRequestCount);
  }
};

const clearMailAlertState = () => {
  hasUnreadInbox.value = false;
  unreadNotifCount.value = 0;
  pendingRequestCount.value = 0;
};

const refreshMailAlertState = async () => {
  const { isLoggedIn } = useUser();
  if (!isLoggedIn.value) {
    clearMailAlertState();
    return;
  }

  const requestId = ++refreshMailAlertRequestId;

  try {
    const [inboxRes, unreadCountRes, pendingRes] = await Promise.all([
      getInboxPostcards({ page: 1, pageSize: 200 }),
      getUnreadCount(),
      getPendingRequests(),
    ]);

    if (requestId !== refreshMailAlertRequestId) return;

    const lastInboxCheckAt = getLastInboxCheckAt();
    const inboxList = inboxRes.data?.list || [];

    syncMailAlertState({
      hasUnreadInbox: inboxList.some((card: any) => new Date(card?.createdAt || 0).getTime() > lastInboxCheckAt),
      unreadNotifCount: Number(unreadCountRes.data?.count) || 0,
      pendingRequestCount: Array.isArray(pendingRes.data) ? pendingRes.data.length : 0,
    });
  } catch {
    if (requestId !== refreshMailAlertRequestId) return;
  }
};

const hasMailAlert = computed(() => {
  return hasUnreadInbox.value || unreadNotifCount.value > 0 || pendingRequestCount.value > 0;
});

export const useMailAlert = () => ({
  hasUnreadInbox,
  unreadNotifCount,
  pendingRequestCount,
  hasMailAlert,
  syncMailAlertState,
  refreshMailAlertState,
  clearMailAlertState,
});
