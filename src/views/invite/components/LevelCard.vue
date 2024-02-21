<template>
  <!-- <div class="flex items-stretch ">
    <div class="bg-white rounded-xl w-[300px] py-4 overflow-hidden">
      <div
        v-for="item in tabList"
        :key="item"
        :class="{'active': tab === item}"
        @click="tab = item"
        class="flex items-center justify-between px-4 py-3 cursor-pointer level-tab"
      >
        <div class="flex items-start">
          <div class="text-base level-text">{{ item }}</div>
          <div v-if="currLevel === item" class="w-[5px] h-[5px] rounded-full point mt-1 ml-1"></div>
        </div>
        <div class="text-white center" :style="{opacity: tab === item ? 1 : 0}" ><v-icon icon="mdi-arrow-right" size="20px"></v-icon></div>
      </div>
    </div>
  </div> -->

  <div v-if="!initLoading" class="p-4 overflow-hidden bg-white rounded-xl">
    <div class="flex items-center justify-between">
      <VipLevel :level="currLevel" :size="2" />
      <div class="w-4"></div>
      <div
        @click="open(useDocHook().getInviteDocLink())"
        class="flex whitespace-nowrap items-center space-x-0.5 text-gray-500 hover:text-gray-700 duration-150 cursor-pointer flex-nowrap"
      >
        <v-icon size="16" icon="mdi-file-document-outline" />
        <div>Rules</div>
      </div>
    </div>

    <div class="flex items-center justify-between py-2 level-row-border">
      <div class="text-[#64748b]">Newcomers lasting rebate ratio</div>
      <div class="text-[#020817] text-base">{{ ratioBigintAsPercentage(lastingBindFeeRatio) }}%</div>
    </div>
    <div class="flex items-center justify-between py-2 level-row-border">
      <div class="text-[#64748b]">Platform rebate ratio</div>
      <div class="text-[#020817] text-base">
        {{ ratioBigintAsPercentage(feePlatformRatioByLevel[currLevel] - lastingBindFeeRatio) }}%
      </div>
    </div>
    <div class="flex items-center justify-between py-2 level-row-border">
      <div class="text-[#64748b]">Level max rebate ratio</div>
      <div class="text-[#020817] text-base">{{ ratioBigintAsPercentage(feeRatioByLevel[currLevel]) }}%</div>
    </div>
    <div class="flex items-center justify-between py-2 level-row-border">
      <div class="text-[#64748b]">My rebate ratio</div>
      <div class="flex items-center">
        <div class="mr-2 center">
          <ModifyMyRebate
            :referrer="address ?? ''"
            :initMyRebate="myRebateRatio"
            :levelMaxRebate="feeRatioByLevel[currLevel]"
            :isReferrerDiyFeeRatio="isReferrerDiyFeeRatio"
            @changeRebate="changeRebateHandler"
          />
        </div>
        <div class="text-[#020817] text-base">{{ ratioBigintAsPercentage(myRebateRatio) }}%</div>
      </div>
    </div>
    <div class="flex items-center justify-between py-2 level-row-border">
      <div class="flex items-center">
        <div class="text-[#64748b] mr-1">Win handling fee ratio</div>
        <div class="center pt-[3px]">
          <NTooltip trigger="hover" :style="{ maxWidth: '320px' }">
            <template #trigger>
              <v-icon icon="mdi-information-outline" color="#64748b" size="16"></v-icon>
            </template>
            (Newcomers lasting rebate ratio + Platform rebate ratio + My rebate ratio)
          </NTooltip>
        </div>
      </div>
      <div class="text-[#020817] text-base">
        {{ ratioBigintAsPercentage(feePlatformRatioByLevel[currLevel] + myRebateRatio) }}%
      </div>
    </div>
    <div class="flex items-center justify-between py-2 level-row-border">
      <div class="text-[#64748b]">Newcomers lasting bind num</div>
      <div class="text-[#020817] text-base">{{ newcomersLastingBindNum.toLocaleString() }}</div>
    </div>
    <div class="flex items-center justify-between py-2 level-row-border">
      <div class="text-[#64748b]">Total income</div>
      <div class="text-[#020817] text-base">
        <span class="mr-0.5">{{ totalIncomeStr }}</span>
        <span>{{ networkURL.nativeCurrency.symbol }}</span>
      </div>
    </div>
    <div class="flex items-center justify-between py-2 level-row-border">
      <div class="text-[#64748b] mr-2 whitespace-nowrap">Invitation link</div>
      <div
        @click="copyHandler"
        class="text-[#020817] text-sm duration-150 break-all cursor-pointer"
        :class="{ 'hover:opacity-50': !!referrerLink, 'opacity-50': !referrerLink  }"
      >
        {{ referrerLink || 'link is  generating...' }}
      </div>
    </div>

    <template v-if="currLevel != FeeLevel.level6">
      <div class="pb-4 mt-4 level-row-border">
        <h3 class="hidden md:block">Upgrade by inviting friends to play mora</h3>
        <h3 class="block md:hidden">EXP to upgrade</h3>
        <div class="mt-3">
          <!-- FA5E48 -->
          <!-- 16A34A -->
          <!-- 0098ea -->
          <v-progress-linear v-model="progress" color="#0098ea" height="28" rounded>
            <div :class="progress >= 55 ? 'text-white' : 'text-black'" class="duration-150">
              <strong class="mr-1.5">{{ progress }}%</strong>
              <strong>Level EXP: {{ currLevelExpNumber }}</strong>
            </div>
          </v-progress-linear>
        </div>
        <div class="flex items-center justify-between text-base">
          <div>0</div>
          <div>{{ currLevelUpExpNumber.toLocaleString() }}</div>
        </div>
      </div>

      <div class="mt-4 level-row-border">
        <h3>Pay to upgrade</h3>
        <div class="flex-wrap items-center block sm:flex">
          <div class="flex items-start mt-2 mr-4">
            <div class="mr-2 text-[26px] font-semibold leading-none">
              <span class="mr-0.5">{{ payToUpgradeValue.toLocaleString() }}</span>
              <span>{{ networkURL.nativeCurrency.symbol }}</span>
            </div>
            <div
              v-if="payToUpgradeValue !== oldPayToUpgradeValue"
              class="text-base leading-none text-orange-500 line-through"
            >
              <span class="mr-0.5">{{ oldPayToUpgradeValue.toLocaleString() }}</span>
              <span>{{ networkURL.nativeCurrency.symbol }}</span>
            </div>
          </div>
          <div class="flex-1 mt-2 w-22 sm:max-w-[220px]">
            <v-btn
              @click="paidUpgradeHandler"
              :loading="paidUpgradeLoading"
              color="primary"
              class="rounded-lg"
              width="100%"
              elevation="0"
            >
              <span class="normal-case">Paid upgrade</span>
            </v-btn>
          </div>
        </div>
      </div>
    </template>
  </div>

  <div v-else class="p-4 overflow-hidden bg-white rounded-xl">
    <v-skeleton-loader type="table-heading, list-item-two-line, image, table-tfoot"></v-skeleton-loader>
  </div>
</template>

<script setup lang="ts">
import VipLevel from '@/components/VipLevel.vue'
import { notyf } from '@/utils/notyf'
import copy from 'copy-to-clipboard'
import { ref } from 'vue'
import ModifyMyRebate from './ModifyMyRebate.vue'
import { useReferrerLevel } from '@/hooks/contracts/ReferrerLevel'
import { useWeb3Wallet } from '@/hooks/web3wallet'
import { FeeLevel } from '@/types/baseType'
import { watchEffect } from 'vue'
import { ratioBigintAsPercentage } from '@/utils/libs'
import { lastingBindFeeRatio, feePlatformRatioByLevel, feeRatioByLevel, levelUpExpsMap } from '@/config/invite.config'
import { NTooltip } from 'naive-ui'
import { useRoute } from 'vue-router'
import { getURIKey } from '@/plugins/web3modal'
import { computed } from 'vue'
import { ethers } from 'ethers'
import BigNumber from 'bignumber.js'
import { getWeb3ErrorMessage } from '@/utils/web3'
import { useGameLogSearch } from '@/hooks/contracts/GameLogSearch'
import { useICPUIDMap } from '@/hooks/icpcalll/uidmap_backend'
import { referrerOrigin } from '@/config/env.config'
import { useDocHook } from '@/hooks/doc.hook'

// const tabList = ['Lv.1', 'Lv.2', 'Lv.3', 'Lv.4', 'Lv.5', 'Lv.6']
// const tab = ref(tabList[0])

const route = useRoute()
const networkKey = computed(() => {
  const networkURI = route.params.network as string
  return getURIKey(networkURI)
})

const { address, isConnectWalletNetwork, networkURL } = useWeb3Wallet()
const {
  getFeeLevel,
  getReferrerFeeRatio,
  getNewcomerBindCount,
  getAccountLevelExp,
  getIsReferrerDiyFeeRatio,
  payUpgradeAction
} = useReferrerLevel()
const { getIncomeCount } = useGameLogSearch()

const currLevel = ref<FeeLevel>(FeeLevel.level1)
const initLoading = ref(true)
const myRebateRatio = ref<bigint>(0n)
const newcomersLastingBindNum = ref<bigint>(0n)
const currLevelExp = ref<bigint>(0n)
const isReferrerDiyFeeRatio = ref<boolean>(false)
const totalIncome = ref<bigint>(0n)

const referrerLink = ref('')

const totalIncomeStr = computed(() => {
  try {
    return BigNumber(ethers.formatEther(totalIncome.value)).dp(4, BigNumber.ROUND_DOWN).toNumber()
  } catch (error) {
    return 0
  }
})
const currLevelExpNumber = computed(() => {
  if (currLevelExp.value <= 0) return 0
  return +BigNumber(ethers.formatEther(currLevelExp.value)).toFixed(4, BigNumber.ROUND_DOWN)
})

const currLevelUpExp = computed(() => {
  if (currLevel.value === FeeLevel.level6) return -1n
  const levelUpExp = levelUpExpsMap[networkKey.value]
  if (!levelUpExp) return -1n
  return levelUpExp[currLevel.value]
})

const currLevelUpExpNumber = computed(() => {
  if (currLevelUpExp.value <= 0) return -1
  const valTemp = ethers.formatEther(currLevelUpExp.value)
  return +BigNumber(valTemp).toFixed(4, BigNumber.ROUND_DOWN)
})
const payToUpgradeValue = computed(() => {
  if (currLevelUpExp.value <= currLevelExp.value) return 0
  return +BigNumber(ethers.formatEther(currLevelUpExp.value - currLevelExp.value))
    .div(10)
    .toFixed(4, BigNumber.ROUND_UP)
})
const oldPayToUpgradeValue = computed(() => {
  if (currLevelUpExp.value <= 0) return 0
  return +BigNumber(ethers.formatEther(currLevelUpExp.value)).div(10).toFixed(4, BigNumber.ROUND_UP)
})

const progress = computed(() => {
  return +BigNumber(currLevelExpNumber.value)
    .div(currLevelUpExpNumber.value)
    .times(100)
    .toFixed(2, BigNumber.ROUND_DOWN)
})

const copyHandler = () => {
  if (!referrerLink.value) return
  copy(referrerLink.value)
  notyf.success('Copied referrer link successfully')
  // window.open('https://www.baidu.com', '_blank')
}
const changeRebateHandler = ({ myRebate, isDiy }: { myRebate: bigint; isDiy: boolean }) => {
  isReferrerDiyFeeRatio.value = isDiy
  myRebateRatio.value = myRebate
}

const paidUpgradeLoading = ref(false)
const paidUpgradeHandler = async () => {
  if (!address.value) return
  paidUpgradeLoading.value = true
  try {
    await payUpgradeAction(address.value, ethers.parseEther(payToUpgradeValue.value.toString()))
    initLevel()
  } catch (error) {
    console.error(error)
    if (!(error as Error).message.includes('User rejected the request.')) {
      notyf.error(getWeb3ErrorMessage(error as Error))
    }
  }
  paidUpgradeLoading.value = false
}

const refreshLevel = async () => {
  if (!address.value) return
  const startTime = new Date().getTime()
  const _level = await getFeeLevel(address.value)
  currLevel.value = _level
  const _referrerFeeRatio = await getReferrerFeeRatio(address.value)
  myRebateRatio.value = _referrerFeeRatio
  const _newcomerBindCount = await getNewcomerBindCount(address.value)
  newcomersLastingBindNum.value = _newcomerBindCount
  const _accountLevelExp = await getAccountLevelExp(address.value, _level)
  currLevelExp.value = _accountLevelExp
  const _isReferrerDiyFeeRatio = await getIsReferrerDiyFeeRatio(address.value)
  isReferrerDiyFeeRatio.value = _isReferrerDiyFeeRatio

  const _incomeCount = await getIncomeCount({ referrer: address.value })
  totalIncome.value = _incomeCount[0]

  const endTime = new Date().getTime()
  const laveTime = 400 - (endTime - startTime)
  if (laveTime > 0) await new Promise<void>(resolve => setTimeout(resolve, laveTime))
  initLoading.value = false
}

const initLevel = async () => {
  initLoading.value = true
  await refreshLevel()
}

const initReferrerLink = async () => {
  referrerLink.value = ''
  if (!address.value) return
  try {
    const uid = await useICPUIDMap().getAndInitUIDByInfo(networkKey.value, address.value)
    referrerLink.value = `${referrerOrigin}/${uid}`
  } catch (error) {
    referrerLink.value = `${window.origin}/${networkKey.value}?referrer=${address.value}`
  }
}

const open = (link: string) => {
  window.open(link, '_blank')
}

watchEffect(() => {
  initLoading.value = true
  if (isConnectWalletNetwork.value) {
    initLevel()
    initReferrerLink()
  }
})
</script>

<style lang="scss" scoped>
.level-row-border {
  border-bottom: 1px solid #e5e5e59c;
  &:nth-last-child(1) {
    border-bottom: 0px solid #e5e5e59c;
  }
}
.level-tab {
  transition-duration: 150ms;
  &:hover {
    background-color: #d6e4e952;
  }
  .level-text {
    font-weight: 500;
  }
  .point {
    transition-duration: 150ms;
    background-color: #2eb6ff;
  }
  &.active {
    background-color: #2eb6ff;
    color: #fff;
    .point {
      background-color: #fff;
    }
  }
}
</style>
