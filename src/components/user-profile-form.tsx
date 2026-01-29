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
import { Label } from '@/components/ui/label';
import { PersonStanding, Palette, Sparkles, Sun, PartyPopper, Users2 } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

const formSchema = z.object({
  gender: z.string({
    required_error: 'Please select your gender.',
  }),
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

const genders = [
  { id: 'female', label: 'Female' },
  { id: 'male', label: 'Male' },
];

const bodyTypes = [
  { id: 'apple', label: 'Apple' },
  { id: 'pear', label: 'Pear' },
  { id: 'hourglass', label: 'Hourglass' },
  { id: 'rectangle', label: 'Rectangle' },
  { id: 'inverted-triangle', label: 'Inverted Triangle' },
];

const skinTones = [
  { id: 'fair', label: 'Fair', color: '#FEE3D4' },
  { id: 'light', label: 'Light', color: '#F2CCB7' },
  { id: 'medium', label: 'Medium', color: '#E5B5A1' },
  { id: 'tan', label: 'Tan', color: '#DFAA8B' },
  { id: 'dark', label: 'Dark', color: '#D19477' },
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
          name="gender"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel className="text-lg font-semibold flex items-center"><Users2 className="mr-2 h-5 w-5 text-primary" /> Gender</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="grid grid-cols-2 sm:grid-cols-3 gap-4"
                >
                  {genders.map((gender) => (
                    <div key={gender.id}>
                      <RadioGroupItem value={gender.id} id={`gender-${gender.id}`} className="peer sr-only" />
                      <Label
                        htmlFor={`gender-${gender.id}`}
                        className="cursor-pointer flex flex-col items-center justify-center rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary"
                      >
                        {gender.label}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
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
                  className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4"
                >
                  {bodyTypes.map((type) => (
                    <div key={type.id}>
                      <RadioGroupItem value={type.id} id={`bodyType-${type.id}`} className="peer sr-only" />
                      <Label
                        htmlFor={`bodyType-${type.id}`}
                        className="cursor-pointer flex flex-col items-center justify-center rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary"
                      >
                        {type.label}
                      </Label>
                    </div>
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
                  className="grid grid-cols-3 md:grid-cols-5 gap-2"
                >
                  {skinTones.map((tone) => (
                     <div key={tone.id}>
                      <RadioGroupItem value={tone.id} id={`skinTone-${tone.id}`} className="peer sr-only" />
                      <Label
                        htmlFor={`skinTone-${tone.id}`}
                        className="cursor-pointer flex h-full flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-2 text-center hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary"
                      >
                        <div className="mb-2 h-10 w-10 rounded-full border" style={{ backgroundColor: tone.color }}></div>
                        <span className="text-sm">{tone.label}</span>
                      </Label>
                    </div>
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
