'use client';

import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import styles from './activity-logs-filter.module.css';

const defaultAvatar =
  "https://res.cloudinary.com/dbm0tkc3n/image/upload/v1773924504/no_photo_pgl4oj.png";

export function ActivityLogsFilter({
  activityLogs,
}: {
  activityLogs: any[];
}) {
  const getLinkForAction = (log: any) => {
  if (!log.metadata) return null;

  const meta = log.metadata;

  // Check receipts
  if (meta.receiptId) {
    // If action is delete
    if (log.action.toLowerCase().includes("delete")) {
      return `/dashboard/receipt/receiptlogs/view/${meta.receiptId}?deleted=true`;
    }

    // If action is edit
    if (log.action.toLowerCase().includes("edit")) {
      return `/dashboard/receipt/receiptlogs/view/${meta.receiptId}`;
    }

    // Default view
    return `/dashboard/receipt/receiptlogs/view/${meta.receiptId}`;
  }

  if (meta.companyId) return `/company-settings/${meta.companyId}`;
  if (meta.targetUserId) return `/admin/users/${meta.targetUserId}`;

  return null;
};
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Filter logs based on date range
  const filteredLogs = useMemo(() => {
    return activityLogs.filter((log) => {
      const logDate = new Date(log.createdAt);

      if (startDate) {
        const start = new Date(startDate);
        if (logDate < start) return false;
      }

      if (endDate) {
        const end = new Date(endDate);
        // Set end date to end of day (23:59:59)
        end.setHours(23, 59, 59, 999);
        if (logDate > end) return false;
      }

      return true;
    });
  }, [activityLogs, startDate, endDate]);

  const handleReset = () => {
    setStartDate('');
    setEndDate('');
  };

  return (
    <div className="space-y-6">
      {/* Filter Section */}
      <div className="rounded-lg border border-border bg-card p-4 sm:p-6">
        <h2 className="text-lg font-semibold text-foreground mb-4">Filter Logs</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          {/* Start Date */}
          <div className="space-y-2 min-w-0">
            <Label htmlFor="start-date" className="text-sm font-medium">
              Start Date & Time
            </Label>
            <Input
              id="start-date"
              type="datetime-local"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className={`w-full min-w-0 ${styles.datetimeInput}`}
            />
          </div>

          {/* End Date */}
          <div className="space-y-2 min-w-0">
            <Label htmlFor="end-date" className="text-sm font-medium">
              End Date & Time
            </Label>
            <Input
              id="end-date"
              type="datetime-local"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className={`w-full min-w-0 ${styles.datetimeInput}`}
            />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-2">
          <Button
            onClick={handleReset}
            variant="outline"
            className="sm:w-auto"
          >
            Clear Filters
          </Button>
          <p className="text-xs sm:text-sm text-muted-foreground sm:ml-auto sm:self-center">
            Showing {filteredLogs.length} of {activityLogs.length} logs
          </p>
        </div>
      </div>

      {/* Logs Display */}
      {filteredLogs.length === 0 ? (
        <div className="p-6 rounded-lg bg-card border border-border">
          <p className="text-muted-foreground">
            {activityLogs.length === 0
              ? "You haven't done any activity yet."
              : 'No logs found matching the selected filters.'}
          </p>
        </div>
      ) : (
        <div className="rounded-lg border border-border overflow-hidden shadow-lg">
          {/* Desktop View - Table */}
          <div className="hidden lg:block">
            <table className="w-full bg-card text-sm">
              <thead className="bg-secondary border-b border-border sticky top-0">
                <tr>
                  <th className="px-3 py-3 text-left font-semibold text-secondary-foreground">
                    User
                  </th>
                  <th className="px-3 py-3 text-left font-semibold text-secondary-foreground">
                    Action
                  </th>
                  <th className="px-3 py-3 text-left font-semibold text-secondary-foreground">
                    Date
                  </th>
                  <th className="px-3 py-3 text-left font-semibold text-secondary-foreground">
                    Link
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredLogs.map((log) => {
                  const link = getLinkForAction(log);
                  return (
                    <tr
                      key={log.id}
                      className="hover:bg-muted/50 transition-colors"
                    >
                      <td className="px-3 py-3 font-medium text-card-foreground">
                        <div className="flex items-center gap-2">
                          <img
                            src={log.user?.avatar || defaultAvatar}
                            alt={log.user?.firstName || "User"}
                            className="w-8 h-8 rounded-full object-cover border border-border flex-shrink-0"
                          />
                          <span className="truncate">
                            {log.user
                              ? `${log.user.firstName} ${log.user.lastName}`
                              : "Unknown User"}
                          </span>
                        </div>
                      </td>
                      <td className="px-3 py-3 font-semibold text-accent">
                        {log.action}
                      </td>
                      <td className="px-3 py-3 text-card-foreground text-xs whitespace-nowrap">
                        {new Date(log.createdAt).toLocaleString()}
                      </td>
                      <td className="px-3 py-3">
                        {link ? (
                          <a
                            href={link}
                            className="text-primary hover:text-primary/80 hover:underline transition-colors text-xs"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            View
                          </a>
                        ) : (
                          <span className="text-muted-foreground text-xs">-</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile & Tablet View - Card Layout */}
          <div className="lg:hidden divide-y divide-border">
            {filteredLogs.map((log) => {
              const link = getLinkForAction(log);
              return (
                <div
                  key={log.id}
                  className="p-4 bg-card hover:bg-muted/50 transition-colors space-y-3"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={log.user?.avatar || defaultAvatar}
                        alt={log.user?.firstName || "User"}
                        className="w-10 h-10 rounded-full object-cover border border-border flex-shrink-0"
                      />
                      <div className="min-w-0">
                        <p className="text-xs font-medium text-muted-foreground uppercase">
                          User
                        </p>
                        <p className="font-semibold text-card-foreground truncate">
                          {log.user
                            ? `${log.user.firstName} ${log.user.lastName}`
                            : "Unknown User"}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-border pt-3 space-y-2">
                    <div>
                      <p className="text-xs font-medium text-muted-foreground uppercase">
                        Action
                      </p>
                      <p className="font-semibold text-accent text-sm">
                        {log.action}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-muted-foreground uppercase">
                        Date
                      </p>
                      <p className="text-xs text-card-foreground">
                        {new Date(log.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  {link && (
                    <div className="border-t border-border pt-3">
                      <a
                        href={link}
                        className="text-primary hover:text-primary/80 hover:underline transition-colors text-xs font-medium"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        View Related Item →
                      </a>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
