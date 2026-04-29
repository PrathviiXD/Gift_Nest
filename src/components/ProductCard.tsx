import { useState } from "react"
import { Link } from "react-router-dom"
import { ShoppingCart, Heart, Star, Sparkles, Info, TrendingUp } from "lucide-react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid } from "recharts"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { useCart } from "@/contexts/CartContext"
import { type Product, formatPrice } from "@/data/products"
import { cn } from "@/lib/utils"

type Props = {
  product: Product
  className?: string
  showAiBadge?: boolean
}

// Generate realistic looking mock price history
const generatePriceHistory = (currentPrice: number, originalPrice?: number) => {
  const data = []
  const maxPrice = originalPrice || currentPrice * 1.3
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
  
  const currentMonth = new Date().getMonth()
  
  for (let i = 5; i >= 0; i--) {
    let monthIdx = currentMonth - i
    if (monthIdx < 0) monthIdx += 12
    
    // Create some volatility but ending at current price
    const volatility = (Math.random() * 0.2) + 0.9 // 0.9 to 1.1
    let pricePoint = i === 0 
      ? currentPrice 
      : Math.floor(currentPrice + ((maxPrice - currentPrice) * (i / 5)) * volatility)
      
    data.push({
      month: months[monthIdx],
      price: pricePoint
    })
  }
  return data
}

const chartConfig = {
  price: {
    label: "Price",
    color: "hsl(var(--primary))",
  },
}

export function ProductCard({ product, className, showAiBadge }: Props) {
  const { addItem } = useCart()
  const [historyData] = useState(() => generatePriceHistory(product.price, product.originalPrice))

  return (
    <Card className={cn("group relative overflow-hidden py-0 gap-0 transition-shadow hover:shadow-md", className)}>
      <div className="relative overflow-hidden">
        <Link to={`/product/${product.id}`}>
          <img
            src={product.image}
            alt={product.name}
            className="aspect-square w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </Link>

        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {product.isNew && (
            <Badge className="text-[10px] px-1.5 py-0.5">New</Badge>
          )}
          {product.isBestseller && (
            <Badge variant="secondary" className="text-[10px] px-1.5 py-0.5">Bestseller</Badge>
          )}
          {product.originalPrice && (
            <Badge variant="destructive" className="text-[10px] px-1.5 py-0.5">
              {Math.round((1 - product.price / product.originalPrice) * 100)}% OFF
            </Badge>
          )}
          {showAiBadge && (
            <Badge className="text-[10px] px-1.5 py-0.5 bg-amber-500 text-white">
              <Sparkles className="size-2.5 mr-0.5" /> AI Pick
            </Badge>
          )}
        </div>

        {/* Wishlist */}
        <Button
          variant="ghost"
          size="icon-sm"
          className="absolute top-2 right-2 bg-background/80 hover:bg-background opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <Heart className="size-3.5" />
        </Button>
      </div>

      <CardContent className="p-3">
        <Link to={`/product/${product.id}`}>
          <h3 className="font-medium text-sm leading-snug line-clamp-2 hover:text-primary transition-colors mb-1">
            {product.name}
          </h3>
        </Link>

        <div className="flex items-center gap-1 mb-2">
          <Star className="size-3 fill-amber-400 text-amber-400" />
          <span className="text-xs font-medium">{product.rating}</span>
          <span className="text-xs text-muted-foreground">({product.reviewCount})</span>
        </div>

        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center flex-wrap gap-x-1.5">
            <span className="font-bold text-sm">{formatPrice(product.price)}</span>
            {product.originalPrice && (
              <span className="text-xs text-muted-foreground line-through">
                {formatPrice(product.originalPrice)}
              </span>
            )}
            
            {/* Price History Button & Dialog */}
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="ghost" size="icon-xs" className="h-5 w-5 rounded-full text-muted-foreground hover:text-primary hover:bg-primary/10 ml-1">
                  <TrendingUp className="size-3" />
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <TrendingUp className="size-5 text-primary" />
                    Price History
                  </DialogTitle>
                </DialogHeader>
                <div className="pt-4 pb-2">
                  <div className="mb-4">
                    <h4 className="text-sm font-medium leading-none mb-1">{product.name}</h4>
                    <p className="text-xs text-muted-foreground">6-month price trends</p>
                  </div>
                  
                  <ChartContainer config={chartConfig} className="h-[200px] w-full">
                    <LineChart data={historyData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid vertical={false} strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="month" 
                        tickLine={false} 
                        axisLine={false} 
                        tickMargin={10} 
                        style={{ fontSize: '10px' }} 
                      />
                      <YAxis 
                        tickLine={false} 
                        axisLine={false} 
                        tickMargin={10} 
                        tickFormatter={(value) => `₹${value}`}
                        style={{ fontSize: '10px' }}
                      />
                      <ChartTooltip cursor={{ strokeDasharray: '3 3' }} content={<ChartTooltipContent />} />
                      <Line 
                        type="monotone" 
                        dataKey="price" 
                        stroke="var(--color-price)" 
                        strokeWidth={2} 
                        dot={{ r: 4, fill: "var(--color-price)", strokeWidth: 2 }} 
                        activeDot={{ r: 6 }} 
                      />
                    </LineChart>
                  </ChartContainer>
                  
                  <div className="mt-4 bg-muted/50 rounded-lg p-3 text-xs flex items-start gap-2">
                    <Info className="size-4 shrink-0 text-muted-foreground mt-0.5" />
                    <p className="text-muted-foreground">
                      Current price is <span className="font-semibold text-foreground">{formatPrice(product.price)}</span>. 
                      {product.originalPrice ? ` This is the lowest price in the last 6 months!` : ` Prices have remained stable recently.`}
                    </p>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
          
          <Button
            size="icon-sm"
            onClick={() => addItem(product)}
            className="shrink-0"
          >
            <ShoppingCart className="size-3.5" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
