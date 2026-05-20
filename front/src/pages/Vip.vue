<template>
  <div class="min-h-screen bg-background pb-20 selection:bg-secondary/30 transition-colors duration-300">
    <header class="lg:hidden sticky top-0 z-40 flex items-center w-full px-4 h-14 bg-background/90 backdrop-blur-md border-b border-primary/10">
      <button @click="$router.back()" class="text-primary hover:bg-black/5 dark:hover:bg-white/5 p-2 rounded-full transition-colors mr-2">
        <ChevronLeft class="w-5 h-5" />
      </button>
    </header>

    <header class="hidden lg:flex items-center w-full px-8 h-16 bg-background/90 backdrop-blur-md border-b border-primary/10 sticky top-0 z-40">
      <button @click="$router.back()" class="text-primary hover:bg-black/5 dark:hover:bg-white/5 p-2 rounded-full transition-colors mr-4">
        <ChevronLeft class="w-5 h-5" />
      </button>
    </header>

    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 md:pt-20">
      <div class="text-center mb-12">
        <h1 class="text-3xl md:text-5xl font-bold mb-6 tracking-tight text-primary font-headline">专属会员，尊享特权</h1>
        <p class="text-tertiary max-w-2xl mx-auto text-base md:text-lg">
          选择最适合您的订阅计划。开通后将跳转到安全收银台完成付款，支付成功后会员权益会自动生效。
        </p>
      </div>

      <section class="mb-10 rounded-3xl border border-black/10 bg-neutral p-5 md:p-6 shadow-sm dark:border-white/10">
        <div class="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p class="text-xs font-semibold uppercase tracking-[0.28em] text-secondary">当前会员状态</p>
            <h2 class="mt-3 text-2xl font-bold text-primary md:text-3xl">{{ currentVipLabel }}</h2>
            <p class="mt-2 text-sm text-tertiary md:text-base">
              {{ currentVipDescription }}
            </p>
          </div>

          <!-- <div class="flex flex-wrap gap-2 text-xs font-bold">
            <span class="rounded-full bg-black/5 px-3 py-2 text-tertiary dark:bg-white/5">安全收银台支付</span>
            <span class="rounded-full bg-black/5 px-3 py-2 text-tertiary dark:bg-white/5">支持支付宝</span>
            <span class="rounded-full bg-black/5 px-3 py-2 text-tertiary dark:bg-white/5">支付成功自动开通</span>
          </div> -->
        </div>

        <div v-if="pendingOrder" class="mt-5 rounded-2xl border border-secondary/20 bg-secondary/8 p-4 dark:bg-secondary/10">
          <div class="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p class="text-sm font-semibold text-primary">待支付订单：{{ pendingOrder.planTitle }} · ¥{{ pendingOrder.amount }}</p>
              <p class="mt-1 text-xs break-all text-tertiary">订单号：{{ pendingOrder.orderNo }}</p>
              <p class="mt-1 text-xs text-tertiary">
                {{ pendingOrder.status === 'paid' ? '支付成功，会员权益已发放。' : '如果已完成付款，可点击“刷新状态”同步会员开通结果。' }}
              </p>
            </div>
            <div class="flex flex-wrap gap-3">
              <button
                v-if="pendingOrder.status !== 'paid'"
                @click="continuePay"
                class="rounded-xl border border-black/10 px-4 py-2 text-sm font-bold text-primary hover:bg-black/5 dark:border-white/10 dark:hover:bg-white/5"
              >
                继续支付
              </button>
              <button
                v-if="pendingOrder.status !== 'paid'"
                @click="handleCancelPendingOrder"
                class="rounded-xl border border-red-200 px-4 py-2 text-sm font-bold text-red-500 hover:bg-red-50 dark:border-red-400/30 dark:text-red-300 dark:hover:bg-red-400/10"
              >
                取消支付
              </button>
              <button
                @click="checkPendingPayment(true)"
                :disabled="checkingStatus"
                class="rounded-xl bg-primary px-4 py-2 text-sm font-bold text-white hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-secondary dark:text-black"
              >
                {{ checkingStatus ? '查询中...' : '刷新状态' }}
              </button>
            </div>
          </div>
        </div>
      </section>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 lg:gap-4 xl:gap-6 items-stretch">
        <div class="bg-neutral rounded-2xl border border-black/10 dark:border-white/10 p-6 md:p-8 lg:p-4 xl:p-6 flex flex-col hover:border-secondary/50 dark:hover:border-secondary/50 transition-colors duration-300 shadow-sm">
          <h3 class="text-xl font-medium mb-2 text-tertiary font-headline">普通用户</h3>
          <div class="flex items-baseline mb-6 mt-2 whitespace-nowrap">
            <span class="text-4xl lg:text-2xl xl:text-3xl font-bold text-primary">免费</span>
          </div>
          <button disabled class="w-full bg-black/5 dark:bg-white/5 text-primary font-semibold rounded-lg py-2.5 mb-8 opacity-50 cursor-not-allowed transition-colors">
            {{ hasActiveVip ? '免费版基础权益' : '当前计划' }}
          </button>

          <ul class="space-y-4 mt-auto">
            <li class="flex items-start">
              <Check class="w-5 h-5 text-tertiary mr-3 shrink-0 lg:mr-2 xl:mr-3" />
              <span class="text-sm text-tertiary">AI 润色文字或扩写文字消耗 5 邮分</span>
            </li>
            <li class="flex items-start">
              <Check class="w-5 h-5 text-tertiary mr-3 shrink-0 lg:mr-2 xl:mr-3" />
              <span class="text-sm text-tertiary">AI 识别图片消耗 10 邮分</span>
            </li>
          </ul>
        </div>

        <div
          v-for="plan in paidPlans"
          :key="plan.key"
          :class="plan.featured
            ? 'bg-neutral rounded-2xl border-2 border-secondary p-6 md:p-8 lg:p-4 xl:p-6 flex flex-col relative transform lg:-translate-y-4 shadow-[0_0_30px_rgba(192,122,103,0.15)] dark:shadow-[0_0_30px_rgba(234,179,8,0.15)] z-10'
            : 'bg-neutral rounded-2xl border border-black/10 dark:border-white/10 p-6 md:p-8 lg:p-4 xl:p-6 flex flex-col hover:border-secondary/50 dark:hover:border-secondary/50 transition-colors duration-300 shadow-sm'"
        >
          <div v-if="plan.featured" class="absolute -top-3 left-1/2 -translate-x-1/2 lg:left-6 lg:translate-x-0">
            <span class="bg-secondary text-background text-xs font-bold px-4 py-1.5 rounded-full whitespace-nowrap shadow-md">
              最受欢迎
            </span>
          </div>

          <h3 :class="plan.featured ? 'text-xl font-medium mb-2 text-primary font-headline' : 'text-xl font-medium mb-2 text-tertiary font-headline'">
            {{ plan.title }}
          </h3>
          <div class="flex items-baseline mb-6 mt-2 whitespace-nowrap">
            <span class="text-4xl lg:text-2xl xl:text-3xl font-bold text-primary">{{ formatPlanPrice(plan.key) }}</span>
            <span class="text-tertiary ml-2 lg:ml-1 xl:ml-2 text-sm xl:text-base">/{{ plan.suffix }}</span>
          </div>

          <button
            @click="handlePurchase(plan.key)"
            :disabled="isActionDisabled(plan.key)"
            :class="plan.featured
              ? 'w-full bg-secondary text-background font-semibold rounded-lg py-2.5 mb-8 hover:opacity-90 transition-opacity disabled:cursor-not-allowed disabled:opacity-60'
              : 'w-full bg-black/5 dark:bg-white/5 text-primary font-semibold rounded-lg py-2.5 mb-8 hover:bg-black/10 dark:hover:bg-white/10 transition-colors disabled:cursor-not-allowed disabled:opacity-60'"
          >
            {{ getActionText(plan.key) }}
          </button>

          <ul class="space-y-4 mt-auto">
            <li v-for="feature in plan.features" :key="feature" class="flex items-start">
              <Check :class="plan.featured ? 'w-5 h-5 text-secondary mr-3 shrink-0 lg:mr-2 xl:mr-3' : 'w-5 h-5 text-tertiary mr-3 shrink-0 lg:mr-2 xl:mr-3'" />
              <span :class="plan.featured ? 'text-sm text-primary font-medium' : 'text-sm text-tertiary'">{{ feature }}</span>
            </li>
          </ul>
        </div>
      </div>

      <div class="mt-7 text-center">
        <button
          type="button"
          @click="handleRedeemActivationCode"
          class="text-xs text-tertiary transition-colors hover:text-secondary hover:underline underline-offset-4"
        >
          点击使用兑换码兑换会员
        </button>
      </div>
    </div>
  </div>
</template>


<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { ChevronLeft, Check } from 'lucide-vue-next'
import { cancelVipPayment, createVipPayment, getLatestVipPayment, getVipPaymentStatus, getVipPlans, redeemVipActivationCode } from '../api/vip.js'

import { getProfile } from '../api/user.js'

import { useUser } from '../store/user'


type VipPlanKey = 'monthly' | 'quarterly' | 'yearly' | 'lifetime'

interface VipPlanDto {
  planKey: string
  title: string
  billingUnit: string
  priceCents: number
  currency: string
}

interface PendingOrderState {
  orderNo: string
  planKey: string
  planTitle: string
  amount: string
  status: string
  payUrl?: string
  gatewayUrl?: string
  formFields?: Record<string, string>
}

const LAST_ORDER_STORAGE_KEY = 'blank_vip_last_order'

const paidPlans = [
  {
    key: 'monthly' as VipPlanKey,
    title: '包月',
    suffix: '月',
    featured: false,
    features: ['会员的 AI 提问免费', '写信不消耗邮费', '任务面板每月领额外邮分'],
  },
  {
    key: 'quarterly' as VipPlanKey,
    title: '包季',
    suffix: '季',
    featured: false,
    features: ['会员的 AI 提问免费', '写信不消耗邮费', '任务面板每月领额外邮分'],
  },
  {
    key: 'yearly' as VipPlanKey,
    title: '包年',
    suffix: '年',
    featured: false,
    features: ['会员的 AI 提问免费', '写信不消耗邮费', '任务面板每月领额外邮分'],
  },
  {
    key: 'lifetime' as VipPlanKey,
    title: '终身会员',
    suffix: '终身',
    featured: true,
    features: ['会员的 AI 提问免费', '写信不消耗邮费', '任务面板每月领额外邮分'],
  },
]

const plansByKey = ref<Record<string, VipPlanDto>>({})
const loading = ref(false)
const creatingPlanKey = ref<VipPlanKey | ''>('')
const checkingStatus = ref(false)
const pendingOrder = ref<PendingOrderState | null>(null)

const { userInfo, updateUser } = useUser()

const currentVipLabel = computed(() => userInfo.value?.vipLevel || 'VIP 0')
const isLifetimeMember = computed(() => userInfo.value?.vipPlanKey === 'lifetime')
const hasActiveVip = computed(() => currentVipLabel.value !== 'VIP 0')
const currentPlanKey = computed(() => String(userInfo.value?.vipPlanKey || ''))

const currentVipDescription = computed(() => {

  if (userInfo.value?.vipPlanKey === 'lifetime') {
    return '您当前已开通终身会员，权益永久有效。'
  }

  if (userInfo.value?.vipExpiresAt) {
    return `当前会员有效期至 ${formatDateTime(userInfo.value.vipExpiresAt)}，如需续期可再次下单。`
  }

  return '您当前还是普通用户，点击下方“立即开通”将跳转到支付宝收银台完成付款。'
})

const getErrorMessage = (error: unknown, fallback: string) => {
  return (error as { data?: { message?: string }, response?: { data?: { message?: string } }, message?: string })?.data?.message
    || (error as { response?: { data?: { message?: string } } })?.response?.data?.message
    || (error as { message?: string })?.message
    || fallback
}

const formatDateTime = (value?: string | null) => {
  if (!value) return '--'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`
}

const persistPendingOrder = (order: PendingOrderState | null) => {
  if (!order) {
    localStorage.removeItem(LAST_ORDER_STORAGE_KEY)
    return
  }
  localStorage.setItem(LAST_ORDER_STORAGE_KEY, JSON.stringify(order))
}

const loadPendingOrder = () => {
  const raw = localStorage.getItem(LAST_ORDER_STORAGE_KEY)
  if (!raw) return null

  try {
    return JSON.parse(raw) as PendingOrderState
  } catch (error) {
    console.warn('Parse vip pending order failed:', error)
    localStorage.removeItem(LAST_ORDER_STORAGE_KEY)
    return null
  }
}

const submitPaymentForm = (gatewayUrl?: string, formFields?: Record<string, string>) => {
  if (!gatewayUrl || !formFields) {
    throw new Error('支付表单信息缺失')
  }

  const form = document.createElement('form')
  form.method = 'POST'
  form.action = gatewayUrl
  form.style.display = 'none'

  Object.entries(formFields).forEach(([key, value]) => {
    const input = document.createElement('input')
    input.type = 'hidden'
    input.name = key
    input.value = String(value)
    form.appendChild(input)
  })

  document.body.appendChild(form)
  form.submit()
  form.remove()
}

const refreshProfile = async () => {
  const result = await getProfile()
  updateUser(result.data || {})
}

const applyVipSnapshot = (vip?: Record<string, any> | null) => {
  if (!vip) return

  updateUser({
    vipLevel: vip.vipLevel,
    vipPlanKey: vip.vipPlanKey,
    vipExpiresAt: vip.vipExpiresAt,
  })
}

const loadVipPlans = async () => {

  loading.value = true
  try {
    const res = await getVipPlans()
    const map: Record<string, VipPlanDto> = {}
    for (const item of (res.data || []) as VipPlanDto[]) {
      if (item?.planKey) {
        map[item.planKey] = item
      }
    }
    plansByKey.value = map
  } catch (err) {
    console.warn('Load vip plans failed:', err)
    ElMessage.error(getErrorMessage(err, '加载会员套餐失败'))
  } finally {
    loading.value = false
  }
}

const formatPlanPrice = (key: VipPlanKey) => {
  const plan = plansByKey.value[key]
  if (!plan || typeof plan.priceCents !== 'number') return '¥--'
  return `¥${(plan.priceCents / 100).toFixed(2)}`
}

const normalizePendingOrder = (payload: Record<string, any>) => ({
  orderNo: String(payload.orderNo || ''),
  planKey: String(payload.planKey || ''),
  planTitle: String(payload.planTitle || '会员订单'),
  amount: String(payload.amount || '0.00'),
  status: String(payload.status || 'pending'),
  payUrl: typeof payload.payUrl === 'string' ? payload.payUrl : '',
  gatewayUrl: typeof payload.gatewayUrl === 'string' ? payload.gatewayUrl : '',
  formFields: payload.formFields && typeof payload.formFields === 'object' ? payload.formFields : undefined,
})

const checkPendingPayment = async (showToast = false) => {
  if (!pendingOrder.value?.orderNo) return

  checkingStatus.value = true
  try {
    const res = await getVipPaymentStatus(pendingOrder.value.orderNo)
    const data = res.data || {}

    pendingOrder.value = {
      ...pendingOrder.value,
      ...normalizePendingOrder({
        ...pendingOrder.value,
        ...data,
      }),
    }

    applyVipSnapshot(data?.vip)


    if (data.status === 'paid') {
      pendingOrder.value = null
      persistPendingOrder(null)
      await refreshProfile()
      if (showToast) {
        ElMessage.success('支付成功，会员已开通')
      }
      return
    }

    if (['failed', 'closed', 'refunded'].includes(String(data.status || ''))) {
      pendingOrder.value = null
      persistPendingOrder(null)
      if (showToast) {
        ElMessage.warning('订单当前不可继续支付，请重新创建订单')
      }
      return
    }


    persistPendingOrder(pendingOrder.value)
    if (showToast) {
      ElMessage.info('订单尚未支付完成，请稍后再试')
    }
  } catch (err) {
    ElMessage.error(getErrorMessage(err, '查询支付状态失败'))
  } finally {
    checkingStatus.value = false
  }
}

const restoreLatestOrder = async () => {
  try {
    const res = await getLatestVipPayment()
    const data = res.data || {}
    applyVipSnapshot(data?.vip)

    const latestOrder = data?.order ? normalizePendingOrder(data.order) : null
    if (!latestOrder?.orderNo) {
      pendingOrder.value = null
      persistPendingOrder(null)
      return
    }

    if (['paid', 'failed', 'closed', 'refunded'].includes(latestOrder.status)) {
      pendingOrder.value = null
      persistPendingOrder(null)
      return
    }

    pendingOrder.value = latestOrder
    persistPendingOrder(latestOrder)
  } catch (error) {
    console.warn('Restore latest vip order failed:', error)
  }
}

const continuePay = () => {
  if (!pendingOrder.value) return

  if (pendingOrder.value.gatewayUrl && pendingOrder.value.formFields) {
    submitPaymentForm(pendingOrder.value.gatewayUrl, pendingOrder.value.formFields)
    return
  }

  if (pendingOrder.value.payUrl) {
    window.location.assign(pendingOrder.value.payUrl)
    return
  }

  ElMessage.warning('缺少支付跳转地址，请重新创建订单')
}


const handleCancelPendingOrder = async () => {
  if (!pendingOrder.value) return

  try {
    await ElMessageBox.confirm(
      '取消后会从当前页面移除这笔待支付订单；如果你已经完成付款，请先点击“刷新状态”。',
      '取消支付',
      {
        confirmButtonText: '确认取消',
        cancelButtonText: '先不取消',
        type: 'warning',
        customClass: 'vip-message-box vip-message-box--warning',
      }
    )

    const orderNo = pendingOrder.value.orderNo
    const res: any = await cancelVipPayment(orderNo)
    applyVipSnapshot(res.data?.vip)
    pendingOrder.value = null
    persistPendingOrder(null)
    ElMessage.success(res?.message || '已取消当前待支付订单')

  } catch (err) {
    if (err === 'cancel' || err === 'close') return
    ElMessage.error(getErrorMessage(err, '取消待支付订单失败'))
  }
}


const handlePurchase = async (planKey: VipPlanKey) => {
  if (isLifetimeMember.value) {
    ElMessage.info('您已是终身会员，无需重复开通')
    return
  }

  creatingPlanKey.value = planKey
  try {
    const res = await createVipPayment(planKey, 'alipay')
    const nextOrder = normalizePendingOrder(res.data || {})
    pendingOrder.value = nextOrder
    persistPendingOrder(nextOrder)
    submitPaymentForm(nextOrder.gatewayUrl, nextOrder.formFields)
  } catch (err) {
    ElMessage.error(getErrorMessage(err, '创建支付订单失败'))
  } finally {
    creatingPlanKey.value = ''
  }
}

const handleRedeemActivationCode = async () => {
  try {
    const { value } = await ElMessageBox.prompt('请输入会员兑换码', '兑换会员', {
      confirmButtonText: '立即兑换',
      cancelButtonText: '取消',
      inputPlaceholder: '例如 VIP-ABCD-EFGH-IJKL',
      customClass: 'vip-message-box vip-message-box--prompt',
      inputValidator: (inputValue) => {
        return String(inputValue || '').trim().length > 0 || '请输入兑换码'
      },
    })

    const code = String(value || '').trim().toUpperCase()
    const res: any = await redeemVipActivationCode(code)
    const vipData = res.data?.vip


    if (vipData) {
      updateUser({
        vipLevel: vipData.vipLevel,
        vipPlanKey: vipData.vipPlanKey,
        vipExpiresAt: vipData.vipExpiresAt,
      })
    } else {
      await refreshProfile()
    }

    ElMessage.success(res.message || '兑换成功，会员权益已发放')
  } catch (err) {
    if (err === 'cancel' || err === 'close') return
    ElMessage.error(getErrorMessage(err, '兑换会员失败'))
  }
}

const hasPendingOrderForPlan = (planKey: VipPlanKey) => {
  return pendingOrder.value?.status !== 'paid' && pendingOrder.value?.planKey === planKey
}

const isCurrentPlan = (planKey: VipPlanKey) => {
  return hasActiveVip.value && currentPlanKey.value === planKey
}

const isActionDisabled = (planKey: VipPlanKey) => {
  if (loading.value || !plansByKey.value[planKey]) return true
  if (isLifetimeMember.value) return true
  if (hasPendingOrderForPlan(planKey)) return true
  return creatingPlanKey.value.length > 0
}

const getActionText = (planKey: VipPlanKey) => {
  if (creatingPlanKey.value === planKey) return '跳转中...'
  if (hasPendingOrderForPlan(planKey)) return '订单待支付'
  if (isLifetimeMember.value) return '已是终身会员'
  if (isCurrentPlan(planKey)) return '续订当前套餐'
  if (hasActiveVip.value && planKey === 'lifetime') return '升级为终身'
  if (hasActiveVip.value) return '切换并续期'
  return '立即开通'
}


const handlePageVisible = () => {
  if (document.visibilityState === 'visible' && pendingOrder.value?.orderNo) {
    checkPendingPayment(false).catch(() => {})
  }
}

const handleWindowFocus = () => {
  if (pendingOrder.value?.orderNo) {
    checkPendingPayment(false).catch(() => {})
  }
}

onMounted(async () => {
  await Promise.all([
    loadVipPlans(),
    refreshProfile().catch((error) => {
      console.warn('Refresh vip profile failed:', error)
    }),
  ])

  pendingOrder.value = loadPendingOrder()
  await restoreLatestOrder()

  if (pendingOrder.value?.orderNo) {
    checkPendingPayment(false).catch(() => {})
  }

  document.addEventListener('visibilitychange', handlePageVisible)
  window.addEventListener('focus', handleWindowFocus)
})


onUnmounted(() => {
  document.removeEventListener('visibilitychange', handlePageVisible)
  window.removeEventListener('focus', handleWindowFocus)
})
</script>

<style>
.vip-message-box {
  width: min(92vw, 420px);
  padding: 0;
  border: 1px solid rgb(59 77 97 / 0.08);
  border-radius: 24px;
  background: var(--color-neutral);
  color: var(--color-primary);
  box-shadow: 0 24px 60px rgb(15 23 42 / 0.18);
  overflow: hidden;
}

.vip-message-box .el-message-box__header {
  padding: 24px 24px 8px;
}

.vip-message-box .el-message-box__title {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 18px;
  font-weight: 700;
  line-height: 1.4;
  color: var(--color-primary);
}

.vip-message-box .el-message-box__headerbtn {
  top: 18px;
  right: 18px;
}

.vip-message-box .el-message-box__close {
  color: rgb(140 145 132 / 0.9);
  transition: color 0.2s ease, transform 0.2s ease;
}

.vip-message-box .el-message-box__headerbtn:hover .el-message-box__close {
  color: var(--color-primary);
  transform: scale(1.05);
}

.vip-message-box .el-message-box__container {
  align-items: flex-start;
  padding: 0 24px;
}

.vip-message-box .el-message-box__status {
  position: relative;
  top: 2px;
  margin-right: 10px;
  font-size: 20px !important;
}

.vip-message-box .el-message-box__message {
  color: var(--color-tertiary);
  font-size: 14px;
  line-height: 1.75;
}

.vip-message-box .el-message-box__content {
  padding: 6px 24px 22px;
}

.vip-message-box .el-message-box__input {
  padding-top: 10px;
}

.vip-message-box .el-message-box__input .el-input__wrapper {
  min-height: 46px;
  padding: 0 14px;
  border-radius: 14px;
  background: rgb(255 255 255 / 0.72);
  box-shadow: inset 0 0 0 1px rgb(59 77 97 / 0.12) !important;
  transition: box-shadow 0.2s ease, background-color 0.2s ease;
}

.vip-message-box .el-message-box__input .el-input__wrapper:hover {
  box-shadow: inset 0 0 0 1px rgb(59 77 97 / 0.2) !important;
}

.vip-message-box .el-message-box__input .el-input__wrapper.is-focus {
  background: rgb(255 255 255 / 0.88);
  box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--color-secondary) 75%, white), 0 0 0 4px color-mix(in srgb, var(--color-secondary) 18%, transparent) !important;
}

.vip-message-box .el-message-box__input .el-input__inner {
  height: 46px;
  color: var(--color-primary);
}

.vip-message-box .el-message-box__input .el-input__inner::placeholder {
  color: rgb(140 145 132 / 0.9);
}


.vip-message-box .el-message-box__errormsg {
  margin-top: 8px;
  color: rgb(239 68 68 / 0.92);
}

.vip-message-box .el-message-box__btns {
  display: flex;
  gap: 12px;
  padding: 0 24px 24px;
}

.vip-message-box .el-message-box__btns .el-button {
  flex: 1;
  height: 44px;
  margin-left: 0;
  border-radius: 14px;
  font-weight: 700;
  transition: all 0.2s ease;
}

.vip-message-box .el-message-box__btns .el-button:not(.el-button--primary) {
  border-color: rgb(59 77 97 / 0.1);
  background: transparent;
  color: var(--color-tertiary);
}

.vip-message-box .el-message-box__btns .el-button:not(.el-button--primary):hover {
  border-color: rgb(59 77 97 / 0.14);
  background: rgb(15 23 42 / 0.04);
  color: var(--color-primary);
}

.vip-message-box--prompt .el-message-box__btns .el-button--primary {
  border-color: var(--color-secondary);
  background: var(--color-secondary);
  color: var(--color-background);
}

.vip-message-box--prompt .el-message-box__btns .el-button--primary:hover {
  border-color: color-mix(in srgb, var(--color-secondary) 90%, black);
  background: color-mix(in srgb, var(--color-secondary) 90%, black);
}

.vip-message-box--warning .el-message-box__status {
  color: rgb(239 68 68 / 0.92) !important;
}

.vip-message-box--warning .el-message-box__btns .el-button--primary {
  border-color: rgb(239 68 68 / 0.92);
  background: rgb(239 68 68 / 0.92);
  color: white;
}

.vip-message-box--warning .el-message-box__btns .el-button--primary:hover {
  border-color: rgb(220 38 38 / 0.96);
  background: rgb(220 38 38 / 0.96);
}

.dark .vip-message-box {
  border-color: rgb(255 255 255 / 0.1);
  box-shadow: 0 28px 72px rgb(0 0 0 / 0.45);
}

.dark .vip-message-box .el-message-box__close {
  color: rgb(156 163 175 / 0.95);
}

.dark .vip-message-box .el-message-box__input .el-input__wrapper {
  background: rgb(17 24 39 / 0.9);
  box-shadow: inset 0 0 0 1px rgb(255 255 255 / 0.1) !important;
}

.dark .vip-message-box .el-message-box__input .el-input__wrapper:hover {
  box-shadow: inset 0 0 0 1px rgb(255 255 255 / 0.16) !important;
}

.dark .vip-message-box .el-message-box__input .el-input__wrapper.is-focus {
  box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--color-secondary) 78%, black), 0 0 0 4px color-mix(in srgb, var(--color-secondary) 20%, transparent) !important;
}

.dark .vip-message-box .el-message-box__input .el-input__inner {
  color: var(--color-primary);
}

.dark .vip-message-box .el-message-box__input .el-input__inner::placeholder {
  color: rgb(156 163 175 / 0.9);
}


.dark .vip-message-box .el-message-box__btns .el-button:not(.el-button--primary) {
  border-color: rgb(255 255 255 / 0.1);
  color: rgb(156 163 175 / 0.98);
}

.dark .vip-message-box .el-message-box__btns .el-button:not(.el-button--primary):hover {
  border-color: rgb(255 255 255 / 0.14);
  background: rgb(255 255 255 / 0.06);
  color: var(--color-primary);
}
</style>

