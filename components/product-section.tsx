"use client"

import { useState, useEffect } from "react"
import { Search, ChevronDown, Globe, Droplet, SlidersHorizontal, Leaf } from "lucide-react"
import { cn } from "@/lib/utils"
import { apiRequest } from "@/lib/admin-auth"

const categories = ["All", "Alabaster", "Marble", "Mosaic", "Sparkle", "Translucent", "Plain Surface"]

export function ProductSection() {
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [isRegionOpen, setIsRegionOpen] = useState(false)
  const [isHueOpen, setIsHueOpen] = useState(false)
  const [isFilterOpen, setIsFilterOpen] = useState(false)

  useEffect(() => {
    apiRequest('/products')
      .then(data => setProducts(data))
      .catch(err => console.error('Error fetching products:', err))
      .finally(() => setLoading(false))
  }, [])

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase())
    const productCat = typeof product.category === 'object' ? product.category.name : product.category;
    const matchesCategory = selectedCategory === "All" || productCat === selectedCategory
    return matchesSearch && matchesCategory
  }).slice(0, 10) // Show top 10 on home

  return (
    <section className="py-20 px-6 lg:px-12 bg-background">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-light text-foreground mb-6 text-balance">
            Flexicore<sup className="text-lg">®</sup> Solid Surface Makes Creative Visions Real
          </h2>
          <div className="flex justify-center mb-6">
            <div className="w-12 h-1 bg-primary/40" />
          </div>
          <p className="text-lg text-primary font-medium mb-4">
            Engrave it. Color it. Thermoform it.
          </p>
          <p className="text-muted-foreground max-w-3xl mx-auto text-pretty">
            Flexicore<sup>®</sup> Solid Surface can be whatever you imagine it can be. Undulating, virtually seamless, organic shapes, 
            bold effects of color and translucency – if you can dream it, you can create it with Flexicore<sup>®</sup>.
          </p>
        </div>

        {/* Colors Headline */}
        <div className="text-center mb-12">
          <h3 className="text-2xl md:text-3xl text-muted-foreground font-light">
            The colors of Flexicore<sup>®</sup> Solid Surface, without compromise.
          </h3>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6 mb-12">
          {/* Search Input */}
          <div className="relative w-full lg:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Enter color name here"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-12 py-3 border border-border rounded-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-background"
            />
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          </div>

          {/* Filter Buttons */}
          <div className="flex items-center gap-6">
            <button
              onClick={() => setIsRegionOpen(!isRegionOpen)}
              className="flex items-center gap-2 text-foreground hover:text-primary transition-colors"
            >
              <Globe className="w-5 h-5" />
              <span className="font-medium">Region</span>
            </button>
            <button
              onClick={() => setIsHueOpen(!isHueOpen)}
              className="flex items-center gap-2 text-foreground hover:text-primary transition-colors"
            >
              <Droplet className="w-5 h-5" />
              <span className="font-medium">Hue</span>
            </button>
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="flex items-center gap-2 text-foreground hover:text-primary transition-colors"
            >
              <SlidersHorizontal className="w-5 h-5" />
              <span className="font-medium">Filter</span>
            </button>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-12">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={cn(
                "px-6 py-2 text-sm font-medium transition-colors rounded-sm",
                selectedCategory === category
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              )}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {filteredProducts.map((product) => (
            <a
              key={product.slug || product._id}
              href={`/products/${product.slug}`}
              className="group relative aspect-square overflow-hidden bg-muted transition-transform duration-250 hover:-translate-y-1.5"
            >
              {/* Product Image */}
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                style={{ backgroundImage: `url(${product.images?.[0]?.url || product.image || '/placeholder.svg'})` }}
              />

              {/* Badges */}
              <div className="absolute top-3 left-3 flex flex-col gap-2">
                {product.isNew && (
                  <span className="bg-primary text-primary-foreground text-xs font-semibold px-2 py-1">
                    New
                  </span>
                )}
              </div>

              {/* Eco Badge */}
              {product.isEco && (
                <div className="absolute top-3 right-3">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                    <Leaf className="w-4 h-4 text-white" />
                  </div>
                </div>
              )}

              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                <span className="text-white font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                  {product.name}
                </span>
              </div>
            </a>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-12">
          <a
            href="/products"
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-3 font-medium hover:bg-primary/90 transition-colors"
          >
            View All Colors
            <span>→</span>
          </a>
        </div>
      </div>
    </section>
  )
}
