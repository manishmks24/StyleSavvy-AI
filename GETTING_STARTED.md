# 🚀 Getting Started with StyleSavvy AI Color Matching

**New to this? Start here!**

## ⏱️ 5-Minute Quick Start

### Step 1: Install Python Dependencies (2 min)
```bash
cd backend
pip install -r requirements.txt
```

### Step 2: Set Up Kaggle (1 min)
1. Go to https://www.kaggle.com/settings
2. Click "Create New API Token"
3. Download `kaggle.json`
4. Save to: `C:\Users\<Your Username>\.kaggle\kaggle.json`

### Step 3: Run Setup Wizard (1 min)
```bash
python quickstart.py
```
Follow the prompts!

### Step 4: Start the Servers (1 min)

**Terminal 1:**
```bash
cd backend
python app.py
```

**Terminal 2:**
```bash
npm run dev
```

### Step 5: Test It! (30 sec)
1. Open http://localhost:9002
2. Fill in the profile form
3. Select your skin tone
4. Get personalized outfit recommendations! 🎉

## ✅ Verify Everything Works

Visit http://localhost:5000/health

Should see:
```json
{
  "status": "healthy",
  "model_loaded": true
}
```

## 🎯 What You'll See

1. **Color Analysis:** Your skin tone is analyzed
2. **Recommendations:** Get scientifically-matched colors
3. **AI Outfits:** See personalized outfit suggestions
4. **Color Palette:** Beautiful visual color swatches

## 📚 Need More Help?

**For detailed setup:**
→ Read `KAGGLE_SETUP.md`

**For code examples:**
→ Read `QUICK_REFERENCE.md`

**For troubleshooting:**
→ Run `python backend/check_install.py`

**To understand what was built:**
→ Read `START_HERE.md`

## 🐛 Quick Troubleshooting

### Backend won't start?
```bash
cd backend
python check_install.py
```

### "Module not found"?
```bash
pip install -r requirements.txt
```

### "Kaggle credentials not found"?
Place `kaggle.json` in `C:\Users\<You>\.kaggle\`

### Frontend can't connect?
Make sure backend is running on port 5000

## 🎨 What's Different?

Your app now uses **real fashion data** to recommend colors!

**Before:**
"Try wearing blue or green"

**After:**
"Based on your medium skin tone, wear Emerald Green (proven to complement your complexion) with Dark Denim pants (optimal contrast ratio)"

## 💡 Pro Tip

The system works even if the backend is offline! It falls back to color theory recommendations.

## 🎉 That's It!

You're ready to go! Your app now has ML-powered color matching.

**Questions? Check the other docs!**

---

**Time to first outfit: < 5 minutes** ⚡
