import Link from "next/link";
import { MobileNavDrawer } from "@/components/MobileNavDrawer";

export default function HomePage() {
  return (
    <div className="min-h-screen overflow-x-hidden">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-4 sm:px-6">
          <div className="flex items-center justify-between">
            <span className="text-xl font-bold text-emerald-600">Junk Quote</span>
            {/* Mobile: hamburger + drawer */}
            <MobileNavDrawer />
            {/* Desktop: full nav */}
            <nav className="hidden flex-wrap items-center justify-end gap-2 sm:flex sm:gap-4">
              <a
                href="tel:+17208102002"
                className="min-h-[44px] min-w-[44px] rounded-lg px-3 py-2 text-sm font-medium text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700 active:bg-emerald-100"
                aria-label="Call for a quote (720) 810-2002"
              >
                <span className="hidden sm:inline">Call for a quote: </span>(720) 810-2002
              </a>
              <a
                href="mailto:Postyourjunk335@gmail.com"
                className="min-h-[44px] flex min-w-[44px] items-center rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 hover:text-slate-900 active:bg-slate-200"
                aria-label="Email Postyourjunk335@gmail.com"
              >
                <span className="md:hidden">Email</span>
                <span className="hidden md:inline">Email: Postyourjunk335@gmail.com</span>
              </a>
              <Link
                href="/request"
                className="min-h-[44px] flex min-w-[44px] items-center rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 active:bg-slate-200"
              >
                Get Quote
              </Link>
              <Link
                href="#how-it-works"
                className="min-h-[44px] flex min-w-[44px] items-center rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 active:bg-slate-200"
              >
                How it works
              </Link>
              <Link
                href="#faq"
                className="min-h-[44px] flex min-w-[44px] items-center rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 active:bg-slate-200"
              >
                FAQ
              </Link>
              <Link
                href="#contact"
                className="min-h-[44px] flex min-w-[44px] items-center rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 active:bg-slate-200"
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
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl md:text-5xl">
            Get a quick quote for your junk removal
          </h1>
          <p className="mt-4 text-lg text-slate-600">
            Snap a photo, tell us what you have and where, and we&apos;ll reply with a quote soon. No account needed.
          </p>
          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link
              href="/request"
              className="inline-flex min-h-[48px] w-full min-w-0 max-w-sm shrink-0 items-center justify-center rounded-lg bg-emerald-600 px-8 py-3.5 text-base font-semibold text-white shadow-sm hover:bg-emerald-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600 active:bg-emerald-700 sm:w-auto"
            >
              Upload Your Junk
            </Link>
            <a
              href="tel:+17208102002"
              className="inline-flex min-h-[48px] w-full min-w-0 max-w-sm shrink-0 items-center justify-center rounded-lg border-2 border-emerald-600 bg-white px-8 py-3.5 text-base font-semibold text-emerald-600 hover:bg-emerald-50 active:bg-emerald-100 sm:w-auto"
            >
              Call (720) 810-2002
            </a>
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
          <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">Contact</h2>
          <p className="mt-4 break-words text-slate-600">
            Have questions? Use the form to submit your junk for a quote, or reach out by phone or email.
          </p>
          <p className="mt-3 break-words text-slate-600">
            <a
              href="mailto:Postyourjunk335@gmail.com"
              className="font-medium text-emerald-600 underline decoration-emerald-600/30 underline-offset-2 hover:text-emerald-700 hover:decoration-emerald-600"
            >
              Postyourjunk335@gmail.com
            </a>
          </p>
          <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <a
              href="tel:+17208102002"
              className="inline-flex min-h-[48px] w-full min-w-0 max-w-sm shrink-0 items-center justify-center rounded-lg bg-emerald-600 px-5 py-3 text-center text-base font-semibold text-white shadow-sm hover:bg-emerald-500 active:bg-emerald-700 sm:max-w-none sm:px-6"
            >
              <span className="hidden sm:inline">Call for a quote: </span>(720) 810-2002
            </a>
            <Link
              href="/request"
              className="inline-flex min-h-[48px] w-full min-w-0 max-w-sm shrink-0 items-center justify-center rounded-lg border-2 border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 active:bg-slate-100 sm:max-w-none"
            >
              Submit a request
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white px-4 py-8 pb-[max(2rem,env(safe-area-inset-bottom))]">
        <div className="mx-auto max-w-6xl flex flex-col items-center gap-4 text-center sm:flex-row sm:justify-between sm:text-left">
          <span className="text-sm text-slate-500">© Junk Quote. All rights reserved.</span>
          <div className="flex flex-col items-center gap-1 sm:flex-row sm:items-center sm:gap-4">
            <a
              href="mailto:Postyourjunk335@gmail.com"
              className="break-words text-center text-sm text-slate-500 hover:text-emerald-600 hover:underline sm:text-left"
            >
              Postyourjunk335@gmail.com
            </a>
            <Link href="/admin/login" className="text-sm text-slate-500 hover:text-slate-700">
              Admin
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
