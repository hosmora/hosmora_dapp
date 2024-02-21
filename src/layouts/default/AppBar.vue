<template>
  <v-app-bar flat style="border-bottom: 1px solid #ebf0f5; z-index: 100 !important">
    <div class="container flex items-center justify-between">
      <div class="flex items-center mr-4 md:min-w-[240px]">
        <div class="mr-2 center">
          <img src="/logo.svg" alt="logo" class="w-[40px] h-[40px]" />
        </div>
        <div class="font-bold text-xl text-[#0098eab5]">HosMora</div>
      </div>

      <div class="hidden md:flex items-center h-full justify-center space-x-4 text-[15px]">
        <div
          v-for="item in tabList"
          :key="item"
          class="font-semibold nav-tab"
          :class="{ 'text-[#758293]': item !== navTab, 'active': item === navTab }"
          @click="navTabSwitchHandler(item)"
        >
          <span className="py-2.5 ">{{item}}</span>
        </div>
      </div>
      <div class="md:min-w-[340px] flex justify-end items-center">
        <v-btn
          v-if="!isConnectWalletNetwork"
          color="primary"
          variant="elevated"
          elevation="0"
          rounded
          :loading="isLoginLock"
          @click="login"
        >
          <span class="normal-case">Connect Wallet</span>
        </v-btn>
        <w3m-account-button v-else :balance="!xs ? 'show' : 'hide'" />
      </div>
    </div>
  </v-app-bar>
</template>

<script lang="ts" setup>
import { useDisplay } from 'vuetify'
import { useWeb3Wallet } from '@/hooks/web3wallet'
import { ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const tabList = ['Mora', 'Invite']

const { isConnectWalletNetwork, isLoginLock, login } = useWeb3Wallet()


const route = useRoute()
const router = useRouter()
const { xs } = useDisplay()


const navTab = ref(route.name ?? tabList[0])


watch(() => route.name, (name) => {
  if (navTab.value !== name) {
    navTab.value = name ?? tabList[0]
  }
})

const navTabSwitchHandler = (item: string) => {
  navTab.value = item;
  router.push({name: item, query: route.query, params: route.params})
}

</script>

<style lang="scss" scoped>
.nav-tab {
  cursor: pointer;
  width: 70px;
  text-align: center;
  transition-duration: 150ms;
  &:hover {
    color: #151824;
  }
  &.active {
    span {
      position: relative;
      &::after {
        content: '';
        left: -10px;
        bottom: calc(-1rem + 4px);
        display: block;
        position: absolute;
        width: calc(100% + 20px);
        height: 2px;
        border-radius: 9999px;
        background-color: #0098ea;
      }
    }
  }
}
</style>
