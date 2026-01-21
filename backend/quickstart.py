"""
Quick Start Script for StyleSavvy AI Color Matching Backend

This script provides a simple CLI to test the color matching system
"""

import sys
from data_loader import FashionDataLoader
from color_matcher import ColorMatcher


def print_header(text):
    """Print a formatted header"""
    print(f"\n{'=' * 60}")
    print(f"  {text}")
    print(f"{'=' * 60}\n")


def main():
    """Main function to run the quick start"""
    
    print_header("StyleSavvy AI - Color Matching Quick Start")
    
    # Step 1: Load Dataset
    print("Step 1: Loading Kaggle Dataset...")
    loader = FashionDataLoader()
    
    try:
        df = loader.load_dataset()
        print(f"✓ Successfully loaded dataset with {len(df)} records")
        print(f"✓ Columns: {', '.join(df.columns.tolist())}")
    except Exception as e:
        print(f"✗ Error loading dataset: {e}")
        print("\nMake sure you have:")
        print("1. Installed dependencies: pip install -r requirements.txt")
        print("2. Set up Kaggle credentials in ~/.kaggle/kaggle.json")
        return
    
    # Step 2: Initialize Color Matcher
    print_header("Step 2: Testing Color Recommendations")
    matcher = ColorMatcher(n_neighbors=5)
    
    # Test with different skin tones
    skin_tones = ['fair', 'light', 'medium', 'tan', 'dark']
    
    for tone in skin_tones:
        print(f"\n{tone.upper()} Skin Tone:")
        print("-" * 40)
        
        recs = matcher.get_color_recommendations(tone)
        
        print(f"👕 Recommended Shirts: {', '.join(recs['shirts'][:3])}")
        print(f"👖 Recommended Pants: {', '.join(recs['pants'][:3])}")
        print(f"❌ Avoid: {', '.join(recs['colors_to_avoid'])}")
    
    # Step 3: Train KNN Model (Optional)
    print_header("Step 3: Training KNN Model (Optional)")
    print("Do you want to train the KNN model on the dataset?")
    print("This will take a moment but enables ML-based predictions.")
    
    response = input("Train model? (y/n): ").strip().lower()
    
    if response == 'y':
        try:
            print("\nTraining KNN model...")
            matcher.train(df)
            print("✓ Model trained successfully!")
            
            # Save the model
            matcher.save_model()
            print("✓ Model saved to ./models/color_matcher.pkl")
            
            # Test a prediction
            print("\nTesting model prediction...")
            test_skin = (224, 172, 105)  # Medium Asian skin tone
            result = matcher.predict_colors(test_skin)
            print(f"✓ Prediction successful for RGB {test_skin}")
            
        except Exception as e:
            print(f"✗ Error training model: {e}")
            print("The system will use color theory fallback instead.")
    else:
        print("Skipping model training. Color theory recommendations will be used.")
    
    # Step 4: Next Steps
    print_header("Next Steps")
    print("✓ Backend is ready!")
    print("\nTo start the API server, run:")
    print("  python app.py")
    print("\nThe server will be available at: http://localhost:5000")
    print("\nAPI Endpoints:")
    print("  GET  /health")
    print("  POST /api/color-recommendations")
    print("  POST /api/predict-outfit-colors")
    print("  GET  /api/dataset-info")
    print("\nSee KAGGLE_SETUP.md for full documentation!")
    
    print_header("Setup Complete! 🎉")


if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\n\nSetup cancelled by user.")
        sys.exit(0)
    except Exception as e:
        print(f"\n\nUnexpected error: {e}")
        sys.exit(1)
