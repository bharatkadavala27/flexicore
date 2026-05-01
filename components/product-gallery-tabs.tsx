"use client"

import { useRef, useState } from "react"
import { Box, Image as ImageIcon, Play, Pause, Video } from "lucide-react"
import { ImageMagnifier } from "./image-magnifier"
import { Product3DViewer } from "./product-3d-viewer"
import type { Product } from "@/lib/products-data"

type Tab = "image" | "3d" | "video"

export function ProductGalleryTabs({ product }: { product: Product }) {
  const [tab, setTab] = useState<Tab>("image")
  const [active, setActive] = useState(0)
  const [playing, setPlaying] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  const gallery = (product.gallery && product.gallery.length) 
    ? product.gallery.map((g: any) => typeof g === 'string' ? g : g.url)
    : [product.images?.[0]?.url || product.image]
  const hasVideo = Boolean(product.videoUrl)

  const togglePlay = () => {
    const v = videoRef.current
    if (!v) return
    if (v.paused) {
      v.play()
      setPlaying(true)
    } else {
      v.pause()
      setPlaying(false)
    }
  }

  return (
    <div>
      {/* Tabs */}
      <div className="flex items-center gap-1 mb-3">
        <button
          onClick={() => setTab("image")}
          className={`inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold uppercase tracking-wide transition-colors duration-250 ${
            tab === "image"
              ? "bg-foreground text-background"
              : "bg-secondary text-foreground hover:bg-muted"
          }`}
        >
          <ImageIcon className="h-3.5 w-3.5" /> Photos
        </button>
        <button
          onClick={() => setTab("3d")}
          className={`inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold uppercase tracking-wide transition-colors duration-250 ${
            tab === "3d"
              ? "bg-foreground text-background"
              : "bg-secondary text-foreground hover:bg-muted"
          }`}
        >
          <Box className="h-3.5 w-3.5" /> 3D View
        </button>
        {hasVideo && (
          <button
            onClick={() => setTab("video")}
            className={`inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold uppercase tracking-wide transition-colors duration-250 ${
              tab === "video"
                ? "bg-foreground text-background"
                : "bg-secondary text-foreground hover:bg-muted"
            }`}
          >
            <Video className="h-3.5 w-3.5" /> Video
          </button>
        )}
      </div>

      {/* Viewer */}
      <div className="relative aspect-[4/3] bg-secondary overflow-hidden">
        {tab === "image" && (
          <ImageMagnifier src={gallery[active]} alt={product.name} className="w-full h-full" />
        )}
        {tab === "3d" && (
          <Product3DViewer image={gallery[active]} alt={product.name} />
        )}
        {tab === "video" && hasVideo && (
          <>
            <video
              ref={videoRef}
              src={product.videoUrl}
              poster={product.images?.[0]?.url || product.image}
              loop
              playsInline
              className="w-full h-full object-cover"
              onPause={() => setPlaying(false)}
              onPlay={() => setPlaying(true)}
            />
            <button
              onClick={togglePlay}
              aria-label={playing ? "Pause video" : "Play video"}
              className="absolute inset-0 flex items-center justify-center group"
            >
              <span
                className={`flex items-center justify-center h-16 w-16 rounded-full bg-white/95 text-primary shadow-xl transition-all duration-250 group-hover:scale-110 group-hover:bg-accent group-hover:text-accent-foreground ${
                  playing ? "opacity-0 group-hover:opacity-100" : "opacity-100"
                }`}
              >
                {playing ? (
                  <Pause className="h-6 w-6" />
                ) : (
                  <Play className="h-6 w-6 translate-x-0.5" />
                )}
              </span>
            </button>
          </>
        )}
      </div>

      {/* Thumbnails (hide for video tab) */}
      {tab !== "video" && gallery.length > 1 && (
        <div className="mt-3 flex gap-2 overflow-x-auto">
          {gallery.map((g, i) => (
            <button
              key={g}
              onClick={() => setActive(i)}
              className={`h-20 w-24 shrink-0 overflow-hidden border-2 transition-colors duration-250 ${
                active === i ? "border-primary" : "border-transparent hover:border-border"
              }`}
            >
              <img
                src={g || "/placeholder.svg"}
                alt={`${product.name} ${i + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
