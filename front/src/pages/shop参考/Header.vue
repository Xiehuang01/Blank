<template>
  <header class="header">
    <div class="header-left">
      <button class="backpack-btn" @click="$emit('toggle-backpack')">
        <Package class="icon" :size="24" />
      </button>
      <div class="search-container">
        <Search class="search-icon" :size="16" />
        <input 
          type="text" 
          placeholder="搜索邮票..." 
          class="search-input" 
          v-model="store.searchQuery"
        />
      </div>
    </div>
    
    <h1 class="title">邮票商店 / Stamp Store</h1>
    
    <div class="header-right">
      <div class="points">
        <span class="label">邮分</span>
        <span class="value">{{ store.userPoints.toLocaleString() }}</span>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { Package, Search } from 'lucide-vue-next';
import { useStampStore } from '@/store/stamp';

const store = useStampStore();
defineEmits(['toggle-backpack']);
</script>

<style lang="less" scoped>
.header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 64px;
  background-color: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  z-index: 100;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);

  .header-left {
    display: flex;
    align-items: center;
    gap: 16px;
    flex: 1;
  }

  .backpack-btn {
    background: none;
    border: none;
    cursor: pointer;
    color: var(--text-color);
    padding: 8px;
    border-radius: 50%;
    transition: background 0.2s;
    display: flex;
    align-items: center;
    justify-content: center;

    &:hover {
      background-color: rgba(0, 0, 0, 0.05);
    }
  }

  .search-container {
    position: relative;
    display: flex;
    align-items: center;
    background-color: rgba(0, 0, 0, 0.03);
    border-radius: 20px;
    padding: 0 12px;
    width: 200px;
    height: 32px;

    @media (max-width: 640px) {
      display: none;
    }

    .search-icon {
      color: var(--text-light);
      margin-right: 8px;
    }

    .search-input {
      background: none;
      border: none;
      outline: none;
      font-size: 13px;
      color: var(--text-color);
      width: 100%;

      &::placeholder {
        color: var(--text-light);
      }
    }
  }

  .title {
    font-size: 18px;
    font-weight: 500;
    letter-spacing: 2px;
    color: var(--text-color);
    margin: 0;
    text-align: center;
    flex: 1;

    @media (max-width: 640px) {
      font-size: 16px;
    }
  }

  .header-right {
    flex: 1;
    display: flex;
    justify-content: flex-end;
  }

  .points {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 14px;

    .label {
      color: var(--primary-color);
      font-weight: 500;
    }

    .value {
      font-weight: 600;
      color: var(--text-color);
    }
  }
}
</style>
