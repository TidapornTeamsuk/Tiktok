import { GoogleGenerativeAI as GoogleGenAI } from '@google/generative-ai'

// =============================================
// 🤖 Gemini AI Client
// ใช้สำหรับสร้าง Script และ SEO Content
// =============================================

const apiKey = process.env.GEMINI_API_KEY

if (!apiKey) {
    console.warn('⚠️ GEMINI_API_KEY is not set. AI features will not work.')
}

export const genAI = apiKey ? new GoogleGenAI(apiKey) : null

// Model สำหรับสร้าง Text
export const getTextModel = () => {
    if (!genAI) throw new Error('Gemini API Key is not configured')
    return genAI.getGenerativeModel({ model: 'gemini-1.5-pro' })
}

// Model สำหรับสร้างรูปภาพ (Imagen)
export const getImageModel = () => {
    if (!genAI) throw new Error('Gemini API Key is not configured')
    return genAI.getGenerativeModel({ model: 'imagen-3.0-generate-002' })
}

// =============================================
// 📝 Script Generation
// สร้างบทพูดสั้นๆ ไม่เกิน 8 วินาที
// =============================================
export async function generateScript(
    productName: string,
    features: string[],
    tone: string = 'professional'
): Promise<string> {
    const model = getTextModel()

    const toneMap: Record<string, string> = {
        funny: 'ตลก ขำขัน ใช้ภาษาวัยรุ่น',
        informative: 'ให้ข้อมูล สาระ น่าเชื่อถือ',
        honest: 'รีวิวตรงๆ จริงใจ ไม่โฆษณาเกินไป',
        professional: 'มืออาชีพ น่าเชื่อถือ หรูหรา'
    }

    const prompt = `คุณคือผู้เชี่ยวชาญด้านการตลาด TikTok ที่เก่งมาก

จงเขียนบทพูดสำหรับวิดีโอรีวิวสินค้า TikTok โดยมีข้อกำหนดดังนี้:

📦 สินค้า: ${productName}
✨ จุดเด่น: ${features.join(', ')}
🎭 โทน: ${toneMap[tone] || toneMap.professional}

📏 ข้อจำกัดสำคัญ:
- ความยาวต้องพูดได้ภายใน 8 วินาทีเท่านั้น (ประมาณ 25-30 คำภาษาไทย)
- ต้องมี Hook ที่หยุดนิ้วคนดูได้ใน 2-3 วินาทีแรก
- ต้องจบด้วย CTA สั้นๆ ให้กดซื้อ

📝 โครงสร้าง:
- Hook (2-3 วินาที): คำขึ้นต้นที่น่าสนใจ
- Benefit (3 วินาที): จุดเด่นหลักของสินค้า
- CTA (2 วินาที): กระตุ้นให้กดซื้อ

ตอบเป็นบทพูดอย่างเดียว ไม่ต้องมีคำอธิบายเพิ่มเติม ไม่ต้องใส่ timestamp`

    const result = await model.generateContent(prompt)
    const response = result.response
    return response.text().trim()
}

// =============================================
// 🏷️ SEO Content Generation
// สร้าง Caption และ Hashtags
// =============================================
export async function generateSEOContent(
    productName: string,
    script: string
): Promise<{ caption: string; hashtags: string[] }> {
    const model = getTextModel()

    const prompt = `คุณคือผู้เชี่ยวชาญด้าน SEO และการตลาด TikTok

จงสร้างข้อความบรรยายวิดีโอ (Caption) และ Hashtags สำหรับโพสต์ TikTok

📦 สินค้า: ${productName}
📝 บทพูดในวิดีโอ: ${script}

📏 ข้อกำหนด:
1. Caption: ข้อความสั้นกระชับ 1-2 ประโยค ที่กระตุ้นให้คนดูและกดซื้อ
2. Hashtags: 5 แท็กที่เกี่ยวข้อง เป็นกระแส และช่วยเพิ่ม reach

ตอบในรูปแบบ JSON:
{
  "caption": "ข้อความบรรยาย",
  "hashtags": ["แท็ก1", "แท็ก2", "แท็ก3", "แท็ก4", "แท็ก5"]
}`

    const result = await model.generateContent(prompt)
    const response = result.response
    const text = response.text().trim()

    // Parse JSON from response
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
        try {
            return JSON.parse(jsonMatch[0])
        } catch {
            // Fallback if JSON parsing fails
        }
    }

    return {
        caption: `${productName} - ต้องลอง! 🔥`,
        hashtags: ['#TikTokShop', '#รีวิว', '#ของดี', '#ต้องมี', '#แนะนำ']
    }
}
