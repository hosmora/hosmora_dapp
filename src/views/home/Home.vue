<template>
  <div class="">
    <ReferrerBox />
    <MoraAction />
    <MoraLogs />
    <div class="h-[40px]"></div>
  </div>
</template>

<script lang="ts" setup>
import { chainsNameURIMap } from "@/plugins/web3modal";
import { useRoute, useRouter } from "vue-router";
import MoraAction from './components/MoraAction.vue'
import MoraLogs from './components/MoraLogs.vue'
import ReferrerBox from './components/ReferrerBox.vue'
import { defaultNetwork } from "@/config/env.config";
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
      name: "Mora",
      params: { network: defaultNetwork },
      query: route.query,
    });
  }
};

initNetwork();
</script>
