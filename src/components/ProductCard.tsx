import { Link } from "react-router-dom"
import { ShoppingCart, Heart, Star, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { useCart } from "@/contexts/CartContext"
import { type Product, formatPrice } from "@/data/products"
import { cn } from "@/lib/utils"

type Props = {
  product: Product
  className?: string
  showAiBadge?: boolean
}

export function ProductCard({ product, className, showAiBadge }: Props) {
  const { addItem } = useCart()

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
          <div>
            <span className="font-bold text-sm">{formatPrice(product.price)}</span>
            {product.originalPrice && (
              <span className="text-xs text-muted-foreground line-through ml-1.5">
                {formatPrice(product.originalPrice)}
              </span>
            )}
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
