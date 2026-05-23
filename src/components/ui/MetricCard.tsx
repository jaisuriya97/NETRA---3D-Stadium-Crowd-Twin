import React from 'react';
import { Card } from './Card';
import { LucideIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle: string;
  icon: LucideIcon;
  id?: string;
  trendType?: 'safe' | 'warning' | 'critical' | 'neutral';
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  id,
  trendType = 'neutral'
}) => {
  let indicatorColor = "text-neutral-400";
  if (trendType === 'safe') indicatorColor = "text-[#00A699]";
  if (trendType === 'warning') indicatorColor = "text-[#FFB400]";
  if (trendType === 'critical') indicatorColor = "text-[#C13515]";

  return (
    <Card id={id} className="relative overflow-hidden flex flex-col justify-between h-full bg-white border border-[#DDDDDD] p-6 rounded-xl hover:shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <span className="text-xs font-semibold text-[#717171] uppercase tracking-wider">
            {title}
          </span>
          <div className="mt-2 text-3xl font-bold text-[#222222] tracking-tight tabular-nums overflow-hidden h-10">
            <AnimatePresence mode="popLayout">
              <motion.span
                key={value}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -20, opacity: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                className="inline-block"
              >
                {value}
              </motion.span>
            </AnimatePresence>
          </div>
        </div>
        <div className={`p-2 rounded-lg bg-[#F7F7F7] ${indicatorColor}`}>
          <Icon strokeWidth={1.5} className="h-5 w-5" />
        </div>
      </div>
      <div className="mt-4 flex items-center text-xs text-[#717171] font-medium border-t border-[#F7F7F7] pt-3">
        <span className="truncate">{subtitle}</span>
      </div>
    </Card>
  );
};
