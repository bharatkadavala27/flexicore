import { notFound } from "next/navigation"
import Link from "next/link"
import type { Metadata } from "next"
import { Check, Download, Share2, ArrowRight } from "lucide-react"
import { SiteLayout } from "@/components/site-layout"
import { ProductEnquiryForm } from "@/components/product-enquiry-form"
import { ProductGalleryTabs } from "@/components/product-gallery-tabs"
import { ProductFaq } from "@/components/product-faq"
import { ProductWhatsAppButton } from "@/components/product-whatsapp-button"
import {
  JsonLd,
  productSchema,
  breadcrumbSchema,
  faqSchema,
} from "@/components/json-ld"
import { getProduct, getRelatedProducts, products, type Product } from "@/lib/products-data"
import { API_BASE, API_BASE_URL } from "@/lib/admin-auth"
import { fetchFromApi } from "@/lib/api-utils"

type PageProps = { params: Promise<{ slug: string }> }

const SITE_URL = "https://flexicore-eta.vercel.app"

export async function generateStaticParams() {
  try {
    const productsFromApi = await fetchFromApi("/products");
    return productsFromApi.map((p: any) => ({ slug: p.slug }));
  } catch (error) {
    console.error("Failed to fetch products for static params:", error);
    return products.map((p) => ({ slug: p.slug }));
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  let p: Product | null = null;
  try {
    p = await fetchFromApi(`/products/slug/${slug}`);
  } catch {
    p = getProduct(slug);
  }
  
  if (!p) return { title: "Product not found" }
  return {
    title: `${p.name} - ${(p.category as any)?.name || p.category}`,
    description: p.description,
    openGraph: { images: [(p.images as any)?.[0]?.url || (p as any).image] },
  }
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { slug } = await params
  let product: Product | any = null;
  try {
    product = await fetchFromApi(`/products/slug/${slug}`);
    if (!product || product.message) throw new Error("Product not found");
  } catch {
    product = getProduct(slug);
  }
  
  if (!product) notFound()

  const related = getRelatedProducts(product.slug, (product.category as any)?.slug || product.category)
  const productUrl = `${SITE_URL}/products/${product.slug}`

  const schemas: Record<string, unknown>[] = [
      productSchema({
        name: product.name,
        description: product.description,
        image: product.images?.[0]?.url || product.image,
        sku: product.sku,
        category: (product.category as any)?.name || product.category,
      }),
    breadcrumbSchema([
      { name: "Home", url: `${SITE_URL}/` },
      { name: "Products", url: `${SITE_URL}/products` },
      { name: product.name, url: productUrl },
    ]),
  ]
  if (product.faqs?.length) schemas.push(faqSchema(product.faqs))

  return (
    <SiteLayout>
      <JsonLd data={schemas} />

      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="border-b border-border bg-white">
        <div className="mx-auto max-w-7xl px-4 md:px-8 py-3 text-xs text-muted-foreground flex items-center gap-2">
          <Link href="/" className="hover:text-primary">
            Home
          </Link>
          <span>/</span>
          <Link href="/products" className="hover:text-primary">
            Products
          </Link>
          <span>/</span>
          <span className="capitalize">{(product.category as any)?.name || product.category}</span>
          <span>/</span>
          <span className="text-foreground">{product.name}</span>
        </div>
      </nav>

      {/* Top section */}
      <section className="py-8 md:py-12 px-4 md:px-8">
        <div className="mx-auto max-w-7xl grid lg:grid-cols-2 gap-8 md:gap-12">
          {/* Gallery tabs (Image zoom + 3D + Video) */}
          <ProductGalleryTabs product={product} />

          {/* Info */}
          <div className="flex flex-col">
            <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-muted-foreground">
              <span className="capitalize">{(product.category as any)?.name || product.category}</span>
              {product.isNew && (
                <span className="bg-primary text-primary-foreground px-2 py-0.5 font-semibold">
                  New
                </span>
              )}
            </div>
            <h1 className="mt-2 text-3xl md:text-5xl font-light text-foreground">
              {product.name}
            </h1>
            <p className="mt-4 text-sm text-muted-foreground uppercase tracking-wide">
              SKU · {product.sku}
            </p>

            <p className="mt-6 text-base text-foreground/80 leading-relaxed">
              {product.longDescription}
            </p>

            {/* Specs */}
            <dl className="mt-6 grid grid-cols-2 gap-4 border-y border-border py-5">
              <div>
                <dt className="text-[10px] uppercase tracking-wider text-muted-foreground">
                  Thickness
                </dt>
                <dd className="mt-1 text-sm font-medium">{product.thickness}</dd>
              </div>
              <div>
                <dt className="text-[10px] uppercase tracking-wider text-muted-foreground">
                  Dimensions
                </dt>
                <dd className="mt-1 text-sm font-medium">{product.dimensions}</dd>
              </div>
              <div>
                <dt className="text-[10px] uppercase tracking-wider text-muted-foreground">
                  Hue
                </dt>
                <dd className="mt-1 text-sm font-medium">{product.hue}</dd>
              </div>
              <div>
                <dt className="text-[10px] uppercase tracking-wider text-muted-foreground">
                  Region
                </dt>
                <dd className="mt-1 text-sm font-medium">{product.region}</dd>
              </div>
            </dl>

            {/* Industries */}
            {product.industries?.length > 0 && (
              <div className="mt-6">
                <h3 className="text-xs uppercase tracking-wider text-muted-foreground">
                  Industries
                </h3>
                <div className="mt-3 flex flex-wrap gap-2">
                  {product.industries.map((ind: string) => (
                    <span
                      key={ind}
                      className="inline-flex items-center bg-secondary text-foreground text-xs px-3 py-1 capitalize"
                    >
                      {ind}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Features */}
            <div className="mt-6">
              <h3 className="text-xs uppercase tracking-wider text-muted-foreground">
                Features
              </h3>
              <ul className="mt-3 grid grid-cols-2 gap-2">
                {product.features.map((f: string) => (
                  <li key={f} className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 text-primary shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>

            {/* Applications */}
            <div className="mt-6">
              <h3 className="text-xs uppercase tracking-wider text-muted-foreground">
                Applications
              </h3>
              <div className="mt-3 flex flex-wrap gap-2">
                {product.applications.map((a: string) => (
                  <span
                    key={a}
                    className="inline-flex items-center bg-secondary text-foreground text-xs px-3 py-1"
                  >
                    {a}
                  </span>
                ))}
              </div>
            </div>

            {/* CTA */}
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="#enquire"
                className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 text-sm font-semibold uppercase tracking-wide hover:bg-accent transition-colors duration-250"
              >
                Enquire Now <ArrowRight className="h-4 w-4" />
              </a>

              <ProductWhatsAppButton
                productName={product.name}
                sku={product.sku}
                url={productUrl}
              />

              {product.specSheetUrl && (
                <a
                  href={product.specSheetUrl}
                  download
                  className="inline-flex items-center gap-2 border border-border bg-white px-6 py-3 text-sm font-semibold uppercase tracking-wide hover:border-primary hover:text-primary transition-colors duration-250"
                >
                  <Download className="h-4 w-4" /> Spec Sheet
                </a>
              )}

              <ShareButton
                productName={product.name}
                productUrl={productUrl}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Enquiry */}
      <section id="enquire" className="py-12 md:py-16 px-4 md:px-8 bg-secondary">
        <div className="mx-auto max-w-3xl">
          <ProductEnquiryForm productName={product.name} />
        </div>
      </section>

      {/* FAQ */}
      {product.faqs && product.faqs.length > 0 && (
        <ProductFaq items={product.faqs} />
      )}

      {/* Related */}
      {related.length > 0 && (
        <section className="py-12 md:py-16 px-4 md:px-8">
          <div className="mx-auto max-w-7xl">
            <h2 className="text-2xl md:text-3xl font-light text-foreground">
              You may also like
            </h2>
            <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-0.5">
              {related.map((r) => (
                <Link
                  key={r.slug}
                  href={`/products/${r.slug}`}
                  className="relative aspect-square group overflow-hidden bg-secondary transition-transform duration-250 hover:-translate-y-1.5"
                >
                  <img
                    src={r.images?.[0]?.url || r.image || "/placeholder.svg"}
                    alt={r.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-foreground/80 to-transparent p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <h3 className="text-white font-semibold text-sm">{r.name}</h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </SiteLayout>
  )
}

function ShareButton({
  productName,
  productUrl,
}: {
  productName: string
  productUrl: string
}) {
  const subject = `Flexicore | ${productName}`
  const body = `Have a look at ${productName} from Flexicore:\n\n${productUrl}`
  return (
    <a
      href={`mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`}
      className="inline-flex items-center gap-2 border border-border bg-white px-6 py-3 text-sm font-semibold uppercase tracking-wide hover:border-primary hover:text-primary transition-colors duration-250"
    >
      <Share2 className="h-4 w-4" /> Share
    </a>
  )
}
