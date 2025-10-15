# VS Insights Problem Solver - Deployment Guide

## 🚀 Vercel Deployment

### **Environment Variables (Required)**

Add these 3 environment variables in Vercel Dashboard → Settings → Environment Variables:

```
ANTHROPIC_API_KEY=your-anthropic-api-key-starting-with-sk-ant
OPENAI_API_KEY=your-openai-api-key-starting-with-sk-proj  
GOOGLE_API_KEY=your-google-api-key
```

**Note:** Use the API keys from your `.env.local` file (not committed to git for security).

**Check all 3 environments:** Production, Preview, Development

### **Vercel Pro Required**

⚠️ The application requires **Vercel Pro plan** ($20/month) for 300-second function timeouts.

The agent pipeline takes 60-180 seconds to process, which exceeds Hobby plan limits.

### **Deployment Steps**

1. Import repository from GitHub: https://github.com/dallyp22/VSInsights_model
2. Add environment variables (see above)
3. Deploy
4. Upgrade to Pro plan
5. Redeploy if needed

### **Build Version**

Last updated: January 15, 2025
Latest commit: c602889

### **Troubleshooting Production Errors**

If PRD generation fails in production:

1. **Check Vercel Function Logs**
   - Go to Vercel Dashboard → Your Project → Functions
   - Look for `/api/solver/generate-prd` logs
   - Check for timeout or streaming errors

2. **Verify Environment Variables**
   - Ensure all 3 API keys are set
   - Check they're enabled for Production
   - Redeploy after adding variables

3. **Check for Streaming Support**
   - PRD generation uses streaming API
   - Requires `callClaudeStreaming` function
   - Should show successful completion in ~54-70 seconds

4. **Force Fresh Deploy**
   - Go to Vercel Dashboard
   - Click "Redeploy" on latest deployment
   - Select "Use existing build cache: No"

