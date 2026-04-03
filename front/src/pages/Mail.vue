<template>
  <div class="min-h-screen bg-background pb-24">
    <header
      class="sticky top-0 z-40 flex justify-between items-center w-full px-4 h-16 bg-background/90 backdrop-blur-sm border-b border-primary/10"
    >
      <div class="flex items-center gap-4 flex-1">
        <button class="text-primary hover:bg-primary/5 p-2 rounded-full transition-colors">
          <MailIcon class="w-5 h-5" />
        </button>
        <div class="relative flex-1 max-w-md">
          <Search class="absolute left-3 top-1/2 -translate-y-1/2 text-tertiary w-4 h-4" />
          <input
            type="text"
            v-model="mailSearchQuery"
            placeholder="搜索邮件..."
            class="w-full bg-black/5 border-none rounded-full py-1.5 pl-10 pr-4 text-sm font-body focus:ring-1 focus:ring-primary/20 placeholder:text-tertiary outline-none"
          />
        </div>
      </div>
      <div class="flex items-center gap-1 ml-4">
        <button
          @click="showFriendsList = true"
          class="text-primary hover:bg-primary/5 p-2 rounded-full transition-colors"
        >
          <Users class="w-5 h-5" />
        </button>
        <button
          @click="showFilterPanel = true"
          class="text-primary hover:bg-primary/5 p-2 rounded-full transition-colors"
        >
          <ListFilter class="w-5 h-5" />
        </button>
      </div>
    </header>

    <main class="max-w-7xl mx-auto px-6 py-8" @click="clearSelectedCard">
      <div v-if="allPostcards.length === 0" class="flex flex-col items-center justify-center py-24 gap-4">
        <div class="w-16 h-16 rounded-full bg-black/5 dark:bg-white/5 flex items-center justify-center">
          <MailIcon class="w-8 h-8 text-black/30 dark:text-white/30" />
        </div>
        <p class="text-black/40 dark:text-white/40 text-sm">还没有明信片，去创作一张吧</p>
      </div>
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 md:gap-8 lg:gap-12">
        <div
          v-for="(card, index) in allPostcards"
          :key="card.id"
          class="flex flex-col gap-2"
          :style="{
            width: card.aspectRatio === '2/3' ? '70%' : '100%',
            margin: card.aspectRatio === '2/3' ? '0 auto' : '0'
          }"
        >
          <!-- Card Wrapper -->
          <div
            class="relative group cursor-pointer"
            :style="{ aspectRatio: card.aspectRatio || '3/2' }"
            @click.stop="toggleFlip(index)"
          >
            <!-- Back (text side) -->
            <div
              :class="[
                'absolute inset-0 rounded-none bg-white dark:bg-neutral border border-black/10 dark:border-white/10 transition-all duration-500 shadow-inner overflow-hidden',
                flipped[index] ? '-translate-x-4 -translate-y-4 -rotate-1 shadow-2xl z-10 group-hover:rotate-0' : 'translate-x-4 translate-y-4 rotate-2 shadow-lg z-0 group-hover:rotate-1'
              ]"
              :ref="el => { if (el) cardCanvasRefs[index] = el as HTMLElement }"
            >
              <div
                class="absolute top-0 left-0 origin-top-left"
                :style="getBackScaleStyle(card, index)"
              >
                <div
                  class="flex p-5 bg-white dark:bg-neutral"
                  :style="{ width: (card.canvasWidth || 600) + 'px', height: (card.canvasHeight || 400) + 'px' }"
                >
                  <div class="flex-1 flex flex-col pr-5 border-r border-black/20 dark:border-white/20 overflow-hidden relative">
                    <h3 class="font-headline text-xl tracking-widest text-black/60 dark:text-white/60 mb-2">POSTCARD</h3>
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
                  <div class="flex-1 flex flex-col pl-5 relative">
                    <div class="flex justify-end relative mb-4">
                      <div v-if="card.stamp" class="absolute -top-1 -right-1 w-32 h-32 flex items-center justify-center">
                        <img :src="card.stamp.image" class="w-full h-full object-cover" />
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
                  <div
                    v-for="(el, ei) in card.elements"
                    :key="ei"
                    class="absolute pointer-events-none"
                    :style="{
                      left: el.x + 'px', top: el.y + 'px',
                      transform: `rotate(${el.rotation}deg) scale(${el.scale || 1})`,
                      transformOrigin: 'top left',
                      width: el.type === 'text' ? 'auto' : el.width + 'px',
                      height: el.type === 'text' ? 'auto' : el.height + 'px',
                      zIndex: String(ei + 10),
                    }"
                  >
                    <span v-if="el.type === 'text'" :style="{ fontFamily: el.fontFamily, fontSize: el.fontSize + 'px', color: el.color, fontWeight: el.fontWeight, fontStyle: el.fontStyle, textDecoration: el.textDecoration }">{{ el.content }}</span>
                    <img v-else-if="el.type === 'sticker'" :src="el.content" class="w-full h-full object-contain" />
                  </div>
                </div>
              </div>
            </div>
            <!-- Front (image side) -->
            <div
              :class="[
                'absolute inset-0 rounded-none bg-white dark:bg-neutral p-3 transition-all duration-500',
                flipped[index] ? 'translate-x-4 translate-y-4 rotate-2 shadow-lg z-0 group-hover:rotate-1' : '-translate-x-4 -translate-y-4 -rotate-1 shadow-2xl z-10 group-hover:rotate-0'
              ]"
            >
              <div class="w-full h-full relative border border-black/5 dark:border-white/5 overflow-hidden">
                <img :src="card.image" class="w-full h-full object-cover"
                  :style="{ transform: `translate(${(card.imageOffset?.x||0)}px, ${(card.imageOffset?.y||0)}px) scale(${card.imageScale||1}) rotate(${card.imageRotation||0}deg)` }"
                />
              </div>
            </div>
          </div>

          <!-- Card Footer: Title + Batch Delete Checkbox -->
          <div v-if="showCardTitle || batchDeleteMode" class="flex items-center justify-between px-1 min-h-[24px] mt-3 relative z-10">
            <span v-if="showCardTitle" class="text-xs font-medium text-primary/70 truncate flex-1">
              {{ card.title || '未命名明信片' }}
            </span>
            <input
              v-if="batchDeleteMode"
              type="checkbox"
              :checked="selectedCards.has(card.id ?? index)"
              @click.stop="toggleCardSelection(card.id ?? index)"
              class="w-4 h-4 rounded accent-primary shrink-0 cursor-pointer ml-2"
            />
          </div>
        </div>
      </div>

      <!-- Batch Delete Floating Bar -->
      <Transition
        enter-active-class="transition-all duration-300 ease-out"
        enter-from-class="opacity-0 translate-y-4"
        enter-to-class="opacity-100 translate-y-0"
        leave-active-class="transition-all duration-200 ease-in"
        leave-from-class="opacity-100 translate-y-0"
        leave-to-class="opacity-0 translate-y-4"
      >
        <div v-if="batchDeleteMode" class="fixed bottom-28 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 bg-white dark:bg-neutral shadow-2xl rounded-2xl px-6 py-3 border border-black/5 dark:border-white/5">
          <span class="text-sm font-medium text-primary">已选 {{ selectedCards.size }} 张</span>
          <button
            @click="deleteSelectedCards"
            :disabled="selectedCards.size === 0"
            class="px-4 py-2 bg-red-500 text-white rounded-xl text-sm font-bold hover:bg-red-600 transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5"
          >
            <Trash2 class="w-4 h-4" /> 删除
          </button>
          <button
            @click="exitBatchDelete"
            class="px-4 py-2 bg-black/5 dark:bg-white/5 rounded-xl text-sm font-medium hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
          >
            取消
          </button>
        </div>
      </Transition>
    </main>

    <!-- Friends List Sidebar -->
    <Transition
      enter-active-class="transition-opacity duration-300"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-opacity duration-300"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div v-if="showFriendsList" class="fixed inset-0 z-[60] flex justify-end">
        <!-- Backdrop -->
        <div
          class="absolute inset-0 bg-black/20 backdrop-blur-sm"
          @click="closeFriendsList"
        ></div>

        <!-- Panel -->
        <Transition
          appear
          enter-active-class="transition-transform duration-300 ease-out"
          enter-from-class="translate-x-full"
          enter-to-class="translate-x-0"
          leave-active-class="transition-transform duration-300 ease-in"
          leave-from-class="translate-x-0"
          leave-to-class="translate-x-full"
        >
          <div
            v-if="showFriendsList"
            class="relative w-full md:w-1/3 min-w-[320px] bg-white dark:bg-neutral h-full shadow-2xl flex flex-col"
            @click="expandedFriendId = null"
          >
            <!-- Panel Header -->
            <div class="flex items-center justify-between p-4 border-b border-black/5 dark:border-white/5">
              <!-- Title or back button when adding friend -->
              <div class="flex items-center gap-2">
                <button
                  v-if="isAddingFriend"
                  @click.stop="isAddingFriend = false; addFriendQuery = ''"
                  class="p-1.5 hover:bg-black/5 dark:hover:bg-white/5 rounded-full transition-colors text-tertiary"
                >
                  <ArrowLeft class="w-4 h-4" />
                </button>
                <h2 class="font-headline font-bold text-lg">{{ isAddingFriend ? '添加好友' : '好友列表' }}</h2>
              </div>
              <button
                @click.stop="closeFriendsList"
                class="p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-full transition-colors text-tertiary"
              >
                <X class="w-5 h-5" />
              </button>
            </div>

            <!-- Search bar in panel header area - visible when adding friend -->
            <Transition
              enter-active-class="transition-all duration-300 ease-out"
              enter-from-class="opacity-0 -translate-y-2"
              enter-to-class="opacity-100 translate-y-0"
              leave-active-class="transition-all duration-200 ease-in"
              leave-from-class="opacity-100 translate-y-0"
              leave-to-class="opacity-0 -translate-y-2"
            >
              <div v-if="isAddingFriend" class="px-4 pb-3 border-b border-black/5 dark:border-white/5" @click.stop>
                <div class="relative">
                  <UserPlus class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary" />
                  <input
                    ref="addFriendInput"
                    type="text"
                    v-model="addFriendQuery"
                    placeholder="输入好友ID或昵称..."
                    class="w-full bg-primary/5 border border-primary/20 rounded-full py-2 pl-9 pr-4 text-sm focus:ring-1 focus:ring-primary/30 outline-none text-primary placeholder:text-primary/40"
                  />
                </div>
                <!-- Search results -->
                <div v-if="addFriendQuery" class="mt-2 space-y-1">
                  <div
                    v-for="result in searchResults"
                    :key="result.id"
                    class="flex items-center gap-3 p-2 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                  >
                    <img :src="result.avatar" :alt="result.name" class="w-8 h-8 rounded-full object-cover" />
                    <span class="flex-1 text-sm font-medium">{{ result.name }}</span>
                    <button class="px-3 py-1 bg-primary text-white rounded-full text-xs font-semibold hover:bg-primary/90 transition-colors">添加</button>
                  </div>
                  <p v-if="searchResults.length === 0" class="text-xs text-tertiary text-center py-4">未找到相关用户</p>
                </div>
              </div>
            </Transition>

            <!-- Friends list -->
            <div class="flex-1 overflow-y-auto p-4">
              <div v-if="!isAddingFriend" class="space-y-2">
                <div v-for="friend in filteredFriends" :key="friend.id" class="flex flex-col gap-1">
                  <div
                    class="flex items-center gap-3 p-3 hover:bg-black/5 dark:hover:bg-white/5 rounded-xl cursor-pointer transition-colors"
                    @click.stop="expandedFriendId = expandedFriendId === friend.id ? null : friend.id"
                  >
                    <div class="relative">
                      <img :src="friend.avatar" :alt="friend.name" class="w-10 h-10 rounded-full object-cover" />
                      <div class="absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white dark:border-neutral" :class="friend.status === 'online' ? 'bg-green-500' : 'bg-gray-400'"></div>
                    </div>
                    <div class="flex-1">
                      <h3 class="font-medium text-sm">{{ friend.name }}</h3>
                      <p class="text-xs text-tertiary">{{ friend.status === 'online' ? '在线' : '离线' }}</p>
                    </div>
                    <button class="p-2 text-primary hover:bg-primary/10 rounded-full transition-colors" @click.stop>
                      <MailIcon class="w-4 h-4" />
                    </button>
                  </div>
                  <Transition
                    enter-active-class="transition-all duration-200 ease-out"
                    enter-from-class="opacity-0 -translate-y-2"
                    enter-to-class="opacity-100 translate-y-0"
                    leave-active-class="transition-all duration-150 ease-in"
                    leave-from-class="opacity-100 translate-y-0"
                    leave-to-class="opacity-0 -translate-y-2"
                  >
                    <div v-if="expandedFriendId === friend.id" class="flex gap-2 px-3 pb-2" @click.stop>
                      <button class="flex-1 flex items-center justify-center gap-2 py-2 bg-primary/10 text-primary rounded-lg text-sm hover:bg-primary/20 transition-colors">
                        <Send class="w-4 h-4" />发送明信片
                      </button>
                      <button class="flex-1 flex items-center justify-center gap-2 py-2 bg-red-50 text-red-500 rounded-lg text-sm hover:bg-red-100 transition-colors dark:bg-red-900/20 dark:hover:bg-red-900/40">
                        <Trash2 class="w-4 h-4" />删除好友
                      </button>
                    </div>
                  </Transition>
                </div>
              </div>
            </div>

            <!-- Bottom Action Bar -->
            <div class="p-4 border-t border-black/5 dark:border-white/5 bg-white dark:bg-neutral flex items-center gap-3" @click.stop>
              <div class="relative flex-1">
                <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-tertiary" />
                <input
                  type="text"
                  v-model="searchQuery"
                  placeholder="搜索好友..."
                  class="w-full bg-black/5 dark:bg-white/5 border-none rounded-full py-2 pl-9 pr-4 text-sm focus:ring-1 focus:ring-primary/20 outline-none"
                />
              </div>
              <button
                @click.stop="isAddingFriend = true; addFriendInput?.focus()"
                class="w-10 h-10 shrink-0 bg-primary text-white rounded-full flex items-center justify-center shadow-lg hover:bg-primary/90 transition-colors"
              >
                <UserPlus class="w-5 h-5" />
              </button>
            </div>
          </div>
        </Transition>
      </div>
    </Transition>

    <!-- Filter Panel Sidebar -->
    <Transition
      enter-active-class="transition-opacity duration-300"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-opacity duration-300"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div v-if="showFilterPanel" class="fixed inset-0 z-[60] flex justify-end">
        <!-- Backdrop -->
        <div
          class="absolute inset-0 bg-black/20 backdrop-blur-sm"
          @click="closeFilterPanel"
        ></div>

        <!-- Panel -->
        <Transition
          appear
          enter-active-class="transition-transform duration-300 ease-out"
          enter-from-class="translate-x-full"
          enter-to-class="translate-x-0"
          leave-active-class="transition-transform duration-300 ease-in"
          leave-from-class="translate-x-0"
          leave-to-class="translate-x-full"
        >
          <div
            v-if="showFilterPanel"
            class="relative w-full md:w-1/3 min-w-[320px] bg-white dark:bg-neutral h-full shadow-2xl flex flex-col"
          >
            <!-- Panel Header -->
            <div class="flex items-center justify-between p-4 border-b border-black/5 dark:border-white/5">
              <h2 class="font-headline font-bold text-lg">筛选与排序</h2>
              <button
                @click.stop="closeFilterPanel"
                class="p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-full transition-colors text-tertiary"
              >
                <X class="w-5 h-5" />
              </button>
            </div>

            <!-- Panel Content -->
            <div class="flex-1 overflow-y-auto flex flex-col">
              <!-- Top Half: Calendar Date Range Filter -->
              <div class="p-6 border-b border-black/5 dark:border-white/5">
                <h3 class="font-bold text-primary mb-4 flex items-center gap-2">
                  <CalendarDays class="w-4 h-4" /> 日期筛选
                </h3>

                <!-- Range hint -->
                <div class="flex items-center justify-center gap-2 mb-3 text-xs text-tertiary">
                  <span class="px-2 py-1 bg-primary/10 text-primary rounded-lg font-medium">
                    {{ rangeStart ? formatDate(rangeStart) : '开始日期' }}
                  </span>
                  <span>→</span>
                  <span class="px-2 py-1 bg-primary/10 text-primary rounded-lg font-medium">
                    {{ rangeEnd ? formatDate(rangeEnd) : '结束日期' }}
                  </span>
                </div>

                <!-- Custom Vue3 Calendar -->
                <div class="bg-black/5 dark:bg-white/5 rounded-2xl p-4">
                  <!-- Header -->
                  <div class="flex items-center justify-between mb-4">
                    <button @click="changeMonth(-1)" class="p-1 hover:bg-black/5 dark:hover:bg-white/5 rounded-lg text-primary">
                      <ChevronLeft class="w-5 h-5" />
                    </button>
                    <button
                      @click="showYearMonthPicker = !showYearMonthPicker"
                      class="font-bold text-sm px-3 py-1 rounded-lg hover:bg-black/10 dark:hover:bg-white/10 transition-colors flex items-center gap-1"
                    >
                      {{ filterYear }}年 {{ filterMonth + 1 }}月
                      <ChevronRight class="w-3 h-3 rotate-90 text-tertiary" />
                    </button>
                    <button @click="changeMonth(1)" class="p-1 hover:bg-black/5 dark:hover:bg-white/5 rounded-lg text-primary">
                      <ChevronRight class="w-5 h-5" />
                    </button>
                  </div>

                  <!-- Year/Month quick picker -->
                  <div v-if="showYearMonthPicker" class="mb-3">
                    <div class="flex gap-2 mb-2">
                      <select
                        :value="filterYear"
                        @change="setYear(+($event.target as HTMLSelectElement).value)"
                        class="flex-1 text-xs rounded-lg px-2 py-1 bg-white dark:bg-neutral border border-black/10 dark:border-white/10 outline-none text-primary"
                      >
                        <option v-for="y in yearOptions" :key="y" :value="y">{{ y }}年</option>
                      </select>
                      <select
                        :value="filterMonth"
                        @change="setPickerMonth(+($event.target as HTMLSelectElement).value)"
                        class="flex-1 text-xs rounded-lg px-2 py-1 bg-white dark:bg-neutral border border-black/10 dark:border-white/10 outline-none text-primary"
                      >
                        <option v-for="m in 12" :key="m" :value="m-1">{{ m }}月</option>
                      </select>
                    </div>
                  </div>

                  <!-- Weekdays -->
                  <div class="grid grid-cols-7 mb-1">
                    <div v-for="d in ['一','二','三','四','五','六','日']" :key="d" class="text-center text-xs font-medium text-tertiary py-1">
                      {{ d }}
                    </div>
                  </div>

                  <!-- Days Grid — no gap so range bg is continuous -->
                  <div class="grid grid-cols-7">
                    <div v-for="i in filterFirstDayOfWeek" :key="'e-'+i" class="aspect-square"></div>
                    <div
                      v-for="day in filterDaysInMonth"
                      :key="'day-'+day"
                      class="aspect-square relative flex items-center justify-center"
                    >
                      <!-- Range fill background (full width strip) -->
                      <div
                        class="absolute inset-y-1 left-0 right-0 z-0"
                        :class="getRangeBg(day)"
                      ></div>
                      <!-- Day circle -->
                      <button
                        @click="selectRangeDay(day)"
                        class="relative z-10 w-8 h-8 flex items-center justify-center text-sm transition-all font-medium"
                        :class="getDayCircleClass(day)"
                      >
                        {{ day }}
                      </button>
                    </div>
                  </div>
                </div>

                <div class="mt-4 flex gap-2">
                  <button @click="clearDates" class="flex-1 py-2 rounded-xl bg-black/5 dark:bg-white/5 text-sm font-medium text-tertiary hover:bg-black/10 dark:hover:bg-white/10 transition-colors">
                    重置日期
                  </button>
                </div>
              </div>

              <!-- Friend Filter -->
              <div class="p-6 border-b border-black/5 dark:border-white/5">
                <div class="flex items-center justify-between mb-4">
                  <h3 class="font-bold text-primary flex items-center gap-2">
                    <Users class="w-4 h-4" /> 好友筛选
                  </h3>
                  <button
                    v-if="mockFriends.length > friendCollapseLimit"
                    @click="friendListExpanded = !friendListExpanded"
                    class="text-xs text-tertiary hover:text-primary transition-colors flex items-center gap-1"
                  >
                    {{ friendListExpanded ? '收起' : `展开全部 (${mockFriends.length})` }}
                    <ChevronRight class="w-3 h-3 transition-transform" :class="friendListExpanded ? '-rotate-90' : 'rotate-90'" />
                  </button>
                </div>
                <div class="flex flex-wrap gap-2">
                  <button
                    v-for="friend in displayedFriends"
                    :key="friend.id"
                    @click="toggleFriendFilter(friend.id)"
                    class="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all"
                    :class="selectedFriendIds.has(friend.id)
                      ? 'bg-primary text-white border-primary shadow-md'
                      : 'border-black/10 dark:border-white/10 text-primary hover:border-primary/40'"
                  >
                    <img :src="friend.avatar" class="w-4 h-4 rounded-full object-cover" />
                    {{ friend.name }}
                  </button>
                </div>
              </div>

              <!-- Show Title Toggle + Batch Delete -->
              <div class="p-6 flex flex-col gap-4">
                <!-- Show title toggle -->
                <div class="flex items-center justify-between p-3 rounded-xl border border-black/5 dark:border-white/5">
                  <span class="text-sm font-medium">显示明信片标题</span>
                  <button
                    @click="showCardTitle = !showCardTitle"
                    class="relative w-11 h-6 rounded-full transition-colors duration-200 focus:outline-none"
                    :class="showCardTitle ? 'bg-primary' : 'bg-black/20 dark:bg-white/20'"
                  >
                    <span
                      class="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200"
                      :class="showCardTitle ? 'translate-x-5' : 'translate-x-0'"
                    ></span>
                  </button>
                </div>

                <!-- Batch delete button -->
                <button
                  @click="enterBatchDelete"
                  class="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-red-200 dark:border-red-900/40 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 text-sm font-medium transition-colors"
                >
                  <Trash2 class="w-4 h-4" /> 批量选择删除
                </button>
              </div>
            </div>

            <!-- Bottom Action Bar for Filter Panel -->
            <div class="p-4 border-t border-black/5 dark:border-white/5 bg-white dark:bg-neutral flex gap-3">
               <button @click="closeFilterPanel" class="flex-1 py-3 bg-primary text-white rounded-xl font-bold shadow-lg hover:bg-primary/90 transition-colors">
                 应用筛选
               </button>
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import {
  Mail as MailIcon,
  Search,
  Users,
  ListFilter,
  X,
  Send,
  Trash2,
  UserPlus,
  ArrowLeft,
  CalendarDays,
  ChevronLeft,
  ChevronRight
} from "lucide-vue-next";

const flipped = ref<boolean[]>([]);
const allPostcards = ref<any[]>([]);
const cardCanvasRefs = ref<Record<number, HTMLElement>>({});

const getBackScaleStyle = (card: any, index: number) => {
  const el = cardCanvasRefs.value[index];
  const srcW = card.canvasWidth || 600;
  const srcH = card.canvasHeight || 400;
  const dstW = el ? el.offsetWidth : srcW;
  const dstH = el ? el.offsetHeight : srcH;
  const scale = Math.min(dstW / srcW, dstH / srcH);
  return {
    width: srcW + 'px',
    height: srcH + 'px',
    transform: `scale(${scale})`,
    transformOrigin: 'top left',
  };
};

const clearSelectedCard = () => {
  flipped.value = allPostcards.value.map(() => true);
};

const toggleFlip = (index: number) => {
  flipped.value[index] = !flipped.value[index];
};

onMounted(() => {
  const stored = localStorage.getItem('userPostcards');
  allPostcards.value = stored ? JSON.parse(stored) : [];
  flipped.value = allPostcards.value.map(() => true);
});
const mailSearchQuery = ref("");
const showFriendsList = ref(false);
const showFilterPanel = ref(false);
const expandedFriendId = ref<number | null>(null);
const searchQuery = ref("");
const isAddingFriend = ref(false);
const addFriendQuery = ref("");
const addFriendInput = ref<HTMLInputElement | null>(null);

const closeFriendsList = () => {
  showFriendsList.value = false;
  expandedFriendId.value = null;
  isAddingFriend.value = false;
  addFriendQuery.value = "";
};

const closeFilterPanel = () => {
  showFilterPanel.value = false;
};

const mockFriends = ref([
  { id: 1, name: '林深时见鹿', avatar: 'https://i.pravatar.cc/150?u=11', status: 'online' },
  { id: 2, name: '海蓝时见鲸', avatar: 'https://i.pravatar.cc/150?u=12', status: 'offline' },
  { id: 3, name: '梦醒时见你', avatar: 'https://i.pravatar.cc/150?u=13', status: 'online' },
  { id: 4, name: '云中谁寄锦书来', avatar: 'https://i.pravatar.cc/150?u=14', status: 'online' },
  { id: 5, name: '雁字回时', avatar: 'https://i.pravatar.cc/150?u=15', status: 'offline' },
  { id: 6, name: '月满西楼', avatar: 'https://i.pravatar.cc/150?u=16', status: 'online' },
]);

const allUsers = ref([
  { id: 7, name: '落花人独立', avatar: 'https://i.pravatar.cc/150?u=17' },
  { id: 8, name: '微雨燕双飞', avatar: 'https://i.pravatar.cc/150?u=18' },
  { id: 9, name: '记得绿罗裙', avatar: 'https://i.pravatar.cc/150?u=19' },
]);

const filteredFriends = computed(() => {
  if (!searchQuery.value) return mockFriends.value;
  return mockFriends.value.filter(f => f.name.includes(searchQuery.value));
});

const searchResults = computed(() => {
  if (!addFriendQuery.value) return [];
  return allUsers.value.filter(u => u.name.includes(addFriendQuery.value));
});
// Calendar Filter Logic — date range
const filterDate = ref(new Date());
const filterYear = computed(() => filterDate.value.getFullYear());
const filterMonth = computed(() => filterDate.value.getMonth());
const showYearMonthPicker = ref(false);

const yearOptions = computed(() => {
  const cur = new Date().getFullYear();
  return Array.from({ length: 5 }, (_, i) => cur - 2 + i);
});

const setYear = (y: number) => {
  const d = new Date(filterDate.value);
  d.setFullYear(y);
  filterDate.value = d;
};

const setPickerMonth = (m: number) => {
  const d = new Date(filterDate.value);
  d.setMonth(m);
  filterDate.value = d;
  showYearMonthPicker.value = false;
};

const filterFirstDayOfWeek = computed(() => {
  let day = new Date(filterYear.value, filterMonth.value, 1).getDay() - 1;
  return day === -1 ? 6 : day;
});

const filterDaysInMonth = computed(() =>
  new Date(filterYear.value, filterMonth.value + 1, 0).getDate()
);

const changeMonth = (delta: number) => {
  const d = new Date(filterDate.value);
  d.setMonth(d.getMonth() + delta);
  filterDate.value = d;
  showYearMonthPicker.value = false;
};

const rangeStart = ref<Date | null>(null);
const rangeEnd = ref<Date | null>(null);

const dateOfDay = (day: number) => new Date(filterYear.value, filterMonth.value, day);

const selectRangeDay = (day: number) => {
  const clicked = dateOfDay(day);
  if (!rangeStart.value || (rangeStart.value && rangeEnd.value)) {
    rangeStart.value = clicked;
    rangeEnd.value = null;
  } else {
    if (clicked < rangeStart.value) {
      rangeEnd.value = rangeStart.value;
      rangeStart.value = clicked;
    } else {
      rangeEnd.value = clicked;
    }
  }
};

// Returns background strip class for the range fill (full-width, no rounded)
const getRangeBg = (day: number) => {
  if (!rangeStart.value || !rangeEnd.value) return '';
  const t = dateOfDay(day).getTime();
  const s = rangeStart.value.getTime();
  const e = rangeEnd.value.getTime();
  if (t < s || t > e) return '';

  const isStart = t === s;
  const isEnd = t === e;
  const col = (day - 1 + filterFirstDayOfWeek.value) % 7; // 0=Mon,6=Sun

  if (isStart && isEnd) return ''; // single day, no strip
  if (isStart) return col === 6 ? '' : 'bg-primary/15 rounded-r-none rounded-l-full left-1/2';
  if (isEnd) return col === 0 ? '' : 'bg-primary/15 rounded-l-none rounded-r-full right-1/2 left-0';
  // row-start or row-end edge
  if (col === 0) return 'bg-primary/15 rounded-l-none rounded-r-none';
  if (col === 6) return 'bg-primary/15 rounded-none';
  return 'bg-primary/15';
};

// Returns circle class for individual day button
const getDayCircleClass = (day: number) => {
  const t = dateOfDay(day).getTime();
  const isStart = rangeStart.value && rangeStart.value.getTime() === t;
  const isEnd = rangeEnd.value && rangeEnd.value.getTime() === t;
  const inRange = rangeStart.value && rangeEnd.value &&
                  t >= rangeStart.value.getTime() && t <= rangeEnd.value.getTime();
  const isToday = isTodayInFilter(day);

  if (isStart || isEnd) return 'rounded-full bg-primary text-white shadow-md';
  if (inRange) return 'rounded-full text-primary';
  if (isToday) return 'rounded-full text-secondary font-bold hover:bg-black/10 dark:hover:bg-white/10';
  return 'rounded-full hover:bg-black/10 dark:hover:bg-white/10 text-primary';
};

const isTodayInFilter = (day: number) => {
  const today = new Date();
  return today.getFullYear() === filterYear.value &&
         today.getMonth() === filterMonth.value &&
         today.getDate() === day;
};

const formatDate = (d: Date) =>
  `${d.getMonth() + 1}月${d.getDate()}日`;

const clearDates = () => {
  rangeStart.value = null;
  rangeEnd.value = null;
  filterDate.value = new Date();
};

// Friend filter
const friendCollapseLimit = 4;
const friendListExpanded = ref(false);
const displayedFriends = computed(() =>
  friendListExpanded.value ? mockFriends.value : mockFriends.value.slice(0, friendCollapseLimit)
);
const selectedFriendIds = ref<Set<number>>(new Set());
const toggleFriendFilter = (id: number) => {
  const s = new Set(selectedFriendIds.value);
  s.has(id) ? s.delete(id) : s.add(id);
  selectedFriendIds.value = s;
};

// Show card title toggle
const showCardTitle = ref(true);

// Batch delete
const batchDeleteMode = ref(false);
const selectedCards = ref<Set<string | number>>(new Set());

const enterBatchDelete = () => {
  batchDeleteMode.value = true;
  showFilterPanel.value = false;
  selectedCards.value = new Set();
};

const exitBatchDelete = () => {
  batchDeleteMode.value = false;
  selectedCards.value = new Set();
};

const toggleCardSelection = (id: string | number) => {
  const s = new Set(selectedCards.value);
  s.has(id) ? s.delete(id) : s.add(id);
  selectedCards.value = s;
};

const deleteSelectedCards = () => {
  allPostcards.value = allPostcards.value.filter(
    (card: any, index: number) => !selectedCards.value.has(card.id ?? index)
  );
  localStorage.setItem('userPostcards', JSON.stringify(allPostcards.value));
  flipped.value = allPostcards.value.map(() => true);
  exitBatchDelete();
};
</script>
