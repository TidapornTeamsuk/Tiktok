'use client'

import { useState } from 'react'
import './globals.css'

// =============================================
// Types
// =============================================
interface Video {
  id: string
  script: string
  reviewImages: string[]
  videoUrl: string | null
  thumbnailUrl: string | null
  caption: string | null
  hashtags: string[]
  tone: string
  status: string
  createdAt: string
  product: {
    id: string
    name: string
    url: string
    price: string | null
    features: string[]
  }
}

type PipelineStatus = 'idle' | 'scraping' | 'generating_assets' | 'rendering' | 'generating_seo' | 'completed' | 'failed'

// =============================================
// Main Component
// =============================================
export default function Home() {
  const [productUrl, setProductUrl] = useState('')
  const [tone, setTone] = useState('professional')
  const [status, setStatus] = useState<PipelineStatus>('idle')
  const [result, setResult] = useState<Video | null>(null)
  const [error, setError] = useState<string | null>(null)

  // Handle form submission
  const handleGenerate = async () => {
    if (!productUrl.trim()) {
      setError('กรุณาใส่ลิงก์สินค้า')
      return
    }

    setStatus('scraping')
    setError(null)
    setResult(null)

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productUrl: productUrl.trim(),
          tone,
          language: 'th'
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'เกิดข้อผิดพลาดในการสร้างวิดีโอ')
      }

      setResult(data.data.video)
      setStatus('completed')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'เกิดข้อผิดพลาด')
      setStatus('failed')
    }
  }

  // Get status label
  const getStatusLabel = (s: PipelineStatus) => {
    const labels: Record<PipelineStatus, string> = {
      idle: 'พร้อมใช้งาน',
      scraping: 'กำลังดึงข้อมูลสินค้า...',
      generating_assets: 'กำลังสร้างรูปภาพและบทพูด...',
      rendering: 'กำลังเรนเดอร์วิดีโอ...',
      generating_seo: 'กำลังสร้าง Caption และ Hashtags...',
      completed: 'เสร็จสิ้น! ✨',
      failed: 'เกิดข้อผิดพลาด'
    }
    return labels[s]
  }

  // Check if step is completed
  const isStepCompleted = (step: number) => {
    const stepOrder = ['scraping', 'generating_assets', 'rendering', 'generating_seo', 'completed']
    const currentIndex = stepOrder.indexOf(status)
    return currentIndex > step
  }

  // Check if step is active
  const isStepActive = (step: number) => {
    const stepOrder = ['scraping', 'generating_assets', 'rendering', 'generating_seo', 'completed']
    return stepOrder.indexOf(status) === step
  }

  return (
    <>
      {/* Background Effect */}
      <div className="bg-gradient-mesh" />

      <main className="main">
        <div className="container">
          {/* Header */}
          <header className="header">
            <div className="logo">
              <div className="logo-icon">🎬</div>
              <span className="logo-text">TikTok Video Creator</span>
            </div>
            <p className="header-subtitle">
              สร้างวิดีโอรีวิวสินค้าระดับมืออาชีพภายในไม่กี่วินาที
              ด้วยพลัง AI จาก Google
            </p>
          </header>

          {/* Main Form */}
          <div className="glass-card">
            <div className="form-group">
              <label className="form-label">🔗 ลิงก์สินค้า TikTok Shop</label>
              <input
                type="url"
                className="form-input"
                placeholder="วางลิงก์สินค้าที่นี่... (เช่น https://www.tiktok.com/...)"
                value={productUrl}
                onChange={(e) => setProductUrl(e.target.value)}
                disabled={status !== 'idle' && status !== 'completed' && status !== 'failed'}
              />
            </div>

            <div className="form-group">
              <label className="form-label">🎭 สไตล์วิดีโอ</label>
              <select
                className="form-select"
                value={tone}
                onChange={(e) => setTone(e.target.value)}
                disabled={status !== 'idle' && status !== 'completed' && status !== 'failed'}
              >
                <option value="professional">💼 มืออาชีพ - น่าเชื่อถือ หรูหรา</option>
                <option value="funny">😄 ตลก - ขำขัน ใช้ภาษาวัยรุ่น</option>
                <option value="informative">📚 สาระ - ให้ข้อมูลละเอียด</option>
                <option value="honest">💯 รีวิวจริงใจ - ตรงไปตรงมา</option>
              </select>
            </div>

            {/* Pipeline Steps */}
            {status !== 'idle' && (
              <div className="pipeline-steps">
                <div className={`pipeline-step ${isStepCompleted(0) ? 'completed' : ''} ${isStepActive(0) ? 'active' : ''}`}>
                  <div className="pipeline-step-icon">{isStepCompleted(0) ? '✓' : '1'}</div>
                  <span className="pipeline-step-label">ดึงข้อมูล</span>
                </div>
                <div className={`pipeline-step ${isStepCompleted(1) ? 'completed' : ''} ${isStepActive(1) ? 'active' : ''}`}>
                  <div className="pipeline-step-icon">{isStepCompleted(1) ? '✓' : '2'}</div>
                  <span className="pipeline-step-label">สร้าง Assets</span>
                </div>
                <div className={`pipeline-step ${isStepCompleted(2) ? 'completed' : ''} ${isStepActive(2) ? 'active' : ''}`}>
                  <div className="pipeline-step-icon">{isStepCompleted(2) ? '✓' : '3'}</div>
                  <span className="pipeline-step-label">เรนเดอร์</span>
                </div>
                <div className={`pipeline-step ${isStepCompleted(3) ? 'completed' : ''} ${isStepActive(3) ? 'active' : ''}`}>
                  <div className="pipeline-step-icon">{isStepCompleted(3) ? '✓' : '4'}</div>
                  <span className="pipeline-step-label">SEO</span>
                </div>
                <div className={`pipeline-step ${status === 'completed' ? 'completed' : ''}`}>
                  <div className="pipeline-step-icon">{status === 'completed' ? '✓' : '5'}</div>
                  <span className="pipeline-step-label">เสร็จสิ้น</span>
                </div>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="result-item" style={{ marginBottom: '20px', borderColor: 'rgba(244, 67, 54, 0.3)' }}>
                <div className="result-item-value" style={{ color: '#f44336' }}>
                  ❌ {error}
                </div>
              </div>
            )}

            {/* Generate Button */}
            <button
              className={`btn btn-primary btn-full ${status !== 'idle' && status !== 'completed' && status !== 'failed' ? 'animate-pulse-glow' : ''}`}
              onClick={handleGenerate}
              disabled={status !== 'idle' && status !== 'completed' && status !== 'failed'}
            >
              {status !== 'idle' && status !== 'completed' && status !== 'failed' ? (
                <>
                  <div className="spinner" />
                  {getStatusLabel(status)}
                </>
              ) : (
                <>
                  🚀 สร้างวิดีโอ
                </>
              )}
            </button>
          </div>

          {/* Results */}
          {result && (
            <div className="result-section animate-fade-in-up">
              <div className="result-header">
                <h2 className="result-title">✨ ผลลัพธ์</h2>
                <span className={`status-badge ${result.status === 'COMPLETED' ? 'status-completed' : 'status-failed'}`}>
                  {result.status === 'COMPLETED' ? '✓ สำเร็จ' : '✗ มีปัญหา'}
                </span>
              </div>

              <div className="result-grid" style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: '24px' }}>
                {/* Video Preview */}
                <div>
                  <div className="video-preview">
                    {result.videoUrl ? (
                      <video controls autoPlay muted loop>
                        <source src={result.videoUrl} type="video/mp4" />
                      </video>
                    ) : (
                      <div className="video-placeholder">
                        <div className="video-placeholder-icon">🎬</div>
                        <p>วิดีโอกำลังสร้าง</p>
                      </div>
                    )}
                  </div>

                  {result.videoUrl && (
                    <a
                      href={result.videoUrl}
                      download
                      className="btn btn-secondary btn-full"
                      style={{ marginTop: '16px' }}
                    >
                      ⬇️ ดาวน์โหลดวิดีโอ
                    </a>
                  )}
                </div>

                {/* Details */}
                <div className="result-grid">
                  {/* Product Info */}
                  <div className="result-item">
                    <div className="result-item-label">📦 สินค้า</div>
                    <div className="result-item-value">
                      <strong>{result.product.name}</strong>
                      {result.product.price && (
                        <span style={{ color: 'var(--accent-pink)', marginLeft: '12px' }}>
                          {result.product.price}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Script */}
                  <div className="result-item">
                    <div className="result-item-label">📝 บทพูด (8 วินาที)</div>
                    <div className="script-text">{result.script}</div>
                  </div>

                  {/* Caption */}
                  {result.caption && (
                    <div className="result-item">
                      <div className="result-item-label">💬 Caption</div>
                      <div className="result-item-value">{result.caption}</div>
                    </div>
                  )}

                  {/* Hashtags */}
                  {result.hashtags && result.hashtags.length > 0 && (
                    <div className="result-item">
                      <div className="result-item-label">🏷️ Hashtags</div>
                      <div className="hashtags">
                        {result.hashtags.map((tag, index) => (
                          <span key={index} className="hashtag">
                            {tag.startsWith('#') ? tag : `#${tag}`}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Copy All Button */}
                  <button
                    className="btn btn-secondary"
                    onClick={() => {
                      const text = `${result.caption || ''}\n\n${result.hashtags.map(t => t.startsWith('#') ? t : `#${t}`).join(' ')}`
                      navigator.clipboard.writeText(text)
                      alert('คัดลอกแล้ว! 📋')
                    }}
                  >
                    📋 คัดลอก Caption + Hashtags
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Empty State when no result */}
          {status === 'idle' && !result && (
            <div className="empty-state">
              <div className="empty-state-icon">🎥</div>
              <p className="empty-state-text">
                วางลิงก์สินค้าแล้วกดสร้างวิดีโอเพื่อเริ่มต้น
              </p>
            </div>
          )}
        </div>
      </main>
    </>
  )
}
