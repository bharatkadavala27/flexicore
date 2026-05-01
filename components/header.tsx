"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Search, X, ChevronDown, Menu as MenuIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import type Lenis from "lenis"

const navLinks = [
  { name: "Home", href: "/" },
  { name: "About Us", href: "/about" },
  { name: "Products", href: "/products" },
  { name: "Applications", href: "/applications" },
  { name: "Gallery", href: "/gallery" },
  { name: "Distributors", href: "/distributors" },
  { name: "Contact", href: "/contact" },
]

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)

  // Stop smooth-scroll while menu is open so the overlay feels locked.
  useEffect(() => {
    const lenis = (window as unknown as { __lenis?: Lenis }).__lenis
    if (!lenis) return
    if (isMenuOpen) {
      lenis.stop()
      document.body.style.overflow = "hidden"
    } else {
      lenis.start()
      document.body.style.overflow = ""
    }
    return () => {
      lenis.start()
      document.body.style.overflow = ""
    }
  }, [isMenuOpen])

  // ESC to close menu
  useEffect(() => {
    if (!isMenuOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsMenuOpen(false)
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [isMenuOpen])

  return (
    <>
      {/* Logo Box - Top Left with Bracket Corners */}
      <Link
        href="/"
        className="absolute top-0 left-0 z-40 bg-white"
        aria-label="Flexicore Home"
      >
        <div className="relative w-[180px] h-[90px] md:w-[220px] md:h-[130px] flex items-center justify-center">
          <span className="absolute top-3 left-3 w-4 md:w-6 h-px bg-primary" />
          <span className="absolute top-3 left-3 w-px h-4 md:h-6 bg-primary" />
          <span className="absolute bottom-3 right-3 w-4 md:w-6 h-px bg-primary" />
          <span className="absolute bottom-3 right-3 w-px h-4 md:h-6 bg-primary" />

          <div className="flex flex-col items-center">
            <span className="text-[28px] leading-none font-bold tracking-[0.15em] text-foreground">
              FLEXICORE<sup className="text-[10px] align-super">®</sup>
            </span>
            <span className="mt-2 text-[10px] tracking-[0.35em] text-primary font-medium">
              SOLID SURFACE
            </span>
          </div>
        </div>

        <div className="bg-primary text-primary-foreground px-4 md:px-5 py-3 md:py-4 w-[180px] md:w-[220px]">
          <div className="flex items-center gap-2 text-xs mb-1">
            <span>Visit also</span>
            <span aria-hidden="true">&rarr;</span>
          </div>
          <p className="text-sm leading-snug">
            Flexicore<sup className="text-[8px]">®</sup> Quartz Products
            <br />
            At{" "}
            <span className="font-bold underline underline-offset-2">
              flexicorequartz.com
            </span>
          </p>
        </div>
      </Link>

      {/* Top-right MENU button with animated icon morph */}
      <div className="absolute top-0 right-0 z-[60] flex flex-col items-end">
        <button
          onClick={() => setIsMenuOpen((v) => !v)}
          className={cn(
            "relative overflow-hidden w-[90px] h-[90px] md:w-[130px] md:h-[130px] flex items-center justify-center",
            "font-bold text-sm md:text-lg tracking-[0.2em] text-primary-foreground",
            "bg-primary transition-[background-color,transform] duration-500 ease-out",
            "hover:bg-primary/90",
            isMenuOpen && "scale-[0.92]",
          )}
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={isMenuOpen}
        >
          {/* expanding ripple on click */}
          <span
            className={cn(
              "pointer-events-none absolute inset-0 bg-primary-foreground/15 rounded-full origin-center transition-transform duration-700 ease-out",
              isMenuOpen ? "scale-[8]" : "scale-0",
            )}
            aria-hidden="true"
          />

          {/* MENU label */}
          <span
            className={cn(
              "absolute flex items-center gap-2 transition-all duration-400 ease-out",
              isMenuOpen
                ? "opacity-0 -translate-y-4 rotate-6"
                : "opacity-100 translate-y-0 rotate-0",
            )}
          >
            <MenuIcon className="w-5 h-5" strokeWidth={2} />
            MENU
          </span>

          {/* CLOSE label */}
          <span
            className={cn(
              "absolute flex items-center gap-2 transition-all duration-400 ease-out",
              isMenuOpen
                ? "opacity-100 translate-y-0 rotate-0"
                : "opacity-0 translate-y-4 -rotate-6",
            )}
          >
            <X className="w-5 h-5" strokeWidth={2} />
            CLOSE
          </span>
        </button>

        {/* Search under MENU */}
        <button
          onClick={() => setIsSearchOpen(!isSearchOpen)}
          className="mt-6 mr-6 flex items-center gap-2 text-foreground hover:text-primary transition-colors"
          aria-label="Search"
        >
          <Search className="w-5 h-5" strokeWidth={1.5} />
          <span className="text-base font-light">Search</span>
        </button>
      </div>

      {/* Search overlay */}
      {isSearchOpen && (
        <div className="absolute top-[90px] md:top-[130px] right-0 z-40 w-full sm:w-80 bg-white border border-border shadow-lg p-4 animate-fade-up">
          <div className="flex items-center gap-2">
            <Search className="w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search products, colors..."
              className="flex-1 px-2 py-2 text-sm focus:outline-none"
              autoFocus
            />
            <button
              onClick={() => setIsSearchOpen(false)}
              aria-label="Close search"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* =========================================================
           Full menu overlay with layered reveal animation
           1. Red curtain slides in from the right
           2. White panel slides in over it
           3. Nav links stagger-fade up
         ========================================================= */}
      <div
        className={cn(
          "fixed inset-0 z-50 pointer-events-none",
          isMenuOpen && "pointer-events-auto",
        )}
        aria-hidden={!isMenuOpen}
      >
        {/* Red backing curtain */}
        <div
          className={cn(
            "absolute inset-0 bg-primary origin-right transition-transform duration-[700ms] ease-[cubic-bezier(0.77,0,0.175,1)]",
            isMenuOpen ? "scale-x-100" : "scale-x-0",
          )}
        />

        {/* White content panel (slides a fraction later) */}
        <div
          className={cn(
            "absolute inset-0 bg-white origin-right transition-transform duration-[700ms] ease-[cubic-bezier(0.77,0,0.175,1)] delay-[120ms]",
            isMenuOpen ? "scale-x-100" : "scale-x-0",
          )}
        >
          <div
            className={cn(
              "flex flex-col h-full transition-opacity duration-500",
              isMenuOpen ? "opacity-100 delay-[450ms]" : "opacity-0",
            )}
          >
            {/* Header row inside the menu */}
            <div className="flex items-center justify-between px-8 py-6 border-b border-border">
              <Link
                href="/"
                onClick={() => setIsMenuOpen(false)}
                className="flex flex-col"
              >
                <span className="text-xl font-bold tracking-[0.15em] text-foreground">
                  FLEXICORE<sup className="text-[10px]">®</sup>
                </span>
                <span className="text-[10px] tracking-[0.35em] text-primary font-medium">
                  SOLID SURFACE
                </span>
              </Link>
              <div className="w-[90px] h-[90px] md:w-[130px] md:h-[130px]" aria-hidden="true" />
            </div>

            <nav className="flex-1 overflow-y-auto px-8 py-12 max-w-3xl mx-auto w-full">
              <ul className="space-y-1">
                {navLinks.map((link, i) => (
                  <li
                    key={link.name}
                    className={cn(
                      "transition-all ease-out",
                      isMenuOpen
                        ? "opacity-100 translate-y-0 duration-[600ms]"
                        : "opacity-0 translate-y-6 duration-200",
                    )}
                    style={{
                      transitionDelay: isMenuOpen
                        ? `${500 + i * 60}ms`
                        : "0ms",
                    }}
                  >
                    <Link
                      href={link.href}
                      onClick={() => setIsMenuOpen(false)}
                      className="group flex items-center justify-between py-5 text-2xl md:text-4xl font-light text-foreground hover:text-primary transition-colors border-b border-border"
                    >
                      <span className="tracking-wide flex items-center gap-4">
                        <span className="text-xs text-primary opacity-60 font-mono">
                          0{i + 1}
                        </span>
                        {link.name}
                      </span>
                      <ChevronDown className="w-5 h-5 -rotate-90 group-hover:translate-x-2 transition-transform" />
                    </Link>
                  </li>
                ))}
              </ul>

              {/* Footer info inside menu, fades in last */}
              <div
                className={cn(
                  "mt-12 flex flex-wrap items-center justify-between gap-4 text-sm text-muted-foreground transition-all duration-700 ease-out",
                  isMenuOpen
                    ? "opacity-100 translate-y-0 delay-[1100ms]"
                    : "opacity-0 translate-y-4",
                )}
              >
                <p>flexicore@yahoo.com &middot; +91 96624 96622</p>
                <div className="flex items-center gap-4">
                  <Link href="/careers" onClick={() => setIsMenuOpen(false)} className="hover:text-primary">Careers</Link>
                  <Link href="/blog" onClick={() => setIsMenuOpen(false)} className="hover:text-primary">Blog</Link>
                  <Link href="/press" onClick={() => setIsMenuOpen(false)} className="hover:text-primary">Press</Link>
                </div>
              </div>
            </nav>
          </div>
        </div>
      </div>
    </>
  )
}
