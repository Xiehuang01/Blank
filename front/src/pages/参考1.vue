<template>
    <div
      class="absolute inline-block"
      :style="{
        left: `${element.x}px`,
        top: `${element.y}px`,
        transform: `rotate(${element.rotation || 0}deg) scale(${element.scale})`,
        zIndex: element.zIndex,
        transformOrigin: 'top left',
      }"
      @mousedown.stop="startDrag"
      @touchstart.stop="startDrag"
      @click.stop="$emit('select')"
    >
      <!-- Content -->
      <div
        :class="[
          'relative group',
          isActive ? 'ring-2 ring-primary dark:ring-white ring-dashed' : ''
        ]"
      >
        <!-- Text Element -->
        <div
          v-if="element.type === 'text'"
          class="min-w-[50px] min-h-[30px] p-2 outline-none whitespace-pre-wrap cursor-move"
          :class="{ 'cursor-text': isEditing }"
          :style="{
            fontFamily: element.fontFamily,
            fontSize: `${element.fontSize}px`,
            fontWeight: element.fontWeight,
            fontStyle: element.fontStyle,
            writingMode: element.writingMode,
            color: 'inherit'
          }"
          :contenteditable="isEditing"
          @dblclick="enableEdit"
          @input="onInput"
          @blur="onBlur"
          ref="textRef"
        ></div>
  
        <!-- Sticker Element -->
        <img
          v-else-if="element.type === 'sticker'"
          :src="element.src"
          class="w-24 h-24 object-contain pointer-events-none"
        />
  
        <!-- Rotate Handle -->
        <div
          v-if="isActive"
          class="absolute -top-10 left-1/2 -translate-x-1/2 w-6 h-6 bg-white dark:bg-neutral border border-primary dark:border-white rounded-full flex items-center justify-center cursor-crosshair shadow-sm"
          @mousedown.stop="startRotate"
          @touchstart.stop="startRotate"
        >
          <RotateCw class="w-3 h-3 text-primary dark:text-white" />
        </div>
  
        <!-- Scale Handle -->
        <div
          v-if="isActive"
          class="absolute -bottom-3 -right-3 w-6 h-6 bg-white dark:bg-neutral border border-primary dark:border-white rounded-full flex items-center justify-center cursor-se-resize shadow-sm"
          @mousedown.stop="startScale"
          @touchstart.stop="startScale"
        >
          <div class="w-2 h-2 bg-primary dark:bg-white rounded-full"></div>
        </div>
  
        <!-- Action Buttons (Right Side) -->
        <div
          v-if="isActive"
          class="absolute top-0 -right-12 flex flex-col gap-2"
        >
          <button
            @click.stop="$emit('moveUp')"
            class="w-8 h-8 bg-white dark:bg-neutral border border-black/10 dark:border-white/10 rounded-full flex items-center justify-center shadow-sm text-tertiary hover:text-primary dark:hover:text-white"
          >
            <ArrowUp class="w-4 h-4" />
          </button>
          <button
            @click.stop="$emit('moveDown')"
            class="w-8 h-8 bg-white dark:bg-neutral border border-black/10 dark:border-white/10 rounded-full flex items-center justify-center shadow-sm text-tertiary hover:text-primary dark:hover:text-white"
          >
            <ArrowDown class="w-4 h-4" />
          </button>
          <button
            @click.stop="$emit('delete')"
            class="w-8 h-8 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-full flex items-center justify-center shadow-sm text-red-500 hover:text-red-600 dark:text-red-400"
          >
            <Trash2 class="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted, watch, nextTick } from 'vue';
  import { ArrowUp, ArrowDown, Trash2, RotateCw } from 'lucide-vue-next';
  
  const props = defineProps<{
    element: any;
    isActive: boolean;
  }>();
  
  const emit = defineEmits(['update', 'select', 'delete', 'moveUp', 'moveDown']);
  
  const textRef = ref<HTMLElement | null>(null);
  const isEditing = ref(false);
  
  // Sync content to editable div initially
  onMounted(() => {
    if (props.element.type === 'text' && textRef.value) {
      textRef.value.innerText = props.element.content || '';
    }
  });
  
  watch(() => props.element.content, (newContent) => {
    if (props.element.type === 'text' && textRef.value && !isEditing.value) {
      if (textRef.value.innerText !== newContent) {
        textRef.value.innerText = newContent || '';
      }
    }
  });
  
  watch(() => props.isActive, (newVal) => {
    if (!newVal) {
      isEditing.value = false;
    }
  });
  
  const enableEdit = () => {
    if (props.element.type === 'text') {
      isEditing.value = true;
      nextTick(() => {
        textRef.value?.focus();
      });
    }
  };
  
  const onInput = (e: Event) => {
    const target = e.target as HTMLElement;
    emit('update', { ...props.element, content: target.innerText });
  };
  
  const onBlur = (e: Event) => {
    isEditing.value = false;
    const target = e.target as HTMLElement;
    emit('update', { ...props.element, content: target.innerText });
  };
  
  // Dragging Logic
  let isDragging = false;
  let startX = 0;
  let startY = 0;
  let initialX = 0;
  let initialY = 0;
  
  const startDrag = (e: MouseEvent | TouchEvent) => {
    if (isEditing.value) return; // Don't drag if actively editing text
    e.preventDefault();
    isDragging = true;
    emit('select');
  
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
  
    startX = clientX;
    startY = clientY;
    initialX = props.element.x;
    initialY = props.element.y;
  
    document.addEventListener('mousemove', onDrag);
    document.addEventListener('touchmove', onDrag, { passive: false });
    document.addEventListener('mouseup', stopDrag);
    document.addEventListener('touchend', stopDrag);
  };
  
  const onDrag = (e: MouseEvent | TouchEvent) => {
    if (!isDragging) return;
    e.preventDefault();
  
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
  
    const dx = clientX - startX;
    const dy = clientY - startY;
  
    emit('update', {
      ...props.element,
      x: initialX + dx,
      y: initialY + dy,
    });
  };
  
  const stopDrag = () => {
    isDragging = false;
    document.removeEventListener('mousemove', onDrag);
    document.removeEventListener('touchmove', onDrag);
    document.removeEventListener('mouseup', stopDrag);
    document.removeEventListener('touchend', stopDrag);
  };
  
  // Scaling Logic
  let isScaling = false;
  let initialScale = 1;
  let startScaleX = 0;
  
  const startScale = (e: MouseEvent | TouchEvent) => {
    e.preventDefault();
    isScaling = true;
  
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    startScaleX = clientX;
    initialScale = props.element.scale || 1;
  
    document.addEventListener('mousemove', onScale);
    document.addEventListener('touchmove', onScale, { passive: false });
    document.addEventListener('mouseup', stopScale);
    document.addEventListener('touchend', stopScale);
  };
  
  const onScale = (e: MouseEvent | TouchEvent) => {
    if (!isScaling) return;
    e.preventDefault();
  
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const dx = clientX - startScaleX;
    
    // Simple scaling based on horizontal movement
    const scaleFactor = 1 + (dx / 100);
    const newScale = Math.max(0.5, Math.min(5, initialScale * scaleFactor));
  
    emit('update', {
      ...props.element,
      scale: newScale,
    });
  };
  
  const stopScale = () => {
    isScaling = false;
    document.removeEventListener('mousemove', onScale);
    document.removeEventListener('touchmove', onScale);
    document.removeEventListener('mouseup', stopScale);
    document.removeEventListener('touchend', stopScale);
  };
  
  // Rotation Logic
  let isRotating = false;
  let startAngle = 0;
  let initialRotation = 0;
  let centerX = 0;
  let centerY = 0;
  
  const startRotate = (e: MouseEvent | TouchEvent) => {
    e.preventDefault();
    isRotating = true;
  
    const target = e.target as HTMLElement;
    const elementContainer = target.closest('.absolute.inline-block') as HTMLElement;
    
    if (elementContainer) {
      const rect = elementContainer.getBoundingClientRect();
      centerX = rect.left + rect.width / 2;
      centerY = rect.top + rect.height / 2;
    }
  
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
  
    startAngle = Math.atan2(clientY - centerY, clientX - centerX) * (180 / Math.PI);
    initialRotation = props.element.rotation || 0;
  
    document.addEventListener('mousemove', onRotate);
    document.addEventListener('touchmove', onRotate, { passive: false });
    document.addEventListener('mouseup', stopRotate);
    document.addEventListener('touchend', stopRotate);
  };
  
  const onRotate = (e: MouseEvent | TouchEvent) => {
    if (!isRotating) return;
    e.preventDefault();
  
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
  
    const currentAngle = Math.atan2(clientY - centerY, clientX - centerX) * (180 / Math.PI);
    let angleDiff = currentAngle - startAngle;
  
    emit('update', {
      ...props.element,
      rotation: initialRotation + angleDiff,
    });
  };
  
  const stopRotate = () => {
    isRotating = false;
    document.removeEventListener('mousemove', onRotate);
    document.removeEventListener('touchmove', onRotate);
    document.removeEventListener('mouseup', stopRotate);
    document.removeEventListener('touchend', stopRotate);
  };
  </script>
  