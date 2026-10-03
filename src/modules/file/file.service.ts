import { Injectable } from '@nestjs/common'
import HTTP_RESPONSE from 'src/common/const/http-response'
import { response } from 'src/common/helper/common'
import cloudinary from 'src/config/cloudinary'
import env from 'src/config/env'

const ALLOWED_IMAGE_FORMATS = 'jpg, png, webp'

@Injectable()
export class FileService {
  getUploadUrl() {
    const params = {
      timestamp: Math.round(Date.now() / 1000),
      folder: env.CLOUDINARY_FOLDER,
      allowed_formats: ALLOWED_IMAGE_FORMATS
    }
    const signature = cloudinary.utils.api_sign_request(params, env.CLOUDINARY_SECRET)

    return response(
      {
        ...params,
        signature,
        api_key: env.CLOUDINARY_KEY,
        uploadUrl: `https://api.cloudinary.com/v1_1/${env.CLOUDINARY_NAME}/image/upload`
      },
      false,
      HTTP_RESPONSE.COMMON.GET_DATA_SUCCESS
    )
  }
}
