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

export default function VolunteerDashboard() {
  const { user } = useAuthStore();

  return (
    <div className="max-w-5xl mx-auto pb-12">
      <div className="flex justify-between items-end mb-10">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="font-serif text-[36px] text-green-deep mb-2">Welcome, {user?.fullName.split(' ')[0]}</h1>
          <p className="text-[15px] text-text-mid">Community Service & Event Registration Portal.</p>
        </motion.div>
        <motion.button 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} 
          className="bg-[#C4522A] text-cream px-6 py-2.5 rounded-full text-[12px] uppercase tracking-wider font-medium hover:bg-[#A34220] transition-colors shadow-sm"
        >
          Find Events
        </motion.button>
      </div>

      <motion.div variants={containerVariants} initial="hidden" animate="show" className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {[
          { label: 'Total Service Hours', value: '48.5', color: 'text-green-deep' },
          { label: 'Active Event Registrations', value: '3', color: 'text-[#C4522A]' },
          { label: 'Communities Impacted', value: '4', color: 'text-gold' },
        ].map((stat, i) => (
          <motion.div key={i} variants={itemVariants} className="bg-white p-8 rounded-[24px] border border-black/5 shadow-[0_8px_30px_rgba(0,0,0,0.04)]">
            <p className="text-[11px] uppercase tracking-widest text-text-mid mb-3 font-medium">{stat.label}</p>
            <p className={`font-serif text-[42px] leading-none ${stat.color}`}>{stat.value}</p>
          </motion.div>
        ))}
      </motion.div>

      <motion.div variants={itemVariants} initial="hidden" animate="show" className="bg-white rounded-[24px] border border-black/5 shadow-[0_8px_30px_rgba(0,0,0,0.04)] overflow-hidden">
        <div className="px-8 py-6 border-b border-black/5 bg-[#faf8f4]/50">
          <h3 className="font-serif text-[20px] text-green-deep">Recent Service Log</h3>
        </div>
        <div className="divide-y divide-black/5">
          {[
            { event: "Mwanza Community Clean-up", date: "Oct 12, 2026", hours: "4.0 hrs", role: "Coordinator" },
            { event: "Stone Town Heritage Walk", date: "Sep 28, 2026", hours: "6.5 hrs", role: "Local Guide" },
            { event: "Kilimanjaro Trail Maintenance", date: "Sep 15, 2026", hours: "12.0 hrs", role: "Volunteer" }
          ].map((log, i) => (
            <div key={i} className="px-8 py-5 flex items-center justify-between hover:bg-[#faf8f4]/50 transition-colors">
              <div>
                <p className="text-[14px] font-medium text-green-deep mb-1">{log.event}</p>
                <div className="flex gap-3 text-[12px] text-text-mid">
                  <span>{log.date}</span>
                  <span>•</span>
                  <span>{log.role}</span>
                </div>
              </div>
              <div className="text-right">
                <span className="inline-block px-3 py-1 bg-green-deep/5 text-green-deep text-[11px] font-medium rounded-full">
                  {log.hours}
                </span>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}