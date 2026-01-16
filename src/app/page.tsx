'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { UserProfileForm, type UserProfileFormData } from '@/components/user-profile-form';
import { getOutfitRecommendations } from '@/app/actions';
import type { GenerateOutfitRecommendationsOutput } from '@/ai/flows/generate-outfit-recommendations';
import OutfitDisplay from '@/components/outfit-display';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Terminal } from 'lucide-react';
import { AnimatedClothes } from '@/components/animated-clothes';

export default function Home() {
  const [showForm, setShowForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<GenerateOutfitRecommendationsOutput | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFormSubmit = async (data: UserProfileFormData) => {
    setIsLoading(true);
    setResults(null);
    setError(null);
    setShowForm(false); // Hide form and show loading/results
    window.scrollTo({ top: 0, behavior: 'smooth' });

    try {
      const result = await getOutfitRecommendations(data);
      if (!result.outfitRecommendations || result.outfitRecommendations.length === 0) {
        setError('Could not generate any outfit recommendations. Please try again with different preferences.');
      } else {
        setResults(result);
      }
    } catch (e) {
      console.error(e);
      setError('An unexpected error occurred. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const resetState = () => {
    setShowForm(false);
    setIsLoading(false);
    setResults(null);
    setError(null);
  }

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <div className="mx-auto max-w-3xl text-center">
        {(!showForm && !results && !isLoading) && (
          <>
            <AnimatedClothes />
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <h1 className="font-headline text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
                Discover Your Perfect Style
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-gray-600">
                Answer a few questions about your features and preferences, and let our AI stylist create personalized outfits just for you.
              </p>
              <Button size="lg" className="mt-10" onClick={() => setShowForm(true)}>
                Get Started
              </Button>
            </div>
          </>
        )}
      </div>

      {(showForm && !results) && (
        <Card className="mx-auto max-w-3xl">
          <CardContent className="p-6">
            <UserProfileForm onSubmit={handleFormSubmit} isLoading={isLoading} />
          </CardContent>
        </Card>
      )}

      {isLoading && (
        <div className="space-y-8">
          <Skeleton className="h-10 w-1/3 mx-auto" />
          <div className="flex justify-center">
            <Skeleton className="h-[500px] w-full max-w-4xl" />
          </div>
          <Skeleton className="h-20 w-full" />
        </div>
      )}

      {error && (
        <Alert variant="destructive" className="mx-auto max-w-3xl">
          <Terminal className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
          <Button variant="link" onClick={resetState} className="p-0 h-auto mt-2">Start Over</Button>
        </Alert>
      )}

      {results && (
        <div>
          <OutfitDisplay results={results} />
           <div className="text-center mt-8">
            <Button variant="outline" onClick={resetState}>
              Start Over
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
