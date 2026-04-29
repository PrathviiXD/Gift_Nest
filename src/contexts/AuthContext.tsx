import { createContext, useContext, useState, useCallback } from "react"

type User = {
  id: string
  name: string
  email: string
  phone?: string
  avatar?: string
}

type AuthContextType = {
  user: User | null
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<boolean>
  register: (name: string, email: string, password: string) => Promise<boolean>
  sendOtp: (phone: string) => Promise<boolean>
  verifyOtp: (phone: string, otp: string) => Promise<boolean>
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

  const sendOtp = useCallback(async (phone: string) => {
    // Simulate API call for sending OTP
    await new Promise(r => setTimeout(r, 800))
    return true
  }, [])

  const verifyOtp = useCallback(async (phone: string, otp: string) => {
    await new Promise(r => setTimeout(r, 800))
    if (otp !== "123456") throw new Error("Invalid OTP")
    setUser({ id: "u3", name: "User", email: `${phone}@mobile.user`, phone })
    return true
  }, [])

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, register, sendOtp, verifyOtp, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used within AuthProvider")
  return ctx
}
