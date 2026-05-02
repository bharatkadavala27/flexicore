import type { Metadata } from "next"
import { SiteLayout, PageHeader } from "@/components/site-layout"
import { ContactForm } from "@/components/contact-form"
import { ReviewsWidget } from "@/components/reviews-widget"
import { MapPin, Phone, Mail, Clock } from "lucide-react"

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Get in touch with Flexicore — sales, technical support, distributor enquiries, and media.",
}

const offices = [
  {
    city: "Mumbai HQ",
    address: "101, Design District, Andheri West, Mumbai 400058, India",
    phone: "+91 22 4000 0000",
    email: "contact@flexicore.com",
  },
  {
    city: "Dubai",
    address: "Office 705, Business Bay, Dubai, UAE",
    phone: "+971 4 000 0000",
    email: "uae@flexicore.com",
  },
  {
    city: "London",
    address: "14 Clerkenwell Green, London EC1R 0DP, UK",
    phone: "+44 20 0000 0000",
    email: "uk@flexicore.com",
  },
]

export default function ContactPage() {
  return (
    <SiteLayout>
      <PageHeader
        title="Let's build something together."
        breadcrumb={[{ label: "Home", href: "/" }, { label: "Contact" }]}
        bgImage="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1600&q=80"
      />

      <section className="py-16 md:py-24 px-4 md:px-8">
        <div className="mx-auto max-w-7xl grid lg:grid-cols-[1fr_1.2fr] gap-10 md:gap-16">
          {/* Info */}
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-primary">Contact</p>
            <h2 className="mt-3 text-3xl md:text-4xl font-light text-balance">
              Talk to our team.
            </h2>
            <div className="mt-4 h-0.5 w-12 bg-primary" />
            <p className="mt-6 text-foreground/80 leading-relaxed">
              Whether you&apos;re an architect specifying a project, a fabricator requesting samples, or a
              distributor exploring partnership, we&apos;re here to help.
            </p>

            <div className="mt-8 flex items-start gap-3 text-sm">
              <Clock className="h-5 w-5 text-primary shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">Opening Hours</p>
                <p className="text-muted-foreground">Mon–Fri · 9:00 – 18:00 local time</p>
                <p className="text-muted-foreground">Sat · 10:00 – 14:00</p>
              </div>
            </div>

            <div className="mt-10 space-y-6">
              {offices.map((o) => (
                <div key={o.city} className="border-l-2 border-primary pl-4">
                  <h3 className="font-semibold">{o.city}</h3>
                  <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <MapPin className="h-4 w-4 mt-0.5 shrink-0" />
                      {o.address}
                    </li>
                    <li className="flex items-center gap-2">
                      <Phone className="h-4 w-4 shrink-0" />
                      <a href={`tel:${o.phone.replace(/\s/g, "")}`} className="hover:text-primary">
                        {o.phone}
                      </a>
                    </li>
                    <li className="flex items-center gap-2">
                      <Mail className="h-4 w-4 shrink-0" />
                      <a href={`mailto:${o.email}`} className="hover:text-primary">
                        {o.email}
                      </a>
                    </li>
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Form */}
          <div>
            <ContactForm />
          </div>
        </div>
      </section>

      <ReviewsWidget />
    </SiteLayout>
  )
}
