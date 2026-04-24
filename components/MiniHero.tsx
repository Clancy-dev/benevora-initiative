import Image from 'next/image'

interface MiniHeroProps {
  image: string
  title: string
  subtitle?: string
}

export function MiniHero({ image, title, subtitle }: MiniHeroProps) {
  return (
    <section className="relative h-96 md:h-[400px] overflow-hidden">
      <Image
        src={image}
        alt={title}
        fill
        className="object-cover"
        priority
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50"></div>

      {/* Content */}
      <div className="relative h-full flex flex-col items-center justify-center text-center text-white px-4">
        <h1 className="text-4xl md:text-5xl font-bold mb-2 text-balance">
          {title}
        </h1>
        {subtitle && (
          <p className="text-lg md:text-xl opacity-90 text-balance">
            {subtitle}
          </p>
        )}
      </div>
    </section>
  )
}
