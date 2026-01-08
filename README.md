# 🎬 TikTok Affiliate Video Creator

> สร้างวิดีโอรีวิวสินค้า TikTok ระดับมืออาชีพภายในไม่กี่วินาที ด้วยพลัง AI จาก Google

![Next.js](https://img.shields.io/badge/Next.js-14+-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5+-blue?style=for-the-badge&logo=typescript)
![Google AI](https://img.shields.io/badge/Google_AI-Gemini_|_VEO3-orange?style=for-the-badge&logo=google)

---

## ✨ Features

- 🔍 **Auto Scraping** - ดึงข้อมูลสินค้าจาก TikTok Shop อัตโนมัติ
- 📝 **AI Scriptwriter** - สร้างบทพูดที่หยุดนิ้วคนดูได้ภายใน 8 วินาที
- 🖼️ **Image Generation** - สร้างรูปภาพรีวิวด้วย Imagen 3
- 🎬 **Video Synthesis** - สร้างวิดีโอ 9:16 ด้วย VEO3
- 🏷️ **SEO Optimization** - สร้าง Caption และ Hashtags ที่เป็นกระแส
- 💾 **Database Storage** - บันทึกประวัติการสร้างวิดีโอ

---

## 🛠️ Tech Stack

| Component | Technology |
|-----------|-----------|
| Framework | Next.js 14+ (App Router) |
| Language | TypeScript |
| Styling | Vanilla CSS (Premium Dark Theme) |
| AI - Text | Google Gemini 1.5 Pro |
| AI - Image | Google Imagen 3 |
| AI - Video | Google VEO3 |
| Database | PostgreSQL + Prisma |

---

## 🚀 Getting Started

### 1. Clone & Install

```bash
git clone <your-repo-url>
cd tiktok
npm install
```

### 2. Setup Environment Variables

คัดลอกไฟล์ `.env.example` เป็น `.env.local` และใส่ API Keys:

```bash
cp .env.example .env.local
```

### 3. สมัครและขอ API Keys

| Service | Website | Variable |
|---------|---------|----------|
| 🤖 Google AI Studio | [aistudio.google.com/apikey](https://aistudio.google.com/apikey) | `GEMINI_API_KEY`, `VEO3_API_KEY`, `IMAGEN_API_KEY` |
| 🗄️ Supabase (Database) | [supabase.com](https://supabase.com) | `DATABASE_URL` |

> 💡 **หมายเหตุ**: API Key จาก Google AI Studio ใช้ได้กับทั้ง Gemini, Imagen และ VEO3

### 4. Setup Database

```bash
# Generate Prisma Client
npx prisma generate

# Run migrations (สำหรับ PostgreSQL)
npx prisma db push
```

### 5. Run Development Server

```bash
npm run dev
```

เปิด [http://localhost:3000](http://localhost:3000) ในเบราว์เซอร์

---

## 📁 Project Structure

```
tiktok/
├── prisma/
│   └── schema.prisma      # Database schema
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── generate/
│   │   │       └── route.ts   # Main pipeline API
│   │   ├── globals.css        # Premium styling
│   │   ├── layout.tsx         # Root layout
│   │   └── page.tsx           # Main UI
│   └── lib/
│       ├── prisma.ts          # Database client
│       ├── gemini.ts          # Gemini AI client
│       ├── veo3.ts            # VEO3 & Imagen client
│       └── scraper.ts         # TikTok scraper
├── .env.example               # Environment template
├── CONTEXT.md                 # Project context
├── pipeline.md                # Pipeline documentation
└── README.md                  # This file
```

---

## 🔄 Pipeline Flow

```
📥 Input Link → 🔍 Scrape Data → 🎨 Generate Assets → 🎬 VEO3 Render → 📝 SEO → 💾 Save
```

1. **Input**: ผู้ใช้วางลิงก์สินค้า TikTok Shop
2. **Scrape**: ดึงชื่อ, ราคา, รูปภาพ และจุดเด่นของสินค้า
3. **Generate**: สร้างบทพูด (<8 วินาที) และรูปภาพรีวิว
4. **Render**: VEO3 สร้างวิดีโอ 9:16 พร้อม motion
5. **SEO**: สร้าง Caption และ Hashtags
6. **Save**: บันทึกทุกอย่างลง Database

---

## 🎨 Design

- **Theme**: Dark Mode + Neon Accents (Pink/Cyan แบบ TikTok)
- **Style**: Glassmorphism, Micro-animations
- **Typography**: Inter font
- **Video Format**: 9:16 (1080x1920) สำหรับ TikTok

---

## 📝 Environment Variables

```env
# Google AI (ใช้ key เดียวกันได้ทั้ง 3 services)
GEMINI_API_KEY=your_api_key
VEO3_API_KEY=your_api_key
IMAGEN_API_KEY=your_api_key

# Database
DATABASE_URL="postgresql://..."

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## 🔗 API Endpoints

### POST `/api/generate`

สร้างวิดีโอใหม่จากลิงก์สินค้า

**Request:**
```json
{
  "productUrl": "https://www.tiktok.com/...",
  "tone": "professional",
  "language": "th"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "video": {
      "id": "...",
      "script": "...",
      "videoUrl": "...",
      "caption": "...",
      "hashtags": ["#TikTokShop", "..."]
    }
  }
}
```

### GET `/api/generate`

ดึงรายการวิดีโอที่สร้างไว้

---

## 📄 License

MIT License - สร้างด้วย ❤️ สำหรับ TikTok Affiliates
