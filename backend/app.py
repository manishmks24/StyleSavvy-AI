"""
Flask API Server for Color Matching Service
This provides RESTful endpoints for the Next.js frontend to get color recommendations
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
from data_loader import FashionDataLoader
from color_matcher import ColorMatcher
import traceback

app = Flask(__name__)
CORS(app)  # Enable CORS for Next.js frontend

# Initialize the color matcher
color_matcher = ColorMatcher(n_neighbors=5)
data_loader = FashionDataLoader()

# Global flag to track if model is initialized
model_loaded = False


def initialize_model():
    """Initialize or load the color matching model"""
    global model_loaded, color_matcher
    
    try:
        # Try to load existing model
        color_matcher.load_model()
        model_loaded = True
        print("Model loaded successfully from cache")
    except FileNotFoundError:
        print("No cached model found. Training new model...")
        try:
            # Load dataset and train
            df = data_loader.load_dataset()
            color_matcher.train(df)
            color_matcher.save_model()
            model_loaded = True
            print("Model trained and saved successfully")
        except Exception as e:
            print(f"Error training model: {e}")
            print("Will use color theory fallback")
            model_loaded = False


@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'model_loaded': model_loaded
    })


@app.route('/api/color-recommendations', methods=['POST'])
def get_color_recommendations():
    """
    Get color recommendations based on user profile
    
    Request body:
    {
        "skinTone": "medium",  // fair, light, medium, tan, dark
        "bodyType": "hourglass",  // optional
        "gender": "female",  // optional
        "occasion": "casual"  // optional
    }
    
    Returns:
    {
        "shirts": ["color1", "color2", ...],
        "pants": ["color1", "color2", ...],
        "colors_to_avoid": ["color1", "color2", ...],
        "color_palette": {
            "primary": "#hex",
            "secondary": "#hex",
            "accent": "#hex"
        }
    }
    """
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({'error': 'No data provided'}), 400
        
        skin_tone = data.get('skinTone', 'medium')
        
        # Get recommendations
        recommendations = color_matcher.get_color_recommendations(skin_tone)
        
        # Add color palette
        color_palettes = {
            'fair': {
                'primary': '#FFE4C4',  # Bisque
                'secondary': '#B0C4DE',  # Light Steel Blue
                'accent': '#FFB6C1',  # Light Pink
            },
            'light': {
                'primary': '#F5DEB3',  # Wheat
                'secondary': '#40E0D0',  # Turquoise
                'accent': '#FFB347',  # Pastel Orange
            },
            'medium': {
                'primary': '#CD853F',  # Peru
                'secondary': '#2E8B57',  # Sea Green
                'accent': '#DC143C',  # Crimson
            },
            'tan': {
                'primary': '#8B4513',  # Saddle Brown
                'secondary': '#4169E1',  # Royal Blue
                'accent': '#FF4500',  # Orange Red
            },
            'dark': {
                'primary': '#654321',  # Dark Brown
                'secondary': '#00FFFF',  # Cyan
                'accent': '#FFD700',  # Gold
            },
        }
        
        recommendations['color_palette'] = color_palettes.get(skin_tone.lower(), color_palettes['medium'])
        recommendations['skin_tone'] = skin_tone
        
        return jsonify(recommendations)
        
    except Exception as e:
        traceback.print_exc()
        return jsonify({'error': str(e)}), 500


@app.route('/api/dataset-info', methods=['GET'])
def get_dataset_info():
    """Get information about the loaded dataset"""
    try:
        if data_loader.df is None:
            data_loader.load_dataset()
        
        info = data_loader.get_dataset_info()
        return jsonify(info)
        
    except Exception as e:
        traceback.print_exc()
        return jsonify({'error': str(e)}), 500


@app.route('/api/predict-outfit-colors', methods=['POST'])
def predict_outfit_colors():
    """
    Predict outfit colors using KNN model
    
    Request body:
    {
        "skinRgb": [r, g, b]  // RGB values of skin tone
    }
    
    Returns:
    {
        "skin_tone": [r, g, b],
        "recommended_outfits": [...]
    }
    """
    try:
        data = request.get_json()
        
        if not data or 'skinRgb' not in data:
            return jsonify({'error': 'skinRgb is required'}), 400
        
        skin_rgb = tuple(data['skinRgb'])
        
        if model_loaded:
            result = color_matcher.predict_colors(skin_rgb)
        else:
            # Fallback to color theory
            # Convert RGB to approximate skin tone category
            avg_value = sum(skin_rgb) / 3
            if avg_value > 220:
                tone = 'fair'
            elif avg_value > 200:
                tone = 'light'
            elif avg_value > 160:
                tone = 'medium'
            elif avg_value > 120:
                tone = 'tan'
            else:
                tone = 'dark'
            
            result = color_matcher.get_color_recommendations(tone)
            result['skin_tone'] = skin_rgb
        
        return jsonify(result)
        
    except Exception as e:
        traceback.print_exc()
        return jsonify({'error': str(e)}), 500


if __name__ == '__main__':
    print("Starting Color Matching API Server...")
    initialize_model()
    app.run(debug=True, host='0.0.0.0', port=5000)
