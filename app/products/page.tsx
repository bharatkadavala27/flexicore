"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import {
  Search,
  Leaf,
  ChevronDown,
  Filter as FilterIcon,
  Globe,
  Droplet,
  Building2,
  Play,
} from "lucide-react"
import { SiteLayout, PageHeader } from "@/components/site-layout"
import {
  ProductCategory,
  Industry,
  industries,
  categories as staticCategories,
} from "@/lib/products-data"
import { apiRequest } from "@/lib/admin-auth"

const hues = ["All", "White", "Beige", "Black", "Burgundy", "Copper", "Cream", "Charcoal"]
const regions = ["All", "Global", "Europe", "Middle East", "Asia"]

export default function ProductsPage() {
  const [products, setProducts] = useState<any[]>([])
  const [categories, setCategories] = useState<any[]>(staticCategories)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      apiRequest('/products'),
      apiRequest('/categories')
    ]).then(([p, c]) => {
      setProducts(p)
      if (c && c.length > 0) {
        setCategories([{ id: "all", label: "All" }, ...c.map((cat: any) => ({ id: cat.slug, label: cat.name, _id: cat._id }))])
      }
    }).finally(() => setLoading(false))
  }, [])

  const [query, setQuery] = useState("")
  const [cat, setCat] = useState<ProductCategory | "all">("all")
  const [industry, setIndustry] = useState<Industry | "all">("all")
  const [hue, setHue] = useState("All")
  const [region, setRegion] = useState("All")
  const [industryOpen, setIndustryOpen] = useState(false)
  const [hueOpen, setHueOpen] = useState(false)
  const [regionOpen, setRegionOpen] = useState(false)

  const filtered = useMemo(() => {
    return products.filter((p) => {
      // Handle both object and string categories from backend/static
      const productCatSlug = typeof p.category === 'object' ? p.category.slug : p.category;
      
      if (cat !== "all" && productCatSlug !== cat) return false
      
      // Handle industries (backend might return objects or strings)
      const productIndustries = p.industries?.map((i: any) => typeof i === 'object' ? i.slug || i.name : i) || [];
      if (industry !== "all" && !productIndustries.includes(industry)) return false
      
      if (hue !== "All" && p.hue !== hue) return false
      if (region !== "All" && p.region !== region) return false
      if (query && !p.name.toLowerCase().includes(query.toLowerCase())) return false
      return true
    })
  }, [products, query, cat, industry, hue, region])

  const activeIndustryLabel = industries.find((i) => i.id === industry)?.label

  return (
    <SiteLayout>
      <PageHeader
        title="Flexicore Solid Surface Collection"
        breadcrumb={[
          { label: "Home", href: "/" },
          { label: "Products" },
        ]}
        bgImage="/kitchen-with-marble-island.jpg"
      />

      {/* Intro */}
      <section className="py-12 md:py-16 px-4 md:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-2xl md:text-4xl font-light text-foreground text-balance">
            The colors of Flexicore<sup className="text-primary">®</sup> Solid
            Surface, without compromise.
          </h2>
          <p className="mt-4 text-sm md:text-base text-muted-foreground leading-relaxed max-w-2xl mx-auto">
            Engrave it. Color it. Thermoform it. Flexicore Solid Surface can be
            whatever you imagine - organic shapes, bold effects of color and
            translucency.
          </p>
        </div>
      </section>

      {/* Filter bar */}
      <section className="px-4 md:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between">
            <div className="relative flex-1 lg:max-w-md">
              <div className="flex items-center gap-2 border border-border bg-white px-4 py-3">
                <Search className="h-4 w-4 text-muted-foreground" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Enter color name here"
                  className="flex-1 bg-transparent outline-none text-sm"
                />
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 md:gap-6">
              {/* Industry */}
              <div className="relative">
                <button
                  onClick={() => {
                    setIndustryOpen(!industryOpen)
                    setHueOpen(false)
                    setRegionOpen(false)
                  }}
                  className="flex items-center gap-2 text-sm font-medium text-foreground hover:text-primary"
                >
                  <span
                    className={`h-9 w-9 rounded-full border flex items-center justify-center transition-colors duration-250 ${
                      industry !== "all"
                        ? "bg-primary text-primary-foreground border-primary"
                        : "border-border"
                    }`}
                  >
                    <Building2 className="h-4 w-4" />
                  </span>
                  {industry === "all" ? "Industry" : activeIndustryLabel}
                </button>
                {industryOpen && (
                  <div className="absolute right-0 top-full mt-2 z-30 bg-white border border-border shadow-lg min-w-[200px]">
                    {industries.map((i) => (
                      <button
                        key={i.id}
                        onClick={() => {
                          setIndustry(i.id as Industry | "all")
                          setIndustryOpen(false)
                        }}
                        className={`block w-full text-left px-4 py-2 text-sm hover:bg-muted transition-colors ${
                          industry === i.id ? "text-primary font-semibold" : ""
                        }`}
                      >
                        {i.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Region */}
              <div className="relative">
                <button
                  onClick={() => {
                    setRegionOpen(!regionOpen)
                    setIndustryOpen(false)
                    setHueOpen(false)
                  }}
                  className="flex items-center gap-2 text-sm font-medium text-foreground hover:text-primary"
                >
                  <span
                    className={`h-9 w-9 rounded-full border flex items-center justify-center transition-colors duration-250 ${
                      region !== "All"
                        ? "bg-primary text-primary-foreground border-primary"
                        : "border-border"
                    }`}
                  >
                    <Globe className="h-4 w-4" />
                  </span>
                  {region === "All" ? "Region" : region}
                </button>
                {regionOpen && (
                  <div className="absolute right-0 top-full mt-2 z-30 bg-white border border-border shadow-lg min-w-[180px]">
                    {regions.map((r) => (
                      <button
                        key={r}
                        onClick={() => {
                          setRegion(r)
                          setRegionOpen(false)
                        }}
                        className={`block w-full text-left px-4 py-2 text-sm hover:bg-muted transition-colors ${
                          region === r ? "text-primary font-semibold" : ""
                        }`}
                      >
                        {r}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Hue */}
              <div className="relative">
                <button
                  onClick={() => {
                    setHueOpen(!hueOpen)
                    setIndustryOpen(false)
                    setRegionOpen(false)
                  }}
                  className="flex items-center gap-2 text-sm font-medium text-foreground hover:text-primary"
                >
                  <span
                    className={`h-9 w-9 rounded-full border flex items-center justify-center transition-colors duration-250 ${
                      hue !== "All"
                        ? "bg-primary text-primary-foreground border-primary"
                        : "border-border"
                    }`}
                  >
                    <Droplet className="h-4 w-4" />
                  </span>
                  {hue === "All" ? "Hue" : hue}
                </button>
                {hueOpen && (
                  <div className="absolute right-0 top-full mt-2 z-30 bg-white border border-border shadow-lg min-w-[180px]">
                    {hues.map((h) => (
                      <button
                        key={h}
                        onClick={() => {
                          setHue(h)
                          setHueOpen(false)
                        }}
                        className={`block w-full text-left px-4 py-2 text-sm hover:bg-muted transition-colors ${
                          hue === h ? "text-primary font-semibold" : ""
                        }`}
                      >
                        {h}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <button
                onClick={() => {
                  setQuery("")
                  setCat("all")
                  setIndustry("all")
                  setHue("All")
                  setRegion("All")
                }}
                className="flex items-center gap-2 text-sm font-medium text-foreground hover:text-primary"
              >
                <span className="h-9 w-9 rounded-full border border-border flex items-center justify-center">
                  <FilterIcon className="h-4 w-4" />
                </span>
                Reset
              </button>
            </div>
          </div>

          {/* Category pills */}
          <div className="mt-6 flex flex-wrap gap-2">
            {categories.map((c) => (
              <button
                key={c.id}
                onClick={() => setCat(c.id as ProductCategory | "all")}
                className={`px-5 py-2 text-sm font-medium transition-colors duration-250 ${
                  cat === c.id
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-foreground hover:bg-muted"
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Grid */}
      <section className="py-8 md:py-12 px-4 md:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-6 flex items-center justify-between text-sm">
            <p className="text-muted-foreground">
              Showing <span className="font-semibold text-foreground">{filtered.length}</span>{" "}
              {filtered.length === 1 ? "product" : "products"}
            </p>
          </div>

          {filtered.length === 0 ? (
            <div className="py-20 text-center">
              <p className="text-muted-foreground">No products match your filters.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-0.5">
              {filtered.map((p) => (
                <Link
                  key={p.slug}
                  href={`/products/${p.slug}`}
                  className="relative aspect-square group overflow-hidden bg-secondary transition-transform duration-250 hover:-translate-y-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
                >
                  <img
                    src={p.images?.[0]?.url || p.image || "/placeholder.svg"}
                    alt={p.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  {p.isNew && (
                    <span className="absolute top-3 left-3 bg-primary text-primary-foreground text-[10px] font-bold uppercase px-2 py-1 tracking-wide">
                      New
                    </span>
                  )}
                  {p.isEco && (
                    <span className="absolute top-3 right-3 h-7 w-7 rounded-full bg-accent flex items-center justify-center">
                      <Leaf className="h-3.5 w-3.5 text-accent-foreground" />
                    </span>
                  )}
                  {p.videoUrl && (
                    <span className="absolute bottom-3 left-3 h-7 w-7 rounded-full bg-white/90 text-primary flex items-center justify-center opacity-90 group-hover:opacity-100 group-hover:scale-110 transition-all duration-250">
                      <Play className="h-3.5 w-3.5 translate-x-0.5" />
                    </span>
                  )}
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-foreground/80 via-foreground/30 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <h3 className="text-white font-semibold">{p.name}</h3>
                    <p className="text-white/70 text-xs capitalize">
                      {typeof p.category === 'object' ? p.category.name : p.category}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </SiteLayout>
  )
}
