import { Button } from "./ui/button"
import { Badge } from "./ui/badge"

interface FilterBarProps {
  selectedCategory: string | null
  onCategoryChange: (category: string | null) => void
}

const categories = [
  { id: 'help-needed', label: 'Help Needed', emoji: '🆘' },
  { id: 'offering-help', label: 'Offering Help', emoji: '🤝' },
  { id: 'events', label: 'Events', emoji: '📅' },
  { id: 'services', label: 'Services', emoji: '🔧' }
]

export function FilterBar({ selectedCategory, onCategoryChange }: FilterBarProps) {
  return (
    <div className="flex flex-wrap gap-2 p-4 bg-muted/30 rounded-lg border border-border">
      <Button
        variant={selectedCategory === null ? "default" : "outline"}
        size="sm"
        onClick={() => onCategoryChange(null)}
        className="transition-all"
      >
        All Posts
      </Button>
      
      {categories.map((category) => (
        <Button
          key={category.id}
          variant={selectedCategory === category.id ? "default" : "outline"}
          size="sm"
          onClick={() => onCategoryChange(category.id)}
          className="transition-all"
        >
          <span className="mr-1">{category.emoji}</span>
          {category.label}
        </Button>
      ))}
    </div>
  )
}