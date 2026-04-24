import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { SlowPayingClient } from '@/actions/dashboard-actions';


interface SlowPayingClientsProps {
  data: SlowPayingClient[];
}

export function SlowPayingClients({ data }: SlowPayingClientsProps) {
  const getSeverityColor = (days: number) => {
    if (days > 45) return 'destructive';
    if (days > 30) return 'secondary';
    return 'default';
  };

  const getSeverityBgColor = (days: number) => {
    if (days > 45) return 'bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800/50';
    if (days > 30) return 'bg-orange-50 dark:bg-orange-950/30 border-orange-200 dark:border-orange-800/50';
    return 'bg-yellow-50 dark:bg-yellow-950/30 border-yellow-200 dark:border-yellow-800/50';
  };

  // Limit to 5 items
  const limitedData = data.slice(0, 5);

  return (
    <Card className="col-span-1 lg:col-span-2 bg-gradient-to-br from-slate-50 dark:from-slate-900/50">
      <CardHeader>
        <CardTitle>Slow Paying Clients {limitedData.length > 0 && <span className="text-sm font-normal text-muted-foreground">({limitedData.length})</span>}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {limitedData.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">No slow paying clients</p>
          ) : (
            limitedData.map((client) => (
              <div
                key={client.id}
                className={`flex items-center justify-between p-4 rounded-xl border-2 transition-all ${getSeverityBgColor(client.daysOverdue)} hover:shadow-md`}
              >
                <div className="flex-1">
                  <p className="font-semibold text-sm">{client.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {client.daysOverdue} days overdue
                  </p>
                </div>
                <div className="text-right space-y-1">
                  <p className="font-bold text-sm">${client.amount.toLocaleString()}</p>
                  <Badge variant={getSeverityColor(client.daysOverdue)} className="text-xs">
                    {client.daysOverdue}d overdue
                  </Badge>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
