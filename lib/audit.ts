// Audit log tracking utilities

export interface AuditChange {
  field: string
  oldValue: unknown
  newValue: unknown
  changed: boolean
}

export interface AuditLog {
  action: 'created' | 'edited' | 'deleted'
  changedFields: string[]
  oldValues: Record<string, unknown>
  newValues: Record<string, unknown>
  changedAt: Date
}

/**
 * Compare two objects and identify changes
 */
export function compareObjects(
  oldObj: Record<string, unknown>,
  newObj: Record<string, unknown>,
  ignoreFields: string[] = ['createdAt', 'updatedAt', 'id']
): AuditChange[] {
  const changes: AuditChange[] = []
  const allKeys = new Set([...Object.keys(oldObj || {}), ...Object.keys(newObj || {})])

  allKeys.forEach((key) => {
    if (ignoreFields.includes(key)) return

    const oldValue = oldObj?.[key]
    const newValue = newObj?.[key]

    // Compare with deep equality for arrays
    const isChanged =
      Array.isArray(oldValue) && Array.isArray(newValue)
        ? JSON.stringify(oldValue) !== JSON.stringify(newValue)
        : oldValue !== newValue

    if (isChanged) {
      changes.push({
        field: key,
        oldValue: oldValue ?? null,
        newValue: newValue ?? null,
        changed: true,
      })
    }
  })

  return changes
}

/**
 * Format a changed value for display
 */
export function formatChangedValue(value: unknown): string {
  if (value === null || value === undefined) {
    return 'N/A'
  }

  if (typeof value === 'boolean') {
    return value ? 'Yes' : 'No'
  }

  if (value instanceof Date) {
    return value.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  if (Array.isArray(value)) {
    if (value.length === 0) return 'Empty'
    // For JSON arrays, try to parse and display nicely
    try {
      const parsed = value.map((v) => {
        if (typeof v === 'string') {
          try {
            return JSON.parse(v)
          } catch {
            return v
          }
        }
        return v
      })
      return JSON.stringify(parsed, null, 2)
    } catch {
      return value.join(', ')
    }
  }

  if (typeof value === 'object') {
    return JSON.stringify(value, null, 2)
  }

  return String(value)
}

/**
 * Get human-readable field name
 */
export function getFieldLabel(field: string): string {
  return field
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (str) => str.toUpperCase())
    .trim()
}

/**
 * Create audit log entry
 */
export function createAuditLog(
  action: 'created' | 'edited' | 'deleted',
  oldData: Record<string, unknown> | null,
  newData: Record<string, unknown> | null
): Omit<AuditLog, 'changedAt'> {
  const changes =
    action === 'created' && !oldData
      ? // For creation, all fields in newData are "changes"
        Object.keys(newData || {}).reduce((acc, key) => {
          acc[key] = newData![key]
          return acc
        }, {} as Record<string, unknown>)
      : action === 'deleted' && !newData
        ? // For deletion, track old values
        Object.keys(oldData || {}).reduce((acc, key) => {
          acc[key] = oldData![key]
          return acc
        }, {} as Record<string, unknown>)
        : // For edits, only track what changed
        compareObjects(oldData || {}, newData || {}).reduce((acc, change) => {
          acc[change.field] = change.newValue
          return acc
        }, {} as Record<string, unknown>)

  const changedFields =
    action === 'created'
      ? Object.keys(newData || {})
      : action === 'deleted'
        ? Object.keys(oldData || {})
        : compareObjects(oldData || {}, newData || {}).map((c) => c.field)

  return {
    action,
    changedFields,
    oldValues: oldData || {},
    newValues: newData || {},
  }
}

/**
 * Get change summary for display
 */
export function getChangeSummary(
  changes: AuditChange[]
): {
  summary: string
  details: Array<{ field: string; old: string; new: string }>
} {
  const details = changes.map((change) => ({
    field: getFieldLabel(change.field),
    old: formatChangedValue(change.oldValue),
    new: formatChangedValue(change.newValue),
  }))

  const summary =
    changes.length === 1
      ? `1 field changed: ${getFieldLabel(changes[0].field)}`
      : `${changes.length} fields changed`

  return { summary, details }
}
