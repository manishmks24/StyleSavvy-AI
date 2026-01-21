# 🎨 Kaggle Dataset Integration - Quick Reference

## Quick Start (3 Steps)

```bash
# 1. Set up Python backend
cd backend
pip install -r requirements.txt
python quickstart.py

# 2. Start the backend
python app.py

# 3. Start Next.js (in new terminal)
cd ..
npm run dev
```

## Key Files Created

### Backend (Python)
- `backend/app.py` - Flask API server
- `backend/data_loader.py` - Kaggle dataset loader
- `backend/color_matcher.py` - KNN color matching
- `backend/requirements.txt` - Python dependencies
- `backend/quickstart.py` - Interactive setup script

### Frontend (TypeScript)
- `src/lib/color-api.ts` - API client for color service
- `src/components/color-recommendations-display.tsx` - UI component
- `src/ai/flows/generate-outfit-recommendations.ts` - Enhanced with color data

### Documentation
- `KAGGLE_SETUP.md` - Full setup guide
- `backend/README.md` - Backend API documentation

## Usage in Your App

### 1. Get Color Recommendations (TypeScript)
```typescript
import { getColorRecommendations } from '@/lib/color-api';

const recs = await getColorRecommendations({
  skinTone: 'medium',
  bodyType: 'hourglass',
  gender: 'female',
});

console.log(recs.shirts); // ['Emerald Green', 'Ruby Red', ...]
console.log(recs.pants);  // ['Black', 'Dark Denim', ...]
```

### 2. Display Color Recommendations (React)
```tsx
import { ColorRecommendationsDisplay } from '@/components/color-recommendations-display';

<ColorRecommendationsDisplay skinTone="medium" />
```

### 3. API Endpoints (Python Backend)

```bash
# Health check
GET http://localhost:5000/health

# Color recommendations
POST http://localhost:5000/api/color-recommendations
{
  "skinTone": "medium",
  "bodyType": "hourglass"
}

# KNN prediction
POST http://localhost:5000/api/predict-outfit-colors
{
  "skinRgb": [224, 172, 105]
}
```

## How It Works

```
User Input (Skin Tone)
    ↓
Python Backend (Flask API)
    ↓
KNN Algorithm (trained on Kaggle data)
    ↓
Color Recommendations
    ↓
Next.js Frontend
    ↓
Enhanced AI Prompt
    ↓
Personalized Outfit Recommendations
```

## Features

✅ **Data-Driven**: Uses real fashion data from Kaggle
✅ **KNN Algorithm**: Machine learning for color matching
✅ **Fallback Support**: Works even if backend is offline
✅ **Asian Skin Tones**: Specifically curated dataset
✅ **Automatic Integration**: AI uses color data automatically
✅ **Beautiful UI**: Visual color palette display

## Troubleshooting

**Backend won't start?**
```bash
# Check Python version
python --version  # Should be 3.8+

# Reinstall dependencies
pip install --upgrade -r requirements.txt
```

**Can't download dataset?**
- Set up Kaggle credentials: https://www.kaggle.com/settings
- Place `kaggle.json` in `~/.kaggle/`

**Frontend can't connect?**
- Ensure backend is running: `python app.py`
- Check port 5000 is available
- Verify CORS is enabled (it is by default)

## Environment Variables

```bash
# .env.local (optional)
NEXT_PUBLIC_COLOR_API_URL=http://localhost:5000
```

## Tech Stack

- **Backend**: Python, Flask, scikit-learn, kagglehub
- **ML Algorithm**: K-Nearest Neighbors (KNN)
- **Dataset**: Kaggle fashion colors and body metrics
- **Frontend**: Next.js, TypeScript, React
- **AI**: Google Genkit with enhanced prompts

## Next Level Features (Ideas)

- [ ] Add visual outfit mockups with recommended colors
- [ ] Seasonal color analysis
- [ ] Trend-based recommendations
- [ ] User feedback loop for ML improvement
- [ ] Color wheel visualization
- [ ] Export color palettes

## Support

- Full guide: `KAGGLE_SETUP.md`
- Backend docs: `backend/README.md`
- Test backend: `python backend/quickstart.py`

---

**Made with ❤️ for StyleSavvy AI**
