import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-4 sm:px-6">
          <div className="flex items-center justify-between">
            <span className="text-xl font-bold text-emerald-600">Junk Quote</span>
            <nav className="flex gap-4">
              <Link
                href="/request"
                className="rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
              >
                Get Quote
              </Link>
              <Link
                href="#how-it-works"
                className="rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
              >
                How it works
              </Link>
              <Link
                href="#faq"
                className="rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
              >
                FAQ
              </Link>
              <Link
                href="#contact"
                className="rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
              >
                Contact
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-gradient-to-b from-emerald-50 to-white px-4 py-16 sm:py-24">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
            Get a quick quote for your junk removal
          </h1>
          <p className="mt-4 text-lg text-slate-600">
            Snap a photo, tell us what you have and where, and we&apos;ll reply with a quote soon. No account needed.
          </p>
          <div className="mt-8">
            <Link
              href="/request"
              className="inline-flex items-center justify-center rounded-lg bg-emerald-600 px-8 py-3.5 text-base font-semibold text-white shadow-sm hover:bg-emerald-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600"
            >
              Upload Your Junk
            </Link>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="px-4 py-16">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-center text-2xl font-bold text-slate-900">How it works</h2>
          <div className="mt-12 grid gap-8 sm:grid-cols-3">
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 font-semibold">1</span>
              <h3 className="mt-4 font-semibold text-slate-900">Upload photo & details</h3>
              <p className="mt-2 text-slate-600">
                Describe your items, add a photo, and share pickup location and contact info.
              </p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 font-semibold">2</span>
              <h3 className="mt-4 font-semibold text-slate-900">We review your request</h3>
              <p className="mt-2 text-slate-600">
                We look at your submission and prepare a quote for pickup or removal.
              </p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 font-semibold">3</span>
              <h3 className="mt-4 font-semibold text-slate-900">Get your quote</h3>
              <p className="mt-2 text-slate-600">
                We reply via your contact details with a quote. Schedule when ready.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="border-t border-slate-200 bg-slate-50 px-4 py-16">
        <div className="mx-auto max-w-2xl">
          <h2 className="text-center text-2xl font-bold text-slate-900">FAQ</h2>
          <dl className="mt-8 space-y-6">
            <div>
              <dt className="font-semibold text-slate-900">Do I need to create an account?</dt>
              <dd className="mt-1 text-slate-600">No. Just fill the form and upload a photo. We&apos;ll contact you directly.</dd>
            </div>
            <div>
              <dt className="font-semibold text-slate-900">What types of items do you handle?</dt>
              <dd className="mt-1 text-slate-600">We handle furniture, appliances, electronics, and general junk. Send a photo and we&apos;ll tell you if we can help.</dd>
            </div>
            <div>
              <dt className="font-semibold text-slate-900">How long until I get a quote?</dt>
              <dd className="mt-1 text-slate-600">Usually within 24–48 hours. We&apos;ll reach you using the contact details you provide.</dd>
            </div>
          </dl>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="border-t border-slate-200 px-4 py-16">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-2xl font-bold text-slate-900">Contact</h2>
          <p className="mt-4 text-slate-600">
            Have questions? Use the form to submit your junk for a quote, or reach out directly if you prefer.
          </p>
          <div className="mt-6">
            <Link
              href="/request"
              className="inline-flex items-center justify-center rounded-lg bg-emerald-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-emerald-500"
            >
              Submit a request
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white px-4 py-8">
        <div className="mx-auto max-w-6xl flex flex-col items-center justify-between gap-4 sm:flex-row">
          <span className="text-sm text-slate-500">© Junk Quote. All rights reserved.</span>
          <Link href="/admin/login" className="text-sm text-slate-500 hover:text-slate-700">
            Admin
          </Link>
        </div>
      </footer>
    </div>
  );
}
