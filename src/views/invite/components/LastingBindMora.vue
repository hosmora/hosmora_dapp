<template>
  <NConfigProvider :theme-overrides="themeOverrides">
    <NDataTable
      :size="xs ? 'small' : 'medium'"
      :scroll-x="xs ? 280 : 900"
      :columns="columns"
      :data="data"
      :pagination="false"
      :bordered="false"
      :loading="loading"
    ></NDataTable>
  </NConfigProvider>
</template>

<script setup lang="tsx">
import MoraType from '@/components/MoraType.vue'
import { useGameLogSearch } from '@/hooks/contracts/GameLogSearch'
import { GameInfo } from '@/hooks/contracts/HosMora'
import { useWeb3Wallet } from '@/hooks/web3wallet'
import { GameResult } from '@/types/baseType'
import { myGameResult } from '@/utils/mora_util'
import { addressFormat } from '@/utils/web3'
import BigNumber from 'bignumber.js'
import dayjs from 'dayjs'
import { ethers } from 'ethers'
import { NDataTable } from 'naive-ui'
import type { DataTableColumns } from 'naive-ui'
import { onUnmounted, ref, watch } from 'vue'
import { useDisplay } from 'vuetify'
import { NConfigProvider, NTooltip } from 'naive-ui'
import { themeOverrides } from '@/plugins/navui'
import { watchEffect } from 'vue'
import { VIcon } from 'vuetify/components/VIcon'
import type { LastingBindGameInfo } from '@/hooks/contracts/GameLogSearch'
import { computed } from 'vue'

const loading = ref(false)

const { xs } = useDisplay()

const { getGameLogLastingBind } = useGameLogSearch()
const { address, isConnectWalletNetwork } = useWeb3Wallet()

const columns = computed<DataTableColumns<LastingBindGameInfo>>(() => [
  {
    title: 'Amount',
    key: 'amount',
    align: 'center',
    render: rowData => (
      <span>{+BigNumber(ethers.formatEther(rowData.gameinfo.amount)).toFixed(4, BigNumber.ROUND_DOWN)}</span>
    )
  },
  {
    title: 'P1 Mora',
    key: 'p1Bet',
    align: 'center',
    render: rowData => (
      <div class=" center">
        <div class="relative center">
          <MoraType type={rowData.gameinfo.p1Bet} size={30}></MoraType>
          {(() => {
            const _address = address.value
            if (!_address) return <span></span>
            if (rowData.p1BindReferrer !== _address && rowData.p2BindReferrer !== _address) return <span></span>
            const isP1 = _address === rowData.p1BindReferrer
            if (!isP1) return <span></span>
            return <div class="absolute top-[2px] right-[-6px] w-1.5 rounded-full h-1.5 bg-[#2eb6ff]"></div>
          })()}
        </div>
      </div>
    )
  },
  {
    title: 'P2 Mora',
    key: 'p2Bet',
    align: 'center',
    render: rowData => (
      <div class=" center">
        <div class="relative center">
          <MoraType type={rowData.gameinfo.p2Bet} size={30}></MoraType>
          {(() => {
            const _address = address.value
            if (!_address) return <span></span>
            if (rowData.p1BindReferrer !== _address && rowData.p2BindReferrer !== _address) return <span></span>
            const isP2 = _address === rowData.p2BindReferrer
            if (!isP2) return <span></span>
            return <div class="absolute top-[2px] right-[-6px] w-1.5 rounded-full h-1.5 bg-[#2eb6ff]"></div>
          })()}
        </div>
      </div>
    )
  },
  ...(!xs.value
    ? ([
        {
          title: 'Result',
          key: 'result',
          align: 'center',
          render: rowData => {
            const res = myGameResult(rowData.gameinfo.p1Bet, rowData.gameinfo.p2Bet)
            return (
              <span class={{ 'text-[#02BA50]': res !== GameResult.Draw }}>
                {(() => {
                  if (res === GameResult.Draw) return 'Draw'
                  if (res === GameResult.Win) return 'P1 Win'
                  return 'P2 Win'
                })()}
              </span>
            )
          }
        },
        {
          title: 'Final Time',
          key: 'p2Timestamp',
          align: 'center',
          width: 160,
          render: rowData => (
            <span>{dayjs(+(rowData.gameinfo.p2Timestamp * 1000n).toString()).format('YYYY-MM-DD HH:mm:ss')}</span>
          )
        }
      ] as DataTableColumns<LastingBindGameInfo>)
    : []),
  {
    title: () => (
      <div class="flex items-center justify-center">
        <div class="mr-0.5">Income</div>
        <NTooltip
          trigger="hover"
          style={{ maxWidth: '320px' }}
          v-slots={{
            default: () => '(Only Newcomers lasting rebate income)',
            trigger: () => (
              <div class="">
                <VIcon icon="mdi-information-outline" size="16"></VIcon>
              </div>
            )
          }}
        ></NTooltip>
      </div>
    ),
    key: 'result',
    align: 'center',
    render: rowData => {
      const _address = address.value
      if (!_address) return <span>0</span>
      const gameinfo = rowData.gameinfo
      if (rowData.p1BindReferrer !== _address && rowData.p2BindReferrer !== _address) return <span>0</span>
      const isP1 = _address === rowData.p1BindReferrer
      const isP2 = _address === rowData.p2BindReferrer
      const myBetType = isP1 ? gameinfo.p1Bet : gameinfo.p2Bet
      const rivalBetType = isP1 ? gameinfo.p2Bet : gameinfo.p1Bet
      const res = myGameResult(myBetType, rivalBetType)
      if (res === GameResult.Draw) return <span>0</span>
      if (isP1 && isP2)
        return (
          <span>
            {+BigNumber(ethers.formatEther(gameinfo.winAmountDistribute.lastingBind)).toFixed(4, BigNumber.ROUND_DOWN)}
          </span>
        )
      if (res === GameResult.Win)
        return (
          <span>
            {+BigNumber(ethers.formatEther(gameinfo.winAmountDistribute.lastingBind)).toFixed(4, BigNumber.ROUND_DOWN)}
          </span>
        )
      return <span>0</span>
    }
  }
])

const data = ref<LastingBindGameInfo[]>([])

const refreshLogs = async () => {
  if (!address.value) {
    return (data.value = [])
  }
  const res = await getGameLogLastingBind({
    page: 0,
    limit: 20,
    referrer: address.value
  })
  data.value = res.infos
}

const isTimingRefreshLogs = ref(false)
const timingRefreshLogs = async () => {
  if (isTimingRefreshLogs.value) return
  isTimingRefreshLogs.value = true
  loading.value = true
  while (isTimingRefreshLogs.value) {
    try {
      await refreshLogs()
      loading.value = false
    } catch (error) {
      /* empty */
    }
    await new Promise<void>(resolve => setTimeout(resolve, 50 * 1000))
  }
}

onUnmounted(() => {
  isTimingRefreshLogs.value = false
})

watchEffect(() => {
  data.value = []
  isTimingRefreshLogs.value = false
  if (address.value && isConnectWalletNetwork.value) {
    timingRefreshLogs()
  }
})
</script>

<style lang="scss" scoped></style>
