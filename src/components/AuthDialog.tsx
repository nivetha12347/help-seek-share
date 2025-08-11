import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs"
import { CommunityButton } from "./ui/button-variants"
import { useToast } from "@/hooks/use-toast"

interface AuthDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSignUp: (data: { email: string; password: string; name: string; location: string }) => Promise<void>
  onSignIn: (data: { email: string; password: string }) => Promise<void>
}

export function AuthDialog({ open, onOpenChange, onSignUp, onSignIn }: AuthDialogProps) {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  // Sign Up form state
  const [signUpData, setSignUpData] = useState({
    email: "",
    password: "",
    name: "",
    location: ""
  })

  // Sign In form state
  const [signInData, setSignInData] = useState({
    email: "",
    password: ""
  })

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    try {
      await onSignUp(signUpData)
      onOpenChange(false)
      toast({
        title: "Welcome to the community!",
        description: "Your account has been created successfully"
      })
    } catch (error: any) {
      toast({
        title: "Sign up failed",
        description: error.message || "Please try again",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    try {
      await onSignIn(signInData)
      onOpenChange(false)
      toast({
        title: "Welcome back!",
        description: "You've successfully signed in"
      })
    } catch (error: any) {
      toast({
        title: "Sign in failed",
        description: error.message || "Please check your credentials",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Join the Community</DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="signin" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="signin">Sign In</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>
          
          <TabsContent value="signin">
            <form onSubmit={handleSignIn} className="space-y-4">
              <div>
                <Label htmlFor="signin-email">Email</Label>
                <Input
                  id="signin-email"
                  type="email"
                  value={signInData.email}
                  onChange={(e) => setSignInData({ ...signInData, email: e.target.value })}
                  className="mt-1"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="signin-password">Password</Label>
                <Input
                  id="signin-password"
                  type="password"
                  value={signInData.password}
                  onChange={(e) => setSignInData({ ...signInData, password: e.target.value })}
                  className="mt-1"
                  required
                />
              </div>
              
              <CommunityButton type="submit" disabled={isLoading} variant="hero" className="w-full">
                {isLoading ? "Signing in..." : "Sign In"}
              </CommunityButton>
            </form>
          </TabsContent>
          
          <TabsContent value="signup">
            <form onSubmit={handleSignUp} className="space-y-4">
              <div>
                <Label htmlFor="signup-name">Full Name</Label>
                <Input
                  id="signup-name"
                  value={signUpData.name}
                  onChange={(e) => setSignUpData({ ...signUpData, name: e.target.value })}
                  className="mt-1"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="signup-email">Email</Label>
                <Input
                  id="signup-email"
                  type="email"
                  value={signUpData.email}
                  onChange={(e) => setSignUpData({ ...signUpData, email: e.target.value })}
                  className="mt-1"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="signup-location">Location</Label>
                <Input
                  id="signup-location"
                  value={signUpData.location}
                  onChange={(e) => setSignUpData({ ...signUpData, location: e.target.value })}
                  placeholder="Your neighborhood"
                  className="mt-1"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="signup-password">Password</Label>
                <Input
                  id="signup-password"
                  type="password"
                  value={signUpData.password}
                  onChange={(e) => setSignUpData({ ...signUpData, password: e.target.value })}
                  className="mt-1"
                  required
                />
              </div>
              
              <CommunityButton type="submit" disabled={isLoading} variant="hero" className="w-full">
                {isLoading ? "Creating account..." : "Create Account"}
              </CommunityButton>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}