<template>
  <div>
    {{ data }}
    <UButton @click="execute()">
      test
    </UButton>
    <div class="login-container">
      <form @submit.prevent="login(credentials)">
        <div class="form-group">
          <label for="email">电子邮件</label>
          <UInput
            v-model="credentials.username"
            required
          />
        </div>
        <div class="form-group">
          <label for="password">密码</label>
          <UInput
            v-model="credentials.password"
            required
          />
        </div>
        <button type="submit">
          登录
        </button>
        <br>
        {{ errorMsg }}
        {{ error }}
        {{ isAccessTokenExpired }}
        <div v-html="error?.stack" />
      </form>
    </div>
  </div>
</template>

<script lang="ts" setup>
definePageMeta({
  layout: 'blank',
  auth: 'guest'
})
const { isAccessTokenExpired } = useAccessToken()

const { credentials, pending, errorMsg, error, login, resetError } = useLogin({
  redirect: '/dashboard',
  credentials: {
    grant_type: 'password',
    client_id: 'CLIENT_RM_00',
    client_secret: '2047a0d2-61af-512f-8909-f32b10077a93',
    scopes: 'a b'
  }
})

const { data, execute } = useLazyFetch('/demo', {
  method: 'get',
  immediate: false,
  auth: false
})
</script>
