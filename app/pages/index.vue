<template>
  <div>
    <h1>index</h1>
    {{ session }}
  </div>
</template>

<script lang="ts" setup>
definePageMeta({
  layout: 'default',
  auth: 'logined'
})

const session = useSession()
</script>

<style></style>
