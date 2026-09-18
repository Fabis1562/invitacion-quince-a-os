import React, { useState, useEffect, useCallback, useRef } from 'react'
import { createPortal } from 'react-dom'
import QRCode from 'qrcode'

// ─── Event Configuration ───────────────────────────────────────────────────────
const QUINCE_NAME = "Krista Mariel"
const QUINCE_FULL_NAME = "Krista Mariel Sandoval Caldera"
const PRODUCTION_URL = "https://invitacion-krista-xv.netlify.app/"
const EVENT_DATE = new Date('2026-10-17T13:00:00') // 17 de Octubre, 2026 a la 1:00 PM
const BIRTHDAY_DATE = "15 de Octubre"
const MOTHER_NAME = "María Gabriela Caldera Arroyo"
const FATHER_NAME = "Roberto Sandoval Santoyo"
const GODMOTHER_NAME = "María Dolores Carlos Basurto"
const GODFATHER_NAME = "Saúl Sandoval Santoyo"

const CHURCH_TIME = "1:00 PM - 2:00 PM"
const CHURCH_NAME = "Templo de la Sagrada Familia"
const CHURCH_ADDRESS = "Av. José María Morelos #207, Zona Centro, Fresnillo, Zac."
const CHURCH_COORDINATES = "23°10'19.6\"N 102°52'16.5\"W"
const CHURCH_MAPS = "https://www.google.com/maps?q=23.1721248626709,-102.8712387084961&z=17&hl=es"
const CHURCH_WAZE = "https://waze.com/ul?ll=23.1721248626709,-102.8712387084961&navigate=yes"

const VENUE_TIME = "3:00 PM"
const VENUE_NAME = "Salón Quinta María Teresa"
const VENUE_COORDINATES = "23°10'30.7\"N 102°54'27.6\"W"
const VENUE_ADDRESS = "Fresnillo, Zacatecas (Coordenadas: 23°10'30.7\"N 102°54'27.6\"W)"
const VENUE_MAPS = "https://www.google.com/maps/place/23%C2%B010'30.7%22N+102%C2%B054'27.6%22W/@23.1752309,-102.9085838,291m/data=!3m1!1e3!4m4!3m3!8m2!3d23.1751881!4d-102.9076614?hl=es&entry=ttu&g_ep=EgoyMDI2MDkxNS4wIKXMDSoASAFQAw%3D%3D"
const VENUE_WAZE = "https://waze.com/ul?ll=23.1751881,-102.9076614&navigate=yes"

const WHATSAPP_PHONE = "5214931141024" // +52 1 493 114 1024
// 💡 Carpeta compartida de Google Drive / Google Photos para fotos de los invitados
const GOOGLE_DRIVE_PHOTOS_URL = "https://drive.google.com/drive/folders/1_krista_mariel_quince_fotos_compartidas"
// 💡 URL desplegada de Google Apps Script para sincronización automática en Google Sheets
const GOOGLE_SHEETS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbz6KnvPPgf2EyKAWXBqQhGVVQWQsZl8Ily03inC-8bRfdFMbnh41SH0PmywnaMKRyNT/exec" 

// ─── Google Sheets Sync Helpers ────────────────────────────────────────────────
async function sendToGoogleSheets(action: string, payload: Record<string, any>) {
  if (!GOOGLE_SHEETS_SCRIPT_URL) return
  try {
    await fetch(GOOGLE_SHEETS_SCRIPT_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action, ...payload }),
    })
  } catch (err) {
    console.warn("Cloud sync warning:", err)
  }
}

async function fetchFromGoogleSheets(action: string) {
  if (!GOOGLE_SHEETS_SCRIPT_URL) return null
  try {
    const res = await fetch(`${GOOGLE_SHEETS_SCRIPT_URL}?action=${action}`)
    if (!res.ok) return null
    return await res.json()
  } catch (err) {
    console.warn("Cloud fetch warning:", err)
    return null
  }
}
const BANK_BENEFICIARY = "Krista Mariel Sandoval Caldera"
const BANK_NAME = "BBVA México"
const BANK_CLABE = "0121 8001 2345 6789 01"

const LIVERPOOL_EVENT_NAME = "Mis xv Krista"
const LIVERPOOL_EVENT_NUMBER = "60045186"
const LIVERPOOL_EVENT_EXPIRY = "16/11/2026"
const LIVERPOOL_URL = "https://mesaderegalos.liverpool.com.mx/"

const DRESS_CODE = "Rigurosa Etiqueta · Gala Elegante"
const DRESS_RESERVED_COLORS = [
  { color: "#FFFFFF", label: "Blanco / Marfil", role: "Quinceañera" },
  { color: "#F5E6D3", label: "Beige / Champán", role: "Familia" },
  { color: "#B88E52", label: "Dorado Ocre", role: "Mamá" },
  { color: "#8FA396", label: "Verde Menta", role: "Hermana & Corte" },
]

// ─── Photo Gallery Data (Fotos Oficiales de Krista Mariel - Fotos2) ───────────
const GALLERY_ITEMS = [
  { id: 1, src: "/fotos2/krista_sesion_1.png" },
  { id: 2, src: "/fotos2/krista_sesion_2.png" },
  { id: 3, src: "/fotos2/krista_sesion_3.png" },
  { id: 4, src: "/fotos2/krista_sesion_4.png" },
]

// ─── Initial Wishes Data ───────────────────────────────────────────────────────

// ─── Reusable Fine Vector Gold Butterfly Component ─────────────────────────────
export function GoldButterfly({ className = "w-5 h-5", size, style }: { className?: string; size?: number; style?: React.CSSProperties }) {
  const width = size ? size * (48 / 36) : undefined;
  const height = size || undefined;
  return (
    <svg
      className={`inline-block ${className}`}
      width={width}
      height={height}
      viewBox="0 0 48 36"
      fill="none"
      style={style}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="goldWingL" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFF2B2" />
          <stop offset="40%" stopColor="#D4AF37" />
          <stop offset="80%" stopColor="#AA7C11" />
          <stop offset="100%" stopColor="#7A5805" />
        </linearGradient>
        <linearGradient id="goldWingR" x1="100%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FFF2B2" />
          <stop offset="40%" stopColor="#D4AF37" />
          <stop offset="80%" stopColor="#AA7C11" />
          <stop offset="100%" stopColor="#7A5805" />
        </linearGradient>
        <linearGradient id="goldBody" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FFF8D6" />
          <stop offset="50%" stopColor="#E5C158" />
          <stop offset="100%" stopColor="#8C6207" />
        </linearGradient>
      </defs>
      <path
        d="M23 15 C20 8, 12 1, 3 3 C-1 4, -0.5 11, 4 16 C8 20, 16 20, 23 16 Z"
        fill="url(#goldWingL)"
        stroke="#8C6207"
        strokeWidth="0.8"
      />
      <path
        d="M25 15 C28 8, 36 1, 45 3 C49 4, 48.5 11, 44 16 C40 20, 32 20, 25 16 Z"
        fill="url(#goldWingR)"
        stroke="#8C6207"
        strokeWidth="0.8"
      />
      <path
        d="M22 17 C18 20, 10 23, 6 29 C4 32, 8 35, 12 33 C17 31, 21 26, 23 19 Z"
        fill="url(#goldWingL)"
        stroke="#8C6207"
        strokeWidth="0.7"
        opacity="0.95"
      />
      <path
        d="M26 17 C30 20, 38 23, 42 29 C44 32, 40 35, 36 33 C31 31, 27 26, 25 19 Z"
        fill="url(#goldWingR)"
        stroke="#8C6207"
        strokeWidth="0.7"
        opacity="0.95"
      />
      <path d="M10 8 C14 11, 19 14, 23 15" stroke="#FFF7CC" strokeWidth="0.75" strokeLinecap="round" opacity="0.8" />
      <path d="M38 8 C34 11, 29 14, 25 15" stroke="#FFF7CC" strokeWidth="0.75" strokeLinecap="round" opacity="0.8" />
      <path d="M12 28 C16 26, 19 23, 22 18" stroke="#FFF7CC" strokeWidth="0.6" strokeLinecap="round" opacity="0.7" />
      <path d="M36 28 C32 26, 29 23, 26 18" stroke="#FFF7CC" strokeWidth="0.6" strokeLinecap="round" opacity="0.7" />
      <ellipse cx="24" cy="19" rx="1.4" ry="7" fill="url(#goldBody)" stroke="#6E4D05" strokeWidth="0.6" />
      <circle cx="24" cy="11" r="1.8" fill="url(#goldBody)" stroke="#6E4D05" strokeWidth="0.6" />
      <path d="M23.2 10 Q19 5, 17 3" stroke="#8C6207" strokeWidth="0.75" strokeLinecap="round" fill="none" />
      <circle cx="16.5" cy="2.8" r="0.7" fill="#E5C158" />
      <path d="M24.8 10 Q29 5, 31 3" stroke="#8C6207" strokeWidth="0.75" strokeLinecap="round" fill="none" />
      <circle cx="31.5" cy="2.8" r="0.7" fill="#E5C158" />
    </svg>
  );
}

// ─── 3D Hyper-Realistic Flying Butterfly Canvas ─────────────────────────────────
interface ButterflyParticle {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  wingAngle: number
  wingSpeed: number
  hue: string
  opacity: number
  sparkles: { x: number; y: number; alpha: number; size: number }[]
}

interface ButterflyCanvasProps {
  onSpawnRef?: (fn: () => void) => void
  onExplosiveBurstRef?: (fn: () => void) => void
}

function ButterflyCanvas({ onSpawnRef, onExplosiveBurstRef }: ButterflyCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const particlesRef = useRef<ButterflyParticle[]>([])
  const mouseRef = useRef({ x: -1000, y: -1000 })
  const lastSpawnRef = useRef<number>(0)
  const isPausedRef = useRef<boolean>(false)

  const HUES = [
    '#D4AF37', // Oro regio
    '#F6C744', // Oro radiante
    '#FFDF78', // Oro champaña
    '#F7A8B8', // Rosa pastel
    '#F48FB1', // Rosa rubor
    '#DDA0DD', // Lavanda suave
    '#E0B0FF', // Malva festivo
    '#88D49E', // Menta sage
  ]

  const createButterfly = useCallback((x?: number, y?: number, customVx?: number, customVy?: number): ButterflyParticle => {
    const width = window.innerWidth || 375
    const height = window.innerHeight || 667
    return {
      x: x ?? Math.random() * width,
      y: y ?? Math.random() * height,
      vx: customVx ?? (Math.random() - 0.5) * 1.6,
      vy: customVy ?? (-0.6 - Math.random() * 1.5),
      size: (window.innerWidth < 640 ? 14 : 18) + Math.random() * 14,
      wingAngle: Math.random() * Math.PI * 2,
      wingSpeed: 0.14 + Math.random() * 0.14,
      hue: HUES[Math.floor(Math.random() * HUES.length)],
      opacity: 0.88 + Math.random() * 0.12,
      sparkles: [],
    }
  }, [])

  const triggerSwarm = useCallback(() => {
    isPausedRef.current = false
    const width = window.innerWidth || 375
    const height = window.innerHeight || 667
    const count = 4
    for (let i = 0; i < count; i++) {
      if (particlesRef.current.length < 10) {
        particlesRef.current.push(
          createButterfly(
            Math.random() * width,
            height + 15 + Math.random() * 30,
            (Math.random() - 0.5) * 1.5,
            -1.0 - Math.random() * 1.2
          )
        )
      }
    }
  }, [createButterfly])

  const triggerExplosiveBurst = useCallback(() => {
    isPausedRef.current = false
    const width = window.innerWidth || 375
    const height = window.innerHeight || 667
    const centerX = width / 2
    const centerY = height / 2

    const burstCount = 10
    for (let i = 0; i < burstCount; i++) {
      const angle = Math.random() * Math.PI * 2
      const speed = 2.5 + Math.random() * 4
      const vx = Math.cos(angle) * speed
      const vy = Math.sin(angle) * speed - 1.0

      particlesRef.current.push({
        x: centerX + (Math.random() - 0.5) * 20,
        y: centerY + (Math.random() - 0.5) * 20,
        vx,
        vy,
        size: 14 + Math.random() * 8,
        wingAngle: Math.random() * Math.PI * 2,
        wingSpeed: 0.16 + Math.random() * 0.1,
        hue: HUES[Math.floor(Math.random() * HUES.length)],
        opacity: 0.85,
        sparkles: [],
      })
    }
  }, [createButterfly])

  useEffect(() => {
    if (onSpawnRef) onSpawnRef(triggerSwarm)
    if (onExplosiveBurstRef) onExplosiveBurstRef(triggerExplosiveBurst)
  }, [onSpawnRef, onExplosiveBurstRef, triggerSwarm, triggerExplosiveBurst])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationFrameId: number
    const maxParticles = 10
    const initialCount = 6

    particlesRef.current = Array.from({ length: initialCount }, () => createButterfly())

    const handleResize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    handleResize()
    window.addEventListener('resize', handleResize)

    const handlePauseButterflies = () => {
      isPausedRef.current = true
      ctx.clearRect(0, 0, canvas.width, canvas.height)
    }
    const handleResumeButterflies = () => {
      isPausedRef.current = false
      if (particlesRef.current.length < initialCount) {
        particlesRef.current = Array.from({ length: initialCount }, () => createButterfly())
      }
    }
    window.addEventListener('pause-butterflies', handlePauseButterflies)
    window.addEventListener('resume-butterflies', handleResumeButterflies)

    const render = () => {
      if (isPausedRef.current) {
        animationFrameId = requestAnimationFrame(render)
        return
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Maintain reasonable population
      while (particlesRef.current.length > maxParticles) {
        particlesRef.current.shift()
      }

      // Auto-replenish if population drops below initialCount
      if (particlesRef.current.length < initialCount && Math.random() < 0.08) {
        particlesRef.current.push(createButterfly(Math.random() * canvas.width, canvas.height + 25))
      }

      particlesRef.current.forEach((p) => {
        p.wingAngle += p.wingSpeed
        const flap = Math.sin(p.wingAngle)

        const dx = mouseRef.current.x - p.x
        const dy = mouseRef.current.y - p.y
        const dist = Math.sqrt(dx * dx + dy * dy)
        if (dist < 130) {
          p.vx -= (dx / dist) * 0.35
          p.vy -= (dy / dist) * 0.35
        }

        p.vx *= 0.98
        p.vy *= 0.98

        p.vx += Math.sin(p.wingAngle * 0.5) * 0.05
        p.x += p.vx
        p.y += p.vy

        // Wrap around screen boundaries
        if (p.y < -40) {
          p.y = canvas.height + 25
          p.x = Math.random() * canvas.width
          p.vy = -0.6 - Math.random() * 1.5
          p.vx = (Math.random() - 0.5) * 1.6
        }
        if (p.x < -40) p.x = canvas.width + 30
        if (p.x > canvas.width + 40) p.x = -30

        // Sparkle trail
        if (Math.random() < 0.28) {
          p.sparkles.push({
            x: p.x + (Math.random() - 0.5) * 8,
            y: p.y + 4 + Math.random() * 8,
            alpha: 0.95,
            size: 1 + Math.random() * 2.2,
          })
        }

        p.sparkles.forEach((sp, sIdx) => {
          sp.y += 0.35
          sp.alpha -= 0.035
          if (sp.alpha > 0) {
            ctx.save()
            ctx.fillStyle = p.hue
            ctx.shadowColor = '#FFD700'
            ctx.shadowBlur = 4
            ctx.globalAlpha = sp.alpha * 0.9
            ctx.beginPath()
            ctx.arc(sp.x, sp.y, sp.size, 0, Math.PI * 2)
            ctx.fill()
            ctx.restore()
          } else {
            p.sparkles.splice(sIdx, 1)
          }
        })

        // Draw Butterfly
        ctx.save()
        ctx.translate(p.x, p.y)
        ctx.globalAlpha = p.opacity

        const angle = Math.atan2(p.vy, p.vx) + Math.PI / 2
        ctx.rotate(angle * 0.25 + Math.sin(p.wingAngle) * 0.08)

        const wingScaleX = Math.abs(flap) * 0.85 + 0.15
        const s = p.size

        // Soft outer glow
        ctx.shadowColor = p.hue
        ctx.shadowBlur = 8

        // Top Wings Gradient
        const topGrad = ctx.createRadialGradient(0, 0, s * 0.2, 0, 0, s * 1.4)
        topGrad.addColorStop(0, '#FFFDF0')
        topGrad.addColorStop(0.55, p.hue)
        topGrad.addColorStop(1, '#B8860B')

        // Left Top Wing
        ctx.save()
        ctx.scale(-wingScaleX, 1)
        ctx.fillStyle = topGrad
        ctx.beginPath()
        ctx.moveTo(0, 0)
        ctx.bezierCurveTo(-s * 1.25, -s * 0.85, -s * 1.55, -s * 0.1, -s * 0.85, s * 0.65)
        ctx.bezierCurveTo(-s * 0.4, s * 0.8, -s * 0.1, s * 0.4, 0, 0)
        ctx.fill()
        ctx.strokeStyle = '#D4AF37'
        ctx.lineWidth = 0.8
        ctx.stroke()
        ctx.restore()

        // Right Top Wing
        ctx.save()
        ctx.scale(wingScaleX, 1)
        ctx.fillStyle = topGrad
        ctx.beginPath()
        ctx.moveTo(0, 0)
        ctx.bezierCurveTo(s * 1.25, -s * 0.85, s * 1.55, -s * 0.1, s * 0.85, s * 0.65)
        ctx.bezierCurveTo(s * 0.4, s * 0.8, s * 0.1, s * 0.4, 0, 0)
        ctx.fill()
        ctx.strokeStyle = '#D4AF37'
        ctx.lineWidth = 0.8
        ctx.stroke()
        ctx.restore()

        // Bottom Wings Gradient
        const botGrad = ctx.createRadialGradient(0, 0, s * 0.1, 0, s * 0.6, s * 1.1)
        botGrad.addColorStop(0, '#FFFFFF')
        botGrad.addColorStop(0.6, p.hue)
        botGrad.addColorStop(1, '#996515')

        // Left Bottom Wing
        ctx.save()
        ctx.scale(-wingScaleX, 1)
        ctx.fillStyle = botGrad
        ctx.globalAlpha = p.opacity * 0.82
        ctx.beginPath()
        ctx.moveTo(0, 0)
        ctx.bezierCurveTo(-s * 0.95, s * 0.2, -s * 1.15, s * 1.15, -s * 0.45, s * 1.25)
        ctx.bezierCurveTo(-s * 0.1, s * 1.2, 0, s * 0.6, 0, 0)
        ctx.fill()
        ctx.strokeStyle = '#D4AF37'
        ctx.lineWidth = 0.6
        ctx.stroke()
        ctx.restore()

        // Right Bottom Wing
        ctx.save()
        ctx.scale(wingScaleX, 1)
        ctx.fillStyle = botGrad
        ctx.globalAlpha = p.opacity * 0.82
        ctx.beginPath()
        ctx.moveTo(0, 0)
        ctx.bezierCurveTo(s * 0.95, s * 0.2, s * 1.15, s * 1.15, s * 0.45, s * 1.25)
        ctx.bezierCurveTo(s * 0.1, s * 1.2, 0, s * 0.6, 0, 0)
        ctx.fill()
        ctx.strokeStyle = '#D4AF37'
        ctx.lineWidth = 0.6
        ctx.stroke()
        ctx.restore()

        // Reset shadow for body & antennae
        ctx.shadowBlur = 0

        // Golden-brown body
        ctx.fillStyle = '#4A3510'
        ctx.beginPath()
        ctx.ellipse(0, 0, s * 0.1, s * 0.48, 0, 0, Math.PI * 2)
        ctx.fill()

        // Tiny golden head
        ctx.fillStyle = '#D4AF37'
        ctx.beginPath()
        ctx.arc(0, -s * 0.42, s * 0.09, 0, Math.PI * 2)
        ctx.fill()

        // Delicate curved antennae
        ctx.strokeStyle = '#8B6914'
        ctx.lineWidth = 0.8
        ctx.beginPath()
        ctx.moveTo(-1, -s * 0.42)
        ctx.quadraticCurveTo(-s * 0.4, -s * 0.85, -s * 0.55, -s * 0.95)
        ctx.moveTo(1, -s * 0.42)
        ctx.quadraticCurveTo(s * 0.4, -s * 0.85, s * 0.55, -s * 0.95)
        ctx.stroke()

        ctx.restore()
      })

      animationFrameId = requestAnimationFrame(render)
    }

    render()

    return () => {
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('pause-butterflies', handlePauseButterflies)
      window.removeEventListener('resume-butterflies', handleResumeButterflies)
      cancelAnimationFrame(animationFrameId)
    }
  }, [createButterfly])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 opacity-40"
      style={{ touchAction: 'none' }}
    />
  )
}

// ─── Golden Celebration Confetti Canvas ──────────────────────────────────────────
interface ConfettiParticle {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  color: string
  rotation: number
  vRot: number
  shape: 'rect' | 'circle' | 'star'
  opacity: number
}

function GoldenConfettiCanvas({ active, onComplete }: { active: boolean; onComplete: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const particlesRef = useRef<ConfettiParticle[]>([])

  useEffect(() => {
    if (!active) return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const colors = ['#D4AF37', '#F9E79F', '#FFFFFF', '#FFE57F', '#F5E6D3', '#B8860B']
    const shapes: ('rect' | 'circle' | 'star')[] = ['rect', 'circle', 'star']

    particlesRef.current = Array.from({ length: 90 }, () => ({
      x: Math.random() * canvas.width,
      y: -20 - Math.random() * 50,
      vx: (Math.random() - 0.5) * 4,
      vy: 2 + Math.random() * 5,
      size: 6 + Math.random() * 10,
      color: colors[Math.floor(Math.random() * colors.length)],
      rotation: Math.random() * Math.PI * 2,
      vRot: (Math.random() - 0.5) * 0.2,
      shape: shapes[Math.floor(Math.random() * shapes.length)],
      opacity: 1,
    }))

    let animationId: number
    const startTime = Date.now()

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      const elapsed = Date.now() - startTime

      particlesRef.current.forEach((p) => {
        p.x += p.vx
        p.y += p.vy
        p.rotation += p.vRot
        if (elapsed > 2000) p.opacity -= 0.02

        ctx.save()
        ctx.translate(p.x, p.y)
        ctx.rotate(p.rotation)
        ctx.globalAlpha = Math.max(0, p.opacity)
        ctx.fillStyle = p.color

        if (p.shape === 'rect') {
          ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6)
        } else if (p.shape === 'circle') {
          ctx.beginPath()
          ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2)
          ctx.fill()
        } else {
          ctx.beginPath()
          ctx.arc(0, 0, p.size * 0.4, 0, Math.PI * 2)
          ctx.fill()
        }
        ctx.restore()
      })

      if (elapsed < 3500) {
        animationId = requestAnimationFrame(render)
      } else {
        onComplete()
      }
    }

    render()

    return () => cancelAnimationFrame(animationId)
  }, [active, onComplete])

  if (!active) return null

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-50"
    />
  )
}

// ─── Speech Narrator for Older Guests ──────────────────────────────────────────
function speakEventDetails(onTriggerToast: (msg: string) => void) {
  if (!('speechSynthesis' in window)) {
    onTriggerToast("Tu navegador no soporta lectura por voz 🔊")
    return
  }
  window.speechSynthesis.cancel()
  const text = `¡Hola! Con la bendición de Dios y el amor de sus padres María Gabriela Caldera Arroyo y Roberto Sandoval Santoyo, y sus padrinos María Dolores Carlos Basurto y Saúl Sandoval Santoyo, te invitamos con gran alegría a celebrar los Quince Años de Krista Mariel Sandoval Caldera. La ceremonia religiosa será el sábado 17 de Octubre a la 1:00 de la tarde en el Templo de la Sagrada Familia. La recepción y comida iniciarán a las 3:00 de la tarde en el Salón Quinta María Teresa, seguido de Mariachi y Grupo Versátil. ¡Gracias por formar parte de este momento tan especial!`

  const utterance = new SpeechSynthesisUtterance(text)
  utterance.lang = 'es-MX'
  utterance.rate = 0.95
  utterance.pitch = 1.05

  window.speechSynthesis.speak(utterance)
  onTriggerToast("🔊 Leyendo invitación en voz alta...")
}



// ─── Post-Party Family Thank You Banner ────────────────────────────────────────
function PostPartyThanksBanner({ isManualPostParty }: { isManualPostParty: boolean }) {
  const isPostPartyDate = new Date() >= new Date('2026-10-18T00:00:00')
  const showBanner = isPostPartyDate || isManualPostParty

  if (!showBanner) return null

  return (
    <div className="w-full bg-gradient-to-r from-gold-dark via-gold to-gold-dark text-text-main py-6 px-4 text-center shadow-xl relative z-30 border-b-2 border-gold-light animate-fade-in">
      <div className="max-w-4xl mx-auto flex flex-col items-center gap-3">
        <span className="text-3xl animate-bounce">💖 👑 ✨</span>
        <h2 className="font-greatvibes text-3xl md:text-5xl font-bold">
          ¡Infinitas Gracias por Acompañar a Krista Mariel!
        </h2>
        <p className="font-montserrat text-xs md:text-sm font-semibold max-w-2xl leading-relaxed">
          La familia Sandoval Caldera agradece de todo corazón tu valiosa presencia, muestras de cariño y hermosas bendiciones en los Quince Años de nuestra amada Krista Mariel.
        </p>
        <div className="flex gap-4 mt-2">
          <a
            href="#galeria"
            className="px-5 py-2.5 rounded-full bg-cream text-gold-dark font-montserrat font-bold text-xs uppercase tracking-wider shadow-md hover:bg-pure-white transition-all"
          >
            Ver Galería de Recuerdos 📸
          </a>
        </div>
      </div>
    </div>
  )
}

// ─── Ambient Audio Synthesizer for Quinceañera Melodies ─────────────────────────
type SynthMode = 'ocean-eyes' | 'beauty-beast' | 'suave' | 'piano' | 'harp'

class AmbientQuinceSynth {
  private ctx: AudioContext | null = null
  private isRunning: boolean = false
  private timerId: any = null
  private mode: SynthMode = 'ocean-eyes'
  private masterGain: GainNode | null = null
  private isMuted: boolean = false

  private profiles: Record<SynthMode, {
    tempo: number
    filterFreq: number
    filterType: BiquadFilterType
    oscType: OscillatorType
    decay: number
    gainLevel: number
    chords: { root: number; notes: number[] }[]
  }> = {
    'ocean-eyes': {
      tempo: 480,
      filterFreq: 1500,
      filterType: 'lowpass',
      oscType: 'sine',
      decay: 2.8,
      gainLevel: 0.17,
      chords: [
        // C#m9 (moody, iconic piano intro of Ocean Eyes)
        { root: 69.30, notes: [277.18, 329.63, 415.30, 493.88, 554.37, 659.25] },
        // Bsus4
        { root: 61.74, notes: [246.94, 329.63, 369.99, 493.88, 554.37, 622.25] },
        // Amaj7
        { root: 55.00, notes: [220.00, 277.18, 329.63, 415.30, 554.37, 659.25] },
        // G#m7 / E
        { root: 82.41, notes: [207.65, 246.94, 329.63, 415.30, 493.88, 622.25] },
      ]
    },
    'beauty-beast': {
      tempo: 450,
      filterFreq: 2100,
      filterType: 'lowpass',
      oscType: 'triangle',
      decay: 2.3,
      gainLevel: 0.18,
      chords: [
        // D Major ("Tale as old as time")
        { root: 73.42, notes: [293.66, 369.99, 440.00, 587.33, 739.99] },
        // G/D ("True as it can be")
        { root: 73.42, notes: [293.66, 392.00, 440.00, 493.88, 587.33] },
        // F#m7 ("Barely even friends")
        { root: 92.50, notes: [277.18, 369.99, 440.00, 554.37, 739.99] },
        // G ("Then somebody bends")
        { root: 98.00, notes: [196.00, 246.94, 293.66, 392.00, 493.88] },
        // A7 ("Unexpectedly")
        { root: 110.00, notes: [220.00, 293.66, 329.63, 440.00, 554.37] },
        // Bm7 ("Beauty and the Beast")
        { root: 123.47, notes: [246.94, 293.66, 369.99, 440.00, 587.33] },
      ]
    },
    'suave': {
      tempo: 330,
      filterFreq: 2400,
      filterType: 'lowpass',
      oscType: 'sine',
      decay: 1.5,
      gainLevel: 0.19,
      chords: [
        // Bm9 (Luis Miguel smooth latin-pop groove)
        { root: 61.74, notes: [246.94, 293.66, 369.99, 440.00, 554.37] },
        // Em9
        { root: 82.41, notes: [196.00, 246.94, 329.63, 392.00, 440.00] },
        // A13
        { root: 55.00, notes: [220.00, 277.18, 329.63, 440.00, 493.88] },
        // Dmaj9
        { root: 73.42, notes: [293.66, 369.99, 440.00, 554.37, 659.25] },
        // Gmaj7
        { root: 98.00, notes: [196.00, 246.94, 293.66, 369.99, 493.88] },
        // F#7alt
        { root: 92.50, notes: [185.00, 277.18, 369.99, 440.00, 466.16] },
      ]
    },
    'piano': {
      tempo: 440,
      filterFreq: 1700,
      filterType: 'lowpass',
      oscType: 'sine',
      decay: 2.5,
      gainLevel: 0.16,
      chords: [
        { root: 146.83, notes: [293.66, 369.99, 440.00, 587.33, 739.99] },
        { root: 110.00, notes: [220.00, 277.18, 329.63, 440.00, 554.37] },
        { root: 123.47, notes: [246.94, 293.66, 369.99, 493.88, 587.33] },
        { root: 98.00,  notes: [196.00, 246.94, 293.66, 392.00, 493.88] },
      ]
    },
    'harp': {
      tempo: 360,
      filterFreq: 2400,
      filterType: 'lowpass',
      oscType: 'triangle',
      decay: 2.0,
      gainLevel: 0.17,
      chords: [
        { root: 146.83, notes: [293.66, 369.99, 440.00, 587.33, 739.99] },
        { root: 110.00, notes: [220.00, 277.18, 329.63, 440.00, 554.37] },
        { root: 123.47, notes: [246.94, 293.66, 369.99, 493.88, 587.33] },
        { root: 98.00,  notes: [196.00, 246.94, 293.66, 392.00, 493.88] },
      ]
    }
  }

  start(mode: SynthMode) {
    this.mode = mode
    this.stop()
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext
    if (!AudioCtx) return
    this.ctx = new AudioCtx()
    if (this.ctx.state === 'suspended') {
      this.ctx.resume()
    }
    const profile = this.profiles[mode] || this.profiles['piano']
    this.masterGain = this.ctx.createGain()
    this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : profile.gainLevel, this.ctx.currentTime)
    this.masterGain.connect(this.ctx.destination)
    this.isRunning = true

    let chordIdx = 0
    let step = 0

    const tick = () => {
      if (!this.isRunning || !this.ctx || !this.masterGain) return
      const currentChords = profile.chords
      const curChord = currentChords[chordIdx % currentChords.length]
      const noteFreq = curChord.notes[step % curChord.notes.length]
      this.playNote(noteFreq, step === 0 ? curChord.root : undefined, profile)

      step++
      if (step >= curChord.notes.length) {
        step = 0
        chordIdx = (chordIdx + 1) % currentChords.length
      }
      this.timerId = setTimeout(tick, profile.tempo)
    }

    tick()
  }

  playNote(
    freq: number,
    bassFreq: number | undefined,
    profile: {
      filterFreq: number
      filterType: BiquadFilterType
      oscType: OscillatorType
      decay: number
      gainLevel: number
    }
  ) {
    if (!this.ctx || !this.masterGain) return
    const now = this.ctx.currentTime

    const osc = this.ctx.createOscillator()
    const noteGain = this.ctx.createGain()
    const filter = this.ctx.createBiquadFilter()

    osc.type = profile.oscType
    osc.frequency.setValueAtTime(freq, now)

    filter.type = profile.filterType
    filter.frequency.setValueAtTime(profile.filterFreq, now)

    const dur = profile.decay
    noteGain.gain.setValueAtTime(0.001, now)
    noteGain.gain.exponentialRampToValueAtTime(profile.gainLevel, now + 0.04)
    noteGain.gain.exponentialRampToValueAtTime(0.0001, now + dur)

    osc.connect(filter)
    filter.connect(noteGain)
    noteGain.connect(this.masterGain)

    osc.start(now)
    osc.stop(now + dur)

    if (bassFreq) {
      const bassOsc = this.ctx.createOscillator()
      const bassGain = this.ctx.createGain()
      bassOsc.type = 'sine'
      bassOsc.frequency.setValueAtTime(bassFreq, now)
      bassGain.gain.setValueAtTime(0.001, now)
      bassGain.gain.exponentialRampToValueAtTime(profile.gainLevel * 0.9, now + 0.08)
      bassGain.gain.exponentialRampToValueAtTime(0.0001, now + dur + 0.5)
      bassOsc.connect(bassGain)
      bassGain.connect(this.masterGain)
      bassOsc.start(now)
      bassOsc.stop(now + dur + 0.5)
    }
  }

  setMuted(muted: boolean) {
    this.isMuted = muted
    if (!this.ctx || !this.masterGain) return
    const profile = this.profiles[this.mode] || this.profiles['piano']
    this.masterGain.gain.setValueAtTime(muted ? 0 : profile.gainLevel, this.ctx.currentTime)
  }

  stop() {
    this.isRunning = false
    if (this.timerId) clearTimeout(this.timerId)
    if (this.ctx) {
      try {
        this.ctx.close()
      } catch (e) {}
      this.ctx = null
    }
  }
}

const quinceSynth = new AmbientQuinceSynth()

interface AmbientTrack {
  id: string
  name: string
  tag: string
  icon: string
  type: 'audio' | 'synth'
  synthMode?: SynthMode
  src?: string
}

const AMBIENT_TRACKS: AmbientTrack[] = [
  {
    id: 'love-story-golden-brown',
    name: 'Love Story',
    tag: 'Taylor Swift · Andy Morris & Rob Landes',
    icon: '🎻',
    type: 'audio',
    src: '/audio/love_story_x_golden_brown.m4a',
    synthMode: 'piano',
  },
]

// ─── Real Audio Music Player (Love Story Exclusiva en Bucle Continuo) ───────────
function RealMusicPlayer({ playTriggerRef }: { playTriggerRef: React.MutableRefObject<(() => void) | null> }) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [muted, setMuted] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const currentTrack = AMBIENT_TRACKS[0]

  const startPlayback = useCallback(() => {
    quinceSynth.stop()
    const audio = audioRef.current
    if (audio) {
      audio.play()
        .then(() => setIsPlaying(true))
        .catch(err => {
          console.warn("Audio play blocked or format error", err)
          quinceSynth.start('piano')
          setIsPlaying(true)
        })
    }
  }, [])

  const stopPlayback = useCallback(() => {
    const audio = audioRef.current
    if (audio) audio.pause()
    quinceSynth.stop()
    setIsPlaying(false)
  }, [])

  const togglePlay = useCallback(() => {
    if (isPlaying) {
      stopPlayback()
    } else {
      startPlayback()
    }
  }, [isPlaying, startPlayback, stopPlayback])

  useEffect(() => {
    playTriggerRef.current = () => {
      startPlayback()
    }

    const handlePauseMusic = () => {
      stopPlayback()
    }

    const handleResumeMusic = () => {
      startPlayback()
    }

    const handleToggleMusic = () => {
      togglePlay()
    }

    window.addEventListener('pause-bg-music', handlePauseMusic)
    window.addEventListener('resume-bg-music', handleResumeMusic)
    window.addEventListener('toggle-bg-music', handleToggleMusic)
    window.addEventListener('open-music-selector', handleToggleMusic)

    return () => {
      window.removeEventListener('pause-bg-music', handlePauseMusic)
      window.removeEventListener('resume-bg-music', handleResumeMusic)
      window.removeEventListener('toggle-bg-music', handleToggleMusic)
      window.removeEventListener('open-music-selector', handleToggleMusic)
      quinceSynth.stop()
    }
  }, [playTriggerRef, startPlayback, stopPlayback, togglePlay])

  const toggleMute = () => {
    const nextMuted = !muted
    setMuted(nextMuted)
    const audio = audioRef.current
    if (audio) {
      audio.muted = nextMuted
    }
    quinceSynth.setMuted(nextMuted)
  }

  return (
    <>
      <audio
        ref={audioRef}
        src={currentTrack.src || "/audio/love_story_x_golden_brown.m4a"}
        loop
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />

      {/* Floating Music Bar Widget - Ultra Clean Luxury Design */}
      <div className="fixed bottom-4 left-4 z-40 flex items-center gap-2 max-w-[94vw]">
        <div className="glass-card pl-2.5 pr-3.5 py-2 rounded-full border-2 border-gold/50 shadow-2xl flex items-center gap-2.5 backdrop-blur-xl bg-cream/95 transition-all duration-300">
          {/* Animated Spinning Play/Pause Button */}
          <button
            type="button"
            onClick={togglePlay}
            className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gradient-to-r from-gold to-gold-dark text-text-main flex items-center justify-center text-sm shadow-md hover:scale-105 active:scale-95 transition-all shrink-0 cursor-pointer ${
              isPlaying ? 'ring-2 ring-gold/40' : 'opacity-85'
            }`}
            title={isPlaying ? "Pausar música" : "Reproducir música"}
          >
            {isPlaying ? '⏸' : '▶'}
          </button>

          {/* Song Info (Love Story) */}
          <div
            onClick={togglePlay}
            className="cursor-pointer max-w-[150px] sm:max-w-[210px] select-none text-left"
            title="Toca para pausar o reanudar música"
          >
            <div className="flex items-center gap-1.5">
              <span className="text-xs shrink-0">🎻</span>
              <p className="font-montserrat font-bold text-xs text-text-main truncate leading-tight">
                Love Story
              </p>
            </div>
            <p className="text-[10px] font-montserrat text-gold-dark truncate font-medium">
              {isPlaying ? '♫ Sonando de fondo' : 'Música pausada · Toca ▶'}
            </p>
          </div>

          {/* Mute toggle button */}
          <div className="flex items-center pl-1 border-l border-gold/30">
            <button
              type="button"
              onClick={toggleMute}
              className="w-7 h-7 rounded-full hover:bg-gold/15 flex items-center justify-center text-xs text-text-sub hover:text-gold-dark transition-colors cursor-pointer"
              title={muted ? "Activar sonido" : "Silenciar"}
            >
              {muted ? '🔇' : '🔊'}
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

// ─── Countdown Hook ────────────────────────────────────────────────────────────
function useCountdown(target: Date) {
  const calc = useCallback(() => {
    const diff = Math.max(0, target.getTime() - Date.now())
    return {
      days: Math.floor(diff / 86400000),
      hours: Math.floor((diff % 86400000) / 3600000),
      minutes: Math.floor((diff % 3600000) / 60000),
      seconds: Math.floor((diff % 60000) / 1000),
    }
  }, [target])

  const [time, setTime] = useState(calc)
  useEffect(() => {
    const id = setInterval(() => setTime(calc()), 1000)
    return () => clearInterval(id)
  }, [calc])
  return time
}

// ─── Toast Notification System ─────────────────────────────────────────────────
function Toast({ message, onClose }: { message: string; onClose: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3500)
    return () => clearTimeout(timer)
  }, [onClose])

  return (
    <div className="fixed bottom-4 right-4 z-50 glass-card px-4 py-3 rounded-2xl flex items-center gap-3 animate-toast border-gold/50 shadow-2xl max-w-[90vw]">
      <GoldButterfly size={18} className="shrink-0" />
      <p className="text-xs font-montserrat font-semibold text-text-main">{message}</p>
      <button onClick={onClose} className="text-gold-dark/60 hover:text-gold-dark text-xs ml-1 shrink-0">✕</button>
    </div>
  )
}

// ─── Decorative Gold Star / Butterfly Dividers ─────────────────────────────────
function GoldStar({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path
        d="M12 2C13.5 6 18 10.5 22 12C18 13.5 13.5 18 12 22C10.5 18 6 13.5 2 12C6 10.5 10.5 6 12 2Z"
        fill="url(#goldGrad)"
      />
      <defs>
        <linearGradient id="goldGrad" x1="0" y1="0" x2="24" y2="24">
          <stop offset="0%" stopColor="#F9E79F" />
          <stop offset="50%" stopColor="#D4AF37" />
          <stop offset="100%" stopColor="#B8860B" />
        </linearGradient>
      </defs>
    </svg>
  )
}

function GoldDivider() {
  return (
    <div className="flex items-center gap-3 w-full max-w-xs md:max-w-sm mx-auto my-3 md:my-4">
      <hr className="flex-1 gold-line" />
      <GoldStar size={14} />
      <hr className="flex-1 gold-line" />
    </div>
  )
}

function SectionHeader({ tag, title }: { tag: string; title: React.ReactNode }) {
  return (
    <div className="text-center mb-10 md:mb-14 px-2">
      <p className="text-[10px] md:text-[11px] uppercase tracking-[0.35em] md:tracking-[0.45em] font-montserrat text-gold-dark/80 mb-2 font-bold flex items-center justify-center gap-2">
        <GoldButterfly size={13} /> {tag} <GoldButterfly size={13} />
      </p>
      <h2 className="text-4xl sm:text-5xl md:text-7xl font-greatvibes gold-text-gradient py-1">
        {title}
      </h2>
      <GoldDivider />
    </div>
  )
}

// ─── 3D Parallax Tilt Card Component ──────────────────────────────────────────
function ParallaxCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const cardRef = useRef<HTMLDivElement | null>(null)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current
    if (!card) return
    const rect = card.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const centerX = rect.width / 2
    const centerY = rect.height / 2
    const rotateX = ((y - centerY) / centerY) * -10
    const rotateY = ((x - centerX) / centerX) * 10

    card.style.setProperty('--rx', `${rotateX}deg`)
    card.style.setProperty('--ry', `${rotateY}deg`)
  }

  const handleMouseLeave = () => {
    const card = cardRef.current
    if (!card) return
    card.style.setProperty('--rx', `0deg`)
    card.style.setProperty('--ry', `0deg`)
  }

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`tilt-card ${className}`}
    >
      {children}
    </div>
  )
}

// ─── Arrival Guide Component (Guía de Ubicaciones: Misa & Salón) ──────────────
function ArrivalGuideSection({ onTriggerToast }: { onTriggerToast: (msg: string) => void }) {
  const [activeLocation, setActiveLocation] = useState<'church' | 'venue'>('church')

  const copyAddress = (type: 'church' | 'venue') => {
    if (type === 'church') {
      navigator.clipboard.writeText(`${CHURCH_NAME} · ${CHURCH_ADDRESS} (${CHURCH_COORDINATES})`)
      onTriggerToast("¡Ubicación del Templo copiada al portapapeles! ⛪")
    } else {
      navigator.clipboard.writeText(`${VENUE_NAME} · ${VENUE_COORDINATES}`)
      onTriggerToast("¡Ubicación del Salón copiada al portapapeles! 🏰")
    }
  }

  return (
    <section id="llegada" className="relative py-16 md:py-24 px-4 md:px-6">
      <div className="section-sep mb-16 md:mb-20" />
      <div className="max-w-4xl mx-auto">
        <SectionHeader
          tag="Ubicación & Traslado"
          title="Guía de Ubicaciones & Traslado"
        />
        <p className="text-center font-montserrat text-xs md:text-sm text-text-sub font-medium -mt-6 mb-8 max-w-xl mx-auto">
          Encuentra las rutas oficiales en Google Maps y Waze para acompañarnos
        </p>

        {/* Location Switcher Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-8">
          <button
            onClick={() => setActiveLocation('church')}
            className={`px-5 py-3 rounded-full text-xs md:text-sm font-montserrat font-bold transition-all duration-300 flex items-center gap-2.5 shadow-md cursor-pointer ${
              activeLocation === 'church'
                ? 'bg-gradient-to-r from-gold via-gold-light to-gold-dark text-white scale-105 ring-2 ring-gold/50'
                : 'glass-card border border-gold/40 text-text-sub hover:text-text-main hover:bg-gold/10'
            }`}
          >
            <span className="text-xl">⛪</span>
            <div className="text-left">
              <span className="block leading-tight">1. Ceremonia Religiosa</span>
              <span className="text-[10px] opacity-90 font-normal">Templo de la Sagrada Familia · 1:00 PM</span>
            </div>
          </button>

          <button
            onClick={() => setActiveLocation('venue')}
            className={`px-5 py-3 rounded-full text-xs md:text-sm font-montserrat font-bold transition-all duration-300 flex items-center gap-2.5 shadow-md cursor-pointer ${
              activeLocation === 'venue'
                ? 'bg-gradient-to-r from-gold via-gold-light to-gold-dark text-white scale-105 ring-2 ring-gold/50'
                : 'glass-card border border-gold/40 text-text-sub hover:text-text-main hover:bg-gold/10'
            }`}
          >
            <span className="text-xl">🏰</span>
            <div className="text-left">
              <span className="block leading-tight">2. Recepción & Fiesta</span>
              <span className="text-[10px] opacity-90 font-normal">Salón Quinta María Teresa · 3:00 PM</span>
            </div>
          </button>
        </div>

        {/* Location Detail Card */}
        {activeLocation === 'church' ? (
          <ParallaxCard className="glass-card p-6 md:p-10 rounded-3xl border-2 border-gold/40 flex flex-col md:flex-row gap-8 shadow-2xl items-center animate-fade-in">
            <div className="w-full md:w-1/2 flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <span className="text-4xl">⛪</span>
                <div>
                  <span className="text-[10px] uppercase tracking-widest font-montserrat text-gold-dark font-bold">Ceremonia Religiosa</span>
                  <h3 className="font-playfair text-2xl text-text-main font-bold">{CHURCH_NAME}</h3>
                  <p className="text-xs font-montserrat text-gold-dark font-semibold mt-0.5">{CHURCH_TIME}</p>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-gold/10 border border-gold/30 flex items-start gap-2.5">
                <span className="text-base mt-0.5">📍</span>
                <div>
                  <p className="text-xs font-montserrat text-text-main font-bold">Dirección Oficial:</p>
                  <p className="text-xs font-montserrat text-text-sub mt-0.5">{CHURCH_ADDRESS}</p>
                  <p className="text-[11px] font-montserrat text-gold-dark font-semibold mt-1">Coordenadas: {CHURCH_COORDINATES}</p>
                </div>
              </div>

              <p className="font-montserrat text-xs md:text-sm text-text-sub leading-relaxed font-medium">
                Acompáñanos a bendecir los 15 Años de Krista Mariel en una solemne y emotiva Eucaristía de Acción de Gracias junto a sus padres, padrinos y seres queridos.
              </p>

              <div className="glass-card p-4 rounded-2xl border border-gold/30 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xl">⏱️</span>
                  <div>
                    <span className="text-[9px] uppercase tracking-widest font-montserrat text-gold-dark font-bold">Traslado hacia el Salón</span>
                    <p className="font-playfair text-sm text-text-main font-bold">~12 min en automóvil</p>
                  </div>
                </div>
                <span className="text-xs font-montserrat text-gold-dark font-bold bg-gold/15 px-2.5 py-1 rounded-full border border-gold/30">Misa 1:00 PM</span>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 mt-2">
                <a
                  href={CHURCH_WAZE}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 py-3 px-4 rounded-2xl bg-[#33CCFF]/15 border border-[#33CCFF]/40 text-text-main font-montserrat font-bold text-xs flex items-center justify-center gap-2 shadow-sm hover:scale-105 transition-all"
                >
                  <span>🚗</span> Abrir en Waze
                </a>
                <a
                  href={CHURCH_MAPS}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 py-3 px-4 rounded-2xl bg-gold/20 border border-gold text-gold-dark font-montserrat font-bold text-xs flex items-center justify-center gap-2 shadow-sm hover:scale-105 transition-all"
                >
                  <span>🗺️</span> Google Maps
                </a>
              </div>

              <button
                onClick={() => copyAddress('church')}
                className="py-2.5 px-4 rounded-xl border border-gold/40 glass-card text-text-sub font-montserrat font-semibold text-xs text-center hover:text-gold-dark transition-colors cursor-pointer flex items-center justify-center gap-2"
              >
                <span>📋</span> Copiar Dirección y Coordenadas del Templo
              </button>
            </div>

            <div className="w-full md:w-1/2 aspect-video md:aspect-square rounded-2xl overflow-hidden border-2 border-gold relative shadow-lg">
              <iframe
                title="Mapa Templo de la Sagrada Familia"
                src="https://maps.google.com/maps?q=23.1721248626709,-102.8712387084961&t=&z=16&ie=UTF8&iwloc=&output=embed"
                className="w-full h-full border-0 filter saturate-150"
                loading="lazy"
              />
            </div>
          </ParallaxCard>
        ) : (
          <ParallaxCard className="glass-card p-6 md:p-10 rounded-3xl border-2 border-gold/40 flex flex-col md:flex-row gap-8 shadow-2xl items-center animate-fade-in">
            <div className="w-full md:w-1/2 flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <span className="text-4xl">🏰</span>
                <div>
                  <span className="text-[10px] uppercase tracking-widest font-montserrat text-gold-dark font-bold">Lugar de la Recepción</span>
                  <h3 className="font-playfair text-2xl text-text-main font-bold">{VENUE_NAME}</h3>
                  <p className="text-xs font-montserrat text-gold-dark font-semibold mt-0.5">{VENUE_TIME} en adelante</p>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-gold/10 border border-gold/30 flex items-start gap-2.5">
                <span className="text-base mt-0.5">📍</span>
                <div>
                  <p className="text-xs font-montserrat text-text-main font-bold">Ubicación del Salón:</p>
                  <p className="text-xs font-montserrat text-text-sub mt-0.5">Fresnillo, Zacatecas</p>
                  <p className="text-[11px] font-montserrat text-gold-dark font-semibold mt-1">Coordenadas: {VENUE_COORDINATES}</p>
                </div>
              </div>

              <p className="font-montserrat text-xs md:text-sm text-text-sub leading-relaxed font-medium">
                Contamos con amplio estacionamiento, seguridad privada y accesos cómodos para recibirte como te mereces en esta gran noche de gala y celebración.
              </p>

              <div className="glass-card p-4 rounded-2xl border border-gold/30 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xl">🌤️</span>
                  <div>
                    <span className="text-[9px] uppercase tracking-widest font-montserrat text-gold-dark font-bold">Clima Previsto (17 de Octubre)</span>
                    <p className="font-playfair text-sm text-text-main font-bold">24°C · Cielos Despejados</p>
                  </div>
                </div>
                <span className="text-xs font-montserrat text-gold-dark font-bold bg-gold/15 px-2.5 py-1 rounded-full border border-gold/30">Ideal Fiesta</span>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 mt-2">
                <a
                  href={VENUE_WAZE}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 py-3 px-4 rounded-2xl bg-[#33CCFF]/15 border border-[#33CCFF]/40 text-text-main font-montserrat font-bold text-xs flex items-center justify-center gap-2 shadow-sm hover:scale-105 transition-all"
                >
                  <span>🚗</span> Abrir en Waze
                </a>
                <a
                  href={VENUE_MAPS}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 py-3 px-4 rounded-2xl bg-gold/20 border border-gold text-gold-dark font-montserrat font-bold text-xs flex items-center justify-center gap-2 shadow-sm hover:scale-105 transition-all"
                >
                  <span>🗺️</span> Google Maps
                </a>
              </div>

              <button
                onClick={() => copyAddress('venue')}
                className="py-2.5 px-4 rounded-xl border border-gold/40 glass-card text-text-sub font-montserrat font-semibold text-xs text-center hover:text-gold-dark transition-colors cursor-pointer flex items-center justify-center gap-2"
              >
                <span>📋</span> Copiar Coordenadas del Salón de Eventos
              </button>
            </div>

            <div className="w-full md:w-1/2 aspect-video md:aspect-square rounded-2xl overflow-hidden border-2 border-gold relative shadow-lg">
              <iframe
                title="Mapa Salón de Eventos"
                src="https://maps.google.com/maps?q=23.1751881,-102.9076614&t=&z=16&ie=UTF8&iwloc=&output=embed"
                className="w-full h-full border-0 filter saturate-150"
                loading="lazy"
              />
            </div>
          </ParallaxCard>
        )}

        {/* Route Connection Tip Card */}
        <div className="mt-6 p-4 rounded-2xl bg-gold/10 border border-gold/30 flex items-center justify-center gap-3 text-center">
          <span className="text-xl shrink-0">🚗</span>
          <p className="text-xs font-montserrat text-text-sub font-medium">
            <strong className="text-gold-dark font-bold">Traslado entre sedes:</strong> Al concluir la Misa (2:00 PM), hay 1 hora completa para trasladarse cómodamente al Salón (~12 a 15 minutos en coche). ¡Las puertas de Quinta María Teresa abren a las 3:00 PM!
          </p>
        </div>
      </div>
    </section>
  )
}

// ─── Giant Golden 3D Animated Butterfly Seal ────────────────────────────────────
function GiantGoldenButterflySeal({ isOpening }: { isOpening: boolean }) {
  return (
    <div className={`relative flex items-center justify-center transition-all duration-1000 my-2 md:my-4 ${isOpening ? 'scale-150 opacity-0 rotate-12' : 'hover:scale-105'}`}>
      {/* Golden Aura Glow */}
      <div className="absolute w-36 h-36 md:w-44 md:h-44 rounded-full bg-gold/30 blur-2xl animate-pulse-glow pointer-events-none" />

      {/* Flapping SVG Butterfly Wings */}
      <svg
        viewBox="0 0 200 160"
        className="w-44 h-36 md:w-52 md:h-40 drop-shadow-[0_10px_25px_rgba(212,175,55,0.7)] animate-float-slow"
      >
        <defs>
          <linearGradient id="butterflyGold" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFF5B8" />
            <stop offset="35%" stopColor="#F9E79F" />
            <stop offset="70%" stopColor="#D4AF37" />
            <stop offset="100%" stopColor="#9A7B38" />
          </linearGradient>
          <radialGradient id="wingGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FFF8C5" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#D4AF37" stopOpacity="0.4" />
          </radialGradient>
        </defs>

        {/* Left Wings */}
        <g className="origin-[100px_80px] animate-[butterfly-flap_2.8s_ease-in-out_infinite]">
          {/* Top Left Wing */}
          <path
            d="M100 80 C60 10, 10 30, 20 85 C30 115, 80 110, 100 80 Z"
            fill="url(#butterflyGold)"
            stroke="#6E531E"
            strokeWidth="1.5"
          />
          <path
            d="M95 75 C70 30, 30 45, 35 75 C45 95, 80 95, 95 75 Z"
            fill="url(#wingGlow)"
          />
          {/* Bottom Left Wing */}
          <path
            d="M100 80 C65 95, 30 120, 50 145 C75 160, 95 125, 100 80 Z"
            fill="url(#butterflyGold)"
            stroke="#6E531E"
            strokeWidth="1.2"
            opacity="0.9"
          />
        </g>

        {/* Right Wings */}
        <g className="origin-[100px_80px] animate-[butterfly-flap_2.8s_ease-in-out_infinite]" style={{ animationDelay: '0.1s' }}>
          {/* Top Right Wing */}
          <path
            d="M100 80 C140 10, 190 30, 180 85 C170 115, 120 110, 100 80 Z"
            fill="url(#butterflyGold)"
            stroke="#6E531E"
            strokeWidth="1.5"
          />
          <path
            d="M105 75 C130 30, 170 45, 165 75 C155 95, 120 95, 105 75 Z"
            fill="url(#wingGlow)"
          />
          {/* Bottom Right Wing */}
          <path
            d="M100 80 C135 95, 170 120, 150 145 C125 160, 105 125, 100 80 Z"
            fill="url(#butterflyGold)"
            stroke="#6E531E"
            strokeWidth="1.2"
            opacity="0.9"
          />
        </g>

        {/* Butterfly Body */}
        <ellipse cx="100" cy="80" rx="4" ry="24" fill="#6E531E" stroke="#D4AF37" strokeWidth="1" />
        <circle cx="100" cy="54" r="5" fill="#9A7B38" />
        {/* Antennae */}
        <path d="M98 52 Q88 38 82 34" stroke="#9A7B38" strokeWidth="1.8" fill="none" strokeLinecap="round" />
        <path d="M102 52 Q112 38 118 34" stroke="#9A7B38" strokeWidth="1.8" fill="none" strokeLinecap="round" />
      </svg>

      {/* Central Monogram Wax Seal */}
      <div className="absolute w-16 h-16 md:w-20 md:h-20 rounded-full bg-gradient-to-br from-gold-light via-gold to-gold-dark p-1 shadow-2xl flex items-center justify-center">
        <div className="w-full h-full rounded-full bg-cream border-2 border-gold flex flex-col items-center justify-center shadow-inner">
          <span className="font-cinzel text-xl md:text-2xl font-bold text-gold-dark leading-none">KM</span>
          <span className="text-[7px] uppercase tracking-widest text-gold-dark font-bold mt-0.5">Abrir</span>
        </div>
      </div>
    </div>
  )
}

// ─── Welcome Intro Cinema Video Modal ──────────────────────────────────────────
function IntroVideoModal({
  isOpen,
  onFinish,
  onTriggerBurst,
}: {
  isOpen: boolean
  onFinish: () => void
  onTriggerBurst?: () => void
}) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [hasStarted, setHasStarted] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const progressFillRef = useRef<HTMLDivElement | null>(null)
  const timeDisplayRef = useRef<HTMLSpanElement | null>(null)

  useEffect(() => {
    if (isOpen) {
      window.dispatchEvent(new CustomEvent('pause-bg-music'))
      window.dispatchEvent(new CustomEvent('pause-butterflies'))
    } else {
      window.dispatchEvent(new CustomEvent('resume-butterflies'))
    }
    return () => {
      window.dispatchEvent(new CustomEvent('resume-butterflies'))
    }
  }, [isOpen])

  if (!isOpen) return null

  const formatSec = (sec: number) => {
    const s = Math.floor(sec)
    const m = Math.floor(s / 60)
    const rem = s % 60
    return `${m}:${rem < 10 ? '0' : ''}${rem}`
  }

  const handleStartPlay = () => {
    const video = videoRef.current
    if (!video) return

    window.dispatchEvent(new CustomEvent('pause-bg-music'))
    window.dispatchEvent(new CustomEvent('pause-butterflies'))

    if (onTriggerBurst && !hasStarted) {
      onTriggerBurst()
    }

    video.play().then(() => {
      setIsPlaying(true)
      setHasStarted(true)
    }).catch(err => {
      console.warn("Autoplay gesture required", err)
    })
  }

  const handleTogglePlay = () => {
    const video = videoRef.current
    if (!video) return
    if (isPlaying) {
      video.pause()
      setIsPlaying(false)
    } else {
      handleStartPlay()
    }
  }

  const handleTimeUpdate = () => {
    const video = videoRef.current
    if (!video) return
    const cur = video.currentTime
    const dur = video.duration || 36
    const pct = Math.min(100, (cur / dur) * 100)
    if (progressFillRef.current) {
      progressFillRef.current.style.width = `${pct}%`
    }
    if (timeDisplayRef.current) {
      timeDisplayRef.current.textContent = `${formatSec(cur)} / ${formatSec(dur)}`
    }
    if (dur > 0 && cur >= dur - 0.4) {
      handleSkipOrFinish()
    }
  }

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const video = videoRef.current
    if (!video) return
    const rect = e.currentTarget.getBoundingClientRect()
    const pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width))
    const targetTime = pct * (video.duration || 36)
    video.currentTime = targetTime
    if (progressFillRef.current) {
      progressFillRef.current.style.width = `${pct * 100}%`
    }
  }

  const toggleMute = () => {
    const video = videoRef.current
    if (video) {
      const nextMuted = !isMuted
      video.muted = nextMuted
      setIsMuted(nextMuted)
    }
  }

  const handleSkipOrFinish = () => {
    if (videoRef.current) {
      videoRef.current.pause()
    }
    window.dispatchEvent(new CustomEvent('resume-butterflies'))
    onFinish()
  }

  return (
    <div className="fixed inset-0 z-50 bg-[#0C0A09]/95 backdrop-blur-2xl flex flex-col items-center justify-between p-4 sm:p-6 animate-fade-in select-none overflow-y-auto">
      {/* Dynamic Background Atmosphere */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-gold/15 rounded-full blur-[120px]" />
        <div className="absolute -bottom-24 left-1/2 -translate-x-1/2 w-[400px] h-[400px] bg-gold/10 rounded-full blur-[100px]" />
      </div>

      {/* Top Bar - Solo botón discreto para saltar directo al Sobre */}
      <div className="relative z-10 w-full max-w-[360px] flex items-center justify-end pt-1">
        <button
          onClick={handleSkipOrFinish}
          className="px-4 py-2 rounded-full border border-gold/60 bg-black/70 text-gold-light text-xs font-montserrat uppercase tracking-wider font-bold hover:bg-gold/25 flex items-center gap-2 transition-all shadow-xl cursor-pointer backdrop-blur-md"
        >
          <span>Abrir Sobre</span>
          <span>✉️</span>
        </button>
      </div>

      {/* Central Video Frame */}
      <div className="relative z-10 my-auto w-full max-w-[320px] sm:max-w-[360px] aspect-[9/16] rounded-3xl overflow-hidden border-2 border-gold shadow-[0_0_70px_rgba(212,175,55,0.4)] bg-black">
        {/* Filigree Gold Corners */}
        <div className="absolute top-2.5 left-2.5 w-6 h-6 border-t-2 border-l-2 border-gold pointer-events-none z-20" />
        <div className="absolute top-2.5 right-2.5 w-6 h-6 border-t-2 border-r-2 border-gold pointer-events-none z-20" />
        <div className="absolute bottom-2.5 left-2.5 w-6 h-6 border-b-2 border-l-2 border-gold pointer-events-none z-20" />
        <div className="absolute bottom-2.5 right-2.5 w-6 h-6 border-b-2 border-r-2 border-gold pointer-events-none z-20" />

        {/* Hardware-Accelerated Video Element */}
        <video
          ref={videoRef}
          src="/videos/krista_quinceanera_video.mp4"
          poster="/images/krista_portrait_1.jpg"
          playsInline
          preload="auto"
          style={{ transform: 'translateZ(0)', willChange: 'transform' }}
          onTimeUpdate={handleTimeUpdate}
          onEnded={handleSkipOrFinish}
          onClick={handleTogglePlay}
          className="absolute inset-0 w-full h-full object-cover cursor-pointer transform-gpu"
        />

        {/* Start / Play Clean Overlay */}
        {!hasStarted && (
          <div
            onClick={handleStartPlay}
            className="absolute inset-0 z-20 bg-black/45 hover:bg-black/35 flex flex-col items-center justify-center p-6 text-center cursor-pointer group transition-all"
          >
            <div className="relative flex flex-col items-center justify-center gap-3">
              <div className="relative flex items-center justify-center">
                <div className="absolute w-24 h-24 rounded-full bg-gold/30 blur-2xl animate-pulse-glow" />
                <div className="w-18 h-18 sm:w-20 sm:h-20 rounded-full border-2 border-gold bg-gradient-to-tr from-gold-dark via-gold to-gold-light flex items-center justify-center shadow-2xl group-hover:scale-110 active:scale-95 transition-transform text-text-main">
                  <svg className="w-8 h-8 ml-1 fill-current" viewBox="0 0 24 24">
                    <polygon points="5 3 19 12 5 21 5 3" />
                  </svg>
                </div>
              </div>
              <span className="text-xs uppercase tracking-[0.25em] font-montserrat text-gold-light font-bold drop-shadow">
                Toca para Iniciar
              </span>
            </div>
          </div>
        )}

        {/* Bottom Control Bar during playback */}
        <div className={`absolute bottom-0 inset-x-0 z-20 p-3 pt-6 bg-gradient-to-t from-black/95 via-black/70 to-transparent flex flex-col gap-2 transition-opacity duration-300 pointer-events-auto ${hasStarted ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
          <div
            onClick={handleProgressClick}
            className="relative w-full h-1.5 hover:h-2 bg-white/20 rounded-full cursor-pointer overflow-hidden transition-all"
            title="Avanzar o retroceder"
          >
            <div
              ref={progressFillRef}
              className="absolute left-0 top-0 bottom-0 bg-gradient-to-r from-gold-light via-gold to-gold-dark rounded-full transition-none w-0"
            />
          </div>

          <div className="flex items-center justify-between text-white text-xs">
            <div className="flex items-center gap-2">
              <button
                onClick={handleTogglePlay}
                className="w-7 h-7 rounded-full border border-gold/60 bg-gold/20 flex items-center justify-center text-gold-light hover:bg-gold/40 transition-colors cursor-pointer text-xs"
              >
                {isPlaying ? '⏸' : '▶'}
              </button>
              <button
                onClick={toggleMute}
                className="text-white/80 hover:text-white transition-colors cursor-pointer text-xs"
              >
                {isMuted ? '🔇' : '🔊'}
              </button>
              <span ref={timeDisplayRef} className="text-[9px] font-montserrat text-white/90">
                0:00 / 0:36
              </span>
            </div>

            <button
              onClick={handleSkipOrFinish}
              className="px-2.5 py-1 rounded-full bg-gradient-to-r from-gold to-gold-dark text-text-main text-[9px] font-montserrat uppercase tracking-wider font-bold hover:brightness-110 transition-all flex items-center gap-1 cursor-pointer"
            >
              <span>Abrir Sobre</span>
              <span>✉️</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Luxury 3D Interactive Envelope Modal ─────────────────────────────────────
function EnvelopeModal({
  isOpen,
  onClose,
  onTriggerExplosiveBurst
}: {
  isOpen: boolean
  onClose: () => void
  onTriggerExplosiveBurst: () => void
}) {
  const [opening, setOpening] = useState(false)
  const [flash, setFlash] = useState(false)

  if (!isOpen) return null

  const handleOpen = () => {
    if (opening) return
    setOpening(true)
    setFlash(true)

    onTriggerExplosiveBurst()

    setTimeout(() => {
      onClose()
    }, 1300)
  }

  return (
    <div className="fixed inset-0 z-50 bg-[#0F0B14]/92 backdrop-blur-2xl flex flex-col items-center justify-center p-4 select-none animate-fade-in overflow-hidden">
      {/* Warm golden ambient glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-gold/20 rounded-full blur-[140px]" />
      </div>

      {flash && (
        <div
          className="fixed inset-0 pointer-events-none z-50 animate-fade-in"
          style={{
            background: 'radial-gradient(circle at center, rgba(255, 245, 184, 0.98) 0%, rgba(212, 175, 55, 0.7) 45%, transparent 75%)',
            animationDuration: '1.3s',
          }}
        />
      )}

      {/* Main Envelope Container */}
      <div className="relative z-10 w-full max-w-[440px] flex flex-col items-center">
        {/* Subtle Top Invitation Label */}
        <p className="text-[10px] uppercase tracking-[0.35em] text-gold-light font-montserrat font-bold mb-3 text-center drop-shadow">
          Invitación de Gala · XV Años
        </p>

        {/* 3D Realistic Royal Envelope */}
        <div
          onClick={handleOpen}
          className={`relative w-full aspect-[1.48/1] rounded-2xl cursor-pointer group shadow-[0_25px_60px_rgba(0,0,0,0.8),0_0_50px_rgba(212,175,55,0.35)] transition-all duration-1000 ${
            opening ? 'scale-110 opacity-0 translate-y-4' : 'hover:scale-[1.02]'
          }`}
          style={{ perspective: '1200px' }}
        >
          {/* Base Envelope Paper Texture & Double Gold Border */}
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-[#FFFDF9] via-[#FAF3E6] to-[#F1E4CE] border-2 border-gold/80 overflow-hidden shadow-2xl">
            {/* Fine Paper Watermark subtle grid */}
            <div className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(#D4AF37_1px,transparent_1px)] [background-size:16px_16px]" />

            {/* Inner Gold Inlay Trim */}
            <div className="absolute inset-2.5 rounded-xl border border-gold/40 pointer-events-none" />

            {/* Filigree Gold Corners */}
            <div className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-gold pointer-events-none" />
            <div className="absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 border-gold pointer-events-none" />
            <div className="absolute bottom-4 left-4 w-6 h-6 border-b-2 border-l-2 border-gold pointer-events-none" />
            <div className="absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 border-gold pointer-events-none" />

            {/* Inside Peeking Card (Slides up when opening) */}
            <div
              className={`absolute inset-x-6 top-6 bottom-6 bg-gradient-to-b from-white via-cream to-[#FDF8EE] rounded-xl border border-gold/60 p-4 flex flex-col items-center justify-between text-center transition-transform duration-1000 ${
                opening ? '-translate-y-20 scale-105 shadow-2xl' : 'translate-y-0'
              }`}
            >
              <span className="text-[8px] uppercase tracking-[0.3em] font-montserrat font-bold text-gold-dark">
                Krista Mariel Sandoval Caldera
              </span>
              <h3 className="font-greatvibes text-2xl sm:text-3xl text-gold-dark leading-tight">
                Mis Quince Años
              </h3>
              <span className="text-[9px] font-montserrat text-text-sub font-semibold tracking-wider">
                17 de Octubre, 2026
              </span>
            </div>

            {/* Realistic Envelope Folds (Bottom & Side Flaps) */}
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none"
              viewBox="0 0 440 297"
              fill="none"
              preserveAspectRatio="none"
            >
              <defs>
                <linearGradient id="foldGradientLeft" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#FAF3E6" stopOpacity="0.95" />
                  <stop offset="100%" stopColor="#EAD8BC" stopOpacity="0.9" />
                </linearGradient>
                <linearGradient id="foldGradientRight" x1="1" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#FAF3E6" stopOpacity="0.95" />
                  <stop offset="100%" stopColor="#EAD8BC" stopOpacity="0.9" />
                </linearGradient>
                <linearGradient id="foldGradientBottom" x1="0" y1="1" x2="0" y2="0">
                  <stop offset="0%" stopColor="#EAD8BC" stopOpacity="0.98" />
                  <stop offset="100%" stopColor="#FAF3E6" stopOpacity="0.95" />
                </linearGradient>
                <filter id="foldShadow" x="-10%" y="-10%" width="120%" height="120%">
                  <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#9A7B38" floodOpacity="0.25" />
                </filter>
              </defs>

              {/* Left Triangular Flap */}
              <path
                d="M 0 0 L 220 155 L 0 297 Z"
                fill="url(#foldGradientLeft)"
                stroke="#D4AF37"
                strokeWidth="0.75"
                filter="url(#foldShadow)"
              />

              {/* Right Triangular Flap */}
              <path
                d="M 440 0 L 220 155 L 440 297 Z"
                fill="url(#foldGradientRight)"
                stroke="#D4AF37"
                strokeWidth="0.75"
                filter="url(#foldShadow)"
              />

              {/* Bottom Triangular Flap */}
              <path
                d="M 0 297 L 220 155 L 440 297 Z"
                fill="url(#foldGradientBottom)"
                stroke="#D4AF37"
                strokeWidth="1"
                filter="url(#foldShadow)"
              />
            </svg>

            {/* Top Triangular Flap (Solapa Superior que sella el sobre) */}
            <div
              className={`absolute top-0 left-0 right-0 h-[158px] origin-top transition-all duration-700 pointer-events-none ${
                opening ? '-rotate-x-180 opacity-0' : 'rotate-x-0'
              }`}
              style={{ transformStyle: 'preserve-3d' }}
            >
              <svg
                className="w-full h-full"
                viewBox="0 0 440 158"
                fill="none"
                preserveAspectRatio="none"
              >
                <defs>
                  <linearGradient id="topFlapGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#FFFDF9" />
                    <stop offset="60%" stopColor="#FAF2E3" />
                    <stop offset="100%" stopColor="#EFE0C6" />
                  </linearGradient>
                  <filter id="topFlapShadow" x="-10%" y="-10%" width="120%" height="130%">
                    <feDropShadow dx="0" dy="5" stdDeviation="5" floodColor="#2D1F38" floodOpacity="0.45" />
                  </filter>
                </defs>
                <path
                  d="M 0 0 L 220 155 L 440 0 Z"
                  fill="url(#topFlapGradient)"
                  stroke="#D4AF37"
                  strokeWidth="1.5"
                  filter="url(#topFlapShadow)"
                />
                {/* Gold Inner Flap Line */}
                <path
                  d="M 20 5 L 220 142 L 420 5"
                  stroke="#D4AF37"
                  strokeWidth="0.8"
                  strokeDasharray="4 2"
                  fill="none"
                  opacity="0.8"
                />
              </svg>
            </div>
          </div>

          {/* Golden 3D Butterfly Seal positioned right over the flap apex */}
          <div className="absolute top-[52%] left-1/2 -translate-x-1/2 -translate-y-1/2 z-30">
            <GiantGoldenButterflySeal isOpening={opening} />
          </div>
        </div>

        {/* Bottom Helper Indicator */}
        <div className="mt-5 flex flex-col items-center gap-2 text-center">
          <p className="text-xs font-montserrat text-gold-light tracking-wider font-semibold animate-pulse">
            ✨ Toca la mariposa dorada para abrir el sobre ✨
          </p>
          <button
            onClick={handleOpen}
            className="text-[11px] text-gold/70 hover:text-gold uppercase tracking-widest font-montserrat underline underline-offset-4 transition-colors cursor-pointer"
          >
            Entrar directo a la invitación →
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Interactive QR Code Modal ─────────────────────────────────────────────────
function QRCodeModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [targetUrl, setTargetUrl] = useState<string>('')
  const [qrDataUrl, setQrDataUrl] = useState<string>('')
  const [copied, setCopied] = useState(false)
  const [showEdit, setShowEdit] = useState(false)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
      const initial = isLocal ? PRODUCTION_URL : window.location.href.split('#')[0]
      setTargetUrl(initial)
    }
  }, [isOpen])

  useEffect(() => {
    if (!targetUrl) return
    const fallbackUrl = `https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encodeURIComponent(targetUrl)}`
    QRCode.toDataURL(targetUrl, {
      width: 400,
      margin: 2,
      errorCorrectionLevel: 'M',
      color: {
        dark: '#2D1F38',
        light: '#FFFFFF',
      },
    })
      .then(url => setQrDataUrl(url))
      .catch(err => {
        console.error('Error generating QR Code:', err)
        setQrDataUrl(fallbackUrl)
      })
  }, [targetUrl])

  if (!isOpen) return null

  const isLocal = typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
  const displayQr = qrDataUrl || (targetUrl ? `https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encodeURIComponent(targetUrl)}` : '')

  const handleCopy = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(targetUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    }
  }

  const handleDownload = () => {
    const src = displayQr
    if (!src) return
    const a = document.createElement('a')
    a.href = src
    a.download = 'QR_Invitacion_KristaMariel.png'
    a.target = '_blank'
    a.click()
  }

  return (
    <div
      className="fixed inset-0 z-50 bg-cream/90 backdrop-blur-2xl flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        onClick={e => e.stopPropagation()}
        className="glass-card p-6 md:p-8 rounded-3xl max-w-sm w-full text-center flex flex-col items-center gap-4 border-2 border-gold/50 shadow-2xl relative"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gold-dark hover:text-gold text-lg font-bold cursor-pointer"
          title="Cerrar"
        >
          ✕
        </button>

        <div className="text-center">
          <p className="text-[10px] uppercase tracking-widest text-gold-dark font-bold font-montserrat">
            Escanear para compartir
          </p>
          <h3 className="font-greatvibes text-4xl gold-text-gradient mt-1">XV Años de Krista Mariel</h3>
        </div>

        {/* Real Scannable QR Code Image */}
        <div className="p-3 bg-white rounded-2xl shadow-xl border-4 border-gold/40 relative flex items-center justify-center">
          {displayQr ? (
            <img
              src={displayQr}
              alt="Código QR oficial para abrir la invitación digital"
              className="w-48 h-48 rounded-xl object-contain block"
              onError={(e) => {
                const fallback = `https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encodeURIComponent(targetUrl)}`
                if (e.currentTarget.src !== fallback) {
                  e.currentTarget.src = fallback
                }
              }}
            />
          ) : (
            <div className="w-48 h-48 flex items-center justify-center text-gold-dark font-montserrat text-xs animate-pulse">
              Generando código QR...
            </div>
          )}
        </div>

        <p className="text-xs font-montserrat text-text-sub font-medium">
          Apunta la cámara de cualquier celular al código para abrir la invitación digital al instante.
        </p>

        {/* Actions: Copy link & Download QR */}
        <div className="flex gap-2 w-full">
          <button
            type="button"
            onClick={handleCopy}
            className="flex-1 py-2.5 px-3 rounded-xl border border-gold/60 bg-gold/10 hover:bg-gold/20 text-gold-dark font-montserrat font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
          >
            <span>{copied ? '✅' : '📋'}</span>
            <span>{copied ? '¡Copiado!' : 'Copiar link'}</span>
          </button>
          <button
            type="button"
            onClick={handleDownload}
            className="flex-1 py-2.5 px-3 rounded-xl border border-gold/60 bg-gold/10 hover:bg-gold/20 text-gold-dark font-montserrat font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
          >
            <span>📥</span>
            <span>Guardar QR</span>
          </button>
        </div>

        {/* Localhost / Custom Link Notice & Editor */}
        <div className="w-full text-left bg-gold/10 border border-gold/30 rounded-xl p-2.5 flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold font-montserrat text-gold-dark uppercase tracking-wider">
              Enlace codificado:
            </span>
            <button
              type="button"
              onClick={() => setShowEdit(!showEdit)}
              className="text-[10px] font-bold text-gold-dark underline hover:text-gold cursor-pointer"
            >
              {showEdit ? 'Ocultar' : 'Personalizar link'}
            </button>
          </div>

          {!showEdit ? (
            <p className="text-[11px] font-mono text-text-muted truncate">
              {targetUrl}
            </p>
          ) : (
            <div className="flex flex-col gap-1 mt-1">
              <input
                type="text"
                value={targetUrl}
                onChange={e => setTargetUrl(e.target.value)}
                placeholder="https://tudominio.com"
                className="w-full px-2.5 py-1.5 text-xs font-mono bg-white border border-gold/50 rounded-lg text-text-main focus:outline-none focus:ring-1 focus:ring-gold"
              />
              {isLocal && (
                <p className="text-[9px] text-text-muted leading-tight mt-0.5">
                  💡 Tip: En tu PC estás en <code className="bg-gold/20 px-1 rounded font-bold">localhost</code>. Para abrirlo desde tu celular en tu WiFi, puedes poner la IP de tu PC (ej. <code className="bg-gold/20 px-1 rounded font-bold">http://192.168.1.XX:8443</code>) o tu link publicado.
                </p>
              )}
            </div>
          )}
        </div>

        <button
          onClick={onClose}
          className="w-full py-3 rounded-2xl bg-gradient-to-r from-gold to-gold-dark text-text-main font-montserrat font-bold text-xs uppercase tracking-wider shadow-md hover:brightness-110 cursor-pointer"
        >
          Cerrar
        </button>
      </div>
    </div>
  )
}


// ─── Reusable Ornate Stationery Plate Component (Matching the 7 Official Photos) ─
function StationeryPlate({
  children,
  className = "",
  topButterfly = true,
  bottomButterfly = true,
  hideTopStar = false,
  tagText,
}: {
  children: React.ReactNode
  className?: string
  topButterfly?: boolean
  bottomButterfly?: boolean
  hideTopStar?: boolean
  tagText?: string
}) {
  return (
    <div
      className={`stationery-plate relative w-full max-w-2xl mx-auto rounded-[28px] sm:rounded-[36px] p-6 sm:p-10 md:p-14 bg-[#FAF5EC] border border-[#D8C4A6]/90 shadow-[0_20px_60px_rgba(70,53,35,0.08)] overflow-hidden text-center flex flex-col items-center select-text ${className}`}
    >
      {/* Authentic Watercolor Botanical Floral Corners from original plates */}
      <img
        src="/images/plate_corner_tl.png"
        alt=""
        aria-hidden="true"
        className="absolute top-0 left-0 w-36 sm:w-52 md:w-60 pointer-events-none mix-blend-multiply opacity-85 select-none"
      />
      <img
        src="/images/plate_corner_br.png"
        alt=""
        aria-hidden="true"
        className="absolute bottom-0 right-0 w-36 sm:w-52 md:w-60 pointer-events-none mix-blend-multiply opacity-85 select-none"
      />
      <img
        src="/images/plate_corner_tr.png"
        alt=""
        aria-hidden="true"
        className="absolute top-0 right-0 w-20 sm:w-32 md:w-36 pointer-events-none mix-blend-multiply opacity-75 select-none"
      />
      <img
        src="/images/plate_corner_bl.png"
        alt=""
        aria-hidden="true"
        className="absolute bottom-0 left-0 w-20 sm:w-32 md:w-36 pointer-events-none mix-blend-multiply opacity-75 select-none"
      />

      {/* Ornate Corner Inset Brackets matching original stationery */}
      <div className="absolute top-4 sm:top-6 left-4 sm:left-6 w-5 sm:w-7 h-5 sm:h-7 border-t border-l border-[#C4A163]/85 pointer-events-none" />
      <div className="absolute top-4 sm:top-6 right-4 sm:right-6 w-5 sm:w-7 h-5 sm:h-7 border-t border-r border-[#C4A163]/85 pointer-events-none" />
      <div className="absolute bottom-4 sm:bottom-6 left-4 sm:left-6 w-5 sm:w-7 h-5 sm:h-7 border-b border-l border-[#C4A163]/85 pointer-events-none" />
      <div className="absolute bottom-4 sm:bottom-6 right-4 sm:right-6 w-5 sm:w-7 h-5 sm:h-7 border-b border-r border-[#C4A163]/85 pointer-events-none" />

      {/* Delicate Inner Hairline Frame */}
      <div className="absolute inset-3.5 sm:inset-5 border border-[#D8C4A6]/60 rounded-2xl pointer-events-none" />

      {/* Top Center Butterfly + Star */}
      {topButterfly && (
        <div className="relative z-10 flex flex-col items-center gap-1 mb-2 sm:mb-3">
          <GoldButterfly size={26} className="filter drop-shadow-[0_2px_4px_rgba(180,140,80,0.25)] select-none" />
          {!hideTopStar && (
            <span className="text-gold-dark text-[10px] select-none">✦</span>
          )}
        </div>
      )}

      {tagText && (
        <p className="relative z-10 text-[10px] sm:text-xs uppercase tracking-[0.35em] font-cinzel text-gold-dark font-bold mb-2">
          {tagText}
        </p>
      )}

      {/* Plate Body Content */}
      <div className="relative z-10 w-full flex flex-col items-center">
        {children}
      </div>

      {/* Bottom Center Butterfly */}
      {bottomButterfly && (
        <div className="relative z-10 flex flex-col items-center gap-1 mt-5 sm:mt-6">
          <GoldButterfly size={26} className="filter drop-shadow-[0_2px_4px_rgba(180,140,80,0.25)] select-none" />
        </div>
      )}
    </div>
  )
}

// ─── Hero Section (Lámina 1 Oficial) ───────────────────────────────────────────
function HeroSection({ onTriggerToast }: { onTriggerToast: (msg: string) => void }) {
  const time = useCountdown(EVENT_DATE)
  const units = [
    { v: time.days, l: "DÍAS", icon: "📅" },
    { v: time.hours, l: "HORAS", icon: "🕐" },
    { v: time.minutes, l: "MIN", icon: "⏱" },
    { v: time.seconds, l: "SEG", icon: "🤍" },
  ]

  const handleCalendar = (type: 'google' | 'ics') => {
    if (type === 'google') {
      const title = encodeURIComponent(`XV Años de ${QUINCE_NAME}`)
      const details = encodeURIComponent(`¡Acompáñanos a celebrar los Quince Años de ${QUINCE_NAME}! Misa en ${CHURCH_NAME} y fiesta en ${VENUE_NAME}.`)
      const location = encodeURIComponent(`${VENUE_NAME}, ${VENUE_ADDRESS}`)
      const dates = "20261017T130000Z/20261018T020000Z"
      window.open(`https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&location=${location}&dates=${dates}`, '_blank')
      onTriggerToast("Google Calendar abierto 📅")
    } else {
      const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
BEGIN:VEVENT
SUMMARY:XV Años de ${QUINCE_NAME}
DESCRIPTION:Celebración de los Quince Años de ${QUINCE_NAME}
LOCATION:${VENUE_NAME}, ${VENUE_ADDRESS}
DTSTART:20261017T130000Z
DTEND:20261018T020000Z
END:VEVENT
END:VCALENDAR`
      const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' })
      const link = document.createElement('a')
      link.href = window.URL.createObjectURL(blob)
      link.setAttribute('download', `XV_Anos_${QUINCE_NAME}.ics`)
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      onTriggerToast("Calendario guardado (.ics)")
    }
  }

  return (
    <section
      id="inicio"
      className="relative min-h-screen flex flex-col items-center justify-center text-center px-4 md:px-6 py-16 md:py-24 hero-glow overflow-hidden"
    >
      <StationeryPlate className="max-w-xl">
        <p className="text-[10px] md:text-xs uppercase tracking-[0.35em] font-cinzel text-gold-dark font-bold mb-2">
          CON LA BENDICIÓN DE DIOS Y EL AMOR DE MI FAMILIA
        </p>
        <span className="text-gold-dark text-xs mb-2">✦</span>

        {/* KM Monogram with Royal Crown */}
        <div className="relative w-16 h-16 md:w-20 md:h-20 rounded-full border border-gold/70 flex flex-col items-center justify-center glass-card my-1 shadow-md animate-float-slow bg-cream/90">
          <svg className="w-5 h-4 text-gold-dark mb-0.5" viewBox="0 0 24 16" fill="currentColor">
            <path d="M2 14h20v2H2v-2zm1.5-2L1 4l6 4 5-7 5 7 6-4-2.5 8h-17z" />
          </svg>
          <span className="font-cinzel text-lg md:text-2xl text-gold-dark font-bold leading-none">KM</span>
        </div>

        <p className="font-cinzel text-xs md:text-sm uppercase tracking-[0.35em] text-gold-dark font-bold mt-2">
          MIS QUINCE AÑOS
        </p>

        {/* Script Name */}
        <div className="my-2 md:my-3">
          <h1 className="text-6xl sm:text-7xl md:text-8xl font-script gold-text-gradient leading-tight drop-shadow-sm">
            Krista
          </h1>
          <h2 className="text-5xl sm:text-6xl md:text-7xl font-cinzel uppercase tracking-[0.3em] text-gold-dark font-light -mt-2 sm:-mt-3">
            MARIEL
          </h2>
          <p className="text-[10px] xs:text-[11px] sm:text-xs md:text-sm font-cinzel uppercase tracking-[0.16em] sm:tracking-[0.25em] text-text-sub font-bold mt-2 leading-relaxed">
            <span className="inline-block whitespace-nowrap">KRISTA MARIEL</span>{' '}
            <span className="inline-block whitespace-nowrap">SANDOVAL CALDERA</span>
          </p>
          <div className="flex justify-center mt-2">
            <span className="text-gold-dark text-xs">✦</span>
          </div>
        </div>

        {/* Quote exactly as in image.png */}
        <p className="max-w-xl font-playfair italic text-text-main text-base sm:text-lg md:text-xl leading-relaxed mb-4 px-2 font-medium">
          “Hay momentos en la vida que se vuelven mágicos, y quiero compartir el mío contigo.”
        </p>

        {/* Date Layout matching image.png */}
        <div className="flex items-center justify-center gap-4 sm:gap-6 my-2">
          <span className="text-xs md:text-sm font-cinzel uppercase tracking-[0.25em] text-gold-dark font-bold">
            SÁBADO
          </span>
          <div className="h-10 w-px bg-gold/50" />
          <div className="flex flex-col items-center">
            <span className="text-3xl md:text-4xl font-cormorant font-bold text-gold-dark leading-none">
              17
            </span>
            <span className="text-[9px] md:text-[10px] font-cinzel uppercase tracking-[0.3em] text-gold-dark font-semibold mt-1">
              OCTUBRE
            </span>
          </div>
          <div className="h-10 w-px bg-gold/50" />
          <span className="text-xs md:text-sm font-cinzel tracking-[0.25em] text-gold-dark font-bold">
            2026
          </span>
        </div>

        <p className="text-xs font-playfair italic text-text-sub font-medium mb-5">
          (Mi cumpleaños: 15 de Octubre 🎂)
        </p>

        {/* 4 Countdown Cards matching image.png */}
        <div className="flex gap-2 sm:gap-3 md:gap-4 justify-center w-full max-w-md">
          {units.map(({ v, l, icon }) => (
            <div
              key={l}
              className="flex-1 py-3 px-1 sm:py-4 rounded-2xl glass-card flex flex-col items-center justify-center border border-gold/40 shadow-sm gap-0.5 bg-cream/80"
            >
              <span className="text-xs sm:text-sm opacity-85">{icon}</span>
              <span className="text-xl sm:text-2xl md:text-3xl font-cormorant font-bold text-gold-dark leading-none">
                {String(v).padStart(2, "0")}
              </span>
              <span className="text-[8px] sm:text-[9px] uppercase tracking-[0.2em] font-montserrat text-text-sub font-semibold">
                {l}
              </span>
            </div>
          ))}
        </div>

        {/* 3 Pill Buttons matching image.png */}
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-2.5 w-full px-2">
          <a
            href="#video-especial"
            className="w-full sm:w-auto px-6 py-2.5 rounded-full bg-gradient-to-r from-[#E6D0A7] via-[#C9A871] to-[#9F7E47] text-[#332415] text-[11px] font-cinzel uppercase tracking-wider font-bold shadow-md hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <span>🎬</span> VER VIDEO ESPECIAL <GoldButterfly size={14} className="inline-block ml-1" />
          </a>
          <button
            onClick={() => handleCalendar('google')}
            className="w-full sm:w-auto px-5 py-2.5 rounded-full border border-gold/60 glass-card text-[10px] font-cinzel uppercase tracking-wider text-gold-dark hover:bg-gold/15 transition-all flex items-center justify-center gap-1.5 font-bold shadow-sm"
          >
            <span>📅</span> AGREGAR A GOOGLE CALENDAR
          </button>
          <button
            onClick={() => handleCalendar('ics')}
            className="w-full sm:w-auto px-5 py-2.5 rounded-full border border-gold/60 glass-card text-[10px] font-cinzel uppercase tracking-wider text-gold-dark hover:bg-gold/15 transition-all flex items-center justify-center gap-1.5 font-bold shadow-sm"
          >
            <span>📱</span> GUARDAR EN IPHONE / ICAL
          </button>
        </div>
      </StationeryPlate>
    </section>
  )
}

// ─── Parents & Godparents Section (Lámina 3 Oficial) ───────────────────────────
function ParentsSection() {
  const [isVoicePlaying, setIsVoicePlaying] = useState(false)

  const handleToggleVoice = () => {
    if (!('speechSynthesis' in window)) return
    if (isVoicePlaying) {
      window.speechSynthesis.cancel()
      setIsVoicePlaying(false)
      window.dispatchEvent(new CustomEvent('resume-bg-music'))
      return
    }

    window.speechSynthesis.cancel()
    window.dispatchEvent(new CustomEvent('pause-bg-music'))
    const utterance = new SpeechSynthesisUtterance(
      "Hola, bienvenidos a mi invitación. Me hace mucha ilusión poder compartir con ustedes una fecha tan especial para mí. Espero que disfruten cada momento y que juntos hagamos de esta celebración un recuerdo inolvidable. ¡Nos vemos en mis XV!"
    )
    utterance.lang = 'es-MX'
    utterance.rate = 0.95
    utterance.pitch = 1.15

    const voices = window.speechSynthesis.getVoices()
    const spanishVoice = voices.find(v => v.lang.startsWith('es') && (v.name.includes('Sabina') || v.name.includes('Paulina') || v.name.includes('Monica') || v.name.includes('Luciana') || v.name.includes('Mia') || v.name.includes('Female') || v.name.includes('female'))) || voices.find(v => v.lang.startsWith('es'))
    if (spanishVoice) utterance.voice = spanishVoice

    utterance.onend = () => {
      setIsVoicePlaying(false)
      window.dispatchEvent(new CustomEvent('resume-bg-music'))
    }
    utterance.onerror = () => {
      setIsVoicePlaying(false)
      window.dispatchEvent(new CustomEvent('resume-bg-music'))
    }

    setIsVoicePlaying(true)
    window.speechSynthesis.speak(utterance)
  }

  return (
    <section id="padres" className="relative py-12 md:py-20 px-4 md:px-6">
      <div className="section-sep mb-12 md:mb-16" />
      <StationeryPlate className="max-w-xl">
        <p className="text-xs uppercase tracking-[0.35em] font-cinzel text-gold-dark font-bold">
          KRISTA MARIEL
        </p>
        <span className="text-gold-dark text-xs my-1">✦</span>

        {/* Mensaje de Voz de Krista Mariel matching image copy 2.png */}
        <div className="glass-card p-4 sm:p-5 rounded-3xl border border-gold/40 shadow-sm w-full max-w-md bg-cream/85 flex flex-col gap-2.5 my-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase tracking-[0.25em] font-cinzel text-gold-dark font-bold">
              MENSAJE DE VOZ · KRISTA MARIEL
            </span>
            <span className="text-[10px] font-mono text-text-sub font-semibold">0:28</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleToggleVoice}
              className="w-11 h-11 rounded-full bg-gradient-to-r from-gold to-gold-dark text-text-main flex items-center justify-center text-sm shadow-md hover:scale-105 active:scale-95 transition-all shrink-0 cursor-pointer"
              title={isVoicePlaying ? "Pausar mensaje de voz" : "Escuchar mensaje de voz de Krista"}
            >
              {isVoicePlaying ? '⏸' : '▶'}
            </button>
            <div className="flex-1 flex items-center gap-1 overflow-hidden h-6 opacity-75">
              {[6, 12, 18, 14, 22, 10, 16, 24, 18, 8, 14, 20, 12, 16, 22, 18, 10, 6, 14, 20, 10, 6].map((h, i) => (
                <div
                  key={i}
                  className={`w-1 rounded-full transition-all duration-300 ${isVoicePlaying ? 'bg-gold animate-pulse' : 'bg-gold/45'}`}
                  style={{ height: `${h}px` }}
                />
              ))}
            </div>
          </div>
          <p className="font-playfair italic text-xs sm:text-sm text-text-main leading-relaxed text-left font-normal mt-0.5">
            “Hola, bienvenidos a mi invitación. Me hace mucha ilusión poder compartir con ustedes una fecha tan especial para mí. Espero que disfruten cada momento y que juntos hagamos de esta celebración un recuerdo inolvidable. ¡Nos vemos en mis XV!”
          </p>
        </div>

        {/* Descubrir Más Arrow matching image copy 2.png */}
        <div className="flex flex-col items-center gap-0.5 my-3">
          <span className="text-[9px] uppercase tracking-[0.3em] font-cinzel text-gold-dark font-bold">
            DESCUBRIR MÁS
          </span>
          <span className="text-gold-dark text-sm animate-bounce">↓</span>
        </div>

        <h2 className="font-script text-5xl sm:text-6xl text-gold-dark my-1">
          Padres & Padrinos
        </h2>

        <span className="text-gold-dark text-xs my-1">✦</span>

        {/* Cards: Mis Padres & Mis Padrinos (Mujeres primero exactamente como solicitó el usuario) */}
        <div className="flex flex-col gap-3.5 w-full mt-2">
          {/* Card 1: MIS PADRES */}
          <div className="glass-card p-5 md:p-6 rounded-3xl border border-gold/40 shadow-sm flex flex-col items-center gap-2 bg-cream/75">
            <p className="text-[11px] uppercase tracking-[0.3em] font-cinzel text-gold-dark font-bold">
              MIS PADRES
            </p>
            <h3 className="font-cinzel text-base md:text-lg text-text-main font-bold">
              {MOTHER_NAME}
            </h3>
            <span className="text-gold-dark font-script text-2xl leading-none">&</span>
            <h3 className="font-cinzel text-base md:text-lg text-text-main font-bold">
              {FATHER_NAME}
            </h3>
          </div>

          {/* Card 2: MIS PADRINOS */}
          <div className="glass-card p-5 md:p-6 rounded-3xl border border-gold/40 shadow-sm flex flex-col items-center gap-2 bg-cream/75">
            <p className="text-[11px] uppercase tracking-[0.3em] font-cinzel text-gold-dark font-bold">
              MIS PADRINOS
            </p>
            <h3 className="font-cinzel text-base md:text-lg text-text-main font-bold">
              {GODMOTHER_NAME}
            </h3>
            <span className="text-gold-dark font-script text-2xl leading-none">&</span>
            <h3 className="font-cinzel text-base md:text-lg text-text-main font-bold">
              {GODFATHER_NAME}
            </h3>
          </div>
        </div>

        {/* Bottom ornament */}
        <div className="flex items-center gap-3 mt-6 opacity-75">
          <div className="h-px w-12 bg-gold/50" />
          <GoldButterfly size={16} />
          <div className="h-px w-12 bg-gold/50" />
        </div>
        <p className="text-[10px] md:text-[11px] uppercase tracking-[0.3em] font-cinzel text-text-main font-bold mt-2">
          17 DE OCTUBRE, 2026
        </p>
        <p className="text-[9px] md:text-[10px] uppercase tracking-[0.25em] font-cinzel text-text-sub font-semibold">
          SALÓN QUINTA MARÍA TERESA
        </p>
      </StationeryPlate>
    </section>
  )
}

// ─── Protocol / Itinerary Section (Lámina Oficial 3: PROTOCOLO) ─────────────────
interface ProtocolMilestone {
  id: number
  title: string
  time?: string
  location?: string
  coords?: string
  mapsUrl?: string
  wazeUrl?: string
  iconType: 'church' | 'toast' | 'mariachi' | 'notes' | 'vals' | 'mask' | 'banda'
}

const OFFICIAL_7_PROTOCOL: ProtocolMilestone[] = [
  {
    id: 1,
    title: "Misa",
    time: "1:00 pm – 2:00 pm",
    location: "Templo de la Sagrada Familia",
    coords: "23.172136, -102.871262",
    mapsUrl: "https://www.google.com/maps?q=23.172136,-102.871262&z=17&hl=es",
    wazeUrl: "https://waze.com/ul?ll=23.172136,-102.871262&navigate=yes",
    iconType: 'church',
  },
  {
    id: 2,
    title: "Recepción de invitados",
    time: "3:00 pm",
    location: "Salón Quinta María Teresa",
    coords: "23.175169, -102.907661",
    mapsUrl: "https://www.google.com/maps/place/23%C2%B010'30.7%22N+102%C2%B054'27.6%22W/@23.175169,-102.907661,291m/data=!3m1!1e3?hl=es",
    wazeUrl: "https://waze.com/ul?ll=23.175169,-102.907661&navigate=yes",
    iconType: 'toast',
  },
  { id: 3, title: "Mariachi", iconType: 'mariachi' },
  { id: 4, title: "Grupo", iconType: 'notes' },
  { id: 5, title: "Vals", iconType: 'vals' },
  { id: 6, title: "Baile sorpresa", iconType: 'mask' },
  { id: 7, title: "Banda", iconType: 'banda' },
];

function ItinerarySection({ onTriggerToast }: { onTriggerToast: (msg: string) => void }) {
  const [showFullCard, setShowFullCard] = useState(false);

  const copyProtocolSummary = () => {
    const protocolText = "✨ PROTOCOLO OFICIAL · XV AÑOS KRISTA MARIEL ✨\nSábado 17 de Octubre, 2026\n\n" +
      "1. Misa (1:00 pm – 2:00 pm) · Templo de la Sagrada Familia (23.172136, -102.871262)\n" +
      "2. Recepción de invitados (3:00 pm) · Salón Quinta María Teresa (23.175169, -102.907661)\n" +
      "3. Mariachi\n" +
      "4. Grupo\n" +
      "5. Vals\n" +
      "6. Baile sorpresa\n" +
      "7. Banda\n\n" +
      "⛪ Maps Misa: https://www.google.com/maps?q=23.172136,-102.871262&z=17&hl=es\n" +
      "🥂 Maps Recepción: https://www.google.com/maps/place/23%C2%B010'30.7%22N+102%C2%B054'27.6%22W/@23.175169,-102.907661,291m/data=!3m1!1e3?hl=es";
    navigator.clipboard.writeText(protocolText);
    onTriggerToast("¡Protocolo oficial copiado al portapapeles! 📋");
  };

  const renderMilestoneIcon = (type: ProtocolMilestone['iconType']) => {
    switch (type) {
      case 'church':
        return (
          <svg className="w-8 h-8 text-gold-dark shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2v4m-2-2h4" />
            <path d="M18 22V10l-6-4-6 4v12" />
            <path d="M10 22v-5a2 2 0 0 1 4 0v5" />
            <circle cx="12" cy="10" r="1.5" />
          </svg>
        );
      case 'toast':
        return (
          <svg className="w-8 h-8 text-gold-dark shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            <path d="M8 22h8m-4-7v7" />
            <path d="M6 3v6a5 5 0 0 0 5 5h2a5 5 0 0 0 5-5V3" />
            <path d="M6 7h12" />
          </svg>
        );
      case 'mariachi':
        return (
          <svg className="w-8 h-8 text-gold-dark shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            <path d="M2 17c3-2 7-3 10-3s7 1 10 3-4 4-10 4-10-2-10-4z" />
            <path d="M7 14.5c0-4 2.2-7.5 5-7.5s5 3.5 5 7.5" />
            <path d="M9 7c1.5-3 4.5-3 6 0" />
          </svg>
        );
      case 'notes':
        return (
          <svg className="w-8 h-8 text-gold-dark shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 18V5l12-2v13" />
            <circle cx="6" cy="18" r="3" />
            <circle cx="18" cy="16" r="3" />
          </svg>
        );
      case 'vals':
        return (
          <svg className="w-8 h-8 text-gold-dark shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2l1.5 2-1.5 1-1.5-1L12 2z" />
            <path d="M9 6l3 1 3-1v3l-3 1-3-1V6z" />
            <path d="M6 21c0-6 2-9 6-9s6 3 6 9H6z" />
            <path d="M12 11v10" />
          </svg>
        );
      case 'mask':
        return (
          <svg className="w-8 h-8 text-gold-dark shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            <path d="M2 12c1-4 4-7 10-7s9 3 10 7c0 4-3 7-6 7-3 0-4-2-4-2s-1 2-4 2c-3 0-6-3-6-7z" />
            <ellipse cx="7.5" cy="12" rx="2.5" ry="1.8" />
            <ellipse cx="16.5" cy="12" rx="2.5" ry="1.8" />
            <path d="M19 6c2-3 4-4 4-4s-1 3-1 5" />
          </svg>
        );
      case 'banda':
        return (
          <svg className="w-8 h-8 text-gold-dark shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 13h10l5-4v10l-5-4H3z" />
            <path d="M18 10a4 4 0 0 1 0 4" />
            <path d="M6 13v4" />
            <path d="M9 13v4" />
          </svg>
        );
    }
  };

  return (
    <section id="itinerario" className="relative py-16 md:py-24 px-4 md:px-6">
      <div className="section-sep mb-16 md:mb-20" />
      <div className="max-w-4xl mx-auto flex flex-col items-center">
        <StationeryPlate className="max-w-xl">
          {/* Top Seal: Circular Golden Badge with Butterfly */}
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full border border-gold/70 flex items-center justify-center bg-gradient-to-b from-[#FFFDF9] via-[#FAF3E6] to-[#F1E4CE] shadow-md mb-2">
            <GoldButterfly size={24} />
          </div>

          {/* Title: PROTOCOLO matching exact printed card */}
          <h2 className="font-cinzel text-2xl sm:text-3xl md:text-4xl text-text-main font-bold tracking-[0.35em] uppercase my-1">
            PROTOCOLO
          </h2>

          <span className="text-gold-dark text-xs my-2">✦</span>

          {/* Vertical 7 Milestones List matching card layout */}
          <div className="flex flex-col gap-4 w-full max-w-md my-4 text-left">
            {/* 1. Misa */}
            <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-cream/70 border border-gold/35 shadow-xs">
              <div className="w-11 h-11 rounded-xl bg-gold/15 border border-gold/50 flex items-center justify-center shrink-0">
                {renderMilestoneIcon('church')}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-playfair italic text-xl sm:text-2xl text-text-main font-bold leading-tight">
                  Misa
                </h3>
                <p className="font-playfair italic text-xs sm:text-sm text-gold-dark font-bold mt-0.5">
                  1:00 pm – 2:00 pm
                </p>
                <p className="text-xs font-montserrat font-semibold text-text-main mt-1 flex items-center gap-1">
                  <span>📍</span> Templo de la Sagrada Familia
                </p>
                <p className="text-[11px] font-mono text-text-sub mt-0.5">
                  23.172136, -102.871262
                </p>
                <div className="flex items-center gap-2 mt-2.5">
                  <a
                    href="https://www.google.com/maps?q=23.172136,-102.871262&z=17&hl=es"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3.5 py-1.5 rounded-full bg-white/95 border border-gold/60 text-[10px] font-cinzel font-bold text-gold-dark shadow-2xs hover:bg-gold hover:text-white transition-all flex items-center gap-1"
                  >
                    <span>📍</span> Maps
                  </a>
                  <a
                    href="https://waze.com/ul?ll=23.172136,-102.871262&navigate=yes"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3.5 py-1.5 rounded-full bg-white/95 border border-gold/60 text-[10px] font-cinzel font-bold text-gold-dark shadow-2xs hover:bg-gold hover:text-white transition-all flex items-center gap-1"
                  >
                    <span>🚗</span> Waze
                  </a>
                </div>
              </div>
            </div>

            {/* 2. Recepción de invitados */}
            <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-cream/70 border border-gold/35 shadow-xs">
              <div className="w-11 h-11 rounded-xl bg-gold/15 border border-gold/50 flex items-center justify-center shrink-0">
                {renderMilestoneIcon('toast')}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-playfair italic text-xl sm:text-2xl text-text-main font-bold leading-tight">
                  Recepción de invitados
                </h3>
                <p className="font-playfair italic text-xs sm:text-sm text-gold-dark font-bold mt-0.5">
                  3:00 pm
                </p>
                <p className="text-xs font-montserrat font-semibold text-text-main mt-1 flex items-center gap-1">
                  <span>📍</span> Salón Quinta María Teresa
                </p>
                <p className="text-[11px] font-mono text-text-sub mt-0.5">
                  23.175169, -102.907661
                </p>
                <div className="flex items-center gap-2 mt-2.5">
                  <a
                    href="https://www.google.com/maps/place/23%C2%B010'30.7%22N+102%C2%B054'27.6%22W/@23.175169,-102.907661,291m/data=!3m1!1e3?hl=es"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3.5 py-1.5 rounded-full bg-white/95 border border-gold/60 text-[10px] font-cinzel font-bold text-gold-dark shadow-2xs hover:bg-gold hover:text-white transition-all flex items-center gap-1"
                  >
                    <span>📍</span> Maps
                  </a>
                  <a
                    href="https://waze.com/ul?ll=23.175169,-102.907661&navigate=yes"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3.5 py-1.5 rounded-full bg-white/95 border border-gold/60 text-[10px] font-cinzel font-bold text-gold-dark shadow-2xs hover:bg-gold hover:text-white transition-all flex items-center gap-1"
                  >
                    <span>🚗</span> Waze
                  </a>
                </div>
              </div>
            </div>

            {/* 3. Mariachi */}
            <div className="flex items-center gap-4 py-1.5 px-3">
              <div className="w-11 h-11 rounded-xl bg-gold/10 border border-gold/30 flex items-center justify-center shrink-0">
                {renderMilestoneIcon('mariachi')}
              </div>
              <span className="font-playfair italic text-2xl text-text-main font-bold">
                Mariachi
              </span>
            </div>

            {/* 4. Grupo */}
            <div className="flex items-center gap-4 py-1.5 px-3">
              <div className="w-11 h-11 rounded-xl bg-gold/10 border border-gold/30 flex items-center justify-center shrink-0">
                {renderMilestoneIcon('notes')}
              </div>
              <span className="font-playfair italic text-2xl text-text-main font-bold">
                Grupo
              </span>
            </div>

            {/* 5. Vals */}
            <div className="flex items-center gap-4 py-1.5 px-3">
              <div className="w-11 h-11 rounded-xl bg-gold/10 border border-gold/30 flex items-center justify-center shrink-0">
                {renderMilestoneIcon('vals')}
              </div>
              <span className="font-playfair italic text-2xl text-text-main font-bold">
                Vals
              </span>
            </div>

            {/* 6. Baile sorpresa */}
            <div className="flex items-center gap-4 py-1.5 px-3">
              <div className="w-11 h-11 rounded-xl bg-gold/10 border border-gold/30 flex items-center justify-center shrink-0">
                {renderMilestoneIcon('mask')}
              </div>
              <span className="font-playfair italic text-2xl text-text-main font-bold">
                Baile sorpresa
              </span>
            </div>

            {/* 7. Banda */}
            <div className="flex items-center gap-4 py-1.5 px-3">
              <div className="w-11 h-11 rounded-xl bg-gold/10 border border-gold/30 flex items-center justify-center shrink-0">
                {renderMilestoneIcon('banda')}
              </div>
              <span className="font-playfair italic text-2xl text-text-main font-bold">
                Banda
              </span>
            </div>
          </div>

          <span className="text-gold-dark text-xs my-1">✦</span>

          {/* Bottom ornament */}
          <div className="flex items-center gap-3 my-4 opacity-75">
            <div className="h-px w-14 bg-gold/50" />
            <GoldButterfly size={16} />
            <div className="h-px w-14 bg-gold/50" />
          </div>

          {/* Card Actions */}
          <div className="mt-2 flex flex-wrap items-center justify-center gap-2.5">
            <button
              onClick={() => setShowFullCard(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-gold/15 hover:bg-gold/25 text-gold-dark border border-gold/50 text-[11px] font-cinzel font-bold shadow-xs transition-all cursor-pointer"
            >
              <span>🔍</span> Ver Tarjeta Impresa
            </button>
            <button
              onClick={copyProtocolSummary}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white/90 hover:bg-white text-gold-dark border border-gold/40 text-[11px] font-cinzel font-bold shadow-xs transition-all cursor-pointer"
            >
              <span>📋</span> Copiar Protocolo
            </button>
            <button
              onClick={() => window.print()}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white/80 hover:bg-white text-text-sub border border-gold/30 text-[11px] font-cinzel font-bold shadow-xs transition-all cursor-pointer"
            >
              <span>🖨️</span> Imprimir / PDF
            </button>
          </div>
        </StationeryPlate>

        {/* Modal Lightbox for Protocol Card */}
        {showFullCard && (
          <div
            className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in"
            onClick={() => setShowFullCard(false)}
          >
            <div
              className="relative max-w-md w-full max-h-[92vh] flex flex-col items-center glass-card p-3 rounded-3xl border-2 border-gold shadow-2xl bg-cream/95 overflow-hidden"
              onClick={e => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={() => setShowFullCard(false)}
                className="absolute top-3 right-3 w-9 h-9 rounded-full bg-gold/20 hover:bg-gold/40 text-gold-dark flex items-center justify-center text-sm font-bold transition-all z-10 cursor-pointer"
                title="Cerrar"
              >
                ✕
              </button>
              <div className="w-full overflow-y-auto max-h-[82vh] rounded-2xl flex justify-center p-1">
                <img
                  src="/fotos/protocolo_oficial_tarjeta.png"
                  alt="Tarjeta Oficial de Protocolo - XV Años Krista Mariel"
                  className="w-full h-auto object-contain rounded-xl shadow-lg"
                />
              </div>
              <p className="text-[11px] font-cinzel tracking-widest text-gold-dark font-bold mt-2">
                PROTOCOLO OFICIAL · 17 DE OCTUBRE, 2026
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

// ─── Reserved Color Section (Lámina Oficial 1: GUÍA DE COLOR PARA INVITADOS) ───
function ReservedColorSection({ onTriggerToast: _onTriggerToast }: { onTriggerToast: (msg: string) => void }) {
  return (
    <section id="color-reservado" className="relative py-16 md:py-24 px-4 md:px-6">
      <div className="section-sep mb-16 md:mb-20" />
      <div className="max-w-4xl mx-auto flex flex-col items-center">
        <StationeryPlate className="max-w-xl">
          {/* Top Butterfly ornament matching exact card */}
          <div className="flex items-center gap-3 mb-3 opacity-80">
            <div className="h-px w-12 bg-gold/60" />
            <GoldButterfly size={18} />
            <div className="h-px w-12 bg-gold/60" />
          </div>

          {/* Title: GUÍA DE COLOR PARA INVITADOS */}
          <h2 className="font-cinzel text-2xl sm:text-3xl md:text-4xl text-text-main font-bold tracking-[0.2em] uppercase leading-tight">
            Guía de Color
          </h2>
          <p className="font-cinzel text-xs sm:text-sm uppercase tracking-[0.35em] text-gold-dark font-bold mt-1">
            Para Invitados
          </p>

          {/* Primary Message */}
          <div className="my-5 max-w-md">
            <p className="font-playfair text-base sm:text-lg text-text-main leading-relaxed font-normal">
              Con mucho cariño te pedimos
            </p>
            <p className="font-script text-4xl sm:text-5xl md:text-6xl text-gold-dark my-1 leading-tight drop-shadow-xs">
              reservar el color exclusivamente para Krista.
            </p>
          </div>

          <span className="text-gold-dark text-xs my-2">✦</span>

          {/* Secondary Message: Freedom of Color */}
          <div className="my-4 max-w-md">
            <p className="font-playfair text-sm sm:text-base text-text-main leading-relaxed">
              Para acompañarnos en esta celebración,
            </p>
            <p className="font-playfair text-sm sm:text-base text-text-main leading-relaxed">
              <strong className="font-bold">puedes</strong> portar el color que gustes.
            </p>
          </div>

          {/* Ornate Cartouche Frame matching card */}
          <div className="relative my-6 max-w-md w-full px-6 py-5 rounded-2xl border border-[#C5A059]/70 bg-cream/75 shadow-xs flex flex-col items-center text-center">
            {/* Delicate top flourish icon */}
            <div className="absolute -top-3 px-3 bg-[#FAF5EC] text-gold-dark text-sm">
              ❦
            </div>
            <p className="font-cinzel text-xs sm:text-sm font-bold tracking-widest text-text-main leading-relaxed uppercase">
              Lo más importante es<br />
              que te sientas cómoda (a)<br />
              y seas tú.
            </p>
          </div>

          {/* Bottom Butterfly with lines */}
          <div className="flex items-center gap-3 my-2 opacity-80">
            <div className="h-px w-12 bg-gold/60" />
            <GoldButterfly size={16} />
            <div className="h-px w-12 bg-gold/60" />
          </div>

          {/* ETIQUETA FORMAL */}
          <p className="font-cinzel text-xs uppercase tracking-[0.35em] text-text-sub font-bold mt-1">
            Etiqueta Formal
          </p>
        </StationeryPlate>
      </div>
    </section>
  );
}


// ─── Live Photo Wall & Shared Album Section ─────────────────────────────────────
interface SharedPhotoItem {
  id: string
  guestName: string
  caption: string
  src: string
  timeAgo: string
  likes: number
  isGuestUpload?: boolean
}

const INITIAL_SHARED_PHOTOS: SharedPhotoItem[] = [
  {
    id: 'p1',
    guestName: 'Familia Sandoval Caldera',
    caption: '¡Nuestra niña hermosa lista para su gran noche de gala! Que Dios ilumine cada paso de tu vida.',
    src: '/images/krista_sesion_valla_dorada.jpg',
    timeAgo: 'Foto de Gala Oficial',
    likes: 74,
  },
  {
    id: 'p2',
    guestName: 'Valentina & Amigas',
    caption: '¡Amiga hermosa! Contando los días para bailar toda la noche contigo con mucha ilusión 💖',
    src: '/images/krista_sesion_rosas_primer_plano.jpg',
    timeAgo: 'Pre-XV Años',
    likes: 89,
  },
  {
    id: 'p3',
    guestName: 'Tíos y Primos Silva',
    caption: '¡Felicidades Krista Mariel! Eres un orgullo y una bendición para toda la familia.',
    src: '/images/krista_sesion_rosas_camino.jpg',
    timeAgo: 'Sesión de Rosas',
    likes: 56,
  },
  {
    id: 'p4',
    guestName: 'Padrinos de Honor',
    caption: 'Una tarde soñada en Quinta Maria Teresa. ¡Todo lucirá verdaderamente espectacular!',
    src: '/images/krista_sesion_cesped_jardin.jpg',
    timeAgo: 'Quinta Maria Teresa',
    likes: 62,
  },
]

function LivePhotoWallSection({
  onTriggerToast,
  onTriggerBurst,
}: {
  onTriggerToast: (msg: string) => void
  onTriggerBurst?: () => void
}) {
  const [photos, setPhotos] = useState<SharedPhotoItem[]>(INITIAL_SHARED_PHOTOS)
  const [selectedPhoto, setSelectedPhoto] = useState<SharedPhotoItem | null>(null)
  const [showQRModal, setShowQRModal] = useState(false)
  const [tableQrType, setTableQrType] = useState<'web' | 'drive'>('web')
  const [tableQrDataUrl, setTableQrDataUrl] = useState<string>('')
  const [uploadPreview, setUploadPreview] = useState<string | null>(null)
  const [guestName, setGuestName] = useState('')
  const [caption, setCaption] = useState('')
  const [isUploading, setIsUploading] = useState(false)
  const [filter, setFilter] = useState<'all' | 'popular'>('all')

  useEffect(() => {
    if (!showQRModal) return
    const isLocal = typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
    const webTarget = isLocal ? `${PRODUCTION_URL}#muro-fotos` : (typeof window !== 'undefined' ? `${window.location.origin}${window.location.pathname}#muro-fotos` : `${PRODUCTION_URL}#muro-fotos`)
    const target = tableQrType === 'web' ? webTarget : GOOGLE_DRIVE_PHOTOS_URL

    const fallbackUrl = `https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encodeURIComponent(target)}`

    QRCode.toDataURL(target, {
      width: 400,
      margin: 2,
      errorCorrectionLevel: 'M',
      color: {
        dark: '#2D1F38',
        light: '#FFFFFF',
      },
    })
      .then(url => setTableQrDataUrl(url))
      .catch(err => {
        console.error('Error generating Table QR:', err)
        setTableQrDataUrl(fallbackUrl)
      })
  }, [tableQrType, showQRModal])

  const isLocalHost = typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
  const currentTableTarget = tableQrType === 'web'
    ? (isLocalHost ? `${PRODUCTION_URL}#muro-fotos` : (typeof window !== 'undefined' ? `${window.location.origin}${window.location.pathname}#muro-fotos` : `${PRODUCTION_URL}#muro-fotos`))
    : GOOGLE_DRIVE_PHOTOS_URL
  const displayTableQr = tableQrDataUrl || `https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encodeURIComponent(currentTableTarget)}`




  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (evt) => {
        if (evt.target?.result) {
          setUploadPreview(evt.target.result as string)
        }
      }
      reader.readAsDataURL(file)
    }
  }

  const handlePublishPhoto = (e: React.FormEvent) => {
    e.preventDefault()
    if (!uploadPreview) {
      onTriggerToast("Por favor selecciona o toma una foto primero 📸")
      return
    }
    if (!guestName.trim()) {
      onTriggerToast("Por favor escribe tu nombre o el de tu familia ✍️")
      return
    }

    setIsUploading(true)
    if (onTriggerBurst) onTriggerBurst()

    setTimeout(() => {
      const newPhoto: SharedPhotoItem = {
        id: `guest-${Date.now()}`,
        guestName: guestName.trim(),
        caption: caption.trim() || '¡Celebrando los XV Años de Krista Mariel! 🎉',
        src: uploadPreview,
        timeAgo: 'Justo ahora',
        likes: 1,
        isGuestUpload: true,
      }

      setPhotos(prev => [newPhoto, ...prev])
      setUploadPreview(null)
      setGuestName('')
      setCaption('')
      setIsUploading(false)
      onTriggerToast("¡Tu foto ha sido publicada en el Muro en Vivo de Krista! 📸✨")
    }, 600)
  }

  const handleLike = (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setPhotos(prev =>
      prev.map(p => (p.id === id ? { ...p, likes: p.likes + 1 } : p))
    )
    if (selectedPhoto && selectedPhoto.id === id) {
      setSelectedPhoto(prev => prev ? { ...prev, likes: prev.likes + 1 } : null)
    }
    onTriggerToast("¡Te gusta este recuerdo! ❤️")
  }

  const openWhatsAppShare = () => {
    const text = encodeURIComponent(`¡Hola! Quiero compartirte mis fotos y recuerdos de los XV Años de ${QUINCE_NAME} 📸✨`)
    window.open(`https://wa.me/${WHATSAPP_PHONE}?text=${text}`, '_blank')
  }

  const openGoogleDrive = () => {
    window.open(GOOGLE_DRIVE_PHOTOS_URL, '_blank')
    onTriggerToast("Abriendo carpeta compartida de fotos 📁")
  }

  const displayedPhotos = filter === 'popular'
    ? [...photos].sort((a, b) => b.likes - a.likes)
    : photos

  return (
    <section id="muro-fotos" className="relative py-16 md:py-24 px-4 md:px-6">
      <div className="section-sep mb-16 md:mb-20" />
      <div className="max-w-5xl mx-auto">
        <SectionHeader tag="Recuerdos en Tiempo Real" title="Muro de Fotos en Vivo · Álbum de la Fiesta" />

        {/* Intro Banner */}
        <div className="glass-card p-6 md:p-8 rounded-3xl border-2 border-gold/40 shadow-2xl text-center flex flex-col items-center gap-5 mb-10 bg-gradient-to-b from-cream/95 to-pastel-beige/40">
          <div className="w-14 h-14 rounded-full border-2 border-gold bg-gold/15 flex items-center justify-center text-2xl shadow-inner">
            📸
          </div>
          <div className="max-w-2xl">
            <h3 className="font-playfair text-2xl md:text-3xl text-text-main font-bold mb-2">
              ¡Ayúdanos a capturar cada instante mágico!
            </h3>
            <p className="font-montserrat text-xs md:text-sm text-text-sub leading-relaxed font-medium">
              Durante la misa, la recepción y la fiesta en Quinta Maria Teresa, sube aquí tus selfies, fotos con Krista Mariel y videos. Todas quedarán guardadas para siempre en el álbum oficial de recuerdos.
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 w-full max-w-3xl mt-1">
            <button
              type="button"
              onClick={openGoogleDrive}
              className="px-5 py-3 rounded-2xl bg-gradient-to-r from-gold-light via-gold to-gold-dark text-text-main font-montserrat font-bold text-xs uppercase tracking-wider shadow-md hover:brightness-110 active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
            >
              <span>📁</span>
              <span>Subir a Google Drive</span>
            </button>

            <button
              type="button"
              onClick={openWhatsAppShare}
              className="px-5 py-3 rounded-2xl border-2 border-[#25D366]/60 bg-[#25D366]/15 hover:bg-[#25D366]/25 text-[#128C7E] font-montserrat font-bold text-xs uppercase tracking-wider shadow-sm active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
            >
              <span>💬</span>
              <span>Enviar por WhatsApp</span>
            </button>

            <button
              type="button"
              onClick={() => setShowQRModal(true)}
              className="px-5 py-3 rounded-2xl border-2 border-gold/50 bg-gold/10 hover:bg-gold/20 text-gold-dark font-montserrat font-bold text-xs uppercase tracking-wider shadow-sm active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
            >
              <span>📲</span>
              <span>Código QR para Mesas</span>
            </button>
          </div>
        </div>

        {/* Live Upload Card + Mosaic Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Uploader Form */}
          <form
            onSubmit={handlePublishPhoto}
            className="lg:col-span-5 glass-card p-6 md:p-7 rounded-3xl border-2 border-gold/40 shadow-xl flex flex-col gap-4 sticky top-24"
          >
            <div className="flex items-center gap-2.5 pb-2 border-b border-gold/30">
              <span className="text-xl">✨</span>
              <h4 className="font-playfair text-lg text-gold-dark font-bold">
                Publicar Foto en el Muro
              </h4>
            </div>

            {/* Upload preview / Dropzone */}
            {!uploadPreview ? (
              <label className="w-full aspect-[4/3] rounded-2xl border-2 border-dashed border-gold/60 bg-white/40 hover:bg-gold/10 transition-all flex flex-col items-center justify-center gap-3 cursor-pointer p-4 group">
                <div className="w-12 h-12 rounded-full border border-gold flex items-center justify-center text-2xl bg-gold/15 group-hover:scale-110 transition-transform">
                  📷
                </div>
                <div className="text-center">
                  <p className="text-xs font-montserrat font-bold text-gold-dark">
                    Toca para Tomar Foto o Elegir de tu Galería
                  </p>
                  <p className="text-[10px] font-montserrat text-text-muted mt-0.5">
                    Selfies, fotos de grupo o del salón
                  </p>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </label>
            ) : (
              <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden border-2 border-gold shadow-md">
                <img
                  src={uploadPreview}
                  alt="Vista previa"
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => setUploadPreview(null)}
                  className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-black/70 text-white flex items-center justify-center text-xs hover:bg-black transition-colors"
                  title="Cambiar imagen"
                >
                  ✕
                </button>
              </div>
            )}

            {/* Guest Name input */}
            <div className="flex flex-col gap-1">
              <label className="text-[10px] uppercase tracking-widest font-montserrat text-gold-dark font-bold">
                Tu Nombre o Familia *
              </label>
              <input
                type="text"
                required
                value={guestName}
                onChange={e => setGuestName(e.target.value)}
                placeholder="Ej. Tía Sofia & Familia"
                className="w-full bg-cream border border-gold/40 focus:border-gold rounded-2xl px-3.5 py-2.5 text-xs text-text-main placeholder:text-text-muted outline-none font-medium"
              />
            </div>

            {/* Dedication Caption */}
            <div className="flex flex-col gap-1">
              <label className="text-[10px] uppercase tracking-widest font-montserrat text-gold-dark font-bold">
                Mensaje o Momento (Opcional)
              </label>
              <textarea
                rows={2}
                value={caption}
                onChange={e => setCaption(e.target.value)}
                placeholder="Ej. ¡Bailando el vals con Krista Mariel! ✨"
                className="w-full bg-cream border border-gold/40 focus:border-gold rounded-2xl px-3.5 py-2.5 text-xs text-text-main placeholder:text-text-muted outline-none font-medium resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={isUploading || !uploadPreview}
              className="py-3 rounded-2xl bg-gradient-to-r from-gold-light via-gold to-gold-dark text-text-main font-montserrat font-bold text-xs uppercase tracking-wider shadow-md hover:brightness-110 active:scale-95 transition-all disabled:opacity-50 cursor-pointer mt-1"
            >
              {isUploading ? 'Publicando...' : 'Publicar en el Muro en Vivo ✨'}
            </button>
          </form>

          {/* Photo Stream Grid */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            {/* Header controls & filter */}
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-montserrat text-text-sub font-semibold">
                  Mostrando <strong className="text-gold-dark">{photos.length}</strong> recuerdos
                </span>
              </div>

              <div className="flex items-center gap-1.5 p-1 rounded-xl bg-gold/10 border border-gold/30">
                <button
                  type="button"
                  onClick={() => setFilter('all')}
                  className={`px-3 py-1 rounded-lg text-[10px] font-montserrat font-bold uppercase tracking-wider transition-all cursor-pointer ${
                    filter === 'all'
                      ? 'bg-cream text-gold-dark shadow-sm'
                      : 'text-text-sub hover:text-gold-dark'
                  }`}
                >
                  Recientes
                </button>
                <button
                  type="button"
                  onClick={() => setFilter('popular')}
                  className={`px-3 py-1 rounded-lg text-[10px] font-montserrat font-bold uppercase tracking-wider transition-all cursor-pointer ${
                    filter === 'popular'
                      ? 'bg-cream text-gold-dark shadow-sm'
                      : 'text-text-sub hover:text-gold-dark'
                  }`}
                >
                  ❤️ Populares
                </button>
              </div>
            </div>

            {/* Grid of Polaroid Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {displayedPhotos.map((item) => (
                <div
                  key={item.id}
                  onClick={() => setSelectedPhoto(item)}
                  className="glass-card rounded-2xl p-3 border-2 border-gold/40 shadow-lg flex flex-col gap-2.5 group cursor-pointer hover:border-gold hover:shadow-2xl transition-all relative overflow-hidden bg-cream/80"
                >
                  {/* Polaroid Frame Image */}
                  <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-black/10 border border-gold/30">
                    <img
                      src={item.src}
                      alt={item.caption}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-sm text-[9px] font-montserrat text-gold-light font-semibold border border-gold/40">
                      {item.timeAgo}
                    </div>
                  </div>

                  {/* Card Info */}
                  <div className="flex flex-col gap-1 px-1">
                    <div className="flex items-center justify-between">
                      <h5 className="font-playfair text-sm text-text-main font-bold truncate">
                        {item.guestName}
                      </h5>
                      <button
                        type="button"
                        onClick={e => handleLike(item.id, e)}
                        className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-gold/15 hover:bg-gold/30 border border-gold/40 text-[10px] text-gold-dark font-bold transition-all cursor-pointer"
                        title="Dar Me Gusta"
                      >
                        <span>❤️</span>
                        <span>{item.likes}</span>
                      </button>
                    </div>
                    <p className="text-[11px] font-montserrat text-text-sub line-clamp-2 italic">
                      "{item.caption}"
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Lightbox Modal for Fullscreen Photo View */}
      {selectedPhoto && (
        <div
          className="fixed inset-0 z-50 bg-cream/95 backdrop-blur-2xl flex items-center justify-center p-3 sm:p-6 animate-fade-in"
          onClick={() => setSelectedPhoto(null)}
        >
          <button
            type="button"
            onClick={() => setSelectedPhoto(null)}
            className="absolute top-4 right-4 w-10 h-10 md:w-12 md:h-12 rounded-full border-2 border-gold text-gold-dark text-lg md:text-xl flex items-center justify-center glass-card hover:bg-gold/20 z-10 font-bold cursor-pointer"
          >
            ✕
          </button>

          <div
            onClick={e => e.stopPropagation()}
            className="relative max-w-2xl w-full rounded-3xl overflow-hidden border-2 border-gold glass-card p-3 shadow-2xl bg-cream/95 flex flex-col gap-3"
          >
            <div className="relative max-h-[65vh] rounded-2xl overflow-hidden bg-black/10 border border-gold/30 flex items-center justify-center">
              <img
                src={selectedPhoto.src}
                alt={selectedPhoto.caption}
                className="max-h-[65vh] w-auto rounded-2xl object-contain mx-auto"
              />
            </div>

            <div className="p-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <GoldButterfly size={16} />
                  <p className="font-playfair text-lg text-gold-dark font-bold truncate">
                    {selectedPhoto.guestName}
                  </p>
                  <span className="text-[10px] text-text-muted">· {selectedPhoto.timeAgo}</span>
                </div>
                <p className="text-xs font-montserrat text-text-main italic mt-0.5">
                  "{selectedPhoto.caption}"
                </p>
              </div>

              <button
                type="button"
                onClick={e => handleLike(selectedPhoto.id, e)}
                className="px-4 py-2 rounded-full border-2 border-gold bg-gradient-to-r from-gold to-gold-dark text-text-main text-xs font-montserrat font-bold flex items-center gap-1.5 shadow-md hover:brightness-110 active:scale-95 transition-all cursor-pointer shrink-0"
              >
                <span>❤️</span>
                <span>{selectedPhoto.likes} Me Gusta</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Table QR Card Modal (para colocar en las mesas) */}
      {showQRModal && (
        <div
          className="fixed inset-0 z-50 bg-cream/90 backdrop-blur-2xl flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setShowQRModal(false)}
        >
          <div
            onClick={e => e.stopPropagation()}
            className="glass-card p-6 md:p-8 rounded-3xl max-w-sm w-full text-center flex flex-col items-center gap-4 border-2 border-gold/60 shadow-2xl relative bg-cream/98"
          >
            <button
              type="button"
              onClick={() => setShowQRModal(false)}
              className="absolute top-4 right-4 text-gold-dark hover:text-gold text-lg font-bold cursor-pointer"
            >
              ✕
            </button>

            <div className="text-center">
              <span className="text-xs uppercase tracking-[0.3em] text-gold-dark font-bold font-montserrat">
                Salón Quinta María Teresa · Mesas
              </span>
              <h3 className="font-greatvibes text-4xl gold-text-gradient mt-1">
                Sube tus Fotos de la Fiesta
              </h3>
            </div>

            {/* Selector de Destino del QR */}
            <div className="flex bg-gold/15 p-1 rounded-xl w-full border border-gold/40">
              <button
                type="button"
                onClick={() => setTableQrType('web')}
                className={`flex-1 py-1.5 px-2 rounded-lg text-[11px] font-montserrat font-bold transition-all cursor-pointer ${
                  tableQrType === 'web'
                    ? 'bg-gradient-to-r from-gold to-gold-dark text-text-main shadow-sm'
                    : 'text-gold-dark hover:bg-gold/10'
                }`}
              >
                📱 Muro Web
              </button>
              <button
                type="button"
                onClick={() => setTableQrType('drive')}
                className={`flex-1 py-1.5 px-2 rounded-lg text-[11px] font-montserrat font-bold transition-all cursor-pointer ${
                  tableQrType === 'drive'
                    ? 'bg-gradient-to-r from-gold to-gold-dark text-text-main shadow-sm'
                    : 'text-gold-dark hover:bg-gold/10'
                }`}
              >
                📁 Google Drive
              </button>
            </div>

            {/* Real Scannable Table QR Code Image */}
            <div className="p-3 bg-white rounded-2xl shadow-xl border-4 border-gold/40 relative flex items-center justify-center">
              {displayTableQr ? (
                <img
                  src={displayTableQr}
                  alt="Código QR para mesas de la fiesta"
                  className="w-44 h-44 rounded-xl object-contain block"
                  onError={(e) => {
                    const fallback = `https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encodeURIComponent(currentTableTarget)}`
                    if (e.currentTarget.src !== fallback) {
                      e.currentTarget.src = fallback
                    }
                  }}
                />
              ) : (
                <div className="w-44 h-44 flex items-center justify-center text-gold-dark font-montserrat text-xs animate-pulse">
                  Generando QR de mesa...
                </div>
              )}
            </div>

            <p className="text-xs font-montserrat text-text-sub font-medium">
              {tableQrType === 'web'
                ? 'Coloca este código en cada mesa para que los invitados escaneen directamente con su celular y compartan fotos en el muro en vivo.'
                : 'Este código abre directamente la carpeta compartida de Google Drive para que los invitados suban fotos y videos.'}
            </p>

            <div className="flex gap-2 w-full">
              <button
                type="button"
                onClick={() => {
                  const src = displayTableQr
                  if (!src) return
                  const a = document.createElement('a')
                  a.href = src
                  a.download = `QR_Mesa_${tableQrType === 'web' ? 'MuroFotos' : 'GoogleDrive'}_KristaMariel.png`
                  a.target = '_blank'
                  a.click()
                  onTriggerToast("¡Imagen QR guardada para imprimir! 📥")
                }}
                className="flex-1 py-2.5 px-3 rounded-xl border border-gold/60 bg-gold/10 hover:bg-gold/20 text-gold-dark font-montserrat font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              >
                <span>📥</span>
                <span>Guardar QR</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  window.print()
                  onTriggerToast("Abriendo diálogo para imprimir cartel de mesa 🖨️")
                }}
                className="flex-1 py-2.5 px-3 rounded-xl bg-gradient-to-r from-gold to-gold-dark text-text-main font-montserrat font-bold text-xs flex items-center justify-center gap-1.5 shadow-md hover:brightness-110 cursor-pointer"
              >
                <span>🖨️</span>
                <span>Imprimir Cartel</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}

// ─── Dress Code & Gifts Section (Lámina Oficial 2: SUGERENCIA DE REGALOS) ────────
function DressGiftsSection({ onTriggerToast }: { onTriggerToast: (msg: string) => void }) {
  const copyEventNumber = () => {
    navigator.clipboard.writeText("60045186");
    onTriggerToast("¡Número de evento 60045186 copiado! 🎁");
  };

  return (
    <section id="vestimenta" className="relative py-16 md:py-24 px-4 md:px-6">
      <div className="section-sep mb-16 md:mb-20" />
      <div className="max-w-4xl mx-auto flex flex-col items-center">
        <StationeryPlate className="max-w-xl">
          {/* Top Icon: Gift in Circle outline matching card */}
          <div className="w-12 h-12 rounded-full border border-gold/70 flex items-center justify-center text-xl bg-gradient-to-b from-[#FFFDF9] via-[#FAF3E6] to-[#F1E4CE] shadow-xs mb-2 text-gold-dark">
            🎁
          </div>

          {/* Title: SUGERENCIA DE REGALOS matching exact card */}
          <h2 className="font-cinzel text-2xl sm:text-3xl md:text-4xl text-text-main font-bold tracking-[0.2em] uppercase leading-tight">
            Sugerencia
          </h2>
          <p className="font-cinzel text-xs sm:text-sm uppercase tracking-[0.35em] text-gold-dark font-bold mt-1">
            de Regalos
          </p>

          <span className="text-gold-dark text-xs my-2">✦</span>

          {/* Primary Message */}
          <div className="my-3 max-w-md">
            <p className="font-playfair italic text-base sm:text-lg text-text-main font-medium leading-relaxed">
              Tu presencia es, sin duda, el regalo más especial para Krista.
            </p>
            <p className="font-montserrat text-xs sm:text-sm text-text-sub mt-2 leading-relaxed">
              Si deseas tener un detalle con ella, puedes elegir libremente el obsequio que desees compartir con ella.
            </p>
          </div>

          {/* Official Liverpool Cartouche Box in Card Style */}
          <div className="my-5 w-full max-w-md p-5 sm:p-6 rounded-3xl border border-[#C5A059]/70 bg-cream/75 shadow-xs flex flex-col items-center text-center">
            {/* Liverpool nested squares logo */}
            <div className="flex items-center gap-2 mb-1">
              <div className="w-7 h-7 rounded-lg bg-gold/15 border border-gold/50 flex items-center justify-center p-1 shrink-0">
                <svg viewBox="0 0 100 100" fill="none" className="w-full h-full text-gold-dark">
                  <path d="M20 20 H80 V80 H20 Z" stroke="currentColor" strokeWidth="12" fill="none" />
                  <path d="M35 35 H65 V65 H35 Z" stroke="currentColor" strokeWidth="10" fill="none" />
                </svg>
              </div>
              <span className="font-montserrat font-extrabold text-lg tracking-wide text-text-main">
                Liverpool
              </span>
            </div>

            <p className="font-cinzel text-xs font-bold uppercase tracking-[0.25em] text-gold-dark">
              Mesa de Regalos
            </p>
            <p className="text-[10px] uppercase tracking-[0.2em] text-text-muted mb-4">
              — LIVERPOOL —
            </p>

            <div className="w-full border-t border-gold/30 pt-3 flex flex-col gap-2.5 text-xs font-montserrat">
              <div className="flex justify-between items-center px-3">
                <span className="text-[10px] font-cinzel font-bold text-text-sub uppercase tracking-wider">EVENTO:</span>
                <span className="font-playfair italic font-bold text-sm text-text-main">Mis XV Krista</span>
              </div>
              <div className="flex justify-between items-center px-3">
                <span className="text-[10px] font-cinzel font-bold text-text-sub uppercase tracking-wider">NO. DE EVENTO:</span>
                <span className="font-cormorant font-bold text-base text-gold-dark tracking-widest">60045186</span>
              </div>
              <div className="flex justify-between items-center px-3">
                <span className="text-[10px] font-cinzel font-bold text-text-sub uppercase tracking-wider">VIGENCIA:</span>
                <span className="font-montserrat font-bold text-xs text-text-main">16 | 11 | 2026</span>
              </div>
            </div>

            {/* Interactive Actions for Liverpool */}
            <div className="flex flex-wrap items-center justify-center gap-2 mt-4 w-full">
              <a
                href="https://mesaderegalos.liverpool.com.mx/"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-full bg-gold text-white text-[10px] font-cinzel font-bold uppercase tracking-wider shadow-xs hover:bg-gold-dark transition-all flex items-center gap-1.5"
              >
                <span>🛍️</span> Ir a Mesa Liverpool
              </a>
              <button
                type="button"
                onClick={copyEventNumber}
                className="px-4 py-2 rounded-full bg-white border border-gold/60 text-gold-dark text-[10px] font-cinzel font-bold uppercase tracking-wider shadow-2xs hover:bg-gold/10 transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <span>📋</span> Copiar No. 60045186
              </button>
            </div>
          </div>

          {/* Butterfly ornament */}
          <div className="flex items-center gap-3 my-2 opacity-80">
            <div className="h-px w-12 bg-gold/60" />
            <GoldButterfly size={16} />
            <div className="h-px w-12 bg-gold/60" />
          </div>

          {/* Cash Gift Note (Lluvia de Sobres) */}
          <p className="font-playfair italic text-xs sm:text-sm text-text-main max-w-md mx-auto leading-relaxed px-2 my-2">
            En caso de preferir un obsequio en efectivo, podrás depositarlo en los sobres destinados para Krista, y será recibido con mucho cariño y gratitud.
          </p>

          {/* Butterfly ornament */}
          <div className="flex items-center gap-3 my-2 opacity-80">
            <div className="h-px w-12 bg-gold/60" />
            <GoldButterfly size={16} />
            <div className="h-px w-12 bg-gold/60" />
          </div>

          {/* Free Gift Option */}
          <p className="font-playfair italic text-xs sm:text-sm text-text-sub max-w-md mx-auto px-2 my-1">
            También puedes elegir el obsequio que desees compartir con ella.
          </p>

          <span className="text-gold-dark text-xs my-2">✦</span>

        </StationeryPlate>
      </div>
    </section>
  );
}


function GallerySection() {
  const [lightboxItem, setLightboxItem] = useState<(typeof GALLERY_ITEMS)[0] | null>(null)

  return (
    <section id="galeria" className="relative py-16 md:py-24 px-4 md:px-6">
      <div className="section-sep mb-16 md:mb-20" />
      <div className="max-w-6xl mx-auto">
        <SectionHeader
          tag="Momentos Inolvidables"
          title={
            <span>
              Galería Oficial de <span className="inline-block whitespace-nowrap">Krista Mariel</span>
            </span>
          }
        />

        {/* Gallery Grid - Fotos Oficiales de Fotos2 sin texto */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6 mt-2 mb-4">
          {GALLERY_ITEMS.map(item => (
            <div
              key={item.id}
              onClick={() => setLightboxItem(item)}
              className="rounded-3xl overflow-hidden glass-card glass-card-hover cursor-pointer group border-2 border-gold/40 shadow-xl p-2.5 sm:p-3 transition-all duration-300 hover:border-gold hover:shadow-2xl hover:scale-[1.02]"
            >
              {/* Photo Frame Container - Shows 100% of the image without ANY cropping and NO text */}
              <div className="relative w-full aspect-[3/4] rounded-2xl overflow-hidden bg-gradient-to-b from-[#FFFDF9] via-[#FAF6EE] to-[#F3EAD8] flex items-center justify-center p-1.5 border border-gold/30 shadow-inner">
                <img
                  src={item.src}
                  alt="Fotografía Oficial Krista Mariel"
                  className="max-h-full max-w-full object-contain rounded-xl drop-shadow-md transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      {lightboxItem && typeof document !== 'undefined' && createPortal(
        <div
          className="fixed inset-0 z-[100] bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-fade-in"
          onClick={() => setLightboxItem(null)}
        >
          <button
            type="button"
            onClick={() => setLightboxItem(null)}
            className="absolute top-4 right-4 w-10 h-10 md:w-12 md:h-12 rounded-full border-2 border-gold text-gold-dark text-lg md:text-xl flex items-center justify-center bg-white/90 hover:bg-white z-20 font-bold cursor-pointer transition-transform hover:scale-105 shadow-lg"
            aria-label="Cerrar"
          >
            ✕
          </button>

          <div
            onClick={e => e.stopPropagation()}
            className="relative max-w-3xl w-full max-h-[92vh] rounded-3xl overflow-hidden border-2 border-gold bg-[#FAF6EE] p-2.5 sm:p-4 shadow-2xl flex flex-col items-center justify-center"
          >
            <div className="relative flex items-center justify-center overflow-hidden rounded-2xl bg-white/70 border border-gold/20 max-h-[85vh] p-2 w-full">
              <img
                src={lightboxItem.src}
                alt="Fotografía Oficial Krista Mariel"
                className="max-h-[80vh] w-auto max-w-full object-contain rounded-xl mx-auto shadow-md"
              />
            </div>
          </div>
        </div>,
        document.body
      )}
    </section>
  )
}

// ─── Timeline Section (Infancia a XV Años) ───────────────────────────────────
function TimelineSection() {
  const [selectedPhoto, setSelectedPhoto] = useState<{ src: string; title: string; subtitle: string } | null>(null)

  const milestones = [
    {
      year: "2011",
      title: "El Nacimiento de Nuestra Princesa",
      desc: "Llega a nuestras vidas Krista Mariel llena de luz, ternura y sonrisas que iluminaron y transformaron para siempre a toda la familia.",
      icon: "🍼",
      image: "/images/krista_bebe_amarillo_durmiendo.jpg",
      caption: "Octubre 2011 · Su llegada al mundo durmiendo como un angelito",
      tag: "Recién Nacida"
    },
    {
      year: "2012 - 2014",
      title: "Primeras Sonrisas & Caritas Pizpiretas",
      desc: "Sus primeros balbuceos, sus gestos tiernos y esa sonrisa tan alegre que conquistó el corazón de todos con su gorrito rosa y ositos.",
      icon: "🎀",
      image: "/images/krista_bebe_gorrito_rosa.jpg",
      caption: "Primeros meses llenos de ternura, risas y picardía",
      tag: "Primeros Meses"
    },
    {
      year: "2016",
      title: "Niñez, Juegos & Primeros Sueños",
      desc: "Años inolvidables de risas, su blusita blanca bordada y el florecer de una niña alegre, soñadora, noble y cariñosa.",
      icon: "🎈",
      image: "/images/krista_infancia_sonrisa.png",
      caption: "Krista Mariel iluminando el día con su sonrisa más pura",
      tag: "Niñez Feliz"
    },
    {
      year: "2026",
      title: "El Gran Día de Gala en Quinta Maria Teresa",
      desc: "17 de Octubre de 2026: Abre sus alas como una hermosa mariposa para celebrar sus Quince Años rodeada del amor de su familia y amigos.",
      icon: "👑",
      image: "/images/krista_sitting_garden.png",
      caption: "Sesión Oficial XV Años · Lista para vivir su gran noche mágica",
      tag: "Mis XV Años"
    },
  ]

  return (
    <section id="linea-tiempo" className="relative py-16 md:py-24 px-4 md:px-6">
      <div className="section-sep mb-16 md:mb-20" />
      <div className="max-w-4xl mx-auto">
        <SectionHeader tag="Nuestra Historia" title="De Infancia a Mis XV Años" />
        <p className="text-center font-montserrat text-xs md:text-sm text-text-sub max-w-lg mx-auto -mt-4 mb-10 md:mb-12 font-medium">
          Un viaje en el tiempo recordando los momentos y fotografías más bellas que han marcado el camino de Krista Mariel.
        </p>

        <div className="relative border-l-2 border-gold/40 ml-4 md:ml-28 space-y-8 md:space-y-12">
          {milestones.map((m, idx) => (
            <div key={idx} className="relative pl-7 md:pl-10">
              <div className="absolute -left-[17px] top-2 w-8 h-8 rounded-full border-2 border-gold bg-cream flex items-center justify-center text-sm shadow-md z-10">
                {m.icon}
              </div>

              <div className="glass-card p-5 md:p-7 rounded-3xl border-2 border-gold/30 flex flex-col gap-4 shadow-lg hover:shadow-xl transition-shadow">
                <div className="flex flex-wrap justify-between items-center gap-2">
                  <span className="text-xs uppercase font-montserrat tracking-widest text-gold-dark font-bold bg-gold/15 px-3 py-1 rounded-full border border-gold/30">
                    {m.year}
                  </span>
                  <span className="text-xs font-montserrat text-gold-dark font-semibold bg-cream/70 px-2.5 py-0.5 rounded-full border border-gold/20">
                    {m.tag}
                  </span>
                </div>

                <div>
                  <h3 className="font-playfair text-xl md:text-2xl text-text-main font-bold">{m.title}</h3>
                  <p className="font-montserrat text-xs md:text-sm text-text-sub leading-relaxed font-medium mt-1.5">{m.desc}</p>
                </div>

                {/* Milestone Photo Card */}
                <div 
                  onClick={() => setSelectedPhoto({ src: m.image, title: m.title, subtitle: `${m.year} · ${m.tag}` })}
                  className="mt-1 relative rounded-2xl overflow-hidden border-2 border-gold/35 group cursor-pointer shadow-md bg-cream/40"
                >
                  <div className="aspect-[16/10] sm:aspect-[16/9] w-full overflow-hidden">
                    <img
                      src={m.image}
                      alt={m.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      loading="lazy"
                    />
                  </div>
                  <div className="p-3 bg-gradient-to-t from-cream/95 via-cream/80 to-cream/60 flex items-center justify-between border-t border-gold/20">
                    <span className="font-montserrat text-[11px] sm:text-xs text-text-main font-medium italic">
                      "{m.caption}"
                    </span>
                    <span className="text-[10px] uppercase tracking-wider font-montserrat font-bold text-gold-dark whitespace-nowrap ml-2 flex items-center gap-1 group-hover:underline">
                      Ampliar 🔍
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Milestone Photo Lightbox */}
      {selectedPhoto && (
        <div
          className="fixed inset-0 z-50 bg-cream/95 backdrop-blur-2xl flex items-center justify-center p-3 sm:p-4 animate-fade-in"
          onClick={() => setSelectedPhoto(null)}
        >
          <button
            type="button"
            onClick={() => setSelectedPhoto(null)}
            className="absolute top-4 right-4 w-10 h-10 md:w-12 md:h-12 rounded-full border-2 border-gold text-gold-dark text-lg md:text-xl flex items-center justify-center glass-card hover:bg-gold/20 z-20 font-bold cursor-pointer transition-transform hover:scale-105"
            aria-label="Cerrar"
          >
            ✕
          </button>

          <div
            onClick={e => e.stopPropagation()}
            className="relative max-w-2xl w-full rounded-3xl overflow-hidden border-2 border-gold glass-card p-3 sm:p-4 shadow-2xl"
          >
            <div className="overflow-hidden rounded-2xl bg-cream/60 max-h-[75vh] flex items-center justify-center">
              <img
                src={selectedPhoto.src}
                alt={selectedPhoto.title}
                className="max-h-[72vh] w-auto max-w-full object-contain rounded-xl mx-auto shadow-md"
              />
            </div>
            <div className="p-3 text-center">
              <span className="text-[10px] font-montserrat uppercase tracking-wider text-gold-dark font-bold bg-gold/15 px-2.5 py-0.5 rounded-full border border-gold/30">
                {selectedPhoto.subtitle}
              </span>
              <p className="font-playfair text-lg text-text-main font-bold mt-1">
                {selectedPhoto.title}
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}

// ─── RSVP Section ──────────────────────────────────────────────────────────────
function RSVPSection({ onTriggerSwarm }: { onTriggerSwarm: () => void }) {
  const [name, setName] = useState('')
  const [attendance, setAttendance] = useState<'yes' | 'no'>('yes')
  const [guests, setGuests] = useState('1')
  const [note, setNote] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return

    onTriggerSwarm()

    const statusText = attendance === 'yes' ? '¡Sí asistiré a tus 15 años! 🌸' : 'Lamentablemente no podré asistir 💔'
    
    // Guardar en Google Sheets de forma transparente
    sendToGoogleSheets('rsvp', {
      name: name.trim(),
      guests: attendance === 'yes' ? guests : '0',
      attendance: statusText,
      note
    })

    const msg = encodeURIComponent(
      `Hola ${QUINCE_NAME}! Confirmo mi respuesta para tus Quince Años del 17 de Octubre:\n\n` +
      `👤 *Nombre:* ${name.trim()}\n` +
      `✨ *Asistencia:* ${statusText}\n` +
      (attendance === 'yes' ? `👥 *Invitados:* ${guests} persona(s)\n` : '') +
      (note ? `💬 *Mensaje:* ${note}\n` : '') +
      `\n¡Nos vemos pronto!`
    )

    window.open(`https://wa.me/${WHATSAPP_PHONE}?text=${msg}`, '_blank')
    setSubmitted(true)
  }

  return (
    <section id="rsvp" className="relative py-16 md:py-24 px-4 md:px-6">
      <div className="section-sep mb-16 md:mb-20" />
      <div className="max-w-xl mx-auto">
        {/* Header exacto como en la imagen */}
        <div className="text-center mb-6 px-2">
          <p className="text-[11px] sm:text-xs uppercase tracking-[0.25em] font-montserrat text-[#7A5B30] mb-2 font-bold flex items-center justify-center gap-2.5">
            <GoldButterfly size={16} />
            <span>CONFIRMACIÓN DE ASISTENCIA</span>
            <GoldButterfly size={16} />
          </p>

          <h2 className="text-5xl sm:text-6xl md:text-7xl font-script text-[#6D5127] py-1 leading-tight">
            ¿Nos Acompañas?
          </h2>

          <div className="text-[#8C6D3B] text-xs my-2">✦</div>

          <div className="font-playfair text-[#5C4524] text-sm sm:text-base leading-relaxed max-w-lg mx-auto space-y-3 px-2 mb-8">
            <p>
              Tu confirmación es muy importante para nosotros.<br />
              Nos ayuda a contemplar tu lugar y tu comodidad<br />
              al acompañarnos en este momento tan especial.
            </p>
            <p className="text-xs sm:text-sm text-[#7A5B30]">
              Por favor, confirma tu asistencia<br />
              completando la siguiente información.
            </p>
          </div>
        </div>

        {submitted ? (
          <div className="max-w-md w-full mx-auto bg-[#FAF6EE] border border-[#D9CABA] rounded-3xl p-8 text-center flex flex-col items-center gap-4 shadow-xl shadow-[#8C6D3B]/5 animate-fade-in-up">
            <div className="w-16 h-16 rounded-full border border-[#937136] flex items-center justify-center bg-gradient-to-b from-[#CDB27E] via-[#BA975C] to-[#A47F42] text-[#2E1F0B] shadow-md">
              <GoldButterfly size={32} />
            </div>
            <h3 className="font-script text-4xl sm:text-5xl text-[#6D5127]">¡Gracias por Confirmar!</h3>
            <p className="font-playfair italic text-[#5C4524] text-sm leading-relaxed">
              Tu respuesta ha sido registrada con éxito. ¡Esperamos verte en este día tan especial!
            </p>
            <button
              type="button"
              onClick={() => setSubmitted(false)}
              className="text-xs uppercase tracking-widest text-[#8C6D3B] underline hover:text-[#5C4524] font-montserrat font-bold mt-2 cursor-pointer"
            >
              Enviar otra confirmación
            </button>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="max-w-md w-full mx-auto bg-[#FAF6EE]/95 backdrop-blur-sm border border-[#D9CABA] rounded-3xl p-5 sm:p-7 md:p-8 shadow-xl shadow-[#8C6D3B]/5 flex flex-col gap-5"
          >
            {/* Nombre Completo */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] sm:text-[11px] uppercase tracking-[0.18em] font-montserrat text-[#6D5229] font-bold">
                NOMBRE COMPLETO *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Ej. María Fernanda López"
                className="w-full bg-[#FFFDF9] border border-[#D9CABA] focus:border-[#AA874C] rounded-2xl px-4 py-3.5 text-sm sm:text-base text-[#3E2B16] placeholder:text-[#9F8C76]/70 outline-none transition-colors font-medium shadow-inner shadow-black/[0.02]"
              />
            </div>

            {/* Asistencia */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] sm:text-[11px] uppercase tracking-[0.18em] font-montserrat text-[#6D5229] font-bold">
                ¿ASISTIRÁS AL EVENTO?
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setAttendance('yes')}
                  className={`py-3 px-2 rounded-2xl text-xs sm:text-sm font-montserrat uppercase tracking-wider font-bold transition-all cursor-pointer ${
                    attendance === 'yes'
                      ? 'bg-gradient-to-b from-[#CDB27E] via-[#BA975C] to-[#A47F42] text-[#2E1F0B] border border-[#937136] shadow-md'
                      : 'bg-[#FFFDF9] border border-[#D9CABA] text-[#5C4524] hover:border-[#AA874C]'
                  }`}
                >
                  SÍ, ASISTIRÉ
                </button>
                <button
                  type="button"
                  onClick={() => setAttendance('no')}
                  className={`py-3 px-2 rounded-2xl text-xs sm:text-sm font-montserrat uppercase tracking-wider font-bold transition-all cursor-pointer ${
                    attendance === 'no'
                      ? 'bg-gradient-to-b from-[#CDB27E] via-[#BA975C] to-[#A47F42] text-[#2E1F0B] border border-[#937136] shadow-md'
                      : 'bg-[#FFFDF9] border border-[#D9CABA] text-[#5C4524] hover:border-[#AA874C]'
                  }`}
                >
                  NO PODRÉ ASISTIR
                </button>
              </div>
            </div>

            {/* Número de personas */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] sm:text-[11px] uppercase tracking-[0.18em] font-montserrat text-[#6D5229] font-bold">
                NÚMERO DE PERSONAS QUE ASISTIRÁN
              </label>
              <div className="grid grid-cols-5 gap-2">
                {['1', '2', '3', '4', '5+'].map(num => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setGuests(num)}
                    className={`py-2.5 sm:py-3 rounded-2xl text-sm sm:text-base font-montserrat font-bold transition-all cursor-pointer ${
                      guests === num
                        ? 'bg-gradient-to-b from-[#CDB27E] via-[#BA975C] to-[#A47F42] text-[#2E1F0B] border border-[#937136] shadow-md'
                        : 'bg-[#FFFDF9] border border-[#D9CABA] text-[#5C4524] hover:border-[#AA874C]'
                    }`}
                  >
                    {num}
                  </button>
                ))}
              </div>
            </div>

            {/* Mensaje */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] sm:text-[11px] uppercase tracking-[0.18em] font-montserrat text-[#6D5229] font-bold">
                MENSAJE PARA KRISTA MARIEL / RESTRICCIONES
              </label>
              <textarea
                rows={3}
                value={note}
                onChange={e => setNote(e.target.value)}
                placeholder="Escribe aquí un mensaje especial para la quinceañera..."
                className="w-full bg-[#FFFDF9] border border-[#D9CABA] focus:border-[#AA874C] rounded-2xl px-4 py-3.5 text-sm sm:text-base text-[#3E2B16] placeholder:text-[#9F8C76]/70 outline-none transition-colors resize-none font-medium shadow-inner shadow-black/[0.02]"
              />
            </div>

            {/* Botón Confirmar Asistencia */}
            <button
              type="submit"
              className="w-full py-3.5 sm:py-4 rounded-2xl bg-gradient-to-b from-[#D4B680] via-[#C29E60] to-[#A88040] text-[#2C1D0B] font-montserrat font-bold text-xs sm:text-sm uppercase tracking-[0.2em] shadow-lg shadow-[#A88040]/25 hover:brightness-105 active:scale-[0.99] transition-all cursor-pointer border border-[#9E7B3D] mt-2"
            >
              CONFIRMAR ASISTENCIA
            </button>
          </form>
        )}

        {/* Cierre final idéntico a la imagen */}
        <div className="mt-8 text-center">
          <span className="text-[#8C6D3B] text-xs block mb-3">✦</span>
          <p className="font-playfair italic text-[#6D5229] text-xs sm:text-sm leading-relaxed max-w-sm mx-auto px-4 pb-4">
            Tu confirmación nos ayudará a tener todo listo<br />
            para recibirte con la mejor atención.
          </p>
        </div>
      </div>
    </section>
  )
}


// ─── Carta Especial de Krista Mariel (Lámina 2 Oficial) ───────────────────────
function KristaLetterSection() {
  return (
    <section id="carta" className="relative py-12 md:py-20 px-4 md:px-6">
      <div className="section-sep mb-12 md:mb-16" />
      <StationeryPlate className="max-w-xl">
        <p className="text-xs uppercase tracking-[0.35em] font-cinzel text-gold-dark font-bold mb-1">
          MENSAJE ESPECIAL
        </p>

        <span className="text-gold-dark text-xs my-1">✦</span>

        {/* Golden Circle with Embossed Butterfly matching image copy.png */}
        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border border-gold/70 flex items-center justify-center text-3xl sm:text-4xl bg-gradient-to-b from-[#FFFDF9] via-[#FAF3E6] to-[#F1E4CE] shadow-md my-2">
          <GoldButterfly size={36} />
        </div>

        <p className="text-xs sm:text-sm uppercase tracking-[0.35em] font-cinzel text-gold-dark font-bold mt-1">
          PALABRAS DE
        </p>

        <h2 className="font-script text-6xl sm:text-7xl md:text-8xl gold-text-gradient leading-tight my-1 drop-shadow-sm">
          Krista Mariel
        </h2>

        <span className="text-gold-dark text-xs my-2">✦</span>

        <p className="font-playfair italic text-text-main text-base sm:text-lg md:text-xl leading-relaxed max-w-lg font-medium px-2 my-2">
          “Hay momentos que marcan el comienzo de una nueva etapa. Hoy quiero celebrar uno de los más especiales de mi vida, rodeada de quienes quiero y agradecida por compartirlo contigo.”
        </p>

        <div className="mt-4 flex flex-col items-center gap-1">
          <span className="font-script text-4xl sm:text-5xl text-gold-dark">Krista Mariel</span>
          <span className="text-gold-dark text-xs my-1">✦</span>
          <span className="text-[11px] sm:text-xs uppercase tracking-[0.3em] font-cinzel text-text-main font-bold">
            17 DE OCTUBRE, 2026
          </span>
          <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.25em] font-cinzel text-text-sub font-semibold">
            SALÓN QUINTA MARÍA TERESA
          </span>
        </div>

        <div className="flex items-center gap-3 mt-6 opacity-75">
          <div className="h-px w-12 bg-gold/50" />
          <GoldButterfly size={16} />
          <div className="h-px w-12 bg-gold/50" />
        </div>
      </StationeryPlate>
    </section>
  )
}

// ─── Special Video Section (Cine VIP de Krista Mariel - Alta Performance) ──────
function SpecialVideoSection({
  onTriggerToast,
  onTriggerBurst,
}: {
  onTriggerToast: (msg: string) => void
  onTriggerBurst?: () => void
}) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [hasStarted, setHasStarted] = useState(false)
  const [isEnded, setIsEnded] = useState(false)
  const [isCinemaModalOpen, setIsCinemaModalOpen] = useState(false)
  const [showControls, setShowControls] = useState(true)

  const videoRef = useRef<HTMLVideoElement | null>(null)
  const modalVideoRef = useRef<HTMLVideoElement | null>(null)
  const progressFillRef = useRef<HTMLDivElement | null>(null)
  const timeDisplayRef = useRef<HTMLSpanElement | null>(null)
  const hideControlsTimeout = useRef<number | null>(null)

  const formatSec = (sec: number) => {
    const s = Math.floor(sec)
    const m = Math.floor(s / 60)
    const rem = s % 60
    return `${m}:${rem < 10 ? '0' : ''}${rem}`
  }

  const handlePlay = () => {
    const video = videoRef.current
    if (!video) return

    // Pausar música de fondo y pausar el loop del canvas de mariposas para liberar 100% de CPU/GPU
    window.dispatchEvent(new CustomEvent('pause-bg-music'))
    window.dispatchEvent(new CustomEvent('pause-butterflies'))

    if (onTriggerBurst && !hasStarted) {
      onTriggerBurst()
    }

    video.play().then(() => {
      setIsPlaying(true)
      setHasStarted(true)
      setIsEnded(false)
      onTriggerToast("🎬 Reproduciendo Video Especial de Krista Mariel ✨")
    }).catch(err => {
      console.warn("Play error", err)
    })
  }

  const handlePause = () => {
    const video = videoRef.current
    if (!video) return
    video.pause()
    setIsPlaying(false)
    window.dispatchEvent(new CustomEvent('resume-bg-music'))
    window.dispatchEvent(new CustomEvent('resume-butterflies'))
  }

  const togglePlay = () => {
    if (isPlaying) {
      handlePause()
    } else {
      handlePlay()
    }
  }

  const handleEnded = () => {
    setIsPlaying(false)
    setIsEnded(true)
    window.dispatchEvent(new CustomEvent('resume-bg-music'))
    window.dispatchEvent(new CustomEvent('resume-butterflies'))
    onTriggerToast("✨ ¡Gracias por disfrutar el video de Krista Mariel! ✦")
  }

  // Actualización ultra-ligera sin re-renderizar React (Direct DOM update a 60fps)
  const handleTimeUpdate = () => {
    const video = videoRef.current
    if (!video) return
    const cur = video.currentTime
    const dur = video.duration || 36
    const pct = Math.min(100, (cur / dur) * 100)

    if (progressFillRef.current) {
      progressFillRef.current.style.width = `${pct}%`
    }
    if (timeDisplayRef.current) {
      timeDisplayRef.current.textContent = `${formatSec(cur)} / ${formatSec(dur)}`
    }
  }

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const video = videoRef.current
    if (!video) return
    const rect = e.currentTarget.getBoundingClientRect()
    const clickX = e.clientX - rect.left
    const pct = Math.max(0, Math.min(1, clickX / rect.width))
    const targetTime = pct * (video.duration || 36)
    video.currentTime = targetTime
    if (progressFillRef.current) {
      progressFillRef.current.style.width = `${pct * 100}%`
    }
    if (timeDisplayRef.current) {
      timeDisplayRef.current.textContent = `${formatSec(targetTime)} / ${formatSec(video.duration || 36)}`
    }
  }

  const toggleMute = () => {
    const video = videoRef.current
    if (video) {
      const nextMuted = !isMuted
      video.muted = nextMuted
      setIsMuted(nextMuted)
    }
  }

  const handleMouseMoveControls = () => {
    if (!showControls) setShowControls(true)
    if (hideControlsTimeout.current) clearTimeout(hideControlsTimeout.current)
    if (isPlaying) {
      hideControlsTimeout.current = window.setTimeout(() => {
        setShowControls(false)
      }, 3500)
    }
  }

  const openCinemaModal = () => {
    handlePause()
    setIsCinemaModalOpen(true)
    window.dispatchEvent(new CustomEvent('pause-bg-music'))
    window.dispatchEvent(new CustomEvent('pause-butterflies'))
  }

  const closeCinemaModal = () => {
    if (modalVideoRef.current) {
      modalVideoRef.current.pause()
    }
    setIsCinemaModalOpen(false)
    window.dispatchEvent(new CustomEvent('resume-bg-music'))
    window.dispatchEvent(new CustomEvent('resume-butterflies'))
  }

  const shareVideo = async () => {
    const isLocal = typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
    const shareUrl = isLocal ? PRODUCTION_URL : (typeof window !== 'undefined' ? window.location.href : PRODUCTION_URL)

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Video Especial de Quince Años · Krista Mariel',
          text: '¡Mira el video especial de los Quince Años de Krista Mariel!',
          url: shareUrl,
        })
      } catch (err) {
        console.warn("Share cancelled", err)
      }
    } else {
      navigator.clipboard.writeText(shareUrl)
      onTriggerToast("¡Enlace de la invitación copiado para compartir! 📲")
    }
  }


  return (
    <section id="video-especial" className="relative py-12 md:py-20 px-4 md:px-6">
      <div className="section-sep mb-12 md:mb-16" />
      <StationeryPlate className="max-w-xl">
        {/* Top Header matching image copy 3.png */}
        <p className="text-xs uppercase tracking-[0.35em] font-cinzel text-gold-dark font-bold">
          KRISTA MARIEL
        </p>
        <span className="text-gold-dark text-xs my-1">✦</span>

        <div className="flex items-center gap-2 my-1">
          <GoldButterfly size={16} />
          <span className="text-xs uppercase tracking-[0.3em] font-cinzel text-gold-dark font-bold">
            MOMENTO ESTELAR
          </span>
          <GoldButterfly size={16} />
        </div>

        <h2 className="text-3xl sm:text-4xl md:text-5xl font-cinzel text-text-main my-1 font-normal">
          Video Especial de{' '}
          <span className="font-script text-5xl sm:text-6xl md:text-7xl text-gold-dark block sm:inline">
            Krista Mariel
          </span>
        </h2>

        <span className="text-gold-dark text-xs my-1.5">✦</span>

        <p className="font-playfair italic text-text-main text-center text-sm md:text-base max-w-lg mb-6 px-2 font-medium">
          “Un instante irrepetible capturado en video, lleno de luz, emoción y la alegría de celebrar mis 15 años.”
        </p>

        {/* Ambient Glow & Cinema Frame Container */}
        <div className="relative w-full max-w-[340px] sm:max-w-[360px] mx-auto group my-2">
          {/* Hardware-Accelerated Ambient Backlight Glow */}
          <div
            className="absolute -inset-4 sm:-inset-6 rounded-[38px] bg-gradient-to-tr from-gold/30 via-[#FFE57F]/20 to-gold-dark/30 blur-xl pointer-events-none opacity-60 transform-gpu"
            style={{ transform: 'translateZ(0)', willChange: 'opacity' }}
          />

          {/* Luxury Filigree Reel Container */}
          <div
            onMouseMove={handleMouseMoveControls}
            className="relative w-full aspect-[9/16] rounded-3xl overflow-hidden border-2 border-gold/70 bg-[#120F0D] shadow-[0_20px_60px_-10px_rgba(196,161,99,0.35)] flex flex-col justify-between select-none"
          >
            {/* Ornate Gold Filigree Corner Accents */}
            <div className="absolute top-2.5 left-2.5 w-6 h-6 border-t-2 border-l-2 border-gold pointer-events-none z-20" />
            <div className="absolute top-2.5 right-2.5 w-6 h-6 border-t-2 border-r-2 border-gold pointer-events-none z-20" />
            <div className="absolute bottom-2.5 left-2.5 w-6 h-6 border-b-2 border-l-2 border-gold pointer-events-none z-20" />
            <div className="absolute bottom-2.5 right-2.5 w-6 h-6 border-b-2 border-r-2 border-gold pointer-events-none z-20" />

            {/* Top VIP Reel Header Bar */}
            <div className="relative z-20 p-3 sm:p-4 flex items-center justify-between bg-gradient-to-b from-black/80 via-black/40 to-transparent pointer-events-auto">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                <span className="text-[9px] uppercase tracking-[0.25em] font-montserrat font-bold text-gold-light">
                  {isPlaying ? 'EN REPRODUCCIÓN' : 'VIDEO EXCLUSIVO'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[9px] font-montserrat uppercase tracking-widest text-white/80 bg-white/10 px-2 py-0.5 rounded-full border border-gold/40 font-semibold">
                  HD · 0:36
                </span>
                <button
                  onClick={openCinemaModal}
                  className="p-1 rounded-full text-gold-light hover:text-white transition-colors cursor-pointer"
                  title="Ver en Modo Cine VIP"
                >
                  ⛶
                </button>
              </div>
            </div>

            {/* Hardware-Accelerated Video Element */}
            <video
              ref={videoRef}
              src="/videos/krista_quinceanera_video.mp4"
              poster="/images/krista_portrait_1.jpg"
              playsInline
              preload="auto"
              style={{ transform: 'translateZ(0)', willChange: 'transform' }}
              onTimeUpdate={handleTimeUpdate}
              onEnded={handleEnded}
              onClick={togglePlay}
              className="absolute inset-0 w-full h-full object-cover cursor-pointer transform-gpu"
            />

            {/* Luxury Poster / Start Screen Overlay */}
            {!hasStarted && (
              <div
                onClick={handlePlay}
                className="absolute inset-0 z-10 bg-gradient-to-t from-black/80 via-black/25 to-black/50 flex flex-col items-center justify-center p-6 text-center cursor-pointer group/overlay transition-all"
              >
                {/* Golden Animated Circular Play Button */}
                <div className="relative my-auto flex items-center justify-center">
                  <div className="absolute w-24 h-24 rounded-full bg-gold/30 blur-xl animate-pulse-glow" />
                  <div className="w-20 h-20 rounded-full border-2 border-gold bg-gradient-to-tr from-gold-dark via-gold to-gold-light flex items-center justify-center shadow-2xl group-hover/overlay:scale-110 transition-transform active:scale-95 text-text-main">
                    <svg className="w-8 h-8 ml-1 fill-current" viewBox="0 0 24 24">
                      <polygon points="5 3 19 12 5 21 5 3" />
                    </svg>
                  </div>
                </div>

                <div className="mt-auto flex flex-col items-center gap-1 pb-4">
                  <span className="text-xs uppercase tracking-[0.3em] font-montserrat text-gold-light font-bold">
                    Toca para Reproducir
                  </span>
                </div>
              </div>
            )}

            {/* Finished Video Overlay */}
            {isEnded && (
              <div
                onClick={handlePlay}
                className="absolute inset-0 z-10 bg-black/85 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center animate-fade-in cursor-pointer"
              >
                <div className="w-16 h-16 rounded-full border-2 border-gold flex items-center justify-center bg-gold/15 shadow-xl mb-3">
                  <GoldButterfly size={32} />
                </div>
                <h4 className="font-greatvibes text-3xl gold-text-gradient mb-1">
                  ¡Gracias por acompañarme!
                </h4>
                <p className="font-playfair italic text-xs text-white/90 max-w-xs mb-4">
                  Nos vemos este 17 de Octubre en Quinta Maria Teresa para celebrar juntos.
                </p>
                <button
                  onClick={e => { e.stopPropagation(); handlePlay(); }}
                  className="px-5 py-2 rounded-full bg-gradient-to-r from-gold to-gold-dark text-text-main font-montserrat text-xs font-bold uppercase tracking-wider shadow-lg flex items-center gap-1.5 cursor-pointer hover:brightness-110"
                >
                  <span>🔄</span> Volver a ver
                </button>
              </div>
            )}

            {/* Bottom Cinema Controls Bar */}
            <div
              className={`relative z-20 p-3 sm:p-4 bg-gradient-to-t from-black/90 via-black/60 to-transparent flex flex-col gap-2 transition-opacity duration-300 pointer-events-auto ${
                hasStarted && !isEnded && showControls ? 'opacity-100' : hasStarted && !isEnded ? 'opacity-0 pointer-events-none' : 'opacity-100'
              }`}
            >
              {/* Ultra-Smooth Zero-Re-Render Progress Bar */}
              <div
                onClick={handleProgressClick}
                className="relative w-full h-2 bg-white/20 hover:h-2.5 rounded-full cursor-pointer overflow-hidden transition-all group/bar"
                title="Avanzar o retroceder"
              >
                <div
                  ref={progressFillRef}
                  className="absolute left-0 top-0 bottom-0 bg-gradient-to-r from-gold-light via-gold to-gold-dark rounded-full transition-none w-0"
                />
              </div>

              {/* Controls and Timer Row */}
              <div className="flex items-center justify-between text-white text-xs">
                <div className="flex items-center gap-2.5">
                  <button
                    onClick={togglePlay}
                    className="w-8 h-8 rounded-full border border-gold/60 bg-gold/20 flex items-center justify-center text-gold-light hover:bg-gold/40 transition-colors cursor-pointer"
                    title={isPlaying ? "Pausar" : "Reproducir"}
                  >
                    {isPlaying ? '⏸' : '▶'}
                  </button>

                  <button
                    onClick={toggleMute}
                    className="text-white/80 hover:text-white transition-colors cursor-pointer"
                    title={isMuted ? "Activar Audio" : "Silenciar Audio"}
                  >
                    {isMuted ? '🔇' : '🔊'}
                  </button>

                  <span ref={timeDisplayRef} className="text-[10px] font-montserrat font-semibold text-white/90">
                    0:00 / 0:36
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={openCinemaModal}
                    className="px-2.5 py-1 rounded-full bg-white/10 border border-gold/40 text-[9px] font-montserrat uppercase tracking-wider text-gold-light font-bold hover:bg-gold/25 transition-all flex items-center gap-1 cursor-pointer"
                  >
                    <span>🎬</span> Modo Cine
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Action Badges Under Video */}
        <div className="mt-4 flex flex-wrap justify-center gap-2.5 w-full max-w-md">
          <button
            onClick={openCinemaModal}
            className="px-5 py-2 rounded-full glass-card border border-gold/50 text-gold-dark text-[11px] font-cinzel font-bold flex items-center gap-1.5 shadow-sm hover:scale-105 active:scale-95 transition-all cursor-pointer"
          >
            <span>🎬</span> Pantalla Completa VIP ✦
          </button>
          <button
            onClick={shareVideo}
            className="px-5 py-2 rounded-full glass-card border border-gold/50 text-gold-dark text-[11px] font-cinzel font-bold flex items-center gap-1.5 shadow-sm hover:scale-105 active:scale-95 transition-all cursor-pointer"
          >
            <span>📱</span> Compartir con Familia ✦
          </button>
        </div>

        {/* Bottom ornament matching image copy 3.png */}
        <div className="flex items-center gap-3 mt-6 opacity-75">
          <div className="h-px w-12 bg-gold/50" />
          <GoldButterfly size={16} />
          <div className="h-px w-12 bg-gold/50" />
        </div>
      </StationeryPlate>

      {/* Full-Screen Cinema VIP Theater Modal */}
      {isCinemaModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-2xl flex flex-col items-center justify-center p-3 sm:p-6 animate-fade-in"
          onClick={closeCinemaModal}
        >
          {/* Close Cinema Button */}
          <button
            onClick={closeCinemaModal}
            className="fixed top-4 right-4 z-[60] px-4 py-2.5 rounded-full border-2 border-gold/70 bg-black/80 backdrop-blur-md text-gold-light text-xs uppercase tracking-widest font-montserrat font-bold hover:bg-gold/20 flex items-center gap-2 shadow-2xl cursor-pointer"
          >
            <span>✕</span> Cerrar Cine VIP
          </button>

          <div
            onClick={e => e.stopPropagation()}
            className="relative w-full max-w-sm sm:max-w-md aspect-[9/16] rounded-3xl overflow-hidden border-2 border-gold shadow-[0_0_80px_rgba(212,175,55,0.4)] bg-black flex flex-col"
          >
            <video
              ref={modalVideoRef}
              src="/videos/krista_quinceanera_video.mp4"
              controls
              autoPlay
              playsInline
              preload="auto"
              style={{ transform: 'translateZ(0)', willChange: 'transform' }}
              className="w-full h-full object-cover transform-gpu"
            />
          </div>

          <div className="mt-4 text-center">
            <p className="font-greatvibes text-2xl sm:text-3xl gold-text-gradient">
              XV Años de Krista Mariel
            </p>
            <p className="text-[10px] uppercase tracking-widest font-montserrat text-gold/80 font-bold">
              17 de Octubre, 2026 · Quinta Maria Teresa
            </p>
          </div>
        </div>
      )}
    </section>
  )
}

// ─── VIP Pass Generator Section ────────────────────────────────────────────────
function VIPPassSection({ onTriggerToast }: { onTriggerToast: (msg: string) => void }) {
  const [guestName, setGuestName] = useState('')
  const [passCount, setPassCount] = useState('2')
  const [generated, setGenerated] = useState(false)
  const passCanvasRef = useRef<HTMLCanvasElement | null>(null)

  const handleGeneratePass = (e: React.FormEvent) => {
    e.preventDefault()
    if (!guestName.trim()) return
    setGenerated(true)
    onTriggerToast("¡Pase de Gala personal generado! 🎫")
  }

  useEffect(() => {
    if (!generated || !guestName) return
    const canvas = passCanvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = 700
    canvas.height = 380

    // Background gradient
    const grad = ctx.createLinearGradient(0, 0, 700, 380)
    grad.addColorStop(0, '#FAF6F0')
    grad.addColorStop(0.5, '#FFF8C5')
    grad.addColorStop(1, '#F5E6D3')
    ctx.fillStyle = grad
    ctx.fillRect(0, 0, 700, 380)

    // Border
    ctx.strokeStyle = '#D4AF37'
    ctx.lineWidth = 10
    ctx.strokeRect(10, 10, 680, 360)

    ctx.strokeStyle = '#9A7B38'
    ctx.lineWidth = 2
    ctx.strokeRect(20, 20, 660, 340)

    // Details
    ctx.fillStyle = '#9A7B38'
    ctx.font = 'bold 12px "Montserrat", sans-serif'
    ctx.fillText('PASE DE GALA VIP · MIS XV AÑOS', 50, 50)

    ctx.fillStyle = '#2D1F38'
    ctx.font = 'bold 34px "Great Vibes", cursive'
    ctx.fillText('Krista Mariel Sandoval Caldera', 50, 95)

    ctx.fillStyle = '#2E6B34'
    ctx.font = 'bold 14px "Montserrat", sans-serif'
    ctx.fillText(`INVITADO(A): ${guestName.toUpperCase()}`, 50, 145)
    ctx.fillText(`PASES CONFIRMADOS: ${passCount} PERSONA(S)`, 50, 175)

    ctx.fillStyle = '#6E531E'
    ctx.font = '12px "Montserrat", sans-serif'
    ctx.fillText('📅 SÁBADO 17 DE OCTUBRE, 2026', 50, 225)
    ctx.fillText('⛪ MISA: 1:00 PM · TEMPLO DE LA SAGRADA FAMILIA', 50, 250)
    ctx.fillText('📍 RECEPCIÓN: 3:00 PM · SALÓN QUINTA MARÍA TERESA', 50, 275)

    // Monogram Stamp
    ctx.fillStyle = '#D4AF37'
    ctx.beginPath()
    ctx.arc(580, 190, 65, 0, Math.PI * 2)
    ctx.fill()

    ctx.fillStyle = '#FAF6F0'
    ctx.beginPath()
    ctx.arc(580, 190, 58, 0, Math.PI * 2)
    ctx.fill()

    ctx.fillStyle = '#9A7B38'
    ctx.font = 'bold 32px "Cinzel Decorative", serif'
    ctx.textAlign = 'center'
    ctx.fillText('KM', 580, 198)

    ctx.font = 'bold 9px "Montserrat", sans-serif'
    ctx.fillText('17 · OCT · 2026', 580, 225)
  }, [generated, guestName, passCount])

  const downloadPass = () => {
    const canvas = passCanvasRef.current
    if (!canvas) return
    const link = document.createElement('a')
    link.download = `Pase_VIP_${guestName.replace(/\s+/g, '_')}_KristaMariel.png`
    link.href = canvas.toDataURL('image/png')
    link.click()
    onTriggerToast("¡Pase descargado exitosamente! 📥")
  }

  return (
    <section id="pase-vip" className="relative py-16 md:py-24 px-4 md:px-6">
      <div className="section-sep mb-16 md:mb-20" />
      <div className="max-w-4xl mx-auto">
        <SectionHeader tag="Pase Digital VIP" title="Genera tu Boleto de Gala" />

        <div className="glass-card p-6 md:p-10 rounded-3xl border-2 border-gold/40 text-center flex flex-col items-center gap-6 shadow-xl">
          <p className="text-xs md:text-sm font-montserrat text-text-sub font-medium leading-relaxed max-w-xl">
            Ingresa tu nombre para generar tu pase de gala personal con código de acceso para mostrar al llegar a Quinta Maria Teresa.
          </p>

          <form onSubmit={handleGeneratePass} className="w-full max-w-md flex flex-col gap-4">
            <div className="flex flex-col gap-1 text-left">
              <label className="text-[10px] uppercase tracking-widest font-montserrat text-gold-dark font-bold">
                Nombre del Invitado *
              </label>
              <input
                type="text"
                required
                value={guestName}
                onChange={e => setGuestName(e.target.value)}
                placeholder="Ej. Familia Sandoval"
                className="w-full bg-cream border border-gold/40 focus:border-gold rounded-2xl px-4 py-3 text-sm text-text-main placeholder:text-text-muted outline-none font-medium"
              />
            </div>

            <div className="flex flex-col gap-1 text-left">
              <label className="text-[10px] uppercase tracking-widest font-montserrat text-gold-dark font-bold">
                Número de Pases
              </label>
              <select
                value={passCount}
                onChange={e => setPassCount(e.target.value)}
                className="w-full bg-cream border border-gold/40 focus:border-gold rounded-2xl px-4 py-3 text-sm text-text-main outline-none font-medium"
              >
                <option value="1">1 Pase Personal</option>
                <option value="2">2 Pases (Pareja)</option>
                <option value="3">3 Pases (Familia)</option>
                <option value="4">4 Pases (Familia)</option>
                <option value="5+">5+ Pases Especiales</option>
              </select>
            </div>

            <button
              type="submit"
              className="py-3.5 rounded-2xl bg-gradient-to-r from-gold-light via-gold to-gold-dark text-text-main font-montserrat font-bold text-xs uppercase tracking-wider shadow-md hover:brightness-110 transition-all mt-1"
            >
              Generar Mi Pase VIP 🎫
            </button>
          </form>

          {generated && (
            <div className="flex flex-col items-center gap-5 w-full mt-4 animate-fade-in-up">
              <div className="relative w-full max-w-2xl rounded-2xl overflow-hidden shadow-2xl border-2 border-gold">
                <canvas ref={passCanvasRef} className="w-full h-auto object-contain" />
              </div>

              <button
                onClick={downloadPass}
                className="px-6 py-2.5 rounded-full bg-gradient-to-r from-gold to-gold-dark text-text-main font-montserrat font-bold text-xs hover:brightness-110 transition-all shadow-md flex items-center gap-2"
              >
                <span>📥</span> Descargar Pase Digital VIP
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

// ─── Live AR Selfie Camera Modal with Royal Tiara & Butterflies ────────────────
function ARCameraModal({ isOpen, onClose, onTriggerToast }: { isOpen: boolean; onClose: () => void; onTriggerToast: (msg: string) => void }) {
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const [capturedImage, setCapturedImage] = useState<string | null>(null)

  useEffect(() => {
    if (!isOpen) return
    let stream: MediaStream | null = null

    navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } })
      .then(s => {
        stream = s
        if (videoRef.current) {
          videoRef.current.srcObject = s
          videoRef.current.play()
        }
      })
      .catch(err => {
        console.warn("Camera access denied", err)
        onTriggerToast("Cámara no disponible. Puedes usar el marco de fotos para Stories.")
      })

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop())
      }
    }
  }, [isOpen, onTriggerToast])

  const takeSnapshot = () => {
    const video = videoRef.current
    if (!video) return
    const canvas = document.createElement('canvas')
    canvas.width = video.videoWidth || 640
    canvas.height = video.videoHeight || 480
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height)

    const cx = canvas.width / 2
    const tiaraY = canvas.height * 0.22

    ctx.fillStyle = '#D4AF37'
    ctx.beginPath()
    ctx.arc(cx, tiaraY, 40, Math.PI, 0)
    ctx.fill()

    ctx.fillStyle = '#FFF5B8'
    ctx.beginPath()
    ctx.arc(cx, tiaraY - 20, 12, 0, Math.PI * 2)
    ctx.fill()

    ctx.fillStyle = '#FAF6F0'
    ctx.font = 'bold 24px "Great Vibes", cursive'
    ctx.textAlign = 'center'
    ctx.fillText('Krista Mariel · XV Años', cx, canvas.height - 40)
    ctx.font = 'bold 12px "Montserrat", sans-serif'
    ctx.fillText('Quinta Maria Teresa · 17.10.2026 ✦', cx, canvas.height - 20)

    setCapturedImage(canvas.toDataURL('image/png'))
    onTriggerToast("¡Selfie capturada con éxito! 📸")
  }

  const downloadSelfie = () => {
    if (!capturedImage) return
    const link = document.createElement('a')
    link.download = `Selfie_Tiara_KristaMariel.png`
    link.href = capturedImage
    link.click()
    onTriggerToast("¡Foto con tiara guardada! 👑")
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 bg-cream/95 backdrop-blur-2xl flex items-center justify-center p-4">
      <div className="glass-card p-6 rounded-3xl max-w-md w-full text-center flex flex-col items-center gap-4 border-2 border-gold relative shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gold-dark text-lg font-bold"
        >
          ✕
        </button>

        <h3 className="font-greatvibes text-3xl gold-text-gradient">Selfie Real con Tiara & Mariposas</h3>
        <p className="text-xs font-montserrat text-text-sub font-medium">
          Mírate con la corona real dorada de Krista Mariel y tómate una foto para tus historias.
        </p>

        {!capturedImage ? (
          <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden bg-text-main border-2 border-gold flex items-center justify-center">
            <video ref={videoRef} className="w-full h-full object-cover transform -scale-x-100" />
            <div className="absolute top-4 left-1/2 -translate-x-1/2 text-4xl animate-bounce pointer-events-none">
              👑
            </div>
          </div>
        ) : (
          <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden border-2 border-gold shadow-md">
            <img src={capturedImage} alt="Selfie AR" className="w-full h-full object-cover" />
          </div>
        )}

        <div className="flex gap-3 w-full">
          {!capturedImage ? (
            <button
              onClick={takeSnapshot}
              className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-gold to-gold-dark text-text-main font-montserrat font-bold text-xs uppercase tracking-wider shadow-md"
            >
              Capturar Foto 📸
            </button>
          ) : (
            <>
              <button
                onClick={() => setCapturedImage(null)}
                className="flex-1 py-3 rounded-2xl border border-gold text-gold-dark font-montserrat font-bold text-xs uppercase tracking-wider"
              >
                Repetir
              </button>
              <button
                onClick={downloadSelfie}
                className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-gold to-gold-dark text-text-main font-montserrat font-bold text-xs uppercase tracking-wider shadow-md"
              >
                Guardar Foto 📥
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

// ─── Navbar Component with Clean Luxury Design & Options Popover ───────────────
function Navbar({
  onOpenEnvelope,
  onOpenIntroVideo,
  onOpenQR,
  onOpenCamera,
  isNightMode,
  onToggleNightMode,
  onToggleFontScale,
  onResetFontScale,
  onSpeakDetails,
}: {
  onOpenEnvelope: () => void
  onOpenIntroVideo?: () => void
  onOpenQR: () => void
  onOpenCamera: () => void
  isNightMode: boolean
  onToggleNightMode: () => void
  onToggleFontScale: () => void
  onResetFontScale: () => void
  onSpeakDetails: () => void
}) {
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [optionsOpen, setOptionsOpen] = useState(false)
  const optionsRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (optionsRef.current && !optionsRef.current.contains(e.target as Node)) {
        setOptionsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const mainNavLinks = [
    { href: '#inicio', label: 'Inicio' },
    { href: '#carta', label: 'Mensaje' },
    { href: '#padres', label: 'Familia' },
    { href: '#video-especial', label: 'Video' },
    { href: '#itinerario', label: 'Protocolo' },
    { href: '#color-reservado', label: 'Guía de Color' },
    { href: '#galeria', label: 'Galería' },
    { href: '#rsvp', label: 'RSVP' },
  ]

  const allNavLinks = [
    { href: '#inicio', label: 'Inicio' },
    { href: '#carta', label: 'Mensaje Especial 💌' },
    { href: '#padres', label: 'Familia & Padrinos' },
    { href: '#video-especial', label: 'Video Especial 🎬' },
    { href: '#itinerario', label: 'Protocolo' },
    { href: '#llegada', label: 'Ubicación & Mapas 📍' },
    { href: '#color-reservado', label: 'Guía de Color' },
    { href: '#vestimenta', label: 'Sugerencia de Regalos' },
    { href: '#galeria', label: 'Galería' },
    { href: '#linea-tiempo', label: 'Historia' },
    { href: '#rsvp', label: 'RSVP' },
  ]

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${
        scrolled ? 'py-2.5 md:py-3 backdrop-blur-xl border-b border-gold/30 bg-cream/90 shadow-md' : 'py-4 md:py-5 bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-6 flex items-center justify-between">
        <a href="#inicio" className="font-greatvibes text-2xl md:text-3xl gold-text-gradient font-bold shrink-0">
          {QUINCE_NAME}
        </a>

        {/* Essential Navigation Links */}
        <div className="hidden lg:flex items-center gap-6 xl:gap-8">
          {mainNavLinks.map(({ href, label }) => (
            <a
              key={href}
              href={href}
              className="text-xs uppercase tracking-widest font-montserrat text-text-main hover:text-gold-dark transition-colors font-bold"
            >
              {label}
            </a>
          ))}
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5 md:gap-3.5 shrink-0">
          {/* Night Mode Toggle */}
          <button
            onClick={onToggleNightMode}
            className="p-2 rounded-full border border-gold/50 glass-card text-gold-dark hover:bg-gold/15 transition-all text-sm shadow-sm"
            title={isNightMode ? "Modo Sol Vainilla" : "Modo Noche Fantasía"}
          >
            {isNightMode ? '☀️' : '🌙'}
          </button>

          {/* Tools & Accessibility Options Menu Dropdown */}
          <div className="relative" ref={optionsRef}>
            <button
              onClick={() => setOptionsOpen(!optionsOpen)}
              className="px-3 py-1.5 rounded-full border border-gold/50 glass-card text-gold-dark hover:bg-gold/15 transition-all text-xs font-montserrat font-bold flex items-center gap-1.5 shadow-sm"
              title="Herramientas & Accesibilidad"
            >
              <span>⚙️</span>
              <span className="hidden sm:inline">Opciones</span>
            </button>

            {optionsOpen && (
              <div className="absolute right-0 mt-2 w-64 glass-card border-2 border-gold/40 rounded-2xl p-3 shadow-2xl flex flex-col gap-2 z-50 animate-fade-in bg-cream/95 backdrop-blur-2xl">
                <p className="text-[9px] uppercase tracking-widest font-montserrat text-gold-dark font-bold px-2 pt-1">
                  Herramientas & Accesibilidad
                </p>

                <button
                  onClick={() => {
                    window.dispatchEvent(new CustomEvent('toggle-bg-music'))
                    setOptionsOpen(false)
                  }}
                  className="flex items-center gap-3 p-2 rounded-xl hover:bg-gold/15 transition-colors text-left text-xs font-montserrat font-bold text-text-main cursor-pointer"
                >
                  <span className="w-7 h-7 rounded-lg border border-gold/40 flex items-center justify-center bg-gold/10 text-gold-dark">🎻</span>
                  <div>
                    <div>Música: Love Story</div>
                    <div className="text-[10px] text-text-sub font-normal">Pausar o reproducir melodía</div>
                  </div>
                </button>

                <button
                  onClick={() => { onToggleFontScale(); setOptionsOpen(false); }}
                  className="flex items-center gap-3 p-2 rounded-xl hover:bg-gold/15 transition-colors text-left text-xs font-montserrat font-bold text-text-main"
                >
                  <span className="w-7 h-7 rounded-lg border border-gold/40 flex items-center justify-center bg-gold/10 text-gold-dark font-bold text-xs">A+</span>
                  <div>
                    <div>Agrandar Letra</div>
                    <div className="text-[10px] text-text-sub font-normal">Para adultos mayores (118% / 135%)</div>
                  </div>
                </button>

                <button
                  onClick={() => { onResetFontScale(); setOptionsOpen(false); }}
                  className="flex items-center gap-3 p-2 rounded-xl hover:bg-gold/15 transition-colors text-left text-xs font-montserrat font-bold text-text-main"
                >
                  <span className="w-7 h-7 rounded-lg border border-gold/40 flex items-center justify-center bg-gold/10 text-gold-dark font-bold text-xs">A-</span>
                  <div>
                    <div>Reducir Letra (Normal)</div>
                    <div className="text-[10px] text-text-sub font-normal">Restablecer a tamaño normal (100%)</div>
                  </div>
                </button>

                <button
                  onClick={() => { onSpeakDetails(); setOptionsOpen(false); }}
                  className="flex items-center gap-3 p-2 rounded-xl hover:bg-gold/15 transition-colors text-left text-xs font-montserrat font-bold text-text-main"
                >
                  <span className="w-7 h-7 rounded-lg border border-gold/40 flex items-center justify-center bg-gold/10 text-gold-dark">🔊</span>
                  <div>
                    <div>Narrar Evento por Voz</div>
                    <div className="text-[10px] text-text-sub font-normal">Escuchar detalles en audio</div>
                  </div>
                </button>

                <button
                  onClick={() => { onOpenCamera(); setOptionsOpen(false); }}
                  className="flex items-center gap-3 p-2 rounded-xl hover:bg-gold/15 transition-colors text-left text-xs font-montserrat font-bold text-text-main"
                >
                  <span className="w-7 h-7 rounded-lg border border-gold/40 flex items-center justify-center bg-gold/10 text-gold-dark">👑</span>
                  <div>
                    <div>Cámara AR Tiara Real</div>
                    <div className="text-[10px] text-text-sub font-normal">Selfie con corona dorada</div>
                  </div>
                </button>

                <button
                  onClick={() => { onOpenQR(); setOptionsOpen(false); }}
                  className="flex items-center gap-3 p-2 rounded-xl hover:bg-gold/15 transition-colors text-left text-xs font-montserrat font-bold text-text-main"
                >
                  <span className="w-7 h-7 rounded-lg border border-gold/40 flex items-center justify-center bg-gold/10 text-gold-dark">📲</span>
                  <div>
                    <div>Compartir Código QR</div>
                    <div className="text-[10px] text-text-sub font-normal">Enviar invitación fácil</div>
                  </div>
                </button>

                {onOpenIntroVideo && (
                  <button
                    onClick={() => { onOpenIntroVideo(); setOptionsOpen(false); }}
                    className="flex items-center gap-3 p-2 rounded-xl hover:bg-gold/15 transition-colors text-left text-xs font-montserrat font-bold text-text-main"
                  >
                    <span className="w-7 h-7 rounded-lg border border-gold/40 flex items-center justify-center bg-gold/10 text-gold-dark">🎬</span>
                    <div>
                      <div>Ver Video de Inicio</div>
                      <div className="text-[10px] text-text-sub font-normal">Repetir video introductorio</div>
                    </div>
                  </button>
                )}

                <button
                  onClick={() => { onOpenEnvelope(); setOptionsOpen(false); }}
                  className="flex items-center gap-3 p-2 rounded-xl hover:bg-gold/15 transition-colors text-left text-xs font-montserrat font-bold text-text-main"
                >
                  <span className="w-7 h-7 rounded-lg border border-gold/40 flex items-center justify-center bg-gold/10 text-gold-dark">✉️</span>
                  <div>
                    <div>Ver Sobre Digital</div>
                    <div className="text-[10px] text-text-sub font-normal">Reabrir sobre animado</div>
                  </div>
                </button>
              </div>
            )}
          </div>

          <a
            href="#rsvp"
            className="px-4 md:px-5 py-2 rounded-full bg-gradient-to-r from-gold to-gold-dark text-text-main text-xs font-montserrat font-bold uppercase tracking-wider hover:brightness-110 transition-all shadow-md shrink-0"
          >
            Confirmar
          </a>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl border border-gold/40 glass-card text-gold-dark text-lg font-bold"
          >
            {mobileMenuOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="lg:hidden glass-card border-t border-gold/30 px-6 py-6 mt-2 flex flex-col gap-3 animate-fade-in bg-cream/95 backdrop-blur-2xl max-h-[80vh] overflow-y-auto shadow-2xl">
          {allNavLinks.map(({ href, label }) => (
            <a
              key={href}
              href={href}
              onClick={() => setMobileMenuOpen(false)}
              className="text-xs uppercase tracking-widest font-montserrat text-text-main hover:text-gold-dark transition-colors font-bold py-1.5"
            >
              {label}
            </a>
          ))}
          <a
            href="#rsvp"
            onClick={() => setMobileMenuOpen(false)}
            className="w-full text-center py-3 rounded-full bg-gradient-to-r from-gold to-gold-dark text-text-main text-xs font-montserrat font-bold uppercase tracking-wider mt-2 shadow-md"
          >
            Confirmar Asistencia
          </a>
        </div>
      )}
    </nav>
  )
}

// ─── Main Application Component ───────────────────────────────────────────────
export default function App() {
  const [introVideoOpen, setIntroVideoOpen] = useState(true)
  const [envelopeOpen, setEnvelopeOpen] = useState(false)
  const [qrOpen, setQrOpen] = useState(false)
  const [cameraOpen, setCameraOpen] = useState(false)
  const [isNightMode, setIsNightMode] = useState(false)
  const [fontScale, setFontScale] = useState<'normal' | 'large' | 'xlarge'>('normal')
  const [confettiActive, setConfettiActive] = useState(false)
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  const triggerSwarmRef = useRef<(() => void) | null>(null)
  const triggerExplosiveBurstRef = useRef<(() => void) | null>(null)
  const playTriggerRef = useRef<(() => void) | null>(null)

  const toggleNightMode = () => {
    const nextMode = !isNightMode
    setIsNightMode(nextMode)
    if (nextMode) {
      document.body.classList.add('night-mode')
      setToastMessage("🌙 Modo Noche Fantasía activado")
    } else {
      document.body.classList.remove('night-mode')
      setToastMessage("☀️ Modo Sol Vainilla activado")
    }
  }

  const toggleFontScale = () => {
    if (fontScale === 'normal') {
      setFontScale('large')
      document.body.classList.remove('font-xlarge')
      document.body.classList.add('font-large')
      setToastMessage("👓 Modo Letra Grande (118%) activado")
    } else if (fontScale === 'large') {
      setFontScale('xlarge')
      document.body.classList.remove('font-large')
      document.body.classList.add('font-xlarge')
      setToastMessage("👓 Modo Letra Extra Grande (135%) activado")
    } else {
      setFontScale('normal')
      document.body.classList.remove('font-large', 'font-xlarge')
      setToastMessage("👓 Tamaño de Letra Normal")
    }
  }

  const resetFontScale = () => {
    setFontScale('normal')
    document.body.classList.remove('font-large', 'font-xlarge')
    setToastMessage("👓 Tamaño de Letra Normal (100%)")
  }

  const triggerGoldenConfetti = () => {
    setConfettiActive(true)
  }

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('reveal-visible')
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.01, rootMargin: '100px 0px 100px 0px' }
    )

    const sections = document.querySelectorAll('main > section, .glass-card')
    sections.forEach((el) => {
      el.classList.add('reveal-on-scroll')
      observer.observe(el)
    })

    // Asegurar que si se navega directamente a un hash (ej. #itinerario), se revele de inmediato
    const revealCurrentHash = () => {
      const hash = window.location.hash
      if (hash) {
        try {
          const target = document.querySelector(hash)
          if (target) {
            target.classList.add('reveal-visible')
            target.querySelectorAll('.reveal-on-scroll, .glass-card').forEach((child) => {
              child.classList.add('reveal-visible')
            })
          }
        } catch (err) {}
      }
    }

    revealCurrentHash()
    window.addEventListener('hashchange', revealCurrentHash)

    // Respaldo de seguridad: revelar cualquier sección que ya esté en el viewport visible
    const fallbackTimer = setTimeout(() => {
      document.querySelectorAll('main > section').forEach((sec) => {
        const rect = sec.getBoundingClientRect()
        if (rect.top < window.innerHeight + 300 && rect.bottom > -300) {
          sec.classList.add('reveal-visible')
          sec.querySelectorAll('.reveal-on-scroll, .glass-card').forEach((child) => {
            child.classList.add('reveal-visible')
          })
        }
      })
    }, 250)

    return () => {
      observer.disconnect()
      window.removeEventListener('hashchange', revealCurrentHash)
      clearTimeout(fallbackTimer)
    }
  }, [])

  const handleSetSpawnRef = useCallback((fn: () => void) => {
    triggerSwarmRef.current = fn
  }, [])

  const handleSetExplosiveBurstRef = useCallback((fn: () => void) => {
    triggerExplosiveBurstRef.current = fn
  }, [])

  const triggerSwarm = () => {
    if (triggerSwarmRef.current) {
      triggerSwarmRef.current()
    }
  }

  const triggerExplosiveBurst = () => {
    if (triggerExplosiveBurstRef.current) {
      triggerExplosiveBurstRef.current()
    }
  }

  const handleFinishIntroVideo = () => {
    setIntroVideoOpen(false)
    setEnvelopeOpen(true)
    window.dispatchEvent(new CustomEvent('resume-butterflies'))
    triggerExplosiveBurst()
    setToastMessage("💌 ¡Toca el sello dorado para abrir tu sobre oficial! ✨")
  }

  const handleCloseEnvelope = () => {
    setEnvelopeOpen(false)
    window.dispatchEvent(new CustomEvent('resume-butterflies'))
    triggerExplosiveBurst()
    if (playTriggerRef.current) {
      playTriggerRef.current()
    }
  }

  const handleRSVPSubmitWithConfetti = () => {
    triggerSwarm()
    triggerGoldenConfetti()
  }

  return (
    <div className="relative min-h-screen bg-cream font-montserrat text-text-main selection:bg-gold selection:text-text-main overflow-x-hidden">
      {/* 3D Flying Butterfly Canvas Background with Explosive Burst */}
      <ButterflyCanvas
        onSpawnRef={handleSetSpawnRef}
        onExplosiveBurstRef={handleSetExplosiveBurstRef}
      />

      {/* Golden Celebration Confetti Burst */}
      <GoldenConfettiCanvas
        active={confettiActive}
        onComplete={() => setConfettiActive(false)}
      />

      {/* Background Real Audio Player */}
      <RealMusicPlayer playTriggerRef={playTriggerRef} />

      {/* Intro Cinema Video Modal (Se muestra primero al entrar) */}
      <IntroVideoModal
        isOpen={introVideoOpen}
        onFinish={handleFinishIntroVideo}
        onTriggerBurst={triggerExplosiveBurst}
      />

      {/* Interactive Envelope Entrance Modal with Explosive Butterfly Burst */}
      <EnvelopeModal
        isOpen={envelopeOpen}
        onClose={handleCloseEnvelope}
        onTriggerExplosiveBurst={triggerExplosiveBurst}
      />

      {/* Interactive QR Code Modal */}
      <QRCodeModal isOpen={qrOpen} onClose={() => setQrOpen(false)} />

      {/* AR Camera Modal with Tiara */}
      <ARCameraModal
        isOpen={cameraOpen}
        onClose={() => setCameraOpen(false)}
        onTriggerToast={setToastMessage}
      />

      {/* Navigation */}
      <Navbar
        onOpenEnvelope={() => {
          setIntroVideoOpen(false)
          setEnvelopeOpen(true)
        }}
        onOpenIntroVideo={() => {
          setEnvelopeOpen(false)
          setIntroVideoOpen(true)
        }}
        onOpenQR={() => setQrOpen(true)}
        onOpenCamera={() => setCameraOpen(true)}
        isNightMode={isNightMode}
        onToggleNightMode={toggleNightMode}
        onToggleFontScale={toggleFontScale}
        onResetFontScale={resetFontScale}
        onSpeakDetails={() => speakEventDetails(setToastMessage)}
      />

      {/* Post Party Thank You Banner (Appears Oct 18 onwards or when test post-party mode is active) */}
      <PostPartyThanksBanner isManualPostParty={false} />

      {/* Main Sections */}
      <main className="relative z-20">
        <HeroSection onTriggerToast={setToastMessage} />
        <KristaLetterSection />
        <ParentsSection />
        <SpecialVideoSection onTriggerToast={setToastMessage} onTriggerBurst={triggerExplosiveBurst} />
        <ItinerarySection onTriggerToast={setToastMessage} />
        <ReservedColorSection onTriggerToast={setToastMessage} />
        <ArrivalGuideSection onTriggerToast={setToastMessage} />
        <VIPPassSection onTriggerToast={setToastMessage} />
        <DressGiftsSection onTriggerToast={setToastMessage} />
        <GallerySection />
        <TimelineSection />
        <RSVPSection onTriggerSwarm={handleRSVPSubmitWithConfetti} />
      </main>

      {/* Floating Toast Notification */}
      {toastMessage && (
        <Toast message={toastMessage} onClose={() => setToastMessage(null)} />
      )}
    </div>
  )
}
