/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_ENV: string
  readonly VITE_ROUTER_MODE: string
  readonly VITE_BASE_API: string
  readonly VITE_SOCKET_API: string
  readonly VITE_DEFAULT_LANGUAGE: string
  readonly VITE_VAPID_PUBLIC_KEY: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
