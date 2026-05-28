'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { getAllBanners } from '@/actions/banner-actions/home-banner'

interface Banner {
  id?: string
  title: string
  description: string | null
  imageUrl: string
}

export function HeroCarousel() {
  const [slides, setSlides] = useState<Banner[]>([])
  const [currentSlide, setCurrentSlide] = useState(0)

  // ✅ Fallback slides (OPTION 2)
  const fallbackSlides: Banner[] = [
    {
      title: 'Empowering Lives',
      description:
        'We provide education, skills training, and mentorship to individuals, helping them achieve their dreams and transform their lives.',
      imageUrl: '/default-hero-image.jpg',
    },
    {
      title: 'Inspiring Change',
      description:
        'Through community programs and initiatives, we inspire positive change and create sustainable impact in the neighborhoods we serve.',
      imageUrl: '/default-hero-image-2.jpg',
    },
    {
      title: 'Building Communities',
      description:
        'Our volunteers work tirelessly to build stronger, more resilient communities through collaborative efforts and shared vision.',
      imageUrl: '/default-hero-image-3.jpg',
    },
  ]

  const activeSlides = slides.length > 0 ? slides : fallbackSlides

  useEffect(() => {
    const load = async () => {
      try {
        const res = await getAllBanners()

        if (res.success && res.data && res.data.length > 0) {
          setSlides(res.data)
        }
      } catch (error) {
        console.error('Failed to load banners:', error)
      }
    }

    load()
  }, [])

  useEffect(() => {
    if (activeSlides.length === 0) return

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % activeSlides.length)
    }, 6000)

    return () => clearInterval(interval)
  }, [activeSlides.length])

  const slide = activeSlides[currentSlide]

  return (
    <section className="relative h-screen max-h-[600px] overflow-hidden">

      {/* Images */}
      <div className="absolute inset-0">
        {activeSlides.map((s, index) => (
          <div
            key={s.id ?? index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <Image
              src={s.imageUrl}
              alt={s.title}
              fill
              className="object-cover"
              priority={index === 0}
            />
          </div>
        ))}
      </div>

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Content */}
      <div className="relative h-full flex items-center justify-center text-center text-white px-4">
        <div className="max-w-3xl">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            {slide?.title}
          </h1>

          <p className="text-lg md:text-xl opacity-95 mb-8">
            {slide?.description}
          </p>

          <div className="flex gap-4 justify-center">
            <Link
              href="/about"
              className="px-6 py-3 bg-white text-black rounded-lg"
            >
              Learn More
            </Link>

            <Link
              href="/donate"
              className="px-6 py-3 bg-accent rounded-lg"
            >
              Donate
            </Link>
          </div>
        </div>
      </div>

      {/* Indicators */}
      {activeSlides.length > 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
          {activeSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`h-3 rounded-full transition-all ${
                index === currentSlide
                  ? 'w-8 bg-white'
                  : 'w-3 bg-white/50'
              }`}
            />
          ))}
        </div>
      )}
    </section>
  )
}