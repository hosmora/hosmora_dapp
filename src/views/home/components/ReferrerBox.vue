<template>
  <div class="w-full p-4 px-4 mb-4 bg-white md:px-6 rounded-xl">
    <template v-if="!!referrer">
      <div v-if="loading">
        <div class="flex"><NSkeleton :height="20" text round /></div>
        <div class="" style="height: 10.8px"></div>
        <div class="flex"><NSkeleton :height="20" text round /></div>
      </div>
      <div v-else>
        <div class="flex items-start justify-between flex-nowrap">
          <div class="items-center block mr-1 sm:flex">
            <VipLevel :level="level" class="mr-2" />
            <div class=" whitespace-nowrap">
              Win handling fee
              <span class="text-base font-bold text-green-600">{{ ratioBigintAsPercentage(winFee) }}%</span>
            </div>
          </div>

          <div
            @click="open(useDocHook().getHomeReferrerDocLink())"
            class="flex whitespace-nowrap items-center space-x-0.5 text-gray-500 hover:text-gray-700 duration-150 cursor-pointer flex-nowrap"
          >
            <v-icon size="16" icon="mdi-file-document-outline" />
            <div>Rules</div>
          </div>
        </div>
        <div class="items-center mt-1">
          <span class="mr-1 text-base font-bold leading-none align-text-top">Referrer:</span>
          <span
            class="leading-[20px] cursor-pointer text-primary align-text-top break-all hover:underline"
            @click="copyHandler"
          >
            {{ referrer }}
          </span>
        </div>
      </div>
    </template>
    <template v-else>
      <div class="flex items-start justify-between">
        <div class="flex flex-wrap items-center mr-2 text-base">
          <div class="whitespace-nowrap">No referrer&nbsp;</div>
          <div class="whitespace-nowrap">
            <span>the win handling fee is </span>
            <span class="text-base font-bold text-red-500">{{ ratioBigintAsPercentage(feeRatioNoReferrer) }}%</span>
          </div>
        </div>
        <div
          @click="open(useDocHook().getHomeReferrerDocLink())"
          class="flex whitespace-nowrap items-center space-x-0.5 text-gray-500 hover:text-gray-700 duration-150 cursor-pointer flex-nowrap"
        >
          <v-icon size="16" icon="mdi-file-document-outline" />
          <div>Rules</div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import VipLevel from '@/components/VipLevel.vue'
import { useReferrerLevel } from '@/hooks/contracts/ReferrerLevel'
import { notyf } from '@/utils/notyf'
import { ethers } from 'ethers'
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import copy from 'copy-to-clipboard'
import { FeeLevel } from '@/types/baseType'
import { ratioBigintAsPercentage } from '@/utils/libs'
import { NSkeleton } from 'naive-ui'
import { feeRatioNoReferrer } from '@/config/invite.config'
import { useICPUIDMap } from '@/hooks/icpcalll/uidmap_backend'
import { useWeb3Wallet } from '@/hooks/web3wallet'
import { referrerOrigin } from '@/config/env.config'
import { useDocHook } from '@/hooks/doc.hook'



const { networkURIKey } = useWeb3Wallet();
const { getFeeLevel, getReferrerWinFeeRatio } = useReferrerLevel()

const route = useRoute()
const referrer = computed<string | undefined>(() => {
  const _referrer = route.query.referrer as string | undefined
  if (_referrer && ethers.isAddress(_referrer)) return _referrer
  return undefined
})

const level = ref<FeeLevel>(FeeLevel.level1)
const winFee = ref<bigint>(0n)
const loading = ref(false)

const initData = async () => {
  if (!referrer.value) return
  loading.value = true
  try {
    const startTime = new Date().getTime()
    const res = await Promise.all([getFeeLevel(referrer.value), getReferrerWinFeeRatio(referrer.value)])
    const endTime = new Date().getTime()
    const laveTime = 400 - (endTime - startTime)
    if (laveTime > 0) await new Promise<void>(resolve => setTimeout(resolve, laveTime))
    loading.value = false
    // const res = await getFeeLevel(referrer.value).finally(() => (loading.value = false))
    level.value = res[0]
    winFee.value = res[1]
  } catch (error) {
    console.error(error)
    loading.value = false
  }
}
initData()

const referrerLink = ref(window.location.href)
const initReferrerLink = async () => {
  referrerLink.value = window.location.href
  if (!referrer.value) return
  try {
    const uid = await useICPUIDMap().getUIDByInfo(networkURIKey.value, referrer.value)
    referrerLink.value = `${referrerOrigin}/${uid}`
  } catch (error) {
    referrerLink.value = window.location.href
  }
}

watch(referrer, () => initReferrerLink(), { immediate: true })

const copyHandler = () => {
  copy(referrerLink.value || window.location.href)
  notyf.success('Copied referrer link successfully')
  // window.open('https://www.baidu.com', '_blank')
}
const open = (link: string) => {
  window.open(link, '_blank')
}
</script>

<style lang="scss" scoped></style>
