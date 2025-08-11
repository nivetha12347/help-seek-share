import { Card, CardContent, CardFooter, CardHeader } from "./ui/card"
import { Badge } from "./ui/badge"
import { Avatar, AvatarFallback } from "./ui/avatar"
import { Calendar, MapPin, User } from "lucide-react"
import { Post } from "@/types/database"
import { formatDistanceToNow } from "date-fns"

interface PostCardProps {
  post: Post
}

const categoryConfig = {
  'help-needed': { 
    label: 'Help Needed', 
    className: 'bg-destructive/10 text-destructive hover:bg-destructive/20' 
  },
  'offering-help': { 
    label: 'Offering Help', 
    className: 'bg-secondary/10 text-secondary hover:bg-secondary/20' 
  },
  'events': { 
    label: 'Events', 
    className: 'bg-accent/10 text-accent hover:bg-accent/20' 
  },
  'services': { 
    label: 'Services', 
    className: 'bg-primary/10 text-primary hover:bg-primary/20' 
  }
}

export function PostCard({ post }: PostCardProps) {
  const categoryInfo = categoryConfig[post.category]
  
  return (
    <Card className="group hover:shadow-card transition-all duration-300 hover:-translate-y-1 bg-card border-border">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="font-semibold text-lg text-card-foreground group-hover:text-primary transition-colors">
              {post.title}
            </h3>
            <div className="flex items-center space-x-4 mt-2 text-sm text-muted-foreground">
              <div className="flex items-center space-x-1">
                <User className="h-3 w-3" />
                <span>{post.user_name}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Calendar className="h-3 w-3" />
                <span>{formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Badge className={categoryInfo.className}>
              {categoryInfo.label}
            </Badge>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pb-3">
        <p className="text-muted-foreground line-clamp-3">{post.description}</p>
      </CardContent>
      
      <CardFooter className="pt-0">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center space-x-1 text-sm text-muted-foreground">
            <MapPin className="h-3 w-3" />
            <span>{post.location}</span>
          </div>
          
          <div className="flex items-center space-x-2">
            <Avatar className="h-6 w-6">
              <AvatarFallback className="text-xs bg-primary/10 text-primary">
                {post.user_name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
      </CardFooter>
    </Card>
  )
}