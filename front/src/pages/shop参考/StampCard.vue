<template>
  <div class="stamp-card">
    <div class="image-container">
      <div class="image-wrapper">
        <img :src="stamp.image" :alt="stamp.name" referrerPolicy="no-referrer" />
      </div>
    </div>
    
    <div class="content">
      <h3 class="name">{{ stamp.name }}</h3>
      <p class="description">{{ stamp.description }}</p>
      
      <div class="price-row">
        <span class="price">
          <span class="amount">{{ stamp.price }}</span>
          <span class="unit">邮分</span>
        </span>
      </div>
      
      <div class="action-row">
        <div class="quantity-selector">
          <button @click="quantity > 1 && quantity--" :disabled="quantity <= 1">-</button>
          <span class="quantity">{{ quantity }}</span>
          <button @click="quantity++">+</button>
        </div>
        <button class="buy-btn" @click="handleBuy">购入</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useStampStore } from '@/store/stamp';
import { ElMessage } from 'element-plus';

const props = defineProps<{
  stamp: {
    id: number;
    name: string;
    description: string;
    image: string;
    price: number;
  }
}>();

const store = useStampStore();
const quantity = ref(1);

const handleBuy = () => {
  const success = store.buyStamp(props.stamp);
  if (success) {
    ElMessage({
      message: `成功购入 ${props.stamp.name}`,
      type: 'success',
      plain: true,
    });
  } else {
    ElMessage({
      message: '邮分不足',
      type: 'warning',
      plain: true,
    });
  }
};
</script>

<style lang="less" scoped>
.stamp-card {
  background-color: var(--card-bg);
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.04);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  display: flex;
  flex-direction: column;

  &:hover {
    transform: translateY(-4px) scale(1.02);
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08);
  }

  .image-container {
    background-color: #d9d9d9;
    padding: 16px;
    aspect-ratio: 1;
    display: flex;
    align-items: center;
    justify-content: center;

    .image-wrapper {
      width: 100%;
      height: 100%;
      background-color: #fff;
      padding: 8px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
      display: flex;
      align-items: center;
      justify-content: center;

      img {
        max-width: 100%;
        max-height: 100%;
        object-fit: contain;
      }
    }
  }

  .content {
    padding: 16px;
    display: flex;
    flex-direction: column;
    gap: 8px;

    .name {
      font-size: 16px;
      font-weight: 600;
      margin: 0;
      color: var(--text-color);
    }

    .description {
      font-size: 12px;
      color: var(--text-light);
      margin: 0;
      line-height: 1.4;
    }

    .price-row {
      margin-top: 4px;
      .price {
        color: var(--primary-color);
        font-weight: 600;
        
        .amount {
          font-size: 18px;
          margin-right: 4px;
        }
        .unit {
          font-size: 12px;
        }
      }
    }

    .action-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-top: 8px;
      gap: 12px;
    }

    .quantity-selector {
      display: flex;
      align-items: center;
      background-color: #f5f5f5;
      border-radius: 4px;
      padding: 2px;

      button {
        background: none;
        border: none;
        width: 24px;
        height: 24px;
        cursor: pointer;
        color: var(--text-light);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 16px;

        &:disabled {
          opacity: 0.3;
          cursor: not-allowed;
        }
      }

      .quantity {
        width: 24px;
        text-align: center;
        font-size: 13px;
        color: var(--text-color);
      }
    }

    .buy-btn {
      flex: 1;
      background-color: var(--primary-color);
      color: white;
      border: none;
      border-radius: 6px;
      height: 32px;
      font-size: 14px;
      font-weight: 500;
      cursor: pointer;
      transition: opacity 0.2s;

      &:hover {
        opacity: 0.9;
      }

      &:active {
        transform: scale(0.98);
      }
    }
  }
}
</style>
