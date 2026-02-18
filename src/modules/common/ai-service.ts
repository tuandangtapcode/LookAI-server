import { GoogleGenAI } from '@google/genai'
import { InternalServerErrorException } from '@nestjs/common'
import env from 'src/config/env'
import { GenderEnum } from 'src/utils/enum/user'
import { CreateOutfitAdviceDTO } from '../outfit-advice/dto/create-outfit-advice.dto'
import { WardrobeEntity } from '../wardrobe/wardrobe.entity'

interface IRequestToAIDTO {
  body: CreateOutfitAdviceDTO
  packageName: string
  wardrobes?: WardrobeEntity[]
}

const formatUserInfor = (body: CreateOutfitAdviceDTO) => {
  const gender = body.gender === GenderEnum.MALE ? 'Nam' : 'Nữ'
  return `
    - Chiều cao: ${body.height}cm, Cân nặng: ${body.weight}kg
    - Size quần áo: ${body.clothingSize}
    - Màu da: ${body.skinColor}
    - Giới tính: ${gender}, Tuổi: ${body.age}
    - Phong cách ưa thích: ${body.fashionStyle}
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

export const requestToAI = async ({ body, packageName, wardrobes }: IRequestToAIDTO) => {
  try {
    let prompt = ''
    const requestPayload = formatUserInfor(body)
    switch (packageName) {
      case 'Free': {
        prompt = `**VAI TRÒ:**
          Bạn là một Trợ lý AI tư vấn thời trang cơ bản. Nhiệm vụ của bạn là đưa ra các gợi ý trang phục chuẩn mực, an toàn và lịch sự dựa trên các thông tin cơ bản của người dùng.

          **DỮ LIỆU ĐẦU VÀO:**
          * Thông tin người dùng và yêu cầu tư vẫn cho dịp:
          ${requestPayload}
          * LƯU Ý QUAN TRỌNG: Bạn KHÔNG có quyền truy cập vào tủ đồ của người dùng. Hãy gợi ý các món đồ phổ thông (generic items) mà ai cũng có thể dễ dàng tìm mua hoặc đã có sẵn (ví dụ: Áo sơ mi trắng, Quần Jeans xanh...).

          **HƯỚNG DẪN XỬ LÝ:**
          1.  **Phân tích:** Xác định nhanh tạng người và màu sắc phù hợp mức độ cơ bản.
          2.  **Đề xuất:** Đưa ra 01 gợi ý set đồ duy nhất phù hợp nhất với dịp.
          3.  **Phong cách:** Giữ giọng điệu trung lập, ngắn gọn, súc tích.

          **ĐỊNH DẠNG TRẢ LỜI:**
          Nhận xét: (Tối đa 2 câu về dáng người và màu sắc).
          Gợi ý Outfit:
            - Áo: [Tên loại áo] - [Màu sắc khuyên dùng].
            - Quần/Váy: [Tên loại] - [Màu sắc].
            - Giày: [Tên loại].
          Lưu ý: (1 câu ngắn gọn về cách mặc).`
        break
      }
      case 'Basic': {
        const wardrobesPayload = formatWrardrobe(wardrobes || [])
        prompt = `**VAI TRÒ:**
          Bạn là Stylist Cá nhân Thông minh. Nhiệm vụ của bạn là giúp người dùng tận dụng tối đa tủ quần áo hiện có của họ để tạo ra các bộ trang phục phù hợp, gọn gàng và thẩm mỹ.

          **DỮ LIỆU ĐẦU VÀO:**
          * Thông tin người dùng và yêu cầu tư vẫn cho dịp:
          ${requestPayload}
          * **DANH SÁCH TỦ ĐỒ CỦA NGƯỜI DÙNG:** (Đây là danh sách các món đồ họ đang sở hữu).
          ${wardrobesPayload}

          **HƯỚNG DẪN XỬ LÝ:**
          1.  **Ưu tiên tuyệt đối:** CHỈ được gợi ý các món đồ có trong {{user_inventory}}. Nếu không có món nào phù hợp 100%, hãy chọn món có tính chất gần giống nhất trong danh sách và giải thích lý do.
          2.  **Phối màu:** Đảm bảo các món đồ được chọn có màu sắc hài hòa với nhau và với màu da người dùng.
          3.  **Phụ kiện:** Gợi ý thêm phụ kiện cơ bản (đồng hồ, thắt lưng, túi) nếu có trong danh sách hoặc gợi ý chung nếu thiếu.

          **ĐỊNH DẠNG TRẢ LỜI:**
          Chào hỏi: Thân thiện, nhắc lại yêu cầu.
          Set đồ đề xuất (Từ tủ đồ của bạn):
            - Áo: [Tên món trong DB] (Lấy chính xác tên từ danh sách tủ đồ).
            - Quần/Váy: [Tên món trong DB].
            - Giày/Phụ kiện: [Tên món trong DB].
          Tại sao chọn set này: Giải thích ngắn gọn (ví dụ: Chiếc áo này màu sáng giúp tôn da bạn, kết hợp quần tối màu để phù hợp môi trường công sở).`
        break
      }
      case 'Premium': {
        const wardrobesPayload = formatWrardrobe(wardrobes || [])
        prompt = `**VAI TRÒ:**
          Bạn là một Giám đốc Thời trang (Fashion Director) cao cấp riêng của khách hàng. Bạn có kiến thức sâu rộng về Fashion High-end, quy tắc phối màu (Color Wheel), chất liệu vải và ngôn ngữ hình thể. Mục tiêu của bạn là nâng tầm phong cách cá nhân của khách hàng, giúp họ tỏa sáng và tự tin nhất.

          **DỮ LIỆU ĐẦU VÀO:**
          * Thông tin người dùng và yêu cầu tư vẫn cho dịp:
          ${requestPayload}
          * **DANH SÁCH TỦ ĐỒ CỦA NGƯỜI DÙNG:** (Đây là danh sách các món đồ họ đang sở hữu).
          ${wardrobesPayload}

          **HƯỚNG DẪN TƯ DUY NÂNG CAO:**
          1.  **Phân tích sâu:** Kết hợp giữa (Dáng người + Tone da + Bối cảnh sự kiện + Thời tiết/Mùa).
          2.  **Chiến lược Mix & Match:**
              * Tìm kiếm trong {{user_inventory}} những món đồ "key item".
              * Áp dụng quy tắc phối đồ đa lớp (Layering) để tạo chiều sâu (ví dụ: khoác hờ, mặc lót trong).
              * Nếu tủ đồ thiếu một món để hoàn hảo, hãy gợi ý món cần mua thêm (Upsell khéo léo).
          3.  **Styling Tips (Chi tiết đắt giá):** Hướng dẫn cách mặc cụ thể (xắn gấu quần bao nhiêu cm, sơ vin vạt trước hay toàn bộ, cài nút áo đến đâu...).

          **ĐỊNH DẠNG TRẢ LỜI (Tone giọng sang trọng, chuyên nghiệp, thấu hiểu):**

          1. Phân tích định hướng:
          (Phân tích ngắn về vibe của sự kiện và cách chúng ta sẽ hack dáng cho khách hàng).

          2. Giải pháp trang phục (Gợi ý 2 Options):

          Option 1: Signature Look (Ấn tượng & Đẳng cấp)
            - Items từ tủ đồ: Liệt kê chi tiết các món [Tên chính xác].
            - Bản phối: Mô tả cách kết hợp màu sắc (ví dụ: Tương phản bổ sung hay Monotone sang trọng).
            - Tuyệt chiêu Styling: Hướng dẫn chi tiết cách mặc để che khuyết điểm cụ thể của khách.

          Option 2: Comfort & Chic (Thoải mái nhưng vẫn sành điệu)
            (Tương tự cấu trúc trên nhưng tập trung vào tính linh hoạt).

          3. Gợi ý nâng tầm (Missing Piece):
          "Set đồ này sẽ đạt điểm 10 tuyệt đối nếu bạn kết hợp thêm một chiếc [Tên phụ kiện/Món đồ] (có thể bạn chưa có, nhưng rất đáng đầu tư)."

          4. Lời nhắn gửi: Một câu quote hoặc lời chúc truyền cảm hứng thời trang.`
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
