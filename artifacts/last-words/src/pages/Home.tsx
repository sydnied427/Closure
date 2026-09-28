import React from 'react';
import { motion } from 'framer-motion';
import { PenLine, Send, Lock } from 'lucide-react';
import { useLocation } from 'wouter';
import { NoiseBackground } from '@/components/NoiseBackground';
import { AnimatedSection } from '@/components/AnimatedSection';
import { WaitlistForm } from '@/components/WaitlistForm';
import { trackEvent } from '@/lib/analytics';

export default function Home() {
  const [, navigate] = useLocation();

  const scrollToWaitlist = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    document.getElementById('waitlist')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen relative overflow-x-hidden selection:bg-primary/20">
      <NoiseBackground />

      {/* Navigation / Header */}
      <header className="absolute top-0 w-full z-10 px-6 py-8 flex justify-between items-center max-w-7xl mx-auto left-0 right-0">
        <div className="font-serif text-xl font-medium tracking-tight text-foreground">
          Last Words.
        </div>
        <a 
          href="#waitlist" 
          onClick={scrollToWaitlist}
          className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          Join Waitlist
        </a>
      </header>

      <main>
        {/* Hero Section */}
        <section className="relative w-full min-h-[90vh] flex flex-col justify-center items-center px-6 pt-20">
          <div className="max-w-4xl mx-auto text-center">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-serif text-foreground leading-[1.1] tracking-tight mb-6"
            >
              Say what you never <br className="hidden md:block" /> got to say.
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
              className="text-lg md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed mb-12 font-light"
            >
              A private space for the words you've been carrying since you lost them.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            >
              <button
                 onClick={() => { trackEvent('letter_started', { location: 'hero' }); navigate("/write"); }}
                className="inline-flex h-14 items-center justify-center rounded-md bg-primary px-8 text-lg font-serif font-medium text-primary-foreground shadow-lg hover:shadow-xl hover:bg-primary/90 hover:-translate-y-0.5 transition-all duration-300"
              >
                Write Your First Letter
              </button>
            </motion.div>
          </div>
        </section>

        {/* The Why Section */}
        <AnimatedSection className="max-w-3xl text-center py-32 md:py-48">
          <p className="font-serif text-2xl md:text-4xl text-foreground leading-relaxed md:leading-relaxed">
            "Most of us leave funerals with something still on our lips. A thank you. An apology. A memory we never shared. <span className="text-primary italic">Last Words</span> exists for those moments."
          </p>
        </AnimatedSection>

        {/* How It Works */}
        <section className="bg-card/50 border-y border-border/50">
          <AnimatedSection className="py-24 md:py-32">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
              {[
                {
                  icon: PenLine,
                  title: "Write your letter",
                  desc: "Take your time. There is no right way to do this. Just put down what you need to say."
                },
                {
                  icon: Send,
                  title: "Address it to them",
                  desc: "Create a dedicated space for the person you've lost, a private memorial of words."
                },
                {
                  icon: Lock,
                  title: "Keep it private",
                  desc: "Your letters remain yours. Completely private, secure, and ready whenever you need to return."
                }
              ].map((step, i) => (
                <div key={i} className="flex flex-col items-center text-center group">
                  <div className="w-16 h-16 rounded-2xl bg-background border border-border/60 flex items-center justify-center mb-6 shadow-sm group-hover:border-primary/30 group-hover:shadow-md transition-all duration-500">
                    <step.icon className="w-7 h-7 text-muted-foreground group-hover:text-primary transition-colors duration-500" strokeWidth={1.5} />
                  </div>
                  <h3 className="font-serif text-xl text-foreground mb-3">{step.title}</h3>
                  <p className="text-muted-foreground leading-relaxed max-w-xs">{step.desc}</p>
                </div>
              ))}
            </div>
          </AnimatedSection>
        </section>

        {/* Pull Quote */}
        <section className="bg-[#EBE4D5] relative overflow-hidden">
          {/* Subtle overlay noise just for this section to make it feel distinct */}
          <div className="absolute inset-0 bg-noise opacity-10 mix-blend-multiply pointer-events-none" />
          <AnimatedSection className="py-32 md:py-48 text-center relative z-10">
            <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-foreground leading-tight tracking-tight max-w-4xl mx-auto">
              For the conversation that didn't get to happen.
            </h2>
          </AnimatedSection>
        </section>

        {/* Features */}
        <AnimatedSection className="py-24 md:py-32">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              {
                title: "Completely Private",
                desc: "Your letters belong to you alone. Nothing leaves this space unless you decide it should. No one can read what you've written."
              },
              {
                title: "Beautifully Simple",
                desc: "A clean, quiet space to write. No distractions, no features competing for attention. Just you, and the words you need to say."
              },
              {
                title: "Yours to Keep",
                desc: "Return whenever you need to. Add to what you've written. Reread it years later. These words will wait for you."
              }
            ].map((feature, i) => (
              <div key={i} className="border-t border-border/60 pt-8">
                <h3 className="font-serif text-2xl text-foreground mb-4">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </AnimatedSection>

        {/* Waitlist CTA */}
        <AnimatedSection id="waitlist" className="py-32 md:py-40 text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="font-serif text-3xl md:text-5xl text-foreground mb-6">
              You don't have to keep carrying it alone.
            </h2>
            <p className="text-muted-foreground text-lg mb-8">
              We are currently in private beta, opening spaces slowly to ensure the platform remains a quiet, beautiful place.
            </p>
            <WaitlistForm />
          </div>
        </AnimatedSection>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/60 py-12 px-6">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center space-x-2">
            <span className="font-serif text-lg font-medium text-foreground">Last Words.</span>
          </div>
          <p className="text-muted-foreground text-sm">
            For the words you never got to say.
          </p>
          <div className="text-muted-foreground text-sm">
            &copy; {new Date().getFullYear()}
          </div>
        </div>
      </footer>
    </div>
  );
}
