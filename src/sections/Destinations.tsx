import { motion, type Variants } from 'framer-motion';

const destinations = [
  { 
    name: 'Mwanza', 
    badge: '🏠 Home city', 
    desc: "Tanzania's second city on Lake Victoria. Rock formations, real markets, the place I grew up.", 
    bg: 'bg-[#2A4D3E]', // Deep Green
    cols: 'md:col-span-5', 
    rows: 'md:row-span-2' 
  },
  { 
    name: 'Zanzibar', 
    badge: '🌊 Must visit', 
    desc: "The most turquoise water you will ever see. Stone Town's history. Ocean light you never forget.", 
    bg: 'bg-[#1E4B65]', // Deep Teal/Blue
    cols: 'md:col-span-4', 
    rows: '' 
  },
  { 
    name: 'Kilimanjaro', 
    badge: '🏔 School trip', 
    desc: "Africa's highest peak. Moshi at its feet. The mountain that makes you feel small in the best way.", 
    bg: 'bg-[#4A3525]', // Deep Brown
    cols: 'md:col-span-3', 
    rows: '' 
  },
  { 
    name: 'Rwanda', 
    badge: '🌿 School trip', 
    desc: "The cleanest country in Africa. Rolling green hills and a resilience that moves you deeply.", 
    bg: 'bg-[#4A6B46]', // Olive Green
    cols: 'md:col-span-4', 
    rows: '' 
  },
  { 
    name: 'Dar es Salaam', 
    badge: '🌆 City life', 
    desc: "Tanzania's heartbeat. Coastal, chaotic, colourful, and completely, beautifully alive.", 
    bg: 'bg-[#5C3F26]', // Warm Brown
    cols: 'md:col-span-3', 
    rows: '' 
  },
];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const } }
};

export default function Destinations() {
  return (
    <section id="destinations" className="py-28 px-6 md:px-20 bg-[#faf8f4]">
      <div className="max-w-[600px] mb-12">
        <motion.p 
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="text-[11px] tracking-[0.2em] uppercase text-gold/90 mb-4 font-medium"
        >
          Places I know personally
        </motion.p>
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="font-serif text-[clamp(40px,6vw,56px)] font-light leading-[1.1] mb-6 text-green-deep"
        >
          Destinations
        </motion.h2>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="text-[15px] text-text-mid leading-[1.8] max-w-[480px]"
        >
          Not recommendations from a guidebook. Real places from real memories of growing up here.
        </motion.p>
      </div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-50px" }}
        className="grid grid-cols-1 md:grid-cols-12 gap-5 auto-rows-[260px]"
      >
        {destinations.map((dest) => (
          <motion.div
            key={dest.name}
            variants={cardVariants}
            className={`relative rounded-[24px] p-8 flex flex-col justify-end text-cream overflow-hidden hover:scale-[1.02] transition-transform duration-500 ease-out ${dest.bg} ${dest.cols} ${dest.rows}`}
          >
            <div className="relative z-10">
              <span className="inline-block px-3 py-1.5 text-[10px] uppercase tracking-wider font-medium border border-gold/40 text-gold/90 rounded-full mb-4 bg-black/10">
                {dest.badge}
              </span>
              <h3 className="font-serif text-[32px] md:text-[36px] font-light leading-none mb-3">
                {dest.name}
              </h3>
              <p className="text-[13px] text-cream/80 leading-[1.6]">
                {dest.desc}
              </p>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}