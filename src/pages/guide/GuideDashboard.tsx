import { motion } from 'framer-motion';
import { useAuthStore } from '../../store/useAuthStore';
import PageHeader from '../../components/dashboard/PageHeader';
import StatCard from '../../components/dashboard/StatCard';
import DataTable, { type Column } from '../../components/dashboard/DataTable';
import ActivityFeed, { type ActivityItem } from '../../components/dashboard/ActivityFeed';
import StatusBadge from '../../components/dashboard/StatusBadge';
import EmptyState from '../../components/dashboard/EmptyState';

interface Booking {
  traveler: string;
  tour: string;
  date: string;
  status: string;
}

const BOOKINGS: Booking[] = [
  { traveler: 'Amara Osei',    tour: 'Stone Town Heritage Walk', date: 'Jul 14', status: 'approved' },
  { traveler: 'Laila Hassan',  tour: 'Spice Farm Tour',          date: 'Jul 18', status: 'pending'  },
  { traveler: 'David Kimani',  tour: 'Stone Town Heritage Walk', date: 'Jul 21', status: 'pending'  },
];

const BOOKING_COLS: Column<Booking>[] = [
  { header: 'Traveler', accessor: row => <span className="font-medium text-[#1C3A2E]">{row.traveler}</span> },
  { header: 'Tour',     accessor: 'tour' },
  { header: 'Date',     accessor: 'date' },
  { header: 'Status',   accessor: row => <StatusBadge status={row.status} />, align: 'right' },
];

const ACTIVITY: ActivityItem[] = [
  { id: 1, title: 'New booking request',    subtitle: 'Laila Hassan — Spice Farm Tour, Jul 18',   timestamp: '1h ago',  dotColor: 'text-[#D4A853]' },
  { id: 2, title: 'Review received',        subtitle: '⭐⭐⭐⭐⭐ from Amara Osei',                 timestamp: '2d ago',  dotColor: 'text-[#9FD4B8]' },
  { id: 3, title: 'Tour content approved',  subtitle: 'Stone Town Heritage Walk — live now',       timestamp: '5d ago'  },
  { id: 4, title: 'Community task joined',  subtitle: 'Beach cleanup — Nungwi, Jul 6',             timestamp: '1w ago'  },
];

const fade   = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] as const } } };
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.07 } } };

export default function GuideDashboard() {
  const { user } = useAuthStore();
  const firstName = user?.fullName?.split(' ')[0] ?? 'Guide';

  return (
    <div className="pb-12">
      <PageHeader
        title={`Welcome, ${firstName}`}
        subtitle="Manage your tours and community contributions."
        action={
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#D4A853]/15 text-[#9A7020] text-[11px] font-semibold uppercase tracking-wide">
            <span className="w-1.5 h-1.5 rounded-full bg-[#D4A853]" />
            Local Guide
          </span>
        }
      />

      {/* Stats */}
      <motion.div variants={stagger} initial="hidden" animate="show"
        className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
      >
        {[
          { label: 'Active tours',     value: '2',    trend: '',               trendDir: 'neutral' as const, accent: '#1C3A2E' },
          { label: 'Pending bookings', value: '2',    trend: 'Needs response',  trendDir: 'down'    as const, accent: '#D4A853' },
          { label: 'Reviews',          value: '11',   trend: 'Avg 4.8 ⭐',      trendDir: 'up'      as const, accent: '#9FD4B8' },
          { label: 'Tasks joined',     value: '3',    trend: '+1 this month',   trendDir: 'up'      as const, accent: '#C4522A' },
        ].map((s, i) => (
          <motion.div key={i} variants={fade}><StatCard {...s} /></motion.div>
        ))}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Bookings table */}
        <motion.div variants={fade} initial="hidden" animate="show" className="lg:col-span-2">
          <h2 className="font-serif text-[20px] text-[#1C3A2E] mb-4">Upcoming bookings</h2>
          {BOOKINGS.length > 0
            ? <DataTable columns={BOOKING_COLS} rows={BOOKINGS} />
            : <EmptyState icon="🗓️" title="No bookings yet" description="Once travelers book your tours they'll appear here." />
          }
        </motion.div>

        {/* Activity */}
        <motion.div variants={fade} initial="hidden" animate="show">
          <h2 className="font-serif text-[20px] text-[#1C3A2E] mb-4">Recent activity</h2>
          <div className="bg-white rounded-2xl border border-black/5 px-5 shadow-[0_2px_12px_rgba(0,0,0,0.03)]">
            <ActivityFeed items={ACTIVITY} />
          </div>
        </motion.div>
      </div>
    </div>
  );
}