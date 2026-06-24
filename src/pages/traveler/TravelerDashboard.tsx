import { motion, type Variants } from 'framer-motion';
import { useAuthStore } from '../../store/useAuthStore';

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const } }
};

export default function TravelerDashboard() {
  const { user } = useAuthStore();

  return (
    <div className="max-w-5xl mx-auto pb-12">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
        <h1 className="font-serif text-[36px] text-green-deep mb-2">Jambo, {user?.fullName?.split(' ')[0] ?? 'Traveler'}</h1>
        <p className="text-[15px] text-text-mid">Your personal Karibu passport and journey planner.</p>
      </motion.div>

      <motion.div variants={containerVariants} initial="hidden" animate="show" className="grid grid-cols-1 md:grid-cols-12 gap-6">
        
        {/* Main Highlight Card */}
        <motion.div variants={itemVariants} className="md:col-span-8 bg-white rounded-[24px] p-8 border border-black/5 shadow-[0_8px_30px_rgba(0,0,0,0.04)] relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[url('https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80')] bg-cover bg-center opacity-10 group-hover:opacity-20 transition-opacity duration-500 rounded-bl-full" />
          <div className="relative z-10 h-full flex flex-col justify-between min-h-[180px]">
            <div>
              <span className="inline-block px-3 py-1 bg-gold/10 text-gold text-[10px] uppercase tracking-wider font-medium rounded-full mb-4">
                Upcoming Trip
              </span>
              <h2 className="font-serif text-[32px] text-green-deep leading-none mb-2">Zanzibar Coast</h2>
              <p className="text-[14px] text-text-mid">4 days • Historical Tour & Beaches</p>
            </div>
            <div className="flex items-center gap-4 mt-8">
              <button className="bg-green-deep text-cream px-6 py-2.5 rounded-full text-[12px] uppercase tracking-wider font-medium hover:bg-green-mid transition-colors">
                View Itinerary
              </button>
            </div>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div variants={itemVariants} className="md:col-span-4 bg-green-deep text-cream rounded-[24px] p-8 shadow-[0_8px_30px_rgba(28,58,46,0.15)] flex flex-col justify-center text-center">
          <p className="text-[12px] uppercase tracking-widest text-gold mb-2 font-medium">Saved Places</p>
          <p className="font-serif text-[48px] leading-none mb-4">12</p>
          <p className="text-[13px] text-green-light">Across 3 countries</p>
        </motion.div>

        <motion.div variants={itemVariants} className="md:col-span-12 bg-white rounded-[24px] p-8 border border-black/5 shadow-[0_8px_30px_rgba(0,0,0,0.04)] mt-4">
          <div className="flex justify-between items-end mb-6">
            <h3 className="font-serif text-[24px] text-green-deep">Recent Travel Notes</h3>
            <button className="text-[12px] text-gold uppercase tracking-wider font-medium hover:text-green-deep transition-colors">View All</button>
          </div>
          <div className="space-y-4">
            {['Remember to greet elders with Shikamoo before asking for directions.', 'The sunset view at Mwanza rock formations is best at 5:45 PM.'].map((note, i) => (
              <div key={i} className="p-4 rounded-xl bg-[#faf8f4] border border-black/5 text-[14px] text-text-mid leading-relaxed">
                {note}
              </div>
            ))}
          </div>
        </motion.div>

      </motion.div>
    </div>
  );
}