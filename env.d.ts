/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_APP_ENV: string
    readonly VITE_ROUTER_MODE: string
    readonly VITE_BASE_API: string
    readonly VITE_SOCKET_API: string
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}