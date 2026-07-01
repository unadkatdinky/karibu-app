// Consistent page title + subtitle + optional right-side action slot.
// Used at the top of every dashboard page so they all open the same way.

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode; // e.g. a button or a badge
}

export default function PageHeader({ title, subtitle, action }: PageHeaderProps) {
  return (
    <div className="flex items-start justify-between mb-8">
      <div>
        <h1 className="font-serif text-[34px] leading-none text-[#1C3A2E] mb-1.5">{title}</h1>
        {subtitle && <p className="text-[15px] text-[#666]">{subtitle}</p>}
      </div>
      {action && <div className="ml-4 mt-1 shrink-0">{action}</div>}
    </div>
  );
}