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
    <div className="fixed bottom-4 left-4 z-40 max-w-[calc(100vw-5rem)]">
      <audio
        ref={audioRef}
        src="/audio/vals_crista.mp3"
        loop
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleTimeUpdate}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />

      <div className="glass-card p-2 md:p-3 rounded-full md:rounded-2xl border-gold/50 shadow-xl flex flex-col gap-2 transition-all">
        <div className="flex items-center gap-3">
          <button
            onClick={togglePlay}
            className="w-10 h-10 rounded-full bg-gradient-to-r from-gold-light via-gold to-gold-dark text-text-main flex items-center justify-center font-bold text-sm shadow-md hover:scale-105 active:scale-95 transition-transform shrink-0"
            title={isPlaying ? "Pausar Vals" : "Reproducir Vals de Krista Mariel"}
          >
            {isPlaying ? "⏸" : "▶"}
          </button>

          <div className="hidden sm:flex flex-col min-w-[130px] pr-2">
            <span className="text-[10px] uppercase font-montserrat tracking-widest text-gold-dark font-bold truncate">
              Vals de Krista Mariel
            </span>
            <span className="text-[9px] font-montserrat text-text-sub truncate">
              Música de Fondo 🦋
            </span>
          </div>

          <div className="flex items-center gap-2">
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
    <div className="fixed inset-0 z-50 bg-cream/95 backdrop-blur-xl flex items-center justify-center p-4 transition-all duration-1000">
      {flash && (
        <div
          className="fixed inset-0 pointer-events-none z-50 animate-fade-in"
          style={{
            background: 'radial-gradient(circle at center, rgba(255, 245, 184, 0.95) 0%, rgba(247, 197, 212, 0.6) 40%, transparent 75%)',
            animationDuration: '1.2s',
          }}
        />
      )}

      <div className="relative w-full max-w-sm sm:max-w-md flex flex-col items-center">
        <ParallaxCard
          className={`relative w-full aspect-[4/3] rounded-3xl glass-card border-2 border-gold/50 p-6 flex flex-col items-center justify-between cursor-pointer group shadow-2xl transition-all duration-1000 ${
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
              <p className="text-[9px] md:text-[10px] uppercase tracking-[0.35em] text-gold-dark font-montserrat font-bold">
                Invitación de Gala Exclusiva
              </p>
              <h3 className="font-greatvibes text-3xl md:text-5xl text-gold-dark mt-1">
                XV Años de Krista Mariel
              </h3>
            </div>

            {/* Giant Golden 3D Animated Butterfly Seal */}
            <GiantGoldenButterflySeal isOpening={opening} />

            <div className="text-center mb-1">
              <p className="text-[11px] md:text-xs font-montserrat text-text-sub tracking-wider font-semibold">
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
        className="glass-card p-6 md:p-8 rounded-3xl max-w-sm w-full text-center flex flex-col items-center gap-5 border-2 border-gold/50 shadow-2xl relative"
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
          <h3 className="font-greatvibes text-4xl gold-text-gradient mt-1">XV Años de Krista Mariel</h3>
        </div>

        {/* QR Code SVG */}
        <div className="p-4 bg-white rounded-2xl shadow-xl border-4 border-gold/40 relative">
          <svg width="180" height="180" viewBox="0 0 180 180" fill="none">
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
            <div className="w-10 h-10 rounded-full bg-cream border-2 border-gold flex items-center justify-center font-cinzel text-gold-dark font-bold text-sm shadow-md">
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
            <p className="text-[10px] md:text-xs uppercase tracking-[0.25em] md:tracking-[0.3em] font-montserrat text-gold-dark font-bold">
              Con la bendición de mis Padres
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
            <p className="text-[10px] md:text-xs uppercase tracking-[0.25em] md:tracking-[0.3em] font-montserrat text-gold-dark font-bold">
              Mis Queridos Padrinos
            </p>
            <h3 className="font-playfair text-xl md:text-2xl text-text-main font-bold">
              {GODFATHER_NAME}
            </h3>
            <span className="text-gold-dark font-greatvibes text-2xl md:text-3xl">&</span>
            <h3 className="font-playfair text-xl md:text-2xl text-text-main font-bold">
              {GODMOTHER_NAME}
            </h3>
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── Protocol / Itinerary Section (Exact Client Timeline) ──────────────────────
function ItinerarySection({ onTriggerToast }: { onTriggerToast: (msg: string) => void }) {
  const [reminders, setReminders] = useState<Record<number, boolean>>({})

  const events = [
    {
      id: 1,
      time: "1:00 PM – 2:00 PM",
      tag: "Misa Religiosa",
      title: "MISA",
      subtitle: "Misa de Acción de Gracias",
      name: CHURCH_NAME,
      address: CHURCH_ADDRESS,
      maps: CHURCH_MAPS,
      icon: "⛪",
    },
    {
      id: 2,
      time: "3:00 PM",
      tag: "Recepción",
      title: "LLEGADA DE INVITADOS",
      subtitle: "Bienvenida y Coctel",
      name: VENUE_NAME,
      address: VENUE_ADDRESS,
      maps: VENUE_MAPS,
      icon: "🚗",
    },
    {
      id: 3,
      time: "4:00 PM – 5:00 PM",
      tag: "Banquete",
      title: "MARIACHI",
      subtitle: "Comienzan a servir comida",
      name: VENUE_NAME,
      address: VENUE_ADDRESS,
      maps: VENUE_MAPS,
      icon: "🎺",
    },
    {
      id: 4,
      time: "5:00 PM",
      tag: "Música en Vivo",
      title: "INICIO GRUPO VERSÁTIL",
      subtitle: "Música y excelente ambiente",
      name: VENUE_NAME,
      address: VENUE_ADDRESS,
      maps: VENUE_MAPS,
      icon: "🎵",
    },
    {
      id: 5,
      time: "5:00 PM – 5:50 PM",
      tag: "Convivencia",
      title: "AMBIENTE, COMIDA Y CONVIVENCIA",
      subtitle: "Disfrute con familia y amigos",
      name: VENUE_NAME,
      address: VENUE_ADDRESS,
      maps: VENUE_MAPS,
      icon: "🍽️",
    },
    {
      id: 6,
      time: "6:00 PM – 7:00 PM",
      tag: "Momento Especial",
      title: "VALS Y BAILES ESPECIALES",
      subtitle: "Violín en vivo y pistas emotivas",
      subDetails: [
        "Vals principal (violín)",
        "Papá, mamá y hermana (pistas)",
        "Madrina y padrino (violín)",
        "Abuela y abuelo (violín)",
        "Final con abuelo y entra papá a terminar con ella (violín)"
      ],
      name: VENUE_NAME,
      address: "Pista Principal",
      maps: VENUE_MAPS,
      icon: "🎻",
    },
    {
      id: 7,
      time: "7:00 PM – 7:15 PM",
      tag: "Recuerdos",
      title: "SEMBLANZA",
      subtitle: "Proyección de fotos memorables",
      name: VENUE_NAME,
      address: VENUE_ADDRESS,
      maps: VENUE_MAPS,
      icon: "🖼️",
    },
    {
      id: 8,
      time: "7:15 PM – 7:30 PM",
      tag: "Tradición",
      title: "PASTEL",
      subtitle: "Cantan las mañanitas y partimos el pastel (15 minutos)",
      name: VENUE_NAME,
      address: VENUE_ADDRESS,
      maps: VENUE_MAPS,
      icon: "🎂",
    },
    {
      id: 9,
      time: "7:30 PM – 7:45 PM",
      tag: "Serenata",
      title: "PIANO EN VIVO",
      subtitle: "Canciones especiales en piano",
      name: VENUE_NAME,
      address: VENUE_ADDRESS,
      maps: VENUE_MAPS,
      icon: "🎹",
    },
    {
      id: 10,
      time: "7:45 PM – 8:00 PM",
      tag: "Gran Show",
      title: "BAILE SORPRESA",
      subtitle: "Cambio de vestuario y presentación (15-20 minutos)",
      name: VENUE_NAME,
      address: VENUE_ADDRESS,
      maps: VENUE_MAPS,
      icon: "💃",
    },
    {
      id: 11,
      time: "8:00 PM – 12:00 AM",
      tag: "Pista Llenísima",
      title: "AMBIENTE Y BAILE",
      subtitle: "Con Grupo Versátil en vivo",
      name: VENUE_NAME,
      address: VENUE_ADDRESS,
      maps: VENUE_MAPS,
      icon: "🪩",
    },
    {
      id: 12,
      time: "12:00 AM – 2:00 AM",
      tag: "Cierre de Fiesta",
      title: "BANDA",
      subtitle: "¡Que siga la fiesta con Banda!",
      name: VENUE_NAME,
      address: VENUE_ADDRESS,
      maps: VENUE_MAPS,
      icon: "🎺",
    },
  ]

  const copyAddress = (addr: string) => {
    navigator.clipboard.writeText(addr)
    onTriggerToast("¡Dirección copiada al portapapeles! 📍")
  }

  const toggleReminder = (id: number, title: string, time: string) => {
    const isSet = !reminders[id]
    setReminders(prev => ({ ...prev, [id]: isSet }))
    if (isSet) {
      onTriggerToast(`¡Recordatorio activado para: ${title} (${time})! ⏰`)
    } else {
      onTriggerToast(`Recordatorio cancelado para: ${title}`)
    }
  }

  return (
    <section id="itinerario" className="relative py-16 md:py-24 px-4 md:px-6">
      <div className="section-sep mb-16 md:mb-20" />
      <div className="max-w-4xl mx-auto">
        <SectionHeader tag="Protocolo Oficial" title="Itinerario de Mis XV Años" />

        <div className="flex flex-col gap-4 md:gap-6 relative">
          {events.map((ev) => (
            <div
              key={ev.id}
              className="glass-card glass-card-hover p-5 md:p-7 rounded-3xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-2 border-gold/30"
            >
              <div className="flex items-start sm:items-center gap-4 md:gap-5 w-full md:w-auto">
                <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl border-2 border-gold flex items-center justify-center text-2xl sm:text-3xl bg-pastel-yellow/30 shrink-0 shadow-sm mt-1 sm:mt-0">
                  {ev.icon}
                </div>
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className="text-[9px] font-montserrat uppercase tracking-wider text-gold-dark bg-gold/10 px-2.5 py-0.5 rounded-full border border-gold/30 font-bold">
                      {ev.tag}
                    </span>
                    <span className="font-playfair text-gold-dark font-bold text-base sm:text-lg">{ev.time}</span>
                  </div>
                  <h3 className="font-playfair text-lg sm:text-xl md:text-2xl text-text-main font-bold">{ev.title}</h3>
                  <p className="font-playfair italic text-gold-dark text-sm sm:text-base font-semibold">{ev.subtitle}</p>
                  
                  {ev.subDetails && (
                    <ul className="mt-2 text-xs font-montserrat text-text-sub space-y-1 border-l-2 border-gold/40 pl-3">
                      {ev.subDetails.map((det, i) => (
                        <li key={i} className="flex items-center gap-1.5 font-medium">
                          <span className="text-gold-dark text-[10px]">🦋</span> {det}
                        </li>
                      ))}
                    </ul>
                  )}

                  <p className="font-montserrat text-[11px] sm:text-xs text-text-muted mt-1">{ev.address}</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 w-full md:w-auto pt-2 md:pt-0 border-t md:border-t-0 border-gold/20">
                <button
                  onClick={() => toggleReminder(ev.id, ev.title, ev.time)}
                  className={`px-3.5 py-2 rounded-full border text-xs font-montserrat transition-all font-bold ${
                    reminders[ev.id]
                      ? 'border-gold bg-gold/20 text-gold-dark'
                      : 'border-gold/30 text-text-sub hover:border-gold hover:text-gold-dark'
                  }`}
                  title="Activar Recordatorio"
                >
                  {reminders[ev.id] ? "⏰ Recordatorio Activado" : "🔔 Recordarme"}
                </button>
                <button
                  onClick={() => copyAddress(ev.address)}
                  className="px-3.5 py-2 rounded-full border border-gold/40 text-xs font-montserrat text-gold-dark hover:bg-gold/15 transition-colors font-bold"
                >
                  Copiar Dirección
                </button>
                <a
                  href={ev.maps}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-full bg-gradient-to-r from-gold to-gold-dark text-text-main font-montserrat font-bold text-xs hover:brightness-110 transition-opacity text-center shadow-sm"
                >
                  Abrir Mapa
                </a>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 text-center p-4 rounded-2xl glass-card border border-gold/40">
          <p className="font-playfair italic text-text-main text-sm sm:text-base font-semibold">
            "Cada momento está pensado para disfrutar, celebrar y crear recuerdos inolvidables con Krista Mariel."
          </p>
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

              <p className="font-montserrat text-xs text-text-sub leading-relaxed mb-5 font-medium">
                Te pedimos acompañarnos con tu mejor atuendo de gala. Vestido largo para las damas y traje formal para los caballeros.
              </p>

              <p className="text-[10px] uppercase tracking-widest font-montserrat text-gold-dark mb-3 font-bold">
                Paleta Sugerida de Colores Pasteles & Dorado:
              </p>
              <div className="flex flex-wrap justify-center sm:justify-start gap-3 mb-5">
                {DRESS_PALETTE.map(({ color, label }) => (
                  <div key={label} className="flex flex-col items-center gap-1">
                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border-2 border-gold shadow-md" style={{ backgroundColor: color }} />
                    <span className="text-[9px] font-montserrat text-text-sub font-bold">{label}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-3.5 rounded-2xl border border-gold/40 bg-pastel-yellow/30 flex items-center gap-3">
              <span className="text-xl shrink-0">🦋</span>
              <p className="text-xs font-montserrat text-text-main font-semibold leading-snug">
                El color blanco, marfil y vestuario con mariposas principales están reservados con cariño para la Quinceañera Krista Mariel.
              </p>
            </div>
          </div>

          <div className="glass-card glass-card-hover p-6 md:p-8 rounded-3xl flex flex-col justify-between gap-5 border-2 border-gold/40">
            <div>
              <div className="flex items-center gap-3 md:gap-4 mb-4">
                <div className="w-12 h-12 rounded-full border-2 border-gold flex items-center justify-center text-2xl bg-gold/10 shrink-0">
                  🎁
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-widest font-montserrat text-gold-dark font-bold">Mesa de Regalos</p>
                  <h3 className="font-playfair text-xl md:text-2xl text-text-main font-bold">Lluvia de Sobres</h3>
                </div>
              </div>

              <p className="font-montserrat text-xs text-text-sub leading-relaxed mb-5 font-medium">
                Tu presencia en este día tan especial es mi mayor regalo. Si deseas hacerme un presente en efectivo, contaremos con un buzón para lluvia de sobres en el evento o puedes realizar una transferencia:
              </p>

              <div className="p-4 md:p-5 rounded-2xl border border-gold/40 bg-cream flex flex-col gap-2.5 shadow-sm">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-montserrat text-text-sub font-semibold">Banco:</span>
                  <span className="font-playfair font-bold text-text-main">{BANK_NAME}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="font-montserrat text-text-sub font-semibold">Beneficiario:</span>
                  <span className="font-playfair font-bold text-text-main">{BANK_BENEFICIARY}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="font-montserrat text-text-sub font-semibold">CLABE:</span>
                  <span className="font-playfair font-bold text-gold-dark tracking-wider text-[11px] sm:text-xs">{BANK_CLABE}</span>
                </div>
                <button
                  onClick={copyClabe}
                  className="mt-2 py-2.5 rounded-xl border border-gold/50 bg-gold/15 hover:bg-gold/25 text-gold-dark text-xs font-montserrat font-bold transition-colors"
                >
                  Copiar CLABE Bancaria
                </button>
              </div>
            </div>

            <p className="text-center text-[11px] font-playfair italic text-text-sub mt-2 font-medium">
              "Cualquier detalle será atesorado en mi corazón por siempre."
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── Photo Gallery Section ─────────────────────────────────────────────────────
function GallerySection() {
  const [filter, setFilter] = useState<'all' | 'pre-xv' | 'decor'>('all')
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)
  const [likes, setLikes] = useState<Record<number, number>>({ 1: 215, 2: 189, 3: 240, 4: 176 })

  const filtered = GALLERY_ITEMS.filter(item => filter === 'all' || item.category === filter)

  const handleLike = (id: number, e: React.MouseEvent) => {
    e.stopPropagation()
    setLikes(prev => ({ ...prev, [id]: (prev[id] || 0) + 1 }))
  }

  return (
    <section id="galeria" className="relative py-16 md:py-24 px-4 md:px-6">
      <div className="section-sep mb-16 md:mb-20" />
      <div className="max-w-5xl mx-auto">
        <SectionHeader tag="Momentos Inolvidables" title="Galería de Krista Mariel" />

        <div className="flex flex-wrap justify-center gap-2 md:gap-3 mb-8 md:mb-10">
          {[
            { id: 'all', label: 'Todas las Fotos' },
            { id: 'pre-xv', label: 'Sesión Pre-XV' },
            { id: 'decor', label: 'Detalles & Mariposas' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id as 'all' | 'pre-xv' | 'decor')}
              className={`px-4 md:px-5 py-2 rounded-full text-xs font-montserrat uppercase tracking-wider transition-all font-bold ${
                filter === tab.id
                  ? 'bg-gradient-to-r from-gold to-gold-dark text-text-main shadow-md'
                  : 'glass-card text-text-sub hover:text-gold-dark border border-gold/30'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
          {filtered.map((item, idx) => (
            <div
              key={item.id}
              onClick={() => setLightboxIndex(idx)}
              className={`relative ${item.aspect} rounded-3xl overflow-hidden glass-card glass-card-hover cursor-pointer group border-2 border-gold/30`}
            >
              <img
                src={item.src}
                alt={item.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-cream/90 via-cream/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-4 md:p-6 flex flex-col justify-end">
                <p className="font-playfair text-base md:text-lg text-text-main font-bold">{item.title}</p>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-[9px] md:text-[10px] font-montserrat uppercase tracking-widest text-gold-dark font-bold">Ver Pantalla Completa</span>
                  <button
                    onClick={e => handleLike(item.id, e)}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/90 border border-gold/40 text-xs text-gold-dark font-bold shadow-sm"
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

      {lightboxIndex !== null && (
        <div
          className="fixed inset-0 z-50 bg-cream/95 backdrop-blur-2xl flex items-center justify-center p-3 sm:p-4"
          onClick={() => setLightboxIndex(null)}
        >
          <button
            onClick={() => setLightboxIndex(null)}
            className="absolute top-4 right-4 w-10 h-10 md:w-12 md:h-12 rounded-full border-2 border-gold text-gold-dark text-lg md:text-xl flex items-center justify-center glass-card hover:bg-gold/20 z-10 font-bold"
          >
            ✕
          </button>

          <div
            onClick={e => e.stopPropagation()}
            className="relative max-w-3xl max-h-[85vh] rounded-3xl overflow-hidden border-2 border-gold glass-card p-2 shadow-2xl"
          >
            <img
              src={filtered[lightboxIndex].src}
              alt={filtered[lightboxIndex].title}
              className="max-h-[70vh] md:max-h-[75vh] w-auto rounded-2xl object-contain mx-auto"
            />
            <div className="p-3 md:p-4 flex justify-between items-center">
              <p className="font-playfair text-base md:text-xl text-gold-dark font-bold">{filtered[lightboxIndex].title}</p>
              <button
                onClick={e => handleLike(filtered[lightboxIndex].id, e)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-gold bg-gold/15 text-gold-dark text-xs md:text-sm font-bold"
              >
                <span>❤️</span>
                <span>{likes[filtered[lightboxIndex].id]} Me Gusta</span>
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
  const milestones = [
    {
      year: "2011",
      title: "El Nacimiento de Nuestra Princesa",
      desc: "Llega a nuestras vidas Krista Mariel llena de luz, ternura y sonrisas que iluminaron a toda la familia.",
      icon: "🍼"
    },
    {
      year: "2016",
      title: "Niñez & Primeros Sueños",
      desc: "Años inolvidables de juegos, risas contagiosas y el florecer de una niña alegre y amorosa.",
      icon: "🎈"
    },
    {
      year: "2021",
      title: "Amor por el Arte y las Mariposas",
      desc: "Una hermosa etapa descubriendo pasiones, amistades verdaderas y una personalidad brillante.",
      icon: "🦋"
    },
    {
      year: "2026",
      title: "El Gran Día de Gala en Quinta Maria Teresa",
      desc: "17 de Octubre de 2026: Abre sus alas como una hermosa mariposa para celebrar sus Quince Años.",
      icon: "👑"
    },
  ]

  return (
    <section id="linea-tiempo" className="relative py-16 md:py-24 px-4 md:px-6">
      <div className="section-sep mb-16 md:mb-20" />
      <div className="max-w-4xl mx-auto">
        <SectionHeader tag="Nuestra Historia" title="De Infancia a Mis XV Años" />

        <div className="relative border-l-2 border-gold/40 ml-4 md:ml-32 space-y-8 md:space-y-12">
          {milestones.map((m, idx) => (
            <div key={idx} className="relative pl-8 md:pl-10">
              <div className="absolute -left-[17px] top-1 w-8 h-8 rounded-full border-2 border-gold bg-cream flex items-center justify-center text-sm shadow-md">
                {m.icon}
              </div>

              <div className="glass-card p-5 md:p-7 rounded-3xl border-2 border-gold/30 flex flex-col gap-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs uppercase font-montserrat tracking-widest text-gold-dark font-bold bg-gold/15 px-3 py-1 rounded-full border border-gold/30">
                    {m.year}
                  </span>
                  <span className="text-xs font-montserrat text-text-sub font-semibold">Recuerdo Especial</span>
                </div>
                <h3 className="font-playfair text-xl md:text-2xl text-text-main font-bold mt-1">{m.title}</h3>
                <p className="font-montserrat text-xs md:text-sm text-text-sub leading-relaxed font-medium">{m.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
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
    ctx.fillText(`PASES CONFIRMADOR: ${passCount} PERSONA(S)`, 50, 175)

    ctx.fillStyle = '#6E531E'
    ctx.font = '12px "Montserrat", sans-serif'
    ctx.fillText('📅 SÁBADO 17 DE OCTUBRE, 2026', 50, 225)
    ctx.fillText('⛪ MISA: 1:00 PM · PARROQUIA NTRA. SRA. DEL CARMEN', 50, 250)
    ctx.fillText('📍 RECEPCIÓN: 3:00 PM · QUINTA MARIA TERESA', 50, 275)

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

      {/* Post Party Thank You Banner (Appears Oct 18 onwards or when test post-party mode is active) */}
      <PostPartyThanksBanner isManualPostParty={false} />

      {/* Floating Wish Butterflies (Max 2 glass bubbles) */}
      <FloatingWishButterflies wishes={INITIAL_WISHES} />

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
