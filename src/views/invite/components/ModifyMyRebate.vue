<template>
  <v-dialog width="500" ref="dialogRef">
    <template v-slot:activator="{ props }">
      <v-btn
        v-bind="props"
        color="primary"
        class="leading-none"
        style="height: 22px; padding: 0 8px; border-radius: 6px"
        variant="outlined"
        size="small"
        elevation="0"
        @click="openHook"
      >
        <span class="normal-case">Modify</span>
      </v-btn>
    </template>

    <template v-slot:default="{ isActive }">
      <button v-show="false" ref="closeRef" @click="isActive.value = false"></button>
      <div class="w-full bg-white rounded-xl">
        <div class="flex justify-end px-3 pt-3">
          <v-btn density="compact" elevation="0" @click="isActive.value = false" icon="mdi-close"></v-btn>
        </div>
        <div class="pb-8 xs:px-4 sm:px-6 md:px-8">
          <div class="text-[13px] text-red-500 mb-3">
            Use level max rebate will change as the level increases.
            <br />
            DIY rebate will not change as you level up
            <br />
          </div>
          <div class="bg-[#F1F1F1] rounded-full flex overflow-hidden">
            <div
              class="flex-1 w-10 px-2 py-2 duration-150 rounded-l-full cursor-pointer md:px-4 center"
              :class="isDiyRebate ? 'hover:opacity-90 bg-primary' : 'hover:opacity-70'"
              @click="useDIYRebate()"
            >
              DIY rebate
            </div>
            <div
              class="flex-1 w-10 px-2 py-2 duration-150 rounded-r-full cursor-pointer md:px-4 center"
              :class="!isDiyRebate ? 'hover:opacity-90 bg-primary' : 'hover:opacity-70'"
              @click="useLevelMaxRebate"
            >
              Use level max rebate
            </div>
          </div>

          <div class="mt-4">
            <div class="text-[#758293] mb-1">My rebate ratio</div>
            <v-text-field
              bg-color="#F7F9FB"
              variant="outlined"
              placeholder="My rebate"
              color="primary"
              rounded
              density="comfortable"
              :readonly="!isDiyRebate || loading"
              base-color="#ccc"
              type="number"
              :min="0"
              :max="levelMaxRebateNumber"
              :precision="4"
              :step="0.0001"
              @update:focused="inputFocusedHandler"
              hide-details
              :model-value="myRebate"
              @update:model-value="myRebateUpdateHandler"
              suffix="%"
            ></v-text-field>
          </div>

          <div class="mt-2">
            <div class="text-[#758293] mb-1">Multiple of level max rebate</div>
            <v-slider
              color="primary"
              :model-value="multipleRebate"
              @update:model-value="multipleRebateUpdateHandler"
              hide-details
              :readonly="!isDiyRebate || loading"
              thumb-label
              :step="0.01"
              :thumb-size="18"
            >
              <template v-slot:thumb-label="{ modelValue }">
                {{ +BigNumber(modelValue).toFixed(2, BigNumber.ROUND_DOWN) }}%
              </template>
            </v-slider>
          </div>

          <v-btn
            @click="submit"
            :disabled="!isChange"
            :loading="loading"
            color="primary"
            class="mt-6 rounded-lg"
            size="large"
            width="100%"
            elevation="0"
          >
            <span class="text-[15px] normal-case">Modify my rebate</span>
          </v-btn>
        </div>
      </div>
    </template>
  </v-dialog>
</template>

<script setup lang="ts">
import { useReferrerLevel } from '@/hooks/contracts/ReferrerLevel'
import { ratioBigintAsPercentage, ratioPercentageAsBigint } from '@/utils/libs'
import { notyf } from '@/utils/notyf'
import { getWeb3ErrorMessage } from '@/utils/web3'
import BigNumber from 'bignumber.js'
import { nextTick } from 'vue'
import { computed } from 'vue'
import { ref } from 'vue'
const props = defineProps<{
  levelMaxRebate: bigint
  initMyRebate: bigint
  isReferrerDiyFeeRatio: boolean
  referrer: string
}>()

const emit = defineEmits(['changeRebate'])

const { setReferrerFeeRatio, closeDiyReferrerFeeRatio } = useReferrerLevel()

const levelMaxRebateNumber = computed(() => {
  return ratioBigintAsPercentage(props.levelMaxRebate)
})

const initMyRebateNumber = computed(() => {
  return ratioBigintAsPercentage(props.initMyRebate)
})
const closeRef = ref<HTMLButtonElement>()
const isDiyRebate = ref(false)
const myRebate = ref(0)
const multipleRebate = ref(0)
const loading = ref(false)


const myRebateUpdateHandler = (_value: number | string) => {
  myRebate.value = _value as any
  const value = +(_value || 0)
  if (value > levelMaxRebateNumber.value) {
    nextTick(() => {
      myRebate.value = levelMaxRebateNumber.value
      multipleRebate.value = 100
    })
    return
  }
  multipleRebate.value = +BigNumber(value).div(levelMaxRebateNumber.value).times(100).toFixed(2, BigNumber.ROUND_DOWN)
}

const multipleRebateUpdateHandler = (value: number) => {
  multipleRebate.value = value
  myRebate.value = +BigNumber(BigNumber(value).toFixed(2, BigNumber.ROUND_DOWN))
    .div(100)
    .times(levelMaxRebateNumber.value)
    .toFixed(4, BigNumber.ROUND_DOWN)
}

const inputFocusedHandler = (focuse: boolean) => {
  if (!focuse) {
    if (!myRebate.value) return (myRebate.value = 0)
    const dp = BigNumber(myRebate.value).dp()
    if (!dp) return
    if (dp <= 4) return
    myRebate.value = +BigNumber(myRebate.value).toFixed(4, BigNumber.ROUND_DOWN)
  }
}

const isChange = computed(() => {
  return (
    isDiyRebate.value !== props.isReferrerDiyFeeRatio ||
    ratioBigintAsPercentage(props.levelMaxRebate) !== myRebate.value
  )
})

const useLevelMaxRebate = () => {
  if (loading.value) return;
  isDiyRebate.value = false
  myRebate.value = levelMaxRebateNumber.value
  multipleRebate.value = 100
}

const useDIYRebate = () => {
  if (loading.value) return;
  isDiyRebate.value = true
  myRebate.value = initMyRebateNumber.value
  const multipleRebateTemp = +BigNumber(myRebate.value)
    .div(levelMaxRebateNumber.value)
    .times(100)
    .toFixed(1, BigNumber.ROUND_DOWN)
  multipleRebate.value = multipleRebateTemp > 100 ? 100 : multipleRebateTemp
}

const openHook = () => {
  isDiyRebate.value = props.isReferrerDiyFeeRatio
  if (!props.isReferrerDiyFeeRatio) {
    useLevelMaxRebate()
  } else {
    useDIYRebate()
  }
}


const submit = async () => {
  if (!isChange.value) return
  if (!props.referrer) return
  const myRebateTemp = isDiyRebate.value
    ? +BigNumber(myRebate.value || 0).toFixed(4, BigNumber.ROUND_DOWN)
    : levelMaxRebateNumber.value
  const myRebateTempBigint = ratioPercentageAsBigint(myRebateTemp.toString())
  loading.value = true
  try {
    if (isDiyRebate.value) {
      await setReferrerFeeRatio(props.referrer, myRebateTempBigint)
    } else {
      await closeDiyReferrerFeeRatio(props.referrer)
    }
    notyf.success('Modify my rebate ratio successfully')
    emit('changeRebate', { myRebate: myRebateTempBigint, isDiy: isDiyRebate.value })
    closeRef.value?.click()
  } catch (error) {
    console.error(error)
    if (!(error as Error).message.includes('User rejected the request.')) {
      notyf.error(getWeb3ErrorMessage(error as Error))
    }
  }
  loading.value = false
}
</script>

<style lang="scss" scoped>
::v-deep(.v-input .v-field) {
  border-radius: 12px;
}
</style>
