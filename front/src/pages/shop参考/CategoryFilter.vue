<script setup lang="ts">
import { ref, watch } from 'vue';
import AnimatedTabs from './ui/AnimatedTabs.vue';

const props = defineProps<{
  modelValue: string;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void;
}>();

// 统一管理商城的分类定义
const categories = [
  { label: '全部' },
  { label: '名胜' },
  { label: '古迹' },
  { label: '现代' },
  { label: '世界' }
];

// 使用本地 ref 同步 props，方便 AnimatedTabs 处理
const activeTab = ref(props.modelValue);

watch(() => props.modelValue, (newVal) => {
  activeTab.value = newVal;
});

watch(activeTab, (newVal) => {
  emit('update:modelValue', newVal);
});
</script>

<template>
  <div class="category-filter-wrapper">
    <AnimatedTabs 
      v-model="activeTab"
      :tabs="categories"
    />
  </div>
</template>

<style scoped>
.category-filter-wrapper {
  width: 100%;
  display: flex;
  justify-content: center;
}
</style>
