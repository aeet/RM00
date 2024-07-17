<template>
  <div>
    {{ isAccessTokenExpired }}
    {{ isRefreshTokenExpired }}
  </div>
</template>

<script lang="ts" setup>
definePageMeta({
  auth: 'logined'
})

const { isAccessTokenExpired } = useAccessToken()
const { isRefreshTokenExpired } = useRefreshToken()
</script>

<style>

</style>
