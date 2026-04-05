<template>
  <div class="min-h-screen bg-background">
    <!-- Mobile Header -->
    <header
      class="md:hidden fixed top-0 left-0 right-0 z-50 flex items-center justify-between w-full px-4 h-16 bg-background/90 backdrop-blur-sm border-b border-primary/10"
    >
      <button
        @click="$router.back()"
        class="text-primary hover:text-secondary transition-colors"
      >
        <ChevronLeft class="w-6 h-6" />
      </button>
      <h1 class="font-headline text-lg font-bold text-primary truncate">{{ post?.title }}</h1>
      <div class="relative">
        <button @click.stop="showPrintMenu = !showPrintMenu" class="text-primary hover:text-secondary transition-colors">
          <Printer class="w-5 h-5" />
        </button>
        <div v-if="showPrintMenu" class="absolute right-0 top-full mt-2 bg-white dark:bg-neutral rounded-lg shadow-xl border border-black/10 dark:border-white/10 py-1 z-50 min-w-[140px]">
          <button @click="exportPostcard('a4')" class="w-full text-left px-4 py-2.5 text-sm text-primary hover:bg-black/5 dark:hover:bg-white/5 transition-colors">导出 A4</button>
          <button @click="exportPostcard('a6')" class="w-full text-left px-4 py-2.5 text-sm text-primary hover:bg-black/5 dark:hover:bg-white/5 transition-colors">导出 A6</button>
        </div>
      </div>
    </header>

    <!-- Desktop Header -->
    <header
      class="hidden md:flex sticky top-0 z-40 items-center justify-between w-full px-4 h-16 bg-background/90 backdrop-blur-sm border-b border-primary/10"
    >
      <button
        @click="$router.back()"
        class="text-primary hover:text-secondary transition-colors"
      >
        <ChevronLeft class="w-6 h-6" />
      </button>
      <div class="relative">
        <button @click.stop="showPrintMenu = !showPrintMenu" class="text-primary hover:text-secondary transition-colors">
          <Printer class="w-5 h-5" />
        </button>
        <div v-if="showPrintMenu" class="absolute right-0 top-full mt-2 bg-white dark:bg-neutral rounded-lg shadow-xl border border-black/10 dark:border-white/10 py-1 z-50 min-w-[140px]">
          <button @click="exportPostcard('a4')" class="w-full text-left px-4 py-2.5 text-sm text-primary hover:bg-black/5 dark:hover:bg-white/5 transition-colors">导出 A4</button>
          <button @click="exportPostcard('a6')" class="w-full text-left px-4 py-2.5 text-sm text-primary hover:bg-black/5 dark:hover:bg-white/5 transition-colors">导出 A6</button>
        </div>
      </div>
    </header>

    <div v-if="isLoading" class="w-full h-[70vh] flex items-center justify-center">
      <Loading class="!h-full !bg-transparent" />
    </div>

    <!-- Export overlay -->
    <div v-if="isExporting" class="fixed inset-0 z-[9999] bg-black/30 flex items-center justify-center">
      <div class="bg-white dark:bg-neutral rounded-xl px-8 py-5 shadow-2xl flex items-center gap-3">
        <svg class="animate-spin w-5 h-5 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"/></svg>
        <span class="text-sm text-primary font-medium">正在导出...</span>
      </div>
    </div>

    <!-- Mobile Layout -->
    <main v-if="!isLoading" class="md:hidden px-4 pt-20 pb-24">
      <div v-if="post" class="space-y-6">
        <!-- Postcard Front (Image) -->
        <div class="relative w-full" :style="{ aspectRatio: imageAspectRatio }">
          <div class="absolute inset-0 rounded-none bg-white p-3 border border-black/10 shadow-lg overflow-hidden">
            <div class="w-full h-full relative bg-black/5 flex items-center justify-center rounded-sm overflow-hidden">
              <img
                :src="post.image"
                :alt="post.title"
                class="w-full h-full object-cover"
                :style="post.imageOffset ? { transform: `translate(${post.imageOffset.x}px, ${post.imageOffset.y}px) scale(${post.imageScale || 1}) rotate(${post.imageRotation || 0}deg)` } : {}"
                referrerpolicy="no-referrer"
              />
            </div>
          </div>
        </div>

        <!-- Postcard Back (Text side) -->
        <div class="relative w-full overflow-hidden" :style="{ aspectRatio: imageAspectRatio }"
          :ref="el => { if (el) mobileBackRef = el as HTMLElement }"
        >
          <div class="absolute inset-0 rounded-none bg-white border border-black/10 shadow-lg overflow-hidden">
            <!-- Scale wrapper -->
            <div class="absolute top-0 left-0 origin-top-left" :style="getMobileBackScaleStyle()">
              <div
                class="relative flex p-5 bg-white overflow-hidden"
                :style="{ width: (post.canvasWidth || 600) + 'px', height: (post.canvasHeight || 400) + 'px' }"
                @click="selectedElementIndex = -1"
              >
            <!-- Left Side - Message -->
            <div class="flex-1 flex flex-col pr-5 border-r border-black/20 relative overflow-hidden" @click="selectedElementIndex = -1">
              <h4 class="font-headline text-xl tracking-widest text-black/60 mb-2">POSTCARD</h4>
              <div class="relative flex-1">
                <div class="flex flex-col gap-8 h-full pt-6 pb-2">
                  <div class="w-full h-[1px] bg-black/10"></div>
                  <div class="w-full h-[1px] bg-black/10"></div>
                  <div class="w-full h-[1px] bg-black/10"></div>
                  <div class="w-full h-[1px] bg-black/10"></div>
                  <div class="w-full h-[1px] bg-black/10"></div>
                  <div class="w-full h-[1px] bg-black/10"></div>
                  <div class="w-full h-[1px] bg-black/10"></div>
                  <div class="w-full h-[1px] bg-black/10"></div>
                  <div class="w-full h-[1px] bg-black/10"></div>
                  <div class="w-full h-[1px] bg-black/10"></div>
                </div>
              </div>
            </div>

            <!-- Right Side - Address & Stamp -->
            <div class="flex-1 flex flex-col pl-5 relative" @click="selectedElementIndex = -1">
              <div class="flex justify-end relative mb-4">
                <div class="w-20 h-24 border-[2px] border-black/30 flex items-center justify-center relative bg-black/5 flex-shrink-0" style="border-style: dashed;">
                  <span v-if="!post.stamp" class="text-xs font-bold text-black/40">邮票</span>
                </div>
                <div v-if="post.stamp" class="absolute -top-4 -right-4 w-32 h-32 flex items-center justify-center pointer-events-none" style="filter: drop-shadow(2px 4px 6px rgba(230, 220, 200, 0.8));">
                  <img :src="post.stamp.image" :alt="post.stamp.title" class="w-full h-full object-cover" />
                </div>
              </div>
              <div class="flex-1 flex flex-col justify-end gap-4 pb-2">
                <div class="flex items-end gap-3">
                  <span class="text-xs text-black/60 font-body">to:</span>
                  <div class="flex-1 h-[1px] bg-black/20"></div>
                </div>
                <div class="w-full h-[1px] bg-black/20 mt-3"></div>
                <div class="flex items-end gap-3">
                  <span class="text-xs text-black/60 font-body">from:</span>
                  <div class="flex-1 h-[1px] bg-black/20"></div>
                </div>
                <div class="w-full h-[1px] bg-black/20"></div>
              </div>
            </div>

            <!-- Interactive Elements (editable) -->
            <div
              v-for="(el, idx) in (post.elements || [])"
              :key="`mel-${idx}`"
              class="absolute inline-block"
              :style="{
                left: el.x + 'px', top: el.y + 'px',
                transform: `rotate(${el.rotation}deg) scale(${el.scale || 1})`,
                transformOrigin: 'top left',
                width: el.type === 'text' ? 'auto' : el.width + 'px',
                height: el.type === 'text' ? 'auto' : el.height + 'px',
                minWidth: el.type === 'text' ? '50px' : undefined,
                zIndex: (idx as number) + 10
              }"
              @mousedown.stop="canEditElement(el) && startElementDrag($event, idx as number)"
              @touchstart.stop="canEditElement(el) && startElementDrag($event, idx as number)"
              @click.stop="canEditElement(el) && (selectedElementIndex = idx as number)"
            >
              <div :class="['relative group w-full h-full', selectedElementIndex === (idx as number) && canEditElement(el) ? 'ring-2 ring-primary ring-dashed' : '']">
                <div
                  v-if="el.type === 'text' && selectedElementIndex === (idx as number) && canEditElement(el)"

                  :ref="(node) => { if (node) textEditRefs[idx as number] = node as HTMLElement }"
                  contenteditable="true"
                  @input="el.content = ($event.target as HTMLElement).innerText; saveDriftCard()"
                  @click.stop @mousedown.stop @touchstart.stop
                  class="bg-transparent border-none p-1 focus:outline-none min-w-[50px] min-h-[24px] whitespace-pre-wrap break-words"
                  :style="{ fontFamily: el.fontFamily || 'Arial', fontSize: (el.fontSize || 16) + 'px', fontWeight: el.fontWeight || 'normal', fontStyle: el.fontStyle || 'normal', color: el.color || '#000000', textDecoration: el.textDecoration || 'none', lineHeight: '1.4', display: 'inline-block' }"
                >{{ el.content }}</div>
                <div
                  v-else-if="el.type === 'text'"
                  class="w-full h-full p-1 pointer-events-none"
                  :style="{ fontFamily: el.fontFamily || 'Arial', fontSize: (el.fontSize || 16) + 'px', fontWeight: el.fontWeight || 'normal', fontStyle: el.fontStyle || 'normal', color: el.color || '#000000', textDecoration: el.textDecoration || 'none', whiteSpace: 'pre-wrap', wordWrap: 'break-word', display: 'block' }"
                >{{ el.content }}</div>
                <img v-else-if="el.type === 'sticker'" :src="el.content" class="w-full h-full object-contain pointer-events-none" />
                <div v-if="selectedElementIndex === (idx as number) && canEditElement(el)" class="absolute -top-10 left-1/2 -translate-x-1/2 w-6 h-6 bg-white border border-primary rounded-full flex items-center justify-center cursor-crosshair shadow-sm" @mousedown.stop="startElementRotate($event, idx as number)" @touchstart.stop="startElementRotate($event, idx as number)">
                  <RotateCw class="w-3 h-3 text-primary" />
                </div>
                <div v-if="selectedElementIndex === (idx as number) && canEditElement(el)" class="absolute -bottom-3 -right-3 w-6 h-6 bg-white border border-primary rounded-full flex items-center justify-center cursor-se-resize shadow-sm" @mousedown.stop="startElementResize($event, idx as number)" @touchstart.stop="startElementResize($event, idx as number)">
                  <div class="w-2 h-2 bg-primary rounded-full"></div>
                </div>
                <div v-if="selectedElementIndex === (idx as number) && canEditElement(el)" class="absolute top-0 -right-12 md:-right-12 -right-2 flex flex-col gap-2 z-50" @mousedown.stop @touchstart.stop>
                  <button v-if="isOwner || el.creatorId === currentUserId" @click.stop="deleteDriftElement(idx as number)" @mousedown.stop @touchstart.stop class="w-8 h-8 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-full flex items-center justify-center shadow-sm text-red-500 hover:text-red-600 pointer-events-auto" title="删除">
                    <Trash2 class="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Mobile Stats -->
        <div class="flex gap-6">
          <button
            @click="toggleLike"
            class="flex items-center gap-2 transition-all duration-300"
            :class="isLiked ? 'text-red-500' : 'text-tertiary hover:text-primary'"
          >
            <Heart
              class="w-5 h-5"
              :fill="isLiked ? 'currentColor' : 'none'"
            />
            <span class="font-bold text-sm">{{ likeCount }}</span>
          </button>

          <div class="flex items-center gap-2 text-tertiary">
            <MessageCircle class="w-5 h-5" />
            <span class="font-bold text-sm">{{ comments.length }}</span>
          </div>
        </div>

        <!-- Mobile Drifting: Element History Panel -->
        <div v-if="post.postcardType === 'drifting'" class="space-y-3 pt-4 border-t border-black/10 dark:border-white/10">
          <h3 class="font-headline text-lg font-bold text-primary">漂流记录</h3>
          <div v-if="(post.elements || []).length === 0" class="text-sm text-black/40 dark:text-white/40 py-4 text-center">
            还没有人参与漂流，成为第一个！
          </div>
          <div v-else class="space-y-2">
            <div
              v-for="(el, idx) in (post.elements || [])"
              :key="idx"
              class="flex items-center justify-between p-3 rounded-xl transition-colors cursor-pointer"
              :class="selectedDriftEl === idx ? 'bg-secondary/10 border border-secondary/30' : 'bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10'"
              @click="selectedDriftEl = selectedDriftEl === (idx as number) ? -1 : (idx as number)"
            >
              <div class="flex items-center gap-3 min-w-0">
                <div class="w-8 h-8 rounded-full bg-secondary/20 flex items-center justify-center flex-shrink-0">
                  <span class="text-xs font-bold text-secondary">{{ (el.creatorName || '?')[0] }}</span>
                </div>
                <div class="min-w-0">
                  <p class="text-sm font-bold text-primary truncate">{{ el.creatorName || '匿名用户' }}</p>
                  <p class="text-xs text-tertiary">添加了{{ el.type === 'text' ? '文字' : '贴纸' }}：<span class="text-primary/70 truncate">{{ el.type === 'text' ? (el.content || '').slice(0, 12) + (el.content?.length > 12 ? '…' : '') : '贴纸' }}</span></p>
                </div>
              </div>
              <!-- 发布人可以删除任意元素 -->
              <button
                v-if="isOwner"
                @click.stop="deleteDriftElement(idx as number)"
                class="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-black/30 dark:text-white/30 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                title="删除此元素"
              >
                <Trash2 class="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <!-- 添加漂流元素区域（所有人都能参与） -->
          <div class="pt-3 space-y-2 border-t border-black/5 dark:border-white/5">
            <p class="text-xs text-black/50 dark:text-white/50">参与漂流（每人限添加一个文字和一张贴纸）</p>
            <div class="flex gap-2">
              <button
                @click="addDriftText"
                :disabled="hasMyText"
                class="flex-1 py-2 text-xs font-bold rounded-lg flex items-center justify-center gap-1 transition-opacity"
                :class="hasMyText ? 'bg-black/10 dark:bg-white/10 text-black/30 dark:text-white/30 cursor-not-allowed' : 'bg-primary dark:bg-secondary text-white dark:text-black hover:opacity-90'"
              >
                <Type class="w-3.5 h-3.5" />
                {{ hasMyText ? '已添加文字' : '添加文字' }}
              </button>
              <button
                @click="showDriftStickerPicker = !showDriftStickerPicker"
                :disabled="hasMySticker"
                class="flex-1 py-2 text-xs font-bold rounded-lg flex items-center justify-center gap-1 transition-opacity"
                :class="hasMySticker ? 'bg-black/10 dark:bg-white/10 text-black/30 dark:text-white/30 cursor-not-allowed' : 'bg-primary dark:bg-secondary text-white dark:text-black hover:opacity-90'"
              >
                <Smile class="w-3.5 h-3.5" />
                {{ hasMySticker ? '已添加贴纸' : '添加贴纸' }}
              </button>
            </div>
            <!-- 贴纸选择器 -->
            <div v-if="showDriftStickerPicker && !hasMySticker" class="rounded-xl border border-black/10 dark:border-white/10 overflow-hidden">
              <div class="flex gap-1 px-3 pt-2 pb-1 bg-black/5 dark:bg-white/5">
                <button
                  v-for="s in driftStickerSeries" :key="s.value"
                  @click="driftStickerTab = s.value"
                  class="px-2 py-1 rounded-lg text-xs font-semibold transition-colors"
                  :class="driftStickerTab === s.value ? 'bg-secondary text-white' : 'text-black/50 dark:text-white/50 hover:bg-black/10'"
                >{{ s.label }}</button>
              </div>
              <div class="p-2 grid grid-cols-4 gap-1.5 max-h-36 overflow-y-auto bg-white">
                <button
                  v-for="(sticker, si) in driftStickerOptions" :key="si"
                  @click="addDriftSticker(sticker)"
                  class="rounded-lg bg-black/5 hover:bg-secondary/10 border-2 border-transparent hover:border-secondary transition-all flex items-center justify-center" style="height:52px"
                >
                  <img :src="sticker" class="w-full h-full object-contain p-1" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Mobile Style Editor Panel (shown when an element is selected) -->
        <div v-if="selectedElementIndex !== -1 && post.postcardType === 'drifting' && post.elements?.[selectedElementIndex]" class="rounded-2xl border border-black/10 dark:border-white/10 shadow-sm">
          <div class="flex items-center justify-between px-4 py-3 bg-primary/5 dark:bg-white/5 border-b border-black/10 dark:border-white/10 rounded-t-2xl">
            <h3 class="text-sm font-bold text-primary dark:text-white tracking-wide">
              {{ post.elements[selectedElementIndex]?.type === 'text' ? '文字样式' : '贴纸样式' }}
            </h3>
            <button @click="selectedElementIndex = -1" class="w-6 h-6 rounded-full flex items-center justify-center text-black/30 dark:text-white/30 hover:text-black dark:hover:text-white hover:bg-black/10 dark:hover:bg-white/10 transition-colors text-sm">✕</button>
          </div>
          <div class="p-4 bg-white space-y-4">
            <!-- Text style controls -->
            <div v-if="post.elements[selectedElementIndex]?.type === 'text'" class="space-y-3">
              <!-- Bold / Italic / Underline / Alignment -->
              <div class="flex items-center gap-0.5 p-1 bg-black/5 dark:bg-white/5 rounded-xl flex-wrap">
                <button @click="post.elements[selectedElementIndex].fontWeight = post.elements[selectedElementIndex].fontWeight === 'bold' ? 'normal' : 'bold'; saveDriftCard()"
                  :class="post.elements[selectedElementIndex].fontWeight === 'bold' ? 'bg-secondary/20 text-secondary' : 'text-black/60 dark:text-white/60 hover:bg-secondary/10'"
                  class="w-8 h-8 rounded-md flex items-center justify-center transition-colors font-bold text-sm">B</button>
                <button @click="post.elements[selectedElementIndex].fontStyle = post.elements[selectedElementIndex].fontStyle === 'italic' ? 'normal' : 'italic'; saveDriftCard()"
                  :class="post.elements[selectedElementIndex].fontStyle === 'italic' ? 'bg-secondary/20 text-secondary' : 'text-black/60 dark:text-white/60 hover:bg-secondary/10'"
                  class="w-8 h-8 rounded-md flex items-center justify-center transition-colors italic text-sm">I</button>
                <button @click="post.elements[selectedElementIndex].textDecoration = post.elements[selectedElementIndex].textDecoration === 'underline' ? 'none' : 'underline'; saveDriftCard()"
                  :class="post.elements[selectedElementIndex].textDecoration === 'underline' ? 'bg-secondary/20 text-secondary' : 'text-black/60 dark:text-white/60 hover:bg-secondary/10'"
                  class="w-8 h-8 rounded-md flex items-center justify-center transition-colors underline text-sm">U</button>
                <div class="w-px h-6 bg-black/20 dark:bg-white/20 mx-1"></div>
                <button @click="post.elements[selectedElementIndex].textAlign = 'left'; saveDriftCard()"
                  :class="(post.elements[selectedElementIndex].textAlign || 'left') === 'left' ? 'bg-secondary/20 text-secondary' : 'text-black/60 dark:text-white/60 hover:bg-secondary/10'"
                  class="w-8 h-8 rounded-md flex items-center justify-center transition-colors text-xs">≡←</button>
                <button @click="post.elements[selectedElementIndex].textAlign = 'center'; saveDriftCard()"
                  :class="post.elements[selectedElementIndex].textAlign === 'center' ? 'bg-secondary/20 text-secondary' : 'text-black/60 dark:text-white/60 hover:bg-secondary/10'"
                  class="w-8 h-8 rounded-md flex items-center justify-center transition-colors text-xs">≡</button>
                <button @click="post.elements[selectedElementIndex].textAlign = 'right'; saveDriftCard()"
                  :class="post.elements[selectedElementIndex].textAlign === 'right' ? 'bg-secondary/20 text-secondary' : 'text-black/60 dark:text-white/60 hover:bg-secondary/10'"
                  class="w-8 h-8 rounded-md flex items-center justify-center transition-colors text-xs">→≡</button>
              </div>
              <!-- Font Family + Font Size -->
              <div class="flex items-center gap-2 flex-wrap">
                <!-- Font Family Dropdown -->
                <div id="drift-font-dropdown-mobile" class="relative flex-1">
                  <button
                    @click.stop="showFontDropdown = !showFontDropdown"
                    class="w-full px-3 py-1.5 text-xs border border-black/15 dark:border-white/15 rounded-lg bg-black/5 dark:bg-white/5 text-black dark:text-white font-medium hover:bg-black/10 dark:hover:bg-white/10 transition-colors flex items-center justify-between gap-1.5"
                  >
                    <span>{{ driftFontDisplayName }}</span>
                    <svg :class="showFontDropdown ? 'rotate-180' : ''" class="w-3 h-3 opacity-50 transition-transform flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                    </svg>
                  </button>
                  <div v-if="showFontDropdown" class="absolute left-0 top-full mt-1 w-48 bg-white border border-black/10 rounded-xl shadow-lg z-50 max-h-64 overflow-y-auto">
                    <div class="px-3 py-2 border-b border-black/10">
                      <p class="text-xs font-bold text-secondary mb-2">中文字体</p>
                      <button v-for="font in chineseFonts" :key="font.value"
                        @click="post.elements[selectedElementIndex].fontFamily = font.value; showFontDropdown = false; saveDriftCard()"
                        :class="post.elements[selectedElementIndex].fontFamily === font.value ? 'bg-secondary text-white' : 'hover:bg-secondary/10'"
                        class="w-full text-left px-3 py-1.5 rounded-lg text-xs transition-colors mb-0.5"
                        :style="{ fontFamily: font.value }"
                      >{{ font.label }}</button>
                    </div>
                    <div class="px-3 py-2">
                      <p class="text-xs font-bold text-secondary mb-2">英文字体</p>
                      <button v-for="font in englishFonts" :key="font.value"
                        @click="post.elements[selectedElementIndex].fontFamily = font.value; showFontDropdown = false; saveDriftCard()"
                        :class="post.elements[selectedElementIndex].fontFamily === font.value ? 'bg-secondary text-white' : 'hover:bg-secondary/10'"
                        class="w-full text-left px-3 py-1.5 rounded-lg text-xs transition-colors mb-0.5"
                        :style="{ fontFamily: font.value }"
                      >{{ font.label }}</button>
                    </div>
                  </div>
                </div>
                <!-- Font Size -->
                <div class="flex items-center gap-1">
                  <button @click="post.elements[selectedElementIndex].fontSize = Math.max(8, (post.elements[selectedElementIndex].fontSize || 16) - 2); saveDriftCard()"
                    class="w-8 h-8 rounded-lg bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 flex items-center justify-center text-xs font-bold text-black/60 dark:text-white/60">A-</button>
                  <span class="text-xs font-semibold text-black/50 dark:text-white/50 w-6 text-center">{{ post.elements[selectedElementIndex].fontSize || 16 }}</span>
                  <button @click="post.elements[selectedElementIndex].fontSize = Math.min(72, (post.elements[selectedElementIndex].fontSize || 16) + 2); saveDriftCard()"
                    class="w-8 h-8 rounded-lg bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 flex items-center justify-center text-xs font-bold text-black/60 dark:text-white/60">A+</button>
                </div>
              </div>
              <!-- Color palette -->
              <div class="flex gap-2 flex-wrap p-2 border border-dashed border-secondary/40 rounded-xl bg-white">
                <button
                  v-for="color in ['#000000','#FF0000','#00B050','#0070C0','#FFC000','#7030A0','#FF6B6B','#4ECDC4']"
                  :key="color"
                  @click="post.elements[selectedElementIndex].color = color; saveDriftCard()"
                  :class="post.elements[selectedElementIndex].color === color ? 'ring-2 ring-offset-2 ring-secondary scale-110' : ''"
                  class="w-7 h-7 rounded-lg border-2 border-white/50 shadow transition-all hover:scale-110"
                  :style="{ backgroundColor: color }"
                ></button>
                <label class="w-7 h-7 rounded-lg border-2 border-secondary cursor-pointer hover:scale-110 transition-all flex items-center justify-center bg-white">
                  <input type="color" :value="post.elements[selectedElementIndex].color || '#000000'"
                    @input="post.elements[selectedElementIndex].color = ($event.target as HTMLInputElement).value; saveDriftCard()"
                    class="absolute opacity-0 w-0 h-0" />
                  <span class="text-base leading-none select-none">+</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        <!-- Comment Section -->
        <div class="space-y-4 pt-4">
          <h3 class="font-headline text-lg font-bold text-primary">评论</h3>

          <!-- Comments List -->
          <TransitionGroup tag="div" class="space-y-3" name="comment">
            <div
              v-for="comment in sortedComments"
              :key="comment.id"
              class="p-3 rounded-lg transition-all duration-300"
              :class="comment.pinned && isOwner ? 'bg-primary/10 dark:bg-primary/20' : 'bg-black/5 dark:bg-white/5'"
            >
              <div class="flex items-start justify-between gap-3">
                <div class="flex items-center gap-2 mb-2 flex-1 min-w-0">
                  <div class="w-8 h-8 rounded-full overflow-hidden bg-secondary/20 flex items-center justify-center flex-shrink-0">
                    <img
                      v-if="!comment.avatarLoadError"
                      :src="comment.authorAvatar"
                      :alt="comment.author"
                      class="w-full h-full object-cover"
                      loading="lazy"
                      decoding="async"
                      referrerpolicy="no-referrer"
                      @error="handleCommentAvatarError(comment)"
                    />
                    <span v-else class="text-xs font-bold text-secondary">{{ comment.author?.[0] || '?' }}</span>
                  </div>
                  <div class="min-w-0">
                    <div class="flex items-center gap-2 flex-wrap">
                      <p class="text-sm font-bold text-primary truncate">{{ comment.author }}</p>
                      <Transition name="pin">
                        <span v-if="comment.pinned" class="text-[10px] px-1.5 py-0.5 bg-primary text-white rounded-full">置顶</span>
                      </Transition>
                    </div>
                    <p class="text-xs text-tertiary">{{ comment.time }}</p>
                  </div>
                </div>
                <!-- Owner Actions -->
                <div v-if="isOwner" class="flex items-center gap-1 ml-2 flex-shrink-0">
                  <button
                    @click="togglePin(comment)"
                    class="p-1 text-tertiary hover:text-primary transition-all duration-300"
                    title="置顶"
                  >
                    <Pin class="w-4 h-4 transition-all duration-300" :class="{ 'fill-current text-primary': comment.pinned }" />
                  </button>
                  <button
                    @click="deleteComment(comment.id)"
                    class="p-1 text-tertiary hover:text-red-500 transition-all duration-300"
                    title="删除"
                  >
                    <Trash2 class="w-4 h-4 transition-all duration-300" />
                  </button>
                </div>
              </div>
              <p
                :data-comment-text-id="comment.id"
                class="text-sm text-primary comment-text"
                :class="isCommentExpanded(comment.id) ? 'comment-text--expanded' : 'comment-text--collapsed'"
              >{{ comment.text }}</p>
              <button
                v-if="shouldShowCommentExpand(comment.id)"
                @click="toggleCommentExpand(comment.id)"
                class="mt-2 text-xs font-semibold text-secondary hover:opacity-80 transition-opacity"
              >
                {{ isCommentExpanded(comment.id) ? '收起' : '展开全文' }}
              </button>
              <!-- Like Button for Comment -->
              <div class="flex items-center gap-1 mt-2">
                <button
                  @click="likeComment(comment.id)"
                  class="flex items-center gap-1 text-xs text-tertiary hover:text-primary transition-all duration-300"
                >
                  <ThumbsUp class="w-3.5 h-3.5 transition-all duration-300" :class="[comment.liked ? 'text-red-500 fill-current' : 'text-tertiary']" />
                  <span>{{ comment.likes || 0 }}</span>
                </button>
              </div>
            </div>
          </TransitionGroup>
        </div>
      </div>
    </main>

    <!-- Mobile Footer Comment Input -->
    <footer class="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-sm border-t border-primary/10 px-4 py-3">
      <div class="space-y-2">
        <div class="flex items-center justify-between text-[11px] text-tertiary px-1">
          <span>评论上限 350 字</span>
          <span :class="commentLength > COMMENT_MAX_LENGTH ? 'text-red-500' : ''">{{ commentLength }}/350</span>
        </div>
        <div class="flex gap-2 items-center">
          <button
            @click="toggleLike"
            class="flex-shrink-0 transition-all duration-300"
            :class="isLiked ? 'text-red-500' : 'text-tertiary hover:text-primary'"
          >
            <Heart
              class="w-5 h-5"
              :fill="isLiked ? 'currentColor' : 'none'"
            />
          </button>
          <input
            v-model="newComment"
            type="text"
            maxlength="350"
            placeholder="写下你的评论..."
            class="flex-1 bg-black/5 dark:bg-white/5 border-none rounded-full py-2 px-4 text-sm font-body focus:ring-1 focus:ring-primary/20 placeholder:text-tertiary"
          />
          <button
            @click="addComment"
            :disabled="!canSubmitComment"
            class="px-4 py-2 font-bold rounded-full transition-opacity flex items-center justify-center flex-shrink-0"
            :class="canSubmitComment ? 'bg-primary dark:bg-secondary text-white dark:text-black hover:opacity-90' : 'bg-black/10 dark:bg-white/10 text-tertiary cursor-not-allowed'"
          >
            <Send class="w-5 h-5" />
          </button>
        </div>
      </div>
    </footer>

    <!-- Desktop Layout -->
    <main v-if="!isLoading" class="hidden md:block max-w-7xl mx-auto px-4 pt-6 pb-12">
      <div v-if="post" :class="post.aspectRatio === '2/3' ? 'grid grid-cols-2 gap-12' : 'grid grid-cols-2 gap-12'">
        <!-- Left Column - Postcards -->
        <div :class="post.aspectRatio === '2/3' ? 'col-span-1 flex gap-6 self-start sticky top-20' : 'col-span-1 space-y-6 self-start sticky top-20'">
          <!-- Postcard Front (Image) -->
          <div class="relative" :style="{ 
            aspectRatio: imageAspectRatio,
            width: post.aspectRatio === '2/3' ? 'calc(50% - 12px)' : '100%'
          }">
            <div class="absolute inset-0 rounded-none bg-white p-3 border border-black/10 shadow-lg overflow-hidden">
              <div class="w-full h-full relative bg-black/5 flex items-center justify-center rounded-sm overflow-hidden">
                <img
                  :src="post.image"
                  :alt="post.title"
                  class="w-full h-full object-cover"
                  :style="post.imageOffset ? { transform: `translate(${post.imageOffset.x}px, ${post.imageOffset.y}px) scale(${post.imageScale || 1}) rotate(${post.imageRotation || 0}deg)` } : {}"
                  referrerpolicy="no-referrer"
                />
              </div>
            </div>
          </div>

          <!-- Postcard Back (Text side) -->
          <div class="relative overflow-hidden" :style="{
            aspectRatio: imageAspectRatio,
            width: post.aspectRatio === '2/3' ? 'calc(50% - 12px)' : '100%'
          }"
          :ref="el => { if (el) cardCanvasRefs[0] = el as HTMLElement }"
          >
            <div class="absolute inset-0 rounded-none bg-white border border-black/10 shadow-lg overflow-hidden">
              <!-- Scale wrapper -->
              <div
                class="absolute top-0 left-0 origin-top-left"
                :style="getBackScaleStyle(post, 0)"
              >
                <div
                  class="relative flex p-5 bg-white overflow-hidden"
                  :style="{ width: (post.canvasWidth || 600) + 'px', height: (post.canvasHeight || 400) + 'px' }"
                  @click="selectedElementIndex = -1"
                >
                  <!-- Left Side - Message -->
                  <div class="flex-1 flex flex-col pr-5 border-r border-black/20 relative overflow-hidden" @click="selectedElementIndex = -1">
                    <h4 class="font-headline text-xl tracking-widest text-black/60 mb-2">POSTCARD</h4>
                    <div class="relative flex-1">
                      <div class="flex flex-col gap-8 h-full pt-6 pb-2">
                        <div class="w-full h-[1px] bg-black/10"></div>
                        <div class="w-full h-[1px] bg-black/10"></div>
                        <div class="w-full h-[1px] bg-black/10"></div>
                        <div class="w-full h-[1px] bg-black/10"></div>
                        <div class="w-full h-[1px] bg-black/10"></div>
                        <div class="w-full h-[1px] bg-black/10"></div>
                        <div class="w-full h-[1px] bg-black/10"></div>
                        <div class="w-full h-[1px] bg-black/10"></div>
                        <div class="w-full h-[1px] bg-black/10"></div>
                        <div class="w-full h-[1px] bg-black/10"></div>
                      </div>
                    </div>
                  </div>

                  <!-- Right Side - Address & Stamp -->
                  <div class="flex-1 flex flex-col pl-5 relative" @click="selectedElementIndex = -1">
                    <div class="flex justify-end relative mb-4">
                      <div class="w-20 h-24 border-[2px] border-black/30 flex items-center justify-center relative bg-black/5 flex-shrink-0" style="border-style: dashed;">
                        <span v-if="!post.stamp" class="text-xs font-bold text-black/40">邮票</span>
                      </div>
                      <div v-if="post.stamp" class="absolute -top-4 -right-4 w-32 h-32 flex items-center justify-center pointer-events-none" style="filter: drop-shadow(2px 4px 6px rgba(230, 220, 200, 0.8));">
                        <img :src="post.stamp.image" :alt="post.stamp.title" class="w-full h-full object-cover" />
                      </div>
                    </div>
                    <div class="flex-1 flex flex-col justify-end gap-4 pb-2">
                      <div class="flex items-end gap-3">
                        <span class="text-xs text-black/60 font-body">to:</span>
                        <div class="flex-1 h-[1px] bg-black/20"></div>
                      </div>
                      <div class="w-full h-[1px] bg-black/20 mt-3"></div>
                      <div class="flex items-end gap-3">
                        <span class="text-xs text-black/60 font-body">from:</span>
                        <div class="flex-1 h-[1px] bg-black/20"></div>
                      </div>
                      <div class="w-full h-[1px] bg-black/20"></div>
                    </div>
                  </div>

            <!-- Interactive Elements (editable) -->
            <div
              v-for="(el, idx) in (post.elements || [])"
              :key="`el-${idx}`"
              class="absolute inline-block"
              :style="{
                left: el.x + 'px', top: el.y + 'px',
                transform: `rotate(${el.rotation}deg) scale(${el.scale || 1})`,
                transformOrigin: 'top left',
                width: el.type === 'text' ? 'auto' : el.width + 'px',
                height: el.type === 'text' ? 'auto' : el.height + 'px',
                minWidth: el.type === 'text' ? '50px' : undefined,
                zIndex: (idx as number) + 10
              }"
              @mousedown.stop="canEditElement(el) && startElementDrag($event, idx as number)"
              @touchstart.stop="canEditElement(el) && startElementDrag($event, idx as number)"
              @click.stop="canEditElement(el) && (selectedElementIndex = idx as number)"
            >
              <div :class="['relative group', selectedElementIndex === (idx as number) && canEditElement(el) ? 'ring-2 ring-primary dark:ring-white ring-dashed' : '']">
                <!-- Text editing -->
                <div
                  v-if="el.type === 'text' && selectedElementIndex === (idx as number) && canEditElement(el)"

                  :ref="(node) => { if (node) textEditRefs[idx as number] = node as HTMLElement }"
                  contenteditable="true"
                  @input="el.content = ($event.target as HTMLElement).innerText; saveDriftCard()"
                  @click.stop
                  @mousedown.stop
                  @touchstart.stop
                  class="bg-transparent border-none p-1 focus:outline-none min-w-[50px] min-h-[24px] whitespace-pre-wrap break-words"
                  :style="{
                    fontFamily: el.fontFamily || 'Arial',
                    fontSize: (el.fontSize || 16) + 'px',
                    fontWeight: el.fontWeight || 'normal',
                    fontStyle: el.fontStyle || 'normal',
                    color: el.color || '#000000',
                    textDecoration: el.textDecoration || 'none',
                    textAlign: el.textAlign || 'left',
                    lineHeight: '1.4',
                    display: 'inline-block',
                  }"
                >{{ el.content }}</div>
                <!-- Text display -->
                <div
                  v-else-if="el.type === 'text'"
                  class="w-full h-full p-1 pointer-events-none overflow-hidden"
                  :style="{
                    fontFamily: el.fontFamily || 'Arial',
                    fontSize: (el.fontSize || 16) + 'px',
                    fontWeight: el.fontWeight || 'normal',
                    fontStyle: el.fontStyle || 'normal',
                    color: el.color || '#000000',
                    textDecoration: el.textDecoration || 'none',
                    textAlign: el.textAlign || 'left',
                    whiteSpace: 'pre-wrap',
                    wordWrap: 'break-word',
                    display: 'block'
                  }"
                >{{ el.content }}</div>
                <!-- Sticker -->
                <img
                  v-else-if="el.type === 'sticker'"
                  :src="el.content"
                  class="w-full h-full object-contain pointer-events-none"
                />

                <!-- Rotate handle -->
                <div
                  v-if="selectedElementIndex === (idx as number) && canEditElement(el)"
                  class="absolute -top-10 left-1/2 -translate-x-1/2 w-6 h-6 bg-white border border-primary rounded-full flex items-center justify-center cursor-crosshair shadow-sm"
                  @mousedown.stop="startElementRotate($event, idx as number)"
                  @touchstart.stop="startElementRotate($event, idx as number)"
                >
                  <RotateCw class="w-3 h-3 text-primary" />
                </div>

                <!-- Scale handle -->
                <div
                  v-if="selectedElementIndex === (idx as number) && canEditElement(el)"
                  class="absolute -bottom-3 -right-3 w-6 h-6 bg-white border border-primary rounded-full flex items-center justify-center cursor-se-resize shadow-sm"
                  @mousedown.stop="startElementResize($event, idx as number)"
                  @touchstart.stop="startElementResize($event, idx as number)"
                >
                  <div class="w-2 h-2 bg-primary rounded-full"></div>
                </div>

                <!-- Delete button (owner can delete any; others can only delete their own) -->
                <div v-if="selectedElementIndex === (idx as number) && canEditElement(el)" class="absolute top-0 -right-12 md:-right-12 -right-2 flex flex-col gap-2 z-50" @mousedown.stop @touchstart.stop>
                  <button
                    v-if="isOwner || el.creatorId === currentUserId"
                    @click.stop="deleteDriftElement(idx as number)"
                    @mousedown.stop
                    @touchstart.stop
                    class="w-8 h-8 bg-red-50 border border-red-200 rounded-full flex items-center justify-center shadow-sm text-red-500 hover:text-red-600 pointer-events-auto"
                    title="删除"
                  >
                    <Trash2 class="w-4 h-4" />
                  </button>
                  <!-- Creator badge -->
                  <div v-if="el.creatorName" class="absolute right-10 top-0 bg-black/70 text-white text-[10px] px-2 py-1 rounded whitespace-nowrap shadow-sm">
                    {{ el.creatorName }}
                  </div>
                </div>
              </div>
            </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Right Column - Info & Comments -->
        <div class="col-span-1 space-y-6">
          <!-- Post Title -->
          <div>
            <h2 class="font-headline text-2xl font-bold text-primary mb-2">
              {{ post.title }}
            </h2>
          </div>

          <!-- Post Info -->
          <div class="space-y-4">
            <div>
              <p class="text-sm text-tertiary font-medium mb-2">
                {{ post.location }}
              </p>
            </div>

            <!-- Stats -->
            <div class="flex gap-6">
              <button
                @click="toggleLike"
                class="flex items-center gap-2 transition-all duration-300"
                :class="isLiked ? 'text-red-500' : 'text-tertiary hover:text-primary'"
              >
                <Heart
                  class="w-5 h-5"
                  :fill="isLiked ? 'currentColor' : 'none'"
                />
                <span class="font-bold text-sm">{{ likeCount }}</span>
              </button>

              <div class="flex items-center gap-2 text-tertiary">
                <MessageCircle class="w-5 h-5" />
                <span class="font-bold text-sm">{{ comments.length }}</span>
              </div>
            </div>
          </div>

          <!-- Drifting: Element History Panel -->
          <div v-if="post.postcardType === 'drifting'" class="space-y-3 pt-4 border-t border-black/10 dark:border-white/10">
            <h3 class="font-headline text-lg font-bold text-primary">漂流记录</h3>
            <div v-if="(post.elements || []).length === 0" class="text-sm text-black/40 dark:text-white/40 py-4 text-center">
              还没有人参与漂流，成为第一个！
            </div>
            <div v-else class="space-y-2">
              <div
                v-for="(el, idx) in (post.elements || [])"
                :key="idx"
                class="flex items-center justify-between p-3 rounded-xl transition-colors cursor-pointer"
                :class="selectedDriftEl === idx ? 'bg-secondary/10 border border-secondary/30' : 'bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10'"
                @click="selectedDriftEl = selectedDriftEl === (idx as number) ? -1 : (idx as number)"
              >
                <div class="flex items-center gap-3 min-w-0">
                  <div class="w-8 h-8 rounded-full bg-secondary/20 flex items-center justify-center flex-shrink-0">
                    <span class="text-xs font-bold text-secondary">{{ (el.creatorName || '?')[0] }}</span>
                  </div>
                  <div class="min-w-0">
                    <p class="text-sm font-bold text-primary truncate">{{ el.creatorName || '匿名用户' }}</p>
                    <p class="text-xs text-tertiary">添加了{{ el.type === 'text' ? '文字' : '贴纸' }}：<span class="text-primary/70 truncate">{{ el.type === 'text' ? (el.content || '').slice(0, 12) + (el.content?.length > 12 ? '…' : '') : '贴纸' }}</span></p>
                  </div>
                </div>
                <!-- 发布人可以删除任意元素 -->
                <button
                  v-if="isOwner"
                  @click.stop="deleteDriftElement(idx as number)"
                  class="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-black/30 dark:text-white/30 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                  title="删除此元素"
                >
                  <Trash2 class="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <!-- 添加漂流元素区域（所有人都能参与） -->
            <div class="pt-3 space-y-2 border-t border-black/5 dark:border-white/5">
              <p class="text-xs text-black/50 dark:text-white/50">参与漂流（每人限添加一个文字和一张贴纸）</p>
              <div class="flex gap-2">
                <button
                  @click="addDriftText"
                  :disabled="hasMyText"
                  class="flex-1 py-2 text-xs font-bold rounded-lg flex items-center justify-center gap-1 transition-opacity"
                  :class="hasMyText ? 'bg-black/10 dark:bg-white/10 text-black/30 dark:text-white/30 cursor-not-allowed' : 'bg-primary dark:bg-secondary text-white dark:text-black hover:opacity-90'"
                >
                  <Type class="w-3.5 h-3.5" />
                  {{ hasMyText ? '已添加文字' : '添加文字' }}
                </button>
                <button
                  @click="showDriftStickerPicker = !showDriftStickerPicker"
                  :disabled="hasMySticker"
                  class="flex-1 py-2 text-xs font-bold rounded-lg flex items-center justify-center gap-1 transition-opacity"
                  :class="hasMySticker ? 'bg-black/10 dark:bg-white/10 text-black/30 dark:text-white/30 cursor-not-allowed' : 'bg-primary dark:bg-secondary text-white dark:text-black hover:opacity-90'"
                >
                  <Smile class="w-3.5 h-3.5" />
                  {{ hasMySticker ? '已添加贴纸' : '添加贴纸' }}
                </button>
              </div>
              <!-- 贴纸选择器 -->
              <div v-if="showDriftStickerPicker && !hasMySticker" class="rounded-xl border border-black/10 dark:border-white/10 overflow-hidden">
                <div class="flex gap-1 px-3 pt-2 pb-1 bg-black/5 dark:bg-white/5">
                  <button
                    v-for="s in driftStickerSeries" :key="s.value"
                    @click="driftStickerTab = s.value"
                    class="px-2 py-1 rounded-lg text-xs font-semibold transition-colors"
                    :class="driftStickerTab === s.value ? 'bg-secondary text-white' : 'text-black/50 dark:text-white/50 hover:bg-black/10'"
                  >{{ s.label }}</button>
                </div>
                <div class="p-2 grid grid-cols-4 gap-1.5 max-h-36 overflow-y-auto bg-white">
                  <button
                    v-for="(sticker, si) in driftStickerOptions" :key="si"
                    @click="addDriftSticker(sticker)"
                    class="rounded-lg bg-black/5 hover:bg-secondary/10 border-2 border-transparent hover:border-secondary transition-all flex items-center justify-center" style="height:52px"
                  >
                    <img :src="sticker" class="w-full h-full object-contain p-1" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Style Editor Panel (shown when an element is selected) -->
          <div v-if="selectedElementIndex !== -1 && post.postcardType === 'drifting' && post.elements?.[selectedElementIndex]" class="rounded-2xl border border-black/10 dark:border-white/10 shadow-sm">
          <div class="flex items-center justify-between px-4 py-3 bg-primary/5 dark:bg-white/5 border-b border-black/10 dark:border-white/10 rounded-t-2xl">
            <h3 class="text-sm font-bold text-primary dark:text-white tracking-wide">
              {{ post.elements[selectedElementIndex]?.type === 'text' ? '文字样式' : '贴纸样式' }}
            </h3>
            <button @click="selectedElementIndex = -1" class="w-6 h-6 rounded-full flex items-center justify-center text-black/30 dark:text-white/30 hover:text-black dark:hover:text-white hover:bg-black/10 dark:hover:bg-white/10 transition-colors text-sm">✕</button>
          </div>
          <div class="p-4 bg-white space-y-4">
              <!-- Text style controls -->
              <div v-if="post.elements[selectedElementIndex]?.type === 'text'" class="space-y-3">
                <!-- Bold / Italic / Underline / Alignment -->
                <div class="flex items-center gap-0.5 p-1 bg-black/5 dark:bg-white/5 rounded-xl flex-wrap">
                  <button @click="post.elements[selectedElementIndex].fontWeight = post.elements[selectedElementIndex].fontWeight === 'bold' ? 'normal' : 'bold'; saveDriftCard()"
                    :class="post.elements[selectedElementIndex].fontWeight === 'bold' ? 'bg-secondary/20 text-secondary' : 'text-black/60 dark:text-white/60 hover:bg-secondary/10'"
                    class="w-8 h-8 rounded-md flex items-center justify-center transition-colors font-bold text-sm">B</button>
                  <button @click="post.elements[selectedElementIndex].fontStyle = post.elements[selectedElementIndex].fontStyle === 'italic' ? 'normal' : 'italic'; saveDriftCard()"
                    :class="post.elements[selectedElementIndex].fontStyle === 'italic' ? 'bg-secondary/20 text-secondary' : 'text-black/60 dark:text-white/60 hover:bg-secondary/10'"
                    class="w-8 h-8 rounded-md flex items-center justify-center transition-colors italic text-sm">I</button>
                  <button @click="post.elements[selectedElementIndex].textDecoration = post.elements[selectedElementIndex].textDecoration === 'underline' ? 'none' : 'underline'; saveDriftCard()"
                    :class="post.elements[selectedElementIndex].textDecoration === 'underline' ? 'bg-secondary/20 text-secondary' : 'text-black/60 dark:text-white/60 hover:bg-secondary/10'"
                    class="w-8 h-8 rounded-md flex items-center justify-center transition-colors underline text-sm">U</button>
                  <div class="w-px h-6 bg-black/20 dark:bg-white/20 mx-1"></div>
                  <button @click="post.elements[selectedElementIndex].textAlign = 'left'; saveDriftCard()"
                    :class="(post.elements[selectedElementIndex].textAlign || 'left') === 'left' ? 'bg-secondary/20 text-secondary' : 'text-black/60 dark:text-white/60 hover:bg-secondary/10'"
                    class="w-8 h-8 rounded-md flex items-center justify-center transition-colors text-xs">≡←</button>
                  <button @click="post.elements[selectedElementIndex].textAlign = 'center'; saveDriftCard()"
                    :class="post.elements[selectedElementIndex].textAlign === 'center' ? 'bg-secondary/20 text-secondary' : 'text-black/60 dark:text-white/60 hover:bg-secondary/10'"
                    class="w-8 h-8 rounded-md flex items-center justify-center transition-colors text-xs">≡</button>
                  <button @click="post.elements[selectedElementIndex].textAlign = 'right'; saveDriftCard()"
                    :class="post.elements[selectedElementIndex].textAlign === 'right' ? 'bg-secondary/20 text-secondary' : 'text-black/60 dark:text-white/60 hover:bg-secondary/10'"
                    class="w-8 h-8 rounded-md flex items-center justify-center transition-colors text-xs">→≡</button>
                </div>
                <!-- Font Family + Font Size -->
                <div class="flex items-center gap-2 flex-wrap">
                  <!-- Font Family Dropdown -->
                  <div id="drift-font-dropdown" class="relative flex-1">
                    <button
                      @click.stop="showFontDropdown = !showFontDropdown"
                      class="w-full px-3 py-1.5 text-xs border border-black/15 dark:border-white/15 rounded-lg bg-black/5 dark:bg-white/5 text-black dark:text-white font-medium hover:bg-black/10 dark:hover:bg-white/10 transition-colors flex items-center justify-between gap-1.5"
                    >
                      <span>{{ driftFontDisplayName }}</span>
                      <svg :class="showFontDropdown ? 'rotate-180' : ''" class="w-3 h-3 opacity-50 transition-transform flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                      </svg>
                    </button>
                    <div v-if="showFontDropdown" class="absolute left-0 top-full mt-1 w-48 bg-white border border-black/10 rounded-xl shadow-lg z-50 max-h-64 overflow-y-auto">
                      <div class="px-3 py-2 border-b border-black/10">
                        <p class="text-xs font-bold text-secondary mb-2">中文字体</p>
                        <button v-for="font in chineseFonts" :key="font.value"
                          @click="post.elements[selectedElementIndex].fontFamily = font.value; showFontDropdown = false; saveDriftCard()"
                          :class="post.elements[selectedElementIndex].fontFamily === font.value ? 'bg-secondary text-white' : 'hover:bg-secondary/10'"
                          class="w-full text-left px-3 py-1.5 rounded-lg text-xs transition-colors mb-0.5"
                          :style="{ fontFamily: font.value }"
                        >{{ font.label }}</button>
                      </div>
                      <div class="px-3 py-2">
                        <p class="text-xs font-bold text-secondary mb-2">英文字体</p>
                        <button v-for="font in englishFonts" :key="font.value"
                          @click="post.elements[selectedElementIndex].fontFamily = font.value; showFontDropdown = false; saveDriftCard()"
                          :class="post.elements[selectedElementIndex].fontFamily === font.value ? 'bg-secondary text-white' : 'hover:bg-secondary/10'"
                          class="w-full text-left px-3 py-1.5 rounded-lg text-xs transition-colors mb-0.5"
                          :style="{ fontFamily: font.value }"
                        >{{ font.label }}</button>
                      </div>
                    </div>
                  </div>
                  <!-- Font Size -->
                  <div class="flex items-center gap-1">
                    <button @click="post.elements[selectedElementIndex].fontSize = Math.max(8, (post.elements[selectedElementIndex].fontSize || 16) - 2); saveDriftCard()"
                      class="w-8 h-8 rounded-lg bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 flex items-center justify-center text-xs font-bold text-black/60 dark:text-white/60">A-</button>
                    <span class="text-xs font-semibold text-black/50 dark:text-white/50 w-6 text-center">{{ post.elements[selectedElementIndex].fontSize || 16 }}</span>
                    <button @click="post.elements[selectedElementIndex].fontSize = Math.min(72, (post.elements[selectedElementIndex].fontSize || 16) + 2); saveDriftCard()"
                      class="w-8 h-8 rounded-lg bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 flex items-center justify-center text-xs font-bold text-black/60 dark:text-white/60">A+</button>
                  </div>
                </div>
                <!-- Color palette -->
              <div class="flex gap-2 flex-wrap p-2 border border-dashed border-secondary/40 rounded-xl bg-white">
                <button
                  v-for="color in ['#000000','#FF0000','#00B050','#0070C0','#FFC000','#7030A0','#FF6B6B','#4ECDC4']"
                  :key="color"
                  @click="post.elements[selectedElementIndex].color = color; saveDriftCard()"
                  :class="post.elements[selectedElementIndex].color === color ? 'ring-2 ring-offset-2 ring-secondary scale-110' : ''"
                  class="w-7 h-7 rounded-lg border-2 border-white/50 shadow transition-all hover:scale-110"
                  :style="{ backgroundColor: color }"
                ></button>
                <label class="w-7 h-7 rounded-lg border-2 border-secondary cursor-pointer hover:scale-110 transition-all flex items-center justify-center bg-white">
                    <input type="color" :value="post.elements[selectedElementIndex].color || '#000000'"
                      @input="post.elements[selectedElementIndex].color = ($event.target as HTMLInputElement).value; saveDriftCard()"
                      class="absolute opacity-0 w-0 h-0" />
                    <span class="text-base leading-none select-none">+</span>
                  </label>
                </div>
              </div>
              <!-- Sticker replacement picker -->
              <div v-else-if="post.elements[selectedElementIndex]?.type === 'sticker'" class="space-y-2">
                <div class="flex gap-1">
                  <button
                    v-for="s in driftStickerSeries" :key="s.value"
                    @click="driftStickerTab = s.value"
                    class="px-2 py-1 rounded-lg text-xs font-semibold transition-colors"
                    :class="driftStickerTab === s.value ? 'bg-secondary text-white' : 'bg-black/5 dark:bg-white/5 text-black/50 dark:text-white/50 hover:bg-black/10'"
                  >{{ s.label }}</button>
                </div>
                <div class="grid grid-cols-4 gap-1.5 max-h-40 overflow-y-auto p-1">
                  <button
                    v-for="(sticker, si) in driftStickerOptions" :key="si"
                    @click="post.elements[selectedElementIndex].content = sticker; saveDriftCard()"
                    class="rounded-lg bg-black/5 hover:bg-secondary/10 border-2 transition-all flex items-center justify-center"
                    :class="post.elements[selectedElementIndex].content === sticker ? 'border-secondary bg-secondary/10' : 'border-transparent hover:border-secondary/50'"
                    style="height:52px"
                  >
                    <img :src="sticker" class="w-full h-full object-contain p-1" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Comment Section -->
          <div class="space-y-4 pt-4 border-t border-black/10 dark:border-white/10">
            <h3 class="font-headline text-lg font-bold text-primary">评论</h3>

            <!-- Comments List -->
            <TransitionGroup tag="div" class="space-y-3 max-h-96 overflow-y-auto" name="comment">
              <div
                v-for="comment in sortedComments"
                :key="comment.id"
                class="p-3 rounded-lg transition-all duration-300"
                :class="comment.pinned && isOwner ? 'bg-primary/10 dark:bg-primary/20' : 'bg-black/5 dark:bg-white/5'"
              >
                <div class="flex items-start justify-between gap-3">
                  <div class="flex items-center gap-2 mb-2 flex-1 min-w-0">
                    <div class="w-8 h-8 rounded-full overflow-hidden bg-secondary/20 flex items-center justify-center flex-shrink-0">
                      <img
                        v-if="!comment.avatarLoadError"
                        :src="comment.authorAvatar"
                        :alt="comment.author"
                        class="w-full h-full object-cover"
                        loading="lazy"
                        decoding="async"
                        referrerpolicy="no-referrer"
                        @error="handleCommentAvatarError(comment)"
                      />
                      <span v-else class="text-xs font-bold text-secondary">{{ comment.author?.[0] || '?' }}</span>
                    </div>
                    <div class="min-w-0">
                      <div class="flex items-center gap-2 flex-wrap">
                        <p class="text-sm font-bold text-primary truncate">{{ comment.author }}</p>
                        <Transition name="pin">
                          <span v-if="comment.pinned" class="text-[10px] px-1.5 py-0.5 bg-primary text-white rounded-full">置顶</span>
                        </Transition>
                      </div>
                      <p class="text-xs text-tertiary">{{ comment.time }}</p>
                    </div>
                  </div>
                  <!-- Owner Actions -->
                  <div v-if="isOwner" class="flex items-center gap-1 ml-2 flex-shrink-0">
                    <button
                      @click="togglePin(comment)"
                      class="p-1 text-tertiary hover:text-primary transition-all duration-300"
                      title="置顶"
                    >
                      <Pin class="w-4 h-4 transition-all duration-300" :class="{ 'fill-current text-primary': comment.pinned }" />
                    </button>
                    <button
                      @click="deleteComment(comment.id)"
                      class="p-1 text-tertiary hover:text-red-500 transition-all duration-300"
                      title="删除"
                    >
                      <Trash2 class="w-4 h-4 transition-all duration-300" />
                    </button>
                  </div>
                </div>
                <p
                  :data-comment-text-id="comment.id"
                  class="text-sm text-primary comment-text"
                  :class="isCommentExpanded(comment.id) ? 'comment-text--expanded' : 'comment-text--collapsed'"
                >{{ comment.text }}</p>
                <button
                  v-if="shouldShowCommentExpand(comment.id)"
                  @click="toggleCommentExpand(comment.id)"
                  class="mt-2 text-xs font-semibold text-secondary hover:opacity-80 transition-opacity"
                >
                  {{ isCommentExpanded(comment.id) ? '收起' : '展开全文' }}
                </button>
                <!-- Like Button for Comment -->
                <div class="flex items-center gap-1 mt-2">
                  <button
                    @click="likeComment(comment.id)"
                    class="flex items-center gap-1 text-xs text-tertiary hover:text-primary transition-all duration-300"
                  >
                    <ThumbsUp class="w-3.5 h-3.5 transition-all duration-300" :class="[comment.liked ? 'text-red-500 fill-current' : 'text-tertiary']" />
                    <span>{{ comment.likes || 0 }}</span>
                  </button>
                </div>
              </div>
            </TransitionGroup>

            <!-- Comment Input -->
            <div class="pt-4 space-y-2">
              <div class="flex items-center justify-between text-xs text-tertiary px-1">
                <span>评论上限 350 字</span>
                <span :class="commentLength > COMMENT_MAX_LENGTH ? 'text-red-500' : ''">{{ commentLength }}/350</span>
              </div>
              <div class="flex gap-2">
                <input
                  v-model="newComment"
                  type="text"
                  maxlength="350"
                  placeholder="写下你的评论..."
                  class="flex-1 bg-black/5 dark:bg-white/5 border-none rounded-full py-2 px-4 text-sm font-body focus:ring-1 focus:ring-primary/20 placeholder:text-tertiary"
                />
                <button
                  @click="addComment"
                  :disabled="!canSubmitComment"
                  class="px-4 py-2 font-bold rounded-full transition-opacity"
                  :class="canSubmitComment ? 'bg-primary dark:bg-secondary text-white dark:text-black hover:opacity-90' : 'bg-black/10 dark:bg-white/10 text-tertiary cursor-not-allowed'"
                >
                  发送
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch, nextTick, onBeforeUnmount } from "vue";
import { useRoute } from "vue-router";
import { ChevronLeft, MessageCircle, Send, Pin, Trash2, Heart, ThumbsUp, Type, Smile, RotateCw, Bold, Italic, Underline, Strikethrough, AlignLeft, AlignCenter, AlignRight, Printer } from "lucide-vue-next";
import html2canvas from "html2canvas";
import { ElMessage } from "element-plus";
import { assetBaseURL } from "../utils/request.js";
import { useUser } from "../store/user";
import { getPostcardDetail, togglePostcardLike, addPostcardDriftElement, deletePostcardDriftElement } from "../api/postcard.js";
import { getComments, addComment as addCommentApi, deleteComment as deleteCommentApi, toggleCommentPin, toggleCommentLike } from "../api/comment.js";


const route = useRoute();
const post = ref<any>(null);
const isLoading = ref(true);
const isLiked = ref(false);
const likeCount = ref(0);
const newComment = ref("");
const imageAspectRatio = ref("3/2");
const isOwner = ref(false);
const showPrintMenu = ref(false);
const comments = ref<any[]>([]);
const expandedCommentIds = ref<number[]>([]);
const commentOverflowMap = ref<Record<string, boolean>>({});
const cardCanvasRefs = ref<Record<number, HTMLElement>>({});
const mobileBackRef = ref<HTMLElement | null>(null);
const mobileBackSize = ref({ width: 0, height: 0 });

const DEFAULT_AVATAR = 'https://lh3.googleusercontent.com/aida-public/AB6AXuBYArdRu7qlNp4cuo06XFR6gjYC0xtUePbpepRVZFPb60NLBx_VR9amuEGGGmcgoSJxZnTSvk-qC-pT40C1BcNky-vgDMQS81oXbUZ1ZhPGx8TyP5kDLnK2UxXs44i4R9b0C6J2F0AegR2bJ6baLYqRUydE5fXGJMLngQf9plW3-BdtpO6Gnq5BWbM5Y8_ZXBxCkBcu_AycBYRNspo0GmyLKNOwz7WDP8qJiBl97glqeE0pFejorxYMHYxFqX9mdXogSMmgx3TMR9IR';
const COMMENT_MAX_LENGTH = 350;

// Element editing state (ported from Create.vue)
const selectedElementIndex = ref(-1);
const textEditRefs = ref<Record<number, HTMLElement>>({});
let rotateStartData = { rotation: 0, startX: 0 };
let dragStart = { x: 0, y: 0 };

const getCurrentScale = () => {
  const srcW = post.value?.canvasWidth || 600;
  const srcH = post.value?.canvasHeight || 400;
  const isMobile = window.innerWidth < 768;
  const dstW = isMobile ? (mobileBackSize.value.width || srcW) : (desktopBackSize.value.width || srcW);
  const dstH = isMobile ? (mobileBackSize.value.height || srcH) : (desktopBackSize.value.height || srcH);
  const rawScale = Math.min(dstW / srcW, dstH / srcH) || 1;
  return Math.min(rawScale, 1);
};

const startElementDrag = (e: MouseEvent | TouchEvent, index: number) => {
  const elements = post.value?.elements;
  if (!elements) return;
  const element = elements[index];
  if (!canEditElement(element)) return;
  e.preventDefault();
  e.stopPropagation();
  selectedElementIndex.value = index;
  const clientX = e instanceof MouseEvent ? e.clientX : e.touches[0].clientX;
  const clientY = e instanceof MouseEvent ? e.clientY : e.touches[0].clientY;
  dragStart = { x: clientX, y: clientY };
  const startX = element.x;
  const startY = element.y;
  const scale = getCurrentScale();
  const handleMove = (moveEvent: MouseEvent | TouchEvent) => {
    moveEvent.preventDefault();
    const mx = moveEvent instanceof MouseEvent ? moveEvent.clientX : moveEvent.touches[0].clientX;
    const my = moveEvent instanceof MouseEvent ? moveEvent.clientY : moveEvent.touches[0].clientY;
    element.x = startX + (mx - dragStart.x) / scale;
    element.y = startY + (my - dragStart.y) / scale;
  };
  const handleEnd = () => {
    saveDriftCard();
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
  const elements = post.value?.elements;
  if (!elements) return;
  const element = elements[index];
  if (!canEditElement(element)) return;
  e.preventDefault();
  e.stopPropagation();
  const clientX = e instanceof MouseEvent ? e.clientX : e.touches[0].clientX;
  const initialScale = element.scale || 1;
  const handleMove = (moveEvent: MouseEvent | TouchEvent) => {
    moveEvent.preventDefault();
    const mx = moveEvent instanceof MouseEvent ? moveEvent.clientX : moveEvent.touches[0].clientX;
    const scaleFactor = 1 + (mx - clientX) / 100;
    element.scale = Math.max(0.3, Math.min(5, initialScale * scaleFactor));
  };
  const handleEnd = () => {
    saveDriftCard();
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
  const elements = post.value?.elements;
  if (!elements) return;
  const element = elements[index];
  if (!canEditElement(element)) return;
  if (e instanceof TouchEvent) e.preventDefault();
  const clientX = e instanceof MouseEvent ? e.clientX : e.touches[0].clientX;
  const clientY = e instanceof MouseEvent ? e.clientY : e.touches[0].clientY;
  const target = e.target as HTMLElement;
  const container = target.closest('.absolute.inline-block') as HTMLElement;
  let centerX = 0, centerY = 0;
  if (container) {
    const rect = container.getBoundingClientRect();
    centerX = rect.left + rect.width / 2;
    centerY = rect.top + rect.height / 2;
  }
  const startAngle = Math.atan2(clientY - centerY, clientX - centerX) * (180 / Math.PI);
  rotateStartData = { rotation: element.rotation || 0, startX: startAngle };
  const handleMove = (moveEvent: MouseEvent | TouchEvent) => {
    if (moveEvent instanceof TouchEvent) moveEvent.preventDefault();
    const mx = moveEvent instanceof MouseEvent ? moveEvent.clientX : moveEvent.touches[0].clientX;
    const my = moveEvent instanceof MouseEvent ? moveEvent.clientY : moveEvent.touches[0].clientY;
    const currentAngle = Math.atan2(my - centerY, mx - centerX) * (180 / Math.PI);
    element.rotation = rotateStartData.rotation + (currentAngle - rotateStartData.startX);
  };
  const handleEnd = () => {
    saveDriftCard();
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

// Watch selected text element to focus contenteditable
watch(selectedElementIndex, async (newIndex) => {
  if (newIndex === -1) return;
  const elements = post.value?.elements;
  if (!elements) return;
  const el = elements[newIndex];
  if (!el || el.type !== 'text' || !canEditElement(el)) return;
  await nextTick();
  const div = textEditRefs.value[newIndex];
  if (!div) return;
  if (div.innerText !== el.content) div.innerText = el.content || '';
  div.focus();
  const range = document.createRange();
  const sel = window.getSelection();
  if (div.childNodes.length > 0) {
    range.selectNodeContents(div);
    range.collapse(false);
    sel?.removeAllRanges();
    sel?.addRange(range);
  }
});
const desktopBackSize = ref({ width: 0, height: 0 });

// 漂流功能
const { userInfo } = useUser();
const currentUserId = computed(() => userInfo.value?.id);
const currentUserName = computed(() => userInfo.value?.username || '我');
const canEditElement = (el: any) => {
  return !!post.value && post.value.postcardType === 'drifting' && (!!isOwner.value || el?.creatorId === currentUserId.value);
};

const selectedDriftEl = ref(-1);
const showDriftStickerPicker = ref(false);
const showFontDropdown = ref(false);
const driftStickerTab = ref('arrow');
const driftStickerSeries = [
  { label: '箭头', value: 'arrow' },
  { label: '动物', value: 'animal' },
  { label: '狗狗剪影', value: 'dog_silhouette' },
  { label: '涂鸦', value: 'graffiti' },
  { label: '表情', value: 'expression' },
];
const driftStickerSeriesOptions: Record<string, string[]> = {
  arrow: [
    '/stickers/arrow/1.png',
    '/stickers/arrow/2.png',
    '/stickers/arrow/3.png',
    '/stickers/arrow/4.png',
    '/stickers/arrow/5.png',
    '/stickers/arrow/6.png',
    '/stickers/arrow/7.png',
    '/stickers/arrow/8.png',
    '/stickers/arrow/9.png',
    '/stickers/arrow/10.png',
    '/stickers/arrow/11.png',
    '/stickers/arrow/12.png',
    '/stickers/arrow/13.png',
    '/stickers/arrow/14.png',
    '/stickers/arrow/15.png',
    '/stickers/arrow/16.png',
    '/stickers/arrow/17.png',
    '/stickers/arrow/18.png',
    '/stickers/arrow/19.png',
    '/stickers/arrow/20.png',
    '/stickers/arrow/21.png',
    '/stickers/arrow/22.png',
    '/stickers/arrow/23.png',
    '/stickers/arrow/24.png',
    '/stickers/arrow/25.png',
    '/stickers/arrow/26.png',
    '/stickers/arrow/27.png',
    '/stickers/arrow/28.png',
    '/stickers/arrow/29.png',
    '/stickers/arrow/30.png',
  ],
  animal: [
    '/stickers/animal/企鹅.png',
    '/stickers/animal/刺猬.png',
    '/stickers/animal/小兔.png',
    '/stickers/animal/小熊.png',
    '/stickers/animal/小牛.png',
    '/stickers/animal/小狗.png',
    '/stickers/animal/小猪.png',
    '/stickers/animal/小猫.png',
    '/stickers/animal/小猴.png',
    '/stickers/animal/小羊.png',
    '/stickers/animal/小虎.png',
    '/stickers/animal/小蛇.png',
    '/stickers/animal/小马.png',
    '/stickers/animal/小鸡.png',
    '/stickers/animal/小鹿.png',
    '/stickers/animal/小鼠.png',
    '/stickers/animal/小龙.png',
    '/stickers/animal/松鼠.png',
    '/stickers/animal/树懒.png',
    '/stickers/animal/狐狸.png',
    '/stickers/animal/独角兽.png',
    '/stickers/animal/考拉.png',
    '/stickers/animal/鹦鹉.png',
    '/stickers/animal/小象.png',
  ],
  dog_silhouette: [
    '/stickers/dog_silhouette/1.png',
    '/stickers/dog_silhouette/2.png',
    '/stickers/dog_silhouette/3.png',
    '/stickers/dog_silhouette/4.png',
    '/stickers/dog_silhouette/5.png',
    '/stickers/dog_silhouette/6.png',
    '/stickers/dog_silhouette/7.png',
    '/stickers/dog_silhouette/8.png',
    '/stickers/dog_silhouette/9.png',
  ],
  graffiti: [
    '/stickers/graffiti/涂鸦1.png',
    '/stickers/graffiti/涂鸦2.png',
    '/stickers/graffiti/涂鸦3.png',
    '/stickers/graffiti/涂鸦4.png',
    '/stickers/graffiti/涂鸦5.png',
    '/stickers/graffiti/涂鸦6.png',
    '/stickers/graffiti/涂鸦7.png',
    '/stickers/graffiti/涂鸦8.png',
    '/stickers/graffiti/涂鸦9.png',
    '/stickers/graffiti/涂鸦10.png',
    '/stickers/graffiti/涂鸦11.png',
    '/stickers/graffiti/涂鸦12.png',
    '/stickers/graffiti/涂鸦13.png',
  ],
  expression: [
    '/stickers/expression/1.png',
    '/stickers/expression/2.png',
    '/stickers/expression/3.png',
    '/stickers/expression/4.png',
    '/stickers/expression/5.png',
    '/stickers/expression/6.png',
    '/stickers/expression/7.png',
    '/stickers/expression/8.png',
    '/stickers/expression/9.png',
    '/stickers/expression/10.png',
    '/stickers/expression/11.png',
    '/stickers/expression/12.png',
    '/stickers/expression/13.png',
    '/stickers/expression/14.png',
    '/stickers/expression/15.png',
    '/stickers/expression/16.png',
    '/stickers/expression/17.png',
    '/stickers/expression/18.png',
    '/stickers/expression/19.png',
    '/stickers/expression/20.png',
    '/stickers/expression/21.png',
    '/stickers/expression/22.png',
    '/stickers/expression/23.png',
    '/stickers/expression/24.png',
  ],
};
const driftStickerOptions = computed(() => driftStickerSeriesOptions[driftStickerTab.value] || []);

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
  { label: '三极速线简体', value: 'SanJiSuXianJianTi' },
  { label: '沐瑶软笔手写体', value: 'MuyaoSoftbrush' },
  { label: '思源黑体CN', value: 'SourceHanSansCN' },
  { label: '得意黑', value: 'SmileySans' },
  { label: '钉铃珠海字体', value: 'DingliZhuhaiFont' },
  { label: '今年也要加油鸭', value: 'JinNianYeYaoJiaYouYa' },
  { label: 'Yomogi', value: 'Yomogi' },
];

const driftFontDisplayName = computed(() => {
  if (selectedElementIndex.value === -1 || !post.value?.elements?.[selectedElementIndex.value]) return '字体';
  const currentFont = post.value.elements[selectedElementIndex.value].fontFamily || 'Arial';
  const found = [...englishFonts, ...chineseFonts].find(f => f.value === currentFont);
  return found?.label || '字体';
});

const hasMyText = computed(() =>
  (post.value?.elements || []).some((el: any) => el.type === 'text' && el.creatorId === currentUserId.value)
);
const hasMySticker = computed(() =>
  (post.value?.elements || []).some((el: any) => el.type === 'sticker' && el.creatorId === currentUserId.value)
);

const addDriftText = async () => {
  if (hasMyText.value || !post.value?.id) return;
  try {
    const element = {
      type: 'text',
      content: '在这里写下你的话…',
      x: 30,
      y: 60,
      width: 150,
      height: 60,
      rotation: 0,
      scale: 1,
      fontFamily: 'Arial',
      fontSize: 14,
      fontWeight: 'normal',
      fontStyle: 'normal',
      color: '#000000',
    };
    const res = await addPostcardDriftElement(post.value.id, element);
    post.value = { ...post.value, elements: res.data?.elements || [] };
    await nextTick();
    selectedElementIndex.value = post.value.elements.length - 1;
  } catch (err: any) {
    ElMessage.error(err?.data?.message || err?.message || '添加失败');
  }
};

const addDriftSticker = async (stickerUrl: string) => {
  if (hasMySticker.value || !post.value?.id) return;
  try {
    const element = {
      type: 'sticker',
      content: stickerUrl,
      x: 80,
      y: 80,
      width: 80,
      height: 80,
      rotation: 0,
      scale: 1,
    };
    const res = await addPostcardDriftElement(post.value.id, element);
    post.value = { ...post.value, elements: res.data?.elements || [] };
    showDriftStickerPicker.value = false;
    await nextTick();
    selectedElementIndex.value = post.value.elements.length - 1;
  } catch (err: any) {
    ElMessage.error(err?.data?.message || err?.message || '添加失败');
  }
};

const deleteDriftElement = async (idx: number) => {
  if (!post.value?.id) return;
  try {
    const res = await deletePostcardDriftElement(post.value.id, idx);
    const elements = res.data?.elements || [];
    post.value = { ...post.value, elements };
    selectedElementIndex.value = -1;
    if (selectedDriftEl.value >= elements.length) selectedDriftEl.value = -1;
  } catch (err: any) {
    ElMessage.error(err?.data?.message || err?.message || '删除失败');
  }
};

const saveDriftCard = () => {
  // 漂流数据通过接口即时保存，保留空函数兼容现有编辑回调
};

let commentIdCounter = 0;

const resolveAssetUrl = (url?: string | null) => {
  if (!url) return DEFAULT_AVATAR;
  if (/^(https?:)?\/\//.test(url) || url.startsWith('data:')) {
    return url;
  }
  return `${assetBaseURL}${url.startsWith('/') ? url : `/${url}`}`;
};

const normalizeComment = (comment: any) => ({
  ...comment,
  authorAvatar: resolveAssetUrl(comment.authorAvatar),
  avatarLoadError: false,
});

const commentLength = computed(() => newComment.value.length);
const canSubmitComment = computed(() => {
  const content = newComment.value.trim();
  return content.length > 0 && content.length <= COMMENT_MAX_LENGTH;
});
const measureCollapsedOverflow = (el: HTMLElement) => {
  if (!el || el.getClientRects().length === 0) return false;

  const prevDisplay = el.style.display;
  const prevOverflow = el.style.overflow;
  const prevWebkitLineClamp = el.style.webkitLineClamp;
  const prevWebkitBoxOrient = el.style.webkitBoxOrient;

  el.style.display = '-webkit-box';
  el.style.overflow = 'hidden';
  el.style.webkitLineClamp = '2';
  el.style.webkitBoxOrient = 'vertical';

  const overflowed = el.scrollHeight - el.clientHeight > 1;

  el.style.display = prevDisplay;
  el.style.overflow = prevOverflow;
  el.style.webkitLineClamp = prevWebkitLineClamp;
  el.style.webkitBoxOrient = prevWebkitBoxOrient;

  return overflowed;
};
const measureCommentOverflow = async () => {
  await nextTick();
  const nextMap: Record<string, boolean> = {};

  sortedComments.value.forEach((comment) => {
    const nodes = document.querySelectorAll(`[data-comment-text-id="${comment.id}"]`);
    nextMap[String(comment.id)] = Array.from(nodes).some((node) => measureCollapsedOverflow(node as HTMLElement));
  });

  commentOverflowMap.value = nextMap;
};
const scheduleMeasureCommentOverflow = () => {
  void measureCommentOverflow();
};
const shouldShowCommentExpand = (id: number | string) => !!commentOverflowMap.value[String(id)];
const isCommentExpanded = (id: number) => expandedCommentIds.value.includes(id);
const toggleCommentExpand = (id: number) => {
  if (isCommentExpanded(id)) {
    expandedCommentIds.value = expandedCommentIds.value.filter((item) => item !== id);
    return;
  }
  expandedCommentIds.value = [...expandedCommentIds.value, id];
};
const handleCommentAvatarError = (comment: any) => {
  comment.avatarLoadError = true;
};

const getMobileBackScaleStyle = () => {
  const srcW = post.value?.canvasWidth || 600;
  const srcH = post.value?.canvasHeight || 400;
  const dstW = mobileBackSize.value.width || srcW;
  const dstH = mobileBackSize.value.height || srcH;
  const scale = Math.min(Math.min(dstW / srcW, dstH / srcH), 1);
  return {
    width: srcW + 'px',
    height: srcH + 'px',
    transform: `scale(${scale})`,
    transformOrigin: 'top left',
  };
};

const getBackScaleStyle = (card: any, _index: number = 0) => {
  const srcW = card.canvasWidth || 600;
  const srcH = card.canvasHeight || 400;
  const dstW = desktopBackSize.value.width || srcW;
  const dstH = desktopBackSize.value.height || srcH;
  const scale = Math.min(Math.min(dstW / srcW, dstH / srcH), 1);
  return {
    width: srcW + 'px',
    height: srcH + 'px',
    transform: `scale(${scale})`,
    transformOrigin: 'top left',
  };
};

const handleDocumentClick = (e: MouseEvent) => {
  const target = e.target as Node;
  const fontDropdownEl = document.getElementById('drift-font-dropdown');
  if (fontDropdownEl && !fontDropdownEl.contains(target)) {
    showFontDropdown.value = false;
  }
  showPrintMenu.value = false;
};

// ---------- Export / Print ----------

const isExporting = ref(false);

const buildOffscreenCard = (type: 'front' | 'back', w: number, h: number): HTMLElement => {
  const p = post.value;
  const wrap = document.createElement('div');
  wrap.style.cssText = `position:fixed;left:-9999px;top:0;width:${w}px;height:${h}px;overflow:hidden;background:white;`;

  // Scale padding proportionally: PostDetail uses p-3 (12px) at ~400px width
  const pad = Math.round(w * 0.03);

  if (type === 'front') {
    const innerW = w - pad * 2;
    const innerH = h - pad * 2;

    const ox = p.imageOffset?.x || 0;
    const oy = p.imageOffset?.y || 0;
    const sc = p.imageScale || 1;
    const rot = p.imageRotation || 0;
    // Scale translate offsets proportionally to export size
    const refW = p.canvasWidth || 600;
    const offsetScale = innerW / refW;
    const tx = ox * offsetScale;
    const ty = oy * offsetScale;
    const imgTransform = `translate(${tx}px,${ty}px) scale(${sc}) rotate(${rot}deg)`;

    wrap.innerHTML = `
      <div style="width:${w}px;height:${h}px;background:white;padding:${pad}px;box-sizing:border-box;">
        <div style="position:relative;width:100%;height:100%;overflow:hidden;border:1px solid rgba(0,0,0,0.1);border-radius:2px;box-sizing:border-box;">
          <div style="position:absolute;inset:0;background-image:url('${p.image}');background-size:cover;background-position:center;transform:${imgTransform};transform-origin:center;"></div>
        </div>
      </div>`;
  } else {
    // Back: replicate the postcard back at reference canvas size
    const cw = p.canvasWidth || 600;
    const ch = p.canvasHeight || 400;
    const scale = Math.min(w / cw, h / ch);

    let elementsHtml = '';
    for (const el of (p.elements || [])) {
      if (el.type === 'text') {
        elementsHtml += `<div style="position:absolute;left:${el.x}px;top:${el.y}px;transform:rotate(${el.rotation}deg) scale(${el.scale || 1});transform-origin:top left;font-family:${el.fontFamily || 'Arial'};font-size:${el.fontSize || 16}px;font-weight:${el.fontWeight || 'normal'};font-style:${el.fontStyle || 'normal'};color:${el.color || '#000'};text-decoration:${el.textDecoration || 'none'};white-space:pre-wrap;word-wrap:break-word;line-height:1.4;display:inline-block;padding:4px;">${el.content}</div>`;
      } else if (el.type === 'sticker') {
        elementsHtml += `<div style="position:absolute;left:${el.x}px;top:${el.y}px;width:${el.width}px;height:${el.height}px;transform:rotate(${el.rotation}deg) scale(${el.scale || 1});transform-origin:top left;"><img src="${el.content}" crossorigin="anonymous" style="width:100%;height:100%;object-fit:contain;" /></div>`;
      }
    }

    // Use box-shadow instead of filter:drop-shadow for html2canvas compatibility
    const stampHtml = p.stamp
      ? `<div style="position:absolute;top:-16px;right:-16px;width:128px;height:128px;display:flex;align-items:center;justify-content:center;">
           <img src="${p.stamp.image}" crossorigin="anonymous" style="width:100%;height:100%;object-fit:cover;box-shadow:2px 4px 6px rgba(230,220,200,0.8);" />
         </div>`
      : `<span style="font-size:12px;font-weight:bold;color:rgba(0,0,0,0.4);">邮票</span>`;

    wrap.innerHTML = `
      <div style="width:${w}px;height:${h}px;overflow:hidden;background:white;">
        <div style="width:${cw}px;height:${ch}px;transform:scale(${scale});transform-origin:top left;display:flex;padding:20px;box-sizing:border-box;background:white;position:relative;">
          <!-- Left side -->
          <div style="flex:1;display:flex;flex-direction:column;padding-right:20px;border-right:1px solid rgba(0,0,0,0.2);overflow:hidden;">
            <h4 style="font-size:20px;letter-spacing:0.2em;color:rgba(0,0,0,0.6);margin:0 0 8px 0;">POSTCARD</h4>
            <div style="flex:1;display:flex;flex-direction:column;gap:32px;padding:24px 0 8px 0;">
              ${Array(10).fill('<div style="width:100%;height:1px;background:rgba(0,0,0,0.1);"></div>').join('')}
            </div>
          </div>
          <!-- Right side -->
          <div style="flex:1;display:flex;flex-direction:column;padding-left:20px;position:relative;">
            <div style="display:flex;justify-content:flex-end;position:relative;margin-bottom:16px;">
              <div style="width:80px;height:96px;border:2px dashed rgba(0,0,0,0.3);display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,0.05);flex-shrink:0;">
                ${!p.stamp ? '<span style="font-size:12px;font-weight:bold;color:rgba(0,0,0,0.4);">邮票</span>' : ''}
              </div>
              ${p.stamp ? stampHtml : ''}
            </div>
            <div style="flex:1;display:flex;flex-direction:column;justify-content:flex-end;gap:16px;padding-bottom:8px;">
              <div style="display:flex;align-items:flex-end;gap:12px;"><span style="font-size:12px;color:rgba(0,0,0,0.6);">to:</span><div style="flex:1;height:1px;background:rgba(0,0,0,0.2);"></div></div>
              <div style="width:100%;height:1px;background:rgba(0,0,0,0.2);margin-top:12px;"></div>
              <div style="display:flex;align-items:flex-end;gap:12px;"><span style="font-size:12px;color:rgba(0,0,0,0.6);">from:</span><div style="flex:1;height:1px;background:rgba(0,0,0,0.2);"></div></div>
              <div style="width:100%;height:1px;background:rgba(0,0,0,0.2);"></div>
            </div>
          </div>
          <!-- Elements -->
          ${elementsHtml}
        </div>
      </div>`;
  }

  document.body.appendChild(wrap);
  return wrap;
};

const waitForImages = (container: HTMLElement) => {
  const imgs = container.querySelectorAll('img');
  return Promise.all(Array.from(imgs).map(img =>
    img.complete ? Promise.resolve() : new Promise<void>((resolve) => {
      img.onload = () => resolve();
      img.onerror = () => resolve();
    })
  ));
};

const downloadCanvas = (canvas: HTMLCanvasElement, filename: string) => {
  const link = document.createElement('a');
  link.download = filename;
  link.href = canvas.toDataURL('image/png');
  link.click();
};

const exportPostcard = async (size: 'a4' | 'a6') => {
  if (!post.value || isExporting.value) return;
  showPrintMenu.value = false;
  isExporting.value = true;

  try {
    const p = post.value;
    const isPortrait = p.aspectRatio === '2/3';
    const title = p.title || 'postcard';

    // A4 = 2480x3508 @300dpi, A6 = 1240x1748 @300dpi
    // Card dimensions depend on aspect ratio
    const DPI = 300;

    if (size === 'a6') {
      // A6: export front and back as separate PNGs, each fitting A6
      const a6W = isPortrait ? 1240 : 1748;
      const a6H = isPortrait ? 1748 : 1240;

      const frontWrap = buildOffscreenCard('front', a6W, a6H);
      const backWrap = buildOffscreenCard('back', a6W, a6H);
      await Promise.all([waitForImages(frontWrap), waitForImages(backWrap)]);

      const [frontCanvas, backCanvas] = await Promise.all([
        html2canvas(frontWrap, { scale: 1, useCORS: true, allowTaint: true, width: a6W, height: a6H, backgroundColor: '#ffffff' }),
        html2canvas(backWrap, { scale: 1, useCORS: true, allowTaint: true, width: a6W, height: a6H, backgroundColor: '#ffffff' }),
      ]);

      downloadCanvas(frontCanvas, `${title}_正面_A6.png`);
      setTimeout(() => downloadCanvas(backCanvas, `${title}_背面_A6.png`), 300);

      frontWrap.remove();
      backWrap.remove();
    } else {
      // A4: front + back on one page
      const a4W = 2480;
      const a4H = 3508;
      const padding = 80;
      const gap = 60;

      // Each card area
      const cardAreaW = a4W - padding * 2;
      const cardAreaH = Math.floor((a4H - padding * 2 - gap) / 2);

      // Fit card inside area preserving aspect ratio
      const cardRatio = isPortrait ? 2 / 3 : 3 / 2;
      let cardW: number, cardH: number;
      if (cardAreaW / cardAreaH > cardRatio) {
        cardH = cardAreaH;
        cardW = Math.floor(cardH * cardRatio);
      } else {
        cardW = cardAreaW;
        cardH = Math.floor(cardW / cardRatio);
      }

      const frontWrap = buildOffscreenCard('front', cardW, cardH);
      const backWrap = buildOffscreenCard('back', cardW, cardH);
      await Promise.all([waitForImages(frontWrap), waitForImages(backWrap)]);

      const [frontCanvas, backCanvas] = await Promise.all([
        html2canvas(frontWrap, { scale: 1, useCORS: true, allowTaint: true, width: cardW, height: cardH, backgroundColor: '#ffffff' }),
        html2canvas(backWrap, { scale: 1, useCORS: true, allowTaint: true, width: cardW, height: cardH, backgroundColor: '#ffffff' }),
      ]);

      // Compose onto A4
      const finalCanvas = document.createElement('canvas');
      finalCanvas.width = a4W;
      finalCanvas.height = a4H;
      const ctx = finalCanvas.getContext('2d')!;
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, a4W, a4H);

      const frontX = Math.floor((a4W - cardW) / 2);
      const frontY = padding;
      ctx.drawImage(frontCanvas, frontX, frontY, cardW, cardH);

      // Dashed divider line
      ctx.setLineDash([12, 8]);
      ctx.strokeStyle = '#ccc';
      ctx.lineWidth = 2;
      const dividerY = frontY + cardH + gap / 2;
      ctx.beginPath();
      ctx.moveTo(padding, dividerY);
      ctx.lineTo(a4W - padding, dividerY);
      ctx.stroke();

      const backY = frontY + cardH + gap;
      ctx.drawImage(backCanvas, frontX, backY, cardW, cardH);

      downloadCanvas(finalCanvas, `${title}_A4.png`);

      frontWrap.remove();
      backWrap.remove();
    }

    ElMessage.success('导出成功');
  } catch (err) {
    console.error('Export failed:', err);
    ElMessage.error('导出失败，请重试');
  } finally {
    isExporting.value = false;
  }
};

onMounted(() => {
  window.scrollTo(0, 0);
  const postId = route.params.id;
  loadPost(postId);

  document.addEventListener('click', handleDocumentClick);
  window.addEventListener('resize', scheduleMeasureCommentOverflow);
});

onBeforeUnmount(() => {
  document.removeEventListener('click', handleDocumentClick);
  window.removeEventListener('resize', scheduleMeasureCommentOverflow);
  mobileRo?.disconnect();
  desktopRo?.disconnect();
});

// post 加载后 DOM 渲染完再绑定 ResizeObserver
let mobileRo: ResizeObserver | null = null;
let desktopRo: ResizeObserver | null = null;
watch(post, async (newPost) => {
  if (!newPost) return;
  await nextTick();
  if (mobileBackRef.value && !mobileRo) {
    mobileBackSize.value = { width: mobileBackRef.value.offsetWidth, height: mobileBackRef.value.offsetHeight };
    mobileRo = new ResizeObserver(entries => {
      for (const entry of entries) {
        mobileBackSize.value = { width: entry.contentRect.width, height: entry.contentRect.height };
      }
    });
    mobileRo.observe(mobileBackRef.value);
  }
  const desktopEl = cardCanvasRefs.value[0];
  if (desktopEl && !desktopRo) {
    desktopBackSize.value = { width: desktopEl.offsetWidth, height: desktopEl.offsetHeight };
    desktopRo = new ResizeObserver(entries => {
      for (const entry of entries) {
        desktopBackSize.value = { width: entry.contentRect.width, height: entry.contentRect.height };
      }
    });
    desktopRo.observe(desktopEl);
  }
});

const sortedComments = computed(() => {
  return [...comments.value].sort((a, b) => {
    if (a.pinned && !b.pinned) return -1;
    if (!a.pinned && b.pinned) return 1;
    return 0;
  });
});

watch(sortedComments, () => {
  scheduleMeasureCommentOverflow();
}, { deep: true, flush: 'post' });

const loadPost = async (id: any) => {
  selectedElementIndex.value = -1;
  selectedDriftEl.value = -1;
  expandedCommentIds.value = [];
  commentOverflowMap.value = {};
  try {
    const [postRes, commentsRes] = await Promise.all([
      getPostcardDetail(id),
      getComments(id),
    ]);

    const data = postRes.data || {};
    post.value = {
      ...data,
      image: data.image ? (data.image.startsWith('http') ? data.image : `${assetBaseURL}${data.image}`) : '',
      stamp: data.stamp ? {
        ...data.stamp,
        image: data.stamp.image ? (data.stamp.image.startsWith('http') ? data.stamp.image : `${assetBaseURL}${data.stamp.image}`) : '',
      } : null,
      location: data.createdAt ? new Date(data.createdAt).toLocaleDateString('zh-CN') : '',
    };

    isOwner.value = !!data.isOwner;
    isLiked.value = !!data.isLiked;
    likeCount.value = data.likeCount || 0;
    imageAspectRatio.value = data.aspectRatio || '3/2';
    comments.value = (commentsRes.data || []).map(normalizeComment);
  } catch (err: any) {
    ElMessage.error(err?.data?.message || err?.message || '加载详情失败');
  } finally {
    isLoading.value = false;
  }
};

const toggleLike = async () => {
  if (!post.value?.id) return;
  try {
    const res = await togglePostcardLike(post.value.id);
    isLiked.value = !!res.data?.isLiked;
    likeCount.value = res.data?.likeCount || 0;
  } catch (err: any) {
    ElMessage.error(err?.data?.message || err?.message || '操作失败');
  }
};

const addComment = async () => {
  const content = newComment.value.trim();
  if (!post.value?.id || !content) return;
  if (content.length > COMMENT_MAX_LENGTH) {
    ElMessage.warning(`评论最多 ${COMMENT_MAX_LENGTH} 字`);
    return;
  }
  try {
    const res = await addCommentApi(post.value.id, content);
    comments.value.unshift(normalizeComment(res.data));
    newComment.value = '';
  } catch (err: any) {
    ElMessage.error(err?.data?.message || err?.message || '评论失败');
  }
};

const likeComment = async (id: number) => {
  try {
    const res = await toggleCommentLike(id);
    const comment = comments.value.find((c) => c.id === id);
    if (comment) {
      comment.liked = !!res.data?.liked;
      comment.likes = res.data?.likes ?? comment.likes;
    }
  } catch (err: any) {
    ElMessage.error(err?.data?.message || err?.message || '操作失败');
  }
};

const deleteComment = async (id: number) => {
  try {
    await deleteCommentApi(id);
    comments.value = comments.value.filter((c) => c.id !== id);
    expandedCommentIds.value = expandedCommentIds.value.filter((item) => item !== id);
  } catch (err: any) {
    ElMessage.error(err?.data?.message || err?.message || '删除失败');
  }
};

const togglePin = async (comment: any) => {
  try {
    const res = await toggleCommentPin(comment.id);
    if (res.data?.pinned) {
      comments.value.forEach((c) => { c.pinned = c.id === comment.id; });
    } else {
      comment.pinned = false;
    }
  } catch (err: any) {
    ElMessage.error(err?.data?.message || err?.message || '操作失败');
  }
};

const saveComments = () => {
  // 评论由后端维护
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@400;700&family=Noto+Serif+SC:wght@400;700&display=swap');

@font-face { font-family: 'SanJiSuXianJianTi'; src: url('/font/SanJiSuXianJianTi-2.ttf') format('truetype'); }
@font-face { font-family: 'MuyaoSoftbrush'; src: url('/font/Muyao-Softbrush-2.ttf') format('truetype'); }
@font-face { font-family: 'SourceHanSansCN'; src: url('/font/SourceHanSansCN-VF-2.otf') format('opentype'); }
@font-face { font-family: 'SmileySans'; src: url('/font/SmileySans-Oblique-3.otf') format('opentype'); }
@font-face { font-family: 'DingliZhuhaiFont'; src: url('/font/dingliezhuhaifont-20240831GengXinBan)-2.ttf') format('truetype'); }
@font-face { font-family: 'JinNianYeYaoJiaYouYa'; src: url('/font/JinNianYeYaoJiaYouYa-2.ttf') format('truetype'); }
@font-face { font-family: 'Yomogi'; src: url('/font/Yomogi-Regular-2.ttf') format('truetype'); }

.comment-text {
  white-space: pre-wrap;
  word-break: break-word;
}

.comment-text--collapsed {
  display: -webkit-box;
  overflow: hidden;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}

.comment-text--expanded {
  display: block;
  overflow: visible;
}

.comment-move,
.comment-enter-active,
.comment-leave-active {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.comment-enter-from {
  opacity: 0;
  transform: translateY(-20px) scale(0.95);
}

.comment-leave-to {
  opacity: 0;
  transform: translateX(-100%) scale(0.95);
}

.comment-move {
  transform-origin: center;
}

/* 置顶标签动画 */
.pin-enter-active,
.pin-leave-active {
  transition: all 0.3s ease;
}

.pin-enter-from {
  opacity: 0;
  transform: scale(0.8) translateY(-10px);
}

.pin-leave-to {
  opacity: 0;
  transform: scale(0.8);
}
</style>
