<template>
  <div v-if="isConnectWalletNetwork" class="">
    <LevelCard />
    <InviteLogs />
  </div>

  <div v-else class="p-4 overflow-hidden bg-white rounded-xl center">
    <div class="center ">
      <v-icon icon="mdi-text-box-remove-outline" class="text-gray-300" size="80"></v-icon>
    </div>
    <div class="text-[15px] text-gray-500">No data, please connect the wallet first</div>
  </div>

  <div class="h-[40px]"></div>
</template>

<script setup lang="ts">
import { useRouter, useRoute } from "vue-router";
import LevelCard from "./components/LevelCard.vue";
import InviteLogs from "./components/InviteLogs.vue";
import { chainsNameURIMap } from "@/plugins/web3modal";
import { defaultNetwork } from "@/config/env.config";
import { useWeb3Wallet } from "@/hooks/web3wallet";

const { isConnectWalletNetwork } = useWeb3Wallet()

const router = useRouter();
const route = useRoute();

const initNetwork = () => {
  const networkURI = route.params.network as string;
  if (
    !networkURI ||
    !Object.keys(chainsNameURIMap).some(
      (item) => item.toLowerCase() === networkURI.toLowerCase()
    )
  ) {
    router.replace({
      name: "Invite",
      params: { network: defaultNetwork },
      query: route.query,
    });
  }
};

initNetwork();

</script>

<style lang="scss" scoped>

</style>
