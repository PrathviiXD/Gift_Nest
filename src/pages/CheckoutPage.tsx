import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { CreditCard, Smartphone, Building2, CircleCheck as CheckCircle2, Lock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { useCart } from "@/contexts/CartContext"
import { formatPrice } from "@/data/products"

const paymentMethods = [
  { id: "upi", label: "UPI", icon: Smartphone, subtext: "Google Pay, PhonePe, Paytm" },
  { id: "card", label: "Credit / Debit Card", icon: CreditCard, subtext: "Visa, Mastercard, RuPay" },
  { id: "netbanking", label: "Net Banking", icon: Building2, subtext: "All major banks" },
]

export default function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCart()
  const navigate = useNavigate()
  const [paymentMethod, setPaymentMethod] = useState("upi")
  const [upiId, setUpiId] = useState("")
  const [placing, setPlacing] = useState(false)
  const [form, setForm] = useState({
    name: "", email: "", phone: "",
    address: "", city: "", pincode: "", state: ""
  })

  const shipping = totalPrice > 999 ? 0 : 99
  const total = totalPrice + shipping

  const handlePlaceOrder = async () => {
    setPlacing(true)
    await new Promise(r => setTimeout(r, 1500))
    clearCart()
    navigate("/orders?success=true")
  }

  const updateForm = (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(prev => ({ ...prev, [field]: e.target.value }))

  if (items.length === 0) {
    navigate("/cart")
    return null
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <h1 className="scroll-m-20 text-2xl font-semibold tracking-tight mb-6 flex items-center gap-2">
        <Lock className="size-5" /> Secure Checkout
      </h1>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left: Address + Payment */}
        <div className="lg:col-span-2 space-y-6">
          {/* Delivery Address */}
          <div className="border rounded-xl p-5 bg-card space-y-4">
            <h2 className="font-semibold flex items-center gap-2">
              <span className="size-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">1</span>
              Delivery Address
            </h2>
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2 sm:col-span-1">
                <Label className="text-xs mb-1.5">Full Name</Label>
                <Input value={form.name} onChange={updateForm("name")} placeholder="Rahul Sharma" />
              </div>
              <div className="col-span-2 sm:col-span-1">
                <Label className="text-xs mb-1.5">Phone</Label>
                <Input value={form.phone} onChange={updateForm("phone")} placeholder="+91 98765 43210" />
              </div>
              <div className="col-span-2">
                <Label className="text-xs mb-1.5">Email</Label>
                <Input type="email" value={form.email} onChange={updateForm("email")} placeholder="rahul@example.com" />
              </div>
              <div className="col-span-2">
                <Label className="text-xs mb-1.5">Address</Label>
                <Input value={form.address} onChange={updateForm("address")} placeholder="Street address, apartment, etc." />
              </div>
              <div>
                <Label className="text-xs mb-1.5">City</Label>
                <Input value={form.city} onChange={updateForm("city")} placeholder="Mumbai" />
              </div>
              <div>
                <Label className="text-xs mb-1.5">PIN Code</Label>
                <Input value={form.pincode} onChange={updateForm("pincode")} placeholder="400001" />
              </div>
              <div className="col-span-2">
                <Label className="text-xs mb-1.5">State</Label>
                <Input value={form.state} onChange={updateForm("state")} placeholder="Maharashtra" />
              </div>
            </div>
          </div>

          {/* Payment */}
          <div className="border rounded-xl p-5 bg-card space-y-4">
            <h2 className="font-semibold flex items-center gap-2">
              <span className="size-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">2</span>
              Payment Method
            </h2>
            <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="space-y-2">
              {paymentMethods.map(m => (
                <div
                  key={m.id}
                  className={`flex items-center gap-3 border rounded-lg p-3 cursor-pointer transition-colors ${
                    paymentMethod === m.id ? "border-primary bg-primary/5" : "hover:bg-accent"
                  }`}
                  onClick={() => setPaymentMethod(m.id)}
                >
                  <RadioGroupItem value={m.id} id={m.id} />
                  <m.icon className="size-4 text-muted-foreground" />
                  <div>
                    <Label htmlFor={m.id} className="cursor-pointer font-medium text-sm">{m.label}</Label>
                    <p className="text-xs text-muted-foreground">{m.subtext}</p>
                  </div>
                </div>
              ))}
            </RadioGroup>

            {paymentMethod === "upi" && (
              <div>
                <Label className="text-xs mb-1.5">UPI ID</Label>
                <Input
                  placeholder="yourname@paytm or scan QR"
                  value={upiId}
                  onChange={e => setUpiId(e.target.value)}
                />
                <p className="text-xs text-muted-foreground mt-1.5">
                  Supports Google Pay, PhonePe, Paytm, BHIM UPI
                </p>
              </div>
            )}

            {paymentMethod === "card" && (
              <div className="space-y-3">
                <div>
                  <Label className="text-xs mb-1.5">Card Number</Label>
                  <Input placeholder="1234 5678 9012 3456" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-xs mb-1.5">Expiry</Label>
                    <Input placeholder="MM/YY" />
                  </div>
                  <div>
                    <Label className="text-xs mb-1.5">CVV</Label>
                    <Input placeholder="•••" type="password" />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right: Summary */}
        <div>
          <div className="border rounded-xl p-5 bg-card sticky top-20 space-y-4">
            <h2 className="font-semibold">Order Summary</h2>
            <div className="space-y-3 max-h-48 overflow-y-auto">
              {items.map(({ product, quantity }) => (
                <div key={product.id} className="flex gap-2.5 items-center">
                  <img src={product.image} alt={product.name} className="size-12 rounded-lg object-cover" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium line-clamp-1">{product.name}</p>
                    <p className="text-xs text-muted-foreground">Qty: {quantity}</p>
                  </div>
                  <p className="text-xs font-bold shrink-0">{formatPrice(product.price * quantity)}</p>
                </div>
              ))}
            </div>
            <Separator />
            <div className="space-y-1.5 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span>{formatPrice(totalPrice)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Shipping</span>
                <span>{shipping === 0 ? <span className="text-green-600">Free</span> : formatPrice(shipping)}</span>
              </div>
            </div>
            <Separator />
            <div className="flex justify-between font-bold">
              <span>Total</span>
              <span>{formatPrice(total)}</span>
            </div>

            <Button
              className="w-full gap-2" size="lg"
              onClick={handlePlaceOrder}
              disabled={placing}
            >
              {placing ? (
                <>Processing...</>
              ) : (
                <><CheckCircle2 className="size-4" /> Place Order · {formatPrice(total)}</>
              )}
            </Button>

            <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
              <Lock className="size-3" />
              Powered by Razorpay · 256-bit SSL
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
