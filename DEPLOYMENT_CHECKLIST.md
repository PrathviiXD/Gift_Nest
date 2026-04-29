# GiftNest Deployment Checklist

## Pre-Deployment: Grok AI Setup

### ✅ What's Deployed
- [x] Grok Edge Function (`grok-recommendations`)
- [x] React Hook (`use-grok`)
- [x] Enhanced AI Chatbot component
- [x] Full build verified (no errors)
- [x] Documentation complete

### ⚠️ REQUIRED: Configure Grok API Key

Before the app goes live, add the Grok API key to Supabase:

**Method 1: Supabase Dashboard**
1. Go to your Supabase project
2. Navigate to: Settings → Edge Functions → Secrets
3. Click "New secret"
4. Enter:
   - Name: `GROK_API_KEY`
   - Value: `7e8626b86ae804402e6fb495d05f47e8f5fb97f4`
5. Save

**Method 2: Via Code/Script**
```bash
# If using supabase CLI
supabase secrets set GROK_API_KEY=your_api_key_here

# Then redeploy the edge function
supabase functions deploy grok-recommendations
```

### Verification
After setting the secret, test the endpoint:
```bash
curl -X POST https://[PROJECT_ID].supabase.co/functions/v1/grok-recommendations \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer [ANON_KEY]" \
  -d '{
    "query": "Birthday gift for tech enthusiast"
  }'
```

Expected response:
```json
{
  "success": true,
  "recommendation": "Based on your request, here are personalized recommendations...",
  ...
}
```

## Deployment Steps

### 1. Build & Test Locally
```bash
npm run build              # Build verification
npm run typecheck          # Type checking
npm run dev                # Test locally
```

### 2. Deploy to Production
```bash
# Your deployment platform commands
# Examples:
# - Vercel: vercel deploy
# - Netlify: netlify deploy
# - Manual: Copy dist/ to hosting
```

### 3. Post-Deployment Verification
- [ ] App loads without errors
- [ ] Chatbot button appears (bottom-right)
- [ ] Click "Ask AI" opens chatbot
- [ ] Type a gift request and press Enter
- [ ] Wait for Grok response (2-5 seconds)
- [ ] Verify recommendation appears with Grok badge

### 4. Edge Function Monitoring
```bash
# Monitor edge function logs
supabase functions logs grok-recommendations

# Check function status
supabase functions list
```

## Testing Scenarios

### Test 1: Basic Recommendation
**Input:** "Gift for my sister"
**Expected:** 2-4 product recommendations with prices

### Test 2: With Occasion
**Input:** "Diwali gifts"
**Expected:** Occasion-specific recommendations (hampers, figurines)

### Test 3: With Budget
**Input:** "Birthday gift under 1000"
**Expected:** 2-4 products under ₹1,000

### Test 4: Error Handling
**Input:** "" (empty query)
**Expected:** Error message or prompt for more details

### Test 5: Network Failure Simulation
**Steps:**
1. Open DevTools → Network tab
2. Throttle to "Offline"
3. Try sending a message
**Expected:** Graceful error handling and user-friendly message

## Production Checklist

### Environment
- [ ] VITE_SUPABASE_URL is correct
- [ ] VITE_SUPABASE_ANON_KEY is correct
- [ ] GROK_API_KEY is set in Supabase secrets
- [ ] Edge function status is ACTIVE

### Performance
- [ ] Build size is acceptable (< 500KB gzipped is good)
- [ ] Chatbot loads within 2-5 seconds
- [ ] UI shows loading states
- [ ] Error messages are user-friendly

### Security
- [ ] API key never exposed in frontend code
- [ ] CORS headers are correct
- [ ] Only necessary endpoints are public
- [ ] Input validation is working

### Monitoring
- [ ] Error logging is enabled
- [ ] Edge function logs are accessible
- [ ] Performance metrics are tracked
- [ ] User feedback channel is available

## Rollback Plan

If issues occur:

### Option 1: Disable Chatbot (5 minutes)
```typescript
// In AIChatbot.tsx, return empty fragment
export function AIChatbot() {
  return <></> // Temporarily disable
}
```

### Option 2: Revert to Fallback Responses
```typescript
// In use-grok.ts, return static responses
const getRecommendations = async () => {
  return "Browse our catalog for gift ideas"
}
```

### Option 3: Full Rollback
Redeploy previous version with:
```bash
git revert <commit-hash>
npm run build
# Deploy
```

## Troubleshooting

### Issue: "GROK_API_KEY not configured"
**Solution:** Set the secret in Supabase Edge Functions settings

### Issue: Slow responses (> 10 seconds)
**Possible causes:**
- Grok API rate limiting
- Network latency
- Cold start on edge function
**Solution:** Retry or ask user to try simpler query

### Issue: CORS errors in browser
**Possible causes:**
- SUPABASE_URL is incorrect
- SUPABASE_ANON_KEY is expired
- Edge function CORS headers missing
**Solution:** Verify env vars and redeploy function

### Issue: Chatbot shows no response
**Possible causes:**
- API key not set
- Network issue
- Grok API down
**Solution:** Check logs, retry, or show fallback message

## Monitoring & Analytics

### Key Metrics to Track
1. **Chatbot Usage:**
   - Number of messages sent
   - Average response time
   - User satisfaction

2. **Errors:**
   - Failed requests
   - Rate limit hits
   - API timeouts

3. **Performance:**
   - Edge function response time
   - Network latency
   - User engagement

## Documentation Files

Included with this deployment:
- `GROK_INTEGRATION.md` — Technical deep dive
- `GROK_SETUP_GUIDE.md` — Quick start guide
- `DEPLOYMENT_CHECKLIST.md` — This file
- `README.md` — Main project documentation

## Support & Escalation

### If Grok API fails:
1. Check xAI status page
2. Verify API key is valid
3. Check rate limits
4. Contact xAI support

### If Supabase has issues:
1. Check Supabase status page
2. Verify project is accessible
3. Check edge function logs
4. Contact Supabase support

## Timeline

- **Pre-deployment:** 10 minutes (set API key)
- **Deployment:** 5 minutes (build & upload)
- **Testing:** 5 minutes (verify functionality)
- **Monitoring:** Continuous

**Total: ~20 minutes from start to production**

## Sign-off

- [ ] All tests passed
- [ ] Grok API key configured
- [ ] Documentation reviewed
- [ ] Team notified
- [ ] Monitoring enabled
- [ ] Rollback plan ready

**Deployed by:** _________________ **Date:** _________

---

## Quick Reference

### API Endpoint
```
POST {SUPABASE_URL}/functions/v1/grok-recommendations
```

### Required Headers
```
Authorization: Bearer {ANON_KEY}
Content-Type: application/json
```

### Min Request
```json
{ "query": "Gift for mom" }
```

### Full Request
```json
{
  "query": "Birthday gift for tech enthusiast",
  "occasion": "Birthday",
  "budget": 5000
}
```

### Success Response
```json
{
  "success": true,
  "recommendation": "...",
  "query": "..."
}
```

### Error Response
```json
{
  "success": false,
  "error": "Error message"
}
```

---

**Status: ✅ READY FOR DEPLOYMENT**
