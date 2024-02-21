<template>
  <v-dialog v-model="dialog" width="400">
    <div class="w-full bg-white rounded-xl">
      <div class="flex justify-end px-3 pt-3">
        <v-btn density="compact" elevation="0" @click="dialog = false" icon="mdi-close"></v-btn>
      </div>
      <div class="pb-8 xs:px-4 sm:px-6 md:px-8">
        <div class="mb-3 text-lg ">
          <div >Waiting too long?🥹</div>
          <div>Bookmark the website and check the game results at any time</div>
          <div>PVP game, you can invite friends to play together, it will be a lot of fun</div>
        </div>

        <v-btn @click="inviteHandler" color="primary" class="mt-3 rounded-lg"  width="100%" elevation="0">
          <span class="text-[15px] normal-case">Go to invite</span>
        </v-btn>
        <v-btn @click="submit" color="primary" variant="outlined" class="mt-3 rounded-lg"  width="100%" elevation="0">
          <span class="text-[15px] normal-case">Confirm cancel</span>
        </v-btn>
      </div>
    </div>
  </v-dialog>
</template>

<script setup lang="ts">
import { watch } from 'vue';
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router';

let resolve: () => void, reject: (reason?: any) => void

const dialog = ref(false)

const router = useRouter()
const route = useRoute()

watch(dialog, (val) => {
  if (!val) setTimeout(() => reject(new Error('Cancelled')))
})

const submit = () => {
  resolve()
  dialog.value = false
}
const inviteHandler = () => {
  router.push({name: 'Invite', query: route.query, params: route.params})
}

const show = () => {
  dialog.value = true
  return new Promise<void>((_resolve, _reject) => {
    resolve = _resolve;
    reject = _reject;
  })
}

defineExpose({show})
</script>

<style lang="scss" scoped></style>
