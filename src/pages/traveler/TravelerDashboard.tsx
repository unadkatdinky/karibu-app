import { motion } from 'framer-motion';
import { useAuthStore } from '../../store/useAuthStore';
import StatCard from '../../components/dashboard/StatCard';
import Panel from '../../components/dashboard/Panel';
import WelcomeBanner from '../../components/dashboard/WelcomeBanner';
import ItineraryRow from '../../components/dashboard/ItineraryRow';
import DestinationTile from '../../components/dashboard/DestinationTile';
import PhraseWidget from '../../components/dashboard/PhraseWidget';
import QAItem from '../../components/dashboard/QAItem';
import IntelRow from '../../components/dashboard/IntelRow';
import { IconCompass, IconChat, IconClock, IconLanguage } from '../../components/dashboard/icons';

const ITINERARIES = [
  { title: '5 Days in Zanzibar — Beaches & Old Town', subtitle: 'Curated for slow travel, food-focused', guideName: 'Amina K.', thumbColor: '#9FD4B8' },
  { title: 'Kilimanjaro Trek — 6 Day Machame Route',   subtitle: 'Moderate difficulty, includes acclimatization day', guideName: 'James M.', thumbColor: '#D4A853' },
  { title: 'Rwanda Gorilla Trek + Kigali Culture',      subtitle: '4 days, permits and lodge notes included', guideName: 'Eric N.', thumbColor: '#C4522A' },
];

const DESTINATIONS = [
  { name: 'Mwanza',   color: '#2D5A3D' },
  { name: 'Rwanda',   color: '#1C3A2E' },
  { name: 'Zanzibar', color: '#D4A853' },
];

const QUESTIONS = [
  { region: 'Zanzibar',    timestamp: '3 days ago', question: 'Is it safe to walk Stone Town alone at night?', answeredBy: 'Amina K.' },
  { region: 'Kilimanjaro', timestamp: '1 week ago', question: 'Best month to avoid crowds on Machame route?', answeredBy: 'James M.' },
];

const INTEL = [
  { dotColor: '#9FD4B8', place: 'Forodhani Market', note: 'night market exceptional this week, locals recommend going past 7pm', postedBy: 'Amina K.', timestamp: '2h ago' },
  { dotColor: '#D4A853', place: 'North Beach Road', note: 'closed for repairs until Friday, use the inland route', postedBy: 'Hassan R.', timestamp: 'yesterday' },
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
      <WelcomeBanner
        eyebrow={`Karibu back, ${firstName}`}
        title="Amina has a new note on your itinerary"
        message={
          <>
            "The night market in Forodhani is exceptional this week — skip the touristy stalls near the fort
            and go further down toward the water." Your guide added 2 updates since you last checked.
          </>
        }
        actions={[
          { label: 'View Itinerary', variant: 'gold' },
          { label: 'Message Amina', variant: 'ghost' },
        ]}
      />

      {/* Stat row */}
      <motion.div variants={stagger} initial="hidden" animate="show"
        className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-7"
      >
        {[
          { label: 'Saved itineraries',      value: '3',  icon: <IconCompass />, iconBg: 'bg-[#D4A853]/15',  iconColor: 'text-[#D4A853]' },
          { label: 'Questions answered',     value: '5',  icon: <IconChat />,    iconBg: 'bg-[#9FD4B8]/25',  iconColor: 'text-[#2D5A3D]' },
          { label: 'Days until departure',   value: '12', icon: <IconClock />,   iconBg: 'bg-[#C4522A]/[0.12]', iconColor: 'text-[#C4522A]' },
          { label: 'Phrases learned',        value: '18', icon: <IconLanguage />, iconBg: 'bg-[#1C3A2E]/[0.07]', iconColor: 'text-[#1C3A2E]' },
        ].map((s, i) => (
          <motion.div key={i} variants={fade}><StatCard {...s} /></motion.div>
        ))}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-[1.6fr_1fr] gap-5">
        {/* LEFT COLUMN */}
        <motion.div variants={fade} initial="hidden" animate="show">
          <Panel title="Saved Itineraries" action={{ label: 'View all' }}>
            {ITINERARIES.map((it, i) => <ItineraryRow key={i} {...it} />)}
          </Panel>

          <Panel title="Saved Destinations" action={{ label: 'Explore more' }} className="mb-0">
            <div className="grid grid-cols-3 gap-3">
              {DESTINATIONS.map((d, i) => <DestinationTile key={i} {...d} />)}
            </div>
          </Panel>
        </motion.div>

        {/* RIGHT COLUMN */}
        <motion.div variants={fade} initial="hidden" animate="show">
          <PhraseWidget phrase="Karibu sana" translation="You are very welcome" />

          <Panel title="Your Questions" action={{ label: 'Ask new' }}>
            {QUESTIONS.map((q, i) => <QAItem key={i} {...q} last={i === QUESTIONS.length - 1} />)}
          </Panel>

          <Panel title="Ground Intelligence" action={{ label: 'Zanzibar' }} className="mb-0">
            {INTEL.map((row, i) => <IntelRow key={i} {...row} last={i === INTEL.length - 1} />)}
          </Panel>
        </motion.div>
      </div>
    </div>
  );
}