<template>
  <div class="min-h-screen bg-background pb-24">
    <header
      class="sticky top-0 z-40 flex items-center gap-4 w-full px-4 h-16 bg-background/90 backdrop-blur-sm border-b border-primary/10"
    >
      <button
        @click="$router.back()"
        class="text-primary hover:text-secondary transition-colors"
      >
        <ChevronLeft class="w-6 h-6" />
      </button>
      <h1 class="font-headline text-xl font-bold text-primary">创建明信片</h1>
    </header>

    <main class="max-w-7xl mx-auto px-4 pt-6">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <!-- Left Column - Postcard Preview -->
        <div class="space-y-8">
          <!-- Postcard Front (Image) -->
          <div class="space-y-3">
            <div class="relative w-full aspect-[3/2] group">
              <div class="absolute inset-0 rounded-none bg-white dark:bg-neutral p-3 border border-black/10 dark:border-white/10 shadow-lg overflow-hidden">
                <div 
                  class="w-full h-full relative bg-black/5 flex items-center justify-center rounded-sm cursor-move overflow-hidden"
                  @mousedown="startDrag"
                  @touchstart.passive="startDrag"
                  @click.self="selectedImage && (showUploadOptions = !showUploadOptions)"
                >
                  <img
                    v-if="selectedImage"
                    :src="selectedImage"
                    alt="Preview"
                    class="w-full h-full object-cover"
                    :style="{ transform: `translate(${imageOffset.x}px, ${imageOffset.y}px)` }"
                  />
                  <div v-else class="text-tertiary text-center">
                    <p class="text-sm">点击+号添加图片</p>
                  </div>

                  <!-- Upload Button - Only show when no image or when clicked -->
                  <button
                    v-if="!selectedImage || showUploadOptions"
                    @click.stop="showUploadOptions = !showUploadOptions"
                    class="absolute bottom-4 right-4 w-14 h-14 rounded-full bg-secondary text-white dark:text-black font-bold shadow-lg hover:scale-110 transition-transform flex items-center justify-center text-2xl z-10 pointer-events-auto"
                  >
                    +
                  </button>

                  <!-- Floating Action Buttons -->
                  <transition name="fade">
                    <div v-if="showUploadOptions" class="absolute bottom-20 right-4 flex flex-col gap-3 z-20">
                      <button
                        @click.stop="openCamera"
                        class="w-14 h-14 rounded-full bg-primary text-white dark:text-black font-bold shadow-lg hover:scale-110 transition-transform flex items-center justify-center"
                        title="拍照"
                      >
                        <Camera class="w-6 h-6" />
                      </button>
                      <button
                        @click.stop="openGallery"
                        class="w-14 h-14 rounded-full bg-primary text-white dark:text-black font-bold shadow-lg hover:scale-110 transition-transform flex items-center justify-center"
                        title="相册"
                      >
                        <Image class="w-6 h-6" />
                      </button>
                    </div>
                  </transition>
                </div>
              </div>
            </div>
          </div>

          <!-- Postcard Back (Text side) -->
          <div class="space-y-3">
            <div class="relative w-full aspect-[3/2] group">
              <div
                class="absolute inset-0 rounded-none bg-white dark:bg-neutral p-5 flex border border-black/10 dark:border-white/10 shadow-lg"
                @click="selectedElementIndex = -1"
              >
                <!-- Left Side - Message -->
                <div class="flex-1 flex flex-col pr-5 border-r border-black/20 dark:border-white/20 relative overflow-hidden">
                  <h4 class="font-headline text-xl tracking-widest text-black/60 dark:text-white/60 mb-2">POSTCARD</h4>
                  <div class="relative flex-1">
                    <div class="flex flex-col gap-8 h-full pt-6 pb-2">
                      <div class="w-full h-[1px] bg-black/10 dark:bg-white/10"></div>
                      <div class="w-full h-[1px] bg-black/10 dark:bg-white/10"></div>
                      <div class="w-full h-[1px] bg-black/10 dark:bg-white/10"></div>
                      <div class="w-full h-[1px] bg-black/10 dark:bg-white/10"></div>
                      <div class="w-full h-[1px] bg-black/10 dark:bg-white/10"></div>
                      <div class="w-full h-[1px] bg-black/10 dark:bg-white/10"></div>
                      <div class="w-full h-[1px] bg-black/10 dark:bg-white/10"></div>
                      <div class="w-full h-[1px] bg-black/10 dark:bg-white/10"></div>
                      <div class="w-full h-[1px] bg-black/10 dark:bg-white/10"></div>
                      <div class="w-full h-[1px] bg-black/10 dark:bg-white/10"></div>
                    </div>
                  </div>
                </div>

                <!-- Right Side - Address & Stamp -->
                <div class="flex-1 flex flex-col pl-5 relative">
                  <div class="flex justify-end relative mb-4">
                    <!-- Stamp -->
                    <button
                      @click="showStampSelector = !showStampSelector"
                      class="w-20 h-24 border-[2px] border-black/30 dark:border-white/30 flex items-center justify-center relative bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 transition-colors cursor-pointer flex-shrink-0"
                      style="border-style: dashed;"
                      title="点击选择邮票"
                    >
                      <span v-if="!selectedStamp" class="text-xs font-bold text-black/40 dark:text-white/40">邮票</span>
                    </button>
                    <!-- Stamp Image Container -->
                    <div v-if="selectedStamp" class="absolute -top-4 -right-4 w-32 h-32 flex items-center justify-center cursor-pointer" @click="showStampSelector = !showStampSelector">
                      <img
                        :src="selectedStamp.image"
                        :alt="selectedStamp.title"
                        class="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                  <div class="flex-1 flex flex-col justify-end gap-4 pb-2">
                    <div class="flex items-end gap-3">
                      <span class="text-xs text-black/60 dark:text-white/60 font-body">to:</span>
                      <div class="flex-1 h-[1px] bg-black/20 dark:bg-white/20"></div>
                    </div>
                    <div class="w-full h-[1px] bg-black/20 dark:bg-white/20 mt-3"></div>
                    <div class="flex items-end gap-3">
                      <span class="text-xs text-black/60 dark:text-white/60 font-body">from:</span>
                      <div class="flex-1 h-[1px] bg-black/20 dark:bg-white/20"></div>
                    </div>
                    <div class="w-full h-[1px] bg-black/20 dark:bg-white/20"></div>
                  </div>
                </div>
              </div>

              <!-- Interactive Elements - Positioned relative to the postcard container -->
              <div
                v-for="(element, index) in interactiveElements"
                :key="`element-${index}-${interactiveElements.length}`"
                class="absolute inline-block"
                :style="{
                  left: element.x + 'px',
                  top: element.y + 'px',
                  transform: `rotate(${element.rotation}deg) scale(${element.scale || 1})`,
                  width: element.width + 'px',
                  height: element.height + 'px',
                  zIndex: index + 10,
                  transformOrigin: 'top left'
                }"
                @mousedown.stop="startElementDrag($event, index)"
                @touchstart.stop="startElementDrag($event, index)"
                @click.stop="selectedElementIndex = index"
              >
                <!-- Content Wrapper -->
                <div
                  :class="[
                    'relative group',
                    selectedElementIndex === index ? 'ring-2 ring-primary dark:ring-white ring-dashed' : ''
                  ]"
                >
                  <!-- Text Input - Only show when selected -->
                  <textarea
                    v-if="element.type === 'text' && selectedElementIndex === index"
                    :value="element.content"
                    @input="element.content = $event.target.value"
                    @click.stop
                    @mousedown.stop
                    @touchstart.stop
                    class="w-full h-full bg-transparent border-none p-1 focus:outline-none resize-none min-w-[50px] min-h-[30px]"
                    placeholder="输入文字"
                    autofocus
                    :style="{
                      fontFamily: element.fontFamily || 'Arial',
                      fontSize: (element.fontSize || 16) + 'px',
                      fontWeight: element.fontWeight || 'normal',
                      fontStyle: element.fontStyle || 'normal',
                      color: element.color || '#000000',
                      whiteSpace: 'pre-wrap',
                      wordWrap: 'break-word',
                      overflow: 'auto'
                    }"
                  />
                  <!-- Text Display - Show when not selected -->
                  <div
                    v-else-if="element.type === 'text'"
                    class="w-full h-full p-1 pointer-events-none overflow-hidden"
                    :style="{
                      fontFamily: element.fontFamily || 'Arial',
                      fontSize: (element.fontSize || 16) + 'px',
                      fontWeight: element.fontWeight || 'normal',
                      fontStyle: element.fontStyle || 'normal',
                      color: element.color || '#000000',
                      whiteSpace: 'pre-wrap',
                      wordWrap: 'break-word',
                      display: 'block'
                    }"
                  >
                    {{ element.content }}
                  </div>
                  <!-- Sticker Image -->
                  <img
                    v-else-if="element.type === 'sticker'"
                    :src="element.content"
                    class="w-full h-full object-contain pointer-events-none"
                  />

                  <!-- Rotate Handle - Only show when selected -->
                  <div
                    v-if="selectedElementIndex === index"
                    class="absolute -top-10 left-1/2 -translate-x-1/2 w-6 h-6 bg-white dark:bg-neutral border border-primary dark:border-white rounded-full flex items-center justify-center cursor-crosshair shadow-sm"
                    @mousedown.stop="startElementRotate($event, index)"
                    @touchstart.stop="startElementRotate($event, index)"
                  >
                    <RotateCw class="w-3 h-3 text-primary dark:text-white" />
                  </div>

                  <!-- Scale Handle - Only show when selected -->
                  <div
                    v-if="selectedElementIndex === index"
                    class="absolute -bottom-3 -right-3 w-6 h-6 bg-white dark:bg-neutral border border-primary dark:border-white rounded-full flex items-center justify-center cursor-se-resize shadow-sm"
                    @mousedown.stop="startElementResize($event, index)"
                    @touchstart.stop="startElementResize($event, index)"
                  >
                    <div class="w-2 h-2 bg-primary dark:bg-white rounded-full"></div>
                  </div>

                  <!-- Action Buttons (Right Side) - Only show when selected -->
                  <div
                    v-if="selectedElementIndex === index"
                    class="absolute top-0 -right-12 flex flex-col gap-2"
                  >
                    <button
                      @click.stop="moveElementUp"
                      class="w-8 h-8 bg-white dark:bg-neutral border border-black/10 dark:border-white/10 rounded-full flex items-center justify-center shadow-sm text-tertiary hover:text-primary dark:hover:text-white"
                      title="上移一层"
                    >
                      <ArrowUp class="w-4 h-4" />
                    </button>
                    <button
                      @click.stop="moveElementDown"
                      class="w-8 h-8 bg-white dark:bg-neutral border border-black/10 dark:border-white/10 rounded-full flex items-center justify-center shadow-sm text-tertiary hover:text-primary dark:hover:text-white"
                      title="下移一层"
                    >
                      <ArrowDown class="w-4 h-4" />
                    </button>
                    <button
                      @click.stop="deleteElement"
                      class="w-8 h-8 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-full flex items-center justify-center shadow-sm text-red-500 hover:text-red-600 dark:text-red-400"
                      title="删除"
                    >
                      <Trash2 class="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Right Column - Stamp Selection & Actions -->
        <div class="space-y-8">
          <!-- Add Elements Buttons -->
          <div class="space-y-3">
            <h3 class="font-headline text-lg font-bold text-primary">添加元素</h3>
            <div class="flex gap-2">
              <button
                @click.prevent="addTextElement"
                type="button"
                class="flex-1 py-2 px-2 bg-primary dark:bg-secondary text-white dark:text-black font-bold rounded-lg hover:opacity-90 transition-opacity text-xs flex items-center justify-center gap-1"
                title="添加文字"
              >
                <Type class="w-4 h-4" />
                <span>文字</span>
              </button>
              <button
                @click.prevent="showStickerPicker = !showStickerPicker"
                type="button"
                class="flex-1 py-2 px-2 bg-primary dark:bg-secondary text-white dark:text-black font-bold rounded-lg hover:opacity-90 transition-opacity text-xs flex items-center justify-center gap-1"
                title="添加贴纸"
              >
                <Smile class="w-4 h-4" />
                <span>贴纸</span>
              </button>
            </div>
          </div>

          <!-- Combined Style & Picker Panel -->
          <div v-if="selectedElementIndex !== -1" class="space-y-4 p-4 bg-white dark:bg-neutral rounded-2xl border-2 border-secondary">
            <!-- Text Style Editor - Show when text element is selected -->
            <div v-if="interactiveElements[selectedElementIndex]?.type === 'text'" class="space-y-4">
              <!-- Top Row - Font & Size Controls -->
              <div class="flex gap-2 flex-wrap">
                <!-- Font Family Dropdown -->
                <div class="relative">
                  <button
                    @click="showFontDropdown = !showFontDropdown"
                    class="px-4 py-2 text-sm border-2 border-secondary rounded-xl bg-white dark:bg-neutral text-black dark:text-white font-semibold hover:bg-secondary/5 transition-colors flex items-center gap-2"
                  >
                    <span>{{ fontDisplayName }}</span>
                    <svg :class="showFontDropdown ? 'rotate-180' : ''" class="w-4 h-4 text-secondary transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
                    </svg>
                  </button>
                  
                  <!-- Dropdown Menu -->
                  <div v-if="showFontDropdown" class="absolute left-0 top-full mt-1 w-48 bg-white dark:bg-neutral border-2 border-secondary rounded-xl shadow-lg z-50 max-h-64 overflow-y-auto pointer-events-auto">
                    <!-- English Fonts -->
                    <div class="px-3 py-2 border-b border-secondary/20">
                      <p class="text-xs font-bold text-secondary mb-2">英文字体</p>
                      <button
                        v-for="font in englishFonts"
                        :key="font.value"
                        @click="interactiveElements[selectedElementIndex].fontFamily = font.value; showFontDropdown = false"
                        :class="interactiveElements[selectedElementIndex].fontFamily === font.value ? 'bg-secondary text-white' : 'hover:bg-secondary/10'"
                        class="w-full text-left px-3 py-2 rounded-lg text-sm transition-colors mb-1 pointer-events-auto"
                        :style="{ fontFamily: font.value }"
                      >
                        {{ font.label }}
                      </button>
                    </div>
                    
                    <!-- Chinese Fonts -->
                    <div class="px-3 py-2">
                      <p class="text-xs font-bold text-secondary mb-2">中文字体</p>
                      <button
                        v-for="font in chineseFonts"
                        :key="font.value"
                        @click="interactiveElements[selectedElementIndex].fontFamily = font.value; showFontDropdown = false"
                        :class="interactiveElements[selectedElementIndex].fontFamily === font.value ? 'bg-secondary text-white' : 'hover:bg-secondary/10'"
                        class="w-full text-left px-3 py-2 rounded-lg text-sm transition-colors mb-1 pointer-events-auto"
                        :style="{ fontFamily: font.value }"
                      >
                        {{ font.label }}
                      </button>
                    </div>
                  </div>
                </div>

                <!-- Font Size -->
                <div class="flex items-center gap-2 px-4 py-2 border-2 border-secondary rounded-xl bg-white dark:bg-neutral">
                  <span class="text-xs font-semibold text-secondary">大小</span>
                  <input
                    type="number"
                    :value="interactiveElements[selectedElementIndex].fontSize || 16"
                    @input="interactiveElements[selectedElementIndex].fontSize = parseInt($event.target.value)"
                    min="8"
                    max="72"
                    class="w-12 text-sm font-bold text-center bg-transparent border-none text-black dark:text-white focus:outline-none"
                  />
                </div>

                <!-- Bold -->
                <button
                  @click="interactiveElements[selectedElementIndex].fontWeight = interactiveElements[selectedElementIndex].fontWeight === 'bold' ? 'normal' : 'bold'"
                  :class="interactiveElements[selectedElementIndex].fontWeight === 'bold' ? 'bg-secondary text-white' : 'bg-white dark:bg-neutral text-secondary hover:bg-secondary/10'"
                  class="w-12 h-10 rounded-xl border-2 border-secondary font-bold transition-all flex items-center justify-center"
                  title="加粗"
                >
                  B
                </button>

                <!-- Italic -->
                <button
                  @click="interactiveElements[selectedElementIndex].fontStyle = interactiveElements[selectedElementIndex].fontStyle === 'italic' ? 'normal' : 'italic'"
                  :class="interactiveElements[selectedElementIndex].fontStyle === 'italic' ? 'bg-secondary text-white' : 'bg-white dark:bg-neutral text-secondary hover:bg-secondary/10'"
                  class="w-12 h-10 rounded-xl border-2 border-secondary italic transition-all flex items-center justify-center"
                  title="斜体"
                >
                  I
                </button>

                <!-- Underline (placeholder for future use) -->
                <button
                  class="w-12 h-10 rounded-xl border-2 border-secondary bg-white dark:bg-neutral text-secondary hover:bg-secondary/10 transition-all flex items-center justify-center underline"
                  title="下划线"
                >
                  U
                </button>
              </div>

              <!-- Color Palette Row -->
              <div class="space-y-2">
                <div class="flex items-center gap-2">
                  <span class="text-xs font-semibold text-secondary">文字颜色</span>
                </div>
                <div class="flex gap-2 flex-wrap p-3 border-2 border-dashed border-secondary rounded-xl bg-white dark:bg-neutral">
                  <!-- Color swatches -->
                  <button
                    v-for="color in ['#000000', '#FF0000', '#00B050', '#0070C0', '#FFC000', '#7030A0', '#FF6B6B', '#4ECDC4']"
                    :key="color"
                    @click="interactiveElements[selectedElementIndex].color = color"
                    :class="interactiveElements[selectedElementIndex].color === color ? 'ring-2 ring-offset-2 ring-secondary' : ''"
                    class="w-8 h-8 rounded-lg border-2 border-secondary transition-all hover:scale-110"
                    :style="{ backgroundColor: color }"
                    :title="`选择颜色 ${color}`"
                  ></button>
                  
                  <!-- Custom color picker -->
                  <label class="w-8 h-8 rounded-lg border-2 border-secondary cursor-pointer hover:scale-110 transition-all flex items-center justify-center bg-white dark:bg-neutral">
                    <input
                      type="color"
                      :value="interactiveElements[selectedElementIndex].color || '#000000'"
                      @input="interactiveElements[selectedElementIndex].color = $event.target.value"
                      class="hidden"
                    />
                    <span class="text-lg">+</span>
                  </label>
                </div>
              </div>
            </div>

            <!-- Sticker Picker - Show when sticker element is selected -->
            <div v-else-if="interactiveElements[selectedElementIndex]?.type === 'sticker'" class="space-y-3">
              <h3 class="font-headline text-lg font-bold text-primary">选择贴纸</h3>
              <div class="grid grid-cols-2 gap-4 max-h-96 overflow-y-auto">
                <button
                  v-for="(sticker, index) in stickerOptions"
                  :key="index"
                  @click="interactiveElements[selectedElementIndex].content = sticker"
                  class="relative rounded-lg overflow-hidden border-2 transition-all hover:scale-105"
                  :class="interactiveElements[selectedElementIndex].content === sticker ? 'border-secondary' : 'border-black/10 dark:border-white/10'"
                >
                  <img
                    :src="sticker"
                    :alt="`Sticker ${index + 1}`"
                    class="w-full h-24 object-cover"
                  />
                  <div v-if="interactiveElements[selectedElementIndex].content === sticker" class="absolute inset-0 bg-secondary/20 flex items-center justify-center">
                    <Check class="w-6 h-6 text-white" />
                  </div>
                </button>
              </div>
            </div>
          </div>

          <!-- Stamp Selector -->
          <div v-if="showStampSelector" class="space-y-3">
            <h3 class="font-headline text-lg font-bold text-primary">选择邮票</h3>
            <div class="grid grid-cols-2 gap-4 max-h-96 overflow-y-auto">
              <button
                v-for="stamp in myStamps"
                :key="stamp.id"
                @click="selectStamp(stamp)"
                class="relative rounded-lg overflow-hidden border-4 transition-all hover:scale-105"
                :class="selectedStamp?.id === stamp.id ? 'border-secondary' : 'border-black/10 dark:border-white/10'"
              >
                <img
                  :src="stamp.image"
                  :alt="stamp.title"
                  class="w-full h-24 object-cover"
                />
                <div v-if="selectedStamp?.id === stamp.id" class="absolute inset-0 bg-secondary/20 flex items-center justify-center">
                  <Check class="w-6 h-6 text-white" />
                </div>
                <div class="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs p-1 truncate">
                  {{ stamp.title }}
                </div>
              </button>
            </div>
            <p v-if="myStamps.length === 0" class="text-sm text-tertiary text-center py-8">
              还没有购入邮票，请先去商店购买
            </p>
          </div>

          <!-- Action Buttons -->
          <div class="flex flex-col gap-3">
            <button
              @click="resetUpload"
              class="w-full py-3 px-4 bg-black/5 dark:bg-white/5 text-primary font-bold rounded-xl hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
            >
              清空
            </button>
            <button
              @click="publishPostcard"
              :disabled="!selectedImage"
              class="w-full py-3 px-4 bg-primary dark:bg-secondary text-white dark:text-black font-bold rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
            >
              发布明信片
            </button>
          </div>
        </div>
      </div>
    </main>

    <!-- Hidden file inputs -->
    <input
      ref="cameraInput"
      type="file"
      accept="image/*"
      capture="environment"
      @change="handleImageUpload"
      class="hidden"
    />
    <input
      ref="galleryInput"
      type="file"
      accept="image/*"
      @change="handleImageUpload"
      class="hidden"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { ChevronLeft, Camera, Image, Check, Type, Smile, Bold, Italic, Palette, Trash2, ArrowUp, ArrowDown, RotateCw } from "lucide-vue-next";

const showUploadOptions = ref(false);
const showStampSelector = ref(false);
const showStickerPicker = ref(false);
const showColorPicker = ref(false);
const showFontDropdown = ref(false);
const selectedImage = ref<string | null>(null);
const cameraInput = ref<HTMLInputElement>();
const galleryInput = ref<HTMLInputElement>();
const imageOffset = ref({ x: 0, y: 0 });
const isDragging = ref(false);
const dragStart = ref({ x: 0, y: 0 });
const selectedStamp = ref<any>(null);
const myStamps = ref<any[]>([]);
const interactiveElements = ref<any[]>([]);
const selectedElementIndex = ref(-1);
const stickerOptions = [
  "/postcard_back/1.png",
  "/postcard_back/2.png",
  "/postcard_back/3.png",
];

// Font options
const englishFonts = [
  { label: 'Arial', value: 'Arial' },
  { label: 'Georgia', value: 'Georgia' },
  { label: 'Times New Roman', value: 'Times New Roman' },
  { label: 'Courier New', value: 'Courier New' },
  { label: 'Verdana', value: 'Verdana' },
  { label: 'Comic Sans MS', value: 'Comic Sans MS' },
];

const chineseFonts = [
  { label: '思源黑体', value: "'Noto Sans SC', sans-serif" },
  { label: '思源宋体', value: "'Noto Serif SC', serif" },
  { label: '黑体', value: 'SimHei' },
  { label: '宋体', value: 'SimSun' },
  { label: '微软雅黑', value: 'Microsoft YaHei' },
  { label: '楷体', value: 'KaiTi' },
];

const fontDisplayName = computed(() => {
  if (selectedElementIndex.value === -1) return '字体';
  const currentFont = interactiveElements.value[selectedElementIndex.value]?.fontFamily || 'Arial';
  const found = [...englishFonts, ...chineseFonts].find(f => f.value === currentFont);
  return found?.label || '字体';
});

let currentElementIndex = -1;
let resizeStartData = { width: 0, height: 0, startX: 0, startY: 0, x: 0, y: 0 };
let rotateStartData = { rotation: 0, startX: 0, startY: 0 };

onMounted(() => {
  loadMyStamps();
  
  // Close font dropdown when clicking outside
  document.addEventListener('click', (e) => {
    const fontDropdown = document.querySelector('.relative');
    if (fontDropdown && !fontDropdown.contains(e.target as Node)) {
      showFontDropdown.value = false;
    }
  });
});

const loadMyStamps = () => {
  const stored = localStorage.getItem('favorites');
  myStamps.value = stored ? JSON.parse(stored) : [];
};

const openCamera = () => {
  cameraInput.value?.click();
  showUploadOptions.value = false;
};

const openGallery = () => {
  galleryInput.value?.click();
  showUploadOptions.value = false;
};

const handleImageUpload = (event: Event) => {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0];
  
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      selectedImage.value = e.target?.result as string;
      imageOffset.value = { x: 0, y: 0 };
    };
    reader.readAsDataURL(file);
  }
};

const startDrag = (e: MouseEvent | TouchEvent) => {
  if (!selectedImage.value) return;
  
  if (e instanceof TouchEvent) {
    e.preventDefault();
  }
  
  isDragging.value = true;
  const clientX = e instanceof MouseEvent ? e.clientX : e.touches[0].clientX;
  const clientY = e instanceof MouseEvent ? e.clientY : e.touches[0].clientY;
  
  dragStart.value = { x: clientX, y: clientY };
  
  const handleMove = (moveEvent: MouseEvent | TouchEvent) => {
    if (!isDragging.value) return;
    
    if (moveEvent instanceof TouchEvent) {
      moveEvent.preventDefault();
    }
    
    const moveClientX = moveEvent instanceof MouseEvent ? moveEvent.clientX : moveEvent.touches[0].clientX;
    const moveClientY = moveEvent instanceof MouseEvent ? moveEvent.clientY : moveEvent.touches[0].clientY;
    
    const deltaX = moveClientX - dragStart.value.x;
    const deltaY = moveClientY - dragStart.value.y;
    
    imageOffset.value.x += deltaX;
    imageOffset.value.y += deltaY;
    
    dragStart.value = { x: moveClientX, y: moveClientY };
  };
  
  const handleEnd = () => {
    isDragging.value = false;
    document.removeEventListener('mousemove', handleMove);
    document.removeEventListener('touchmove', handleMove);
    document.removeEventListener('mouseup', handleEnd);
    document.removeEventListener('touchend', handleEnd);
  };
  
  document.addEventListener('mousemove', handleMove);
  document.addEventListener('touchmove', handleMove, { passive: false });
  document.addEventListener('mouseup', handleEnd);
  document.addEventListener('touchend', handleEnd);
};

const addTextElement = () => {
  interactiveElements.value.push({
    type: 'text',
    content: '输入文字',
    x: 50,
    y: 50,
    width: 150,
    height: 60,
    rotation: 0,
    scale: 1,
    fontFamily: 'Arial',
    fontSize: 16,
    fontWeight: 'normal',
    fontStyle: 'normal',
    color: '#000000'
  });
};

const addStickerElement = (stickerUrl: string) => {
  interactiveElements.value.push({
    type: 'sticker',
    content: stickerUrl,
    x: 50,
    y: 100,
    width: 100,
    height: 100,
    rotation: 0,
    scale: 1
  });
};

const startElementDrag = (e: MouseEvent | TouchEvent, index: number) => {
  e.preventDefault();
  e.stopPropagation();
  
  selectedElementIndex.value = index;
  currentElementIndex = index;
  
  const clientX = e instanceof MouseEvent ? e.clientX : e.touches[0].clientX;
  const clientY = e instanceof MouseEvent ? e.clientY : e.touches[0].clientY;
  
  dragStart.value = { x: clientX, y: clientY };
  const element = interactiveElements.value[index];
  const startX = element.x;
  const startY = element.y;
  
  const handleMove = (moveEvent: MouseEvent | TouchEvent) => {
    moveEvent.preventDefault();
    
    const moveClientX = moveEvent instanceof MouseEvent ? moveEvent.clientX : moveEvent.touches[0].clientX;
    const moveClientY = moveEvent instanceof MouseEvent ? moveEvent.clientY : moveEvent.touches[0].clientY;
    
    const dx = moveClientX - dragStart.value.x;
    const dy = moveClientY - dragStart.value.y;
    
    element.x = startX + dx;
    element.y = startY + dy;
  };
  
  const handleEnd = () => {
    document.removeEventListener('mousemove', handleMove);
    document.removeEventListener('touchmove', handleMove);
    document.removeEventListener('mouseup', handleEnd);
    document.removeEventListener('touchend', handleEnd);
  };
  
  document.addEventListener('mousemove', handleMove);
  document.addEventListener('touchmove', handleMove, { passive: false });
  document.addEventListener('mouseup', handleEnd);
  document.addEventListener('touchend', handleEnd);
};

const startElementResize = (e: MouseEvent | TouchEvent, index: number) => {
  e.preventDefault();
  e.stopPropagation();
  
  const clientX = e instanceof MouseEvent ? e.clientX : e.touches[0].clientX;
  
  const element = interactiveElements.value[index];
  const initialScale = element.scale || 1;
  
  const handleMove = (moveEvent: MouseEvent | TouchEvent) => {
    moveEvent.preventDefault();
    
    const moveClientX = moveEvent instanceof MouseEvent ? moveEvent.clientX : moveEvent.touches[0].clientX;
    const dx = moveClientX - clientX;
    
    const scaleFactor = 1 + (dx / 100);
    const newScale = Math.max(0.5, Math.min(5, initialScale * scaleFactor));
    
    element.scale = newScale;
  };
  
  const handleEnd = () => {
    document.removeEventListener('mousemove', handleMove);
    document.removeEventListener('touchmove', handleMove);
    document.removeEventListener('mouseup', handleEnd);
    document.removeEventListener('touchend', handleEnd);
  };
  
  document.addEventListener('mousemove', handleMove);
  document.addEventListener('touchmove', handleMove, { passive: false });
  document.addEventListener('mouseup', handleEnd);
  document.addEventListener('touchend', handleEnd);
};

const startElementRotate = (e: MouseEvent | TouchEvent, index: number) => {
  if (e instanceof TouchEvent) {
    e.preventDefault();
  }
  
  currentElementIndex = index;
  const clientX = e instanceof MouseEvent ? e.clientX : e.touches[0].clientX;
  const clientY = e instanceof MouseEvent ? e.clientY : e.touches[0].clientY;
  
  const element = interactiveElements.value[index];
  
  // Get element center position
  const target = e.target as HTMLElement;
  const elementContainer = target.closest('.absolute.cursor-move') as HTMLElement;
  let centerX = 0;
  let centerY = 0;
  
  if (elementContainer) {
    const rect = elementContainer.getBoundingClientRect();
    centerX = rect.left + rect.width / 2;
    centerY = rect.top + rect.height / 2;
  }
  
  const startAngle = Math.atan2(clientY - centerY, clientX - centerX) * (180 / Math.PI);
  
  rotateStartData = {
    rotation: element.rotation || 0,
    startX: startAngle,
    startY: 0
  };
  
  const handleMove = (moveEvent: MouseEvent | TouchEvent) => {
    if (moveEvent instanceof TouchEvent) {
      moveEvent.preventDefault();
    }
    
    const moveClientX = moveEvent instanceof MouseEvent ? moveEvent.clientX : moveEvent.touches[0].clientX;
    const moveClientY = moveEvent instanceof MouseEvent ? moveEvent.clientY : moveEvent.touches[0].clientY;
    
    const currentAngle = Math.atan2(moveClientY - centerY, moveClientX - centerX) * (180 / Math.PI);
    const angleDiff = currentAngle - rotateStartData.startX;
    
    element.rotation = rotateStartData.rotation + angleDiff;
  };
  
  const handleEnd = () => {
    selectedElementIndex.value = -1;
    document.removeEventListener('mousemove', handleMove);
    document.removeEventListener('touchmove', handleMove);
    document.removeEventListener('mouseup', handleEnd);
    document.removeEventListener('touchend', handleEnd);
  };
  
  document.addEventListener('mousemove', handleMove);
  document.addEventListener('touchmove', handleMove, { passive: false });
  document.addEventListener('mouseup', handleEnd);
  document.addEventListener('touchend', handleEnd);
};

const selectStamp = (stamp: any) => {
  selectedStamp.value = stamp;
  showStampSelector.value = false;
};

const deleteElement = () => {
  if (selectedElementIndex.value !== -1) {
    interactiveElements.value.splice(selectedElementIndex.value, 1);
    selectedElementIndex.value = -1;
  }
};

const moveElementUp = () => {
  if (selectedElementIndex.value !== -1 && selectedElementIndex.value < interactiveElements.value.length - 1) {
    const temp = interactiveElements.value[selectedElementIndex.value];
    interactiveElements.value[selectedElementIndex.value] = interactiveElements.value[selectedElementIndex.value + 1];
    interactiveElements.value[selectedElementIndex.value + 1] = temp;
    selectedElementIndex.value += 1;
    // 强制更新以立即显示变化
    interactiveElements.value = [...interactiveElements.value];
  }
};

const moveElementDown = () => {
  if (selectedElementIndex.value !== -1 && selectedElementIndex.value > 0) {
    const temp = interactiveElements.value[selectedElementIndex.value];
    interactiveElements.value[selectedElementIndex.value] = interactiveElements.value[selectedElementIndex.value - 1];
    interactiveElements.value[selectedElementIndex.value - 1] = temp;
    selectedElementIndex.value -= 1;
    // 强制更新以立即显示变化
    interactiveElements.value = [...interactiveElements.value];
  }
};

const resetUpload = () => {
  selectedImage.value = null;
  imageOffset.value = { x: 0, y: 0 };
  selectedStamp.value = null;
  interactiveElements.value = [];
};

const publishPostcard = () => {
  if (!selectedImage.value) {
    alert("请先选择图片");
    return;
  }
  alert("明信片已发布！");
  resetUpload();
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@400;700&family=Noto+Serif+SC:wght@400;700&display=swap');

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
