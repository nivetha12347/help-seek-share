import { useState, useEffect } from "react"
import { supabase } from "@/integrations/supabase/client"
import { Header } from "@/components/Header"
import { PostCard } from "@/components/PostCard"
import { CreatePostDialog } from "@/components/CreatePostDialog"
import { AuthDialog } from "@/components/AuthDialog"
import { FilterBar } from "@/components/FilterBar"
import { Post } from "@/types/database"
import { useToast } from "@/hooks/use-toast"

const Index = () => {
  const [posts, setPosts] = useState<Post[]>([])
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([])
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [showCreatePost, setShowCreatePost] = useState(false)
  const [showAuth, setShowAuth] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    getUser()
    getPosts()
  }, [])

  useEffect(() => {
    filterPosts()
  }, [posts, searchTerm, selectedCategory])

  const getUser = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    setUser(user)
    setLoading(false)
  }

  const getPosts = async () => {
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching posts:', error)
      toast({
        title: "Error",
        description: "Failed to load posts",
        variant: "destructive"
      })
    } else {
      setPosts(data || [])
    }
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
    if (!user) return

    const { error } = await supabase
      .from('posts')
      .insert([
        {
          ...postData,
          user_id: user.id,
          user_name: user.user_metadata?.name || user.email.split('@')[0],
          user_email: user.email,
          is_active: true
        }
      ])

    if (error) {
      throw new Error(error.message)
    }

    await getPosts()
  }

  const handleSignUp = async (data: {
    email: string
    password: string
    name: string
    location: string
  }) => {
    const { error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: {
          name: data.name,
          location: data.location
        }
      }
    })

    if (error) throw new Error(error.message)
    await getUser()
  }

  const handleSignIn = async (data: { email: string; password: string }) => {
    const { error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password
    })

    if (error) throw new Error(error.message)
    await getUser()
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
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