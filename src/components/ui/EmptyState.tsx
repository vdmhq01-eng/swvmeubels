import { cn } from '@/lib/utils';

export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('flex flex-col items-center justify-center px-6 py-12 text-center', className)}>
      {icon ? (
        <div className="mb-4 grid h-12 w-12 place-items-center rounded-2xl bg-bone-100 text-ink-500">
          {icon}
        </div>
      ) : null}
      <div className="font-display text-base font-semibold text-ink-900">{title}</div>
      {description ? <p className="mt-1 max-w-md text-sm text-ink-500">{description}</p> : null}
      {action ? <div className="mt-4">{action}</div> : null}
    </div>
  );
}
