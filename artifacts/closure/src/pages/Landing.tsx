import { motion } from "framer-motion";
import { Link } from "wouter";

export default function Landing() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center pt-24 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src={`${import.meta.env.BASE_URL}hero.png`} 
            alt="Warm glowing candlelight on old parchment" 
            className="w-full h-full object-cover opacity-60 dark:opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/60 to-background" />
        </div>
        
        <div className="relative z-10 max-w-3xl mx-auto px-6 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="text-5xl md:text-7xl font-serif text-foreground leading-tight mb-6"
          >
            A quiet place for <br className="hidden md:block" /> unfinished feelings.
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
            className="text-lg md:text-xl text-muted-foreground mb-12 max-w-xl mx-auto font-sans font-light leading-relaxed"
          >
            Package up grief, gratitude, love, or anger. Choose whether to seal it away, save it for later, or let it go completely.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut", delay: 0.6 }}
          >
            <Link 
              href="/create" 
              className="inline-flex items-center justify-center px-8 py-4 text-lg font-medium bg-primary text-primary-foreground rounded hover:bg-primary/90 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
            >
              Begin a new box
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="py-32 bg-background border-t border-border/30">
        <div className="max-w-4xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-3xl md:text-4xl font-serif text-foreground mb-6">
                Not every story gets a neat ending.
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Closure is a personal ritual space. It is not a social network. It is not a messaging app. It is a private sanctuary where you can write the letter you never sent, say the goodbye you were denied, or preserve a memory you are afraid to lose.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Take your time. Breathe. There is no rush here.
              </p>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative aspect-[3/4] rounded-lg overflow-hidden shadow-2xl"
            >
              <img 
                src={`${import.meta.env.BASE_URL}sealed-box.png`} 
                alt="A sealed wooden box" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 ring-1 ring-inset ring-black/10 rounded-lg" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-32 bg-muted/30">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-serif text-center text-foreground mb-20">
            The Ritual
          </h2>
          
          <div className="grid md:grid-cols-3 gap-12">
            {[
              {
                step: "01",
                title: "Set an intention",
                desc: "Choose what you are carrying—be it heavy grief, quiet gratitude, or lingering anger."
              },
              {
                step: "02",
                title: "Pour it out",
                desc: "Write your letter. Attach a voice note or a photograph. Make it as raw as it needs to be."
              },
              {
                step: "03",
                title: "Choose its fate",
                desc: "Seal it away forever, lock it until a future date, or release it entirely into the void."
              }
            ].map((item, i) => (
              <motion.div 
                key={item.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.2 }}
                className="text-center"
              >
                <div className="text-sm font-mono text-primary/60 mb-4">{item.step}</div>
                <h3 className="text-xl font-serif text-foreground mb-3">{item.title}</h3>
                <p className="text-muted-foreground">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-32 bg-background text-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-2xl mx-auto"
        >
          <h2 className="text-3xl md:text-4xl font-serif text-foreground mb-8">
            Whenever you are ready.
          </h2>
          <Link 
            href="/create" 
            className="inline-flex items-center justify-center px-8 py-4 text-lg font-medium border border-border text-foreground hover:bg-muted transition-colors rounded"
          >
            Create your first box
          </Link>
        </motion.div>
      </section>
    </div>
  );
}
