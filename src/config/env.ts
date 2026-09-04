import dotenv from 'dotenv'
dotenv.config()

const env = {
  // ENVIRONMENT
  NODE_ENV: process.env.NODE_ENV ?? 'production',
  // PORT
  PORT: Number(process.env.PORT),
  // MAIL
  MAIL_TRANSPORT_HOST: String(process.env.MAIL_TRANSPORT_HOST),
  MAIL_AUTH_USERNAME: String(process.env.MAIL_AUTH_USERNAME),
  MAIL_AUTH_PASSWORD: String(process.env.MAIL_AUTH_PASSWORD),
  // TOKEN SECRETS
  PD_ACCESS_TOKEN: String(process.env.PD_ACCESS_TOKEN),
  PD_REFRESH_TOKEN: String(process.env.PD_REFRESH_TOKEN),
  PD_ACCESS_TOKEN_EXPIRES_IN: Number(process.env.PD_ACCESS_TOKEN_EXPIRES_IN),
  PD_REFRESH_TOKEN_EXPIRES_IN: Number(process.env.PD_REFRESH_TOKEN_EXPIRES_IN),
  // TOKEN KEY
  ACCESS_TOKEN: String(process.env.ACCESS_TOKEN),
  REFRESH_TOKEN: String(process.env.REFRESH_TOKEN),
  // DATABASE
  DB_HOST: String(process.env.DB_HOST),
  DB_PORT: Number(process.env.DB_PORT),
  DB_NAME: String(process.env.DB_NAME),
  DB_USER_NAME: String(process.env.DB_USER_NAME),
  DB_PASSWORD: String(process.env.DB_PASSWORD),
  // CLOUDINARY
  CLOUDINARY_NAME: String(process.env.CLOUDINARY_NAME),
  CLOUDINARY_KEY: String(process.env.CLOUDINARY_KEY),
  CLOUDINARY_SECRET: String(process.env.CLOUDINARY_SECRET),
  CLOUDINARY_FOLDER: String(process.env.CLOUDINARY_FOLDER),
  // PAYOS
  PAYOS_ROOT_API: String(process.env.PAYOS_ROOT_API),
  PAYOS_CLIENT_ID: String(process.env.PAYOS_CLIENT_ID),
  PAYOS_API_KEY: String(process.env.PAYOS_API_KEY),
  PAYOS_CHECKSUM_KEY: String(process.env.PAYOS_CHECKSUM_KEY),
  // GEMINI
  GEMINI_API_KEY: String(process.env.GEMINI_API_KEY),
  // PLATFORMS
  X_PLATFORM_WEB: String(process.env.X_PLATFORM_WEB),
  X_PLATFORM_MOBILE: String(process.env.X_PLATFORM_MOBILE),
  // ACCOUNT_ADMIN
  EMAIL: String(process.env.EMAIL),
  SUB: String(process.env.SUB),
  AVATAR: String(process.env.AVATAR),
  USER_NAME: String(process.env.USER_NAME),
  PHONE: String(process.env.PHONE),
  DATE_OF_BIRTH: String(process.env.DATE_OF_BIRTH),
  GENDER: Number(process.env.GENDER),
  ROLE: Number(process.env.ROLE)
}

export default env
