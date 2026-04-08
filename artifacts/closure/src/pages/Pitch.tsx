import { useState, useEffect, useCallback } from "react";
import { Link } from "wouter";

const slides = [
  { id: 1 },
  { id: 2 },
  { id: 3 },
  { id: 4 },
  { id: 5 },
  { id: 6 },
  { id: 7 },
  { id: 8 },
];

const TOTAL = slides.length;

function Slide1() {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center px-8 max-w-3xl mx-auto">
      <p className="text-sm uppercase tracking-[0.25em] text-[#8a7060] mb-10 font-medium">A product for humanity</p>
      <h1 className="font-serif text-6xl md:text-7xl lg:text-8xl text-[#2c2420] leading-[1.05] mb-10">
        There are words you never got to say.
      </h1>
      <p className="text-[#6b5a50] text-xl md:text-2xl font-light leading-relaxed max-w-2xl">
        To someone who died. Someone who left. Someone you stopped speaking to. Someone you never thanked.
      </p>
      <div className="mt-20 flex flex-col items-center gap-3">
        <span className="font-serif text-2xl tracking-wide text-[#2c2420]">Closure</span>
        <span className="text-sm text-[#8a7060] tracking-widest uppercase">Your final say.</span>
      </div>
    </div>
  );
}

function Slide2() {
  const stats = [
    {
      stat: "1 in 3",
      label: "people report unresolved grief from unsaid words",
    },
    {
      stat: "∞",
      label: "Breakups, estrangements, and loss leave emotional weight that has nowhere to go",
    },
    {
      stat: "0",
      label: "tools exist between therapy and a notes app that feel like a ritual",
    },
  ];
  return (
    <div className="flex flex-col items-center justify-center h-full text-center px-8 max-w-4xl mx-auto">
      <p className="text-sm uppercase tracking-[0.25em] text-[#8a7060] mb-6 font-medium">The Problem</p>
      <h2 className="font-serif text-5xl md:text-6xl text-[#2c2420] mb-16 leading-tight">
        Unfinished conversations don't disappear.
      </h2>
      <div className="grid md:grid-cols-3 gap-6 w-full">
        {stats.map((s, i) => (
          <div
            key={i}
            className="bg-[#f5f0eb] border border-[#e0d8d1] rounded-xl p-8 flex flex-col items-center gap-4"
          >
            <span className="font-serif text-4xl text-[#8a7060]">{s.stat}</span>
            <p className="text-[#5a4a40] text-sm leading-relaxed">{s.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function Slide3() {
  const steps = [
    { num: "01", label: "Choose Intention" },
    { num: "02", label: "Write" },
    { num: "03", label: "Create" },
    { num: "04", label: "Choose Fate" },
    { num: "05", label: "Seal" },
  ];
  return (
    <div className="flex flex-col items-center justify-center h-full text-center px-8 max-w-4xl mx-auto">
      <p className="text-sm uppercase tracking-[0.25em] text-[#8a7060] mb-6 font-medium">The Solution</p>
      <h2 className="font-serif text-5xl md:text-6xl text-[#2c2420] mb-6 leading-tight">
        Closure is a private ritual<br />for unfinished feelings.
      </h2>
      <p className="text-[#6b5a50] text-lg mb-16 font-light">Five steps. No judgment. No audience.</p>
      <div className="flex items-start justify-center gap-0 w-full overflow-x-auto pb-2">
        {steps.map((s, i) => (
          <div key={i} className="flex items-center">
            <div className="flex flex-col items-center gap-3 min-w-[120px]">
              <div className="w-14 h-14 rounded-full bg-[#8a7060] flex items-center justify-center text-[#faf8f5] font-serif text-lg">
                {s.num}
              </div>
              <span className="text-[#2c2420] text-sm font-medium leading-tight text-center px-2">{s.label}</span>
            </div>
            {i < steps.length - 1 && (
              <div className="w-12 h-px bg-[#c5b8ae] -mt-8 flex-shrink-0" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function Slide4() {
  const features = [
    {
      title: "Guided emotional prompts",
      desc: "The wizard walks you through what you feel and why, one step at a time.",
    },
    {
      title: "4 visual themes",
      desc: "Classic, Modern, Dark, and Floral — your box, your aesthetic.",
    },
    {
      title: "Seal, time capsule, or release",
      desc: "Choose your fate: keep it sealed, set a future date to open it, or let it go.",
    },
    {
      title: "Persistent archive with sign-in",
      desc: "Sign in to save boxes forever and access them from any device.",
    },
  ];
  return (
    <div className="flex flex-col items-center justify-center h-full text-center px-8 max-w-4xl mx-auto">
      <p className="text-sm uppercase tracking-[0.25em] text-[#8a7060] mb-6 font-medium">The Product</p>
      <h2 className="font-serif text-5xl md:text-6xl text-[#2c2420] mb-14 leading-tight">
        Not just a text box. A ritual.
      </h2>
      <div className="grid md:grid-cols-2 gap-6 w-full text-left">
        {features.map((f, i) => (
          <div key={i} className="bg-[#f5f0eb] border border-[#e0d8d1] rounded-xl p-7">
            <h3 className="font-serif text-xl text-[#2c2420] mb-2">{f.title}</h3>
            <p className="text-[#6b5a50] text-sm leading-relaxed font-light">{f.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function Slide5() {
  const intentions = [
    { name: "Grief", desc: "Words you never got to say before someone was gone." },
    { name: "Gratitude", desc: "Thank someone you never properly thanked." },
    { name: "Love", desc: "A feeling that never had its moment." },
    { name: "Anger", desc: "What you held back to keep the peace." },
    { name: "Forgiveness", desc: "Release what you've been carrying too long." },
    { name: "Estrangement", desc: "For the ones you chose to leave behind." },
  ];
  return (
    <div className="flex flex-col items-center justify-center h-full text-center px-8 max-w-4xl mx-auto">
      <p className="text-sm uppercase tracking-[0.25em] text-[#8a7060] mb-6 font-medium">Who It's For</p>
      <h2 className="font-serif text-5xl md:text-6xl text-[#2c2420] mb-12 leading-tight">
        Everyone carries something unsaid.
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 w-full">
        {intentions.map((item, i) => (
          <div key={i} className="bg-[#f5f0eb] border border-[#e0d8d1] rounded-xl p-6 text-left">
            <h3 className="font-serif text-lg text-[#2c2420] mb-1">{item.name}</h3>
            <p className="text-[#8a7060] text-xs leading-relaxed font-light">{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function Slide6() {
  const numbers = [
    { value: "$240B", label: "Global mental wellness market" },
    { value: "500M+", label: "Active journaling and self-help app users" },
    { value: "73%", label: "People who've experienced unresolved grief" },
  ];
  return (
    <div className="flex flex-col items-center justify-center h-full text-center px-8 max-w-4xl mx-auto">
      <p className="text-sm uppercase tracking-[0.25em] text-[#8a7060] mb-6 font-medium">The Market</p>
      <h2 className="font-serif text-5xl md:text-6xl text-[#2c2420] mb-16 leading-tight">
        The market for emotional processing is massive.
      </h2>
      <div className="grid md:grid-cols-3 gap-8 w-full">
        {numbers.map((n, i) => (
          <div key={i} className="flex flex-col items-center gap-4">
            <span className="font-serif text-6xl md:text-7xl text-[#8a7060]">{n.value}</span>
            <div className="w-8 h-px bg-[#c5b8ae]" />
            <p className="text-[#5a4a40] text-sm font-light leading-relaxed max-w-[180px]">{n.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function Slide7() {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center px-8 max-w-4xl mx-auto">
      <p className="text-sm uppercase tracking-[0.25em] text-[#8a7060] mb-6 font-medium">Business Model</p>
      <h2 className="font-serif text-5xl md:text-6xl text-[#2c2420] mb-14 leading-tight">
        Free to feel. Pro to preserve.
      </h2>
      <div className="grid md:grid-cols-2 gap-6 w-full mb-10 text-left">
        <div className="bg-[#f5f0eb] border border-[#e0d8d1] rounded-xl p-8">
          <div className="flex items-baseline gap-3 mb-5">
            <span className="font-serif text-2xl text-[#2c2420]">Free</span>
            <span className="text-[#8a7060] text-sm">forever</span>
          </div>
          <ul className="space-y-3 text-[#5a4a40] text-sm font-light">
            <li className="flex items-start gap-2"><span className="text-[#8a7060] mt-0.5">✦</span> Text letters</li>
            <li className="flex items-start gap-2"><span className="text-[#8a7060] mt-0.5">✦</span> Seal or release</li>
            <li className="flex items-start gap-2"><span className="text-[#8a7060] mt-0.5">✦</span> 1 closure box</li>
          </ul>
        </div>
        <div className="bg-[#2c2420] border border-[#2c2420] rounded-xl p-8 text-[#faf8f5]">
          <div className="flex items-baseline gap-3 mb-5">
            <span className="font-serif text-2xl">Pro</span>
            <span className="text-[#c5b8ae] text-sm">$4.99 / month</span>
          </div>
          <ul className="space-y-3 text-[#d4c8c0] text-sm font-light">
            <li className="flex items-start gap-2"><span className="text-[#c5a882] mt-0.5">✦</span> Voice notes, video, photos</li>
            <li className="flex items-start gap-2"><span className="text-[#c5a882] mt-0.5">✦</span> Time capsules</li>
            <li className="flex items-start gap-2"><span className="text-[#c5a882] mt-0.5">✦</span> Unlimited boxes</li>
            <li className="flex items-start gap-2"><span className="text-[#c5a882] mt-0.5">✦</span> Persistent archive</li>
          </ul>
        </div>
      </div>
      <p className="text-[#8a7060] text-sm font-light">
        Future: therapy platform partnerships — BetterHelp, Calm, and beyond.
      </p>
    </div>
  );
}

function Slide8() {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center px-8 max-w-2xl mx-auto">
      <p className="text-sm uppercase tracking-[0.25em] text-[#8a7060] mb-10 font-medium">The Founder</p>
      <h2 className="font-serif text-5xl md:text-6xl text-[#2c2420] mb-12 leading-tight">Why me.</h2>
      <p className="text-[#5a4a40] text-xl md:text-2xl font-light leading-relaxed mb-8">
        I'm Sydnie Dorleus — a chemical engineering student, builder, and someone who has her own unsaid words.
      </p>
      <p className="text-[#5a4a40] text-xl md:text-2xl font-light leading-relaxed mb-16">
        I built Closure in one week because I needed it to exist. The pages in my journal are why this app is real.
      </p>
      <div className="w-16 h-px bg-[#c5b8ae] mb-8" />
      <p className="text-[#8a7060] text-sm tracking-wide">
        Built for the Replit Agent 4 Buildathon. April 2026.
      </p>
    </div>
  );
}

const slideComponents = [Slide1, Slide2, Slide3, Slide4, Slide5, Slide6, Slide7, Slide8];

export default function Pitch() {
  const [current, setCurrent] = useState(0);
  const [transitioning, setTransitioning] = useState(false);

  const goTo = useCallback(
    (next: number) => {
      if (transitioning || next === current) return;
      if (next < 0 || next >= TOTAL) return;
      setTransitioning(true);
      setTimeout(() => {
        setCurrent(next);
        setTransitioning(false);
      }, 300);
    },
    [current, transitioning]
  );

  const prev = useCallback(() => goTo(current - 1), [current, goTo]);
  const next = useCallback(() => goTo(current + 1), [current, goTo]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === "ArrowDown") next();
      if (e.key === "ArrowLeft" || e.key === "ArrowUp") prev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [next, prev]);

  const SlideContent = slideComponents[current];

  return (
    <div
      className="fixed inset-0 flex flex-col overflow-hidden"
      style={{ background: "#faf8f5", fontFamily: "inherit" }}
    >
      {/* Back link */}
      <div className="absolute top-6 left-6 z-20">
        <Link
          href="/"
          className="text-sm text-[#8a7060] hover:text-[#2c2420] transition-colors flex items-center gap-1.5"
        >
          ← Back to Closure
        </Link>
      </div>

      {/* Slide content */}
      <div
        className="flex-1 flex items-center justify-center"
        style={{
          opacity: transitioning ? 0 : 1,
          transition: "opacity 300ms ease",
        }}
      >
        <SlideContent />
      </div>

      {/* Left arrow */}
      <button
        onClick={prev}
        disabled={current === 0}
        className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-full border border-[#d4c8c0] bg-[#faf8f5]/80 backdrop-blur-sm text-[#8a7060] hover:text-[#2c2420] hover:border-[#8a7060] transition-all disabled:opacity-20 disabled:cursor-not-allowed z-20"
        aria-label="Previous slide"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M15 18l-6-6 6-6" />
        </svg>
      </button>

      {/* Right arrow */}
      <button
        onClick={next}
        disabled={current === TOTAL - 1}
        className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-full border border-[#d4c8c0] bg-[#faf8f5]/80 backdrop-blur-sm text-[#8a7060] hover:text-[#2c2420] hover:border-[#8a7060] transition-all disabled:opacity-20 disabled:cursor-not-allowed z-20"
        aria-label="Next slide"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 18l6-6-6-6" />
        </svg>
      </button>

      {/* Dot navigation */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2 z-20">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className="transition-all"
            style={{
              width: i === current ? 20 : 6,
              height: 6,
              borderRadius: 3,
              background: i === current ? "#8a7060" : "#c5b8ae",
              transition: "all 300ms ease",
              border: "none",
              cursor: "pointer",
              padding: 0,
            }}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>

      {/* Slide counter */}
      <div className="absolute bottom-6 right-6 z-20">
        <span className="text-xs text-[#8a7060] font-mono tabular-nums">
          {current + 1}/{TOTAL}
        </span>
      </div>
    </div>
  );
}
