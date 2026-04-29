import { useState } from "react"
import { useParams, Link, useNavigate } from "react-router-dom"
import {
  ShoppingCart, Heart, Star, Truck, Shield, RotateCcw,
  ChevronRight, Plus, Minus, Share2, Sparkles, Box, Eye, Info
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { ProductCard } from "@/components/ProductCard"
import { PriceHistoryChart } from "@/components/PriceHistoryChart"
import { getProductById, products, formatPrice } from "@/data/products"
import { useCart } from "@/contexts/CartContext"

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { addItem } = useCart()
  const [quantity, setQuantity] = useState(1)
  const [arMode, setArMode] = useState(false)
  const [addedToCart, setAddedToCart] = useState(false)

  const product = getProductById(id!)

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="text-5xl mb-4">😕</div>
        <h2 className="text-2xl font-bold mb-2">Product Not Found</h2>
        <Button onClick={() => navigate("/catalog")}>Back to Catalog</Button>
      </div>
    )
  }

  const related = products.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4)

  const handleAddToCart = () => {
    addItem(product, quantity)
    setAddedToCart(true)
    setTimeout(() => setAddedToCart(false), 2000)
  }

  const handleBuyNow = () => {
    addItem(product, quantity)
    navigate("/cart")
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-sm text-muted-foreground mb-6">
        <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
        <ChevronRight className="size-3.5" />
        <Link to="/catalog" className="hover:text-foreground transition-colors">Shop</Link>
        <ChevronRight className="size-3.5" />
        <span className="text-foreground font-medium truncate max-w-[200px]">{product.name}</span>
      </nav>

      <div className="grid md:grid-cols-2 gap-10 mb-12">
        {/* Image */}
        <div className="space-y-3">
          <div className="relative aspect-square rounded-2xl overflow-hidden border bg-muted">
            {arMode ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-black/80 backdrop-blur-sm text-white z-10 transition-all animate-in fade-in zoom-in-95 duration-300">
                <Box className="size-16 animate-bounce text-indigo-400" />
                <p className="text-xl font-bold tracking-tight bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">AR Preview Mode</p>
                <p className="text-sm text-gray-300 text-center px-8 max-w-xs">
                  Point your camera at a flat surface to see this product in your space.
                </p>
                <Button variant="outline" className="mt-2 border-white/20 hover:bg-white/10" onClick={() => setArMode(false)}>Exit AR</Button>
              </div>
            ) : (
              <>
                <img
                  src={product.image}
                  alt={product.name}
                  className="size-full object-cover"
                />
                <div className="absolute top-3 left-3 flex gap-2">
                  {product.isNew && <Badge>New</Badge>}
                  {product.isBestseller && <Badge variant="secondary">Bestseller</Badge>}
                  {product.originalPrice && (
                    <Badge variant="destructive">
                      {Math.round((1 - product.price / product.originalPrice) * 100)}% OFF
                    </Badge>
                  )}
                </div>
                
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      variant="secondary"
                      size="icon"
                      className="absolute top-3 right-3 rounded-full size-8 bg-background/80 hover:bg-background/100 backdrop-blur"
                      title="Price History"
                    >
                      <Info className="size-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl border-border bg-background">
                    <DialogHeader>
                      <DialogTitle>Price History</DialogTitle>
                    </DialogHeader>
                    <PriceHistoryChart productId={product.id} currentPrice={product.price} originalPrice={product.originalPrice} />
                  </DialogContent>
                </Dialog>

                <Button
                  variant="secondary"
                  size="sm"
                  className="absolute bottom-3 right-3 gap-1.5"
                  onClick={() => setArMode(true)}
                >
                  <Eye className="size-3.5" /> AR Preview
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Details */}
        <div className="space-y-5">
          <div>
            <p className="text-sm text-muted-foreground mb-1 capitalize">
              {product.category.replace("-", " ")}
            </p>
            <h1 className="scroll-m-20 text-2xl md:text-3xl font-bold tracking-tight mb-3">
              {product.name}
            </h1>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`size-4 ${i < Math.floor(product.rating) ? "fill-amber-400 text-amber-400" : "text-muted-foreground"}`}
                  />
                ))}
              </div>
              <span className="font-medium text-sm">{product.rating}</span>
              <span className="text-sm text-muted-foreground">({product.reviewCount} reviews)</span>
            </div>
          </div>

          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-extrabold">{formatPrice(product.price)}</span>
            {product.originalPrice && (
              <>
                <span className="text-lg text-muted-foreground line-through">{formatPrice(product.originalPrice)}</span>
                <Badge variant="destructive" className="text-xs">
                  Save {formatPrice(product.originalPrice - product.price)}
                </Badge>
              </>
            )}
          </div>

          <p className="text-muted-foreground leading-relaxed">{product.description}</p>

          {/* Occasions */}
          {product.occasion && (
            <div className="flex flex-wrap gap-1.5">
              {product.occasion.map(o => (
                <Badge key={o} variant="outline" className="text-xs capitalize">{o}</Badge>
              ))}
            </div>
          )}

          <Separator />

          {/* Specs */}
          {(product.material || product.weight || product.dimensions) && (
            <div className="grid grid-cols-3 gap-3">
              {product.material && (
                <div className="bg-muted/50 rounded-lg p-3 text-center">
                  <p className="text-xs text-muted-foreground">Material</p>
                  <p className="text-sm font-medium mt-0.5">{product.material}</p>
                </div>
              )}
              {product.weight && (
                <div className="bg-muted/50 rounded-lg p-3 text-center">
                  <p className="text-xs text-muted-foreground">Weight</p>
                  <p className="text-sm font-medium mt-0.5">{product.weight}</p>
                </div>
              )}
              {product.dimensions && (
                <div className="bg-muted/50 rounded-lg p-3 text-center">
                  <p className="text-xs text-muted-foreground">Dimensions</p>
                  <p className="text-sm font-medium mt-0.5">{product.dimensions}</p>
                </div>
              )}
            </div>
          )}

          {/* Quantity + CTA */}
          <div className="space-y-3">
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium">Quantity</span>
              <div className="flex items-center border rounded-md">
                <Button
                  variant="ghost" size="icon-sm"
                  className="rounded-none"
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                >
                  <Minus className="size-3" />
                </Button>
                <span className="px-4 text-sm font-medium">{quantity}</span>
                <Button
                  variant="ghost" size="icon-sm"
                  className="rounded-none"
                  onClick={() => setQuantity(q => q + 1)}
                >
                  <Plus className="size-3" />
                </Button>
              </div>
            </div>

            {addedToCart && (
              <Alert className="border-green-500 bg-green-50 dark:bg-green-950/20">
                <AlertDescription className="text-green-700 dark:text-green-400 text-sm">
                  Added to cart successfully!
                </AlertDescription>
              </Alert>
            )}

            <div className="flex gap-3">
              <Button className="flex-1 gap-2" onClick={handleAddToCart}>
                <ShoppingCart className="size-4" /> Add to Cart
              </Button>
              <Button variant="outline" className="flex-1" onClick={handleBuyNow}>
                Buy Now
              </Button>
              <Button variant="outline" size="icon">
                <Heart className="size-4" />
              </Button>
              <Button variant="outline" size="icon">
                <Share2 className="size-4" />
              </Button>
            </div>
          </div>

          {/* Delivery Info */}
          <div className="bg-muted/30 rounded-xl p-4 space-y-2">
            {[
              { icon: Truck, text: "Free delivery on orders above ₹999" },
              { icon: Shield, text: "Secure payment via Razorpay & UPI" },
              { icon: RotateCcw, text: "7-day easy returns" },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-2.5 text-sm">
                <Icon className="size-4 text-muted-foreground shrink-0" />
                <span className="text-muted-foreground">{text}</span>
              </div>
            ))}
          </div>

          {/* AI Banner */}
          <div className="flex items-center gap-2 text-xs text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-lg p-3 transition-colors hover:bg-amber-100 dark:hover:bg-amber-950/40">
            <Sparkles className="size-4 shrink-0 animate-pulse text-amber-500" />
            <span>Our AI recommends this for <strong>birthdays, anniversaries</strong> and special occasions.</span>
          </div>
        </div>
      </div>

      {/* Details Tabs */}
      <Tabs defaultValue="description" className="mb-12">
        <TabsList>
          <TabsTrigger value="description">Description</TabsTrigger>
          <TabsTrigger value="reviews">Reviews ({product.reviewCount})</TabsTrigger>
          <TabsTrigger value="shipping">Shipping</TabsTrigger>
          <TabsTrigger value="price-history">Price History</TabsTrigger>
        </TabsList>
        <TabsContent value="description" className="mt-4">
          <div className="prose prose-sm max-w-none text-muted-foreground">
            <p className="leading-relaxed">{product.description}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {product.tags.map(tag => (
                <Badge key={tag} variant="outline" className="text-xs">{tag}</Badge>
              ))}
            </div>
          </div>
        </TabsContent>
        <TabsContent value="reviews" className="mt-4">
          <div className="space-y-4">
            {[
              { name: "Ananya K.", rating: 5, text: "Absolutely stunning! Exceeded expectations.", date: "2 weeks ago" },
              { name: "Vikram S.", rating: 5, text: "Perfect gift for my wife's birthday. She loved it!", date: "1 month ago" },
              { name: "Meera T.", rating: 4, text: "Great quality. Packaging was beautiful.", date: "2 months ago" },
            ].map(r => (
              <div key={r.name} className="border rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="size-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xs font-bold">
                      {r.name.charAt(0)}
                    </div>
                    <span className="font-medium text-sm">{r.name}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">{r.date}</span>
                </div>
                <div className="flex gap-0.5 mb-2">
                  {Array.from({ length: r.rating }).map((_, i) => (
                    <Star key={i} className="size-3.5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-sm text-muted-foreground">{r.text}</p>
              </div>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="shipping" className="mt-4">
          <div className="space-y-3 text-sm text-muted-foreground">
            <p>• Standard delivery: 5–7 business days (Free above ₹999)</p>
            <p>• Express delivery: 2–3 business days (₹99)</p>
            <p>• Same-day delivery available in Mumbai, Delhi, Bangalore</p>
            <p>• Complimentary gift wrapping on all orders</p>
          </div>
        </TabsContent>
        <TabsContent value="price-history" className="mt-4">
          <PriceHistoryChart productId={product.id} currentPrice={product.price} originalPrice={product.originalPrice} />
        </TabsContent>
      </Tabs>

      {/* Related Products */}
      {related.length > 0 && (
        <section>
          <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight mb-6">You May Also Like</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {related.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>
      )}
    </div>
  )
}
