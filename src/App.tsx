import React, { useState, useEffect, useCallback, useRef } from 'react'
import QRCode from 'qrcode'

// ─── Event Configuration ───────────────────────────────────────────────────────
const QUINCE_NAME = "Krista Mariel"
const QUINCE_FULL_NAME = "Krista Mariel Sandoval Caldera"
const PRODUCTION_URL = "https://invitacion-krista-xv.netlify.app/"
const EVENT_DATE = new Date('2026-10-17T13:00:00') // 17 de Octubre, 2026 a la 1:00 PM
const BIRTHDAY_DATE = "15 de Octubre"
const FATHER_NAME = "Roberto Sandoval Santoyo"
const MOTHER_NAME = "María Gabriela Caldera Arroyo"
const GODMOTHER_NAME = "Lola Carlos"
const GODFATHER_NAME = "Saúl Sandoval Santoyo"

const CHURCH_TIME = "1:00 PM - 2:00 PM"
const CHURCH_NAME = "Parroquia Nuestra Señora del Carmen"
const CHURCH_ADDRESS = "Calle Principal #123, Centro Histórico"
const CHURCH_MAPS = "https://maps.google.com/?q=Parroquia+Nuestra+Señora+del+Carmen"

const VENUE_TIME = "3:00 PM"
const VENUE_NAME = "Salón Quinta María Teresa"
const VENUE_ADDRESS = "Salón Quinta María Teresa"
const VENUE_MAPS = "https://maps.google.com/?q=Quinta+Maria+Teresa"

const WHATSAPP_PHONE = "5212345678901" // Reemplazar con el número real de WhatsApp
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

const DRESS_CODE = "Rigurosa Etiqueta · Gala Elegante"
const DRESS_RESERVED_COLORS = [
  { color: "#FFFFFF", label: "Blanco / Marfil", role: "Quinceañera" },
  { color: "#F5E6D3", label: "Beige / Champán", role: "Familia" },
  { color: "#B88E52", label: "Dorado Ocre", role: "Mamá" },
  { color: "#8FA396", label: "Verde Menta", role: "Hermana & Corte" },
]

// ─── Photo Gallery Data (Fotos Reales de Krista Mariel) ───────────────────────
const GALLERY_ITEMS = [
  // Sesión XV Años
  {
    id: 1,
    category: "pre-xv",
    categoryLabel: "Sesión XV Años",
    title: "Retrato Sonriente de Krista Mariel",
    subtitle: "Sesión Oficial XV Años",
    src: "/images/krista_portrait_1.jpg",
    aspect: "aspect-[3/4]",
    likes: 245,
  },
  {
    id: 2,
    category: "pre-xv",
    categoryLabel: "Sesión XV Años",
    title: "Tarde Mágica en el Jardín",
    subtitle: "Sesión Oficial XV Años",
    src: "/images/krista_sitting_garden.png",
    aspect: "aspect-[4/3]",
    likes: 218,
  },
  {
    id: 3,
    category: "pre-xv",
    categoryLabel: "Sesión XV Años",
    title: "Rosas Amarillas & Ilusión",
    subtitle: "Sesión Oficial XV Años",
    src: "/images/krista_yellow_roses.jpg",
    aspect: "aspect-[3/4]",
    likes: 262,
  },
  {
    id: 4,
    category: "pre-xv",
    categoryLabel: "Sesión XV Años",
    title: "Globo Mariposa · 17.10.2026",
    subtitle: "Sesión Oficial XV Años",
    src: "/images/krista_butterfly_balloon.jpg",
    aspect: "aspect-[3/4]",
    likes: 289,
  },
  // Baúl de Recuerdos e Infancia
  {
    id: 5,
    category: "infancia",
    categoryLabel: "Baúl de Recuerdos",
    title: "El Ángel que Llegó a Nuestras Vidas",
    subtitle: "Recién Nacida · Octubre 2011",
    src: "/images/krista_bebe_amarillo_durmiendo.jpg",
    aspect: "aspect-[4/3]",
    likes: 312,
  },
  {
    id: 6,
    category: "infancia",
    categoryLabel: "Baúl de Recuerdos",
    title: "Ternura y Dulzura Infinita",
    subtitle: "Primeros Meses · Krista Mariel",
    src: "/images/krista_bebe_primeros_meses.png",
    aspect: "aspect-[16/9]",
    likes: 295,
  },
  {
    id: 7,
    category: "infancia",
    categoryLabel: "Baúl de Recuerdos",
    title: "Sonrisas y Caritas Pizpiretas",
    subtitle: "Collage Tierno con Gorrito Rosa",
    src: "/images/krista_bebe_gorrito_rosa.jpg",
    aspect: "aspect-[4/3]",
    likes: 340,
  },
  {
    id: 8,
    category: "infancia",
    categoryLabel: "Baúl de Recuerdos",
    title: "La Alegría de Crecer Feliz",
    subtitle: "Primeros Años · Sonrisa Radiante",
    src: "/images/krista_infancia_sonrisa.png",
    aspect: "aspect-[4/3]",
    likes: 358,
  },
]

// ─── Initial Wishes Data ───────────────────────────────────────────────────────
const INITIAL_WISHES = [
  {
    id: 1,
    name: "Tía Sofía & Familia",
    message: "¡Querida Krista Mariel! Que tu vida siempre vuele alto llena de mariposas de felicidad, amor y bendiciones. ¡Estamos felices de celebrar tus 15 años!",
    date: "Hace 1 hora",
    hue: "#D4AF37",
  },
  {
    id: 2,
    name: "Valentina & Camila",
    message: "¡Amiga hermosa! Te ves como una verdadera princesa con tus mariposas pasteles. ¡Va a ser la fiesta del año!",
    date: "Hace 3 horas",
    hue: "#F7C5D4",
  },
  {
    id: 3,
    name: "Abuelitos Sandoval",
    message: "Mi niña adorada Krista, tus 15 años son un regalo del cielo. Que la Virgen del Carmen ilumine siempre tu camino.",
    date: "Ayer",
    hue: "#FFF5B8",
  },
]

// ─── Initial Songs Data ────────────────────────────────────────────────────────
const INITIAL_SONGS = [
  { id: 1, title: "Pepas", artist: "Farruko", votes: 48 },
  { id: 2, title: "Danza Kuduro", artist: "Don Omar", votes: 41 },
  { id: 3, title: "Vivir Mi Vida", artist: "Marc Anthony", votes: 36 },
  { id: 4, title: "Despacito", artist: "Luis Fonsi", votes: 32 },
]

// ─── Trivia Questions Data ─────────────────────────────────────────────────────
const TRIVIA_QUESTIONS = [
  {
    id: 1,
    question: "¿En qué fecha se celebra la gran fiesta de XV Años de Krista Mariel?",
    options: ["17 de Octubre de 2026", "15 de Octubre de 2026", "5 de Diciembre de 2026"],
    correct: 0,
  },
  {
    id: 2,
    question: "¿Cuándo es el cumpleaños exacto de Krista Mariel?",
    options: ["15 de Octubre", "17 de Octubre", "20 de Noviembre"],
    correct: 0,
  },
  {
    id: 3,
    question: "¿Cuál es el motivo y temática principal que Krista eligió para su evento?",
    options: ["Mariposas en tonos pasteles (Beige, Blanco, Amarillo, Rosa)", "Estrellas doradas y azul rey", "Flores rojas y plata"],
    correct: 0,
  },
  {
    id: 4,
    question: "¿Qué elemento especial destaca en el vestido y la sorpresa de Krista?",
    options: ["Bordados de mariposas en relieve 3D con destellos", "Plumas de pavorreal", "Moños rosas gigantes"],
    correct: 0,
  },
  {
    id: 5,
    question: "¿Cómo se llama la Quinceañera?",
    options: ["Krista Mariel Sandoval Caldera", "Crista María Mendoza", "Karla Sandoval"],
    correct: 0,
  },
]

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

  const createButterfly = useCallback((x?: number, y?: number, customVx?: number, customVy?: number): ButterflyParticle => {
    const width = window.innerWidth || 375
    const height = window.innerHeight || 667
    const hues = ['#FFE57F', '#F5E6D3', '#FFFFFF', '#2E6B34', '#D4AF37', '#F9E79F']
    return {
      x: x ?? Math.random() * width,
      y: y ?? Math.random() * height,
      vx: customVx ?? (Math.random() - 0.5) * 1.4,
      vy: customVy ?? (-0.4 - Math.random() * 1.2),
      size: (window.innerWidth < 640 ? 12 : 16) + Math.random() * 14,
      wingAngle: Math.random() * Math.PI * 2,
      wingSpeed: 0.12 + Math.random() * 0.14,
      hue: hues[Math.floor(Math.random() * hues.length)],
      opacity: 0.85 + Math.random() * 0.15,
      sparkles: [],
    }
  }, [])

  const triggerSwarm = useCallback(() => {
    const width = window.innerWidth || 375
    const height = window.innerHeight || 667
    const maxAllowed = window.innerWidth < 640 ? 25 : 38
    for (let i = 0; i < 15; i++) {
      if (particlesRef.current.length < maxAllowed) {
        particlesRef.current.push(createButterfly(Math.random() * width, height + 30))
      }
    }
  }, [createButterfly])

  const triggerExplosiveBurst = useCallback(() => {
    const width = window.innerWidth || 375
    const height = window.innerHeight || 667
    const centerX = width / 2
    const centerY = height / 2

    const burstCount = window.innerWidth < 640 ? 20 : 35
    for (let i = 0; i < burstCount; i++) {
      const angle = Math.random() * Math.PI * 2
      const speed = 3 + Math.random() * 7
      const vx = Math.cos(angle) * speed
      const vy = Math.sin(angle) * speed - 1

      const hues = ['#FFE57F', '#F5E6D3', '#FFFFFF', '#2E6B34', '#D4AF37']
      particlesRef.current.push({
        x: centerX + (Math.random() - 0.5) * 20,
        y: centerY + (Math.random() - 0.5) * 20,
        vx,
        vy,
        size: (window.innerWidth < 640 ? 14 : 18) + Math.random() * 16,
        wingAngle: Math.random() * Math.PI * 2,
        wingSpeed: 0.2 + Math.random() * 0.15,
        hue: hues[Math.floor(Math.random() * hues.length)],
        opacity: 1,
        sparkles: [],
      })
    }
  }, [])

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
    const maxParticles = window.innerWidth < 640 ? 25 : 38
    const initialCount = Math.min(20, Math.floor((window.innerWidth || 400) / 40))

    particlesRef.current = Array.from({ length: initialCount }, () => createButterfly())

    const handleResize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    handleResize()
    window.addEventListener('resize', handleResize)

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const now = Date.now()
        const x = e.touches[0].clientX
        const y = e.touches[0].clientY
        mouseRef.current = { x, y }

        if (now - lastSpawnRef.current > 160 && particlesRef.current.length < maxParticles) {
          lastSpawnRef.current = now
          particlesRef.current.push(
            createButterfly(x + (Math.random() - 0.5) * 15, y + (Math.random() - 0.5) * 15, (Math.random() - 0.5) * 1.5, -1)
          )
        }
      }
    }

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY }
      const now = Date.now()
      if (now - lastSpawnRef.current > 180 && particlesRef.current.length < maxParticles) {
        lastSpawnRef.current = now
        particlesRef.current.push(
          createButterfly(e.clientX + (Math.random() - 0.5) * 15, e.clientY + (Math.random() - 0.5) * 15, (Math.random() - 0.5) * 1.5, -1)
        )
      }
    }

    const handleClick = (e: MouseEvent) => {
      if (particlesRef.current.length < maxParticles) {
        for (let i = 0; i < 3; i++) {
          particlesRef.current.push(
            createButterfly(e.clientX + (Math.random() - 0.5) * 20, e.clientY + (Math.random() - 0.5) * 20)
          )
        }
      }
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('touchmove', handleTouchMove, { passive: true })
    window.addEventListener('click', handleClick)

    let isPaused = false
    const handlePauseButterflies = () => {
      isPaused = true
      ctx.clearRect(0, 0, canvas.width, canvas.height)
    }
    const handleResumeButterflies = () => {
      isPaused = false
    }
    window.addEventListener('pause-butterflies', handlePauseButterflies)
    window.addEventListener('resume-butterflies', handleResumeButterflies)

    const render = () => {
      if (isPaused) {
        animationFrameId = requestAnimationFrame(render)
        return
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Maintain max particle count limit to guarantee 60fps
      while (particlesRef.current.length > maxParticles) {
        particlesRef.current.shift()
      }

      particlesRef.current.forEach((p) => {
        p.wingAngle += p.wingSpeed
        const flap = Math.sin(p.wingAngle)

        const dx = mouseRef.current.x - p.x
        const dy = mouseRef.current.y - p.y
        const dist = Math.sqrt(dx * dx + dy * dy)
        if (dist < 120) {
          p.vx -= (dx / dist) * 0.3
          p.vy -= (dy / dist) * 0.3
        }

        p.vx *= 0.98
        p.vy *= 0.98

        p.vx += Math.sin(p.wingAngle * 0.5) * 0.04
        p.x += p.vx
        p.y += p.vy

        if (p.y < -30) {
          p.y = canvas.height + 20
          p.x = Math.random() * canvas.width
        }
        if (p.x < -30) p.x = canvas.width + 20
        if (p.x > canvas.width + 30) p.x = -20

        if (Math.random() < 0.2) {
          p.sparkles.push({
            x: p.x + (Math.random() - 0.5) * 6,
            y: p.y + 5 + Math.random() * 6,
            alpha: 0.85,
            size: 1 + Math.random() * 2,
          })
        }

        p.sparkles.forEach((sp, sIdx) => {
          sp.y += 0.3
          sp.alpha -= 0.04
          if (sp.alpha > 0) {
            ctx.save()
            ctx.fillStyle = p.hue
            ctx.globalAlpha = sp.alpha * 0.8
            ctx.beginPath()
            ctx.arc(sp.x, sp.y, sp.size, 0, Math.PI * 2)
            ctx.fill()
            ctx.restore()
          } else {
            p.sparkles.splice(sIdx, 1)
          }
        })

        ctx.save()
        ctx.translate(p.x, p.y)
        ctx.globalAlpha = p.opacity

        const angle = Math.atan2(p.vy, p.vx) + Math.PI / 2
        ctx.rotate(angle * 0.2)

        const wingScaleX = Math.abs(flap) * 0.8 + 0.2
        const s = p.size

        // Left Top Wing
        ctx.save()
        ctx.scale(-wingScaleX, 1)
        ctx.fillStyle = p.hue
        ctx.beginPath()
        ctx.moveTo(0, 0)
        ctx.bezierCurveTo(-s * 1.2, -s * 0.8, -s * 1.5, -s * 0.1, -s * 0.8, s * 0.6)
        ctx.bezierCurveTo(-s * 0.4, s * 0.8, -s * 0.1, s * 0.4, 0, 0)
        ctx.fill()
        ctx.strokeStyle = '#B8860B'
        ctx.lineWidth = 0.5
        ctx.stroke()
        ctx.restore()

        // Right Top Wing
        ctx.save()
        ctx.scale(wingScaleX, 1)
        ctx.fillStyle = p.hue
        ctx.beginPath()
        ctx.moveTo(0, 0)
        ctx.bezierCurveTo(s * 1.2, -s * 0.8, s * 1.5, -s * 0.1, s * 0.8, s * 0.6)
        ctx.bezierCurveTo(s * 0.4, s * 0.8, s * 0.1, s * 0.4, 0, 0)
        ctx.fill()
        ctx.strokeStyle = '#B8860B'
        ctx.lineWidth = 0.5
        ctx.stroke()
        ctx.restore()

        // Left Bottom Wing
        ctx.save()
        ctx.scale(-wingScaleX, 1)
        ctx.fillStyle = p.hue
        ctx.globalAlpha = p.opacity * 0.75
        ctx.beginPath()
        ctx.moveTo(0, 0)
        ctx.bezierCurveTo(-s * 0.9, s * 0.2, -s * 1.1, s * 1.1, -s * 0.4, s * 1.2)
        ctx.bezierCurveTo(-s * 0.1, s * 1.2, 0, s * 0.6, 0, 0)
        ctx.fill()
        ctx.restore()

        // Right Bottom Wing
        ctx.save()
        ctx.scale(wingScaleX, 1)
        ctx.fillStyle = p.hue
        ctx.globalAlpha = p.opacity * 0.75
        ctx.beginPath()
        ctx.moveTo(0, 0)
        ctx.bezierCurveTo(s * 0.9, s * 0.2, s * 1.1, s * 1.1, s * 0.4, s * 1.2)
        ctx.bezierCurveTo(s * 0.1, s * 1.2, 0, s * 0.6, 0, 0)
        ctx.fill()
        ctx.restore()

        // Body
        ctx.fillStyle = '#6E531E'
        ctx.beginPath()
        ctx.ellipse(0, 0, s * 0.1, s * 0.45, 0, 0, Math.PI * 2)
        ctx.fill()

        // Antennae
        ctx.strokeStyle = '#9A7B38'
        ctx.lineWidth = 0.7
        ctx.beginPath()
        ctx.moveTo(-1, -s * 0.4)
        ctx.quadraticCurveTo(-s * 0.4, -s * 0.8, -s * 0.5, -s * 0.9)
        ctx.moveTo(1, -s * 0.4)
        ctx.quadraticCurveTo(s * 0.4, -s * 0.8, s * 0.5, -s * 0.9)
        ctx.stroke()

        ctx.restore()
      })

      animationFrameId = requestAnimationFrame(render)
    }

    render()

    return () => {
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('touchmove', handleTouchMove)
      window.removeEventListener('click', handleClick)
      window.removeEventListener('pause-butterflies', handlePauseButterflies)
      window.removeEventListener('resume-butterflies', handleResumeButterflies)
      cancelAnimationFrame(animationFrameId)
    }
  }, [createButterfly])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-10"
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
  const text = `¡Hola! Con la bendición de Dios y el amor de sus padres Roberto Sandoval Santoyo y María Gabriela Caldera Arroyo, y sus padrinos Lola Carlos y Saúl Sandoval Santoyo, te invitamos con gran alegría a celebrar los Quince Años de Krista Mariel Sandoval Caldera. La ceremonia religiosa será el sábado 17 de Octubre a la 1:00 de la tarde en la Parroquia Nuestra Señora del Carmen. La recepción y comida iniciarán a las 3:00 de la tarde en el Salón Quinta María Teresa, seguido de Mariachi y Grupo Versátil. ¡Gracias por formar parte de este momento tan especial!`

  const utterance = new SpeechSynthesisUtterance(text)
  utterance.lang = 'es-MX'
  utterance.rate = 0.95
  utterance.pitch = 1.05

  window.speechSynthesis.speak(utterance)
  onTriggerToast("🔊 Leyendo invitación en voz alta...")
}


// ─── Virtual Cheers & Toast Counter Section ─────────────────────────────────────
function VirtualCheersSection({ onTriggerSwarm, onTriggerToast }: { onTriggerSwarm: () => void; onTriggerToast: (msg: string) => void }) {
  const [cheers, setCheers] = useState(540)
  const [animating, setAnimating] = useState(false)

  const handleCheers = () => {
    setCheers(c => c + 1)
    setAnimating(true)
    setTimeout(() => setAnimating(false), 700)

    onTriggerSwarm()
    sendToGoogleSheets('cheers', { count: cheers + 1 })
    onTriggerToast("🥂 ¡Salud por Krista Mariel! ¡Brindis enviado con éxito!")
  }

  return (
    <section id="brindis" className="relative py-12 md:py-16 px-4 md:px-6">
      <div className="max-w-2xl mx-auto text-center">
        <div className="glass-card p-6 md:p-10 rounded-3xl border-2 border-gold/40 flex flex-col items-center gap-5 shadow-2xl relative overflow-hidden">
          <div className={`w-16 h-16 rounded-full border-2 border-gold flex items-center justify-center text-3xl bg-gold/15 shadow-lg transition-transform duration-300 ${animating ? 'scale-125 rotate-12' : ''}`}>
            🥂
          </div>

          <h3 className="font-greatvibes text-4xl sm:text-5xl gold-text-gradient">
            Brindis Virtual por Krista Mariel
          </h3>

          <p className="font-montserrat text-xs md:text-sm text-text-sub font-medium leading-relaxed max-w-md">
            ¡Levanta tu copa desde donde estés! Cada brindis llena de luz y buenos deseos la fiesta de Krista.
          </p>

          <div className="px-6 py-2 rounded-full bg-gold/15 border border-gold/40 my-1">
            <span className="font-playfair text-gold-dark font-bold text-lg md:text-2xl">
              🥂 {cheers.toLocaleString()} Brindis por Krista Mariel ✨
            </span>
          </div>

          <button
            onClick={handleCheers}
            className="px-8 py-4 rounded-full bg-gradient-to-r from-gold-light via-gold to-gold-dark text-text-main font-montserrat font-bold text-xs md:text-sm uppercase tracking-wider shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
          >
            <span>🥂</span> ¡Brindar por Krista Mariel! <span>✨</span>
          </button>
        </div>
      </div>
    </section>
  )
}

// ─── Digital Time Capsule Section (For October 2031) ───────────────────────────
function TimeCapsuleSection({ onTriggerToast }: { onTriggerToast: (msg: string) => void }) {
  const [name, setName] = useState('')
  const [relation, setRelation] = useState('')
  const [secretWish, setSecretWish] = useState('')
  const [sealed, setSealed] = useState(false)

  const handleSealMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !secretWish.trim()) return

    sendToGoogleSheets('addCapsule', {
      name: name.trim(),
      relation: relation.trim(),
      wish: secretWish.trim(),
      unlockDate: '15 de Octubre de 2031'
    })

    setSealed(true)
    onTriggerToast("🔒 ¡Tu mensaje fue sellado en la Cápsula del Tiempo hasta 2031!")
  }

  return (
    <section id="capsula-tiempo" className="relative py-16 md:py-24 px-4 md:px-6">
      <div className="section-sep mb-16 md:mb-20" />
      <div className="max-w-2xl mx-auto">
        <SectionHeader tag="Recuerdo para el Futuro" title="Cápsula del Tiempo 2031" />

        <div className="glass-card p-6 md:p-10 rounded-3xl border-2 border-gold/50 shadow-2xl relative overflow-hidden flex flex-col items-center gap-6 text-center">
          <div className="w-16 h-16 rounded-full border-2 border-gold flex items-center justify-center text-3xl bg-gold/15 shadow-md">
            🔒
          </div>

          <p className="text-[10px] uppercase tracking-[0.3em] font-montserrat text-gold-dark font-bold -mt-2">
            Mensajes Secretos Sellados para Krista a sus 20 Años
          </p>

          <p className="font-montserrat text-xs md:text-sm text-text-sub font-medium leading-relaxed max-w-lg">
            Escribe un mensaje especial, consejo o predicción para la futura Krista Mariel. Tu mensaje permanecerá **bloqueado y sellado** hasta su cumpleaños número 20 (15 de Octubre de 2031).
          </p>

          {sealed ? (
            <div className="p-6 rounded-2xl bg-gold/10 border border-gold/40 text-center flex flex-col items-center gap-3 animate-fade-in">
              <span className="text-3xl">✨ 🔒 ✨</span>
              <h4 className="font-playfair text-xl text-gold-dark font-bold">¡Mensaje Sellado con Éxito!</h4>
              <p className="font-montserrat text-xs text-text-sub leading-relaxed font-medium">
                Gracias {name}. Tu mensaje ha sido resguardado en la cápsula del tiempo y Krista Mariel lo leerá el 15 de Octubre de 2031.
              </p>
              <button
                onClick={() => setSealed(false)}
                className="text-[10px] uppercase tracking-widest text-gold-dark underline font-bold mt-2"
              >
                Escribir otro mensaje para el futuro
              </button>
            </div>
          ) : (
            <form onSubmit={handleSealMessage} className="w-full flex flex-col gap-4 text-left">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] uppercase tracking-widest font-montserrat text-gold-dark font-bold">
                    Tu Nombre *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="Ej. Tía Sofía"
                    className="w-full bg-cream border border-gold/40 focus:border-gold rounded-2xl px-4 py-3 text-sm text-text-main placeholder:text-text-muted outline-none font-medium"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] uppercase tracking-widest font-montserrat text-gold-dark font-bold">
                    Parentesco / Relación
                  </label>
                  <input
                    type="text"
                    value={relation}
                    onChange={e => setRelation(e.target.value)}
                    placeholder="Ej. Madrina de Bautizo"
                    className="w-full bg-cream border border-gold/40 focus:border-gold rounded-2xl px-4 py-3 text-sm text-text-main placeholder:text-text-muted outline-none font-medium"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] uppercase tracking-widest font-montserrat text-gold-dark font-bold">
                  Tu Mensaje Secreto para Krista a sus 20 Años *
                </label>
                <textarea
                  rows={4}
                  required
                  value={secretWish}
                  onChange={e => setSecretWish(e.target.value)}
                  placeholder="¿Qué le deseas a Krista cuando cumpla 20 años en 2031?..."
                  className="w-full bg-cream border border-gold/40 focus:border-gold rounded-2xl px-4 py-3 text-sm text-text-main placeholder:text-text-muted outline-none resize-none font-medium"
                />
              </div>

              <button
                type="submit"
                className="py-3.5 rounded-2xl bg-gradient-to-r from-gold-light via-gold to-gold-dark text-text-main font-montserrat font-bold text-xs uppercase tracking-wider shadow-lg hover:brightness-110 transition-all flex items-center justify-center gap-2"
              >
                <span>🔒</span> Sellar Mensaje para el 2031 <span>✨</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  )
}

// ─── Floating Wish Butterflies Disabled ──────────────────────────────────────
function FloatingWishButterflies() {
  return null
}


// ─── Post-Party Family Thank You Banner ────────────────────────────────────────
function PostPartyThanksBanner({ isManualPostParty }: { isManualPostParty: boolean }) {
  const isPostPartyDate = new Date() >= new Date('2026-10-18T00:00:00')
  const showBanner = isPostPartyDate || isManualPostParty

  if (!showBanner) return null

  return (
    <div className="w-full bg-gradient-to-r from-gold-dark via-gold to-gold-dark text-text-main py-6 px-4 text-center shadow-xl relative z-30 border-b-2 border-gold-light animate-fade-in">
      <div className="max-w-4xl mx-auto flex flex-col items-center gap-3">
        <span className="text-3xl animate-bounce">💖 👑 🦋</span>
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
class AmbientQuinceSynth {
  private ctx: AudioContext | null = null
  private isRunning: boolean = false
  private timerId: any = null
  private mode: 'piano' | 'harp' = 'piano'
  private masterGain: GainNode | null = null
  private isMuted: boolean = false

  // Harmonious progressions in D Major / G Major tailored for luxury gala
  private chords = [
    { root: 146.83, notes: [293.66, 369.99, 440.00, 587.33, 739.99] }, // D chord
    { root: 110.00, notes: [220.00, 277.18, 329.63, 440.00, 554.37] }, // A chord
    { root: 123.47, notes: [246.94, 293.66, 369.99, 493.88, 587.33] }, // Bm chord
    { root: 98.00,  notes: [196.00, 246.94, 293.66, 392.00, 493.88] }, // G chord
  ]

  start(mode: 'piano' | 'harp') {
    this.mode = mode
    this.stop()
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext
    if (!AudioCtx) return
    this.ctx = new AudioCtx()
    if (this.ctx.state === 'suspended') {
      this.ctx.resume()
    }
    this.masterGain = this.ctx.createGain()
    this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : 0.16, this.ctx.currentTime)
    this.masterGain.connect(this.ctx.destination)
    this.isRunning = true

    let chordIdx = 0
    let step = 0

    const tick = () => {
      if (!this.isRunning || !this.ctx || !this.masterGain) return
      const curChord = this.chords[chordIdx]
      const noteFreq = curChord.notes[step % curChord.notes.length]
      this.playNote(noteFreq, step === 0 ? curChord.root : undefined)

      step++
      if (step >= 6) {
        step = 0
        chordIdx = (chordIdx + 1) % this.chords.length
      }
      this.timerId = setTimeout(tick, this.mode === 'harp' ? 360 : 440)
    }

    tick()
  }

  playNote(freq: number, bassFreq?: number) {
    if (!this.ctx || !this.masterGain) return
    const now = this.ctx.currentTime

    const osc = this.ctx.createOscillator()
    const noteGain = this.ctx.createGain()
    const filter = this.ctx.createBiquadFilter()

    osc.type = this.mode === 'harp' ? 'triangle' : 'sine'
    osc.frequency.setValueAtTime(freq, now)

    filter.type = 'lowpass'
    filter.frequency.setValueAtTime(this.mode === 'harp' ? 2400 : 1700, now)

    const dur = this.mode === 'harp' ? 2.0 : 2.5
    noteGain.gain.setValueAtTime(0.001, now)
    noteGain.gain.exponentialRampToValueAtTime(0.18, now + 0.04)
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
      bassGain.gain.exponentialRampToValueAtTime(0.12, now + 0.08)
      bassGain.gain.exponentialRampToValueAtTime(0.0001, now + 2.8)
      bassOsc.connect(bassGain)
      bassGain.connect(this.masterGain)
      bassOsc.start(now)
      bassOsc.stop(now + 2.8)
    }
  }

  setMuted(muted: boolean) {
    this.isMuted = muted
    if (!this.ctx || !this.masterGain) return
    this.masterGain.gain.setValueAtTime(muted ? 0 : 0.16, this.ctx.currentTime)
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
  type: 'mp3' | 'synth-piano' | 'synth-harp'
}

const AMBIENT_TRACKS: AmbientTrack[] = [
  {
    id: 'vals',
    name: 'Vals de Krista Mariel',
    tag: 'Vals Oficial de Gala · Quinceañera',
    icon: '👑',
    type: 'mp3',
  },
  {
    id: 'piano',
    name: 'Balada en Piano Romántico',
    tag: 'Melodía Acústica & Clásica',
    icon: '🎹',
    type: 'synth-piano',
  },
  {
    id: 'harp',
    name: 'Fantasía de Arpa de Cristal',
    tag: 'Armonía de Cuento de Hadas 🦋',
    icon: '🦋',
    type: 'synth-harp',
  },
]

// ─── Real Audio Music Player with Melody Selector ───────────────────────────────
function RealMusicPlayer({ playTriggerRef }: { playTriggerRef: React.MutableRefObject<(() => void) | null> }) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTrackId, setCurrentTrackId] = useState<string>('vals')
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [muted, setMuted] = useState(false)
  const [expanded, setExpanded] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const currentTrack = AMBIENT_TRACKS.find(t => t.id === currentTrackId) || AMBIENT_TRACKS[0]

  const startPlaybackForTrack = useCallback((track: AmbientTrack) => {
    if (track.type === 'mp3') {
      quinceSynth.stop()
      const audio = audioRef.current
      if (audio) {
        audio.play().then(() => setIsPlaying(true)).catch(err => console.warn("Audio play blocked", err))
      }
    } else if (track.type === 'synth-piano') {
      const audio = audioRef.current
      if (audio) audio.pause()
      quinceSynth.start('piano')
      setIsPlaying(true)
    } else if (track.type === 'synth-harp') {
      const audio = audioRef.current
      if (audio) audio.pause()
      quinceSynth.start('harp')
      setIsPlaying(true)
    }
  }, [])

  const stopAllPlayback = useCallback(() => {
    const audio = audioRef.current
    if (audio) audio.pause()
    quinceSynth.stop()
    setIsPlaying(false)
  }, [])

  const togglePlay = useCallback(() => {
    if (isPlaying) {
      stopAllPlayback()
    } else {
      startPlaybackForTrack(currentTrack)
    }
  }, [isPlaying, currentTrack, startPlaybackForTrack, stopAllPlayback])

  const selectTrack = (track: AmbientTrack) => {
    setCurrentTrackId(track.id)
    if (isPlaying) {
      startPlaybackForTrack(track)
    }
  }

  useEffect(() => {
    playTriggerRef.current = () => {
      startPlaybackForTrack(currentTrack)
    }

    const handlePauseMusic = () => {
      stopAllPlayback()
    }

    const handleResumeMusic = () => {
      startPlaybackForTrack(currentTrack)
    }

    const handleOpenSelector = () => {
      setExpanded(true)
    }

    window.addEventListener('pause-bg-music', handlePauseMusic)
    window.addEventListener('resume-bg-music', handleResumeMusic)
    window.addEventListener('open-music-selector', handleOpenSelector)

    return () => {
      window.removeEventListener('pause-bg-music', handlePauseMusic)
      window.removeEventListener('resume-bg-music', handleResumeMusic)
      window.removeEventListener('open-music-selector', handleOpenSelector)
      quinceSynth.stop()
    }
  }, [playTriggerRef, currentTrack, startPlaybackForTrack, stopAllPlayback])

  const handleTimeUpdate = () => {
    const audio = audioRef.current
    if (audio) {
      setCurrentTime(audio.currentTime)
      setDuration(audio.duration || 0)
    }
  }

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current
    if (audio && currentTrack.type === 'mp3') {
      const seekTime = Number(e.target.value)
      audio.currentTime = seekTime
      setCurrentTime(seekTime)
    }
  }

  const toggleMute = () => {
    const nextMuted = !muted
    setMuted(nextMuted)
    const audio = audioRef.current
    if (audio) {
      audio.muted = nextMuted
    }
    quinceSynth.setMuted(nextMuted)
  }

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60)
    const s = Math.floor(secs % 60)
    return `${m}:${s < 10 ? '0' : ''}${s}`
  }

  return (
    <div className="fixed bottom-4 left-4 z-40 max-w-[calc(100vw-5rem)]">
      <audio
        ref={audioRef}
        src="/audio/vals_crista.mp3"
        loop
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleTimeUpdate}
        onPlay={() => setIsPlaying(true)}
        onPause={() => {
          if (currentTrack.type === 'mp3') setIsPlaying(false)
        }}
      />

      <div className="glass-card p-2 md:p-3 rounded-2xl border-2 border-gold/50 shadow-2xl flex flex-col gap-2.5 transition-all bg-cream/95 backdrop-blur-2xl">
        <div className="flex items-center gap-3">
          <button
            onClick={togglePlay}
            className="w-10 h-10 rounded-full bg-gradient-to-r from-gold-light via-gold to-gold-dark text-text-main flex items-center justify-center font-bold text-sm shadow-md hover:scale-105 active:scale-95 transition-transform shrink-0 cursor-pointer"
            title={isPlaying ? "Pausar Melodía" : `Reproducir ${currentTrack.name}`}
          >
            {isPlaying ? "⏸" : "▶"}
          </button>

          <div className="flex flex-col min-w-[130px] max-w-[190px] pr-1 cursor-pointer" onClick={() => setExpanded(!expanded)}>
            <div className="flex items-center gap-1.5">
              <span className="text-xs">{currentTrack.icon}</span>
              <span className="text-[10px] uppercase font-montserrat tracking-wider text-gold-dark font-bold truncate">
                {currentTrack.name}
              </span>
            </div>
            <span className="text-[9px] font-montserrat text-text-sub truncate">
              {isPlaying ? "Reproduciendo ahora..." : "Toca para reproducir"}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={toggleMute}
              className="text-xs text-gold-dark hover:text-gold p-1 cursor-pointer transition-colors"
              title={muted ? "Activar Sonido" : "Silenciar"}
            >
              {muted ? "🔇" : "🔊"}
            </button>
            <button
              onClick={() => setExpanded(!expanded)}
              className="text-[10px] font-montserrat font-bold text-gold-dark bg-gold/15 hover:bg-gold/25 px-2 py-1 rounded-lg border border-gold/30 flex items-center gap-1 cursor-pointer transition-colors"
              title="Cambiar Melodía de Fondo"
            >
              <span>🎵</span>
              <span className="hidden sm:inline">Melodía</span>
              <span>{expanded ? "▲" : "▼"}</span>
            </button>
          </div>
        </div>

        {expanded && (
          <div className="px-1 pt-1 pb-1 flex flex-col gap-2.5 border-t border-gold/30 animate-fade-in">
            {/* Melody / Track Selector Pills */}
            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between items-center px-1">
                <span className="text-[9px] uppercase tracking-widest font-montserrat text-gold-dark font-bold">
                  Seleccionar Melodía de Fondo
                </span>
                <span className="text-[8px] text-text-sub">3 Piezas de Gala</span>
              </div>

              <div className="flex flex-col gap-1.5">
                {AMBIENT_TRACKS.map(track => {
                  const isSelected = track.id === currentTrackId
                  return (
                    <button
                      key={track.id}
                      onClick={() => selectTrack(track)}
                      className={`p-2 rounded-xl text-left flex items-center justify-between border transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-gold/20 border-gold shadow-sm text-text-main'
                          : 'bg-white/40 hover:bg-gold/10 border-gold/30 text-text-sub'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span className="text-base shrink-0">{track.icon}</span>
                        <div className="min-w-0">
                          <p className={`text-[11px] font-montserrat font-bold truncate ${isSelected ? 'text-gold-dark' : 'text-text-main'}`}>
                            {track.name}
                          </p>
                          <p className="text-[9px] text-text-muted truncate">{track.tag}</p>
                        </div>
                      </div>

                      {isSelected && (
                        <span className="text-xs text-gold-dark font-bold shrink-0 ml-2 animate-pulse">
                          {isPlaying ? '🎶' : '✓'}
                        </span>
                      )}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Time scrubber (when MP3 is active) */}
            {currentTrack.type === 'mp3' && (
              <div className="px-1 pt-1 flex flex-col gap-1 text-[9px] font-montserrat text-text-sub border-t border-gold/20">
                <input
                  type="range"
                  min={0}
                  max={duration || 100}
                  value={currentTime}
                  onChange={handleSeek}
                  className="w-full accent-gold h-1 bg-pastel-beige rounded-lg cursor-pointer"
                />
                <div className="flex justify-between font-semibold">
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(duration)}</span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
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
      <span className="text-lg text-gold-dark shrink-0">🦋</span>
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

function SectionHeader({ tag, title }: { tag: string; title: string }) {
  return (
    <div className="text-center mb-10 md:mb-14 px-2">
      <p className="text-[10px] md:text-[11px] uppercase tracking-[0.35em] md:tracking-[0.45em] font-montserrat text-gold-dark/80 mb-2 font-bold flex items-center justify-center gap-2">
        <span>🦋</span> {tag} <span>🦋</span>
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

// ─── Voice Message Greeting Widget ───────────────────────────────────────────
function VoiceMessageWidget() {
  const [playing, setPlaying] = useState(false)

  return (
    <div className="glass-card p-4 md:p-6 rounded-3xl border-2 border-gold/40 shadow-xl max-w-xl mx-auto my-6 flex items-center gap-4">
      <button
        onClick={() => setPlaying(!playing)}
        className="w-14 h-14 rounded-full bg-gradient-to-r from-gold to-gold-dark text-text-main flex items-center justify-center text-xl shadow-lg hover:scale-105 active:scale-95 transition-all shrink-0 font-bold"
      >
        {playing ? '⏸️' : '▶️'}
      </button>

      <div className="flex-1">
        <div className="flex justify-between items-center mb-1">
          <span className="text-[10px] uppercase tracking-widest font-montserrat text-gold-dark font-bold">Mensaje de Voz · Krista Mariel</span>
          <span className="text-[10px] font-montserrat text-text-sub font-semibold">0:28</span>
        </div>

        <div className="flex items-center gap-1 h-6 my-1">
          {Array.from({ length: 24 }).map((_, i) => (
            <div
              key={i}
              className={`w-1 rounded-full bg-gold transition-all duration-300 ${
                playing ? 'animate-bounce' : 'h-2 opacity-60'
              }`}
              style={{
                height: playing ? `${Math.sin(i * 0.5) * 12 + 10}px` : '6px',
                animationDelay: `${(i % 5) * 0.15}s`,
              }}
            />
          ))}
        </div>

        <p className="font-playfair italic text-xs text-text-sub font-medium">
          "¡Hola! Bienvenidos a mi invitación oficial. Estoy emocionada de celebrarlo juntos en Quinta Maria Teresa..."
        </p>
      </div>
    </div>
  )
}

// ─── Arrival Guide Component (Guía VIP a Quinta Maria Teresa) ──────────────────
function ArrivalGuideSection({ onTriggerToast }: { onTriggerToast: (msg: string) => void }) {
  const copyAddress = () => {
    navigator.clipboard.writeText("Quinta Maria Teresa - Quinta de Eventos")
    onTriggerToast("¡Dirección copiada al portapapeles! 📍")
  }

  return (
    <section id="llegada" className="relative py-16 md:py-24 px-4 md:px-6">
      <div className="section-sep mb-16 md:mb-20" />
      <div className="max-w-4xl mx-auto">
        <SectionHeader tag="Ubicación & Traslado" title="Guía VIP de Llegada a Quinta Maria Teresa" />

        <ParallaxCard className="glass-card p-6 md:p-10 rounded-3xl border-2 border-gold/40 flex flex-col md:flex-row gap-8 shadow-2xl items-center">
          <div className="w-full md:w-1/2 flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <span className="text-3xl">🏰</span>
              <div>
                <span className="text-[10px] uppercase tracking-widest font-montserrat text-gold-dark font-bold">Lugar del Evento</span>
                <h3 className="font-playfair text-2xl text-text-main font-bold">Quinta Maria Teresa</h3>
              </div>
            </div>

            <p className="font-montserrat text-xs md:text-sm text-text-sub leading-relaxed font-medium">
              Contamos con amplio estacionamiento privado, seguridad y valet parking para recibirte como te mereces.
            </p>

            <div className="glass-card p-4 rounded-2xl border border-gold/30 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xl">🌤️</span>
                <div>
                  <span className="text-[9px] uppercase tracking-widest font-montserrat text-gold-dark font-bold">Clima Previsto (17 de Octubre)</span>
                  <p className="font-playfair text-sm text-text-main font-bold">24°C · Cielos Despejados</p>
                </div>
              </div>
              <span className="text-xs font-montserrat text-gold-dark font-bold bg-gold/15 px-2.5 py-1 rounded-full border border-gold/30">Ideal Jardín</span>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 mt-2">
              <a
                href="https://waze.com/ul?q=Quinta+Maria+Teresa"
                target="_blank"
                rel="noreferrer"
                className="flex-1 py-3 px-4 rounded-2xl bg-[#33CCFF]/15 border border-[#33CCFF]/40 text-text-main font-montserrat font-bold text-xs flex items-center justify-center gap-2 shadow-sm hover:scale-105 transition-all"
              >
                <span>🚗</span> Abrir en Waze
              </a>
              <a
                href="https://maps.google.com/?q=Quinta+Maria+Teresa"
                target="_blank"
                rel="noreferrer"
                className="flex-1 py-3 px-4 rounded-2xl bg-gold/20 border border-gold text-gold-dark font-montserrat font-bold text-xs flex items-center justify-center gap-2 shadow-sm hover:scale-105 transition-all"
              >
                <span>🗺️</span> Google Maps
              </a>
            </div>

            <button
              onClick={copyAddress}
              className="py-2.5 px-4 rounded-xl border border-gold/40 glass-card text-text-sub font-montserrat font-semibold text-xs text-center hover:text-gold-dark transition-colors"
            >
              📋 Copiar Dirección Exacta
            </button>
          </div>

          <div className="w-full md:w-1/2 aspect-video md:aspect-square rounded-2xl overflow-hidden border-2 border-gold relative shadow-lg">
            <iframe
              title="Quinta Maria Teresa Map"
              src="https://maps.google.com/maps?q=Quinta%20Maria%20Teresa&t=&z=15&ie=UTF8&iwloc=&output=embed"
              className="w-full h-full border-0 filter saturate-150"
              loading="lazy"
            />
          </div>
        </ParallaxCard>
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


// ─── Hero Section ──────────────────────────────────────────────────────────────
function HeroSection({ onTriggerToast }: { onTriggerToast: (msg: string) => void }) {
  const time = useCountdown(EVENT_DATE)
  const units = [
    { v: time.days, l: "Días" },
    { v: time.hours, l: "Horas" },
    { v: time.minutes, l: "Min" },
    { v: time.seconds, l: "Seg" },
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
      className="relative min-h-screen flex flex-col items-center justify-center text-center px-4 md:px-6 py-20 md:py-28 hero-glow overflow-hidden"
    >
      <div
        className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[340px] md:w-[550px] h-[340px] md:h-[550px] rounded-full blur-[100px] md:blur-[140px] opacity-35 pointer-events-none"
        style={{ background: 'radial-gradient(circle, #FFF5B8 0%, #F7C5D4 50%, transparent 75%)' }}
      />

      <div className="relative z-20 flex flex-col items-center max-w-4xl mx-auto w-full">
        <p className="animate-fade-in text-[10px] md:text-xs uppercase tracking-[0.35em] md:tracking-[0.45em] font-montserrat text-gold-dark mb-3 font-bold flex items-center gap-2">
          <span>🦋</span> Con la bendición de Dios y el amor de mi familia <span>🦋</span>
        </p>

        <div className="w-14 h-14 md:w-16 md:h-16 rounded-full border-2 border-gold flex items-center justify-center glass-card my-2 animate-float-slow shadow-lg">
          <span className="font-cinzel text-lg md:text-xl text-gold-dark font-bold">KM</span>
        </div>

        <p className="font-greatvibes text-4xl sm:text-5xl md:text-6xl text-gold-dark mt-1">
          Mis Quince Años
        </p>

        <GoldDivider />

        <div className="animate-fade-in-up my-2 md:my-4">
          <h1 className="text-6xl sm:text-7xl md:text-9xl font-greatvibes gold-text-gradient leading-tight drop-shadow-xl">
            {QUINCE_NAME}
          </h1>
          <p className="text-xs md:text-sm font-montserrat uppercase tracking-[0.4em] text-text-sub font-bold mt-1">
            {QUINCE_FULL_NAME}
          </p>
        </div>

        <p className="max-w-xl font-playfair italic text-text-main text-base sm:text-lg md:text-xl leading-relaxed mb-6 px-2 font-medium">
          "Hay momentos en la vida que son verdaderamente mágicos, pero compartirlos con las personas que más quiero los hace inolvidables."
        </p>

        <div className="px-6 md:px-8 py-3 rounded-full glass-card border-2 border-gold/40 my-3 shadow-md flex flex-col sm:flex-row items-center gap-2">
          <p className="font-playfair text-gold-dark font-bold text-base sm:text-lg md:text-xl tracking-wider">
            Sábado · 17 de Octubre, 2026
          </p>
          <span className="hidden sm:inline text-gold-dark">•</span>
          <span className="text-xs font-montserrat text-text-sub font-semibold">
            (Mi Cumpleaños: 15 de Octubre 🎂)
          </span>
        </div>

        <div className="animate-fade-in-up mt-6 md:mt-8 flex gap-2 sm:gap-4 md:gap-6 justify-center">
          {units.map(({ v, l }) => (
            <div key={l} className="flex flex-col items-center gap-1.5">
              <div className="w-14 h-14 sm:w-18 sm:h-18 md:w-20 md:h-20 rounded-2xl glass-card flex items-center justify-center border-2 border-gold/40 shadow-lg animate-border-glow">
                <span className="text-xl sm:text-2xl md:text-3xl font-playfair font-bold text-gold-dark">
                  {String(v).padStart(2, "0")}
                </span>
              </div>
              <span className="text-[9px] md:text-[10px] uppercase tracking-[0.2em] md:tracking-[0.3em] font-montserrat text-text-sub font-bold">
                {l}
              </span>
            </div>
          ))}
        </div>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 w-full max-w-xs sm:max-w-none px-4">
          <a
            href="#video-especial"
            className="w-full sm:w-auto px-6 py-2.5 rounded-full bg-gradient-to-r from-gold-light via-gold to-gold-dark text-text-main text-[11px] font-montserrat uppercase tracking-wider font-bold shadow-lg hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <span>🎬</span> Ver Video Especial <span>🦋</span>
          </a>
          <button
            onClick={() => handleCalendar('google')}
            className="w-full sm:w-auto px-5 py-2.5 rounded-full border-2 border-gold/40 glass-card text-[11px] font-montserrat uppercase tracking-wider text-gold-dark hover:bg-gold/15 transition-all flex items-center justify-center gap-2 font-bold shadow-sm"
          >
            <span>📅</span> Agregar a Google Calendar
          </button>
          <button
            onClick={() => handleCalendar('ics')}
            className="w-full sm:w-auto px-5 py-2.5 rounded-full border-2 border-gold/40 glass-card text-[11px] font-montserrat uppercase tracking-wider text-gold-dark hover:bg-gold/15 transition-all flex items-center justify-center gap-2 font-bold shadow-sm"
          >
            <span>📲</span> Guardar en iPhone / iCal
          </button>
        </div>

        {/* Voice Greeting Message Widget */}
        <VoiceMessageWidget />

        <a href="#padres" className="mt-12 flex flex-col items-center gap-2 opacity-70 hover:opacity-100 transition-opacity">
          <span className="text-[9px] uppercase tracking-[0.3em] text-text-sub font-bold">Descubrir más</span>
          <svg width="14" height="20" viewBox="0 0 16 22" fill="none" className="animate-bounce">
            <path d="M8 0 V16 M2 10 L8 16 L14 10" stroke="#9A7B38" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </a>
      </div>
    </section>
  )
}

// ─── Parents & Godparents Section ──────────────────────────────────────────────
function ParentsSection() {
  return (
    <section id="padres" className="relative py-16 md:py-24 px-4 md:px-6">
      <div className="section-sep mb-16 md:mb-20" />
      <div className="max-w-4xl mx-auto">
        <SectionHeader tag="Nuestra Familia" title="Padres & Padrinos" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          <div className="glass-card glass-card-hover p-6 md:p-8 rounded-3xl text-center flex flex-col items-center gap-3 md:gap-4 border-2 border-gold/40">
            <div className="w-12 h-12 md:w-14 md:h-14 rounded-full border-2 border-gold flex items-center justify-center bg-gold/10 shrink-0">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" stroke="#9A7B38" strokeWidth="1.8" fill="none" />
              </svg>
            </div>
            <p className="text-[11px] md:text-xs uppercase tracking-[0.3em] font-montserrat text-gold-dark font-bold flex items-center gap-1.5">
              <span>MIS PADRES</span> <span className="text-gold-dark">♡</span>
            </p>
            <h3 className="font-playfair text-xl md:text-2xl text-text-main font-bold">
              {FATHER_NAME}
            </h3>
            <span className="text-gold-dark font-greatvibes text-2xl md:text-3xl">&</span>
            <h3 className="font-playfair text-xl md:text-2xl text-text-main font-bold">
              {MOTHER_NAME}
            </h3>
          </div>

          <div className="glass-card glass-card-hover p-6 md:p-8 rounded-3xl text-center flex flex-col items-center gap-3 md:gap-4 border-2 border-gold/40">
            <div className="w-12 h-12 md:w-14 md:h-14 rounded-full border-2 border-gold flex items-center justify-center bg-gold/10 shrink-0">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" stroke="#9A7B38" strokeWidth="1.8" fill="none" />
              </svg>
            </div>
            <p className="text-[11px] md:text-xs uppercase tracking-[0.3em] font-montserrat text-gold-dark font-bold flex items-center gap-1.5">
              <span>MIS PADRINOS</span> <span className="text-gold-dark">♡</span>
            </p>
            <h3 className="font-playfair text-xl md:text-2xl text-text-main font-bold">
              {GODMOTHER_NAME}
            </h3>
            <span className="text-gold-dark font-greatvibes text-2xl md:text-3xl">&</span>
            <h3 className="font-playfair text-xl md:text-2xl text-text-main font-bold">
              {GODFATHER_NAME}
            </h3>
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── Protocol / Itinerary Section (Exact Client Timeline & 25-Step Protocol) ─────
function ItinerarySection({ onTriggerToast }: { onTriggerToast: (msg: string) => void }) {
  const [reminders, setReminders] = useState<Record<number, boolean>>({})
  const [activeTab, setActiveTab] = useState<'interactive' | 'card'>('interactive')
  const [selectedCategory, setSelectedCategory] = useState<string>('todos')
  const [searchQuery, setSearchQuery] = useState<string>('')

  // 25 Official Protocol Events exactly matching client card
  const protocolEvents = [
    {
      id: 1,
      num: 1,
      title: "Misa",
      subtitle: "Misa Solemne de Acción de Gracias",
      description: "Celebración eucarística para bendecir los XV Años de Krista Mariel en compañía de sus queridos padres, padrinos y familiares.",
      time: "1:00 PM – 2:00 PM",
      location: CHURCH_NAME,
      address: CHURCH_ADDRESS,
      maps: CHURCH_MAPS,
      category: "ceremonia",
      categoryLabel: "Ceremonia",
      icon: "⛪",
      accent: "from-amber-100 to-amber-50 text-amber-900 border-amber-300",
    },
    {
      id: 2,
      num: 2,
      title: "Recepción de Invitados",
      subtitle: "Bienvenida & Registro",
      description: "Apertura de puertas en Quinta María Teresa, bienvenida cordial, asignación de mesas y coctel de bienvenida.",
      time: "3:00 PM",
      location: VENUE_NAME,
      address: VENUE_ADDRESS,
      maps: VENUE_MAPS,
      category: "ceremonia",
      categoryLabel: "Recepción",
      icon: "🥂",
      accent: "from-rose-100 to-rose-50 text-rose-900 border-rose-300",
    },
    {
      id: 3,
      num: 3,
      title: "Mariachi",
      subtitle: "Música Tradicional en Vivo",
      description: "Entrada del Mariachi para amenizar la tarde con las canciones más alegres de la música mexicana.",
      time: "4:00 PM",
      location: VENUE_NAME,
      address: VENUE_ADDRESS,
      maps: VENUE_MAPS,
      category: "musica",
      categoryLabel: "Música en Vivo",
      icon: "🎺",
      accent: "from-yellow-100 to-yellow-50 text-yellow-900 border-yellow-300",
    },
    {
      id: 4,
      num: 4,
      title: "Comida",
      subtitle: "Banquete Especial de XV Años",
      description: "Comienza el servicio de los exquisitos platillos preparados para consentir a todos nuestros invitados especiales.",
      time: "4:00 PM – 5:00 PM",
      location: VENUE_NAME,
      address: VENUE_ADDRESS,
      maps: VENUE_MAPS,
      category: "ceremonia",
      categoryLabel: "Banquete",
      icon: "🍽️",
      accent: "from-emerald-100 to-emerald-50 text-emerald-900 border-emerald-300",
    },
    {
      id: 5,
      num: 5,
      title: "Piano",
      subtitle: "Acompañamiento Instrumental en Vivo",
      description: "Delicadas piezas al piano en vivo para acompañar la comida en una atmósfera cálida, distinguida y amena.",
      time: "Tarde",
      location: VENUE_NAME,
      address: VENUE_ADDRESS,
      maps: VENUE_MAPS,
      category: "musica",
      categoryLabel: "Música en Vivo",
      icon: "🎹",
      accent: "from-slate-100 to-slate-50 text-slate-900 border-slate-300",
    },
    {
      id: 6,
      num: 6,
      title: "Violín",
      subtitle: "Música Instrumental de Gala",
      description: "Interpretación magistral de violín en vivo con hermosas melodías románticas y contemporáneas.",
      time: "Tarde de Gala",
      location: VENUE_NAME,
      address: VENUE_ADDRESS,
      maps: VENUE_MAPS,
      category: "musica",
      categoryLabel: "Música en Vivo",
      icon: "🎻",
      accent: "from-purple-100 to-purple-50 text-purple-900 border-purple-300",
    },
    {
      id: 7,
      num: 7,
      title: "Entrega de recuerdos a Señoras (vela virgen)",
      subtitle: "Detalle y Bendición Especial",
      description: "Entrega solemne de una hermosa vela bendecida con imagen de la Virgen como signo de agradecimiento y protección a las señoras invitadas.",
      time: "Momento Especial",
      location: VENUE_NAME,
      address: VENUE_ADDRESS,
      maps: VENUE_MAPS,
      category: "recuerdos",
      categoryLabel: "Recuerdos & Bendición",
      icon: "🕯️",
      accent: "from-amber-100 to-amber-50 text-amber-900 border-amber-300",
    },
    {
      id: 8,
      num: 8,
      title: "Grupo Versátil",
      subtitle: "Ambiente, Baile y Fiesta",
      description: "Inicio del Grupo Versátil con el mejor repertorio para llenar la pista de alegría, baile y diversión.",
      time: "5:00 PM en adelante",
      location: VENUE_NAME,
      address: VENUE_ADDRESS,
      maps: VENUE_MAPS,
      category: "musica",
      categoryLabel: "Música en Vivo",
      icon: "🪩",
      accent: "from-teal-100 to-teal-50 text-teal-900 border-teal-300",
    },
    {
      id: 9,
      num: 9,
      title: "Coronación por hermana",
      subtitle: "Momento Solemne de Tiara Real",
      description: "Su hermana realiza el emotivo acto de colocación de la corona y tiara a Krista Mariel, reconociéndola como la reina de la noche.",
      time: "Inicio de Protocolo",
      location: VENUE_NAME,
      address: "Pista Principal",
      maps: VENUE_MAPS,
      category: "protocolo",
      categoryLabel: "Protocolo Solemne",
      icon: "👑",
      accent: "from-amber-100 to-amber-50 text-amber-900 border-amber-300",
    },
    {
      id: 10,
      num: 10,
      title: "Vals con papá, mamá, hermana, abuelo, padrino, madrina y finaliza nuevamente con papá",
      subtitle: "Vals Familiar de Gala",
      description: "Inolvidable secuencia de vals con cada una de las personas más significativas de su vida, culminando con el abrazo y cierre de su padre.",
      time: "Vals Familiar",
      location: VENUE_NAME,
      address: "Pista Principal",
      maps: VENUE_MAPS,
      category: "protocolo",
      categoryLabel: "Vals Familiar",
      icon: "💃",
      accent: "from-pink-100 to-pink-50 text-pink-900 border-pink-300",
    },
    {
      id: 11,
      num: 11,
      title: "Semblanza",
      subtitle: "Proyección Audiovisual de Recuerdos",
      description: "Video emotivo y proyección de fotos conmemorativas reviviendo las etapas más hermosas de la vida de Krista Mariel.",
      time: "Semblanza en Pantalla",
      location: VENUE_NAME,
      address: "Salón Principal",
      maps: VENUE_MAPS,
      category: "protocolo",
      categoryLabel: "Semblanza",
      icon: "📽️",
      accent: "from-indigo-100 to-indigo-50 text-indigo-900 border-indigo-300",
    },
    {
      id: 12,
      num: 12,
      title: "Vals principal chambelanes",
      subtitle: "Gran Coreografía de Gala",
      description: "Espectacular vals de honor de la quinceañera Krista Mariel acompañada de sus gallardos chambelanes.",
      time: "Vals de Honor",
      location: VENUE_NAME,
      address: "Pista Principal",
      maps: VENUE_MAPS,
      category: "protocolo",
      categoryLabel: "Vals Principal",
      icon: "🕺",
      accent: "from-blue-100 to-blue-50 text-blue-900 border-blue-300",
    },
    {
      id: 13,
      num: 13,
      title: "Brindis",
      subtitle: "Palabras de Honor & Agradecimiento",
      description: "Los padres, padrinos e invitados levantan sus copas para brindar por la salud, bendiciones y sueños de la quinceañera.",
      time: "Brindis de Honor",
      location: VENUE_NAME,
      address: "Mesa de Honor",
      maps: VENUE_MAPS,
      category: "protocolo",
      categoryLabel: "Brindis",
      icon: "🥂",
      accent: "from-yellow-100 to-yellow-50 text-yellow-900 border-yellow-300",
    },
    {
      id: 14,
      num: 14,
      title: "Pastel",
      subtitle: "Corte Tradicional & Mañanitas",
      description: "Todos juntos cantamos las mañanitas a Krista Mariel y acompañamos el corte del pastel monumental de XV años.",
      time: "Corte de Pastel",
      location: VENUE_NAME,
      address: "Mesa de Pastel",
      maps: VENUE_MAPS,
      category: "protocolo",
      categoryLabel: "Pastel",
      icon: "🎂",
      accent: "from-orange-100 to-orange-50 text-orange-900 border-orange-300",
    },
    {
      id: 15,
      num: 15,
      title: "Pinta Caritas",
      subtitle: "Glitter Bar & Glow Art",
      description: "Divertida estación artística de maquillaje con brillos, piedras y diseños festivos para darle un toque luminoso a la fiesta.",
      time: "Estación Interactiva",
      location: VENUE_NAME,
      address: "Área Lounge",
      maps: VENUE_MAPS,
      category: "recuerdos",
      categoryLabel: "Animación & Glitter",
      icon: "🎨",
      accent: "from-fuchsia-100 to-fuchsia-50 text-fuchsia-900 border-fuchsia-300",
    },
    {
      id: 16,
      num: 16,
      title: "Cambiarse de outfit para baile sorpresa (quinceañera)",
      subtitle: "Intermedio de Preparación de Vestuario",
      description: "Breve transición donde Krista Mariel cambia a su deslumbrante outfit moderno para su gran show coreográfico.",
      time: "Intermedio",
      location: VENUE_NAME,
      address: "Suite Privada",
      maps: VENUE_MAPS,
      category: "baile",
      categoryLabel: "Preparación",
      icon: "👗",
      accent: "from-violet-100 to-violet-50 text-violet-900 border-violet-300",
    },
    {
      id: 17,
      num: 17,
      title: "Baile sorpresa con chambelanes",
      subtitle: "Show Coreográfico Estelar",
      description: "¡Luces, ritmo y energía! Krista Mariel y sus chambelanes sorprenden a los invitados con una coreografía moderna y vibrante.",
      time: "Show Sorpresa",
      location: VENUE_NAME,
      address: "Pista Principal",
      maps: VENUE_MAPS,
      category: "baile",
      categoryLabel: "Baile Sorpresa",
      icon: "✨",
      accent: "from-yellow-100 to-yellow-50 text-yellow-900 border-yellow-300",
    },
    {
      id: 18,
      num: 18,
      title: "Baile sorpresa con papá, mamá, padrino, madrina, hermana y finaliza con todos",
      subtitle: "Show Familiar Interactivo & Pista Abierta",
      description: "Divertido baile sorpresa en el que se integran papás, padrinos y hermana, contagiando a todos los invitados a llenar la pista.",
      time: "Pista Abierta",
      location: VENUE_NAME,
      address: "Pista Principal",
      maps: VENUE_MAPS,
      category: "baile",
      categoryLabel: "Baile Familiar",
      icon: "💫",
      accent: "from-purple-100 to-purple-50 text-purple-900 border-purple-300",
    },
    {
      id: 19,
      num: 19,
      title: "Cabina de fotos",
      subtitle: "Photo Booth Instantáneo",
      description: "Espacio fotográfico interactivo con divertidos accesorios para que los invitados se lleven sus fotos impresas de recuerdo.",
      time: "Durante la Fiesta",
      location: VENUE_NAME,
      address: "Zona Photo Booth",
      maps: VENUE_MAPS,
      category: "recuerdos",
      categoryLabel: "Cabina de Fotos",
      icon: "📸",
      accent: "from-sky-100 to-sky-50 text-sky-900 border-sky-300",
    },
    {
      id: 20,
      num: 20,
      title: "Inauguración de tienda Merch Store",
      subtitle: "Apertura de Merch Oficial XV",
      description: "Inauguración oficial del stand de recuerdos y artículos temáticos conmemorativos de los 15 Años de Krista Mariel.",
      time: "Apertura de Stand",
      location: VENUE_NAME,
      address: "Stand Merch Store",
      maps: VENUE_MAPS,
      category: "recuerdos",
      categoryLabel: "Merch Store",
      icon: "🛍️",
      accent: "from-emerald-100 to-emerald-50 text-emerald-900 border-emerald-300",
    },
    {
      id: 21,
      num: 21,
      title: "Entrega por padrinos y quinceañera de pantunflas, alajeros y scrunchies (ligas para el cabello) para señoras y jóvenes y para los hombres calcetas",
      subtitle: "Kits de Confort para la Fiesta",
      description: "Krista y sus padrinos obsequian pantunflas descansadoras, alajeros y scrunchies para damas y jovencitas, y cómodas calcetas para los caballeros.",
      time: "Entrega de Confort",
      location: VENUE_NAME,
      address: "Salón Principal",
      maps: VENUE_MAPS,
      category: "recuerdos",
      categoryLabel: "Kits de Confort",
      icon: "🥿",
      accent: "from-pink-100 to-pink-50 text-pink-900 border-pink-300",
    },
    {
      id: 22,
      num: 22,
      title: "Entregar en tienda Merch Store vasos, lentes y scrunchies para amistades de la quinceañera",
      subtitle: "Kit Festivo para Jóvenes y Amigos",
      description: "En el stand Merch Store se distribuyen vasos conmemorativos, lentes con luz y scrunchies exclusivos para los amigos y amigas de Krista.",
      time: "En Merch Store",
      location: VENUE_NAME,
      address: "Stand Merch Store",
      maps: VENUE_MAPS,
      category: "recuerdos",
      categoryLabel: "Kit Amistades",
      icon: "🕶️",
      accent: "from-cyan-100 to-cyan-50 text-cyan-900 border-cyan-300",
    },
    {
      id: 23,
      num: 23,
      title: "Entrega de dulces en charolas a cada mesa",
      subtitle: "Cortesía Dulce Mesa por Mesa",
      description: "Desfile de deliciosas charolas con selección de dulces finos y antojitos llevados directamente a la mesa de cada invitado.",
      time: "Ronda Dulce",
      location: VENUE_NAME,
      address: "A Cada Mesa",
      maps: VENUE_MAPS,
      category: "recuerdos",
      categoryLabel: "Charolas Dulces",
      icon: "🍬",
      accent: "from-red-100 to-red-50 text-red-900 border-red-300",
    },
    {
      id: 24,
      num: 24,
      title: "Banda",
      subtitle: "Gran Fiesta & Ritmo de Banda en Vivo",
      description: "¡Comienza el show de Banda sinaloense en vivo para encender la pista, bailar, cantar y disfrutar la recta final del festejo!",
      time: "12:00 AM – 2:00 AM",
      location: VENUE_NAME,
      address: "Pista Principal",
      maps: VENUE_MAPS,
      category: "musica",
      categoryLabel: "Banda en Vivo",
      icon: "🎷",
      accent: "from-amber-100 to-amber-50 text-amber-900 border-amber-300",
    },
    {
      id: 25,
      num: 25,
      title: "Cena",
      subtitle: "Cena de Gala & Desvelados",
      description: "Delicioso servicio nocturno de cena para reponer energías, brindar nuevamente y despedir una celebración legendaria.",
      time: "Cena de Desvelados",
      location: VENUE_NAME,
      address: VENUE_ADDRESS,
      maps: VENUE_MAPS,
      category: "ceremonia",
      categoryLabel: "Cena Nocturna",
      icon: "🍲",
      accent: "from-stone-100 to-stone-50 text-stone-900 border-stone-300",
    },
  ]

  const categories = [
    { id: 'todos', label: 'Todos (25)', icon: '✨' },
    { id: 'ceremonia', label: 'Misa & Banquete', icon: '⛪' },
    { id: 'musica', label: 'Música en Vivo', icon: '🎺' },
    { id: 'protocolo', label: 'Valses & Protocolo', icon: '👑' },
    { id: 'baile', label: 'Bailes Sorpresa', icon: '💃' },
    { id: 'recuerdos', label: 'Merch & Recuerdos', icon: '🛍️' },
  ]

  const filteredEvents = protocolEvents.filter(ev => {
    const matchesCat = selectedCategory === 'todos' || ev.category === selectedCategory
    const query = searchQuery.trim().toLowerCase()
    const matchesSearch = !query || 
      ev.title.toLowerCase().includes(query) || 
      ev.subtitle.toLowerCase().includes(query) || 
      ev.description.toLowerCase().includes(query) ||
      ev.num.toString() === query
    return matchesCat && matchesSearch
  })

  const copyAddress = (addr: string) => {
    navigator.clipboard.writeText(addr)
    onTriggerToast("¡Dirección copiada al portapapeles! 📍")
  }

  const toggleReminder = (id: number, title: string, time: string) => {
    const isSet = !reminders[id]
    setReminders(prev => ({ ...prev, [id]: isSet }))
    if (isSet) {
      onTriggerToast(`¡Recordatorio activado: ${title} (${time})! ⏰`)
    } else {
      onTriggerToast(`Recordatorio cancelado para: ${title}`)
    }
  }

  const copyFullProtocol = () => {
    const text = `✨ PROTOCOLO · XV AÑOS KRISTA MARIEL ✨\nOrganización de tiempo (Sábado 17 de Octubre, 2026):\n\n` +
      protocolEvents.map(e => `${e.num}. ${e.title} (${e.time})`).join('\n') +
      `\n\n⛪ Misa: Parroquia Nuestra Señora del Carmen (1:00 PM)\n🥂 Recepción: Salón Quinta María Teresa (3:00 PM)`
    navigator.clipboard.writeText(text)
    onTriggerToast("¡Protocolo completo copiado al portapapeles! 📋 Listo para compartir")
  }

  return (
    <section id="itinerario" className="relative py-16 md:py-24 px-4 md:px-6">
      <div className="section-sep mb-16 md:mb-20" />
      <div className="max-w-5xl mx-auto">
        <SectionHeader 
          tag="Protocolo Oficial" 
          title="Organización de Tiempo & Protocolo" 
        />
        <p className="text-center font-playfair italic text-text-sub text-sm sm:text-base -mt-6 mb-8 max-w-2xl mx-auto">
          "Cada instante de mis XV Años ha sido planeado con infinito amor. Conoce los 25 momentos que compartiré contigo en esta fecha tan especial."
        </p>

        {/* Quick Highlights Strip */}
        <div className="glass-card p-6 md:p-8 rounded-3xl border-2 border-gold/50 shadow-2xl mb-8 text-center bg-gradient-to-b from-cream via-cream/90 to-pastel-beige/40">
          <div className="flex items-center justify-center gap-2 mb-3">
            <span className="text-xl">🦋</span>
            <span className="text-[11px] uppercase tracking-[0.3em] font-montserrat text-gold-dark font-bold">
              SÁBADO 17 DE OCTUBRE, 2026 · QUINTA MARÍA TERESA
            </span>
            <span className="text-xl">🦋</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 md:gap-4 py-3 border-y border-gold/30 my-2">
            <div className="flex flex-col items-center gap-1.5 p-3 rounded-2xl bg-white/60 border border-gold/30 shadow-sm">
              <span className="text-3xl">⛪</span>
              <span className="font-playfair text-gold-dark font-bold text-sm md:text-base">1:00 PM</span>
              <span className="text-[10px] uppercase tracking-wider font-montserrat font-bold text-text-main">Misa de Acción de Gracias</span>
            </div>

            <div className="flex flex-col items-center gap-1.5 p-3 rounded-2xl bg-white/60 border border-gold/30 shadow-sm">
              <span className="text-3xl">🥂</span>
              <span className="font-playfair text-gold-dark font-bold text-sm md:text-base">3:00 PM</span>
              <span className="text-[10px] uppercase tracking-wider font-montserrat font-bold text-text-main">Recepción de Invitados</span>
            </div>

            <div className="flex flex-col items-center gap-1.5 p-3 rounded-2xl bg-white/60 border border-gold/30 shadow-sm">
              <span className="text-3xl">🍽️</span>
              <span className="font-playfair text-gold-dark font-bold text-sm md:text-base">4:00 PM</span>
              <span className="text-[10px] uppercase tracking-wider font-montserrat font-bold text-text-main">Mariachi & Comida</span>
            </div>

            <div className="flex flex-col items-center gap-1.5 p-3 rounded-2xl bg-white/60 border border-gold/30 shadow-sm">
              <span className="text-3xl">🪩</span>
              <span className="font-playfair text-gold-dark font-bold text-sm md:text-base">5:00 PM</span>
              <span className="text-[10px] uppercase tracking-wider font-montserrat font-bold text-text-main">Grupo Versátil</span>
            </div>

            <div className="col-span-2 sm:col-span-1 flex flex-col items-center gap-1.5 p-3 rounded-2xl bg-white/60 border border-gold/30 shadow-sm">
              <span className="text-3xl">🎷</span>
              <span className="font-playfair text-gold-dark font-bold text-sm md:text-base">12:00 AM</span>
              <span className="text-[10px] uppercase tracking-wider font-montserrat font-bold text-text-main">Banda & Cena</span>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={copyFullProtocol}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 hover:bg-white text-gold-dark border border-gold/40 text-xs font-montserrat font-bold shadow-sm transition-all hover:shadow-md"
            >
              <span>📋</span> Copiar Lista Completa (25 Momentos)
            </button>
            <button
              onClick={() => window.print()}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold/15 hover:bg-gold/25 text-gold-dark border border-gold/40 text-xs font-montserrat font-bold shadow-sm transition-all"
            >
              <span>🖨️</span> Imprimir / Guardar en PDF
            </button>
          </div>
        </div>

        {/* View Mode Toggle: Interactive vs Official Printed Card Replica */}
        <div className="flex items-center justify-center mb-8">
          <div className="inline-flex p-1.5 rounded-full bg-white/80 border border-gold/40 shadow-md backdrop-blur-sm">
            <button
              onClick={() => setActiveTab('interactive')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-montserrat font-bold transition-all ${
                activeTab === 'interactive'
                  ? 'bg-gradient-to-r from-gold to-gold-dark text-text-main shadow-sm'
                  : 'text-text-sub hover:text-gold-dark'
              }`}
            >
              <span>✨</span>
              <span>Cronograma Interactivo (25 Pasos)</span>
            </button>
            <button
              onClick={() => setActiveTab('card')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-montserrat font-bold transition-all ${
                activeTab === 'card'
                  ? 'bg-gradient-to-r from-gold to-gold-dark text-text-main shadow-sm'
                  : 'text-text-sub hover:text-gold-dark'
              }`}
            >
              <span>📜</span>
              <span>Ficha Oficial de Protocolo</span>
            </button>
          </div>
        </div>

        {/* TAB 1: INTERACTIVE TIMELINE WITH FILTERS AND SEARCH */}
        {activeTab === 'interactive' && (
          <div>
            {/* Search and Category Filters */}
            <div className="mb-8 space-y-4">
              <div className="relative max-w-md mx-auto">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="🔍 Buscar momento (ej. Mariachi, Vals, Merch, Banda...)"
                  className="w-full px-5 py-3 pl-11 rounded-full bg-white/80 border-2 border-gold/40 text-sm font-montserrat text-text-main placeholder-text-muted focus:outline-none focus:border-gold shadow-sm transition-all"
                />
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gold-dark text-sm">🦋</span>
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-text-muted hover:text-gold-dark font-bold font-montserrat"
                  >
                    Limpiar ✕
                  </button>
                )}
              </div>

              {/* Category Pills */}
              <div className="flex flex-wrap items-center justify-center gap-2">
                {categories.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-montserrat font-bold transition-all border ${
                      selectedCategory === cat.id
                        ? 'bg-gold-dark text-white border-gold-dark shadow-sm'
                        : 'bg-white/70 text-text-sub border-gold/30 hover:border-gold hover:text-gold-dark'
                    }`}
                  >
                    <span className="mr-1.5">{cat.icon}</span>
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Event Cards List */}
            <div className="flex flex-col gap-4 relative">
              {filteredEvents.length === 0 ? (
                <div className="text-center py-12 glass-card rounded-3xl border border-gold/30">
                  <span className="text-4xl mb-2 block">🔍</span>
                  <p className="font-playfair text-lg text-text-main font-bold">No encontramos momentos con esa búsqueda</p>
                  <p className="text-xs font-montserrat text-text-sub mt-1">Prueba con otra palabra o limpia el filtro para ver los 25 momentos</p>
                  <button
                    onClick={() => { setSearchQuery(''); setSelectedCategory('todos'); }}
                    className="mt-4 px-4 py-2 rounded-full bg-gold/20 text-gold-dark text-xs font-montserrat font-bold"
                  >
                    Ver todos los momentos
                  </button>
                </div>
              ) : (
                filteredEvents.map((ev) => (
                  <div
                    key={ev.id}
                    className="glass-card glass-card-hover p-5 md:p-6 rounded-3xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-2 border-gold/30 transition-all hover:border-gold/60"
                  >
                    <div className="flex items-start sm:items-center gap-4 md:gap-5 w-full md:w-auto">
                      {/* Step Number & Icon */}
                      <div className="relative shrink-0">
                        <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl border-2 border-gold flex items-center justify-center text-2xl sm:text-3xl bg-pastel-yellow/30 shadow-sm">
                          {ev.icon}
                        </div>
                        <span className="absolute -top-2 -left-2 w-6 h-6 rounded-full bg-gold-dark text-white font-montserrat font-bold text-[11px] flex items-center justify-center border-2 border-white shadow-sm">
                          {ev.num}
                        </span>
                      </div>

                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <span className="text-[9px] font-montserrat uppercase tracking-wider text-gold-dark bg-gold/15 px-2.5 py-0.5 rounded-full border border-gold/30 font-bold">
                            {ev.categoryLabel}
                          </span>
                          <span className="font-playfair text-gold-dark font-bold text-sm sm:text-base">
                            {ev.time}
                          </span>
                        </div>
                        
                        <h3 className="font-playfair text-lg sm:text-xl text-text-main font-bold">
                          <span className="text-gold-dark mr-1.5">#{ev.num}</span> {ev.title}
                        </h3>
                        <p className="font-playfair italic text-gold-dark text-xs sm:text-sm font-semibold">
                          {ev.subtitle}
                        </p>
                        <p className="font-montserrat text-xs text-text-sub mt-1 max-w-2xl leading-relaxed font-normal">
                          {ev.description}
                        </p>
                        <div className="flex items-center gap-2 mt-2 text-[11px] font-montserrat text-text-muted">
                          <span>📍 {ev.address}</span>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-wrap items-center gap-2 w-full md:w-auto pt-3 md:pt-0 border-t md:border-t-0 border-gold/20 shrink-0">
                      <button
                        onClick={() => toggleReminder(ev.id, ev.title, ev.time)}
                        className={`px-3.5 py-2 rounded-full border text-xs font-montserrat transition-all font-bold ${
                          reminders[ev.id]
                            ? 'border-gold bg-gold/20 text-gold-dark shadow-sm'
                            : 'border-gold/30 text-text-sub hover:border-gold hover:text-gold-dark'
                        }`}
                        title="Activar Recordatorio"
                      >
                        {reminders[ev.id] ? "⏰ Recordatorio Activado" : "🔔 Recordarme"}
                      </button>

                      {ev.maps && (
                        <a
                          href={ev.maps}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3.5 py-2 rounded-full bg-gradient-to-r from-gold to-gold-dark text-text-main font-montserrat font-bold text-xs hover:brightness-110 transition-opacity text-center shadow-sm"
                        >
                          Abrir Mapa 📍
                        </a>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* TAB 2: OFFICIAL PRINTED CARD REPLICA */}
        {activeTab === 'card' && (
          <div className="relative max-w-3xl mx-auto my-4 p-6 sm:p-10 md:p-12 rounded-3xl bg-[#FAF6F0] border-4 border-[#D4AF37]/60 shadow-2xl text-[#3A3226]">
            {/* Elegant Double Border Inner Frame */}
            <div className="border border-[#C5A869]/50 rounded-2xl p-4 sm:p-8 relative bg-gradient-to-b from-[#FFFDF9] via-[#FAF6EE] to-[#F5EFE6]">
              {/* Corner Floral & Butterfly Ornaments */}
              <div className="absolute top-2 left-2 text-2xl select-none opacity-85">🌸🦋</div>
              <div className="absolute top-2 right-2 text-2xl select-none opacity-85">🦋🌸</div>
              <div className="absolute bottom-2 left-2 text-2xl select-none opacity-85">🦋🌿</div>
              <div className="absolute bottom-2 right-2 text-2xl select-none opacity-85">🌿🦋</div>

              {/* Card Header matching printed stationery */}
              <div className="text-center mb-8 relative">
                <h3 className="font-playfair tracking-[0.25em] text-2xl sm:text-4xl font-bold text-[#4B5320] uppercase mb-1">
                  P R O T O C O L O
                </h3>
                
                {/* Center Butterfly Icon */}
                <div className="flex items-center justify-center gap-3 my-1">
                  <div className="h-[1px] w-12 sm:w-20 bg-[#C5A869]/60" />
                  <span className="text-[#8B7355] text-lg">🦋</span>
                  <div className="h-[1px] w-12 sm:w-20 bg-[#C5A869]/60" />
                </div>

                {/* Cursive Subtitle */}
                <h4 className="font-greatvibes text-3xl sm:text-5xl text-[#8C6D3B] font-normal my-1">
                  Organización de tiempo
                </h4>

                <p className="text-[10px] uppercase tracking-[0.2em] font-montserrat text-[#70634D] font-bold mt-2">
                  15 Años · Krista Mariel Sandoval Caldera · 17 de Octubre, 2026
                </p>
              </div>

              {/* 25 Numbered Items in balanced columns */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2.5 text-xs sm:text-sm font-montserrat text-[#4A4031]">
                {protocolEvents.map(item => (
                  <div 
                    key={item.id} 
                    className="flex items-start gap-2.5 py-1 px-2 rounded-lg hover:bg-[#F3EAD8]/50 transition-colors"
                  >
                    <span className="font-playfair font-bold text-[#8C6D3B] text-sm sm:text-base min-w-[24px] text-right">
                      {item.num}.
                    </span>
                    <div className="flex-1">
                      <span className="font-semibold text-[#2D261C]">
                        {item.title}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Card Footer */}
              <div className="mt-8 pt-4 border-t border-[#D4AF37]/30 text-center">
                <div className="flex items-center justify-center gap-2 text-xs font-montserrat text-[#70634D] font-semibold">
                  <span>⛪ Misa 1:00 PM</span>
                  <span>•</span>
                  <span>🥂 Salón Quinta María Teresa 3:00 PM</span>
                </div>
                <p className="font-playfair italic text-[#8C6D3B] text-xs mt-2">
                  "Gracias por acompañarme en el día más feliz de mis 15 Años"
                </p>
              </div>
            </div>

            {/* Quick action buttons for the card */}
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={copyFullProtocol}
                className="px-5 py-2.5 rounded-full bg-gold text-white text-xs font-montserrat font-bold shadow-md hover:bg-gold-dark transition-colors flex items-center gap-2"
              >
                <span>📋</span> Copiar Protocolo Completo
              </button>
              <button
                onClick={() => window.print()}
                className="px-5 py-2.5 rounded-full bg-white text-gold-dark border border-gold/60 text-xs font-montserrat font-bold shadow-sm hover:bg-gold/10 transition-colors flex items-center gap-2"
              >
                <span>🖨️</span> Imprimir Tarjeta
              </button>
            </div>
          </div>
        )}

        {/* Closing emotional note */}
        <div className="mt-10 text-center p-5 rounded-2xl glass-card border border-gold/40 max-w-2xl mx-auto">
          <span className="text-2xl mb-1 block">🦋</span>
          <p className="font-playfair italic text-text-main text-sm sm:text-base font-semibold">
            "Cada detalle y cada minuto han sido pensados con amor para crear recuerdos inolvidables junto a ti."
          </p>
          <span className="text-xs font-montserrat text-gold-dark font-bold uppercase tracking-wider mt-1 block">
            — Krista Mariel & Familia Sandoval Caldera
          </span>
        </div>
      </div>
    </section>
  )
}

// ─── Outfit Coordination Section (Baile Sorpresa XV Años) ─────────────────────
function OutfitCoordinationSection() {
  const [selectedRole, setSelectedRole] = useState<number>(0)

  const roles = [
    {
      role: "XV Años Krista Mariel",
      color: "#F5E6D3",
      colorLabel: "Champán / Beige Floral",
      description: "Vestido espectacular de gala corte princesa con tirantes caídos, encaje de mariposas 3D en relieve con destellos y tiara dorada real.",
      icon: "👑"
    },
    {
      role: "Abuelo",
      color: "#D4C5B0",
      colorLabel: "Traje Beige Sastre",
      description: "Traje formal de 3 piezas en tono beige cálido con chaleco y corbata champagne a juego.",
      icon: "👔"
    },
    {
      role: "Abuela",
      color: "#C5B299",
      colorLabel: "Champán Pastel",
      description: "Vestido largo plisado beige champán con sobrefalda fluida y capa bordada en motivos de mariposas.",
      icon: "👗"
    },
    {
      role: "Papá",
      color: "#1C2D42",
      colorLabel: "Azul Marino / Beige",
      description: "Traje sastre formal de 3 piezas en tono azul marino/beige con corbata pastel a juego.",
      icon: "👞"
    },
    {
      role: "Mamá",
      color: "#B88E52",
      colorLabel: "Dorado Pastel Ocre",
      description: "Vestido largo de gala en tono dorado miel/ocre con drapeado sofisticado, cinto con pedrería y capa majestuosa.",
      icon: "✨"
    },
    {
      role: "Hermana",
      color: "#8FA396",
      colorLabel: "Verde Sage / Menta Pastel",
      description: "Vestido de noche strapless con escote corazón en tono verde menta/sage con sobrefalda y apertura elegante.",
      icon: "🌸"
    },
    {
      role: "Chambelanes",
      color: "#DDD0BD",
      colorLabel: "Beige Nude & Moño Menta",
      description: "Trajes coordinados formales en beige nude cálido con moño y pañuelo pastel verde menta a juego.",
      icon: "🤵"
    },
  ]

  return (
    <section id="coordinacion-outfits" className="relative py-16 md:py-24 px-4 md:px-6">
      <div className="section-sep mb-16 md:mb-20" />
      <div className="max-w-5xl mx-auto">
        <SectionHeader tag="Baile Sorpresa XV Años" title="Coordinación de Outfits" />

        <div className="glass-card p-6 md:p-10 rounded-3xl border-2 border-gold/40 flex flex-col gap-8 shadow-xl">
          <div className="text-center max-w-2xl mx-auto">
            <p className="font-montserrat text-xs md:text-sm text-text-sub font-semibold leading-relaxed">
              Para lograr la armonía mágica en las fotos familiares y la sorpresa de Krista Mariel, nuestra corte y familia coordinarán en esta paleta elegante de tonos pasteles beige, oro y menta.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-2 md:gap-3">
            {roles.map((r, idx) => (
              <button
                key={r.role}
                onClick={() => setSelectedRole(idx)}
                className={`px-4 py-2.5 rounded-full text-xs font-montserrat font-bold transition-all flex items-center gap-2 ${
                  selectedRole === idx
                    ? 'bg-gradient-to-r from-gold to-gold-dark text-text-main shadow-lg scale-105'
                    : 'bg-cream/80 text-text-sub hover:text-gold-dark border border-gold/30'
                }`}
              >
                <span>{r.icon}</span>
                <span>{r.role}</span>
              </button>
            ))}
          </div>

          <div className="glass-card p-6 md:p-8 rounded-2xl border border-gold/40 flex flex-col md:flex-row items-center gap-6">
            <div
              className="w-20 h-20 md:w-24 md:h-24 rounded-full border-4 border-gold shadow-lg shrink-0 flex items-center justify-center text-3xl"
              style={{ backgroundColor: roles[selectedRole].color }}
            >
              {roles[selectedRole].icon}
            </div>

            <div className="flex-1 text-center md:text-left">
              <span className="text-[10px] uppercase tracking-widest font-montserrat text-gold-dark font-bold">
                Tono Sugerido: {roles[selectedRole].colorLabel}
              </span>
              <h3 className="font-playfair text-2xl text-text-main font-bold mt-1">
                {roles[selectedRole].role}
              </h3>
              <p className="font-montserrat text-xs md:text-sm text-text-sub mt-2 leading-relaxed font-medium">
                {roles[selectedRole].description}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── Interactive Trivia Game Section ──────────────────────────────────────────
function TriviaSection({ onTriggerSwarm, onTriggerToast }: { onTriggerSwarm: () => void; onTriggerToast: (msg: string) => void }) {
  const [currentIdx, setCurrentIdx] = useState(0)
  const [selectedOpt, setSelectedOpt] = useState<number | null>(null)
  const [score, setScore] = useState(0)
  const [completed, setCompleted] = useState(false)

  const handleSelectOption = (optIdx: number) => {
    setSelectedOpt(optIdx)
    const isCorrect = optIdx === TRIVIA_QUESTIONS[currentIdx].correct
    if (isCorrect) {
      setScore(s => s + 1)
      onTriggerToast("¡Respuesta correcta! ✨")
    } else {
      onTriggerToast("¡Casi! Continúa a la siguiente 🌸")
    }

    setTimeout(() => {
      if (currentIdx + 1 < TRIVIA_QUESTIONS.length) {
        setCurrentIdx(c => c + 1)
        setSelectedOpt(null)
      } else {
        setCompleted(true)
        onTriggerSwarm()
      }
    }, 1000)
  }

  const restartTrivia = () => {
    setCurrentIdx(0)
    setSelectedOpt(null)
    setScore(0)
    setCompleted(false)
  }

  return (
    <section id="trivia" className="relative py-16 md:py-24 px-4 md:px-6">
      <div className="section-sep mb-16 md:mb-20" />
      <div className="max-w-2xl mx-auto">
        <SectionHeader tag="Juego Interactivo" title="¿Qué tanto conoces a Krista Mariel?" />

        <div className="glass-card p-6 md:p-10 rounded-3xl text-center flex flex-col items-center gap-6 border-2 border-gold/40">
          {!completed ? (
            <div className="w-full flex flex-col gap-6">
              <div className="flex justify-between items-center text-xs font-montserrat text-gold-dark font-bold">
                <span>Pregunta {currentIdx + 1} de {TRIVIA_QUESTIONS.length}</span>
                <span>Puntos: {score}</span>
              </div>

              <h3 className="font-playfair text-xl md:text-2xl text-text-main font-bold">
                {TRIVIA_QUESTIONS[currentIdx].question}
              </h3>

              <div className="flex flex-col gap-3">
                {TRIVIA_QUESTIONS[currentIdx].options.map((opt, idx) => {
                  const isSelected = selectedOpt === idx
                  const isCorrect = idx === TRIVIA_QUESTIONS[currentIdx].correct
                  let btnClass = "border-gold/40 text-text-main hover:border-gold hover:bg-gold/10"

                  if (selectedOpt !== null) {
                    if (isSelected && isCorrect) btnClass = "border-green-600 bg-green-500/20 text-green-900 font-bold"
                    else if (isSelected && !isCorrect) btnClass = "border-red-500 bg-red-500/20 text-red-900 font-bold"
                    else if (isCorrect) btnClass = "border-green-600 bg-green-500/20 text-green-900 font-bold"
                  }

                  return (
                    <button
                      key={idx}
                      disabled={selectedOpt !== null}
                      onClick={() => handleSelectOption(idx)}
                      className={`w-full p-4 rounded-2xl border-2 text-sm font-montserrat font-medium text-left transition-all ${btnClass}`}
                    >
                      {opt}
                    </button>
                  )
                })}
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-5 animate-fade-in-up py-4">
              <div className="w-20 h-20 rounded-full border-2 border-gold flex items-center justify-center text-4xl bg-gold/10">
                🦋
              </div>
              <h3 className="font-greatvibes text-5xl gold-text-gradient">¡Trivia Completada!</h3>
              <p className="font-playfair italic text-lg text-text-main font-semibold">
                Obtuviste <span className="text-gold-dark font-bold">{score}</span> de <span className="text-gold-dark font-bold">{TRIVIA_QUESTIONS.length}</span> respuestas correctas.
              </p>
              <p className="text-xs font-montserrat text-text-sub max-w-xs font-medium">
                {score === 5
                  ? "¡Eres un super amigo de Krista Mariel! Conoces cada detalle de su gran evento."
                  : "¡Gran intento! Krista Mariel se alegrará mucho de verte en sus 15 años."}
              </p>
              <button
                onClick={restartTrivia}
                className="px-6 py-2.5 rounded-full border-2 border-gold bg-gold/15 text-gold-dark text-xs font-montserrat uppercase tracking-wider font-bold hover:bg-gold/25"
              >
                Volver a Jugar
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

// ─── Photo Frame Creator for Instagram & Stories ───────────────────────────────
function PhotoFrameCreator({ onTriggerToast }: { onTriggerToast: (msg: string) => void }) {
  const [userImage, setUserImage] = useState<string | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (evt) => {
        if (evt.target?.result) {
          setUserImage(evt.target.result as string)
        }
      }
      reader.readAsDataURL(file)
    }
  }

  useEffect(() => {
    if (!userImage) return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const img = new Image()
    img.crossOrigin = "anonymous"
    img.onload = () => {
      canvas.width = 600
      canvas.height = 800

      ctx.drawImage(img, 0, 0, 600, 800)

      const grad = ctx.createLinearGradient(0, 0, 0, 800)
      grad.addColorStop(0, 'rgba(250, 246, 240, 0.75)')
      grad.addColorStop(0.2, 'transparent')
      grad.addColorStop(0.75, 'transparent')
      grad.addColorStop(1, 'rgba(250, 246, 240, 0.95)')
      ctx.fillStyle = grad
      ctx.fillRect(0, 0, 600, 800)

      ctx.strokeStyle = '#D4AF37'
      ctx.lineWidth = 14
      ctx.strokeRect(10, 10, 580, 780)

      ctx.strokeStyle = '#F5E6D3'
      ctx.lineWidth = 2
      ctx.strokeRect(22, 22, 556, 756)

      ctx.fillStyle = '#9A7B38'
      ctx.font = '34px "Great Vibes", cursive'
      ctx.textAlign = 'center'
      ctx.fillText('¡Nos vemos en los XV Años de!', 300, 60)

      ctx.fillStyle = '#2D1F38'
      ctx.font = 'bold 44px "Great Vibes", cursive'
      ctx.fillText('Krista Mariel', 300, 720)

      ctx.fillStyle = '#9A7B38'
      ctx.font = 'bold 14px "Montserrat", sans-serif'
      ctx.fillText('17 · OCTUBRE · 2026 🦋', 300, 750)
    }
    img.src = userImage
  }, [userImage])

  const downloadFrame = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    const link = document.createElement('a')
    link.download = `Foto_XV_KristaMariel.png`
    link.href = canvas.toDataURL('image/png')
    link.click()
    onTriggerToast("¡Foto guardada! Lista para subir a tu Instagram / WhatsApp 📸")
  }

  return (
    <section id="marco-foto" className="relative py-16 md:py-24 px-4 md:px-6">
      <div className="section-sep mb-16 md:mb-20" />
      <div className="max-w-3xl mx-auto">
        <SectionHeader tag="Recuerdo Interactivo" title="Marco para Instagram & Stories" />

        <div className="glass-card p-6 md:p-8 rounded-3xl text-center flex flex-col items-center gap-6 border-2 border-gold/40">
          <p className="text-xs md:text-sm font-montserrat text-text-sub font-medium leading-relaxed max-w-lg">
            ¡Sube tu foto favorita para vestirla con el marco oficial dorado con mariposas de Krista Mariel, y compártela en tus historias de Instagram o WhatsApp!
          </p>

          {!userImage ? (
            <label className="w-full max-w-md aspect-[3/4] rounded-3xl border-2 border-dashed border-gold/60 bg-cream/60 hover:bg-gold/10 transition-colors flex flex-col items-center justify-center gap-4 cursor-pointer p-6 shadow-inner">
              <div className="w-16 h-16 rounded-full border-2 border-gold flex items-center justify-center text-3xl bg-gold/10">
                📸
              </div>
              <div>
                <p className="font-montserrat font-bold text-sm text-gold-dark">Toca para Seleccionar tu Foto</p>
                <p className="font-montserrat text-[11px] text-text-muted mt-1">Formatos JPG, PNG o selfie</p>
              </div>
              <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
            </label>
          ) : (
            <div className="flex flex-col items-center gap-5 w-full">
              <div className="relative max-w-xs aspect-[3/4] rounded-3xl overflow-hidden shadow-2xl border-2 border-gold">
                <canvas ref={canvasRef} className="w-full h-full object-cover" />
              </div>

              <div className="flex flex-wrap justify-center gap-3">
                <label className="px-5 py-2.5 rounded-full border-2 border-gold/50 text-xs font-montserrat font-bold text-gold-dark hover:bg-gold/15 transition-all cursor-pointer">
                  Cambiar Foto
                  <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                </label>
                <button
                  onClick={downloadFrame}
                  className="px-6 py-2.5 rounded-full bg-gradient-to-r from-gold-light via-gold to-gold-dark text-text-main font-montserrat font-bold text-xs hover:brightness-110 transition-all shadow-lg"
                >
                  Descargar Foto para Stories 📲
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
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
    src: '/images/krista_portrait_1.jpg',
    timeAgo: 'Foto de Gala Oficial',
    likes: 54,
  },
  {
    id: 'p2',
    guestName: 'Valentina & Amigas',
    caption: '¡Amiga hermosa! Contando los días para bailar toda la noche contigo 💖',
    src: '/images/krista_butterfly_balloon.jpg',
    timeAgo: 'Pre-XV Años',
    likes: 68,
  },
  {
    id: 'p3',
    guestName: 'Tíos y Primos Silva',
    caption: '¡Felicidades Krista Mariel! Eres un orgullo y una bendición para toda la familia.',
    src: '/images/krista_yellow_roses.jpg',
    timeAgo: 'Sesión de Rosas',
    likes: 41,
  },
  {
    id: 'p4',
    guestName: 'Padrinos de Honor',
    caption: 'Una tarde soñada en Quinta Maria Teresa. ¡Todo lucirá espectacular!',
    src: '/images/krista_sitting_garden.png',
    timeAgo: 'Quinta Maria Teresa',
    likes: 47,
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
      onTriggerToast("¡Tu foto ha sido publicada en el Muro en Vivo de Krista! 📸🦋")
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
    const text = encodeURIComponent(`¡Hola! Quiero compartirte mis fotos y recuerdos de los XV Años de ${QUINCE_NAME} 📸🦋`)
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
              {isUploading ? 'Publicando...' : 'Publicar en el Muro en Vivo 🦋'}
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
                  <span className="text-base">🦋</span>
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

// ─── Dress Code & Gifts Section ─────────────────────────────────────────────────
function DressGiftsSection({ onTriggerToast }: { onTriggerToast: (msg: string) => void }) {
  const copyClabe = () => {
    navigator.clipboard.writeText(BANK_CLABE.replace(/\s/g, ''))
    onTriggerToast("¡CLABE bancaria copiada! 💳")
  }

  return (
    <section id="vestimenta" className="relative py-16 md:py-24 px-4 md:px-6">
      <div className="section-sep mb-16 md:mb-20" />
      <div className="max-w-5xl mx-auto">
        <SectionHeader tag="Indicaciones Importantes" title="Vestimenta & Regalos" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          <div className="glass-card glass-card-hover p-6 md:p-8 rounded-3xl flex flex-col justify-between gap-5 border-2 border-gold/40">
            <div>
              <div className="flex items-center gap-3 md:gap-4 mb-4">
                <div className="w-12 h-12 rounded-full border-2 border-gold flex items-center justify-center text-2xl bg-gold/10 shrink-0">
                  👗
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-widest font-montserrat text-gold-dark font-bold">Código de Vestimenta</p>
                  <h3 className="font-playfair text-xl md:text-2xl text-text-main font-bold">{DRESS_CODE}</h3>
                </div>
              </div>

              <p className="font-montserrat text-xs text-text-sub leading-relaxed mb-4 font-medium">
                Te pedimos acompañarnos con tu mejor atuendo de gala. Vestido largo para las damas y traje formal para los caballeros.
              </p>

              <div className="p-3.5 rounded-2xl border border-gold/40 bg-gold/10 mb-4 flex items-start gap-3">
                <span className="text-xl shrink-0 mt-0.5">🎨</span>
                <p className="text-xs font-montserrat text-text-main font-semibold leading-relaxed">
                  <strong>¡Libertad de color para invitados!</strong> Puedes ir de <strong>cualquier color de tu elección</strong>, a excepción de los tonos reservados que vestirán la festejada, su hermana y la corte.
                </p>
              </div>

              <p className="text-[10px] uppercase tracking-widest font-montserrat text-gold-dark mb-3 font-bold flex items-center gap-1.5">
                <span>🚫</span> Tonos Exclusivos Reservados (Evitar en tu atuendo):
              </p>
              <div className="flex flex-wrap justify-center sm:justify-start gap-3 mb-2">
                {DRESS_RESERVED_COLORS.map(({ color, label, role }) => (
                  <div key={label} className="flex flex-col items-center gap-1">
                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border-2 border-gold shadow-md relative flex items-center justify-center" style={{ backgroundColor: color }}>
                      <span className="text-[10px] text-gray-500 font-bold opacity-60">✕</span>
                    </div>
                    <span className="text-[9px] font-montserrat text-text-sub font-bold text-center leading-tight">{label}</span>
                    <span className="text-[8px] font-montserrat text-gold-dark font-medium">{role}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-3.5 rounded-2xl border border-gold/40 bg-pastel-yellow/30 flex items-center gap-3">
              <span className="text-xl shrink-0">🦋</span>
              <p className="text-xs font-montserrat text-text-main font-semibold leading-snug">
                El color blanco, marfil y vestuario con mariposas principales están reservados con especial cariño para Krista Mariel.
              </p>
            </div>
          </div>

          <div className="glass-card glass-card-hover p-6 md:p-8 rounded-3xl flex flex-col justify-between gap-5 border-2 border-gold/40">
            <div>
              <div className="flex items-center gap-3 md:gap-4 mb-3">
                <div className="w-12 h-12 rounded-full border-2 border-gold flex items-center justify-center text-2xl bg-gold/10 shrink-0 shadow-inner">
                  🎁
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-[0.3em] font-montserrat text-gold-dark font-bold">Detalle con Cariño</p>
                  <h3 className="font-playfair text-xl md:text-2xl text-text-main font-bold">Regalos Opcionales</h3>
                </div>
              </div>

              <p className="font-montserrat text-xs md:text-sm text-text-sub leading-relaxed mb-5 font-medium">
                Tu presencia es mi mejor regalo, pero si deseas tener un detalle conmigo, puedes hacerlo a través de:
              </p>

              {/* The 3 Official Gift Channels from Printed Card */}
              <div className="grid grid-cols-1 gap-3 mb-4">
                {/* 1. Liverpool Gift Registry */}
                <div className="p-3.5 rounded-2xl border-2 border-[#D80075]/30 bg-white/60 hover:bg-[#D80075]/5 transition-all flex items-center justify-between gap-3 shadow-sm">
                  <div className="flex items-center gap-3 min-w-0">
                    {/* Liverpool official geometric ribbon logo */}
                    <div className="w-10 h-10 rounded-xl bg-[#D80075] flex items-center justify-center p-2 shrink-0 shadow-sm">
                      <svg viewBox="0 0 100 100" fill="none" className="w-full h-full">
                        <path d="M20 20 H80 V80 H20 Z" stroke="white" strokeWidth="12" fill="none" />
                        <path d="M35 35 H65 V65 H35 Z" stroke="white" strokeWidth="10" fill="none" />
                      </svg>
                    </div>
                    <div className="min-w-0">
                      <p className="font-montserrat font-bold text-xs uppercase tracking-wider text-[#D80075]">
                        Mesa de Regalos Liverpool
                      </p>
                      <p className="text-[10px] font-montserrat text-text-sub truncate">
                        Evento: Krista Mariel Sandoval Caldera
                      </p>
                    </div>
                  </div>
                  <a
                    href="https://mesaderegalos.liverpool.com.mx/"
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-1.5 rounded-xl bg-[#D80075] text-white text-[10px] font-montserrat font-bold uppercase tracking-wider hover:brightness-110 active:scale-95 transition-all shrink-0"
                  >
                    Ver Mesa 🛍️
                  </a>
                </div>

                {/* 2. Sobre (Lluvia de sobres y transferencia) */}
                <div className="p-3.5 rounded-2xl border border-gold/40 bg-white/60 flex flex-col gap-2.5 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <span className="text-xl">✉️</span>
                      <div>
                        <p className="font-montserrat font-bold text-xs uppercase tracking-wider text-gold-dark">
                          Sobre
                        </p>
                        <p className="text-[10px] font-montserrat text-text-sub">
                          Buzón en el salón o transferencia digital
                        </p>
                      </div>
                    </div>
                    <span className="text-[10px] font-montserrat font-bold text-gold-dark bg-gold/15 px-2 py-0.5 rounded-full border border-gold/30">
                      Tradicional
                    </span>
                  </div>

                  {/* Bank info box */}
                  <div className="p-3 rounded-xl bg-cream border border-gold/30 flex flex-col gap-1.5 text-[11px]">
                    <div className="flex justify-between">
                      <span className="text-text-sub font-semibold">Banco:</span>
                      <span className="font-bold text-text-main">{BANK_NAME}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-text-sub font-semibold">Beneficiario:</span>
                      <span className="font-bold text-text-main">{BANK_BENEFICIARY}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-text-sub font-semibold">CLABE:</span>
                      <span className="font-mono font-bold text-gold-dark">{BANK_CLABE}</span>
                    </div>
                    <button
                      type="button"
                      onClick={copyClabe}
                      className="mt-1 py-1.5 rounded-lg border border-gold/40 bg-gold/15 hover:bg-gold/25 text-gold-dark text-[10px] font-montserrat font-bold uppercase tracking-wider transition-colors cursor-pointer"
                    >
                      Copiar CLABE Bancaria 📋
                    </button>
                  </div>
                </div>

                {/* 3. Lo que gustes */}
                <div className="p-3.5 rounded-2xl border border-gold/30 bg-white/60 flex items-center gap-3 shadow-sm">
                  <span className="text-2xl text-gold-dark">♡</span>
                  <div>
                    <p className="font-montserrat font-bold text-xs uppercase tracking-wider text-text-main">
                      Lo que gustes
                    </p>
                    <p className="text-[10px] font-montserrat text-text-sub">
                      Cualquier detalle o muestra de cariño que desees brindar
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-center pt-2 border-t border-gold/20 flex flex-col items-center gap-1">
              <p className="text-xs font-playfair italic text-text-main font-semibold">
                "Gracias por formar parte de este momento tan especial."
              </p>
              <span className="text-sm text-gold-dark">♡</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── Photo Gallery Section (Fotos Reales de Krista Mariel) ───────────────────
function GallerySection() {
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'pre-xv' | 'infancia'>('all')
  const [lightboxItem, setLightboxItem] = useState<(typeof GALLERY_ITEMS)[0] | null>(null)
  const [likes, setLikes] = useState<Record<number, number>>({
    1: 245,
    2: 218,
    3: 262,
    4: 289,
    5: 312,
    6: 295,
    7: 340,
    8: 358,
  })

  const handleLike = (id: number, e: React.MouseEvent) => {
    e.stopPropagation()
    setLikes(prev => ({ ...prev, [id]: (prev[id] || 0) + 1 }))
  }

  const filteredItems = selectedCategory === 'all'
    ? GALLERY_ITEMS
    : GALLERY_ITEMS.filter(item => item.category === selectedCategory)

  return (
    <section id="galeria" className="relative py-16 md:py-24 px-4 md:px-6">
      <div className="section-sep mb-16 md:mb-20" />
      <div className="max-w-6xl mx-auto">
        <SectionHeader tag="Momentos Inolvidables" title="Galería Oficial de Krista Mariel" />
        <p className="text-center font-montserrat text-xs md:text-sm text-text-sub max-w-xl mx-auto -mt-4 mb-8 md:mb-10 font-medium">
          Revive cada sonrisa: desde sus recuerdos más tiernos de bebé e infancia hasta su hermosa sesión oficial de Quince Años.
        </p>

        {/* Filter Tabs */}
        <div className="flex flex-wrap justify-center items-center gap-2 sm:gap-3 mb-10">
          <button
            type="button"
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2 rounded-full text-xs sm:text-sm font-montserrat font-bold transition-all duration-300 shadow-sm cursor-pointer ${
              selectedCategory === 'all'
                ? 'bg-gradient-to-r from-gold to-gold-dark text-white shadow-gold/30 shadow-md scale-105'
                : 'glass-card text-text-main hover:bg-gold/15 border border-gold/40'
            }`}
          >
            📸 Todos los Recuerdos ({GALLERY_ITEMS.length})
          </button>
          <button
            type="button"
            onClick={() => setSelectedCategory('pre-xv')}
            className={`px-4 py-2 rounded-full text-xs sm:text-sm font-montserrat font-bold transition-all duration-300 shadow-sm cursor-pointer ${
              selectedCategory === 'pre-xv'
                ? 'bg-gradient-to-r from-gold to-gold-dark text-white shadow-gold/30 shadow-md scale-105'
                : 'glass-card text-text-main hover:bg-gold/15 border border-gold/40'
            }`}
          >
            👑 Sesión XV Años (4)
          </button>
          <button
            type="button"
            onClick={() => setSelectedCategory('infancia')}
            className={`px-4 py-2 rounded-full text-xs sm:text-sm font-montserrat font-bold transition-all duration-300 shadow-sm cursor-pointer ${
              selectedCategory === 'infancia'
                ? 'bg-gradient-to-r from-gold to-gold-dark text-white shadow-gold/30 shadow-md scale-105'
                : 'glass-card text-text-main hover:bg-gold/15 border border-gold/40'
            }`}
          >
            🧸 Baúl de Recuerdos & Infancia (4)
          </button>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
          {filteredItems.map(item => (
            <div
              key={item.id}
              onClick={() => setLightboxItem(item)}
              className="relative aspect-[3/4] rounded-3xl overflow-hidden glass-card glass-card-hover cursor-pointer group border-2 border-gold/40 shadow-xl flex flex-col justify-between"
            >
              <img
                src={item.src}
                alt={item.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                loading="lazy"
              />

              {/* Top Category Badge */}
              <div className="absolute top-3 left-3 z-10">
                <span className="text-[10px] font-montserrat font-bold px-2.5 py-1 rounded-full bg-cream/90 backdrop-blur-md text-gold-dark border border-gold/30 shadow-sm">
                  {item.category === 'infancia' ? '🧸 Infancia' : '✨ XV Años'}
                </span>
              </div>

              {/* Hover & Bottom Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-cream/95 via-cream/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-4 flex flex-col justify-end z-10">
                <span className="text-[9px] font-montserrat uppercase tracking-wider text-gold-dark font-bold">
                  {item.subtitle}
                </span>
                <p className="font-playfair text-sm sm:text-base text-text-main font-bold leading-snug mt-0.5">
                  {item.title}
                </p>
                <div className="flex justify-between items-center mt-3 pt-2 border-t border-gold/20">
                  <span className="text-[9px] font-montserrat uppercase tracking-widest text-gold-dark font-bold">
                    Ver Foto 🔍
                  </span>
                  <button
                    type="button"
                    onClick={e => handleLike(item.id, e)}
                    className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/95 border border-gold/40 text-xs text-gold-dark font-bold shadow-sm hover:scale-105 transition-transform"
                  >
                    <span>❤️</span>
                    <span>{likes[item.id]}</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      {lightboxItem && (
        <div
          className="fixed inset-0 z-50 bg-cream/95 backdrop-blur-2xl flex items-center justify-center p-3 sm:p-4 animate-fade-in"
          onClick={() => setLightboxItem(null)}
        >
          <button
            type="button"
            onClick={() => setLightboxItem(null)}
            className="absolute top-4 right-4 w-10 h-10 md:w-12 md:h-12 rounded-full border-2 border-gold text-gold-dark text-lg md:text-xl flex items-center justify-center glass-card hover:bg-gold/20 z-20 font-bold cursor-pointer transition-transform hover:scale-105"
            aria-label="Cerrar"
          >
            ✕
          </button>

          <div
            onClick={e => e.stopPropagation()}
            className="relative max-w-3xl w-full max-h-[90vh] rounded-3xl overflow-hidden border-2 border-gold glass-card p-3 md:p-4 shadow-2xl flex flex-col"
          >
            <div className="relative flex items-center justify-center overflow-hidden rounded-2xl bg-cream/50 max-h-[72vh]">
              <img
                src={lightboxItem.src}
                alt={lightboxItem.title}
                className="max-h-[70vh] w-auto max-w-full object-contain rounded-xl mx-auto shadow-md"
              />
            </div>
            <div className="p-3 md:p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <div>
                <span className="text-[10px] font-montserrat uppercase tracking-wider text-gold-dark font-bold bg-gold/15 px-2.5 py-0.5 rounded-full border border-gold/30">
                  {lightboxItem.subtitle}
                </span>
                <p className="font-playfair text-base sm:text-xl text-text-main font-bold mt-1">
                  {lightboxItem.title}
                </p>
              </div>
              <button
                type="button"
                onClick={e => handleLike(lightboxItem.id, e)}
                className="flex items-center gap-2 px-4 py-2 rounded-full border border-gold bg-gradient-to-r from-gold/20 to-gold/30 text-gold-dark text-xs sm:text-sm font-bold shadow-sm hover:scale-105 transition-transform"
              >
                <span>❤️ Me Encanta</span>
                <span>({likes[lightboxItem.id]})</span>
              </button>
            </div>
          </div>
        </div>
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

// ─── Digital Wishbook Section ──────────────────────────────────────────────────
function WishbookSection({ onTriggerSwarm, onTriggerToast }: { onTriggerSwarm: () => void; onTriggerToast: (msg: string) => void }) {
  const [wishes, setWishes] = useState(INITIAL_WISHES)
  const [name, setName] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    async function loadCloudWishes() {
      const cloudData = await fetchFromGoogleSheets('getWishes')
      if (Array.isArray(cloudData) && cloudData.length > 0) {
        setWishes(cloudData)
      }
    }
    loadCloudWishes()
  }, [])

  const handleAddWish = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !message.trim()) return

    setLoading(true)
    onTriggerSwarm()

    const newWish = {
      id: Date.now(),
      name: name.trim(),
      message: message.trim(),
      date: "Justo ahora",
      hue: "#D4AF37",
    }

    setWishes(prev => [newWish, ...prev])
    setName('')
    setMessage('')

    const colorMap: Record<string, string> = {
      '#D4AF37': 'Dorado Elegante 🏆',
      '#F7C5D4': 'Rosa Pastel 🌸',
      '#FFE57F': 'Amarillo Pastel 💛',
      '#F5E6D3': 'Beige Vainilla 🍦',
      '#2E6B34': 'Verde Botánico 🌿',
      '#FFF5B8': 'Amarillo Sol ☀️'
    }
    const colorName = colorMap[newWish.hue] || 'Dorado Elegante 🏆'

    await sendToGoogleSheets('addWish', { name: newWish.name, message: newWish.message, hue: newWish.hue, colorName })
    setLoading(false)
    onTriggerToast("¡Tu deseo fue publicado en el muro de Krista Mariel! 🦋")
  }

  return (
    <section id="deseos" className="relative py-16 md:py-24 px-4 md:px-6">
      <div className="section-sep mb-16 md:mb-20" />
      <div className="max-w-4xl mx-auto">
        <SectionHeader tag="Muro de Felicitaciones" title="Libro de Deseos Mágico" />

        <div className="grid md:grid-cols-5 gap-8">
          <form onSubmit={handleAddWish} className="md:col-span-2 glass-card p-6 rounded-3xl flex flex-col gap-4 border-2 border-gold/40 shadow-md">
            <h3 className="font-playfair text-xl text-gold-dark font-bold">Deja tu Mensaje a Krista Mariel</h3>
            <p className="font-montserrat text-xs text-text-sub font-medium leading-relaxed">
              Escribe tus felicitaciones y buenos deseos para que Krista Mariel los conserve por siempre en su corazón.
            </p>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] uppercase tracking-widest font-montserrat text-gold-dark font-bold">
                Tu Nombre *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Ej. Tío Alejandro"
                className="w-full bg-cream border border-gold/40 focus:border-gold rounded-2xl px-4 py-3 text-sm text-text-main placeholder:text-text-muted outline-none transition-colors font-medium"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] uppercase tracking-widest font-montserrat text-gold-dark font-bold">
                Tu Felicitación *
              </label>
              <textarea
                rows={4}
                required
                value={message}
                onChange={e => setMessage(e.target.value)}
                placeholder="Escribe un hermoso deseo..."
                className="w-full bg-cream border border-gold/40 focus:border-gold rounded-2xl px-4 py-3 text-sm text-text-main placeholder:text-text-muted outline-none transition-colors resize-none font-medium"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="py-3 rounded-2xl bg-gradient-to-r from-gold-light via-gold to-gold-dark text-text-main font-montserrat font-bold text-xs uppercase tracking-wider shadow-md hover:brightness-110 transition-all mt-1 disabled:opacity-50"
            >
              {loading ? 'Publicando...' : 'Publicar Deseo 🦋'}
            </button>
          </form>

          <div className="md:col-span-3 flex flex-col gap-4 max-h-[450px] overflow-y-auto pr-1">
            {wishes.map((w) => (
              <div key={w.id} className="glass-card glass-card-hover p-5 rounded-3xl flex flex-col gap-2 relative border border-gold/30">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">🦋</span>
                    <h4 className="font-playfair text-base text-text-main font-bold">{w.name}</h4>
                  </div>
                  <span className="text-[9px] font-montserrat text-gold-dark font-bold">{w.date}</span>
                </div>
                <p className="font-montserrat text-xs text-text-sub leading-relaxed italic font-medium">
                  "{w.message}"
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── DJ Playlist Voting Section ────────────────────────────────────────────────
function DJPlaylistSection({ onTriggerToast }: { onTriggerToast: (msg: string) => void }) {
  const [songs, setSongs] = useState(INITIAL_SONGS)
  const [newTitle, setNewTitle] = useState('')
  const [newArtist, setNewArtist] = useState('')

  useEffect(() => {
    async function loadCloudSongs() {
      const cloudSongs = await fetchFromGoogleSheets('getSongs')
      if (Array.isArray(cloudSongs) && cloudSongs.length > 0) {
        setSongs(cloudSongs)
      }
    }
    loadCloudSongs()
  }, [])

  const handleVote = (id: number) => {
    const targetSong = songs.find(s => s.id === id)
    setSongs(prev =>
      prev.map(s => (s.id === id ? { ...s, votes: s.votes + 1 } : s)).sort((a, b) => b.votes - a.votes)
    )
    if (targetSong) {
      sendToGoogleSheets('voteSong', { title: targetSong.title })
    }
    onTriggerToast("¡Voto registrado para la canción! 🎵")
  }

  const handleAddSong = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTitle.trim() || !newArtist.trim()) return

    const songObj = {
      id: Date.now(),
      title: newTitle.trim(),
      artist: newArtist.trim(),
      votes: 1,
    }

    setSongs(prev => [...prev, songObj].sort((a, b) => b.votes - a.votes))
    setNewTitle('')
    setNewArtist('')
    sendToGoogleSheets('addSong', { title: songObj.title, artist: songObj.artist })
    onTriggerToast("¡Canción sugerida al DJ! 🎧")
  }

  return (
    <section id="playlist" className="relative py-16 md:py-24 px-4 md:px-6">
      <div className="section-sep mb-16 md:mb-20" />
      <div className="max-w-4xl mx-auto">
        <SectionHeader tag="Pista de Baile" title="Lista de Canciones para el DJ" />

        <div className="grid md:grid-cols-5 gap-8">
          <div className="md:col-span-3 flex flex-col gap-3">
            <h3 className="font-playfair text-xl text-gold-dark font-bold mb-2">
              Canciones Más Votadas por los Invitados
            </h3>
            {songs.map((s, idx) => (
              <div key={s.id} className="glass-card p-4 rounded-2xl flex items-center justify-between gap-4 border border-gold/30">
                <div className="flex items-center gap-3">
                  <span className="font-playfair font-bold text-lg text-gold-dark w-6">#{idx + 1}</span>
                  <div>
                    <h4 className="font-playfair font-bold text-text-main text-base">{s.title}</h4>
                    <p className="font-montserrat text-xs text-text-sub font-medium">{s.artist}</p>
                  </div>
                </div>

                <button
                  onClick={() => handleVote(s.id)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-gold bg-gold/15 text-gold-dark text-xs font-montserrat font-bold hover:bg-gold/25 transition-all shrink-0 shadow-sm"
                >
                  <span>🔥</span>
                  <span>{s.votes} votos</span>
                </button>
              </div>
            ))}
          </div>

          <form onSubmit={handleAddSong} className="md:col-span-2 glass-card p-6 rounded-3xl flex flex-col gap-4 border-2 border-gold/40 shadow-md">
            <h3 className="font-playfair text-xl text-gold-dark font-bold">Sugerir Nueva Canción</h3>
            <p className="font-montserrat text-xs text-text-sub font-medium leading-relaxed">
              ¿Hay un tema que no puede faltar en la fiesta de Krista Mariel? ¡Agrégalo para que el DJ lo ponga en la pista!
            </p>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] uppercase tracking-widest font-montserrat text-gold-dark font-bold">
                Título de la Canción *
              </label>
              <input
                type="text"
                required
                value={newTitle}
                onChange={e => setNewTitle(e.target.value)}
                placeholder="Ej. La Chona"
                className="w-full bg-cream border border-gold/40 focus:border-gold rounded-2xl px-4 py-3 text-sm text-text-main placeholder:text-text-muted outline-none transition-colors font-medium"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] uppercase tracking-widest font-montserrat text-gold-dark font-bold">
                Artista o Grupo *
              </label>
              <input
                type="text"
                required
                value={newArtist}
                onChange={e => setNewArtist(e.target.value)}
                placeholder="Ej. Los Tucanes de Tijuana"
                className="w-full bg-cream border border-gold/40 focus:border-gold rounded-2xl px-4 py-3 text-sm text-text-main placeholder:text-text-muted outline-none transition-colors font-medium"
              />
            </div>

            <button
              type="submit"
              className="py-3 rounded-2xl bg-gradient-to-r from-gold-light via-gold to-gold-dark text-text-main font-montserrat font-bold text-xs uppercase tracking-wider shadow-md hover:brightness-110 transition-all mt-1"
            >
              Agregar a la Lista 🎧
            </button>
          </form>
        </div>
      </div>
    </section>
  )
}

// ─── RSVP Section ──────────────────────────────────────────────────────────────
function RSVPSection({ onTriggerSwarm }: { onTriggerSwarm: () => void }) {
  const [name, setName] = useState('')
  const [attendance, setAttendance] = useState<'yes' | 'no'>('yes')
  const [guests, setGuests] = useState('1')
  const [song, setSong] = useState('')
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
      guests,
      attendance: statusText,
      song,
      note
    })

    const msg = encodeURIComponent(
      `Hola ${QUINCE_NAME}! Confirmo mi respuesta para tus Quince Años del 17 de Octubre:\n\n` +
      `👤 *Nombre:* ${name.trim()}\n` +
      `✨ *Asistencia:* ${statusText}\n` +
      `👥 *Invitados:* ${guests} persona(s)\n` +
      (song ? `🎵 *Canción sugerida:* ${song}\n` : '') +
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
        <SectionHeader tag="Confirmación de Asistencia" title="¿Nos Acompañas?" />

        {submitted ? (
          <div className="glass-card p-8 md:p-10 rounded-3xl text-center flex flex-col items-center gap-5 animate-fade-in-up border-2 border-gold">
            <div className="w-16 h-16 md:w-20 md:h-20 rounded-full border-2 border-gold flex items-center justify-center text-3xl md:text-4xl bg-gold/15 shadow-md">
              🦋
            </div>
            <h3 className="font-greatvibes text-4xl md:text-5xl gold-text-gradient">¡Gracias por Confirmar!</h3>
            <p className="font-playfair italic text-text-main text-base md:text-lg font-semibold">
              Tu respuesta ha sido registrada y enviada a WhatsApp.
            </p>
            <button
              onClick={() => setSubmitted(false)}
              className="text-xs uppercase tracking-widest text-gold-dark underline hover:text-gold font-bold mt-2"
            >
              Enviar otra confirmación
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="glass-card p-6 md:p-10 rounded-3xl flex flex-col gap-5 md:gap-6 border-2 border-gold/40 shadow-xl">
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] uppercase tracking-widest font-montserrat text-gold-dark font-bold">
                Nombre Completo *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Ej. María Fernanda López"
                className="w-full bg-cream border border-gold/40 focus:border-gold rounded-2xl px-4 py-3.5 text-base md:text-sm text-text-main placeholder:text-text-muted outline-none transition-colors font-medium"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] uppercase tracking-widest font-montserrat text-gold-dark font-bold">
                ¿Asistirás al Evento?
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setAttendance('yes')}
                  className={`py-3 rounded-2xl border-2 text-xs font-montserrat uppercase tracking-wider font-bold transition-all ${
                    attendance === 'yes'
                      ? 'border-gold bg-gold/25 text-gold-dark shadow-md'
                      : 'border-gold/30 text-text-sub hover:border-gold/50'
                  }`}
                >
                  ¡Sí, asistiré! ✨
                </button>
                <button
                  type="button"
                  onClick={() => setAttendance('no')}
                  className={`py-3 rounded-2xl border-2 text-xs font-montserrat uppercase tracking-wider font-bold transition-all ${
                    attendance === 'no'
                      ? 'border-gold bg-gold/25 text-gold-dark shadow-md'
                      : 'border-gold/30 text-text-sub hover:border-gold/50'
                  }`}
                >
                  No podré asistir 💔
                </button>
              </div>
            </div>

            {attendance === 'yes' && (
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] uppercase tracking-widest font-montserrat text-gold-dark font-bold">
                  Número de Personas que Asistirán
                </label>
                <div className="flex gap-2">
                  {['1', '2', '3', '4', '5+'].map(num => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setGuests(num)}
                      className={`flex-1 py-3 rounded-2xl border-2 text-sm font-playfair font-bold transition-all ${
                        guests === num
                          ? 'border-gold bg-gradient-to-r from-gold to-gold-dark text-text-main shadow-md'
                          : 'border-gold/30 text-text-sub hover:border-gold/50'
                      }`}
                    >
                      {num}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] uppercase tracking-widest font-montserrat text-gold-dark font-bold">
                ¿Qué canción te hace bailar? 🎵
              </label>
              <input
                type="text"
                value={song}
                onChange={e => setSong(e.target.value)}
                placeholder="Ej. Pepas - Farruko"
                className="w-full bg-cream border border-gold/40 focus:border-gold rounded-2xl px-4 py-3.5 text-base md:text-sm text-text-main placeholder:text-text-muted outline-none transition-colors font-medium"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] uppercase tracking-widest font-montserrat text-gold-dark font-bold">
                Mensaje para Krista Mariel / Restricciones Alimentarias
              </label>
              <textarea
                rows={3}
                value={note}
                onChange={e => setNote(e.target.value)}
                placeholder="Escribe aquí un lindo deseo para la quinceañera..."
                className="w-full bg-cream border border-gold/40 focus:border-gold rounded-2xl px-4 py-3.5 text-base md:text-sm text-text-main placeholder:text-text-muted outline-none transition-colors resize-none font-medium"
              />
            </div>

            <button
              type="submit"
              className="py-4 rounded-2xl bg-gradient-to-r from-gold-light via-gold to-gold-dark text-text-main font-montserrat font-bold text-sm md:text-base uppercase tracking-wider shadow-xl hover:brightness-110 active:scale-[0.98] transition-all mt-2"
            >
              Confirmar por WhatsApp 🦋
            </button>
          </form>
        )}
      </div>

      <footer className="mt-16 md:mt-24 text-center flex flex-col items-center gap-3">
        <GoldDivider />
        <h3 className="font-greatvibes text-4xl md:text-5xl gold-text-gradient">{QUINCE_FULL_NAME}</h3>
        <p className="text-[9px] md:text-[10px] uppercase tracking-[0.45em] font-montserrat text-gold-dark font-bold">
          17 · OCTUBRE · 2026 🦋
        </p>
      </footer>
    </section>
  )
}

// ─── Carta Especial de Krista Mariel ──────────────────────────────────────────
function KristaLetterSection() {
  return (
    <section id="carta" className="relative py-16 md:py-24 px-4 md:px-6">
      <div className="section-sep mb-16 md:mb-20" />
      <div className="max-w-3xl mx-auto">
        <div className="glass-card p-8 md:p-12 rounded-3xl border-2 border-gold/40 shadow-2xl relative overflow-hidden text-center flex flex-col items-center gap-6">
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-gold/10 rounded-full blur-2xl pointer-events-none" />
          <div className="w-16 h-16 rounded-full border-2 border-gold flex items-center justify-center text-3xl bg-gold/10 shadow-md">
            🦋
          </div>
          <p className="text-[10px] uppercase tracking-[0.4em] font-montserrat text-gold-dark font-bold">
            Mensaje Especial
          </p>
          <h2 className="font-greatvibes text-4xl sm:text-5xl md:text-6xl gold-text-gradient">
            Palabras de Krista Mariel
          </h2>
          <GoldDivider />

          <p className="font-playfair italic text-text-main text-base sm:text-lg md:text-xl leading-relaxed max-w-2xl font-medium">
            "Hoy dejo atrás la infancia para abrir mis alas como una mariposa y volar hacia un futuro lleno de sueños e ilusiones. Cumplir 15 años rodeada del amor de mi familia y de la compañía de mis amigos más queridos es la alegría más grande de mi vida. Gracias por ser parte de mi historia y por acompañarme a celebrar esta noche inolvidable."
          </p>

          <div className="mt-2 flex flex-col items-center">
            <span className="font-greatvibes text-3xl text-gold-dark font-bold">Krista Mariel</span>
            <span className="text-[10px] uppercase tracking-widest font-montserrat text-text-sub font-bold">17 de Octubre, 2026 · Quinta Maria Teresa</span>
          </div>
        </div>
      </div>
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
    onTriggerToast("✨ ¡Gracias por disfrutar el video de Krista Mariel! 🦋")
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
    <section id="video-especial" className="relative py-16 md:py-24 px-4 md:px-6">
      <div className="section-sep mb-16 md:mb-20" />
      <div className="max-w-4xl mx-auto flex flex-col items-center">
        <SectionHeader tag="Momento Estelar" title="Video Especial de Krista Mariel" />

        <p className="font-playfair italic text-text-main text-center text-sm md:text-base max-w-xl -mt-6 mb-8 px-2 font-medium">
          "Un instante irrepetible capturado en video, lleno de luz, emoción y la alegría de celebrar mis 15 años."
        </p>

        {/* Ambient Glow & Cinema Frame Container */}
        <div className="relative w-full max-w-[350px] sm:max-w-[380px] mx-auto group">
          {/* Hardware-Accelerated Ambient Backlight Glow */}
          <div
            className="absolute -inset-4 sm:-inset-6 rounded-[38px] bg-gradient-to-tr from-gold/30 via-[#FFE57F]/20 to-gold-dark/30 blur-xl pointer-events-none opacity-60 transform-gpu"
            style={{ transform: 'translateZ(0)', willChange: 'opacity' }}
          />

          {/* Luxury Filigree Reel Container */}
          <div
            onMouseMove={handleMouseMoveControls}
            className="relative w-full aspect-[9/16] rounded-3xl overflow-hidden border-2 border-gold/70 bg-[#120F0D] shadow-[0_20px_60px_-10px_rgba(212,175,55,0.4)] flex flex-col justify-between select-none"
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
                  <p className="text-[10px] font-montserrat text-white/80 font-medium">
                    (El vals se pausará automáticamente para escuchar el video 🎵)
                  </p>
                </div>
              </div>
            )}

            {/* Finished Video Overlay */}
            {isEnded && (
              <div
                onClick={handlePlay}
                className="absolute inset-0 z-10 bg-black/85 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center animate-fade-in cursor-pointer"
              >
                <div className="w-16 h-16 rounded-full border-2 border-gold flex items-center justify-center text-3xl bg-gold/15 shadow-xl mb-3">
                  🦋
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
        <div className="mt-6 flex flex-wrap justify-center gap-3 w-full max-w-md">
          <button
            onClick={openCinemaModal}
            className="px-5 py-2.5 rounded-full glass-card border border-gold/50 text-gold-dark text-xs font-montserrat font-bold flex items-center gap-2 shadow-sm hover:scale-105 active:scale-95 transition-all cursor-pointer"
          >
            <span>🎬</span> Pantalla Completa VIP
          </button>
          <button
            onClick={shareVideo}
            className="px-5 py-2.5 rounded-full glass-card border border-gold/50 text-gold-dark text-xs font-montserrat font-bold flex items-center gap-2 shadow-sm hover:scale-105 active:scale-95 transition-all cursor-pointer"
          >
            <span>📲</span> Compartir con Familia
          </button>
        </div>
      </div>

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

// ─── Virtual Hugs Counter Component ───────────────────────────────────────────
function VirtualHugsSection({ onTriggerSwarm, onTriggerToast }: { onTriggerSwarm: () => void; onTriggerToast: (msg: string) => void }) {
  const [hugs, setHugs] = useState(384)

  const handleSendHug = () => {
    setHugs(h => h + 1)
    onTriggerSwarm()
    onTriggerToast("¡Enviaste un Abrazo Virtual a Krista Mariel! 💖🦋")
  }

  return (
    <section id="abrazos" className="relative py-8 md:py-12 px-4 md:px-6">
      <div className="max-w-2xl mx-auto text-center">
        <div className="glass-card p-6 md:p-8 rounded-3xl border-2 border-gold/40 flex flex-col items-center gap-4 shadow-xl">
          <div className="w-14 h-14 rounded-full border-2 border-gold flex items-center justify-center text-3xl bg-gold/15 animate-bounce">
            💖
          </div>

          <h3 className="font-greatvibes text-3xl sm:text-4xl gold-text-gradient">
            Envía un Abrazo Virtual a Krista Mariel
          </h3>

          <p className="font-montserrat text-xs md:text-sm text-text-sub font-medium leading-relaxed max-w-md">
            Cada abrazo llena de alegría el corazón de Krista Mariel en su camino hacia sus Quince Años.
          </p>

          <div className="px-6 py-2 rounded-full bg-gold/15 border border-gold/40 my-1">
            <span className="font-playfair text-gold-dark font-bold text-lg md:text-xl">
              {hugs.toLocaleString()} Abrazos Entregados 🦋
            </span>
          </div>

          <button
            onClick={handleSendHug}
            className="px-8 py-3.5 rounded-full bg-gradient-to-r from-gold-light via-gold to-gold-dark text-text-main font-montserrat font-bold text-xs uppercase tracking-wider shadow-lg hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
          >
            <span>💖</span> Enviar Abrazo Virtual <span>🦋</span>
          </button>
        </div>
      </div>
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
    ctx.fillText('⛪ MISA: 1:00 PM · PARROQUIA NTRA. SRA. DEL CARMEN', 50, 250)
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
    ctx.fillText('Quinta Maria Teresa · 17.10.2026 🦋', cx, canvas.height - 20)

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
    { href: '#video-especial', label: 'Video Especial' },
    { href: '#padres', label: 'Familia' },
    { href: '#itinerario', label: 'Protocolo' },
    { href: '#coordinacion-outfits', label: 'Outfits' },
    { href: '#galeria', label: 'Galería' },
    { href: '#rsvp', label: 'RSVP' },
  ]

  const allNavLinks = [
    { href: '#inicio', label: 'Inicio' },
    { href: '#video-especial', label: 'Video Especial 🎬' },
    { href: '#padres', label: 'Familia' },
    { href: '#itinerario', label: 'Protocolo' },
    { href: '#coordinacion-outfits', label: 'Outfits' },
    { href: '#trivia', label: 'Trivia' },
    { href: '#vestimenta', label: 'Detalles' },
    { href: '#galeria', label: 'Galería' },
    { href: '#linea-tiempo', label: 'Historia' },
    { href: '#marco-foto', label: 'Marco Stories' },
    { href: '#muro-fotos', label: 'Muro de Fotos 📸' },
    { href: '#deseos', label: 'Deseos' },
    { href: '#playlist', label: 'DJ Playlist' },
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
                    window.dispatchEvent(new CustomEvent('open-music-selector'))
                    setOptionsOpen(false)
                  }}
                  className="flex items-center gap-3 p-2 rounded-xl hover:bg-gold/15 transition-colors text-left text-xs font-montserrat font-bold text-text-main"
                >
                  <span className="w-7 h-7 rounded-lg border border-gold/40 flex items-center justify-center bg-gold/10 text-gold-dark">🎵</span>
                  <div>
                    <div>Elegir Melodía de Fondo</div>
                    <div className="text-[10px] text-text-sub font-normal">Vals, Piano Romántico o Arpa</div>
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
    triggerExplosiveBurst()
    setToastMessage("💌 ¡Toca la mariposa dorada para abrir tu sobre oficial! 🦋")
  }

  const handleCloseEnvelope = () => {
    setEnvelopeOpen(false)
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

      {/* Floating Action Buttons */}
      <div className="fixed bottom-4 right-4 z-40 flex flex-col gap-2">
        <button
          onClick={() => speakEventDetails(setToastMessage)}
          className="w-11 h-11 md:w-12 md:h-12 rounded-full glass-card border-2 border-gold/50 flex items-center justify-center text-lg md:text-xl shadow-2xl hover:scale-110 transition-transform active:scale-95 text-gold-dark"
          title="Escuchar detalles del evento en voz alta 🔊"
        >
          🔊
        </button>
        <button
          onClick={triggerSwarm}
          className="w-11 h-11 md:w-12 md:h-12 rounded-full glass-card border-2 border-gold/50 flex items-center justify-center text-lg md:text-xl shadow-2xl hover:scale-110 transition-transform active:scale-95 text-gold-dark"
          title="Lluvia de Mariposas Pasteles"
        >
          🦋
        </button>
      </div>

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

      {/* Floating Wish Butterflies (Max 2 glass bubbles) */}
      <FloatingWishButterflies />

      {/* Main Sections */}
      <main className="relative z-20">
        <HeroSection onTriggerToast={setToastMessage} />
        <ParentsSection />
        <KristaLetterSection />
        <SpecialVideoSection onTriggerToast={setToastMessage} onTriggerBurst={triggerExplosiveBurst} />
        <VirtualCheersSection onTriggerSwarm={handleRSVPSubmitWithConfetti} onTriggerToast={setToastMessage} />
        <VirtualHugsSection onTriggerSwarm={handleRSVPSubmitWithConfetti} onTriggerToast={setToastMessage} />
        <ItinerarySection onTriggerToast={setToastMessage} />
        <ArrivalGuideSection onTriggerToast={setToastMessage} />
        <OutfitCoordinationSection />
        <VIPPassSection onTriggerToast={setToastMessage} />
        <TriviaSection onTriggerSwarm={handleRSVPSubmitWithConfetti} onTriggerToast={setToastMessage} />
        <DressGiftsSection onTriggerToast={setToastMessage} />
        <GallerySection />
        <TimelineSection />
        <TimeCapsuleSection onTriggerToast={setToastMessage} />
        <PhotoFrameCreator onTriggerToast={setToastMessage} />
        <LivePhotoWallSection onTriggerToast={setToastMessage} onTriggerBurst={triggerExplosiveBurst} />
        <WishbookSection onTriggerSwarm={handleRSVPSubmitWithConfetti} onTriggerToast={setToastMessage} />
        <DJPlaylistSection onTriggerToast={setToastMessage} />
        <RSVPSection onTriggerSwarm={handleRSVPSubmitWithConfetti} />
      </main>

      {/* Floating Toast Notification */}
      {toastMessage && (
        <Toast message={toastMessage} onClose={() => setToastMessage(null)} />
      )}
    </div>
  )
}
