<template>
  <v-bottom-navigation
    style="color: #758293;z-index: 10;"
    :elevation="2"
    :active="smAndDown"
    density="comfortable"
    :model-value="navigation"
    @update:model-value="updateHandler"
    mandatory
    color="primary"
    grow
  >
    <v-btn value="Mora">
      <v-icon>mdi-gamepad</v-icon>
      Mora
    </v-btn>

    <v-btn value="Invite">
      <v-icon>mdi-crown</v-icon>
      Invite
    </v-btn>
  </v-bottom-navigation>
</template>

<script setup lang="ts">
import { watch } from 'vue';
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router';
import { useDisplay } from 'vuetify/lib/framework.mjs'
const { smAndDown } = useDisplay()

const router = useRouter()
const route = useRoute()

const navigation = ref<string>((route.name as string) ?? 'Mora')

watch(() => route.name, (_name) => {
  if (navigation.value !== _name) {
    navigation.value = _name as string ?? 'Mora'
  }
})
const updateHandler = (_value: string) => {
  navigation.value = _value
  router.push({name: _value, query: route.query, params: route.params})
}
</script>

<style lang="scss" scoped>
::v-deep(.v-bottom-navigation__content > .v-btn){
  max-width: 280px !important;
}
</style>
