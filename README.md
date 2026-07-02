# Text Humanizer — deploy this in 5 minutes

## What's in this folder
- `public/index.html` — the app itself (frontend)
- `api/humanize.js` — a secure backend function that calls the Claude API (keeps your API key hidden)
- `vercel.json`, `package.json` — config so Vercel knows how to run it

## Step 1: Get an Anthropic API key
1. Go to https://console.anthropic.com
2. Sign up or log in
3. Go to "API Keys" and create a new key
4. Copy it somewhere safe, you'll need it in Step 3

Note: this requires putting a small amount of credit on the API console (a few dollars covers a lot of usage for a demo app). This is separate from a normal Claude.ai subscription.

## Step 2: Create a free Vercel account
1. Go to https://vercel.com/signup
2. Sign up with GitHub (easiest) or email

## Step 3: Deploy
**Easiest path (no command line):**
1. Go to https://vercel.com/new
2. Create a new GitHub repo with these files (or use "Import" and drag this folder if Vercel offers it, otherwise push this folder to a new GitHub repo first)
3. Import that repo into Vercel
4. Before the first deploy finishes, go to Project Settings > Environment Variables
5. Add a variable: Name = `ANTHROPIC_API_KEY`, Value = the key from Step 1
6. Click Deploy

**Command line path (if you're comfortable with terminal):**
```
npm install -g vercel
cd text-humanizer
vercel
```
Follow the prompts (link to your Vercel account, accept defaults). Then add your key:
```
vercel env add ANTHROPIC_API_KEY
```
Paste your key when asked, choose "Production". Then redeploy:
```
vercel --prod
```

## Step 4: You're live
Vercel will give you a URL like `https://text-humanizer-yourname.vercel.app`. That's your live link for the YC application.

## Notes
- The free Vercel tier is enough for a demo app like this.
- If you want a custom domain later, that's in Project Settings > Domains.
- If the app throws an error, double check the `ANTHROPIC_API_KEY` environment variable is set correctly in Vercel and redeploy.
