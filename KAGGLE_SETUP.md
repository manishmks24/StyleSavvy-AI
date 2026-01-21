# StyleSavvy AI with KNN Color Matching

This guide explains how to integrate the Kaggle dataset for data-driven outfit color recommendations.

## 🎨 What's New?

Your StyleSavvy AI app now includes:

1. **KNN-based Color Matching**: Uses a K-Nearest Neighbors algorithm trained on real fashion data
2. **Kaggle Dataset Integration**: Analyzes body metrics and fashion colors from Asian skin tones
3. **Python Backend**: Flask API serving color recommendations
4. **Enhanced AI Recommendations**: Your Genkit AI now receives data-driven color suggestions

## 📁 Project Structure

```
StyleSavvy-AI/
├── backend/                          # Python backend (NEW)
│   ├── app.py                       # Flask API server
│   ├── data_loader.py               # Kaggle dataset loader
│   ├── color_matcher.py             # KNN color matching algorithm
│   ├── requirements.txt             # Python dependencies
│   ├── cache/                       # Dataset cache
│   └── models/                      # Trained KNN models
├── src/
│   ├── ai/flows/                    # AI recommendation flows
│   │   └── generate-outfit-recommendations.ts  # Enhanced with color data
│   ├── lib/
│   │   └── color-api.ts             # Color API client (NEW)
│   └── components/
│       └── user-profile-form.tsx    # User profile form
└── package.json
```

## 🚀 Setup Instructions

### Step 1: Set Up Python Backend

1. **Navigate to the backend directory:**
   ```bash
   cd backend
   ```

2. **Create a Python virtual environment (recommended):**
   ```bash
   python -m venv venv
   
   # Activate it:
   # Windows:
   venv\Scripts\activate
   # macOS/Linux:
   source venv/bin/activate
   ```

3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Set up Kaggle credentials:**
   - Go to https://www.kaggle.com/settings
   - Click "Create New API Token"
   - Download `kaggle.json`
   - Place it in `~/.kaggle/kaggle.json` (or `C:\Users\<YourUsername>\.kaggle\kaggle.json` on Windows)

5. **Start the backend server:**
   ```bash
   python app.py
   
   ```

   The server will:
   - Start on http://localhost:5000
   - Download the Kaggle dataset on first run
   - Train the KNN model (or load from cache)
   - Be ready to serve color recommendations!

### Step 2: Configure Next.js Frontend

1. **Add environment variable (optional):**
   
   Create a `.env.local` file in the root directory:
   ```bash
   NEXT_PUBLIC_COLOR_API_URL=http://localhost:5000
   ```

2. **The integration is already done!** Your AI flow now automatically:
   - Checks if the Python backend is available
   - Gets color recommendations based on skin tone
   - Falls back to color theory if backend is unavailable
   - Enhances the AI prompt with data-driven suggestions

### Step 3: Run the Application

1. **In one terminal, run the Python backend:**
   ```bash
   cd backend
   python app.py
   ```

2. **In another terminal, run Next.js:**
   ```bash
   npm run dev
   ```

3. **Visit http://localhost:9002** and try it out!

## 🎯 How It Works

### Data Flow:

```
User fills form → Next.js collects data → 
→ Backend analyzes skin tone with KNN → 
→ Returns color recommendations → 
→ AI generates outfits using color data → 
→ User gets personalized recommendations!
```

### Example:

When a user selects "Medium" skin tone:

1. **Backend API receives:** `{ skinTone: "medium" }`
2. **KNN algorithm predicts:** Best shirt/pants colors from dataset
3. **AI receives enhanced prompt:**
   ```
   Skin Tone: Medium
   
   Recommended Shirt Colors: Emerald Green, Ruby Red, Royal Blue, Mustard Yellow, Teal
   Recommended Pants Colors: Black, Dark Denim, Burgundy, Forest Green, Chocolate Brown
   Colors to Avoid: Pale Pastels, Washed Out Colors
   
   Generate outfit recommendations...
   ```
4. **Result:** More accurate, data-driven outfit suggestions!

## 📊 Dataset Information

**Source:** [Kaggle - Profile of Body Metrics and Fashion Colors](https://www.kaggle.com/datasets/rulanugrh/profile-of-body-metrics-and-fashion-colors)

**Contents:**
- Height and weight measurements
- Skin color (RGB values - Asian continent representation)
- Shirt/clothes colors (RGB values)
- Pants/trouser colors (RGB values)

**Purpose:**
- Training KNN algorithm for color matching
- Evidence-based color recommendations
- Skin tone to outfit color mapping

## 🔧 Testing the Backend

### Test the data loader:
```bash
cd backend
python data_loader.py
```

### Test the color matcher:
```bash
cd backend
python color_matcher.py
```

### Test the API:
```bash
# Health check
curl http://localhost:5000/health

# Get color recommendations
curl -X POST http://localhost:5000/api/color-recommendations \
  -H "Content-Type: application/json" \
  -d '{"skinTone": "medium"}'
```

## 🎨 API Endpoints

### 1. Health Check
- **URL:** `GET /health`
- **Response:** `{ "status": "healthy", "model_loaded": true }`

### 2. Color Recommendations
- **URL:** `POST /api/color-recommendations`
- **Body:** `{ "skinTone": "medium", "bodyType": "hourglass", ... }`
- **Response:**
  ```json
  {
    "shirts": ["Emerald Green", "Ruby Red", ...],
    "pants": ["Black", "Dark Denim", ...],
    "colors_to_avoid": ["Pale Pastels", ...],
    "color_palette": {
      "primary": "#CD853F",
      "secondary": "#2E8B57",
      "accent": "#DC143C"
    }
  }
  ```

### 3. Predict Outfit Colors (KNN)
- **URL:** `POST /api/predict-outfit-colors`
- **Body:** `{ "skinRgb": [224, 172, 105] }`
- **Response:** KNN predictions with nearest neighbors

### 4. Dataset Info
- **URL:** `GET /api/dataset-info`
- **Response:** Dataset metadata and sample data

## 🔄 Fallback Mechanism

The system is designed to work even if the Python backend is unavailable:

1. **Backend Running:** Uses KNN predictions + color theory
2. **Backend Down:** Uses built-in color theory recommendations
3. **Seamless Experience:** User never knows the difference!

## 🚀 Next Steps

### Enhance the System:

1. **Add more features to KNN:**
   - Body type matching
   - Weather-based recommendations
   - Occasion-specific colors

2. **Visualize recommendations:**
   - Show color swatches in UI
   - Display RGB values
   - Create color palette previews

3. **Expand dataset:**
   - Include more skin tone variations
   - Add seasonal color analysis
   - Incorporate fashion trends

4. **Deploy backend:**
   - Use Docker for easy deployment
   - Deploy to Railway/Render/Heroku
   - Add caching layer for performance

## 🐛 Troubleshooting

### Backend won't start:
- Check Python version (3.8+)
- Verify all dependencies installed
- Check Kaggle credentials

### Dataset won't download:
- Verify Kaggle API credentials
- Check internet connection
- Try manual download and place in `backend/cache/`

### Frontend can't connect:
- Verify backend is running on port 5000
- Check CORS settings
- Verify `NEXT_PUBLIC_COLOR_API_URL` environment variable

### Model training fails:
- System will fallback to color theory
- Check dataset format
- Review backend logs for errors

## 📝 Notes

- First run may take longer due to dataset download
- Model training happens once and is cached
- Color recommendations work offline with fallback
- No changes needed to existing user flow!

## 🎉 Success!

Your StyleSavvy AI now uses real fashion data to provide scientifically-backed color recommendations! The KNN algorithm learns from actual body metrics and fashion color combinations to suggest the perfect outfit colors for each user's skin tone.

Happy styling! 👗✨
