import { useState, useRef, useEffect } from "react"
import { MessageCircle, X, Send, Sparkles, Bot, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"

type Message = {
  id: string
  role: "user" | "bot"
  text: string
  suggestions?: string[]
}

const botReplies: Record<string, { text: string; suggestions?: string[] }> = {
  default: {
    text: "Hi! I'm your AI gift assistant. Tell me about the occasion, the person, or your budget and I'll help you find the perfect gift!",
    suggestions: ["Gift for mom's birthday", "Diwali gifts under ₹2000", "Wedding gift ideas", "Corporate gifts"],
  },
  birthday: {
    text: "For birthdays, I recommend our Carved Mahogany Jewelry Box (₹2,499) or the Festive Luxury Gift Hamper (₹4,999). Both are bestsellers! What's your budget?",
    suggestions: ["Under ₹1000", "₹1000 - ₹3000", "Above ₹3000"],
  },
  diwali: {
    text: "Perfect Diwali picks: our Festive Luxury Gift Hamper (₹4,999) or the Brass Ganesha Figurine (₹1,899). Both come with complimentary gift wrapping!",
    suggestions: ["View Hampers", "View Figurines", "Under ₹2000"],
  },
  wedding: {
    text: "For weddings, the Blue Pottery Vase (₹1,299) and Carved Jewelry Box (₹2,499) are crowd favorites. I can also suggest personalized options!",
    suggestions: ["Under ₹2000", "Premium gifts", "Home decor"],
  },
  budget: {
    text: "Great! Here are our best picks under ₹1,000: Lavender Soy Wax Candle (₹899). For ₹1,000–₹2,000, the Leather Journal (₹1,199) or Blue Pottery Vase (₹1,299) are excellent!",
    suggestions: ["Show candles", "Show pottery", "Show journals"],
  },
  corporate: {
    text: "For corporate gifting, I recommend our Leather Journal (₹1,199) or premium Gift Hampers (₹4,999+). We offer bulk discounts on orders of 10+ items!",
    suggestions: ["Bulk order inquiry", "Premium hampers", "Branded packaging"],
  },
}

function getBotReply(input: string): { text: string; suggestions?: string[] } {
  const lower = input.toLowerCase()
  if (lower.includes("birthday") || lower.includes("bday")) return botReplies.birthday
  if (lower.includes("diwali") || lower.includes("festival")) return botReplies.diwali
  if (lower.includes("wedding") || lower.includes("marriage")) return botReplies.wedding
  if (lower.includes("budget") || lower.includes("cheap") || lower.includes("under") || lower.includes("₹")) return botReplies.budget
  if (lower.includes("corporate") || lower.includes("office") || lower.includes("bulk")) return botReplies.corporate
  return {
    text: "I can help with that! Try searching our catalog or describe the occasion and I'll suggest the best gifts. 🎁",
    suggestions: ["Birthday gifts", "Diwali picks", "Wedding ideas", "Corporate gifts"],
  }
}

export function AIChatbot() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "0",
      role: "bot",
      text: botReplies.default.text,
      suggestions: botReplies.default.suggestions,
    }
  ])
  const [input, setInput] = useState("")
  const [typing, setTyping] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, typing])

  const sendMessage = async (text: string) => {
    if (!text.trim()) return
    const userMsg: Message = { id: Date.now().toString(), role: "user", text }
    setMessages(prev => [...prev, userMsg])
    setInput("")
    setTyping(true)

    await new Promise(r => setTimeout(r, 900))
    const reply = getBotReply(text)
    const botMsg: Message = { id: (Date.now() + 1).toString(), role: "bot", ...reply }
    setMessages(prev => [...prev, botMsg])
    setTyping(false)
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {open && (
        <div className="bg-card border rounded-2xl shadow-2xl w-80 sm:w-96 flex flex-col overflow-hidden">
          {/* Header */}
          <div className="bg-primary text-primary-foreground px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="size-4" />
              <div>
                <p className="font-semibold text-sm">AI Gift Assistant</p>
                <p className="text-[10px] opacity-80">Powered by GiftNest AI</p>
              </div>
            </div>
            <Button variant="ghost" size="icon-xs" onClick={() => setOpen(false)} className="hover:bg-primary-foreground/10 text-primary-foreground">
              <X className="size-4" />
            </Button>
          </div>

          {/* Messages */}
          <ScrollArea className="h-72 p-4">
            <div className="space-y-3">
              {messages.map(msg => (
                <div key={msg.id} className={cn("flex gap-2", msg.role === "user" && "flex-row-reverse")}>
                  <div className={cn(
                    "size-7 rounded-full flex items-center justify-center shrink-0 mt-0.5",
                    msg.role === "bot" ? "bg-primary text-primary-foreground" : "bg-muted"
                  )}>
                    {msg.role === "bot" ? <Bot className="size-3.5" /> : <User className="size-3.5" />}
                  </div>
                  <div className={cn("max-w-[75%] space-y-2", msg.role === "user" && "items-end flex flex-col")}>
                    <div className={cn(
                      "rounded-2xl px-3 py-2 text-sm",
                      msg.role === "bot"
                        ? "bg-muted text-foreground rounded-tl-sm"
                        : "bg-primary text-primary-foreground rounded-tr-sm"
                    )}>
                      {msg.text}
                    </div>
                    {msg.suggestions && msg.role === "bot" && (
                      <div className="flex flex-wrap gap-1.5">
                        {msg.suggestions.map(s => (
                          <button
                            key={s}
                            onClick={() => sendMessage(s)}
                            className="px-2.5 py-1 text-xs rounded-full border bg-background hover:bg-accent transition-colors"
                          >
                            {s}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {typing && (
                <div className="flex gap-2">
                  <div className="size-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center shrink-0">
                    <Bot className="size-3.5" />
                  </div>
                  <div className="bg-muted rounded-2xl rounded-tl-sm px-3 py-2">
                    <div className="flex gap-1 items-center h-4">
                      {[0, 1, 2].map(i => (
                        <span
                          key={i}
                          className="size-1.5 rounded-full bg-muted-foreground animate-bounce"
                          style={{ animationDelay: `${i * 150}ms` }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>
          </ScrollArea>

          {/* Input */}
          <div className="border-t p-3 flex gap-2">
            <Input
              placeholder="Ask me anything..."
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && sendMessage(input)}
              className="h-8 text-sm"
            />
            <Button size="icon-sm" onClick={() => sendMessage(input)} disabled={!input.trim()}>
              <Send className="size-3.5" />
            </Button>
          </div>
        </div>
      )}

      {/* Toggle Button */}
      <Button
        size="lg"
        className="rounded-full shadow-lg gap-2 h-12 px-4"
        onClick={() => setOpen(o => !o)}
      >
        {open ? <X className="size-4" /> : <MessageCircle className="size-4" />}
        {!open && <span className="text-sm font-medium">Ask AI</span>}
      </Button>
    </div>
  )
}
