import { motion } from 'framer-motion';
import { useAuthStore } from '../../store/useAuthStore';
import WelcomeBanner from '../../components/dashboard/WelcomeBanner';
import StatCard from '../../components/dashboard/StatCard';
import Panel from '../../components/dashboard/Panel';
import DataTable, { type Column } from '../../components/dashboard/DataTable';
import ActivityFeed, { type ActivityItem } from '../../components/dashboard/ActivityFeed';
import EmptyState from '../../components/dashboard/EmptyState';
import { IconCalendar, IconClock, IconStar, IconTasks } from '../../components/dashboard/icons';

interface Booking {
  traveler: string;
  tour: string;
  date: string;
  status: string;
}

const StatusBadge = ({ status }: { status: string }) => {
  const label = status === 'approved' ? 'Approved' : status === 'pending' ? 'Pending' : status;
  const styles = status === 'approved'
    ? 'bg-[#DEF1E8] text-[#1C3A2E]'
    : status === 'pending'
      ? 'bg-[#FEEAEA] text-[#B42318]'
      : 'bg-[#F3F4F6] text-[#374151]';

  return (
    <span className={`inline-flex items-center rounded-full px-3 py-1 text-[13px] font-semibold ${styles}`}>
      {label}
    </span>
  );
};

const BOOKINGS: Booking[] = [
  { traveler: 'Amara Osei',   tour: 'Stone Town Heritage Walk', date: 'Jul 14', status: 'approved' },
  { traveler: 'Laila Hassan', tour: 'Spice Farm Tour',          date: 'Jul 18', status: 'pending'  },
  { traveler: 'David Kimani', tour: 'Stone Town Heritage Walk', date: 'Jul 21', status: 'pending'  },
];

const BOOKING_COLS: Column<Booking>[] = [
  { header: 'Traveler', accessor: row => <span className="font-medium text-[#1C3A2E]">{row.traveler}</span> },
  { header: 'Tour',     accessor: 'tour' },
  { header: 'Date',     accessor: 'date' },
  { header: 'Status',   accessor: row => <StatusBadge status={row.status} />, align: 'right' },
];

const ACTIVITY: ActivityItem[] = [
  { id: 1, title: 'New booking request',   subtitle: 'Laila Hassan — Spice Farm Tour, Jul 18', timestamp: '1h ago',  dotColor: 'text-[#D4A853]' },
  { id: 2, title: 'Review received',       subtitle: '⭐⭐⭐⭐⭐ from Amara Osei',               timestamp: '2d ago',  dotColor: 'text-[#9FD4B8]' },
  { id: 3, title: 'Tour content approved', subtitle: 'Stone Town Heritage Walk — live now',     timestamp: '5d ago'  },
  { id: 4, title: 'Community task joined', subtitle: 'Beach cleanup — Nungwi, Jul 6',           timestamp: '1w ago'  },
];

const fade    = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] as const } } };
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.07 } } };

export default function GuideDashboard() {
  const { user } = useAuthStore();
  const firstName = user?.fullName?.split(' ')[0] ?? 'Guide';

  return (
    <div className="pb-12">
      <WelcomeBanner
        eyebrow="Guide portal"
        title={`Welcome back, ${firstName}`}
        message="You have 2 pending bookings waiting on a response, and Laila Hassan is asking about availability for the Spice Farm Tour."
        actions={[
          { label: 'Review bookings', variant: 'gold' },
          { label: 'Message Laila', variant: 'ghost' },
        ]}
      />

      <motion.div variants={stagger} initial="hidden" animate="show"
        className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-7"
      >
        {([
          { label: 'Active tours',     value: '2',  icon: <IconCalendar />, iconBg: 'bg-[#1C3A2E]/[0.07]', iconColor: 'text-[#1C3A2E]', trend: '',               trendDir: 'neutral' as const },
          { label: 'Pending bookings', value: '2',  icon: <IconClock />,    iconBg: 'bg-[#D4A853]/15',     iconColor: 'text-[#D4A853]', trend: 'Needs response', trendDir: 'down'    as const },
          { label: 'Reviews',          value: '11', icon: <IconStar />,     iconBg: 'bg-[#9FD4B8]/25',     iconColor: 'text-[#2D5A3D]', trend: 'Avg 4.8 ⭐',     trendDir: 'up'      as const },
          { label: 'Tasks joined',     value: '3',  icon: <IconTasks />,    iconBg: 'bg-[#C4522A]/[0.12]', iconColor: 'text-[#C4522A]', trend: '+1 this month',  trendDir: 'up'      as const },
        ] as const).map((s, i) => (
          <motion.div key={i} variants={fade}><StatCard {...s} /></motion.div>
        ))}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <motion.div variants={fade} initial="hidden" animate="show" className="lg:col-span-2">
          <Panel title="Upcoming bookings" className="mb-0">
            {BOOKINGS.length > 0
              ? <DataTable columns={BOOKING_COLS} rows={BOOKINGS} />
              : <EmptyState icon="🗓️" title="No bookings yet" description="Once travelers book your tours they'll appear here." />
            }
          </Panel>
        </motion.div>

        <motion.div variants={fade} initial="hidden" animate="show">
          <Panel title="Recent activity" className="mb-0">
            <ActivityFeed items={ACTIVITY} />
          </Panel>
        </motion.div>
      </div>
    </div>
  );
}
