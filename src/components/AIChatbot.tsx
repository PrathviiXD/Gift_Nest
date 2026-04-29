import { useState, useRef, useEffect } from "react"
import { MessageCircle, X, Send, Sparkles, Bot, User, CircleAlert as AlertCircle, Mic, MicOff, Volume2, VolumeX } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useGrok } from "@/hooks/use-grok"
import { cn } from "@/lib/utils"

type Message = {
  id: string
  role: "user" | "bot"
  text: string
  suggestions?: string[]
  isGrokPowered?: boolean
}

const botReplies: Record<string, { text: string; suggestions?: string[] }> = {
  default: {
    text: "Hello! I'm GiftNest AI, your intelligent assistant. I'm here to help you with gift ideas, answer your questions about Indian artisanal crafts, or just chat. What's on your mind?",
    suggestions: ["Find a gift", "Tell me about Indian crafts", "How are you?", "Help me with something"],
  },
}

export function AIChatbot() {
  const { getRecommendations, loading } = useGrok()
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
  const [isListening, setIsListening] = useState(false)
  const [voiceMode, setVoiceMode] = useState(true)
  const bottomRef = useRef<HTMLDivElement>(null)

  const toggleVoiceMode = () => {
    setVoiceMode(!voiceMode)
    if (voiceMode) {
      window.speechSynthesis.cancel()
    }
  }

  const speakText = (text: string) => {
    if (!voiceMode || !window.speechSynthesis) return
    window.speechSynthesis.cancel() // Stop any current speech
    
    // Remove markdown formatting before speaking
    const cleanText = text.replace(/\*\*/g, '').replace(/\*/g, '').replace(/#/g, '')
    const utterance = new SpeechSynthesisUtterance(cleanText)
    utterance.rate = 1.05
    utterance.pitch = 1
    utterance.lang = 'en-IN'
    window.speechSynthesis.speak(utterance)
  }

  const toggleListening = () => {
    if (isListening) {
      setIsListening(false)
      return
    }

    // @ts-ignore
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Your browser does not support voice input.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-IN';
    recognition.interimResults = false;
    
    recognition.onstart = () => setIsListening(true);
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInput(prev => prev + (prev ? " " : "") + transcript);
    };
    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);
    
    recognition.start();
  }

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, typing])

  const sendMessage = async (text: string) => {
    if (!text.trim()) return
    
    const userMsg: Message = { id: Date.now().toString(), role: "user", text }
    setMessages(prev => [...prev, userMsg])
    setInput("")
    setTyping(true)

    try {
      // Create message history for the AI, skipping the initial greeting
      const history = [...messages, userMsg]
        .filter(m => m.id !== "0")
        .map(m => ({
          role: (m.role === "user" ? "user" : "assistant") as "user" | "assistant",
          content: m.text
        }))

      const botMsgId = (Date.now() + 1).toString()
      setMessages(prev => [
        ...prev,
        { id: botMsgId, role: "bot", text: "", isGrokPowered: true }
      ])
      
      setTyping(false) // We show the empty message immediately, loading takes over

      const aiResponse = await getRecommendations({ 
        messages: history,
        onChunk: (chunk) => {
          setMessages(prev => prev.map(m => 
            m.id === botMsgId ? { ...m, text: m.text + chunk } : m
          ))
        }
      })

      if (aiResponse) {
        setMessages(prev => prev.map(m => 
          m.id === botMsgId ? { ...m, suggestions: ["Browse catalog", "Gift for Diwali", "Budget ₹2000"] } : m
        ))
        speakText(aiResponse)
      } else {
        const fallbackMsg: Message = {
          id: (Date.now() + 2).toString(),
          role: "bot",
          text: "I'd love to help! Could you tell me more about the recipient or the occasion? Also, let me know if you have a budget in mind.",
          suggestions: ["Birthday gift", "Wedding gift", "Home decor"],
        }
        setMessages(prev => [...prev, fallbackMsg])
      }
    } catch (err) {
      const errorMsg: Message = {
        id: (Date.now() + 2).toString(),
        role: "bot",
        text: "I encountered an error processing your request. Please try again or browse our catalog directly.",
        suggestions: ["View catalog", "Browse categories"],
      }
      setMessages(prev => [...prev, errorMsg])
    } finally {
      setTyping(false)
    }
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
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="icon-xs" onClick={toggleVoiceMode} className="hover:bg-primary-foreground/10 text-primary-foreground" title={voiceMode ? "Mute Voice" : "Enable Voice"}>
                {voiceMode ? <Volume2 className="size-4" /> : <VolumeX className="size-4" />}
              </Button>
              <Button variant="ghost" size="icon-xs" onClick={() => setOpen(false)} className="hover:bg-primary-foreground/10 text-primary-foreground">
                <X className="size-4" />
              </Button>
            </div>
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
                      "rounded-2xl px-3 py-2 text-sm leading-relaxed",
                      msg.role === "bot"
                        ? "bg-muted text-foreground rounded-tl-sm"
                        : "bg-primary text-primary-foreground rounded-tr-sm"
                    )}>
                      <div className="space-y-1">
                        {msg.text.split('\n').map((line, i) => (
                          <div key={i} className="min-h-[1.25rem]">
                            {line.split(/(\*\*.*?\*\*)/g).map((part, j) => {
                              if (part.startsWith('**') && part.endsWith('**')) {
                                return <strong key={j} className="font-semibold">{part.slice(2, -2)}</strong>
                              }
                              return <span key={j}>{part}</span>
                            })}
                          </div>
                        ))}
                      </div>
                      {msg.isGrokPowered && (
                        <div className="text-[10px] opacity-70 mt-2 flex items-center gap-1 border-t border-border/50 pt-1">
                          <Sparkles className="size-2.5" /> AI-powered
                        </div>
                      )}
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
              {(typing || loading) && (
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

          <div className="border-t p-3 flex gap-2">
            <Input
              placeholder={isListening ? "Listening..." : "Ask me anything..."}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && sendMessage(input)}
              className={cn("h-8 text-sm", isListening && "border-primary ring-1 ring-primary")}
              disabled={loading}
            />
            <Button 
              size="icon-sm" 
              variant={isListening ? "default" : "outline"}
              onClick={toggleListening} 
              disabled={loading}
              className={cn(isListening && "animate-pulse bg-red-500 hover:bg-red-600 text-white border-none")}
            >
              {isListening ? <MicOff className="size-3.5" /> : <Mic className="size-3.5" />}
            </Button>
            <Button size="icon-sm" onClick={() => sendMessage(input)} disabled={!input.trim() || loading}>
              <Send className="size-3.5" />
            </Button>
          </div>

          {/* Info Banner */}
          <div className="border-t bg-muted/50 px-3 py-2 text-[10px] text-muted-foreground flex items-start gap-1.5">
            <AlertCircle className="size-3 shrink-0 mt-0.5" />
            <span>Powered by intelligent AI for personalized gift recommendations</span>
          </div>
        </div>
      )}

      {/* Toggle Button */}
      <Button
        size="lg"
        className="rounded-full shadow-xl gap-2 h-14 px-6 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600 text-white border-none transition-all duration-300 hover:scale-105 animate-in fade-in slide-in-from-bottom-4"
        onClick={() => setOpen(o => !o)}
      >
        {open ? <X className="size-5" /> : <Sparkles className="size-5 animate-pulse" />}
        {!open && <span className="text-sm font-semibold tracking-wide">Ask AI</span>}
      </Button>
    </div>
  )
}
