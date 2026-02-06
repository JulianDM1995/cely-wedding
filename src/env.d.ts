declare namespace NodeJS {
  interface ProcessEnv {
    PAYLOAD_SECRET: string
    DATABASE_URL: string
    NEXT_PUBLIC_APP_URL: string
  }
}
