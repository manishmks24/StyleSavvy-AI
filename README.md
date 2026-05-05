# 👗 StyleSavvy AI

**AI-Powered Personal Fashion Stylist with Data-Driven Color Matching**

StyleSavvy AI uses advanced artificial intelligence and machine learning to provide personalized outfit recommendations based on your unique features, preferences, and style goals.

## ✨ Features

### 🎨 **KNN-Based Color Matching** (NEW!)
- Machine learning algorithm trained on real fashion data
- Kaggle dataset with Asian skin tone representations
- Scientific color recommendations based on your skin tone
- Real-time color palette generation

### 🤖 **AI-Powered Recommendations**
- Powered by Google Genkit AI
- Personalized outfit suggestions
- Detailed style guides and explanations
- Considers body type, occasion, and weather

### 💎 **Beautiful User Experience**
- Modern, responsive UI with glassmorphism effects
- Interactive profile form
- Visual color palette displays
- Saved outfits gallery

### 🔬 **Data-Driven Insights**
- K-Nearest Neighbors algorithm for color matching
- Evidence-based fashion recommendations
- Color theory integration
- Fallback support for offline use

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- Python 3.8+ (for color matching backend)
- Kaggle account (for dataset access)

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd StyleSavvy-AI
   ```

2. **Install frontend dependencies**
   ```bash
   npm install
   ```

3. **Set up the Python backend**
   ```bash
   cd backend
   pip install -r requirements.txt
   python quickstart.py
   ```

4. **Configure Kaggle credentials**
   - Visit https://www.kaggle.com/settings
   - Create API token and download `kaggle.json`
   - Place in `~/.kaggle/kaggle.json`

5. **Start the application**
   
   Terminal 1 (Backend):
   ```bash
   cd backend
   python app.py
   ```
   
   Terminal 2 (Frontend):
   ```bash
   npm run dev
   ```

6. **Visit** http://localhost:9002

## 📚 Documentation

- [**Kaggle Setup Guide**](./KAGGLE_SETUP.md) - Complete setup instructions for the KNN color matching system
- [**Quick Reference**](./QUICK_REFERENCE.md) - Developer quick reference and code snippets
- [**Backend API Docs**](./backend/README.md) - Python backend API documentation

## 🏗️ Architecture

![System Architecture](./docs/architecture.png)

### Tech Stack

**Frontend:**
- Next.js 15 with App Router
- TypeScript
- Tailwind CSS
- Radix UI Components
- Google Genkit AI

**Backend:**
- Python Flask
- scikit-learn (KNN algorithm)
- kagglehub (dataset loading)
- pandas (data processing)

**Machine Learning:**
- K-Nearest Neighbors for color matching
- Trained on Kaggle fashion dataset
- Real-time predictions

## 🎯 How It Works

1. **User Input**: Provide your gender, body type, skin tone, and style preferences
2. **Color Analysis**: Python backend analyzes your skin tone using KNN algorithm
3. **AI Processing**: Genkit AI receives enhanced prompt with color recommendations
4. **Recommendations**: Get personalized outfit suggestions with scientific color matching
5. **Style Guide**: Detailed explanations of why each recommendation works for you

## 📊 Dataset

This project uses the [Profile of Body Metrics and Fashion Colors](https://www.kaggle.com/datasets/rulanugrh/profile-of-body-metrics-and-fashion-colors) dataset from Kaggle.

**Dataset Contents:**
- Body metrics (height, weight)
- Skin color RGB values (Asian continent focus)
- Shirt/clothing colors
- Pants/trouser colors

**Purpose:**
- Training KNN classifier
- Evidence-based color recommendations
- Skin tone to outfit color mapping

## 🛠️ Development

### Project Structure
```
StyleSavvy-AI/
├── backend/              # Python backend
│   ├── app.py           # Flask API server
│   ├── data_loader.py   # Dataset loader
│   ├── color_matcher.py # KNN color matching
│   └── quickstart.py    # Setup script
├── src/
│   ├── ai/              # AI flows and Genkit config
│   ├── app/             # Next.js pages
│   ├── components/      # React components
│   └── lib/             # Utilities and API clients
└── docs/                # Documentation
```

### Scripts

```bash
# Frontend
npm run dev          # Start dev server
npm run build        # Build for production
npm run lint         # Run ESLint

# Backend
python app.py        # Start API server
python quickstart.py # Interactive setup
```

## 🎨 Using the Color API

### Environment

Create `.env.local` (frontend) if you want to point to a non-default backend:

```
NEXT_PUBLIC_COLOR_API_URL=http://localhost:5000
```

Defaults to `http://localhost:5000` when unset.

### In TypeScript/React:
```typescript
import { getColorRecommendations } from '@/lib/color-api';

const recs = await getColorRecommendations({
  skinTone: 'medium',
  bodyType: 'hourglass',
});
```

### Display Component:
```tsx
import { ColorRecommendationsDisplay } from '@/components/color-recommendations-display';

<ColorRecommendationsDisplay skinTone="medium" />
```

## 🌟 Features Roadmap

- [ ] Visual outfit mockups
- [ ] Seasonal color analysis
- [ ] Trend-based recommendations  
- [ ] User feedback integration
- [ ] Mobile app version
- [ ] Social sharing features
- [ ] Virtual try-on

## 🤝 Contributing

Contributions are welcome! Please feel free to submit issues and pull requests.

## 📝 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Kaggle dataset by [rulanugrh](https://www.kaggle.com/rulanugrh)
- Google Genkit AI team
- Next.js and Vercel teams

## 📧 Contact

For questions or support, please open an issue on GitHub.

---

**Made with ❤️ using AI and Machine Learning**
