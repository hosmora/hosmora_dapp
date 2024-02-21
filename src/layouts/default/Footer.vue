<template>
  <div class="container bg-white">
    <div class="flex items-center justify-center py-4 text-center">
      <a
        class="mr-4 cursor-pointer center a-nostyle"
        :href="twitterLink"
        target="_blank"
        title="twitter"
      >
        <img src="@/assets/images/footer/twitter.svg" alt="twitter" style="width: 20px; height: auto" />
      </a>
      <a
        class="mr-4 cursor-pointer center a-nostyle"
        :href="telegramLink"
        target="_blank"
        title="telegram"
      >
        <img src="@/assets/images/footer/telegram.svg" alt="telegram" style="width: 23px; height: auto" />
      </a>
      <a
        class="mr-4 cursor-pointer center a-nostyle"
        :href="discordLink"
        target="_blank"
        title="discord"
      >
        <img src="@/assets/images/footer/discord.svg" alt="discord" style="width: 26px; height: auto" />
      </a>
      <a
        class="cursor-pointer center a-nostyle"
        :href="useDocHook().getDefaultDocLink()"
        target="_blank"
        title="gitbook"
      >
        <img src="@/assets/images/footer/gitbook.svg" alt="gitbook"  style="width: 26px; height: auto" />
      </a>
    </div>
  </div>
</template>

<script setup lang="ts">
import { twitterLink, discordLink, telegramLink } from '@/config/link.config';
import { useDocHook } from '@/hooks/doc.hook'

</script>

<style lang="scss" scoped></style>
