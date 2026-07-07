import { motion } from 'framer-motion';
import { useAuthStore } from '../../store/useAuthStore';
import WelcomeBanner from '../../components/dashboard/WelcomeBanner';
import StatCard from '../../components/dashboard/StatCard';
import Panel from '../../components/dashboard/Panel';
import DataTable, { type Column } from '../../components/dashboard/DataTable';
import ActivityFeed, { type ActivityItem } from '../../components/dashboard/ActivityFeed';
import { IconUsers, IconShield, IconPulse, IconChat } from '../../components/dashboard/icons';

interface LogEntry {
  action: string;
  user: string;
  ref: string;
  status: string;
}

const RECENT_LOGS: LogEntry[] = [
  { action: 'Account registered',        user: 'amina.karimi@example.com', ref: 'Role: Traveler',  status: 'active'  },
  { action: 'Content submitted',          user: 'guide.mwangi@example.com', ref: 'Tour #TZ-094',    status: 'pending' },
  { action: 'Password reset requested',  user: 'sarah.j@example.com',       ref: 'Via email link',  status: 'active'  },
  { action: 'Account flagged',           user: 'system',                     ref: 'Duplicate email', status: 'error'   },
];

const LOG_COLUMNS: Column<LogEntry>[] = [
  { header: 'Action', accessor: 'action' },
  { header: 'User',   accessor: row => <span className="font-mono text-[12px] text-[#888]">{row.user}</span> },
  { header: 'Ref',    accessor: 'ref' },
  {
    header: 'Status',
    accessor: row => (
      <span className={`inline-flex items-center rounded-full px-2 py-1 text-[12px] font-semibold ${
        row.status === 'active'
          ? 'bg-[#D4F0E9] text-[#1C5D44]'
          : row.status === 'pending'
          ? 'bg-[#FDF4E5] text-[#8B5D1B]'
          : 'bg-[#FDE8E8] text-[#9F2D2D]'
      }`}>
        {row.status}
      </span>
    ),
    align: 'right',
  },
];

const ACTIVITY: ActivityItem[] = [
  { id: 1, title: 'New guide registration',  subtitle: 'akosua.asante@example.com — awaiting review', timestamp: '2m ago',  dotColor: 'text-[#D4A853]' },
  { id: 2, title: 'Tour content approved',   subtitle: 'Stone Town Heritage Walk — Tour #TZ-091',      timestamp: '18m ago' },
  { id: 3, title: 'User reported',           subtitle: 'Spam content — flagged for manual review',      timestamp: '1h ago',  dotColor: 'text-[#C4522A]' },
  { id: 4, title: 'System health check',     subtitle: 'All services nominal',                          timestamp: '2h ago'  },
];

const fade    = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] as const } } };
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.07 } } };

export default function AdminDashboard() {
  const { user } = useAuthStore();
  const firstName = user?.fullName?.split(' ')[0] ?? 'Admin';

  return (
    <div className="pb-12">
      <WelcomeBanner
        eyebrow="Root access"
        title={`System overview, ${firstName}`}
        message="14 items are waiting on your review — 3 flagged accounts and 11 pending content submissions from local guides."
        actions={[
          { label: 'Review queue', variant: 'gold' },
          { label: 'Export CSV', variant: 'ghost' },
        ]}
      />

      <motion.div variants={stagger} initial="hidden" animate="show"
        className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-7"
      >
        {([
          { label: 'Total users',     value: '1,204', icon: <IconUsers />,  iconBg: 'bg-[#1C3A2E]/[0.07]', iconColor: 'text-[#1C3A2E]', trend: '+12 this week',   trendDir: 'up'      as const },
          { label: 'Pending reviews', value: '14',    icon: <IconShield />, iconBg: 'bg-[#C4522A]/[0.12]', iconColor: 'text-[#C4522A]', trend: 'Needs attention', trendDir: 'down'    as const },
          { label: 'Active guides',   value: '38',    icon: <IconChat />,   iconBg: 'bg-[#D4A853]/15',     iconColor: 'text-[#D4A853]', trend: '+3 this month',   trendDir: 'up'      as const },
          { label: 'Uptime',          value: '99.9%', icon: <IconPulse />,  iconBg: 'bg-[#9FD4B8]/25',     iconColor: 'text-[#2D5A3D]', trend: 'Operational',     trendDir: 'neutral' as const },
        ] as const).map((s, i) => (
          <motion.div key={i} variants={fade}><StatCard {...s} /></motion.div>
        ))}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <motion.div variants={fade} initial="hidden" animate="show" className="lg:col-span-2">
          <Panel title="Recent activity log" action={{ label: 'Export CSV' }} className="mb-0">
            <DataTable columns={LOG_COLUMNS} rows={RECENT_LOGS} />
          </Panel>
        </motion.div>

        <motion.div variants={fade} initial="hidden" animate="show">
          <Panel title="Live feed" className="mb-0">
            <ActivityFeed items={ACTIVITY} />
          </Panel>
        </motion.div>
      </div>
    </div>
  );
}
