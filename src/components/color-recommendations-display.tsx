'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Palette, CheckCircle2, XCircle } from 'lucide-react';
import { getColorRecommendations, ColorRecommendations, checkServiceHealth } from '@/lib/color-api';

interface ColorRecommendationsDisplayProps {
    skinTone: string;
    className?: string;
}

export function ColorRecommendationsDisplay({
    skinTone,
    className
}: ColorRecommendationsDisplayProps) {
    const [recommendations, setRecommendations] = useState<ColorRecommendations | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [serviceAvailable, setServiceAvailable] = useState(false);

    useEffect(() => {
        async function fetchRecommendations() {
            setIsLoading(true);

            // Check if service is available
            const isHealthy = await checkServiceHealth();
            setServiceAvailable(isHealthy);

            // Get recommendations
            const recs = await getColorRecommendations({ skinTone });
            setRecommendations(recs);
            setIsLoading(false);
        }

        if (skinTone) {
            fetchRecommendations();
        }
    }, [skinTone]);

    if (isLoading) {
        return (
            <Card className={className}>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Palette className="h-5 w-5" />
                        Loading Color Analysis...
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="animate-pulse space-y-3">
                        <div className="h-4 bg-muted rounded w-3/4"></div>
                        <div className="h-4 bg-muted rounded w-1/2"></div>
                        <div className="h-4 bg-muted rounded w-2/3"></div>
                    </div>
                </CardContent>
            </Card>
        );
    }

    if (!recommendations) {
        return null;
    }

    return (
        <Card className={className}>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Palette className="h-5 w-5 text-primary" />
                    Personalized Color Palette
                </CardTitle>
                <CardDescription>
                    {serviceAvailable ? (
                        <span className="flex items-center gap-1 text-green-600">
                            <CheckCircle2 className="h-4 w-4" />
                            Data-driven recommendations from KNN analysis
                        </span>
                    ) : (
                        <span className="flex items-center gap-1 text-amber-600">
                            <CheckCircle2 className="h-4 w-4" />
                            Color theory based recommendations
                        </span>
                    )}
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                {/* Color Palette Visualization */}
                <div className="space-y-2">
                    <h4 className="text-sm font-semibold">Your Color Palette</h4>
                    <div className="grid grid-cols-3 gap-3">
                        <div className="space-y-1">
                            <div
                                className="h-16 rounded-lg shadow-inner border-2 border-border"
                                style={{ backgroundColor: recommendations.color_palette.primary }}
                            />
                            <p className="text-xs text-center text-muted-foreground">Primary</p>
                        </div>
                        <div className="space-y-1">
                            <div
                                className="h-16 rounded-lg shadow-inner border-2 border-border"
                                style={{ backgroundColor: recommendations.color_palette.secondary }}
                            />
                            <p className="text-xs text-center text-muted-foreground">Secondary</p>
                        </div>
                        <div className="space-y-1">
                            <div
                                className="h-16 rounded-lg shadow-inner border-2 border-border"
                                style={{ backgroundColor: recommendations.color_palette.accent }}
                            />
                            <p className="text-xs text-center text-muted-foreground">Accent</p>
                        </div>
                    </div>
                </div>

                {/* Shirt Colors */}
                <div className="space-y-2">
                    <h4 className="text-sm font-semibold flex items-center gap-2">
                        👕 Recommended Shirt Colors
                    </h4>
                    <div className="flex flex-wrap gap-2">
                        {recommendations.shirts.map((color, index) => (
                            <Badge
                                key={index}
                                variant="secondary"
                                className="px-3 py-1"
                            >
                                {color}
                            </Badge>
                        ))}
                    </div>
                </div>

                {/* Pants Colors */}
                <div className="space-y-2">
                    <h4 className="text-sm font-semibold flex items-center gap-2">
                        👖 Recommended Pants Colors
                    </h4>
                    <div className="flex flex-wrap gap-2">
                        {recommendations.pants.map((color, index) => (
                            <Badge
                                key={index}
                                variant="secondary"
                                className="px-3 py-1"
                            >
                                {color}
                            </Badge>
                        ))}
                    </div>
                </div>

                {/* Colors to Avoid */}
                {recommendations.colors_to_avoid.length > 0 && (
                    <div className="space-y-2">
                        <h4 className="text-sm font-semibold flex items-center gap-2">
                            <XCircle className="h-4 w-4 text-destructive" />
                            Colors to Avoid
                        </h4>
                        <div className="flex flex-wrap gap-2">
                            {recommendations.colors_to_avoid.map((color, index) => (
                                <Badge
                                    key={index}
                                    variant="outline"
                                    className="px-3 py-1 border-destructive/50 text-destructive"
                                >
                                    {color}
                                </Badge>
                            ))}
                        </div>
                    </div>
                )}

                {/* Info Footer */}
                <div className="pt-4 border-t">
                    <p className="text-xs text-muted-foreground">
                        {serviceAvailable ? (
                            <>
                                These recommendations are generated using a K-Nearest Neighbors algorithm
                                trained on real fashion data from the Kaggle dataset, specifically curated
                                for Asian skin tones.
                            </>
                        ) : (
                            <>
                                These recommendations are based on professional color theory principles
                                and fashion styling best practices.
                            </>
                        )}
                    </p>
                </div>
            </CardContent>
        </Card>
    );
}
