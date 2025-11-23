import { useState, useEffect } from 'react';
import { useRestaurant } from '@/context/RestaurantContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ImageUpload } from '@/components/admin/ImageUpload';
import { useToast } from '@/hooks/use-toast';
import { Save, Sparkles, Star, Megaphone, Home, Loader2 } from 'lucide-react';

const HomeManagement = () => {
    const { homeContent, setHomeContent, heroTexts, setHeroText, heroImages, setHeroImage } = useRestaurant();
    const { toast } = useToast();

    // Hero section state
    const [heroTitle, setHeroTitle] = useState(heroTexts?.home?.title || 'Welcome to Osei Serwaa Kitchen');
    const [heroSubtitle, setHeroSubtitle] = useState(heroTexts?.home?.subtitle || '');
    const [heroTagline, setHeroTagline] = useState(heroTexts?.home?.tagline || '');
    const [heroImagesArray, setHeroImagesArray] = useState<string[]>(heroImages?.home || []);
    const [isSaving, setIsSaving] = useState(false);

    // Features state
    const [features, setFeatures] = useState(homeContent?.features || []);

    // CTA state
    const [ctaTitle, setCtaTitle] = useState(homeContent?.cta?.title || '');
    const [ctaDescription, setCtaDescription] = useState(homeContent?.cta?.description || '');

    // Sync from context when it changes
    useEffect(() => {
        if (homeContent) {
            setFeatures(homeContent.features || []);
            setCtaTitle(homeContent.cta?.title || '');
            setCtaDescription(homeContent.cta?.description || '');
        }
    }, [homeContent]);

    useEffect(() => {
        if (heroTexts?.home) {
            setHeroTitle(heroTexts.home.title || 'Welcome to Osei Serwaa Kitchen');
            setHeroSubtitle(heroTexts.home.subtitle || '');
            setHeroTagline(heroTexts.home.tagline || '');
        }
    }, [heroTexts]);

    useEffect(() => {
        if (heroImages?.home) {
            setHeroImagesArray(heroImages.home);
        }
    }, [heroImages]);

    // Handlers
    const handleSaveHero = async () => {
        setIsSaving(true);
        try {
            // Filter out empty strings before saving
            const cleanImages = heroImagesArray.filter(url => url && url.trim() !== '');
            setHeroImagesArray(cleanImages); // Update local state to reflect cleanup

            await Promise.all([
                setHeroText('home', { title: heroTitle, subtitle: heroSubtitle, tagline: heroTagline }),
                setHeroImage('home', cleanImages)
            ]);
            toast({ title: '✨ Success', description: 'Hero section updated successfully' });
        } catch (error) {
            console.error('Failed to save hero section:', error);
            toast({ title: 'Error', description: 'Failed to save changes', variant: 'destructive' });
        } finally {
            setIsSaving(false);
        }
    };

    const handleAddHeroImage = () => {
        setHeroImagesArray([...heroImagesArray, '']);
    };

    const handleHeroImageChange = (index: number, url: string) => {
        const newArr = [...heroImagesArray];
        newArr[index] = url;
        setHeroImagesArray(newArr);
    };

    const handleSaveFeatures = () => {
        setHomeContent({ ...homeContent, features });
        toast({ title: '✨ Success', description: 'Features updated successfully' });
    };

    const handleSaveCta = () => {
        setHomeContent({ ...homeContent, cta: { title: ctaTitle, description: ctaDescription } });
        toast({ title: '✨ Success', description: 'Call to Action updated successfully' });
    };

    const updateFeature = (index: number, field: 'title' | 'description', value: string) => {
        const newFeatures = [...features];
        newFeatures[index] = { ...newFeatures[index], [field]: value };
        setFeatures(newFeatures);
    };

    return (
        <div className="space-y-8 pb-8">
            {/* Header */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/10 via-accent/10 to-secondary/10 p-8 border border-border/50">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
                <div className="relative">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-3 bg-primary/10 rounded-xl">
                            <Home className="h-6 w-6 text-primary" />
                        </div>
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                            Home Page Management
                        </h1>
                    </div>
                    <p className="text-muted-foreground text-lg ml-[60px]">Manage all sections of the home page</p>
                </div>
            </div>

            <Tabs defaultValue="hero" className="w-full space-y-6">
                <TabsList className="grid w-full grid-cols-3 h-14 p-1 bg-muted/50 rounded-xl">
                    <TabsTrigger value="hero" className="h-12 rounded-lg data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-sm text-base font-medium transition-all">
                        <Sparkles className="h-4 w-4 mr-2" /> Hero Section
                    </TabsTrigger>
                    <TabsTrigger value="features" className="h-12 rounded-lg data-[state=active]:bg-background data-[state=active]:text-accent data-[state=active]:shadow-sm text-base font-medium transition-all">
                        <Star className="h-4 w-4 mr-2" /> Features
                    </TabsTrigger>
                    <TabsTrigger value="cta" className="h-12 rounded-lg data-[state=active]:bg-background data-[state=active]:text-secondary data-[state=active]:shadow-sm text-base font-medium transition-all">
                        <Megaphone className="h-4 w-4 mr-2" /> Call to Action
                    </TabsTrigger>
                </TabsList>

                {/* Hero Tab */}
                <TabsContent value="hero" className="mt-0">
                    <Card className="border-border/50 shadow-lg">
                        <CardHeader className="bg-gradient-to-br from-muted/30 to-background border-b border-border/50">
                            <CardTitle className="text-2xl">Hero Content</CardTitle>
                            <CardDescription className="text-base">Edit the main hero section of the home page</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6 pt-6">
                            <div className="space-y-3">
                                <Label className="text-base font-semibold">Title</Label>
                                <Input value={heroTitle} onChange={e => setHeroTitle(e.target.value)} className="h-12 text-base border-border/50 focus:border-primary/50" />
                            </div>
                            <div className="space-y-3">
                                <Label className="text-base font-semibold">Subtitle</Label>
                                <Textarea value={heroSubtitle} onChange={e => setHeroSubtitle(e.target.value)} rows={2} className="text-base border-border/50 focus:border-primary/50 resize-none" />
                            </div>
                            <div className="space-y-3">
                                <Label className="text-base font-semibold">Tagline</Label>
                                <Input value={heroTagline} onChange={e => setHeroTagline(e.target.value)} className="h-12 text-base border-border/50 focus:border-primary/50" />
                            </div>
                            {/* Hero Images */}
                            {heroImagesArray.map((url, idx) => (
                                <ImageUpload
                                    key={idx}
                                    label={`Hero Image ${idx + 1}`}
                                    value={url}
                                    onChange={newUrl => handleHeroImageChange(idx, newUrl)}
                                />
                            ))}
                            <Button onClick={handleAddHeroImage} variant="outline" className="w-full h-12 text-base font-semibold mt-2">
                                Add Image
                            </Button>
                            <Button
                                onClick={handleSaveHero}
                                disabled={isSaving}
                                className="w-full h-12 text-base font-semibold mt-2 shadow-md hover:shadow-lg transition-all"
                                variant="premium"
                            >
                                {isSaving ? (
                                    <>
                                        <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                                        Saving...
                                    </>
                                ) : (
                                    <>
                                        <Save className="h-5 w-5 mr-2" />
                                        Save Hero Section
                                    </>
                                )}
                            </Button>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Features Tab */}
                <TabsContent value="features" className="mt-0">
                    <Card className="border-border/50 shadow-lg">
                        <CardHeader className="bg-gradient-to-br from-muted/30 to-background border-b border-border/50">
                            <CardTitle className="text-2xl">Features</CardTitle>
                            <CardDescription className="text-base">Edit the 4 feature cards displayed on the home page</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6 pt-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {features.map((feature, index) => (
                                    <div key={index} className="p-6 border-2 border-border/50 rounded-xl space-y-4 bg-gradient-to-br from-muted/20 to-background hover:border-primary/30 transition-all shadow-sm hover:shadow-md">
                                        <div className="flex items-center gap-2 mb-2">
                                            <div className="h-8 w-8 rounded-lg bg-accent/10 flex items-center justify-center">
                                                <span className="text-sm font-bold text-accent">{index + 1}</span>
                                            </div>
                                            <h4 className="font-semibold text-lg">Feature {index + 1}</h4>
                                        </div>
                                        <div className="space-y-3">
                                            <Label className="text-sm font-semibold">Title</Label>
                                            <Input value={feature.title} onChange={e => updateFeature(index, 'title', e.target.value)} className="border-border/50 focus:border-primary/50" />
                                        </div>
                                        <div className="space-y-3">
                                            <Label className="text-sm font-semibold">Description</Label>
                                            <Textarea value={feature.description} onChange={e => updateFeature(index, 'description', e.target.value)} rows={3} className="border-border/50 focus:border-primary/50 resize-none" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <Button onClick={handleSaveFeatures} className="w-full h-12 text-base font-semibold shadow-md hover:shadow-lg transition-all" variant="premium">
                                <Save className="h-5 w-5 mr-2" />Save Features
                            </Button>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* CTA Tab */}
                <TabsContent value="cta" className="mt-0">
                    <Card className="border-border/50 shadow-lg">
                        <CardHeader className="bg-gradient-to-br from-muted/30 to-background border-b border-border/50">
                            <CardTitle className="text-2xl">Call to Action</CardTitle>
                            <CardDescription className="text-base">Edit the bottom call to action section</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6 pt-6">
                            <div className="space-y-3">
                                <Label className="text-base font-semibold">Title</Label>
                                <Input value={ctaTitle} onChange={e => setCtaTitle(e.target.value)} className="h-12 text-base border-border/50 focus:border-primary/50" />
                            </div>
                            <div className="space-y-3">
                                <Label className="text-base font-semibold">Description</Label>
                                <Textarea value={ctaDescription} onChange={e => setCtaDescription(e.target.value)} rows={3} className="text-base border-border/50 focus:border-primary/50 resize-none" />
                            </div>
                            <Button onClick={handleSaveCta} className="w-full h-12 text-base font-semibold shadow-md hover:shadow-lg transition-all" variant="premium">
                                <Save className="h-5 w-5 mr-2" />Save CTA Section
                            </Button>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default HomeManagement;
