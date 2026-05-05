/**
 * Color Recommendations API Client
 * 
 * This module provides functions to interact with the Python backend
 * color matching service
 */

export interface ColorRecommendations {
    shirts: string[];
    pants: string[];
    colors_to_avoid: string[];
    color_palette: {
        primary: string;
        secondary: string;
        accent: string;
    };
    skin_tone: string;
}

export interface ServiceHealth {
    healthy: boolean;
    modelLoaded: boolean;
}

export interface OutfitColorPrediction {
    skin_tone: number[];
    shirt_neighbors?: number[];
    pants_neighbors?: number[];
    shirts?: string[];
    pants?: string[];
}

export interface UserProfile {
    skinTone: string;
    bodyType?: string;
    gender?: string;
    occasion?: string;
    weather?: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_COLOR_API_URL || 'http://localhost:5000';

/**
 * Check if the color matching service is available
 */
export async function checkServiceHealth(): Promise<ServiceHealth> {
    try {
        const response = await fetch(`${API_BASE_URL}/health`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        });

        if (!response.ok) return { healthy: false, modelLoaded: false };

        const data = await response.json();
        return {
            healthy: data.status === 'healthy',
            modelLoaded: Boolean(data.model_loaded),
        };
    } catch (error) {
        console.error('Color service health check failed:', error);
        return { healthy: false, modelLoaded: false };
    }
}

/**
 * Get color recommendations based on user profile
 */
export async function getColorRecommendations(
    profile: UserProfile
): Promise<ColorRecommendations | null> {
    try {
        const response = await fetch(`${API_BASE_URL}/api/color-recommendations`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(profile),
        });

        if (!response.ok) {
            throw new Error(`API error: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Failed to get color recommendations:', error);
        return null;
    }
}

/**
 * Predict outfit colors using KNN model with RGB values
 */
export async function predictOutfitColors(
    skinRgb: [number, number, number]
): Promise<OutfitColorPrediction | null> {
    try {
        const response = await fetch(`${API_BASE_URL}/api/predict-outfit-colors`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ skinRgb }),
        });

        if (!response.ok) {
            throw new Error(`API error: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Failed to predict outfit colors:', error);
        return null;
    }
}

/**
 * Get dataset information
 */
export async function getDatasetInfo(): Promise<any> {
    try {
        const response = await fetch(`${API_BASE_URL}/api/dataset-info`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        });

        if (!response.ok) {
            throw new Error(`API error: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Failed to get dataset info:', error);
        return null;
    }
}

/**
 * Convert skin tone name to approximate RGB values
 */
export function skinToneToRgb(skinTone: string): [number, number, number] {
    const skinToneMap: Record<string, [number, number, number]> = {
        fair: [255, 224, 196],
        light: [241, 194, 155],
        medium: [224, 172, 105],
        tan: [198, 134, 66],
        dark: [141, 85, 36],
    };

    return skinToneMap[skinTone.toLowerCase()] || skinToneMap.medium;
}

/**
 * Get color palette as CSS variables
 */
export function getColorPaletteStyles(palette: ColorRecommendations['color_palette']): Record<string, string> {
    return {
        '--color-primary': palette.primary,
        '--color-secondary': palette.secondary,
        '--color-accent': palette.accent,
    };
}

/**
 * Fallback color recommendations (when service is unavailable)
 */
export function getFallbackColorRecommendations(skinTone: string): ColorRecommendations {
    const recommendations: Record<string, ColorRecommendations> = {
        fair: {
            shirts: ['Pastel Pink', 'Light Blue', 'Cream', 'Soft Coral', 'Mint Green'],
            pants: ['Navy Blue', 'Khaki', 'Light Gray', 'White', 'Beige'],
            colors_to_avoid: ['Pure White', 'Neon Colors'],
            color_palette: {
                primary: '#FFE4C4',
                secondary: '#B0C4DE',
                accent: '#FFB6C1',
            },
            skin_tone: 'fair',
        },
        light: {
            shirts: ['Coral', 'Turquoise', 'Lavender', 'Peach', 'Sky Blue'],
            pants: ['Olive Green', 'Camel', 'Dark Brown', 'Charcoal', 'Denim Blue'],
            colors_to_avoid: ['Pale Yellow', 'Muted Browns'],
            color_palette: {
                primary: '#F5DEB3',
                secondary: '#40E0D0',
                accent: '#FFB347',
            },
            skin_tone: 'light',
        },
        medium: {
            shirts: ['Emerald Green', 'Ruby Red', 'Royal Blue', 'Mustard Yellow', 'Teal'],
            pants: ['Black', 'Dark Denim', 'Burgundy', 'Forest Green', 'Chocolate Brown'],
            colors_to_avoid: ['Pale Pastels', 'Washed Out Colors'],
            color_palette: {
                primary: '#CD853F',
                secondary: '#2E8B57',
                accent: '#DC143C',
            },
            skin_tone: 'medium',
        },
        tan: {
            shirts: ['Rich Purple', 'Deep Orange', 'Cobalt Blue', 'Crimson', 'Bright Yellow'],
            pants: ['Black', 'Espresso Brown', 'Navy', 'Deep Gray', 'Dark Green'],
            colors_to_avoid: ['Brown', 'Tan', 'Dull Earth Tones'],
            color_palette: {
                primary: '#8B4513',
                secondary: '#4169E1',
                accent: '#FF4500',
            },
            skin_tone: 'tan',
        },
        dark: {
            shirts: ['Bright White', 'Hot Pink', 'Electric Blue', 'Sunshine Yellow', 'Lime Green'],
            pants: ['Black', 'White', 'Bright Red', 'Royal Purple', 'Deep Navy'],
            colors_to_avoid: ['Dark Brown', 'Olive', 'Muddy Colors'],
            color_palette: {
                primary: '#654321',
                secondary: '#00FFFF',
                accent: '#FFD700',
            },
            skin_tone: 'dark',
        },
    };

    return recommendations[skinTone.toLowerCase()] || recommendations.medium;
}
