import unittest
from unittest.mock import patch

from app import app, data_loader


class AppEndpointsTest(unittest.TestCase):
    def setUp(self):
        self.client = app.test_client()

    def test_health_returns_status_and_model_flag(self):
        response = self.client.get('/health')
        self.assertEqual(response.status_code, 200)
        data = response.get_json()
        self.assertEqual(data.get('status'), 'healthy')
        self.assertIn('model_loaded', data)
        self.assertIsInstance(data.get('model_loaded'), bool)

    def test_dataset_info_uses_loader_and_returns_payload(self):
        dummy_info = {'columns': ['a'], 'shape': [1, 1]}
        with patch.object(data_loader, 'load_dataset', return_value=None) as mock_load, \
             patch.object(data_loader, 'get_dataset_info', return_value=dummy_info) as mock_info:
            data_loader.df = None
            response = self.client.get('/api/dataset-info')

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.get_json(), dummy_info)
        mock_load.assert_called_once()
        mock_info.assert_called_once()

    def test_color_recommendations_returns_palette(self):
        response = self.client.post('/api/color-recommendations', json={'skinTone': 'medium'})
        self.assertEqual(response.status_code, 200)
        data = response.get_json()
        self.assertIn('shirts', data)
        self.assertIn('pants', data)
        self.assertIn('colors_to_avoid', data)
        self.assertIn('color_palette', data)


if __name__ == '__main__':
    unittest.main()
