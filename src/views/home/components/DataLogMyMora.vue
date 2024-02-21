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
import { NConfigProvider } from 'naive-ui'
import { themeOverrides } from '@/plugins/navui'
import { watchEffect } from 'vue'
import { computed } from 'vue'

const loading = ref(false)

const { xs } = useDisplay()

const { getGameLog } = useGameLogSearch()
const { address, isConnectWalletNetwork } = useWeb3Wallet()

const columns = computed<DataTableColumns<GameInfo>>(() => [
  {
    title: 'Amount',
    key: 'amount',
    align: 'center',
    render: rowData => <span>{+BigNumber(ethers.formatEther(rowData.amount)).toFixed(4, BigNumber.ROUND_DOWN)}</span>
  },
  ...(!xs.value
    ? ([
        {
          title: 'P1',
          key: 'p1Address',
          align: 'center',
          render: rowData => <span>{addressFormat(rowData.p1Address, 11)}</span>
        }
      ] as DataTableColumns<GameInfo>)
    : []),
  {
    title: 'P1 Mora',
    key: 'p1Bet',
    align: 'center',
    render: rowData => (
      <div class=" center">
        <div class="relative center">
          <MoraType type={rowData.p1Bet} size={30}></MoraType>
          {(() => {
            const _address = address.value
            if (!_address) return <span></span>
            if (rowData.p1Address !== _address && rowData.p2Address !== _address) return <></>
            const isP1 = _address === rowData.p1Address
            if (!isP1) return <span></span>
            return <div class="absolute top-[2px] right-[-6px] w-1.5 rounded-full h-1.5 bg-[#2eb6ff]"></div>
          })()}
        </div>
      </div>
    )
  },
  ...(!xs.value
    ? ([
        {
          title: 'P1 Time',
          key: 'p1Timestamp',
          align: 'center',
          render: rowData => (
            <span>{dayjs(+(rowData.p1Timestamp * 1000n).toString()).format('YYYY-MM-DD HH:mm:ss')}</span>
          )
        },
        {
          title: 'P2',
          key: 'p2Address',
          align: 'center',
          render: rowData => <span>{addressFormat(rowData.p2Address, 11)}</span>
        }
      ] as DataTableColumns<GameInfo>)
    : []),
  {
    title: 'P2 Mora',
    key: 'p2Bet',
    align: 'center',
    render: rowData => (
      <div class=" center">
        <div class="relative center">
          <MoraType type={rowData.p2Bet} size={30}></MoraType>
          {(() => {
            const _address = address.value
            if (!_address) return <span></span>
            if (rowData.p1Address !== _address && rowData.p2Address !== _address) return <></>
            const isP2 = _address === rowData.p2Address
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
          title: 'P2 Time',
          key: 'p2Timestamp',
          align: 'center',
          render: rowData => (
            <span>{dayjs(+(rowData.p2Timestamp * 1000n).toString()).format('YYYY-MM-DD HH:mm:ss')}</span>
          )
        }
      ] as DataTableColumns<GameInfo>)
    : []),
  {
    title: 'My Result',
    key: 'result',
    align: 'center',
    render: rowData => {
      const _address = address.value
      if (!_address) return <></>
      if (rowData.p1Address !== _address && rowData.p2Address !== _address) return <></>
      const isP1 = _address === rowData.p1Address
      const myBetType = isP1 ? rowData.p1Bet : rowData.p2Bet
      const rivalBetType = isP1 ? rowData.p2Bet : rowData.p1Bet
      const res = myGameResult(myBetType, rivalBetType)
      return (
        <span class={{ 'text-[#02BA50]': res === GameResult.Win, 'text-[#FF3955]': res === GameResult.Lose }}>
          {(() => {
            if (res === GameResult.Draw) return 'Draw'
            if (res === GameResult.Win) return 'Win'
            return 'Lose'
          })()}
        </span>
      )
    }
  }
])

const data = ref<GameInfo[]>([])

const refreshLogs = async () => {
  if (!address.value) {
    return (data.value = [])
  }
  const res = await getGameLog({
    page: 0,
    limit: 20,
    account: address.value
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
    await new Promise<void>(resolve => setTimeout(resolve, 12000))
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
