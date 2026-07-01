import PageHeader from '../../components/dashboard/PageHeader';
import EmptyState from '../../components/dashboard/EmptyState';

export default function CommunityTasks() {
  return (
    <div>
      <PageHeader title="Community tasks" subtitle="Local events and conservation initiatives you can join." />
      <EmptyState icon="🌿" title="No tasks posted yet" description="Community tasks will appear here when organisers post them." />
    </div>
  );
}