"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import {
  Zap,
  Menu,
  X,
  Phone,
  Mail,
  Scale,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function TermsAndConditionsPage() {
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
          <Scale className="h-3.5 w-3.5 text-purple-600" />
          <span>Client &amp; Service Agreement</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
          Terms &amp; Conditions
        </h1>
        <p className="mt-4 text-base text-slate-600 max-w-3xl">
          Effective Date: Last updated October 2026. Please read these Terms &amp; Conditions carefully before engaging our services or accessing our platform at <strong>adscalezen.online</strong>.
        </p>
      </section>

      {/* Terms Body */}
      <main className="pb-24 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        <div className="bg-white rounded-3xl border border-slate-200/90 p-8 sm:p-12 shadow-sm space-y-10 text-left text-slate-700 leading-relaxed text-sm sm:text-base">
          
          {/* 1. Acceptance */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900">1. Acceptance of Terms</h2>
            <p>
              By accessing our website, creating an account, subscribing to any service plan, or retaining AdScale Zen for digital marketing, CRM, or automation services, you agree to be bound by these Terms &amp; Conditions. If you do not agree to these terms, you must not access or use our services.
            </p>
          </section>

          {/* 2. About AdScale Zen */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900">2. About AdScale Zen</h2>
            <p>
              AdScale Zen is a digital growth and technology agency founded by <strong>Pankaj Swami</strong>, providing performance marketing, workflow automation, customer relationship management software, and official WhatsApp Cloud API solutions.
            </p>
          </section>

          {/* 3. Eligibility */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900">3. Eligibility</h2>
            <p>
              You represent and warrant that you are at least 18 years of age, possess the legal capacity to enter into binding agreements, and have the authority to bind any business or legal entity on whose behalf you access our services.
            </p>
          </section>

          {/* 4. Account Registration */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900">4. Account Registration &amp; Security</h2>
            <p>
              You agree to provide true, accurate, current, and complete information during registration. You are responsible for safeguarding your credentials and are fully liable for all activities that occur under your account.
            </p>
          </section>

          {/* 5. Services */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900">5. Services Overview</h2>
            <p>
              AdScale Zen provides cloud-based WhatsApp CRM tools, automation configuration, API connections, lead generation consulting, and digital growth services tailored to distinct subscription tiers.
            </p>
          </section>

          {/* 6. Plans and Subscriptions */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900">6. Plans and Subscriptions</h2>
            <p>
              Access to features, user seats, API throughput, message quotas, and support response times is governed strictly by the specific plan subscribed to by the customer.
            </p>
          </section>

          {/* 7. Service Scope */}
          <section className="space-y-3 p-5 rounded-2xl bg-purple-50/70 border border-purple-200">
            <h2 className="text-xl font-bold text-purple-950">7. Service Scope &amp; Boundaries</h2>
            <div className="space-y-2 text-slate-800 text-sm font-medium">
              <p>&bull; <strong>Services are provided according to the customer&apos;s selected plan and active subscription.</strong></p>
              <p>&bull; <strong>Customers receive the services, features, support and usage limits included in their selected plan.</strong></p>
              <p>&bull; <strong>Services outside the selected plan are not automatically included.</strong></p>
              <p>&bull; <strong>Additional services may require a plan upgrade or separate purchase.</strong></p>
            </div>
          </section>

          {/* 8. Customer Responsibilities */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900">8. Customer Responsibilities</h2>
            <p className="font-medium text-slate-800">
              The customer is responsible for providing accurate information, required access, approvals, content, advertising budgets and other materials reasonably required to provide the selected service.
            </p>
            <p>
              Delays in supplying assets, administrative access, or approvals will directly affect implementation timelines and do not pause subscription billing cycles.
            </p>
          </section>

          {/* 9. Payments */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900">9. Payments &amp; Invoicing</h2>
            <p>
              All fees are payable in advance of the applicable service period according to the pricing published on our website or stated in an agreed invoice. Payment processing is facilitated via authorized payment gateways (including Razorpay).
            </p>
          </section>

          {/* 10. Service Activation */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900">10. Service Activation</h2>
            <p>
              Service activation occurs upon system account creation, issuance of dashboard credentials, or commencement of setup and implementation by our team.
            </p>
          </section>

          {/* 11. Plan Limitations */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900">11. Plan Limitations &amp; Usage Quotas</h2>
            <p>
              Each plan features defined resource allocations (e.g. number of connected phone numbers, broadcast contact volumes, agent seats). Exceeding allocated limits requires upgrading to a higher tier.
            </p>
          </section>

          {/* 12. Additional Services */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900">12. Additional Services</h2>
            <p>
              Custom software integrations, complex funnel builds, or bespoke developer assistance requested beyond the scope of your selected plan must be contracted under a separate statement of work or supplementary invoice.
            </p>
          </section>

          {/* 13. Advertising Services */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900">13. Advertising Services</h2>
            <p>
              AdScale Zen provides campaign setup, creative direction, and media buying management. Media spend is billed directly by the advertising platform (e.g., Meta Ads, Google Ads) to the client&apos;s own payment method and is entirely distinct from AdScale Zen agency fees.
            </p>
          </section>

          {/* 14. Marketing Results Disclaimer */}
          <section className="space-y-3 p-5 rounded-2xl bg-amber-50/80 border border-amber-200">
            <h2 className="text-xl font-bold text-amber-950">14. Marketing Results Disclaimer</h2>
            <p className="text-slate-800 font-medium">
              &ldquo;Results from digital marketing, advertising, automation and technology services may vary between customers. Results can depend on factors including business model, market conditions, advertising budget, offer, audience, implementation, customer cooperation and third-party platform performance.&rdquo;
            </p>
            <p className="text-slate-800 font-medium">
              &ldquo;AdScale Zen does not guarantee a specific number of leads, sales, revenue, followers, customers or return on advertising spend unless expressly agreed in a separate written agreement.&rdquo;
            </p>
          </section>

          {/* 15. WhatsApp/Meta and Third-Party Integrations */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900">15. WhatsApp, Meta, &amp; Third-Party Integrations</h2>
            <p>
              Our platform connects with external providers including Meta Platforms, WhatsApp Business Cloud API, Google, and Razorpay. Customers must comply with all Meta Business Policies and WhatsApp Commerce Policies.
            </p>
            <p>
              AdScale Zen does not govern, nor is it responsible for, message template approvals, phone number quality ratings, bans, or policy enforcement actions enacted independently by Meta.
            </p>
          </section>

          {/* 16. Intellectual Property */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900">16. Intellectual Property</h2>
            <p>
              All software, algorithms, workflows, website content, and brand assets of AdScale Zen remain our exclusive intellectual property. Subject to your active subscription, you are granted a non-exclusive, revocable, non-transferable license to access our platform.
            </p>
          </section>

          {/* 17. Customer Content */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900">17. Customer Content &amp; Compliance</h2>
            <p>
              You retain all ownership rights to customer data, logos, text, and marketing assets provided to us. You warrant that your content does not violate applicable laws, infringe intellectual property rights, or propagate deceptive claims.
            </p>
          </section>

          {/* 18. Prohibited Activities */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900">18. Prohibited Activities</h2>
            <p>You agree not to:</p>
            <ul className="list-disc pl-6 space-y-1.5">
              <li>Transmit unsolicited spam or mass messages without verified recipient consent.</li>
              <li>Reverse engineer, decompile, or copy the codebase of our platform.</li>
              <li>Circumvent account limits, authentication mechanisms, or security headers.</li>
              <li>Engage in illegal, defamatory, or fraudulent marketing practices.</li>
            </ul>
          </section>

          {/* 19. Suspension and Termination */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900">19. Suspension and Termination</h2>
            <p>
              We reserve the right to suspend or terminate service access immediately, without prior notice or refund, if you breach these Terms, fail to satisfy subscription dues, or violate third-party network policies (such as Meta Cloud rules).
            </p>
          </section>

          {/* 20. Refund & Cancellation */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900">20. Refund &amp; Cancellation</h2>
            <p>
              All subscription cancellations and refund evaluations are strictly governed by our dedicated{" "}
              <Link href="/refund-policy" className="text-purple-600 font-bold underline">
                Refund &amp; Cancellation Policy
              </Link>
              . Payments made for activated services and resource allocations are non-refundable, subject to applicable law.
            </p>
          </section>

          {/* 21. Limitation of Liability */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900">21. Limitation of Liability</h2>
            <p>
              To the maximum extent permitted by law, AdScale Zen, its founder, and affiliates shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including loss of profits, leads, data, or goodwill arising from the use of or inability to use our services.
            </p>
          </section>

          {/* 22. Third-Party Services */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900">22. Third-Party Services &amp; Disclaimers</h2>
            <p>
              AdScale Zen integrates with external services including Meta, WhatsApp, Google, Razorpay, hosting/cloud providers, and analytics services. Third-party services operate under their own independent terms, policies, availability, and technical restrictions.
            </p>
          </section>

          {/* 23. Privacy */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900">23. Privacy</h2>
            <p>
              Your use of our website and services is also governed by our{" "}
              <Link href="/privacy-policy" className="text-purple-600 font-bold underline">
                Privacy Policy
              </Link>
              , which is incorporated into these Terms by reference.
            </p>
          </section>

          {/* 24. Changes to Terms */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900">24. Changes to Terms</h2>
            <p>
              We reserve the right to revise or update these Terms &amp; Conditions at our sole discretion. Any changes will be posted on this page with an updated effective date. Continued use of our platform constitutes agreement to the updated terms.
            </p>
          </section>

          {/* 25. Governing Law */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900">25. Governing Law &amp; Jurisdiction</h2>
            <p>
              These Terms &amp; Conditions are governed by and construed in accordance with the laws of India. Any legal dispute arising under or in connection with these Terms shall be subject to the exclusive jurisdiction of the competent courts in India.
            </p>
          </section>

          {/* 26. Contact Information */}
          <section className="space-y-3 pt-4 border-t border-slate-200">
            <h2 className="text-xl font-bold text-slate-900">26. Contact Information</h2>
            <p>For any contractual questions, concerns, or legal notices regarding these Terms &amp; Conditions, please contact:</p>
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
              <li><Link href="/privacy-policy" className="hover:text-purple-600 transition-colors">Privacy Policy</Link></li>
              <li><Link href="/refund-policy" className="hover:text-purple-600 transition-colors">Refund Policy</Link></li>
              <li><Link href="/terms-and-conditions" className="hover:text-purple-600 transition-colors font-medium text-purple-600">Terms &amp; Conditions</Link></li>
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
            <Link href="/terms-and-conditions" className="hover:text-slate-700 transition-colors font-medium text-slate-700">Terms &amp; Conditions</Link>
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
