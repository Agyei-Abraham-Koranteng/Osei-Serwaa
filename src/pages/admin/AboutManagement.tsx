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
import { Save, Plus, Trash2, Sparkles, BookOpen, Award, Users as UsersIcon, Loader2 } from 'lucide-react';

const AboutManagement = () => {
    const { aboutContent, setAboutContent, heroTexts, setHeroText, heroImages, setHeroImage } = useRestaurant();
    const { toast } = useToast();

    // Hero section state
    const [heroTitle, setHeroTitle] = useState(heroTexts?.about?.title || 'About Us');
    const [heroSubtitle, setHeroSubtitle] = useState(heroTexts?.about?.subtitle || '');
    const [heroTagline, setHeroTagline] = useState(heroTexts?.about?.tagline || '');
    const [heroImagesArray, setHeroImagesArray] = useState<string[]>(heroImages?.about || []);
    const [isSaving, setIsSaving] = useState(false);

    // Story state
    const [story, setStory] = useState(aboutContent?.story || { paragraph1: '', paragraph2: '', paragraph3: '', images: [] });

    // Values state
    const [values, setValues] = useState(aboutContent?.values || []);

    // Team state
    const [team, setTeam] = useState(aboutContent?.team || []);

    // Sync content from context
    useEffect(() => {
        if (aboutContent) {
            setStory(aboutContent.story || { paragraph1: '', paragraph2: '', paragraph3: '', images: [] });
            setValues(aboutContent.values || []);
            setTeam(aboutContent.team || []);
        }
    }, [aboutContent]);

    // Sync hero texts
    useEffect(() => {
        if (heroTexts?.about) {
            setHeroTitle(heroTexts.about.title || 'About Us');
            setHeroSubtitle(heroTexts.about.subtitle || '');
            setHeroTagline(heroTexts.about.tagline || '');
        }
    }, [heroTexts]);

    // Sync hero images array
    useEffect(() => {
        if (heroImages?.about) {
            setHeroImagesArray(heroImages.about);
        }
    }, [heroImages]);

    // Handlers for hero section
    const handleSaveHero = async () => {
        setIsSaving(true);
        try {
            // Filter out empty strings before saving
            const cleanImages = heroImagesArray.filter(url => url && url.trim() !== '');
            setHeroImagesArray(cleanImages); // Update local state to reflect cleanup

            await Promise.all([
                setHeroText('about', { title: heroTitle, subtitle: heroSubtitle, tagline: heroTagline }),
                setHeroImage('about', cleanImages)
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

    // Handlers for story
    const handleSaveStory = () => {
        setAboutContent({ ...aboutContent, story });
        toast({ title: '✨ Success', description: 'Story section updated successfully' });
    };

    // Handlers for values
    const addValue = () => setValues([...values, { title: '', description: '' }]);
    const removeValue = (index: number) => setValues(values.filter((_, i) => i !== index));
    const updateValue = (index: number, field: 'title' | 'description', value: string) => {
        const newValues = [...values];
        newValues[index] = { ...newValues[index], [field]: value };
        setValues(newValues);
    };
    const handleSaveValues = () => {
        setAboutContent({ ...aboutContent, values });
        toast({ title: '✨ Success', description: 'Values updated successfully' });
    };

    // Handlers for team
    const addTeamMember = () => setTeam([...team, { name: '', role: '', description: '', image: '' }]);
    const removeTeamMember = (index: number) => setTeam(team.filter((_, i) => i !== index));
    const updateTeamMember = (index: number, field: 'name' | 'role' | 'description' | 'image', value: string) => {
        const newTeam = [...team];
        newTeam[index] = { ...newTeam[index], [field]: value };
        setTeam(newTeam);
    };
    const handleSaveTeam = () => {
        setAboutContent({ ...aboutContent, team });
        toast({ title: '✨ Success', description: 'Team updated successfully' });
    };

    return (
        <div className="space-y-8 pb-8">
            {/* Header */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/10 via-accent/10 to-secondary/10 p-8 border border-border/50">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
                <div className="relative">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-3 bg-primary/10 rounded-xl">
                            <BookOpen className="h-6 w-6 text-primary" />
                        </div>
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                            About Page Management
                        </h1>
                    </div>
                    <p className="text-muted-foreground text-lg ml-[60px]">Manage all sections of the about page</p>
                </div>
            </div>

            <Tabs defaultValue="hero" className="w-full space-y-6">
                <TabsList className="grid w-full grid-cols-4 h-14 p-1 bg-muted/50 rounded-xl">
                    <TabsTrigger value="hero" className="h-12 rounded-lg data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-sm text-base font-medium transition-all">
                        <Sparkles className="h-4 w-4 mr-2" /> Hero Section
                    </TabsTrigger>
                    <TabsTrigger value="story" className="h-12 rounded-lg data-[state=active]:bg-background data-[state=active]:text-accent data-[state=active]:shadow-sm text-base font-medium transition-all">
                        <BookOpen className="h-4 w-4 mr-2" /> Our Story
                    </TabsTrigger>
                    <TabsTrigger value="values" className="h-12 rounded-lg data-[state=active]:bg-background data-[state=active]:text-secondary data-[state=active]:shadow-sm text-base font-medium transition-all">
                        <Award className="h-4 w-4 mr-2" /> Values
                    </TabsTrigger>
                    <TabsTrigger value="team" className="h-12 rounded-lg data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-sm text-base font-medium transition-all">
                        <UsersIcon className="h-4 w-4 mr-2" /> Team
                    </TabsTrigger>
                </TabsList>

                {/* Hero Tab */}
                <TabsContent value="hero" className="mt-0">
                    <Card className="border-border/50 shadow-lg">
                        <CardHeader className="bg-gradient-to-br from-muted/30 to-background border-b border-border/50">
                            <CardTitle className="text-2xl">Hero Content</CardTitle>
                            <CardDescription className="text-base">Edit the hero section of the about page</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6 pt-6">
                            <div className="space-y-3">
                                <Label className="text-base font-semibold">Title</Label>
                                <Input value={heroTitle} onChange={e => setHeroTitle(e.target.value)} placeholder="About Us" className="h-12 text-base border-border/50 focus:border-primary/50" />
                            </div>
                            <div className="space-y-3">
                                <Label className="text-base font-semibold">Subtitle</Label>
                                <Textarea value={heroSubtitle} onChange={e => setHeroSubtitle(e.target.value)} rows={2} className="text-base border-border/50 focus:border-primary/50 resize-none" />
                            </div>
                            <div className="space-y-3">
                                <Label className="text-base font-semibold">Tagline</Label>
                                <Input value={heroTagline} onChange={e => setHeroTagline(e.target.value)} placeholder="Tagline" className="h-12 text-base border-border/50 focus:border-primary/50" />
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

                {/* Story Tab */}
                <TabsContent value="story" className="mt-0">
                    <Card className="border-border/50 shadow-lg">
                        <CardHeader className="bg-gradient-to-br from-muted/30 to-background border-b border-border/50">
                            <CardTitle className="text-2xl">Our Story</CardTitle>
                            <CardDescription className="text-base">Edit the three story paragraphs and images</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6 pt-6">
                            {[1, 2, 3].map(num => (
                                <div key={num} className="space-y-3">
                                    <Label className="text-base font-semibold">Paragraph {num}</Label>
                                    <Textarea
                                        value={story[`paragraph${num}` as keyof typeof story] as string}
                                        onChange={e => setStory({ ...story, [`paragraph${num}`]: e.target.value })}
                                        rows={3}
                                        className="text-base border-border/50 focus:border-primary/50 resize-none"
                                    />
                                </div>
                            ))}
                            <div className="space-y-4 pt-4 border-t border-border/50">
                                <Label className="text-lg font-semibold">Story Images</Label>
                                <div className="grid grid-cols-2 gap-4">
                                    {(story.images || []).map((img, index) => (
                                        <ImageUpload
                                            key={index}
                                            label={`Image ${index + 1}`}
                                            value={img}
                                            onChange={url => {
                                                const newImages = [...(story.images || [])];
                                                newImages[index] = url;
                                                setStory({ ...story, images: newImages });
                                            }}
                                        />
                                    ))}
                                </div>
                                <Button onClick={() => setStory({ ...story, images: [...(story.images || []), ''] })} variant="outline" className="w-full h-12 text-base font-semibold">
                                    <Plus className="h-5 w-5 mr-2" />Add Image
                                </Button>
                            </div>
                            <Button onClick={handleSaveStory} className="w-full h-12 text-base font-semibold shadow-md hover:shadow-lg transition-all" variant="premium">
                                <Save className="h-5 w-5 mr-2" />Save Story
                            </Button>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Values Tab */}
                <TabsContent value="values" className="mt-0">
                    <Card className="border-border/50 shadow-lg">
                        <CardHeader className="bg-gradient-to-br from-muted/30 to-background border-b border-border/50">
                            <CardTitle className="text-2xl">Our Values</CardTitle>
                            <CardDescription className="text-base">Manage the values displayed on the about page</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6 pt-6">
                            {values.map((value, index) => (
                                <div key={index} className="p-6 border-2 border-border/50 rounded-xl space-y-4 bg-gradient-to-br from-muted/20 to-background hover:border-primary/30 transition-all shadow-sm hover:shadow-md">
                                    <div className="flex justify-between items-center">
                                        <div className="flex items-center gap-2">
                                            <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                                                <span className="text-sm font-bold text-primary">{index + 1}</span>
                                            </div>
                                            <h4 className="font-semibold text-lg">Value {index + 1}</h4>
                                        </div>
                                        <Button variant="destructive" size="sm" onClick={() => removeValue(index)}>
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                    <div className="space-y-3">
                                        <Label className="text-sm font-semibold">Title</Label>
                                        <Input value={value.title} onChange={e => updateValue(index, 'title', e.target.value)} className="border-border/50 focus:border-primary/50" />
                                    </div>
                                    <div className="space-y-3">
                                        <Label className="text-sm font-semibold">Description</Label>
                                        <Textarea value={value.description} onChange={e => updateValue(index, 'description', e.target.value)} rows={2} className="border-border/50 focus:border-primary/50 resize-none" />
                                    </div>
                                </div>
                            ))}
                            <Button onClick={addValue} variant="outline" className="w-full h-12 text-base">
                                <Plus className="h-5 w-5 mr-2" />Add Value
                            </Button>
                            <Button onClick={handleSaveValues} className="w-full h-12 text-base font-semibold shadow-md hover:shadow-lg transition-all" variant="premium">
                                <Save className="h-5 w-5 mr-2" />Save Values
                            </Button>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Team Tab */}
                <TabsContent value="team" className="mt-0">
                    <Card className="border-border/50 shadow-lg">
                        <CardHeader className="bg-gradient-to-br from-muted/30 to-background border-b border-border/50">
                            <CardTitle className="text-2xl">Our Team</CardTitle>
                            <CardDescription className="text-base">Manage team members displayed on the about page</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6 pt-6">
                            {team.map((member, index) => (
                                <div key={index} className="p-6 border-2 border-border/50 rounded-xl space-y-4 bg-gradient-to-br from-muted/20 to-background hover:border-primary/30 transition-all shadow-sm hover:shadow-md">
                                    <div className="flex justify-between items-center">
                                        <div className="flex items-center gap-2">
                                            <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                                                <span className="text-sm font-bold text-primary">{index + 1}</span>
                                            </div>
                                            <h4 className="font-semibold text-lg">Team Member {index + 1}</h4>
                                        </div>
                                        <Button variant="destructive" size="sm" onClick={() => removeTeamMember(index)}>
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-3">
                                            <Label className="text-sm font-semibold">Name</Label>
                                            <Input value={member.name} onChange={e => updateTeamMember(index, 'name', e.target.value)} className="border-border/50 focus:border-primary/50" />
                                        </div>
                                        <div className="space-y-3">
                                            <Label className="text-sm font-semibold">Role</Label>
                                            <Input value={member.role} onChange={e => updateTeamMember(index, 'role', e.target.value)} className="border-border/50 focus:border-primary/50" />
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        <Label className="text-sm font-semibold">Description</Label>
                                        <Textarea value={member.description} onChange={e => updateTeamMember(index, 'description', e.target.value)} rows={2} className="border-border/50 focus:border-primary/50 resize-none" />
                                    </div>
                                    <ImageUpload label="Profile Image" value={member.image} onChange={url => updateTeamMember(index, 'image', url)} />
                                </div>
                            ))}
                            <Button onClick={addTeamMember} variant="outline" className="w-full h-12 text-base">
                                <Plus className="h-5 w-5 mr-2" />Add Team Member
                            </Button>
                            <Button onClick={handleSaveTeam} className="w-full h-12 text-base font-semibold shadow-md hover:shadow-lg transition-all" variant="premium">
                                <Save className="h-5 w-5 mr-2" />Save Team
                            </Button>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default AboutManagement;
