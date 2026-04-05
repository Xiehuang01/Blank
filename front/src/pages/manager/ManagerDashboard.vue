<template>
  <div class="min-h-screen bg-background text-primary">
    <div class="mx-auto max-w-7xl px-4 py-6 md:px-6 lg:px-8">
      <header class="mb-6 rounded-3xl border border-black/5 bg-white/90 p-5 shadow-sm backdrop-blur-sm dark:border-white/10 dark:bg-neutral/90">
        <div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p class="text-xs font-semibold uppercase tracking-[0.3em] text-secondary">Manager</p>
            <h1 class="mt-2 font-headline text-2xl font-bold md:text-3xl">Blank 管理后台</h1>
            <p class="mt-2 text-sm text-tertiary">管理明信片、邮票系列、商店邮票、会员激活码，以及人工审核占位页面。</p>
          </div>
          <div class="flex flex-wrap gap-3">
            <button
              @click="loadOverview"
              class="rounded-xl border border-black/10 px-4 py-2 text-sm font-bold transition-colors hover:bg-black/5 dark:border-white/10 dark:hover:bg-white/5"
            >
              刷新概览
            </button>
            <button
              @click="router.push('/')"
              class="rounded-xl bg-primary px-4 py-2 text-sm font-bold text-white transition-opacity hover:opacity-90 dark:bg-secondary dark:text-black"
            >
              返回首页
            </button>
          </div>
        </div>
      </header>

      <section class="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div v-for="card in overviewCards" :key="card.label" class="rounded-2xl border border-black/5 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-neutral">
          <p class="text-sm text-tertiary">{{ card.label }}</p>
          <p class="mt-3 text-3xl font-bold text-primary">{{ card.value }}</p>
          <p class="mt-2 text-xs text-tertiary">{{ card.tip }}</p>
        </div>
      </section>

      <section class="mb-6 flex flex-wrap gap-3 rounded-2xl border border-black/5 bg-white p-3 shadow-sm dark:border-white/10 dark:bg-neutral">
        <button
          v-for="tab in tabs"
          :key="tab.key"
          @click="activeTab = tab.key"
          class="rounded-xl px-4 py-2 text-sm font-bold transition-all"
          :class="activeTab === tab.key ? 'bg-primary text-white dark:bg-secondary dark:text-black' : 'text-primary hover:bg-black/5 dark:hover:bg-white/5'"
        >
          {{ tab.label }}
        </button>
      </section>

      <section v-if="activeTab === 'postcards'" class="space-y-6">
        <div class="rounded-3xl border border-black/5 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-neutral">
          <div class="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div class="grid flex-1 gap-4 md:grid-cols-4">
              <div>
                <label class="mb-2 block text-xs font-bold text-tertiary">关键词</label>
                <input v-model.trim="postcardFilters.keyword" type="text" placeholder="标题/作者/UID/收件人" class="w-full rounded-xl border border-black/10 bg-black/5 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary dark:border-white/10 dark:bg-white/5 dark:focus:ring-secondary" />
              </div>
              <div>
                <label class="mb-2 block text-xs font-bold text-tertiary">类型</label>
                <select v-model="postcardFilters.postcardType" class="w-full rounded-xl border border-black/10 bg-black/5 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary dark:border-white/10 dark:bg-white/5 dark:focus:ring-secondary">
                  <option value="">全部</option>
                  <option value="normal">普通</option>
                  <option value="drifting">漂流</option>
                </select>
              </div>
              <div>
                <label class="mb-2 block text-xs font-bold text-tertiary">状态</label>
                <select v-model="postcardFilters.status" class="w-full rounded-xl border border-black/10 bg-black/5 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary dark:border-white/10 dark:bg-white/5 dark:focus:ring-secondary">
                  <option value="">全部</option>
                  <option value="draft">草稿</option>
                  <option value="sent">已发送</option>
                </select>
              </div>
              <div>
                <label class="mb-2 block text-xs font-bold text-tertiary">每页数量</label>
                <select v-model.number="postcardFilters.pageSize" class="w-full rounded-xl border border-black/10 bg-black/5 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary dark:border-white/10 dark:bg-white/5 dark:focus:ring-secondary">
                  <option :value="10">10</option>
                  <option :value="20">20</option>
                  <option :value="50">50</option>
                </select>
              </div>
            </div>
            <div class="flex flex-wrap gap-3">
              <button @click="handleSearchPostcards" class="rounded-xl border border-black/10 px-4 py-2 text-sm font-bold hover:bg-black/5 dark:border-white/10 dark:hover:bg-white/5">查询</button>
              <button @click="openPostcardCreate" class="rounded-xl bg-primary px-4 py-2 text-sm font-bold text-white hover:opacity-90 dark:bg-secondary dark:text-black">新增明信片</button>
            </div>
          </div>
        </div>

        <div class="grid gap-4 xl:grid-cols-2">
          <div v-for="item in postcards" :key="item.id" class="rounded-3xl border border-black/5 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-neutral">
            <div class="flex flex-col gap-4 md:flex-row">
              <div class="h-44 w-full overflow-hidden rounded-2xl bg-black/5 md:w-52 dark:bg-white/5">
                <img :src="resolveAssetUrl(item.imageUrl)" :alt="item.title || 'postcard'" class="h-full w-full object-cover" />
              </div>
              <div class="min-w-0 flex-1">
                <div class="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p class="text-xs text-tertiary">#{{ item.id }} · {{ item.authorName || '未知用户' }} / {{ item.authorUid || '--' }}</p>
                    <h3 class="mt-1 text-lg font-bold">{{ item.title || '未命名明信片' }}</h3>
                  </div>
                  <div class="flex flex-wrap gap-2 text-xs font-bold">
                    <span class="rounded-full bg-black/5 px-3 py-1 dark:bg-white/5">{{ item.postcardType === 'drifting' ? '漂流' : '普通' }}</span>
                    <span class="rounded-full bg-black/5 px-3 py-1 dark:bg-white/5">{{ item.status === 'draft' ? '草稿' : '已发送' }}</span>
                    <span class="rounded-full bg-black/5 px-3 py-1 dark:bg-white/5">{{ item.isPublic ? '公开' : '私密' }}</span>
                  </div>
                </div>
                <div class="mt-3 grid gap-2 text-sm text-tertiary md:grid-cols-2">
                  <p>收件人：{{ item.recipientInput || '无' }}</p>
                  <p>邮票：{{ item.stampTitle || '未使用' }}</p>
                  <p>尺寸：{{ item.aspectRatio }} / {{ item.canvasWidth }}×{{ item.canvasHeight }}</p>
                  <p>创建时间：{{ formatDate(item.createdAt) }}</p>
                </div>
                <p class="mt-3 line-clamp-3 rounded-2xl bg-black/5 px-3 py-2 text-xs text-tertiary dark:bg-white/5">
                  元素 JSON：{{ item.elementsRaw || '[]' }}
                </p>
                <div class="mt-4 flex flex-wrap gap-3">
                  <button @click="openPostcardEdit(item)" class="rounded-xl border border-black/10 px-4 py-2 text-sm font-bold hover:bg-black/5 dark:border-white/10 dark:hover:bg-white/5">编辑</button>
                  <button @click="removePostcard(item)" class="rounded-xl border border-red-200 px-4 py-2 text-sm font-bold text-red-500 hover:bg-red-50 dark:border-red-500/30 dark:hover:bg-red-500/10">删除</button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="flex items-center justify-between rounded-2xl border border-black/5 bg-white px-5 py-4 shadow-sm dark:border-white/10 dark:bg-neutral">
          <p class="text-sm text-tertiary">第 {{ postcardPagination.page }} / {{ postcardPagination.totalPages || 1 }} 页，共 {{ postcardPagination.total }} 条</p>
          <div class="flex gap-3">
            <button @click="changePostcardPage(postcardPagination.page - 1)" :disabled="postcardPagination.page <= 1" class="rounded-xl border border-black/10 px-4 py-2 text-sm font-bold disabled:cursor-not-allowed disabled:opacity-50 dark:border-white/10">上一页</button>
            <button @click="changePostcardPage(postcardPagination.page + 1)" :disabled="postcardPagination.page >= postcardPagination.totalPages" class="rounded-xl border border-black/10 px-4 py-2 text-sm font-bold disabled:cursor-not-allowed disabled:opacity-50 dark:border-white/10">下一页</button>
          </div>
        </div>
      </section>

      <section v-else-if="activeTab === 'series'" class="grid gap-6 lg:grid-cols-[360px_minmax(0,1fr)]">
        <div class="rounded-3xl border border-black/5 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-neutral">
          <h2 class="text-lg font-bold">{{ seriesForm.id ? '编辑系列' : '新增系列' }}</h2>
          <div class="mt-4 space-y-4">
            <div>
              <label class="mb-2 block text-xs font-bold text-tertiary">系列名称</label>
              <input v-model.trim="seriesForm.name" type="text" placeholder="例如：节日" class="w-full rounded-xl border border-black/10 bg-black/5 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary dark:border-white/10 dark:bg-white/5 dark:focus:ring-secondary" />
            </div>
            <div>
              <label class="mb-2 block text-xs font-bold text-tertiary">文件夹名 <span class="font-normal text-tertiary/60">（可选，仅新建时有效）</span></label>
              <input v-model.trim="seriesForm.folderName" :disabled="!!seriesForm.id" type="text" placeholder="例如：festival（小写字母/数字/下划线）" class="w-full rounded-xl border border-black/10 bg-black/5 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary dark:border-white/10 dark:bg-white/5 dark:focus:ring-secondary disabled:opacity-50 disabled:cursor-not-allowed" />
              <p class="mt-1 text-xs text-tertiary/70">创建后将在 res/stamps/systemstamps/ 下自动建立对应文件夹</p>
            </div>
            <div>
              <label class="mb-2 block text-xs font-bold text-tertiary">系列描述</label>
              <textarea v-model.trim="seriesForm.description" rows="4" placeholder="输入系列简介" class="w-full rounded-xl border border-black/10 bg-black/5 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary dark:border-white/10 dark:bg-white/5 dark:focus:ring-secondary"></textarea>
            </div>
            <div>
              <label class="mb-2 block text-xs font-bold text-tertiary">排序值</label>
              <input v-model.number="seriesForm.sortOrder" type="number" min="0" class="w-full rounded-xl border border-black/10 bg-black/5 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary dark:border-white/10 dark:bg-white/5 dark:focus:ring-secondary" />
            </div>
            <div class="flex gap-3">
              <button @click="submitSeriesForm" class="flex-1 rounded-xl bg-primary px-4 py-2.5 text-sm font-bold text-white hover:opacity-90 dark:bg-secondary dark:text-black">{{ seriesForm.id ? '保存系列' : '创建系列' }}</button>
              <button @click="resetSeriesForm" class="rounded-xl border border-black/10 px-4 py-2.5 text-sm font-bold hover:bg-black/5 dark:border-white/10 dark:hover:bg-white/5">重置</button>
            </div>
          </div>
        </div>

        <div class="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <div v-for="series in stampSeries" :key="series.id" class="rounded-3xl border border-black/5 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-neutral">
            <div class="flex items-start justify-between gap-3">
              <div>
                <h3 class="text-lg font-bold">{{ series.name }}</h3>
                <p class="mt-2 text-sm text-tertiary">{{ series.description || '暂无描述' }}</p>
              </div>
              <span class="rounded-full bg-black/5 px-3 py-1 text-xs font-bold dark:bg-white/5">{{ series.stampCount }} 张</span>
            </div>
            <div class="mt-4 space-y-2 text-sm text-tertiary">
              <p v-if="series.folderName" class="font-mono text-xs bg-black/5 dark:bg-white/5 rounded px-2 py-1">📁 systemstamps/{{ series.folderName }}/</p>
              <p>排序：{{ series.sortOrder }}</p>
              <p>创建：{{ formatDate(series.createdAt) }}</p>
            </div>
            <div class="mt-4 flex gap-3">
              <button @click="fillSeriesForm(series)" class="rounded-xl border border-black/10 px-4 py-2 text-sm font-bold hover:bg-black/5 dark:border-white/10 dark:hover:bg-white/5">编辑</button>
              <button @click="removeSeries(series)" class="rounded-xl border border-red-200 px-4 py-2 text-sm font-bold text-red-500 hover:bg-red-50 dark:border-red-500/30 dark:hover:bg-red-500/10">删除</button>
            </div>
          </div>
        </div>
      </section>

      <section v-else-if="activeTab === 'stamps'" class="grid gap-6 lg:grid-cols-[380px_minmax(0,1fr)]">
        <div class="space-y-6">
          <div class="rounded-3xl border border-black/5 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-neutral">
            <div class="flex items-center justify-between gap-3">
              <h2 class="text-lg font-bold">{{ stampForm.id ? '编辑邮票' : '新增邮票' }}</h2>
              <button @click="resetStampForm" class="text-sm font-bold text-secondary">重置</button>
            </div>
            <div class="mt-4 space-y-4">
              <div>
                <label class="mb-2 block text-xs font-bold text-tertiary">所属系列</label>
                <select v-model="stampForm.seriesId" class="w-full rounded-xl border border-black/10 bg-black/5 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary dark:border-white/10 dark:bg-white/5 dark:focus:ring-secondary">
                  <option value="">请选择系列</option>
                  <option v-for="series in stampSeries" :key="series.id" :value="series.name">{{ series.name }}</option>
                </select>
              </div>
              <div>
                <label class="mb-2 block text-xs font-bold text-tertiary">邮票标题</label>
                <input v-model.trim="stampForm.title" type="text" placeholder="输入邮票标题" class="w-full rounded-xl border border-black/10 bg-black/5 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary dark:border-white/10 dark:bg-white/5 dark:focus:ring-secondary" />
              </div>
              <div>
                <label class="mb-2 block text-xs font-bold text-tertiary">价格（邮分）</label>
                <input v-model.number="stampForm.price" type="number" min="0" class="w-full rounded-xl border border-black/10 bg-black/5 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary dark:border-white/10 dark:bg-white/5 dark:focus:ring-secondary" />
              </div>
              <div>
                <label class="mb-2 block text-xs font-bold text-tertiary">图片地址</label>
                <input v-if="!selectedSeriesFolderName" v-model.trim="stampForm.imagePath" type="text" placeholder="/uploads/stamps/xxx.png 或 /res/..." class="w-full rounded-xl border border-black/10 bg-black/5 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary dark:border-white/10 dark:bg-white/5 dark:focus:ring-secondary" />
                <p v-else class="rounded-xl border border-black/10 bg-black/5 px-3 py-2.5 text-sm text-tertiary font-mono">{{ stampForm.imagePath || `自动保存至 systemstamps/${selectedSeriesFolderName}/` }}</p>
              </div>
              <div>
                <label class="mb-2 block text-xs font-bold text-tertiary">上传图片</label>
                <input type="file" accept="image/png,image/jpeg,image/gif,image/webp" @change="handleStampImageUpload" class="block w-full text-sm text-tertiary file:mr-3 file:rounded-xl file:border-0 file:bg-primary file:px-4 file:py-2 file:font-bold file:text-white dark:file:bg-secondary dark:file:text-black" />
                <p v-if="selectedSeriesFolderName" class="mt-1 text-xs text-secondary">图片将自动存入 res/stamps/systemstamps/{{ selectedSeriesFolderName }}/</p>
              </div>
              <div>
                <label class="mb-2 block text-xs font-bold text-tertiary">邮票描述</label>
                <textarea v-model.trim="stampForm.description" rows="5" placeholder="输入邮票描述" class="w-full rounded-xl border border-black/10 bg-black/5 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary dark:border-white/10 dark:bg-white/5 dark:focus:ring-secondary"></textarea>
              </div>
              <button @click="submitStampForm" class="w-full rounded-xl bg-primary px-4 py-2.5 text-sm font-bold text-white hover:opacity-90 dark:bg-secondary dark:text-black">{{ stampForm.id ? '保存邮票' : '创建邮票' }}</button>
            </div>
          </div>

          <div class="rounded-3xl border border-black/5 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-neutral">
            <h3 class="text-base font-bold">筛选邮票</h3>
            <div class="mt-4 grid gap-4">
              <input v-model.trim="stampFilters.keyword" type="text" placeholder="标题/描述/系列" class="w-full rounded-xl border border-black/10 bg-black/5 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary dark:border-white/10 dark:bg-white/5 dark:focus:ring-secondary" />
              <select v-model="stampFilters.seriesId" class="w-full rounded-xl border border-black/10 bg-black/5 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary dark:border-white/10 dark:bg-white/5 dark:focus:ring-secondary">
                <option value="">全部系列</option>
                <option v-for="series in stampSeries" :key="series.id" :value="series.name">{{ series.name }}</option>
              </select>
              <button @click="loadAdminStamps" class="rounded-xl border border-black/10 px-4 py-2.5 text-sm font-bold hover:bg-black/5 dark:border-white/10 dark:hover:bg-white/5">刷新邮票列表</button>
            </div>
          </div>
        </div>

        <div class="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <div v-for="stamp in stamps" :key="stamp.id" class="rounded-3xl border border-black/5 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-neutral">
            <div class="aspect-square overflow-hidden rounded-2xl bg-black/5 dark:bg-white/5">
              <img :src="resolveAssetUrl(stamp.imagePath)" :alt="stamp.title" class="h-full w-full object-cover" />
            </div>
            <div class="mt-4">
              <div class="flex items-start justify-between gap-3">
                <div>
                  <p class="text-xs text-tertiary">#{{ stamp.id }} · {{ stamp.seriesId }}</p>
                  <h3 class="mt-1 text-lg font-bold">{{ stamp.title }}</h3>
                </div>
                <span class="rounded-full bg-black/5 px-3 py-1 text-xs font-bold dark:bg-white/5">{{ stamp.price }} 邮分</span>
              </div>
              <p class="mt-3 line-clamp-3 text-sm text-tertiary">{{ stamp.description || '暂无描述' }}</p>
              <p class="mt-3 break-all rounded-2xl bg-black/5 px-3 py-2 text-xs text-tertiary dark:bg-white/5">{{ stamp.imagePath }}</p>
              <div class="mt-4 flex gap-3">
                <button @click="fillStampForm(stamp)" class="rounded-xl border border-black/10 px-4 py-2 text-sm font-bold hover:bg-black/5 dark:border-white/10 dark:hover:bg-white/5">编辑</button>
                <button @click="removeStamp(stamp)" class="rounded-xl border border-red-200 px-4 py-2 text-sm font-bold text-red-500 hover:bg-red-50 dark:border-red-500/30 dark:hover:bg-red-500/10">删除</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section v-else-if="activeTab === 'codes'" class="grid gap-6 lg:grid-cols-[360px_minmax(0,1fr)]">
        <div class="rounded-3xl border border-black/5 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-neutral">
          <h2 class="text-lg font-bold">一键生成会员激活码</h2>
          <div class="mt-4 space-y-4">
            <div>
              <label class="mb-2 block text-xs font-bold text-tertiary">生成数量</label>
              <input v-model.number="activationForm.quantity" type="number" min="1" max="50" class="w-full rounded-xl border border-black/10 bg-black/5 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary dark:border-white/10 dark:bg-white/5 dark:focus:ring-secondary" />
            </div>
            <div>
              <label class="mb-2 block text-xs font-bold text-tertiary">会员等级</label>
              <input v-model.trim="activationForm.vipLevel" type="text" placeholder="例如 VIP 1" class="w-full rounded-xl border border-black/10 bg-black/5 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary dark:border-white/10 dark:bg-white/5 dark:focus:ring-secondary" />
            </div>
            <div>
              <label class="mb-2 block text-xs font-bold text-tertiary">有效天数</label>
              <input v-model.number="activationForm.validDays" type="number" min="1" class="w-full rounded-xl border border-black/10 bg-black/5 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary dark:border-white/10 dark:bg-white/5 dark:focus:ring-secondary" />
            </div>
            <div>
              <label class="mb-2 block text-xs font-bold text-tertiary">备注</label>
              <textarea v-model.trim="activationForm.note" rows="4" placeholder="批次用途说明" class="w-full rounded-xl border border-black/10 bg-black/5 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary dark:border-white/10 dark:bg-white/5 dark:focus:ring-secondary"></textarea>
            </div>
            <button @click="handleGenerateActivationCodes" class="w-full rounded-xl bg-primary px-4 py-2.5 text-sm font-bold text-white hover:opacity-90 dark:bg-secondary dark:text-black">立即生成</button>
          </div>
        </div>

        <div class="space-y-4">
          <div v-for="code in activationCodes" :key="code.id" class="rounded-3xl border border-black/5 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-neutral">
            <div class="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
              <div>
                <p class="font-mono text-lg font-bold tracking-wide text-primary">{{ code.code }}</p>
                <div class="mt-3 flex flex-wrap gap-2 text-xs font-bold">
                  <span class="rounded-full bg-black/5 px-3 py-1 dark:bg-white/5">{{ code.vipLevel }}</span>
                  <span class="rounded-full bg-black/5 px-3 py-1 dark:bg-white/5">{{ code.validDays }} 天</span>
                  <span class="rounded-full px-3 py-1" :class="code.status === 'unused' ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-300' : 'bg-black/5 text-tertiary dark:bg-white/5'">{{ activationStatusText(code.status) }}</span>
                </div>
              </div>
              <button @click="removeActivationCode(code)" class="rounded-xl border border-red-200 px-4 py-2 text-sm font-bold text-red-500 hover:bg-red-50 dark:border-red-500/30 dark:hover:bg-red-500/10">删除</button>
            </div>
            <div class="mt-4 grid gap-2 text-sm text-tertiary md:grid-cols-2">
              <p>创建人：{{ code.createdByName || '系统' }}</p>
              <p>创建时间：{{ formatDate(code.createdAt) }}</p>
              <p>使用者：{{ code.usedByName || '未使用' }}</p>
              <p>使用时间：{{ code.usedAt ? formatDate(code.usedAt) : '未使用' }}</p>
            </div>
            <p class="mt-3 rounded-2xl bg-black/5 px-3 py-2 text-sm text-tertiary dark:bg-white/5">备注：{{ code.note || '无' }}</p>
          </div>
        </div>
      </section>

      <section v-else class="space-y-6">
        <div class="flex items-center justify-between">
          <div>
            <h2 class="text-xl font-bold">明信片人工审核</h2>
            <p class="mt-1 text-sm text-tertiary">AI审核未通过的明信片将出现在此处，请人工判断是否通过</p>
          </div>
          <button @click="loadPendingList" class="rounded-xl border border-black/10 px-4 py-2 text-sm font-bold hover:bg-black/5 dark:border-white/10 dark:hover:bg-white/5">刷新</button>
        </div>

        <div v-if="pendingPostcards.length === 0" class="flex flex-col items-center justify-center py-20 text-tertiary">
          <p class="text-sm font-medium">暂无待审核明信片</p>
        </div>

        <div v-else class="grid gap-5 xl:grid-cols-2">
          <div v-for="item in pendingPostcards" :key="`audit-${item.id}`" class="rounded-3xl border border-black/5 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-neutral">
            <div class="flex gap-4">
              <!-- Front image preview -->
              <div class="h-40 w-44 flex-shrink-0 overflow-hidden rounded-2xl bg-black/5 dark:bg-white/5 border border-black/10 relative">
                <img :src="resolveAssetUrl(item.image)" :alt="item.title || 'postcard'" class="h-full w-full object-cover"
                  :style="item.imageOffset ? { transform: `translate(${item.imageOffset.x}px, ${item.imageOffset.y}px) scale(${item.imageScale || 1}) rotate(${item.imageRotation || 0}deg)` } : {}" />
              </div>
              <div class="min-w-0 flex-1">
                <p class="text-xs text-tertiary">#{{ item.id }} · {{ item.authorName || item.authorUid || '未知' }}</p>
                <h3 class="mt-1 text-lg font-bold truncate">{{ item.title || '未命名明信片' }}</h3>
                <p class="mt-2 text-sm text-tertiary">{{ item.postcardType === 'drifting' ? '漂流' : '普通' }} / {{ item.isPublic ? '公开' : '私密' }}</p>
                <p class="mt-1 text-sm text-tertiary">提交：{{ formatDate(item.createdAt) }}</p>
                <div v-if="item.reviewReason" class="mt-2 rounded-lg bg-red-50 dark:bg-red-900/10 px-3 py-2 text-xs text-red-600 dark:text-red-400">
                  AI原因: {{ item.reviewReason }}
                </div>
              </div>
            </div>

            <!-- Back preview - scaled postcard back -->
            <div class="mt-4 relative w-full overflow-hidden rounded-xl border border-black/10"
              :style="{ aspectRatio: item.aspectRatio || '3/2' }"
              :ref="el => { if (el) auditBackRefs[item.id] = el as HTMLElement }"
            >
              <div class="absolute inset-0 bg-white overflow-hidden">
                <div class="absolute top-0 left-0 origin-top-left" :style="getAuditBackScale(item)">
                  <div class="flex p-5 bg-white" :style="{ width: (item.canvasWidth || 600) + 'px', height: (item.canvasHeight || 400) + 'px' }">
                    <div class="flex-1 flex flex-col pr-5 border-r border-black/20 overflow-hidden">
                      <h4 class="text-xl tracking-widest text-black/60 mb-2" style="font-family:var(--font-headline,serif)">POSTCARD</h4>
                      <div class="flex-1 flex flex-col gap-8 pt-6 pb-2">
                        <div v-for="n in 10" :key="n" class="w-full h-[1px] bg-black/10"></div>
                      </div>
                    </div>
                    <div class="flex-1 flex flex-col pl-5 relative">
                      <div class="flex justify-end relative mb-4">
                        <div v-if="item.stamp" class="absolute -top-1 -right-1 w-32 h-32 flex items-center justify-center" style="filter:drop-shadow(2px 4px 6px rgba(230,220,200,0.8))">
                          <img :src="resolveAssetUrl(item.stamp.image)" class="w-full h-full object-cover" />
                        </div>
                        <div v-else class="w-20 h-24 border-2 border-dashed border-black/30 flex items-center justify-center bg-black/5">
                          <span class="text-xs font-bold text-black/40">邮票</span>
                        </div>
                      </div>
                      <div class="flex-1 flex flex-col justify-end gap-4 pb-2">
                        <div class="flex items-end gap-3"><span class="text-xs text-black/60">to:</span><div class="flex-1 h-[1px] bg-black/20"></div></div>
                        <div class="w-full h-[1px] bg-black/20 mt-3"></div>
                        <div class="flex items-end gap-3"><span class="text-xs text-black/60">from:</span><div class="flex-1 h-[1px] bg-black/20"></div></div>
                        <div class="w-full h-[1px] bg-black/20"></div>
                      </div>
                    </div>
                    <!-- Elements -->
                    <div v-for="(el, ei) in (item.elements || [])" :key="ei" class="absolute pointer-events-none"
                      :style="{ left: el.x + 'px', top: el.y + 'px', transform: `rotate(${el.rotation}deg) scale(${el.scale || 1})`, transformOrigin: 'top left', width: el.type === 'text' ? 'auto' : el.width + 'px', height: el.type === 'text' ? 'auto' : el.height + 'px', zIndex: ei + 10 }">
                      <span v-if="el.type === 'text'" :style="{ fontFamily: el.fontFamily, fontSize: el.fontSize + 'px', color: el.color, fontWeight: el.fontWeight, fontStyle: el.fontStyle, textDecoration: el.textDecoration }">{{ el.content }}</span>
                      <img v-else-if="el.type === 'sticker'" :src="resolveAssetUrl(el.content)" class="w-full h-full object-contain" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="mt-4 flex gap-3">
              <button @click="handleAuditApprove(item)" class="flex-1 rounded-xl bg-primary px-4 py-2.5 text-sm font-bold text-white hover:opacity-90 dark:bg-secondary dark:text-black">通过</button>
              <button @click="handleAuditReject(item)" class="flex-1 rounded-xl border border-red-200 px-4 py-2.5 text-sm font-bold text-red-500 hover:bg-red-50 dark:border-red-500/30 dark:hover:bg-red-500/10">驳回</button>
            </div>
          </div>
        </div>
      </section>
    </div>

    <div v-if="postcardModalVisible" class="fixed inset-0 z-[120] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm" @click.self="closePostcardModal">
      <div class="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-3xl border border-black/5 bg-white p-6 shadow-2xl dark:border-white/10 dark:bg-neutral">
        <div class="flex items-center justify-between gap-4">
          <div>
            <h3 class="text-xl font-bold">{{ postcardForm.id ? '编辑明信片' : '新增明信片' }}</h3>
            <p class="mt-1 text-sm text-tertiary">支持管理员直接维护用户明信片记录。</p>
          </div>
          <button @click="closePostcardModal" class="rounded-full border border-black/10 px-3 py-1.5 text-sm font-bold hover:bg-black/5 dark:border-white/10 dark:hover:bg-white/5">关闭</button>
        </div>

        <div class="mt-6 grid gap-4 md:grid-cols-2">
          <div>
            <label class="mb-2 block text-xs font-bold text-tertiary">用户 ID</label>
            <input v-model.number="postcardForm.userId" type="number" min="1" class="w-full rounded-xl border border-black/10 bg-black/5 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary dark:border-white/10 dark:bg-white/5 dark:focus:ring-secondary" />
          </div>
          <div>
            <label class="mb-2 block text-xs font-bold text-tertiary">收件人</label>
            <input v-model.trim="postcardForm.recipientInput" type="text" class="w-full rounded-xl border border-black/10 bg-black/5 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary dark:border-white/10 dark:bg-white/5 dark:focus:ring-secondary" />
          </div>
          <div class="md:col-span-2">
            <label class="mb-2 block text-xs font-bold text-tertiary">标题</label>
            <input v-model.trim="postcardForm.title" type="text" class="w-full rounded-xl border border-black/10 bg-black/5 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary dark:border-white/10 dark:bg-white/5 dark:focus:ring-secondary" />
          </div>
          <div class="md:col-span-2">
            <label class="mb-2 block text-xs font-bold text-tertiary">图片地址</label>
            <input v-model.trim="postcardForm.imageUrl" type="text" class="w-full rounded-xl border border-black/10 bg-black/5 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary dark:border-white/10 dark:bg-white/5 dark:focus:ring-secondary" />
          </div>
          <div>
            <label class="mb-2 block text-xs font-bold text-tertiary">明信片类型</label>
            <select v-model="postcardForm.postcardType" class="w-full rounded-xl border border-black/10 bg-black/5 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary dark:border-white/10 dark:bg-white/5 dark:focus:ring-secondary">
              <option value="normal">普通</option>
              <option value="drifting">漂流</option>
            </select>
          </div>
          <div>
            <label class="mb-2 block text-xs font-bold text-tertiary">状态</label>
            <select v-model="postcardForm.status" class="w-full rounded-xl border border-black/10 bg-black/5 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary dark:border-white/10 dark:bg-white/5 dark:focus:ring-secondary">
              <option value="sent">已发送</option>
              <option value="draft">草稿</option>
            </select>
          </div>
          <div>
            <label class="mb-2 block text-xs font-bold text-tertiary">比例</label>
            <input v-model.trim="postcardForm.aspectRatio" type="text" class="w-full rounded-xl border border-black/10 bg-black/5 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary dark:border-white/10 dark:bg-white/5 dark:focus:ring-secondary" />
          </div>
          <div>
            <label class="mb-2 block text-xs font-bold text-tertiary">关联邮票 ID</label>
            <input v-model.number="postcardForm.stampId" type="number" min="1" class="w-full rounded-xl border border-black/10 bg-black/5 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary dark:border-white/10 dark:bg-white/5 dark:focus:ring-secondary" />
          </div>
          <div>
            <label class="mb-2 block text-xs font-bold text-tertiary">画布宽度</label>
            <input v-model.number="postcardForm.canvasWidth" type="number" min="1" class="w-full rounded-xl border border-black/10 bg-black/5 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary dark:border-white/10 dark:bg-white/5 dark:focus:ring-secondary" />
          </div>
          <div>
            <label class="mb-2 block text-xs font-bold text-tertiary">画布高度</label>
            <input v-model.number="postcardForm.canvasHeight" type="number" min="1" class="w-full rounded-xl border border-black/10 bg-black/5 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary dark:border-white/10 dark:bg-white/5 dark:focus:ring-secondary" />
          </div>
          <div class="md:col-span-2 grid gap-4 md:grid-cols-3">
            <label class="flex items-center gap-2 rounded-2xl bg-black/5 px-4 py-3 text-sm dark:bg-white/5">
              <input v-model="postcardForm.isPublic" type="checkbox" />
              公开到广场
            </label>
            <label class="flex items-center gap-2 rounded-2xl bg-black/5 px-4 py-3 text-sm dark:bg-white/5">
              <input v-model="postcardForm.senderDeleted" type="checkbox" />
              发件人已删除
            </label>
            <label class="flex items-center gap-2 rounded-2xl bg-black/5 px-4 py-3 text-sm dark:bg-white/5">
              <input v-model="postcardForm.recipientDeleted" type="checkbox" />
              收件人已删除
            </label>
          </div>
          <div class="md:col-span-2">
            <label class="mb-2 block text-xs font-bold text-tertiary">元素 JSON</label>
            <textarea v-model="postcardForm.elementsRaw" rows="8" class="w-full rounded-xl border border-black/10 bg-black/5 px-3 py-2.5 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-primary dark:border-white/10 dark:bg-white/5 dark:focus:ring-secondary"></textarea>
          </div>
        </div>

        <div class="mt-6 flex flex-wrap justify-end gap-3">
          <button @click="closePostcardModal" class="rounded-xl border border-black/10 px-4 py-2.5 text-sm font-bold hover:bg-black/5 dark:border-white/10 dark:hover:bg-white/5">取消</button>
          <button @click="submitPostcardForm" class="rounded-xl bg-primary px-4 py-2.5 text-sm font-bold text-white hover:opacity-90 dark:bg-secondary dark:text-black">{{ postcardForm.id ? '保存明信片' : '创建明信片' }}</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import {
  getAdminOverview,
  getAdminPostcards,
  createAdminPostcard,
  updateAdminPostcard,
  deleteAdminPostcard,
  getAdminStampSeries,
  createAdminStampSeries,
  updateAdminStampSeries,
  deleteAdminStampSeries,
  getAdminStamps,
  createAdminStamp,
  updateAdminStamp,
  deleteAdminStamp,
  uploadAdminStampImage,
  getActivationCodes,
  generateActivationCodes,
  deleteActivationCode,
  getPendingPostcards,
  approvePostcard as approvePostcardApi,
  rejectPostcard as rejectPostcardApi,
} from '../../api/admin.js';
import { assetBaseURL } from '../../utils/request.js';

const router = useRouter();

const tabs = [
  { key: 'postcards', label: '明信片管理' },
  { key: 'series', label: '邮票系列' },
  { key: 'stamps', label: '邮票管理' },
  { key: 'codes', label: '会员激活码' },
  { key: 'audit', label: '人工审核' },
];

const activeTab = ref('postcards');
const overview = ref<any>({});
const postcards = ref<any[]>([]);
const stampSeries = ref<any[]>([]);
const stamps = ref<any[]>([]);
const activationCodes = ref<any[]>([]);

const postcardPagination = ref({
  total: 0,
  page: 1,
  pageSize: 10,
  totalPages: 1,
});

const postcardFilters = ref({
  keyword: '',
  postcardType: '',
  status: '',
  page: 1,
  pageSize: 10,
});

const stampFilters = ref({
  keyword: '',
  seriesId: '',
});

const postcardModalVisible = ref(false);
const postcardForm = ref<any>({});
const seriesForm = ref<any>({});
const stampForm = ref<any>({});
const activationForm = ref({
  quantity: 10,
  vipLevel: 'VIP 1',
  validDays: 30,
  note: '',
});

const resetPostcardForm = () => {
  postcardForm.value = {
    id: null,
    userId: undefined,
    title: '',
    imageUrl: '',
    recipientInput: '',
    isPublic: false,
    postcardType: 'normal',
    status: 'sent',
    aspectRatio: '3/2',
    stampId: undefined,
    canvasWidth: 600,
    canvasHeight: 400,
    senderDeleted: false,
    recipientDeleted: false,
    elementsRaw: '[]',
  };
};

const resetSeriesForm = () => {
  seriesForm.value = {
    id: null,
    name: '',
    folderName: '',
    description: '',
    sortOrder: 0,
  };
};

const resetStampForm = () => {
  stampForm.value = {
    id: null,
    seriesId: '',
    title: '',
    description: '',
    price: 5,
    imagePath: '',
  };
};

resetPostcardForm();
resetSeriesForm();
resetStampForm();

const selectedSeriesFolderName = computed(() => {
  if (!stampForm.value.seriesId) return null;
  const found = stampSeries.value.find((s: any) => s.name === stampForm.value.seriesId);
  return found?.folderName || null;
});

const overviewCards = computed(() => [
  { label: '用户总数', value: overview.value.totalUsers ?? 0, tip: `管理员 ${overview.value.totalAdmins ?? 0} 人` },
  { label: '明信片总数', value: overview.value.totalPostcards ?? 0, tip: `漂流 ${overview.value.driftingPostcards ?? 0} 张` },
  { label: '邮票 / 系列', value: `${overview.value.totalStamps ?? 0} / ${overview.value.totalSeries ?? 0}`, tip: '商店在售资源' },
  { label: '未使用激活码', value: overview.value.unusedActivationCodes ?? 0, tip: `总数 ${overview.value.totalActivationCodes ?? 0}` },
]);

const getErrorMessage = (error: any, fallback: string) => {
  return error?.data?.message || error?.response?.data?.message || error?.message || fallback;
};

const resolveAssetUrl = (url?: string | null) => {
  if (!url) return '';
  if (/^(https?:)?\/\//.test(url) || url.startsWith('data:')) return url;
  return `${assetBaseURL}${url.startsWith('/') ? url : `/${url}`}`;
};

const formatDate = (value?: string) => {
  if (!value) return '--';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
};

const activationStatusText = (status: string) => {
  if (status === 'used') return '已使用';
  if (status === 'disabled') return '已禁用';
  return '未使用';
};

const loadOverview = async () => {
  try {
    const res = await getAdminOverview();
    overview.value = res.data || {};
  } catch (error: any) {
    ElMessage.error(getErrorMessage(error, '加载管理概览失败'));
  }
};

const loadAdminPostcards = async () => {
  try {
    const res = await getAdminPostcards(postcardFilters.value);
    postcards.value = res.data?.list || [];
    postcardPagination.value = {
      total: res.data?.pagination?.total ?? 0,
      page: res.data?.pagination?.page ?? postcardFilters.value.page,
      pageSize: res.data?.pagination?.pageSize ?? postcardFilters.value.pageSize,
      totalPages: res.data?.pagination?.totalPages ?? 1,
    };
  } catch (error: any) {
    ElMessage.error(getErrorMessage(error, '加载明信片列表失败'));
  }
};

const loadStampSeries = async () => {
  try {
    const res = await getAdminStampSeries();
    stampSeries.value = res.data || [];
  } catch (error: any) {
    ElMessage.error(getErrorMessage(error, '加载邮票系列失败'));
  }
};

const loadAdminStamps = async () => {
  try {
    const res = await getAdminStamps(stampFilters.value);
    stamps.value = res.data || [];
  } catch (error: any) {
    ElMessage.error(getErrorMessage(error, '加载邮票失败'));
  }
};

const loadActivationCodes = async () => {
  try {
    const res = await getActivationCodes();
    activationCodes.value = res.data || [];
  } catch (error: any) {
    ElMessage.error(getErrorMessage(error, '加载激活码失败'));
  }
};

const handleSearchPostcards = async () => {
  postcardFilters.value.page = 1;
  await loadAdminPostcards();
};

const changePostcardPage = async (page: number) => {
  if (page < 1 || page > postcardPagination.value.totalPages) return;
  postcardFilters.value.page = page;
  await loadAdminPostcards();
};

const openPostcardCreate = () => {
  resetPostcardForm();
  postcardModalVisible.value = true;
};

const openPostcardEdit = (item: any) => {
  postcardForm.value = {
    id: item.id,
    userId: item.userId,
    title: item.title,
    imageUrl: item.imageUrl,
    recipientInput: item.recipientInput,
    isPublic: !!item.isPublic,
    postcardType: item.postcardType,
    status: item.status,
    aspectRatio: item.aspectRatio,
    stampId: item.stampId || undefined,
    canvasWidth: item.canvasWidth,
    canvasHeight: item.canvasHeight,
    senderDeleted: !!item.senderDeleted,
    recipientDeleted: !!item.recipientDeleted,
    elementsRaw: item.elementsRaw || '[]',
  };
  postcardModalVisible.value = true;
};

const closePostcardModal = () => {
  postcardModalVisible.value = false;
  resetPostcardForm();
};

const submitPostcardForm = async () => {
  try {
    const payload = {
      userId: postcardForm.value.userId,
      title: postcardForm.value.title,
      imageUrl: postcardForm.value.imageUrl,
      recipientInput: postcardForm.value.recipientInput,
      isPublic: postcardForm.value.isPublic,
      postcardType: postcardForm.value.postcardType,
      status: postcardForm.value.status,
      aspectRatio: postcardForm.value.aspectRatio,
      stampId: postcardForm.value.stampId || null,
      canvasWidth: postcardForm.value.canvasWidth,
      canvasHeight: postcardForm.value.canvasHeight,
      senderDeleted: postcardForm.value.senderDeleted,
      recipientDeleted: postcardForm.value.recipientDeleted,
      elements: postcardForm.value.elementsRaw,
    };

    if (postcardForm.value.id) {
      const res = await updateAdminPostcard(postcardForm.value.id, payload);
      ElMessage.success(res.message || '明信片更新成功');
    } else {
      const res = await createAdminPostcard(payload);
      ElMessage.success(res.message || '明信片创建成功');
    }

    closePostcardModal();
    await Promise.all([loadAdminPostcards(), loadOverview()]);
  } catch (error: any) {
    ElMessage.error(getErrorMessage(error, '保存明信片失败'));
  }
};

const removePostcard = async (item: any) => {
  if (!window.confirm(`确定删除明信片 #${item.id} 吗？`)) return;

  try {
    const res = await deleteAdminPostcard(item.id);
    ElMessage.success(res.message || '明信片删除成功');
    await Promise.all([loadAdminPostcards(), loadOverview()]);
  } catch (error: any) {
    ElMessage.error(getErrorMessage(error, '删除明信片失败'));
  }
};

const fillSeriesForm = (series: any) => {
  seriesForm.value = {
    id: series.id,
    name: series.name,
    folderName: series.folderName || '',
    description: series.description,
    sortOrder: series.sortOrder,
  };
};

const submitSeriesForm = async () => {
  try {
    if (seriesForm.value.id) {
      const res = await updateAdminStampSeries(seriesForm.value.id, seriesForm.value);
      ElMessage.success(res.message || '系列更新成功');
    } else {
      const res = await createAdminStampSeries(seriesForm.value);
      ElMessage.success(res.message || '系列创建成功');
    }

    resetSeriesForm();
    await Promise.all([loadStampSeries(), loadAdminStamps(), loadOverview()]);
  } catch (error: any) {
    ElMessage.error(getErrorMessage(error, '保存系列失败'));
  }
};

const removeSeries = async (series: any) => {
  if (!window.confirm(`确定删除系列“${series.name}”吗？`)) return;

  try {
    const res = await deleteAdminStampSeries(series.id);
    ElMessage.success(res.message || '系列删除成功');
    await Promise.all([loadStampSeries(), loadOverview()]);
  } catch (error: any) {
    ElMessage.error(getErrorMessage(error, '删除系列失败'));
  }
};

const fillStampForm = (stamp: any) => {
  stampForm.value = {
    id: stamp.id,
    seriesId: stamp.seriesId,
    title: stamp.title,
    description: stamp.description,
    price: stamp.price,
    imagePath: stamp.imagePath,
  };
};

const submitStampForm = async () => {
  try {
    if (stampForm.value.id) {
      const res = await updateAdminStamp(stampForm.value.id, stampForm.value);
      ElMessage.success(res.message || '邮票更新成功');
    } else {
      const res = await createAdminStamp(stampForm.value);
      ElMessage.success(res.message || '邮票创建成功');
    }

    resetStampForm();
    await Promise.all([loadAdminStamps(), loadStampSeries(), loadOverview()]);
  } catch (error: any) {
    ElMessage.error(getErrorMessage(error, '保存邮票失败'));
  }
};

const handleStampImageUpload = async (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0];
  if (!file) return;

  try {
    const res = await uploadAdminStampImage(file, stampForm.value.seriesId || '');
    stampForm.value.imagePath = res.data?.imagePath || '';
    ElMessage.success(res.message || '图片上传成功');
  } catch (error: any) {
    ElMessage.error(getErrorMessage(error, '上传邮票图片失败'));
  } finally {
    (event.target as HTMLInputElement).value = '';
  }
};

const removeStamp = async (stamp: any) => {
  if (!window.confirm(`确定删除邮票“${stamp.title}”吗？`)) return;

  try {
    const res = await deleteAdminStamp(stamp.id);
    ElMessage.success(res.message || '邮票删除成功');
    await Promise.all([loadAdminStamps(), loadStampSeries(), loadOverview()]);
  } catch (error: any) {
    ElMessage.error(getErrorMessage(error, '删除邮票失败'));
  }
};

const handleGenerateActivationCodes = async () => {
  try {
    const res = await generateActivationCodes(activationForm.value);
    ElMessage.success(res.message || '激活码生成成功');
    await Promise.all([loadActivationCodes(), loadOverview()]);
  } catch (error: any) {
    ElMessage.error(getErrorMessage(error, '生成激活码失败'));
  }
};

const removeActivationCode = async (code: any) => {
  if (!window.confirm(`确定删除激活码 ${code.code} 吗？`)) return;

  try {
    const res = await deleteActivationCode(code.id);
    ElMessage.success(res.message || '激活码删除成功');
    await Promise.all([loadActivationCodes(), loadOverview()]);
  } catch (error: any) {
    ElMessage.error(getErrorMessage(error, '删除激活码失败'));
  }
};

const pendingPostcards = ref<any[]>([]);

const loadPendingList = async () => {
  try {
    const res = await getPendingPostcards();
    pendingPostcards.value = res.data || [];
  } catch (e: any) {
    console.error('加载待审核列表失败:', e);
  }
};

const auditBackRefs = ref<Record<number, HTMLElement>>({});

const getAuditBackScale = (item: any) => {
  const srcW = item.canvasWidth || 600;
  const srcH = item.canvasHeight || 400;
  const el = auditBackRefs.value[item.id];
  const containerW = el ? el.offsetWidth : srcW;
  const containerH = el ? el.offsetHeight : srcH;
  const scale = Math.min(containerW / srcW, containerH / srcH, 1);
  return {
    width: srcW + 'px',
    height: srcH + 'px',
    transform: `scale(${scale})`,
    transformOrigin: 'top left',
  };
};

const handleAuditApprove = async (item: any) => {
  if (!window.confirm(`确定通过明信片 #${item.id} "${item.title || '未命名'}" 的审核？`)) return;
  try {
    const res = await approvePostcardApi(item.id);
    ElMessage.success(res.message || '审核通过');
    await loadPendingList();
  } catch (e: any) {
    ElMessage.error(getErrorMessage(e, '操作失败'));
  }
};

const handleAuditReject = async (item: any) => {
  const reason = window.prompt('请输入驳回原因：', '内容不符合社区规范');
  if (reason === null) return;
  try {
    const res = await rejectPostcardApi(item.id, reason || '内容不符合社区规范');
    ElMessage.success(res.message || '已驳回');
    await loadPendingList();
  } catch (e: any) {
    ElMessage.error(getErrorMessage(e, '操作失败'));
  }
};

watch(() => postcardFilters.value.pageSize, async (value, oldValue) => {
  if (value === oldValue) return;
  postcardFilters.value.page = 1;
  await loadAdminPostcards();
});

watch(() => stampFilters.value.seriesId, async () => {
  await loadAdminStamps();
});

onMounted(async () => {
  await Promise.all([
    loadOverview(),
    loadAdminPostcards(),
    loadStampSeries(),
    loadAdminStamps(),
    loadActivationCodes(),
    loadPendingList(),
  ]);
});
</script>
