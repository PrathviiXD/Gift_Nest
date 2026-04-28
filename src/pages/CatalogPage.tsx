import { useState, useMemo } from "react"
import { useSearchParams } from "react-router-dom"
import { ListFilter as Filter, SlidersHorizontal, Grid3x2 as Grid3X3, List, Sparkles, Search, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Separator } from "@/components/ui/separator"
import { ProductCard } from "@/components/ProductCard"
import { products, categories, formatPrice } from "@/data/products"
import { Label } from "@/components/ui/label"

const sortOptions = [
  { value: "relevance", label: "Relevance" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "rating", label: "Top Rated" },
  { value: "newest", label: "Newest First" },
]

const occasions = ["Birthday", "Anniversary", "Diwali", "Wedding", "Housewarming", "Corporate", "Christmas"]

export default function CatalogPage() {
  const [searchParams] = useSearchParams()
  const [sort, setSort] = useState("relevance")
  const [priceRange, setPriceRange] = useState([0, 6000])
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    searchParams.get("category") ? [searchParams.get("category")!] : []
  )
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") ?? "")
  const [aiQuery, setAiQuery] = useState("")

  const filterQuery = searchParams.get("q") ?? ""
  const filterCategory = searchParams.get("category") ?? ""
  const filterType = searchParams.get("filter") ?? ""

  const filteredProducts = useMemo(() => {
    let result = [...products]

    const q = searchQuery || filterQuery
    if (q) {
      const lower = q.toLowerCase()
      result = result.filter(p =>
        p.name.toLowerCase().includes(lower) ||
        p.description.toLowerCase().includes(lower) ||
        p.tags.some(t => t.toLowerCase().includes(lower)) ||
        p.occasion?.some(o => o.toLowerCase().includes(lower))
      )
    }

    if (selectedCategories.length > 0) {
      result = result.filter(p => selectedCategories.includes(p.category))
    } else if (filterCategory) {
      result = result.filter(p => p.category === filterCategory)
    }

    if (filterType === "new") result = result.filter(p => p.isNew)
    if (filterType === "bestseller") result = result.filter(p => p.isBestseller)

    result = result.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1])

    switch (sort) {
      case "price-asc": result.sort((a, b) => a.price - b.price); break
      case "price-desc": result.sort((a, b) => b.price - a.price); break
      case "rating": result.sort((a, b) => b.rating - a.rating); break
      case "newest": result.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0)); break
    }

    return result
  }, [searchQuery, filterQuery, filterCategory, filterType, selectedCategories, priceRange, sort])

  const toggleCategory = (catId: string) => {
    setSelectedCategories(prev =>
      prev.includes(catId) ? prev.filter(c => c !== catId) : [...prev, catId]
    )
  }

  const clearFilters = () => {
    setSelectedCategories([])
    setPriceRange([0, 6000])
    setSearchQuery("")
  }

  const hasActiveFilters = selectedCategories.length > 0 || priceRange[0] > 0 || priceRange[1] < 6000

  const FiltersContent = () => (
    <div className="space-y-6">
      {/* AI Recommendations */}
      <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="size-4 text-amber-500" />
          <span className="text-sm font-semibold">AI Gift Finder</span>
        </div>
        <Input
          placeholder="Describe what you need..."
          value={aiQuery}
          onChange={e => setAiQuery(e.target.value)}
          className="mb-2 text-xs"
        />
        <Button size="sm" className="w-full text-xs" onClick={() => setSearchQuery(aiQuery)}>
          Find with AI
        </Button>
      </div>

      {/* Categories */}
      <div>
        <h3 className="font-semibold text-sm mb-3">Categories</h3>
        <div className="space-y-2">
          {categories.map(cat => (
            <div key={cat.id} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Checkbox
                  id={cat.id}
                  checked={selectedCategories.includes(cat.id)}
                  onCheckedChange={() => toggleCategory(cat.id)}
                />
                <Label htmlFor={cat.id} className="text-sm cursor-pointer">{cat.name}</Label>
              </div>
              <span className="text-xs text-muted-foreground">{cat.count}</span>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      {/* Price Range */}
      <div>
        <h3 className="font-semibold text-sm mb-3">Price Range</h3>
        <Slider
          min={0} max={6000} step={100}
          value={priceRange}
          onValueChange={setPriceRange}
          className="mb-3"
        />
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>{formatPrice(priceRange[0])}</span>
          <span>{formatPrice(priceRange[1])}</span>
        </div>
      </div>

      <Separator />

      {/* Occasions */}
      <div>
        <h3 className="font-semibold text-sm mb-3">Occasion</h3>
        <div className="flex flex-wrap gap-2">
          {occasions.map(o => (
            <button
              key={o}
              onClick={() => setSearchQuery(o)}
              className={`px-2.5 py-1 rounded-full text-xs border transition-colors ${
                searchQuery === o ? "bg-primary text-primary-foreground" : "hover:bg-accent"
              }`}
            >
              {o}
            </button>
          ))}
        </div>
      </div>
    </div>
  )

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="scroll-m-20 text-2xl font-semibold tracking-tight">
            {filterType === "new" ? "New Arrivals" :
             filterType === "bestseller" ? "Bestsellers" :
             filterCategory ? categories.find(c => c.id === filterCategory)?.name ?? "Products" :
             filterQuery ? `Results for "${filterQuery}"` : "All Products"}
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">{filteredProducts.length} products found</p>
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
            <Input
              placeholder="Search products..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="pl-9 h-8 text-sm"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery("")} className="absolute right-2 top-1/2 -translate-y-1/2">
                <X className="size-3.5 text-muted-foreground" />
              </button>
            )}
          </div>
          <Select value={sort} onValueChange={setSort}>
            <SelectTrigger className="w-44 h-8 text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {sortOptions.map(o => (
                <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="flex border rounded-md overflow-hidden">
            <Button
              variant={viewMode === "grid" ? "secondary" : "ghost"}
              size="icon-sm"
              onClick={() => setViewMode("grid")}
              className="rounded-none"
            >
              <Grid3X3 className="size-3.5" />
            </Button>
            <Button
              variant={viewMode === "list" ? "secondary" : "ghost"}
              size="icon-sm"
              onClick={() => setViewMode("list")}
              className="rounded-none"
            >
              <List className="size-3.5" />
            </Button>
          </div>
          {/* Mobile filter */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="sm" className="lg:hidden gap-1.5">
                <Filter className="size-3.5" />
                Filters
                {hasActiveFilters && <Badge className="h-4 w-4 p-0 flex items-center justify-center text-[9px]">!</Badge>}
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72 overflow-y-auto">
              <SheetHeader className="mb-4">
                <SheetTitle className="flex items-center gap-2">
                  <SlidersHorizontal className="size-4" /> Filters
                </SheetTitle>
              </SheetHeader>
              <FiltersContent />
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Active Filters */}
      {hasActiveFilters && (
        <div className="flex items-center gap-2 mb-4 flex-wrap">
          {selectedCategories.map(c => (
            <Badge key={c} variant="secondary" className="gap-1 pr-1">
              {categories.find(cat => cat.id === c)?.name}
              <button onClick={() => toggleCategory(c)}><X className="size-3" /></button>
            </Badge>
          ))}
          <Button variant="ghost" size="sm" onClick={clearFilters} className="h-6 text-xs text-muted-foreground">
            Clear all
          </Button>
        </div>
      )}

      <div className="flex gap-6">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:block w-60 shrink-0">
          <div className="sticky top-20">
            <div className="flex items-center justify-between mb-4">
              <span className="font-semibold text-sm flex items-center gap-2">
                <SlidersHorizontal className="size-4" /> Filters
              </span>
              {hasActiveFilters && (
                <Button variant="ghost" size="sm" className="h-6 text-xs" onClick={clearFilters}>
                  Clear
                </Button>
              )}
            </div>
            <FiltersContent />
          </div>
        </aside>

        {/* Product Grid */}
        <div className="flex-1 min-w-0">
          {filteredProducts.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-4xl mb-4">🔍</div>
              <h3 className="font-semibold text-lg mb-2">No products found</h3>
              <p className="text-muted-foreground mb-4">Try adjusting your filters or search query</p>
              <Button onClick={clearFilters}>Clear Filters</Button>
            </div>
          ) : (
            <div className={
              viewMode === "grid"
                ? "grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4"
                : "flex flex-col gap-4"
            }>
              {filteredProducts.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
