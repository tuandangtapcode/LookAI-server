import { GoogleGenAI } from '@google/genai'
import { Injectable, Logger } from '@nestjs/common'
import { OutfitAdviceRatingEnum } from 'src/common/enum/outfit-advice'
import { PackageNameEnum } from 'src/common/enum/package'
import { GenderEnum } from 'src/common/enum/user'
import env from 'src/config/env'
import { CreateOutfitAdviceDTO } from '../modules/outfit-advice/dto/create-outfit-advice.dto'
import { OutfitAdviceEntity } from '../modules/outfit-advice/outfit-advice.entity'
import { WardrobeEntity } from '../modules/wardrobe/wardrobe.entity'

interface IRequestOutfitAdviceParams {
  body: CreateOutfitAdviceDTO
  packageName: string
  wardrobes?: WardrobeEntity[]
  outfitAdviceHistory?: OutfitAdviceEntity[]
}

const MAX_WARDROBE_ITEMS = 40
const MAX_HISTORY_ITEMS = 3
const MAX_HISTORY_ANSWER_LENGTH = 200
const MAX_RETRY_ATTEMPTS = 2
const RETRY_DELAY_MS = 500

const MODEL_BY_PACKAGE: Record<PackageNameEnum, string> = {
  [PackageNameEnum.FREE]: env.GEMINI_MODEL_FLASH,
  [PackageNameEnum.BASIC]: env.GEMINI_MODEL_FLASH,
  [PackageNameEnum.PREMIUM]: env.GEMINI_MODEL_PRO
}

const MAX_OUTPUT_TOKENS_BY_PACKAGE: Record<PackageNameEnum, number> = {
  [PackageNameEnum.FREE]: 700,
  [PackageNameEnum.BASIC]: 1200,
  [PackageNameEnum.PREMIUM]: 4096
}

const THINKING_BUDGET_BY_PACKAGE: Record<PackageNameEnum, number> = {
  [PackageNameEnum.FREE]: 0,
  [PackageNameEnum.BASIC]: 0,
  [PackageNameEnum.PREMIUM]: 512
}

const REFINEMENT_MODEL = env.GEMINI_MODEL_FLASH
const REFINEMENT_MAX_OUTPUT_TOKENS = 700
const REFINEMENT_THINKING_BUDGET = 0
const MAX_REFINE_CONTEXT_LENGTH = 1500

const RESPONSE_FORMAT_INSTRUCTION =
  '\nTrong câu trả lời hãy bỏ hết dấu * và xuống dòng không cần thiết. Trình bày cho dễ đọc và đẹp hơn.'

@Injectable()
export class AIService {
  private readonly logger = new Logger(AIService.name)
  private readonly client = new GoogleGenAI({ apiKey: env.GEMINI_API_KEY })

  async requestOutfitAdvice({ body, packageName, wardrobes, outfitAdviceHistory }: IRequestOutfitAdviceParams) {
    const tier = this.resolvePackageTier(packageName)
    const prompt = this.buildPrompt(tier, body, wardrobes, outfitAdviceHistory)
    const model = MODEL_BY_PACKAGE[tier]
    const maxOutputTokens = MAX_OUTPUT_TOKENS_BY_PACKAGE[tier]
    const thinkingBudget = THINKING_BUDGET_BY_PACKAGE[tier]

    const result = await this.generateWithRetry(model, prompt, maxOutputTokens, thinkingBudget)
    const candidate = result.candidates?.[0]
    const answer = candidate?.content?.parts?.[0]?.text?.trim()

    if (!answer) {
      this.logger.error(`Gemini trả về rỗng. finishReason=${candidate?.finishReason}`)
      throw new Error('AI không thể tạo tư vấn cho yêu cầu này, vui lòng thử lại.')
    }

    return {
      answer,
      requestPayload: JSON.stringify(body),
      inputToken: result.usageMetadata?.promptTokenCount || 0,
      outputToken: result.usageMetadata?.candidatesTokenCount || 0
    }
  }

  async refineOutfitAdvice(previousAnswer: string, feedback: string | undefined, rating: OutfitAdviceRatingEnum) {
    const prompt = this.buildRefinePrompt(previousAnswer, feedback, rating)

    const result = await this.generateWithRetry(
      REFINEMENT_MODEL,
      prompt,
      REFINEMENT_MAX_OUTPUT_TOKENS,
      REFINEMENT_THINKING_BUDGET
    )
    const candidate = result.candidates?.[0]
    const answer = candidate?.content?.parts?.[0]?.text?.trim()

    if (!answer) {
      this.logger.error(`Gemini trả về rỗng khi tinh chỉnh. finishReason=${candidate?.finishReason}`)
      throw new Error('AI không thể tinh chỉnh outfit lúc này, vui lòng thử lại.')
    }

    return {
      answer,
      inputToken: result.usageMetadata?.promptTokenCount || 0,
      outputToken: result.usageMetadata?.candidatesTokenCount || 0
    }
  }

  private buildRefinePrompt(previousAnswer: string, feedback: string | undefined, rating: OutfitAdviceRatingEnum) {
    const truncatedPreviousAnswer =
      previousAnswer.length > MAX_REFINE_CONTEXT_LENGTH
        ? `${previousAnswer.slice(0, MAX_REFINE_CONTEXT_LENGTH)}...`
        : previousAnswer

    const isDissatisfied = rating < OutfitAdviceRatingEnum.AVERAGE
    const trimmedFeedback = feedback?.trim()

    const feedbackText =
      trimmedFeedback || (isDissatisfied ? 'Khách hàng không hài lòng nhưng không nêu rõ lý do cụ thể.' : '')
    const instruction = !isDissatisfied
      ? `- Khách hàng đang HÀI LÒNG với outfit này (đánh giá ${rating}/5), phản hồi bên dưới là yêu cầu BỔ SUNG THÊM, không phải sửa lỗi.
    - Giữ nguyên các mục mô tả outfit gốc (áo, quần/váy, giày...), chỉ thêm phần khách hàng yêu cầu (ví dụ thêm lựa chọn khác, thêm phụ kiện, thêm mẹo phối đồ...).
    - Không thay thế hay bỏ bớt phần outfit gốc trừ khi phản hồi yêu cầu rõ ràng.
    - QUAN TRỌNG: với mục giải thích/lý do phù hợp (nếu outfit trước đó có), KHÔNG chép nguyên văn lại — phần này phải mô tả đúng lựa chọn/nội dung MỚI vừa thêm. Nếu phần bổ sung không cần giải thích thêm thì bỏ hẳn mục đó, không để lại giải thích cũ không còn khớp.`
      : trimmedFeedback
        ? `- Khách hàng CHƯA HÀI LÒNG với outfit này (đánh giá ${rating}/5).
    - Chỉ thay đổi phần khách hàng không hài lòng theo phản hồi bên dưới, giữ nguyên phần còn lại nếu vẫn hợp lý.`
        : `- Khách hàng CHƯA HÀI LÒNG với outfit này (đánh giá ${rating}/5) nhưng không nêu rõ lý do.
    - Hãy đề xuất một outfit THAY THẾ khác biệt so với outfit trước đó (đổi phối màu/kiểu dáng), vẫn dựa trên thông tin ban đầu của khách hàng.`

    return `VAI TRÒ:
    Bạn là Stylist đang tinh chỉnh lại outfit vừa gợi ý cho khách hàng dựa trên phản hồi của họ, KHÔNG phân tích lại từ đầu.

    OUTFIT ĐÃ GỢI Ý TRƯỚC ĐÓ:
    ${truncatedPreviousAnswer}

    ĐÁNH GIÁ CỦA KHÁCH HÀNG: ${rating}/5
    PHẢN HỒI CỦA KHÁCH HÀNG:
    ${feedbackText}

    YÊU CẦU:
    ${instruction}
    - Giữ nguyên phong cách trình bày (heading, gạch đầu dòng) như outfit trước đó, nhưng nội dung từng mục phải phản ánh đúng thực tế câu trả lời mới, không sao chép nguyên văn nội dung đã lỗi thời.
    - Ngắn gọn, không lặp lại các phần phân tích không thay đổi.${RESPONSE_FORMAT_INSTRUCTION}`
  }

  private resolvePackageTier(packageName: string) {
    const tier = Object.values(PackageNameEnum).find((value: string) => value === packageName)
    if (tier) return tier

    this.logger.warn(`Không nhận diện được gói "${packageName}", dùng tạm luồng Free.`)
    return PackageNameEnum.FREE
  }

  private async generateWithRetry(model: string, prompt: string, maxOutputTokens: number, thinkingBudget: number) {
    let lastError: unknown

    for (let attempt = 1; attempt <= MAX_RETRY_ATTEMPTS; attempt++) {
      try {
        return await this.client.models.generateContent({
          model,
          contents: [{ role: 'user', parts: [{ text: prompt }] }],
          config: {
            maxOutputTokens,
            temperature: 0.7,
            thinkingConfig: {
              thinkingBudget
            }
          }
        })
      } catch (error) {
        lastError = error
        this.logger.warn(`Gọi Gemini thất bại (lần ${attempt}/${MAX_RETRY_ATTEMPTS}): ${error}`)
        if (attempt < MAX_RETRY_ATTEMPTS) {
          await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY_MS * attempt))
        }
      }
    }

    throw lastError
  }

  private buildPrompt(
    tier: PackageNameEnum,
    body: CreateOutfitAdviceDTO,
    wardrobes?: WardrobeEntity[],
    outfitAdviceHistory?: OutfitAdviceEntity[]
  ) {
    const userInfo = this.formatUserInfo(body)
    let prompt = ''

    switch (tier) {
      case PackageNameEnum.FREE: {
        prompt = `VAI TRÒ:
          Bạn là Trợ lý Stylist cơ bản. Nhiệm vụ của bạn không chỉ gợi ý outfit cho một dịp, mà còn đưa ra định hướng phong cách đơn giản giúp người dùng cải thiện gu ăn mặc theo thời gian.

          DỮ LIỆU ĐẦU VÀO:
          Thông tin người dùng:
          ${userInfo}

          LƯU Ý:
          - Bạn KHÔNG có quyền truy cập vào tủ đồ.
          - Chỉ gợi ý các item phổ thông dễ tìm mua.

          HƯỚNG DẪN XỬ LÝ:
          1. Phân tích nhanh dáng người và màu sắc phù hợp.
          2. Định hướng phong cách tổng thể phù hợp với người này.
          3. Đề xuất 01 outfit phù hợp cho dịp.
          4. Đưa 01 lời khuyên nhỏ giúp họ cải thiện gu lâu dài.

          ĐỊNH DẠNG TRẢ LỜI:

          Phân tích nhanh:
          (1–2 câu)

          Định hướng phong cách:
          (1–2 câu về style nên theo đuổi)

          Outfit đề xuất:
          - Áo:
          - Quần/Váy:
          - Giày:

          Mẹo cải thiện phong cách:
          (1 câu ngắn)`
        break
      }
      case PackageNameEnum.BASIC: {
        const wardrobesPayload = this.formatWardrobe(wardrobes)
        const historyPayload = this.formatOutfitAdviceHistory(outfitAdviceHistory)

        prompt = `VAI TRÒ:
          Bạn là Stylist hỗ trợ hằng ngày. Nhiệm vụ của bạn là giúp người dùng mặc đẹp hơn mỗi ngày một cách đơn giản, gọn gàng và phù hợp với hoàn cảnh.

          DỮ LIỆU ĐẦU VÀO:
          Thông tin người dùng:
          ${userInfo}

          PHONG CÁCH HIỆN TẠI: ${body.currentStyle}
          PHONG CÁCH MONG MUỐN: ${body.desiredStyle}

          TỦ ĐỒ HIỆN CÓ:
          ${wardrobesPayload}

          LỊCH SỬ TƯ VẤN GẦN ĐÂY:
          ${historyPayload}

          LƯU Ý:
          - Ưu tiên sử dụng các item có trong tủ đồ.
          - Nếu không có món phù hợp hoàn toàn, chọn món gần nhất và giải thích ngắn gọn.
          - Không lặp lại outfit giống các lần gần đây.
          - Không phân tích chiến lược dài hạn.
          - Không xây dựng kế hoạch nhiều ngày.
          - Giữ mọi thứ đơn giản và dễ áp dụng.

          YÊU CẦU THỰC HIỆN:
          1. Phân tích nhanh dựa trên cơ thể (chiều cao, cân nặng, màu da).
          2. Đề xuất 01 outfit duy nhất phù hợp với dịp.
          3. Phối màu theo hướng an toàn, dễ mặc.
          4. Gợi ý phụ kiện cơ bản nếu có trong tủ đồ.
          5. Giải thích ngắn gọn vì sao set này hợp với người dùng.

          ĐỊNH DẠNG TRẢ LỜI:

          Nhận định nhanh:
          (1–2 câu về dáng người & tổng thể)

          Outfit đề xuất (từ tủ đồ của bạn):
          - Áo:
          - Quần/Váy:
          - Giày:
          - Phụ kiện (nếu có):

          Vì sao set này phù hợp:
          (2–3 câu rõ ràng, thực tế)

          Mẹo mặc đẹp hôm nay:
          (1 câu ngắn, dễ áp dụng ngay)`
        break
      }
      case PackageNameEnum.PREMIUM: {
        const wardrobesPayload = this.formatWardrobe(wardrobes)
        const historyPayload = this.formatOutfitAdviceHistory(outfitAdviceHistory)

        prompt = `VAI TRÒ:
          Bạn là Personal Fashion Director riêng của khách hàng.
          Bạn không chỉ tư vấn từng bộ đồ, mà còn đang giúp họ xây dựng hình ảnh cá nhân bền vững và có chiến lược.

          DỮ LIỆU ĐẦU VÀO:
          Thông tin người dùng:
          ${userInfo}

          PHONG CÁCH HIỆN TẠI: ${body.currentStyle}
          PHONG CÁCH MONG MUỐN: ${body.desiredStyle}

          TỦ ĐỒ HIỆN CÓ:
          ${wardrobesPayload}

          LỊCH SỬ TƯ VẤN GẦN ĐÂY:
          ${historyPayload}

          CHIẾN LƯỢC XỬ LÝ:
          - Phân tích môi trường sống, nghề nghiệp và thói quen.
          - Xác định khoảng cách giữa phong cách hiện tại và phong cách mong muốn.
          - Phát triển phong cách theo hướng tiến dần, không thay đổi đột ngột trừ khi được yêu cầu.
          - Không lặp lại outfit tương tự các lần trước.
          - Ưu tiên tận dụng tủ đồ hiện có.
          - Chỉ gợi ý mua thêm nếu thực sự cần thiết để nâng cấp hình ảnh.

          YÊU CẦU THỰC HIỆN:

          1. Phân tích hình ảnh hiện tại:
          - Dáng người
          - Màu sắc phù hợp
          - Độ đồng bộ phong cách
          - Nhận xét tủ đồ đang nghiêng về hướng nào

          2. Định hướng chiến lược:
          (giải thích ngắn cách phát triển phong cách trong thời gian tới)

          3. Gợi ý outfit theo nhu cầu:
          - Nếu là tư vấn 1 dịp: đưa ra 2 lựa chọn khác nhau.
          - Nếu là yêu cầu cho nhiều ngày / chuyến đi / sự kiện: xây dựng kế hoạch outfit phù hợp theo từng ngày hoặc từng bối cảnh.

          Mỗi outfit phải bao gồm:
          - Items cụ thể (ưu tiên từ tủ đồ)
          - Cách phối chi tiết
          - Styling nâng cao (layering, sơ vin, độ dài quần, phụ kiện…)

          4. Gợi ý nâng cấp chiến lược:
          (1–2 item đáng đầu tư để nâng tầm phong cách dài hạn)

          5. Theo dõi phong cách:
          - Bạn đang tiến gần phong cách ${body.desiredStyle}.
          - Bước tiếp theo nên thử: ...

          6. Lời nhắn từ stylist:
          (1 câu truyền cảm hứng xây dựng hình ảnh cá nhân)`
        break
      }
    }

    return `${prompt}${RESPONSE_FORMAT_INSTRUCTION}`
  }

  private formatUserInfo(body: CreateOutfitAdviceDTO) {
    const gender = body.gender === GenderEnum.MALE ? 'Nam' : 'Nữ'

    return `
    - Chiều cao: ${body.height}cm, Cân nặng: ${body.weight}kg
    - Size quần áo: ${body.clothingSize}
    - Màu da: ${body.skinColor}
    - Giới tính: ${gender}, Tuổi: ${body.age}
    - Phong cách hiện tại: ${body.currentStyle}
    - Phong cách mong muốn: ${body.desiredStyle}
    - Nghề nghiệp: ${body.occupation}
    - Địa điểm: ${body.place}
    - Dịp: ${body.occasion}
    `.trim()
  }

  private formatWardrobe(wardrobes?: WardrobeEntity[]) {
    if (!wardrobes || !wardrobes.length) return 'Không có món đồ nào trong tủ đồ.'

    const prioritized = [...wardrobes]
      .sort((a, b) => Number(b.isFavourite) - Number(a.isFavourite))
      .slice(0, MAX_WARDROBE_ITEMS)

    return prioritized
      .map(
        (item, index) =>
          `- ${index + 1}. Tên: ${item.name}, Loại: ${item?.itemType?.name || 'không xác định'}, Màu sắc: ${item.color}, Size: ${item.size || 'không xác định'}`
      )
      .join('\n')
  }

  private formatOutfitAdviceHistory(outfitAdviceHistory?: OutfitAdviceEntity[]) {
    if (!outfitAdviceHistory || !outfitAdviceHistory.length) return 'Không có lịch sử tư vấn nào.'

    return outfitAdviceHistory
      .slice(0, MAX_HISTORY_ITEMS)
      .map((item, index) => {
        const answer = String(item.responsePayload || '')
        const truncatedAnswer =
          answer.length > MAX_HISTORY_ANSWER_LENGTH ? `${answer.slice(0, MAX_HISTORY_ANSWER_LENGTH)}...` : answer

        return `- ${index + 1}: ${truncatedAnswer}`
      })
      .join('\n')
  }
}
