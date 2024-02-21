<template>
  <div class="w-full px-4 pt-4 pb-10 bg-white md:pt-6 md:px-6 rounded-xl">
    <div class="flex items-center justify-between xs:pb-1 md:pb-2">
      <div :class="{ 'animate-spin': stateLoading, invisible: status !== Status.WaitingRival && !stateLoading }">
        <v-btn
          elevation="0"
          icon="mdi-refresh"
          density="comfortable"
          size="small"
          variant="outlined"
          color="primary"
          @click="refreshState"
        ></v-btn>
      </div>
    </div>
    <template v-if="status === Status.NoMara">
      <div class="flex items-center justify-center space-x-2 md:space-x-6">
        <div
          class="flex-1 w-10 max-w-[200px] mora-item-box rounded-full"
          v-for="item in betTypeOptions"
          :key="item.value"
          :style="{
            border: item.value === moraType ? '5px solid #0098ea' : '5px solid #0098ea00'
          }"
          @click="moraItemHandler(item.value)"
        >
          <v-responsive :aspect-ratio="1" class="w-full">
            <div
              class="relative w-full h-full rounded-full cursor-pointer center"
              :style="{ background: item.bg }"
              style="border: 2px solid #fff"
            >
              <img :src="item.img" alt="moraType" class="w-[60%] h-auto mx-auto" />
            </div>
          </v-responsive>
        </div>
      </div>

      <div
        v-if="amountList.length > 1"
        :class="amountList.length === 2 ? 'grid-cols-2' : 'grid-cols-3'"
        class="grid gap-2 mt-6 md:mt-8 md:gap-4"
      >
        <div
          v-for="item in amountList"
          :key="item"
          class="relative h-full py-2 text-center duration-150 rounded-lg cursor-pointer"
          :class="item === amount ? 'text-white  shadow-md bg-[#0098ea]' : ''"
          :style="item === amount ? { border: '1px solid #a4afb700' } : { border: '1px solid #a4afb796' }"
          @click="amountClickHandler(item)"
        >
          <span class="mr-1">{{ item }}</span>
          <span class="text-sm">{{ networkURL.nativeCurrency.symbol }}</span>
          <div
            class="absolute top-0 right-0 text-white duration-150 center"
            :class="item === amount ? 'opacity-100' : 'opacity-0'"
          >
            <v-icon size="20" icon="mdi-check-circle-outline" />
          </div>
        </div>
      </div>

      <div class="flex justify-center mt-6">
        <v-btn
          @click="moraSendHandler"
          :loading="loading"
          color="primary"
          variant="elevated"
          elevation="0"
          size="large"
          class="rounded-lg"
          style="width: 100%"
        >
          <div v-if="amountList.length > 1" class="normal-case">Play Mora</div>
          <div v-else class="normal-case">Use {{ amountList[0] }} {{ networkURL.nativeCurrency.symbol }} Play Mora</div>
        </v-btn>
      </div>
    </template>
    <template v-else>
      <div class="flex items-center justify-around mb-2">
        <div class="flex-1 w-10 max-w-[160px] md:max-w-[200px] rounded-full" style="border: 5px solid #0098ea">
          <v-responsive :aspect-ratio="1" class="w-full">
            <div v-if="!getLeftOption" class="w-full h-full center text-[38px] text-gray-600">?</div>
            <div
              v-else
              class="relative w-full h-full rounded-full cursor-pointer center"
              :style="{
                background: getLeftOption.bg
              }"
              style="border: 2px solid #fff"
            >
              <img :src="getLeftOption.img" alt="moraType" class="w-[60%] h-auto mx-auto" />
            </div>
          </v-responsive>
        </div>
        <div class="text-[#eccd66] mx-6 md:mx-8 text-[34px] md:text-[40px] font-semibold">VS</div>
        <div class="flex-1 w-10 max-w-[160px] md:max-w-[200px] rounded-full" style="border: 5px solid #0098ea">
          <v-responsive :aspect-ratio="1" class="w-full">
            <div v-if="!getRightOption" class="w-full h-full center text-[38px] text-gray-600">?</div>
            <div
              v-else
              class="relative w-full h-full rounded-full cursor-pointer center"
              :style="{
                background: getRightOption.bg
              }"
              style="border: 2px solid #fff"
            >
              <img :src="getRightOption.img" alt="moraType" class="w-[60%] h-auto mx-auto" />
            </div>
          </v-responsive>
        </div>
      </div>
      <div v-if="status === Status.WaitingRival" class="">
        <div class="text-lg font-bold text-center text-gray-600 md:text-xl">Waiting for the opponent to mora...</div>
        <div class="flex justify-center w-full mt-4">
          <v-btn
            color="primary"
            variant="outlined"
            elevation="0"
            size="default"
            class="rounded-lg"
            style="width: 100%; max-width: 200px"
            :loading="cancelLoading"
            @click="cancelHandler"
          >
            <div class="normal-case">Cancel</div>
          </v-btn>
        </div>
      </div>
      <div
        v-else-if="status === Status.Win"
        class="text-xl font-bold text-center text-[#02BA50] flex items-center justify-center"
      >
        <div>😀</div>
        <div>You Win</div>
      </div>
      <div
        v-else-if="status === Status.Lose"
        class="text-xl font-bold text-center text-[#FF3955] flex items-center justify-center"
      >
        <div>😭</div>
        <div>You Lose</div>
      </div>
      <div v-else class="flex items-center justify-center text-xl font-bold text-center text-gray-600">
        <div>Draw</div>
      </div>

      <div v-if="[Status.Win].includes(status)" class="flex justify-center mt-4">
        <v-btn
          color="#02BA50"
          variant="elevated"
          elevation="0"
          :loading="claimRewardLoading"
          class="rounded-lg"
          style="width: 100%; max-width: 300px"
          @click="claimRewardHandler"
        >
          <div class="normal-case">Claim win reward</div>
        </v-btn>
      </div>

      <div v-if="[Status.Lose, Status.Draw].includes(status)" class="flex justify-center mt-4">
        <v-btn
          color="primary"
          variant="elevated"
          elevation="0"
          class="rounded-lg"
          style="width: 100%; max-width: 300px"
          @click="clearStatusInfo"
        >
          <div class="normal-case">One more round</div>
        </v-btn>
      </div>
    </template>
    <SettlementError ref="SettlementErrorRef" />
    <PVPTip ref="PVPTipRef" />
    <CancelGameTip ref="CancelGameTipRef" />
  </div>
</template>

<script lang="ts" setup>
import { useWeb3Wallet } from '@/hooks/web3wallet'
import { ref, watch } from 'vue'
import { betTypeOptions } from '@/options/bet_types'
import { GameInfo, useHosMoraContract } from '@/hooks/contracts/HosMora'
import { notyf } from '@/utils/notyf'
import { computed } from 'vue'
import { ethers } from 'ethers'
import superjson from 'superjson'
import { getWeb3ErrorMessage } from '@/utils/web3'
import { BetType } from '@/types/baseType'
import { useRoute } from 'vue-router'
import { watchEffect } from 'vue'
import { useDisplay } from 'vuetify'
import { amountListMap } from '@/config/amount.config'
import { useGameLogSearch } from '@/hooks/contracts/GameLogSearch'
import SettlementError from './SettlementError.vue'
import PVPTip from '../dialogs/PVPTip.vue'
import CancelGameTip from '../dialogs/CancelGameTip.vue'
import { SettlementErrorInstance } from './SettlementError'
import dayjs from 'dayjs'
import { onUnmounted } from 'vue'
import { PVPTipInstance } from '../dialogs/PVPTip'
import { CancelGameTipInstance } from '../dialogs/CancelGameTip'
import { onMounted } from 'vue'


const { smAndDown } = useDisplay()

const SettlementErrorRef = ref<SettlementErrorInstance>()

const { networkURL, networkURIKey, address, verifyLoginError, isConnectWalletNetwork } = useWeb3Wallet()

const route = useRoute()
const referrer = computed<string | undefined>(() => {
  const _referrer = route.query.referrer as string | undefined
  if (_referrer && ethers.isAddress(_referrer)) return _referrer
  return undefined
})

enum Status {
  NoMara,
  WaitingRival,
  Win,
  Lose,
  Draw
}
const moraGameinfo = ref<GameInfo | null>(null)
const status = computed(() => {
  if (!moraGameinfo.value) return Status.NoMara
  if (!address.value) return Status.NoMara
  const { bout, p1Address, p1Bet, p2Address, p2Bet } = moraGameinfo.value
  if (bout === 0n) return Status.NoMara
  if (p2Address !== address.value && p1Address !== address.value) return Status.NoMara
  if (p2Address === ethers.ZeroAddress) return Status.WaitingRival
  if (p1Address === ethers.ZeroAddress) return Status.WaitingRival
  if (p1Bet === p2Bet) {
    return Status.Draw
  }
  let p1Res = Status.Lose
  let p2Res = Status.Lose
  if (
    (p1Bet == BetType.Rock && p2Bet == BetType.Scissors) ||
    (p1Bet == BetType.Scissors && p2Bet == BetType.Cloth) ||
    (p1Bet == BetType.Cloth && p2Bet == BetType.Rock)
  ) {
    p1Res = Status.Win
  } else {
    p2Res = Status.Win
  }
  return address.value === p1Address ? p1Res : p2Res
})
const CancelGameTipRef = ref<CancelGameTipInstance>()
const PVPTipRef = ref<PVPTipInstance>()
const isPopPVPTip = ref(false)
const isBigTwominute = ref(false)
const timeout = setTimeout(() => {
  isBigTwominute.value = true
}, 1000 * 60 )
const isNeedPopPVPTip = computed(() => {
  if (isPopPVPTip.value) return false;
  if (status.value !== Status.WaitingRival) return false;
  if (!moraGameinfo.value) return false;
  if (!isBigTwominute.value) return false
  if ((+moraGameinfo.value.p1Timestamp.toString()) + (90) > dayjs().unix()) {
    return false
  }
  return true
})

const loading = ref(false)
const stateLoading = ref(false)

const moraType = ref<BetType>(betTypeOptions[0].value)

watch(moraGameinfo, value => {
  if (!value) return localStorage.removeItem('moraGameinfo')
  if (value.bout === 0n) return localStorage.removeItem('moraGameinfo')
  localStorage.setItem('moraGameinfo', superjson.stringify(value))
  if (value.p2Address === ethers.ZeroAddress) {
    timingRefreshState()
  }
})

const moraItemHandler = (value: BetType) => {
  moraType.value = value
}

const { moraOnce, getCurrentGameInfo, cancelGame, getNoReceiveWinAmount, claimReward } = useHosMoraContract()
const { getGameInfoedByBout, getGameInfoAndProgressByBout } = useGameLogSearch()

const amountList = computed(() => {
  return amountListMap[networkURIKey.value].map(item => +ethers.formatEther(item))
})
const amount = ref(amountList.value[0])
watch(amountList, () => {
  amount.value = amountList.value[0]
})

const getLeftOption = computed(() => {
  const info = moraGameinfo.value
  if (!info) return
  if (info.bout === 0n) return
  if (!address.value) return
  return address.value === info.p1Address
    ? betTypeOptions.find(item => item.value === info.p1Bet)
    : betTypeOptions.find(item => item.value === info.p2Bet)
})

const getRightOption = computed(() => {
  const info = moraGameinfo.value
  if (!info) return
  if (info.bout === 0n) return
  if (!address.value) return
  if (address.value === info.p1Address) {
    if (info.p2Address === ethers.ZeroAddress) return
    return betTypeOptions.find(item => item.value === info.p2Bet)
  } else {
    if (info.p1Address === ethers.ZeroAddress) return
    return betTypeOptions.find(item => item.value === info.p1Bet)
  }
})

const amountClickHandler = (item: number) => {
  amount.value = item
}

const moraSendHandler = async () => {
  loading.value = true
  try {
    await verifyLoginError()
    const info = await moraOnce(moraType.value, amount.value, referrer.value)
    moraGameinfo.value = info
  } catch (error) {
    console.error(error)
    if (!(error as Error).message.includes('User rejected the request.')) {
      notyf.error(getWeb3ErrorMessage(error as Error))
    }
  }
  loading.value = false
  googleConversion()
}

const cancelLoading = ref(false)
const cancelHandler = async () => {
  await CancelGameTipRef.value?.show()
  cancelLoading.value = true
  try {
    await cancelGame().finally(() => (cancelLoading.value = false))
    moraGameinfo.value = null
  } catch (error) {
    console.error(error)
    if (!(error as Error).message.includes('User rejected the request.')) {
      notyf.error(getWeb3ErrorMessage(error as Error))
    }
  }
}

const clearStatusInfo = () => {
  moraGameinfo.value = null
}

const claimRewardLoading = ref(false)
const claimRewardHandler = async () => {
  claimRewardLoading.value = true

  try {
    const noReceiveInfo = await getNoReceiveWinAmount()
    if (!noReceiveInfo) {
      claimRewardLoading.value = false;
      await SettlementErrorRef.value?.show('You have claimed the reward')
      moraGameinfo.value = null;
      return;
    }
    await claimReward()
    moraGameinfo.value = null;
    notyf.success('Claim reward successful')
  } catch (error) {
    console.error(error)
    if (!(error as Error).message.includes('User rejected the request.')) {
      notyf.error(getWeb3ErrorMessage(error as Error))
    }
  }
  claimRewardLoading.value = false
}

const refreshState = async () => {
  if (stateLoading.value) return
  const info = moraGameinfo.value
  if (!info) return
  if (info.bout === 0n) return
  if (info.p2Address !== ethers.ZeroAddress) return
  stateLoading.value = true
  const startTime = new Date().getTime()
  const newInfo = await getGameInfoAndProgressByBout(info.bout, info.amount).catch(err => {
    stateLoading.value = false
    return Promise.reject(err)
  })
  const endTime = new Date().getTime()
  const laveTime = 1500 - (endTime - startTime)
  if (laveTime > 0) await new Promise<void>(resolve => setTimeout(resolve, laveTime))
  stateLoading.value = false
  if (!newInfo) return (moraGameinfo.value = null)
  if (newInfo.p2Address !== ethers.ZeroAddress) {
    moraGameinfo.value = newInfo
  }
}

const isTimingRefreshState = ref(false)
const timingRefreshState = async () => {
  if (stateLoading.value) return
  if (isTimingRefreshState.value) return
  isTimingRefreshState.value = true
  const isNotP2 = () => {
    const info = moraGameinfo.value
    return info && info.bout !== 0n && info.p2Address === ethers.ZeroAddress
  }
  while (isNotP2()) {
    await new Promise<void>(resolve => setTimeout(resolve, 3000))
    await refreshState()
    await new Promise<void>(resolve => setTimeout(resolve, 5000))
  }
  isTimingRefreshState.value = false
}

function googleConversion() {
  (window as any).gtag('event', 'event_PLAY_MORA', {
    event_callback: () => {},
    event_timeout: 2000
    // <event_parameters>
  })
}

const initState = async () => {
  const _address = address.value
  if (!_address) return
  stateLoading.value = true
  const startTime = new Date().getTime()
  const res = await getCurrentGameInfo()
  const noReceiveInfo = await getNoReceiveWinAmount()
  const isSetMoraGameinfo = async () => {
    if (res.bout !== 0n) return res
    if (noReceiveInfo && noReceiveInfo.bout !== 0n) return noReceiveInfo
    const oldInfo = localStorage.getItem('moraGameinfo')
    if (!oldInfo) return localStorage.removeItem('moraGameinfo')
    const infoTemp = superjson.parse<GameInfo>(oldInfo)
    if (infoTemp.bout === 0n) return localStorage.removeItem('moraGameinfo')
    if (infoTemp.p1Address !== ethers.ZeroAddress && infoTemp.p2Address !== ethers.ZeroAddress) {
      return localStorage.removeItem('moraGameinfo')
    }
    const _info = await getGameInfoedByBout(infoTemp.bout, infoTemp.amount)
    if (!_info) return localStorage.removeItem('moraGameinfo')
    if (_info.p1Address !== _address && _info.p2Address !== _address) return localStorage.removeItem('moraGameinfo')
    return _info
  }
  const closeLoading = async () => {
    const endTime = new Date().getTime()
    const laveTime = 1500 - (endTime - startTime)
    if (laveTime > 0) await new Promise<void>(resolve => setTimeout(resolve, laveTime))
    stateLoading.value = false
  }
  try {
    const info = await isSetMoraGameinfo()
    await closeLoading()
    if (info) moraGameinfo.value = info;
  } catch (error) {
    await closeLoading()
    console.error(error)
  }

}
watch(address, (_, oldValue) => {
  if (oldValue) {
    clearStatusInfo()
  }
})
watchEffect(() => {
  if (address.value && isConnectWalletNetwork.value) {
    initState()
  }
})

onMounted(() => {
  watch(isNeedPopPVPTip, (value) => {
    if (value) {
      PVPTipRef.value?.show()
      isPopPVPTip.value = true
    }
  }, { immediate: true})
})

onUnmounted(() => {
  clearTimeout(timeout)
})



</script>

<style lang="scss" scoped>
.mora-item-box {
  transition-duration: 150ms;
  &:hover {
    transform: scale(1.1);
  }
}
</style>
