"use client"

import { useState, useEffect } from "react"
import { Calendar, User, ArrowRight } from "lucide-react"
import { apiRequest } from "@/lib/admin-auth"

export function BlogPreview() {
  const [blogPosts, setBlogPosts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    apiRequest('/blogs')
      .then(data => setBlogPosts(data.slice(0, 3)))
      .catch(err => console.error('Error fetching blogs:', err))
      .finally(() => setLoading(false))
  }, [])

  return (
    <section className="py-20 px-6 lg:px-12 bg-background">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <span className="text-primary font-medium text-sm tracking-wider uppercase mb-4 block">
              Our Blog
            </span>
            <h2 className="text-3xl md:text-4xl font-light text-foreground text-balance">
              Latest News & Insights
            </h2>
          </div>
          <a
            href="/blog"
            className="inline-flex items-center gap-2 text-primary font-semibold mt-4 md:mt-0 hover:gap-4 transition-all"
          >
            View All Posts
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>

        {/* Blog Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map((post) => (
            <article key={post._id || post.slug} className="group">
              <a href={`/blog/${post.slug}`} className="block">
                {/* Image */}
                <div className="relative aspect-[16/10] overflow-hidden mb-4">
                  <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                    style={{ backgroundImage: `url(${post.featuredImage?.url || post.image || '/placeholder.svg'})` }}
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-primary text-primary-foreground text-xs font-semibold px-3 py-1">
                      {post.category}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div>
                  <h3 className="text-xl font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <User className="w-3 h-3" />
                      {post.author}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(post.publishDate || post.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                    </span>
                  </div>
                </div>
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
