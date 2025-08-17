import React, { useState } from "react";
import { motion } from "framer-motion";
import { Phone, Mail, MapPin, CheckCircle2, ShieldCheck, Clock, Handshake, Home, Building2, Wallet, FileText } from "lucide-react";

// Tailwind is available. This is a single-file, production-ready landing page.
// Replace placeholders (name, NMLS, contact, address) before publishing.

export default function EddieMortgageLanding() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    loanType: "Conventional",
    purpose: "Purchase",
    credit: "680-739",
    timeline: "30-60 days",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  function update(k, v) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  function submit(e) {
    e.preventDefault();
    // Hook this to your backend or form service (Formspree, Airtable, Zapier, n8n, etc.)
    console.log("Lead:", form);
    setSubmitted(true);
  }

  const gradient = "bg-gradient-to-br from-zinc-900 via-slate-900 to-black";
  const card = "rounded-2xl shadow-xl border border-white/10 bg-white/5 backdrop-blur p-6";

  return (
    <div className={`min-h-screen text-white ${gradient}`}>
      {/* Top bar */}
      <header className="sticky top-0 z-50 bg-black/40 backdrop-blur supports-[backdrop-filter]:bg-black/40">
        <nav className="mx-auto max-w-7xl px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-cyan-500 grid place-content-center font-black">EH</div>
            <div className="leading-tight">
              <p className="text-sm tracking-widest text-white/70">REV-INSPIRED STYLE</p>
              <p className="font-semibold">Eddie Hernandez Mortgage</p>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm text-white/80">
            <a href="#programs" className="hover:text-white">Loan Programs</a>
            <a href="#service" className="hover:text-white">Why Eddie</a>
            <a href="#contact" className="hover:text-white">Contact</a>
          </div>
          <a href="#lead" className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 font-medium">Apply Now</a>
        </nav>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(80%_60%_at_70%_20%,rgba(34,211,238,0.18),transparent_60%)]" />
        <div className="mx-auto max-w-7xl px-4 py-20 grid lg:grid-cols-2 gap-10 items-center">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <p className="text-cyan-400 font-semibold tracking-widest">SAN ANTONIO • TEXAS</p>
            <h1 className="mt-3 text-5xl md:text-6xl font-black leading-[1.05]">
              Eddie <span className="text-cyan-400">Hernandez</span>
            </h1>
            <p className="mt-2 text-white/60">Loan Officer • NMLS #<span className="tabular-nums">XXXXX</span></p>
            <p className="mt-6 text-lg text-white/80 max-w-xl">
              Calm guidance. Precise execution. In-person service that actually shows up. From pre-approval to clear-to-close, I keep the process steady and the surprises at zero.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              {[
                { icon: ShieldCheck, label: "Transparent rates & fees" },
                { icon: Clock, label: "On-time closings" },
                { icon: Handshake, label: "Face-to-face care" },
              ].map((i, idx) => (
                <div key={idx} className={`${card} flex items-center gap-3 pr-8"`}>
                  <i.icon className="h-5 w-5 text-cyan-400" />
                  <span className="text-sm text-white/90">{i.label}</span>
                </div>
              ))}
            </div>
            <div className="mt-10 flex gap-4">
              <a href="#lead" className="px-5 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 font-semibold">Start pre-approval</a>
              <a href="#contact" className="px-5 py-3 rounded-xl border border-white/20 hover:border-white/40">Talk to Eddie</a>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.05 }} className="">
            <div className="relative">
              <div className="absolute -inset-1 bg-cyan-500/20 blur-3xl rounded-3xl" />
              <div className="relative rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
                {/* Replace with Eddie's real photo */}
                <div className="aspect-[4/5] bg-[url('https://images.unsplash.com/photo-1544723795-3fb6469f5b39?q=80&w=1200&auto=format&fit=crop')] bg-cover bg-center" />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Why Eddie */}
      <section id="service" className="mx-auto max-w-7xl px-4 pb-10">
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { icon: Handshake, title: "In‑Person Service", body: "Available to meet, tour properties, and sit down to build a plan that fits your real life." },
            { icon: FileText, title: "File Mastery", body: "Clean documentation up front. Fewer conditions. Smoother underwriting." },
            { icon: ShieldCheck, title: "No Games", body: "Straight numbers, plain English, and rate options explained the way you'd explain them to family." },
          ].map((b, idx) => (
            <div key={idx} className={`${card} min-h-[180px]`}>
              <b.icon className="h-6 w-6 text-cyan-400" />
              <h3 className="mt-4 text-xl font-semibold">{b.title}</h3>
              <p className="mt-2 text-white/70 text-sm leading-relaxed">{b.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Programs */}
      <section id="programs" className="py-6">
        <div className="mx-auto max-w-7xl px-4">
          <div className="mb-6 flex items-end justify-between">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold">Loan Programs</h2>
              <p className="text-white/60 mt-2">Options for first‑time buyers, veterans, rural loans, and high‑balance.</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { icon: Home, name: "Conventional", bullets: ["Best for strong credit and down payment", "Low PMI with 20% down or removal when eligible"] },
              { icon: Building2, name: "FHA", bullets: ["Flexible credit", "3.5% down payment"] },
              { icon: ShieldCheck, name: "VA", bullets: ["Zero down for eligible veterans", "No monthly mortgage insurance"] },
              { icon: MapPin, name: "USDA", bullets: ["Zero down in eligible rural areas", "Income and location limits"] },
              { icon: Wallet, name: "Jumbo", bullets: ["High‑balance financing", "Competitive structures for strong files"] },
              { icon: FileText, name: "Bank Statement", bullets: ["Self‑employed income alternatives", "12–24 mo statements"] },
              { icon: FileText, name: "DSCR / Investor", bullets: ["Qualify on property cashflow", "Great for rentals & BRRRR"] },
              { icon: WrenchIcon, name: "Renovation 203k/HomeStyle", bullets: ["Finance purchase + rehab", "One loan, one close"] },
            ].map((p, idx) => (
              <div key={idx} className={`${card}`}>
                <div className="flex items-center gap-3">
                  <p.icon className="h-6 w-6 text-cyan-400" />
                  <h3 className="text-lg font-semibold">{p.name}</h3>
                </div>
                <ul className="mt-3 space-y-2 text-sm text-white/75">
                  {p.bullets.map((b, i) => (
                    <li key={i} className="flex gap-2"><CheckCircle2 className="h-4 w-4 mt-0.5 text-cyan-400" />{b}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Lead + Contact */}
      <section id="lead" className="py-16">
        <div className="mx-auto max-w-7xl px-4 grid lg:grid-cols-2 gap-8 items-start">
          <div className={`${card}`}>
            <h3 className="text-2xl font-bold">Get pre‑approved</h3>
            <p className="text-white/70 mt-2 text-sm">Answer a few questions. Eddie will follow up quickly with exact next steps.</p>

            {submitted ? (
              <div className="mt-6 rounded-xl border border-cyan-500/40 bg-cyan-500/10 p-6">
                <p className="font-semibold">Got it.</p>
                <p className="text-white/70 text-sm mt-1">Your info is saved. Expect a call or email shortly.</p>
              </div>
            ) : (
              <form onSubmit={submit} className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <input className="col-span-1 md:col-span-2 bg-black/20 border border-white/15 rounded-xl px-4 py-3 outline-none focus:border-cyan-400" placeholder="Full name" required value={form.name} onChange={(e)=>update("name", e.target.value)} />
                <input className="bg-black/20 border border-white/15 rounded-xl px-4 py-3 outline-none focus:border-cyan-400" placeholder="Email" type="email" required value={form.email} onChange={(e)=>update("email", e.target.value)} />
                <input className="bg-black/20 border border-white/15 rounded-xl px-4 py-3 outline-none focus:border-cyan-400" placeholder="Phone" required value={form.phone} onChange={(e)=>update("phone", e.target.value)} />

                <select className="bg-black/20 border border-white/15 rounded-xl px-4 py-3 outline-none focus:border-cyan-400" value={form.loanType} onChange={(e)=>update("loanType", e.target.value)}>
                  {["Conventional","FHA","VA","USDA","Jumbo","Bank Statement","DSCR / Investor","Renovation"].map(o=> <option key={o}>{o}</option>)}
                </select>
                <select className="bg-black/20 border border-white/15 rounded-xl px-4 py-3 outline-none focus:border-cyan-400" value={form.purpose} onChange={(e)=>update("purpose", e.target.value)}>
                  {["Purchase","Refinance","Cash‑out Refi"].map(o=> <option key={o}>{o}</option>)}
                </select>

                <select className="bg-black/20 border border-white/15 rounded-xl px-4 py-3 outline-none focus:border-cyan-400" value={form.credit} onChange={(e)=>update("credit", e.target.value)}>
                  {["740+","680-739","620-679","<620"].map(o=> <option key={o}>{o}</option>)}
                </select>
                <select className="bg-black/20 border border-white/15 rounded-xl px-4 py-3 outline-none focus:border-cyan-400" value={form.timeline} onChange={(e)=>update("timeline", e.target.value)}>
                  {["Ready now","30-60 days","60-90 days","Just researching"].map(o=> <option key={o}>{o}</option>)}
                </select>

                <textarea className="col-span-1 md:col-span-2 bg-black/20 border border-white/15 rounded-xl px-4 py-3 outline-none focus:border-cyan-400 min-h-[110px]" placeholder="Tell me what you’re trying to do…" value={form.message} onChange={(e)=>update("message", e.target.value)} />

                <button type="submit" className="col-span-1 md:col-span-2 px-5 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 font-semibold">Send</button>
              </form>
            )}
          </div>

          <div id="contact" className="space-y-5">
            <div className={`${card}`}>
              <h3 className="text-2xl font-bold">Contact</h3>
              <div className="mt-4 space-y-3 text-white/80">
                <p className="flex items-center gap-3"><Phone className="h-5 w-5 text-cyan-400" /><a href="tel:2100000000" className="hover:underline">(210) 000-0000</a></p>
                <p className="flex items-center gap-3"><Mail className="h-5 w-5 text-cyan-400" /><a href="mailto:eddie@example.com" className="hover:underline">eddie@example.com</a></p>
                <p className="flex items-center gap-3"><MapPin className="h-5 w-5 text-cyan-400" />San Antonio, TX</p>
              </div>
              <div className="mt-6 text-xs text-white/50">
                <p>Equal Housing Lender. NMLS Consumer Access.</p>
                <p>Company and licensing details go here. Replace placeholder data before publishing.</p>
              </div>
            </div>

            <div className={`${card}`}>
              <h4 className="font-semibold">Documents you may need</h4>
              <ul className="mt-3 space-y-2 text-sm text-white/75">
                {[
                  "Last 30 days of pay stubs",
                  "Last 2 years W‑2s or 1099s",
                  "2 most recent bank statements",
                  "Photo ID"
                ].map((t,i)=> (
                  <li key={i} className="flex gap-2"><CheckCircle2 className="h-4 w-4 mt-0.5 text-cyan-400" />{t}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10">
        <div className="mx-auto max-w-7xl px-4 py-10 text-sm text-white/60 grid md:grid-cols-3 gap-6">
          <div>
            <p className="font-semibold text-white">Eddie Hernandez Mortgage</p>
            <p className="mt-2">NMLS #XXXXX • Company NMLS #YYYYY</p>
          </div>
          <div className="space-y-1">
            <a href="#programs" className="block hover:text-white">Programs</a>
            <a href="#service" className="block hover:text-white">Why Eddie</a>
            <a href="#lead" className="block hover:text-white">Apply</a>
          </div>
          <div className="text-white/50">
            <p>© {new Date().getFullYear()} Eddie Hernandez. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

// Minimal inline icon to avoid extra deps for renovation programs
function WrenchIcon(props){
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={props.className}>
      <path d="M14.7 6.3a4 4 0 1 0-5.657 5.657l.707.707-6.364 6.364a2 2 0 1 0 2.828 2.828l6.364-6.364.707.707A4 4 0 1 0 14.7 6.3z" />
    </svg>
  );
}
