import { BrowserRouter, Routes, Route } from "react-router-dom"
import { CartProvider } from "@/contexts/CartContext"
import { AuthProvider } from "@/contexts/AuthContext"
import { Navbar } from "@/components/layout/Navbar"
import { Footer } from "@/components/layout/Footer"
import { AIChatbot } from "@/components/AIChatbot"
import HomePage from "@/pages/HomePage"
import CatalogPage from "@/pages/CatalogPage"
import ProductDetailPage from "@/pages/ProductDetailPage"
import CartPage from "@/pages/CartPage"
import CheckoutPage from "@/pages/CheckoutPage"
import AuthPage from "@/pages/AuthPage"
import OrdersPage from "@/pages/OrdersPage"

function AppShell() {
  return (
    <div className="flex flex-col min-h-svh">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/catalog" element={<CatalogPage />} />
          <Route path="/product/:id" element={<ProductDetailPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/orders" element={<OrdersPage />} />
          <Route path="/wishlist" element={<CatalogPage />} />
          <Route path="*" element={<HomePage />} />
        </Routes>
      </main>
      <Footer />
      <AIChatbot />
    </div>
  )
}

export function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <AppShell />
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
