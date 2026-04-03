<template>
  <div class="min-h-screen bg-background pb-24" @click="selectedElementIndex = -1">
    <header
      class="sticky top-0 z-40 flex items-center justify-between w-full px-4 h-16 bg-background/90 backdrop-blur-sm border-b border-primary/10"
    >
      <div class="flex items-center gap-4">
        <button
          @click="$router.back()"
          class="text-primary hover:text-secondary transition-colors"
        >
          <ChevronLeft class="w-6 h-6" />
        </button>
        <h1 class="font-headline text-xl font-bold text-primary">创建明信片</h1>
      </div>
      <button
        @click="goToOutbox"
        class="text-sm font-bold text-primary hover:text-secondary transition-colors"
      >
        发件箱
      </button>
    </header>

    <main class="max-w-7xl mx-auto px-4 pt-6">
      <div class="grid grid-cols-1 lg:gap-8 lg:items-start" :class="postcardAspectRatio === '3/2' ? 'lg:grid-cols-2' : 'lg:grid-cols-[1fr_1.5fr]'">
        <!-- Left Column - Postcard Preview -->
        <div class="lg:sticky lg:top-20 lg:self-start" :class="postcardAspectRatio === '2/3' ? 'max-w-sm' : ''">
        <!-- Stacked Postcard Preview -->
        <div class="relative w-full transition-all duration-500" :style="{ 'aspect-ratio': postcardAspectRatio }">
          <div class="relative w-full h-full" ref="postcardCanvasRef">

          <!-- Postcard Front (Image) -->
          <div
            class="absolute inset-0"
            :style="{
              transform: showFront
                ? 'translate(-6px, -6px) scale(1)'
                : 'translate(-6px, -6px) scale(0.96) translateY(4px)',
              zIndex: showFront ? 10 : 5,
              opacity: showFront ? 1 : 0.6,
              transition: 'transform 0.45s cubic-bezier(0.4,0,0.2,1), opacity 0.45s ease, z-index 0s 0.22s',
            }"
          >
            <div class="relative w-full h-full group">
              <div class="absolute inset-0 rounded-none bg-white dark:bg-neutral p-3 border border-black/10 dark:border-white/10 shadow-lg overflow-hidden">
                <div 
                  class="w-full h-full relative bg-black/5 flex items-center justify-center rounded-sm cursor-move overflow-hidden group/imgarea"
                  @mousedown="startDrag"
                  @touchstart.passive="startDrag"
                  @mouseenter="showImageControls = true"
                  @mouseleave="showImageControls = false"
                  @click.self="selectedImage && (showUploadOptions = !showUploadOptions)"
                >
                  <img
                    v-if="selectedImage"
                    :src="selectedImage"
                    alt="Preview"
                    draggable="false"
                    @dragstart.prevent
                    class="w-full h-full object-cover select-none"
                    :style="{ transform: `translate(${imageOffset.x}px, ${imageOffset.y}px) scale(${imageScale}) rotate(${imageRotation}deg)` }"
                  />
                  <div v-else class="text-tertiary text-center">
                    <p class="text-sm">点击+号添加图片</p>
                  </div>

                  <!-- Upload Button - Show when no image, hovered, or showUploadOptions -->
                  <button
                    v-if="!selectedImage || showUploadOptions"
                    @click.stop="showUploadOptions = !showUploadOptions"
                    class="absolute bottom-4 right-4 w-14 h-14 rounded-full bg-secondary text-white dark:text-black font-bold shadow-lg hover:scale-110 transition-transform flex items-center justify-center text-2xl z-10 pointer-events-auto"
                  >
                    +
                  </button>
                  <button
                    v-else-if="selectedImage"
                    @click.stop="showUploadOptions = !showUploadOptions"
                    class="absolute bottom-4 right-4 w-14 h-14 rounded-full bg-secondary text-white dark:text-black font-bold shadow-lg hover:scale-110 transition-transform flex items-center justify-center text-2xl z-10 pointer-events-auto opacity-0 group-hover/imgarea:opacity-100 transition-opacity duration-200"
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

                  <!-- Image Controls: 竖立在明信片内部左侧 -->
                  <transition name="fade">
                    <div
                      v-if="selectedImage && showImageControls"
                      class="absolute top-1/2 -translate-y-1/2 left-2 z-20 flex flex-col items-center gap-3 py-3 px-2 rounded-2xl bg-white/90 dark:bg-neutral/90 backdrop-blur-sm border border-black/10 dark:border-white/10 shadow-lg"
                      @mouseenter="showImageControls = true"
                      @mouseleave="showImageControls = false"
                      @mousedown.stop
                    >
                      <div class="flex flex-col items-center gap-1">
                        <span class="text-primary/60 dark:text-white/60"><svg xmlns="http://www.w3.org/2000/svg" class="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35M11 8v6M8 11h6"/></svg></span>
                        <div class="relative w-4 cursor-pointer select-none" style="height: 80px;" @mousedown.stop="startScaleDragV">
                          <div class="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-1 rounded-full bg-black/15 dark:bg-white/15">
                            <div class="absolute bottom-0 left-0 right-0 rounded-full bg-primary dark:bg-secondary transition-none" :style="{ height: ((imageScale - 0.5) / 2.5 * 100) + '%' }"></div>
                            <div class="absolute left-1/2 -translate-x-1/2 w-2.5 h-0.5 bg-primary/40 dark:bg-white/40 rounded-full" :style="{ bottom: ((1 - 0.5) / 2.5 * 100) + '%' }"></div>
                          </div>
                          <div class="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full bg-white shadow-md border border-black/10 transition-none" :style="{ top: (100 - (imageScale - 0.5) / 2.5 * 100) + '%' }"></div>
                        </div>
                        <span class="text-primary/50 dark:text-white/50 text-[9px] tabular-nums">{{ Math.round(imageScale * 100) }}%</span>
                      </div>
                      <div class="w-5 h-px bg-black/10 dark:bg-white/10"></div>
                      <div class="flex flex-col items-center gap-1">
                        <span class="text-primary/60 dark:text-white/60"><svg xmlns="http://www.w3.org/2000/svg" class="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38"/></svg></span>
                        <div class="relative w-4 cursor-pointer select-none" style="height: 80px;" @mousedown.stop="startRotateDragV">
                          <div class="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-1 rounded-full bg-black/15 dark:bg-white/15">
                            <div class="absolute left-0 right-0 rounded-full bg-primary dark:bg-secondary transition-none" :style="imageRotation >= 0 ? { top: '50%', height: (imageRotation / 180 * 50) + '%' } : { bottom: '50%', height: (-imageRotation / 180 * 50) + '%' }"></div>
                            <div class="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 w-2.5 h-0.5 bg-primary/60 dark:bg-white/60 rounded-full"></div>
                            <div class="absolute top-1/4 left-1/2 -translate-x-1/2 w-2 h-px bg-black/20 dark:bg-white/20"></div>
                            <div class="absolute top-3/4 left-1/2 -translate-x-1/2 w-2 h-px bg-black/20 dark:bg-white/20"></div>
                          </div>
                          <div class="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full bg-white shadow-md border border-black/10 transition-none" :style="{ top: (50 + imageRotation / 180 * 50) + '%' }"></div>
                        </div>
                        <span class="text-primary/50 dark:text-white/50 text-[9px] tabular-nums">{{ imageRotation > 0 ? '+' : '' }}{{ Math.round(imageRotation) }}°</span>
                      </div>
                    </div>
                  </transition>
                </div>
              </div>
            </div>
          </div>

          <!-- Postcard Back (Text side) -->
          <div
            class="absolute inset-0"
            :style="{
              transform: showFront
                ? 'translate(6px, 6px) scale(0.96) translateY(4px)'
                : 'translate(6px, 6px) scale(1)',
              zIndex: showFront ? 5 : 10,
              opacity: showFront ? 0.6 : 1,
              transition: 'transform 0.45s cubic-bezier(0.4,0,0.2,1), opacity 0.45s ease, z-index 0s 0.22s',
            }"
          >
            <div class="relative w-full h-full group overflow-hidden" @click="selectedElementIndex = -1; showStickerPicker = false; showStampSelector = false">
              <div
                class="absolute inset-0 rounded-none bg-white dark:bg-neutral p-5 flex border border-black/10 dark:border-white/10 shadow-lg overflow-hidden"
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
                      @click.stop="showStampSelector = !showStampSelector; showStickerPicker = false; selectedElementIndex = -1;"
                      class="w-20 h-24 border-[2px] border-black/30 dark:border-white/30 flex items-center justify-center relative bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 transition-colors cursor-pointer flex-shrink-0"
                      style="border-style: dashed;"
                      title="点击选择邮票"
                    >
                      <span v-if="!selectedStamp" class="text-xs font-bold text-black/40 dark:text-white/40">邮票</span>
                    </button>
                    <!-- Stamp Image Container -->
                    <div v-if="selectedStamp" class="absolute -top-3 -right-3 w-32 h-32 flex items-center justify-center cursor-pointer" style="filter: drop-shadow(2px 4px 6px rgba(230, 220, 200, 0.8));" @click.stop="showStampSelector = !showStampSelector; showStickerPicker = false; selectedElementIndex = -1;">
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
                  width: element.type === 'text' ? 'auto' : element.width + 'px',
                  height: element.type === 'text' ? 'auto' : element.height + 'px',
                  minWidth: element.type === 'text' ? '50px' : undefined,
                  zIndex: index + 10,
                  transformOrigin: 'top left'
                }"
                @mousedown.stop="startElementDrag($event, index)"
                @touchstart.stop="startElementDrag($event, index)"
                @click.stop="selectedElementIndex = index; showStickerPicker = false; showStampSelector = false"
              >
                <!-- Content Wrapper -->
                <div
                  :class="[
                    'relative group',
                    selectedElementIndex === index ? 'ring-2 ring-primary dark:ring-white ring-dashed' : ''
                  ]"
                >
                  <!-- Text Input - Only show when selected -->
                  <div
                    v-if="element.type === 'text' && selectedElementIndex === index"
                    :ref="el => { if (el) textEditRefs[index] = el as HTMLElement }"
                    contenteditable="true"
                    @input="element.content = ($event.target as HTMLElement).innerText"
                    @click.stop
                    @mousedown.stop
                    @touchstart.stop
                    class="bg-transparent border-none p-1 focus:outline-none min-w-[50px] min-h-[24px] whitespace-pre-wrap break-words"
                    :style="{
                      fontFamily: element.fontFamily || 'Arial',
                      fontSize: (element.fontSize || 16) + 'px',
                      fontWeight: element.fontWeight || 'normal',
                      fontStyle: element.fontStyle || 'normal',
                      color: element.color || '#000000',
                      textDecoration: element.textDecoration || 'none',
                      textAlign: element.textAlign || 'left',
                      lineHeight: '1.4',
                      display: 'inline-block',
                    }"
                  ></div>
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
                      textDecoration: element.textDecoration || 'none',
                      textAlign: element.textAlign || 'left',
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
          </div><!-- end stacked wrapper -->
        </div><!-- end stacked container -->

        <!-- Front/Back Toggle + Aspect Ratio Toggle - below postcard -->
        <div class="flex items-center justify-center gap-4 mt-4">
          <button
            @click="showFront = !showFront"
            class="relative flex items-center gap-1 px-1 py-1 rounded-full border-2 transition-all duration-500 focus:outline-none select-none"
            :class="showFront ? 'bg-white dark:bg-neutral border-black/15 dark:border-white/15' : 'bg-secondary/10 border-secondary/40'"
            style="width: 148px;"
          >
            <!-- Sliding pill indicator -->
            <span
              class="absolute top-1 bottom-1 w-[66px] rounded-full shadow-md transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)]"
              :class="showFront ? 'left-1 bg-primary dark:bg-white' : 'left-[75px] bg-secondary'"
            ></span>
            <!-- 正面 label -->
            <span
              class="relative z-10 flex-1 text-center text-xs font-bold tracking-wide transition-colors duration-300 py-1"
              :class="showFront ? 'text-white dark:text-neutral' : 'text-black/40 dark:text-white/40'"
            >正面</span>
            <!-- 反面 label -->
            <span
              class="relative z-10 flex-1 text-center text-xs font-bold tracking-wide transition-colors duration-300 py-1"
              :class="!showFront ? 'text-white' : 'text-black/40 dark:text-white/40'"
            >反面</span>
          </button>

          <!-- Aspect Ratio Toggle -->
          <button
            @click="toggleAspectRatio"
            class="relative flex items-center gap-1 px-1 py-1 rounded-full border-2 transition-all duration-500 focus:outline-none select-none"
            :class="postcardAspectRatio === '3/2' ? 'bg-white dark:bg-neutral border-black/15 dark:border-white/15' : 'bg-secondary/10 border-secondary/40'"
            style="width: 148px;"
            title="切换明信片比例"
          >
            <!-- Sliding pill indicator -->
            <span
              class="absolute top-1 bottom-1 w-[66px] rounded-full shadow-md transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)]"
              :class="postcardAspectRatio === '3/2' ? 'left-1 bg-primary dark:bg-white' : 'left-[75px] bg-secondary'"
            ></span>
            <!-- 3:2 label -->
            <span
              class="relative z-10 flex-1 text-center text-xs font-bold tracking-wide transition-colors duration-300 py-1"
              :class="postcardAspectRatio === '3/2' ? 'text-white dark:text-neutral' : 'text-black/40 dark:text-white/40'"
            >3:2</span>
            <!-- 2:3 label -->
            <span
              class="relative z-10 flex-1 text-center text-xs font-bold tracking-wide transition-colors duration-300 py-1"
              :class="postcardAspectRatio === '2/3' ? 'text-white' : 'text-black/40 dark:text-white/40'"
            >2:3</span>
          </button>
        </div>

        </div><!-- end sticky left column -->

        <!-- Right Column - Stamp Selection & Actions -->
        <div class="space-y-6" @click.stop>
          <!-- Add Elements Buttons -->
          <div class="space-y-3">
            <h3 class="font-headline text-lg font-bold text-primary">添加元素</h3>
            <div class="flex gap-2">
              <button
                @click.prevent="addTextElement(); showStickerPicker = false; showStampSelector = false;"
                type="button"
                class="flex-1 py-2 px-2 bg-primary dark:bg-secondary text-white dark:text-black font-bold rounded-lg hover:opacity-90 transition-opacity text-xs flex items-center justify-center gap-1"
                title="添加文字"
              >
                <Type class="w-4 h-4" />
                <span>文字</span>
              </button>
              <button
                @click.prevent="showStickerPicker = !showStickerPicker; showStampSelector = false; selectedElementIndex = -1;"
                type="button"
                class="flex-1 py-2 px-2 bg-primary dark:bg-secondary text-white dark:text-black font-bold rounded-lg hover:opacity-90 transition-opacity text-xs flex items-center justify-center gap-1"
                title="添加贴纸"
              >
                <Smile class="w-4 h-4" />
                <span>贴纸</span>
              </button>
              <!-- AI Agent Button - only enabled when a text element is selected -->
                  <button
                type="button"
                :disabled="!(selectedElementIndex !== -1 && interactiveElements[selectedElementIndex]?.type === 'text')"
                @click.prevent="showAiAgent = !showAiAgent; showStickerPicker = false; showStampSelector = false;"
                class="flex-1 py-2 px-2 font-bold rounded-lg text-xs flex items-center justify-center gap-1 transition-opacity"
                :class="selectedElementIndex !== -1 && interactiveElements[selectedElementIndex]?.type === 'text'
                  ? 'bg-primary dark:bg-secondary text-white dark:text-black hover:opacity-90 cursor-pointer'
                  : 'bg-black/20 dark:bg-white/20 text-black/40 dark:text-white/40 cursor-not-allowed'"
                title="AI智能体"
              >
                <Sparkles class="w-4 h-4" />
                <span>AI智能体</span>
                  </button>
            </div>
          </div>

          <!-- Sticker Picker Panel -->
          <div v-if="showStickerPicker" class="rounded-2xl border border-black/10 dark:border-white/10 shadow-sm">
            <div class="flex items-center justify-between px-4 py-3 bg-primary/5 dark:bg-white/5 border-b border-black/10 dark:border-white/10 rounded-t-2xl">
              <h3 class="text-sm font-bold text-primary dark:text-white tracking-wide">选择贴纸</h3>
              <button @click="showStickerPicker = false" class="w-6 h-6 rounded-full flex items-center justify-center text-black/30 dark:text-white/30 hover:text-black dark:hover:text-white hover:bg-black/10 dark:hover:bg-white/10 transition-colors text-sm">✕</button>
            </div>
            <!-- Series Tabs -->
            <div class="flex gap-1 px-3 pt-2 pb-1 bg-white dark:bg-neutral border-b border-black/5 dark:border-white/5">
                      <button
                v-for="series in stickerSeries"
                :key="series.value"
                @click="selectedStickerSeries = series.value"
                class="px-3 py-1 rounded-lg text-xs font-semibold transition-colors"
                :class="selectedStickerSeries === series.value ? 'bg-secondary text-white' : 'bg-black/5 dark:bg-white/5 text-black/50 dark:text-white/50 hover:bg-black/10 dark:hover:bg-white/10'"
              >{{ series.label }}</button>
                    </div>
            <!-- Grid: 3 cols, max 3 rows (9 items visible), rest scrollable -->
            <div class="p-3 bg-white dark:bg-neutral rounded-b-2xl">
              <div class="grid grid-cols-3 gap-2 overflow-y-auto" style="max-height: 210px;">
                      <button
                  v-for="(sticker, idx) in stickerOptions"
                  :key="idx"
                  @click.prevent="addStickerElement(sticker); showStickerPicker = false"
                  type="button"
                  class="group relative rounded-xl bg-black/5 dark:bg-white/5 hover:bg-secondary/10 border-2 border-transparent hover:border-secondary transition-all duration-200 flex items-center justify-center" style="height: 64px;"
                >
                  <img :src="sticker" :alt="`贴纸${idx + 1}`" class="w-full h-full object-contain p-1.5 group-hover:scale-110 transition-transform duration-200" />
                      </button>
                    </div>
                  </div>
                </div>

          <!-- AI Agent Panel -->
          <div v-if="selectedElementIndex !== -1 && interactiveElements[selectedElementIndex]?.type === 'text' && showAiAgent" class="space-y-3 p-4 bg-white dark:bg-neutral rounded-2xl border-2 border-secondary">
                </div>

          <!-- Combined Style & Picker Panel -->
          <div v-if="selectedElementIndex !== -1" class="rounded-2xl border border-black/10 dark:border-white/10 shadow-sm">
            <!-- Panel Header -->
            <div class="flex items-center justify-between px-4 py-3 bg-primary/5 dark:bg-white/5 border-b border-black/10 dark:border-white/10 rounded-t-2xl">
              <h3 class="text-sm font-bold text-primary dark:text-white tracking-wide">
                {{ interactiveElements[selectedElementIndex]?.type === 'text' ? '文字样式' : '贴纸样式' }}
              </h3>
              <button @click="selectedElementIndex = -1" class="w-6 h-6 rounded-full flex items-center justify-center text-black/30 dark:text-white/30 hover:text-black dark:hover:text-white hover:bg-black/10 dark:hover:bg-white/10 transition-colors text-sm">✕</button>
            </div>
            <div class="p-4 bg-white dark:bg-neutral space-y-4">
            <!-- Text Style Editor - Show when text element is selected -->
            <div v-if="interactiveElements[selectedElementIndex]?.type === 'text'" class="space-y-3">

              <!-- Row 1: Toolbar Buttons with tooltips -->
              <div class="flex items-center gap-0.5 p-1 bg-black/5 dark:bg-white/5 rounded-xl border border-secondary/20">
                <!-- Bold -->
                <div class="relative" @mouseenter="toolbarTooltip = 'bold'" @mouseleave="toolbarTooltip = null">
                <button
                  @click="interactiveElements[selectedElementIndex].fontWeight = interactiveElements[selectedElementIndex].fontWeight === 'bold' ? 'normal' : 'bold'"
                    :class="interactiveElements[selectedElementIndex].fontWeight === 'bold' ? 'bg-secondary/20 text-secondary' : 'text-black/60 dark:text-white/60 hover:bg-secondary/10'"
                    class="w-8 h-8 rounded-md flex items-center justify-center transition-colors font-bold text-sm"
                  ><Bold class="w-4 h-4" /></button>
                  <div v-if="toolbarTooltip === 'bold'" class="absolute bottom-10 left-1/2 -translate-x-1/2 whitespace-nowrap bg-gray-800 text-white text-xs rounded px-2 py-1 z-50 pointer-events-none">加粗</div>
                </div>

                <!-- Italic -->
                <div class="relative" @mouseenter="toolbarTooltip = 'italic'" @mouseleave="toolbarTooltip = null">
                <button
                  @click="interactiveElements[selectedElementIndex].fontStyle = interactiveElements[selectedElementIndex].fontStyle === 'italic' ? 'normal' : 'italic'"
                    :class="interactiveElements[selectedElementIndex].fontStyle === 'italic' ? 'bg-secondary/20 text-secondary' : 'text-black/60 dark:text-white/60 hover:bg-secondary/10'"
                    class="w-8 h-8 rounded-md flex items-center justify-center transition-colors italic text-sm"
                  ><Italic class="w-4 h-4" /></button>
                  <div v-if="toolbarTooltip === 'italic'" class="absolute bottom-10 left-1/2 -translate-x-1/2 whitespace-nowrap bg-gray-800 text-white text-xs rounded px-2 py-1 z-50 pointer-events-none">斜体</div>
                </div>

                <!-- Underline -->
                <div class="relative" @mouseenter="toolbarTooltip = 'underline'" @mouseleave="toolbarTooltip = null">
                <button
                    @click="interactiveElements[selectedElementIndex].textDecoration = interactiveElements[selectedElementIndex].textDecoration === 'underline' ? 'none' : 'underline'"
                    :class="interactiveElements[selectedElementIndex].textDecoration === 'underline' ? 'bg-secondary/20 text-secondary' : 'text-black/60 dark:text-white/60 hover:bg-secondary/10'"
                    class="w-8 h-8 rounded-md flex items-center justify-center transition-colors"
                  ><Underline class="w-4 h-4" /></button>
                  <div v-if="toolbarTooltip === 'underline'" class="absolute bottom-10 left-1/2 -translate-x-1/2 whitespace-nowrap bg-gray-800 text-white text-xs rounded px-2 py-1 z-50 pointer-events-none">下划线</div>
                </div>

                <!-- Strikethrough -->
                <div class="relative" @mouseenter="toolbarTooltip = 'strike'" @mouseleave="toolbarTooltip = null">
                  <button
                    @click="interactiveElements[selectedElementIndex].textDecoration = interactiveElements[selectedElementIndex].textDecoration === 'line-through' ? 'none' : 'line-through'"
                    :class="interactiveElements[selectedElementIndex].textDecoration === 'line-through' ? 'bg-secondary/20 text-secondary' : 'text-black/60 dark:text-white/60 hover:bg-secondary/10'"
                    class="w-8 h-8 rounded-md flex items-center justify-center transition-colors"
                  ><Strikethrough class="w-4 h-4" /></button>
                  <div v-if="toolbarTooltip === 'strike'" class="absolute bottom-10 left-1/2 -translate-x-1/2 whitespace-nowrap bg-gray-800 text-white text-xs rounded px-2 py-1 z-50 pointer-events-none">删除线</div>
                </div>

                <!-- Divider -->
                <div class="w-px h-6 bg-black/20 dark:bg-white/20 mx-1"></div>

                <!-- Align Left -->
                <div class="relative" @mouseenter="toolbarTooltip = 'alignLeft'" @mouseleave="toolbarTooltip = null">
                  <button
                    @click="interactiveElements[selectedElementIndex].textAlign = 'left'"
                    :class="(interactiveElements[selectedElementIndex].textAlign || 'left') === 'left' ? 'bg-secondary/20 text-secondary' : 'text-black/60 dark:text-white/60 hover:bg-secondary/10'"
                    class="w-8 h-8 rounded-md flex items-center justify-center transition-colors"
                  ><AlignLeft class="w-4 h-4" /></button>
                  <div v-if="toolbarTooltip === 'alignLeft'" class="absolute bottom-10 left-1/2 -translate-x-1/2 whitespace-nowrap bg-gray-800 text-white text-xs rounded px-2 py-1 z-50 pointer-events-none">左对齐</div>
                </div>

                <!-- Align Center -->
                <div class="relative" @mouseenter="toolbarTooltip = 'alignCenter'" @mouseleave="toolbarTooltip = null">
                  <button
                    @click="interactiveElements[selectedElementIndex].textAlign = 'center'"
                    :class="interactiveElements[selectedElementIndex].textAlign === 'center' ? 'bg-secondary/20 text-secondary' : 'text-black/60 dark:text-white/60 hover:bg-secondary/10'"
                    class="w-8 h-8 rounded-md flex items-center justify-center transition-colors"
                  ><AlignCenter class="w-4 h-4" /></button>
                  <div v-if="toolbarTooltip === 'alignCenter'" class="absolute bottom-10 left-1/2 -translate-x-1/2 whitespace-nowrap bg-gray-800 text-white text-xs rounded px-2 py-1 z-50 pointer-events-none">居中</div>
                </div>

                <!-- Align Right -->
                <div class="relative" @mouseenter="toolbarTooltip = 'alignRight'" @mouseleave="toolbarTooltip = null">
                  <button
                    @click="interactiveElements[selectedElementIndex].textAlign = 'right'"
                    :class="interactiveElements[selectedElementIndex].textAlign === 'right' ? 'bg-secondary/20 text-secondary' : 'text-black/60 dark:text-white/60 hover:bg-secondary/10'"
                    class="w-8 h-8 rounded-md flex items-center justify-center transition-colors"
                  ><AlignRight class="w-4 h-4" /></button>
                  <div v-if="toolbarTooltip === 'alignRight'" class="absolute bottom-10 left-1/2 -translate-x-1/2 whitespace-nowrap bg-gray-800 text-white text-xs rounded px-2 py-1 z-50 pointer-events-none">右对齐</div>
                </div>
              </div>

              <!-- Row 2: Font Family + Font Size Buttons -->
              <div class="flex items-center gap-2 flex-wrap">
                <!-- Font Family Dropdown -->
                <div id="font-dropdown-wrapper" class="relative flex-1">
                  <button
                    @click.stop="showFontDropdown = !showFontDropdown"
                    class="w-full px-3 py-1.5 text-xs border border-black/15 dark:border-white/15 rounded-lg bg-black/5 dark:bg-white/5 text-black dark:text-white font-medium hover:bg-black/10 dark:hover:bg-white/10 transition-colors flex items-center justify-between gap-1.5"
                  >
                    <span>{{ fontDisplayName }}</span>
                    <svg :class="showFontDropdown ? 'rotate-180' : ''" class="w-3 h-3 opacity-50 transition-transform flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                    </svg>
                </button>
                  <div v-if="showFontDropdown" class="absolute left-0 top-full mt-1 w-48 bg-white dark:bg-neutral border border-black/10 dark:border-white/10 rounded-xl shadow-lg z-50 max-h-64 overflow-y-auto">
                    <div class="px-3 py-2 border-b border-black/10 dark:border-white/10">
                      <p class="text-xs font-bold text-secondary mb-2">中文字体</p>
                      <button v-for="font in chineseFonts" :key="font.value"
                        @click="interactiveElements[selectedElementIndex].fontFamily = font.value; showFontDropdown = false"
                        :class="interactiveElements[selectedElementIndex].fontFamily === font.value ? 'bg-secondary text-white' : 'hover:bg-secondary/10'"
                        class="w-full text-left px-3 py-1.5 rounded-lg text-xs transition-colors mb-0.5"
                        :style="{ fontFamily: font.value }"
                      >{{ font.label }}</button>
                    </div>
                    <div class="px-3 py-2">
                      <p class="text-xs font-bold text-secondary mb-2">英文字体</p>
                      <button v-for="font in englishFonts" :key="font.value"
                        @click="interactiveElements[selectedElementIndex].fontFamily = font.value; showFontDropdown = false"
                        :class="interactiveElements[selectedElementIndex].fontFamily === font.value ? 'bg-secondary text-white' : 'hover:bg-secondary/10'"
                        class="w-full text-left px-3 py-1.5 rounded-lg text-xs transition-colors mb-0.5"
                        :style="{ fontFamily: font.value }"
                      >{{ font.label }}</button>
                    </div>
                  </div>
              </div>

                <!-- Font Size A- / display / A+ -->
                <div class="flex items-center gap-1">
                <button
                    @click="interactiveElements[selectedElementIndex].fontSize = Math.max(8, (interactiveElements[selectedElementIndex].fontSize || 16) - 2)"
                    class="w-8 h-8 rounded-lg bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 flex items-center justify-center hover:bg-black/10 dark:hover:bg-white/10 transition-colors text-xs font-bold text-black/60 dark:text-white/60"
                    title="缩小文字"
                  ><span class="text-xs">A-</span></button>
                  <span class="text-xs font-semibold text-black/50 dark:text-white/50 w-6 text-center">{{ interactiveElements[selectedElementIndex].fontSize || 16 }}</span>
                <button
                    @click="interactiveElements[selectedElementIndex].fontSize = Math.min(72, (interactiveElements[selectedElementIndex].fontSize || 16) + 2)"
                    class="w-8 h-8 rounded-lg bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 flex items-center justify-center hover:bg-black/10 dark:hover:bg-white/10 transition-colors text-xs font-bold text-black/60 dark:text-white/60"
                    title="放大文字"
                  ><span class="text-xs">A+</span></button>
                </div>
              </div>

              <!-- Row 3: Color Palette -->
              <div class="space-y-1.5">
                  <span class="text-xs font-semibold text-secondary">文字颜色</span>
                <div class="flex gap-2 flex-wrap p-2 border-2 border-dashed border-secondary/40 rounded-xl bg-white dark:bg-neutral">
                  <button
                    v-for="color in ['#000000', '#FF0000', '#00B050', '#0070C0', '#FFC000', '#7030A0', '#FF6B6B', '#4ECDC4']"
                    :key="color"
                    @click="interactiveElements[selectedElementIndex].color = color"
                    :class="interactiveElements[selectedElementIndex].color === color ? 'ring-2 ring-offset-2 ring-secondary scale-110' : ''"
                    class="w-7 h-7 rounded-lg border-2 border-white/50 shadow transition-all hover:scale-110"
                    :style="{ backgroundColor: color }"
                  ></button>
                  <!-- Custom color picker with floating preview -->
                  <div class="relative">
                    <label class="w-7 h-7 rounded-lg border-2 border-secondary cursor-pointer hover:scale-110 transition-all flex items-center justify-center bg-white dark:bg-neutral">
                    <input
                      type="color"
                      :value="interactiveElements[selectedElementIndex].color || '#000000'"
                        @input="interactiveElements[selectedElementIndex].color = ($event.target as HTMLInputElement).value"
                        class="absolute opacity-0 w-0 h-0"
                        @focus="showCustomColorPicker = true"
                        @blur="showCustomColorPicker = false"
                        ref="colorPickerInput"
                      />
                      <span class="text-base leading-none select-none" @click="($refs.colorPickerInput as HTMLInputElement)?.click()">+</span>
                  </label>
                    <!-- Floating color indicator -->
                    <div
                      v-if="interactiveElements[selectedElementIndex].color && !['#000000','#FF0000','#00B050','#0070C0','#FFC000','#7030A0','#FF6B6B','#4ECDC4'].includes(interactiveElements[selectedElementIndex].color)"
                      class="absolute -top-9 left-1/2 -translate-x-1/2 flex flex-col items-center gap-0.5 pointer-events-none"
                    >
                      <div
                        class="w-6 h-6 rounded-md shadow-md border-2 border-white"
                        :style="{ backgroundColor: interactiveElements[selectedElementIndex].color }"
                      ></div>
                      <div class="w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-white"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Sticker Picker - Show when sticker element is selected -->
            <div v-else-if="interactiveElements[selectedElementIndex]?.type === 'sticker'" class="space-y-2">
              <!-- Series Tabs -->
              <div class="flex gap-1">
                <button
                  v-for="series in stickerSeries"
                  :key="series.value"
                  @click="selectedStickerSeries = series.value"
                  class="px-3 py-1 rounded-lg text-xs font-semibold transition-colors"
                  :class="selectedStickerSeries === series.value ? 'bg-secondary text-white' : 'bg-black/5 dark:bg-white/5 text-black/50 dark:text-white/50 hover:bg-black/10 dark:hover:bg-white/10'"
                >{{ series.label }}</button>
              </div>
              <div class="grid grid-cols-3 gap-2 overflow-y-auto" style="max-height: 210px;">
                <button
                  v-for="(sticker, index) in stickerOptions"
                  :key="index"
                  @click="interactiveElements[selectedElementIndex].content = sticker"
                  class="group relative rounded-xl bg-black/5 dark:bg-white/5 border-2 transition-all duration-200 flex items-center justify-center" style="height: 64px;"
                  :class="interactiveElements[selectedElementIndex].content === sticker ? 'border-secondary bg-secondary/10' : 'border-transparent hover:border-secondary/50'"
                >
                  <img :src="sticker" :alt="`Sticker ${index + 1}`" class="w-full h-full object-contain p-1.5 group-hover:scale-110 transition-transform duration-200" />
                  <div v-if="interactiveElements[selectedElementIndex].content === sticker" class="absolute top-1 right-1 w-4 h-4 bg-secondary rounded-full flex items-center justify-center">
                    <Check class="w-2.5 h-2.5 text-white" />
                  </div>
                </button>
              </div>
              </div>
            </div>
          </div>

          <!-- Stamp Selector -->
          <div v-if="showStampSelector" class="rounded-2xl border border-black/10 dark:border-white/10 shadow-sm">
            <div class="flex items-center justify-between px-4 py-3 bg-primary/5 dark:bg-white/5 border-b border-black/10 dark:border-white/10 rounded-t-2xl">
              <h3 class="text-sm font-bold text-primary dark:text-white tracking-wide">选择邮票</h3>
              <button @click="showStampSelector = false" class="w-6 h-6 rounded-full flex items-center justify-center text-black/30 dark:text-white/30 hover:text-black dark:hover:text-white hover:bg-black/10 dark:hover:bg-white/10 transition-colors text-sm">✕</button>
            </div>
            <div class="p-3 bg-white dark:bg-neutral">
              <p v-if="myStamps.length === 0" class="text-xs text-black/40 dark:text-white/40 text-center py-8">还没有购入邮票，请先去商店购买</p>
              <div v-else class="grid grid-cols-3 gap-2 max-h-72 overflow-y-auto">
              <button
                v-for="stamp in myStamps"
                :key="stamp.id"
                @click="selectStamp(stamp)"
                class="group relative rounded-xl border-2 transition-all duration-200 flex items-center justify-center bg-black/5 dark:bg-white/5 aspect-square"
                :class="selectedStamp?.id === stamp.id ? 'border-secondary shadow-md' : 'border-transparent hover:border-secondary/50'"
              >
                <img :src="stamp.image" :alt="stamp.title" class="w-full h-full object-contain p-1.5 group-hover:scale-105 transition-transform duration-200" />
                <div class="absolute bottom-0 left-0 right-0 px-1 py-1">
                  <p class="text-xs font-semibold truncate text-black/70 dark:text-white/70 text-center bg-white/50 dark:bg-black/50 backdrop-blur-sm rounded">{{ stamp.title }}</p>
                </div>
                <div v-if="selectedStamp?.id === stamp.id" class="absolute top-1.5 right-1.5 w-5 h-5 bg-secondary rounded-full flex items-center justify-center shadow">
                  <Check class="w-3 h-3 text-white" />
                </div>
              </button>
            </div>
            </div>
          </div>

          <!-- Postcard Info Section -->
          <div class="space-y-4 p-4 bg-white dark:bg-neutral rounded-2xl border border-black/10 dark:border-white/10">
            <!-- Title Input -->
            <div class="space-y-2">
              <label class="text-sm font-bold text-primary dark:text-white">邮件标题：</label>
              <input
                v-model="postcardTitle"
                type="text"
                placeholder="输入明信片标题"
                class="w-full px-3 py-2 border border-black/10 dark:border-white/10 rounded-lg bg-black/5 dark:bg-white/5 text-black dark:text-white placeholder-black/40 dark:placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-secondary"
              />
            </div>

            <!-- Recipient Input -->
            <div class="space-y-2">
              <label class="text-sm font-bold text-primary dark:text-white">收件人：</label>
              <div class="flex gap-2">
                <input
                  v-model="recipientInput"
                  type="text"
                  placeholder="输入uid/邮箱"
                  class="flex-1 px-3 py-2 border border-black/10 dark:border-white/10 rounded-lg bg-black/5 dark:bg-white/5 text-black dark:text-white placeholder-black/40 dark:placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-secondary"
                />
                <button
                  @click="showFriendSelector = !showFriendSelector"
                  class="px-3 py-2 bg-primary dark:bg-secondary text-white dark:text-black font-bold rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center"
                  title="快速选择好友"
                >
                  <Users class="w-5 h-5" />
                </button>
              </div>
            </div>

            <!-- Public to Square Checkbox -->
            <div class="flex items-center gap-2">
              
              <label for="publicCheckbox" class="text-sm font-medium text-black/70 dark:text-white/70 cursor-pointer">
                公开到广场
              </label>
              <input
                v-model="isPublicToSquare"
                type="checkbox"
                id="publicCheckbox"
                class="w-4 h-4 rounded border-2 border-primary dark:border-secondary cursor-pointer accent-primary dark:accent-secondary"
              />
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="flex gap-3">
            <button
              @click="showResetDialog = true"
              class="flex-1 py-3 px-4 bg-black/5 dark:bg-white/5 text-primary font-bold rounded-xl hover:bg-black/10 dark:hover:bg-white/10 transition-colors border-2 border-primary"
            >
              删除
            </button>
            <button
              @click="publishPostcard"
              :disabled="!selectedImage"
              class="flex-1 py-3 px-4 bg-primary dark:bg-secondary text-white dark:text-black font-bold rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
            >
              确认发送
            </button>
          </div>
        </div>
      </div>
    </main>

    <!-- Reset Confirm Dialog -->
    <transition name="fade">
      <div v-if="showResetDialog" class="fixed inset-0 z-[100] flex items-center justify-center p-4" @click.self="showResetDialog = false">
        <!-- Backdrop -->
        <div class="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>
        <!-- Dialog -->
        <div class="relative bg-white dark:bg-neutral rounded-2xl shadow-2xl p-6 w-full max-w-xs mx-auto">
          <div class="flex flex-col items-center gap-3 mb-5">
            <div class="w-12 h-12 rounded-full bg-red-50 dark:bg-red-900/20 flex items-center justify-center">
              <Trash2 class="w-6 h-6 text-red-500" />
            </div>
            <h3 class="text-base font-bold text-primary dark:text-white">确认清空？</h3>
            <p class="text-xs text-black/50 dark:text-white/50 text-center">所有内容将被清除，包括图片、文字和贴纸，此操作不可撤销。</p>
          </div>
          <div class="flex gap-3">
            <button
              @click="showResetDialog = false"
              class="flex-1 py-2.5 rounded-xl border-2 border-black/10 dark:border-white/10 text-sm font-semibold text-black/60 dark:text-white/60 hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
            >取消</button>
            <button
              @click="resetUpload(); showResetDialog = false"
              class="flex-1 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white text-sm font-bold transition-colors"
            >确认清空</button>
          </div>
        </div>
      </div>
    </transition>

    <!-- Publish Preview Dialog -->
    <transition name="fade">
      <div v-if="showPublishDialog" class="fixed inset-0 z-[100] flex items-center justify-center p-4" @click.self="showPublishDialog = false">
        <div class="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>
        <div class="relative bg-white dark:bg-neutral rounded-2xl shadow-2xl w-full max-w-lg mx-auto overflow-hidden">
          <!-- Header -->
          <div class="flex items-center justify-between px-6 py-4 border-b border-black/10 dark:border-white/10">
            <h3 class="font-headline text-lg font-bold text-primary dark:text-white">预览明信片</h3>
            <button @click="showPublishDialog = false" class="w-8 h-8 rounded-full flex items-center justify-center text-black/30 dark:text-white/30 hover:bg-black/10 dark:hover:bg-white/10 transition-colors">✕</button>
          </div>

          <!-- Postcard Preview -->
          <div class="px-6 py-6 flex justify-center">
            <div class="relative cursor-pointer" :style="{ width: '100%', maxWidth: '300px', aspectRatio: postcardAspectRatio }" @click="publishFlipped = !publishFlipped">
              <!-- Back (text side) -->
              <div
                :class="[
                  'absolute inset-0 bg-white dark:bg-neutral border border-black/10 dark:border-white/10 transition-all duration-500 shadow-inner overflow-hidden',
                  publishFlipped ? 'translate-x-3 translate-y-3 rotate-1 shadow-md z-0' : '-translate-x-3 -translate-y-3 -rotate-1 shadow-xl z-10'
                ]"
                ref="publishBackRef"
              >
                <!-- Scale wrapper -->
                <div
                  class="absolute top-0 left-0 origin-top-left"
                  :style="getPublishBackScaleStyle()"
                >
                  <div
                    class="flex p-5 bg-white dark:bg-neutral"
                    :style="{ width: (postcardCanvasRef ? postcardCanvasRef.offsetWidth : 600) + 'px', height: (postcardCanvasRef ? postcardCanvasRef.offsetHeight : 400) + 'px' }"
                  >
                    <!-- Left Side -->
                    <div class="flex-1 flex flex-col pr-5 border-r border-black/20 dark:border-white/20 overflow-hidden relative">
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
                    <!-- Right Side -->
                    <div class="flex-1 flex flex-col pl-5 relative">
                      <div class="flex justify-end relative mb-4">
                        <div v-if="selectedStamp" class="absolute -top-4 -right-4 w-32 h-32 flex items-center justify-center" style="filter: drop-shadow(2px 4px 6px rgba(230, 220, 200, 0.8));">
                          <img :src="selectedStamp.image" class="w-full h-full object-cover" />
                        </div>
                        <div v-else class="w-20 h-24 border-[2px] border-dashed border-black/30 dark:border-white/30 flex items-center justify-center bg-black/5">
                          <span class="text-xs font-bold text-black/40">邮票</span>
                        </div>
                      </div>
                      <div class="flex-1 flex flex-col justify-end gap-4 pb-2">
                        <div class="flex items-end gap-3"><span class="text-xs text-black/60 font-body">to:</span><div class="flex-1 h-[1px] bg-black/20"></div></div>
                        <div class="w-full h-[1px] bg-black/20 mt-3"></div>
                        <div class="flex items-end gap-3"><span class="text-xs text-black/60 font-body">from:</span><div class="flex-1 h-[1px] bg-black/20"></div></div>
                        <div class="w-full h-[1px] bg-black/20"></div>
                      </div>
                    </div>
                    <!-- Interactive elements -->
                    <div
                      v-for="(el, idx) in interactiveElements"
                      :key="idx"
                      class="absolute pointer-events-none"
                      :style="{
                        left: el.x + 'px', top: el.y + 'px',
                        transform: `rotate(${el.rotation}deg) scale(${el.scale || 1})`,
                        transformOrigin: 'top left',
                        width: el.type === 'text' ? 'auto' : el.width + 'px',
                        height: el.type === 'text' ? 'auto' : el.height + 'px',
                        zIndex: idx + 10
                      }"
                    >
                      <span v-if="el.type === 'text'" :style="{ fontFamily: el.fontFamily, fontSize: el.fontSize + 'px', color: el.color, fontWeight: el.fontWeight, fontStyle: el.fontStyle }">{{ el.content }}</span>
                      <img v-else-if="el.type === 'sticker'" :src="el.content" class="w-full h-full object-contain" />
                    </div>
                  </div>
                </div>
              </div>
              <!-- Front (image side) -->
              <div
                :class="[
                  'absolute inset-0 bg-white dark:bg-neutral p-2 transition-all duration-500',
                  publishFlipped ? '-translate-x-3 -translate-y-3 -rotate-1 shadow-xl z-10' : 'translate-x-3 translate-y-3 rotate-1 shadow-md z-0'
                ]"
              >
                <div class="w-full h-full relative overflow-hidden border border-black/5">
                  <img v-if="selectedImage" :src="selectedImage" class="w-full h-full object-cover"
                    :style="{ transform: `translate(${imageOffset.x}px, ${imageOffset.y}px) scale(${imageScale}) rotate(${imageRotation}deg)` }"
                  />
                </div>
              </div>
            </div>
            <!-- <p class="text-center text-xs text-black/40 dark:text-white/40 mt-3">点击明信片可翻转查看</p> -->
          </div>

          <!-- Actions -->
          <div class="px-6 pb-6 flex gap-3">
            <button
              @click="showPublishDialog = false"
              class="flex-1 py-3 rounded-xl border-2 border-black/10 dark:border-white/10 text-sm font-semibold text-black/60 dark:text-white/60 hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
            >再改改</button>
            <button
              @click="confirmPublish"
              class="flex-1 py-3 rounded-xl bg-primary dark:bg-secondary text-white dark:text-black text-sm font-bold hover:opacity-90 transition-opacity"
            >确认发布</button>
          </div>
        </div>
      </div>
    </transition>

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
import { ref, onMounted, computed, watch, nextTick } from "vue";
import { useRouter } from "vue-router";
import { ElMessage } from "element-plus";
import { ChevronLeft, Camera, Image, Check, Type, Smile, Bold, Italic, Palette, Trash2, ArrowUp, ArrowDown, RotateCw, Sparkles, Underline, Strikethrough, AlignLeft, AlignCenter, AlignRight, Users } from "lucide-vue-next";

const showUploadOptions = ref(false);
const postcardCanvasRef = ref<HTMLElement | null>(null);
const publishBackRef = ref<HTMLElement | null>(null);
const postcardTitle = ref('');
const recipientInput = ref('');
const isPublicToSquare = ref(false);
const showFriendSelector = ref(false);

const getPublishBackScaleStyle = () => {
  const src = postcardCanvasRef.value;
  const dst = publishBackRef.value;
  const srcW = src ? src.offsetWidth : 600;
  const srcH = src ? src.offsetHeight : 400;
  const dstW = dst ? dst.offsetWidth : srcW;
  const dstH = dst ? dst.offsetHeight : srcH;
  const scale = Math.min(dstW / srcW, dstH / srcH);
  return {
    width: srcW + 'px',
    height: srcH + 'px',
    transform: `scale(${scale})`,
    transformOrigin: 'top left',
  };
};
const showStampSelector = ref(false);
const showStickerPicker = ref(false);
const showAiAgent = ref(false);
const showResetDialog = ref(false);
const showPublishDialog = ref(false);
const publishFlipped = ref(false);
const router = useRouter();
const showColorPicker = ref(false);
const showFontDropdown = ref(false);
const toolbarTooltip = ref<string | null>(null);
const showFront = ref(true); // true=正面, false=反面
const postcardAspectRatio = ref('3/2'); // 明信片比例
const textEditRefs = ref<Record<number, HTMLElement>>({});
const selectedImage = ref<string | null>(null);
const cameraInput = ref<HTMLInputElement>();
const galleryInput = ref<HTMLInputElement>();
const imageOffset = ref({ x: 0, y: 0 });
const imageScale = ref(1);
const imageRotation = ref(0);
const showImageControls = ref(false);
const isDragging = ref(false);
const dragStart = ref({ x: 0, y: 0 });
const selectedStamp = ref<any>(null);
const myStamps = ref<any[]>([]);
const interactiveElements = ref<any[]>([]);
const selectedElementIndex = ref(-1);
const selectedStickerSeries = ref('arrow');
const stickerSeries = [
  { label: '箭头', value: 'arrow' },
  { label: '动物', value: 'animal' },
  { label: '狗狗剪影', value: 'dog_silhouette' },
  { label: '涂鸦', value: 'graffiti' },
];
const stickerSeriesOptions: Record<string, string[]> = {
  arrow: [
    '/stickers/arrow/BgSub_1.png',
    '/stickers/arrow/BgSub_2.png',
    '/stickers/arrow/BgSub_3.png',
    '/stickers/arrow/BgSub_4.png',
    '/stickers/arrow/BgSub_5.png',
    '/stickers/arrow/BgSub_6 (1).png',
    '/stickers/arrow/BgSub_6 (2).png',
    '/stickers/arrow/BgSub_6 (3).png',
    '/stickers/arrow/BgSub_6 (4).png',
    '/stickers/arrow/BgSub_6 (5).png',
    '/stickers/arrow/BgSub_6 (6).png',
    '/stickers/arrow/BgSub_6 (7).png',
    '/stickers/arrow/BgSub_6 (8).png',
    '/stickers/arrow/BgSub_6 (9).png',
    '/stickers/arrow/BgSub_6 (10).png',
    '/stickers/arrow/BgSub_6 (11).png',
    '/stickers/arrow/BgSub_6 (12).png',
    '/stickers/arrow/BgSub_6 (13).png',
    '/stickers/arrow/BgSub_6 (14).png',
    '/stickers/arrow/BgSub_6 (15).png',
  ],
  animal: [
    new URL('../../../res/sticker/animal/企鹅.png', import.meta.url).href,
    new URL('../../../res/sticker/animal/刺猬.png', import.meta.url).href,
    new URL('../../../res/sticker/animal/小兔.png', import.meta.url).href,
    new URL('../../../res/sticker/animal/小熊.png', import.meta.url).href,
    new URL('../../../res/sticker/animal/小牛.png', import.meta.url).href,
    new URL('../../../res/sticker/animal/小狗.png', import.meta.url).href,
    new URL('../../../res/sticker/animal/小猪.png', import.meta.url).href,
    new URL('../../../res/sticker/animal/小猫.png', import.meta.url).href,
    new URL('../../../res/sticker/animal/小猴.png', import.meta.url).href,
    new URL('../../../res/sticker/animal/小羊.png', import.meta.url).href,
    new URL('../../../res/sticker/animal/小虎.png', import.meta.url).href,
    new URL('../../../res/sticker/animal/小蛇.png', import.meta.url).href,
    new URL('../../../res/sticker/animal/小马.png', import.meta.url).href,
    new URL('../../../res/sticker/animal/小鸡.png', import.meta.url).href,
    new URL('../../../res/sticker/animal/小鹿.png', import.meta.url).href,
    new URL('../../../res/sticker/animal/小鼠.png', import.meta.url).href,
    new URL('../../../res/sticker/animal/小龙.png', import.meta.url).href,
    new URL('../../../res/sticker/animal/松鼠.png', import.meta.url).href,
    new URL('../../../res/sticker/animal/树懒.png', import.meta.url).href,
    new URL('../../../res/sticker/animal/狐狸.png', import.meta.url).href,
    new URL('../../../res/sticker/animal/独角兽.png', import.meta.url).href,
    new URL('../../../res/sticker/animal/考拉.png', import.meta.url).href,
    new URL('../../../res/sticker/animal/鹦鹉.png', import.meta.url).href,
    new URL('../../../res/sticker/animal/小象.png', import.meta.url).href,
  ],
  dog_silhouette: [
    new URL('../../../res/sticker/dog_silhouette/1.png', import.meta.url).href,
    new URL('../../../res/sticker/dog_silhouette/2.png', import.meta.url).href,
    new URL('../../../res/sticker/dog_silhouette/3.png', import.meta.url).href,
    new URL('../../../res/sticker/dog_silhouette/4.png', import.meta.url).href,
    new URL('../../../res/sticker/dog_silhouette/5.png', import.meta.url).href,
    new URL('../../../res/sticker/dog_silhouette/6.png', import.meta.url).href,
    new URL('../../../res/sticker/dog_silhouette/7.png', import.meta.url).href,
    new URL('../../../res/sticker/dog_silhouette/8.png', import.meta.url).href,
    new URL('../../../res/sticker/dog_silhouette/9.png', import.meta.url).href,
  ],
  graffiti: [
    new URL('../../../res/sticker/graffiti/涂鸦1.png', import.meta.url).href,
    new URL('../../../res/sticker/graffiti/涂鸦2.png', import.meta.url).href,
    new URL('../../../res/sticker/graffiti/涂鸦3.png', import.meta.url).href,
    new URL('../../../res/sticker/graffiti/涂鸦4.png', import.meta.url).href,
    new URL('../../../res/sticker/graffiti/涂鸦5.png', import.meta.url).href,
    new URL('../../../res/sticker/graffiti/涂鸦6.png', import.meta.url).href,
    new URL('../../../res/sticker/graffiti/涂鸦7.png', import.meta.url).href,
    new URL('../../../res/sticker/graffiti/涂鸦8.png', import.meta.url).href,
    new URL('../../../res/sticker/graffiti/涂鸦9.png', import.meta.url).href,
    new URL('../../../res/sticker/graffiti/涂鸦10.png', import.meta.url).href,
    new URL('../../../res/sticker/graffiti/涂鸦11.png', import.meta.url).href,
    new URL('../../../res/sticker/graffiti/涂鸦12.png', import.meta.url).href,
    new URL('../../../res/sticker/graffiti/涂鸦13.png', import.meta.url).href,
  ],
};
const stickerOptions = computed(() => stickerSeriesOptions[selectedStickerSeries.value] || []);

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
  // 自定义字体
  { label: '三极速线简体', value: 'SanJiSuXianJianTi' },
  { label: '沐瑶软笔手写体', value: 'MuyaoSoftbrush' },
  { label: '思源黑体CN', value: 'SourceHanSansCN' },
  { label: '得意黑', value: 'SmileySans' },
  { label: '钉铃珠海字体', value: 'DingliZhuhaiFont' },
  { label: '黄楷华律师字体', value: 'HuangkaihuaLawyer' },
  { label: 'Yomogi', value: 'Yomogi' },
  { label: '今年也要加油鸭', value: 'JinNianYeYaoJiaYouYa' },
  { label: '博塔', value: 'BoTa' },
  { label: '铅图笔锋手写体', value: 'QianTuBiFengShouXieTi' },
  { label: '晴松手写体', value: 'QingSongShouXieTi' },
  { label: '仓迹高德国妙黑', value: 'CangJiGaoDeGuoMiaoHei' },
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

// 监听选中元素变化，初始化文字内容和光标
watch(selectedElementIndex, async (newIndex) => {
  if (newIndex === -1) return;
  const el = interactiveElements.value[newIndex];
  if (!el || el.type !== 'text') return;
  await nextTick();
  const div = textEditRefs.value[newIndex];
  if (!div) return;
  // 只在内容不同时设置，避免打断正在输入
  if (div.innerText !== el.content) {
    div.innerText = el.content || '';
  }
  div.focus();
  // 光标移到末尾
  const range = document.createRange();
  const sel = window.getSelection();
  if (div.childNodes.length > 0) {
    range.selectNodeContents(div);
    range.collapse(false);
    sel?.removeAllRanges();
    sel?.addRange(range);
  }
});

onMounted(() => {
  loadMyStamps();
  
  // Close font dropdown when clicking outside
  document.addEventListener('click', (e) => {
    const target = e.target as Node;
    const fontDropdownEl = document.getElementById('font-dropdown-wrapper');
    if (fontDropdownEl && !fontDropdownEl.contains(target)) {
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
    document.removeEventListener('mouseleave', handleEnd);
    window.removeEventListener('blur', handleEnd);
  };
  
  document.addEventListener('mousemove', handleMove);
  document.addEventListener('touchmove', handleMove, { passive: false });
  document.addEventListener('mouseup', handleEnd);
  document.addEventListener('touchend', handleEnd);
  document.addEventListener('mouseleave', handleEnd);
  window.addEventListener('blur', handleEnd);
};

const addTextElement = () => {
  showFront.value = false;
  // 先取消当前选中，blur 旧文本框
  if (selectedElementIndex.value !== -1 && textEditRefs.value[selectedElementIndex.value]) {
    textEditRefs.value[selectedElementIndex.value].blur();
  }
  selectedElementIndex.value = -1;
  const newIndex = interactiveElements.value.length;
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
  nextTick(() => {
    selectedElementIndex.value = newIndex;
    const el = textEditRefs.value[newIndex];
    if (el) {
      el.innerText = '输入文字';
      el.focus();
      // 将光标移到末尾
      const range = document.createRange();
      const sel = window.getSelection();
      range.selectNodeContents(el);
      range.collapse(false);
      sel?.removeAllRanges();
      sel?.addRange(range);
    }
  });
};

const addStickerElement = (stickerUrl: string) => {
  showFront.value = false;
  const newIndex = interactiveElements.value.length;
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
  nextTick(() => {
    selectedElementIndex.value = newIndex;
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

// Vertical scale slider drag
const startScaleDragV = (e: MouseEvent) => {
  e.preventDefault();
  const track = e.currentTarget as HTMLElement;
  const rect = track.getBoundingClientRect();
  const SNAP_ZONE = 0.04;

  const update = (clientY: number) => {
    // top = max (3x), bottom = min (0.5x)
    const ratio = 1 - Math.max(0, Math.min(1, (clientY - rect.top) / rect.height));
    let val = 0.5 + ratio * 2.5;
    if (Math.abs(val - 1) < SNAP_ZONE) val = 1;
    imageScale.value = Math.round(val * 1000) / 1000;
  };

  update(e.clientY);
  const onMove = (me: MouseEvent) => update(me.clientY);
  const onUp = () => {
    document.removeEventListener('mousemove', onMove);
    document.removeEventListener('mouseup', onUp);
  };
  document.addEventListener('mousemove', onMove);
  document.addEventListener('mouseup', onUp);
};

// Vertical rotation slider drag (-180 ~ 180, snap at 0°/±90°/±180°)
const startRotateDragV = (e: MouseEvent) => {
  e.preventDefault();
  const track = e.currentTarget as HTMLElement;
  const rect = track.getBoundingClientRect();
  const SNAP_ZONE = 5;
  const SNAP_ANGLES = [-180, -90, 0, 90, 180];

  const update = (clientY: number) => {
    // top = -180°, center = 0°, bottom = +180°
    const ratio = Math.max(0, Math.min(1, (clientY - rect.top) / rect.height));
    let val = (ratio - 0.5) * 360;
    val = Math.max(-180, Math.min(180, val));
    for (const snap of SNAP_ANGLES) {
      if (Math.abs(val - snap) < SNAP_ZONE) { val = snap; break; }
    }
    imageRotation.value = Math.round(val * 10) / 10;
  };

  update(e.clientY);
  const onMove = (me: MouseEvent) => update(me.clientY);
  const onUp = () => {
    document.removeEventListener('mousemove', onMove);
    document.removeEventListener('mouseup', onUp);
  };
  document.addEventListener('mousemove', onMove);
  document.addEventListener('mouseup', onUp);
};

// Image scale slider drag (0.5x ~ 3x, snap at 1x)
const startScaleDrag = (e: MouseEvent) => {
  e.preventDefault();
  const track = (e.currentTarget as HTMLElement);
  const rect = track.getBoundingClientRect();
  const SNAP_ZONE = 0.04;

  const updateScale = (clientX: number) => {
    const ratio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    let val = 0.5 + ratio * 2.5;
    if (Math.abs(val - 1) < SNAP_ZONE) val = 1;
    imageScale.value = Math.round(val * 1000) / 1000;
  };

  updateScale(e.clientX);

  const onMove = (me: MouseEvent) => updateScale(me.clientX);
  const onUp = () => {
    document.removeEventListener('mousemove', onMove);
    document.removeEventListener('mouseup', onUp);
  };
  document.addEventListener('mousemove', onMove);
  document.addEventListener('mouseup', onUp);
};

// Image rotation slider drag (-180 ~ 180, snap at 0°, ±90°, ±180°)
const startRotateDrag = (e: MouseEvent) => {
  e.preventDefault();
  const track = (e.currentTarget as HTMLElement);
  const rect = track.getBoundingClientRect();
  const SNAP_ZONE = 5;
  const SNAP_ANGLES = [-180, -90, 0, 90, 180];

  const updateRotation = (clientX: number) => {
    const ratio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    let val = (ratio - 0.5) * 360;
    val = Math.max(-180, Math.min(180, val));
    for (const snap of SNAP_ANGLES) {
      if (Math.abs(val - snap) < SNAP_ZONE) { val = snap; break; }
    }
    imageRotation.value = Math.round(val * 10) / 10;
  };

  updateRotation(e.clientX);

  const onMove = (me: MouseEvent) => updateRotation(me.clientX);
  const onUp = () => {
    document.removeEventListener('mousemove', onMove);
    document.removeEventListener('mouseup', onUp);
  };
  document.addEventListener('mousemove', onMove);
  document.addEventListener('mouseup', onUp);
};

const deleteElement = () => {
  if (selectedElementIndex.value !== -1) {
    interactiveElements.value.splice(selectedElementIndex.value, 1);
    selectedElementIndex.value = -1;
  }
};

const toggleAspectRatio = () => {
  postcardAspectRatio.value = postcardAspectRatio.value === '3/2' ? '2/3' : '3/2';
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
  imageScale.value = 1;
  imageRotation.value = 0;
  showImageControls.value = false;
  selectedStamp.value = null;
  interactiveElements.value = [];
  showStickerPicker.value = false;
  showAiAgent.value = false;
  showStampSelector.value = false;
  selectedElementIndex.value = -1;
  postcardTitle.value = '';
  recipientInput.value = '';
  isPublicToSquare.value = false;
};

const publishPostcard = () => {
  if (!selectedImage.value) {
    ElMessage.warning("请先选择图片");
    return;
  }
  if (!selectedStamp.value) {
    ElMessage.warning("请先选择邮票");
    return;
  }
  showPublishDialog.value = true;
  publishFlipped.value = false;
};

const goToOutbox = () => {
  router.push('/outbox');
};

const confirmPublish = () => {
  // 保存到 localStorage
  const stored = localStorage.getItem('userPostcards');
  const existing = stored ? JSON.parse(stored) : [];
  const canvasEl = postcardCanvasRef.value;
  const canvasWidth = canvasEl ? canvasEl.offsetWidth : 600;
  const canvasHeight = canvasEl ? canvasEl.offsetHeight : 400;
  const newCard = {
    id: Date.now(),
    title: postcardTitle.value || '无标题明信片',
    recipient: recipientInput.value,
    isPublic: isPublicToSquare.value,
    image: selectedImage.value,
    imageOffset: { ...imageOffset.value },
    imageScale: imageScale.value,
    imageRotation: imageRotation.value,
    elements: interactiveElements.value.map(el => ({ ...el })),
    stamp: selectedStamp.value,
    aiReviewStatus: '通过',
    manualReviewStatus: '待审核',
    createdAt: new Date().toISOString(),
    canvasWidth,
    canvasHeight,
    aspectRatio: postcardAspectRatio.value,
  };
  existing.unshift(newCard);
  localStorage.setItem('userPostcards', JSON.stringify(existing));
  showPublishDialog.value = false;
  resetUpload();
  router.push('/mail');
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@400;700&family=Noto+Serif+SC:wght@400;700&display=swap');

/* 自定义字体声明 */
@font-face {
  font-family: 'SanJiSuXianJianTi';
  src: url('/font/SanJiSuXianJianTi-2.ttf') format('truetype');
}

@font-face {
  font-family: 'MuyaoSoftbrush';
  src: url('/font/Muyao-Softbrush-2.ttf') format('truetype');
}

@font-face {
  font-family: 'SourceHanSansCN';
  src: url('/font/SourceHanSansCN-VF-2.otf') format('opentype');
}

@font-face {
  font-family: 'SmileySans';
  src: url('/font/SmileySans-Oblique-3.otf') format('opentype');
}

@font-face {
  font-family: 'DingliZhuhaiFont';
  src: url('/font/dingliezhuhaifont-20240831GengXinBan)-2.ttf') format('truetype');
}

@font-face {
  font-family: 'HuangkaihuaLawyer';
  src: url('/font/huangkaihuaLawyerfont-2.ttf') format('truetype');
}

@font-face {
  font-family: 'Yomogi';
  src: url('/font/Yomogi-Regular-2.ttf') format('truetype');
}

@font-face {
  font-family: 'JinNianYeYaoJiaYouYa';
  src: url('/font/JinNianYeYaoJiaYouYa-2.ttf') format('truetype');
}

@font-face {
  font-family: 'BoTa';
  src: url('/font/BoTa-2.otf') format('opentype');
}

@font-face {
  font-family: 'QianTuBiFengShouXieTi';
  src: url('/font/QianTuBiFengShouXieTi-2.ttf') format('truetype');
}

@font-face {
  font-family: 'QingSongShouXieTi';
  src: url('/font/QingSongShouXieTi2-2.ttf') format('truetype');
}

@font-face {
  font-family: 'CangJiGaoDeGuoMiaoHei';
  src: url('/font/【MianFei】CangJiGaoDeGuoMiaoHei-CJgaodeguomh-2.ttf') format('truetype');
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>