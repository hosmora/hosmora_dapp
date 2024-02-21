<template>
  <div class="mt-6 overflow-hidden bg-white rounded-xl">
    <div class="flex items-center justify-between px-4" :style="{ borderBottom: '1px solid #cccccc43' }">
      <div className="flex flex-1 w-10 items-center">
        <div className="xs:hidden md:grid md:place-content-center  mr-1">
          <img src="@/assets/images/green_dot.svg" alt="green_dot" class="w-[18px] h-[18px]" />
        </div>
      </div>
      <v-tabs v-model="tab" color="#0098EA" class="text-[#758293]" align-tabs="end">
        <v-tab :value="1"><span class="normal-case">Invite Mora</span></v-tab>
        <v-tab :value="2"><span class="normal-case">Lasting Bind Mora</span></v-tab>
      </v-tabs>
    </div>
    <v-window disabled v-model="tab">
      <v-window-item :value="1">
        <InviteMora />
      </v-window-item>
      <v-window-item :value="2">
        <LastingBindMora />
      </v-window-item>
    </v-window>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import InviteMora from './InviteMora.vue'
import LastingBindMora from './LastingBindMora.vue'


const tab = ref(1)
</script>

<style lang="scss" scoped></style>
