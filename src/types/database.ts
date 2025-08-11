export interface Post {
  id: string
  title: string
  description: string
  category: 'help-needed' | 'offering-help' | 'events' | 'services'
  location: string
  created_at: string
  user_id: string
  user_name: string
  user_email: string
  is_active: boolean
}

export interface User {
  id: string
  email: string
  name: string
  location: string
  created_at: string
}