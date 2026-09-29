"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import {
  Zap,
  Shield,
  Menu,
  X,
  Phone,
  Mail,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PrivacyPolicyPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [logoError, setLogoError] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50/60 text-slate-900 selection:bg-purple-500/20 selection:text-purple-900 font-sans">
      {/* Background Mesh */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[850px] h-[500px] bg-gradient-to-tr from-purple-200/40 via-indigo-100/50 to-blue-200/30 blur-[130px] rounded-full" />
      </div>

      {/* Header Navigation */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-white/80 border-b border-slate-200/80 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative h-11 w-11 rounded-xl overflow-hidden bg-gradient-to-tr from-purple-600 via-indigo-600 to-blue-600 flex items-center justify-center shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform duration-200 border border-slate-200/60">
              {!logoError ? (
                <Image
                  src="/adscalezen-logo.jpg"
                  alt="AdScale Zen Logo"
                  fill
                  className="object-cover"
                  onError={() => setLogoError(true)}
                  priority
                />
              ) : (
                <Zap className="h-6 w-6 text-white" />
              )}
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-slate-900 via-indigo-950 to-purple-900 bg-clip-text text-transparent">
                AdScale Zen
              </span>
              <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest -mt-1">
                Digital Growth Agency
              </span>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-slate-600">
            <Link href="/" className="hover:text-purple-600 transition-colors">
              Home
            </Link>
            <Link href="/#services" className="hover:text-purple-600 transition-colors">
              Services
            </Link>
            <Link href="/about" className="hover:text-purple-600 transition-colors">
              About Us
            </Link>
            <Link href="/subscription" className="hover:text-purple-600 transition-colors">
              Pricing
            </Link>
            <Link href="/#contact" className="hover:text-purple-600 transition-colors">
              Contact Us
            </Link>
          </nav>

          <div className="hidden sm:flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost" className="text-slate-700 hover:text-purple-700 hover:bg-purple-50 font-medium text-sm">
                Login
              </Button>
            </Link>
            <Link href="/signup">
              <Button variant="outline" className="border-slate-300 hover:border-purple-400 text-slate-800 hover:bg-slate-50 font-medium text-sm shadow-xs">
                Create Account
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button className="bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 hover:from-purple-700 text-white font-semibold text-sm shadow-md shadow-indigo-500/20 px-4">
                Access Dashboard
              </Button>
            </Link>
          </div>

          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="lg:hidden border-b border-slate-200 bg-white/95 backdrop-blur-md px-6 pt-4 pb-6 flex flex-col gap-3 shadow-lg">
            <Link href="/" onClick={() => setMobileMenuOpen(false)} className="text-slate-800 font-medium py-1.5 hover:text-purple-600">
              Home
            </Link>
            <Link href="/#services" onClick={() => setMobileMenuOpen(false)} className="text-slate-800 font-medium py-1.5 hover:text-purple-600">
              Services
            </Link>
            <Link href="/about" onClick={() => setMobileMenuOpen(false)} className="text-slate-800 font-medium py-1.5 hover:text-purple-600">
              About Us
            </Link>
            <Link href="/subscription" onClick={() => setMobileMenuOpen(false)} className="text-slate-800 font-medium py-1.5 hover:text-purple-600">
              Pricing
            </Link>
            <Link href="/#contact" onClick={() => setMobileMenuOpen(false)} className="text-slate-800 font-medium py-1.5 hover:text-purple-600">
              Contact Us
            </Link>
            <div className="flex flex-col gap-2 pt-4 border-t border-slate-200">
              <div className="grid grid-cols-2 gap-2">
                <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="outline" className="w-full text-sm">Login</Button>
                </Link>
                <Link href="/signup" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="outline" className="w-full text-sm">Create Account</Button>
                </Link>
              </div>
              <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)}>
                <Button className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold">
                  Access Dashboard
                </Button>
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Header Banner */}
      <section className="pt-16 pb-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-left">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-purple-200 bg-purple-50/80 text-purple-700 text-xs font-semibold mb-4 shadow-xs">
          <Shield className="h-3.5 w-3.5 text-purple-600" />
          <span>Legal &amp; Data Transparency</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
          Privacy Policy
        </h1>
        <p className="mt-4 text-base text-slate-600 max-w-3xl">
          Effective Date: Last updated October 2026. This Privacy Policy describes how AdScale Zen collects, handles, stores, and processes your information when using our website and services.
        </p>
      </section>

      {/* Policy Content Card */}
      <main className="pb-24 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        <div className="bg-white rounded-3xl border border-slate-200/90 p-8 sm:p-12 shadow-sm space-y-10 text-left text-slate-700 leading-relaxed text-sm sm:text-base">
          
          {/* Section 1 */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900">1. Introduction</h2>
            <p>
              Welcome to AdScale Zen (&ldquo;we,&rdquo; &ldquo;our,&rdquo; or &ldquo;us&rdquo;), operating via <strong>adscalezen.online</strong>. We provide performance digital marketing, workflow automation, customer relationship management (CRM) software, and WhatsApp Cloud API integration solutions.
            </p>
            <p>
              We are committed to maintaining the confidentiality, integrity, and security of information entrusted to us by our clients, users, and website visitors. This Privacy Policy details our operational data practices.
            </p>
          </section>

          {/* Section 2 */}
          <section className="space-y-4">
            <h2 className="text-xl font-bold text-slate-900">2. Information We Collect</h2>
            <p>To provide and operate our services effectively, we collect several categories of information:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Account Information:</strong> Name, business name, registered email address, encrypted login credentials, and user profile parameters when you register.
              </li>
              <li>
                <strong>Contact Information:</strong> Phone number, WhatsApp phone ID, billing address, and correspondence notes provided during consultations or support inquiries.
              </li>
              <li>
                <strong>Payment Information:</strong> Transaction identifiers, billing status, subscription plan details, and payment confirmation receipts. <em>Note: Sensitive credit/debit card numbers or UPI PINs are processed directly by certified third-party payment gateways (such as Razorpay) and are never stored on our servers.</em>
              </li>
              <li>
                <strong>Website Usage Information:</strong> Technical log data including browser type, operating system, IP address, referral URLs, access timestamps, and page interaction metrics.
              </li>
              <li>
                <strong>Cookies &amp; Local Storage:</strong> We use functional session cookies and local storage tokens to maintain user authentication states and preference configurations.
              </li>
            </ul>
          </section>

          {/* Section 3 */}
          <section className="space-y-4">
            <h2 className="text-xl font-bold text-slate-900">3. How We Use Information</h2>
            <p>Collected information is utilized strictly for legitimate business operations:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Service Delivery:</strong> Setting up and maintaining client tenant databases, configuring automation workflows, enabling shared team inboxes, and routing WhatsApp messages.</li>
              <li><strong>Customer Support:</strong> Diagnosing technical issues, responding to account inquiries, and providing operational assistance relevant to your active plan.</li>
              <li><strong>Operational Communication:</strong> Transmitting service alerts, system maintenance notices, subscription renewal receipts, and security verifications.</li>
            </ul>
          </section>

          {/* Section 4 */}
          <section className="space-y-4">
            <h2 className="text-xl font-bold text-slate-900">4. Third-Party Services &amp; Data Processing</h2>
            <p>
              In delivering advanced digital infrastructure, AdScale Zen integrates with external platforms. Customer and operational data may be transferred to or processed by these third-party providers when necessary for service execution:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Meta Platforms &amp; WhatsApp Cloud API:</strong> For phone number verification, embedded signup authentication, message dispatch, and webhook status callbacks.
              </li>
              <li>
                <strong>Payment Gateways (e.g., Razorpay):</strong> To securely facilitate subscription billing and verified invoicing.
              </li>
              <li>
                <strong>Cloud &amp; Hosting Infrastructure:</strong> Cloudflare and Supabase for edge delivery, database storage, and secure authentication execution.
              </li>
              <li>
                <strong>Analytics &amp; Logging:</strong> Aggregated diagnostic utilities used to preserve server stability and performance monitoring.
              </li>
            </ul>
            <p className="text-xs text-slate-500 bg-slate-50 p-3 rounded-xl border border-slate-200">
              AdScale Zen does not sell, rent, or trade your personal data to unrelated marketing brokers. However, we do not claim that data is never shared, as sharing with verified technology sub-processors is required to operate the service.
            </p>
          </section>

          {/* Section 5 */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900">5. Data Security</h2>
            <p>
              We implement industry-standard administrative, physical, and technical safeguards. These measures include Row Level Security (RLS) in databases, AES-256-GCM encryption for stored API tokens, SSL/TLS transmission encryption, and HMAC-SHA256 signature verification for webhooks.
            </p>
            <div className="p-4 rounded-xl bg-purple-50/70 border border-purple-200 text-purple-900 text-xs sm:text-sm">
              <strong>Security Disclaimer:</strong> While we apply rigorous measures to safeguard your information, please note that no method of electronic transmission over the internet or method of digital storage can guarantee 100% absolute security.
            </div>
          </section>

          {/* Section 6 */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900">6. Data Retention</h2>
            <p>
              We retain your personal and account data for as long as your service account is active, or as needed to deliver services in accordance with your subscription plan. Data may also be retained to comply with legal obligations, enforce agreements, and resolve contractual disputes.
            </p>
          </section>

          {/* Section 7 */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900">7. User Rights</h2>
            <p>Depending on applicable privacy legislation in your jurisdiction, you may hold rights to:</p>
            <ul className="list-disc pl-6 space-y-1.5">
              <li>Request access to the personal data we maintain about you.</li>
              <li>Request rectification of incorrect or outdated records.</li>
              <li>Request account deactivation or deletion of specific stored information, subject to statutory retention limits.</li>
            </ul>
          </section>

          {/* Section 8 */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900">8. Marketing Communications</h2>
            <p>
              We may periodically send operational updates or educational material regarding automation best practices. You may opt out of promotional emails at any time by following the unsubscribe instructions or contacting our team directly.
            </p>
          </section>

          {/* Section 9 */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900">9. Changes to this Privacy Policy</h2>
            <p>
              We may revise this Privacy Policy periodically to reflect technological adjustments, new platform features, or regulatory requirements. Updates will be published on this page with an updated revision date.
            </p>
          </section>

          {/* Section 10 */}
          <section className="space-y-3 pt-4 border-t border-slate-200">
            <h2 className="text-xl font-bold text-slate-900">10. Contact Us</h2>
            <p>If you have any questions or data inquiries regarding this policy, please contact us:</p>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1 text-sm font-medium text-slate-800">
              <div className="font-bold text-slate-900">AdScale Zen</div>
              <div>Founder: Pankaj Swami</div>
              <div>Email: <a href="mailto:adscalezenonline@gmail.com" className="text-purple-600 hover:underline">adscalezenonline@gmail.com</a></div>
              <div>Phone: <a href="tel:+919166763655" className="text-purple-600 hover:underline">+91 9166763655</a></div>
              <div>Website: <a href="https://adscalezen.online" target="_blank" rel="noreferrer" className="text-purple-600 hover:underline">adscalezen.online</a></div>
            </div>
          </section>

        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-14 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 text-left">
          <div className="md:col-span-4">
            <div className="flex items-center gap-2.5 mb-3">
              <div className="relative h-8 w-8 rounded-lg overflow-hidden bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center">
                {!logoError ? (
                  <Image src="/adscalezen-logo.jpg" alt="AdScale Zen Logo" fill className="object-cover" onError={() => setLogoError(true)} />
                ) : (
                  <Zap className="h-4 w-4 text-white" />
                )}
              </div>
              <span className="text-lg font-bold text-slate-900">AdScale Zen</span>
            </div>
            <p className="text-xs font-semibold text-purple-600 mb-2">
              Digital Growth • Automation • WhatsApp Solutions
            </p>
            <p className="text-xs text-slate-500 leading-relaxed max-w-sm">
              Helping businesses simplify marketing, automation and digital growth with practical technology solutions.
            </p>
          </div>

          <div className="md:col-span-3">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3">
              Quick Links
            </div>
            <ul className="space-y-2 text-xs text-slate-600">
              <li><Link href="/" className="hover:text-purple-600 transition-colors">Home</Link></li>
              <li><Link href="/#services" className="hover:text-purple-600 transition-colors">Services</Link></li>
              <li><Link href="/about" className="hover:text-purple-600 transition-colors">About Us</Link></li>
              <li><Link href="/subscription" className="hover:text-purple-600 transition-colors">Pricing</Link></li>
              <li><Link href="/#contact" className="hover:text-purple-600 transition-colors">Contact Us</Link></li>
              <li><Link href="/privacy-policy" className="hover:text-purple-600 transition-colors font-medium text-purple-600">Privacy Policy</Link></li>
              <li><Link href="/refund-policy" className="hover:text-purple-600 transition-colors">Refund Policy</Link></li>
              <li><Link href="/terms-and-conditions" className="hover:text-purple-600 transition-colors">Terms &amp; Conditions</Link></li>
            </ul>
          </div>

          <div className="md:col-span-3">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3">
              Contact
            </div>
            <ul className="space-y-2.5 text-xs text-slate-600">
              <li>
                <a href="tel:+919166763655" className="inline-flex items-center gap-2 hover:text-purple-600 transition-colors font-medium">
                  <Phone className="h-3.5 w-3.5 text-purple-600" />
                  <span>+91 9166763655</span>
                </a>
              </li>
              <li>
                <a href="mailto:adscalezenonline@gmail.com" className="inline-flex items-center gap-2 hover:text-purple-600 transition-colors font-medium">
                  <Mail className="h-3.5 w-3.5 text-purple-600" />
                  <span>adscalezenonline@gmail.com</span>
                </a>
              </li>
              <li className="text-[11px] text-slate-500 pt-1">Website: adscalezen.online</li>
            </ul>
          </div>

          <div className="md:col-span-2">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3">
              Founder
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <div className="text-sm font-bold text-slate-900">Pankaj Swami</div>
              <div className="text-[11px] text-purple-700 font-semibold mt-0.5">
                Founder, AdScale Zen
              </div>
            </div>

            <div className="mt-4">
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2">
                Connect With Us
              </div>
              <div className="flex items-center gap-2.5">
                <a
                  href="https://wa.me/919166763655?text=Hello%20Pankaj%20Sir%2C%20I%20am%20interested%20in%20AdScale%20Zen%20services"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="h-9 w-9 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white flex items-center justify-center shadow-xs hover:scale-105 transition-all"
                  aria-label="WhatsApp"
                >
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                    <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86s.275.072.376-.043c.101-.116.433-.506.549-.68.116-.173.231-.145.39-.087s1.011.477 1.184.564.289.13.332.202c.045.072.045.419-.099.824zm-3.423-14.416c-6.627 0-12 5.373-12 12 0 2.155.57 4.178 1.564 5.927l-1.564 5.707 5.841-1.533c1.706.93 3.655 1.469 5.729 1.469 6.627 0 12-5.373 12-12 0-6.627-5.373-12-12-12z" />
                  </svg>
                </a>
                <a
                  href="https://www.instagram.com/adscalezen?stkn=aXg1amNieXJuMjQ0"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="h-9 w-9 rounded-xl bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 hover:opacity-90 text-white flex items-center justify-center shadow-xs hover:scale-105 transition-all"
                  aria-label="Instagram"
                >
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto mt-10 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>&copy; {new Date().getFullYear()} AdScale Zen. All rights reserved.</div>
          <div className="flex items-center gap-4">
            <Link href="/refund-policy" className="hover:text-slate-700 transition-colors">Refund Policy</Link>
            <span>•</span>
            <Link href="/privacy-policy" className="hover:text-slate-700 transition-colors">Privacy Policy</Link>
            <span>•</span>
            <Link href="/terms-and-conditions" className="hover:text-slate-700 transition-colors">Terms &amp; Conditions</Link>
          </div>
          <div className="flex items-center gap-2">
            <a
              href="https://wa.me/919166763655?text=Hello%20Pankaj%20Sir%2C%20I%20am%20interested%20in%20AdScale%20Zen%20services"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-semibold transition-colors text-xs border border-emerald-200"
            >
              <span>WhatsApp</span>
            </a>
            <a
              href="https://www.instagram.com/adscalezen?stkn=aXg1amNieXJuMjQ0"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 font-semibold transition-colors text-xs border border-rose-200"
            >
              <span>Instagram</span>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
