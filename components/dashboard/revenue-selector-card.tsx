'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface RevenueSelectorCardProps {
  todayRevenue: number;
  weekRevenue: number;
  monthRevenue: number;
}

export function RevenueSelectorCard({
  todayRevenue,
  weekRevenue,
  monthRevenue,
}: RevenueSelectorCardProps) {
  const [period, setPeriod] = useState<'today' | 'week' | 'month'>('month');

  const getRevenue = () => {
    switch (period) {
      case 'today':
        return todayRevenue;
      case 'week':
        return weekRevenue;
      case 'month':
        return monthRevenue;
    }
  };

  const getLabel = () => {
    switch (period) {
      case 'today':
        return 'Today Revenue';
      case 'week':
        return 'This Week Revenue';
      case 'month':
        return 'This Month Revenue';
    }
  };

  const formatCurrency = (amount: number) =>
    `$${amount.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;

  return (
    <Card className="bg-gradient-to-br from-purple-50 to-purple-50/50 dark:from-purple-950/40 dark:to-purple-950/20 border-2 border-purple-200/50 dark:border-purple-800/50">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-semibold text-purple-700 dark:text-purple-300">
          Total Revenue
        </CardTitle>
        <select
          value={period}
          onChange={(e) => setPeriod(e.target.value as 'today' | 'week' | 'month')}
          className="text-xs px-2 py-1 rounded-lg border border-purple-200 dark:border-purple-700 bg-white dark:bg-slate-800 text-purple-700 dark:text-purple-300 font-medium focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          <option value="today">Today</option>
          <option value="week">This Week</option>
          <option value="month">This Month</option>
        </select>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="text-3xl font-bold text-purple-700 dark:text-purple-300">
            {formatCurrency(getRevenue())}
          </div>
          <p className="text-xs text-muted-foreground">{getLabel()}</p>
        </div>
      </CardContent>
    </Card>
  );
}
