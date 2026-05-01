"use client"

import { useRef } from "react"
import Link from "next/link"
import { ArrowRight, ArrowLeft, Quote, Linkedin } from "lucide-react"

/**
 * Home section §4.6
 * Founder highlight card + horizontally scrolling team strip.
 */

const team = [
  {
    name: "Amit Verma",
    role: "Chief Design Officer",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=520&q=80",
  },
  {
    name: "Sara Khan",
    role: "Head of R&D",
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=520&q=80",
  },
  {
    name: "Marco Rossi",
    role: "Operations Director",
    image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=520&q=80",
  },
  {
    name: "Lin Wei",
    role: "Global Sales Lead",
    image: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=520&q=80",
  },
  {
    name: "Diego Alvarez",
    role: "Regional Manager LATAM",
    image: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=520&q=80",
  },
  {
    name: "Priya Menon",
    role: "Sustainability Lead",
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=520&q=80",
  },
  {
    name: "Hiroshi Tanaka",
    role: "Head of Innovation",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=520&q=80",
  },
]

export function HomeTeamFounder() {
  const stripRef = useRef<HTMLDivElement>(null)

  const scroll = (dir: "left" | "right") => {
    const node = stripRef.current
    if (!node) return
    const delta = node.clientWidth * 0.8
    node.scrollBy({ left: dir === "left" ? -delta : delta, behavior: "smooth" })
  }

  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-14">
          <span className="inline-block text-xs tracking-[0.3em] uppercase text-accent mb-3">
            People behind Flexicore
          </span>
          <h2 className="text-balance text-3xl md:text-5xl font-light text-primary mb-4">
            Craft led by passion.
          </h2>
        </div>

        <div className="grid lg:grid-cols-12 gap-10 items-stretch">
          {/* Founder highlight */}
          <div className="lg:col-span-5 min-w-0">
            <article className="relative h-full flex flex-col bg-muted overflow-hidden group">
              <div className="relative aspect-video md:aspect-[4/5] overflow-hidden">
                <div
                  className="absolute inset-0 bg-cover bg-top transition-transform duration-[900ms] ease-out group-hover:scale-105"
                  style={{ backgroundImage: "url(/founder.png), url(/placeholder-user.jpg)" }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 via-foreground/10 to-transparent" />
                <div className="absolute top-5 left-5 text-white">
                  <span className="text-[10px] tracking-[0.3em] uppercase bg-primary px-2.5 py-1">
                    Founder
                  </span>
                </div>
              </div>

              <div className="p-7 md:p-9 flex flex-col gap-5">
                <Quote className="h-8 w-8 text-accent" aria-hidden="true" />
                <p className="text-lg leading-relaxed text-foreground/85 font-light">
                  {"\"Every slab leaves our factory with one promise: it should outlive the trend that inspired it. That is what solid surface means to us.\""}
                </p>
                <div className="flex items-end justify-between gap-4 pt-2">
                  <div>
                    <p className="text-xl text-primary font-medium">JENIL ROJIWADIA</p>
                    <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground mt-1">
                      Founder and CEO
                    </p>
                  </div>
                  <Link
                    href="/founder"
                    className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-primary hover:text-accent transition-colors"
                  >
                    Read story
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            </article>
          </div>

          {/* Team strip */}
          <div className="lg:col-span-7 flex flex-col min-w-0">
            <div className="flex items-end justify-between mb-6">
              <div>
                <h3 className="text-2xl md:text-3xl font-light text-primary">Our team</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Architects, engineers, artisans - one workshop across 40+ countries.
                </p>
              </div>
              <div className="hidden md:flex items-center gap-2">
                <button
                  onClick={() => scroll("left")}
                  aria-label="Previous team members"
                  className="h-10 w-10 flex items-center justify-center border border-border hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors duration-250"
                >
                  <ArrowLeft className="h-4 w-4" />
                </button>
                <button
                  onClick={() => scroll("right")}
                  aria-label="Next team members"
                  className="h-10 w-10 flex items-center justify-center border border-border hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors duration-250"
                >
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div
              ref={stripRef}
              className="flex gap-5 overflow-x-auto snap-x snap-mandatory pb-4 flex-1"
              style={{ scrollbarWidth: "none" }}
            >
              {team.map((m) => (
                <article
                  key={m.name}
                  className="snap-start shrink-0 w-[160px] sm:w-[200px] md:w-[260px] group transition-transform duration-250 hover:-translate-y-1.5"
                >
                  <div className="relative aspect-[3/4] overflow-hidden bg-muted mb-4">
                    <div
                      className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105 grayscale group-hover:grayscale-0"
                      style={{ backgroundImage: `url(${m.image})` }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <a
                      href="#"
                      aria-label={`${m.name} on LinkedIn`}
                      className="absolute top-3 right-3 h-9 w-9 bg-white/90 text-primary flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    >
                      <Linkedin className="h-4 w-4" />
                    </a>
                  </div>
                  <p className="text-base text-foreground font-medium">{m.name}</p>
                  <p className="text-xs uppercase tracking-wider text-muted-foreground mt-1">
                    {m.role}
                  </p>
                </article>
              ))}
            </div>

            <Link
              href="/team"
              className="group mt-2 inline-flex items-center gap-3 text-primary hover:text-accent transition-colors"
            >
              <span className="text-xs uppercase tracking-[0.3em]">Meet the full team</span>
              <span className="h-px w-10 bg-accent transition-all duration-300 group-hover:w-16" />
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
