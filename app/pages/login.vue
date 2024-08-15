<template>
  <div>
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
        <UButton type="submit">
          submit
        </UButton>
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
    username: 'admin',
    password: 123456,
    grant_type: 'password'
  }
})
</script>
