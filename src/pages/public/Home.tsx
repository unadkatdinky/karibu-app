import { motion } from 'framer-motion';
import Hero from '../../components/Hero';
import Destinations from '../../sections/Destinations';
import Quote from '../../sections/Quote';
import Culture from '../../sections/Culture';
import Phrases from '../../sections/Phrases';
import About from '../../sections/About';
import Footer from '../../components/Footer'; // <-- Import the new footer

export default function Home() {
  return (
    <div className="w-full">
      <Hero />
      
      {/* Infinite scrolling word carousel strip */}
      <div className="bg-green-deep py-8 overflow-hidden flex items-center whitespace-nowrap select-none border-b border-white/10">
        <motion.p 
          animate={{ x: [0, -1000] }}
          transition={{ repeat: Infinity, duration: 24, ease: "linear" }}
          className="font-serif text-[18px] italic text-green-light tracking-wide flex gap-8 shrink-0"
        >
          <span>Karibu — Welcome ✦</span>
          <span>Asante Sana — Thank You ✦</span>
          <span>Pole Pole — Take It Easy ✦</span>
          <span>Hakuna Matata — No Worries ✦</span>
          <span>Karibu — Welcome ✦</span>
          <span>Asante Sana — Thank You ✦</span>
          <span>Pole Pole — Take It Easy ✦</span>
          <span>Hakuna Matata — No Worries ✦</span>
        </motion.p>
      </div>

      <Destinations />
      <Quote />
      <Culture />
      <Phrases />
      <About />
      <Footer /> {/* <-- Add it right below the About section */}
    </div>
  );
}