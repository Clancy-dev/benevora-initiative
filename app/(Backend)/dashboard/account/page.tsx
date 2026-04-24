import { getUserData } from "@/actions/user-actions"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Edit2, Mail, Calendar, Shield } from "lucide-react"
import Link from "next/link"
import { getServerSession } from "next-auth/next"
import { redirect } from "next/navigation"
import Image from "next/image"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

const defaultAvatar =
  'https://res.cloudinary.com/dbm0tkc3n/image/upload/v1773924504/no_photo_pgl4oj.png'

export const metadata = {
  title: "Account | Receipt Generator",
  description: "View and manage your account information",
}

export default async function AccountPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/login")
  }

  const result = await getUserData()

  if (!result.success || !result.user) {
    return (
      <div className="min-h-screen p-4 sm:p-6 md:p-8 ">
        <div className="container mx-auto px-4 py-12">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground mb-4">Error</h1>
            <p className="text-muted-foreground mb-6">{result.error || "Failed to load account data"}</p>
            <Link href="/">
              <Button>Back to Home</Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const user = result.user
  const avatarUrl = user.avatar || defaultAvatar
  const initials = `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase()
  const roleColor = user.role === "ADMIN" ? "destructive" : "secondary"
  const joinDate = new Date(user.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  return (
    <div className="min-h-screen bg-white dark:bg-background">
      <div className="container mx-auto px-4 py-12 pt-10">
        {/* Header */}
        <div className="mb-8 md:px-8">
          <h1 className="text-4xl font-bold text-foreground">My Account</h1>
          <p className="text-muted-foreground mt-2">
            Manage your profile and account settings
          </p>
        </div>

        {/* Main Card */}
        <Card className="max-w-2xl mx-auto">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-8">
            <CardTitle className="text-2xl">Account Information</CardTitle>
            <Link href="/dashboard/account/edit">
              <Button variant="outline" size="sm" className="gap-2">
                <Edit2 className="h-4 w-4" />
                Edit Profile
              </Button>
            </Link>
          </CardHeader>

          <CardContent className="space-y-8">
            {/* Avatar Section */}
            <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start">
              <div className="relative">
                <Avatar className="h-24 w-24 border-2 border-primary/20">
                  <AvatarImage
                    src={avatarUrl}
                    alt={`${user.firstName} ${user.lastName}`}
                    className="object-cover"
                  />
                  <AvatarFallback className="bg-primary/10 text-lg font-semibold">
                    {initials}
                  </AvatarFallback>
                </Avatar>
              </div>

              {/* Basic Info */}
              <div className="flex-1 text-center sm:text-left">
                <h2 className="text-2xl font-bold text-foreground">
                  {user.firstName} {user.lastName}
                </h2>
                <p className="text-muted-foreground mt-1 flex flex-col sm:flex-row gap-2 justify-center sm:justify-start items-center sm:items-start">
                  <Mail className="h-4 w-4 flex-shrink-0" />
                  {user.email}
                </p>
                <div className="mt-3">
                  <Badge variant={roleColor} className="text-xs gap-1">
                    <Shield className="h-3 w-3" />
                    {user.role}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-border/30" />

            {/* Detailed Info Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* First Name */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">
                  First Name
                </label>
                <p className="text-foreground font-medium">{user.firstName}</p>
              </div>

              {/* Last Name */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">
                  Last Name
                </label>
                <p className="text-foreground font-medium">{user.lastName}</p>
              </div>

              {/* Email */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">
                  Email Address
                </label>
                <p className="text-foreground font-medium break-all">{user.email}</p>
              </div>

              {/* Role */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">
                  Account Role
                </label>
                <p className="text-foreground font-medium">{user.role}</p>
              </div>

              {/* Member Since */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Member Since
                </label>
                <p className="text-foreground font-medium">{joinDate}</p>
              </div>

              {/* Account ID */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">
                  Account ID
                </label>
                <p className="text-foreground font-mono text-xs bg-muted p-2 rounded break-all">
                  {user.id}
                </p>
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-border/30" />

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 justify-end">
              <Link href="/dashboard/account/edit" className="w-full sm:w-auto">
                <Button className="w-full" size="sm">
                  Update Profile
                </Button>
              </Link>
             
            </div>
          </CardContent>
        </Card>

        {/* Info Box */}
        <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg">
          <p className="text-sm text-blue-900 dark:text-blue-100">
            ℹ️ To update your profile information and upload a new profile picture, click the <strong>Edit Profile</strong> button above.
          </p>
        </div>
      </div>
    </div>
  )
}
