import { useState } from "react"
import { CommunityButton } from "./ui/button-variants"
import { Input } from "./ui/input"
import { Button } from "./ui/button"
import { Search, Plus, Users, LogOut, User } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu"

interface HeaderProps {
  onSearchChange: (search: string) => void
  onCreatePost: () => void
  onAuthClick: () => void
  user: any
  onSignOut: () => void
}

export function Header({ onSearchChange, onCreatePost, onAuthClick, user, onSignOut }: HeaderProps) {
  const [search, setSearch] = useState("")

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value)
    onSearchChange(e.target.value)
  }

  return (
    <header className="sticky top-0 z-50 bg-card/80 backdrop-blur-md border-b border-border shadow-card">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Users className="h-8 w-8 text-primary" />
          <h1 className="text-xl font-bold text-foreground">Community Help</h1>
        </div>

        <div className="flex-1 max-w-md mx-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search help requests..."
              value={search}
              onChange={handleSearchChange}
              className="pl-10 bg-background/50"
            />
          </div>
        </div>

        <div className="flex items-center space-x-3">
          {user ? (
            <>
              <CommunityButton variant="hero" onClick={onCreatePost}>
                <Plus className="h-4 w-4 mr-2" />
                Create Post
              </CommunityButton>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <User className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={onSignOut}>
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <CommunityButton variant="hero" onClick={onAuthClick}>
              Join Community
            </CommunityButton>
          )}
        </div>
      </div>
    </header>
  )
}