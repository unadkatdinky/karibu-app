import { motion } from 'framer-motion';

export default function Quote() {
  return (
    <section className="py-32 px-6 md:px-20 bg-[#7A8B83] flex items-center justify-center text-center">
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="max-w-[800px]"
      >
        <h2 className="font-serif text-[clamp(32px,5vw,56px)] font-light italic text-cream leading-[1.4]">
          "The most powerful thing you<br/> 
          can build is something <span className="text-gold">only you</span><br/>
          could have made."
        </h2>
      </motion.div>
    </section>
  );
}