import { ref, computed } from 'vue';

const BUSINESS_TIME_ZONE = 'Asia/Shanghai';
const businessDateFormatter = new Intl.DateTimeFormat('zh-CN', {
  timeZone: BUSINESS_TIME_ZONE,
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
});

const getBusinessDateString = (date = new Date()) => {
  const parts = businessDateFormatter.formatToParts(date);
  const year = parts.find((part) => part.type === 'year')?.value || '0000';
  const month = parts.find((part) => part.type === 'month')?.value || '00';
  const day = parts.find((part) => part.type === 'day')?.value || '00';
  return `${year}-${month}-${day}`;
};

const isLegacyTodayString = (value: string) => value === new Date().toDateString();

const checkInState = ref({
  lastCheckInDate: localStorage.getItem('lastCheckInDate') || '',
});

export const useCheckIn = () => {
  const isCheckedInToday = computed(() => {
    const today = getBusinessDateString();
    return checkInState.value.lastCheckInDate === today || isLegacyTodayString(checkInState.value.lastCheckInDate);
  });

  const doCheckIn = () => {
    const today = getBusinessDateString();
    checkInState.value.lastCheckInDate = today;
    localStorage.setItem('lastCheckInDate', today);
  };

  return {
    isCheckedInToday,
    doCheckIn
  };
};

