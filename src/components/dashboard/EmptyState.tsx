// Shown when a page section has no data yet.
// Keeps the empty experience consistent and on-brand across all roles.

interface EmptyStateProps {
  icon?: string;      // emoji — keeps it lightweight
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export default function EmptyState({ icon = '🌍', title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <span className="text-4xl mb-4">{icon}</span>
      <h3 className="font-serif text-[22px] text-[#1C3A2E] mb-2">{title}</h3>
      {description && <p className="text-[14px] text-[#888] max-w-sm leading-relaxed mb-6">{description}</p>}
      {action}
    </div>
  );
}