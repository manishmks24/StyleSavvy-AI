"""
Data Loader Module for Kaggle Fashion Dataset
This module handles loading the dataset from Kaggle using kagglehub
"""

import kagglehub
from kagglehub import KaggleDatasetAdapter
import pandas as pd
import os
import pickle

class FashionDataLoader:
    def __init__(self, cache_dir="./cache"):
        """
        Initialize the data loader
        
        Args:
            cache_dir: Directory to cache the loaded dataset
        """
        self.cache_dir = cache_dir
        self.df = None
        self.dataset_name = "rulanugrh/profile-of-body-metrics-and-fashion-colors"
        os.makedirs(cache_dir, exist_ok=True)
        
    def load_dataset(self, force_reload=False):
        """
        Load the dataset from Kaggle or cache
        
        Args:
            force_reload: If True, force reload from Kaggle even if cache exists
            
        Returns:
            pandas.DataFrame: The loaded dataset
        """
        cache_file = os.path.join(self.cache_dir, "fashion_dataset.pkl")
        
        # Try to load from cache first
        if not force_reload and os.path.exists(cache_file):
            print("Loading dataset from cache...")
            with open(cache_file, 'rb') as f:
                self.df = pickle.load(f)
            print(f"Loaded {len(self.df)} records from cache")
            return self.df
        
        # Load from Kaggle
        print("Loading dataset from Kaggle...")
        try:
            # Download the dataset first
            path = kagglehub.dataset_download(self.dataset_name)
            print(f"Dataset downloaded to: {path}")
            
            # Find the CSV file in the downloaded path
            csv_files = [f for f in os.listdir(path) if f.endswith('.csv')]
            
            if not csv_files:
                raise ValueError(f"No CSV files found in {path}")
            
            # Load the first CSV file with semicolon delimiter
            csv_path = os.path.join(path, csv_files[0])
            print(f"Loading CSV file: {csv_files[0]}")
            
            self.df = pd.read_csv(csv_path, delimiter=';')
            
            print(f"Successfully loaded {len(self.df)} records from Kaggle")
            
            # Cache the dataset
            with open(cache_file, 'wb') as f:
                pickle.dump(self.df, f)
            print(f"Dataset cached to {cache_file}")
            
            return self.df
            
        except Exception as e:
            print(f"Error loading dataset: {e}")
            raise
    
    def get_dataset_info(self):
        """
        Get information about the loaded dataset
        
        Returns:
            dict: Dataset information including columns, shape, and sample data
        """
        if self.df is None:
            raise ValueError("Dataset not loaded. Call load_dataset() first.")
        
        return {
            "columns": list(self.df.columns),
            "shape": self.df.shape,
            "dtypes": self.df.dtypes.to_dict(),
            "sample": self.df.head().to_dict('records'),
            "description": self.df.describe().to_dict()
        }
    
    def get_dataframe(self):
        """
        Get the loaded DataFrame
        
        Returns:
            pandas.DataFrame: The dataset
        """
        if self.df is None:
            raise ValueError("Dataset not loaded. Call load_dataset() first.")
        return self.df


if __name__ == "__main__":
    # Test the data loader
    loader = FashionDataLoader()
    df = loader.load_dataset()
    
    print("\n=== Dataset Information ===")
    info = loader.get_dataset_info()
    print(f"Columns: {info['columns']}")
    print(f"Shape: {info['shape']}")
    print(f"\nFirst 5 records:")
    print(df.head())
    print(f"\nData types:")
    print(df.dtypes)
