import PageHeader from '../../components/dashboard/PageHeader';
import EmptyState from '../../components/dashboard/EmptyState';

export default function SavedPlaces() {
  return (
    <div>
      <PageHeader title="Saved places" subtitle="All the destinations you've bookmarked." />
      <EmptyState icon="🗺️" title="No saved places yet" description="Explore destinations and bookmark the ones you want to visit." />
    </div>
  );
}