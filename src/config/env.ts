import dotenv from 'dotenv'
dotenv.config()

const env = {
  PORT: Number(process.env.PORT),
  MAIL_TRANSPORT_HOST: String(process.env.MAIL_TRANSPORT_HOST),
  MAIL_AUTH_USERNAME: String(process.env.MAIL_AUTH_USERNAME),
  MAIL_AUTH_PASSWORD: String(process.env.MAIL_AUTH_PASSWORD),
  HASH_KEY: String(process.env.HASH_KEY),
  DB_HOST: String(process.env.DB_HOST),
  DB_PORT: Number(process.env.DB_PORT),
  DB_NAME: String(process.env.DB_NAME),
  DB_USER_NAME: String(process.env.DB_USER_NAME),
  DB_PASSWORD: String(process.env.DB_PASSWORD),
  CLIENT_URL: String(process.env.CLIENT_URL),
  CLOUDINARY_NAME: String(process.env.CLOUDINARY_NAME),
  CLOUDINARY_KEY: String(process.env.CLOUDINARY_KEY),
  CLOUDINARY_SECRET: String(process.env.CLOUDINARY_SECRET),
  CLOUDINARY_FOLDER: String(process.env.CLOUDINARY_FOLDER),
  PAYOS_ROOT_API: String(process.env.PAYOS_ROOT_API),
  PAYOS_CLIENT_ID: String(process.env.PAYOS_CLIENT_ID),
  PAYOS_API_KEY: String(process.env.PAYOS_API_KEY),
  PAYOS_CHECKSUM_KEY: String(process.env.PAYOS_CHECKSUM_KEY),
  GEMINI_API_KEY: String(process.env.GEMINI_API_KEY),
  X_PLATFORM_WEB: String(process.env.X_PLATFORM_WEB),
  X_PLATFORM_MOBILE: String(process.env.X_PLATFORM_MOBILE)
}

export default env
