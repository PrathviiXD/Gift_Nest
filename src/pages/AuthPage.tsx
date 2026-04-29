import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { Gift, Eye, EyeOff, Loader as Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { useAuth } from "@/contexts/AuthContext"
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp"
import { ArrowLeft, Phone } from "lucide-react"

export default function AuthPage() {
  const { login, register, sendOtp, verifyOtp } = useAuth()
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const [authMode, setAuthMode] = useState<"email" | "mobile" | "otp">("email")
  const [phone, setPhone] = useState("")
  const [otp, setOtp] = useState("")

  const [loginForm, setLoginForm] = useState({ email: "", password: "" })
  const [registerForm, setRegisterForm] = useState({ name: "", email: "", password: "", confirm: "" })

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)
    try {
      await login(loginForm.email, loginForm.password)
      navigate("/")
    } catch {
      setError("Invalid credentials")
    } finally {
      setLoading(false)
    }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    if (registerForm.password !== registerForm.confirm) {
      setError("Passwords do not match")
      return
    }
    setLoading(true)
    try {
      await register(registerForm.name, registerForm.email, registerForm.password)
      navigate("/")
    } catch {
      setError("Registration failed")
    } finally {
      setLoading(false)
    }
  }

  const handleSendOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    if (phone.length < 10) {
      setError("Please enter a valid 10-digit mobile number")
      return
    }
    setError("")
    setLoading(true)
    try {
      await sendOtp(phone)
      setAuthMode("otp")
      setError("")
      setOtp("")
    } catch {
      setError("Failed to send OTP. Try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    if (otp.length < 6) {
      setError("Please enter the complete 6-digit OTP")
      return
    }
    setError("")
    setLoading(true)
    try {
      await verifyOtp(phone, otp)
      navigate("/")
    } catch {
      setError("Invalid OTP. For demo, try '123456'")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-4">
            <div className="size-10 rounded-xl bg-primary flex items-center justify-center">
              <Gift className="size-5 text-primary-foreground" />
            </div>
          </Link>
          <h1 className="scroll-m-20 text-2xl font-bold tracking-tight">Welcome to GiftNest</h1>
          <p className="text-muted-foreground text-sm mt-1">India's AI-Powered Gift Shop</p>
        </div>

        <div className="border rounded-2xl p-6 bg-card shadow-sm relative overflow-hidden">
          {authMode === "email" && (
            <div className="animate-in fade-in slide-in-from-left-4 duration-300">
              <Tabs defaultValue="login">
                <TabsList className="w-full mb-6">
                  <TabsTrigger value="login" className="flex-1">Sign In</TabsTrigger>
                  <TabsTrigger value="register" className="flex-1">Create Account</TabsTrigger>
                </TabsList>

                <TabsContent value="login">
                  <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                      <Label className="text-sm mb-1.5">Email</Label>
                      <Input
                        type="email"
                        placeholder="you@example.com"
                        value={loginForm.email}
                        onChange={e => setLoginForm(f => ({ ...f, email: e.target.value }))}
                        required
                      />
                    </div>
                    <div>
                      <div className="flex justify-between mb-1.5">
                        <Label className="text-sm">Password</Label>
                        <button type="button" className="text-xs text-primary hover:underline">
                          Forgot password?
                        </button>
                      </div>
                      <div className="relative">
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••••"
                          value={loginForm.password}
                          onChange={e => setLoginForm(f => ({ ...f, password: e.target.value }))}
                          className="pr-10"
                          required
                        />
                        <button
                          type="button"
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                          onClick={() => setShowPassword(s => !s)}
                        >
                          {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                        </button>
                      </div>
                    </div>
                    {error && <p className="text-sm text-destructive">{error}</p>}
                    <Button type="submit" className="w-full" disabled={loading}>
                      {loading ? <Loader2 className="size-4 animate-spin mr-2" /> : null}
                      Sign In
                    </Button>
                  </form>
                </TabsContent>

                <TabsContent value="register">
                  <form onSubmit={handleRegister} className="space-y-4">
                    <div>
                      <Label className="text-sm mb-1.5">Full Name</Label>
                      <Input
                        placeholder="Rahul Sharma"
                        value={registerForm.name}
                        onChange={e => setRegisterForm(f => ({ ...f, name: e.target.value }))}
                        required
                      />
                    </div>
                    <div>
                      <Label className="text-sm mb-1.5">Email</Label>
                      <Input
                        type="email"
                        placeholder="you@example.com"
                        value={registerForm.email}
                        onChange={e => setRegisterForm(f => ({ ...f, email: e.target.value }))}
                        required
                      />
                    </div>
                    <div>
                      <Label className="text-sm mb-1.5">Password</Label>
                      <Input
                        type="password"
                        placeholder="Min 8 characters"
                        value={registerForm.password}
                        onChange={e => setRegisterForm(f => ({ ...f, password: e.target.value }))}
                        required
                      />
                    </div>
                    <div>
                      <Label className="text-sm mb-1.5">Confirm Password</Label>
                      <Input
                        type="password"
                        placeholder="Repeat password"
                        value={registerForm.confirm}
                        onChange={e => setRegisterForm(f => ({ ...f, confirm: e.target.value }))}
                        required
                      />
                    </div>
                    {error && <p className="text-sm text-destructive">{error}</p>}
                    <Button type="submit" className="w-full" disabled={loading}>
                      {loading ? <Loader2 className="size-4 animate-spin mr-2" /> : null}
                      Create Account
                    </Button>
                    <p className="text-xs text-center text-muted-foreground">
                      By signing up, you agree to our{" "}
                      <a href="#" className="underline">Terms of Service</a> and{" "}
                      <a href="#" className="underline">Privacy Policy</a>
                    </p>
                  </form>
                </TabsContent>
              </Tabs>

              <Separator className="my-5" />

              <div className="space-y-2">
                <Button 
                  variant="outline" 
                  className="w-full gap-2 transition-colors hover:bg-muted/50" 
                  type="button"
                  onClick={() => {
                    setError("")
                    setAuthMode("mobile")
                  }}
                >
                  <span className="text-base">🇮🇳</span> Continue with Mobile OTP
                </Button>
              </div>
            </div>
          )}

          {authMode === "mobile" && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="flex items-center gap-2 mb-2">
                <Button variant="ghost" size="icon-sm" onClick={() => {
                  setError("")
                  setAuthMode("email")
                }} className="-ml-2">
                  <ArrowLeft className="size-4" />
                </Button>
                <h3 className="font-semibold text-lg">Login with Mobile</h3>
              </div>
              <form onSubmit={handleSendOtp} className="space-y-5">
                <div>
                  <Label className="text-sm mb-1.5">Mobile Number</Label>
                  <div className="relative mt-1">
                    <div className="absolute left-0 top-0 bottom-0 flex items-center justify-center pl-3 pr-2 border-r bg-muted/30 rounded-l-md pointer-events-none">
                      <span className="text-muted-foreground text-sm font-medium">+91</span>
                    </div>
                    <Input
                      type="tel"
                      placeholder="98765 43210"
                      value={phone}
                      onChange={e => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                      className="pl-14 font-medium tracking-wide"
                      autoFocus
                      required
                    />
                  </div>
                </div>
                {error && <p className="text-sm text-destructive">{error}</p>}
                <Button type="submit" className="w-full shadow-sm" disabled={loading || phone.length < 10}>
                  {loading ? <Loader2 className="size-4 animate-spin mr-2" /> : <Phone className="size-4 mr-2" />}
                  Send OTP
                </Button>
              </form>
            </div>
          )}

          {authMode === "otp" && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="flex items-center gap-2 mb-2">
                <Button variant="ghost" size="icon-sm" onClick={() => {
                  setError("")
                  setAuthMode("mobile")
                }} className="-ml-2">
                  <ArrowLeft className="size-4" />
                </Button>
                <h3 className="font-semibold text-lg">Verify OTP</h3>
              </div>
              <div className="text-sm text-muted-foreground bg-muted/30 p-3 rounded-lg border">
                We've sent a 6-digit verification code to <br/>
                <strong className="text-foreground tracking-wide">+91 {phone}</strong>
              </div>
              
              <form onSubmit={handleVerifyOtp} className="space-y-6 flex flex-col items-center pt-2">
                <InputOTP maxLength={6} value={otp} onChange={setOtp} disabled={loading} autoFocus>
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>

                {error && <p className="text-sm text-destructive self-start w-full text-center">{error}</p>}
                
                <Button type="submit" className="w-full shadow-sm" disabled={loading || otp.length < 6}>
                  {loading ? <Loader2 className="size-4 animate-spin mr-2" /> : null}
                  Verify & Proceed
                </Button>
                
                <p className="text-xs text-muted-foreground mt-2">
                  Didn't receive code?{" "}
                  <button 
                    type="button" 
                    className="text-primary hover:underline font-medium" 
                    onClick={() => handleSendOtp()} 
                    disabled={loading}
                  >
                    Resend OTP
                  </button>
                </p>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
