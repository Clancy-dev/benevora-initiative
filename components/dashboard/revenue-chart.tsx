'use client';

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RevenueTrend } from '@/actions/dashboard-actions';


interface RevenueChartProps {
  data: RevenueTrend[];
}

export function RevenueChart({ data }: RevenueChartProps) {
  return (
    <Card className="col-span-1 lg:col-span-2 bg-gradient-to-br from-slate-50 dark:from-slate-900/50">
      <CardHeader>
        <CardTitle className="text-lg">Revenue Trends</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
          <LineChart
            data={data}
            margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="hsl(var(--border))"
              opacity={0.5}
              vertical={false}
            />
            <XAxis
              dataKey="period"
              stroke="hsl(var(--muted-foreground))"
              style={{ fontSize: '12px' }}
            />
            <YAxis
              stroke="hsl(var(--muted-foreground))"
              style={{ fontSize: '12px' }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '2px solid hsl(var(--primary))',
                borderRadius: '12px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              }}
              labelStyle={{ color: 'hsl(var(--foreground))', fontWeight: 'bold' }}
              formatter={(value) => [`$${Number(value).toLocaleString()}`, '']}
            />
            <Legend
              wrapperStyle={{
                paddingTop: '20px',
                fontSize: '13px',
              }}
              iconType="line"
            />
            <Line
              type="natural"
              dataKey="today"
              stroke="#7c3aed"
              dot={{ fill: '#7c3aed', r: 5 }}
              activeDot={{ r: 7, fill: '#7c3aed' }}
              strokeWidth={3}
              name="Today"
            />
            <Line
              type="natural"
              dataKey="week"
              stroke="#f97316"
              dot={{ fill: '#f97316', r: 5 }}
              activeDot={{ r: 7, fill: '#f97316' }}
              strokeWidth={3}
              name="This Week"
            />
            <Line
              type="natural"
              dataKey="month"
              stroke="#06b6d4"
              dot={{ fill: '#06b6d4', r: 5 }}
              activeDot={{ r: 7, fill: '#06b6d4' }}
              strokeWidth={3}
              name="This Month"
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
