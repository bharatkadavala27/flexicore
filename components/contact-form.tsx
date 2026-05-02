"use client"

import { useState } from "react"
import { CheckCircle2, Send } from "lucide-react"
import { apiRequest } from "@/lib/admin-auth"

const subjects = ["General enquiry", "Product information", "Distributor opportunity", "Media & press", "Careers", "Other"]

export function ContactForm() {
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    const formData = new FormData(e.target as HTMLFormElement);
    const data = Object.fromEntries(formData.entries());

    try {
      await apiRequest('/enquiries', {
        method: 'POST',
        body: JSON.stringify({
          ...data,
          name: `${data.firstName} ${data.lastName}`,
          type: 'contact'
        })
      });
      setSent(true)
    } catch (err) {
      console.error('Submission failed:', err);
      alert('Failed to send message. Please try again.');
    } finally {
      setLoading(false)
    }
  }

  if (sent) {
    return (
      <div className="border border-primary/30 bg-primary/5 p-8 flex items-start gap-4">
        <CheckCircle2 className="h-6 w-6 text-primary mt-0.5 shrink-0" />
        <div>
          <h3 className="text-lg font-semibold">Message received</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Thank you for reaching out. A member of our team will respond within one business day.
          </p>
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={submit} className="border border-border bg-white p-6 md:p-8 space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field label="First name" required>
          <input required name="firstName" type="text" className="w-full border border-border px-3 py-2.5 text-sm outline-none focus:border-primary" />
        </Field>
        <Field label="Last name" required>
          <input required name="lastName" type="text" className="w-full border border-border px-3 py-2.5 text-sm outline-none focus:border-primary" />
        </Field>
        <Field label="Email" required>
          <input required name="email" type="email" className="w-full border border-border px-3 py-2.5 text-sm outline-none focus:border-primary" />
        </Field>
        <Field label="Phone">
          <input name="phone" type="tel" className="w-full border border-border px-3 py-2.5 text-sm outline-none focus:border-primary" />
        </Field>
        <Field label="Company">
          <input name="company" type="text" className="w-full border border-border px-3 py-2.5 text-sm outline-none focus:border-primary" />
        </Field>
        <Field label="Country" required>
          <input required name="country" type="text" className="w-full border border-border px-3 py-2.5 text-sm outline-none focus:border-primary" />
        </Field>
      </div>

      <Field label="Subject" required>
        <select required name="subject" className="w-full border border-border px-3 py-2.5 text-sm bg-white outline-none focus:border-primary">
          <option value="">Choose a subject</option>
          {subjects.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </Field>

      <Field label="Message" required>
        <textarea required name="message" rows={5} className="w-full border border-border px-3 py-2.5 text-sm outline-none focus:border-primary resize-none" />
      </Field>

      <label className="flex items-start gap-2 text-xs text-muted-foreground">
        <input required type="checkbox" className="mt-0.5" />
        <span>I agree to the Flexicore privacy policy and consent to being contacted.</span>
      </label>

      <button
        type="submit"
        disabled={loading}
        className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 text-sm font-semibold uppercase tracking-wide hover:bg-primary/90 disabled:opacity-60 transition-colors"
      >
        {loading ? "Sending..." : "Send Message"}
        <Send className="h-4 w-4" />
      </button>
    </form>
  )
}

function Field({
  label,
  required,
  children,
}: {
  label: string
  required?: boolean
  children: React.ReactNode
}) {
  return (
    <label className="block">
      <span className="text-xs uppercase tracking-wide text-muted-foreground">
        {label} {required && <span className="text-primary">*</span>}
      </span>
      <div className="mt-1.5">{children}</div>
    </label>
  )
}
