import env from 'src/config/env'
import { PackageNameEnum } from '../package/package.enum'

export const GEMINI_CLIENT = Symbol('GEMINI_CLIENT')

export const MAX_WARDROBE_ITEMS = 40
export const MAX_HISTORY_ITEMS = 3
export const MAX_HISTORY_ANSWER_LENGTH = 300
export const MAX_RETRY_ATTEMPTS = 2
export const RETRY_DELAY_MS = 500

export const MODEL_BY_PACKAGE: Record<PackageNameEnum, string> = {
  [PackageNameEnum.FREE]: env.GEMINI_MODEL_FLASH,
  [PackageNameEnum.BASIC]: env.GEMINI_MODEL_FLASH,
  [PackageNameEnum.PREMIUM]: env.GEMINI_MODEL_PRO
}

export const MAX_OUTPUT_TOKENS_BY_PACKAGE: Record<PackageNameEnum, number> = {
  [PackageNameEnum.FREE]: 700,
  [PackageNameEnum.BASIC]: 1200,
  [PackageNameEnum.PREMIUM]: 4096
}

export const THINKING_BUDGET_BY_PACKAGE: Record<PackageNameEnum, number> = {
  [PackageNameEnum.FREE]: 0,
  [PackageNameEnum.BASIC]: 0,
  [PackageNameEnum.PREMIUM]: 512
}

export const INVALID_REFINE_FEEDBACK = 'INVALID_REFINE_FEEDBACK'

export const ANALYZE_IMAGE_MODEL = env.GEMINI_MODEL_FLASH
export const ANALYZE_IMAGE_MAX_OUTPUT_TOKENS = 300
export const ANALYZE_IMAGE_DEFAULT_MIME_TYPE = 'image/jpeg'

export const RESPONSE_FORMAT_INSTRUCTION =
  '\nĐi thẳng vào nội dung, không chào hỏi. Không dùng ký tự markdown (*, #) và không xuống dòng thừa.'
