'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { Search, Filter, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';

const defaultAvatar =
  'https://res.cloudinary.com/dbm0tkc3n/image/upload/v1773924504/no_photo_pgl4oj.png';

interface ActivityLog {
  id: string;
  action: string;
  createdAt: string;
  metadata?: any;
  user?: {
    firstName: string;
    lastName: string;
    email: string;
    role: string;
    avatar?: string;
  };
}

interface ActivityLogsTableProps {
  logs: ActivityLog[];
  getLinkForAction: (log: ActivityLog) => string | null;
}

export function ActivityLogsTable({ logs }: { logs: ActivityLog[] }) {
  const getLinkForAction = (log: ActivityLog) => {
  if (!log.metadata) return null;

  const meta = log.metadata;

  // Check receipts
  if (meta.receiptId) {
    // If action is delete
    if (log.action.toLowerCase().includes("delete")) {
      return `/dashboard/receipt/view/${meta.receiptId}?deleted=true`;
    }

    // If action is edit
    if (log.action.toLowerCase().includes("edit")) {
      return `/dashboard/receipt/edit/${meta.receiptId}`;
    }

    // Default view
    return `/dashboard/receipt/view/${meta.receiptId}`;
  }

  if (meta.companyId) return `/company-settings/${meta.companyId}`;
  if (meta.targetUserId) return `/admin/users/${meta.targetUserId}`;

  return null;
};


  
  const [searchQuery, setSearchQuery] = useState('');
  const [filterDate, setFilterDate] = useState('');
  const [filterTime, setFilterTime] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  // Filtered logs based on search and filters
  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      const userName = `${log.user?.firstName || ''} ${log.user?.lastName || ''}`.toLowerCase();
      const searchLower = searchQuery.toLowerCase();
      const logDate = new Date(log.createdAt).toLocaleDateString();
      const logTime = new Date(log.createdAt).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      });

      // Search filter
      const matchesSearch = !searchQuery || userName.includes(searchLower);

      // Date filter
      const matchesDate = !filterDate || logDate === filterDate;

      // Time filter (checks if log time starts with the filter time)
      const matchesTime = !filterTime || logTime.startsWith(filterTime);

      return matchesSearch && matchesDate && matchesTime;
    });
  }, [logs, searchQuery, filterDate, filterTime]);

  const clearFilters = () => {
    setSearchQuery('');
    setFilterDate('');
    setFilterTime('');
  };

  const hasActiveFilters = searchQuery || filterDate || filterTime;

  return (
    <div className="w-full space-y-4">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          type="text"
          placeholder="Search by user name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 bg-background border-border"
        />
      </div>

      {/* Filter Toggle and Controls */}
      <div className="space-y-3">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-border hover:bg-muted transition-colors"
        >
          <Filter className="h-4 w-4" />
          <span className="text-sm font-medium">Filters</span>
          {hasActiveFilters && (
            <span className="ml-1 px-2 py-0.5 bg-primary text-primary-foreground rounded-full text-xs font-semibold">
              {[searchQuery, filterDate, filterTime].filter(Boolean).length}
            </span>
          )}
        </button>

        {/* Filter Panel */}
        {showFilters && (
          <Card className="p-4 bg-card border-border space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Date Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Date</label>
                <Input
                  type="date"
                  value={filterDate}
                  onChange={(e) => setFilterDate(e.target.value)}
                  className="bg-background border-border"
                />
              </div>

              {/* Time Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Time (HH:MM)</label>
                <Input
                  type="text"
                  placeholder="e.g., 14:30"
                  value={filterTime}
                  onChange={(e) => setFilterTime(e.target.value)}
                  className="bg-background border-border"
                />
              </div>

              {/* Clear Filters */}
              {hasActiveFilters && (
                <div className="flex items-end">
                  <Button
                    onClick={clearFilters}
                    variant="outline"
                    className="w-full gap-2"
                  >
                    <X className="h-4 w-4" />
                    Clear Filters
                  </Button>
                </div>
              )}
            </div>
          </Card>
        )}
      </div>

      {/* Results Count */}
      {hasActiveFilters && (
        <div className="text-sm text-muted-foreground">
          Showing {filteredLogs.length} of {logs.length} logs
        </div>
      )}

      {/* Table */}
      {filteredLogs.length === 0 ? (
        <div className="p-6 rounded-lg bg-card border border-border text-center">
          <p className="text-muted-foreground">
            {hasActiveFilters
              ? 'No logs match your filters. Try adjusting your search.'
              : 'No activity logs found.'}
          </p>
        </div>
      ) : (
        <div className="rounded-lg border border-border overflow-hidden shadow-lg">
          {/* Desktop View - Table */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full bg-card text-sm">
              <thead className="bg-secondary border-b border-border sticky top-0">
                <tr>
                  <th className="px-4 py-4 text-left font-semibold text-secondary-foreground">
                    User
                  </th>
                  <th className="px-4 py-4 text-left font-semibold text-secondary-foreground">
                    Role
                  </th>
                  <th className="px-4 py-4 text-left font-semibold text-secondary-foreground">
                    Action
                  </th>
                  <th className="px-4 py-4 text-left font-semibold text-secondary-foreground">
                    Date & Time
                  </th>
                  <th className="px-4 py-4 text-left font-semibold text-secondary-foreground">
                    Link
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredLogs.map((log) => {
                  const link = getLinkForAction(log);
                  const dateTime = new Date(log.createdAt);
                  const formattedDate = dateTime.toLocaleDateString();
                  const formattedTime = dateTime.toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                    hour12: true,
                  });

                  return (
                    <tr
                      key={log.id}
                      className="hover:bg-muted/50 transition-colors"
                    >
                      <td className="px-4 py-4 font-medium text-card-foreground">
                        <div className="flex items-center gap-3">
                          <img
                            src={log.user?.avatar || defaultAvatar}
                            alt={`${log.user?.firstName || 'User'} ${log.user?.lastName || ''}`}
                            className="w-8 h-8 rounded-full object-cover border border-border flex-shrink-0"
                          />
                          <span className="truncate">
                            {log.user
                              ? `${log.user.firstName} ${log.user.lastName}`
                              : 'Unknown'}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-card-foreground text-xs">
                        <span className="inline-block px-2 py-1 bg-primary/10 text-primary rounded-full font-medium">
                          {log.user?.role || '-'}
                        </span>
                      </td>
                      <td className="px-4 py-4 font-semibold text-accent text-xs">
                        {log.action}
                      </td>
                      <td className="px-4 py-4 text-card-foreground text-xs whitespace-nowrap">
                        <div>
                          <div>{formattedDate}</div>
                          <div className="text-muted-foreground">{formattedTime}</div>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        {link ? (
                          <a
                            href={link}
                            className="text-primary hover:text-primary/80 hover:underline transition-colors text-xs font-medium"
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
              const dateTime = new Date(log.createdAt);
              const formattedDate = dateTime.toLocaleDateString();
              const formattedTime = dateTime.toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: true,
              });

              return (
                <div
                  key={log.id}
                  className="p-4 bg-card hover:bg-muted/50 transition-colors space-y-3"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={log.user?.avatar || defaultAvatar}
                        alt={`${log.user?.firstName || 'User'} ${log.user?.lastName || ''}`}
                        className="w-10 h-10 rounded-full object-cover border border-border flex-shrink-0"
                      />
                      <div className="min-w-0">
                        <p className="text-xs font-medium text-muted-foreground uppercase">
                          User
                        </p>
                        <p className="font-semibold text-card-foreground truncate">
                          {log.user
                            ? `${log.user.firstName} ${log.user.lastName}`
                            : 'Unknown'}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          {log.user?.email || '-'}
                        </p>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-xs font-medium text-muted-foreground uppercase">
                        Role
                      </p>
                      <span className="inline-block px-2 py-1 bg-primary/10 text-primary rounded text-xs font-medium">
                        {log.user?.role || '-'}
                      </span>
                    </div>
                  </div>

                  <div className="border-t border-border pt-3 space-y-3">
                    <div>
                      <p className="text-xs font-medium text-muted-foreground uppercase">
                        Action
                      </p>
                      <p className="font-semibold text-accent text-sm">{log.action}</p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-muted-foreground uppercase">
                        Date & Time
                      </p>
                      <p className="text-xs text-card-foreground">
                        {formattedDate}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formattedTime}
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
