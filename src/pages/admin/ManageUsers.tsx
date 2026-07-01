import PageHeader from '../../components/dashboard/PageHeader';
import EmptyState from '../../components/dashboard/EmptyState';

export default function ManageUsers() {
  return (
    <div>
      <PageHeader title="User management" subtitle="Search, filter, and manage all registered accounts." />
      <EmptyState icon="👥" title="User table coming soon" description="Connect to GET /api/v1/admin/users to populate this page." />
    </div>
  );
}