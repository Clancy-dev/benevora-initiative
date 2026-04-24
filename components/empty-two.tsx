interface EmptyProps {
  title: string
  description?: string
}

export function EmptyTwo({ title, description }: EmptyProps) {
  return (
    <div className="text-center py-10">
      <p className="font-semibold text-lg">{title}</p>
      {description && <p className="text-sm text-muted-foreground">{description}</p>}
    </div>
  )
}