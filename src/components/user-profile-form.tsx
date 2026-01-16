'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { PersonStanding, Palette, Sparkles, Sun, Cloud, Building2, PartyPopper } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

const formSchema = z.object({
  bodyType: z.string({
    required_error: 'Please select your body type.',
  }),
  skinTone: z.string({
    required_error: 'Please select your skin tone.',
  }),
  preferredStyles: z.array(z.string()).refine((value) => value.some((item) => item), {
    message: 'You have to select at least one style.',
  }),
  occasion: z.string().optional(),
  weather: z.string().optional(),
});

export type UserProfileFormData = z.infer<typeof formSchema>;

const bodyTypes = [
  { id: 'apple', label: 'Apple' },
  { id: 'pear', label: 'Pear' },
  { id: 'hourglass', label: 'Hourglass' },
  { id: 'rectangle', label: 'Rectangle' },
  { id: 'inverted-triangle', label: 'Inverted Triangle' },
];

const skinTones = [
  { id: 'fair', label: 'Fair' },
  { id: 'light', label: 'Light' },
  { id: 'medium', label: 'Medium' },
  { id: 'tan', label: 'Tan' },
  { id: 'dark', label: 'Dark' },
];

const styles = [
  { id: 'casual', label: 'Casual' },
  { id: 'formal', label: 'Formal' },
  { id: 'bohemian', label: 'Bohemian' },
  { id: 'streetwear', label: 'Streetwear' },
  { id: 'vintage', label: 'Vintage' },
  { id: 'minimalist', label: 'Minimalist' },
];

interface UserProfileFormProps {
  onSubmit: (data: UserProfileFormData) => void;
  isLoading: boolean;
}

export function UserProfileForm({ onSubmit, isLoading }: UserProfileFormProps) {
  const form = useForm<UserProfileFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      preferredStyles: ['casual'],
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="space-y-4">
          <h2 className="font-headline text-2xl font-bold">Tell Us About You</h2>
          <p className="text-muted-foreground">This helps us personalize your recommendations.</p>
        </div>
        <Separator />
        <FormField
          control={form.control}
          name="bodyType"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel className="text-lg font-semibold flex items-center"><PersonStanding className="mr-2 h-5 w-5 text-primary" /> Body Type</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="grid grid-cols-2 sm:grid-cols-3 gap-4"
                >
                  {bodyTypes.map((type) => (
                    <FormItem key={type.id}>
                      <FormControl>
                        <RadioGroupItem value={type.id} id={`bodyType-${type.id}`} className="sr-only" />
                      </FormControl>
                      <Label htmlFor={`bodyType-${type.id}`} className="flex flex-col items-center justify-center rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary">
                        {type.label}
                      </Label>
                    </FormItem>
                  ))}
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="skinTone"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel className="text-lg font-semibold flex items-center"><Palette className="mr-2 h-5 w-5 text-primary" /> Skin Tone</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="grid grid-cols-2 sm:grid-cols-3 gap-4"
                >
                  {skinTones.map((tone) => (
                    <FormItem key={tone.id}>
                       <FormControl>
                        <RadioGroupItem value={tone.id} id={`skinTone-${tone.id}`} className="sr-only" />
                      </FormControl>
                      <Label htmlFor={`skinTone-${tone.id}`} className="flex flex-col items-center justify-center rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary">
                        {tone.label}
                      </Label>
                    </FormItem>
                  ))}
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="preferredStyles"
          render={() => (
            <FormItem>
              <div className="mb-4">
                <FormLabel className="text-lg font-semibold flex items-center"><Sparkles className="mr-2 h-5 w-5 text-primary" /> Preferred Styles</FormLabel>
                <FormDescription>
                  Select one or more styles that you like.
                </FormDescription>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {styles.map((item) => (
                  <FormField
                    key={item.id}
                    control={form.control}
                    name="preferredStyles"
                    render={({ field }) => {
                      return (
                        <FormItem
                          key={item.id}
                          className="flex flex-row items-start space-x-3 space-y-0"
                        >
                          <FormControl>
                            <Checkbox
                              checked={field.value?.includes(item.id)}
                              onCheckedChange={(checked) => {
                                return checked
                                  ? field.onChange([...(field.value || []), item.id])
                                  : field.onChange(
                                      field.value?.filter(
                                        (value) => value !== item.id
                                      )
                                    );
                              }}
                            />
                          </FormControl>
                          <FormLabel className="font-normal">
                            {item.label}
                          </FormLabel>
                        </FormItem>
                      );
                    }}
                  />
                ))}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <Separator />
         <div className="space-y-4">
          <h3 className="font-headline text-xl font-bold">Optional Details</h3>
          <p className="text-muted-foreground">Provide more context for even better recommendations.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           <FormField
              control={form.control}
              name="occasion"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center"><PartyPopper className="mr-2 h-5 w-5 text-primary" /> Occasion</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Work, Party, Everyday" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="weather"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center"><Sun className="mr-2 h-5 w-5 text-primary" /> Weather</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Sunny, Rainy, Cold" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
        </div>

        <Button type="submit" disabled={isLoading} className="w-full" size="lg">
          {isLoading ? 'Generating...' : 'Generate My Outfits'}
        </Button>
      </form>
    </Form>
  );
}
