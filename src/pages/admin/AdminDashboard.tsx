import { motion, type Variants } from 'framer-motion';
import { useAuthStore } from '../../store/useAuthStore';

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] as const } }
};

export default function AdminDashboard() {
  const { user } = useAuthStore();

  return (
    <div className="max-w-6xl mx-auto pb-12">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
        <h1 className="font-serif text-[36px] text-green-deep mb-2">System Overview</h1>
        <p className="text-[15px] text-text-mid">Authenticated as {user?.name} (Root Access).</p>
      </motion.div>

      <motion.div variants={containerVariants} initial="hidden" animate="show" className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Active Users', value: '1,204', trend: '+12% this week' },
          { label: 'Pending Approvals', value: '14', trend: 'Requires attention' },
          { label: 'System Uptime', value: '99.9%', trend: 'Operational' },
          { label: 'Active Events', value: '8', trend: 'Live on platform' },
        ].map((stat, i) => (
          <motion.div key={i} variants={itemVariants} className="bg-white p-6 rounded-2xl border border-black/5 shadow-sm">
            <p className="text-[11px] uppercase tracking-widest text-text-mid mb-2 font-medium">{stat.label}</p>
            <p className="font-serif text-[32px] text-green-deep mb-2 leading-none">{stat.value}</p>
            <p className="text-[11px] text-gold font-medium">{stat.trend}</p>
          </motion.div>
        ))}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Recent System Logs */}
        <motion.div variants={itemVariants} initial="hidden" animate="show" className="lg:col-span-2 bg-white rounded-[24px] border border-black/5 shadow-sm overflow-hidden">
          <div className="px-6 py-5 border-b border-black/5 flex justify-between items-center">
            <h3 className="font-serif text-[18px] text-green-deep">Recent Submissions & Logs</h3>
            <button className="text-[11px] uppercase tracking-wider font-medium text-text-mid hover:text-green-deep">Export CSV</button>
          </div>
          <div className="divide-y divide-black/5">
            {[
              { user: "Sarah Jenkins", action: "RSVP Submitted", ref: "Invitation ID: 89", status: "Success" },
              { user: "System Admin", action: "Charge Bearer Setting", ref: "Single Toggle applied to event", status: "Updated" },
              { user: "Michael Chen", action: "Account Registered", ref: "Role: Volunteer", status: "Pending" },
            ].map((log, i) => (
              <div key={i} className="px-6 py-4 flex items-center justify-between text-[13px]">
                <div>
                  <p className="font-medium text-green-deep">{log.action}</p>
                  <p className="text-text-mid mt-0.5">By {log.user} • <span className="font-mono text-[11px] bg-black/5 px-1.5 py-0.5 rounded">{log.ref}</span></p>
                </div>
                <span className={`px-2.5 py-1 rounded-full text-[10px] uppercase tracking-wider font-medium ${
                  log.status === 'Pending' ? 'bg-gold/10 text-gold' : 'bg-green-deep/10 text-green-deep'
                }`}>
                  {log.status}
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Right Column: Quick Actions */}
        <motion.div variants={itemVariants} initial="hidden" animate="show" className="bg-[#1C3A2E] text-cream rounded-[24px] p-8 shadow-lg h-fit">
          <h3 className="font-serif text-[22px] mb-6 text-gold">Quick Controls</h3>
          <div className="space-y-4">
            <button className="w-full text-left px-5 py-3.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-colors text-[13px] font-medium flex justify-between items-center">
              Global Event Settings <span>→</span>
            </button>
            <button className="w-full text-left px-5 py-3.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-colors text-[13px] font-medium flex justify-between items-center">
              Manage API Keys <span>→</span>
            </button>
            <button className="w-full text-left px-5 py-3.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-colors text-[13px] font-medium flex justify-between items-center">
              Review Content (14) <span>→</span>
            </button>
          </div>
        </motion.div>
      </div>

    </div>
  );
}