"use client"

import Link from "next/link"
import { useMemo, useState, useEffect } from "react"
import { Calendar, Clock, User } from "lucide-react"
import { SiteLayout, PageHeader } from "@/components/site-layout"
import { blogCategories as staticBlogCategories } from "@/lib/blog-data"
import { apiRequest } from "@/lib/admin-auth"

export default function BlogPage() {
  const [blogPosts, setBlogPosts] = useState<any[]>([])
  const [blogCategories, setBlogCategories] = useState<string[]>(staticBlogCategories)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    apiRequest('/blogs')
      .then(data => {
        setBlogPosts(data)
        const cats = Array.from(new Set(data.map((p: any) => p.category).filter(Boolean))) as string[]
        if (cats.length > 0) setBlogCategories(["All", ...cats])
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const [cat, setCat] = useState("All")

  const filtered = useMemo(() => {
    if (cat === "All") return blogPosts
    return blogPosts.filter((p) => p.category === cat)
  }, [cat])

  const featured = filtered[0]
  const rest = filtered.slice(1)

  return (
    <SiteLayout>
      <PageHeader
        title="The Flexicore Journal"
        breadcrumb={[{ label: "Home", href: "/" }, { label: "Blog" }]}
        bgImage="/design-magazine-flatlay.jpg"
      />

      <section className="py-10 md:py-14 px-4 md:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-wrap gap-2 justify-center">
            {blogCategories.map((c) => (
              <button
                key={c}
                onClick={() => setCat(c)}
                className={`px-4 py-2 text-sm transition-colors ${
                  cat === c
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-foreground hover:bg-muted"
                }`}
              >
                {c}
              </button>
            ))}
          </div>

          {featured && (
            <Link
              href={`/blog/${featured.slug}`}
              className="mt-10 grid md:grid-cols-2 gap-8 group"
            >
              <div className="aspect-[4/3] overflow-hidden bg-secondary">
                <img
                  src={featured.featuredImage?.url || featured.image || "/placeholder.svg"}
                  alt={featured.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <div className="flex flex-col justify-center">
                <span className="text-xs uppercase tracking-[0.2em] text-primary">{featured.category}</span>
                <h2 className="mt-3 text-2xl md:text-4xl font-light group-hover:text-primary transition-colors text-balance">
                  {featured.title}
                </h2>
                <p className="mt-3 text-muted-foreground">{featured.excerpt}</p>
                <div className="mt-4 flex items-center gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <User className="h-3 w-3" />
                    {featured.author}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {new Date(featured.date).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {featured.readTime}
                  </span>
                </div>
                <span className="mt-6 text-sm font-semibold text-primary group-hover:underline">Read article →</span>
              </div>
            </Link>
          )}

          {rest.length > 0 && (
            <div className="mt-14 grid md:grid-cols-3 gap-8">
              {rest.map((p) => (
                <Link key={p.slug} href={`/blog/${p.slug}`} className="group">
                  <div className="aspect-[4/3] overflow-hidden bg-secondary">
                    <img
                      src={p.featuredImage?.url || p.image || "/placeholder.svg"}
                      alt={p.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="mt-4">
                    <span className="text-[10px] uppercase tracking-[0.2em] text-primary">{p.category}</span>
                    <h3 className="mt-2 text-lg font-semibold group-hover:text-primary transition-colors">
                      {p.title}
                    </h3>
                    <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{p.excerpt}</p>
                    <div className="mt-3 flex items-center gap-3 text-xs text-muted-foreground">
                      <span>
                        {new Date(p.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                      </span>
                      <span>· {p.readTime}</span>
                    </div>
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
