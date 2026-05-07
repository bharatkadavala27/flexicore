"use client"

import { useEffect, useRef, useState } from "react"
import { RotateCw, Box } from "lucide-react"

type Props = { image: string; alt: string }

const DEPTH = 18 // px — slab thickness (half on each side)

export function Product3DViewer({ image, alt }: Props) {
  const [rotY, setRotY] = useState(25)
  const [rotX, setRotX] = useState(-12)
  const [auto, setAuto] = useState(true)
  const dragging = useRef(false)
  const last = useRef({ x: 0, y: 0 })

  useEffect(() => {
    if (!auto) return
    let raf = 0
    const tick = () => { setRotY((v) => v + 0.35); raf = requestAnimationFrame(tick) }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [auto])

  const onDown = (e: React.PointerEvent) => {
    dragging.current = true
    last.current = { x: e.clientX, y: e.clientY }
    setAuto(false)
      ; (e.target as HTMLElement).setPointerCapture(e.pointerId)
  }
  const onMove = (e: React.PointerEvent) => {
    if (!dragging.current) return
    const dx = e.clientX - last.current.x
    const dy = e.clientY - last.current.y
    setRotY((v) => v + dx * 0.5)
    setRotX((v) => Math.max(-40, Math.min(40, v - dy * 0.3)))
    last.current = { x: e.clientX, y: e.clientY }
  }
  const onUp = () => { dragging.current = false }

  const bg = { backgroundImage: `url(${image})`, backgroundSize: "cover", backgroundPosition: "center" }

  return (
    <div className="relative w-full h-full bg-[#f5f0eb] touch-none" style={{ perspective: "1000px" }}
      onPointerDown={onDown} onPointerMove={onMove} onPointerUp={onUp} onPointerCancel={onUp}>

      <div className="absolute inset-0 flex items-center justify-center">
        <div style={{
          width: 280, height: 200, position: "relative", transformStyle: "preserve-3d",
          transform: `rotateX(${rotX}deg) rotateY(${rotY}deg)`
        }}>

          {/* Front - Hidden */}
          <div className="absolute inset-0" style={{ ...bg, transform: `translateZ(${DEPTH}px)`, opacity: 0 }} />

          {/* Back - VISIBLE (The requested face) */}
          <div className="absolute inset-0" style={{ ...bg, transform: `translateZ(-${DEPTH}px) rotateY(180deg)` }} />

          {/* Right - Hidden */}
          <div className="absolute top-0 bottom-0" style={{
            ...bg, width: DEPTH * 2, left: 280,
            transformOrigin: "left center",
            transform: "rotateY(90deg)",
            filter: "brightness(0.75)",
            opacity: 0
          }} />

          {/* Left - Hidden */}
          <div className="absolute top-0 bottom-0" style={{
            ...bg, width: DEPTH * 2, right: 280,
            transformOrigin: "right center",
            transform: "rotateY(-90deg)",
            filter: "brightness(0.75)",
            opacity: 0
          }} />

          {/* Top - Hidden */}
          <div className="absolute left-0 right-0" style={{
            ...bg, height: DEPTH * 2, bottom: 200,
            transformOrigin: "bottom center",
            transform: "rotateX(90deg)",
            filter: "brightness(0.88)",
            opacity: 0
          }} />

          {/* Bottom - Hidden */}
          <div className="absolute left-0 right-0" style={{
            ...bg, height: DEPTH * 2, top: 200,
            transformOrigin: "top center",
            transform: "rotateX(-90deg)",
            filter: "brightness(0.65)",
            opacity: 0
          }} />
        </div>
      </div>

      <div className="absolute bottom-3 left-3 bg-black/70 text-white text-[10px] uppercase tracking-wider px-2 py-1 flex items-center gap-1.5">
        <Box className="h-3 w-3" /> 3D View
      </div>
      <button onClick={() => setAuto((a) => !a)}
        className="absolute bottom-3 right-3 bg-white text-foreground text-xs font-semibold px-3 py-1.5 hover:bg-primary hover:text-primary-foreground transition-colors flex items-center gap-1.5 shadow">
        <RotateCw className={`h-3.5 w-3.5 ${auto ? "animate-spin" : ""}`} />
        {auto ? "Pause" : "Auto-rotate"}
      </button>
      <div className="absolute top-3 right-3 bg-white/90 text-[10px] px-2 py-1 tracking-wide">Drag to rotate</div>
      <span className="sr-only">{alt}</span>
    </div>
  )
}