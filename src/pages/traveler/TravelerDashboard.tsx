import { motion } from 'framer-motion';
import { useAuthStore } from '../../store/useAuthStore';
import PageHeader from '../../components/dashboard/PageHeader';
import StatCard from '../../components/dashboard/StatCard';
import ActivityFeed, { type ActivityItem } from '../../components/dashboard/ActivityFeed';
import EmptyState from '../../components/dashboard/EmptyState';
import DataTable, { type Column } from '../../components/dashboard/DataTable';

interface SavedPlace {
  name: string;
  region: string;
  category: string;
  savedOn: string;
}

const SAVED: SavedPlace[] = [
  { name: 'Stone Town',        region: 'Zanzibar, Tanzania',  category: 'Heritage',  savedOn: 'Jun 12' },
  { name: 'Ngorongoro Crater', region: 'Arusha, Tanzania',    category: 'Wildlife',  savedOn: 'Jun 8'  },
  { name: 'Lamu Old Town',     region: 'Lamu, Kenya',         category: 'Heritage',  savedOn: 'May 30' },
];

const SAVED_COLUMNS: Column<SavedPlace>[] = [
  { header: 'Place',    accessor: row => <span className="font-medium text-[#1C3A2E]">{row.name}</span> },
  { header: 'Region',   accessor: 'region' },
  { header: 'Category', accessor: row => (
    <span className="inline-flex px-2 py-0.5 rounded-full bg-[#9FD4B8]/15 text-[#2D5A3D] text-[11px] font-semibold">
      {row.category}
    </span>
  )},
  { header: 'Saved',    accessor: 'savedOn', align: 'right' },
];

const ACTIVITY: ActivityItem[] = [
  { id: 1, title: 'Saved Ngorongoro Crater',    subtitle: 'Added to your wishlist',          timestamp: '3d ago' },
  { id: 2, title: 'Completed Stone Town tour',  subtitle: 'Guided by Juma Mwangi',           timestamp: '1w ago', dotColor: 'text-[#D4A853]' },
  { id: 3, title: 'Note added',                 subtitle: 'Packing list for Tanzania trip',   timestamp: '1w ago' },
  { id: 4, title: 'Account created',            subtitle: 'Welcome to Karibu',                timestamp: '2w ago', dotColor: 'text-[#9FD4B8]' },
];

const fade = {
  hidden: { opacity: 0, y: 12 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] as const } },
};
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.07 } } };

export default function TravelerDashboard() {
  const { user } = useAuthStore();
  const firstName = user?.fullName?.split(' ')[0] ?? 'Traveler';

  return (
    <div className="pb-12">
      <PageHeader
        title={`Jambo, ${firstName}`}
        subtitle="Here's where your journey stands."
      />

      {/* Stat row */}
      <motion.div variants={stagger} initial="hidden" animate="show"
        className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
      >
        {[
          { label: 'Places saved',    value: '3',    trend: '+1 this week',   trendDir: 'up'      as const, accent: '#1C3A2E' },
          { label: 'Tours completed', value: '1',    trend: '',               trendDir: 'neutral' as const, accent: '#D4A853' },
          { label: 'Countries',       value: '2',    trend: 'Tanzania, Kenya', trendDir: 'neutral' as const, accent: '#9FD4B8' },
          { label: 'Notes written',   value: '1',    trend: '',               trendDir: 'neutral' as const, accent: '#C4522A' },
        ].map((s, i) => (
          <motion.div key={i} variants={fade}><StatCard {...s} /></motion.div>
        ))}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Saved places table */}
        <motion.div variants={fade} initial="hidden" animate="show" className="lg:col-span-2">
          <h2 className="font-serif text-[20px] text-[#1C3A2E] mb-4">Saved places</h2>
          {SAVED.length > 0
            ? <DataTable columns={SAVED_COLUMNS} rows={SAVED} />
            : <EmptyState icon="🗺️" title="No saved places yet" description="Explore destinations and tap the bookmark to save them here." />
          }
        </motion.div>

        {/* Activity feed */}
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