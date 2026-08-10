import React, { useState, useEffect, useCallback, useRef } from 'react'

// ─── Event Configuration ───────────────────────────────────────────────────────
const QUINCE_NAME = "Krista Mariel"
const QUINCE_FULL_NAME = "Krista Mariel Sandoval Caldera"
const EVENT_DATE = new Date('2026-10-17T13:00:00') // 17 de Octubre, 2026 a la 1:00 PM
const BIRTHDAY_DATE = "15 de Octubre"
const FATHER_NAME = "Carlos Alberto Sandoval"
const MOTHER_NAME = "Elena Isabel Caldera"
const GODFATHER_NAME = "Roberto Antonio Silva"
const GODMOTHER_NAME = "Lucía Patricia Caldera"

const CHURCH_TIME = "1:00 PM - 2:00 PM"
const CHURCH_NAME = "Parroquia Nuestra Señora del Carmen"
const CHURCH_ADDRESS = "Calle Principal #123, Centro Histórico"
const CHURCH_MAPS = "https://maps.google.com/?q=Parroquia+Nuestra+Señora+del+Carmen"

const VENUE_TIME = "3:00 PM"
const VENUE_NAME = "Quinta Maria Teresa"
const VENUE_ADDRESS = "Quinta Maria Teresa"
const VENUE_MAPS = "https://maps.google.com/?q=Quinta+Maria+Teresa"

const WHATSAPP_PHONE = "5212345678901" // Reemplazar con el número real de WhatsApp
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
const DRESS_PALETTE = [
  { color: "#FFE57F", label: "Amarillo Pastel" },
  { color: "#F5E6D3", label: "Beige / Vainilla" },
  { color: "#FFFFFF", label: "Blanco" },
  { color: "#2E6B34", label: "Verde Botánico" },
  { color: "#D4AF37", label: "Dorado Elegante" },
]

// ─── Photo Gallery Data ───────────────────────────────────────────────────────
const GALLERY_ITEMS = [
  {
    id: 1,
    category: "pre-xv",
    title: "Sesión Pre-XV Krista Mariel",
    src: "/images/quinceanera_crista_portrait_1785996487711.png",
    aspect: "aspect-[3/4]",
    likes: 215,
  },
  {
    id: 2,
    category: "decor",
    title: "Mariposas & Detalles",
    src: "/images/quinceanera_decor_hall_1785996498584.png",
    aspect: "aspect-[4/3]",
    likes: 189,
  },
  {
    id: 3,
    category: "decor",
    title: "Corona Real & Vestido",
    src: "/images/quinceanera_details_tiara_1785996508526.png",
    aspect: "aspect-[3/4]",
    likes: 240,
  },
  {
    id: 4,
    category: "pre-xv",
    title: "Sueños & Fantasía",
    src: "/images/quinceanera_crista_portrait_1785996487711.png",
    aspect: "aspect-[4/3]",
    likes: 176,
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

    const render = () => {
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
  const text = `¡Hola! Te invitamos cordialmente a celebrar los Quince Años de Krista Mariel Sandoval Caldera. La ceremonia religiosa de acción de gracias se llevará a cabo el sábado 17 de Octubre a la 1:00 de la tarde en la Parroquia Nuestra Señora del Carmen. La gran fiesta de recepción comenzará a las 3:00 de la tarde en la Quinta María Teresa. ¡Te esperamos para compartir juntos este día inolvidable!`

  const utterance = new SpeechSynthesisUtterance(text)
  utterance.lang = 'es-MX'
  utterance.rate = 0.95
  utterance.pitch = 1.05

  window.speechSynthesis.speak(utterance)
  onTriggerToast("🔊 Leyendo invitación en voz alta...")
}

// ─── Before & After Baby to Quinceañera Slider ──────────────────────────────────
function BeforeAfterSlider() {
  const [sliderPos, setSliderPos] = useState(50)
  const containerRef = useRef<HTMLDivElement | null>(null)
  const isDragging = useRef(false)

  const handleMove = (clientX: number) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width))
    setSliderPos((x / rect.width) * 100)
  }

  return (
    <section id="antes-despues" className="relative py-16 md:py-24 px-4 md:px-6">
      <div className="section-sep mb-16 md:mb-20" />
      <div className="max-w-3xl mx-auto text-center flex flex-col items-center gap-6">
        <SectionHeader tag="Nuestra Historia" title="De Bebé a Quinceañera" />
        <p className="font-montserrat text-xs md:text-sm text-text-sub font-medium -mt-4 max-w-lg">
          Arrastra con el dedo o el mouse la barra divisoria para ver la hermosa transformación de Krista Mariel.
        </p>

        <div
          ref={containerRef}
          onMouseDown={() => (isDragging.current = true)}
          onMouseUp={() => (isDragging.current = false)}
          onMouseLeave={() => (isDragging.current = false)}
          onMouseMove={e => isDragging.current && handleMove(e.clientX)}
          onTouchMove={e => handleMove(e.touches[0].clientX)}
          className="relative w-full aspect-[4/3] rounded-3xl overflow-hidden border-2 border-gold/50 shadow-2xl select-none cursor-ew-resize touch-none"
        >
          {/* After Image (Quinceañera) */}
          <img
            src="/images/quinceanera_crista_portrait_1785996487711.png"
            alt="Krista Mariel Quinceañera"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute top-4 right-4 glass-card px-3 py-1 rounded-full text-[10px] uppercase font-montserrat font-bold text-gold-dark z-10 shadow-md">
            15 Años 👑
          </div>

          {/* Before Image (Childhood) */}
          <div
            className="absolute inset-0 overflow-hidden border-r-2 border-gold shadow-2xl"
            style={{ width: `${sliderPos}%` }}
          >
            <img
              src="/images/quinceanera_crista_portrait_1785996487711.png"
              alt="Krista Mariel de Bebé"
              className="absolute inset-0 w-full h-full object-cover filter sepia-[0.3]"
              style={{ width: containerRef.current ? containerRef.current.clientWidth : '100%', maxWidth: 'none' }}
            />
            <div className="absolute top-4 left-4 glass-card px-3 py-1 rounded-full text-[10px] uppercase font-montserrat font-bold text-gold-dark z-10 shadow-md">
              Mi Infancia 🌸
            </div>
          </div>

          {/* Divider Handle */}
          <div
            className="absolute top-0 bottom-0 z-20 flex items-center justify-center -translate-x-1/2 pointer-events-none"
            style={{ left: `${sliderPos}%` }}
          >
            <div className="w-10 h-10 rounded-full glass-card border-2 border-gold flex items-center justify-center text-lg text-gold-dark shadow-2xl bg-cream">
              🦋
            </div>
          </div>
        </div>
      </div>
    </section>
  )
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

// ─── Subtle Floating Glass Wishes (Max 2 on screen) ────────────────────────────
function FloatingWishButterflies({ wishes }: { wishes: typeof INITIAL_WISHES }) {
  const [selectedWish, setSelectedWish] = useState<typeof INITIAL_WISHES[0] | null>(null)

  const randomWish1 = wishes[0] || INITIAL_WISHES[0]
  const randomWish2 = wishes[1] || INITIAL_WISHES[1]

  return (
    <>
      <div className="fixed top-1/3 left-3 z-30 pointer-events-auto">
        <button
          onClick={() => setSelectedWish(randomWish1)}
          className="glass-card px-3 py-2 rounded-full border border-gold/60 flex items-center gap-2 shadow-lg hover:scale-105 transition-transform animate-float-slow bg-cream/90 backdrop-blur-md"
          title="Ver deseo flotante"
        >
          <span className="text-sm">🦋</span>
          <span className="text-[9px] uppercase font-montserrat font-bold text-gold-dark max-w-[90px] truncate">
            {randomWish1.name}
          </span>
        </button>
      </div>

      <div className="fixed top-2/3 right-3 z-30 pointer-events-auto">
        <button
          onClick={() => setSelectedWish(randomWish2)}
          className="glass-card px-3 py-2 rounded-full border border-gold/60 flex items-center gap-2 shadow-lg hover:scale-105 transition-transform animate-float-slow bg-cream/90 backdrop-blur-md"
          style={{ animationDelay: '1.5s' }}
          title="Ver deseo flotante"
        >
          <span className="text-sm">🦋</span>
          <span className="text-[9px] uppercase font-montserrat font-bold text-gold-dark max-w-[90px] truncate">
            {randomWish2.name}
          </span>
        </button>
      </div>

      {selectedWish && (
        <div className="fixed inset-0 z-50 bg-cream/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="glass-card p-6 md:p-8 rounded-3xl max-w-md w-full border-2 border-gold relative shadow-2xl text-center flex flex-col items-center gap-4 animate-fade-in">
            <button
              onClick={() => setSelectedWish(null)}
              className="absolute top-4 right-4 text-gold-dark text-lg font-bold"
            >
              ✕
            </button>
            <div className="w-14 h-14 rounded-full border-2 border-gold flex items-center justify-center text-2xl bg-gold/15">
              🦋
            </div>
            <h4 className="font-playfair text-2xl text-gold-dark font-bold">{selectedWish.name}</h4>
            <p className="font-montserrat text-sm text-text-main italic font-medium leading-relaxed">
              "{selectedWish.message}"
            </p>
            <button
              onClick={() => setSelectedWish(null)}
              className="px-6 py-2 rounded-full bg-gradient-to-r from-gold to-gold-dark text-text-main text-xs font-montserrat font-bold uppercase tracking-wider shadow-md mt-2"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </>
  )
}

// ─── Post-Party Family Thank You Banner ────────────────────────────────────────
function PostPartyThanksBanner({ isManualPostParty }: { isManualPostParty: boolean }) {
  const isPostPartyDate = new Date() >= new Date('2026-10-18T00:00:00')
  const showBanner = isPostPartyDate || isManualPostParty

  if (!showBanner) return null

  return (
    <div className="w-full bg-gradient-to-r from-gold-dark via-gold to-gold-dark text-text-main py-4 md:py-6 px-4 text-center shadow-xl relative z-30 border-b-2 border-gold-light animate-fade-in">
      <div className="max-w-4xl mx-auto flex flex-col items-center gap-2 md:gap-3">
        <span className="text-2xl md:text-3xl animate-bounce">💖 👑 🦋</span>
        <h2 className="font-greatvibes text-2xl sm:text-3xl md:text-5xl font-bold">
          ¡Infinitas Gracias por Acompañar a Krista Mariel!
        </h2>
        <p className="font-montserrat text-xs md:text-sm font-semibold max-w-2xl leading-relaxed">
          La familia Sandoval Caldera agradece de todo corazón tu valiosa presencia, muestras de cariño y hermosas bendiciones en los Quince Años de nuestra amada Krista Mariel.
        </p>
        <div className="flex gap-4 mt-2">
          <a
            href="#galeria"
            className="px-5 py-2 rounded-full bg-cream text-gold-dark font-montserrat font-bold text-xs uppercase tracking-wider shadow-md hover:bg-pure-white transition-all"
          >
            Ver Galería de Recuerdos 📸
          </a>
        </div>
      </div>
    </div>
  )
}

// ─── Real Audio Music Player ────────────────────────────────────────────────────
function RealMusicPlayer({ playTriggerRef }: { playTriggerRef: React.MutableRefObject<(() => void) | null> }) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [muted, setMuted] = useState(false)
  const [expanded, setExpanded] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const togglePlay = useCallback(() => {
    const audio = audioRef.current
    if (!audio) return
    if (audio.paused) {
      audio.play().then(() => setIsPlaying(true)).catch(err => console.warn("Audio play blocked", err))
    } else {
      audio.pause()
      setIsPlaying(false)
    }
  }, [])

  useEffect(() => {
    playTriggerRef.current = () => {
      const audio = audioRef.current
      if (audio && audio.paused) {
        audio.play().then(() => setIsPlaying(true)).catch(err => console.warn("Autoplay audio blocked", err))
      }
    }
  }, [playTriggerRef])

  const handleTimeUpdate = () => {
    const audio = audioRef.current
    if (audio) {
      setCurrentTime(audio.currentTime)
      setDuration(audio.duration || 0)
    }
  }

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current
    if (audio) {
      const seekTime = Number(e.target.value)
      audio.currentTime = seekTime
      setCurrentTime(seekTime)
    }
  }

  const toggleMute = () => {
    const audio = audioRef.current
    if (audio) {
      audio.muted = !muted
      setMuted(!muted)
    }
  }

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60)
    const s = Math.floor(secs % 60)
    return `${m}:${s < 10 ? '0' : ''}${s}`
  }

  return (
    <div className="fixed bottom-3 left-3 z-40 max-w-[calc(100vw-5rem)]">
      <audio
        ref={audioRef}
        src="/audio/vals_crista.mp3"
        loop
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleTimeUpdate}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />

      <div className="glass-card p-1.5 sm:p-2.5 rounded-full sm:rounded-2xl border-gold/50 shadow-xl flex flex-col gap-2 transition-all bg-cream/95 backdrop-blur-md">
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={togglePlay}
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gradient-to-r from-gold-light via-gold to-gold-dark text-text-main flex items-center justify-center font-bold text-xs sm:text-sm shadow-md hover:scale-105 active:scale-95 transition-transform shrink-0"
            title={isPlaying ? "Pausar Vals" : "Reproducir Vals de Krista Mariel"}
          >
            {isPlaying ? "⏸" : "▶"}
          </button>

          <div className="hidden sm:flex flex-col min-w-[120px] pr-2">
            <span className="text-[10px] uppercase font-montserrat tracking-widest text-gold-dark font-bold truncate">
              Vals de Krista Mariel
            </span>
            <span className="text-[9px] font-montserrat text-text-sub truncate">
              Música de Fondo 🦋
            </span>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={toggleMute}
              className="text-xs text-gold-dark hover:text-gold p-1"
              title={muted ? "Activar Sonido" : "Silenciar"}
            >
              {muted ? "🔇" : "🔊"}
            </button>
            <button
              onClick={() => setExpanded(!expanded)}
              className="text-xs text-gold-dark/70 hover:text-gold hidden sm:block p-1"
            >
              {expanded ? "▲" : "▼"}
            </button>
          </div>
        </div>

        {expanded && (
          <div className="px-2 pt-1 pb-2 flex flex-col gap-1 text-[9px] font-montserrat text-text-sub animate-fade-in">
            <input
              type="range"
              min={0}
              max={duration || 100}
              value={currentTime}
              onChange={handleSeek}
              className="w-full accent-gold h-1 bg-pastel-beige rounded-lg cursor-pointer"
            />
            <div className="flex justify-between">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
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
    <div className="text-center mb-8 md:mb-14 px-2">
      <p className="text-[9px] sm:text-[10px] md:text-[11px] uppercase tracking-[0.25em] sm:tracking-[0.35em] md:tracking-[0.45em] font-montserrat text-gold-dark/80 mb-2 font-bold flex items-center justify-center gap-2">
        <span>🦋</span> {tag} <span>🦋</span>
      </p>
      <h2 className="text-3xl sm:text-5xl md:text-7xl font-greatvibes gold-text-gradient py-1">
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
    <div className="glass-card p-3.5 sm:p-5 md:p-6 rounded-3xl border-2 border-gold/40 shadow-xl max-w-xl mx-auto my-4 md:my-6 flex items-center gap-3 sm:gap-4">
      <button
        onClick={() => setPlaying(!playing)}
        className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-r from-gold to-gold-dark text-text-main flex items-center justify-center text-lg sm:text-xl shadow-lg hover:scale-105 active:scale-95 transition-all shrink-0 font-bold"
      >
        {playing ? '⏸️' : '▶️'}
      </button>

      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-center mb-1">
          <span className="text-[9px] sm:text-[10px] uppercase tracking-widest font-montserrat text-gold-dark font-bold truncate">Mensaje de Voz · Krista Mariel</span>
          <span className="text-[9px] font-montserrat text-text-sub font-semibold shrink-0 ml-1">0:28</span>
        </div>

        <div className="flex items-center gap-1 h-5 sm:h-6 my-1">
          {Array.from({ length: 20 }).map((_, i) => (
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

        <p className="font-playfair italic text-[11px] sm:text-xs text-text-sub font-medium truncate">
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
    <section id="llegada" className="relative py-12 md:py-24 px-4 md:px-6">
      <div className="section-sep mb-12 md:mb-20" />
      <div className="max-w-4xl mx-auto">
        <SectionHeader tag="Ubicación & Traslado" title="Guía VIP de Llegada a Quinta Maria Teresa" />

        <ParallaxCard className="glass-card p-5 sm:p-8 md:p-10 rounded-3xl border-2 border-gold/40 flex flex-col md:flex-row gap-6 md:gap-8 shadow-2xl items-center">
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
        className="w-36 h-28 sm:w-44 sm:h-36 md:w-52 md:h-40 drop-shadow-[0_10px_25px_rgba(212,175,55,0.7)] animate-float-slow"
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
          <path
            d="M100 80 C135 95, 170 120, 150 145 C125 160, 105 125, 100 80 Z"
            fill="url(#butterflyGold)"
            stroke="#6E531E"
            strokeWidth="1.2"
            opacity="0.9"
          />
        </g>

        <ellipse cx="100" cy="80" rx="4" ry="24" fill="#6E531E" stroke="#D4AF37" strokeWidth="1" />
        <circle cx="100" cy="54" r="5" fill="#9A7B38" />
        <path d="M98 52 Q88 38 82 34" stroke="#9A7B38" strokeWidth="1.8" fill="none" strokeLinecap="round" />
        <path d="M102 52 Q112 38 118 34" stroke="#9A7B38" strokeWidth="1.8" fill="none" strokeLinecap="round" />
      </svg>

      {/* Central Monogram Wax Seal */}
      <div className="absolute w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-full bg-gradient-to-br from-gold-light via-gold to-gold-dark p-1 shadow-2xl flex items-center justify-center">
        <div className="w-full h-full rounded-full bg-cream border-2 border-gold flex flex-col items-center justify-center shadow-inner">
          <span className="font-cinzel text-lg sm:text-xl md:text-2xl font-bold text-gold-dark leading-none">KM</span>
          <span className="text-[6px] sm:text-[7px] uppercase tracking-widest text-gold-dark font-bold mt-0.5">Abrir</span>
        </div>
      </div>
    </div>
  )
}

// ─── Regal Interactive Envelope Modal with Pastel Butterfly Explosion ─────────
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
    setOpening(true)
    setFlash(true)

    onTriggerExplosiveBurst()

    setTimeout(() => {
      onClose()
    }, 1200)
  }

  return (
    <div className="fixed inset-0 z-50 bg-cream/95 backdrop-blur-xl flex items-center justify-center p-3 sm:p-4 transition-all duration-1000">
      {flash && (
        <div
          className="fixed inset-0 pointer-events-none z-50 animate-fade-in"
          style={{
            background: 'radial-gradient(circle at center, rgba(255, 245, 184, 0.95) 0%, rgba(247, 197, 212, 0.6) 40%, transparent 75%)',
            animationDuration: '1.2s',
          }}
        />
      )}

      <div className="relative w-full max-w-xs sm:max-w-md flex flex-col items-center">
        <ParallaxCard
          className={`relative w-full aspect-[4/5] sm:aspect-[4/3] rounded-3xl glass-card border-2 border-gold/50 p-4 sm:p-6 flex flex-col items-center justify-between cursor-pointer group shadow-2xl transition-all duration-1000 ${
            opening ? 'scale-125 opacity-0 rotate-3 filter blur-sm' : 'hover:scale-[1.02]'
          }`}
        >
          <div
            onClick={handleOpen}
            className="w-full h-full flex flex-col items-center justify-between"
          >
            <div className="absolute top-3 left-3 w-6 h-6 md:w-8 md:h-8 border-t-2 border-l-2 border-gold rounded-tl-lg" />
            <div className="absolute top-3 right-3 w-6 h-6 md:w-8 md:h-8 border-t-2 border-r-2 border-gold rounded-tr-lg" />
            <div className="absolute bottom-3 left-3 w-6 h-6 md:w-8 md:h-8 border-b-2 border-l-2 border-gold rounded-bl-lg" />
            <div className="absolute bottom-3 right-3 w-6 h-6 md:w-8 md:h-8 border-b-2 border-r-2 border-gold rounded-br-lg" />

            <div className="text-center mt-2 md:mt-4">
              <p className="text-[8px] sm:text-[9px] md:text-[10px] uppercase tracking-[0.3em] sm:tracking-[0.35em] text-gold-dark font-montserrat font-bold">
                Invitación de Gala Exclusiva
              </p>
              <h3 className="font-greatvibes text-2xl sm:text-3xl md:text-5xl text-gold-dark mt-1">
                XV Años de Krista Mariel
              </h3>
            </div>

            <GiantGoldenButterflySeal isOpening={opening} />

            <div className="text-center mb-1">
              <p className="text-[10px] sm:text-[11px] md:text-xs font-montserrat text-text-sub tracking-wider font-semibold">
                Toca la mariposa de oro para abrir la invitación 🦋✨
              </p>
            </div>
          </div>
        </ParallaxCard>
      </div>
    </div>
  )
}

// ─── Interactive QR Code Modal ─────────────────────────────────────────────────
function QRCodeModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 bg-cream/90 backdrop-blur-2xl flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        onClick={e => e.stopPropagation()}
        className="glass-card p-5 sm:p-8 rounded-3xl max-w-sm w-full text-center flex flex-col items-center gap-4 border-2 border-gold/50 shadow-2xl relative"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gold-dark hover:text-gold text-lg font-bold"
        >
          ✕
        </button>

        <div className="text-center">
          <p className="text-[10px] uppercase tracking-widest text-gold-dark font-bold font-montserrat">
            Escanear para compartir
          </p>
          <h3 className="font-greatvibes text-3xl sm:text-4xl gold-text-gradient mt-1">XV Años de Krista Mariel</h3>
        </div>

        <div className="p-3 sm:p-4 bg-white rounded-2xl shadow-xl border-4 border-gold/40 relative">
          <svg width="160" height="160" viewBox="0 0 180 180" fill="none">
            <rect width="180" height="180" fill="white" />
            <path d="M10 10 H70 V70 H10 Z M20 20 V60 H60 V20 Z M30 30 H50 V50 H30 Z" fill="#2D1F38" />
            <path d="M110 10 H170 V70 H110 Z M120 20 V60 H160 V20 Z M130 30 H150 V50 H130 Z" fill="#2D1F38" />
            <path d="M10 110 H70 V170 H10 Z M20 120 V160 H60 V120 Z M30 130 H50 V150 H30 Z" fill="#2D1F38" />
            <rect x="80" y="20" width="20" height="20" fill="#D4AF37" />
            <rect x="80" y="80" width="20" height="20" fill="#2D1F38" />
            <rect x="20" y="80" width="40" height="10" fill="#2D1F38" />
            <rect x="120" y="90" width="40" height="20" fill="#D4AF37" />
            <rect x="90" y="120" width="30" height="40" fill="#2D1F38" />
            <rect x="140" y="130" width="30" height="30" fill="#2D1F38" />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-9 h-9 rounded-full bg-cream border-2 border-gold flex items-center justify-center font-cinzel text-gold-dark font-bold text-xs shadow-md">
              KM
            </div>
          </div>
        </div>

        <p className="text-xs font-montserrat text-text-sub font-medium">
          Escanea este código QR con cualquier celular para abrir la invitación digital.
        </p>

        <button
          onClick={onClose}
          className="w-full py-3 rounded-2xl bg-gradient-to-r from-gold to-gold-dark text-text-main font-montserrat font-bold text-xs uppercase tracking-wider shadow-md hover:brightness-110"
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
      className="relative min-h-screen flex flex-col items-center justify-center text-center px-4 md:px-6 py-16 md:py-28 hero-glow overflow-hidden"
    >
      <div
        className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[280px] sm:w-[340px] md:w-[550px] h-[280px] sm:h-[340px] md:h-[550px] rounded-full blur-[80px] md:blur-[140px] opacity-35 pointer-events-none"
        style={{ background: 'radial-gradient(circle, #FFF5B8 0%, #F7C5D4 50%, transparent 75%)' }}
      />

      <div className="relative z-20 flex flex-col items-center max-w-4xl mx-auto w-full">
        <p className="animate-fade-in text-[9px] sm:text-[10px] md:text-xs uppercase tracking-[0.25em] sm:tracking-[0.35em] md:tracking-[0.45em] font-montserrat text-gold-dark mb-3 font-bold flex items-center gap-1.5 sm:gap-2">
          <span>🦋</span> Con la bendición de Dios y mi familia <span>🦋</span>
        </p>

        <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full border-2 border-gold flex items-center justify-center glass-card my-2 animate-float-slow shadow-lg">
          <span className="font-cinzel text-base sm:text-lg md:text-xl text-gold-dark font-bold">KM</span>
        </div>

        <p className="font-greatvibes text-3xl sm:text-4xl md:text-6xl text-gold-dark mt-1">
          Mis Quince Años
        </p>

        <GoldDivider />

        <div className="animate-fade-in-up my-2 md:my-4">
          <h1 className="text-4xl sm:text-6xl md:text-9xl font-greatvibes gold-text-gradient leading-tight drop-shadow-xl px-2">
            {QUINCE_NAME}
          </h1>
          <p className="text-[10px] sm:text-xs md:text-sm font-montserrat uppercase tracking-[0.25em] sm:tracking-[0.4em] text-text-sub font-bold mt-1">
            {QUINCE_FULL_NAME}
          </p>
        </div>

        <p className="max-w-xl font-playfair italic text-text-main text-sm sm:text-lg md:text-xl leading-relaxed mb-6 px-2 font-medium">
          "Hay momentos en la vida que son verdaderamente mágicos, pero compartirlos con las personas que más quiero los hace inolvidables."
        </p>

        <div className="px-4 sm:px-8 py-2.5 sm:py-3 rounded-full glass-card border-2 border-gold/40 my-2 shadow-md flex flex-col sm:flex-row items-center gap-1 sm:gap-2">
          <p className="font-playfair text-gold-dark font-bold text-sm sm:text-lg md:text-xl tracking-wider">
            Sábado · 17 de Octubre, 2026
          </p>
          <span className="hidden sm:inline text-gold-dark">•</span>
          <span className="text-[11px] sm:text-xs font-montserrat text-text-sub font-semibold">
            (Mi Cumpleaños: 15 de Octubre 🎂)
          </span>
        </div>

        <div className="animate-fade-in-up mt-4 sm:mt-6 md:mt-8 flex gap-2 sm:gap-4 md:gap-6 justify-center">
          {units.map(({ v, l }) => (
            <div key={l} className="flex flex-col items-center gap-1 sm:gap-1.5">
              <div className="w-13 h-13 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-2xl glass-card flex items-center justify-center border-2 border-gold/40 shadow-lg animate-border-glow">
                <span className="text-lg sm:text-2xl md:text-3xl font-playfair font-bold text-gold-dark">
                  {String(v).padStart(2, "0")}
                </span>
              </div>
              <span className="text-[8px] sm:text-[9px] md:text-[10px] uppercase tracking-[0.15em] sm:tracking-[0.2em] md:tracking-[0.3em] font-montserrat text-text-sub font-bold">
                {l}
              </span>
            </div>
          ))}
        </div>

        <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row items-center justify-center gap-2.5 sm:gap-3 w-full max-w-xs sm:max-w-none px-4">
          <button
            onClick={() => handleCalendar('google')}
            className="w-full sm:w-auto px-5 py-2.5 rounded-full border-2 border-gold/40 glass-card text-[10px] sm:text-[11px] font-montserrat uppercase tracking-wider text-gold-dark hover:bg-gold/15 transition-all flex items-center justify-center gap-2 font-bold shadow-sm"
          >
            <span>📅</span> Agregar a Google Calendar
          </button>
          <button
            onClick={() => handleCalendar('ics')}
            className="w-full sm:w-auto px-5 py-2.5 rounded-full border-2 border-gold/40 glass-card text-[10px] sm:text-[11px] font-montserrat uppercase tracking-wider text-gold-dark hover:bg-gold/15 transition-all flex items-center justify-center gap-2 font-bold shadow-sm"
          >
            <span>📲</span> Guardar en iPhone / iCal
          </button>
        </div>

        <VoiceMessageWidget />

        <a href="#padres" className="mt-8 sm:mt-12 flex flex-col items-center gap-2 opacity-70 hover:opacity-100 transition-opacity">
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
    <section id="padres" className="relative py-12 md:py-24 px-4 md:px-6">
      <div className="section-sep mb-12 md:mb-20" />
      <div className="max-w-4xl mx-auto">
        <SectionHeader tag="Nuestra Familia" title="Padres & Padrinos" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-8">
          <div className="glass-card glass-card-hover p-5 sm:p-7 md:p-8 rounded-3xl text-center flex flex-col items-center gap-3 md:gap-4 border-2 border-gold/40">
            <div className="w-11 h-11 md:w-14 md:h-14 rounded-full border-2 border-gold flex items-center justify-center bg-gold/10 shrink-0">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" stroke="#9A7B38" strokeWidth="1.8" fill="none" />
              </svg>
            </div>
            <p className="text-[9px] md:text-xs uppercase tracking-[0.2em] md:tracking-[0.3em] font-montserrat text-gold-dark font-bold">
              Con la bendición de mis Padres
            </p>
            <h3 className="font-playfair text-lg md:text-2xl text-text-main font-bold">
              {FATHER_NAME}
            </h3>
            <span className="text-gold-dark font-greatvibes text-xl md:text-3xl">&</span>
            <h3 className="font-playfair text-lg md:text-2xl text-text-main font-bold">
              {MOTHER_NAME}
            </h3>
          </div>

          <div className="glass-card glass-card-hover p-5 sm:p-7 md:p-8 rounded-3xl text-center flex flex-col items-center gap-3 md:gap-4 border-2 border-gold/40">
            <div className="w-11 h-11 md:w-14 md:h-14 rounded-full border-2 border-gold flex items-center justify-center bg-gold/10 shrink-0">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" stroke="#9A7B38" strokeWidth="1.8" fill="none" />
              </svg>
            </div>
            <p className="text-[9px] md:text-xs uppercase tracking-[0.2em] md:tracking-[0.3em] font-montserrat text-gold-dark font-bold">
              Mis Queridos Padrinos
            </p>
            <h3 className="font-playfair text-lg md:text-2xl text-text-main font-bold">
              {GODFATHER_NAME}
            </h3>
            <span className="text-gold-dark font-greatvibes text-xl md:text-3xl">&</span>
            <h3 className="font-playfair text-lg md:text-2xl text-text-main font-bold">
              {GODMOTHER_NAME}
            </h3>
          </div>
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
      <div className="glass-card p-5 sm:p-6 rounded-3xl max-w-md w-full text-center flex flex-col items-center gap-4 border-2 border-gold relative shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gold-dark text-lg font-bold"
        >
          ✕
        </button>

        <h3 className="font-greatvibes text-2xl sm:text-3xl gold-text-gradient">Selfie Real con Tiara & Mariposas</h3>
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
  onOpenQR,
  onOpenCamera,
  isNightMode,
  onToggleNightMode,
  onToggleFontScale,
  onResetFontScale,
  onSpeakDetails,
}: {
  onOpenEnvelope: () => void
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
    { href: '#padres', label: 'Familia' },
    { href: '#itinerario', label: 'Protocolo' },
    { href: '#coordinacion-outfits', label: 'Outfits' },
    { href: '#galeria', label: 'Galería' },
    { href: '#rsvp', label: 'RSVP' },
  ]

  const allNavLinks = [
    { href: '#inicio', label: 'Inicio' },
    { href: '#padres', label: 'Familia' },
    { href: '#itinerario', label: 'Protocolo' },
    { href: '#coordinacion-outfits', label: 'Outfits' },
    { href: '#trivia', label: 'Trivia' },
    { href: '#vestimenta', label: 'Detalles' },
    { href: '#galeria', label: 'Galería' },
    { href: '#linea-tiempo', label: 'Historia' },
    { href: '#marco-foto', label: 'Marco Stories' },
    { href: '#deseos', label: 'Deseos' },
    { href: '#playlist', label: 'DJ Playlist' },
    { href: '#rsvp', label: 'RSVP' },
  ]

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${
        scrolled ? 'py-2 md:py-3 backdrop-blur-xl border-b border-gold/30 bg-cream/90 shadow-md' : 'py-3 md:py-5 bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 flex items-center justify-between">
        <a href="#inicio" className="font-greatvibes text-xl sm:text-2xl md:text-3xl gold-text-gradient font-bold shrink-0">
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
        <div className="flex items-center gap-2 sm:gap-2.5 md:gap-3.5 shrink-0">
          {/* Night Mode Toggle */}
          <button
            onClick={onToggleNightMode}
            className="p-1.5 sm:p-2 rounded-full border border-gold/50 glass-card text-gold-dark hover:bg-gold/15 transition-all text-xs sm:text-sm shadow-sm"
            title={isNightMode ? "Modo Sol Vainilla" : "Modo Noche Fantasía"}
          >
            {isNightMode ? '☀️' : '🌙'}
          </button>

          {/* Tools & Accessibility Options Menu Dropdown */}
          <div className="relative" ref={optionsRef}>
            <button
              onClick={() => setOptionsOpen(!optionsOpen)}
              className="px-2.5 sm:px-3 py-1.5 rounded-full border border-gold/50 glass-card text-gold-dark hover:bg-gold/15 transition-all text-[11px] sm:text-xs font-montserrat font-bold flex items-center gap-1 shadow-sm"
              title="Herramientas & Accesibilidad"
            >
              <span>⚙️</span>
              <span className="hidden sm:inline">Opciones</span>
            </button>

            {optionsOpen && (
              <div className="absolute right-0 mt-2 w-60 sm:w-64 glass-card border-2 border-gold/40 rounded-2xl p-2 sm:p-3 shadow-2xl flex flex-col gap-1.5 z-50 animate-fade-in bg-cream/95 backdrop-blur-2xl max-w-[calc(100vw-1.5rem)]">
                <p className="text-[9px] uppercase tracking-widest font-montserrat text-gold-dark font-bold px-2 pt-1">
                  Herramientas & Accesibilidad
                </p>

                <button
                  onClick={() => { onToggleFontScale(); setOptionsOpen(false); }}
                  className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-gold/15 transition-colors text-left text-xs font-montserrat font-bold text-text-main"
                >
                  <span className="w-7 h-7 rounded-lg border border-gold/40 flex items-center justify-center bg-gold/10 text-gold-dark font-bold text-xs shrink-0">A+</span>
                  <div>
                    <div>Agrandar Letra</div>
                    <div className="text-[10px] text-text-sub font-normal">Para adultos mayores</div>
                  </div>
                </button>

                <button
                  onClick={() => { onResetFontScale(); setOptionsOpen(false); }}
                  className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-gold/15 transition-colors text-left text-xs font-montserrat font-bold text-text-main"
                >
                  <span className="w-7 h-7 rounded-lg border border-gold/40 flex items-center justify-center bg-gold/10 text-gold-dark font-bold text-xs shrink-0">A-</span>
                  <div>
                    <div>Letra Normal</div>
                    <div className="text-[10px] text-text-sub font-normal">Restablecer (100%)</div>
                  </div>
                </button>

                <button
                  onClick={() => { onSpeakDetails(); setOptionsOpen(false); }}
                  className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-gold/15 transition-colors text-left text-xs font-montserrat font-bold text-text-main"
                >
                  <span className="w-7 h-7 rounded-lg border border-gold/40 flex items-center justify-center bg-gold/10 text-gold-dark shrink-0">🔊</span>
                  <div>
                    <div>Narrar Evento por Voz</div>
                    <div className="text-[10px] text-text-sub font-normal">Escuchar detalles en audio</div>
                  </div>
                </button>

                <button
                  onClick={() => { onOpenCamera(); setOptionsOpen(false); }}
                  className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-gold/15 transition-colors text-left text-xs font-montserrat font-bold text-text-main"
                >
                  <span className="w-7 h-7 rounded-lg border border-gold/40 flex items-center justify-center bg-gold/10 text-gold-dark shrink-0">👑</span>
                  <div>
                    <div>Cámara AR Tiara Real</div>
                    <div className="text-[10px] text-text-sub font-normal">Selfie con corona dorada</div>
                  </div>
                </button>

                <button
                  onClick={() => { onOpenQR(); setOptionsOpen(false); }}
                  className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-gold/15 transition-colors text-left text-xs font-montserrat font-bold text-text-main"
                >
                  <span className="w-7 h-7 rounded-lg border border-gold/40 flex items-center justify-center bg-gold/10 text-gold-dark shrink-0">📲</span>
                  <div>
                    <div>Compartir Código QR</div>
                    <div className="text-[10px] text-text-sub font-normal">Enviar invitación fácil</div>
                  </div>
                </button>

                <button
                  onClick={() => { onOpenEnvelope(); setOptionsOpen(false); }}
                  className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-gold/15 transition-colors text-left text-xs font-montserrat font-bold text-text-main"
                >
                  <span className="w-7 h-7 rounded-lg border border-gold/40 flex items-center justify-center bg-gold/10 text-gold-dark shrink-0">✉️</span>
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
            className="px-3 sm:px-5 py-1.5 sm:py-2 rounded-full bg-gradient-to-r from-gold to-gold-dark text-text-main text-[11px] sm:text-xs font-montserrat font-bold uppercase tracking-wider hover:brightness-110 transition-all shadow-md shrink-0"
          >
            Confirmar
          </a>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-1.5 rounded-xl border border-gold/40 glass-card text-gold-dark text-base font-bold"
          >
            {mobileMenuOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="lg:hidden glass-card border-t border-gold/30 px-5 py-5 mt-2 flex flex-col gap-2.5 animate-fade-in bg-cream/95 backdrop-blur-2xl max-h-[75vh] overflow-y-auto shadow-2xl">
          {allNavLinks.map(({ href, label }) => (
            <a
              key={href}
              href={href}
              onClick={() => setMobileMenuOpen(false)}
              className="text-xs uppercase tracking-widest font-montserrat text-text-main hover:text-gold-dark transition-colors font-bold py-1"
            >
              {label}
            </a>
          ))}
          <a
            href="#rsvp"
            onClick={() => setMobileMenuOpen(false)}
            className="w-full text-center py-2.5 rounded-full bg-gradient-to-r from-gold to-gold-dark text-text-main text-xs font-montserrat font-bold uppercase tracking-wider mt-2 shadow-md"
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
  const [envelopeOpen, setEnvelopeOpen] = useState(true)
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
          }
        })
      },
      { threshold: 0.12 }
    )

    const sections = document.querySelectorAll('main > section, .glass-card')
    sections.forEach((el) => {
      el.classList.add('reveal-on-scroll')
      observer.observe(el)
    })

    return () => observer.disconnect()
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
      <div className="fixed bottom-3 right-3 z-40 flex flex-col gap-2">
        <button
          onClick={() => speakEventDetails(setToastMessage)}
          className="w-10 h-10 sm:w-11 sm:h-11 rounded-full glass-card border-2 border-gold/50 flex items-center justify-center text-base sm:text-lg shadow-2xl hover:scale-110 transition-transform active:scale-95 text-gold-dark bg-cream/95 backdrop-blur-md"
          title="Escuchar detalles del evento en voz alta 🔊"
        >
          🔊
        </button>
        <button
          onClick={triggerSwarm}
          className="w-10 h-10 sm:w-11 sm:h-11 rounded-full glass-card border-2 border-gold/50 flex items-center justify-center text-base sm:text-lg shadow-2xl hover:scale-110 transition-transform active:scale-95 text-gold-dark bg-cream/95 backdrop-blur-md"
          title="Lluvia de Mariposas Pasteles"
        >
          🦋
        </button>
      </div>

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
        onOpenEnvelope={() => setEnvelopeOpen(true)}
        onOpenQR={() => setQrOpen(true)}
        onOpenCamera={() => setCameraOpen(true)}
        isNightMode={isNightMode}
        onToggleNightMode={toggleNightMode}
        onToggleFontScale={toggleFontScale}
        onResetFontScale={resetFontScale}
        onSpeakDetails={() => speakEventDetails(setToastMessage)}
      />

      {/* Post Party Thank You Banner */}
      <PostPartyThanksBanner isManualPostParty={false} />

      {/* Main Sections */}
      <main className="relative z-20">
        <HeroSection onTriggerToast={setToastMessage} />
        <ParentsSection />
        <KristaLetterSection />
        <BeforeAfterSlider />
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

