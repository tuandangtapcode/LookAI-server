import { Injectable } from '@nestjs/common'
import cloudinary from 'src/config/cloudinary'
import env from 'src/config/env'
import HTTP_RESPONSE from 'src/utils/const/http-response'
import { response } from 'src/utils/helper/common'
import * as streamifier from 'streamifier'

@Injectable()
export class FileService {
  async uploadSingleFile(file: Express.Multer.File) {
    return await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream({ folder: env.CLOUDINARY_FOLDER }, (error, result) => {
        // eslint-disable-next-line @typescript-eslint/prefer-promise-reject-errors
        if (error) return reject(error)

        resolve(response(result?.secure_url, false, HTTP_RESPONSE.FILE.UPLOAD_FILE_SUCCESS))
      })

      streamifier.createReadStream(file.buffer).pipe(uploadStream)
    })
  }

  async uploadMultipleFile(files: Express.Multer.File[]) {
    const uploadPromises = files.map(
      (file) =>
        new Promise((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream({ folder: env.CLOUDINARY_FOLDER }, (error, result) => {
            // eslint-disable-next-line @typescript-eslint/prefer-promise-reject-errors
            if (error) return reject(error)

            resolve({
              url: result?.secure_url,

              id: result?.public_id
            })
          })

          streamifier.createReadStream(file.buffer).pipe(uploadStream)
        })
    )

    const urls = await Promise.all(uploadPromises)

    return response(urls, false, HTTP_RESPONSE.FILE.UPLOAD_FILE_SUCCESS)
  }
}
