'use client';

import Image from 'next/image';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { Card, CardContent, CardFooter, CardDescription, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { RecommendationResult, Outfit } from '@/lib/types';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { useSavedOutfits } from '@/context/saved-outfits-context';
import { Heart, ShoppingBag } from 'lucide-react';
import { useMemo } from 'react';

interface OutfitDisplayProps {
  results: RecommendationResult;
}

function OutfitCard({ outfit }: { outfit: Outfit }) {
  const { addOutfit, removeOutfit, isOutfitSaved } = useSavedOutfits();
  const saved = isOutfitSaved(outfit.id);

  const handleSaveToggle = () => {
    if (saved) {
      removeOutfit(outfit.id);
    } else {
      addOutfit(outfit);
    }
  };

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <Image
          src={outfit.imageUrl}
          alt={outfit.description}
          width={600}
          height={800}
          className="w-full h-auto object-cover aspect-[3/4]"
          data-ai-hint={outfit.imageHint}
        />
      </CardContent>
      <CardFooter className="flex-col items-start p-4 space-y-4">
        <p className="text-sm text-muted-foreground">{outfit.description}</p>
        <div className="flex w-full space-x-2">
          <Button variant={saved ? "secondary" : "default"} onClick={handleSaveToggle} className="w-full">
            <Heart className={`mr-2 h-4 w-4 ${saved ? 'fill-red-500 text-red-500' : ''}`} />
            {saved ? 'Saved' : 'Save'}
          </Button>
          <Button variant="outline" className="w-full" disabled>
            <ShoppingBag className="mr-2 h-4 w-4" />
            Shop this look
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}

export default function OutfitDisplay({ results }: OutfitDisplayProps) {

  const outfits: Outfit[] = useMemo(() => {
    return results.outfitRecommendations.map((rec, index) => {
      const placeholder = PlaceHolderImages[index % PlaceHolderImages.length];
      return {
        id: `rec-${Date.now()}-${index}`,
        description: rec,
        imageUrl: placeholder.imageUrl,
        imageHint: placeholder.imageHint,
      };
    });
  }, [results.outfitRecommendations]);

  return (
    <div className="w-full">
      <h2 className="font-headline text-3xl font-bold text-center mb-8">Your Personalized Recommendations</h2>
      <Tabs defaultValue="outfits" className="w-full">
        <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto">
          <TabsTrigger value="outfits">Outfits</TabsTrigger>
          <TabsTrigger value="style-guide">Style Guide</TabsTrigger>
        </TabsList>
        <TabsContent value="outfits" className="mt-6">
          <Carousel
            opts={{
              align: 'start',
              loop: true,
            }}
            className="w-full max-w-md mx-auto"
          >
            <CarouselContent>
              {outfits.map((outfit) => (
                <CarouselItem key={outfit.id}>
                  <OutfitCard outfit={outfit} />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </TabsContent>
        <TabsContent value="style-guide" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="font-headline text-2xl">Your Style Guide</CardTitle>
              <CardDescription>Why these recommendations work for you.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="prose prose-sm max-w-none text-muted-foreground">
                {results.styleGuide.split('\n').map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Dummy CardHeader to fix build error
const CardHeader = (props: React.HTMLAttributes<HTMLDivElement>) => <div {...props} />;
