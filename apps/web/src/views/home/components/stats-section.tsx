import { StatMetricCard } from './stat-metric-card';

export interface HeroMetric {
  label: string;
  value: string;
}

interface StatsSectionProps {
  metrics: HeroMetric[];
}

export const StatsSection = ({ metrics }: StatsSectionProps) => (
  <section className='border-y border-border/80 bg-surface px-4 py-8 md:py-16'>
    <div className='mx-auto grid max-w-[1200px] grid-cols-1 gap-8 sm:grid-cols-3 sm:gap-6'>
      {metrics.map((metric) => {
        return <StatMetricCard key={metric.label} value={metric.value} label={metric.label} />;
      })}
    </div>
  </section>
);
