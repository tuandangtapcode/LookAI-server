import { GoogleGenAI } from '@google/genai'
import { InternalServerErrorException } from '@nestjs/common'
import env from 'src/config/env'
import { GenderEnum } from 'src/utils/enum/user'
import { CreateOutfitAdviceDTO } from '../outfit-advice/dto/create-outfit-advice.dto'
import { OutfitAdviceEntity } from '../outfit-advice/outfit-advice.entity'
import { WardrobeEntity } from '../wardrobe/wardrobe.entity'

interface IRequestToAIDTO {
  body: CreateOutfitAdviceDTO
  packageName: string
  wardrobes?: WardrobeEntity[]
  outfitAdviceHistory?: OutfitAdviceEntity[]
}

const formatUserInfor = (body: CreateOutfitAdviceDTO) => {
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

const formatWrardrobe = (wardrobes: WardrobeEntity[]) => {
  if (!wardrobes || !wardrobes.length) return 'Không có món đồ nào trong tủ đồ.'
  const formattedWrardrobe = wardrobes
    .map(
      (item, index) =>
        `- ${index + 1}. Tên: ${item.name}, Loại: ${item?.itemType?.name || 'không xác định'}, Màu sắc: ${item.color}, Size: ${item.size || 'không xác định'}, Ảnh: ${item.image}`
    )
    .join('\n')
  return formattedWrardrobe
}

const formatOutfitAdviceHistory = (outfitAdviceHistory: OutfitAdviceEntity[]) => {
  if (!outfitAdviceHistory || !outfitAdviceHistory.length) return 'Không có lịch sử tư vấn nào.'
  const formattedOutfitAdviceHistory = outfitAdviceHistory
    .map((item, index) => `- ${index + 1}: Yêu cầu: ${item.requestPayload}, Phản hồi: ${item.responsePayload}`)
    .join('\n')
  return formattedOutfitAdviceHistory
}

export const requestToAI = async ({ body, packageName, wardrobes, outfitAdviceHistory }: IRequestToAIDTO) => {
  try {
    let prompt = ''
    const requestPayload = formatUserInfor(body)
    switch (packageName) {
      case 'Free': {
        prompt = `VAI TRÒ:
          Bạn là Trợ lý Stylist cơ bản. Nhiệm vụ của bạn không chỉ gợi ý outfit cho một dịp, mà còn đưa ra định hướng phong cách đơn giản giúp người dùng cải thiện gu ăn mặc theo thời gian.

          DỮ LIỆU ĐẦU VÀO:
          Thông tin người dùng:
          ${requestPayload}

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
      case 'Basic': {
        const wardrobesPayload = formatWrardrobe(wardrobes || [])
        const historyPayload = formatOutfitAdviceHistory(outfitAdviceHistory || [])
        prompt = `VAI TRÒ:
          Bạn là Stylist hỗ trợ hằng ngày. Nhiệm vụ của bạn là giúp người dùng mặc đẹp hơn mỗi ngày một cách đơn giản, gọn gàng và phù hợp với hoàn cảnh.

          DỮ LIỆU ĐẦU VÀO:
          Thông tin người dùng:
          ${requestPayload}

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
      case 'Premium': {
        const wardrobesPayload = formatWrardrobe(wardrobes || [])
        const historyPayload = formatOutfitAdviceHistory(outfitAdviceHistory || [])
        prompt = `VAI TRÒ:
          Bạn là Personal Fashion Director riêng của khách hàng.
          Bạn không chỉ tư vấn từng bộ đồ, mà còn đang giúp họ xây dựng hình ảnh cá nhân bền vững và có chiến lược.

          DỮ LIỆU ĐẦU VÀO:
          Thông tin người dùng:
          ${requestPayload}

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
      }
    }
    prompt = `${prompt}\nTrong câu trả lời hãy bỏ hết dấu * và xuống dòng không cần thiết. Trình bày cho dễ đọc và đẹp hơn.`
    const ai = new GoogleGenAI({ apiKey: env.GEMINI_API_KEY })
    const result = await ai.models.generateContent({
      model: 'gemini-2.5-pro',
      contents: [
        {
          role: 'user',
          parts: [
            {
              text: prompt
            }
          ]
        }
      ]
    })
    return {
      answer: result.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || '',
      requestPayload: JSON.stringify(body),
      inputToken: result?.usageMetadata?.promptTokenCount || 0,
      outputToken: result?.usageMetadata?.candidatesTokenCount || 0
    }
  } catch (error: any) {
    throw new InternalServerErrorException(error.message)
  }
}
