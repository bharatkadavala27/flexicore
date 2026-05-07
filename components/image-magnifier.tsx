"use client"

import { useRef, useState, useEffect } from "react"

type Props = {
  src: string
  alt: string
  zoom?: number
  className?: string
}

export function ImageMagnifier({ src, alt, zoom = 3, className = "" }: Props) {
  const [show, setShow] = useState(false)
  const [lensPos, setLensPos] = useState({ x: 0, y: 0 })
  const [bgPos, setBgPos] = useState({ x: 0, y: 0 })
  const [rect, setRect] = useState<DOMRect | null>(null)
  const [isLargeScreen, setIsLargeScreen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  // Selection box size
  const lensWidth = 100
  const lensHeight = 100

  useEffect(() => {
    const checkScreen = () => setIsLargeScreen(window.innerWidth >= 1024)
    checkScreen()
    window.addEventListener("resize", checkScreen)
    return () => window.removeEventListener("resize", checkScreen)
  }, [])

  const handleMouseMove = (e: React.MouseEvent) => {
    const el = containerRef.current
    if (!el) return

    const currentRect = el.getBoundingClientRect()
    
    // Smoothly update rect if it changes
    if (!rect || Math.abs(rect.top - currentRect.top) > 5) {
      setRect(currentRect)
    }

    const x = e.clientX - currentRect.left
    const y = e.clientY - currentRect.top

    let lx = x - lensWidth / 2
    let ly = y - lensHeight / 2

    // Bounds check
    lx = Math.max(0, Math.min(lx, currentRect.width - lensWidth))
    ly = Math.max(0, Math.min(ly, currentRect.height - lensHeight))

    setLensPos({ x: lx, y: ly })

    // Background percentage for the zoomed window
    const bx = (lx / (currentRect.width - lensWidth)) * 100
    const by = (ly / (currentRect.height - lensHeight)) * 100
    setBgPos({ x: bx, y: by })
  }

  return (
    <div className={`relative ${className}`}>
      <div
        ref={containerRef}
        className="relative w-full h-full cursor-crosshair select-none group border border-border/50"
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
        onMouseMove={handleMouseMove}
      >
        <img
          src={src || "/placeholder.svg"}
          alt={alt}
          className="w-full h-full object-cover"
          draggable={false}
        />

        {show && (
          <>
            {/* 1. Selection Lens (On Image) */}
            <div
              className="pointer-events-none absolute border-2 border-primary bg-primary/10 shadow-2xl z-[50]"
              style={{
                width: lensWidth,
                height: lensHeight,
                left: lensPos.x,
                top: lensPos.y,
              }}
            />

            {/* 2. Zoom Result (Side Window) - Only on Desktop */}
            {isLargeScreen && rect && (
              <div
                className="fixed pointer-events-none border-2 border-border shadow-[0_20px_50px_rgba(0,0,0,0.2)] bg-white z-[9999]"
                style={{
                  top: rect.top,
                  left: rect.right + 30,
                  width: 500, // Fixed width for better control
                  height: rect.height,
                  backgroundImage: `url(${src})`,
                  backgroundRepeat: "no-repeat",
                  backgroundSize: `${zoom * 100}%`,
                  backgroundPosition: `${bgPos.x}% ${bgPos.y}%`,
                }}
              >
                 <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-[10px] px-3 py-1 uppercase tracking-widest font-bold">
                    HD Zoom
                 </div>
              </div>
            )}
            
            {/* 3. Mobile fallback: If not large screen, maybe show a small internal zoom? */}
          </>
        )}

        <div className="absolute bottom-3 left-3 bg-black/70 text-white text-[10px] uppercase tracking-wider px-2 py-1 z-30 font-medium">
          Hover to enlarge
        </div>
      </div>
    </div>
  )
}
