"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import {
  Zap,
  ShieldCheck,
  Bot,
  Radio,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Workflow,
  ChevronRight,
  Menu,
  X,
  Star,
  TrendingUp,
  MessageSquare,
  Phone,
  Mail,
  Shield,
  Award,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const testimonials = [
  {
    name: "Rani Sharma",
    role: "Affiliate Marketing Professional",
    rating: 5,
    text: "मैंने Pankaj Sir से automation service ली थी। मेरी workflow setup में 10 दिनों के अंदर अच्छा improvement देखने को मिला। Thank you Pankaj Sir.",
    tag: "Automation Workflow",
    photo: "/testimonial-rani-sharma.jpg",
  },
  {
    name: "Nisha Sharma",
    role: "Digital Marketing Professional",
    rating: 5,
    text: "AdScale Zen की service से मुझे अपने digital work को व्यवस्थित करने में काफी मदद मिली। Support भी अच्छा मिला.",
    tag: "Digital Solutions",
    photo: "/testimonial-nisha-sharma.jpg",
  },
  {
    name: "Sapna Choudhary",
    role: "Affiliate Marketing Professional",
    rating: 5,
    text: "मुझे automation और digital process समझने में अच्छी मदद मिली। Pankaj Sir और उनकी team का support अच्छा रहा.",
    tag: "Process Optimization",
    photo: "/testimonial-sapna-choudhary.jpg",
  },
  {
    name: "Vijay Dubey",
    role: "Business & Affiliate Marketing",
    rating: 5,
    text: "AdScale Zen की services ने मेरे काम के कई repetitive tasks को व्यवस्थित करने में मदद की।",
    tag: "Task Automation",
    photo: "/testimonial-vijay-dubey.jpg",
  },
  {
    name: "Anand Tiwari",
    role: "Digital Business Professional",
    rating: 5,
    text: "Service और guidance दोनों practical रहे। मेरे business workflow को बेहतर तरीके से manage करने में मदद मिली.",
    tag: "Workflow Management",
    photo: "/testimonial-anand-tiwari.jpg",
  },
  {
    name: "Shilpa Gaur",
    role: "Affiliate Marketing Professional",
    rating: 5,
    text: "Automation और digital tools को समझने में मुझे काफी सहायता मिली। Team का response अच्छा रहा.",
    tag: "Tool Integration",
    photo: "/testimonial-shilpa-gaur.jpg",
  },
];

const servicesList = [
  {
    icon: MessageSquare,
    title: "Official WhatsApp Cloud CRM",
    desc: "Multi-agent shared team inboxes, automated customer replies, verified templates, and Meta Embedded onboarding.",
    badge: "Meta Cloud API",
  },
  {
    icon: Workflow,
    title: "Marketing Automation",
    desc: "Visual funnel builders, drip sequences, keyword trigger autoresponders, and webhook integrations.",
    badge: "No-Code Builder",
  },
  {
    icon: TrendingUp,
    title: "Performance Digital Growth",
    desc: "Data-backed campaign strategies, customer acquisition funnels, and transparent growth analytics.",
    badge: "Scale Focus",
  },
  {
    icon: Radio,
    title: "Targeted Broadcast Campaigns",
    desc: "Segmented messaging with high delivery rates, custom variable substitution, and real-time read analytics.",
    badge: "High Throughput",
  },
  {
    icon: Bot,
    title: "AI Knowledge Base Copilot",
    desc: "Integrate intelligent conversational agents that auto-draft accurate, human-like replies around the clock.",
    badge: "AI Powered",
  },
  {
    icon: ShieldCheck,
    title: "Enterprise Security & Infrastructure",
    desc: "Row Level Security, HMAC-SHA256 signature verification, encrypted token storage, and granular access controls.",
    badge: "Secure & Compliant",
  },
];

function WhatsAppIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor" className={className}>
      <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86s.275.072.376-.043c.101-.116.433-.506.549-.68.116-.173.231-.145.39-.087s1.011.477 1.184.564.289.13.332.202c.045.072.045.419-.099.824zm-3.423-14.416c-6.627 0-12 5.373-12 12 0 2.155.57 4.178 1.564 5.927l-1.564 5.707 5.841-1.533c1.706.93 3.655 1.469 5.729 1.469 6.627 0 12-5.373 12-12 0-6.627-5.373-12-12-12z" />
    </svg>
  );
}

function InstagramIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor" className={className}>
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    </svg>
  );
}

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [logoError, setLogoError] = useState(false);
  const [founderImgError, setFounderImgError] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50/60 text-slate-900 selection:bg-purple-500/20 selection:text-purple-900 font-sans">
      {/* Background Gradient Mesh */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[850px] h-[550px] bg-gradient-to-tr from-purple-200/40 via-indigo-100/50 to-blue-200/30 blur-[130px] rounded-full" />
        <div className="absolute top-[650px] -left-36 w-[550px] h-[550px] bg-indigo-100/40 blur-[140px] rounded-full" />
        <div className="absolute top-[1300px] -right-36 w-[650px] h-[650px] bg-purple-100/40 blur-[150px] rounded-full" />
      </div>

      {/* Top Header Navigation */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-white/80 border-b border-slate-200/80 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Brand Logo & Name */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative h-11 w-11 rounded-xl overflow-hidden bg-slate-950 flex items-center justify-center shadow-md shadow-purple-500/20 group-hover:scale-105 transition-transform duration-200 border border-slate-800">
              {!logoError ? (
                <Image
                  src="/adscalezen-logo.png"
                  alt="AdScale Zen Logo"
                  fill
                  className="object-contain p-0.5"
                  onError={() => setLogoError(true)}
                  priority
                />
              ) : (
                <Zap className="h-6 w-6 text-purple-400" />
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

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-slate-600">
            <Link href="/" className="hover:text-purple-600 transition-colors">
              Home
            </Link>
            <a href="#services" className="hover:text-purple-600 transition-colors">
              Services
            </a>
            <Link href="/about" className="hover:text-purple-600 transition-colors">
              About Us
            </Link>
            <Link href="/subscription" className="hover:text-purple-600 transition-colors">
              Pricing
            </Link>
            <a href="#testimonials" className="hover:text-purple-600 transition-colors">
              Testimonials
            </a>
            <a href="#contact" className="hover:text-purple-600 transition-colors">
              Contact Us
            </a>
            <Link href="/privacy-policy" className="hover:text-purple-600 transition-colors">
              Privacy Policy
            </Link>
          </nav>

          {/* Right Action CTAs */}
          <div className="hidden sm:flex items-center gap-3">
            <Link href="/login">
              <Button
                variant="ghost"
                className="text-slate-700 hover:text-purple-700 hover:bg-purple-50 font-medium text-sm"
              >
                Login
              </Button>
            </Link>
            <a
              href="https://chat.whatsapp.com/KabZOC7HKg02VWjPd4eav7"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm shadow-md shadow-emerald-600/25 px-4 flex items-center gap-2 border border-emerald-500/40"
              >
                <WhatsAppIcon className="h-4 w-4 fill-white" />
                <span>Join Official Community</span>
              </Button>
            </a>
            <Link href="/dashboard">
              <Button className="bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 hover:from-purple-700 hover:via-indigo-700 hover:to-blue-700 text-white font-semibold text-sm shadow-md shadow-indigo-500/20 px-4">
                Access Dashboard
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Dropdown */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-b border-slate-200 bg-white/95 backdrop-blur-md px-6 pt-4 pb-6 flex flex-col gap-3 shadow-lg">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="text-slate-800 font-medium py-1.5 hover:text-purple-600"
            >
              Home
            </Link>
            <a
              href="#services"
              onClick={() => setMobileMenuOpen(false)}
              className="text-slate-800 font-medium py-1.5 hover:text-purple-600"
            >
              Services
            </a>
            <Link
              href="/about"
              onClick={() => setMobileMenuOpen(false)}
              className="text-slate-800 font-medium py-1.5 hover:text-purple-600"
            >
              About Us
            </Link>
            <Link
              href="/subscription"
              onClick={() => setMobileMenuOpen(false)}
              className="text-slate-800 font-medium py-1.5 hover:text-purple-600"
            >
              Pricing
            </Link>
            <a
              href="#testimonials"
              onClick={() => setMobileMenuOpen(false)}
              className="text-slate-800 font-medium py-1.5 hover:text-purple-600"
            >
              Testimonials
            </a>
            <a
              href="#contact"
              onClick={() => setMobileMenuOpen(false)}
              className="text-slate-800 font-medium py-1.5 hover:text-purple-600"
            >
              Contact Us
            </a>
            <Link
              href="/privacy-policy"
              onClick={() => setMobileMenuOpen(false)}
              className="text-slate-800 font-medium py-1.5 hover:text-purple-600"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms-and-conditions"
              onClick={() => setMobileMenuOpen(false)}
              className="text-slate-800 font-medium py-1.5 hover:text-purple-600"
            >
              Terms &amp; Conditions
            </Link>
            <div className="flex flex-col gap-2 pt-4 border-t border-slate-200">
              <a
                href="https://chat.whatsapp.com/KabZOC7HKg02VWjPd4eav7"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full"
              >
                <Button className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold flex items-center justify-center gap-2">
                  <WhatsAppIcon className="h-4 w-4 fill-white" />
                  <span>Join Official Community</span>
                </Button>
              </a>
              <div className="grid grid-cols-2 gap-2 mt-1">
                <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="outline" className="w-full text-sm">
                    Login
                  </Button>
                </Link>
                <Link href="/subscription" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="outline" className="w-full text-sm">
                    Pricing
                  </Button>
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

      {/* HERO SECTION */}
      <section className="relative pt-12 pb-20 md:pt-20 md:pb-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Headline, Subheadline, CTAs & Direct Contact */}
          <div className="lg:col-span-7 flex flex-col items-start text-left">
            {/* Pill Tag */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-purple-200 bg-purple-50/80 text-purple-700 text-xs font-semibold mb-6 shadow-xs">
              <Sparkles className="h-3.5 w-3.5 text-purple-600" />
              <span>Performance Digital Agency & Automation</span>
              <span className="w-1.5 h-1.5 rounded-full bg-purple-600" />
              <span className="text-purple-900 font-bold">AdScale Zen</span>
            </div>

            {/* Primary Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 leading-[1.12]">
              Scale Your Business With{" "}
              <span className="bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 bg-clip-text text-transparent">
                Smarter Digital Growth
              </span>
            </h1>

            {/* Subheadline */}
            <p className="mt-6 text-lg sm:text-xl text-slate-600 leading-relaxed font-normal max-w-2xl">
              Performance-driven digital marketing, automation, WhatsApp solutions and growth services designed around your business goals and subscription plan.
            </p>

            {/* CTAs */}
            <div className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto">
              <Link href="/signup">
                <Button className="h-13 px-8 text-base bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold shadow-lg shadow-indigo-500/25 rounded-xl flex items-center justify-center gap-2 transition-all">
                  <span>Get Started</span>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <a href="#services">
                <Button
                  variant="outline"
                  className="h-13 px-7 text-base border-slate-300 hover:border-purple-300 bg-white hover:bg-slate-50 text-slate-700 font-semibold rounded-xl shadow-xs"
                >
                  Explore Services
                </Button>
              </a>
            </div>

            {/* Small Contact Area */}
            <div className="mt-8 p-4 rounded-2xl bg-white/90 border border-slate-200/90 shadow-sm w-full max-w-lg">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                Talk to our team
              </div>
              <div className="flex flex-wrap items-center gap-4 text-sm font-semibold text-slate-700">
                <a
                  href="tel:+919166763655"
                  className="inline-flex items-center gap-2 hover:text-purple-600 transition-colors py-1 px-2.5 rounded-lg hover:bg-purple-50"
                >
                  <Phone className="h-4 w-4 text-purple-600" />
                  <span>+91 9166763655</span>
                </a>
                <a
                  href="mailto:adscalezenonline@gmail.com"
                  className="inline-flex items-center gap-2 hover:text-purple-600 transition-colors py-1 px-2.5 rounded-lg hover:bg-purple-50"
                >
                  <Mail className="h-4 w-4 text-purple-600" />
                  <span className="truncate">adscalezenonline@gmail.com</span>
                </a>
              </div>
            </div>

            {/* Trust Line */}
            <div className="mt-6 flex items-center gap-2 text-xs sm:text-sm font-medium text-slate-500">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
              <span>Professional Digital Solutions • Transparent Plans • Dedicated Support</span>
            </div>
          </div>

          {/* Right Column: Founder & Visual Floating Brand Elements */}
          <div className="lg:col-span-5 relative flex items-center justify-center">
            {/* Visual Glassmorphic Card Container */}
            <div className="relative w-full max-w-md bg-gradient-to-b from-white via-white/95 to-slate-50/80 rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-2xl shadow-indigo-500/10">
              
              {/* Founder Photo & Details */}
              <div className="relative rounded-2xl overflow-hidden bg-gradient-to-tr from-purple-100 via-indigo-50 to-blue-100 border border-slate-200/80 p-2 shadow-inner">
                <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-slate-100">
                  {!founderImgError ? (
                    <Image
                      src="/pankaj-swami.jpg"
                      alt="Pankaj Swami - Founder, AdScale Zen"
                      fill
                      className="object-cover object-top hover:scale-105 transition-transform duration-500"
                      onError={() => setFounderImgError(true)}
                      priority
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-tr from-purple-500 to-indigo-600 text-white p-6 text-center">
                      <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center text-3xl font-black mb-3">
                        PS
                      </div>
                      <span className="text-xl font-bold">Pankaj Swami</span>
                      <span className="text-xs text-purple-200 mt-1">Founder, AdScale Zen</span>
                    </div>
                  )}

                  {/* Gradient bottom overlay on image */}
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/85 via-slate-950/40 to-transparent p-4 text-white text-left">
                    <div className="text-lg font-bold">Pankaj Swami</div>
                    <div className="text-xs text-purple-200 font-medium">Founder, AdScale Zen</div>
                  </div>
                </div>
              </div>

              {/* Founder Mission Statement */}
              <div className="mt-5 p-4 rounded-xl bg-purple-50/70 border border-purple-100/90 text-left">
                <div className="flex items-center gap-2 mb-1.5">
                  <Award className="h-4 w-4 text-purple-600" />
                  <span className="text-xs font-bold uppercase tracking-wider text-purple-900">
                    Founder&apos;s Commitment
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed italic">
                  &ldquo;Helping businesses simplify marketing, automation and digital growth with practical technology solutions.&rdquo;
                </p>
              </div>

              {/* Floating Service Chips Grid */}
              <div className="mt-5 grid grid-cols-2 gap-2 text-left">
                <div className="px-3 py-2 rounded-xl bg-white border border-slate-200/90 shadow-xs flex items-center gap-2 text-xs font-semibold text-slate-800 hover:border-purple-300 transition-colors">
                  <span className="w-2 h-2 rounded-full bg-purple-500" />
                  <span>Marketing</span>
                </div>
                <div className="px-3 py-2 rounded-xl bg-white border border-slate-200/90 shadow-xs flex items-center gap-2 text-xs font-semibold text-slate-800 hover:border-purple-300 transition-colors">
                  <span className="w-2 h-2 rounded-full bg-indigo-500" />
                  <span>Automation</span>
                </div>
                <div className="px-3 py-2 rounded-xl bg-white border border-slate-200/90 shadow-xs flex items-center gap-2 text-xs font-semibold text-slate-800 hover:border-purple-300 transition-colors">
                  <span className="w-2 h-2 rounded-full bg-blue-500" />
                  <span>WhatsApp Solutions</span>
                </div>
                <div className="px-3 py-2 rounded-xl bg-white border border-slate-200/90 shadow-xs flex items-center gap-2 text-xs font-semibold text-slate-800 hover:border-purple-300 transition-colors">
                  <span className="w-2 h-2 rounded-full bg-teal-500" />
                  <span>Lead Generation</span>
                </div>
                <div className="px-3 py-2 rounded-xl bg-white border border-slate-200/90 shadow-xs flex items-center gap-2 text-xs font-semibold text-slate-800 hover:border-purple-300 transition-colors">
                  <span className="w-2 h-2 rounded-full bg-violet-500" />
                  <span>CRM</span>
                </div>
                <div className="px-3 py-2 rounded-xl bg-white border border-slate-200/90 shadow-xs flex items-center gap-2 text-xs font-semibold text-slate-800 hover:border-purple-300 transition-colors">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span>Digital Growth</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* POLICY & SERVICE TRANSPARENCY NOTICE (As Requested) */}
      <section id="policies" className="py-8 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        <div className="rounded-2xl bg-white border border-slate-200/90 p-6 sm:p-8 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center shrink-0">
              <Shield className="h-5 w-5" />
            </div>
            <div className="space-y-3 text-left">
              <h3 className="text-base font-bold text-slate-900">
                Transparent Service & Subscription Terms
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Services are provided according to the selected plan and subscription. We provide support relevant to the services included in your plan. Additional services are not included unless separately purchased or upgraded.
              </p>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                All subscriptions and service purchases are subject to our Terms &amp; Conditions and Refund Policy.
              </p>
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700">
                <span className="font-bold text-slate-900">Non-Refundable Policy Notice: </span>
                Due to the upfront infrastructure provisioning, specialized setup, and automated digital resource allocations, all subscriptions and completed setup fees are non-refundable once activated or accessed, to the extent permitted under applicable law.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SERVICES SECTION */}
      <section id="services" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-100 text-purple-800 text-xs font-bold uppercase tracking-wider mb-3">
            Our Core Expertise
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Integrated Solutions Built for Real Results
          </h2>
          <p className="mt-4 text-base text-slate-600">
            From smart messaging infrastructure to business workflow automation, we engineer digital tools that eliminate friction.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {servicesList.map((service, index) => {
            const Icon = service.icon;
            return (
              <div
                key={index}
                className="group rounded-2xl bg-white border border-slate-200/90 p-7 shadow-xs hover:shadow-xl hover:border-purple-300 transition-all duration-300 flex flex-col justify-between text-left"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center group-hover:bg-purple-600 group-hover:text-white transition-colors duration-200">
                      <Icon className="h-6 w-6" />
                    </div>
                    <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-600 border border-slate-200">
                      {service.badge}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-purple-700 transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {service.desc}
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center text-xs font-semibold text-purple-600 group-hover:translate-x-1 transition-transform">
                  <span>Learn more</span>
                  <ChevronRight className="h-4 w-4 ml-0.5" />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ABOUT AGENCY SECTION */}
      <section id="about" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-200/80">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-bold uppercase tracking-wider mb-3">
              About AdScale Zen
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
              A Dedicated Partner in Practical Digital Transformation
            </h2>
            <p className="mt-5 text-base text-slate-600 leading-relaxed">
              At AdScale Zen, we focus on genuine business utility. Led by founder Pankaj Swami, our agency bridges modern communication tools, Meta Cloud APIs, and targeted automation to help businesses manage customer touchpoints seamlessly.
            </p>
            <p className="mt-4 text-base text-slate-600 leading-relaxed">
              We do not believe in unrealistic overnight miracles or exaggerated income guarantees. We believe in well-engineered workflows, transparent plans, reliable support, and steady compounding growth.
            </p>

            <div className="mt-8 grid grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
                <div className="text-2xl font-black text-purple-600">100%</div>
                <div className="text-xs font-semibold text-slate-700 mt-1">Official Cloud APIs</div>
                <div className="text-[11px] text-slate-500 mt-0.5">Compliant with Meta standards</div>
              </div>
              <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
                <div className="text-2xl font-black text-indigo-600">Direct</div>
                <div className="text-xs font-semibold text-slate-700 mt-1">Dedicated Support</div>
                <div className="text-[11px] text-slate-500 mt-0.5">Assistance matching your plan</div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 bg-gradient-to-tr from-purple-100 via-indigo-50 to-blue-50 rounded-3xl p-8 border border-slate-200 shadow-sm text-left">
            <h3 className="text-xl font-bold text-slate-900 mb-4">
              Why Businesses Choose AdScale Zen
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <div className="h-6 w-6 rounded-full bg-purple-600 text-white flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="h-3.5 w-3.5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-800">Clear &amp; Predictable Subscriptions</h4>
                  <p className="text-xs text-slate-600 mt-0.5">No hidden charges or surprise surcharges. Everything clearly stated in your plan.</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="h-6 w-6 rounded-full bg-indigo-600 text-white flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="h-3.5 w-3.5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-800">Complete CRM &amp; Workflow Integration</h4>
                  <p className="text-xs text-slate-600 mt-0.5">Organize customer conversations, multi-agent assignments, and automated reminders in one system.</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="h-6 w-6 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="h-3.5 w-3.5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-800">Founder-Led Accountability</h4>
                  <p className="text-xs text-slate-600 mt-0.5">Direct guidance and practical execution from experienced digital marketing technologists.</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS SECTION */}
      <section id="testimonials" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-200/80">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold uppercase tracking-wider mb-3">
            <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
            <span>Client Feedback &amp; Experiences</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Trusted by Digital &amp; Affiliate Professionals
          </h2>
          <p className="mt-3 text-sm text-slate-500">
            Real feedback from professionals who have utilized our services and automation workflows.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((t, idx) => (
            <div
              key={idx}
              className="rounded-2xl bg-white border border-slate-200/90 p-6 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between text-left"
            >
              <div>
                {/* Star Ratings */}
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                  ))}
                  <span className="text-xs font-bold text-slate-500 ml-1.5">5.0</span>
                </div>

                {/* Testimonial Quote */}
                <p className="text-sm text-slate-700 leading-relaxed mb-6 font-medium">
                  &ldquo;{t.text}&rdquo;
                </p>
              </div>

              {/* Author Info */}
              <div className="pt-4 border-t border-slate-100 flex items-center gap-3">
                <div className="h-11 w-11 rounded-full overflow-hidden flex-shrink-0 border-2 border-purple-200 shadow-sm">
                  <Image
                    src={t.photo}
                    alt={t.name}
                    width={44}
                    height={44}
                    className="h-full w-full object-cover object-top"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-bold text-slate-900 truncate">{t.name}</h4>
                  <p className="text-xs text-slate-500 truncate">{t.role}</p>
                </div>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-purple-50 text-purple-700 border border-purple-200 whitespace-nowrap">
                  {t.tag}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CONTACT SECTION */}
      <section id="contact" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-200/80">
        <div className="max-w-4xl mx-auto rounded-3xl bg-gradient-to-tr from-purple-900 via-indigo-900 to-slate-900 text-white p-8 sm:p-12 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 -mt-10 -mr-10 w-72 h-72 bg-purple-500/20 blur-3xl rounded-full" />
          
          <div className="relative z-10 text-center max-w-2xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Ready to Upgrade Your Digital Operations?
            </h2>
            <p className="mt-4 text-purple-200 text-sm sm:text-base leading-relaxed">
              Connect with Pankaj Swami and the AdScale Zen team to explore tailored automations, WhatsApp systems, and performance solutions.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="https://wa.me/919166763655?text=Hello%20Pankaj%20Sir%2C%20I%20am%20interested%20in%20AdScale%20Zen%20services"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm shadow-lg shadow-emerald-500/25 transition-all"
              >
                <WhatsAppIcon className="h-5 w-5 fill-slate-950" />
                <span>WhatsApp 24/7 Support (+91 9166763655)</span>
              </a>
              <a
                href="tel:+919166763655"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-white text-slate-900 font-bold text-sm shadow-md hover:bg-slate-100 transition-colors"
              >
                <Phone className="h-4 w-4 text-purple-600" />
                <span>Call +91 9166763655</span>
              </a>
              <a
                href="mailto:adscalezenonline@gmail.com"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-purple-800/80 border border-purple-600/60 text-white font-semibold text-sm hover:bg-purple-800 transition-colors"
              >
                <Mail className="h-4 w-4 text-purple-300" />
                <span>adscalezenonline@gmail.com</span>
              </a>
            </div>

            <div className="mt-8 pt-6 border-t border-purple-800/60 flex items-center justify-center gap-6 text-xs text-purple-300">
              <Link href="/subscription" className="hover:underline">
                Explore Subscription Plans
              </Link>
              <span>•</span>
              <a
                href="https://chat.whatsapp.com/KabZOC7HKg02VWjPd4eav7"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline text-emerald-300 font-medium"
              >
                Join Official WhatsApp Community
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-slate-200 bg-white py-14 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 text-left">
          
          {/* Col 1: Brand & Description */}
          <div className="md:col-span-4">
            <div className="flex items-center gap-2.5 mb-3">
              <div className="relative h-9 w-9 rounded-lg overflow-hidden bg-slate-950 flex items-center justify-center border border-slate-800">
                {!logoError ? (
                  <Image
                    src="/adscalezen-logo.png"
                    alt="AdScale Zen Logo"
                    fill
                    className="object-contain p-0.5"
                    onError={() => setLogoError(true)}
                  />
                ) : (
                  <Zap className="h-4 w-4 text-purple-400" />
                )}
              </div>
              <span className="text-lg font-bold text-slate-900">AdScale Zen</span>
            </div>
            <p className="text-xs font-semibold text-purple-600 mb-3">
              Digital Growth • Automation • WhatsApp Solutions
            </p>
            <p className="text-xs text-slate-500 leading-relaxed max-w-sm">
              Helping businesses simplify marketing, automation and digital growth with practical technology solutions.
            </p>
          </div>

          {/* Col 2: Quick Links */}
          <div className="md:col-span-3">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3">
              Quick Links
            </div>
            <ul className="space-y-2 text-xs text-slate-600">
              <li>
                <Link href="/" className="hover:text-purple-600 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <a href="#services" className="hover:text-purple-600 transition-colors">
                  Services
                </a>
              </li>
              <li>
                <Link href="/about" className="hover:text-purple-600 transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/subscription" className="hover:text-purple-600 transition-colors">
                  Pricing
                </Link>
              </li>
              <li>
                <a href="#contact" className="hover:text-purple-600 transition-colors">
                  Contact Us
                </a>
              </li>
              <li>
                <Link href="/privacy-policy" className="hover:text-purple-600 transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/refund-policy" className="hover:text-purple-600 transition-colors">
                  Refund Policy
                </Link>
              </li>
              <li>
                <Link href="/terms-and-conditions" className="hover:text-purple-600 transition-colors">
                  Terms &amp; Conditions
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Direct Contact */}
          <div className="md:col-span-3">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3">
              Contact &amp; 24/7 Support
            </div>
            <ul className="space-y-2.5 text-xs text-slate-600">
              <li>
                <a
                  href="https://wa.me/919166763655?text=Hello%20Pankaj%20Sir%2C%20I%20am%20interested%20in%20AdScale%20Zen%20services"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-emerald-600 hover:text-emerald-700 transition-colors font-semibold"
                >
                  <WhatsAppIcon className="h-4 w-4 fill-emerald-600" />
                  <span>WhatsApp 24/7: +91 9166763655</span>
                </a>
              </li>
              <li>
                <a
                  href="tel:+919166763655"
                  className="inline-flex items-center gap-2 hover:text-purple-600 transition-colors font-medium"
                >
                  <Phone className="h-3.5 w-3.5 text-purple-600" />
                  <span>Call: +91 9166763655</span>
                </a>
              </li>
              <li>
                <a
                  href="mailto:adscalezenonline@gmail.com"
                  className="inline-flex items-center gap-2 hover:text-purple-600 transition-colors font-medium"
                >
                  <Mail className="h-3.5 w-3.5 text-purple-600" />
                  <span>adscalezenonline@gmail.com</span>
                </a>
              </li>
              <li className="text-[11px] text-slate-500 pt-1">
                Website: adscalezen.online
              </li>
            </ul>
          </div>

          {/* Col 4: Founder & Socials */}
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

            {/* Social Connect Icons */}
            <div className="mt-4">
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2">
                Connect With Us
              </div>
              <div className="flex items-center gap-2.5">
                {/* WhatsApp Logo */}
                <a
                  href="https://wa.me/919166763655?text=Hello%20Pankaj%20Sir%2C%20I%20am%20interested%20in%20AdScale%20Zen%20services"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="h-10 w-10 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white flex items-center justify-center shadow-sm shadow-emerald-500/20 hover:scale-110 transition-all duration-200"
                  aria-label="WhatsApp (+91 9166763655)"
                  title="WhatsApp: +91 9166763655"
                >
                  <WhatsAppIcon className="h-5 w-5 fill-white" />
                </a>

                {/* Instagram Logo */}
                <a
                  href="https://www.instagram.com/adscalezen?stkn=aXg1amNieXJuMjQ0"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="h-10 w-10 rounded-xl bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 hover:opacity-90 text-white flex items-center justify-center shadow-sm shadow-rose-500/20 hover:scale-110 transition-all duration-200"
                  aria-label="Instagram @adscalezen"
                  title="Instagram: @adscalezen"
                >
                  <InstagramIcon className="h-5 w-5 fill-white" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="max-w-7xl mx-auto mt-10 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            &copy; {new Date().getFullYear()} AdScale Zen. All rights reserved.
          </div>
          <div className="flex items-center gap-4">
            <Link href="/refund-policy" className="hover:text-slate-700 transition-colors">
              Refund Policy
            </Link>
            <span>•</span>
            <Link href="/privacy-policy" className="hover:text-slate-700 transition-colors">
              Privacy Policy
            </Link>
            <span>•</span>
            <Link href="/terms-and-conditions" className="hover:text-slate-700 transition-colors">
              Terms &amp; Conditions
            </Link>
          </div>
          {/* Bottom Social Badges */}
          <div className="flex items-center gap-2">
            <a
              href="https://wa.me/919166763655?text=Hello%20Pankaj%20Sir%2C%20I%20am%20interested%20in%20AdScale%20Zen%20services"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-semibold transition-colors text-xs border border-emerald-200"
            >
              <WhatsAppIcon className="h-4 w-4 fill-emerald-600" />
              <span>WhatsApp</span>
            </a>
            <a
              href="https://www.instagram.com/adscalezen?stkn=aXg1amNieXJuMjQ0"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 font-semibold transition-colors text-xs border border-rose-200"
            >
              <InstagramIcon className="h-4 w-4 fill-rose-600" />
              <span>Instagram</span>
            </a>
          </div>
        </div>
      </footer>

      {/* Floating 24/7 WhatsApp Support Widget */}
      <a
        href="https://wa.me/919166763655?text=Hello%20Pankaj%20Sir%2C%20I%20am%20interested%20in%20AdScale%20Zen%20services"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 group flex items-center gap-2.5 bg-emerald-500 hover:bg-emerald-600 text-white pl-3.5 pr-4 py-3 rounded-full shadow-2xl shadow-emerald-500/40 hover:scale-105 transition-all duration-200"
        aria-label="24/7 WhatsApp Support"
      >
        <div className="relative">
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-white rounded-full animate-ping" />
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-200 rounded-full" />
          <WhatsAppIcon className="h-6 w-6 fill-white" />
        </div>
        <div className="flex flex-col text-left">
          <span className="text-[10px] font-semibold leading-none text-emerald-100 uppercase tracking-wider">
            24/7 Support
          </span>
          <span className="text-xs font-bold leading-tight mt-0.5">
            Chat on WhatsApp
          </span>
        </div>
      </a>
    </div>
  );
}
