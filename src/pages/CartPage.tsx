import { Link, useNavigate } from "react-router-dom"
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, Tag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { useCart } from "@/contexts/CartContext"
import { formatPrice } from "@/data/products"
import { useState } from "react"

export default function CartPage() {
  const { items, removeItem, updateQuantity, totalItems, totalPrice, clearCart } = useCart()
  const navigate = useNavigate()
  const [coupon, setCoupon] = useState("")
  const [couponApplied, setCouponApplied] = useState(false)

  const discount = couponApplied ? Math.floor(totalPrice * 0.1) : 0
  const shipping = totalPrice > 999 ? 0 : 99
  const finalPrice = totalPrice - discount + shipping

  const handleCoupon = () => {
    if (coupon.toLowerCase() === "giftnest10") {
      setCouponApplied(true)
    }
  }

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center max-w-md">
        <div className="text-6xl mb-6">🛒</div>
        <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight mb-2">Your cart is empty</h2>
        <p className="text-muted-foreground mb-6">Add some wonderful gifts to get started!</p>
        <Button size="lg" asChild>
          <Link to="/catalog">Start Shopping <ArrowRight className="size-4" /></Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="scroll-m-20 text-2xl font-semibold tracking-tight mb-6 flex items-center gap-2">
        <ShoppingBag className="size-5" /> Cart
        <Badge variant="secondary">{totalItems} items</Badge>
      </h1>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map(({ product, quantity }) => (
            <div key={product.id} className="flex gap-4 p-4 border rounded-xl bg-card">
              <Link to={`/product/${product.id}`}>
                <img
                  src={product.image}
                  alt={product.name}
                  className="size-20 rounded-lg object-cover shrink-0"
                />
              </Link>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between gap-2 mb-1">
                  <Link to={`/product/${product.id}`}>
                    <h3 className="font-medium text-sm line-clamp-2 hover:text-primary transition-colors">
                      {product.name}
                    </h3>
                  </Link>
                  <Button
                    variant="ghost"
                    size="icon-xs"
                    onClick={() => removeItem(product.id)}
                    className="shrink-0 text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="size-3.5" />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mb-3 capitalize">
                  {product.category.replace("-", " ")}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center border rounded-md">
                    <Button
                      variant="ghost" size="icon-xs"
                      className="rounded-none"
                      onClick={() => updateQuantity(product.id, quantity - 1)}
                    >
                      <Minus className="size-3" />
                    </Button>
                    <span className="px-3 text-sm font-medium">{quantity}</span>
                    <Button
                      variant="ghost" size="icon-xs"
                      className="rounded-none"
                      onClick={() => updateQuantity(product.id, quantity + 1)}
                    >
                      <Plus className="size-3" />
                    </Button>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-sm">{formatPrice(product.price * quantity)}</p>
                    {quantity > 1 && (
                      <p className="text-xs text-muted-foreground">{formatPrice(product.price)} each</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}

          <Button variant="ghost" size="sm" className="text-muted-foreground" onClick={clearCart}>
            <Trash2 className="size-3.5 mr-1" /> Clear Cart
          </Button>
        </div>

        {/* Summary */}
        <div className="lg:col-span-1">
          <div className="border rounded-xl p-5 bg-card sticky top-20 space-y-4">
            <h2 className="font-semibold">Order Summary</h2>
            <Separator />

            {/* Coupon */}
            <div>
              <p className="text-sm font-medium mb-2 flex items-center gap-1.5">
                <Tag className="size-3.5" /> Coupon Code
              </p>
              <div className="flex gap-2">
                <Input
                  placeholder="Enter code"
                  value={coupon}
                  onChange={e => setCoupon(e.target.value)}
                  className="h-8 text-sm"
                  disabled={couponApplied}
                />
                <Button size="sm" variant="outline" onClick={handleCoupon} disabled={couponApplied}>
                  {couponApplied ? "Applied!" : "Apply"}
                </Button>
              </div>
              {!couponApplied && (
                <p className="text-xs text-muted-foreground mt-1.5">
                  Try: <button className="underline" onClick={() => setCoupon("GIFTNEST10")}>GIFTNEST10</button> for 10% off
                </p>
              )}
            </div>

            <Separator />

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span>{formatPrice(totalPrice)}</span>
              </div>
              {couponApplied && (
                <div className="flex justify-between text-green-600">
                  <span>Discount (10%)</span>
                  <span>-{formatPrice(discount)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-muted-foreground">Shipping</span>
                <span>{shipping === 0 ? <span className="text-green-600">Free</span> : formatPrice(shipping)}</span>
              </div>
              {shipping > 0 && (
                <p className="text-xs text-muted-foreground">Add {formatPrice(999 - totalPrice)} more for free shipping</p>
              )}
            </div>

            <Separator />

            <div className="flex justify-between font-bold text-lg">
              <span>Total</span>
              <span>{formatPrice(finalPrice)}</span>
            </div>

            <Button className="w-full gap-2" size="lg" onClick={() => navigate("/checkout")}>
              Proceed to Checkout <ArrowRight className="size-4" />
            </Button>

            <p className="text-xs text-center text-muted-foreground">
              Secure checkout via Razorpay · UPI accepted
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
