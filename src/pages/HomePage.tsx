import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import {
  Sparkles, ArrowRight, Gift, Truck, Shield, RotateCcw,
  Star, ChevronRight, Mic, Search
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { ProductCard } from "@/components/ProductCard"
import {
  categories, featuredProducts, bestsellerProducts, newArrivals,
  products
} from "@/data/products"

const occasions = ["Birthday", "Anniversary", "Diwali", "Wedding", "Housewarming", "Corporate"]

const testimonials = [
  { name: "Priya S.", city: "Mumbai", text: "The AI gift recommendation was spot-on! Found the perfect anniversary gift in minutes.", rating: 5 },
  { name: "Rahul M.", city: "Delhi", text: "Beautiful packaging and fast delivery. My family loved the Diwali hamper!", rating: 5 },
  { name: "Ananya K.", city: "Bangalore", text: "The AR preview feature is amazing — exactly as I imagined in my home!", rating: 5 },
]

export default function HomePage() {
  const navigate = useNavigate()
  const [aiQuery, setAiQuery] = useState("")
  const [selectedOccasion, setSelectedOccasion] = useState("")
  const [searchQuery, setSearchQuery] = useState("")

  const handleAiSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const q = aiQuery || selectedOccasion
    if (q) navigate(`/catalog?q=${encodeURIComponent(q)}`)
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/catalog?q=${encodeURIComponent(searchQuery.trim())}`)
      setSearchQuery("")
    }
  }

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-background via-accent/30 to-background">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <Badge className="gap-1.5 px-3 py-1 bg-amber-500/10 text-amber-600 border-amber-200 dark:border-amber-800 dark:text-amber-400">
                <Sparkles className="size-3" /> AI-Powered Gift Shop
              </Badge>
              <h1 className="scroll-m-20 text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-balance leading-[1.1]">
                Find the{" "}
                <span className="relative">
                  <span className="bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">
                    Perfect Gift
                  </span>
                </span>{" "}
                Every Time
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed max-w-lg">
                Our AI understands your loved ones. Curated handcrafted gifts from India's finest artisans, delivered with love.
              </p>

              {/* AI Gift Finder */}
              <div className="bg-card border rounded-xl p-4 shadow-sm space-y-3">
                <p className="text-sm font-medium flex items-center gap-2">
                  <Sparkles className="size-4 text-amber-500" />
                  AI Gift Finder — describe the occasion
                </p>
                <form onSubmit={handleAiSearch} className="flex gap-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                    <Input
                      placeholder="e.g. birthday gift for mom who loves yoga..."
                      value={aiQuery}
                      onChange={e => setAiQuery(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                  <Button type="submit">Find Gifts</Button>
                  <Button type="button" variant="outline" size="icon">
                    <Mic className="size-4" />
                  </Button>
                </form>
                <div className="flex flex-wrap gap-1.5">
                  {occasions.map(o => (
                    <button
                      key={o}
                      onClick={() => { setSelectedOccasion(o); setAiQuery(o) }}
                      className={`px-2.5 py-1 rounded-full text-xs font-medium border transition-colors ${selectedOccasion === o
                          ? "bg-primary text-primary-foreground border-primary"
                          : "bg-muted hover:bg-accent border-transparent"
                        }`}
                    >
                      {o}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-4">
                <Button size="lg" asChild>
                  <Link to="/catalog">
                    Shop Now <ArrowRight className="size-4" />
                  </Link>
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <Link to="/catalog?filter=bestseller">
                    <Star className="size-4" /> Bestsellers
                  </Link>
                </Button>
              </div>
            </div>

            <div className="relative hidden md:block">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src="/india-women-wear-partywear-kurti-260nw-2632746755.webp"
                  alt="Gift collection"
                  className="w-full object-cover aspect-[4/3]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              </div>
              {/* Floating card */}
              <div className="absolute -bottom-4 -left-4 bg-card border rounded-xl p-3 shadow-lg flex items-center gap-3">
                <div className="size-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                  <span className="text-xl">🎁</span>
                </div>
                <div>
                  <p className="text-xs font-semibold">AI Recommended</p>
                  <p className="text-xs text-muted-foreground">10,000+ happy customers</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="border-y bg-muted/30">
        <div className="container mx-auto px-4 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: Truck, label: "Free Shipping", sub: "On orders above ₹999" },
              { icon: Shield, label: "Secure Payments", sub: "Razorpay & UPI" },
              { icon: RotateCcw, label: "Easy Returns", sub: "7-day return policy" },
              { icon: Gift, label: "Gift Wrapping", sub: "Complimentary on all orders" },
            ].map(({ icon: Icon, label, sub }) => (
              <div key={label} className="flex items-center gap-3">
                <div className="size-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <Icon className="size-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium">{label}</p>
                  <p className="text-xs text-muted-foreground">{sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="container mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight">Shop by Category</h2>
          <Button variant="ghost" size="sm" asChild>
            <Link to="/catalog">View all <ChevronRight className="size-4" /></Link>
          </Button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
          {categories.map(cat => (
            <Link
              key={cat.id}
              to={`/catalog?category=${cat.id}`}
              className="group flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-accent transition-colors text-center"
            >
              <div className="relative size-16 rounded-xl overflow-hidden border">
                <img src={cat.image} alt={cat.name} className="size-full object-cover transition-transform group-hover:scale-110 duration-300" />
              </div>
              <div>
                <p className="text-xs font-medium line-clamp-1">{cat.name}</p>
                <p className="text-[10px] text-muted-foreground">{cat.count} items</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products Tabs */}
      <section className="container mx-auto px-4 py-8">
        <Tabs defaultValue="featured">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
            <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight whitespace-nowrap">Our Collection</h2>

            {/* Search */}
            <form onSubmit={handleSearch} className="flex-1 max-w-md w-full md:mx-4 order-3 md:order-none">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <Input
                  placeholder="Search gifts, occasions..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="pl-9 pr-10"
                />
                <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2">
                  <Mic className="size-4 text-muted-foreground hover:text-foreground transition-colors" />
                </button>
              </div>
            </form>

            <TabsList className="order-2 md:order-none w-full md:w-auto overflow-x-auto justify-start md:justify-center flex-nowrap">
              <TabsTrigger value="featured">Featured</TabsTrigger>
              <TabsTrigger value="bestseller">Bestsellers</TabsTrigger>
              <TabsTrigger value="new">New Arrivals</TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value="featured">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {featuredProducts.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          </TabsContent>
          <TabsContent value="bestseller">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {bestsellerProducts.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          </TabsContent>
          <TabsContent value="new">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {newArrivals.length > 0
                ? newArrivals.map(p => <ProductCard key={p.id} product={p} />)
                : <p className="col-span-4 text-center text-muted-foreground py-8">Check back soon for new arrivals!</p>
              }
            </div>
          </TabsContent>
        </Tabs>
        <div className="flex justify-center mt-6">
          <Button variant="outline" asChild>
            <Link to="/catalog">View All Products <ArrowRight className="size-4" /></Link>
          </Button>
        </div>
      </section>

      {/* AI Recommendations Banner */}
      <section className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 border-y">
        <div className="container mx-auto px-4 py-12">
          <div className="text-center space-y-4 max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-amber-500/10 text-amber-600 dark:text-amber-400 px-3 py-1.5 rounded-full text-sm font-medium">
              <Sparkles className="size-4" /> AI Gift Intelligence
            </div>
            <h2 className="scroll-m-20 text-3xl font-bold tracking-tight">
              Let AI Find the Perfect Gift
            </h2>
            <p className="text-muted-foreground">
              Our advanced AI analyzes occasions, personality traits, and preferences to recommend the most thoughtful, memorable gifts.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6 text-left">
              {[
                { step: "01", title: "Describe the occasion", desc: "Tell us about who you're gifting and why" },
                { step: "02", title: "AI analyses preferences", desc: "Our engine finds the perfect match from 500+ items" },
                { step: "03", title: "Order with confidence", desc: "Free gift wrapping and express delivery available" },
              ].map(s => (
                <div key={s.step} className="bg-card border rounded-xl p-4">
                  <div className="text-2xl font-black text-amber-500/30 mb-2">{s.step}</div>
                  <h3 className="font-semibold text-sm mb-1">{s.title}</h3>
                  <p className="text-xs text-muted-foreground">{s.desc}</p>
                </div>
              ))}
            </div>
            <Button size="lg" className="mt-2" asChild>
              <Link to="/catalog">Try AI Recommendations <Sparkles className="size-4" /></Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Personalized Feed */}
      <section className="container mx-auto px-4 py-12">
        <div className="flex items-center gap-2 mb-6">
          <Sparkles className="size-5 text-amber-500" />
          <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight">Personalized For You</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {products.slice(0, 4).map(p => (
            <ProductCard key={p.id} product={p} showAiBadge />
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-muted/30 border-y">
        <div className="container mx-auto px-4 py-12">
          <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight text-center mb-8">
            What Our Customers Say
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map(t => (
              <Card key={t.name} className="bg-card">
                <CardContent className="p-5">
                  <div className="flex gap-0.5 mb-3">
                    {Array.from({ length: t.rating }).map((_, i) => (
                      <Star key={i} className="size-3.5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground mb-4 leading-relaxed italic">"{t.text}"</p>
                  <div className="flex items-center gap-2">
                    <div className="size-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xs font-bold">
                      {t.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{t.name}</p>
                      <p className="text-xs text-muted-foreground">{t.city}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { value: "10,000+", label: "Happy Customers" },
            { value: "500+", label: "Curated Products" },
            { value: "98%", label: "Satisfaction Rate" },
            { value: "4.8★", label: "Average Rating" },
          ].map(stat => (
            <div key={stat.label}>
              <div className="scroll-m-20 text-3xl font-extrabold tracking-tight text-primary mb-1">{stat.value}</div>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
