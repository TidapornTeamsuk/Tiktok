# TikTok Affiliate Video Creator Context

เอกสารนี้รวบรวมข้อมูลบริบท (Context) ทั้งหมดสำหรับการพัฒนาเว็บไซต์สำหรับสร้างวิดีโอนายหน้า TikTok (TikTok Affiliate) เพื่อใช้ในการสั่งการ AI หรือวางแผนการพัฒนา

## 🎯 เป้าหมายของระบบ (Project Goal)
เพื่อสร้างเครื่องมือ Web-based ที่ช่วยให้นักขาย (Affiliates) สามารถสร้างวิดีโอรีวิวสินค้าที่มีคุณภาพสูง มีส่วนร่วม (Engagement) และกระตุ้นยอดขาย (Conversion) ได้อย่างรวดเร็ว โดยลดขั้นตอนการตัดต่อที่ยุ่งยาก

---

## 🛠️ โครงสร้างทางเทคนิค (Technical Stack)

| ส่วนประกอบ | เทคโนโลยีที่แนะนำ |
| :--- | :--- |
| **Framework** | Next.js 14+ (App Router) |
| **Styling** | Vanilla CSS / CSS Modules (Premium Look) |
| **Video Engine** | [Remotion](https://www.remotion.dev/) (สร้างวิดีโอด้วย Code React) |
| **AI (LLM)** | Gemini 1.5 Pro (สร้าง Script และ Hook) |
| **Voice Over** | TikTok TTS API หรือ ElevenLabs |
| **Database** | Supabase หรือ Prisma + PostgreSQL |

---

## ✨ ฟีเจอร์หลัก (Core Features)

### 1. เครื่องมือวิเคราะห์สินค้า (Product Intelligent)
- **Automatic Scraping:** ดึงรูปภาพและจุดเด่นของสินค้าจากลิงก์ (TikTok Shop, Shopee, Lazada)
- **Point Extraction:** สรุปจุดเด่น 3 ข้อที่กลุ่มเป้าหมายใน TikTok ชอบ

### 2. ระบบเขียนสคริปต์ด้วย AI (AI Scriptwriter)
- **Hook Formula:** เจนคำขึ้นต้นที่หยุดนิ้วคนดู (เช่น "เลิกทำแบบนี้ถ้าอยาก..." หรือ "ไอเทมลับที่ต้องมี...")
- **Emotional Selling:** ปรับเนื้อหาตามอารมณ์ (ตลก, สาระ, รีวิวตรงๆ)
- **Call to Action (CTA):** คำกระตุ้นให้กดตะกร้าเหลืองหรือลิงก์ในโปรไฟล์

### 3. ระบบสร้างวิดีโออัตโนมัติ (Video Engine)
- **9:16 Format:** สัดส่วนแนวตั้งสำหรับ TikTok โดยเฉพาะ
- **Dynamic Captions:** คำบรรยายแบบอ่านง่าย เด้งตามจังหวะเสียงพูด
- **Background Music:** แนะนำเพลงที่เป็นกระแส (Trending Sounds)

---

## 🔄 ขั้นตอนการทำงาน (User & Data Flow)

1.  **Input Phase:** ผู้ใช้นำลิงก์สินค้าจาก TikTok/Shopee หรือรายละเอียดสินค้ามากรอกในระบบ
2.  **Processing Phase (AI):**
    *   ระบบวิเคราะห์ข้อมูลสินค้าและกลุ่มเป้าหมาย
    *   AI เจนเนอเรตสคริปต์วิดีโอ (Hook, Story, CTA)
    *   ระบบแปลงข้อความเป็นเสียงพูด (TTS) และคำนวณจังหวะเวลา (Timestamps)
3.  **Visual Composition Phase:**
    *   ระบบจับคู่สคริปต์กับภาพสินค้าหรือคลิปตัวอย่าง
    *   ใส่ซับไตเติ้ลแบบ dynamic และเพลงประกอบ
4.  **Preview Phase:** ผู้ใช้ดูตัวอย่างวิดีโอและสามารถแก้ไขสคริปต์หรือเปลี่ยนรูปภาพได้
5.  **Output Phase:** ระบบเรนเดอร์วิดีโอเป็นไฟล์ .mp4 พร้อมให้ดาวน์โหลด

---

## 📥 ข้อมูลนำเข้า (Input Specification)

| ส่วนข้อมูล | รายละเอียด | รูปแบบ |
| :--- | :--- | :--- |
| **Product Data** | URL สินค้า หรือ ชื่อสินค้า และคำอธิบาย | String / URL |
| **Tone & Style** | อารมณ์ของวิดีโอ (เช่น ตลก, สาระ, รีวิวแบบจริงใจ) | Selection Enum |
| **Duration** | ความยาววิดีโอที่ต้องการ (15s, 30s, 60s) | Integer |
| **Language** | ภาษาที่ต้องการให้ AI เขียนสคริปต์ | String (TH/EN) |
| **Custom Assets** | รูปภาพหรือคลิปวิดีโอเพิ่มเติมจากผู้ใช้ (Optional) | File (JPG/MP4) |

---

## 📤 ข้อมูลส่งออก (Output Specification)

| ส่วนข้อมูล | รายละเอียด | รูปแบบ |
| :--- | :--- | :--- |
| **Video File** | วิดีโอแนวตั้งที่พร้อมอัปโหลด (High Quality) | .mp4 (1080x1920) |
| **Production Script** | สคริปต์ที่ AI เขียนแยกตามช่วงเวลา | JSON / Text |
| **SEO Captions** | คำบรรยาย (Capitons) และ Hashtags ที่แนะนำ | Text |
| **Thumbnail** | ภาพหน้าปกวิดีโอที่ดึงดูดสายตา | .png / .jpg |

---

## 🎨 แนวทางการออกแบบ (Design Philosophy)
- **Aesthetic:** ทันสมัย (Modern), มินิมอล (Minimal), และพรีเมียม (Premium)
- **Theme:** Dark Mode พร้อม Neon Accents (สีชมพู/ฟ้า แบบ TikTok)
- **Interactions:** มี Micro-animations, แก้ว (Glassmorphism), และความไหลลื่น (Smooth Transitions)

---

## 📈 แผนการดำเนินงาน (Implementation Plan)

1.  **Phase 1: Research & Setup**
    - วางโครงสร้างโปรเจกต์ Next.js
    - ตั้งค่า API สำหรับ AI (Gemini/OpenAI)
2.  **Phase 2: UI/UX Development**
    - สร้างหน้า Dashboard สำหรับ Input ลิงก์สินค้า
    - ทำหน้า Video Preview (Mockup 9:16)
3.  **Phase 3: Video Engine Integration**
    - เชื่อมต่อ Remotion เพื่อเรนเดอร์ React Component เป็นไฟล์วิดีโอ
    - ระบบส่งเสียง TTS (Text-to-Speech)
4.  **Phase 4: Launch & Optimization**
    - ระบบดาวน์โหลดไฟล์ .mp4
    - ระบบบันทึกประวัติการสร้างวิดีโอ

---

## 💬 ตัวอย่าง Prompt สำหรับ AI (Instruction Prompt)
*"คุณคือผู้เชี่ยวชาญด้านการตลาด TikTok จงช่วยเขียนสคริปต์วิดีโอความยาว 15-30 วินาที สำหรับสินค้า [ชื่อสินค้า] โดยเน้นความรู้สึก [ระบุอารมณ์] มี Hook ที่หยุดนิ้วคนดูได้ใน 3 วินาทีแรก และจบด้วย CTA ให้กดซื้อที่ตะกร้า"*
