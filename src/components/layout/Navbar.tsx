import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import {
  ShoppingCart, Search, User, Menu, X, Mic, Gift, Sparkles, Heart
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useCart } from "@/contexts/CartContext"
import { useAuth } from "@/contexts/AuthContext"
import { ModeToggle } from "@/components/mode-toggle"

const navLinks = [
  { label: "Shop", href: "/catalog" },
  { label: "Gift Ideas", href: "/catalog?category=hampers" },
  { label: "New Arrivals", href: "/catalog?filter=new" },
  { label: "Bestsellers", href: "/catalog?filter=bestseller" },
]

export function Navbar() {
  const { totalItems } = useCart()
  const { user, isAuthenticated, logout } = useAuth()
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState("")
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/catalog?q=${encodeURIComponent(searchQuery.trim())}`)
      setSearchQuery("")
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center gap-4">
          {/* Left Actions (Icons & Mobile Menu) */}
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" className="hidden md:flex" asChild>
              <Link to="/wishlist">
                <Heart className="size-4" />
              </Link>
            </Button>

            <Button variant="ghost" size="icon" className="relative" asChild>
              <Link to="/cart">
                <ShoppingCart className="size-4" />
                {totalItems > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-[10px]">
                    {totalItems}
                  </Badge>
                )}
              </Link>
            </Button>

            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <div className="size-6 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xs font-bold">
                      {user?.name.charAt(0).toUpperCase()}
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-48">
                  <div className="px-2 py-1.5 text-sm font-medium">{user?.name}</div>
                  <div className="px-2 py-1 text-xs text-muted-foreground">{user?.email}</div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/orders">My Orders</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/profile">Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout} variant="destructive">
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button variant="ghost" size="icon" asChild>
                <Link to="/auth">
                  <User className="size-4" />
                </Link>
              </Button>
            )}

            <Button variant="ghost" size="icon" className="hidden md:flex relative">
              <Link to="/catalog">
                <Sparkles className="size-4 text-amber-500" />
              </Link>
            </Button>

            <ModeToggle />

            {/* Mobile menu */}
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  {mobileOpen ? <X className="size-4" /> : <Menu className="size-4" />}
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-72">
                <div className="flex flex-col gap-6 pt-4">
                  <form onSubmit={e => { handleSearch(e); setMobileOpen(false) }}>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                      <Input
                        placeholder="Search gifts..."
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        className="pl-9"
                      />
                    </div>
                  </form>
                  <nav className="flex flex-col gap-1">
                    {navLinks.map(link => (
                      <Link
                        key={link.href}
                        to={link.href}
                        onClick={() => setMobileOpen(false)}
                        className="px-3 py-2.5 text-sm font-medium rounded-md hover:bg-accent transition-colors"
                      >
                        {link.label}
                      </Link>
                    ))}
                  </nav>
                </div>
              </SheetContent>
            </Sheet>
          </div>


          {/* Desktop Nav and Logo Wrapper */}
          <div className="flex items-center gap-4 ml-auto">
            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map(link => (
                <Link
                  key={link.href}
                  to={link.href}
                  className="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-md hover:bg-accent"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 shrink-0">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <Gift className="size-4 text-primary-foreground" />
              </div>
              <span className="hidden font-bold text-lg sm:block tracking-tight">
                GiftNest
              </span>
            </Link>
          </div>
        </div>
      </div>

      {/* AI Banner */}
      <div className="bg-primary text-primary-foreground py-1.5 text-center text-xs font-medium">
        <Sparkles className="inline size-3 mr-1.5" />
        AI-Powered Gift Recommendations — Find the perfect gift in seconds!
      </div>
    </header>
  )
}
