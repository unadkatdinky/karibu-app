// src/sections/Culture.tsx
import { motion, type Variants } from 'framer-motion';

const rules = [
  { icon: '🤝', title: 'Greetings come first', text: 'Always greet before asking for anything. Rushing straight to business feels deeply rude. Take the time. Say habari. It changes everything.' },
  { icon: '🍽', title: 'Accept the food', text: 'Refusing food when offered is considered impolite. Accepting is a sign of trust and respect. Even a small bite goes a long way.' },
  { icon: '👗', title: 'Dress modestly', text: 'Especially outside major cities and on Zanzibar\'s coast. Light, modest clothing shows cultural awareness and keeps you comfortable.' },
  { icon: '⏰', title: 'Embrace pole pole', text: 'Life moves beautifully slowly in East Africa. The best experiences happen when you stop rushing and start being fully present.' },
  { icon: '💰', title: 'Bargain with a smile', text: 'At markets, bargaining is expected and respected. Start at half price. Smile throughout. It is a conversation, not a conflict.' },
  { icon: '📸', title: 'Ask before you shoot', text: 'Always ask before photographing people. "Je picha?" shows genuine respect and usually gets you a yes and a beautiful smile.' },
];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } }
};

export default function Culture() {
  return (
    <section id="culture" className="py-32 px-6 md:px-20 bg-sand">
      <div className="max-w-[600px] mb-16">
        <motion.p 
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="text-[11px] tracking-[0.2em] uppercase text-coral mb-4"
        >
          Before you go
        </motion.p>
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="font-serif text-[clamp(40px,6vw,64px)] font-light leading-[1.1] mb-6 text-green-deep"
        >
          Culture & <em className="text-coral italic">Etiquette</em>
        </motion.h2>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="text-[16px] text-green-deep/70 leading-[1.8]"
        >
          Things no travel blog tells you. Navigating East Africa is less about knowing where to go, and more about knowing how to be.
        </motion.p>
      </div>

      {/* The "group" class here enables the peer-dimming hover effect */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-100px" }}
        className="group grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
      >
        {rules.map((rule) => (
          <motion.div
            key={rule.title}
            variants={cardVariants}
            className="relative bg-[#Fdfbf7] rounded-2xl p-8 border border-green-deep/5 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(28,58,46,0.08)] group-hover:opacity-40 hover:!opacity-100 cursor-default overflow-hidden"
          >
            {/* Subtle top border highlight that expands on hover */}
            <div className="absolute top-0 left-0 w-full h-[3px] bg-transparent origin-left transition-colors duration-500 group-hover/card:bg-coral" />
            
            <motion.div 
              className="text-[32px] mb-6 origin-bottom-left"
              whileHover={{ scale: 1.2, rotate: [-5, 5, 0] }}
              transition={{ type: "spring", stiffness: 300, damping: 15 }}
            >
              {rule.icon}
            </motion.div>
            
            <h3 className="text-[17px] font-serif font-semibold text-green-deep mb-3 tracking-wide">
              {rule.title}
            </h3>
            
            <p className="text-[14px] text-green-deep/65 leading-[1.7] font-light">
              {rule.text}
            </p>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}