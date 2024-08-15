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
        property: 'data'
      },
      logout: {
        url: '/logout',
        method: 'get'
      },
      refresh: {
        url: '/token/refresh',
        method: 'post',
        property: 'data'
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
      cookie: {
        name: 'rm00.token'
      }
    },
    refreshToken: {
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
        codeExpiresAt: '15m'
      },
      client: {
        clientId: 'd455a897-1758-42a9-8b5e-d25f6e1cb113',
        secret: 'd455a897-1758-42a9-8b5e-d25f6e1cb113'
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
