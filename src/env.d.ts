declare namespace NodeJS {
  interface ProcessEnv {
    PAYLOAD_SECRET: string
    DATABASE_URL: string
    NEXT_PUBLIC_APP_URL: string
    RESEND_API_KEY: string
    RESEND_FROM_EMAIL: string
    // S3 Storage
    S3_BUCKET: string
    S3_ACCESS_KEY_ID: string
    S3_SECRET_ACCESS_KEY: string
    S3_REGION: string
    S3_ENDPOINT: string
  }
}
