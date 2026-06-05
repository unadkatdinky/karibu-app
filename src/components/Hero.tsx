import { motion, useScroll, useTransform } from 'framer-motion';

export default function Hero() {
  const { scrollY } = useScroll();
  const yBackground = useTransform(scrollY, [0, 1000], [0, 300]);

  return (
    <section className="relative h-screen flex items-center overflow-hidden bg-green-deep">
      {/* Background Gradient & Parallax Image */}
      <motion.div 
        style={{ y: yBackground }}
        className="absolute inset-0 z-0 bg-[linear-gradient(160deg,rgba(75,107,92,0.9)_0%,rgba(45,74,62,0.8)_50%,rgba(28,58,46,0.9)_100%),url('https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=1800&q=80')] bg-center bg-cover bg-no-repeat"
        initial={{ scale: 1.05 }}
        animate={{ scale: 1 }}
        transition={{ duration: 8, ease: "easeOut" }}
      />
      <div className="absolute inset-0 z-[1] bg-[radial-gradient(circle_at_60%_50%,rgba(212,168,83,0.15)_0%,transparent_60%)]" />

      {/* Main Content */}
      <div className="relative z-10 px-6 md:px-20 max-w-[800px] w-full">
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="text-[10px] md:text-[11px] tracking-[0.25em] uppercase text-gold mb-6"
        >
          East Africa — through the eyes of someone who grew up there
        </motion.p>
        
        <motion.h1 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.5 }}
          className="font-serif text-[clamp(64px,10vw,120px)] font-light leading-none text-cream mb-6 drop-shadow-sm"
        >
          Karibu<br/>
          <em className="text-gold italic drop-shadow-sm">Tanzania</em>
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="text-[15px] md:text-[17px] text-cream/90 leading-relaxed max-w-[500px] mb-10"
        >
          Not a tourist guide. A personal journey through the places, people, and language of a place I called home for 17 years.
        </motion.p>

        {/* The Buttons */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9 }}
          className="flex flex-wrap gap-4 items-center"
        >
          <a 
            href="#destinations" 
            className="bg-[#C4522A] hover:bg-[#A34220] text-cream px-8 py-3.5 rounded-full text-[13px] font-medium tracking-wide transition-all duration-300 shadow-[0_8px_20px_rgba(196,82,42,0.3)] hover:-translate-y-1 hover:shadow-[0_12px_25px_rgba(196,82,42,0.4)]"
          >
            Explore East Africa →
          </a>
          <a 
            href="#about" 
            className="bg-transparent border border-cream/30 text-cream hover:bg-cream/10 px-8 py-3.5 rounded-full text-[13px] font-medium tracking-wide transition-all duration-300 hover:-translate-y-1"
          >
            My Story
          </a>
        </motion.div>
      </div>
    </section>
  );
}