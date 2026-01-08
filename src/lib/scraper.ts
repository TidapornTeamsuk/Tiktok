import * as cheerio from 'cheerio'

// =============================================
// 🔍 TikTok Product Scraper
// ดึงข้อมูลสินค้าจาก TikTok Shop URL
// =============================================

export interface ScrapedProduct {
    name: string
    description: string
    price: string
    features: string[]
    images: string[]
}

// =============================================
// 🛒 Scrape TikTok Shop Product
// =============================================
export async function scrapeTikTokProduct(url: string): Promise<ScrapedProduct> {
    // Validate URL
    if (!url.includes('tiktok.com')) {
        throw new Error('Invalid TikTok URL. Please provide a valid TikTok Shop link.')
    }

    try {
        // Fetch the page
        const response = await fetch(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
                'Accept-Language': 'th-TH,th;q=0.9,en-US;q=0.8,en;q=0.7',
            }
        })

        if (!response.ok) {
            throw new Error(`Failed to fetch page: ${response.status}`)
        }

        const html = await response.text()
        const $ = cheerio.load(html)

        // Extract product data from page
        // Note: TikTok's structure may change, these selectors might need updates
        const name = extractProductName($) || 'สินค้า TikTok Shop'
        const description = extractDescription($) || ''
        const price = extractPrice($) || 'ราคาไม่ระบุ'
        const images = extractImages($)
        const features = extractFeatures($, description)

        return {
            name,
            description,
            price,
            features,
            images
        }
    } catch (error) {
        console.error('Scraping error:', error)

        // Return mock data if scraping fails (for development)
        return {
            name: 'สินค้าจาก TikTok Shop',
            description: 'สินค้าคุณภาพดีจาก TikTok Shop',
            price: '฿XXX',
            features: [
                'คุณภาพดีเยี่ยม',
                'ราคาคุ้มค่า',
                'จัดส่งเร็ว'
            ],
            images: []
        }
    }
}

// =============================================
// Helper Functions
// =============================================

function extractProductName($: cheerio.CheerioAPI): string | null {
    // Try various selectors that TikTok might use
    const selectors = [
        '[data-testid="product-title"]',
        '.product-title',
        'h1[class*="Title"]',
        '[class*="ProductTitle"]',
        'h1'
    ]

    for (const selector of selectors) {
        const text = $(selector).first().text().trim()
        if (text && text.length > 0 && text.length < 200) {
            return text
        }
    }

    return null
}

function extractDescription($: cheerio.CheerioAPI): string | null {
    const selectors = [
        '[data-testid="product-description"]',
        '.product-description',
        '[class*="Description"]',
        '[class*="detail"]'
    ]

    for (const selector of selectors) {
        const text = $(selector).first().text().trim()
        if (text && text.length > 20) {
            return text.substring(0, 500)
        }
    }

    return null
}

function extractPrice($: cheerio.CheerioAPI): string | null {
    const selectors = [
        '[data-testid="product-price"]',
        '.product-price',
        '[class*="Price"]',
        '[class*="price"]'
    ]

    for (const selector of selectors) {
        const text = $(selector).first().text().trim()
        if (text && (text.includes('฿') || text.includes('THB') || /\d/.test(text))) {
            return text
        }
    }

    return null
}

function extractImages($: cheerio.CheerioAPI): string[] {
    const images: string[] = []

    // Find product images
    $('img[src*="tiktok"]').each((_, el) => {
        const src = $(el).attr('src')
        if (src && src.includes('product') || src?.includes('shop')) {
            images.push(src)
        }
    })

    // Also check for lazy-loaded images
    $('[data-src]').each((_, el) => {
        const src = $(el).attr('data-src')
        if (src && (src.includes('product') || src.includes('shop'))) {
            images.push(src)
        }
    })

    return images.slice(0, 5) // Limit to 5 images
}

function extractFeatures($: cheerio.CheerioAPI, description: string): string[] {
    const features: string[] = []

    // Try to extract bullet points or features
    $('li, [class*="feature"], [class*="spec"]').each((_, el) => {
        const text = $(el).text().trim()
        if (text && text.length > 5 && text.length < 100) {
            features.push(text)
        }
    })

    // If no features found, extract from description
    if (features.length === 0 && description) {
        const sentences = description.split(/[.。\n]/).filter(s => s.trim().length > 10)
        features.push(...sentences.slice(0, 3))
    }

    // Default features if nothing found
    if (features.length === 0) {
        features.push(
            'สินค้าคุณภาพดี',
            'ราคาคุ้มค่า',
            'จัดส่งรวดเร็ว'
        )
    }

    return features.slice(0, 5)
}
