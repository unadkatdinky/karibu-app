import { motion } from 'framer-motion';
import { useAuthStore } from '../../store/useAuthStore';
import PageHeader from '../../components/dashboard/PageHeader';
import StatCard from '../../components/dashboard/StatCard';
import DataTable, { type Column } from '../../components/dashboard/DataTable';
import ActivityFeed, { type ActivityItem } from '../../components/dashboard/ActivityFeed';
import StatusBadge from '../../components/dashboard/StatusBadge';

// ── Placeholder data ── swap for real API calls once your Go endpoints are ready

interface LogEntry {
  action: string;
  user: string;
  ref: string;
  status: string;
}

const RECENT_LOGS: LogEntry[] = [
  { action: 'Account registered',       user: 'amina.karimi@example.com',  ref: 'Role: Traveler',   status: 'active'  },
  { action: 'Content submitted',         user: 'guide.mwangi@example.com',  ref: 'Tour #TZ-094',     status: 'pending' },
  { action: 'Password reset requested', user: 'sarah.j@example.com',        ref: 'Via email link',   status: 'active'  },
  { action: 'Account flagged',          user: 'system',                      ref: 'Duplicate email',  status: 'error'   },
];

const LOG_COLUMNS: Column<LogEntry>[] = [
  { header: 'Action',  accessor: 'action' },
  { header: 'User',    accessor: row => <span className="font-mono text-[12px] text-[#888]">{row.user}</span> },
  { header: 'Ref',     accessor: 'ref' },
  { header: 'Status',  accessor: row => <StatusBadge status={row.status} />, align: 'right' },
];

const ACTIVITY: ActivityItem[] = [
  { id: 1, title: 'New guide registration', subtitle: 'akosua.asante@example.com — awaiting review', timestamp: '2m ago', dotColor: 'text-[#D4A853]' },
  { id: 2, title: 'Tour content approved',  subtitle: 'Stone Town Heritage Walk — Tour #TZ-091',      timestamp: '18m ago' },
  { id: 3, title: 'User reported',          subtitle: 'Spam content — flagged for manual review',      timestamp: '1h ago', dotColor: 'text-[#C4522A]' },
  { id: 4, title: 'System health check',    subtitle: 'All services nominal',                          timestamp: '2h ago' },
];

const fade = {
  hidden: { opacity: 0, y: 12 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] as const } },
};
const stagger = {
  hidden: { opacity: 0 },
  show:   { opacity: 1, transition: { staggerChildren: 0.07 } },
};

export default function AdminDashboard() {
  const { user } = useAuthStore();

  return (
    <div className="pb-12">
      <PageHeader
        title="System overview"
        subtitle={`Signed in as ${user?.fullName} — root access`}
        action={
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#C4522A]/10 text-[#C4522A] text-[11px] font-semibold uppercase tracking-wide">
            <span className="w-1.5 h-1.5 rounded-full bg-[#C4522A] animate-pulse" />
            Admin
          </span>
        }
      />

      {/* Stat row */}
      <motion.div variants={stagger} initial="hidden" animate="show"
        className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
      >
        {[
          { label: 'Total users',       value: '1,204', trend: '+12 this week', trendDir: 'up'     as const, accent: '#1C3A2E' },
          { label: 'Pending reviews',   value: '14',    trend: 'Needs attention', trendDir: 'down'  as const, accent: '#C4522A' },
          { label: 'Active guides',     value: '38',    trend: '+3 this month',  trendDir: 'up'     as const, accent: '#D4A853' },
          { label: 'Uptime',            value: '99.9%', trend: 'Operational',    trendDir: 'neutral' as const, accent: '#9FD4B8' },
        ].map((s, i) => (
          <motion.div key={i} variants={fade}>
            <StatCard {...s} />
          </motion.div>
        ))}
      </motion.div>

      {/* Main grid: log table + activity feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Log table — takes 2/3 width on large screens */}
        <motion.div variants={fade} initial="hidden" animate="show" className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-serif text-[20px] text-[#1C3A2E]">Recent activity log</h2>
            <button className="text-[11px] uppercase tracking-wider font-semibold text-[#888] hover:text-[#1C3A2E] transition-colors">
              Export CSV
            </button>
          </div>
          <DataTable columns={LOG_COLUMNS} rows={RECENT_LOGS} />
        </motion.div>

        {/* Activity feed — takes 1/3 */}
        <motion.div variants={fade} initial="hidden" animate="show">
          <h2 className="font-serif text-[20px] text-[#1C3A2E] mb-4">Live feed</h2>
          <div className="bg-white rounded-2xl border border-black/5 px-5 shadow-[0_2px_12px_rgba(0,0,0,0.03)]">
            <ActivityFeed items={ACTIVITY} />
          </div>
        </motion.div>
      </div>
    </div>
  );
}