// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: true,
  extends: [],
  experimental: {
    appManifest: false
  },
  modules: [
    '@nuxt/eslint',
    '@nuxt/fonts',
    '@nuxt/ui',
    '@vueuse/nuxt',
    '@pinia/nuxt',
    'nuxt-auth-toolkit'
  ],
  ui: {
    icons: ['heroicons', 'simple-icons'],
    safelistColors: ['primary', 'red', 'orange', 'green']
  } as any,
  colorMode: {
    disableTransition: true
  },
  natlk: {
    baseURL: '/',
    endpoints: {
      login: {
        url: '/token/login',
        method: 'post',
        property: null
      },
      refresh: {
        url: '/token/refresh',
        method: 'post',
        property: null
      },
      logout: {
        url: '/logout',
        method: 'get'
      },
      session: {
        url: '/session',
        method: 'get'
      }
    },
    pages: {
      unauthorized: '/401',
      login: '/login',
      home: '/',
      logout: '/logout'
    },
    accessToken: {
      path: 'access_token',
      cookie: {
        name: 'rm00.token'
      }
    },
    refreshToken: {
      path: 'refresh_token',
      cookie: {
        name: 'rm00.refresh'
      }
    },
    cookie: {
      path: '/',
      domain: 'localhost',
      secure: false,
      httpOnly: false,
      sameSite: 'lax'
    },
    middleware: {
      auth: { enable: true }
    }
  },
  runtimeConfig: {
    influx: {
      endpoint: 'http://localhost:8086',
      token: '_XONF0U3oM7aamKgI-B8jDQBbmyd1flCp-_Z5B6HpSx8ag8EQ6-vflSULCNek38klT3up84sZwYGnFrM0QsRyg=='
    },
    oauth: {
      server: {
        secret: '123456',
        requiresPKCE: false,
        requiresS256: true,
        accessTokenExpiresAt: '1d',
        refreshTokenExpiresAt: '7d',
        codeExpiresAt: '15m',
        debug: true
      },
      client: {
        clientId: '1f82a18c-b97c-4a57-a1ef-1b59b0e8c6d8',
        secret: 'asdf'
      }
    }
  },
  devtools: {
    enabled: true
  },
  typescript: {
    strict: false
  },
  future: {
    compatibilityVersion: 4
  },
  eslint: {
    config: {
      stylistic: {
        commaDangle: 'never',
        braceStyle: '1tbs'
      }
    }
  },
  compatibilityDate: '2024-07-11'
})
