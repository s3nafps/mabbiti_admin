import { ReactNode } from 'react';
import { motion } from 'motion/react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface StatCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  trend?: {
    value: number;
    isUp: boolean;
  };
  className?: string;
}

export default function StatCard({ title, value, icon, trend, className }: StatCardProps) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      className={cn("glass-card p-6 flex items-start justify-between", className)}
    >
      <div>
        <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
        <h3 className="text-2xl font-bold text-dark-blue font-display">{value}</h3>
        {trend && (
          <div className={cn(
            "mt-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium",
            trend.isUp ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
          )}>
            {trend.isUp ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
            {trend.value}%
          </div>
        )}
      </div>
      <div className="p-3 bg-gray-50 rounded-xl">
        {icon}
      </div>
    </motion.div>
  );
}
