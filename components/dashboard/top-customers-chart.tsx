'use client';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TopCustomer } from '@/actions/dashboard-actions';


interface TopCustomersChartProps {
  data: TopCustomer[];
}

export function TopCustomersChart({ data }: TopCustomersChartProps) {
  // Format data for display and limit to 5 items
  const chartData = data.slice(0, 5).map((customer) => ({
    name: customer.name.split(' ')[0], // First word only for compact display
    value: customer.totalRevenue,
  }));

  return (
    <Card className="col-span-1 bg-gradient-to-br from-slate-50 dark:from-slate-900/50">
      <CardHeader>
        <CardTitle className="text-base">Top {Math.min(5, chartData.length)} Customers</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.5} vertical={false} />
            <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" style={{ fontSize: '12px' }} />
            <YAxis stroke="hsl(var(--muted-foreground))" style={{ fontSize: '12px' }} />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '2px solid #f97316',
                borderRadius: '12px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              }}
              labelStyle={{ color: 'hsl(var(--foreground))', fontWeight: 'bold' }}
              formatter={(value) => [`$${Number(value).toLocaleString()}`, 'Revenue']}
            />
            <Bar
              dataKey="value"
              fill="#f97316"
              radius={[8, 8, 0, 0]}
              animationDuration={800}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
