import { Matches } from 'class-validator'
import HTTP_RESPONSE from 'src/common/const/http-response'
import env from 'src/config/env'

const escapeRegex = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

export const CLOUDINARY_IMAGE_URL_REGEX = new RegExp(
  `^https://res\\.cloudinary\\.com/${escapeRegex(env.CLOUDINARY_NAME)}/image/upload/v\\d+/${escapeRegex(env.CLOUDINARY_FOLDER)}/[\\w-]+\\.\\w+$`
)

export const IsCloudinaryImage = () =>
  Matches(CLOUDINARY_IMAGE_URL_REGEX, { message: HTTP_RESPONSE.FILE.INVALID_IMAGE_URL })
