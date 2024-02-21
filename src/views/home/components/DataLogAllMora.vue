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
import { GameResult } from '@/types/baseType'
import { myGameResult } from '@/utils/mora_util'
import { addressFormat } from '@/utils/web3'
import BigNumber from 'bignumber.js'
import dayjs from 'dayjs'
import { ethers } from 'ethers'
import { NDataTable } from 'naive-ui'
import type { DataTableColumns } from 'naive-ui'
import { onUnmounted, watch } from 'vue'
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import { useDisplay } from 'vuetify'
import { NConfigProvider } from 'naive-ui'
import { themeOverrides } from '@/plugins/navui'
import { computed } from 'vue'

const route = useRoute()

const loading = ref(false)

const { xs } = useDisplay()

const { getGameLog } = useGameLogSearch()

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
      <div class="center">
        <MoraType type={rowData.p1Bet} size={30}></MoraType>
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
      <div class="center">
        <MoraType type={rowData.p2Bet} size={30}></MoraType>
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
    title: 'Result',
    key: 'result',
    align: 'center',
    render: rowData => {
      const res = myGameResult(rowData.p1Bet, rowData.p2Bet)
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
  }
])

const data = ref<GameInfo[]>([])

const refreshLogs = async () => {
  const res = await getGameLog({ page: 0, limit: 20 })
  data.value = res.infos.filter(item => !(item.amount === ethers.parseEther('5') && item.bout === 1n))
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
    await new Promise<void>(resolve => setTimeout(resolve, 8000))
  }
}

watch(
  () => route.params.network,
  value => {
    isTimingRefreshLogs.value = false
    if (value) {
      timingRefreshLogs()
    }
  },
  { immediate: true }
)

onUnmounted(() => {
  isTimingRefreshLogs.value = false
})
</script>

<style lang="scss" scoped></style>
