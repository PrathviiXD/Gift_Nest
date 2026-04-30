import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface RecommendationRequest {
  query?: string;
  messages?: GrokMessage[];
  occasion?: string;
  budget?: number;
}

interface GrokMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

async function callGrokAPI(messages: GrokMessage[], apiKey: string): Promise<string> {
  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: messages,
        temperature: 0.7,
        max_tokens: 600,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Grok API error: ${response.status} - ${error}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error("Grok API call failed:", error);
    throw error;
  }
}

function getSystemPrompt(): string {
  return `You are "GiftNest AI", a conversational luxury gift assistant specializing in Indian artisanal and handcrafted gifts.

Your Goal:
1. Be helpful, warm, and conversational.
2. If the user's request is vague (e.g., "I need a gift"), ask clarifying questions about:
   - The Occasion (Birthday, Diwali, Wedding, etc.)
   - The Recipient (Interests, relationship to user)
   - The Budget (in INR)
3. Provide 2-3 specific recommendations from our categories when you have enough information.
4. Keep responses concise but premium.

GiftNest Categories:
- Home Decor (Pottery, Vases)
- Jewelry & Boxes (Wooden mahogany boxes)
- Candles & Fragrances (Soy wax, Lavender)
- Textiles (Silk scarves, Block prints)
- Gift Hampers (Curated luxury sets)
- Art & Figurines (Brass Ganesha, traditional pieces)
- Stationery (Leather journals)
- Wellness (Diffusers, Aromatherapy)

Sample Products to mention:
- Carved Mahogany Jewelry Box (₹2,499)
- Lavender Soy Wax Candle (₹899)
- Block Print Silk Scarf (₹1,799)
- Blue Pottery Vase (₹1,299)
- Festive Luxury Gift Hamper (₹4,999)
- Brass Ganesha Figurine (₹1,899)

Always stay in character as a helpful expert. If you provide recommendations, explain WHY they fit. Always ask if they'd like to see more or refine the budget/occasion.`;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    if (req.method !== "POST") {
      return new Response(JSON.stringify({ error: "Method not allowed" }), {
        status: 405,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const apiKey = Deno.env.get("GROK_API_KEY");
    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: "GROK_API_KEY not configured" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const body: RecommendationRequest = await req.json();
    let { query, messages, occasion, budget } = body;

    if (!query && (!messages || messages.length === 0)) {
      return new Response(
        JSON.stringify({ error: "Query or messages are required" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Prepare messages for Grok
    const grokMessages: GrokMessage[] = [
      {
        role: "system",
        content: getSystemPrompt(),
      },
    ];

    if (messages && messages.length > 0) {
      // Use existing message history
      grokMessages.push(...messages);
    } else if (query) {
      // Fallback for single query
      let userContent = query;
      if (occasion) userContent += `\nOccasion: ${occasion}`;
      if (budget) userContent += `\nBudget: ₹${budget}`;
      
      grokMessages.push({
        role: "user",
        content: userContent,
      });
    }

    const responseText = await callGrokAPI(grokMessages, apiKey);

    return new Response(
      JSON.stringify({
        success: true,
        recommendation: responseText,
        query: query || (messages ? messages[messages.length - 1].content : ""),
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error in grok-recommendations:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
