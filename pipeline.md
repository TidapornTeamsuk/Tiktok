# 🚀 TikTok Automation Pipeline (VEO3)

เอกสารฉบับนี้อธิบายขั้นตอนการทำงาน (Flow) อย่างละเอียดของระบบสร้างวิดีโอรีวิวสินค้าอัตโนมัติ โดยเน้นความเร็วและคุณภาพระดับพรีเมียม

---

## 🛠️ Pipeline Overview

ขั้นตอนการทำงานแบ่งออกเป็น 5 ระยะหลัก ดังนี้:

### 1. 📥 Phase 1: Product Input & Information Gathering
*   **Input**: ผู้ใช้กรอก **ลิงก์สินค้าจาก TikTok (TikTok Shop URL)**
*   **Scraping Strategy**: ระบบทำการดึงข้อมูล (Scrape) รายละเอียดสินค้าเบื้องต้น:
    *   ชื่อสินค้า (Product Name)
    *   คุณสมบัติเด่น (Key Features)
    *   ราคา (Price)
    *   รูปภาพสินค้าจากหน้าร้าน (Product Source Images)

### 2. 🎨 Phase 2: Creative Asset Generation (AI Review)
*   **Image Creation**: นำข้อมูลที่ Scrape ได้มาสร้าง **รูปภาพภาพรีวิวใหม่** โดยใช้ AI Image Generator:
    *   ออกแบบให้ดูเป็น Live-action หรือ Lifestyle ที่น่าเชื่อถือ
    *   จัดองค์ประกอบให้พรีเมียม สอดคล้องกับแบรนด์สินค้า
*   **Short Script Writing**: ใช้ AI (Gemini 1.5 Pro) คิดบทพูด:
    *   **ความยาว**: ไม่เกิน 8 วินาที
    *   **โครงสร้าง**: Hook (3s) + Benefit (3s) + CTA (2s)
    *   **ภาษา**: ภาษาไทยที่ทันสมัยและเร้าอารมณ์

### 3. 🎬 Phase 3: Video Synthesis (Engine: VEO3)
*   **Processing**: นำรูปภาพรีวิวที่สร้างขึ้นและบทพูด (Script) เข้าสู่ระบบ **VEO3**
*   **Video Generation**: VEO3 จะทำการผสมผสาน (Synthesize) ดังนี้:
    *   สร้างการเคลื่อนไหว (Motion) ให้กับรูปภาพ
    *   ใส่เสียงบรรยาย (Voice Over) ตามสคริปต์
    *   ใส่ Background Music และ Dynamic Captions (ถ้ามี)
    *   **Output**: ไฟล์วิดีโอรีวิวความยาว 8 วินาที (สัดส่วน 9:16)

### 4. 📝 Phase 4: Metadata & SEO Optimization
*   **Caption Generation**: คิดข้อความบรรยายวิดีโอ (Description) ที่หยุดนิ้วคนดู
*   **Hashtag Strategy**: คัดเลือก Hashtag ที่เป็นกระแสและเกี่ยวข้องกับกลุ่มเป้าหมาย (3-5 แท็ก)
*   **CTA Finalizing**: กำหนดข้อความสำหรับจูงใจให้กดตะกร้าสินค้า

### 5. 💾 Phase 5: Database Persistence
*   **Storage**: บันทึกข้อมูลทั้งหมดลงในระบบฐานข้อมูล (Database):
    *   `product_link`: ลิงก์ต้นทาง
    *   `script`: บทพูดที่ใช้
    *   `review_images`: Path/URL ของรูปที่ AI สร้าง
    *   `video_url`: ลิงก์ไฟล์วิดีโอที่เรนเดอร์เสร็จแล้ว
    *   `description & hashtags`: ข้อมูลสำหรับโพสต์
    *   `timestamp`: เวลาที่สร้าง
*   **Status**: อัปเดตสถานะเป็น "Ready for Post" เพื่อแจ้งให้ผู้ใช้ทราบ

---

## 📊 Flow Summary Diagram
`Link` -> `Scrape Data` -> `Generate Images & Script (<8s)` -> `VEO3 Rendering` -> `SEO & Tags` -> `Save to DB`
