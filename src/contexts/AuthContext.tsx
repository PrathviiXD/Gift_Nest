import { createContext, useContext, useState, useCallback } from "react"

type User = {
  id: string
  name: string
  email: string
  avatar?: string
}

type AuthContextType = {
  user: User | null
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<boolean>
  register: (name: string, email: string, password: string) => Promise<boolean>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)

  const login = useCallback(async (email: string, _password: string) => {
    // Simulate API call
    await new Promise(r => setTimeout(r, 800))
    setUser({ id: "u1", name: email.split("@")[0], email })
    return true
  }, [])

  const register = useCallback(async (name: string, email: string, _password: string) => {
    await new Promise(r => setTimeout(r, 800))
    setUser({ id: "u2", name, email })
    return true
  }, [])

  const logout = useCallback(() => setUser(null), [])

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used within AuthProvider")
  return ctx
}
