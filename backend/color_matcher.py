"""
KNN-based Color Matching Module
This module implements a KNN classifier to recommend outfit colors based on skin tone
"""

import numpy as np
import pandas as pd
from sklearn.neighbors import KNeighborsClassifier
from sklearn.preprocessing import StandardScaler
from typing import Dict, List, Tuple
import pickle
import os


class ColorMatcher:
    def __init__(self, n_neighbors=5):
        """
        Initialize the Color Matcher with KNN
        
        Args:
            n_neighbors: Number of neighbors for KNN algorithm
        """
        self.n_neighbors = n_neighbors
        self.shirt_model = None
        self.pants_model = None
        self.scaler_skin = None
        self.scaler_shirt = None
        self.scaler_pants = None
        self.is_trained = False
        
    def prepare_features(self, df):
        """
        Prepare features from the dataset
        
        Args:
            df: DataFrame containing the fashion dataset
            
        Returns:
            Tuple of (skin_colors, shirt_colors, pants_colors)
        """
        # Extract RGB values for skin, shirt, and pants
        # Assuming the dataset has columns like:
        # skin_r, skin_g, skin_b, shirt_r, shirt_g, shirt_b, pants_r, pants_g, pants_b
        
        # Detect column names (they might have different formats)
        skin_cols = [col for col in df.columns if 'skin' in col.lower() and any(c in col.lower() for c in ['r', 'g', 'b'])]
        shirt_cols = [col for col in df.columns if 'shirt' in col.lower() or 'cloth' in col.lower()]
        pants_cols = [col for col in df.columns if 'pants' in col.lower() or 'trouser' in col.lower()]
        
        # If specific RGB columns not found, try alternative naming
        if not skin_cols:
            skin_cols = [col for col in df.columns if 'skin' in col.lower()]
        if not shirt_cols:
            shirt_cols = [col for col in df.columns if 'top' in col.lower()]
        if not pants_cols:
            pants_cols = [col for col in df.columns if 'bottom' in col.lower()]
        
        print(f"Detected columns - Skin: {skin_cols}, Shirt: {shirt_cols}, Pants: {pants_cols}")
        
        # For now, let's assume the dataset has standard RGB columns
        # We'll need to adapt based on actual column names
        return df, skin_cols, shirt_cols, pants_cols
    
    def train(self, df):
        """
        Train the KNN models on the dataset
        
        Args:
            df: DataFrame containing the fashion dataset
        """
        print("Training color matching models...")
        
        # Prepare features
        processed_df, skin_cols, shirt_cols, pants_cols = self.prepare_features(df)
        
        # Extract feature columns based on dataset structure
        # This is a generic approach - may need adjustment based on actual data
        columns = df.columns.tolist()
        print(f"Available columns: {columns}")
        
        # Try to identify skin color columns (assuming RGB format)
        skin_features = []
        for col in columns:
            if 'skin' in col.lower():
                skin_features.append(col)
        
        if not skin_features:
            # Fallback: assume first 3 numeric columns are skin RGB
            numeric_cols = df.select_dtypes(include=[np.number]).columns
            skin_features = numeric_cols[:3].tolist() if len(numeric_cols) >= 3 else []
        
        if len(skin_features) < 3:
            raise ValueError("Could not identify skin color features in dataset")
        
        # Prepare training data
        X_skin = df[skin_features].values
        
        # For shirt and pants, we'll use the corresponding color columns
        # This assumes the dataset has clear shirt/pants color columns
        shirt_features = [col for col in columns if 'shirt' in col.lower() or 'cloth' in col.lower()]
        pants_features = [col for col in columns if 'pants' in col.lower() or 'trouser' in col.lower()]
        
        if not shirt_features:
            # Try to find next set of RGB values
            remaining_cols = [col for col in columns if col not in skin_features]
            numeric_remaining = df[remaining_cols].select_dtypes(include=[np.number]).columns
            shirt_features = numeric_remaining[:3].tolist() if len(numeric_remaining) >= 3 else []
        
        if not pants_features:
            # Try to find third set of RGB values
            used_cols = skin_features + shirt_features
            remaining_cols = [col for col in columns if col not in used_cols]
            numeric_remaining = df[remaining_cols].select_dtypes(include=[np.number]).columns
            pants_features = numeric_remaining[:3].tolist() if len(numeric_remaining) >= 3 else []
        
        print(f"Using features - Skin: {skin_features}, Shirt: {shirt_features}, Pants: {pants_features}")
        
        # Scale the features
        self.scaler_skin = StandardScaler()
        X_skin_scaled = self.scaler_skin.fit_transform(X_skin)
        
        # Train shirt color model
        if shirt_features and len(shirt_features) >= 3:
            y_shirt = df[shirt_features].values
            self.shirt_model = KNeighborsClassifier(n_neighbors=self.n_neighbors)
            self.shirt_model.fit(X_skin_scaled, y_shirt[:,0])  # Using first component as target
            print(f"Shirt model trained with {len(df)} samples")
        
        # Train pants color model
        if pants_features and len(pants_features) >= 3:
            y_pants = df[pants_features].values
            self.pants_model = KNeighborsClassifier(n_neighbors=self.n_neighbors)
            self.pants_model.fit(X_skin_scaled, y_pants[:,0])  # Using first component as target
            print(f"Pants model trained with {len(df)} samples")
        
        self.is_trained = True
        self.skin_features = skin_features
        self.shirt_features = shirt_features
        self.pants_features = pants_features
        
        print("Training complete!")
    
    def predict_colors(self, skin_rgb: Tuple[int, int, int]) -> Dict[str, List[int]]:
        """
        Predict matching shirt and pants colors based on skin tone
        
        Args:
            skin_rgb: Tuple of (R, G, B) values for skin tone
            
        Returns:
            Dict containing recommended shirt and pants RGB values
        """
        if not self.is_trained:
            raise ValueError("Model not trained. Call train() first.")
        
        # Prepare input
        skin_features = np.array([skin_rgb]).reshape(1, -1)
        skin_scaled = self.scaler_skin.transform(skin_features)
        
        # Get nearest neighbors
        if self.shirt_model:
            shirt_neighbors = self.shirt_model.kneighbors(skin_scaled, return_distance=False)[0]
        else:
            shirt_neighbors = []
        
        if self.pants_model:
            pants_neighbors = self.pants_model.kneighbors(skin_scaled, return_distance=False)[0]
        else:
            pants_neighbors = []
        
        return {
            "skin_tone": list(skin_rgb),
            "shirt_neighbors": shirt_neighbors.tolist() if len(shirt_neighbors) > 0 else [],
            "pants_neighbors": pants_neighbors.tolist() if len(pants_neighbors) > 0 else [],
        }
    
    def get_color_recommendations(self, skin_tone: str) -> Dict[str, any]:
        """
        Get color recommendations based on skin tone description
        
        Args:
            skin_tone: Skin tone description (e.g., 'fair', 'medium', 'dark')
            
        Returns:
            Dict containing color recommendations
        """
        # Map skin tone descriptions to approximate RGB values (Asian skin tones)
        skin_tone_map = {
            'fair': (255, 224, 196),      # Light peachy
            'light': (241, 194, 155),      # Light tan
            'medium': (224, 172, 105),     # Medium tan
            'tan': (198, 134, 66),         # Tan
            'dark': (141, 85, 36),         # Deep tan
        }
        
        skin_rgb = skin_tone_map.get(skin_tone.lower(), (224, 172, 105))  # Default to medium
        
        # For now, return color recommendations based on color theory
        # This will be enhanced with actual KNN predictions when we have the dataset
        recommendations = {
            'fair': {
                'shirts': ['Pastel Pink', 'Light Blue', 'Cream', 'Soft Coral', 'Mint Green'],
                'pants': ['Navy Blue', 'Khaki', 'Light Gray', 'White', 'Beige'],
                'colors_to_avoid': ['Pure White', 'Neon Colors'],
            },
            'light': {
                'shirts': ['Coral', 'Turquoise', 'Lavender', 'Peach', 'Sky Blue'],
                'pants': ['Olive Green', 'Camel', 'Dark Brown', 'Charcoal', 'Denim Blue'],
                'colors_to_avoid': ['Pale Yellow', 'Muted Browns'],
            },
            'medium': {
                'shirts': ['Emerald Green', 'Ruby Red', 'Royal Blue', 'Mustard Yellow', 'Teal'],
                'pants': ['Black', 'Dark Denim', 'Burgundy', 'Forest Green', 'Chocolate Brown'],
                'colors_to_avoid': ['Pale Pastels', 'Washed Out Colors'],
            },
            'tan': {
                'shirts': ['Rich Purple', 'Deep Orange', 'Cobalt Blue', 'Crimson', 'Bright Yellow'],
                'pants': ['Black', 'Espresso Brown', 'Navy', 'Deep Gray', 'Dark Green'],
                'colors_to_avoid': ['Brown', 'Tan', 'Dull Earth Tones'],
            },
            'dark': {
                'shirts': ['Bright White', 'Hot Pink', 'Electric Blue', 'Sunshine Yellow', 'Lime Green'],
                'pants': ['Black', 'White', 'Bright Red', 'Royal Purple', 'Deep Navy'],
                'colors_to_avoid': ['Dark Brown', 'Olive', 'Muddy Colors'],
            },
        }
        
        return recommendations.get(skin_tone.lower(), recommendations['medium'])
    
    def save_model(self, filepath="./models/color_matcher.pkl"):
        """
        Save the trained model to disk
        
        Args:
            filepath: Path to save the model
        """
        os.makedirs(os.path.dirname(filepath), exist_ok=True)
        
        model_data = {
            'shirt_model': self.shirt_model,
            'pants_model': self.pants_model,
            'scaler_skin': self.scaler_skin,
            'n_neighbors': self.n_neighbors,
            'is_trained': self.is_trained,
            'skin_features': self.skin_features if hasattr(self, 'skin_features') else None,
            'shirt_features': self.shirt_features if hasattr(self, 'shirt_features') else None,
            'pants_features': self.pants_features if hasattr(self, 'pants_features') else None,
        }
        
        with open(filepath, 'wb') as f:
            pickle.dump(model_data, f)
        
        print(f"Model saved to {filepath}")
    
    def load_model(self, filepath="./models/color_matcher.pkl"):
        """
        Load a trained model from disk
        
        Args:
            filepath: Path to load the model from
        """
        with open(filepath, 'rb') as f:
            model_data = pickle.load(f)
        
        self.shirt_model = model_data['shirt_model']
        self.pants_model = model_data['pants_model']
        self.scaler_skin = model_data['scaler_skin']
        self.n_neighbors = model_data['n_neighbors']
        self.is_trained = model_data['is_trained']
        self.skin_features = model_data.get('skin_features')
        self.shirt_features = model_data.get('shirt_features')
        self.pants_features = model_data.get('pants_features')
        
        print(f"Model loaded from {filepath}")


if __name__ == "__main__":
    # Test the color matcher
    from data_loader import FashionDataLoader
    
    loader = FashionDataLoader()
    df = loader.load_dataset()
    
    matcher = ColorMatcher(n_neighbors=5)
    
    try:
        matcher.train(df)
        
        # Test prediction
        test_skin = (224, 172, 105)  # Medium Asian skin tone
        result = matcher.predict_colors(test_skin)
        print(f"\nPrediction for skin tone {test_skin}:")
        print(result)
        
        # Save model
        matcher.save_model()
        
    except Exception as e:
        print(f"Error during training: {e}")
        print("Falling back to color theory recommendations...")
        
    # Test color recommendations
    for tone in ['fair', 'light', 'medium', 'tan', 'dark']:
        print(f"\n=== Recommendations for {tone} skin tone ===")
        recs = matcher.get_color_recommendations(tone)
        print(f"Recommended shirts: {', '.join(recs['shirts'])}")
        print(f"Recommended pants: {', '.join(recs['pants'])}")
        print(f"Colors to avoid: {', '.join(recs['colors_to_avoid'])}")
