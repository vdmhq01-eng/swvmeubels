export function StatsBar() {
  const stats = [
    { label: 'Dagen werk', value: '4', sub: 'per week' },
    { label: 'Dag school', value: '1', sub: 'per week' },
    { label: 'Vakantiedagen', value: '25', sub: 'per jaar' },
    { label: 'Studenten', value: '876', sub: 'aan de slag' },
  ];
  return (
    <section className="border-y border-bone-200 bg-white">
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-px overflow-hidden bg-bone-200 md:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="flex flex-col items-center bg-white px-4 py-8 text-center">
            <span className="font-display text-5xl font-bold leading-none text-primary-600">
              {s.value}
            </span>
            <span className="mt-2 text-xs font-bold uppercase tracking-[0.15em] text-ink-900">
              {s.label}
            </span>
            <span className="mt-1 text-xs text-ink-500">{s.sub}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
