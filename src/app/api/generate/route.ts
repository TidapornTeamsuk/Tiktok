import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { scrapeTikTokProduct } from '@/lib/scraper'
import { generateScript, generateSEOContent } from '@/lib/gemini'
import { generateReviewImage, generateVideoWithVeo3 } from '@/lib/veo3'
import { v4 as uuidv4 } from 'uuid'

// =============================================
// 🎬 Video Generation Pipeline API
// POST /api/generate
// =============================================

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { productUrl, tone = 'professional', language = 'th' } = body

        if (!productUrl) {
            return NextResponse.json(
                { error: 'Product URL is required' },
                { status: 400 }
            )
        }

        // =============================================
        // Phase 1: Scrape Product Data
        // =============================================
        console.log('📥 Phase 1: Scraping product data...')

        const scrapedData = await scrapeTikTokProduct(productUrl)

        // Save or update product in database
        let product = await prisma.product.findUnique({
            where: { url: productUrl }
        })

        if (!product) {
            product = await prisma.product.create({
                data: {
                    url: productUrl,
                    name: scrapedData.name,
                    description: scrapedData.description,
                    price: scrapedData.price,
                    features: scrapedData.features,
                    sourceImages: scrapedData.images
                }
            })
        }

        // Create video record with PENDING status
        const video = await prisma.video.create({
            data: {
                productId: product.id,
                script: '',
                tone,
                language,
                status: 'SCRAPING'
            }
        })

        // =============================================
        // Phase 2: Generate Creative Assets
        // =============================================
        console.log('🎨 Phase 2: Generating creative assets...')

        await prisma.video.update({
            where: { id: video.id },
            data: { status: 'GENERATING_ASSETS' }
        })

        // Generate script (< 8 seconds)
        const script = await generateScript(
            scrapedData.name,
            scrapedData.features,
            tone
        )

        // Generate review image
        let reviewImageUrl: string | null = null
        try {
            reviewImageUrl = await generateReviewImage(
                scrapedData.name,
                scrapedData.features
            )
        } catch (error) {
            console.warn('Image generation failed, continuing without image:', error)
        }

        // Update video with script and images
        await prisma.video.update({
            where: { id: video.id },
            data: {
                script,
                reviewImages: reviewImageUrl ? [reviewImageUrl] : scrapedData.images
            }
        })

        // =============================================
        // Phase 3: Generate Video with VEO3
        // =============================================
        console.log('🎬 Phase 3: Generating video with VEO3...')

        await prisma.video.update({
            where: { id: video.id },
            data: { status: 'RENDERING' }
        })

        let videoResult: { videoUrl: string; thumbnailUrl?: string } | null = null
        try {
            const videoPrompt = `
สินค้า: ${scrapedData.name}
บทพูด: ${script}
สไตล์: วิดีโอรีวิวสินค้าสำหรับ TikTok ความยาว 8 วินาที
`
            videoResult = await generateVideoWithVeo3(videoPrompt, reviewImageUrl || undefined)
        } catch (error) {
            console.error('Video generation failed:', error)
            // Continue to generate SEO content even if video fails
        }

        // =============================================
        // Phase 4: Generate SEO Content
        // =============================================
        console.log('📝 Phase 4: Generating SEO content...')

        await prisma.video.update({
            where: { id: video.id },
            data: { status: 'GENERATING_SEO' }
        })

        const seoContent = await generateSEOContent(scrapedData.name, script)

        // =============================================
        // Phase 5: Save to Database
        // =============================================
        console.log('💾 Phase 5: Saving to database...')

        const finalVideo = await prisma.video.update({
            where: { id: video.id },
            data: {
                videoUrl: videoResult?.videoUrl || null,
                thumbnailUrl: videoResult?.thumbnailUrl || null,
                caption: seoContent.caption,
                hashtags: seoContent.hashtags,
                status: videoResult?.videoUrl ? 'COMPLETED' : 'FAILED',
                errorMessage: videoResult?.videoUrl ? null : 'Video generation failed'
            },
            include: {
                product: true
            }
        })

        console.log('✅ Pipeline completed!')

        return NextResponse.json({
            success: true,
            data: {
                video: finalVideo,
                product: product
            }
        })

    } catch (error) {
        console.error('Pipeline error:', error)
        return NextResponse.json(
            {
                error: 'Pipeline failed',
                message: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        )
    }
}

// =============================================
// GET /api/generate - List all videos
// =============================================
export async function GET() {
    try {
        const videos = await prisma.video.findMany({
            include: {
                product: true
            },
            orderBy: {
                createdAt: 'desc'
            },
            take: 50
        })

        return NextResponse.json({ videos })
    } catch (error) {
        console.error('Error fetching videos:', error)
        return NextResponse.json(
            { error: 'Failed to fetch videos' },
            { status: 500 }
        )
    }
}
