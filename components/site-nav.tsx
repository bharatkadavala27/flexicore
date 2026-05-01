"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import {
  Search,
  X,
  ChevronDown,
  Phone,
  Mail,
  Menu as MenuIcon,
  Facebook,
  Instagram,
  Linkedin,
} from "lucide-react"
import { LanguageSwitcher } from "./language-switcher"
import { useI18n } from "./i18n-provider"
import { cn } from "@/lib/utils"

type NavItem = {
  label: string
  href: string
  children?: { label: string; href: string }[]
}

const navItems: NavItem[] = [
  { label: "Home", href: "/" },
  {
    label: "Company",
    href: "/about",
    children: [
      { label: "About Us", href: "/about" },
      { label: "Via Flexicore", href: "/via-flexicore" },
      { label: "Our Founder", href: "/founder" },
      { label: "Our Team", href: "/team" },
      { label: "Certificates", href: "/certificates" },
    ],
  },
  {
    label: "Products",
    href: "/products",
    children: [
      { label: "All Products", href: "/products" },
      { label: "Alabaster", href: "/products?category=alabaster" },
      { label: "Marble", href: "/products?category=marble" },
      { label: "Mosaic", href: "/products?category=mosaic" },
      { label: "Sparkle", href: "/products?category=sparkle" },
      { label: "Translucent", href: "/products?category=translucent" },
      { label: "Plain Surface", href: "/products?category=plain" },
    ],
  },
  {
    label: "Distributors",
    href: "/distributors/find",
    children: [
      { label: "Find a Distributor", href: "/distributors/find" },
      { label: "Become a Distributor", href: "/distributors/apply" },
    ],
  },
  {
    label: "Inspire",
    href: "/gallery",
    children: [
      { label: "Gallery", href: "/gallery" },
      { label: "AI Room Mockup", href: "/room-mockup" },
      { label: "Blog", href: "/blog" },
      { label: "PR & News", href: "/press" },
      { label: "Expo", href: "/expo" },
    ],
  },
  { label: "Careers", href: "/careers" },
  { label: "Contact", href: "/contact" },
]

export function SiteNav() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null)
  const pathname = usePathname()
  const { t } = useI18n()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  useEffect(() => {
    setMobileOpen(false)
    setSearchOpen(false)
    setOpenDropdown(null)
  }, [pathname])

  // lock scroll when mobile drawer is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : ""
    return () => {
      document.body.style.overflow = ""
    }
  }, [mobileOpen])

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(href + "/")

  return (
    <header className="sticky top-0 z-50 w-full">
      {/* ===== Top utility strip ===== */}
      <div
        className={cn(
          "hidden md:block bg-primary text-primary-foreground text-xs transition-[max-height,opacity] duration-300 ease-out overflow-hidden",
          scrolled ? "max-h-0 opacity-0" : "max-h-10 opacity-100",
        )}
      >
        <div className="mx-auto max-w-7xl px-4 md:px-8 h-10 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <a
              href="tel:+919662496622"
              className="flex items-center gap-2 hover:text-accent transition-colors"
            >
              <Phone className="h-3 w-3" />
              <span>+91 96624 96622</span>
            </a>
            <a
              href="mailto:flexicore@yahoo.com"
              className="flex items-center gap-2 hover:text-accent transition-colors"
            >
              <Mail className="h-3 w-3" />
              <span>flexicore@yahoo.com</span>
            </a>
          </div>

          <div className="flex items-center gap-4">
            <LanguageSwitcher />
            <span className="h-4 w-px bg-primary-foreground/30" aria-hidden="true" />
            <div className="flex items-center gap-3">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-accent transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="h-3.5 w-3.5" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-accent transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="h-3.5 w-3.5" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-accent transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* ===== Main navigation bar ===== */}
      <div
        className={cn(
          "transition-[background-color,backdrop-filter,border-color,box-shadow] duration-300",
          scrolled
            ? "bg-background/70 backdrop-blur-xl border-b border-border/40 shadow-[0_8px_24px_rgba(0,0,0,0.08)] supports-[backdrop-filter]:bg-background/60"
            : "bg-background border-b border-border",
        )}
      >
        <div
          className={cn(
            "mx-auto max-w-7xl px-4 md:px-8 flex items-center justify-between gap-6 transition-all duration-300",
            scrolled ? "h-14" : "h-20",
          )}
        >
          {/* Logo */}
          <Link href="/" className="flex items-center shrink-0" aria-label="Flexicore Home">
            <Image
              src="/flexicore-logo.webp"
              alt="Flexicore"
              width={180}
              height={48}
              priority
              className={cn(
                "w-auto transition-all duration-300",
                scrolled ? "h-8" : "h-10 md:h-12",
              )}
            />
          </Link>

          {/* Desktop nav links */}
          <nav className="hidden lg:flex items-center gap-0.5">
            {navItems.map((item) => (
              <div
                key={item.label}
                className="relative"
                onMouseEnter={() => item.children && setOpenDropdown(item.label)}
                onMouseLeave={() => setOpenDropdown(null)}
              >
                <Link
                  href={item.href}
                  className={cn(
                    "relative flex items-center gap-1 px-3 py-2 text-sm font-medium transition-colors",
                    isActive(item.href)
                      ? "text-primary"
                      : "text-foreground/80 hover:text-primary",
                  )}
                >
                  {item.label}
                  {item.children && (
                    <ChevronDown
                      className={cn(
                        "h-3 w-3 transition-transform duration-200",
                        openDropdown === item.label && "rotate-180",
                      )}
                    />
                  )}

                  {/* Hover/active accent underline */}
                  <span
                    className={cn(
                      "pointer-events-none absolute left-3 right-3 bottom-1 h-px bg-accent origin-left transition-transform duration-300",
                      isActive(item.href) || openDropdown === item.label
                        ? "scale-x-100"
                        : "scale-x-0 group-hover:scale-x-100",
                    )}
                  />
                </Link>

                {/* Dropdown */}
                {item.children && (
                  <div
                    className={cn(
                      "absolute left-0 top-full min-w-[240px] transition-all duration-200 origin-top",
                      openDropdown === item.label
                        ? "opacity-100 translate-y-0 pointer-events-auto"
                        : "opacity-0 -translate-y-2 pointer-events-none",
                    )}
                  >
                    <div className="mt-1 bg-background border border-border shadow-lg overflow-hidden">
                      <div className="h-0.5 w-full bg-primary" />
                      <ul className="py-2">
                        {item.children.map((c) => (
                          <li key={c.href}>
                            <Link
                              href={c.href}
                              className="group flex items-center justify-between px-4 py-2.5 text-sm text-foreground/80 hover:bg-secondary hover:text-primary transition-colors"
                            >
                              <span>{c.label}</span>
                              <span className="h-px w-0 bg-accent transition-all duration-300 group-hover:w-6" />
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* Right controls */}
          <div className="flex items-center gap-2 md:gap-3 shrink-0">
            <button
              onClick={() => setSearchOpen((v) => !v)}
              className="p-2 text-foreground/70 hover:text-primary transition-colors"
              aria-label="Search"
            >
              <Search className="h-4 w-4" />
            </button>

            <Link
              href="/contact"
              className={cn(
                "hidden md:inline-flex items-center gap-2 bg-primary text-primary-foreground text-xs font-semibold uppercase tracking-[0.15em] px-5 py-2.5 transition-all duration-300",
                "hover:bg-accent hover:text-accent-foreground",
              )}
            >
              {t("cta.enquire", "Enquire Now")}
            </Link>

            <Link
              href="/admin/login"
              className={cn(
                "hidden md:inline-flex items-center gap-2 border border-primary text-primary text-xs font-semibold uppercase tracking-[0.15em] px-5 py-2.5 transition-all duration-300",
                "hover:bg-primary hover:text-primary-foreground",
              )}
            >
              Login
            </Link>

            <button
              onClick={() => setMobileOpen((v) => !v)}
              className="lg:hidden p-2 text-foreground hover:text-primary transition-colors"
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? <X className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Search bar */}
        <div
          className={cn(
            "border-t border-border bg-background overflow-hidden transition-[max-height] duration-300",
            searchOpen ? "max-h-20" : "max-h-0",
          )}
        >
          <div className="mx-auto max-w-3xl px-4 py-4 flex items-center gap-3">
            <Search className="h-4 w-4 text-muted-foreground" />
            <input
              autoFocus={searchOpen}
              type="text"
              placeholder="Search products, colors, articles..."
              className="flex-1 bg-transparent outline-none text-sm placeholder:text-muted-foreground"
            />
            <button
              onClick={() => setSearchOpen(false)}
              className="p-1 text-muted-foreground hover:text-foreground"
              aria-label="Close search"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* ===== Mobile drawer ===== */}
      <div
        className={cn(
          "lg:hidden fixed inset-0 top-0 z-40 bg-background transition-transform duration-400 ease-[cubic-bezier(0.77,0,0.175,1)]",
          mobileOpen ? "translate-x-0" : "translate-x-full",
        )}
        aria-hidden={!mobileOpen}
      >
        <div className="flex items-center justify-between h-20 px-4 border-b border-border">
          <Link href="/" onClick={() => setMobileOpen(false)} aria-label="Flexicore Home">
            <Image
              src="/flexicore-logo.webp"
              alt="Flexicore"
              width={160}
              height={40}
              className="h-10 w-auto"
            />
          </Link>
          <button
            onClick={() => setMobileOpen(false)}
            className="p-2 text-foreground"
            aria-label="Close menu"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <nav className="h-[calc(100vh-5rem)] overflow-y-auto px-4 pb-10">
          <ul className="divide-y divide-border">
            {navItems.map((item) => (
              <li key={item.label}>
                {item.children ? (
                  <>
                    <button
                      onClick={() =>
                        setMobileExpanded((cur) => (cur === item.label ? null : item.label))
                      }
                      className="w-full flex items-center justify-between py-4 text-base font-medium text-foreground"
                    >
                      <span>{item.label}</span>
                      <ChevronDown
                        className={cn(
                          "h-4 w-4 transition-transform duration-200",
                          mobileExpanded === item.label && "rotate-180",
                        )}
                      />
                    </button>
                    <div
                      className={cn(
                        "overflow-hidden transition-all duration-300",
                        mobileExpanded === item.label ? "max-h-96 pb-3" : "max-h-0",
                      )}
                    >
                      <ul className="pl-3 flex flex-col gap-2">
                        {item.children.map((c) => (
                          <li key={c.href}>
                            <Link
                              href={c.href}
                              onClick={() => setMobileOpen(false)}
                              className="block py-2 text-sm text-foreground/70 hover:text-primary"
                            >
                              {c.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </>
                ) : (
                  <Link
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center justify-between py-4 text-base font-medium text-foreground"
                  >
                    {item.label}
                  </Link>
                )}
              </li>
            ))}
          </ul>

          <Link
            href="/contact"
            onClick={() => setMobileOpen(false)}
            className="mt-6 w-full inline-flex items-center justify-center bg-primary text-primary-foreground text-xs font-semibold uppercase tracking-[0.15em] px-5 py-3.5"
          >
            {t("cta.enquire", "Enquire Now")}
          </Link>

          <Link
            href="/admin/login"
            onClick={() => setMobileOpen(false)}
            className="mt-3 w-full inline-flex items-center justify-center border border-primary text-primary text-xs font-semibold uppercase tracking-[0.15em] px-5 py-3.5"
          >
            Login
          </Link>

          <div className="mt-8 pt-6 border-t border-border text-sm text-muted-foreground space-y-2">
            <a
              href="tel:+919662496622"
              className="flex items-center gap-2 hover:text-primary"
            >
              <Phone className="h-4 w-4" />
              +91 96624 96622
            </a>
            <a
              href="mailto:flexicore@yahoo.com"
              className="flex items-center gap-2 hover:text-primary"
            >
              <Mail className="h-4 w-4" />
              flexicore@yahoo.com
            </a>
            <div className="flex items-center gap-4 pt-3">
              <a
                href="https://www.facebook.com/flexicoresolidsurface/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="hover:text-primary"
              >
                <Facebook className="h-4 w-4" />
              </a>
              <a
                href="https://www.instagram.com/flexicore_/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="hover:text-primary"
              >
                <Instagram className="h-4 w-4" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="hover:text-primary"
              >
                <Linkedin className="h-4 w-4" />
              </a>
            </div>
          </div>
        </nav>
      </div>
    </header>
  )
}
