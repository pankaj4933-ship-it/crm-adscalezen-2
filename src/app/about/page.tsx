"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import {
  Zap,
  CheckCircle2,
  Sparkles,
  Menu,
  X,
  Phone,
  Mail,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { WhatsAppIcon } from "@/components/icons/whatsapp-icon";
import { ADSCALEZEN_LOGO_B64 } from "@/lib/brand-assets";

const whatWeDoList = [
  { name: "Digital Marketing", desc: "Data-driven multi-channel strategies designed for consistent brand reach." },
  { name: "Meta Ads", desc: "Targeted Facebook & Instagram advertising focused on genuine acquisition metrics." },
  { name: "Lead Generation", desc: "High-intent customer capture funnels tailored to your exact industry." },
  { name: "WhatsApp Automation", desc: "Automated instant customer responses, order updates, and CRM engagement." },
  { name: "CRM Solutions", desc: "Multi-agent shared team inboxes, conversation assignment, and contact pipelines." },
  { name: "AI & Automation", desc: "Intelligent AI copilots and automated webhook trigger sequences." },
  { name: "Landing Pages", desc: "High-converting, responsive, lightning-fast conversion landing pages." },
  { name: "Business Automation", desc: "Eliminate manual repetitive operations and streamline workflows." },
  { name: "Digital Growth Solutions", desc: "Holistic compounding growth systems built around your subscription plan." },
];

const approachSteps = [
  { step: "01", title: "Understand the business requirement", desc: "We study your existing operations, customer touchpoints, and core commercial goals." },
  { step: "02", title: "Recommend the relevant service", desc: "We identify the most practical tools and marketing avenues suited to your current stage." },
  { step: "03", title: "Select the appropriate plan", desc: "Transparent scope and plan selection without hidden fees or surprise charges." },
  { step: "04", title: "Implement the agreed service", desc: "Careful setup, API connections, automation configuration, and system testing." },
  { step: "05", title: "Provide relevant support", desc: "Prompt technical and operational assistance directly aligned with your active plan." },
  { step: "06", title: "Improve the workflow based on requirements", desc: "Continuous refinement and optimization as your team and customer volume expand." },
];

export default function AboutPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [logoError, setLogoError] = useState(false);
  const [founderImgError, setFounderImgError] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50/60 text-slate-900 selection:bg-purple-500/20 selection:text-purple-900 font-sans">
      {/* Background Mesh */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[850px] h-[500px] bg-gradient-to-tr from-purple-200/40 via-indigo-100/50 to-blue-200/30 blur-[130px] rounded-full" />
        <div className="absolute top-[600px] -left-36 w-[550px] h-[550px] bg-indigo-100/30 blur-[140px] rounded-full" />
      </div>

      {/* Header Navigation */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-white/80 border-b border-slate-200/80 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative h-11 w-11 rounded-xl overflow-hidden bg-slate-950 flex items-center justify-center shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform duration-200 border border-slate-800">
              <img
                src={ADSCALEZEN_LOGO_B64}
                alt="AdScale Zen Logo"
                className="h-full w-full object-contain p-0.5"
              />
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
            <Link href="/about" className="text-purple-600 font-semibold transition-colors">
              About Us
            </Link>
            <Link href="/subscription" className="hover:text-purple-600 transition-colors">
              Pricing
            </Link>
            <Link href="/#contact" className="hover:text-purple-600 transition-colors">
              Contact Us
            </Link>
          </nav>

          <div className="hidden sm:flex items-center gap-2.5">
            <Link href="/login">
              <Button variant="ghost" className="text-slate-700 hover:text-purple-700 hover:bg-purple-50 font-medium text-sm px-3">
                Login
              </Button>
            </Link>
            <a
              href="https://crm.adscalezen.online"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex"
            >
              <Button
                className="group relative overflow-hidden bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-600 hover:from-emerald-500 hover:via-emerald-400 hover:to-teal-500 text-white font-semibold text-sm shadow-md shadow-emerald-600/25 hover:shadow-lg hover:shadow-emerald-600/35 px-4 flex items-center gap-2 border border-emerald-400/40 rounded-xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
              >
                <WhatsAppIcon className="h-4 w-4 fill-white shrink-0" />
                <span>WhatsApp API Dashboard</span>
                <ExternalLink className="h-3.5 w-3.5 opacity-80 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </Button>
            </a>
            <Link href="/dashboard">
              <Button className="bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 hover:from-purple-700 text-white font-semibold text-sm shadow-md shadow-indigo-500/20 px-3.5 rounded-xl">
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
            <Link href="/about" onClick={() => setMobileMenuOpen(false)} className="text-purple-600 font-semibold py-1.5">
              About Us
            </Link>
            <Link href="/subscription" onClick={() => setMobileMenuOpen(false)} className="text-slate-800 font-medium py-1.5 hover:text-purple-600">
              Pricing
            </Link>
            <Link href="/#contact" onClick={() => setMobileMenuOpen(false)} className="text-slate-800 font-medium py-1.5 hover:text-purple-600">
              Contact Us
            </Link>
            <div className="flex flex-col gap-2 pt-4 border-t border-slate-200">
              <a
                href="https://crm.adscalezen.online"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full"
              >
                <Button className="w-full bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold flex items-center justify-center gap-2 shadow-md shadow-emerald-600/20 py-2.5 rounded-xl">
                  <WhatsAppIcon className="h-4 w-4 fill-white shrink-0" />
                  <span>WhatsApp API Dashboard</span>
                  <ExternalLink className="h-3.5 w-3.5 opacity-80" />
                </Button>
              </a>
              <div className="grid grid-cols-2 gap-2 mt-1">
                <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="outline" className="w-full text-sm rounded-xl">Login</Button>
                </Link>
                <Link href="/signup" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="outline" className="w-full text-sm rounded-xl">Create Account</Button>
                </Link>
              </div>
              <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)}>
                <Button className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold rounded-xl">
                  Access Dashboard
                </Button>
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="relative pt-16 pb-16 md:pt-24 md:pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-purple-200 bg-purple-50/80 text-purple-700 text-xs font-semibold mb-6 shadow-xs">
          <Sparkles className="h-3.5 w-3.5 text-purple-600" />
          <span>Building Practical Digital Systems</span>
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900">
          About{" "}
          <span className="bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 bg-clip-text text-transparent">
            AdScale Zen
          </span>
        </h1>

        <p className="mt-6 text-xl sm:text-2xl text-slate-600 max-w-3xl mx-auto font-medium">
          Smarter Digital Solutions for Modern Businesses
        </p>

        <p className="mt-6 text-base sm:text-lg text-slate-600 max-w-3xl mx-auto leading-relaxed">
          AdScale Zen is a digital marketing and technology services agency focused on helping businesses build stronger digital systems through marketing, automation, CRM solutions, WhatsApp solutions and other practical digital services.
        </p>

        {/* Business Highlights / Metric Cards */}
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-sm">
            <div className="text-3xl sm:text-4xl font-black text-purple-600">₹60 Lakh+</div>
            <div className="text-sm font-semibold text-slate-700 mt-2">Ad Spend Managed</div>
            <p className="text-xs text-slate-500 mt-1">Across performance marketing campaigns</p>
          </div>
          <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-sm">
            <div className="text-3xl sm:text-4xl font-black text-indigo-600">1000+</div>
            <div className="text-sm font-semibold text-slate-700 mt-2">Happy Clients</div>
            <p className="text-xs text-slate-500 mt-1">Served across various business verticals</p>
          </div>
          <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-sm">
            <div className="text-3xl sm:text-4xl font-black text-blue-600">5+</div>
            <div className="text-sm font-semibold text-slate-700 mt-2">Years of Industry Experience</div>
            <p className="text-xs text-slate-500 mt-1">In automation, advertising &amp; digital growth</p>
          </div>
        </div>
      </section>

      {/* Founder Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-200/80">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-md bg-gradient-to-b from-white to-slate-50 rounded-3xl p-6 border border-slate-200 shadow-xl">
              <div className="relative aspect-square rounded-2xl overflow-hidden bg-slate-100 border border-slate-200">
                {!founderImgError ? (
                  <Image
                    src="/pankaj-swami.jpg"
                    alt="Pankaj Swami - Founder, AdScale Zen"
                    fill
                    className="object-cover object-top"
                    onError={() => setFounderImgError(true)}
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-tr from-purple-600 to-indigo-600 text-white p-6">
                    <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center text-3xl font-black mb-3">PS</div>
                    <span className="text-xl font-bold">Pankaj Swami</span>
                    <span className="text-xs text-purple-200">Founder, AdScale Zen</span>
                  </div>
                )}
              </div>
              <div className="mt-4 text-center">
                <h3 className="text-xl font-bold text-slate-900">Pankaj Swami</h3>
                <p className="text-xs font-semibold text-purple-600 uppercase tracking-wider mt-0.5">
                  Founder, AdScale Zen
                </p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-100 text-purple-800 text-xs font-bold uppercase tracking-wider mb-3">
              Founder&apos;s Vision
            </div>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Practical Technology &amp; Reliable Support
            </h2>
            <p className="mt-6 text-base sm:text-lg text-slate-700 leading-relaxed">
              &ldquo;AdScale Zen was created with the vision of making digital marketing, automation and technology more practical and accessible for businesses. Our focus is to understand the customer&apos;s requirements and provide solutions according to their selected service plan and subscription.&rdquo;
            </p>
            <p className="mt-4 text-sm text-slate-600 leading-relaxed">
              We stand firmly against hype, unrealistic income guarantees, and exaggerated revenue promises. Every business is distinct; real growth stems from reliable tools, transparent subscription limits, and disciplined execution.
            </p>

            <div className="mt-8 flex flex-wrap gap-4 text-xs font-semibold text-slate-700">
              <div className="flex items-center gap-2 p-3 rounded-xl bg-white border border-slate-200">
                <CheckCircle2 className="h-4 w-4 text-purple-600" />
                <span>Transparent Subscriptions</span>
              </div>
              <div className="flex items-center gap-2 p-3 rounded-xl bg-white border border-slate-200">
                <CheckCircle2 className="h-4 w-4 text-purple-600" />
                <span>Official Meta Cloud API</span>
              </div>
              <div className="flex items-center gap-2 p-3 rounded-xl bg-white border border-slate-200">
                <CheckCircle2 className="h-4 w-4 text-purple-600" />
                <span>Dedicated Plan-Based Support</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What We Do Grid */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-200/80">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-bold uppercase tracking-wider mb-3">
            Capabilities
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            What We Do
          </h2>
          <p className="mt-3 text-sm text-slate-600">
            A comprehensive suite of modern digital marketing, communication, and automation solutions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {whatWeDoList.map((item, idx) => (
            <div
              key={idx}
              className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-xs hover:shadow-md hover:border-purple-300 transition-all text-left"
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="w-2 h-2 rounded-full bg-purple-600" />
                <h3 className="text-base font-bold text-slate-900">{item.name}</h3>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Our Approach (6 Steps) */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-200/80">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-100 text-purple-800 text-xs font-bold uppercase tracking-wider mb-3">
            Systematic Process
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Our Approach
          </h2>
          <p className="mt-3 text-sm text-slate-600">
            A structured, transparent methodology ensuring every implementation delivers practical value.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {approachSteps.map((step, idx) => (
            <div
              key={idx}
              className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-xs hover:border-indigo-300 transition-colors text-left"
            >
              <div className="text-3xl font-black text-indigo-600 mb-3">{step.step}</div>
              <h3 className="text-base font-bold text-slate-900 mb-2">{step.title}</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Box */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        <div className="rounded-3xl bg-gradient-to-tr from-purple-900 via-indigo-900 to-slate-900 text-white p-8 sm:p-12 text-center shadow-xl">
          <h2 className="text-3xl font-extrabold">Ready to Partner With AdScale Zen?</h2>
          <p className="mt-3 text-purple-200 text-sm max-w-xl mx-auto">
            Explore our subscription plans or speak directly with our team to find the right digital growth package for your business.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/subscription">
              <Button className="h-12 px-7 bg-white text-slate-900 hover:bg-slate-100 font-bold text-sm rounded-xl">
                View Pricing &amp; Plans
              </Button>
            </Link>
            <a href="tel:+919166763655">
              <Button variant="outline" className="h-12 px-7 border-purple-400 text-white hover:bg-purple-800/50 font-semibold text-sm rounded-xl">
                <Phone className="h-4 w-4 mr-2" />
                Call +91 9166763655
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-14 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 text-left">
          <div className="md:col-span-4">
            <div className="flex items-center gap-2.5 mb-3">
              <div className="relative h-8 w-8 rounded-lg overflow-hidden bg-slate-950 flex items-center justify-center border border-slate-800">
                <img src={ADSCALEZEN_LOGO_B64} alt="AdScale Zen Logo" className="h-full w-full object-contain p-0.5" />
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
              <li><Link href="/about" className="hover:text-purple-600 transition-colors font-medium text-purple-600">About Us</Link></li>
              <li><Link href="/subscription" className="hover:text-purple-600 transition-colors">Pricing</Link></li>
              <li><Link href="/#contact" className="hover:text-purple-600 transition-colors">Contact Us</Link></li>
              <li><Link href="/privacy-policy" className="hover:text-purple-600 transition-colors">Privacy Policy</Link></li>
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
