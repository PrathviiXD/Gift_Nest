import { useSearchParams, Link } from "react-router-dom"
import { Package, CircleCheck as CheckCircle2, Truck, Clock, MapPin, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"

const mockOrders = [
  {
    id: "ORD-2026-001",
    date: "April 25, 2026",
    status: "delivered",
    total: 4499,
    items: [
      { name: "Carved Mahogany Jewelry Box", qty: 1, price: 2499, image: "/product-jewelry-box.webp" },
      { name: "Lavender Soy Wax Candle", qty: 2, price: 1800, image: "/product-candle.webp" },
    ],
    tracking: [
      { label: "Order Placed", time: "April 20, 10:00 AM", done: true },
      { label: "Processing", time: "April 20, 2:00 PM", done: true },
      { label: "Shipped", time: "April 21, 9:00 AM", done: true },
      { label: "Out for Delivery", time: "April 25, 8:00 AM", done: true },
      { label: "Delivered", time: "April 25, 2:30 PM", done: true },
    ],
  },
  {
    id: "ORD-2026-002",
    date: "April 26, 2026",
    status: "shipped",
    total: 1899,
    items: [
      { name: "Brass Ganesha Figurine", qty: 1, price: 1899, image: "/product-ganesha.webp" },
    ],
    tracking: [
      { label: "Order Placed", time: "April 26, 11:00 AM", done: true },
      { label: "Processing", time: "April 26, 4:00 PM", done: true },
      { label: "Shipped", time: "April 27, 7:00 AM", done: true },
      { label: "Out for Delivery", time: "Expected April 29", done: false },
      { label: "Delivered", time: "Expected April 29", done: false },
    ],
  },
]

const statusConfig = {
  delivered: { label: "Delivered", variant: "default" as const, icon: CheckCircle2 },
  shipped: { label: "Shipped", variant: "secondary" as const, icon: Truck },
  processing: { label: "Processing", variant: "outline" as const, icon: Clock },
}

export default function OrdersPage() {
  const [searchParams] = useSearchParams()
  const success = searchParams.get("success") === "true"

  const formatPrice = (n: number) =>
    new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n)

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <h1 className="scroll-m-20 text-2xl font-semibold tracking-tight mb-6 flex items-center gap-2">
        <Package className="size-5" /> My Orders
      </h1>

      {success && (
        <Alert className="mb-6 border-green-500 bg-green-50 dark:bg-green-950/20">
          <CheckCircle2 className="size-4 text-green-600" />
          <AlertDescription className="text-green-700 dark:text-green-400">
            Order placed successfully! You'll receive a confirmation email shortly.
          </AlertDescription>
        </Alert>
      )}

      <div className="space-y-6">
        {mockOrders.map(order => {
          const statusInfo = statusConfig[order.status as keyof typeof statusConfig]
          const StatusIcon = statusInfo.icon

          return (
            <Card key={order.id}>
              <CardContent className="p-5 space-y-4">
                {/* Header */}
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div>
                    <p className="font-semibold text-sm">{order.id}</p>
                    <p className="text-xs text-muted-foreground">{order.date}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant={statusInfo.variant} className="gap-1.5">
                      <StatusIcon className="size-3" />
                      {statusInfo.label}
                    </Badge>
                    <span className="font-bold text-sm">{formatPrice(order.total)}</span>
                  </div>
                </div>

                {/* Items */}
                <div className="space-y-2">
                  {order.items.map(item => (
                    <div key={item.name} className="flex gap-3 items-center">
                      <img src={item.image} alt={item.name} className="size-12 rounded-lg object-cover" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium line-clamp-1">{item.name}</p>
                        <p className="text-xs text-muted-foreground">Qty: {item.qty} · {formatPrice(item.price)}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <Separator />

                {/* Tracking */}
                <div>
                  <p className="text-xs font-medium mb-3 flex items-center gap-1.5">
                    <MapPin className="size-3.5" /> Tracking
                  </p>
                  <div className="relative">
                    <div className="absolute left-[7px] top-0 bottom-0 w-px bg-border" />
                    <div className="space-y-2.5">
                      {order.tracking.map((step, i) => (
                        <div key={i} className="flex items-start gap-3 pl-6 relative">
                          <div className={`absolute left-0 top-1 size-3.5 rounded-full border-2 ${
                            step.done
                              ? "bg-primary border-primary"
                              : "bg-background border-muted-foreground"
                          }`} />
                          <div>
                            <p className={`text-xs font-medium ${!step.done && "text-muted-foreground"}`}>
                              {step.label}
                            </p>
                            <p className="text-[10px] text-muted-foreground">{step.time}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {mockOrders.length === 0 && (
        <div className="text-center py-16">
          <div className="text-5xl mb-4">📦</div>
          <h2 className="text-xl font-semibold mb-2">No orders yet</h2>
          <p className="text-muted-foreground mb-6">Start shopping to see your orders here</p>
          <Button asChild>
            <Link to="/catalog">Shop Now <ChevronRight className="size-4" /></Link>
          </Button>
        </div>
      )}
    </div>
  )
}
