import { useState, useEffect } from "react"
import { Header } from "@/components/Header"
import { PostCard } from "@/components/PostCard"
import { CreatePostDialog } from "@/components/CreatePostDialog"
import { AuthDialog } from "@/components/AuthDialog"
import { FilterBar } from "@/components/FilterBar"
import { Post } from "@/types/database"
import { useToast } from "@/hooks/use-toast"
import { useLocalStorage } from "@/hooks/useLocalStorage"

const Index = () => {
  const [posts, setPosts] = useLocalStorage<Post[]>('community-posts', [])
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([])
  const [user, setUser] = useLocalStorage<any>('community-user', null)
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [showCreatePost, setShowCreatePost] = useState(false)
  const [showAuth, setShowAuth] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    // Initialize with mock data if no posts exist
    if (posts.length === 0) {
      setMockData()
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    filterPosts()
  }, [posts, searchTerm, selectedCategory])

  const setMockData = () => {
    const mockPosts: Post[] = [
      {
        id: '1',
        title: 'Need help moving furniture',
        description: 'Looking for someone with a truck to help move a couch and dining table this weekend. Happy to pay for gas and time!',
        category: 'help-needed',
        location: 'Downtown Area',
        created_at: new Date().toISOString(),
        user_id: '1',
        user_name: 'John Smith',
        user_email: 'john@example.com',
        is_active: true
      },
      {
        id: '2',
        title: 'Free lawn mowing service',
        description: 'I have a new lawn mower and would love to help neighbors with their yards. No charge, just want to help the community!',
        category: 'offering-help',
        location: 'Maple Street',
        created_at: new Date(Date.now() - 86400000).toISOString(),
        user_id: '2',
        user_name: 'Sarah Johnson',
        user_email: 'sarah@example.com',
        is_active: true
      },
      {
        id: '3',
        title: 'Community BBQ this Saturday',
        description: 'Join us for our monthly neighborhood BBQ! Bring a side dish to share. Burgers and drinks provided.',
        category: 'events',
        location: 'Community Park',
        created_at: new Date(Date.now() - 172800000).toISOString(),
        user_id: '3',
        user_name: 'Mike Wilson',
        user_email: 'mike@example.com',
        is_active: true
      },
      {
        id: '4',
        title: 'Offering tutoring services',
        description: 'Math and science tutor available for high school students. 10 years experience, very reasonable rates.',
        category: 'services',
        location: 'Oak Avenue',
        created_at: new Date(Date.now() - 259200000).toISOString(),
        user_id: '4',
        user_name: 'Dr. Emily Chen',
        user_email: 'emily@example.com',
        is_active: true
      }
    ]
    setPosts(mockPosts)
  }

  const filterPosts = () => {
    let filtered = posts

    if (searchTerm) {
      filtered = filtered.filter(post =>
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.location.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (selectedCategory) {
      filtered = filtered.filter(post => post.category === selectedCategory)
    }

    setFilteredPosts(filtered)
  }

  const handleCreatePost = async (postData: {
    title: string
    description: string
    category: string
    location: string
  }) => {
    if (!user) {
      toast({
        title: "Please sign in",
        description: "You need to sign in to create a post",
        variant: "destructive"
      })
      return
    }

    const newPost: Post = {
      id: Date.now().toString(),
      title: postData.title,
      description: postData.description,
      category: postData.category as 'help-needed' | 'offering-help' | 'events' | 'services',
      location: postData.location,
      created_at: new Date().toISOString(),
      user_id: user.id,
      user_name: user.name,
      user_email: user.email,
      is_active: true
    }

    setPosts([newPost, ...posts])
    
    toast({
      title: "Post created!",
      description: "Your help request has been shared with the community"
    })
  }

  const handleSignUp = async (data: {
    email: string
    password: string
    name: string
    location: string
  }) => {
    // Simple demo authentication
    const newUser = {
      id: Date.now().toString(),
      email: data.email,
      name: data.name,
      location: data.location,
      created_at: new Date().toISOString()
    }
    
    setUser(newUser)
    
    toast({
      title: "Welcome to the community!",
      description: "Your account has been created successfully"
    })
  }

  const handleSignIn = async (data: { email: string; password: string }) => {
    // Simple demo authentication
    const demoUser = {
      id: 'demo-user',
      email: data.email,
      name: data.email.split('@')[0],
      location: 'Demo Location',
      created_at: new Date().toISOString()
    }
    
    setUser(demoUser)
    
    toast({
      title: "Welcome back!",
      description: "You've successfully signed in"
    })
  }

  const handleSignOut = async () => {
    setUser(null)
    toast({
      title: "Signed out",
      description: "You've been signed out successfully"
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading community...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-background">
      <Header
        onSearchChange={setSearchTerm}
        onCreatePost={() => user ? setShowCreatePost(true) : setShowAuth(true)}
        onAuthClick={() => setShowAuth(true)}
        user={user}
        onSignOut={handleSignOut}
      />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-foreground mb-2">
            Community Help Board
          </h2>
          <p className="text-muted-foreground text-lg">
            Connect with your neighbors and build a stronger community together
          </p>
        </div>

        <div className="mb-6">
          <FilterBar
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
          />
        </div>

        {filteredPosts.length === 0 ? (
          <div className="text-center py-12">
            <div className="mb-4">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🏘️</span>
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">
                {posts.length === 0 ? "No posts yet" : "No posts match your search"}
              </h3>
              <p className="text-muted-foreground">
                {posts.length === 0 
                  ? "Be the first to share a help request with your community!" 
                  : "Try adjusting your search or filter options"}
              </p>
            </div>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredPosts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </main>

      <CreatePostDialog
        open={showCreatePost}
        onOpenChange={setShowCreatePost}
        onCreatePost={handleCreatePost}
      />

      <AuthDialog
        open={showAuth}
        onOpenChange={setShowAuth}
        onSignUp={handleSignUp}
        onSignIn={handleSignIn}
      />
    </div>
  )
}

export default Index