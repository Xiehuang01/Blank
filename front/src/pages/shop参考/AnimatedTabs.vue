<script setup lang="ts">
import { ref, onMounted, watch, nextTick, onUnmounted } from 'vue';

interface Tab {
  label: string;
}

const props = defineProps<{
  tabs: Tab[];
  modelValue: string;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void;
}>();

const containerRef = ref<HTMLDivElement | null>(null);
const activeTabRef = ref<HTMLButtonElement | null>(null);
const tabsRef = ref<HTMLButtonElement[]>([]);

// Swipe/Drag state
const isDragging = ref(false);
const startX = ref(0);
const currentX = ref(0);
const dragOffset = ref(0);

const updateClipPath = (customOffset = 0) => {
  const container = containerRef.value;
  const activeTabElement = activeTabRef.value;

  if (container && activeTabElement) {
    const { offsetLeft, offsetWidth } = activeTabElement;

    // Apply the drag offset to the visual clip path
    const clipLeft = offsetLeft + customOffset;
    const clipRight = offsetLeft + offsetWidth + customOffset;

    container.style.clipPath = `inset(0 ${Number(
      100 - (clipRight / container.offsetWidth) * 100,
    ).toFixed(2)}% 0 ${Number(
      (clipLeft / container.offsetWidth) * 100,
    ).toFixed(2)}% round 9999px)`;
  }
};

watch(() => props.tabs, () => {
  tabsRef.value = [];
}, { deep: true });

watch(() => props.modelValue, async () => {
  await nextTick();
  updateClipPath();
});

onMounted(() => {
  updateClipPath();
  window.addEventListener('mousemove', handleMouseMove);
  window.addEventListener('mouseup', handleMouseUp);
  window.addEventListener('touchmove', handleTouchMove, { passive: false });
  window.addEventListener('touchend', handleTouchEnd);
});

onUnmounted(() => {
  window.removeEventListener('mousemove', handleMouseMove);
  window.removeEventListener('mouseup', handleMouseUp);
  window.removeEventListener('touchmove', handleTouchMove);
  window.removeEventListener('touchend', handleTouchEnd);
});

const setActiveTab = (label: string) => {
  emit('update:modelValue', label);
};

// Drag Logic
const handleStart = (clientX: number) => {
  isDragging.value = true;
  startX.value = clientX;
  currentX.value = clientX;
  dragOffset.value = 0;
  
  // Disable transitions during drag for immediate feedback
  if (containerRef.value) {
    containerRef.value.style.transition = 'none';
  }
};

const handleMove = (clientX: number) => {
  if (!isDragging.value) return;
  
  currentX.value = clientX;
  dragOffset.value = currentX.value - startX.value;
  
  // Update visual state immediately
  updateClipPath(dragOffset.value);
  
  // Optional: Find the closest tab while dragging and highlight it?
  // For now, we just move the clip path.
};

const handleEnd = () => {
  if (!isDragging.value) return;
  
  isDragging.value = false;
  
  // Re-enable transitions
  if (containerRef.value) {
    containerRef.value.style.transition = 'clip-path 0.25s ease';
  }

  // Find the closest tab based on current visual position
  if (activeTabRef.value && containerRef.value) {
    const currentVisualLeft = activeTabRef.value.offsetLeft + dragOffset.value;
    const currentVisualCenter = currentVisualLeft + activeTabRef.value.offsetWidth / 2;

    let closestTab = props.tabs[0];
    let minDistance = Infinity;

    tabsRef.value.forEach((tabEl, index) => {
      if (tabEl) {
        const tabCenter = tabEl.offsetLeft + tabEl.offsetWidth / 2;
        const distance = Math.abs(currentVisualCenter - tabCenter);
        if (distance < minDistance) {
          minDistance = distance;
          closestTab = props.tabs[index];
        }
      }
    });

    if (closestTab.label === props.modelValue) {
      updateClipPath();
    } else {
      setActiveTab(closestTab.label);
    }
  } else {
    updateClipPath();
  }
  
  dragOffset.value = 0;
};

// Event Handlers
const onMouseDown = (e: MouseEvent) => handleStart(e.clientX);
const handleMouseMove = (e: MouseEvent) => handleMove(e.clientX);
const handleMouseUp = () => handleEnd();

const onTouchStart = (e: TouchEvent) => handleStart(e.touches[0].clientX);
const handleTouchMove = (e: TouchEvent) => {
  if (isDragging.value) {
    e.preventDefault(); // Prevent scrolling while swiping tabs
    handleMove(e.touches[0].clientX);
  }
};
const handleTouchEnd = () => handleEnd();

</script>

<template>
  <div 
    class="relative bg-secondary/50 border border-primary/10 mx-auto flex w-fit flex-col items-center rounded-full py-2 select-none touch-none"
    @mousedown="onMouseDown"
    @touchstart="onTouchStart"
  >
    <!-- Active Layer (Clipped) -->
    <div
      ref="containerRef"
      class="absolute inset-0 z-10 w-full overflow-hidden pointer-events-none"
      style="clip-path: inset(0px 75% 0px 0% round 9999px); transition: clip-path 0.25s ease;"
    >
      <div class="relative flex w-full justify-center bg-primary px-4 py-2">
        <button
          v-for="(tab, index) in tabs"
          :key="index"
          class="flex h-8 items-center rounded-full p-3 text-sm font-medium text-primary-foreground whitespace-nowrap"
          tabindex="-1"
        >
          {{ tab.label }}
        </button>
      </div>
    </div>

    <!-- Background Layer -->
    <div class="relative flex w-full justify-center px-4">
      <button
        v-for="(tab, index) in tabs"
        :key="index"
        :ref="(el) => { 
          if (el) tabsRef[index] = el as HTMLButtonElement;
          if (modelValue === tab.label) activeTabRef = el as HTMLButtonElement;
        }"
        @click="setActiveTab(tab.label)"
        class="flex h-8 items-center cursor-pointer rounded-full p-3 text-sm font-medium text-muted-foreground whitespace-nowrap transition-colors hover:text-primary"
      >
        {{ tab.label }}
      </button>
    </div>
  </div>
</template>

<style scoped>
.select-none {
  user-select: none;
}
</style>
