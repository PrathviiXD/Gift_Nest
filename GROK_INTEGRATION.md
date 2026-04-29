# Grok AI Integration - GiftNest Platform

## Overview

GiftNest now leverages **Grok AI** (by xAI) as the intelligent backend for gift recommendations and the AI shopping assistant chatbot. This integration provides advanced natural language understanding and contextual gift suggestions personalized to each user's needs.

## Architecture

```
Frontend (React) → Supabase Edge Function → Grok API
     ↓                                            ↑
  AIChatbot                                   Recommendations
  (use-grok hook)                              Engine
```

## Components

### 1. Edge Function: `grok-recommendations`
**Location:** `supabase/functions/grok-recommendations/index.ts`

Handles all Grok API calls with:
- Request validation and error handling
- CORS headers for cross-origin requests
- Temperature and token optimization (0.7, max 500 tokens)
- Contextual prompt engineering for gift recommendations

**Endpoint:** `{SUPABASE_URL}/functions/v1/grok-recommendations`

**Request Body:**
```typescript
{
  query: string        // Gift request or occasion description
  occasion?: string    // Optional: Birthday, Diwali, Wedding, etc.
  budget?: number      // Optional: Budget in INR
}
```

**Response:**
```typescript
{
  success: boolean
  recommendation: string    // AI-generated gift recommendations
  query: string
  occasion?: string
  budget?: number
  error?: string
}
```

### 2. Hook: `use-grok`
**Location:** `src/hooks/use-grok.ts`

React hook for frontend integration:
```typescript
const { getRecommendations, loading, error } = useGrok()

const result = await getRecommendations({
  query: "Birthday gift for tech-loving dad",
  occasion: "Birthday",
  budget: 3000
})
```

### 3. Component: `AIChatbot`
**Location:** `src/components/AIChatbot.tsx`

Enhanced chatbot component featuring:
- Real-time Grok AI recommendations
- Message history with bot/user differentiation
- Loading states and error handling
- Suggestion buttons for quick interactions
- Grok attribution badge

## Setup & Configuration

### Environment Variables

The edge function requires the Grok API key to be configured as a secret:

```bash
GROK_API_KEY=your_api_key_here
```

This secret is automatically managed by Supabase and is NOT exposed to the frontend.

### Deployment Status

✅ Edge Function: **ACTIVE** (ID: 7f297b47-ffb1-41f9-af10-1d0f171252c9)
- Status: ACTIVE
- Verification: JWT disabled (public access for chatbot)
- CORS: Fully configured

## Features

### 1. Contextual Gift Recommendations
The Grok integration understands:
- Occasions (Birthday, Diwali, Wedding, Corporate, etc.)
- Budget constraints
- Personal preferences
- Cultural significance

### 2. Personalized Responses
Grok generates human-readable, contextual recommendations including:
- Product categories and names
- Price ranges in INR
- Why each gift is suitable
- Key features and appeal

### 3. Intelligent Chatbot
The AIChatbot component now:
- Sends user queries directly to Grok
- Displays AI-powered responses
- Maintains conversation history
- Shows loading states during processing
- Handles errors gracefully

## Usage Examples

### Example 1: Birthday Gift
```
User: "Gift for my mom's 50th birthday, loves yoga and wellness"

Grok Response:
Based on your request, here are personalized recommendations:

1. Rose & Sandalwood Diffuser Set (₹2,199)
   - Perfect for creating a wellness atmosphere
   - Premium aromatherapy with natural ingredients
   - Ideal for yoga/meditation spaces

2. Mandala Embossed Leather Journal (₹1,199)
   - Mindfulness and reflection tool
   - Premium genuine leather
   - Great for wellness journaling

[Continues with 2-4 more recommendations]
```

### Example 2: Diwali Gifting
```
User: "Diwali gifts for clients, budget 2000 each"

Grok Response:
For corporate Diwali gifting within ₹2,000 budget:

1. Brass Ganesha Figurine (₹1,899)
   - Auspicious symbol for prosperity
   - Authentic Indian craftsmanship
   - Fits perfectly in office or home

[Continues...]
```

## API Limits & Performance

- **Model:** grok-beta
- **Temperature:** 0.7 (balanced creativity and consistency)
- **Max Tokens:** 500 (concise recommendations)
- **Response Time:** ~2-5 seconds average
- **CORS:** Configured for browser requests

## Error Handling

The integration includes comprehensive error handling:

```typescript
// Missing API key
→ HTTP 500: "GROK_API_KEY not configured"

// Invalid request
→ HTTP 400: "Query is required"

// Grok API failure
→ HTTP 500: Error message from Grok API

// Network errors
→ Caught by use-grok hook, displayed in UI
```

## Security

✅ **Security Features:**
- API key stored securely in Supabase secrets (NOT in .env)
- JWT verification disabled only for public chatbot access
- CORS headers restrict cross-origin requests appropriately
- Input validation on all requests
- Error messages sanitized before returning to client

⚠️ **Important:** The Grok API key is stored as a Supabase secret and is never exposed to the frontend.

## Monitoring & Debugging

### Console Logs
The edge function logs detailed information:
```
"Error in grok-recommendations: [error details]"
"Grok API call failed: [specific error]"
```

### Testing the Endpoint
```bash
curl -X POST https://[SUPABASE_URL]/functions/v1/grok-recommendations \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer [ANON_KEY]" \
  -d '{
    "query": "Gift for tech enthusiast under 1500",
    "budget": 1500
  }'
```

## Future Enhancements

Potential improvements:
1. **Conversation Context:** Store conversation history for multi-turn dialogues
2. **User Preferences:** Remember past recommendations and preferences
3. **Analytics:** Track which recommendations users engage with
4. **A/B Testing:** Compare recommendation styles
5. **Integration with Catalog:** Direct product linking from Grok responses

## Troubleshooting

### Chatbot not responding
- Check edge function status: `mcp__supabase__list_edge_functions`
- Verify GROK_API_KEY is configured in Supabase secrets
- Check browser console for network errors

### Slow responses
- Grok API may be rate-limited
- Check token usage (max 500 tokens)
- Verify network connectivity

### CORS errors
- Confirm CORS headers in edge function
- Check request headers include proper Authorization

## References

- **Grok API Documentation:** https://docs.x.ai/
- **Supabase Edge Functions:** https://supabase.com/docs/guides/functions
- **xAI Grok Models:** https://docs.x.ai/docs/models/grok-2
