import { CreateOutfitAdviceDTO } from '../outfit-advice/dto/create-outfit-advice.dto'
import { OutfitAdviceEntity } from '../outfit-advice/outfit-advice.entity'
import { WardrobeEntity } from '../wardrobe/wardrobe.entity'

export interface IRequestOutfitAdviceParams {
  body: CreateOutfitAdviceDTO
  packageName: string
  wardrobes?: WardrobeEntity[]
  outfitAdviceHistory?: OutfitAdviceEntity[]
}

export interface IRefineOutfitAdviceParams {
  previousAnswer: string
  feedback?: string
  originalRequest?: CreateOutfitAdviceDTO
  packageName: string
  wardrobes?: WardrobeEntity[]
}

export interface IBuildRefinePrompt {
  previousAnswer: string
  feedback?: string
  userInfo: string
  wardrobe?: string
}

export interface IGenerateVisionWithRetry {
  model: string
  prompt: string
  base64Image: string
  mimeType: string
}
