<template>
    <div class="min-h-screen bg-background flex flex-col">
      <!-- Mobile Header -->
      <header class="md:hidden fixed top-0 left-0 right-0 z-50 flex items-center justify-between w-full px-4 h-16 bg-white dark:bg-neutral border-b border-black/5 dark:border-white/5">
        <button @click="$router.back()" class="text-primary hover:text-secondary transition-colors">
          <ChevronLeft class="w-6 h-6" />
        </button>
        <h1 class="font-headline text-lg font-bold text-primary truncate">创建明信片</h1>
        <button class="text-primary font-medium text-sm">发布</button>
      </header>
  
      <!-- Desktop Header -->
      <header class="hidden md:flex sticky top-0 z-40 items-center justify-between w-full px-6 h-16 bg-white dark:bg-neutral border-b border-black/5 dark:border-white/5">
        <div class="flex items-center gap-4">
          <button @click="$router.back()" class="text-primary hover:text-secondary transition-colors">
            <ChevronLeft class="w-6 h-6" />
          </button>
          <h1 class="font-headline text-xl font-bold text-primary">创建明信片</h1>
        </div>
        <button class="bg-primary text-white px-6 py-2 rounded-full font-medium hover:bg-primary/90 transition-colors">发布</button>
      </header>
  
      <!-- Main Layout -->
      <main class="flex-1 flex flex-col md:flex-row w-full max-w-7xl mx-auto pt-20 md:pt-8 pb-32 md:pb-8 px-4 md:px-6 gap-8" @click.self="clearSelection">
        
        <!-- Canvas Area (Left/Center) -->
        <div class="flex-1 flex flex-col gap-8 items-center justify-start overflow-y-auto pb-8" @click.self="clearSelection">
          
          <!-- Front Cover -->
          <div class="w-full max-w-2xl bg-white dark:bg-neutral p-3 sm:p-4 rounded-sm shadow-sm border border-black/5 dark:border-white/5 shrink-0">
            <div
              class="w-full bg-black/5 dark:bg-white/5 aspect-[3/2] relative overflow-hidden flex items-center justify-center cursor-pointer"
              @click="triggerUpload"
            >
          <input
            type="file"
            ref="fileInput"
            class="hidden"
            accept="image/*"
            @change="handleImageUpload"
            capture="environment"
          />
          <img
            v-if="coverImage"
            :src="coverImage"
            class="w-full h-full object-cover"
          />
          <div v-else class="text-tertiary flex flex-col items-center gap-2">
            <span class="text-sm">点击+号添加图片</span>
          </div>
          <button
            v-if="!coverImage"
            class="absolute bottom-4 right-4 w-12 h-12 bg-secondary text-white rounded-full flex items-center justify-center shadow-lg hover:bg-secondary/90 transition-colors"
          >
            <Plus class="w-6 h-6" />
          </button>
            </div>
          </div>
  
          <!-- Back Cover (Postcard) -->
        <div
          class="w-full max-w-2xl bg-white dark:bg-neutral rounded-sm shadow-sm border border-black/5 dark:border-white/5 aspect-[3/2] relative flex flex-col shrink-0"
          ref="postcardRef"
          @click.self="clearSelection"
        >
          <!-- Postcard Background Lines -->
          <div class="absolute inset-0 pointer-events-none flex p-4 sm:p-6">
            <!-- Left Side -->
            <div
              class="flex-1 border-r border-black/10 dark:border-white/10 pr-4 sm:pr-6 flex flex-col"
            >
              <h2
                class="font-headline text-xl sm:text-2xl text-primary dark:text-white/80 tracking-widest mb-4 sm:mb-6"
              >
                POSTCARD
              </h2>
              <div class="flex-1 flex flex-col justify-between py-2">
                <div
                  v-for="i in 6"
                  :key="i"
                  class="border-b border-black/10 dark:border-white/10 h-6 sm:h-8"
                ></div>
              </div>
            </div>
            <!-- Right Side -->
            <div class="flex-1 pl-4 sm:pl-6 flex flex-col relative">
              <!-- Stamp Area -->
              <div
                class="absolute top-0 right-0 w-16 h-20 sm:w-20 sm:h-24 border-2 border-dashed border-black/20 dark:border-white/20 flex items-center justify-center cursor-pointer hover:bg-black/5 dark:hover:bg-white/5 transition-colors pointer-events-auto"
                @click="showStampModal = true"
              >
                <img
                  v-if="selectedStamp"
                  :src="selectedStamp"
                  class="w-full h-full object-cover p-1"
                />
                <span v-else class="text-[10px] sm:text-xs text-tertiary">邮票</span>
              </div>
              <div class="mt-auto flex flex-col gap-3 sm:gap-4">
                <div class="flex items-end gap-2">
                  <span class="text-[10px] sm:text-xs text-tertiary">to:</span>
                  <div
                    class="flex-1 border-b border-black/10 dark:border-white/10 h-5 sm:h-6"
                  ></div>
                </div>
                <div class="flex items-end gap-2">
                  <span class="text-[10px] sm:text-xs text-tertiary">from:</span>
                  <div
                    class="flex-1 border-b border-black/10 dark:border-white/10 h-5 sm:h-6"
                  ></div>
                </div>
              </div>
            </div>
          </div>
  
          <!-- Interactive Elements Layer -->
          <div class="absolute inset-0 z-10 pointer-events-none overflow-hidden">
            <div class="w-full h-full relative pointer-events-auto" @click.self="clearSelection">
              <DraggableElement
                v-for="element in elements"
                :key="element.id"
                :element="element"
                :isActive="activeElementId === element.id"
                @update="updateElement"
                @select="activeElementId = element.id"
                @delete="deleteElement"
                @moveUp="moveUp"
                @moveDown="moveDown"
              />
            </div>
          </div>
        </div>
        </div>
  
        <!-- Toolbar Area (Right on Desktop, Bottom on Mobile) -->
        <div class="fixed bottom-0 left-0 right-0 md:sticky md:top-24 md:w-80 shrink-0 bg-white dark:bg-neutral md:rounded-2xl shadow-[0_-4px_20px_rgba(0,0,0,0.05)] md:shadow-xl border-t md:border border-black/5 dark:border-white/5 p-4 md:p-6 flex flex-col gap-6 z-40 md:h-fit">
          <!-- Main Actions -->
          <div class="flex justify-around md:justify-start md:gap-6 items-center">
            <button
              @click="addText"
              class="flex flex-col items-center gap-1 text-tertiary hover:text-primary dark:hover:text-white"
            >
              <Type class="w-5 h-5 md:w-6 md:h-6" />
              <span class="text-[10px] md:text-xs">添加文字</span>
            </button>
            <button
              @click="showStickerModal = true"
              class="flex flex-col items-center gap-1 text-tertiary hover:text-primary dark:hover:text-white"
            >
              <Sticker class="w-5 h-5 md:w-6 md:h-6" />
              <span class="text-[10px] md:text-xs">添加贴纸</span>
            </button>
          </div>
  
          <!-- Text Formatting Toolbar (Visible only when text is selected) -->
          <div
            v-if="activeTextElement"
            class="flex flex-col gap-3 md:gap-4 border-t border-black/5 dark:border-white/5 pt-3 md:pt-4"
          >
            <div class="text-xs font-medium text-tertiary mb-1 hidden md:block">文本格式</div>
            
            <div class="flex md:flex-col gap-3 md:gap-4 overflow-x-auto pb-1 md:pb-0 hide-scrollbar">
              <!-- Font Family -->
              <select
                v-model="activeTextElement.fontFamily"
                @change="updateActiveElement"
                class="w-32 md:w-full shrink-0 text-sm bg-black/5 dark:bg-white/5 rounded-lg px-3 py-2 outline-none text-primary dark:text-white"
              >
                <option value="'Public Sans', sans-serif">默认字体</option>
                <option value="'Noto Serif SC', serif">宋体</option>
                <option value="'Ma Shan Zheng', cursive">手写体</option>
                <option value="'ZCOOL KuaiLe', cursive">快乐体</option>
                <option value="'Zhi Mang Xing', cursive">行书</option>
              </select>
              
              <!-- Font Size -->
              <div class="flex items-center gap-2 md:gap-3 bg-black/5 dark:bg-white/5 rounded-lg px-3 py-2 shrink-0">
                <span class="text-xs text-tertiary">A-</span>
                <input
                  type="range"
                  v-model.number="activeTextElement.fontSize"
                  @input="updateActiveElement"
                  min="12"
                  max="72"
                  class="w-24 md:w-auto md:flex-1"
                />
                <span class="text-xs text-tertiary">A+</span>
              </div>
              
              <!-- Style Toggles -->
              <div class="flex items-center gap-2 shrink-0">
                <!-- Bold -->
                <button
                  @click="toggleBold"
                  :class="[
                    'w-10 md:w-auto md:flex-1 py-2 rounded-lg flex items-center justify-center transition-colors',
                    activeTextElement.fontWeight === 'bold'
                      ? 'bg-primary/10 text-primary dark:bg-white/20 dark:text-white'
                      : 'bg-black/5 dark:bg-white/5 text-tertiary hover:bg-black/10 dark:hover:bg-white/10',
                  ]"
                >
                  <Bold class="w-4 h-4" />
                </button>
                <!-- Italic -->
                <button
                  @click="toggleItalic"
                  :class="[
                    'w-10 md:w-auto md:flex-1 py-2 rounded-lg flex items-center justify-center transition-colors',
                    activeTextElement.fontStyle === 'italic'
                      ? 'bg-primary/10 text-primary dark:bg-white/20 dark:text-white'
                      : 'bg-black/5 dark:bg-white/5 text-tertiary hover:bg-black/10 dark:hover:bg-white/10',
                  ]"
                >
                  <Italic class="w-4 h-4" />
                </button>
                <!-- Direction -->
                <button
                  @click="toggleDirection"
                  class="w-10 md:w-auto md:flex-1 py-2 rounded-lg flex items-center justify-center bg-black/5 dark:bg-white/5 text-tertiary hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
                >
                  <ArrowDownToLine
                    v-if="activeTextElement.writingMode === 'vertical-rl'"
                    class="w-4 h-4"
                  />
                  <ArrowRightToLine v-else class="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
  
      <!-- Stamp Modal -->
      <div
        v-if="showStampModal"
        class="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center"
        @click.self="showStampModal = false"
      >
        <div
          class="bg-white dark:bg-neutral w-full sm:w-96 rounded-t-2xl sm:rounded-2xl p-4 flex flex-col gap-4 max-h-[80vh]"
        >
          <div class="flex justify-between items-center">
            <h3 class="font-headline font-bold text-lg">选择邮票</h3>
            <button @click="showStampModal = false" class="text-tertiary">
              <X class="w-5 h-5" />
            </button>
          </div>
          <div class="grid grid-cols-3 gap-3 overflow-y-auto">
            <div
              v-for="stamp in mockStamps"
              :key="stamp.id"
              class="aspect-[3/4] rounded border border-black/5 dark:border-white/5 overflow-hidden cursor-pointer hover:ring-2 hover:ring-primary dark:hover:ring-white transition-all"
              @click="selectStamp(stamp.image)"
            >
              <img :src="stamp.image" class="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </div>
  
      <!-- Sticker Modal -->
      <div
        v-if="showStickerModal"
        class="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center"
        @click.self="showStickerModal = false"
      >
        <div
          class="bg-white dark:bg-neutral w-full sm:w-96 rounded-t-2xl sm:rounded-2xl p-4 flex flex-col gap-4 max-h-[80vh]"
        >
          <div class="flex justify-between items-center">
            <h3 class="font-headline font-bold text-lg">选择贴纸</h3>
            <button @click="showStickerModal = false" class="text-tertiary">
              <X class="w-5 h-5" />
            </button>
          </div>
          <div class="grid grid-cols-4 gap-3 overflow-y-auto">
            <div
              v-for="sticker in mockStickers"
              :key="sticker.id"
              class="aspect-square rounded border border-black/5 dark:border-white/5 overflow-hidden cursor-pointer hover:ring-2 hover:ring-primary dark:hover:ring-white transition-all p-2"
              @click="addSticker(sticker.image)"
            >
              <img :src="sticker.image" class="w-full h-full object-contain" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, computed } from "vue";
  import {
    ChevronLeft,
    Plus,
    Type,
    Sticker,
    Bold,
    Italic,
    ArrowDownToLine,
    ArrowRightToLine,
    X,
  } from "lucide-vue-next";
  import DraggableElement from "../components/DraggableElement.vue";
  
  // --- State ---
  const fileInput = ref<HTMLInputElement | null>(null);
  const coverImage = ref<string | null>(null);
  const postcardRef = ref<HTMLElement | null>(null);
  
  const showStampModal = ref(false);
  const selectedStamp = ref<string | null>(null);
  
  const showStickerModal = ref(false);
  
  const elements = ref<any[]>([]);
  const activeElementId = ref<string | null>(null);
  
  // --- Computed ---
  const activeTextElement = computed(() => {
    const el = elements.value.find((e) => e.id === activeElementId.value);
    return el?.type === "text" ? el : null;
  });
  
  // --- Actions ---
  const triggerUpload = () => {
    fileInput.value?.click();
  };
  
  const handleImageUpload = (event: Event) => {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files[0]) {
      const reader = new FileReader();
      reader.onload = (e) => {
        coverImage.value = e.target?.result as string;
      };
      reader.readAsDataURL(target.files[0]);
    }
  };
  
  const clearSelection = () => {
    activeElementId.value = null;
  };
  
  const selectStamp = (image: string) => {
    selectedStamp.value = image;
    showStampModal.value = false;
  };
  
  // --- Element Management ---
  const generateId = () => Math.random().toString(36).substr(2, 9);
  
  const addText = () => {
    const newElement = {
      id: generateId(),
      type: "text",
      content: "双击输入文字",
      x: 50,
      y: 50,
      scale: 1,
      zIndex: elements.value.length + 1,
      fontFamily: "'Public Sans', sans-serif",
      fontSize: 16,
      fontWeight: "normal",
      fontStyle: "normal",
      writingMode: "horizontal-tb",
    };
    elements.value.push(newElement);
    activeElementId.value = newElement.id;
  };
  
  const addSticker = (image: string) => {
    const newElement = {
      id: generateId(),
      type: "sticker",
      src: image,
      x: 50,
      y: 50,
      scale: 1,
      zIndex: elements.value.length + 1,
    };
    elements.value.push(newElement);
    activeElementId.value = newElement.id;
    showStickerModal.value = false;
  };
  
  const updateElement = (updatedElement: any) => {
    const index = elements.value.findIndex((e) => e.id === updatedElement.id);
    if (index !== -1) {
      elements.value[index] = updatedElement;
    }
  };
  
  const updateActiveElement = () => {
    if (activeTextElement.value) {
      updateElement(activeTextElement.value);
    }
  };
  
  const deleteElement = () => {
    if (activeElementId.value) {
      elements.value = elements.value.filter(
        (e) => e.id !== activeElementId.value
      );
      activeElementId.value = null;
    }
  };
  
  const moveUp = () => {
    if (activeElementId.value) {
      const el = elements.value.find((e) => e.id === activeElementId.value);
      if (el) {
        el.zIndex += 1;
        updateElement(el);
      }
    }
  };
  
  const moveDown = () => {
    if (activeElementId.value) {
      const el = elements.value.find((e) => e.id === activeElementId.value);
      if (el && el.zIndex > 0) {
        el.zIndex -= 1;
        updateElement(el);
      }
    }
  };
  
  // --- Text Formatting ---
  const toggleBold = () => {
    if (activeTextElement.value) {
      activeTextElement.value.fontWeight =
        activeTextElement.value.fontWeight === "bold" ? "normal" : "bold";
      updateActiveElement();
    }
  };
  
  const toggleItalic = () => {
    if (activeTextElement.value) {
      activeTextElement.value.fontStyle =
        activeTextElement.value.fontStyle === "italic" ? "normal" : "italic";
      updateActiveElement();
    }
  };
  
  const toggleDirection = () => {
    if (activeTextElement.value) {
      activeTextElement.value.writingMode =
        activeTextElement.value.writingMode === "vertical-rl"
          ? "horizontal-tb"
          : "vertical-rl";
      updateActiveElement();
    }
  };
  
  // --- Mock Data ---
  const mockStamps = [
    {
      id: 1,
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuAQ-0MFSTVl-LGC7i60wj7CXdH6xrNbGNuimhQa7TBfEDxotEhxAhkNX4BwsY7g2TLlXqT21VQgW-VicQ0d-G4XuY0D2bt6xdjcQRtA8Bc0AKjvBt5AvOLhIsEj6LI4R65Q26NnjEXrzEhDR7GBcbd9HTmDi4h4_z99FRSMXHN5F3mnACgUMAmyoPR68zZj2VtqEbmjuRNF6fi5bFJbVU0LJldFlJ7xoNaezcyrNevdQVBFNL_usAqX2ie5BWoHsJehLFCnxB4uAWee",
    },
    {
      id: 2,
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuAQ-0MFSTVl-LGC7i60wj7CXdH6xrNbGNuimhQa7TBfEDxotEhxAhkNX4BwsY7g2TLlXqT21VQgW-VicQ0d-G4XuY0D2bt6xdjcQRtA8Bc0AKjvBt5AvOLhIsEj6LI4R65Q26NnjEXrzEhDR7GBcbd9HTmDi4h4_z99FRSMXHN5F3mnACgUMAmyoPR68zZj2VtqEbmjuRNF6fi5bFJbVU0LJldFlJ7xoNaezcyrNevdQVBFNL_usAqX2ie5BWoHsJehLFCnxB4uAWee",
    },
    {
      id: 3,
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuAQ-0MFSTVl-LGC7i60wj7CXdH6xrNbGNuimhQa7TBfEDxotEhxAhkNX4BwsY7g2TLlXqT21VQgW-VicQ0d-G4XuY0D2bt6xdjcQRtA8Bc0AKjvBt5AvOLhIsEj6LI4R65Q26NnjEXrzEhDR7GBcbd9HTmDi4h4_z99FRSMXHN5F3mnACgUMAmyoPR68zZj2VtqEbmjuRNF6fi5bFJbVU0LJldFlJ7xoNaezcyrNevdQVBFNL_usAqX2ie5BWoHsJehLFCnxB4uAWee",
    },
  ];
  
  const mockStickers = [
    {
      id: 1,
      image:
        "https://api.dicebear.com/7.x/bottts/svg?seed=Felix",
    },
    {
      id: 2,
      image:
        "https://api.dicebear.com/7.x/bottts/svg?seed=Aneka",
    },
    {
      id: 3,
      image:
        "https://api.dicebear.com/7.x/bottts/svg?seed=Jude",
    },
    {
      id: 4,
      image:
        "https://api.dicebear.com/7.x/bottts/svg?seed=Leo",
    },
  ];
  </script>
  