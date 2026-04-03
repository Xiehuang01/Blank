import { ref, computed } from 'vue';

const checkInState = ref({
  lastCheckInDate: localStorage.getItem('lastCheckInDate') || '',
});

export const useCheckIn = () => {
  const isCheckedInToday = computed(() => {
    const today = new Date().toDateString();
    return checkInState.value.lastCheckInDate === today;
  });

  const doCheckIn = () => {
    const today = new Date().toDateString();
    checkInState.value.lastCheckInDate = today;
    localStorage.setItem('lastCheckInDate', today);
  };

  return {
    isCheckedInToday,
    doCheckIn
  };
};
