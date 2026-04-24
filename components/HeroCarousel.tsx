'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'

interface CarouselSlide {
  image: string
  title: string
  description: string
}

const slides: CarouselSlide[] = [
  {
    image: '/images/carousel-1.jpg',
    title: 'Empowering Lives',
    description: 'We provide education, skills training, and mentorship to individuals, helping them achieve their dreams and transform their lives.',
  },
  {
    image: '/images/carousel-2.jpg',
    title: 'Inspiring Change',
    description: 'Through community programs and initiatives, we inspire positive change and create sustainable impact in the neighborhoods we serve.',
  },
  {
    image: '/images/carousel-3.jpg',
    title: 'Building Communities',
    description: 'Our volunteers work tirelessly to build stronger, more resilient communities through collaborative efforts and shared vision.',
  },
]

export function HeroCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 6000)

    return () => clearInterval(interval)
  }, [])

  const slide = slides[currentSlide]

  return (
    <section className="relative h-screen max-h-[600px] md:max-h-screen overflow-hidden">
      {/* Image carousel */}
      <div className="absolute inset-0">
        {slides.map((s, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <Image
              src={s.image}
              alt={s.title}
              fill
              className="object-cover"
              priority={index === 0}
            />
          </div>
        ))}

        {/* Overlay */}
        <div className="absolute inset-0 bg-black/40"></div>
      </div>

      {/* Content */}
      <div className="relative h-full flex items-center justify-center text-center text-white px-4">
        <div
          key={currentSlide}
          className="max-w-3xl animate-fadeIn"
        >
          <h1 className="text-4xl md:text-6xl font-bold mb-4 text-balance">
            {slide.title}
          </h1>
          <p className="text-lg md:text-xl text-balance opacity-95 mb-8">
            {slide.description}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/about"
              className="px-8 py-3 bg-white text-black rounded-lg font-semibold hover:bg-opacity-90 transition-all inline-block"
            >
              Learn More
            </Link>
            <Link
              href="/donate"
              className="px-8 py-3 bg-accent text-accent-foreground rounded-lg font-semibold hover:opacity-90 transition-all inline-block"
            >
              Donate
            </Link>
          </div>
        </div>
      </div>

      {/* Slide Indicators */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-2 z-10">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentSlide ? 'bg-white w-8' : 'bg-white/50'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  )
}
