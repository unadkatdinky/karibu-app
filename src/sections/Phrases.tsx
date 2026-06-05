import { motion, type Variants } from 'framer-motion';

const phrases = [
  { sw: 'Karibu', en: 'Welcome', fr: 'Bienvenue', pron: 'kah-REE-boo' },
  { sw: 'Asante sana', en: 'Thank you very much', fr: 'Merci beaucoup', pron: 'ah-SAHN-teh SAH-nah' },
  { sw: 'Habari yako?', en: 'How are you?', fr: 'Comment vas-tu?', pron: 'hah-BAH-ree YAH-koh' },
  { sw: 'Pole pole', en: 'Slowly / Take it easy', fr: 'Doucement', pron: 'POH-leh POH-leh' },
  { sw: 'Hakuna matata', en: 'No worries', fr: 'Pas de souci', pron: 'hah-KOO-nah mah-TAH-tah' },
  { sw: 'Samahani', en: 'Sorry / Excuse me', fr: 'Excusez-moi', pron: 'sah-mah-HAH-nee' },
  { sw: 'Kwaheri', en: 'Goodbye', fr: 'Au revoir', pron: 'kwah-HEH-ree' },
  { sw: 'Nakupenda', en: 'I love you', fr: 'Je t\'aime', pron: 'nah-koo-PEN-dah' },
];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.05 }
  }
};

const cardVariants: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const } }
};

export default function Phrases() {
  return (
    <section id="phrases" className="py-32 px-6 md:px-20 bg-[#1A3326] text-cream">
      <div className="max-w-[600px] mb-12">
        <motion.p 
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="text-[11px] tracking-[0.2em] uppercase text-gold mb-4 font-medium"
        >
          Speak like a local
        </motion.p>
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="font-serif text-[clamp(40px,6vw,56px)] font-light leading-[1.1] mb-6"
        >
          Essential Swahili
        </motion.h2>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="text-[15px] text-[#9FD4B8] leading-[1.8]"
        >
          Three languages. One guide. Written by someone who grew up speaking Swahili every day.
        </motion.p>
      </div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-50px" }}
        /* The gap-[1px] combined with bg-white/10 creates the hairline grid borders */
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[1px] bg-white/10 border border-white/10 rounded-[24px] overflow-hidden shadow-lg"
      >
        {phrases.map((item) => (
          <motion.div
            key={item.sw}
            variants={cardVariants}
            className="bg-[#244234] p-8 hover:bg-[#2A4D3E] transition-colors duration-300 flex flex-col justify-center cursor-default"
          >
            <h3 className="font-serif text-[26px] text-gold mb-3 leading-none drop-shadow-sm">
              {item.sw}
            </h3>
            <p className="text-[14px] font-medium text-cream mb-0.5">
              {item.en}
            </p>
            <p className="text-[13px] text-[#9FD4B8] italic mb-4">
              {item.fr}
            </p>
            <p className="text-[11px] text-cream/40 tracking-wider">
              {item.pron}
            </p>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}