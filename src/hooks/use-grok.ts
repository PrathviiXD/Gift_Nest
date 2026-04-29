import { useState, useCallback } from "react"

// The API key provided by the user in the previous conversation.
const API_KEY = import.meta.env.VITE_OPENAI_API_KEY || ""

interface UseGrokOptions {
  messages?: { role: "user" | "assistant" | "system"; content: string }[]
  onChunk?: (chunk: string) => void
}

export function useGrok() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const getRecommendations = useCallback(
    async (options: UseGrokOptions): Promise<string | null> => {
      setLoading(true)
      setError(null)

      try {
        const systemPrompt = `You are a highly intelligent, real AI assistant. You must communicate like a human, natively and naturally. NO FLUFF. NO ROBOTIC RESPONSES. Do not use phrases like "I am an AI assistant" or "How can I help you today?". Be direct, helpful, and highly conversational. Keep responses concise and practical. 

When giving recommendations, provide exact product details, prices in INR, and why they fit. You are integrated into GiftNest, a premium platform.

GiftNest sells: Home Decor (pottery, vases), Jewelry & Boxes (mahogany), Candles & Fragrances (soy, lavender), Textiles (silk scarves, block prints), Gift Hampers, Art & Figurines (brass Ganesha), Stationery (leather journals), Wellness (diffusers, aromatherapy).

Talk like a real human consulting a friend. Answer anything the user asks, even beyond gifts, but stay grounded.`

        const messages = [
          { role: "system", content: systemPrompt },
          ...(options.messages || [])
        ]

        const response = await fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${API_KEY}`,
          },
          body: JSON.stringify({
            model: "gpt-4o-mini",
            messages: messages,
            temperature: 0.7,
            max_tokens: 800,
            stream: !!options.onChunk,
          }),
        })

        if (!response.ok) {
          const errorText = await response.text()
          throw new Error(`API Error: ${response.status} - ${errorText}`)
        }

        if (options.onChunk && response.body) {
          const reader = response.body.getReader()
          const decoder = new TextDecoder("utf-8")
          let done = false
          let fullText = ""

          while (!done) {
            const { value, done: readerDone } = await reader.read()
            done = readerDone
            if (value) {
              const chunk = decoder.decode(value, { stream: true })
              const lines = chunk.split('\n').filter(line => line.trim() !== '')
              for (const line of lines) {
                if (line === 'data: [DONE]') {
                  done = true;
                  break;
                }
                if (line.startsWith('data: ')) {
                  try {
                    const data = JSON.parse(line.slice(6))
                    const content = data.choices[0]?.delta?.content
                    if (content) {
                      fullText += content
                      options.onChunk(content)
                    }
                  } catch (e) {
                    // Ignore parse errors on incomplete chunks
                  }
                }
              }
            }
          }
          return fullText
        } else {
          const data = await response.json()
          return data.choices[0].message.content
        }
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : "Unknown error"
        setError(errorMsg)
        console.error("AI integration error:", err)
        return null
      } finally {
        setLoading(false)
      }
    },
    []
  )

  return { getRecommendations, loading, error }
}
