import { GoogleGenAI, Modality } from '@google/genai'

// =============================================
// 🎬 VEO3 Video Generation Client
// ใช้สำหรับสร้างวิดีโอจากรูปภาพและบทพูด
// =============================================

const apiKey = process.env.VEO3_API_KEY || process.env.GEMINI_API_KEY

if (!apiKey) {
    console.warn('⚠️ VEO3_API_KEY is not set. Video generation will not work.')
}

// =============================================
// 🎥 Video Generation with VEO3
// =============================================
export async function generateVideoWithVeo3(
    prompt: string,
    imageBase64?: string
): Promise<{ videoUrl: string; thumbnailUrl?: string } | null> {
    if (!apiKey) {
        throw new Error('VEO3 API Key is not configured')
    }

    const ai = new GoogleGenAI({ apiKey })

    try {
        // สร้าง video generation request
        const videoPrompt = `สร้างวิดีโอโปรโมทสินค้าแนวตั้ง (9:16) ความยาว 8 วินาที:
${prompt}

สไตล์: 
- การเคลื่อนไหวนุ่มนวล ดูพรีเมียม
- แสงสว่างสวยงาม
- เหมาะสำหรับ TikTok`

        // Generate video using VEO3
        let operation = await ai.models.generateVideos({
            model: 'veo-2.0-generate-001', // หรือ veo-3 เมื่อ available
            prompt: videoPrompt,
            config: {
                personGeneration: 'allow_adult',
                aspectRatio: '9:16'
            }
        })

        // Poll for completion
        while (!operation.done) {
            await new Promise((resolve) => setTimeout(resolve, 10000))
            operation = await ai.operations.getVideosOperation({
                operation: operation
            })
        }

        // Get the generated video
        if (operation.response?.generatedVideos?.[0]?.video?.uri) {
            const videoUri = operation.response.generatedVideos[0].video.uri

            return {
                videoUrl: videoUri,
                thumbnailUrl: undefined // VEO3 อาจจะ return thumbnail ด้วย
            }
        }

        return null
    } catch (error) {
        console.error('VEO3 Video Generation Error:', error)
        throw error
    }
}

// =============================================
// 🖼️ Image Generation with Imagen
// =============================================
export async function generateReviewImage(
    productName: string,
    features: string[]
): Promise<string | null> {
    if (!apiKey) {
        throw new Error('Imagen API Key is not configured')
    }

    const ai = new GoogleGenAI({ apiKey })

    try {
        const prompt = `Professional product review photo for TikTok advertisement:

Product: ${productName}
Features: ${features.join(', ')}

Style requirements:
- Clean, modern aesthetic
- Lifestyle photography style
- Bright, appealing lighting
- 9:16 vertical aspect ratio for TikTok
- Premium, trustworthy appearance
- No text overlays`

        const response = await ai.models.generateImages({
            model: 'imagen-3.0-generate-002',
            prompt,
            config: {
                numberOfImages: 1,
                aspectRatio: '9:16'
            }
        })

        if (response.generatedImages?.[0]?.image?.imageBytes) {
            // Return base64 encoded image
            const base64Image = response.generatedImages[0].image.imageBytes
            return `data:image/png;base64,${base64Image}`
        }

        return null
    } catch (error) {
        console.error('Imagen Generation Error:', error)
        throw error
    }
}
