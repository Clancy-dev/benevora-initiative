"use client"

import { useState, useTransition, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { updateUserProfileAction, getUserData } from "@/actions/user-actions"
import { Upload, ArrowLeft, Loader2 } from "lucide-react"
import Link from "next/link"

const defaultAvatar =
  'https://res.cloudinary.com/dbm0tkc3n/image/upload/v1773924504/no_photo_pgl4oj.png'

interface UserData {
  id: string
  firstName: string
  lastName: string
  email: string
  avatar: string | null
  role: string
}

export default function EditProfilePage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isPending, startTransition] = useTransition()
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    avatar: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(true)

  // Load user data on mount
  useEffect(() => {
    const loadUserData = async () => {
      try {
        const result = await getUserData()
        if (result.success && result.user) {
          const user = result.user
          setFormData({
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            avatar: user.avatar || defaultAvatar,
          })
        } else {
          toast({
            title: "Error",
            description: "Failed to load user data",
            variant: "destructive",
          })
          router.push("/dashboard/account")
        }
      } catch (error) {
        console.error("Error loading user data:", error)
        toast({
          title: "Error",
          description: "Failed to load user data",
          variant: "destructive",
        })
        router.push("/dashboard/account")
      } finally {
        setIsLoading(false)
      }
    }

    loadUserData()
  }, [router, toast])

  // Handle avatar upload to Cloudinary
  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setErrors({ avatar: "Please select a valid image file" })
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setErrors({ avatar: "File size must be less than 5MB" })
      return
    }

    setIsUploadingAvatar(true)
    setErrors({})

    try {
      const formDataUpload = new FormData()
      formDataUpload.append("file", file)
      formDataUpload.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_PRESET || "practice")

      const response = await fetch(
        process.env.NEXT_PUBLIC_CLOUDINARY_URL!,
        { method: "POST", body: formDataUpload }
      )

      if (!response.ok) {
        throw new Error("Upload failed")
      }

      const data = await response.json()
      const imageUrl = data.secure_url

      setFormData((prev) => ({ ...prev, avatar: imageUrl }))
      toast({
        title: "Success",
        description: "Avatar uploaded successfully",
      })
    } catch (error) {
      console.error("Cloudinary upload failed:", error)
      setErrors({ avatar: "Failed to upload image. Please try again." })
      toast({
        title: "Error",
        description: "Failed to upload avatar",
        variant: "destructive",
      })
    } finally {
      setIsUploadingAvatar(false)
    }
  }

  // Handle form input changes
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: e.target.value,
    }))
    // Clear field error when user starts typing
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }
  }

  // Handle form submission
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setErrors({})

    // Validation
    const newErrors: Record<string, string> = {}

    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required"
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required"
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    startTransition(async () => {
      try {
        const result = await updateUserProfileAction(
          formData.firstName,
          formData.lastName,
          formData.avatar !== defaultAvatar ? formData.avatar : undefined
        )

        if (!result.success) {
          toast({
            title: "Error",
            description: result.error || "Failed to update profile",
            variant: "destructive",
          })
          return
        }

        toast({
          title: "Success",
          description: "Profile updated successfully",
        })

        router.push("/account")
        router.refresh()
      } catch (error) {
        console.error("Update error:", error)
        toast({
          title: "Error",
          description: "An unexpected error occurred",
          variant: "destructive",
        })
      }
    })
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary mb-4" />
          <p className="text-muted-foreground">Loading your profile...</p>
        </div>
      </div>
    )
  }

  const initials = `${formData.firstName.charAt(0)}${formData.lastName.charAt(0)}`.toUpperCase()

  return (
    <div className="min-h-screen bg-white dark:bg-background md:px-8">
      <div className="container mx-auto px-4 py-12 pt-6">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground">Edit Profile</h1>
          <p className="text-muted-foreground mt-2">
            Update your personal information and avatar
          </p>
        </div>

        {/* Form Card */}
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl">Profile Information</CardTitle>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Avatar Section */}
              <div className="space-y-4">
                <Label className="text-base font-semibold">Profile Picture</Label>

                <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start">
                  {/* Avatar Preview */}
                  <div className="relative">
                    <Avatar className="h-32 w-32 border-2 border-primary/20">
                      <AvatarImage
                        src={formData.avatar}
                        alt={`${formData.firstName} ${formData.lastName}`}
                        className="object-cover"
                      />
                      <AvatarFallback className="bg-primary/10 text-2xl font-semibold">
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                    {isUploadingAvatar && (
                      <div className="absolute inset-0 rounded-full bg-black/30 flex items-center justify-center">
                        <Loader2 className="h-6 w-6 text-white animate-spin" />
                      </div>
                    )}
                  </div>

                  {/* Upload Input */}
                  <div className="flex-1 space-y-3">
                    <div className="border-2 border-dashed border-muted rounded-lg p-4">
                      <label className="cursor-pointer flex flex-col items-center justify-center">
                        <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                        <span className="text-sm font-medium text-foreground">
                          Upload new avatar
                        </span>
                        <span className="text-xs text-muted-foreground">
                          JPG, PNG, GIF up to 5MB
                        </span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleAvatarUpload}
                          disabled={isUploadingAvatar}
                          className="hidden"
                        />
                      </label>
                    </div>
                    {errors.avatar && (
                      <p className="text-destructive text-xs">{errors.avatar}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Divider */}
              <div className="border-t border-border/30" />

              {/* Name Section */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* First Name */}
                <div className="space-y-2">
                  <Label htmlFor="firstName" className="text-sm font-medium">
                    First Name
                  </Label>
                  <Input
                    id="firstName"
                    placeholder="John"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange(e, "firstName")}
                    className="bg-background border-border"
                    disabled={isPending}
                  />
                  {errors.firstName && (
                    <p className="text-destructive text-xs">{errors.firstName}</p>
                  )}
                </div>

                {/* Last Name */}
                <div className="space-y-2">
                  <Label htmlFor="lastName" className="text-sm font-medium">
                    Last Name
                  </Label>
                  <Input
                    id="lastName"
                    placeholder="Doe"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange(e, "lastName")}
                    className="bg-background border-border"
                    disabled={isPending}
                  />
                  {errors.lastName && (
                    <p className="text-destructive text-xs">{errors.lastName}</p>
                  )}
                </div>
              </div>

              {/* Email (Read-only) */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  disabled
                  className="bg-muted border-border cursor-not-allowed"
                />
                <p className="text-xs text-muted-foreground">
                  Email cannot be changed. Contact support for assistance.
                </p>
              </div>

              {/* Divider */}
              <div className="border-t border-border/30" />

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 justify-end">
                <Link href="/account" className="w-full sm:w-auto">
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    disabled={isPending || isUploadingAvatar}
                  >
                    Cancel
                  </Button>
                </Link>
                <Button
                  type="submit"
                  disabled={isPending || isUploadingAvatar}
                  className="w-full sm:w-auto"
                >
                  {isPending ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
