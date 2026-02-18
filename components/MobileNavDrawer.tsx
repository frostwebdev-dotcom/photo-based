"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";

export function MobileNavDrawer() {
  const [open, setOpen] = useState(false);
  const [closing, setClosing] = useState(false);

  const close = useCallback(() => {
    setClosing(true);
    const t = setTimeout(() => {
      setOpen(false);
      setClosing(false);
    }, 300);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", onEscape);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", onEscape);
    };
  }, [open, close]);

  return (
    <>
      {/* Hamburger - mobile only */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg text-slate-600 hover:bg-slate-100 active:bg-slate-200 sm:hidden"
        aria-label="Open menu"
        aria-expanded={open}
      >
        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Backdrop + Drawer - only when open or closing */}
      {(open || closing) && (
        <>
          <div
            role="presentation"
            className="fixed inset-0 z-40 bg-black/50 transition-opacity duration-300 ease-out sm:hidden"
            style={{ opacity: open && !closing ? 1 : 0 }}
            onClick={close}
            onKeyDown={(e) => e.key === "Enter" && close()}
            aria-hidden
          />
          <div
            role="dialog"
            aria-modal
            aria-label="Menu"
            className="fixed inset-y-0 left-0 z-50 w-72 max-w-[85vw] bg-white shadow-xl transition-transform duration-300 ease-out sm:hidden"
            style={{ transform: open && !closing ? "translateX(0)" : "translateX(-100%)" }}
          >
            <div className="flex h-full flex-col">
              <div className="flex items-center justify-between border-b border-slate-200 px-4 py-4">
                <span className="text-lg font-bold text-emerald-600">Menu</span>
                <button
                  type="button"
                  onClick={close}
                  className="flex h-10 w-10 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-700"
                  aria-label="Close menu"
                >
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <nav className="flex flex-1 flex-col gap-1 overflow-y-auto p-4">
                <Link
                  href="/request"
                  onClick={close}
                  className="rounded-lg px-4 py-3 text-base font-medium text-slate-700 hover:bg-slate-100"
                >
                  Get Quote
                </Link>
                <Link
                  href="#how-it-works"
                  onClick={close}
                  className="rounded-lg px-4 py-3 text-base font-medium text-slate-700 hover:bg-slate-100"
                >
                  How it works
                </Link>
                <Link
                  href="#faq"
                  onClick={close}
                  className="rounded-lg px-4 py-3 text-base font-medium text-slate-700 hover:bg-slate-100"
                >
                  FAQ
                </Link>
                <Link
                  href="#contact"
                  onClick={close}
                  className="rounded-lg px-4 py-3 text-base font-medium text-slate-700 hover:bg-slate-100"
                >
                  Contact
                </Link>
                <div className="my-2 border-t border-slate-200" />
                <a
                  href="tel:+17208102002"
                  onClick={close}
                  className="rounded-lg px-4 py-3 text-base font-medium text-emerald-600 hover:bg-emerald-50"
                >
                  Call for a quote: (720) 810-2002
                </a>
                <a
                  href="mailto:Postyourjunk335@gmail.com"
                  onClick={close}
                  className="rounded-lg px-4 py-3 text-base font-medium text-slate-700 hover:bg-slate-100 break-words"
                >
                  Email: Postyourjunk335@gmail.com
                </a>
              </nav>
            </div>
          </div>
        </>
      )}
    </>
  );
}
