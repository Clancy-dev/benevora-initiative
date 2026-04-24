import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ReactNode;
  variant?: 'default' | 'highlight' | 'primary' | 'secondary' | 'accent';
}

const variantStyles = {
  default: 'bg-gradient-to-br from-blue-50 to-blue-50/50 dark:from-blue-950/40 dark:to-blue-950/20 border-blue-200/50 dark:border-blue-800/50',
  highlight: 'bg-gradient-to-br from-orange-50 to-orange-50/50 dark:from-orange-950/40 dark:to-orange-950/20 border-orange-200/50 dark:border-orange-800/50',
  primary: 'bg-gradient-to-br from-purple-50 to-purple-50/50 dark:from-purple-950/40 dark:to-purple-950/20 border-purple-200/50 dark:border-purple-800/50',
  secondary: 'bg-gradient-to-br from-amber-50 to-amber-50/50 dark:from-amber-950/40 dark:to-amber-950/20 border-amber-200/50 dark:border-amber-800/50',
  accent: 'bg-gradient-to-br from-rose-50 to-rose-50/50 dark:from-rose-950/40 dark:to-rose-950/20 border-rose-200/50 dark:border-rose-800/50',
};

const textColorStyles = {
  default: 'text-blue-700 dark:text-blue-300',
  highlight: 'text-orange-700 dark:text-orange-300',
  primary: 'text-purple-700 dark:text-purple-300',
  secondary: 'text-amber-700 dark:text-amber-300',
  accent: 'text-rose-700 dark:text-rose-300',
};

export function MetricCard({
  title,
  value,
  subtitle,
  icon,
  variant = 'default',
}: MetricCardProps) {
  return (
    <Card className={`${variantStyles[variant]} border-2`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className={`text-sm font-semibold ${textColorStyles[variant]}`}>
          {title}
        </CardTitle>
        {icon && <div className="text-2xl">{icon}</div>}
      </CardHeader>
      <CardContent>
        <div className={`text-3xl font-bold ${textColorStyles[variant]}`}>{value}</div>
        {subtitle && (
          <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
        )}
      </CardContent>
    </Card>
  );
}
