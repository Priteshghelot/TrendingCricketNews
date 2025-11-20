# Google AdSense Integration Guide

## 📋 Setup Instructions

### Step 1: Get Your AdSense Client ID

1. Go to your [Google AdSense Dashboard](https://www.google.com/adsense)
2. Click on **"Ads"** → **"Overview"**
3. Find your **Publisher ID** (format: `ca-pub-XXXXXXXXXXXXXXXX`)

### Step 2: Add to Environment Variables

1. Open `.env.local` file
2. Add your AdSense Client ID:

```env
NEXT_PUBLIC_ADSENSE_CLIENT_ID=ca-pub-XXXXXXXXXXXXXXXX
```

**Replace** `XXXXXXXXXXXXXXXX` with your actual AdSense Publisher ID

### Step 3: Create Ad Units in AdSense

1. Go to **Ads** → **By ad unit**
2. Click **"New ad unit"**
3. Choose **"Display ads"**
4. Create these ad units:

| Ad Unit Name | Size | Placement |
|--------------|------|-----------|
| Homepage Top Banner | Responsive | Above news articles |
| Sidebar Ad | 300x600 | Right sidebar |
| In-Article Ad | Responsive | Between articles |
| Live Page Ad | Responsive | Below live scores |

5. Copy the **Ad Slot ID** for each unit (format: `1234567890`)

### Step 4: Add Ads to Your Pages

#### Example: Homepage with Ads

```tsx
import AdSense from '@/components/AdSense';

export default function Home() {
  return (
    <div>
      {/* Top Banner Ad */}
      <AdSense 
        adSlot="YOUR_AD_SLOT_ID_HERE"
        adFormat="horizontal"
        style={{ display: 'block', marginBottom: '2rem' }}
      />

      {/* Your content */}
      <div className="news-grid">
        {/* News articles */}
      </div>

      {/* In-content Ad */}
      <AdSense 
        adSlot="YOUR_AD_SLOT_ID_HERE"
        adFormat="rectangle"
      />
    </div>
  );
}
```

#### Example: Sidebar Ad

```tsx
<div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
  {/* Main content */}
  <div>
    {/* Your articles */}
  </div>

  {/* Sidebar with Ad */}
  <aside>
    <AdSense 
      adSlot="YOUR_AD_SLOT_ID_HERE"
      adFormat="vertical"
      style={{ position: 'sticky', top: '100px' }}
    />
  </aside>
</div>
```

## 📍 Recommended Ad Placements

### Homepage (`src/app/page.tsx`)
- ✅ **Top banner** - Above news grid
- ✅ **Between articles** - After every 3-4 articles
- ✅ **Sidebar** - Sticky ad on right side

### Live Page (`src/app/live/page.tsx`)
- ✅ **Below live scores** - After match details
- ✅ **Sidebar** - Next to live commentary (when you add it back)

### Archive Page (`src/app/archive/page.tsx`)
- ✅ **Top banner** - Above archive list
- ✅ **Between items** - Every 5-6 archived articles

## 🎯 Best Practices

### 1. **Don't Overdo It**
- Maximum 3 ads per page
- Don't place ads too close together
- Maintain good user experience

### 2. **Strategic Placement**
- Above the fold (visible without scrolling)
- Between content sections
- Sidebar (sticky for longer engagement)

### 3. **Responsive Ads**
- Use `adFormat="auto"` for responsive sizing
- Set `fullWidthResponsive={true}`

### 4. **Ad Sizes That Perform Best**
- **300x250** - Medium Rectangle (highest CTR)
- **728x90** - Leaderboard (good for headers)
- **300x600** - Half Page (great for sidebars)
- **Responsive** - Adapts to screen size

## 🚀 Deploy to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Import your GitHub repository
3. Add environment variable:
   - **Name**: `NEXT_PUBLIC_ADSENSE_CLIENT_ID`
   - **Value**: `ca-pub-XXXXXXXXXXXXXXXX`
4. Deploy!

## ⚠️ Important Notes

### AdSense Policies
- ✅ **DO**: Place ads in natural reading flow
- ✅ **DO**: Label ads clearly (AdSense does this automatically)
- ❌ **DON'T**: Click your own ads
- ❌ **DON'T**: Ask users to click ads
- ❌ **DON'T**: Place ads on error pages

### Testing
- Ads won't show in development mode
- Use **AdSense test mode** for testing
- Real ads appear only after site is approved

## 💰 Expected Revenue

With your cricket news site:

| Daily Visitors | Estimated Monthly Revenue |
|----------------|---------------------------|
| 1,000 | $30 - $100 |
| 5,000 | $150 - $500 |
| 10,000 | $300 - $1,000 |
| 50,000 | $1,500 - $5,000 |

*Actual revenue depends on:*
- Traffic quality
- Geographic location of visitors
- Ad placement
- Click-through rate (CTR)
- Cost per click (CPC)

## 📊 Monitoring Performance

1. Check **AdSense Dashboard** daily
2. Monitor:
   - Page RPM (Revenue per 1000 impressions)
   - CTR (Click-through rate)
   - CPC (Cost per click)
3. Optimize ad placements based on performance

## 🔧 Troubleshooting

### Ads Not Showing?
1. Check if `NEXT_PUBLIC_ADSENSE_CLIENT_ID` is set correctly
2. Verify site is approved in AdSense
3. Wait 24-48 hours after adding code
4. Check browser console for errors

### Low Revenue?
1. Increase traffic (SEO, social media)
2. Improve ad placement
3. Try different ad sizes
4. Target high-CPC keywords

## 📝 Next Steps

1. ✅ Get your AdSense Client ID
2. ✅ Add to `.env.local`
3. ✅ Create ad units in AdSense dashboard
4. ✅ Add `<AdSense />` components to your pages
5. ✅ Deploy to Vercel with environment variable
6. ✅ Wait for AdSense approval (if not approved yet)
7. ✅ Monitor and optimize!

---

**Need help?** Check the AdSense component at `src/components/AdSense.tsx`
