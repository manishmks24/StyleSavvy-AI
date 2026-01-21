# Python Backend for StyleSavvy AI

This backend service provides color matching recommendations using a KNN (K-Nearest Neighbors) algorithm trained on the Kaggle fashion dataset.

## Features

- **Data Loading**: Loads the Kaggle dataset with caching for performance
- **KNN Color Matching**: Trains a KNN model to predict outfit colors based on skin tone
- **RESTful API**: Flask server providing endpoints for the Next.js frontend
- **Color Theory Fallback**: Uses color theory recommendations when dataset is unavailable

## Setup

### Prerequisites

- Python 3.8 or higher
- pip package manager

### Installation

1. Install dependencies:
```bash
pip install -r requirements.txt
```

2. Set up Kaggle credentials (if not already configured):
   - Go to https://www.kaggle.com/settings
   - Create a new API token
   - Save the `kaggle.json` file to `~/.kaggle/kaggle.json`

### Running the Server

```bash
python app.py
```

The server will start on `http://localhost:5000`

## API Endpoints

### 1. Health Check
```
GET /health
```

**Response:**
```json
{
  "status": "healthy",
  "model_loaded": true
}
```

### 2. Get Color Recommendations
```
POST /api/color-recommendations
```

**Request Body:**
```json
{
  "skinTone": "medium",
  "bodyType": "hourglass",
  "gender": "female",
  "occasion": "casual"
}
```

**Response:**
```json
{
  "shirts": ["Emerald Green", "Ruby Red", "Royal Blue", "Mustard Yellow", "Teal"],
  "pants": ["Black", "Dark Denim", "Burgundy", "Forest Green", "Chocolate Brown"],
  "colors_to_avoid": ["Pale Pastels", "Washed Out Colors"],
  "color_palette": {
    "primary": "#CD853F",
    "secondary": "#2E8B57",
    "accent": "#DC143C"
  },
  "skin_tone": "medium"
}
```

### 3. Predict Outfit Colors (KNN-based)
```
POST /api/predict-outfit-colors
```

**Request Body:**
```json
{
  "skinRgb": [224, 172, 105]
}
```

**Response:**
```json
{
  "skin_tone": [224, 172, 105],
  "shirt_neighbors": [...],
  "pants_neighbors": [...]
}
```

### 4. Get Dataset Info
```
GET /api/dataset-info
```

**Response:**
```json
{
  "columns": [...],
  "shape": [rows, cols],
  "sample": [...],
  "description": {...}
}
```

## Dataset

The backend uses the "Profile of Body Metrics and Fashion Colors" dataset from Kaggle:
- **Source**: rulanugrh/profile-of-body-metrics-and-fashion-colors
- **Content**: Height, weight, skin color, and clothing colors (RGB values)
- **Purpose**: Training KNN classifier for skin-to-outfit color matching

The dataset is automatically downloaded and cached on first run.

## Architecture

```
backend/
├── app.py              # Flask API server
├── data_loader.py      # Kaggle dataset loader with caching
├── color_matcher.py    # KNN color matching algorithm
├── requirements.txt    # Python dependencies
├── cache/             # Dataset cache directory
└── models/            # Trained model storage
```

## Integration with Next.js

The Next.js frontend can call these endpoints to enhance outfit recommendations:

```typescript
// Example usage in Next.js
const response = await fetch('http://localhost:5000/api/color-recommendations', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    skinTone: 'medium',
    bodyType: 'hourglass',
    gender: 'female',
  }),
});

const recommendations = await response.json();
```

## Development

### Testing the Data Loader
```bash
python data_loader.py
```

### Testing the Color Matcher
```bash
python color_matcher.py
```

### Running in Production

For production deployment, use a production WSGI server like Gunicorn:

```bash
pip install gunicorn
gunicorn -w 4 -b 0.0.0.0:5000 app:app
```

## Troubleshooting

### Dataset Loading Issues
- Ensure Kaggle credentials are properly configured
- Check internet connection
- Verify dataset name: `rulanugrh/profile-of-body-metrics-and-fashion-colors`

### Model Training Issues
- The model will fall back to color theory if training fails
- Check dataset structure matches expected format
- Review logs for specific error messages

### CORS Issues
- The server includes CORS support for Next.js
- Default allows all origins in development
- Update CORS settings for production

## License

This project uses the Kaggle dataset under its respective license.
