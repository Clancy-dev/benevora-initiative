'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import toast from 'react-hot-toast'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { DonateBannerFormData, donateBannerSchema } from '@/lib/validations/donate-banner'
import { createDonateBanner, updateDonateBanner } from '@/actions/banner-actions/donate-banner'

interface DonateBannerFormProps {
  initialData?: any
  bannerId?: string
  isEditing?: boolean
  handleUpload?: (file: File) => Promise<string>
}

export function DonateBannerForm({
  initialData,
  bannerId,
  isEditing = false,
  handleUpload,
}: DonateBannerFormProps) {
  const router = useRouter()

  const [isLoading, setIsLoading] = useState(false)
  const [imagePreview, setImagePreview] = useState<string | null>(
    initialData?.image || null
  )
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const [formData, setFormData] = useState<DonateBannerFormData>({
    title: initialData?.title || '',
    subtitle: initialData?.subtitle || '',
    image: initialData?.image || '',
  })

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Preview
    const reader = new FileReader()
    reader.onloadend = () => {
      setImagePreview(reader.result as string)
    }
    reader.readAsDataURL(file)

    // Upload
    if (handleUpload) {
      try {
        setIsLoading(true)
        const url = await handleUpload(file)

        setFormData((prev) => ({ ...prev, image: url }))

        toast.success('Image uploaded successfully')
      } catch (error) {
        toast.error('Failed to upload image')
      } finally {
        setIsLoading(false)
      }
    }
  }

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})

    try {
      const validated = donateBannerSchema.parse(formData)

      setIsLoading(true)

      let result
      if (isEditing && bannerId) {
        result = await updateDonateBanner(bannerId, validated)
      } else {
        result = await createDonateBanner(validated)
      }

      if (!result.success) {
        if (result.issues) {
          const errorMap: Record<string, string> = {}

          result.issues.forEach((issue) => {
            const path = issue.path.join('.')
            errorMap[path] = issue.message
          })

          setErrors(errorMap)
        } else {
          toast.error(result.error || 'Something went wrong')
        }
        return
      }

      toast.success(
        isEditing
          ? 'Banner updated successfully'
          : 'Banner created successfully'
      )

        // Clear form
         setFormData({
          title: '',
          subtitle: '',
          image: '',
         })

         setImagePreview(null)
         setImageFile(null)
         setErrors({})

        // Redirect
      router.replace('/dashboard/banners/donate')

    } catch (error) {
      console.error('[v0] Form submission error:', error)
      toast.error('Failed to save banner')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>
          {isEditing ? 'Edit Donate Banner' : 'Create Donate Banner'}
        </CardTitle>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Image Upload */}
          <div className="space-y-2">
            <label className="block text-sm font-medium">Banner Image</label>

            <div className="border-2 border-dashed border-border rounded-lg p-6 text-center cursor-pointer hover:border-primary transition-colors">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                disabled={isLoading}
                className="hidden"
                id="image-input"
              />

              <label htmlFor="image-input" className="cursor-pointer block">
                {imagePreview ? (
                  <div className="relative w-full h-48 mb-2">
                    <Image
                      src={imagePreview}
                      alt="Preview"
                      fill
                      className="object-cover rounded"
                    />
                  </div>
                ) : (
                  <div className="py-8">
                    <p className="text-sm text-muted-foreground">
                      Click to upload or drag and drop
                    </p>
                  </div>
                )}
              </label>
            </div>

            {errors.image && (
              <p className="text-sm text-destructive">{errors.image}</p>
            )}
          </div>

          {/* Title */}
          <div className="space-y-2">
            <label htmlFor="title" className="block text-sm font-medium">
              Title
            </label>

            <Input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="Enter banner title"
              disabled={isLoading}
            />

            {errors.title && (
              <p className="text-sm text-destructive">{errors.title}</p>
            )}
          </div>

          {/* Subtitle */}
          <div className="space-y-2">
            <label htmlFor="subtitle" className="block text-sm font-medium">
              Subtitle
            </label>

            <Textarea
              id="subtitle"
              name="subtitle"
              value={formData.subtitle}
              onChange={handleInputChange}
              placeholder="Enter banner subtitle"
              disabled={isLoading}
              rows={3}
            />

            {errors.subtitle && (
              <p className="text-sm text-destructive">{errors.subtitle}</p>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-3 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              disabled={isLoading}
            >
              Cancel
            </Button>

            <Button type="submit" disabled={isLoading}>
              {isLoading
                ? 'Saving...'
                : isEditing
                ? 'Update Banner'
                : 'Create Banner'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}