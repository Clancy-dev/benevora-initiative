'use client'

import { useEffect, useMemo, useState } from 'react'
import { MoreVertical, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'
import { getAllUsers } from '@/actions/activity-actions'

const defaultAvatar =
  'https://res.cloudinary.com/dbm0tkc3n/image/upload/v1773924504/no_photo_pgl4oj.png'

interface User {
  id: string
  firstName: string
  lastName: string
  email: string
  role: 'ADMIN' | 'USER'
  avatar?: string | null
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Fetch users on mount
  useEffect(() => {
  const fetchUsers = async () => {
    try {
      setLoading(true)

      const data = await getAllUsers() // ✅ direct call

      setUsers(data)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  fetchUsers()
}, [])


  // Filter users based on search query
  const filteredUsers = useMemo(() => {
    if (!searchQuery) return users
    const query = searchQuery.toLowerCase()
    return users.filter(
      (user) =>
        `${user.firstName} ${user.lastName}`.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query)
    )
  }, [users, searchQuery])

  const handleViewUser = (userId: string) => {
    console.log('View user:', userId)
  }

  const handleEditUser = (userId: string) => {
    console.log('Edit user:', userId)
  }

  const handleDeleteUser = (userId: string) => {
    console.log('Delete user:', userId)
  }

  const handlePromoteUser = (userId: string) => {
    console.log('Promote user to admin:', userId)
  }

  const handleDemoteUser = (userId: string) => {
    console.log('Demote user to user:', userId)
  }

  if (error) {
    return (
      <main className="min-h-screen bg-background p-4 sm:p-6 md:p-8">
        <div className="text-destructive font-semibold">{error}</div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-background p-4 sm:p-6 md:p-8">
      <div className="w-full max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-2">
            Users
          </h1>
          <p className="text-sm text-muted-foreground">
            Manage and monitor all users in your system
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search by name or email..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading users...</p>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="rounded-lg border border-border bg-card p-8 text-center">
            <p className="text-muted-foreground">
              {searchQuery
                ? 'No users match your search.'
                : 'No users found.'}
            </p>
          </div>
        ) : (
          <div className="rounded-lg border border-border overflow-hidden shadow-lg">
            {/* Desktop Table View */}
            <div className="hidden lg:block">
              <div className="overflow-x-auto">
                <table className="w-full bg-card text-sm">
                  <thead className="bg-secondary border-b border-border sticky top-0">
                    <tr>
                      <th className="px-4 py-3 text-left font-semibold text-secondary-foreground">
                        User
                      </th>
                      <th className="px-4 py-3 text-left font-semibold text-secondary-foreground">
                        Email
                      </th>
                      <th className="px-4 py-3 text-left font-semibold text-secondary-foreground">
                        Role
                      </th>
                      <th className="px-4 py-3 text-right font-semibold text-secondary-foreground">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {filteredUsers.map((user) => (
                      <tr
                        key={user.id}
                        className="hover:bg-muted/50 transition-colors"
                      >
                        <td className="px-4 py-3 font-medium text-card-foreground">
                          <div className="flex items-center gap-3">
                            <Avatar className="w-8 h-8">
                              <AvatarImage
                                src={user.avatar || defaultAvatar}
                                alt={`${user.firstName} ${user.lastName}`}
                              />
                              <AvatarFallback>
                                {user.firstName[0]}
                                {user.lastName[0]}
                              </AvatarFallback>
                            </Avatar>
                            <span className="truncate">
                              {user.firstName} {user.lastName}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-card-foreground text-sm">
                          {user.email}
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-semibold ${
                              user.role === 'ADMIN'
                                ? 'bg-accent/20 text-accent'
                                : 'bg-muted text-muted-foreground'
                            }`}
                          >
                            {user.role}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon-sm"
                                className="h-8 w-8"
                              >
                                <MoreVertical className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={() => handleViewUser(user.id)}
                              >
                                View User
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleEditUser(user.id)}
                              >
                                Edit User
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              {user.role === 'USER' ? (
                                <DropdownMenuItem
                                  onClick={() => handlePromoteUser(user.id)}
                                >
                                  Promote to Admin
                                </DropdownMenuItem>
                              ) : (
                                <DropdownMenuItem
                                  onClick={() => handleDemoteUser(user.id)}
                                >
                                  Demote to User
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() => handleDeleteUser(user.id)}
                                className="text-destructive"
                              >
                                Delete User
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Mobile Card View */}
            <div className="lg:hidden divide-y divide-border">
              {filteredUsers.map((user) => (
                <div
                  key={user.id}
                  className="p-4 bg-card hover:bg-muted/50 transition-colors space-y-3"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <Avatar className="w-10 h-10 flex-shrink-0">
                        <AvatarImage
                          src={user.avatar || defaultAvatar}
                          alt={`${user.firstName} ${user.lastName}`}
                        />
                        <AvatarFallback>
                          {user.firstName[0]}
                          {user.lastName[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <p className="font-semibold text-card-foreground truncate">
                          {user.firstName} {user.lastName}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          {user.email}
                        </p>
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          className="h-8 w-8 flex-shrink-0"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => handleViewUser(user.id)}
                        >
                          View User
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleEditUser(user.id)}
                        >
                          Edit User
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        {user.role === 'USER' ? (
                          <DropdownMenuItem
                            onClick={() => handlePromoteUser(user.id)}
                          >
                            Promote to Admin
                          </DropdownMenuItem>
                        ) : (
                          <DropdownMenuItem
                            onClick={() => handleDemoteUser(user.id)}
                          >
                            Demote to User
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => handleDeleteUser(user.id)}
                          className="text-destructive"
                        >
                          Delete User
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  <div className="border-t border-border pt-3">
                    <div className="flex items-center justify-between">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          user.role === 'ADMIN'
                            ? 'bg-accent/20 text-accent'
                            : 'bg-muted text-muted-foreground'
                        }`}
                      >
                        {user.role}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Results Count */}
        {filteredUsers.length > 0 && (
          <div className="mt-4 text-sm text-muted-foreground">
            Showing {filteredUsers.length} of {users.length} user
            {users.length !== 1 ? 's' : ''}
          </div>
        )}
      </div>
    </main>
  )
}
