import { motion } from 'framer-motion';

export default function About() {
  const tags = [
    '🇹🇿 Tanzania', '🎓 Cambridge IGCSE', '💻 React & Go', 
    '🗣 5 Languages', '🏊 Swimmer', '🎨 Designer', '✈️ Always exploring'
  ];

  return (
    <section id="about" className="py-32 px-6 md:px-20 bg-[#faf8f4] overflow-hidden">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
        
        {/* Left Column: Image Stack */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] as const }}
          className="relative h-[450px] md:h-[550px] w-full"
        >
          {/* Main Background Image */}
          <div className="absolute top-0 left-0 right-12 bottom-12 rounded-3xl overflow-hidden bg-black/5">
            <img 
              src="https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=800&q=80" 
              alt="Lake Victoria Tanzania" 
              className="w-full h-full object-cover" 
            />
          </div>
          
          {/* Overlapping Accent Image */}
          <div className="absolute bottom-0 right-0 w-[55%] h-[55%] rounded-3xl overflow-hidden border-[6px] border-[#faf8f4] shadow-2xl bg-black/5">
            <img 
              src="https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=600&q=80" 
              alt="Kilimanjaro" 
              className="w-full h-full object-cover" 
            />
          </div>

          {/* Floating Location Tag */}
          <div className="absolute top-8 right-4 bg-green-deep text-cream text-[11px] px-5 py-2.5 rounded-full shadow-lg font-medium tracking-wide uppercase">
            🇹🇿 Mwanza, Tanzania
          </div>
        </motion.div>

        {/* Right Column: Text Content */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] as const }}
        >
          <p className="text-[11px] tracking-[0.2em] uppercase text-gold mb-4 font-medium">
            The person behind Karibu
          </p>
          <h2 className="font-serif text-[clamp(40px,5vw,56px)] font-light leading-[1.1] mb-8 text-green-deep">
            Why I built this
          </h2>
          
          <div className="space-y-5 text-[15px] text-text-mid leading-[1.8]">
            <p>
              I was a developer doing a 9 to 6 job. Same routine every day. And somewhere between graduation and the daily grind, I forgot who I actually was.
            </p>
            <p>
              I forgot that I grew up in Tanzania. That I speak five languages. That I took school trips to Rwanda and Moshi. That the curious, adventurous version of me never left — she just got buried.
            </p>
          </div>
          
          <div className="border-l-[3px] border-gold pl-6 my-8">
            <p className="font-serif text-[22px] md:text-[24px] italic text-green-deep/80 leading-snug">
              "The most powerful thing you can build is something only you could have made."
            </p>
          </div>
          
          <p className="text-[15px] text-text-mid leading-[1.8] mb-10">
            So I built Karibu. Because the answers really are within us. Your background, your story, your natural self — these are your greatest assets. Don't forget them.
          </p>

          <div className="flex flex-wrap gap-3">
            {tags.map(tag => (
              <span 
                key={tag} 
                className="px-4 py-2 border border-green-deep/20 rounded-full text-[12px] text-green-deep font-medium hover:bg-green-deep hover:text-cream transition-colors cursor-default"
              >
                {tag}
              </span>
            ))}
          </div>
        </motion.div>

      </div>
    </section>
  );
}